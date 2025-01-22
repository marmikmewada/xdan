import { auth } from "@/auth"; // Assuming you have your auth middleware set up
// import { connectToDatabase, discountCouponTable, userTable } from "@/db"; // MongoDB models
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import { useEffect } from "react";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';

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
export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable,discountCouponTable} = dbmodels(mongoose);
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
          message: "Permission denied. Only admins can create coupons.",
        },
        { status: 403 }
      );
    }

    // Parse the request body
    const { couponCode, percentage, maxUsage, expiry } = await req.json();

    // Validate the input
    if (!couponCode || !percentage || !maxUsage || !expiry) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (couponCode, percentage, maxUsage, expiry) are required.",
        },
        { status: 400 }
      );
    }

    // Check if the coupon code already exists
    const existingCoupon = await discountCouponTable.findOne({ couponCode }).exec();
    if (existingCoupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code already exists.",
        },
        { status: 409 }
      );
    }

    // Create a new coupon document
    const newCoupon = new discountCouponTable({
      couponCode,
      percentage,
      maxUsage,
      expiry: new Date(expiry), // Ensure expiry is stored as a Date object
    });

    // Save the coupon to the database
    await newCoupon.save();

    return NextResponse.json(
      {
        success: true,
        message: "Coupon created successfully.",
        data: newCoupon,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while creating coupon.",
      },
      { status: 500 }
    );
  }
}
