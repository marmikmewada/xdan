export async function POST(req) {
    try {
        // Destructure the request body to get the required fields
        const { name, lastName, email, phone, password, dob } = await req.json();

        // Validate required fields
        if (!name || !lastName || !email || !phone || !password || !dob) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields (name, lastName, email, phone, password, dob) are required.",
                },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectToDatabase(mongoose);
        const { userTable} = dbmodels(mongoose);

        // Check if the user already exists
        const existingUser = await userTable.findOne({ email }).exec();

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists",
                },
                { status: 400 }
            );
        }

        // Create new user without hashing the password
        const newUser = await userTable.create({ name, lastName, email, phone, password, dob });

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                user: newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("🚀 ~ POST ~ error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Error creating user",
            },
            { status: 500 }
        );
    }
}
