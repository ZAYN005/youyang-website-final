#!/bin/bash
# Youyang website - part 4 (run as ROOT): swap, PostgreSQL, database tables, admin user, Nginx, auto-start
set -e
if [ "$(id -u)" != "0" ]; then echo "Please run as root:  su -   then   bash /home/admin/setup4.sh"; exit 1; fi

ADMIN_HOME=/home/admin
NODEBIN=$ADMIN_HOME/node/bin

echo ""
echo "===== 1/7  Adding 2 GB swap memory ====="
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
free -h

echo ""
echo "===== 2/7  Installing PostgreSQL ====="
dnf install -y postgresql-server postgresql
if [ ! -f /var/lib/pgsql/data/PG_VERSION ]; then
  postgresql-setup --initdb
fi
sed -i 's/\(host.*127\.0\.0\.1\/32\s*\)ident/\1md5/; s/\(host.*::1\/128\s*\)ident/\1md5/' /var/lib/pgsql/data/pg_hba.conf
systemctl enable --now postgresql
systemctl restart postgresql
sleep 2

echo ""
echo "===== 3/7  Creating database and user ====="
DBPASS=$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 20)
cd /tmp
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='youyang'" | grep -q 1 \
  && sudo -u postgres psql -c "ALTER USER youyang WITH PASSWORD '$DBPASS';" \
  || sudo -u postgres psql -c "CREATE USER youyang WITH PASSWORD '$DBPASS';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='youyang'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE DATABASE youyang OWNER youyang;"
sed -i "s#^DATABASE_URL=.*#DATABASE_URL=postgresql://youyang:$DBPASS@localhost:5432/youyang#" $ADMIN_HOME/site/.env
echo "database ready, .env updated"

echo ""
echo "===== 4/7  Creating the database tables (Prisma migrations) ====="
su - admin -c "export PATH=$NODEBIN:\$PATH PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma; \
  mkdir -p ~/tools && cd ~/tools && [ -f package.json ] || npm init -y >/dev/null; \
  cd ~/tools && npm install prisma@6.19.3 bcryptjs@3 --no-audit --no-fund && \
  cd ~/site && set -a && . ./.env && set +a && ~/tools/node_modules/.bin/prisma migrate deploy --schema prisma/schema.prisma"

echo ""
echo "===== 5/7  Creating the website admin login ====="
ADMINPW=$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 12)
HASH=$(su - admin -c "cd ~/tools && $NODEBIN/node -e \"console.log(require('bcryptjs').hashSync('$ADMINPW', 10))\"")
sudo -u postgres psql -d youyang -v pw="$HASH" <<'SQL'
INSERT INTO "Admin" (id, name, email, password, role, "createdAt", "updatedAt", status)
VALUES ('admin-main', 'Youyang Admin', 'admin@yyteck.cn', :'pw', 'ADMIN', now(), now(), 'ACTIVE')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, "updatedAt" = now();
SQL

echo ""
echo "===== 6/7  Installing Nginx (website on port 80) ====="
dnf install -y nginx
cat > /etc/nginx/conf.d/yyteck.conf <<'EOF'
server {
    listen 80;
    server_name yyteck.cn www.yyteck.cn 47.100.244.139;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
if command -v getenforce >/dev/null && [ "$(getenforce)" = "Enforcing" ]; then
  setsebool -P httpd_can_network_connect 1
fi
nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo ""
echo "===== 7/7  Restarting the website and enabling auto-start after reboot ====="
su - admin -c "export PATH=$NODEBIN:\$PATH; pm2 restart youyang && pm2 save"
env PATH=$PATH:$NODEBIN $NODEBIN/pm2 startup systemd -u admin --hp $ADMIN_HOME >/dev/null
sleep 6
for p in /en /zh /en/contact /admin/login; do
  echo "  port 80 $p  ->  $(curl -s -o /dev/null -w '%{http_code}' -H 'Host: 47.100.244.139' http://127.0.0.1$p)"
done

echo ""
echo "=================================================="
echo " ALL DONE"
echo " Website:      http://47.100.244.139"
echo " Admin login:  http://47.100.244.139/admin/login"
echo "   email:      admin@yyteck.cn"
echo "   password:   $ADMINPW"
echo " WRITE THIS PASSWORD DOWN and change it after first login."
echo "=================================================="
