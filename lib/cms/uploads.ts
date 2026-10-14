/**
 * Image uploads for 内容管理.
 *
 * Files are stored OUTSIDE the website folder (UPLOAD_DIR), so they survive
 * redeploys, and are served by app/uploads/[...path]/route.ts at /uploads/...
 */

import path from "path";

export const UPLOAD_URL_PREFIX = "/uploads/";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export function getUploadDir(): string {
  const configured = process.env.UPLOAD_DIR;
  return path.resolve(configured && configured.trim() ? configured.trim() : path.join(process.cwd(), "uploads"));
}

export const IMAGE_TYPES: Record<string, { ext: string; mime: string }> = {
  jpeg: { ext: ".jpg", mime: "image/jpeg" },
  png: { ext: ".png", mime: "image/png" },
  webp: { ext: ".webp", mime: "image/webp" },
  gif: { ext: ".gif", mime: "image/gif" },
};

export const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/** detects the real image type from the file's first bytes (not the file name) */
export function detectImageType(bytes: Uint8Array): keyof typeof IMAGE_TYPES | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return "png";
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return "webp";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "gif";
  return null;
}

/**
 * Resolves a request path under the upload directory.
 * Returns null for anything that would escape it.
 */
export function resolveUploadPath(segments: string[]): string | null {
  if (!segments.length) return null;
  for (const segment of segments) {
    if (!segment || segment === "." || segment === ".." || segment.includes("/") || segment.includes("\\") || segment.includes("\0")) {
      return null;
    }
  }
  const root = getUploadDir();
  const full = path.resolve(root, ...segments);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
}
