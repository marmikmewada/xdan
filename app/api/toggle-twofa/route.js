import { auth } from "@/auth";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { enable } = await req.json(); // Extract the desired 2FA state from the request body

    if (typeof enable !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input. 'enable' must be a boolean.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);

    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID not found in session.",
        },
        { status: 401 }
      );
    }

    const userDetails = await userTable.findById(userId).exec();

    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Update the `twofa` field
    userDetails.twofa = enable;
    await userDetails.save();

    return NextResponse.json(
      {
        success: true,
        message: `Two-factor authentication has been ${enable ? "enabled" : "disabled"}.`,
        twofa: enable,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling 2FA:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while toggling 2FA.",
      },
      { status: 500 }
    );
  }
}
