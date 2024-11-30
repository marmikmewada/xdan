import { NextResponse } from "next/server";
// import { connectToDatabase, cartTable } from "@/db";
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
    const { cartTable } = dbmodels(mongoose);

    // Step 3: Parse the incoming request body
    const { itemId } = await req.json(); // Only itemId is needed

    // Step 4: Find the user's cart
    let cart = await cartTable.findOne({ userRef: userId });

    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }

    // Step 5: Remove all instances of the item from the cart
    cart.items = cart.items.filter(id => id.toString() !== itemId.toString());

    // Step 6: Save the updated cart
    await cart.save();

    // Step 7: Return success response with updated cart
    return NextResponse.json({
      success: true,
      message: "Item(s) removed from cart successfully",
      data: { cartId: cart._id, items: cart.items },
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message || "Error removing item from cart." }, { status: 500 });
  }
}




// // app/api/cart/route.js (DELETE)

// import { NextResponse } from "next/server";
// import { connectToDatabase,cartTable } from "@/db";
//   // Your Cart model
//   import { auth } from "@/auth";

// export async function DELETE(req) {
//     try {
//         const { itemId } = await req.json();
//         const session = await auth();  // Assuming you have an auth method to get session data
//         const userId = session?.user?.id;

//         if (!userId || !itemId) {
//             return NextResponse.json({
//                 success: false,
//                 message: "User ID and Item ID are required."
//             }, { status: 400 });
//         }

//         await connectToDatabase();

//         const cart = await cartTable.findOne({ userRef: userId });

//         if (!cart) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Cart not found."
//             }, { status: 404 });
//         }

//         const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

//         if (itemIndex === -1) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Item not found in cart."
//             }, { status: 404 });
//         }

//         // Remove the item
//         cart.items.splice(itemIndex, 1);

//         // Recalculate the total
//         cart.cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

//         await cart.save();

//         return NextResponse.json({
//             success: true,
//             message: "Item removed from cart successfully",
//             data: cart
//         }, { status: 200 });

//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message || "Error while removing item from cart"
//         }, { status: 500 });
//     }
// }
