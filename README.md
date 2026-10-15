# Youyang Intelligent Control: Company Website

Bilingual (English / 中文) B2B website for **Jiangsu Youyang Intelligent Control Technology (江苏攸洋智控)**, a maker of panoramic AI vision cameras.
Built during my internship and **live in production at [www.yyteck.cn](https://www.yyteck.cn)**.

## Highlights
- **Bilingual by design:** every page, form and admin screen is available in English and Chinese (next-intl).
- **Admin dashboard:** login-protected, with an inquiry inbox, site statistics and system monitoring.
- **Content management:** company staff edit page text and images themselves, with no code changes.
- **Self-hosted deployment:** runs on the company's Alibaba Cloud Linux server, not a managed platform.
- **Automated backups:** the PostgreSQL database and uploaded images are backed up nightly, with 14-day retention.

## Tech stack
| Layer | Tools |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS, next-intl |
| Backend | Next.js route handlers, NextAuth, Prisma ORM |
| Database | PostgreSQL |
| Operations | Linux (Alibaba Cloud), PM2, cron, Bash |

## Deployment
The site is built and served on a 2 GB cloud server:
1. `setup1.sh` installs Node.js and PM2 in the user's home folder (no root needed), installs dependencies from a China mirror and builds with a memory cap that fits the server.
2. PM2 keeps the app running and restarts it on failure.
3. `setup-backup.sh` installs a nightly cron job that dumps the database (`pg_dump`), archives uploaded images and deletes backups older than 14 days.

## Run locally
```bash
npm install
npx prisma migrate dev
npm run dev
```
Then open http://localhost:3000.

## Author
**Zain Ali**, Application Developer Intern, Jiangsu Youyang Intelligent Control Technology
[GitHub](https://github.com/ZAYN005) · zain01chaudhary@gmail.com
