import { auth } from "@/auth"; // Assuming the auth middleware is set up
// import { connectToDatabase, unavailableSlotTable, userTable } from "@/db"; // MongoDB models
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = params; // Get the store ID from the URL params

  try {
    const { date, slots, reason,bedId } = await req.json();
console.log("slots,date >>>>>>>>>",slots,date)
    // Validate required fields
    if (!date || !slots || !Array.isArray(slots) || slots.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Date and slots are required and slots must be an array of objects.",
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
    const { userTable,unavailableSlotTable } = dbmodels(mongoose);

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

    // Check if the store exists
    // const storeExists = await unavailableSlotTable.findOne({ storeRef: id }).exec();
    // if (!storeExists) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Store not found",
    //     },
    //     { status: 404 }
    //   );
    // }

    // Create or update the unavailable slots for the store
    let unavailableSlot = await unavailableSlotTable.findOne({ storeRef: id, date }).exec();

    if (unavailableSlot) {
      // If the store already has unavailable slots for the same date, we add to the existing list
      const updatedSlots=[...unavailableSlot.slots, ...slots]
      console.log("updatedSlots++++",updatedSlots)
      unavailableSlot.slots = updatedSlots;
      // unavailableSlot.reason = reason;
      // '2025-05-14T00:00:00.000Z'
      // '2025-05-13T23:00:00.000Z'
      console.log("going to save this details unavailableSlot",unavailableSlot)
      await unavailableSlot.save();
    } else {
      // If no existing record for the specific date, create a new one
      unavailableSlot = await unavailableSlotTable.create({
        storeRef: id,
        bedRef:bedId,
        date,
        slots,
        reason,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Unavailable slots marked successfully.",
        data: unavailableSlot,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while marking unavailable slots.",
      },
      {
        status: 500,
      }
    );
  }
}

// req.body 
// {
//     "date": "2024-11-07",
//     "slots": [
//       {
//         "startTime": "09:00",
//         "endTime": "09:15",
//         "reason": "Staff meeting"
//       },
//       {
//         "startTime": "14:00",
//         "endTime": "14:15",
//         "reason": "Inventory check"
//       }
//     ],
//     "reason": "Staff leave"
//   }

  
//   response 
//   {
//     "success": true,
//     "message": "Unavailable slots marked successfully.",
//     "data": {
//       "storeRef": "12345",
//       "date": "2024-11-07",
//       "slots": [
//         {
//           "startTime": "09:00",
//           "endTime": "09:15",
//           "reason": "Staff meeting"
//         },
//         {
//           "startTime": "14:00",
//           "endTime": "14:15",
//           "reason": "Inventory check"
//         }
//       ],
//       "reason": "Staff leave",
//       "_id": "60d72f9f5f6b8e001f0f00c0",
//       "__v": 0
//     }
//   }
  