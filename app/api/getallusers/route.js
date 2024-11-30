import { NextResponse } from 'next/server';
// import { connectToDatabase, userTable } from '@/db'; // Adjust the import path to where your db file is located
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);

    // Fetch users with only the basic fields
    const users = await userTable.find({}, 'name lastName email phone role selectedMode newsletter'); // Only fetch the necessary fields

    // Structure the data without sensitive or extra fields
    const result = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      selectedMode: user.selectedMode,
      newsletter: user.newsletter,
    }));

    // Return the user data in the response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching users' },
      { status: 500 }
    );
  }
}
