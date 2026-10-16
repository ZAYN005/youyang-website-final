/**
 * Admin permissions.
 *
 * ADMIN (最高管理员) can use everything, including 用户管理 and 系统设置.
 * Every other admin can only use the modules ticked for them by an ADMIN.
 *
 * Shared by the browser, the server and proxy.ts (no database imports here).
 */

export const TOP_ADMIN_ROLE = "ADMIN";
export const STAFF_ROLE = "STAFF";
export const ACCOUNT_ROLES = [TOP_ADMIN_ROLE, STAFF_ROLE] as const;

/** modules that can be given to other admins */
export const MODULES = [
  { key: "dashboard", path: "/admin/dashboard", label: { zh: "指挥中心", en: "Command Center" } },
  { key: "inquiries", path: "/admin/inquiries", label: { zh: "询盘管理", en: "Inquiries" } },
  { key: "content", path: "/admin/content", label: { zh: "内容管理", en: "Content" } },
  { key: "analytics", path: "/admin/analytics", label: { zh: "数据分析", en: "Analytics" } },
] as const;

export type ModuleKey = (typeof MODULES)[number]["key"];
export const MODULE_KEYS: ModuleKey[] = MODULES.map((m) => m.key);

/** pages only the top admin can open */
export const TOP_ADMIN_PATHS = ["/admin/users", "/admin/settings"];

/** pages every logged-in admin can open */
export const OPEN_ADMIN_PATHS = ["/admin/login", "/admin/no-access"];

export function isModuleKey(value: unknown): value is ModuleKey {
  return typeof value === "string" && (MODULE_KEYS as string[]).includes(value);
}

/**
 * Modules an account can use.
 * Older accounts without ticks keep what their old role allowed.
 */
export function effectiveModules(role: string | null | undefined, permissions: unknown): ModuleKey[] {
  if (role === TOP_ADMIN_ROLE) return [...MODULE_KEYS];

  const ticked = Array.isArray(permissions) ? permissions.filter(isModuleKey) : [];
  if (ticked.length > 0) return MODULE_KEYS.filter((k) => ticked.includes(k));

  if (role === "MANAGER") return ["dashboard", "inquiries", "content", "analytics"];
  if (role === "EDITOR") return ["content"];
  return [];
}

export function hasModule(role: string | null | undefined, permissions: unknown, module: ModuleKey): boolean {
  return effectiveModules(role, permissions).includes(module);
}

function matches(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/");
}

/** the module an admin page belongs to (null = top admin only or not a module page) */
export function moduleForPath(pathname: string): ModuleKey | null {
  const found = MODULES.find((m) => matches(pathname, m.path));
  return found ? found.key : null;
}

export function isTopAdminPath(pathname: string): boolean {
  return TOP_ADMIN_PATHS.some((p) => matches(pathname, p));
}

/** where to send an admin who opened a page they may not use */
export function homePathFor(role: string | null | undefined, permissions: unknown): string {
  const modules = effectiveModules(role, permissions);
  const first = MODULES.find((m) => modules.includes(m.key));
  return first ? first.path : "/admin/no-access";
}

/** true when the page can be opened by this account */
export function canOpenAdminPath(role: string | null | undefined, permissions: unknown, pathname: string): boolean {
  if (role === TOP_ADMIN_ROLE) return true;
  if (isTopAdminPath(pathname)) return false;
  const pageModule = moduleForPath(pathname);
  if (!pageModule) return OPEN_ADMIN_PATHS.includes(pathname); // anything else: top admin only
  return hasModule(role, permissions, pageModule);
}
