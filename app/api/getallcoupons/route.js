import { NextResponse } from "next/server";
import mongoose from 'mongoose';
// import { connectToDatabase,dbmodels } from "@/db";  // Import your DB connection and discountCouponTable
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";

  // export const dynamic = 'force-static'

export async function GET(req) {
  try {
    // Step 1: Connect to the database
    await connectToDatabase(mongoose);
    const { discountCouponTable } = dbmodels(mongoose);

    // Step 2: Fetch all coupons
    const coupons = await discountCouponTable.find();  // Select relevant fields
    // console.log(coupons);
    
    // Step 3: Check if there are any coupons
    if (coupons.length === 0) {
      return NextResponse.json({ success: false, message: "No coupons found" }, { status: 404 });
    }

    // Step 4: Return the list of coupons
    return NextResponse.json({
      success: true,
      message: "Coupons retrieved successfully",
      data: coupons,  // Return the coupons' data
    });

  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error fetching coupons.",
    }, { status: 500 });
  }
}
