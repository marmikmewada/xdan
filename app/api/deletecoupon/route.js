import { auth } from "@/auth"; // Assuming you have your auth middleware set up
// import { connectToDatabase, discountCouponTable, userTable } from "@/db"; // MongoDB models
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
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

  if (!["admin"].includes(userDetails.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return { user: userDetails };
}
export async function DELETE(req) {
  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable, discountCouponTable} = dbmodels(mongoose);
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;
    
    // Authenticate the user
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Get user details from the database
    const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();
    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Check if the user is an admin
    if (userDetails.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Permission denied. Only admins can delete coupons.",
        },
        { status: 403 }
      );
    }

    // Parse the request body to get the couponCode
    const { couponCode } = await req.json();

    // Validate the input
    if (!couponCode) {
      return NextResponse.json(
        {
          success: false,
          message: "couponCode is required.",
        },
        { status: 400 }
      );
    }

    // Check if the coupon exists
    const existingCoupon = await discountCouponTable.findOne({ couponCode }).exec();
    if (!existingCoupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon not found.",
        },
        { status: 404 }
      );
    }

    // Delete the coupon from the database
    await discountCouponTable.deleteOne({ couponCode });

    return NextResponse.json(
      {
        success: true,
        message: "Coupon deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while deleting coupon.",
      },
      { status: 500 }
    );
  }
}
