import { auth } from "@/auth";
// import { connectToDatabase, productTable, userTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';
//http://localhost:3001/api/product
// body:{
//   "name": "Headphone",
//   "description": "Boat Headphone",
//   "price": "1200",
//   "category": "671a76f53a1ae7a3d5e4ebbd"
// }
export async function POST(req, res) {
  try {
    const { name, category, price, description, imageUrl } = await req.json();

    if (!name || !category || !price || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (name, category, price, ) are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { productTable,userTable } = dbmodels(mongoose);

    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userDetails = await userTable
      .findOne({ _id: session?.user?.id })
      .exec();
    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          message: "unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { role } = userDetails || {};
    if (role != "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Permission denied",
        },
        {
          status: 403,
        }
      );
    }

    const product = await productTable.findOne({ name }).exec();

    //If product already exist then return error
    if (product) {
      return NextResponse.json(
        {
          success: false,
          message: "product already exist",
        },
        { status: 400 }
      );
    }
    //Create New product
    const newProduct = await productTable.create({
      name,
      description,
      price,
      imageUrl,
      category,
    });

    return NextResponse.json(
      {
        success: true,
        message: "product added",
        data: newProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.messag || error || "Error while adding product",
      },
      {
        status: 500,
      }
    );
  }
}

//http://localhost:3001/api/product
//http://localhost:3001/api/product?category=671a76f53a1ae7a3d5e4ebbd
export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");

    await connectToDatabase(mongoose);
    const { productTable } = dbmodels(mongoose);


    // If categoryId exists, filter products by category, otherwise get all products
    const query = categoryId ? { category: categoryId } : {};
    const products = await productTable.find(query);

    if (!products.length) {
      return NextResponse.json(
        {
          success: true,
          message: "No products found",
          data: [],
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "products found",
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error);
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
