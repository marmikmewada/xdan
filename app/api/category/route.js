import clientPromise from "@/db-old";
import { NextResponse } from "next/server";

//http://localhost:3001/api/category
export async function POST(req, res) {
  try {
    const { name, created_by } = await req.json();

    if (!name || !created_by) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (name, created_by ) are required.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("e-com");

    const existingUser = await db.collection("category").findOne({ name });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "category already exist",
        },
        { status: 400 }
      );
    }
    const newUser = await db.collection("category").insertOne({
      name,
      created_by,
    });

    return NextResponse.json(
      {
        success: true,
        message: "category created",
        data: newUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while creating category",
      },
      {
        status: 500,
      }
    );
  }
}
