// import { auth } from "@/auth";
// // import { connectToDatabase, packageTable, userTable } from "@/db";
// import {
//   connectToDatabase,
//   // cartTable, productTable, packageTable,
//   dbmodels,
// } from "@/db";
// import mongoose from "mongoose";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// // Initialize Stripe with your secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET, {
//   apiVersion: "2022-11-15", // Ensure you're using a valid API version
// });

// export async function GET(req, res) {
//   try {
//     await connectToDatabase(mongoose);
//     const { orderTable } = dbmodels(mongoose);

//     const details = await stripe.checkout.sessions.list();
//     console.log("details:>", details.data);
//     const { metadata, payment_status } = details?.data[0] || [];
//     const { orderId } = metadata || {};
//     const orderDetails = await orderTable.findById(orderId);
//     console.log("orderDetails",orderDetails)
//     if (!orderDetails) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "something went wrong",
//         },
//         {
//           status: 400,
//         }
//       );
//     }
//     await orderTable.updateOne(
//       { _id: orderId },
//       {
//         $set: {
//           paymentStatus: payment_status === "paid" ? "completed" : "failed",
//         },
//       }
//     );
//     //   const packages = await packageTable.find();

//     //   if (!packages.length) {
//     //     return NextResponse.json(
//     //       {
//     //         success: true,
//     //         message: "No packages found",
//     //         data: [],
//     //       },
//     //       {
//     //         status: 200,
//     //       }
//     //     );
//     //   }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "packages found",
//         //   data: packages,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(" ~ GET ~ error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Error while fetching packages",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { auth } from "@/auth";
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2022-11-15", // Ensure you're using a valid API version
});

export async function GET(req, res) {
  try {
    await connectToDatabase(mongoose);
    const { orderTable, packageTable, userTable } = dbmodels(mongoose);

    const details = await stripe.checkout.sessions.list();
    console.log("details:>", details.data);
    const { metadata, payment_status } = details?.data[0] || {};
    console.log("payment_status",payment_status)
    const { orderId } = metadata || {};

    const orderDetails = await orderTable.findById(orderId);
    console.log("orderDetails", orderDetails);

    if (!orderDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 400,
        }
      );
    }

    // Check if the payment status is still pending, only update the user's minutes if pending
    if (orderDetails.paymentStatus !== "pending") {
      return NextResponse.json(
        {
          success: true,
          message: "Payment already processed, minutes won't be updated",
        },
        {
          status: 200,
        }
      );
    }
    await orderTable.updateOne(
      { _id: orderId },
      {
        $set: {
          paymentStatus: payment_status === "paid" ? "completed" : "failed",
        },
      }
    );
    if(orderDetails.packageRef.length>0){
    // Sum up the minutes from the ordered packages, considering duplicates
    const packages = await packageTable.find({
      _id: { $in: orderDetails.packageRef },
    });

    // Create a map to track the total minutes, considering duplicates
    const packageMinutesMap = new Map();

    // Count the minutes from the ordered packages, considering duplicate references
    orderDetails.packageRef.forEach((pkgRef) => {
      const pkg = packages.find((packageItem) => packageItem._id.toString() === pkgRef.toString());
      if (pkg) {
        if (typeof pkg.minutes !== 'number' || isNaN(pkg.minutes)) {
          console.warn(`Invalid minutes value for package ${pkg._id}:`, pkg.minutes);
        } else {
          // Add minutes of the package to the total, considering duplicates
          const currentMinutes = packageMinutesMap.get(pkg._id) || 0;
          packageMinutesMap.set(pkg._id, currentMinutes + pkg.minutes);
        }
      }
    });

    // Calculate the total minutes, considering duplicate packages
    const totalMinutes = Array.from(packageMinutesMap.values()).reduce((sum, minutes) => sum + minutes, 0);
    console.log("totalMinutes:", totalMinutes);

    // If totalMinutes is zero, something went wrong with the packages' minutes data
    if (totalMinutes === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid minutes found in the packages",
        },
        {
          status: 400,
        }
      );
    }

    // Get the user ID from session (assuming `auth` returns the session with user ID)
    const session = await auth();
    const userId = session?.user?.id;

    // Fetch the user's current minutes, ensure it's a valid number (if missing, default to 0)
    const user = await userTable.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    // Initialize user minutes to 0 if it's not present
    const currentMinutes = typeof user.minutes === 'number' && !isNaN(user.minutes) ? user.minutes : 0;

    // Update the user's minutes by adding the totalMinutes from the packages
    const updatedMinutes = currentMinutes + totalMinutes;

    // Update the user's minutes in the database
    await userTable.updateOne(
      { _id: userId },
      {
        $set: {
          minutes: updatedMinutes,
        },
      }
    );
  }

    // Now update the order's payment status after updating the user's minutes
    

    return NextResponse.json(
      {
        success: true,
        message: "Order processed and minutes updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while processing order",
      },
      {
        status: 500,
      }
    );
  }
}
