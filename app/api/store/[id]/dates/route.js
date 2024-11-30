// /app/api/store/[id]/dates/route.js

// import { connectToDatabase, unavailableDayTable } from '@/db'; // Connect to your MongoDB
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
// import UnavailableDay from '@/db'; // Mongoose model for unavailable days
import moment from 'moment';

//http://localhost:3000/api/store/672b92a9b2654a0371796dc7/dates
// response = {
//   "availableDates": [
//     "2024-11-09",
//     "2024-11-10",
//     "2024-11-11",
//     "2024-11-12",
//     "2024-11-13",
//     "2024-11-14",
//     "2024-11-15",
//     "2024-11-16",
//     "2024-11-17",
//     "2024-11-18",
//     "2024-11-19",
//     "2024-11-20",
//     "2024-11-21",
//     "2024-11-22",
//     "2024-11-23",
//     "2024-11-24",
//     "2024-11-25",
//     "2024-11-26",
//     "2024-11-27",
//     "2024-11-28",
//     "2024-11-29",
//     "2024-11-30",
//     "2024-12-01",
//     "2024-12-02",
//     "2024-12-03",
//     "2024-12-04",
//     "2024-12-05",
//     "2024-12-06",
//     "2024-12-07",
//     "2024-12-08",
//     "2024-12-09"
//   ]
// }
export async function GET(req, { params }) {
  const { id } = params; // Get the store id from the URL

  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { unavailableDayTable } = dbmodels(mongoose);

    // Get today's date and one month from today
    const today = moment().startOf('day');
    const oneMonthFromToday = moment().add(1, 'month').endOf('day');

    // Query to get all unavailable days for the specific store in the date range
    const unavailableDays = await unavailableDayTable.find({
      storeRef: id, // Store ID to filter by
      dates: { $gte: today.toDate(), $lte: oneMonthFromToday.toDate() }, // Date range filter
    }).exec();

    // Flatten the unavailable dates from the 'dates' array field in each document
    const unavailableDates = [];
    unavailableDays.forEach(day => {
      // Add all dates from the 'dates' array into unavailableDates
      day.dates.forEach(date => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        unavailableDates.push(formattedDate);
      });
    });

    // Now create the list of available dates (from today to next 1 month) excluding the unavailable ones
    const availableDates = [];
    let currentDate = today.clone();

    while (currentDate.isBefore(oneMonthFromToday)) {
      const currentDateKey = currentDate.format('YYYY-MM-DD');
      if (!unavailableDates.includes(currentDateKey)) {
        availableDates.push(currentDateKey); // This date is available
      }
      currentDate.add(1, 'day'); // Move to the next day
    }

    // Respond with the available dates
    return new Response(JSON.stringify({ availableDates,unavailableDates }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'An error occurred while fetching dates.' }),
      { status: 500 }
    );
  }
}


// [
//     {
//       "storeRef": "12345",
//       "dates": ["2024-11-07", "2024-11-11", "2024-11-15"],
//       "reason": "Holiday"
//     },
//     {
//       "storeRef": "12345",
//       "dates": ["2024-11-09", "2024-11-13"],
//       "reason": "Maintenance"
//     }
//   ]
