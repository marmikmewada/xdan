import { connectToDatabase, userTable } from "@/db";
import { NextResponse } from "next/server";
import { signIn } from "@/auth"; // Adjust this import based on your file structure

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (email, password) are required.",
        },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

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

    // Check if the password matches
    if (existingUser.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password",
        },
        { status: 400 }
      );
    }

    // Use NextAuth's signIn function directly
    const loginResponse = await signIn('credentials', {
      redirect: false, // Do not redirect, just return the response
      email: existingUser.email,
      password,
    });

    if (loginResponse.error) {
      return NextResponse.json({
        success: false,
        message: loginResponse.error,
      }, { status: 400 });
    }

    const responseData = {
      success: true,
      message: "Logged in successfully",
      data: {
        id: existingUser._id.toString(),
        name: existingUser.name,
        email: existingUser.email,
        twofa: existingUser.twofa,
      },
    };

    // Redirect based on 2FA status
    if (existingUser.twofa) {
      return NextResponse.json({
        ...responseData,
        redirectTo: '/2fa-setup',
      });
    } else {
      return NextResponse.json({
        ...responseData,
        redirectTo: '/home',
      });
    }
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while logging in",
      },
      {
        status: 500,
      }
    );
  }
}
