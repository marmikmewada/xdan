import { auth } from "@/auth"; // Assuming the auth middleware is set up
// import { connectToDatabase, bookingTable, unavailableSlotTable, userTable } from "@/db"; // MongoDB models
import {
  connectToDatabase,
  // cartTable, productTable, packageTable,
  dbmodels,
} from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(req, { params }) {
  const { id, bedid } = params; // Get the store ID from the URL params
  console.log("bedid", bedid);

  try {
    const { date, timeSlots } = await req.json(); // Removed packageRef from the request body

    // Validate required fields
    if (
      !date ||
      !timeSlots ||
      !Array.isArray(timeSlots) ||
      timeSlots.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Date and timeSlots are required, and timeSlots must be an array.",
        },
        { status: 400 }
      );
    }

    // Validate each slot
    for (let slot of timeSlots) {
      if (!slot.startTime || !slot.endTime) {
        return NextResponse.json(
          {
            success: false,
            message: "Each slot must have a startTime and endTime.",
          },
          { status: 400 }
        );
      }
    }

    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable, unavailableSlotTable, bookingTable } =
      dbmodels(mongoose);

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
    const userDetails = await userTable
      .findOne({ _id: session?.user?.id })
      .exec();
    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const existingBooking = await bookingTable
      .findOne({
        userRef: userDetails._id,
        storeRef: id,
        bedRef: bedid,
        date,
      })
      .exec();

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have a booking for this store on the selected date.",
        },
        { status: 400 }
      );
    }

    // Check for unavailable slots on the requested date
    const unavailableSlots = await unavailableSlotTable
      .findOne({ storeRef: id, bedRef: bedid, date })
      .exec();

    if (unavailableSlots) {
      // Loop through the requested timeSlots and check if any of them are unavailable
      for (let requestedSlot of timeSlots) {
        const requestedStartTime = moment(requestedSlot.startTime, "HH:mm")
          .set("year", moment().year())
          .set("month", moment().month())
          .set("date", moment().date());
        const requestedEndTime = moment(requestedSlot.endTime, "HH:mm")
          .set("year", moment().year())
          .set("month", moment().month())
          .set("date", moment().date());

        // Check each unavailable slot
        const isSlotUnavailable = unavailableSlots.slots.some(
          (unavailableSlot) => {
            const unavailableStartTime = moment(
              unavailableSlot.startTime,
              "HH:mm"
            )
              .set("year", moment().year())
              .set("month", moment().month())
              .set("date", moment().date());
            const unavailableEndTime = moment(unavailableSlot.endTime, "HH:mm")
              .set("year", moment().year())
              .set("month", moment().month())
              .set("date", moment().date());

            // Check if requested slot overlaps with any unavailable slot
            return (
              requestedStartTime.isBetween(
                unavailableStartTime,
                unavailableEndTime,
                null,
                "[)"
              ) ||
              requestedEndTime.isBetween(
                unavailableStartTime,
                unavailableEndTime,
                null,
                "[)"
              )
            );
          }
        );

        if (isSlotUnavailable) {
          return NextResponse.json(
            {
              success: false,
              message: `Slot from ${requestedSlot.startTime} to ${requestedSlot.endTime} is unavailable.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Mark the slots as unavailable for this store and date
    await unavailableSlotTable.create({
      storeRef: id,
      bedRef: bedid,
      date,
      slots: timeSlots,
    });

    // Create the booking, no need for packageRef now
    const booking = await bookingTable.create({
      userRef: userDetails._id,
      storeRef: id,
      date,
      bedRef: bedid,
      timeSlots,
    });

    const populatedBooking = await bookingTable
      .findById(booking._id)
      .populate("userRef")
      .populate("storeRef")
      .populate("bedRef");

    return NextResponse.json(
      {
        success: true,
        message: "Slot booked successfully.",
        data: populatedBooking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while booking the slot.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req) {
  try {
    const { minutes, booking_id } = await req.json();
    await connectToDatabase(mongoose);
    const { userTable, bookingTable } = dbmodels(mongoose);

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
    const userDetails = await userTable
      .findOne({ _id: session?.user?.id })
      .exec();
    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const existingBooking = await bookingTable.findById(booking_id).exec();
    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong",
        },
        { status: 400 }
      );
    }
    await bookingTable.findByIdAndUpdate(booking_id, { minutes });
    return NextResponse.json(
      {
        success: true,
        message: "Minutes updated",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

// import { auth } from "@/auth"; // Assuming the auth middleware is set up
// import { connectToDatabase, bookingTable, unavailableSlotTable, userTable } from "@/db"; // MongoDB models
// import { NextResponse } from "next/server";
// import moment from "moment";

// export async function POST(req, { params }) {
//   const { id } = params; // Get the store ID from the URL params

//   try {
//     const { date, timeSlots, packageRef } = await req.json();

//     // Validate required fields
//     if (!date || !timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Date and timeSlots are required, and timeSlots must be an array.",
//         },
//         { status: 400 }
//       );
//     }

//     // Validate each slot
//     for (let slot of timeSlots) {
//       if (!slot.startTime || !slot.endTime) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Each slot must have a startTime and endTime.",
//           },
//           { status: 400 }
//         );
//       }
//     }

//     // Connect to the database
//     await connectToDatabase();

//     // Authenticate the user
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Unauthorized",
//         },
//         { status: 401 }
//       );
//     }

//     // Get user details from the database
//     const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();
//     if (!userDetails) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Unauthorized",
//         },
//         { status: 401 }
//       );
//     }

//     // Ensure the store exists
//     // const store = await unavailableSlotTable.findOne({ storeRef: id }).exec();
//     // if (!store) {
//     //   return NextResponse.json(
//     //     {
//     //       success: false,
//     //       message: "Store not found",
//     //     },
//     //     { status: 404 }
//     //   );
//     // }

//     // Check for unavailable slots on the requested date
//     const unavailableSlots = await unavailableSlotTable.findOne({ storeRef: id, date }).exec();

//     if (unavailableSlots) {
//       // Loop through the requested timeSlots and check if any of them are unavailable
//       for (let requestedSlot of timeSlots) {
//         const requestedStartTime = moment(requestedSlot.startTime, "HH:mm").set('year', moment().year()).set('month', moment().month()).set('date', moment().date());
//         const requestedEndTime = moment(requestedSlot.endTime, "HH:mm").set('year', moment().year()).set('month', moment().month()).set('date', moment().date());

//         // Check each unavailable slot
//         const isSlotUnavailable = unavailableSlots.slots.some((unavailableSlot) => {
//           const unavailableStartTime = moment(unavailableSlot.startTime, "HH:mm").set('year', moment().year()).set('month', moment().month()).set('date', moment().date());
//           const unavailableEndTime = moment(unavailableSlot.endTime, "HH:mm").set('year', moment().year()).set('month', moment().month()).set('date', moment().date());

//           // Check if requested slot overlaps with any unavailable slot
//           return requestedStartTime.isBetween(unavailableStartTime, unavailableEndTime, null, '[)') || requestedEndTime.isBetween(unavailableStartTime, unavailableEndTime, null, '[)');
//         });

//         if (isSlotUnavailable) {
//           return NextResponse.json(
//             {
//               success: false,
//               message: `Slot from ${requestedSlot.startTime} to ${requestedSlot.endTime} is unavailable.`,
//             },
//             { status: 400 }
//           );
//         }
//       }
//     }

//     await unavailableSlotTable.create({
//       storeRef: id,
//       date,
//       slots: timeSlots,
//     });

//     // Create the booking
//     const booking = await bookingTable.create({
//       userRef: userDetails._id,
//       storeRef: id,
//       date,
//       timeSlots,
//       packageRef,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Slot booked successfully.",
//         data: booking,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Error while booking the slot.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// // req.body
// // {
// //     "date": "2024-11-07",
// //     "timeSlots": [
// //       {
// //         "startTime": "09:00",
// //         "endTime": "09:15"
// //       },
// //       {
// //         "startTime": "14:00",
// //         "endTime": "14:15"
// //       }
// //     ],
// //     "packageRef": "60d72f9f5f6b8e001f0f00c0"
// //   }

// //   response
// //   {
// //     "success": true,
// //     "message": "Slot booked successfully.",
// //     "data": {
// //       "userRef": "60d72f9f5f6b8e001f0f00c0",
// //       "storeRef": "60d72f9f5f6b8e001f0f00c1",
// //       "date": "2024-11-07T00:00:00.000Z",
// //       "timeSlots": [
// //         {
// //           "startTime": "09:00",
// //           "endTime": "09:15"
// //         },
// //         {
// //           "startTime": "14:00",
// //           "endTime": "14:15"
// //         }
// //       ],
// //       "packageRef": "60d72f9f5f6b8e001f0f00c0",
// //       "_id": "60d72f9f5f6b8e001f0f00c2",
// //       "__v": 0
// //     }
// //   }
