import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Middleware to check for admin or staff roles
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

  if (!["admin", "staff"].includes(userDetails.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return { user: userDetails };
}

// CREATE Bed
export async function POST(req) {
  try {
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;

    const { storeRef, bedName, imageUrl } = await req.json();
    if (!storeRef?.length || !bedName) {
      return NextResponse.json(
        { success: false, message: "storeRef and bedName are required." },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { bedTable } = dbmodels(mongoose);

    const createdBed = await bedTable.create({ storeRef, bedName, imageUrl });
    console.log("createdBed",createdBed)
    return NextResponse.json(
      { success: true, message: "Bed created successfully", data: createdBed },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /bed:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error creating bed" },
      { status: 500 }
    );
  }
}

// GET All Beds
export async function GET(req) {
  try {
    await connectToDatabase(mongoose);
    const { bedTable } = dbmodels(mongoose);

    const beds = await bedTable.find().populate("storeRef");
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
