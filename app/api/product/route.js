import clientPromise from "@/db-old";
import { NextResponse } from "next/server";

//http://localhost:3001/api/product
export async function POST(req, res) {
  try {
    const { name, category, price, created_by } = await req.json();

    if (!name || !category || !price || !created_by) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields (name, category, price, created_by ) are required.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("e-com");

    const existingUser = await db.collection("products").findOne({ name });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "product already exist",
        },
        { status: 400 }
      );
    }
    const newUser = await db.collection("products").insertOne({
      name,
      category,
      price,
      created_by,
    });

    return NextResponse.json(
      {
        success: true,
        message: "product added",
        data: newUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while adding product",
      },
      {
        status: 500,
      }
    );
  }
}
