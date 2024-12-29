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

  if (!["admin"].includes(userDetails.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return { user: userDetails };
}

// GET Single Bed
export async function GET(req, { params }) {
  try {
    const { id } = params;

    await connectToDatabase(mongoose);
    const { bedTable } = dbmodels(mongoose);

    const bed = await bedTable.findById(id).populate("storeRef");
    if (!bed) {
      return NextResponse.json(
        { success: false, message: "Bed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Bed fetched successfully", data: bed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /bed/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching bed" },
      { status: 500 }
    );
  }
}

// UPDATE Bed
export async function PATCH(req, { params }) {
  try {
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;

    const { id } = params;
    const updates = await req.json();

    await connectToDatabase(mongoose);
    const { bedTable } = dbmodels(mongoose);

    const updatedBed = await bedTable.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedBed) {
      return NextResponse.json(
        { success: false, message: "Bed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Bed updated successfully", data: updatedBed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /bed/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error updating bed" },
      { status: 500 }
    );
  }
}

// DELETE Bed
export async function DELETE(req, { params }) {
  try {
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;

    const { id } = params;

    await connectToDatabase(mongoose);
    const { bedTable } = dbmodels(mongoose);

    const deletedBed = await bedTable.findByIdAndDelete(id);
    if (!deletedBed) {
      return NextResponse.json(
        { success: false, message: "Bed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Bed deleted successfully", data: deletedBed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /bed/[id]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error deleting bed" },
      { status: 500 }
    );
  }
}
