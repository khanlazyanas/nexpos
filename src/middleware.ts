export { default } from "next-auth/middleware";

// Ye config guard ko batata hai ki kin panno (pages) par tala lagana hai
export const config = {
  matcher: [
    "/pos", 
    "/inventory", 
    "/orders",
    "/"
  ]
};