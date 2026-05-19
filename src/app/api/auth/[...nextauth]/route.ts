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

        // 🛠️ Safe query: Input ko trim aur lowercase kar rahe hain accidental match failures bachane ke liye
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });
        if (!user) {
          throw new Error("Ye email database me nahi mila!");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Galat password!");
        }

        console.log("🔥 [1. AUTHORIZE PASSED] -> DB User Role:", user.role);

        // Login Success
        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email, 
          role: user.role 
        };
      }
    })
  ],
  
  callbacks: {
    // 🛠️ FIX HERE: Token data persistent loop me save hona chahiye
    async jwt({ token, user, trigger, session }) {
      // Jab user pehli baar login karega tab ye condition chalegi
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      
      console.log("⚡ [2. JWT CALLBACK LOOP] -> Safe Token Role:", token.role);
      return token;
    },
    
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      
      console.log("🚀 [3. SESSION CALLED FOR UI] -> Frontend Session Object Role:", (session.user as any)?.role);
      return session;
    }
  },

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