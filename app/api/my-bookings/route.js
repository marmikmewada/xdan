import { auth } from "@/auth"; // Assuming the auth function to get the session
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db"; // Assuming your db models and connectToDatabase
import mongoose from "mongoose";

export async function GET(req) {
  try {
    // Authenticate user
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

    // Connect to the database
    await connectToDatabase(mongoose);
    const { bookingTable, userTable } = dbmodels(mongoose);

    // Get user details
    const userDetails = await userTable.findOne({ _id: session.user.id }).exec();
    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    const { role } = userDetails;

    // Extract date from query parameters
    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    let query = {
      userRef: session.user.id,
    };

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // Fetch bookings for the user
    const userBookings = await bookingTable.find(query)
      .populate("userRef") // Populate user name
      .populate("storeRef") // Populate store name
      .populate("bedRef") // Populate bed name
      .exec();

    return NextResponse.json(
      {
        success: true,
        data: userBookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error fetching user bookings.",
      },
      { status: 500 }
    );
  }
}
