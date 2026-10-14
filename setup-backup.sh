#!/bin/bash
# Youyang website - daily database backup (run once as ROOT)
# Only READS the database (pg_dump). Does not change the website, the code or the data.
set -e
if [ "$(id -u)" != "0" ]; then echo "Please run as root:  su -   then   bash /home/admin/setup-backup.sh"; exit 1; fi

BACKUP_DIR=/home/admin/backups

echo ""
echo "===== 1/4  Creating backup folder $BACKUP_DIR ====="
mkdir -p "$BACKUP_DIR"
chown postgres:admin "$BACKUP_DIR"
chmod 770 "$BACKUP_DIR"

echo ""
echo "===== 2/4  Writing the backup command /usr/local/bin/youyang-backup ====="
cat > /usr/local/bin/youyang-backup <<'EOF'
#!/bin/bash
# Exports the youyang database to a compressed file and keeps the last 14 days.
BACKUP_DIR=/home/admin/backups
FILE="$BACKUP_DIR/youyang-$(date +%F_%H%M).dump"
cd /tmp
sudo -u postgres pg_dump -Fc youyang -f "$FILE" && chmod 640 "$FILE" && chgrp admin "$FILE"
find "$BACKUP_DIR" -name 'youyang-*.dump' -mtime +14 -delete
echo "$(date '+%F %T') backup saved: $FILE ($(du -h "$FILE" | cut -f1))" >> "$BACKUP_DIR/backup.log"
EOF
chmod 755 /usr/local/bin/youyang-backup

echo ""
echo "===== 3/4  Scheduling it every night at 03:00 ====="
if ! command -v crond >/dev/null 2>&1; then dnf install -y cronie; fi
systemctl enable --now crond
echo '0 3 * * * root /usr/local/bin/youyang-backup' > /etc/cron.d/youyang-backup
chmod 644 /etc/cron.d/youyang-backup

echo ""
echo "===== 4/4  Running one backup now to test ====="
/usr/local/bin/youyang-backup
ls -lh "$BACKUP_DIR"
cat "$BACKUP_DIR/backup.log"

echo ""
echo "=================================================="
echo " BACKUPS ARE ON"
echo " Every night at 03:00, kept for 14 days, in $BACKUP_DIR"
echo " Run a backup any time:   sudo youyang-backup"
echo "=================================================="
