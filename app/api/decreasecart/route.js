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
    const { cartTable,productTable,packageTable} = dbmodels(mongoose);

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

    // Step 5: Find the user's cart
    let cart = await cartTable.findOne({ userRef: userId });

    if (!cart) {
      // If no cart exists, return an error
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    // Step 6: Check if the item exists in the cart
    const itemIndex = cart.items.indexOf(itemId);

    if (itemIndex === -1) {
      // If the item is not in the cart
      return NextResponse.json({ success: false, message: "Item not in cart" }, { status: 400 });
    }

    // Step 7: Remove one occurrence of the item from the cart
    cart.items.splice(itemIndex, 1); // Remove the first occurrence of the itemId

    // Save the updated cart
    await cart.save();

    // Step 8: Return success response with updated cart
    return NextResponse.json({
      success: true,
      message: "Item quantity decreased successfully",
      data: { cartId: cart._id, items: cart.items }, // Return the cart details
    });

  } catch (error) {
    console.error("Error decreasing item quantity:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error decreasing item quantity.",
    }, { status: 500 });
  }
}


// request 

// {
//     "itemId": "productId123",  // or "packageId456"
//     "type": "product"          // or "package"
//   }

  

//   response 
//   {
//     "success": true,
//     "message": "Item quantity increased successfully",
//     "data": {
//       "cartId": "cartId123",
//       "items": [
//         "productId123",
//         "productId123",  // The same product is added again
//         "packageId456"
//       ]
//     }
//   }
  