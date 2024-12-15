import { auth } from "@/auth"; // assuming auth function to get user session
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db"; // assuming the connectToDatabase and dbmodels are set up
import mongoose from "mongoose";


export async function GET(req) {
    try {
      const session = await auth();
  
      if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
  
      await connectToDatabase(mongoose);
      const { orderTable } = dbmodels(mongoose);
  
      const url = new URL(req.url);
      const date = url.searchParams.get('date');
  
      let query = {};
      if (date) {
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }
  
      let orders;
  
      if (session.user.role === 'admin') {
        orders = await orderTable.find(query)
          .populate('productRef')
          .populate('packageRef')
          .populate('usedCouponCode')
          .populate('userRef')
          .sort({ createdAt: -1 })
          .exec();
      } else if (session.user.role === 'staff') {
        orders = await orderTable.find({ ...query})
          .populate('productRef')
          .populate('packageRef')
          .populate('usedCouponCode')
          .populate('userRef')
          .sort({ createdAt: -1 })
          .exec();
      }
  
      return NextResponse.json({
        success: true,
        orders: orders || [],
      }, { status: 200 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ success: false, message: error.message || "Error fetching data" }, { status: 500 });
    }
  }
  