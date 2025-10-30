# Google Sheets Real-Time Updates Setup Guide

This setup enables real-time updates from Google Sheets to your Next.js app using **Pusher Channels** and **Google Apps Script webhooks**.

## Architecture

- **Client (Browser)** → Fetches initial data from `/api/sheet`, then connects to Pusher for real-time updates.
- **In-Memory Cache (Server)** → Single object containing all "Out*" sheets. Served immediately on page load. Populated either by initial fetch or overwritten by webhook.
- **Google Apps Script** → Fetches all "Out*" sheets data and sends to webhook when changes occur.
- **Webhook Handler** → Receives data, updates cache, broadcasts to all connected clients via Pusher.
- **Pusher** → Delivers updates instantly to all connected browsers.

**Key Benefits:**
- ✅ No polling needed
- ✅ Single consolidated dataset (all Out* sheets together)
- ✅ Immediate page load if cache warm (no Google API call)
- ✅ Instant updates (sub-second latency)
- ✅ Works on Vercel serverless (with caveat: cache is ephemeral)
- ✅ Data included in webhook (no extra API calls for updates)

**Cache Notes:**
- The cache is a simple in-memory variable (see `lib/dataCache.js`).
- It resets whenever the serverless function instance is recycled (common on Vercel after inactivity or scaling events).
- On cold start, `/api/sheet` will fetch from Google, then populate the cache.
- On webhook arrival, cache is replaced with the new dataset (source marked as `webhook`).
- Responses from `/api/sheet` include whether they were a cache hit along with metadata.

## Setup Steps

### 1. Set Up Pusher (Required)

See `PUSHER_SETUP.md` for detailed Pusher configuration instructions.

