import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";


// one login configuration for the whole site (see lib/auth.ts)
const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };
