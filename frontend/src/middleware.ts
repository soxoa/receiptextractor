export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload/:path*",
    "/invoices/:path*",
    "/vendors/:path*",
    "/settings/:path*"
  ]
};
