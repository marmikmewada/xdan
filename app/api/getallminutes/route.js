import { auth } from "@/auth"; // Assuming auth function to get user session
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db"; // Assuming the connectToDatabase and dbmodels are set up
import mongoose from "mongoose";


//Get minutes transaction
async function checkAdminOrStaff() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectToDatabase(mongoose);
  const { userTable } = dbmodels(mongoose);

  const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();
  if (!userDetails) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!["admin"].includes(userDetails.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return { user: userDetails };
}

export async function GET(req) {
  try {
    // Check for authentication
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;

    // Connect to the database
    await connectToDatabase(mongoose);

    // Destructure dbmodels to access the minutes transaction model
    const { minutesTransactionTable } = dbmodels(mongoose);

    // Parse the URL and extract the date query parameter
    const url = new URL(req.url);
    const date = url.searchParams.get('date');

    // Prepare the query object
    let query = {};
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Fetch minutes transactions from the database, with potential filtering by date
    const minutesTransactions = await minutesTransactionTable.find(query)
      .populate('doneBy')  // Populate doneBy user details
      .populate('minutesOfUser')  // Populate the user whose minutes were updated
      .sort({ createdAt: -1 })  // Sort in descending order of creation
      .exec();

    // Return the response with the fetched data
    return NextResponse.json({
      success: true,
      minutesTransactions: minutesTransactions || [],
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching minutes transactions", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error fetching minutes transactions"
    }, { status: 500 });
  }
}
