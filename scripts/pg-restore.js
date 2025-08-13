#!/usr/bin/env node
/* Restore PostgreSQL dari ./backup
   Flags:
     --mode=new|overwrite|createfromdump
     --file=path/to/dump        (mendukung .dump atau folder dump format directory)
*/
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// parse flags: --key=value atau --flag
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  })
);

const {
  DB_HOST = "localhost",
  DB_PORT = "5432",
  DB_USER = "postgres",
  DB_PASSWORD = "",
  DB_NAME = "postgres",
} = process.env;

const mode = String(args.mode || "new").toLowerCase(); // 'new' | 'overwrite' | 'createfromdump'
const explicitPath = args.file ? path.resolve(String(args.file)) : null;

const shellOnWin = process.platform === "win32"; // gunakan shell di Windows agar temukan pg_* di PATH

const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`; // simple double-quote

function run(cmdStr) {
  const res = spawnSync(cmdStr, {
    stdio: "inherit",
    env: { ...process.env, PGPASSWORD: DB_PASSWORD },
    shell: true, // pakai string command + quoting → aman utk Windows & Linux
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

function runCapture(cmdStr) {
  const res = spawnSync(cmdStr, {
    stdio: ["ignore", "pipe", "inherit"],
    env: { ...process.env, PGPASSWORD: DB_PASSWORD },
    shell: true,
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
  return (res.stdout || "").toString();
}

function latestDumpPath() {
  const backupDir = path.join(process.cwd(), "backup");
  if (!fs.existsSync(backupDir)) {
    console.error(`[restore] Folder ${backupDir} tidak ada`);
    process.exit(1);
  }

  // Ambil .dump files dan folder (format directory)
  const entries = fs.readdirSync(backupDir).map((name) => {
    const p = path.join(backupDir, name);
    const stat = fs.statSync(p);
    return { p, name, isDir: stat.isDirectory(), mtime: stat.mtimeMs };
  });

  // Prioritaskan newest apapun (file .dump atau folder)
  const cands = entries
    .filter(e => e.isDir || e.name.endsWith(".dump"))
    .sort((a, b) => b.mtime - a.mtime);

  if (!cands.length) {
    console.error("[restore] Tidak ada file .dump atau folder dump di ./backup");
    process.exit(1);
  }
  return cands[0].p;
}

const dumpPath = explicitPath || latestDumpPath();
if (!fs.existsSync(dumpPath)) {
  console.error(`[restore] File/folder tidak ditemukan: ${dumpPath}`);
  process.exit(1);
}

const isDirectoryDump = fs.statSync(dumpPath).isDirectory();

console.log(`[restore] Host=${DB_HOST} Port=${DB_PORT} User=${DB_USER}`);
console.log(`[restore] Dump: ${dumpPath}${isDirectoryDump ? " (directory format)" : ""}`);

if (mode === "createfromdump") {
  console.log("[restore] Mode=createfromdump → biarkan pg_restore membuat DB dari metadata dump");
  run(`pg_restore -h ${q(DB_HOST)} -p ${DB_PORT} -U ${q(DB_USER)} -d postgres --clean --create --no-owner --no-privileges ${q(dumpPath)}`);
  console.log("[restore] Selesai ✅");
  process.exit(0);
}

const targetDb = mode === "overwrite" ? DB_NAME : `${DB_NAME}_restore`;
console.log(`[restore] Mode=${mode} → Target DB: ${targetDb}`);

function stopConnections(db) {
  run(`psql -h ${q(DB_HOST)} -p ${DB_PORT} -U ${q(DB_USER)} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${db}' AND pid <> pg_backend_pid();"`);
}

function ensureDbExists(db) {
  const out = runCapture(`psql -h ${q(DB_HOST)} -p ${DB_PORT} -U ${q(DB_USER)} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${db}'"`);
  const exists = out.toString().trim() === "1";
  if (!exists) {
    run(`psql -h ${q(DB_HOST)} -p ${DB_PORT} -U ${q(DB_USER)} -d postgres -c "CREATE DATABASE \\"${db}\\";"`);
  }
}

if (mode === "overwrite") {
  console.log("[restore] Memutus koneksi aktif…");
  stopConnections(targetDb);

  console.log("[restore] Drop database (jika ada) …");
  run(`psql -h ${q(DB_HOST)} -p ${DB_PORT} -U ${q(DB_USER)} -d postgres -c "DROP DATABASE IF EXISTS \\"${targetDb}\\";"`);

  console.log("[restore] Create database…");
  run(`psql -h ${q(DB_HOST)} -p ${DB_PORT} -U ${q(DB_USER)} -d postgres -c "CREATE DATABASE \\"${targetDb}\\";"`);
} else {
  // mode=new
  ensureDbExists(targetDb);
}

console.log("[restore] pg_restore berjalan…");
run(`pg_restore -h ${q(DB_HOST)} -p ${DB_PORT} -U ${q(DB_USER)} -d ${q(targetDb)} --clean --if-exists --no-owner --no-privileges ${q(dumpPath)}`);

console.log("[restore] Selesai ✅");
