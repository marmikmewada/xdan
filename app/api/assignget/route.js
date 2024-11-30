import { NextResponse } from 'next/server';
// import { connectToDatabase, storeTable, userTable } from '@/db'; // Adjust the import path to where your db file is located
import { connectToDatabase, 
    // cartTable, productTable, packageTable,
    dbmodels } from "@/db";
    import mongoose from 'mongoose';
export async function GET() {
    try {
        // Connect to the database
        await connectToDatabase(mongoose);
        const { userTable,storeTable } = dbmodels(mongoose);

        // Fetch all stores (store ID and name)
        const stores = await storeTable.find({}, 'name'); // Get only the store name (you can modify the query to add more fields like address, etc.)

        // Fetch users with role "staff" (staff ID and name)
        const staff = await userTable.find({ role: 'staff' }, 'name _id'); // Fetch only staff users, no need for lastName

        // Structure the data
        const result = {
            stores: stores.map(store => ({
                id: store._id.toString(),  // Convert ObjectId to string for better serialization
                name: store.name,
            })),
            staff: staff.map(user => ({
                id: user._id.toString(),
                name: user.name,  // Only send the first name (or the "name" field)
            })),
        };

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching stores and staff:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching data' },
            { status: 500 }
        );
    }
}
