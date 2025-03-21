import { connectToDatabase, dbmodels } from "@/db";  // Importing dbmodels to get the models.
import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Step 1: Parse the incoming JSON body (credentials)
    const credentials = await req.json();
    const { email, password } = credentials;

    // Step 2: Validate if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }



    // hello  

    // Step 3: Connect to the database
    await connectToDatabase(mongoose);

    // Step 4: Get the models using dbmodels function
    const { userTable, storeTable } = dbmodels(mongoose);

    // Step 5: Fetch the user from the database based on the email
    const user = await userTable.findOne({ email }).exec();

    // Step 6: Check if the user exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user found with the provided email",
        },
        { status: 404 }
      );
    }

    // Step 7: Check if the password matches (you should ideally use hashed passwords)
    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Step 8: Create a response object with user data to return
    const responseData = {
      success: true,
      message: "User authenticated successfully",
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        twofa: user.twofa // You can add other fields like `twofa` here if needed
      },
    };

    // Step 9: If user is staff, include store information (similar to the example)
    if (user.role === "staff") {
      const store = await storeTable
        .findOne({ staff: user._id })  // Fetch store by matching user ID
        .select("_id name");  // Return store _id and name

      if (store) {
        responseData.data.store = store._id;  // Include store ID if user is staff
      }
    }

    // Step 10: Return the user data along with any additional information
    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error during authorization:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred during authorization.",
      },
      { status: 500 }
    );
  }
}
