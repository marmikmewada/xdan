// import { connectToDatabase } from '@/db'; // Assuming you have a utility to connect to MongoDB
// import { unavailableSlotTable, bookingTable, userTable } from '@/db'; // Mongoose models for unavailable slots and bookings
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import moment from 'moment-timezone';

export async function GET(req, { params }) {
  const { id } = params; // Get the store id from the URL
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // Get the selected date from the query params

  if (!date) {
    return new Response(
      JSON.stringify({ message: 'Date parameter is required' }),
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { unavailableSlotTable,bookingTable } = dbmodels(mongoose);

    // Ensure the date is in UK timezone (GMT/BST)
    const selectedDate = moment.tz(date, 'YYYY-MM-DD', 'Europe/London').startOf('day');
    const endOfDay = selectedDate.clone().endOf('day');

    // Define store's working hours: 9:00 AM to 8:00 PM (in UK time)
    const workStartTime = selectedDate.clone().set({ hour: 9, minute: 0, second: 0 });
    const workEndTime = selectedDate.clone().set({ hour: 20, minute: 0, second: 0 });

    // Generate all possible 15-minute slots from 9:00 AM to 8:00 PM
    const allSlots = [];
    let currentSlot = workStartTime.clone();
    while (currentSlot.isBefore(workEndTime)) {
      const startTime = currentSlot.format('HH:mm');
      const endTime = currentSlot.clone().add(15, 'minutes').format('HH:mm');
      allSlots.push({ startTime, endTime });
      currentSlot.add(15, 'minutes');
    }

    // Query to get unavailable slots for the specific store on the selected date
    const unavailableSlots = await unavailableSlotTable.find({
      storeRef: id,
      date: selectedDate.toDate(), // Match the exact date
    }).exec();

    // Flatten all the unavailable slots into a single list of (startTime, endTime)
    const unavailableSlotTimes = [];
    unavailableSlots.forEach(slot => {
      slot.slots.forEach(unavailable => {
        unavailableSlotTimes.push({
          startTime: unavailable.startTime,
          endTime: unavailable.endTime,
        });
      });
    });

    // Query to get bookings for the store on the selected date
    const bookings = await bookingTable.find({
      storeRef: id,
      date: { $gte: selectedDate.toDate(), $lt: endOfDay.toDate() },
    }).populate('userRef', 'name'); // Populate user name from the User model

    // Create an object to map booked slots by their time
    const bookedSlots = {};
    bookings.forEach(booking => {
      booking.timeSlots.forEach(slot => {
        const slotKey = `${slot.startTime}-${slot.endTime}`;
        bookedSlots[slotKey] = booking.userRef.name; // Store the user's name who booked this slot
      });
    });

    // Filter the available slots by removing the unavailable and booked slots
    const availableSlots = allSlots.filter(slot => {
      const slotKey = `${slot.startTime}-${slot.endTime}`;
      const isUnavailable = unavailableSlotTimes.some(
        unavailableSlot => unavailableSlot.startTime === slot.startTime && unavailableSlot.endTime === slot.endTime
      );
      return !isUnavailable && !bookedSlots[slotKey]; // Only keep slots that are not unavailable or already booked
    });

    // Include user names for booked slots
    const slotsWithBookings = allSlots.map(slot => {
      const slotKey = `${slot.startTime}-${slot.endTime}`;
      if (bookedSlots[slotKey]) {
        return {
          ...slot,
          bookedBy: bookedSlots[slotKey], // Add the user who booked this slot
          status: 'booked', // Mark as booked
        };
      } else if (!unavailableSlotTimes.some(
        unavailableSlot => unavailableSlot.startTime === slot.startTime && unavailableSlot.endTime === slot.endTime
      )) {
        return {
          ...slot,
          status: 'available', // Mark as available
        };
      } else {
        return {
          ...slot,
          status: 'unavailable', // Mark as unavailable
        };
      }
    });

    // Respond with the available slots along with booking details
    return new Response(
      JSON.stringify({ slots: slotsWithBookings }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'An error occurred while fetching available slots.' }),
      { status: 500 }
    );
  }
}




