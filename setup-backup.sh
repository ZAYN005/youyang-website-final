#!/bin/bash
# Youyang website - daily backup of the database and uploaded images.
# Run once with:  sudo bash setup-backup.sh
# Only READS the database (pg_dump). Does not change the website, the code or the data.
set -e
if [ "$(id -u)" != "0" ]; then echo "Please run with sudo:  sudo bash setup-backup.sh"; exit 1; fi

BACKUP_DIR=/home/admin/backups

echo ""
echo "===== 1/4  Backup folder $BACKUP_DIR ====="
mkdir -p "$BACKUP_DIR"
chown admin:admin "$BACKUP_DIR"
chmod 750 "$BACKUP_DIR"
# remove the wrong log line / empty files from the first attempt
rm -f "$BACKUP_DIR"/backup.log
find "$BACKUP_DIR" -name 'youyang-*.dump' -size 0 -delete

echo ""
echo "===== 2/4  Writing the backup command /usr/local/bin/youyang-backup ====="
cat > /usr/local/bin/youyang-backup <<'SCRIPT'
#!/bin/bash
# Saves the youyang database + uploaded images, keeps the last 14 days.
set -o pipefail
BACKUP_DIR=/home/admin/backups
STAMP=$(date +%F_%H%M)
DB_FILE="$BACKUP_DIR/youyang-$STAMP.dump"
IMG_FILE="$BACKUP_DIR/uploads-$STAMP.tar.gz"
LOG="$BACKUP_DIR/backup.log"
cd /tmp

# postgres only READS the database and writes to stdout; root writes the file
if runuser -u postgres -- pg_dump -Fc youyang > "$DB_FILE" && [ -s "$DB_FILE" ]; then
  chown admin:admin "$DB_FILE"; chmod 640 "$DB_FILE"
  echo "$(date '+%F %T') OK   database -> $DB_FILE ($(du -h "$DB_FILE" | cut -f1))" >> "$LOG"
else
  rm -f "$DB_FILE"
  echo "$(date '+%F %T') FAIL database backup" >> "$LOG"
  STATUS=1
fi

# images uploaded in 内容管理
if [ -d /home/admin/uploads ]; then
  if tar -czf "$IMG_FILE" -C /home/admin uploads; then
    chown admin:admin "$IMG_FILE"; chmod 640 "$IMG_FILE"
    echo "$(date '+%F %T') OK   images   -> $IMG_FILE ($(du -h "$IMG_FILE" | cut -f1))" >> "$LOG"
  else
    rm -f "$IMG_FILE"
    echo "$(date '+%F %T') FAIL images backup" >> "$LOG"
    STATUS=1
  fi
fi

find "$BACKUP_DIR" -name 'youyang-*.dump' -mtime +14 -delete
find "$BACKUP_DIR" -name 'uploads-*.tar.gz' -mtime +14 -delete
chown admin:admin "$LOG"
exit ${STATUS:-0}
SCRIPT
chmod 755 /usr/local/bin/youyang-backup

echo ""
echo "===== 3/4  Scheduling it every night at 03:00 ====="
if ! command -v crond >/dev/null 2>&1; then dnf install -y cronie; fi
systemctl enable --now crond
echo '0 3 * * * root /usr/local/bin/youyang-backup' > /etc/cron.d/youyang-backup
chmod 644 /etc/cron.d/youyang-backup

echo ""
echo "===== 4/4  Running one backup now to test ====="
if /usr/local/bin/youyang-backup; then
  ls -lh "$BACKUP_DIR"
  cat "$BACKUP_DIR/backup.log"
  echo ""
  echo "=================================================="
  echo " BACKUPS ARE ON"
  echo " Every night at 03:00, kept for 14 days, in $BACKUP_DIR"
  echo " Run a backup any time:   sudo youyang-backup"
  echo "=================================================="
else
  ls -lh "$BACKUP_DIR"
  cat "$BACKUP_DIR/backup.log"
  echo ""
  echo "===== TEST BACKUP FAILED - copy everything above and send it to Claude ====="
fi
