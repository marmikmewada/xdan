import { NextResponse } from 'next/server';
import { connectToDatabase, dbmodels,  } from '@/db'; // Adjust the import path to where your db file is located
import mongoose from 'mongoose';

export async function POST(req) {
    try {
        // Connect to the database
        await connectToDatabase(mongoose);
        const { userTable,storeTable } = dbmodels(mongoose);

        // Get data from the request body
        const { userId, storeId } = await req.json();

        // Validate required fields
        if (!userId || !storeId) {
            return NextResponse.json(
                { success: false, message: 'Both userId and storeId are required' },
                { status: 400 }
            );
        }

        // Fetch the store by storeId
        const store = await storeTable.findById(storeId);
        if (!store) {
            return NextResponse.json(
                { success: false, message: 'Store not found' },
                { status: 404 }
            );
        }

        // Fetch the user by userId (ensure it's a staff member)
        const user = await userTable.findById(userId);
        if (!user || user.role !== 'staff') {
            return NextResponse.json(
                { success: false, message: 'User not found or is not a staff member' },
                { status: 404 }
            );
        }

        // Check if the user is already assigned to the store
        if (store.staff.includes(userId)) {
            return NextResponse.json(
                { success: false, message: 'User is already assigned to this store' },
                { status: 400 }
            );
        }

        // Assign the user to the store (add the userId to the store's staff array)
        store.staff.push(userId);
        await store.save();

        // Return success response
        return NextResponse.json(
            { success: true, message: 'Staff assigned to store successfully', storeId, userId },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error assigning staff to store:', error);
        return NextResponse.json(
            { success: false, message: 'Error assigning staff to store' },
            { status: 500 }
        );
    }
}
