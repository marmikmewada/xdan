import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  connectToDatabase,
  dbmodels,
} from "@/db";
import mongoose from "mongoose";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2022-11-15", // Ensure you're using a valid API version
});

export async function POST(req) {
  try {
    const { paymentMethod, orderType, deliveryAddress } = await req.json();
    console.log(" ~ POST ~ deliveryAddress:", deliveryAddress)

    // Connect to the database
    await connectToDatabase(mongoose);

    const { userTable, cartTable, productTable, packageTable, orderTable } = dbmodels(mongoose); // Assuming orderTable is your order model
    const session = await auth();

    // Check if the session is valid
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user details from the database
    const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find the user's cart
    const userCart = await cartTable.findOne({ userRef: userDetails._id }).exec();

    if (!userCart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Fetch product and package details based on cart items
    const productItems = await productTable.find({
      _id: { $in: userCart.items },
    });


    const packageItems = await packageTable.find({
      _id: { $in: userCart.items },
    });


    // Initialize the fields for the new order
    const productRefs = [];
    const packageRefs = [];
    let totalAmount = 0;

    // Add products to order fields and calculate total amount
    for (const product of productItems) {
      productRefs.push(product._id);
      totalAmount += product.price;  // Assuming each product has a 'price' field
    }

    // Add packages to order fields and calculate total amount
    for (const pkg of packageItems) {
      packageRefs.push(pkg._id);
      totalAmount += pkg.price;  // Assuming each package has a 'price' field
    }

    // If the cart is empty, return an error
    if (productRefs.length === 0 && packageRefs.length === 0) {
      console.log("Cart is empty, no items found.");
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Handle payment details (This can be customized based on your requirements)
    // const paymentMethod = req.body.paymentMethod || 'pay-on-pickup';  // Default to 'pay-on-pickup' if not provided
    // const orderType = req.body.orderType || 'pickup';  // Default to 'pickup'
    // const deliveryAddress = req.body.deliveryAddress || null;  // Optional, only required if 'delivery' is chosen

    // First, calculate the delivery charges based on orderType
    const deliveryCharges = orderType === 'delivery' ? 7.5 : 0;

    // Update the totalAmount to include delivery charges
    totalAmount += deliveryCharges;

    // Create the order document
    const orderData = {
      userRef: userDetails._id,
      productRef: productRefs,
      packageRef: packageRefs,
      totalAmount,
      orderType,  // pickup or delivery
      statusForUser: 'placed',  // Initial status is 'placed'
      paymentMethod,
      paymentStatus: 'pending',  // Payment status starts as 'pending'
      deliveryAddress,  // Only set if delivery is chosen
      deliveryCharges: deliveryCharges, // Add this field to track delivery charges
    };

    const newOrder = new orderTable(orderData);
    await newOrder.save();

    const stripe_session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...productItems.map(product => ({
          price_data: {
            currency: "gbp",
            product_data: {
              name: product.name,
              description: product.description || '',
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        })),
        ...packageItems.map(pkg => ({
          price_data: {
            currency: "gbp",
            product_data: {
              name: pkg.name,
              description: pkg.description || '',
            },
            unit_amount: Math.round(pkg.price * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        })),
        // Add delivery charges as a separate line item if applicable
        ...(orderType === 'delivery' ? [{
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Delivery Charges",
              description: "Standard delivery fee",
            },
            unit_amount: 750, // £7.50 in pence
          },
          quantity: 1,
        }] : [])
      ],
      metadata: {
        orderId: newOrder._id.toString(),
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/transection-successful?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
    });
console.log("stripe_session.status",stripe_session)
    // if (orderData.paymentStatus === "paid"&&){
    //   await cartTable.updateOne(
    //     { userRef: userDetails._id },  // Match the user by userRef
    //     { $set: { items: [] } }  // Set the items array to empty
    //   );
    // }
    // Save the new order to the database
    

    // Return the success response with order details
    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: {
          ...newOrder.toObject(),
          stripeUrl: stripe_session.url // Include the checkout URL
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout error:", error); // Log error for debugging
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while processing checkout",
      },
      { status: 500 }
    );
  }
}

// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import {
//   connectToDatabase,
//   dbmodels,
// } from "@/db";
// import mongoose from "mongoose";
// import Stripe from "stripe";

// // Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET, {
//   apiVersion: "2022-11-15", // Ensure you're using a valid API version
// });

// export async function POST(req) {
//   try {
//     const { paymentMethod, orderType,deliveryAddress } = await req.json();
//     console.log("paymentMethod, orderType,deliveryAddress",paymentMethod, orderType,deliveryAddress)

//     // Connect to the database
//     await connectToDatabase(mongoose);
    

//     const { userTable, cartTable, productTable, packageTable, orderTable } = dbmodels(mongoose); // Assuming orderTable is your order model
//     const session = await auth();
    

//     // Check if the session is valid
//     if (!session) {
    
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Get user details from the database
//     const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();

//     if (!userDetails) {
//       console.log("User not found");
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Find the user's cart
//     const userCart = await cartTable.findOne({ userRef: userDetails._id }).exec();
//     console.log("User cart:", userCart);

//     if (!userCart) {
//       console.log("Cart not found");
//       return NextResponse.json(
//         { success: false, message: "Cart not found" },
//         { status: 404 }
//       );
//     }

//     // Fetch product and package details based on cart items
//     const productItems = await productTable.find({
//       _id: { $in: userCart.items },
//     });
    

//     const packageItems = await packageTable.find({
//       _id: { $in: userCart.items },
//     });
    

//     // Initialize the fields for the new order
//     const productRefs = [];
//     const packageRefs = [];
//     let totalAmount = 0;

//     // Add products to order fields and calculate total amount
//     for (const product of productItems) {
//       productRefs.push(product._id);
//       totalAmount += product.price;  // Assuming each product has a 'price' field
//     }

//     // Add packages to order fields and calculate total amount
//     for (const pkg of packageItems) {
//       packageRefs.push(pkg._id);
//       totalAmount += pkg.price;  // Assuming each package has a 'price' field
//     }

//     // If the cart is empty, return an error
//     if (productRefs.length === 0 && packageRefs.length === 0) {
//       console.log("Cart is empty, no items found.");
//       return NextResponse.json(
//         { success: false, message: "Cart is empty" },
//         { status: 400 }
//       );
//     }

//     // Handle payment details (This can be customized based on your requirements)
//     // const paymentMethod = req.body.paymentMethod || 'pay-on-pickup';  // Default to 'pay-on-pickup' if not provided
//     // const orderType = req.body.orderType || 'pickup';  // Default to 'pickup'
//     // const deliveryAddress = req.body.deliveryAddress || null;  // Optional, only required if 'delivery' is chosen

//     // Create the order document
//     const orderData = {
//       userRef: userDetails._id,
//       productRef: productRefs,
//       packageRef: packageRefs,
//       totalAmount,
//       orderType,  // pickup or delivery
//       statusForUser: 'placed',  // Initial status is 'placed'
//       paymentMethod,
//       paymentStatus: 'pending',  // Payment status starts as 'pending'
//       deliveryAddress,  // Only set if delivery is chosen
//     };
//     const stripe_session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],  // Accepts card payments
//         line_items: [
//           ...productItems.map(product => ({
//             price_data: {
//               currency: "gbp",  // Use the correct currency
//               product_data: {
//                 name: product.name,
//               },
//               unit_amount: product.price * 100,  // Convert to cents
//             },
//             quantity: 1,
//           })),
//           ...packageItems.map(pkg => ({
//             price_data: {
//               currency: "gbp",  // Use the correct currency
//               product_data: {
//                 name: pkg.name,
//               },
//               unit_amount: pkg.price * 100,  // Convert to cents
//             },
//             quantity: 1,
//           }))
//         ],
//         mode: "payment",
//         success_url: `${process.env.NEXT_PUBLIC_API_URL}/payment-successful`,
//         cancel_url: `${process.env.BASE_URL}/payment-failed`,
//         metadata: {
//           orderId: newOrder._id.toString(),
//         },
//       });
//       console.log("stripe_session",stripe_session)

//     // Save the new order to the database
//     const newOrder = new orderTable(orderData);
//     await newOrder.save();
//     console.log("Order created successfully:", newOrder);

//     // Return the success response with order details
//     return NextResponse.json(
//       {
//         success: true,
//         message: "Order placed successfully",
//         order: {...newOrder,stripeSessionId:stripe_session.id},
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Checkout error:", error); // Log error for debugging
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Error while processing checkout",
//       },
//       { status: 500 }
//     );
//   }
// }

// aa cart items array chhe aani under thi apde package and product ne sort karvana che aene package and product table mathi find karvanu jo same item more then 1 var hoy to object quntity increase thai thay 



// const orderSchema = new mongoose.Schema(
//     {
//       userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       productRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
//       packageRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
//       totalAmount: { type: Number, required: true },
//       orderType: {
//         type: String,
//         enum: ['pickup', 'delivery']
//       },
//       givenByStaff:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
//       statusForUser: { 
//         type: String, 
//         enum: ['failed','placed', 'ready-for-pickup', 'collected'],  // Possible status values
//       },
//       detailsFromStripe: { type: Object }, // Store Stripe details if payment was through Stripe
//       paymentMethod: { 
//         type: String, 
//         enum: ['stripe', 'pay-on-pickup'],  // Allowed values: 'stripe' or 'pay-on-pickup'
//         required: true
//       },
//       paymentStatus: { 
//         type: String, 
//         enum: ['pending', 'completed', 'failed'],  // Payment status (for Stripe, or if user has paid when picking up)
//         default: 'pending'
//       },
//       deliveryAddress: {
//         type: String, // True if delivery is selected
//       },
//       usedCouponCode: {type: mongoose.Schema.Types.ObjectId, ref: "DiscountCoupon"},
//       couponDiscountAmount: {type: Number},
//     },
//     { timestamps: true }
//   );