import { getCache, setCache } from '../../lib/sheetCache';
import { fetchAllSheetData } from '../../lib/googleSheets';

export default async function handler(req, res) {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 CLIENT REQUEST: /api/sheet');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check cache first - if data exists, return it immediately
    // Cache is only invalidated by webhook, so clients can poll freely
    const cachedData = getCache('all');
    if (cachedData) {
      console.log('✅ CACHE HIT: Returning cached data');
      console.log(`   Cached at: ${cachedData.timestamp}`);
      console.log(`   Age: ${Math.round((Date.now() - new Date(cachedData.timestamp)) / 1000)}s`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return res.status(200).json({ 
        cached: true, 
        data: cachedData.data,
        timestamp: cachedData.timestamp
      });
    }

    // Fetch all sheets from Google Sheets
    console.log('❌ CACHE MISS: Fetching fresh data from Google Sheets...');
    const allData = await fetchAllSheetData();
    const sheetNames = Object.keys(allData);
    const totalRows = Object.values(allData).reduce((sum, rows) => sum + rows.length, 0);
    console.log(`✅ GOOGLE SHEETS FETCH COMPLETE:`);
    console.log(`   Sheets: ${sheetNames.join(', ')}`);
    console.log(`   Total rows: ${totalRows}`);

    // Update cache with fresh data
    setCache('all', allData);
    console.log('💾 Cache updated');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({ cached: false, data: allData });
  } catch (err) {
    console.error('❌ ERROR in /api/sheet:', err.message || err);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    res.status(500).json({ error: err.message || String(err) });
  }
}
