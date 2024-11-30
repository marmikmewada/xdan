import { auth } from "@/auth"; // Assuming the auth middleware is set up
// import { connectToDatabase, bookingTable, userTable, storeTable } from "@/db"; 
// MongoDB models
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable,bookingTable,storeTable } = dbmodels(mongoose);

    // Authenticate the user
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

    // Check the user's role
    const { role } = userDetails || {};

    // If the user is an admin, fetch all bookings
    if (role === "admin") {
      const allBookings = await bookingTable.find()
        .populate("userRef", "name") // Populate user name instead of userRef
        .populate("storeRef", "name") // Populate store name instead of storeRef
        .exec();

      return NextResponse.json(
        {
          success: true,
          message: "All bookings fetched successfully.",
          data: allBookings.map(booking => ({
            ...booking.toObject(),
            userName: booking.userRef?.name,
            storeName: booking.storeRef?.name,
            userRef: undefined, // Remove the original userRef field
            storeRef: undefined, // Remove the original storeRef field
          })),
        },
        { status: 200 }
      );
    }

    // If the user is staff, fetch bookings for the store they are associated with
    if (role === "staff") {
      const store = await storeTable.findOne({ staff: userDetails._id }).exec();
      if (!store) {
        return NextResponse.json(
          {
            success: false,
            message: "Staff member not associated with any store.",
          },
          { status: 403 }
        );
      }

      // Fetch bookings for that specific store
      const storeBookings = await bookingTable.find({ storeRef: store._id })
        .populate("userRef", "name") // Populate user name instead of userRef
        .populate("storeRef", "name") // Populate store name instead of storeRef
        .exec();

      return NextResponse.json(
        {
          success: true,
          message: `Bookings for store ${store.name} fetched successfully.`,
          data: storeBookings.map(booking => ({
            ...booking.toObject(),
            userName: booking.userRef?.name,
            storeName: booking.storeRef?.name,
            userRef: undefined, // Remove the original userRef field
            storeRef: undefined, // Remove the original storeRef field
          })),
        },
        { status: 200 }
      );
    }

    // If user is neither staff nor admin, deny access
    return NextResponse.json(
      {
        success: false,
        message: "Permission denied",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while fetching bookings.",
      },
      {
        status: 500,
      }
    );
  }
}




// {
//     "success": true,
//     "message": "All bookings fetched successfully.",
//     "data": [
//       {
//         "_id": "60d72f9f5f6b8e001f0f00c0",
//         "userName": "John Doe",
//         "storeName": "Store A",
//         "date": "2024-11-07T00:00:00.000Z",
//         "timeSlots": [
//           {
//             "startTime": "09:00",
//             "endTime": "09:15"
//           }
//         ],
//         "packageRef": "60d72f9f5f6b8e001f0f00c3",
//         "__v": 0
//       },
//       {
//         "_id": "60d72f9f5f6b8e001f0f00c4",
//         "userName": "Jane Smith",
//         "storeName": "Store B",
//         "date": "2024-11-08T00:00:00.000Z",
//         "timeSlots": [
//           {
//             "startTime": "10:00",
//             "endTime": "10:15"
//           }
//         ],
//         "packageRef": "60d72f9f5f6b8e001f0f00c7",
//         "__v": 0
//       }
//     ]
//   }
  


// response staff 
// {
//     "success": true,
//     "message": "Bookings for store Store Name fetched successfully.",
//     "data": [
//       {
//         "_id": "60d72f9f5f6b8e001f0f00c0",
//         "userRef": "60d72f9f5f6b8e001f0f00c1",
//         "storeRef": "60d72f9f5f6b8e001f0f00c2",
//         "date": "2024-11-07T00:00:00.000Z",
//         "timeSlots": [
//           {
//             "startTime": "09:00",
//             "endTime": "09:15"
//           }
//         ],
//         "packageRef": "60d72f9f5f6b8e001f0f00c3",
//         "__v": 0
//       }
//     ]
//   }
  