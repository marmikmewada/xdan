// app/api/cart/route.js (DELETE)
import { NextResponse } from "next/server";
// import {connectToDatabase,cartTable} from "@/db"
import { connectToDatabase, 
    // cartTable, productTable, packageTable,
    dbmodels } from "@/db";
    import mongoose from 'mongoose';
import { auth } from "@/auth";

export async function DELETE(req) {
    try {
        // const { userId } = await req.json();
        const session = await auth();  // Assuming you have an auth method to get session data
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User ID is required."
            }, { status: 400 });
        }

        await connectToDatabase(mongoose);
        const { cartTable, } = dbmodels(mongoose);

        const cart = await cartTable.findOne({ userRef: userId });

        if (!cart) {
            return NextResponse.json({
                success: false,
                message: "Cart not found."
            }, { status: 404 });
        }

        // Empty the cart
        cart.items = [];
        cart.cartTotal = 0;

        await cart.save();

        return NextResponse.json({
            success: true,
            message: "Cart emptied successfully"
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message || "Error while emptying the cart"
        }, { status: 500 });
    }
}
