import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import db from './server/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy if behind a load balancer (like Cloud Run)
  app.set('trust proxy', 1);

  app.use(express.json());

  // Rate limiting for URL shortening (spam protection)
  const shortenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
    message: { error: 'Too many URLs created from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Rate limiting for Admin Login
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window`
    message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // --- Middleware ---
  const authenticateAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- Public API Routes ---
  
  // 1. Create short URL
  app.post('/api/shorten', shortenLimiter, (req, res) => {
    const { original_url } = req.body;
    const ip_address = req.ip || req.socket.remoteAddress || 'unknown';

    if (!original_url || typeof original_url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
      new URL(original_url); // Validate URL format
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Check if URL already exists to return faster
    try {
      const existingUrl = db.prepare('SELECT short_code FROM urls WHERE original_url = ?').get(original_url) as any;
      if (existingUrl) {
        const baseUrl = process.env.BASE_URL || process.env.APP_URL || `http://localhost:${PORT}`;
        return res.json({
          short_code: existingUrl.short_code,
          original_url,
          short_url: `${baseUrl}/${existingUrl.short_code}`
        });
      }
    } catch (err) {
      console.error('Error checking existing URL:', err);
    }

    // Generate unique short code (6 chars)
    const generateCode = () => crypto.randomBytes(3).toString('hex');
    let short_code = generateCode();
    
    // Ensure uniqueness with a max retry limit to prevent infinite loops
    let isUnique = false;
    let retries = 0;
    while (!isUnique && retries < 10) {
      const existing = db.prepare('SELECT id FROM urls WHERE short_code = ?').get(short_code);
      if (!existing) {
        isUnique = true;
      } else {
        short_code = generateCode();
        retries++;
      }
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate unique code' });
    }

    try {
      const stmt = db.prepare('INSERT INTO urls (short_code, original_url, ip_address) VALUES (?, ?, ?)');
      stmt.run(short_code, original_url, ip_address);
      
      const baseUrl = process.env.BASE_URL || process.env.APP_URL || `http://localhost:${PORT}`;
      res.json({
        short_code,
        original_url,
        short_url: `${baseUrl}/${short_code}`
      });
    } catch (error) {
      console.error('Error inserting URL:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // 2. Get original URL for redirect
  app.get('/api/url/:code', async (req, res) => {
    const { code } = req.params;
    const ip_address = req.ip || req.socket.remoteAddress || 'unknown';
    const user_agent = req.headers['user-agent'] || 'unknown';

    const row = db.prepare('SELECT original_url FROM urls WHERE short_code = ?').get(code) as { original_url: string } | undefined;
    
    if (!row) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Record click
    try {
      let country = null;
      if (ip_address !== 'unknown' && ip_address !== '::1' && ip_address !== '127.0.0.1') {
        try {
          const clientIp = typeof ip_address === 'string' ? ip_address.split(',')[0].trim() : ip_address[0];
          const geoRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=country`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.country) {
              country = geoData.country;
            }
          }
        } catch (e) {
          console.error('IP Geolocation error:', e);
        }
      }

      db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?').run(code);
      db.prepare('INSERT INTO clicks (short_code, ip_address) VALUES (?, ?)').run(code, ip_address);
      db.prepare('INSERT INTO traffic_logs (short_code, ip_address, user_agent, country) VALUES (?, ?, ?, ?)').run(code, ip_address, user_agent, country);
    } catch (err) {
      console.error('Error recording click:', err);
    }

    res.json({ original_url: row.original_url });
  });

  // 3. Get stats
  app.get('/api/stats/:code', (req, res) => {
    const { code } = req.params;

    const urlStats = db.prepare('SELECT * FROM urls WHERE short_code = ?').get(code) as any;
    
    if (!urlStats) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const recentClicks = db.prepare('SELECT clicked_at, ip_address FROM clicks WHERE short_code = ? ORDER BY clicked_at DESC LIMIT 50').all(code);

    res.json({
      ...urlStats,
      recentClicks
    });
  });

  // 4. Blog Public API
  app.get('/api/blog', (req, res) => {
    const posts = db.prepare('SELECT id, title, slug, meta_description, created_at FROM blog_posts ORDER BY created_at DESC').all();
    res.json(posts);
  });

  app.get('/api/blog/:slug', (req, res) => {
    const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  });

  // 5. Sitemap
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.BASE_URL || process.env.APP_URL || `http://localhost:${PORT}`;
    const posts = db.prepare('SELECT slug FROM blog_posts').all() as any[];
    const topLinks = db.prepare('SELECT short_code FROM urls ORDER BY clicks DESC LIMIT 10').all() as any[];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
    xml += `  <url><loc>${baseUrl}/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>\n`;
    
    posts.forEach(post => {
      xml += `  <url><loc>${baseUrl}/blog/${post.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    });

    topLinks.forEach(link => {
      xml += `  <url><loc>${baseUrl}/stats/${link.short_code}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;
    });

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // --- Admin API Routes ---
  
  app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username) as any;
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  });

  app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
    const totalLinks = (db.prepare('SELECT COUNT(*) as count FROM urls').get() as any).count;
    const totalClicks = (db.prepare('SELECT SUM(clicks) as count FROM urls').get() as any).count || 0;
    const visitorsToday = (db.prepare("SELECT COUNT(DISTINCT ip_address) as count FROM traffic_logs WHERE date(visit_time) = date('now')").get() as any).count;
    const visitorsMonth = (db.prepare("SELECT COUNT(DISTINCT ip_address) as count FROM traffic_logs WHERE strftime('%Y-%m', visit_time) = strftime('%Y-%m', 'now')").get() as any).count;
    const topLinks = db.prepare('SELECT short_code, original_url, clicks FROM urls ORDER BY clicks DESC LIMIT 5').all();
    const recentLinks = db.prepare('SELECT short_code, original_url, created_at FROM urls ORDER BY created_at DESC LIMIT 5').all();

    res.json({ totalLinks, totalClicks, visitorsToday, visitorsMonth, topLinks, recentLinks });
  });

  app.get('/api/admin/links', authenticateAdmin, (req, res) => {
    const links = db.prepare('SELECT * FROM urls ORDER BY created_at DESC').all();
    res.json(links);
  });

  app.delete('/api/admin/links/:code', authenticateAdmin, (req, res) => {
    const { code } = req.params;
    db.prepare('DELETE FROM traffic_logs WHERE short_code = ?').run(code);
    db.prepare('DELETE FROM clicks WHERE short_code = ?').run(code);
    db.prepare('DELETE FROM urls WHERE short_code = ?').run(code);
    res.json({ success: true });
  });

  app.get('/api/admin/traffic', authenticateAdmin, (req, res) => {
    const totalVisitors = (db.prepare('SELECT COUNT(DISTINCT ip_address) as count FROM traffic_logs').get() as any).count;
    const totalClicks = (db.prepare('SELECT COUNT(*) as count FROM traffic_logs').get() as any).count;
    
    // Clicks per day (last 7 days)
    const clicksPerDay = db.prepare(`
      SELECT date(visit_time) as date, COUNT(*) as clicks 
      FROM traffic_logs 
      WHERE visit_time >= date('now', '-7 days')
      GROUP BY date(visit_time)
      ORDER BY date(visit_time) ASC
    `).all();

    const topLinks = db.prepare('SELECT short_code, clicks FROM urls ORDER BY clicks DESC LIMIT 10').all();

    res.json({ totalVisitors, totalClicks, clicksPerDay, topLinks });
  });

  // Admin Blog CRUD
  app.post('/api/admin/blog', authenticateAdmin, (req, res) => {
    const { title, slug, content, meta_title, meta_description } = req.body;
    try {
      db.prepare('INSERT INTO blog_posts (title, slug, content, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)')
        .run(title, slug, content, meta_title, meta_description);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/admin/blog/:id', authenticateAdmin, (req, res) => {
    const { title, slug, content, meta_title, meta_description } = req.body;
    try {
      db.prepare('UPDATE blog_posts SET title=?, slug=?, content=?, meta_title=?, meta_description=? WHERE id=?')
        .run(title, slug, content, meta_title, meta_description, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/admin/blog/:id', authenticateAdmin, (req, res) => {
    db.prepare('DELETE FROM blog_posts WHERE id=?').run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
