import { auth } from "@/auth"; // Assuming the auth middleware is set up
// import { connectToDatabase, unavailableDayTable, userTable } from "@/db"; // MongoDB models
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = params; // Get the store ID from the URL params

  try {
    const { dates, reason } = await req.json();

    // Validate required fields
    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Dates are required and must be an array.",
        },
        { status: 400 }
      );
    }

    // if (!reason) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Reason for unavailability is required.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable,unavailableDayTable } = dbmodels(mongoose);

    // Check if the user is authenticated
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

    // Get user details from the database
    const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();
    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Check user role (admin or staff)
    const { role } = userDetails || {};
    if (role !== "admin" && role !== "staff") {
      return NextResponse.json(
        {
          success: false,
          message: "Permission denied",
        },
        { status: 403 }
      );
    }
console.log("store id",id)
    // Check if the store exists
    // const storeExists = await unavailableDayTable.findOne({ storeRef: id }).exec();
    // if (!storeExists) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Store not found",
    //     },
    //     { status: 404 }
    //   );
    // }

    // Create or update the unavailable days for the store
    let unavailableDay = await unavailableDayTable.findOne({ storeRef: id }).exec();

    if (unavailableDay) {
      // If the store already has unavailable days, we add to the existing list
      unavailableDay.dates = [...new Set([...unavailableDay.dates, ...dates])]; // Avoid duplicates
      unavailableDay.reason = reason;
      await unavailableDay.save();
    } else {
      // If no existing record, create a new one
      unavailableDay = await unavailableDayTable.create({
        storeRef: id,
        dates,
        reason,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Unavailable days marked successfully.",
        data: unavailableDay,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while marking unavailable days.",
      },
      {
        status: 500,
      }
    );
  }
}


// req.body 
// {
//     "dates": ["2024-11-07", "2024-11-09", "2024-11-11"],
//     "reason": "Staff vacation"
//   }

  

//   response 
//   {
//     "success": true,
//     "message": "Unavailable days marked successfully.",
//     "data": {
//       "storeRef": "12345",
//       "dates": ["2024-11-07", "2024-11-09", "2024-11-11"],
//       "reason": "Staff vacation",
//       "_id": "60d72f9f5f6b8e001f0f00c0",
//       "__v": 0
//     }
//   }
  