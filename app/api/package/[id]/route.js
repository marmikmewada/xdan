import { auth } from "@/auth";
// import { connectToDatabase, packageTable, productTable, userTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id: package_id } = params || {};
    if (!package_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Package id is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase(mongoose);
    const { packageTable } = dbmodels(mongoose);

    const package_details = await packageTable.findOne({
      _id: package_id,
    });

    if (!package_details) {
      return NextResponse.json(
        {
          success: false,
          message: "no package found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Package found",
        data: package_details,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while fetching package",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id: package_id } = params || {};
    if (!package_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Package id is required",
        },
        {
          status: 400,
        }
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

    

    const package_details = await packageTable.findOne({
      _id: package_id,
    });

    if (!package_details) {
      return NextResponse.json(
        {
          success: false,
          message: "no package found",
        },
        {
          status: 400,
        }
      );
    }
    await packageTable.deleteOne({
      _id: package_id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Package deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while deleting package",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id: package_id } = params || {};
    if (!package_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Package id is required",
        },
        {
          status: 400,
        }
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

    const { name, description, minutes, price, imageUrl } = await req.json();

    const package_details = await packageTable.findOne({
      _id: package_id,
    });

    if (!package_details) {
      return NextResponse.json(
        {
          success: false,
          message: "no package found",
        },
        {
          status: 400,
        }
      );
    }
    const updatedPackage = await packageTable.updateOne(
      {
        _id: package_id,
      },
      {
        $set: {
          name,
          description,
          minutes,
          price,
          imageUrl,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Package updated",
        data: updatedPackage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while updating package",
      },
      {
        status: 500,
      }
    );
  }
}
