import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { userTable, connectToDatabase } from './db'; // Adjust path if needed

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await userTable.findOne({ email: credentials.email }).exec();

        if (!user) {
          throw new Error('No user found with the provided email');
        }

        // Ensure to use proper password verification
        if (credentials.password !== user.password) {
          throw new Error('Invalid credentials');
        }

        // Return user object for the session
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          // Add other fields if needed
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // If user is defined, set the token fields
      if (user) {
        token.id = user.id; // Use user.id since we set it in the authorize function
        token.email = user.email;
        token.name = user.name;
      }

      // Set token expiration to 28 days (in seconds)
      const expirationTimeInSeconds = 28 * 24 * 60 * 60; // 28 days
      token.exp = Math.floor(Date.now() / 1000) + expirationTimeInSeconds;

      return token;
    },
    async session({ session, token }) {
      // Attach token data to session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.token = token;

      return session;
    },
  },
});
