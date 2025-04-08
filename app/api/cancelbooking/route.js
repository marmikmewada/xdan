import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId } = body;
    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId" },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { bookingTable, userTable, unavailableSlotTable } = dbmodels(mongoose);

    const userDetails = await userTable.findById(session.user.id);
    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    const booking = await bookingTable.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    const isOwner = booking.userRef.toString() === session.user.id;
    const isAdminOrStaff = ["admin", "staff"].includes(userDetails.role);

    if (!isOwner && !isAdminOrStaff) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Not allowed to cancel this booking" },
        { status: 403 }
      );
    }

    // First: delete the booking

    // Then: update unavailable slots
    const { storeRef, bedRef, date, timeSlots } = booking;

    const slotDoc = await unavailableSlotTable.findOne({
      storeRef,
      bedRef,
      date: new Date(date).toISOString(), // normalize date if needed
    });
    console.log("slotDoc",slotDoc)

    if (slotDoc && Array.isArray(slotDoc.slots)) {
        const updatedSlots = slotDoc.slots.filter(slot =>
          !timeSlots.some(cancelled =>
            cancelled.startTime === slot.startTime &&
            cancelled.endTime === slot.endTime
          )
        );
      
        if (updatedSlots.length === 0) {
          await unavailableSlotTable.findByIdAndDelete(slotDoc._id);
        } else {
          slotDoc.slots = updatedSlots;
          await slotDoc.save();
        }
      }
    await bookingTable.findByIdAndDelete(bookingId);
    return NextResponse.json(
      { success: true, message: "Booking cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
