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
          .populate("userRef", "name email") // Populate user details (name and email)
          .populate("storeRef", "name address") // Populate store details (name and address)
          .populate("bedRef", "bedName") // Populate bed details (bed name)
          .populate("packageRef", "packageName price"); // Populate package details
    
      return NextResponse.json(
        {
          success: true,
          message: beds.length ? "Beds fetched successfully" : "No beds found",
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