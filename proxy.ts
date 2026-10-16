import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";

import { canOpenAdminPath, homePathFor } from "@/lib/permissions";


const intlMiddleware = createMiddleware({

  locales: [
    "en",
    "zh"
  ],

  defaultLocale: "en"

});


export async function proxy(req:any){


  const pathname = req.nextUrl.pathname;


  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });



  const isAdminRoute =
    pathname.startsWith("/admin")
    &&
    !pathname.startsWith("/admin/login");



  if(isAdminRoute && !token){

    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );

  }



  // each admin only opens the modules given to them in 用户管理
  // (the API routes check again on the server, this only handles navigation)
  if(isAdminRoute && token){

    if(token.role === "DISABLED"){

      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );

    }

    if(!canOpenAdminPath(token.role, token.permissions, pathname)){

      return NextResponse.redirect(
        new URL(homePathFor(token.role, token.permissions), req.url)
      );

    }

  }



  if(
    !pathname.startsWith("/admin")
    &&
    !pathname.startsWith("/api")
  ){

    return intlMiddleware(req);

  }


  return NextResponse.next();

}



export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)"
  ]
};