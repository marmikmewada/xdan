import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";
import Stripe from "stripe";
import { type } from "os";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2022-11-15", // Ensure you're using a valid API version
});

export async function POST(req) {
  try {
    const { paymentMethod, orderType, deliveryAddress, couponCode } =
      await req.json();

    // Connect to the database
    await connectToDatabase(mongoose);

    const {
      userTable,
      cartTable,
      productTable,
      packageTable,
      orderTable,
      discountCouponTable,
    } = dbmodels(mongoose);

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user details
    const userDetails = await userTable.findById(session.user.id).exec();

    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Validate coupon if provided
    let discountAmount = 0;
    let validCoupon = null;

    if (couponCode) {
      validCoupon = await discountCouponTable.findOne({ couponCode }).exec();

      if (!validCoupon) {
        return NextResponse.json(
          { success: false, message: "Invalid coupon code" },
          { status: 400 }
        );
      }

      if (validCoupon.expiry < new Date()) {
        return NextResponse.json(
          { success: false, message: "Coupon has expired" },
          { status: 400 }
        );
      }

      if (validCoupon.usage >= validCoupon.maxUsage) {
        return NextResponse.json(
          { success: false, message: "Coupon usage limit exceeded" },
          { status: 400 }
        );
      }

      const isCouponUsed = userDetails.couponUsage.includes(validCoupon._id);

      if (isCouponUsed) {
        return NextResponse.json(
          { success: false, message: "Coupon already used by this user" },
          { status: 400 }
        );
      }

      // Calculate discount amount (percentage)
      discountAmount = validCoupon.percentage / 100; // Percentage as a fraction
    }

    // Fetch user's cart
    const userCart = await cartTable.findOne({ userRef: userDetails._id }).exec();

    if (!userCart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Calculate total amount and fetch items
    const productItems = await productTable.find({
      _id: { $in: userCart.items },
    });
    const packageItems = await packageTable.find({
      _id: { $in: userCart.items },
    });

    let baseTotalAmount = 0; // This will store the base total before discount or delivery charges
    const productRefs = [];
    const packageRefs = [];

    productItems.forEach((product) => {
      const quantity = userCart.items.filter(
        (item) => item.toString() === product._id.toString()
      ).length;
      for (let i = 0; i < quantity; i++) {
        productRefs.push(product._id);
        baseTotalAmount += product.price;
      }
    });

    packageItems.forEach((pkg) => {
      const quantity = userCart.items.filter(
        (item) => item.toString() === pkg._id.toString()
      ).length;
      for (let i = 0; i < quantity; i++) {
        packageRefs.push(pkg._id);
        baseTotalAmount += pkg.price;
      }
    });

    if (productRefs.length === 0 && packageRefs.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Apply discount
    const discountAmountValue = Math.floor(baseTotalAmount * discountAmount);
    let totalAmount = baseTotalAmount - discountAmountValue;

    // Add delivery charges if applicable
    const deliveryCharges = orderType === "delivery" ? 7.5 : 0;
    totalAmount += deliveryCharges;

    // Create order data
    const orderData = {
      userRef: userDetails._id,
      productRef: productRefs,
      packageRef: packageRefs,
      totalAmount,
      orderType,
      statusForUser: "placed",
      paymentMethod,
      paymentStatus: "pending",
      deliveryAddress,
      deliveryCharges,
      usedCouponCode: validCoupon?._id,
      couponDiscountAmount: discountAmountValue,
    };

    const newOrder = new orderTable(orderData);
    await newOrder.save();

    if (validCoupon && paymentMethod === "pay-on-pickup") {
      await userTable.findByIdAndUpdate(userDetails._id, {
        $push: { couponUsage: validCoupon._id },
      });
      await discountCouponTable.findByIdAndUpdate(validCoupon._id, {
        $inc: { usage: 1 },
      });
    }

    // Create a one-time use coupon for Stripe if a discount exists
    let stripeCouponId = null;
    if (discountAmount > 0) {
      try {
        // Discount applied to the base amount, converting to pence (multiply by 100)
        const stripeCoupon = await stripe.coupons.create({
          amount_off: Math.round(discountAmountValue * 100), // Applying discount to the total amount in pence
          currency: 'gbp',
          duration: 'once', // This makes it a one-time use coupon
        });

        stripeCouponId = stripeCoupon.id; // Store the coupon ID for future use in the Stripe session
      } catch (error) {
        console.error("Error creating Stripe coupon:", error);
        return NextResponse.json(
          { success: false, message: "Error creating Stripe coupon" },
          { status: 500 }
        );
      }
    }

    // Proceed to create the Stripe session
    const stripe_session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...productItems.map((product) => ({
          price_data: {
            currency: "gbp",
            product_data: { name: product.name },
            unit_amount: Math.round(product.price * 100), // Price in pence
          },
          quantity: userCart.items.filter(
            (item) => item.toString() === product._id.toString()
          ).length,
        })),
        ...packageItems.map((pkg) => ({
          price_data: {
            currency: "gbp",
            product_data: { name: pkg.name },
            unit_amount: Math.round(pkg.price * 100), // Price in pence
          },
          quantity: userCart.items.filter(
            (item) => item.toString() === pkg._id.toString()
          ).length,
        })),
        ...(orderType === "delivery"
          ? [
              {
                price_data: {
                  currency: "gbp",
                  product_data: { name: "Delivery Charges" },
                  unit_amount: 750, // £7.50 in pence
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      discounts: discountAmountValue > 0
        ? [
            {
              coupon: stripeCouponId, // Apply the dynamic one-time coupon created above
            },
          ]
        : [],
      metadata: { orderId: newOrder._id.toString() },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/transection-successful?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order: { ...newOrder.toObject(), stripeUrl: stripe_session.url },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error while processing checkout" },
      { status: 500 }
    );
  }
}


// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import { connectToDatabase, dbmodels } from "@/db";
// import mongoose from "mongoose";
// import Stripe from "stripe";

// // Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET, {
//   apiVersion: "2022-11-15", // Ensure you're using a valid API version
// });

// export async function POST(req) {
//   try {
//     const { paymentMethod, orderType, deliveryAddress } = await req.json();

//     // Connect to the database
//     await connectToDatabase(mongoose);

//     const { userTable, cartTable, productTable, packageTable, orderTable } =
//       dbmodels(mongoose);
//     const session = await auth();

//     // Check if the session is valid
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Get user details from the database
//     const userDetails = await userTable
//       .findOne({ _id: session?.user?.id })
//       .exec();

//     if (!userDetails) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Find the user's cart
//     const userCart = await cartTable
//       .findOne({ userRef: userDetails._id })
//       .exec();

//     if (!userCart) {
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

//     // Handle product references and calculate total amount
//     productItems.forEach((product) => {
//       // Count how many times this product appears in the cart
//       const quantity = userCart.items.filter(
//         (item) => item.toString() === product._id.toString()
//       ).length;
//       for (let i = 0; i < quantity; i++) {
//         productRefs.push(product._id); // Add the product reference multiple times
//         totalAmount += product.price; // Multiply price by quantity (just adding price per unit since we handle quantity above)
//       }
//     });

//     // Handle package references and calculate total amount
//     packageItems.forEach((pkg) => {
//       // Count how many times this package appears in the cart
//       const quantity = userCart.items.filter(
//         (item) => item.toString() === pkg._id.toString()
//       ).length;
//       for (let i = 0; i < quantity; i++) {
//         packageRefs.push(pkg._id); // Add the package reference multiple times
//         totalAmount += pkg.price; // Multiply price by quantity (just adding price per unit since we handle quantity above)
//       }
//     });

//     // If the cart is empty, return an error
//     if (productRefs.length === 0 && packageRefs.length === 0) {
//       console.log("Cart is empty, no items found.");
//       return NextResponse.json(
//         { success: false, message: "Cart is empty" },
//         { status: 400 }
//       );
//     }

//     // Handle payment details (This can be customized based on your requirements)
//     // Calculate the delivery charges based on orderType
//     const deliveryCharges = orderType === "delivery" ? 7.5 : 0;

//     // Update the totalAmount to include delivery charges
//     totalAmount += deliveryCharges;

//     // Create the order document with updated productRefs, packageRefs, and totalAmount
//     const orderData = {
//       userRef: userDetails._id,
//       productRef: productRefs, // Array of product references, including duplicates
//       packageRef: packageRefs, // Array of package references, including duplicates
//       totalAmount,
//       orderType, // pickup or delivery
//       statusForUser: "placed", // Initial status is 'placed'
//       paymentMethod,
//       paymentStatus: "pending", // Payment status starts as 'pending'
//       deliveryAddress, // Only set if delivery is chosen
//       deliveryCharges, // Add this field to track delivery charges
//     };

//     const newOrder = new orderTable(orderData);
//     await newOrder.save();

//     if (paymentMethod === "stripe") {
//       // Create Stripe checkout session with the correct quantity of items
//       const stripe_session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: [
//           ...productItems.map((product) => ({
//             price_data: {
//               currency: "gbp",
//               product_data: {
//                 name: product.name,
//                 description: product.description || "",
//               },
//               unit_amount: Math.round(product.price * 100), // Convert to cents and ensure it's an integer
//             },
//             quantity: userCart.items.filter(
//               (item) => item.toString() === product._id.toString()
//             ).length, // Pass the correct quantity from cart
//           })),
//           ...packageItems.map((pkg) => ({
//             price_data: {
//               currency: "gbp",
//               product_data: {
//                 name: pkg.name,
//                 description: pkg.description || "",
//               },
//               unit_amount: Math.round(pkg.price * 100), // Convert to cents and ensure it's an integer
//             },
//             quantity: userCart.items.filter(
//               (item) => item.toString() === pkg._id.toString()
//             ).length, // Pass the correct quantity from cart
//           })),
//           // Add delivery charges as a separate line item if applicable
//           ...(orderType === "delivery"
//             ? [
//                 {
//                   price_data: {
//                     currency: "gbp",
//                     product_data: {
//                       name: "Delivery Charges",
//                       description: "Standard delivery fee",
//                     },
//                     unit_amount: 750, // £7.50 in pence
//                   },
//                   quantity: 1,
//                 },
//               ]
//             : []),
//         ],
//         metadata: {
//           orderId: newOrder._id.toString(),
//         },
//         mode: "payment",
//         success_url: `${process.env.NEXT_PUBLIC_API_URL}/transection-successful?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
//       });

//       // Return the success response with order details
//       return NextResponse.json(
//         {
//           success: true,
//           message: "Order placed successfully",
//           order: {
//             ...newOrder.toObject(),
//             stripeUrl: stripe_session.url, // Include the checkout URL
//           },
//         },
//         { status: 200 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Order placed successfully",
//         order: {
//           ...newOrder.toObject(), // Include the checkout URL
//         },
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
