# Google Sheets Webhook Setup Guide

This setup allows your Google Sheet to notify the Next.js server when data changes, so the server can refresh its cache immediately instead of constantly polling Google Sheets.

## Architecture

- **Client (Browser)** → Polls `/api/sheet` frequently (e.g., every 5 seconds) - this is fast because it returns cached data
- **Server** → Caches Google Sheets data in memory
- **Google Apps Script** → Calls `/api/sheet-webhook` when sheet changes
- **Webhook Handler** → Fetches fresh data from Google Sheets and updates cache

## Setup Steps

### 1. Expose Your Local Server (Development Only)

For local development, you need to expose your localhost so Google can reach it.

**Option A: Using ngrok (Recommended)**

```powershell
# Install ngrok from https://ngrok.com/ or via scoop/choco
ngrok http 3000
```

This will give you a public URL like: `https://abc123.ngrok-free.app`

**Option B: Using localtunnel**

```powershell
npm install -g localtunnel
lt --port 3000
```

**For Production:** Deploy to Vercel/Netlify/etc. and use your production URL.

### 2. Add Google Apps Script to Your Sheet

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete any existing code
4. Paste the code below
5. Update the `WEBHOOK_URLS` array with your server URLs

```javascript
// ============================================
// Google Apps Script: Sheet Change Webhook
// ============================================

// IMPORTANT: Update these URLs!
// You can add multiple URLs to notify multiple servers
const WEBHOOK_URLS = [
  'https://xkr2cvs3-3000.euw.devtunnels.ms/',
  'https://scoreboard-scoot-521863-hw2w0skl7-nikolaj-kaplans-projects.vercel.app/'
];

/**
 * Sends webhook notifications to all configured URLs
 * The webhook just notifies that something changed - the server decides what to fetch
 */
function sendWebhook(eventType, changeDetails) {
  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    changeDetails: changeDetails || {}
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  // Send to all URLs, ignore errors
  WEBHOOK_URLS.forEach(function(url) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      
      if (responseCode === 200) {
        console.log('Webhook sent successfully to:', url);
      } else {
        console.warn('Webhook failed for:', url, 'Status:', responseCode);
      }
    } catch (error) {
      // Ignore errors so other URLs still get called
      console.warn('Error sending webhook to:', url, error.toString());
    }
  });
}

/**
 * Triggered when a cell is edited
 * This is a simple trigger (no authorization dialog needed for basic edits)
 */
function onEdit(e) {
  // For simple edits, send webhook immediately
  const sheet = e.range.getSheet();
  const details = {
    sheetName: sheet.getName(),
    range: e.range.getA1Notation(),
    oldValue: e.oldValue,
    value: e.value
  };
  
  sendWebhook('edit', details);
}

/**
 * Triggered when sheet structure changes (rows/columns added, sheets renamed, etc.)
 * This requires an INSTALLABLE trigger (see setup instructions below)
 */
function onChange(e) {
  const details = {
    changeType: e.changeType,
    triggerUid: e.triggerUid
  };
  
  sendWebhook('change', details);
}

/**
 * Manual trigger function - use this to test your webhook
 */
function testWebhook() {
  sendWebhook('test', { message: 'Manual test trigger' });
  
  // Show result in Apps Script UI
  SpreadsheetApp.getUi().alert(
    'Webhook Test',
    'Test webhook sent to ' + WEBHOOK_URLS.length + ' URL(s)\n\n' +
    'Check your server console(s) for the result.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
```

### 3. Set Up Installable Triggers (Required for onChange)

The `onEdit` simple trigger works automatically, but for `onChange` you need an installable trigger:

1. In Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. Click **+ Add Trigger** (bottom right)
3. Configure:
   - Choose which function to run: **`onChange`**
   - Choose which deployment should run: **Head**
   - Select event source: **From spreadsheet**
   - Select event type: **On change**
4. Click **Save**
5. Grant permissions if prompted

**Optional:** You can also add an installable trigger for `onEdit` if you want more reliable edit notifications:
- Repeat above steps but choose function **`onEdit`** and event type **On edit**

### 4. Test the Setup

#### Test 1: Manual Webhook Test

1. In Apps Script editor, select **`testWebhook`** from the function dropdown
2. Click **Run** (play button)
3. Check your Next.js server console - you should see:
   ```
   Sheet webhook received: { event: 'test', range: 'Out1_Oversigt', ... }
   Cache refreshed: X rows fetched for range Out1_Oversigt
   ```

#### Test 2: Edit a Cell

