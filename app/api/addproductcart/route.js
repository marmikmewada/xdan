import { NextResponse } from "next/server";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
import { auth } from "@/auth"; // Assuming you have an auth function to get the session
import mongoose from 'mongoose';
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
    const { cartTable, productTable,packageTable } = dbmodels(mongoose);
    // Step 3: Parse the incoming request body (we just expect an itemId)
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 });
    }

    // Step 4: Check if the itemId is valid and exists in either the product or package table
    let itemExists = false;
    let itemType = null;

    // First check if it's a product
    const product = await productTable.findById(itemId);
    if (product) {
      itemExists = true;
      itemType = "product";
    }

    // Then check if it's a package
    const packageItem = await packageTable.findById(itemId);
    if (packageItem) {
      itemExists = true;
      itemType = "package";
    }

    // If neither a product nor a package exists, return an error
    if (!itemExists) {
      return NextResponse.json({ success: false, message: "Invalid product/package ID" }, { status: 400 });
    }

    // Step 5: Find or create the user's cart
    let cart = await cartTable.findOne({ userRef: userId });

    if (!cart) {
      // If no cart exists for the user, create a new cart
      cart = new cartTable({
        userRef: userId,
        items: [itemId], // Store just the itemId (not the whole object)
      });
      await cart.save();
    } else {
      // If a cart already exists, add the itemId to the existing cart's items array
      cart.items.push(itemId);
      await cart.save();
    }

    // Step 6: Return the success response with cart details
    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
      data: { cartId: cart._id, items: cart.items }, // Include cart details in the response
    });

  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error adding item to cart.",
    }, { status: 500 });
  }
}





// // app/api/cart/route.js (POST)

// import { NextResponse } from "next/server";
// import { connectToDatabase, cartTable, productTable, packageTable } from "@/db";
// import { auth } from "@/auth";

// export async function POST(req) {
//     try {
//         const { productId, packageId } = await req.json();

//         // Ensure either productId or packageId is provided, but not both
//         if (!productId && !packageId) {
//             return NextResponse.json({ success: false, message: "Either productId or packageId is required." }, { status: 400 });
//         }

//         const session = await auth();
//         const userId = session?.user?.id;

//         if (!userId) {
//             return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
//         }

//         await connectToDatabase();

//         // Retrieve or create cart
//         let cart = await cartTable.findOne({ userRef: userId });
//         if (!cart) {
//             cart = new cartTable({ userRef: userId, items: [], cartTotal: 0 });
//         }

//         // Determine item details
//         let itemPrice = 0;
//         let itemRef = {};

//         if (productId) {
//             const product = await productTable.findById(productId);
//             if (!product) {
//                 return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
//             }
//             itemPrice = product.price;
//             itemRef.productRef = productId;
//         } else if (packageId) {
//             const packageItem = await packageTable.findById(packageId);
//             if (!packageItem) {
//                 return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
//             }
//             itemPrice = packageItem.price;
//             itemRef.packageRef = packageId;
//         }

//         // Update cart items, setting quantity directly to 1
//         const existingItemIndex = cart.items.findIndex(item =>
//             item.productRef?.toString() === productId || item.packageRef?.toString() === packageId
//         );

//         if (existingItemIndex > -1) {
//             // If item already exists in the cart, ignore additional requests for the same item
//             return NextResponse.json({ success: false, message: "Item already in cart." }, { status: 400 });
//         } else {
//             // Add new item with quantity of 1
//             cart.items.push({ ...itemRef, quantity: 1, price: itemPrice });
//         }

//         // Recalculate cart total
//         cart.cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

//         await cart.save();

//         return NextResponse.json({
//             success: true,
//             message: "Item added to cart successfully",
//             data: cart
//         }, { status: 200 });

//     } catch (error) {
//         console.log("error", error);
//         return NextResponse.json({
//             success: false,
//             message: error.message || "Error while adding item to cart"
//         }, { status: 500 });
//     }
// }
