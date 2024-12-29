import { auth } from "@/auth";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

async function checkAdminOrStaff() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectToDatabase(mongoose);
  const { userTable } = dbmodels(mongoose);

  const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();
  if (!userDetails) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!["admin","staff"].includes(userDetails.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return { user: userDetails };
}

export async function PUT(req) {
  let session;
  try {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase(mongoose);
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;
    const { orderTable, ordersTransectionTable } = dbmodels(mongoose);

    // Get request body
    const body = await req.json();
    console.log("body", body);
    const { orderId, paymentStatus, statusForUser } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Validate status values if provided
    const validPaymentStatuses = ['pending', 'completed', 'failed'];
    const validOrderStatuses = ['failed', 'placed', 'ready-for-pickup', 'collected', 'shipped'];

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment status" },
        { status: 400 }
      );
    }

    if (statusForUser && !validOrderStatuses.includes(statusForUser)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    // Start a transaction
    const mongoose_session = await mongoose.startSession();
    mongoose_session.startTransaction();

    try {
      // Fetch the current order
      const currentOrder = await orderTable.findById(orderId).session(mongoose_session);

      if (!currentOrder) {
        await mongoose_session.abortTransaction();
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }

      // Create transaction record
      const transactionRecord = new ordersTransectionTable({
        doneBy: session.user.id,
        previousOrderStatus: currentOrder.statusForUser,
        updatedOrderStatus: statusForUser || currentOrder.statusForUser,
        orderRef: orderId,
        previousPaymentStatus: currentOrder.paymentStatus,
        updatedPaymentStatus: paymentStatus || currentOrder.paymentStatus
      });

      await transactionRecord.save({ mongoose_session });

      // Build update object based on provided fields
      const updateFields = {};
      if (paymentStatus) updateFields.paymentStatus = paymentStatus;
      if (statusForUser) updateFields.statusForUser = statusForUser;

      // Update order
      const updatedOrder = await orderTable.findByIdAndUpdate(
        orderId,
        { $set: updateFields },
        { new: true, mongoose_session }
      );

      // Commit the transaction
      await mongoose_session.commitTransaction();

      return NextResponse.json({
        success: true,
        message: "Order status updated successfully",
        order: updatedOrder,
      });

    } catch (error) {
      // If an error occurred, abort the transaction
      await mongoose_session.abortTransaction();
      throw error;
    } finally {
      // End the session
      mongoose_session.endSession();
    }

  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error updating order status",
      },
      { status: 500 }
    );
  }
}

