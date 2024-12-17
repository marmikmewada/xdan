import { NextResponse } from "next/server";
import { auth } from "@/auth";  // Assuming you have an auth function to handle sessions
import mongoose from "mongoose";
import { connectToDatabase, dbmodels } from "@/db";  // Adjust the imports based on your project structure

export async function POST(req) {
  try {
    // Extract data from the request body
    const { oldPassword, newPassword } = await req.json();

    // Validate the input
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Old password and new password are required.",
        },
        { status: 400 }
      );
    }

    // Get the user session (use this to get user ID)
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated.",
        },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);

    // Find the user by ID
    const existingUser = await userTable.findById(userId).exec();

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Check if the old password matches
    if (existingUser.password !== oldPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect old password.",
        },
        { status: 400 }
      );
    }

    // If the old password matches, update the new password
    existingUser.password = newPassword;

    // Save the updated user
    await existingUser.save();

    // Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while changing the password.",
      },
      { status: 500 }
    );
  }
}
