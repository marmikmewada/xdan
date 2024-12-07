import { NextResponse } from "next/server";
// import { connectToDatabase, cartTable, productTable, packageTable } from "@/db";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from 'mongoose';
import { auth } from "@/auth"; // Assuming you have an auth function to get the session

export async function GET(req) {
  try {
    // Step 1: Get user ID from session
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User is not authenticated" }, { status: 401 });
    }

    // Step 2: Connect to the database
    await connectToDatabase(mongoose);
    const { cartTable, productTable, packageTable } = dbmodels(mongoose);

    // Step 3: Find the user's cart
    const cart = await cartTable.findOne({ userRef: userId });

    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found." }, { status: 404 });
    }

    // Step 4: Initialize cart details and total price
    let totalPrice = 0;
    let cartItems = [];
    let processedItems = new Set(); // To track unique items

    // Step 5: Loop through items and fetch details
    for (const itemId of cart.items) {
      if (processedItems.has(itemId.toString())) {
        continue; // Skip if the item has already been processed
      }
      
      // Count the quantity of this item in the cart
      const quantity = cart.items.filter(id => id.toString() === itemId.toString()).length;

      // Check if it's a product
      const product = await productTable.findById(itemId);
      if (product) {
        cartItems.push({
          itemId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          type: 'product',
          imageUrl: product.imageUrl.length > 0 ? product.imageUrl[0] : null, // Send only the first image (zeroth index)
        });
        totalPrice += product.price * quantity; // Add price * quantity to total
        processedItems.add(itemId.toString()); // Mark as processed
      }

      // Check if it's a package
      const packageItem = await packageTable.findById(itemId);
      if (packageItem) {
        cartItems.push({
          itemId: packageItem._id,
          name: packageItem.name,
          price: packageItem.price,
          quantity: quantity,
          type: 'package',
          imageUrl: packageItem.imageUrl.length > 0 ? packageItem.imageUrl[0] : null, // Send only the first image (zeroth index)
        });
        totalPrice += packageItem.price * quantity; // Add price * quantity to total
        processedItems.add(itemId.toString()); // Mark as processed
      }
    }

    // Step 6: Return the cart details with the total price
    return NextResponse.json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        items: cartItems, // All items in the cart with correct quantities and no duplicates
        cartTotal: totalPrice, // The correct total price based on quantities
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error fetching cart.",
    }, { status: 500 });
  }
}




// import { NextResponse } from "next/server";
// // import { connectToDatabase, cartTable, productTable, packageTable } from "@/db";
// import { connectToDatabase, 
//   // cartTable, productTable, packageTable,
//   dbmodels } from "@/db";
//   import mongoose from 'mongoose';
// import { auth } from "@/auth"; // Assuming you have an auth function to get the session

// export async function GET(req) {
//   try {
//     // Step 1: Get user ID from session
//     const session = await auth();
//     const userId = session?.user?.id;

//     if (!userId) {
//       return NextResponse.json({ success: false, message: "User is not authenticated" }, { status: 401 });
//     }

//     // Step 2: Connect to the database
//     await connectToDatabase(mongoose);
//     const { cartTable,productTable,packageTable } = dbmodels(mongoose);

//     // Step 3: Find the user's cart
//     const cart = await cartTable.findOne({ userRef: userId });

//     if (!cart) {
//       return NextResponse.json({ success: false, message: "Cart not found." }, { status: 404 });
//     }

//     // Step 4: Initialize cart details and total price
//     let totalPrice = 0;
//     let cartItems = [];
//     let processedItems = new Set(); // To track unique items

//     // Step 5: Loop through items and fetch details
//     for (const itemId of cart.items) {
//       if (processedItems.has(itemId.toString())) {
//         continue; // Skip if the item has already been processed
//       }
      
//       // Count the quantity of this item in the cart
//       const quantity = cart.items.filter(id => id.toString() === itemId.toString()).length;

//       // Check if it's a product
//       const product = await productTable.findById(itemId);
//       if (product) {
//         cartItems.push({
//           itemId: product._id,
//           name: product.name,
//           price: product.price,
//           quantity: quantity,
//           type: 'product',
//         });
//         totalPrice += product.price * quantity; // Add price * quantity to total
//         processedItems.add(itemId.toString()); // Mark as processed
//       }

//       // Check if it's a package
//       const packageItem = await packageTable.findById(itemId);
//       if (packageItem) {
//         cartItems.push({
//           itemId: packageItem._id,
//           name: packageItem.name,
//           price: packageItem.price,
//           quantity: quantity,
//           type: 'package',
//         });
//         totalPrice += packageItem.price * quantity; // Add price * quantity to total
//         processedItems.add(itemId.toString()); // Mark as processed
//       }
//     }

//     // Step 6: Return the cart details with the total price
//     return NextResponse.json({
//       success: true,
//       message: "Cart fetched successfully",
//       data: {
//         items: cartItems, // All items in the cart with correct quantities and no duplicates
//         cartTotal: totalPrice, // The correct total price based on quantities
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({
//       success: false,
//       message: error.message || "Error fetching cart.",
//     }, { status: 500 });
//   }
// }




// {
//     "success": true,
//     "message": "Cart fetched successfully",
//     "data": {
//       "items": [
//         {
//           "name": "Product A",
//           "price": 20,
//           "quantity": 2,
//           "type": "product"
//         },
//         {
//           "name": "Package B",
//           "price": 50,
//           "quantity": 1,
//           "type": "package"
//         }
//       ],
//       "cartTotal": 90
//     }
//   }
  








// // app/api/cart/route.js

// import { NextResponse } from "next/server";
// import { connectToDatabase,cartTable } from "@/db";
// import { auth } from "@/auth";


// export async function GET(req) {
//     try {
//         // Get the current user's session (you should implement session fetching from your auth system)
//         const session = await auth();  // Assuming you have an auth method to get session data
//         const userId = session?.user?.id;

//         if (!userId) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Unauthorized. Please log in first."
//             }, { status: 401 });
//         }

//         await connectToDatabase();

//         // Find the user's cart
//         const cart = await cartTable.findOne({ userRef: userId });

//         if (!cart) {
//             return NextResponse.json({
//                 success: false,
//                 message: "No cart found for this user."
//             }, { status: 404 });
//         }

//         // Return the cart details (items, total, etc.)
//         return NextResponse.json({
//             success: true,
//             data: cart
//         }, { status: 200 });

//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message || "Error while fetching cart"
//         }, { status: 500 });
//     }
// }
