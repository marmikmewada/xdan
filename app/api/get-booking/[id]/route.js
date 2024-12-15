import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(req,{params}) {
    try {
        const {id}=params || {}
        await connectToDatabase(mongoose);
        const { bookingTable } = dbmodels(mongoose);
    
        // Find the booking by its ID and populate references
        const booking = await bookingTable
          .findById(id)
          .populate("userRef") // Populate user details (name and email)
          .populate("storeRef") // Populate store details (name and address)
          .populate("bedRef") // Populate bed details (bed name)
          .populate("packageRef"); // Populate package details
    
      return NextResponse.json(
        {
          success: true,
          message: "booking fetched successfully" ,
          data: booking,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in GET /bed:", error);
      return NextResponse.json(
        { success: false, message: error.message || "Error fetching beds" },
        { status: 500 }
      );
    }
  }