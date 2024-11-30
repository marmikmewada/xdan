// import { connectToDatabase, userTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { sendPasswordResetEmail } from "@/utils/send-mail";
import { NextResponse } from "next/server";

//http://localhost:3001/api/auth/forgot-password
// body={
//   email: "abc@gmail.com"
// }
// response={
//   "success": true,
//   "message": "mail sent please check you mail box"
// }
export async function POST(req, res) {
  try {
    const { email } = await req.json();

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

    // Find the existing user by email
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

    const encryptedEmail = Buffer.from(email).toString('base64'); //on frontend we have to decrypt this email using Buffer.from(encodedText, 'base64').toString('utf-8')
    const resetPasswordUrl = `http://localhost:3000/api/auth/reset-password?email=${encryptedEmail}`;

    await sendPasswordResetEmail(existingUser.email, existingUser.name, resetPasswordUrl);

    return NextResponse.json(
      {
        success: true,
        message: "mail sent please check you mail box",
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
