import { NextResponse } from "next/server";
// import { connectToDatabase, cartTable, productTable, packageTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { auth } from "@/auth"; // Assuming you have an auth function to get the session

export async function POST(req) {
  try {
    // Step 1: Get user ID from session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User is not authenticated" }, { status: 401 });
    }

    // Step 2: Connect to the database
    await connectToDatabase(mongoose);
    const { productTable,packageTable,cartTable } = dbmodels(mongoose);

    // Step 3: Parse the incoming request body (we only need itemId here)
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 });
    }

    // Step 4: Check if the itemId exists in the products or packages tables
    let itemExists = false;

    // Check in products table first
    const product = await productTable.findById(itemId);
    if (product) {
      itemExists = true;
    }

    // Check in packages table if it's not a product
    if (!itemExists) {
      const packageItem = await packageTable.findById(itemId);
      if (packageItem) {
        itemExists = true;
      }
    }

    // If the item is not found in either table, return an error
    if (!itemExists) {
      return NextResponse.json({ success: false, message: "Invalid product/package ID" }, { status: 400 });
    }

    // Step 5: Find or create the user's cart
    let cart = await cartTable.findOne({ userRef: userId });

    if (!cart) {
      // If no cart exists, create a new one
      cart = new cartTable({
        userRef: userId,
        items: [itemId], // Store just the itemId
      });
      await cart.save();
    } else {
      // If cart exists, add the itemId to the cart's items array
      cart.items.push(itemId);
      await cart.save();
    }

    // Step 6: Return success response with updated cart
    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
      data: { cartId: cart._id, items: cart.items }, // Return the cart details
    });

  } catch (error) {
    console.error("Error increasing item quantity:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error increasing item quantity.",
    }, { status: 500 });
  }
}
