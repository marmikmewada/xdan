// pages/api/assign-category.js

import { NextResponse } from 'next/server';
// import { connectToDatabase, productTable, categoryTable } from '@/db'; // Adjust the import path to where your db file is located
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
export async function POST(request) {
  try {
    // Parse the request body
    const { productId, categoryId } = await request.json();

    if (!productId || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Product ID and Category ID are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase(mongoose);
    const { categoryTable,productTable } = dbmodels(mongoose);

    // Check if the category exists
    const category = await categoryTable.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if the product exists
    const product = await productTable.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Update the product's category field
    product.category = categoryId;

    // Save the updated product
    await product.save();

    // Return a success response
    return NextResponse.json(
      { success: true, message: 'Product category assigned successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error assigning category to product:', error);
    return NextResponse.json(
      { success: false, message: 'Error assigning category' },
      { status: 500 }
    );
  }
}
