import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { isBuiltinHidden } from "./server";
import type { CatalogKind } from "./schema";


/** logged-in admins can still open hidden pages (to check them before publishing) */
export async function isAdminViewer(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    return !!session?.user;
  } catch {
    return false;
  }
}


/** used by the layout of every built-in product / solution page */
export async function guardBuiltinPage(kind: CatalogKind, slug: string): Promise<{ hidden: boolean }> {
  const hidden = await isBuiltinHidden(kind, slug);
  if (hidden && !(await isAdminViewer())) notFound();
  return { hidden };
}
