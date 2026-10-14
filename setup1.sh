#!/bin/bash
# Youyang website - server setup, part 1 (no sudo needed)
# Installs Node.js + PM2 in your home folder, unpacks the code, installs packages and builds.
set -e

echo ""
echo "===== 1/5  Installing Node.js 22 into ~/node ====="
cd ~
if [ ! -x "$HOME/node/bin/node" ]; then
  curl -fL -o node.tar.xz https://npmmirror.com/mirrors/node/v22.12.0/node-v22.12.0-linux-x64.tar.xz
  mkdir -p "$HOME/node"
  tar -xJf node.tar.xz -C "$HOME/node" --strip-components=1
  rm -f node.tar.xz
fi
grep -q 'HOME/node/bin' ~/.bashrc || echo 'export PATH=$HOME/node/bin:$PATH' >> ~/.bashrc
export PATH="$HOME/node/bin:$PATH"
echo "node: $(node -v)   npm: $(npm -v)"
npm config set registry https://registry.npmmirror.com

echo ""
echo "===== 2/5  Installing PM2 ====="
npm install -g pm2
pm2 -v

echo ""
echo "===== 3/5  Unpacking website code into ~/youyang-website ====="
mkdir -p "$HOME/youyang-website"
tar -xzf "$HOME/youyang.tar.gz" -C "$HOME/youyang-website"
cd "$HOME/youyang-website"
ls

echo ""
echo "===== 4/5  Installing packages (a few minutes) ====="
export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
npm ci

echo ""
echo "===== 5/5  Building the website (5-10 minutes) ====="
# The type check already passed on the laptop; skipping it here saves memory on this 2 GB server.
cat > next.config.ts <<'EOF'
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
};

export default withNextIntl(nextConfig);
EOF
NODE_OPTIONS=--max-old-space-size=1536 npm run build

echo ""
echo "===== ALL DONE - part 1 finished successfully ====="
