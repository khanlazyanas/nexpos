import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email aur password zaroori hai!");
        }

        await connectToDatabase();

        // Email se database me dhundho
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Ye email database me nahi mila!");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Galat password!");
        }

        // Login Success
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  }
});

export { handler as GET, handler as POST };