// import { connectToDatabase, userTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

//http://localhost:3000/api/auth/reset-password?email=am9obkBtYWlsaW5hdG9yLmNvbQ==
// body={
//   "email": "john@mailinator.com",
//   "password": "John@123"
// }
// response={
//     "success": true,
//     "message": "password updated"
// }
export async function POST(req, res) {
  try {
    const {  password: new_password } = await req.json();
    const { searchParams } = new URL(req.url);

    const token = searchParams.get('token');
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const {email}=decoded||{}
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "email is required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { userTable} = dbmodels(mongoose);

    const existingUser = await userTable.findOne({ email }).exec();
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);

    await userTable.findOneAndUpdate(
      {
        email,
      },
      {
        password: new_password,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "password updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while updating password",
      },
      {
        status: 500,
      }
    );
  }
}
