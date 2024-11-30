import { auth } from "@/auth";
// import { connectToDatabase, packageTable, userTable } from "@/db";
import {
  connectToDatabase,
  // cartTable, productTable, packageTable,
  dbmodels,
} from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2022-11-15", // Ensure you're using a valid API version
});

export async function GET(req, res) {
  try {
    await connectToDatabase(mongoose);
    const { orderTable } = dbmodels(mongoose);

    const details = await stripe.checkout.sessions.list();
    console.log("details:>", details.data[0]);
    const { metadata, payment_status } = details?.data[0] || [];
    const { orderId } = metadata || {};
    const orderDetails = await orderTable.findById(orderId);
    if (!orderDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "something went wrong",
        },
        {
          status: 400,
        }
      );
    }
    await orderTable.updateOne(
      { _id: orderId },
      {
        $set: {
          paymentStatus: payment_status === "paid" ? "completed" : "failed",
        },
      }
    );
    //   const packages = await packageTable.find();

    //   if (!packages.length) {
    //     return NextResponse.json(
    //       {
    //         success: true,
    //         message: "No packages found",
    //         data: [],
    //       },
    //       {
    //         status: 200,
    //       }
    //     );
    //   }

    return NextResponse.json(
      {
        success: true,
        message: "packages found",
        //   data: packages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while fetching packages",
      },
      {
        status: 500,
      }
    );
  }
}
