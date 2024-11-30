import { NextResponse } from "next/server";
// import { connectToDatabase, userTable } from "@/db";  // Import your DB connection and userTable
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';

export async function GET(req) {
  try {
    // Step 1: Connect to the database
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);

    // Step 2: Fetch all users with the 'staff' role
    const staffMembers = await userTable.find({ role: "staff" }).select('name _id');  // Only select name and _id fields
    console.log(staffMembers);
    // Step 3: Check if there are any staff members
    if (staffMembers.length === 0) {
      return NextResponse.json({ success: false, message: "No staff found" }, { status: 404 });
    }

    // Step 4: Return the list of staff members
    return NextResponse.json({
      success: true,
      message: "Staff members retrieved successfully",
      data: staffMembers,  // Return the staff members' data
    });

  } catch (error) {
    console.error("Error fetching staff members:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error fetching staff members.",
    }, { status: 500 });
  }
}
