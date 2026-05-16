import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Yahan hum hardcoded Admin aur Cashier set kar rahe hain
        if (credentials?.username === "admin" && credentials?.password === "admin123") {
          return { id: "1", name: "Admin Boss", role: "admin" };
        }
        if (credentials?.username === "cashier" && credentials?.password === "cashier123") {
          return { id: "2", name: "Store Cashier", role: "cashier" };
        }
        // Agar password galat hai
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Hum ek mast custom login page banayenge
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 ghante baad auto-logout
  }
});

export { handler as GET, handler as POST };