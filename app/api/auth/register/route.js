import { connectToDatabase, dbmodels } from "@/db";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        // Destructure the request body to get the required fields
        const {
            name, 
            lastName, 
            email, 
            phone, 
            password, 
            dob, 
            gender, 
            skinType, 
            hereAbout
        } = await req.json();

        // Validate required fields
        if (!name || !lastName || !email || !phone || !password || !dob || !gender) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields (name, lastName, email, phone, password, dob, and gender) are required.",
                },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectToDatabase(mongoose);
        const { userTable } = dbmodels(mongoose);

        // Check if the user already exists
        const existingUser = await userTable.findOne({ email }).exec();

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                { status: 400 }
            );
        }

        // Create new user with the new fields
        const newUser = await userTable.create({
            name,
            lastName,
            email,
            phone,
            password,
            dob,
            gender,
            skinType,   // Optional
            hereAbout   // Optional
        });
        const token=jwt.sign({email,password }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                user: {...newUser,token},
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("🚀 ~ POST ~ error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error creating user",
            },
            { status: 500 }
        );
    }
}



// // import { connectToDatabase, userTable } from "@/db";
// import { connectToDatabase, 
//     // cartTable, productTable, packageTable,
//     dbmodels } from "@/db";
// import { NextResponse } from "next/server";
// import mongoose from 'mongoose';
// //http://localhost:3000/api/auth/register
// // body={
// //     "name": "John",
// //     "lastName": "Doe",
// //     "email": "john@mailinator.com",
// //     "phone": 9999999999,
// //     "password": "John@123",
// //     "dob": "02/11/2000"
// // }
// // response:{
// //     "success": true,
// //     "message": "User registered successfully",
// //     "user": {
// //         "name": "John",
// //         "lastName": "Doe",
// //         "dob": "2000-02-10T18:30:00.000Z",
// //         "email": "john@mailinator.com",
// //         "password": "John@123",
// //         "phone": "9999999999",
// //         "twofa": true,
// //         "newsletter": false,
// //         "couponUsage": [],
// //         "role": "user",
// //         "_id": "672f76a07547cf71219e2e6b",
// //         "createdAt": "2024-11-09T14:50:08.377Z",
// //         "updatedAt": "2024-11-09T14:50:08.377Z",
// //         "__v": 0
// //     }
// // }
// export async function POST(req) {
//     try {
//         // Destructure the request body to get the required fields
//         const { name, lastName, email, phone, password, dob } = await req.json();

//         // Validate required fields
//         if (!name || !lastName || !email || !phone || !password || !dob) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "All fields (name, lastName, email, phone, password, dob) are required.",
//                 },
//                 { status: 400 }
//             );
//         }

//         // Connect to the database
//         await connectToDatabase(mongoose);
//         const { userTable} = dbmodels(mongoose);

//         // Check if the user already exists
//         const existingUser = await userTable.findOne({ email }).exec();

//         if (existingUser) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: "User already exists",
//                 },
//                 { status: 400 }
//             );
//         }

//         // Create new user without hashing the password
//         const newUser = await userTable.create({ name, lastName, email, phone, password, dob });

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "User registered successfully",
//                 user: newUser,
//             },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("🚀 ~ POST ~ error:", error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: error.message || "Error creating user",
//             },
//             { status: 500 }
//         );
//     }
// }