// // /app/api/store/[id]/dates/slots/route.js

// import { connectToDatabase } from '@/db'; // Assuming you have a utility to connect to MongoDB
// import { unavailableSlotTable } from '@/db'; // Mongoose model for unavailable slots
// import moment from 'moment-timezone';

// //http://localhost:3000/api/store/672b92a9b2654a0371796dc7/dates/slots?date=2024-11-30

// export async function GET(req, { params }) {
//   const { id } = params; // Get the store id from the URL
//   // const { date } = req.query; // Get the selected date from the query params
//   const { searchParams } = new URL(req.url);
//   const date = searchParams.get('date');
//   if (!date) {
//     return new Response(
//       JSON.stringify({ message: 'Date parameter is required' }),
//       { status: 400 }
//     );
//   }

//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Ensure the date is in UK timezone (GMT/BST)
//     const selectedDate = moment.tz(date, 'YYYY-MM-DD', 'Europe/London').startOf('day');
//     const endOfDay = selectedDate.clone().endOf('day');

//     // Define store's working hours: 9:00 AM to 8:00 PM (in UK time)
//     const workStartTime = selectedDate.clone().set({ hour: 9, minute: 0, second: 0 });
//     const workEndTime = selectedDate.clone().set({ hour: 20, minute: 0, second: 0 });

//     // Generate all possible 15-minute slots from 9:00 AM to 8:00 PM
//     const allSlots = [];
//     let currentSlot = workStartTime.clone();
//     while (currentSlot.isBefore(workEndTime)) {
//       const startTime = currentSlot.format('HH:mm');
//       const endTime = currentSlot.clone().add(15, 'minutes').format('HH:mm');
//       allSlots.push({ startTime, endTime });
//       currentSlot.add(15, 'minutes');
//     }

//     // Query to get unavailable slots for the specific store on the selected date
//     const unavailableSlots = await unavailableSlotTable.find({
//       storeRef: id, // Store ID to filter by
//       date: selectedDate.toDate(), // Match the exact date
//     }).exec();

//     // Flatten all the unavailable slots into a single list of (startTime, endTime)
//     const unavailableSlotTimes = [];
//     unavailableSlots.forEach(slot => {
//       slot.slots.forEach(unavailable => {
//         unavailableSlotTimes.push({
//           startTime: unavailable.startTime,
//           endTime: unavailable.endTime,
//         });
//       });
//     });

//     // Filter the available slots by removing the unavailable slots
//     const availableSlots = allSlots.filter(slot => {
//       return !unavailableSlotTimes.some(unavailableSlot => {
//         return (
//           slot.startTime === unavailableSlot.startTime &&
//           slot.endTime === unavailableSlot.endTime
//         );
//       });
//     });

//     // Respond with the available slots
//     return new Response(
//       JSON.stringify({ availableSlots }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({ message: 'An error occurred while fetching available slots.' }),
//       { status: 500 }
//     );
//   }
// }



// // {
// //     "availableSlots": [
// //       { "startTime": "09:00", "endTime": "09:15" },
// //       { "startTime": "09:15", "endTime": "09:30" },
// //       { "startTime": "09:30", "endTime": "09:45" },
// //       { "startTime": "09:45", "endTime": "10:00" },
// //       { "startTime": "10:15", "endTime": "10:30" },
// //       { "startTime": "10:30", "endTime": "10:45" },
// //       { "startTime": "10:45", "endTime": "11:00" },
// //       ...
// //       { "startTime": "14:15", "endTime": "14:30" },
// //       { "startTime": "14:45", "endTime": "15:00" },
// //       ...
// //       { "startTime": "19:45", "endTime": "20:00" }
// //     ]
// //   }
