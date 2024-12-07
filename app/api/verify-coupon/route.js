import { auth } from "@/auth"; // Import your auth middleware
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db"; // Your db connection & models
import mongoose from "mongoose";

export async function POST(req) {
  try {
    // Get request data
    const { couponCode } = await req.json();

    // Connect to the database
    await connectToDatabase(mongoose);

    const { userTable, discountCouponTable } = dbmodels(mongoose);

    // Authenticate user session
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user details
    const userDetails = await userTable.findById(session.user.id).exec();
    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Validate the coupon if provided
    if (!couponCode) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    const validCoupon = await discountCouponTable.findOne({ couponCode }).exec();
    if (!validCoupon) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon code" },
        { status: 400 }
      );
    }

    // Check if coupon is expired
    if (validCoupon.expiry < new Date()) {
      return NextResponse.json(
        { success: false, message: "Coupon has expired" },
        { status: 400 }
      );
    }

    // Check if coupon usage limit is reached
    if (validCoupon.usage >= validCoupon.maxUsage) {
      return NextResponse.json(
        { success: false, message: "Coupon usage limit exceeded" },
        { status: 400 }
      );
    }

    // Check if user has already used the coupon
    const isCouponUsed = userDetails.couponUsage.includes(validCoupon._id);
    if (isCouponUsed) {
      return NextResponse.json(
        { success: false, message: "Coupon already used by this user" },
        { status: 400 }
      );
    }

    // Return discount percentage for valid coupon
    return NextResponse.json(
      {
        success: true,
        message: "Coupon is valid",
        discountPercentage: validCoupon.percentage,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error verifying coupon:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
