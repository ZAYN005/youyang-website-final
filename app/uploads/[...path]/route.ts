import { readFile, stat } from "fs/promises";
import path from "path";

import { MIME_BY_EXT, resolveUploadPath } from "@/lib/cms/uploads";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";


/** serves images uploaded in 内容管理 (stored outside the website folder) */
export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {

  const { path: segments } = await context.params;
  const filePath = resolveUploadPath(segments ?? []);

  if (!filePath) return new Response("Not found", { status: 404 });

  const mime = MIME_BY_EXT[path.extname(filePath).toLowerCase()];
  if (!mime) return new Response("Not found", { status: 404 });

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const data = await readFile(filePath);

    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Content-Length": String(data.length),
        // file names are unique, so they can be cached for a long time
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }

}
