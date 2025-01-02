import { NextResponse } from "next/server";
import mongoose from 'mongoose';
// import { connectToDatabase,dbmodels } from "@/db";  // Import your DB connection and discountCouponTable
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import { auth } from "@/auth"; // assuming auth function to get user session

  // export const dynamic = 'force-static'
  export const dynamic = 'force-dynamic';

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

export async function GET(req) {
  try {
    // Step 1: Connect to the database
    await connectToDatabase(mongoose);
    const { discountCouponTable } = dbmodels(mongoose);
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;
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
    },{
      headers: { 'Cache-Control': 'no-store' }
    });
    

  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error fetching coupons.",
    }, { status: 500 });
  }
}
