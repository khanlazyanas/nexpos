import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin Only Routes Rules
    const isAdminRoute = path.startsWith("/inventory") || path.startsWith("/orders") || path.startsWith("/dashboard");

    // Agar route Admin wala hai aur user Admin nahi hai -> Block & Redirect to Home Hub
    if (isAdminRoute && token?.role !== "Admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      // Jab tak user logged in hai, tabhi middleware chalega
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/pos", 
    "/inventory", 
    "/orders",
    "/dashboard",
    "/"
  ]
};