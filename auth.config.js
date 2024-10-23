import { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDatabase } from "./db-old";

class UserNotFoundError extends CredentialsSignin {
  code = "not_found";
}

const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🚀 ~ authorize ~ credentials:", credentials);
        const { email, password } = credentials || {};
        if (!email || !password) {
          return null;
        }

        const db = await getDatabase();

        const existingUser = await db.collection("users").findOne({ email });
        console.log("🚀 ~ authorize ~ existingUser:", existingUser);
        if (!existingUser) {
          throw new UserNotFoundError();
        }
        const { _id, name } = existingUser || {};
        return {
          id: _id,
          email,
          image: null,
          name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
};
export default authConfig;
