import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      organizationId?: string;
      organizationRole?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    token?: string;
    organizationId?: string;
    organizationRole?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    accessToken?: string;
    organizationId?: string;
    organizationRole?: string;
  }
}

