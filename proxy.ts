import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";


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