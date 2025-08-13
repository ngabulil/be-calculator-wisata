#!/usr/bin/env node
/* Backup PostgreSQL ke ./backup (single file .dump, aman utk path spasi) */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const {
  DB_HOST = "localhost",
  DB_PORT = "5432",
  DB_USER = "postgres",
  DB_PASSWORD = "",
  DB_NAME = "postgres",
} = process.env;

const backupDir = path.join(process.cwd(), "backup");
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const ts = new Date();
const pad = (n) => String(n).padStart(2, "0");
const timestamp = `${ts.getFullYear()}-${pad(ts.getMonth() + 1)}-${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}`;
const filePath = path.join(backupDir, `backup_${timestamp}_${DB_NAME}.dump`);

console.log(`[backup] Host=${DB_HOST} Port=${DB_PORT} User=${DB_USER} DB=${DB_NAME}`);
console.log(`[backup] Output: ${filePath}`);

// Format custom (-F c) TIDAK mendukung -j (parallel)
const cmd = [
  "pg_dump",
  `-h "${DB_HOST}"`,
  `-p ${DB_PORT}`,
  `-U "${DB_USER}"`,
  `-F c`,
  `-Z 6`,                  // opsional: kompresi (0-9). Boleh hapus kalau mau.
  `-f "${filePath}"`,
  `"${DB_NAME}"`
].join(" ");

const res = spawnSync(cmd, {
  stdio: "inherit",
  env: { ...process.env, PGPASSWORD: DB_PASSWORD },
  shell: true,
});

if (res.status === 0) {
  console.log("[backup] Selesai ✅");
  const listCmd = `pg_restore -l "${filePath}"`;
  spawnSync(listCmd, {
    stdio: "inherit",
    env: { ...process.env, PGPASSWORD: DB_PASSWORD },
    shell: true,
  });
  process.exit(0);
} else {
  console.error("[backup] Gagal ❌");
  process.exit(res.status ?? 1);
}
