import clientPromise from "@/db-old";
import { NextResponse } from "next/server";

//http://localhost:3001/api/auth/forgot-password
export async function POST(req, res) {
  try {
    const { email, password, new_password } = await req.json();

    if (!email || !password || !new_password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields ( email, password, new_password) are required.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("e-com");

    const existingUser = await db.collection("users").findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }
    const { password: user_password } = existingUser || {};
    if (password === user_password) {
      await db.collection("users").findOneAndUpdate(
        {
          email,
        },
        {
          $set: { password: new_password },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "password updated",
        data: existingUser,
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
