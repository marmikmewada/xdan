// import { connectToDatabase, userTable } from "@/db";
import { connectToDatabase, 
  // cartTable, productTable, packageTable,
  dbmodels } from "@/db";
import { NextResponse } from "next/server";
import { signIn } from "@/auth"; // Adjust this import based on your file structure
import mongoose from 'mongoose';
// http://localhost:3000/api/auth/login
// body={
//   "email": "john@mailinator.com",
//   "password": "John@123"
// }
// response={
//   "success": true,
//   "message": "Logged in successfully",
//   "data": {
//       "id": "672f76a07547cf71219e2e6b",
//       "name": "John",
//       "email": "john@mailinator.com",
//       "twofa": true
//   },
//   "redirectTo": "/2fa-setup"
// }
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (email, password) are required.",
        },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase(mongoose);
    const { userTable, storeTable} = dbmodels(mongoose);


    // Find the existing user by email
    const existingUser = await userTable.findOne({ email }).exec();

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    // Check if the password matches
    if (existingUser.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password",
        },
        { status: 400 }
      );
    }

  //  cutted from here 
  //  Use NextAuth's signIn function directly
   
    // Redirect based on 2FA status
    console.log("existingUser",existingUser)
    if (existingUser.twofa) {
      return NextResponse.json({
        success:true,
        is_twofa_redirect:true,
      });
    } else {
      const loginResponse = await signIn("credentials", {
        redirect: false, // Do not redirect, just return the response
        email: existingUser.email,
        password,
      });
    
      if (loginResponse.error) {
        return NextResponse.json(
          {
            success: false,
            message: loginResponse.error,
          },
          { status: 400 }
        );
      }
    
        const responseData = {
          success: true,
          message: "Logged in successfully",
          data: {
            id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            twofa: existingUser.twofa,
          },
        };
    
      return NextResponse.json({
        ...responseData,
        redirectTo: "/home",
      });
    }
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error while logging in",
      },
      {
        status: 500,
      }
    );
  }
}





// // import { connectToDatabase, userTable } from "@/db";
// import { connectToDatabase, 
//   // cartTable, productTable, packageTable,
//   dbmodels } from "@/db";
// import { NextResponse } from "next/server";
// import { signIn } from "@/auth"; // Adjust this import based on your file structure
// import mongoose from 'mongoose';
// // http://localhost:3000/api/auth/login
// // body={
// //   "email": "john@mailinator.com",
// //   "password": "John@123"
// // }
// // response={
// //   "success": true,
// //   "message": "Logged in successfully",
// //   "data": {
// //       "id": "672f76a07547cf71219e2e6b",
// //       "name": "John",
// //       "email": "john@mailinator.com",
// //       "twofa": true
// //   },
// //   "redirectTo": "/2fa-setup"
// // }
// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "All fields (email, password) are required.",
//         },
//         { status: 400 }
//       );
//     }

//     // Connect to the database
//     await connectToDatabase(mongoose);
//     const { userTable, storeTable} = dbmodels(mongoose);


//     // Find the existing user by email
//     const existingUser = await userTable.findOne({ email }).exec();

//     if (!existingUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User not found",
//         },
//         { status: 400 }
//       );
//     }

//     // Check if the password matches
//     if (existingUser.password !== password) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid password",
//         },
//         { status: 400 }
//       );
//     }

//   //  cutted from here 
//   //  Use NextAuth's signIn function directly
//    const loginResponse = await signIn("credentials", {
//     redirect: false, // Do not redirect, just return the response
//     email: existingUser.email,
//     password,
//   });

//   if (loginResponse.error) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: loginResponse.error,
//       },
//       { status: 400 }
//     );
//   }

//     const responseData = {
//       success: true,
//       message: "Logged in successfully",
//       data: {
//         id: existingUser._id.toString(),
//         name: existingUser.name,
//         email: existingUser.email,
//         twofa: existingUser.twofa,
//       },
//     };

//     // Redirect based on 2FA status
//     if (existingUser.twofa) {
//       return NextResponse.json({
//         ...responseData,
//         redirectTo: "/2fa-setup",
//       });
//     } else {
//       return NextResponse.json({
//         ...responseData,
//         redirectTo: "/home",
//       });
//     }
//   } catch (error) {
//     console.error("🚀 ~ POST ~ error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message || "Error while logging in",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
