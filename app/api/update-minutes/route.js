import { NextResponse } from 'next/server';
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from 'mongoose';

export async function PATCH(req) {
  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);

    // Extract the user ID from the params


    
    // Parse the request body to get the updated minutes value
    const { minutes,userId:id } = await req.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid input. User ID and minutes are required." },
        { status: 400 }
      );
    }

    // Find the user by ID and update their minutes
    const updatedUser = await userTable.findByIdAndUpdate(
      id, 
      { minutes }, // Set the new minutes value
      { new: true } // Return the updated document
    );

    // If the user doesn't exist
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Return the updated user data
    return NextResponse.json(
      { 
        success: true, 
        message: "Minutes updated successfully.", 
        data: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          minutes: updatedUser.minutes
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user minutes:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating user minutes' },
      { status: 500 }
    );
  }
}
