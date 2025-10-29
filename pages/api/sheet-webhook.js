// Webhook endpoint for Google Apps Script to notify when sheet changes
// This will trigger a cache refresh by fetching the latest data

import { setCache, clearCache, getCacheInfo } from '../../lib/sheetCache';
import { fetchAllSheetData } from '../../lib/googleSheets';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('\n🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔔 WEBHOOK RECEIVED from Google Sheets');
  console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Event:', req.body?.event || 'unknown');
  console.log('Timestamp:', req.body?.timestamp || new Date().toISOString());
  if (req.body?.changeDetails) {
    console.log('Change details:', JSON.stringify(req.body.changeDetails, null, 2));
  }

  try {
    // Clear the cache first
    console.log('🗑️  Clearing cache...');
    clearCache();

    // Fetch all data from Google Sheets
    console.log('📡 Fetching fresh data from Google Sheets...');
    const allData = await fetchAllSheetData();
    
    // Update the cache with fresh data
    setCache('all', allData);

    const sheetNames = Object.keys(allData);
    const totalRows = Object.values(allData).reduce((sum, rows) => sum + rows.length, 0);
    
    console.log('✅ WEBHOOK PROCESSING COMPLETE:');
    console.log(`   Sheets refreshed: ${sheetNames.join(', ')}`);
    console.log(`   Total rows: ${totalRows}`);
    console.log(`   Cache updated at: ${new Date().toISOString()}`);
    console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return res.status(200).json({ 
      success: true, 
      sheets: sheetNames,
      totalRows,
      timestamp: new Date().toISOString(),
      cacheInfo: getCacheInfo()
    });
  } catch (error) {
    console.error('❌ WEBHOOK ERROR:', error.message);
    console.error('Stack:', error.stack);
    console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return res.status(500).json({ 
      error: 'Failed to refresh cache',
      message: error.message 
    });
  }
}
