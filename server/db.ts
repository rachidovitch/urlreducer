import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT
  );

  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT NOT NULL,
    ip_address TEXT,
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(short_code) REFERENCES urls(short_code)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS traffic_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(short_code) REFERENCES urls(short_code)
  );

  CREATE INDEX IF NOT EXISTS idx_urls_original_url ON urls(original_url);
  CREATE INDEX IF NOT EXISTS idx_clicks_short_code ON clicks(short_code);
  CREATE INDEX IF NOT EXISTS idx_traffic_logs_short_code ON traffic_logs(short_code);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
`);

// Insert default admin if none exists
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
if (adminCount.count === 0) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hashedPassword);
  console.log('Default admin created: admin / admin123');
}

export default db;
