import { NextResponse } from "next/server";
// import { connectToDatabase, userTable } from "@/db"; // Assuming `userTable` is where the user data is stored
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { auth } from "@/auth"; // Assuming you have an auth function to get the session

export async function POST(req) {
  try {
    // Step 1: Get the current user's session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User is not authenticated" }, { status: 401 });
    }

    // Step 2: Parse the request body for the selectedMode (either "light" or "dark")
    const { selectedMode } = await req.json();

    if (!selectedMode || !["light", "dark"].includes(selectedMode)) {
      return NextResponse.json({ success: false, message: "Invalid mode. It must be 'light' or 'dark'." }, { status: 400 });
    }

    // Step 3: Connect to the database
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);

    // Step 4: Find the user and update the selectedMode field
    const updatedUser = await userTable.findByIdAndUpdate(
      userId,
      { selectedMode: selectedMode },
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found or update failed" }, { status: 404 });
    }

    // Step 5: Return the updated selectedMode
    return NextResponse.json({
      success: true,
      message: "Selected mode updated successfully",
      data: { selectedMode: updatedUser.selectedMode },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error updating selected mode.",
    }, { status: 500 });
  }
}
