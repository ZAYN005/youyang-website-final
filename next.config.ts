import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";


const withNextIntl = createNextIntlPlugin(
  "./i18n/request.ts"
);


const nextConfig: NextConfig = {
  // Self-contained build for the company server (build on laptop, run with node on server)
  output: "standalone",
  // Serve images as-is (the image optimizer needs a Linux-specific package)
  images: { unoptimized: true },
  // Make sure the Prisma database engines are copied into the build
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/.prisma/client/**/*"],
  },
};


export default withNextIntl(nextConfig);
