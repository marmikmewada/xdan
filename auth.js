// "use server"
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { dbmodels, connectToDatabase } from "./db"; // Adjust path if needed
// import mongoose from "mongoose";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // async authorize(credentials) {
      //   await connectToDatabase(mongoose);
      //   const { userTable } = dbmodels(mongoose);

      //   const user = await userTable.findOne({ email: credentials.email }).exec();

      //   if (!user) {
      //     throw new Error('No user found with the provided email');
      //   }

      //   // Ensure to use proper password verification
      //   if (credentials.password !== user.password) {
      //     throw new Error('Invalid credentials');
      //   }

        
        
      // },
      async authorize(credentials) {
        try {
          // Make a POST request to the /api/authorizepost API with the user's email and password
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authorizepost`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // Check if the API call was successful
          if (!response.ok) {
            throw new Error("Invalid credentials or error during authorization");
          }

          // Parse the response data
          const data = await response.json();
          console.log("from authorize:", data);

          // Ensure the API returned valid user data
          if (data.success && data.data) {
            const { id, name, email, role, store } = data.data;

            // If the user has store information (e.g., staff), you might want to include it in the session
            return {
              id: id.toString(),
              name,
              email,
              role,
              store_id: store ? store : null, // Safely access store info if available
            };
          }

          // If the login fails, return null
          return null;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // If user is defined, set the token fields
      if (user) {
        // Make an API call to /api/getuserdata to get the user data based on the email
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/getuserdata?email=${user.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Check if the API call was successful
        if (!response.ok) {
          throw new Error("Failed to retrieve user data from /api/getuserdata");
        }

        // Parse the response data
        const userData = await response.json();
         console.log("from auth vepar ", userData);
         if(userData.store){
          console.log("userData.store", token.store_id)
          token.store_id=userData.store;
        }
        // Ensure the API returned valid user data
        if (userData.success && userData.data) {
          console.log("userData.data",userData.data)
          const { name, lastName, email, role, _id} = userData.data;
          token.id = _id; // Use user.id since we set it in the authorize function
          token.email = email;
          token.name = name;
          token.role = role;
          
        }
      }

      // Set token expiration to 28 days (in seconds)
      const expirationTimeInSeconds = 28 * 24 * 60 * 60; // 28 days
      token.exp = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;
      return token;
    },
    async session({ session, token }) {
      // Attach token data to session
      console.log("session.store_id",token.store_id)
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      if(token.store_id){
        session.store_id=token.store;
      }
      session.token = token;
      return session;
    },
  },
});
