import { auth } from "@/auth"; // assuming auth function to get user session
import { NextResponse } from 'next/server';
import { connectToDatabase, dbmodels } from "@/db";
import mongoose from 'mongoose';

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
export async function PATCH(req) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const roleCheck = await checkAdminOrStaff();
    if (!roleCheck.user) return roleCheck;

    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable, minutesTransactionTable } = dbmodels(mongoose);

    // Parse the request body to get the updated minutes and user ID
    const { minutes, userId: id } = await req.json();

    // Validate input
    if (!id || typeof minutes !== 'number') {
      return NextResponse.json(
        { success: false, message: "Invalid input. User ID and minutes are required." },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await userTable.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const previousMinutes = user?.minutes; // Store the previous minutes

    // Update the user's minutes
    const updatedUser = await userTable.findByIdAndUpdate(
      id, 
      { minutes }, // Set the new minutes value
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user's minutes." },
        { status: 500 }
      );
    }

    // Record the transaction for previous and updated minutes
    const newTransaction = new minutesTransactionTable({
      doneBy: session.user.id, // Assuming the user making the update is available in session
      minutesOfUser: id,
      previousMinutes,
      updatedMinutes: updatedUser.minutes,
    });

    await newTransaction.save();

    // Return the updated user data
    return NextResponse.json(
      { 
                success: true, 
                message: "Minutes updated successfully.", 
                data: {
                  id: updatedUser._id.toString(),
                  name: updatedUser.name,
                  email: updatedUser.email,
                  minutes: updatedUser.minutes
                } 
              },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user minutes:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating user minutes' },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import { connectToDatabase, dbmodels } from "@/db";
// import mongoose from 'mongoose';

// export async function PATCH(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase(mongoose);
//     const { userTable } = dbmodels(mongoose);

//     // Extract the user ID from the params

    
//     // Parse the request body to get the updated minutes value
//     const { minutes,userId:id } = await req.json();

//     // Validate input
//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "Invalid input. User ID and minutes are required." },
//         { status: 400 }
//       );
//     }

//     // Find the user by ID and update their minutes
//     const updatedUser = await userTable.findByIdAndUpdate(
//       id, 
//       { minutes }, // Set the new minutes value
//       { new: true } // Return the updated document
//     );

//     // If the user doesn't exist
//     if (!updatedUser) {
//       return NextResponse.json(
//         { success: false, message: "User not found." },
//         { status: 404 }
//       );
//     }

//     // Return the updated user data
//     return NextResponse.json(
//       { 
//         success: true, 
//         message: "Minutes updated successfully.", 
//         data: {
//           id: updatedUser._id.toString(),
//           name: updatedUser.name,
//           email: updatedUser.email,
//           minutes: updatedUser.minutes
//         } 
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error updating user minutes:', error);
//     return NextResponse.json(
//       { success: false, message: 'Error updating user minutes' },
//       { status: 500 }
//     );
//   }
// }
