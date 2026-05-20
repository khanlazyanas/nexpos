import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token; // 🛠️ SAFE: Accessing internal nextauth token payload
    const path = req.nextUrl.pathname;

    // Admin Only Routes Rules
    const isAdminRoute = path.startsWith("/inventory") || path.startsWith("/dashboard") || path.startsWith("/orders");

    // 🛠️ DEBUG LOGS FOR TERMINAL: Isse turant pata chalega middleware me kya chal raha hai
    console.log("🛡️ [MIDDLEWARE MONITOR] Path:", path, "| User Role:", token?.role);

    // Rule 1: Agar admin route hai aur user Admin nahi hai -> Redirect to Home Hub
    if (isAdminRoute && token?.role !== "Admin") {
      console.log("🚫 [MIDDLEWARE BLOCKED] Cashier trying to access admin page! Redirecting to /");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🛠️ FIX: Agar sab kuch sahi hai, toh request ko smooth aage badhne do (NextResponse.next())
    return NextResponse.next();
  },
  {
    callbacks: {
      // User logged in hona chahiye tabhi middleware routes check karega
      authorized: ({ token }) => !!token,
    },
    // Secret explicitly pass karna padta hai middleware me token parsing ke liye
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  // 🛠️ FIX: Matcher se "/" ko hata diya hai taaki main dashboard layout wrap hooks safe rahein
  matcher: [
    "/pos", 
    "/inventory", 
    "/dashboard",
    "/orders"
  ]
};