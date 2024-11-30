import { auth } from "@/auth";
// import { connectToDatabase, storeTable, userTable } from "@/db";
import { connectToDatabase, 
    // cartTable, productTable, packageTable,
    dbmodels } from "@/db";
    import mongoose from 'mongoose';
import { NextResponse } from "next/server";

// http://localhost:3000/api/store/672b92a9b2654a0371796dc7
// response = {
//     "success": true,
//     "message": "Store fetched",
//     "data": [
//         {
//             "_id": "672b92a9b2654a0371796dc7",
//             "name": "test",
//             "address": "test",
//             "phone": "9283563782",
//             "staff": [
//                 { "id": "671a8367cd8194bd3ffa3aae", "name": "John Doe" },
//                 { "id": "671a8367cd8194bd3ffa3abf", "name": "Jane Smith" }
//             ],
//             "__v": 0
//         }
//     ]
// }

export async function GET(req, { params }) {
    try {
        const { id: store_id } = params || {};

        // Check if store_id is provided
        if (!store_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Store id is required",
                },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectToDatabase(mongoose);
        const { userTable,storeTable } = dbmodels(mongoose);

        // Fetch the store by ID
        const store = await storeTable.findById(store_id).exec();

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No Store found",
                },
                { status: 400 }
            );
        }

        // Fetch the staff user details (name and id)
        const staffUserIds = store.staff || [];
        const staffDetails = [];

        if (staffUserIds.length > 0) {
            // Fetch staff details from userTable
            const users = await userTable
                .find({ _id: { $in: staffUserIds } })
                .exec();

            // Map the staff details to include both id and name
            staffDetails.push(...users.map(user => ({ id: user._id, name: user.name })));
        }

        // Modify the store object to include the staff details
        const storeWithStaffDetails = {
            ...store.toObject(), // Convert store to a plain object
            staff: staffDetails,  // Replace staff field with an array of { id, name }
        };

        console.log("store with staff details:", storeWithStaffDetails);

        // Return the modified store data with staff names and ids
        return NextResponse.json(
            {
                success: true,
                message: "Store fetched",
                data: storeWithStaffDetails, // Wrap the store in an array
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while fetching store:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error while fetching store",
            },
            { status: 500 }
        );
    }
}
//http://localhost:3000/api/store/672b92a9b2654a0371796dc7
export async function PATCH(req, { params }) {
    try {
        const { id: store_id } = params || {};
        if (!store_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Store id is required",
                },
                {
                    status: 400,
                }
            );
        }
        await connectToDatabase(mongoose);
        const { userTable, storeTable} = dbmodels(mongoose);

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

        const { name, address, phone, staff } = await req.json();
       

        const store = await storeTable.findById(store_id);

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: "no store found",
                },
                {
                    status: 400,
                }
            );
        }

        const updatedStore = await storeTable.updateOne(
            {
                _id: store_id,
            },
            {
                $set: {
                    name,
                    address,
                    phone,
                    staff,
                },
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Store updated",
                data: updatedStore,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error while updating Store",
            },
            {
                status: 500,
            }
        );
    }
}

//http://localhost:3000/api/store/672b92a9b2654a0371796dc7
export async function DELETE(req, { params }) {
    try {
        const { id: store_id } = params || {};
        if (!store_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Store id is required",
                },
                {
                    status: 400,
                }
            );
        }
        await connectToDatabase(mongoose);
        const { userTable, storeTable} = dbmodels(mongoose);
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

        const store = await storeTable.findOne({
            _id: store_id,
        });

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: "no store found",
                },
                {
                    status: 400,
                }
            );
        }

        await storeTable.deleteOne({
            _id: store_id,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Store deleted",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("🚀 ~ GET ~ error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error while deleting Store",
            },
            {
                status: 500,
            }
        );
    }
}