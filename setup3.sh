#!/bin/bash
# Youyang website - unpack the laptop build, update the database and start it with PM2 (no sudo, no npm install)
set -e
export PATH="$HOME/node/bin:$PATH"

echo ""
echo "===== 1/5  Unpacking the build into ~/site ====="
pm2 delete youyang >/dev/null 2>&1 || true
# keep the existing .env if this is a re-deploy
[ -f "$HOME/site/.env" ] && cp "$HOME/site/.env" "$HOME/site.env.bak"
rm -rf "$HOME/site"
mkdir -p "$HOME/site"
tar -xzf "$HOME/youyang-build.tar.gz" -C "$HOME/site"
cd "$HOME/site"
ls -a

echo ""
echo "===== 2/5  Creating server settings (.env) ====="
if [ -f "$HOME/site.env.bak" ]; then
  mv "$HOME/site.env.bak" .env
  echo "kept existing .env"
else
  SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
  cat > .env <<ENVEOF
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXTAUTH_URL=http://47.100.244.139
NEXTAUTH_SECRET=$SECRET
DATABASE_URL=postgresql://youyang:CHANGE_ME@localhost:5432/youyang
ENVEOF
  echo "created new .env"
fi

# images uploaded in the admin panel (内容管理) live outside ~/site,
# so they are kept when the website is re-deployed
mkdir -p "$HOME/uploads"
[ -n "$(tail -c1 .env)" ] && echo "" >> .env
grep -q '^UPLOAD_DIR=' .env || echo "UPLOAD_DIR=$HOME/uploads" >> .env
echo "uploads folder: $HOME/uploads"

echo ""
echo "===== 3/5  Updating the database tables (Prisma migrations) ====="
( export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma && set -a && . ./.env && set +a && "$HOME/tools/node_modules/.bin/prisma" migrate deploy --schema prisma/schema.prisma )

echo ""
echo "===== 4/5  Starting the website with PM2 ====="
HOSTNAME=0.0.0.0 pm2 start server.js --name youyang --node-args="--env-file=.env --max-old-space-size=400"
pm2 save
sleep 8
pm2 list

echo ""
echo "===== 5/5  Testing the website on the server ====="
for p in / /en /zh /en/products /en/solutions /en/contact /admin/login /admin/content; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000$p" || true)
  echo "  $p  ->  $code"
done
echo ""
echo "200 or 307 = working.  500 or 000 = problem (run: pm2 logs youyang --lines 40)"
echo "===== DONE ====="
