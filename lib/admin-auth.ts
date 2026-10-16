import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ModuleKey, TOP_ADMIN_ROLE, effectiveModules } from "@/lib/permissions";


/**
 * Permission checks for admin pages and API routes.
 * The account is always read from the database, so changes made in
 * 用户管理 (permissions, disabling, deleting) take effect immediately.
 */


async function currentAdmin(){

  const session = await getServerSession(authOptions);

  if(!session?.user){
    throw new Error("UNAUTHORIZED");
  }

  const id = session.user.id;
  const email = session.user.email ?? undefined;

  const admin = await prisma.admin.findFirst({
    where: id ? { id } : { email },
    select: { id: true, name: true, email: true, role: true, permissions: true, status: true },
  });

  if(!admin || admin.status !== "ACTIVE"){
    throw new Error("UNAUTHORIZED");
  }

  return {
    session,
    admin: {
      ...admin,
      modules: effectiveModules(admin.role, admin.permissions),
      isTopAdmin: admin.role === TOP_ADMIN_ROLE,
    },
  };

}


/** any logged-in, active admin */
export async function requireAdmin(){

  const { session } = await currentAdmin();

  return session;

}


/** an admin who was given this module (the top admin always passes) */
export async function requirePermission(module: ModuleKey){

  const { session, admin } = await currentAdmin();

  if(!admin.isTopAdmin && !admin.modules.includes(module)){
    throw new Error("FORBIDDEN");
  }

  return session;

}


/** only the top admin (用户管理, 系统设置) */
export async function requireTopAdmin(){

  const { session, admin } = await currentAdmin();

  if(!admin.isTopAdmin){
    throw new Error("FORBIDDEN");
  }

  return { session, admin };

}


/** kept for older code: ADMIN-only checks go through requireTopAdmin */
export async function requireRole(
  roles:string[]
){

  const { session, admin } = await currentAdmin();

  if(!roles.includes(admin.role)){
    throw new Error("FORBIDDEN");
  }

  return session;

}


/** turns an auth error into the right HTTP answer (401 / 403), or null if it is another error */
export function authErrorResponse(error: unknown){

  const message = (error as Error)?.message;

  if(message === "UNAUTHORIZED"){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if(message === "FORBIDDEN"){
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;

}
