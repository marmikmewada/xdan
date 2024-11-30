// pages/api/getassigncat.js

import { NextResponse } from 'next/server';
// import { connectToDatabase, categoryTable, productTable } from '@/db'; // Adjust the import path as needed
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { categoryTable,productTable } = dbmodels(mongoose);

    // Fetch all categories (category ID and name)
    const categories = await categoryTable.find({}, 'name'); // Get only the category name

    // Fetch all products (product ID, name, and price)
    const products = await productTable.find({}, 'name price'); // Get only product name and price

    // Structure the data
    const result = {
      categories: categories.map(category => ({
        id: category._id.toString(),  // Convert ObjectId to string for better serialization
        name: category.name,
      })),
      products: products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        price: product.price, // Send price information along with the name
      })),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories and products:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching data' },
      { status: 500 }
    );
  }
}
