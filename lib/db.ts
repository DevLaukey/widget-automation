import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH  = path.join(DATA_DIR, "app.db");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Singleton — reuse across hot-reloads in dev
const globalDb = global as typeof global & { __db?: Database.Database };

function openDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL"); // better concurrent read performance
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  return db;
}

export function getDb(): Database.Database {
  if (!globalDb.__db) globalDb.__db = openDb();
  return globalDb.__db;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function dbGet<T>(key: string): T | null {
  const row = getDb()
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(key) as { value: string } | undefined;
  if (!row) return null;
  try { return JSON.parse(row.value) as T; } catch { return null; }
}

export function dbSet(key: string, value: unknown): void {
  getDb()
    .prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `)
    .run(key, JSON.stringify(value), new Date().toISOString());
}

export function dbUpdatedAt(key: string): string | null {
  const row = getDb()
    .prepare("SELECT updated_at FROM settings WHERE key = ?")
    .get(key) as { updated_at: string } | undefined;
  return row?.updated_at ?? null;
}
