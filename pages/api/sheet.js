import { fetchAllSheetData } from '../../lib/googleSheets';
import { getCache, setCache, getCacheMeta } from '../../lib/dataCache';

export default async function handler(req, res) {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 CLIENT REQUEST: /api/sheet');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Attempt cache first
    const cache = getCache();
    if (cache) {
      const meta = getCacheMeta();
      console.log('🔥 Cache HIT - serving cached sheet data');
      console.log(`   CachedAt: ${meta.updatedAt}`);
      console.log(`   AgeMs: ${meta.ageMs}`);
      console.log(`   Source: ${meta.source}`);
      const sheetNames = Object.keys(cache.data);
      const totalRows = Object.values(cache.data).reduce((sum, rows) => sum + rows.length, 0);
      console.log(`   Sheets: ${sheetNames.join(', ')}`);
      console.log(`   Total rows: ${totalRows}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return res.status(200).json({
        data: cache.data,
        timestamp: new Date().toISOString(),
        cacheHit: true,
        cacheUpdatedAt: meta.updatedAt,
        cacheAgeMs: meta.ageMs,
        cacheSource: meta.source
      });
    }

    // Cache miss: fetch fresh data from Google Sheets
    const fetchStartedAt = new Date();
    console.log('🧊 Cache MISS - fetching data from Google Sheets at', fetchStartedAt.toISOString());
    const allData = await fetchAllSheetData();
    const fetchCompletedAt = new Date();
    // Store in cache
    setCache(allData, 'fetch');
    const sheetNames = Object.keys(allData);
    const totalRows = Object.values(allData).reduce((sum, rows) => sum + rows.length, 0);
    console.log(`✅ FETCH & CACHE COMPLETE:`);
    console.log(`   Sheets: ${sheetNames.join(', ')}`);
    console.log(`   Total rows: ${totalRows}`);
    console.log(`   Fetch duration ms: ${fetchCompletedAt - fetchStartedAt}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({
      data: allData,
      timestamp: new Date().toISOString(),
      fetchStartedAt: fetchStartedAt.toISOString(),
      fetchCompletedAt: fetchCompletedAt.toISOString(),
      fetchDurationMs: fetchCompletedAt - fetchStartedAt,
      cacheHit: false,
      cacheUpdatedAt: fetchCompletedAt.toISOString(),
      cacheAgeMs: 0,
      cacheSource: 'fetch'
    });
  } catch (err) {
    console.error('❌ ERROR in /api/sheet:', err.message || err);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    res.status(500).json({ error: err.message || String(err) });
  }
}
