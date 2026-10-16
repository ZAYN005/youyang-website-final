import "next-auth";
import "next-auth/jwt";


declare module "next-auth" {

  interface User {

    id: string;

    role: string;

    /** modules this admin may use (see lib/permissions.ts) */
    permissions?: string[];

  }


  interface Session {

    user: {

      id: string;

      role: string;

      permissions: string[];

      name?: string | null;

      email?: string | null;

    };

  }

}



declare module "next-auth/jwt" {

  interface JWT {

    id?: string;

    role?: string;

    permissions?: string[];

    /** last time role / permissions were read from the database */
    checkedAt?: number;

  }

}
