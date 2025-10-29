// Shared Google Sheets utilities
import { google } from 'googleapis';

/**
 * Resolve sheet ID from environment variables
 * Supports both SHEET_ID and SHEET_URL
 */
export function getSheetId() {
  const sheetIdEnv = process.env.SHEET_ID;
  const sheetUrlEnv = process.env.SHEET_URL;
  
  let sheetId = sheetIdEnv;
  if (!sheetId && sheetUrlEnv) {
    // Extract ID from Google Sheets URL formats
    const m = sheetUrlEnv.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (m && m[1]) {
      sheetId = m[1];
    } else if (/^[a-zA-Z0-9-_]+$/.test(sheetUrlEnv)) {
      // If it's already just an ID
      sheetId = sheetUrlEnv;
    }
  }
  
  return sheetId;
}

/**
 * Create authenticated Google Sheets client
 */
export async function createSheetsClient() {
  const saBase64 = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!saBase64) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT env var');
  }

  const sa = JSON.parse(Buffer.from(saBase64, 'base64').toString('utf8'));

  const jwt = new google.auth.JWT({
    email: sa.client_email,
    key: sa.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  await jwt.authorize();

  return google.sheets({ version: 'v4', auth: jwt });
}

/**
 * Quote sheet title if it contains spaces or special characters
 */
export function quoteSheetTitle(title) {
  if (!title) return title;
  
  // Already quoted
  if (/^'.*'$/.test(title)) return title;
  
  // No quoting needed for simple names
  if (/^[A-Za-z0-9_]+$/.test(title)) return title;
  
  // Escape single quotes and wrap
  return `'${title.replace(/'/g, "''")}'`;
}

/**
 * Normalize range string, ensuring sheet name is properly quoted
 */
export async function normalizeRange(sheets, sheetId, range) {
  if (!range) {
    // Fetch first sheet title and build default range
    const meta = await sheets.spreadsheets.get({ 
      spreadsheetId: sheetId, 
      fields: 'sheets.properties.title' 
    });
    const firstSheet = meta.data.sheets && meta.data.sheets[0];
    const title = firstSheet?.properties?.title || 'Sheet1';
    const quoted = quoteSheetTitle(title);
    return `${quoted}!A1:Z1000`;
  }
  
  if (!range.includes('!')) {
    // Just a sheet name, expand to full range
    const quoted = quoteSheetTitle(range);
    return `${quoted}!A1:Z1000`;
  }
  
  // Has sheet name and range, ensure sheet name is quoted
  const parts = range.split('!');
  const sheetPart = parts.shift();
  const remainder = parts.join('!');
  const quoted = quoteSheetTitle(sheetPart);
  return `${quoted}!${remainder}`;
}

/**
 * Fetch all data from the entire spreadsheet
 * Returns all sheets with their data
 */
export async function fetchAllSheetData() {
  const sheetId = getSheetId();
  if (!sheetId) {
    throw new Error('Missing SHEET_ID or SHEET_URL env var');
  }

  const sheets = await createSheetsClient();
  
  // Get all sheet names
  const meta = await sheets.spreadsheets.get({ 
    spreadsheetId: sheetId, 
    fields: 'sheets.properties.title' 
  });
  
  const sheetNames = meta.data.sheets.map(sheet => sheet.properties.title);
  console.log(`   📄 Found ${sheetNames.length} sheets: ${sheetNames.join(', ')}`);
  
  // Filter to only sheets starting with "Out"
  const outSheets = sheetNames.filter(name => name.startsWith('Out'));
  console.log(`   🎯 Filtering to sheets starting with "Out": ${outSheets.join(', ')}`);
  
  // Fetch data from all sheets
  const allData = {};
  
  for (const sheetName of outSheets) {
    const quoted = quoteSheetTitle(sheetName);
    const range = `${quoted}!A1:Z1000`; // Fetch everything
    
    try {
      console.log(`   ⬇️  Fetching: ${sheetName}...`);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range
      });
      
      const rowCount = (response.data.values || []).length;
      allData[sheetName] = response.data.values || [];
      console.log(`   ✓ ${sheetName}: ${rowCount} rows`);
    } catch (error) {
      console.error(`   ✗ Error fetching sheet ${sheetName}:`, error.message);
      allData[sheetName] = [];
    }
  }
  
  return allData;
}

/**
 * Fetch sheet data with proper authentication and range handling
 * @deprecated Use fetchAllSheetData() instead for simpler caching
 */
export async function fetchSheetData(range) {
  const sheetId = getSheetId();
  if (!sheetId) {
    throw new Error('Missing SHEET_ID or SHEET_URL env var');
  }

  const sheets = await createSheetsClient();
  const normalizedRange = await normalizeRange(sheets, sheetId, range);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: normalizedRange
  });

  return {
    rows: response.data.values || [],
    range: normalizedRange
  };
}
