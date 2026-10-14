#!/bin/bash
# Youyang website - server setup, retry with memory limits (server has 1.8 GB RAM, no swap)
set -e
export PATH="$HOME/node/bin:$PATH"
cd "$HOME/youyang-website"

echo ""
echo "===== Memory before start ====="
free -h

echo ""
echo "===== 4/5  Installing packages, memory-limited (5-10 minutes) ====="
export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
rm -rf node_modules
NODE_OPTIONS=--max-old-space-size=640 npm ci --no-audit --no-fund --maxsockets=4

echo ""
echo "===== 5/5  Building the website, memory-limited (5-15 minutes) ====="
NODE_OPTIONS=--max-old-space-size=1100 npm run build

echo ""
echo "===== ALL DONE - packages installed and website built ====="
