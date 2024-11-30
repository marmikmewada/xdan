import { NextResponse } from "next/server";
// import { connectToDatabase, userTable } from "@/db"; // Assuming `userTable` is where the user data is stored
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { auth } from "@/auth"; // Assuming you have an auth function to get the session

export async function GET(req) {
  try {
    // Step 1: Get user ID from session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User is not authenticated" }, { status: 401 });
    }

    // Step 2: Connect to the database
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);

    // Step 3: Find the user from the userTable
    const user = await userTable.findById(userId).select('selectedMode');

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Step 4: Return the selectedMode
    return NextResponse.json({
      success: true,
      message: "Selected mode fetched successfully",
      data: { selectedMode: user?.selectedMode || "light" },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error fetching selected mode.",
    }, { status: 500 });
  }
}
