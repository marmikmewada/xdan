import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db";  // Importing dbmodels to get the models.
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    // Step 1: Connect to the database
    await connectToDatabase(mongoose);

    // Step 2: Get the models using dbmodels function
    const { userTable, storeTable } = dbmodels(mongoose);

    // Step 3: Extract the user's email from the query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    console.log("req.query",req.query)
    // const { email } = req.query;
    console.log("email",email)

    // Check if email is provided
    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email is required",
      }, { status: 400 });
    }

    // Step 4: Fetch the user by email and select necessary fields (name, lastName, _id, email, role)
    const user = await userTable
      .findOne({ email })  // Fetch the user by email
      .select('name lastName _id email role');  // Select the necessary fields (id, email, name, lastName, role)

    // Step 5: Check if the user exists
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      }, { status: 404 });
    }

    // Step 6: Check if the user is a staff member and fetch associated store(s)
    if (user.role === 'staff') {
      // Fetch the store(s) where this user is a staff member
      const store = await storeTable
        .findOne({ staff: user._id }) // Find store by matching user ID in the staff array
        .select('_id name'); // Select only store ID and name
console.log("store",store)
      // If the store is found, include store information in the response
      if (store) {
        user.store = store._id;
      }
    }
    console.log("user",user)

    // Step 7: Return the user details
    return NextResponse.json({
      success: true,
      message: "User retrieved successfully",
      data: user,
      store: user.store  // Return the user data, which may include store if the user is staff
    });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error fetching user.",
    }, { status: 500 });
  }
}
