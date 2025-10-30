// Webhook endpoint for Google Apps Script to notify when sheet changes
// Receives sheet data directly from the webhook and broadcasts to all clients via Pusher

import Pusher from 'pusher';

// Initialize Pusher (credentials from environment variables)
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true
});

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
    // Get sheet data from webhook payload
    const allData = req.body?.data;
    
    if (!allData || typeof allData !== 'object') {
      throw new Error('No sheet data in webhook payload. Make sure Google Apps Script is sending the data.');
    }
    
    const sheetNames = Object.keys(allData);
    const totalRows = Object.values(allData).reduce((sum, rows) => sum + rows.length, 0);
    
    console.log(`📊 Data received from webhook:`);
    console.log(`   Sheets: ${sheetNames.join(', ')}`);
    console.log(`   Total rows: ${totalRows}`);
    
    // Broadcast to all connected Pusher clients
    const timestamp = new Date().toISOString();
    console.log('📡 Broadcasting update to all connected clients via Pusher...');
    console.log(`   Channel: sheet-updates`);
    console.log(`   Event: sheet-update`);
    console.log(`   Payload size: ${JSON.stringify({ data: allData, timestamp }).length} bytes`);
    
    await pusher.trigger('sheet-updates', 'sheet-update', {
      data: allData,
      timestamp
    });
    
    console.log('✅ Pusher broadcast complete - clients should receive update now!');
    
    console.log('✅ WEBHOOK PROCESSING COMPLETE:');
    console.log(`   Sheets broadcasted: ${sheetNames.join(', ')}`);
    console.log(`   Total rows: ${totalRows}`);
    console.log(`   Timestamp: ${timestamp}`);
    console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return res.status(200).json({ 
      success: true, 
      sheets: sheetNames,
      totalRows,
      timestamp
    });
  } catch (error) {
    console.error('❌ WEBHOOK ERROR:', error.message);
    console.error('Stack:', error.stack);
    console.log('🔔━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return res.status(500).json({ 
      error: 'Failed to process webhook',
      message: error.message 
    });
  }
}
