import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getDatabase } from "./db-old";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    callbacks: {
      async signIn() {
        return true;
      },
      session({ session, token }) {
        console.log("🚀 ~ session ~ session:", session);
        const { userDetails } = token;
        if (userDetails) {
          session.user = { ...session.user, ...userDetails };
        }
        return session;
      },
      async jwt({ token }) {
        console.log("🚀 ~ jwt ~ token:", token);
        if (!token.email) {
          return null;
        }
        const db = await getDatabase();

        const userDetails = await db
          .collection("users")
          .findOne({ email: token.email });
        console.log("🚀 ~ jwt ~ userDetails:", userDetails);
        return { ...token, userDetails };
      },
      // async redirect({ url, baseUrl }) {
      //   return "/2fa-setup";
      // },
    },
  },
});
