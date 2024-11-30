import { auth } from "@/auth";
// import { connectToDatabase, storeTable, userTable } from "@/db";
import { connectToDatabase, 
    // cartTable, productTable, packageTable,
    dbmodels } from "@/db";
    import mongoose from 'mongoose';
import { NextResponse } from "next/server";

// http://localhost:3000/api/store
// body = {
//     "name": "Store of John",
//     "address": "S.G. Highway",
//     "phone": 9999988888,
//     "staff": "672f76a07547cf71219e2e6b",
//     "googleMapEmbed": "https://www.google.com/maps/embed?pb=..."
// }

export async function POST(req) {
    try {
        // Log the raw incoming request body before parsing
        const body = await req.json();
        console.log("Raw request body:", JSON.stringify(body, null, 2));  // Pretty print the body

        // Extracting data from the parsed JSON
        const { name, address, phone, staff, googleMapEmbed } = body;
        console.log("Extracted data:", { name, address, phone, staff, googleMapEmbed });

        // If googleMapEmbed exists, map it to coordinates (store it as a string)
        const coordinates = googleMapEmbed || "";
        console.log("Mapped coordinates:", coordinates);

        // Validate required fields
        if (!name || !address || !phone || !staff) {
            console.log("Validation failed for required fields. Missing values:");
            if (!name) console.log("name is required");
            if (!address) console.log("address is required");
            if (!phone) console.log("phone is required");
            if (!staff) console.log("staff is required");

            return NextResponse.json(
                {
                    success: false,
                    message: "All fields (name, address, phone, staff) are required.",
                },
                { status: 400 }
            );
        }

        // Validate if googleMapEmbed is a valid URL (this is the only validation needed)
        if (googleMapEmbed && !/^https?:\/\/[^\s]+$/.test(googleMapEmbed)) {
            console.log("Invalid Google Maps Embed URL detected. URL:", googleMapEmbed);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Google Maps Embed URL format.",
                },
                { status: 400 }
            );
        }

        // Connect to the database
        console.log("Connecting to the database...");
        await connectToDatabase(mongoose);
        const { userTable, storeTable} = dbmodels(mongoose);

        // Check if the user is authenticated
        console.log("Checking if the user is authenticated...");
        const session = await auth();
        if (!session) {
            console.log("User not authenticated.");
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // Retrieve user details to verify admin role
        console.log("Retrieving user details to verify admin role...");
        const userDetails = await userTable
            .findOne({ _id: session?.user?.id })
            .exec();
        if (!userDetails) {
            console.log("User details not found.");
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { role } = userDetails || {};
        if (role !== "admin") {
            console.log("User role is not admin. Role:", role);
            return NextResponse.json(
                {
                    success: false,
                    message: "Permission denied",
                },
                { status: 403 }
            );
        }

        // Check if the store already exists by name
        console.log("Checking if the store already exists by name:", name);
        const store = await storeTable.findOne({ name }).exec();
        if (store) {
            console.log("Store already exists:", store);
            return NextResponse.json(
                {
                    success: false,
                    message: "Store already exists",
                },
                { status: 400 }
            );
        }

        // Create the new store document with coordinates (googleMapEmbed as a string)
        console.log("Creating new store with coordinates:", coordinates);
        const newStore = await storeTable.create({
            name,
            address,
            phone,
            staff,
            coordinates, // Store the googleMapEmbed as coordinates (string)
        });

        // Respond with success message and the newly created store
        return NextResponse.json(
            {
                success: true,
                message: "New store added",
                data: newStore,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("🚀 ~ POST ~ error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error while adding store",
            },
            {
                status: 500,
            }
        );
    }
}



export async function GET(req, res) {
    try {
        await connectToDatabase(mongoose);
        const {  storeTable} = dbmodels(mongoose);

        const stores = await storeTable.find();

        if (!stores.length) {
            return NextResponse.json(
                {
                    success: true,
                    message: "No Stores found",
                    data: [],
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Stores fetched",
                data: stores,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error while fetching stores",
            },
            {
                status: 500,
            }
        );
    }
}










// import { auth } from "@/auth";
// import { connectToDatabase, storeTable, userTable } from "@/db";
// import { NextResponse } from "next/server";

// //http://localhost:3000/api/store
// // body={
// //     "name": "Store of John",
// //     "address": "S.G. Highway",
// //     "phone":9999988888,
// //     "staff":"672f76a07547cf71219e2e6b"
// // }
// export async function POST(req, res) {
//     try {
//         const { name, address, phone, staff } = await req.json();

//         if (!name || !address || !phone || !staff) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "All fields (name, address, phone,staff ) are required.",
//                 },
//                 { status: 400 }
//             );
//         }

//         await connectToDatabase();
//         const session = await auth();
//         if (!session) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "unauthorized",
//                 },
//                 {
//                     status: 401,
//                 }
//             );
//         }

//         const userDetails = await userTable
//             .findOne({ _id: session?.user?.id })
//             .exec();
//         if (!userDetails) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "unauthorized",
//                 },
//                 {
//                     status: 401,
//                 }
//             );
//         }

//         const { role } = userDetails || {};
//         if (role != "admin") {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "Permission denied",
//                 },
//                 {
//                     status: 403,
//                 }
//             );
//         }

//         const store = await storeTable.findOne({ name }).exec();

//         //If store already exist then return error
//         if (store) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "store already exist",
//                 },
//                 { status: 400 }
//             );
//         }

//         //Create New store
//         const newStore = await storeTable.create({
//             name,
//             address,
//             phone,
//             staff,
//         });

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "New store added",
//                 data: newStore,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.log("🚀 ~ POST ~ error:", error)
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: error.messag || error || "Error while adding store",
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }


// export async function GET(req, res) {
//     try {
//         await connectToDatabase();

//         const stores = await storeTable.find();

//         if (!stores.length) {
//             return NextResponse.json(
//                 {
//                     success: true,
//                     message: "No Stores found",
//                     data: [],
//                 },
//                 {
//                     status: 200,
//                 }
//             );
//         }

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Stores fetched",
//                 data: stores,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: error.message || "Error while fetching stores",
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }