import { auth } from "@/auth";
// import { connectToDatabase, packageTable, userTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { name, description, minutes, price, imageUrl } = await req.json();

    if (!name || !description || !minutes || !price) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields ( name, description, minutes, price) are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { packageTable,userTable } = dbmodels(mongoose);

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

    const hasPackageAlreadyExist = await packageTable.findOne({ name }).exec();

    //If package already exist then return error
    if (hasPackageAlreadyExist) {
      return NextResponse.json(
        {
          success: false,
          message: "package already exist",
        },
        { status: 400 }
      );
    }

    const newPackage = await packageTable.create({
      name,
      description,
      minutes,
      price,
      imageUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message: "package added",
        data: newPackage,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.messag || error || "Error while adding package",
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
    const { packageTable } = dbmodels(mongoose);

    const packages = await packageTable.find();

    if (!packages.length) {
      return NextResponse.json(
        {
          success: true,
          message: "No packages found",
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
        message: "packages found",
        data: packages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while fetching packages",
      },
      {
        status: 500,
      }
    );
  }
}
