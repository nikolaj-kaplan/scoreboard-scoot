# Quick Start Guide - Webhook Setup

## 1. Start ngrok (for local dev)
```powershell
ngrok http 3000
```
Copy the https URL (e.g., `https://abc123.ngrok-free.app`)

## 2. Add Apps Script to Google Sheet

Open your sheet → **Extensions** → **Apps Script** → paste this code:

```javascript
// Update the WEBHOOK_URLS array with your server URL(s)
const WEBHOOK_URLS = [
  'https://YOUR-NGROK-URL.ngrok-free.app/api/sheet-webhook',
  // Add more URLs as needed (local, staging, production, etc.)
];
const SHEET_RANGE = 'Out1_Oversigt';

function sendWebhook(eventType, changeDetails) {
  const payload = {
    event: eventType,
    range: SHEET_RANGE,
    timestamp: new Date().toISOString(),
    changeDetails: changeDetails || {}
  };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  WEBHOOK_URLS.forEach(function(url) {
    try {
      UrlFetchApp.fetch(url, options);
    } catch (error) {
      console.warn('Error sending webhook to:', url, error.toString());
    }
  });
}

function onEdit(e) {
  const sheet = e.range.getSheet();
  sendWebhook('edit', {
    sheetName: sheet.getName(),
    range: e.range.getA1Notation()
  });
}

function onChange(e) {
  sendWebhook('change', { changeType: e.changeType });
}

function testWebhook() {
  sendWebhook('test', { message: 'Manual test' });
  SpreadsheetApp.getUi().alert('Test webhook sent!');
}
```

## 3. Set Up Trigger

In Apps Script:
1. Click **clock icon** (Triggers) in left sidebar
2. Click **+ Add Trigger**
3. Function: **onChange**
4. Event source: **From spreadsheet**
5. Event type: **On change**
5. Click **Save** and authorize

## 4. Test

In Apps Script editor:
1. Select **testWebhook** from dropdown
2. Click **Run**
3. Check your Next.js console for confirmation

## 5. Done!

Edit your Google Sheet and watch your scoreboard update automatically!

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Not Found | Verify ngrok URL is correct and Next.js server is running |
| No webhook | Check Triggers are set up in Apps Script |
| Cache not updating | Check server console logs for errors |

## Test Webhook Manually
```powershell
./test-webhook.ps1
```

## Production

1. Deploy to Vercel/Netlify
2. Add production URL to WEBHOOK_URLS array in Apps Script
3. Test with testWebhook()

---

For detailed documentation, see `WEBHOOK_SETUP.md`