**Quick summary:**
1. Create free account at [pusher.com](https://pusher.com)
2. Create a **Channels** app (not Beams/Push Notifications)
3. Add credentials to `.env.local`:
```bash
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=eu

NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=eu
```

### 2. Expose Your Local Server (Development Only)

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

### 3. Add Google Apps Script to Your Sheet

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete any existing code
4. Copy the code from `google-apps-script.js` in this repository
5. Update the `WEBHOOK_URLS` array with your server URL(s)
6. **Save** the script

**Important:** The script automatically:
- Fetches **ONLY sheets starting with "Out"**
- Includes ALL sheet data in the webhook payload
- Sends to all configured webhook URLs
- **Data structure is identical to `/api/sheet` response**

### 4. Set Up Installable Triggers (Required for onChange)

### 4. Set Up Installable Triggers (Required)

The `onEdit` simple trigger works automatically for basic cell edits, but for more reliable notifications and to catch structural changes, set up installable triggers:

1. In Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. Click **+ Add Trigger** (bottom right)
3. Configure for **onChange**:
   - Choose which function to run: **`onChange`**
   - Choose which deployment should run: **Head**
   - Select event source: **From spreadsheet**
   - Select event type: **On change**
4. Click **Save**
5. Grant permissions if prompted

**Recommended:** Also add an installable trigger for `onEdit` for more reliable edit notifications:
- Repeat above steps but choose function **`onEdit`** and event type **On edit**

### 5. Test the Setup

#### Test 1: Manual Webhook Test

1. In Apps Script editor, select **`testWebhook`** from the function dropdown
2. Click **Run** (play button)
3. Check your Next.js server console - you should see:
   ```
   🔔 WEBHOOK RECEIVED from Google Sheets
   Event: test
   📊 Data received from webhook:
      Sheets: Out1_Oversigt, Out2_Results, ...
      Total rows: 150
   📡 Broadcasting update to all connected clients via Pusher...
   ✅ Pusher broadcast complete
   ```
4. Check browser console - should see:
   ```
   🔔 REAL-TIME UPDATE RECEIVED FROM PUSHER
   ```

#### Test 2: Edit a Cell

1. Edit any cell in a sheet starting with "Out"
2. Check your server console - should see webhook notification with data
3. All open browser tabs should update instantly
4. Check browser console for Pusher event logs

#### Test 3: Preview Data Structure

Run the `previewData()` function in Apps Script to see:
- Which sheets will be sent (all starting with "Out")
- How many rows each sheet has
- The complete data structure

### 6. Troubleshooting

**Webhook not being called:**
- Check ngrok/tunnel is running and URL is correct in Apps Script
- Check Apps Script execution logs: **View** → **Executions**
- Make sure installable triggers are configured correctly

**No data in webhook:**
- Verify you're using the code from `google-apps-script.js`
- Run `previewData()` to see what data would be sent
- Check Apps Script logs for errors

**Pusher not broadcasting:**
- Verify Pusher credentials in `.env.local`
- Check Pusher dashboard for connection count and messages
- Ensure server is running and webhook can reach it

**Clients not receiving updates:**
- Check browser console for Pusher connection status
- Verify `NEXT_PUBLIC_PUSHER_KEY` and `NEXT_PUBLIC_PUSHER_CLUSTER` are set
- Restart dev server after adding environment variables

### 7. Production Deployment

When deploying to Vercel:

1. **Add environment variables** in Vercel project settings:
   - All Pusher variables (both server and client)
   - Google Sheets credentials
   
2. **Update Apps Script:**
   - Add your production URL to `WEBHOOK_URLS` array
   - Example: `'https://your-app.vercel.app/api/sheet-webhook'`

3. **Deploy and test:**
   - Deploy your app
   - Run `testWebhook()` from Apps Script
   - Check Vercel function logs
   - Test by editing a cell

### 8. Security Notes

- **HTTPS required** - Webhooks must use HTTPS (ngrok/Vercel provide this)
- **No authentication** - Endpoint is open by default
- **Consider authentication** for sensitive data:
  - Add secret token validation
  - Use Vercel Edge Config for allowlists
  - Implement IP filtering

### 9. Performance & Reliability

**What happens when:**

- **Page loads** → `/api/sheet` checks cache. If warm: returns immediately (cacheHit=true). If cold: fetches from Google Sheets, stores in cache, returns.
- **Sheet edited** → Webhook pushes full dataset → Server updates cache → Broadcast via Pusher → Clients update.
- **Connection drops** → Pusher auto-reconnects; manual refresh falls back to cached data (or triggers a fetch if cache cold).
- **Multiple clients** → All receive updates simultaneously via Pusher; all see identical dataset.

**Benefits of this architecture:**
- ✅ No polling overhead
- ✅ Reduced Google Sheets API usage (cache serves repeated page loads)
- ✅ Fast initial render when cache warm
- ✅ Scales with Pusher (200k messages/day free tier)
- ✅ Works on Vercel serverless (cache is opportunistic)
- ✅ Sub-second update latency

**Benefits of this architecture:**
- ✅ No polling overhead
- ✅ Minimal Google Sheets API usage (only on initial load)
- ✅ Scales infinitely with Pusher (200k messages/day free)
- ✅ Works perfectly on Vercel serverless
- ✅ Sub-second update latency

### 10. Monitoring

**Server logs** show:
- When webhook is received
- Which sheets were included
- Pusher broadcast status

**Browser console** shows:
- Pusher connection status
- When real-time updates are received
- What data was updated

**Pusher Dashboard** shows:
- Active connections
- Messages sent
- Usage statistics

### 11. Data Structure

Both `/api/sheet` (initial load) and webhook push use **identical data structure**:

```json
{
  "data": {
    "Out1_Oversigt": [
      ["Header1", "Header2", "Header3"],
      ["Row1Col1", "Row1Col2", "Row1Col3"],
      ["Row2Col1", "Row2Col2", "Row2Col3"]
    ],
    "Out2_Results": [
      ["Name", "Score", "Time"],
      ["Alice", "100", "12:34"],
      ["Bob", "95", "13:45"]
    ]
  },
  "timestamp": "2025-10-30T12:34:56.789Z"
}
```

**Key points:**
- Only sheets starting with "Out" are included
- Each sheet is an array of arrays (rows)
- First row typically contains headers
- Data structure is identical from both sources
- Client code doesn't need to know the source

## Data Flow Diagram (with Cache)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │         │  Next.js     │         │   Google    │
│   Client    │         │  Serverless  │         │   Sheets    │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
   │ 1a. Initial load      │                        │
   │ GET /api/sheet        │                        │
   ├──────────────────────>│                        │
   │                       │ Check cache            │
   │                       │  ├─ If warm: return    │
   │                       │  └─ If cold: fetch     │
   │                       ├───────────┬───────────>│
   │                       │           │ Fetch      │
   │                       │           │ Out* sheets│
   │                       │           │<───────────┤
   │                       │ Store in cache         │
   │                       │ Return data            │
   │                       │<───────────────────────┤
   │ Initial / Cached data │                        │
   │<──────────────────────┤                        │
       │                       │                        │
   │ 2. Connect Pusher     │                        │
       ├──────────────────────>│                        │
       │                       │                        │
       │                       │                        │
   │                       │ 3. Sheet edited        │
   │                       │ Apps Script webhook    │
   │                       │ (includes all Out* data)│
   │                       │<───────────────────────┤
       │                       │                        │
   │                       │ 4. Update cache        │
   │                       │ 5. Broadcast via Pusher│
   │ 6. Instant update!    │                        │
   │<══════════════════════┤<──────────────────────┐│
       │ (all clients at once) │    Pusher Channels    ││
       │                       │                        ││
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

## Files in This Project

- `google-apps-script.js` - Google Apps Script code (copy to your sheet)
- `pages/api/sheet-webhook.js` - Webhook endpoint that receives data and broadcasts via Pusher
- `pages/api/sheet.js` - Initial data fetch endpoint
- `lib/useSheetData.js` - React hook that manages Pusher connection and data
- `lib/googleSheets.js` - Google Sheets API utilities (for initial load)
- `WEBHOOK_SETUP.md` - This guide
- `PUSHER_SETUP.md` - Pusher configuration guide

## Next Steps

After setup is working:
- Monitor Pusher usage in dashboard
- Add error handling/retry logic if needed
- Consider adding authentication for production
- Set up monitoring/alerts for webhook failures
- Evaluate persistent cache (Redis, Upstash, Vercel KV, Edge Config) if cold starts are frequent or consistency critical

## Cache Implementation Details

The cache is implemented in `lib/dataCache.js` as a module-scoped variable. Because Next.js API routes on Vercel run in serverless functions, this cache:

- Is fast (memory access)
- Is isolated per function instance
- May be discarded at any time (scale down / cold start)
- Is not shared across regions

When strong consistency or cross-region replication is required, migrate to a managed store:

- Redis / Upstash (low-latency global data)
- Vercel KV / Edge Config
- PlanetScale / Neon for relational needs

### Response Metadata

`/api/sheet` adds fields:

```jsonc
{
   "cacheHit": true,          // was data served from cache?
   "cacheUpdatedAt": "2025-10-30T12:34:56.000Z",
   "cacheAgeMs": 1234,        // age of cached data
   "cacheSource": "webhook"  // 'webhook' or 'fetch'
}
```

Webhook broadcast payload includes `timeline.cacheUpdatedAt` and a `cache` object with `source` and `updatedAt`.

### Invalidation Strategy

- Full replacement on every webhook (simplest; atomic)
- Could evolve to partial diffs if payload size or frequency grows

### Edge Cases

- Cold start: cache null → first client triggers Google fetch
- Rapid edits: multiple webhook calls close together simply overwrite cache; last write wins
- Large sheet growth: consider compressing payload (gzip at client) or selective sheet updates

