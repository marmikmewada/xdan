import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from 'mongoose';
import { auth } from "@/auth";

export async function DELETE(req) {
    try {
        const session = await auth();  // Assuming you have an auth method to get session data
        await connectToDatabase(mongoose);
        const { cartTable, userTable } = dbmodels(mongoose);

        // Fetch user details to validate the session
        const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();
        if (!userDetails) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const cart = await cartTable.findOne({ userRef: userDetails?._id });
        console.log("cart", cart);

        if (!cart) {
            return NextResponse.json({
                success: false,
                message: "Cart not found.",
            }, { status: 404 });
        }

        // Use `updateOne` to empty the items array directly
        const result = await cartTable.updateOne(
            { _id: cart._id },
            { $set: { items: [] } }
        );

        if (result.nModified === 0) {
            return NextResponse.json({
                success: false,
                message: "No changes made to the cart.",
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Cart emptied successfully",
        }, { status: 200 });

    } catch (error) {
        console.log("error", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Error while emptying the cart",
        }, { status: 500 });
    }
}