1. Edit any cell in your Google Sheet
2. Check your server console - should see webhook notification
3. Open your scoreboard page - should see updated data immediately

#### Test 3: Verify Cache is Working

1. Open browser console on your scoreboard page
2. You should see: `sheet json: { cached: true, data: [...], timestamp: ... }`
3. Edit the sheet
4. Next poll should show `cached: false` (fresh fetch), then back to `cached: true`

### 5. Troubleshooting

**Webhook not being called:**
- Check ngrok is running and URL is correct in Apps Script
- Check Apps Script execution logs: **Project Settings** → **Executions**
- Make sure installable triggers are configured correctly

**500 Server Error:**
- Check server logs for detailed error message
- Verify Google Sheets API credentials are correct
- Ensure `SHEET_ID` or `SHEET_URL` and `GOOGLE_SERVICE_ACCOUNT` env vars are set

**Cache not updating:**
- Verify webhook endpoint is being called (check server logs)
- Check that the `range` parameter matches what your app uses
- Try manually calling `clearCache()` from server console

### 6. Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add your production URL to the `WEBHOOK_URLS` array in Apps Script
2. Redeploy your Next.js app
3. Test the webhook again using the `testWebhook()` function

### 7. Security Notes

- **Always use HTTPS** for webhook URLs (ngrok provides this automatically)
- **No authentication** - endpoint is open (fine for non-sensitive operations)
- **Consider adding authentication** if your sheet contains sensitive data
- For production with sensitive data, add IP allowlisting or implement token-based auth

### 8. Performance Benefits

With this setup:
- ✅ Clients can poll every 1-5 seconds without hitting rate limits
- ✅ Google Sheets API is only called when data actually changes
- ✅ Sub-second latency for clients (cached responses)
- ✅ No polling delay - updates appear immediately when sheet changes

### 9. Monitoring

Add logging to track webhook activity:

```javascript
// In your Apps Script
function logWebhookActivity(eventType, success) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WebhookLog');
  if (!sheet) return; // Create a sheet named 'WebhookLog' if you want logging
  
  sheet.appendRow([
    new Date(),
    eventType,
    success ? 'SUCCESS' : 'FAILED',
    WEBHOOK_URLS.join(', ')
  ]);
}
```

## Multiple URLs Feature

The webhook script supports calling multiple URLs simultaneously. This is useful for:
- **Development + Production** - Test locally while production runs
- **Multiple Environments** - Staging, QA, Production
- **Redundancy** - Multiple servers for high availability
- **Different Applications** - Multiple apps using the same sheet

**Example configuration:**
```javascript
const WEBHOOK_URLS = [
  'http://localhost:3000/api/sheet-webhook',           // Local dev
  'https://abc123.ngrok-free.app/api/sheet-webhook',   // Ngrok tunnel
  'https://myapp-staging.vercel.app/api/sheet-webhook', // Staging
  'https://myapp.vercel.app/api/sheet-webhook',         // Production
];
```

**Error handling:**
- Each URL is called independently
- Errors are logged but don't prevent other URLs from being called
- All URLs receive the webhook even if some fail

## Architecture Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │         │  Next.js     │         │   Google    │
│   Client    │         │  Server      │         │   Sheets    │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
       │  Poll /api/sheet      │                        │
       │  (every 5s)           │                        │
       ├──────────────────────>│                        │
       │                       │                        │
       │  Return cached data   │                        │
       │  (fast, in-memory)    │                        │
       │<──────────────────────┤                        │
       │                       │                        │
       │                       │                        │
       │                       │  Webhook when edited   │
       │                       │<───────────────────────┤
       │                       │  (Apps Script)         │
       │                       │                        │
       │                       │  Fetch fresh data      │
       │                       ├───────────────────────>│
       │                       │                        │
       │                       │  Return rows           │
       │                       │<───────────────────────┤
       │                       │                        │
       │                       │  Update cache          │
       │                       │  in memory             │
       │                       │                        │
       │  Next poll gets       │                        │
       │  updated data         │                        │
       ├──────────────────────>│                        │
       │<──────────────────────┤                        │
       │                       │                        │
```

## Files Created

- `lib/sheetCache.js` - Shared cache module
- `pages/api/sheet-webhook.js` - Webhook endpoint
- `pages/api/sheet.js` - Updated to use cache
- `WEBHOOK_SETUP.md` - This guide

## Next Steps

After setup is working, consider:
- Adding webhook delivery retry logic in Apps Script
- Implementing cache warming on server startup
- Adding metrics/monitoring for cache hit rates
- Supporting multiple sheet ranges with separate caches
