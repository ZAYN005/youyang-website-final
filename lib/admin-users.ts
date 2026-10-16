/**
 * Shared rules for 用户管理 (admin accounts). Server only.
 */

import { prisma } from "@/lib/prisma";
import { ACCOUNT_ROLES, ModuleKey, MODULE_KEYS, TOP_ADMIN_ROLE, effectiveModules, isModuleKey } from "@/lib/permissions";

export const MIN_PASSWORD_LENGTH = 8;

/** fields that are safe to send to the browser (never the password hash) */
export const PUBLIC_ADMIN_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  permissions: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function presentAdmin<T extends { role: string; permissions: string[] }>(admin: T) {
  return {
    ...admin,
    // what the account can really use (includes older roles)
    modules: effectiveModules(admin.role, admin.permissions),
  };
}

export type CheckResult<T> = { ok: true; value: T } | { ok: false; code: string };

export function checkRole(value: unknown): CheckResult<string> {
  return typeof value === "string" && (ACCOUNT_ROLES as readonly string[]).includes(value)
    ? { ok: true, value }
    : { ok: false, code: "BAD_ROLE" };
}

export function checkPermissions(value: unknown): CheckResult<ModuleKey[]> {
  if (!Array.isArray(value) || !value.every(isModuleKey)) return { ok: false, code: "BAD_PERMISSIONS" };
  // keep the standard order, no duplicates
  return { ok: true, value: MODULE_KEYS.filter((k) => value.includes(k)) };
}

export function checkPassword(value: unknown): CheckResult<string> {
  return typeof value === "string" && value.length >= MIN_PASSWORD_LENGTH && value.length <= 200
    ? { ok: true, value }
    : { ok: false, code: "BAD_PASSWORD" };
}

export function checkName(value: unknown): CheckResult<string> {
  const name = typeof value === "string" ? value.trim() : "";
  return name && name.length <= 100 ? { ok: true, value: name } : { ok: false, code: "BAD_NAME" };
}

export function checkEmail(value: unknown): CheckResult<string> {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200
    ? { ok: true, value: email }
    : { ok: false, code: "BAD_EMAIL" };
}

/** number of active top admins other than `exceptId` */
export async function otherActiveTopAdmins(exceptId: string) {
  return prisma.admin.count({
    where: { role: TOP_ADMIN_ROLE, status: "ACTIVE", id: { not: exceptId } },
  });
}
