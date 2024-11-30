// api/product/[id].js
import { auth } from "@/auth";
// import { connectToDatabase, productTable,userTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    const { id: product_id } = params || {}; // This is where the product id comes from the URL
    if (!product_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product id is required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase(mongoose);
    const { productTable } = dbmodels(mongoose);

    const product = await productTable.findById(product_id).populate("category"); // Ensure this returns the product
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "No product found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product found",
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while fetching product",
      },
      { status: 500 }
    );
  }
}





// import { connectToDatabase, productTable, userTable } from "@/db";
// import { NextResponse } from "next/server";

// //http://localhost:3001/api/product/671a77d53a1ae7a3d5e4ebc5
// export async function GET(req, { params }) {
//   try {
//     const { id: product_id } = params || {};
//     console.log("product_id",product_id)
//     if (!product_id) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Product id is required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     await connectToDatabase();

//     const product = await productTable.findById(product_id);
//     console.log("product<><>",product)

//     if (!product) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "no product found",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product found",
//         data: product,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("🚀 ~ GET ~ error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Error while fetching products",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

export async function DELETE(req, { params }) {
  try {
    const { id: product_id } = params || {};
    if (!product_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product id is required",
        },
        {
          status: 400,
        }
      );
    }
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
    await connectToDatabase(mongoose);
    const { productTable,userTable } = dbmodels(mongoose);
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

    

    const product = await productTable.findOne({
      _id: product_id,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "no product found",
        },
        {
          status: 400,
        }
      );
    }
    await productTable.deleteOne({
      _id: product_id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while deleting product",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req, { params }) {
  await connectToDatabase(mongoose);
  const { productTable,userTable } = dbmodels(mongoose);
  try {
    const { id: product_id } = params || {};
    if (!product_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product id is required",
        },
        {
          status: 400,
        }
      );
    }
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

    const { name, category, price, description, imageUrl } = await req.json();
    await connectToDatabase(mongoose);

    const product = await productTable.findOne({
      _id: product_id,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: true,
          message: "no product found",
          data: [],
        },
        {
          status: 200,
        }
      );
    }
    const updatedProduct = await productTable.updateOne(
      {
        _id: product_id,
      },
      {
        $set: {
          name,
          category,
          price,
          description,
          imageUrl,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product updated",
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while updating  product",
      },
      {
        status: 500,
      }
    );
  }
}
