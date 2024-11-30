// import { categoryTable, connectToDatabase, productTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
//http://localhost:3001/api/category/671a77323a1ae7a3d5e4ebc0
export async function GET(req, { params }) {
  try {
    const { id: category_id } = params || {}
    if (!category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Category_id id is required",
        },
        {
          status: 400
        }
      );
    }

    await connectToDatabase(mongoose);
    const { categoryTable} = dbmodels(mongoose);

    const category = await categoryTable.findOne({
      _id: category_id
    });

    if (!category) {
      return NextResponse.json(
        {
          success: true,
          message: "no category found",
          data: []
        },
        {
          status: 200
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category found",
        data: category
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while fetching products",
      },
      {
        status: 500,
      }
    );
  }
}