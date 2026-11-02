// middleware.ts
export { default } from "next-auth/middleware"

// Specify the routes you want to protect
export const config = {
  matcher: [
    "u/*", 
    "checkout",
  ]
}