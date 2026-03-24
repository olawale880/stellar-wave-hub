import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "data", "stellar_wave_hub.db");
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'contributor',
    stellar_address TEXT,
    github_url TEXT,
    bio TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'submitted',
    stellar_contract_id TEXT,
    stellar_account_id TEXT,
    tags TEXT,
    website_url TEXT,
    github_url TEXT,
    logo_url TEXT,
    user_id INTEGER REFERENCES users(id),
    featured INTEGER DEFAULT 0,
    rejection_reason TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    score INTEGER NOT NULL CHECK(score >= 1 AND score <= 5),
    purpose_score INTEGER CHECK(purpose_score >= 1 AND purpose_score <= 5),
    innovation_score INTEGER CHECK(innovation_score >= 1 AND innovation_score <= 5),
    usability_score INTEGER CHECK(usability_score >= 1 AND usability_score <= 5),
    review_text TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS financial_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    balances TEXT,
    total_received TEXT,
    total_sent TEXT,
    snapshot_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
