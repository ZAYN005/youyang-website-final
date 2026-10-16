import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireTopAdmin } from "@/lib/admin-auth";
import {
  PUBLIC_ADMIN_FIELDS,
  checkEmail,
  checkName,
  checkPassword,
  checkPermissions,
  checkRole,
  presentAdmin,
} from "@/lib/admin-users";
import { STAFF_ROLE, TOP_ADMIN_ROLE } from "@/lib/permissions";


export const dynamic = "force-dynamic";


/** all admin accounts (top admin only). Password hashes are never sent. */
export async function GET(){

  try {
    await requireTopAdmin();
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  try {
    const users = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
      select: PUBLIC_ADMIN_FIELDS,
    });
    return NextResponse.json(users.map(presentAdmin));
  } catch (error) {
    console.error("[users] list failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/**
 * Creates an admin account (top admin only).
 * body: { name, email, password, role: "ADMIN" | "STAFF", permissions: ["content", …] }
 */
export async function POST(request: Request){

  try {
    await requireTopAdmin();
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request", code: "BAD_REQUEST" }, { status: 400 });
  }

  const name = checkName(body.name);
  if (!name.ok) return NextResponse.json({ error: "Invalid name", code: name.code }, { status: 400 });

  const email = checkEmail(body.email);
  if (!email.ok) return NextResponse.json({ error: "Invalid email", code: email.code }, { status: 400 });

  const password = checkPassword(body.password);
  if (!password.ok) return NextResponse.json({ error: "Invalid password", code: password.code }, { status: 400 });

  const role = checkRole(body.role ?? STAFF_ROLE);
  if (!role.ok) return NextResponse.json({ error: "Invalid role", code: role.code }, { status: 400 });

  const permissions = checkPermissions(body.permissions ?? []);
  if (!permissions.ok) return NextResponse.json({ error: "Invalid permissions", code: permissions.code }, { status: 400 });

  if (role.value === STAFF_ROLE && permissions.value.length === 0) {
    return NextResponse.json({ error: "Choose at least one module", code: "NO_PERMISSIONS" }, { status: 400 });
  }

  try {
    const user = await prisma.admin.create({
      data: {
        name: name.value,
        email: email.value,
        password: await bcrypt.hash(password.value, 10),
        role: role.value,
        permissions: role.value === TOP_ADMIN_ROLE ? [] : permissions.value,
        status: "ACTIVE",
      },
      select: PUBLIC_ADMIN_FIELDS,
    });
    return NextResponse.json(presentAdmin(user), { status: 201 });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "Email already used", code: "EMAIL_TAKEN" }, { status: 409 });
    }
    console.error("[users] create failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}
