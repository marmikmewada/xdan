import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const storeId = searchParams.get("store");
  
      await connectToDatabase(mongoose);
      const { bedTable } = dbmodels(mongoose);
  
      const beds = await bedTable.find({storeRef:{$in:[storeId]}}).populate("storeRef");
      return NextResponse.json(
        {
          success: true,
          message: beds.length ? "Beds fetched successfully" : "No beds found",
          data: beds,
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