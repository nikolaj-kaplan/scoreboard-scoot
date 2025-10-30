import { fetchAllSheetData } from '../../lib/googleSheets';

export default async function handler(req, res) {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 CLIENT REQUEST: /api/sheet');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Fetch fresh data from Google Sheets
    console.log('📡 Fetching fresh data from Google Sheets...');
    const allData = await fetchAllSheetData();
    const sheetNames = Object.keys(allData);
    const totalRows = Object.values(allData).reduce((sum, rows) => sum + rows.length, 0);
    console.log(`✅ GOOGLE SHEETS FETCH COMPLETE:`);
    console.log(`   Sheets: ${sheetNames.join(', ')}`);
    console.log(`   Total rows: ${totalRows}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    res.status(200).json({ data: allData, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('❌ ERROR in /api/sheet:', err.message || err);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    res.status(500).json({ error: err.message || String(err) });
  }
}
