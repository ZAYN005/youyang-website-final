// Sets (or creates) an admin login in the LOCAL database from .env.
// Usage:  node reset-local-admin.cjs
// It asks for the email and the new password in the terminal; nothing is saved in this file.
require("fs").existsSync(".env") && process.loadEnvFile?.(".env");

const readline = require("readline");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));

(async () => {
  const prisma = new PrismaClient();
  try {
    const db = (process.env.DATABASE_URL || "").replace(/\/\/[^@]*@/, "//***@");
    console.log("Database:", db || "(DATABASE_URL not found in .env)");

    const admins = await prisma.admin.findMany({ select: { email: true, role: true } });
    console.log("Admins in this database:", admins.length ? admins.map((a) => `${a.email} (${a.role})`).join(", ") : "none");

    const email = (await ask("Email to set [admin@yyteck.cn]: ")) || "admin@yyteck.cn";
    const password = await ask("New password (min 8 chars): ");
    if (password.length < 8) throw new Error("Password too short - nothing changed.");

    const hash = await bcrypt.hash(password, 10);
    await prisma.admin.upsert({
      where: { email },
      update: { password: hash },
      create: { email, name: "Youyang Admin", password: hash, role: "ADMIN" },
    });
    console.log(`Done. Log in at http://localhost:3000/admin/login with ${email}`);
  } catch (error) {
    console.error("\nFAILED:", error.message || error);
    process.exitCode = 1;
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
})();
