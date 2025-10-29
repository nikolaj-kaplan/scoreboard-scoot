# Cache-Based Polling Solution - Summary

## What Was Implemented

A server-side caching solution that eliminates constant Google Sheets API calls while maintaining fast client-side polling.

## How It Works

1. **Client polls frequently** (every 5 seconds) → `/api/sheet`
2. **Server returns cached data** (instant response, no Google API call)
3. **Google Sheet triggers webhook** when data changes → `/api/sheet-webhook`
4. **Server refreshes cache** by fetching fresh data from Google Sheets
5. **Next client poll gets updated data** from the refreshed cache

## Files Created/Modified

### New Files
- `lib/sheetCache.js` - Shared in-memory cache module
- `pages/api/sheet-webhook.js` - Webhook endpoint for Google Apps Script
- `WEBHOOK_SETUP.md` - Complete setup guide with Apps Script code
- `test-webhook.ps1` - PowerShell script to test webhook locally

### Modified Files
- `pages/api/sheet.js` - Updated to use shared cache instead of time-based expiry

## Benefits

✅ **Fast client responses** - Cached data returns instantly
✅ **Efficient Google API usage** - Only called when sheet actually changes
✅ **No polling delays** - Updates appear on next poll after sheet edit (5s max)
✅ **No rate limits** - Clients can poll as often as needed
✅ **Simple client code** - No changes needed to existing polling logic

## Setup Required

1. **Expose local server** (development):
   ```powershell
   ngrok http 3000
   ```

2. **Add Apps Script to Google Sheet:**
   - Copy code from `WEBHOOK_SETUP.md`
   - Update `WEBHOOK_URLS` array with your server URL(s)
   - Set up installable trigger for `onChange`
   ```powershell
   ./test-webhook.ps1
   ```

## Architecture

```
Browser (polls every 5s)
    ↓
Next.js Server (returns cached data, fast!)
    ↓
In-Memory Cache
    ↑
Webhook Handler (refreshes cache)
    ↑
Google Apps Script (onEdit/onChange)
    ↑
Google Sheets (when user edits)
```

## Cache Behavior

- **Initial load**: No cache → fetches from Google Sheets → stores in cache
- **Subsequent polls**: Returns cached data instantly
- **Sheet edited**: Webhook clears cache → fetches fresh data → updates cache
- **Next poll**: Gets updated data from cache

## Testing

1. Start your Next.js dev server
2. Run `./test-webhook.ps1` to test webhook
3. Check server console for:
   ```
   Sheet webhook received: { event: 'test', ... }
   Cache cleared
   Cache updated for range Out1_Oversigt at 2025-10-29T...
   Cache refreshed: X rows fetched
   ```
4. Open scoreboard page in browser
5. Check browser console for:
   ```
   sheet json: { cached: true, data: [...] }
   ```
6. Edit Google Sheet
7. Within 5 seconds, browser should show updated data

## Production Deployment

1. Deploy to Vercel/Netlify
2. Set `SHEET_WEBHOOK_SECRET` environment variable
3. Update Apps Script `WEBHOOK_URL` to production URL
4. Test with `testWebhook()` function in Apps Script

## Monitoring

Server logs will show:
- Webhook receipts
- Cache clears/updates
- Fetch operations
- Error conditions

Client console will show:
- Whether data came from cache
- Timestamp of last cache update
- Sheet data array

## Future Enhancements

- Add webhook delivery retry in Apps Script
- Implement cache warming on server startup
- Add metrics for cache hit rates
- Support multiple sheet ranges with separate caches
- Add Redis/Memcached for multi-instance deployments
- Implement webhook signature verification (HMAC)
- Add rate limiting on webhook endpoint

## Security

- Webhook endpoint is open (no authentication)
- Fine for non-sensitive operations
- Consider adding authentication for sensitive data
- HTTPS required for webhook URL
- No sensitive data in webhook payload

## Performance

Before (with 5s TTL):
- Google Sheets API called every 5 seconds per client
- Rate limits possible with multiple clients
- 5 second delay before updates appear

After (with webhook):
- Google Sheets API called only when sheet changes
- No rate limit concerns
- Updates appear within client poll interval (1-5s)
- Sub-millisecond cache responses

## Notes

- Cache is in-memory (lost on server restart, will refetch)
- Single server instance only (use Redis for multi-instance)
- Requires Google Sheet webhook setup (one-time)
- Works with existing client polling code
