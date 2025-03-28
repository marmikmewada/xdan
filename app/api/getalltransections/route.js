import { auth } from "@/auth"; // assuming auth function to get user session
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db"; // assuming the connectToDatabase and dbmodels are set up
import mongoose from "mongoose";

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
      const session = await auth();
      const roleCheck = await checkAdminOrStaff();
      if (!roleCheck.user) return roleCheck;
      if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
  
      await connectToDatabase(mongoose);
      const { ordersTransectionTable} = dbmodels(mongoose);
  
      const url = new URL(req.url);
      const date = url.searchParams.get('date');
  
      let query = {};
      if (date) {
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }
  
      let ordersTransection;
  
      // if (session.user.role === 'admin') {
        ordersTransection = await ordersTransectionTable.find(query)
          .populate('doneBy')
          .populate('orderRef')
          .sort({ createdAt: -1 })
          .exec();
      // } 
  
      return NextResponse.json({
        success: true,
        orders: ordersTransection || [],
      }, { status: 200 });
    } catch (error) {
      console.error("Error fetching ordersTransections ", error);
      return NextResponse.json({ success: false, message: error.message || "Error fetching data" }, { status: 500 });
    }
  }
  