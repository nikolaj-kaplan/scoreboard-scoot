// ============================================
// Google Apps Script: Sheet Change Webhook with Data Push
// ============================================
// 
// This script sends ALL sheet data to your webhook endpoints when changes occur
// No need for the server to fetch from Google Sheets API!
//
// HOW TO USE:
// 1. Open your Google Sheet
// 2. Extensions → Apps Script
// 3. Replace all code with this file
// 4. Update WEBHOOK_URLS below
// 5. Save and set up triggers (see WEBHOOK_SETUP.md)

// IMPORTANT: Update these URLs with your server endpoints!
const WEBHOOK_URLS = [
  'https://xkr2cvs3-3000.euw.devtunnels.ms/api/sheet-webhook',  // Local dev (VS Code port forwarding)
  'https://scoreboard-scoot-521863.vercel.app/api/sheet-webhook' // Production (Vercel)
];

/**
 * Fetches all sheets starting with "Out" and returns their data
 */
function getAllOutSheetsData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  const data = {};
  
  // Filter sheets starting with "Out"
  const outSheets = sheets.filter(function(sheet) {
    return sheet.getName().indexOf('Out') === 0;
  });
  
  Logger.log('Found ' + outSheets.length + ' sheets starting with "Out"');
  
  // Fetch data from each sheet
  outSheets.forEach(function(sheet) {
    const sheetName = sheet.getName();
    Logger.log('Fetching data from: ' + sheetName);
    
    // Get all data from the sheet
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    // Convert to array of arrays (already in correct format)
    data[sheetName] = values;
    
    Logger.log('  → ' + values.length + ' rows fetched');
  });
  
  return data;
}

/**
 * Sends webhook notifications with sheet data to all configured URLs
 */
function sendWebhook(eventType, changeDetails) {
  Logger.log('Fetching sheet data...');
  const sheetData = getAllOutSheetsData();
  
  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    changeDetails: changeDetails || {},
    data: sheetData  // <<< ALL SHEET DATA INCLUDED HERE
  };
  
  const jsonPayload = JSON.stringify(payload);
  Logger.log('Payload size: ' + jsonPayload.length + ' bytes');
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: jsonPayload,
    muteHttpExceptions: true
  };

  // Send to all URLs
  WEBHOOK_URLS.forEach(function(url) {
    try {
      Logger.log('Sending webhook to: ' + url);
      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      
      if (responseCode === 200) {
        Logger.log('✓ Webhook sent successfully to: ' + url);
      } else {
        Logger.log('✗ Webhook failed for: ' + url + ' Status: ' + responseCode);
      }
    } catch (error) {
      Logger.log('✗ Error sending webhook to: ' + url + ' - ' + error.toString());
    }
  });
}

/**
 * Triggered when a cell is edited
 */
function onEdit(e) {
  const sheet = e.range.getSheet();
  const details = {
    sheetName: sheet.getName(),
    range: e.range.getA1Notation(),
    oldValue: e.oldValue,
    value: e.value
  };
  
  Logger.log('Edit detected: ' + JSON.stringify(details));
  sendWebhook('edit', details);
}

/**
 * Triggered when sheet structure changes
 * Requires an INSTALLABLE trigger (see WEBHOOK_SETUP.md)
 */
function onChange(e) {
  const details = {
    changeType: e.changeType,
    triggerUid: e.triggerUid
  };
  
  Logger.log('Change detected: ' + JSON.stringify(details));
  sendWebhook('change', details);
}

/**
 * Manual test function
 * Run this from Apps Script editor to test your webhook
 */
function testWebhook() {
  Logger.log('Running manual webhook test...');
  sendWebhook('test', { message: 'Manual test trigger' });
  
  SpreadsheetApp.getUi().alert(
    'Webhook Test',
    'Test webhook sent to ' + WEBHOOK_URLS.length + ' URL(s)\n\n' +
    'Check your server console for the result.\n' +
    'Check Apps Script logs (View → Logs) for details.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Test function to see what data would be sent
 * Run this to preview the data structure
 */
function previewData() {
  const data = getAllOutSheetsData();
  
  let summary = 'Sheets that will be sent:\n\n';
  for (var sheetName in data) {
    summary += '• ' + sheetName + ': ' + data[sheetName].length + ' rows\n';
  }
  
  Logger.log(summary);
  Logger.log('Full data structure:');
  Logger.log(JSON.stringify(data, null, 2));
  
  SpreadsheetApp.getUi().alert(
    'Data Preview',
    summary + '\nSee Apps Script logs (View → Logs) for full data.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
