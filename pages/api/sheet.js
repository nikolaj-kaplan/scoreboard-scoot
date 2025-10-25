import { google } from 'googleapis';

// Simple in-memory cache
let cached = { ts: 0, data: null };
const CACHE_TTL_MS = 5000; // 5 seconds

export default async function handler(req, res) {
  try {
    const now = Date.now();
    if (cached.data && now - cached.ts < CACHE_TTL_MS) {
      return res.status(200).json({ cached: true, data: cached.data });
    }

    // Support either SHEET_ID (legacy) or SHEET_URL (full sheet link).
    // If SHEET_URL is provided, extract the sheet ID from the URL.
    const sheetIdEnv = process.env.SHEET_ID;
    const sheetUrlEnv = process.env.SHEET_URL;
    let sheetId = sheetIdEnv;
    if (!sheetId && sheetUrlEnv) {
      // Try to extract ID from common Google Sheets URL formats
      // Examples:
      // https://docs.google.com/spreadsheets/d/<<ID>>/edit#gid=0
      // https://docs.google.com/spreadsheets/d/<<ID>>/
      const m = sheetUrlEnv.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (m && m[1]) sheetId = m[1];
      else {
        // If the env is already just the id, accept it
        if (/^[a-zA-Z0-9-_]+$/.test(sheetUrlEnv)) sheetId = sheetUrlEnv;
      }
    }

    const saBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
    if (!sheetId || !saBase64) {
      return res.status(500).json({ error: 'Missing SHEET_ID or SHEET_URL or GOOGLE_SERVICE_ACCOUNT env vars.' });
    }

    const sa = JSON.parse(Buffer.from(saBase64, 'base64').toString('utf8'));

    const jwt = new google.auth.JWT({
      email: sa.client_email,
      key: sa.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    await jwt.authorize();

    const sheets = google.sheets({ version: 'v4', auth: jwt });

    // allow optional ?range=Sheet1!A1:E100 or ?range=SheetName (we'll convert it)
    let range = req.query.range;

    // Helper to quote sheet titles if they contain spaces or punctuation.
    const quoteSheetTitle = (t) => {
      if (!t) return t;
      // If already quoted (starts and ends with single quote), assume caller meant it and return as-is
      if (/^'.*'$/.test(t)) return t;
      // If title consists of only letters, numbers and underscores, no quoting needed
      if (/^[A-Za-z0-9_]+$/.test(t)) return t;
      // Otherwise escape single quotes by doubling them and wrap in single quotes
      return `'${t.replace(/'/g, "''")}'`;
    };

    // If no range provided, fetch the first sheet title and build a safe A1 range
    if (!range) {
      const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId, fields: 'sheets.properties.title' });
      const firstSheet = meta.data.sheets && meta.data.sheets[0];
      const title = firstSheet && firstSheet.properties && firstSheet.properties.title ? firstSheet.properties.title : 'Sheet1';
      const quoted = quoteSheetTitle(title);
      // request first 1000 rows and columns A..Z by default
      range = `${quoted}!A1:Z1000`;
    } else {
      // If caller passed a sheet name only (no '!'), expand to a safe A1 range
      if (!range.includes('!')) {
        const quoted = quoteSheetTitle(range);
        range = `${quoted}!A1:Z1000`;
      } else {
        // If caller passed something like Sheet Name!A1:Z100, ensure sheet name is quoted when needed
        const parts = range.split('!');
        const sheetPart = parts.shift();
        const remainder = parts.join('!');
        const quoted = quoteSheetTitle(sheetPart);
        range = `${quoted}!${remainder}`;
      }
    }

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range
    });

    const rows = resp.data.values || [];

    cached = { ts: Date.now(), data: rows };

    res.status(200).json({ cached: false, data: rows });
  } catch (err) {
    console.error('sheet api error', err.message || err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
