import { auth } from "@/auth"; // assuming auth function to get user session
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db"; // assuming the connectToDatabase and dbmodels are set up
import mongoose from "mongoose";

export async function GET(req) {
  try {
    // Authenticate and get the user session
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase(mongoose);

    // Destructure the necessary models
    const { userTable, orderTable } = dbmodels(mongoose);

    // Fetch user details based on session user ID
    const userDetails = await userTable.findOne({ _id: session.user.id }).exec();

    if (!userDetails) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Fetch the user's orders from the orders table
    const orders = await orderTable.find({ userRef: session.user.id })
      .populate('productRef') // Populate product details
      .populate('packageRef') // Populate package details
      .sort({ createdAt: -1 })
      .populate('usedCouponCode') // Populate coupon details
      .exec();

    // Return both user details and orders (empty array if no orders)
    return NextResponse.json({
      success: true,
      userDetails,
      orders: orders || [], // Return orders (empty array if no orders)
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details or orders:", error); // Log error for debugging
    return NextResponse.json({ success: false, message: error.message || "Error fetching data" }, { status: 500 });
  }
}
