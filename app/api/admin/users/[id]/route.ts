import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authErrorResponse, requireTopAdmin } from "@/lib/admin-auth";
import {
  PUBLIC_ADMIN_FIELDS,
  checkName,
  checkPassword,
  checkPermissions,
  checkRole,
  otherActiveTopAdmins,
  presentAdmin,
} from "@/lib/admin-users";
import { STAFF_ROLE, TOP_ADMIN_ROLE } from "@/lib/permissions";


export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };


/**
 * Changes an account (top admin only).
 * body (all optional): { name, role, permissions, status: "ACTIVE" | "DISABLED", password }
 */
export async function PATCH(request: Request, context: Context){

  let me;
  try {
    ({ admin: me } = await requireTopAdmin());
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request", code: "BAD_REQUEST" }, { status: 400 });
  }

  try {
    const target = await prisma.admin.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data: { name?: string; role?: string; permissions?: string[]; status?: string; password?: string } = {};

    if (body.name !== undefined) {
      const name = checkName(body.name);
      if (!name.ok) return NextResponse.json({ error: "Invalid name", code: name.code }, { status: 400 });
      data.name = name.value;
    }

    if (body.role !== undefined) {
      const role = checkRole(body.role);
      if (!role.ok) return NextResponse.json({ error: "Invalid role", code: role.code }, { status: 400 });
      data.role = role.value;
    }

    if (body.permissions !== undefined) {
      const permissions = checkPermissions(body.permissions);
      if (!permissions.ok) {
        return NextResponse.json({ error: "Invalid permissions", code: permissions.code }, { status: 400 });
      }
      data.permissions = permissions.value;
    }

    if (body.status !== undefined) {
      if (body.status !== "ACTIVE" && body.status !== "DISABLED") {
        return NextResponse.json({ error: "Invalid status", code: "BAD_STATUS" }, { status: 400 });
      }
      data.status = body.status;
    }

    if (body.password !== undefined && body.password !== "") {
      const password = checkPassword(body.password);
      if (!password.ok) return NextResponse.json({ error: "Invalid password", code: password.code }, { status: 400 });
      data.password = await bcrypt.hash(password.value, 10);
    }

    const newRole = data.role ?? target.role;
    const newStatus = data.status ?? target.status;
    const losesTopAdmin =
      target.role === TOP_ADMIN_ROLE && target.status === "ACTIVE" &&
      (newRole !== TOP_ADMIN_ROLE || newStatus !== "ACTIVE");

    // you cannot lock yourself out
    if (target.id === me.id && losesTopAdmin) {
      return NextResponse.json({ error: "You cannot remove your own top admin access", code: "SELF_LOCKOUT" }, { status: 400 });
    }

    // there must always be at least one active top admin
    if (losesTopAdmin && (await otherActiveTopAdmins(target.id)) === 0) {
      return NextResponse.json({ error: "At least one top admin is required", code: "LAST_TOP_ADMIN" }, { status: 400 });
    }

    // a normal admin needs at least one module
    if (newRole === STAFF_ROLE) {
      const modules = data.permissions ?? target.permissions;
      if (modules.length === 0) {
        return NextResponse.json({ error: "Choose at least one module", code: "NO_PERMISSIONS" }, { status: 400 });
      }
    }
    if (newRole === TOP_ADMIN_ROLE) data.permissions = [];

    const user = await prisma.admin.update({ where: { id }, data, select: PUBLIC_ADMIN_FIELDS });
    return NextResponse.json(presentAdmin(user));

  } catch (error) {
    console.error("[users] update failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}


/** deletes an account (top admin only; not yourself, not the last top admin) */
export async function DELETE(_request: Request, context: Context){

  let me;
  try {
    ({ admin: me } = await requireTopAdmin());
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  const { id } = await context.params;

  try {
    const target = await prisma.admin.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (target.id === me.id) {
      return NextResponse.json({ error: "You cannot delete your own account", code: "SELF_DELETE" }, { status: 400 });
    }

    if (target.role === TOP_ADMIN_ROLE && target.status === "ACTIVE" && (await otherActiveTopAdmins(target.id)) === 0) {
      return NextResponse.json({ error: "At least one top admin is required", code: "LAST_TOP_ADMIN" }, { status: 400 });
    }

    await prisma.admin.delete({ where: { id } });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[users] delete failed:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

}
