//getsingle order email
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";

export async function GET(req, { params: { id } }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase(mongoose);
    const { orderTable } = dbmodels(mongoose);

    const order = await orderTable
      .findOne({ _id: id })
      .populate("userRef")
      .populate("productRef")
      .populate("packageRef");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching data" },
      { status: 500 }
    );
  }
}
