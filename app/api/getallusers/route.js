import { NextResponse } from 'next/server';
// import { connectToDatabase, userTable } from '@/db'; // Adjust the import path to where your db file is located
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
  import mongoose from 'mongoose';
  import { auth } from "@/auth"; // assuming auth function to get user session

  async function checkAdminOrStaff() {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);
  
    const userDetails = await userTable.findOne({ _id: session?.user?.id }).exec();
    if (!userDetails) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
  
    if (!["admin","staff"].includes(userDetails.role)) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
  
    return { user: userDetails };
  }
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable } = dbmodels(mongoose);
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;
    // Fetch users with only the basic fields
    const users = await userTable.find({}, 'name lastName email phone role selectedMode newsletter minutes'); // Only fetch the necessary fields
    console.log("users",users)

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
      minutes:user?.minutes
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
