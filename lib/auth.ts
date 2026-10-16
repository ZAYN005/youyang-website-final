import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { effectiveModules } from "@/lib/permissions";


/** how often a logged-in admin's role / permissions are re-read from the database */
const REFRESH_MS = 30 * 1000;


export const authOptions: AuthOptions = {

  providers: [

    CredentialsProvider({

      name: "Credentials",

      credentials: {

        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },

      },


      async authorize(credentials) {


        if (
          !credentials?.email ||
          !credentials?.password
        ) {

          return null;

        }


        const admin = await prisma.admin.findFirst({

          where: {
            email: { equals: credentials.email.trim(), mode: "insensitive" },
          },

        });


        if (!admin) {

          return null;

        }


        const isPasswordValid = await bcrypt.compare(

          credentials.password,

          admin.password

        );


        if (!isPasswordValid) {

          return null;

        }


        // disabled accounts cannot log in
        if (admin.status !== "ACTIVE") {

          return null;

        }


        return {

          id: admin.id,

          name: admin.name,

          email: admin.email,

          role: admin.role,

          permissions: effectiveModules(admin.role, admin.permissions),

        };

      },

    }),

  ],


  pages: {

    signIn: "/admin/login",

  },


  session: {

    strategy: "jwt",

  },


  callbacks: {


    async jwt({ token, user }) {

      if (user) {

        token.id = user.id;

        token.role = user.role;

        token.permissions = user.permissions;

        token.checkedAt = Date.now();

        return token;

      }


      // keep role / permissions in step with 用户管理 (changes apply without logging out)
      if (token.id && Date.now() - (token.checkedAt ?? 0) > REFRESH_MS) {

        try {

          const admin = await prisma.admin.findUnique({
            where: { id: token.id as string },
            select: { role: true, permissions: true, status: true },
          });

          if (!admin || admin.status !== "ACTIVE") {
            // deleted or disabled: no access anywhere
            token.role = "DISABLED";
            token.permissions = [];
          } else {
            token.role = admin.role;
            token.permissions = effectiveModules(admin.role, admin.permissions);
          }

          token.checkedAt = Date.now();

        } catch (error) {

          // database not reachable: keep the last known values
          console.error("[auth] could not refresh admin:", error);

        }

      }

      return token;

    },


    async session({ session, token }) {


      if (session.user) {

        session.user.id = token.id as string;

        session.user.role = token.role as string;

        session.user.permissions = (token.permissions as string[] | undefined) ?? [];

      }


      return session;

    },


  },


  secret: process.env.NEXTAUTH_SECRET,

};
