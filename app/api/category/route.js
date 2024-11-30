// import { categoryTable, connectToDatabase } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { NextResponse } from "next/server";

//http://localhost:3001/api/category
export async function POST(req, res) {
  try {
    const { name, description } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (name, description ) are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { categoryTable} = dbmodels(mongoose);

    const category = await categoryTable.findOne({
      name,
    });

    if (category) {
      return NextResponse.json(
        {
          success: false,
          message: "category already exist",
        },
        { status: 400 }
      );
    }

    const created_category = await categoryTable.create({
      name,
      description
    });

    return NextResponse.json(
      {
        success: true,
        message: "category created",
        data: created_category,
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


export async function GET(req, res) {
  try {
    await connectToDatabase(mongoose);
    const { categoryTable} = dbmodels(mongoose);

    const categories = await categoryTable.find();
    if (!categories.length) {
      return NextResponse.json({
        success: true,
        message: "No categories found",
        data: []
      })
    }
    return NextResponse.json(
      {
        success: true,
        message: "Categories found",
        data: categories
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while fetching category",
      },
      {
        status: 500,
      }
    );
  }
}