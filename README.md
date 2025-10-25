# Scoreboard (Next.js)

This small Next.js app exposes an API route `/api/sheet` that securely reads a Google Sheet using a Google service account and returns JSON. Frontend pages call that API and update automatically.

Environment variables (set on Vercel or locally in `.env.local`):

- `SHEET_ID` - (optional, legacy) the Google Sheet ID (the long id in the sheet URL)
- `SHEET_URL` - preferred: the full Google Sheet URL (the app will extract the ID)
- `GOOGLE_SERVICE_ACCOUNT` - Base64-encoded service account JSON

How to run locally:

1. Create `.env.local` with the two variables. Example (PowerShell):

```powershell
$sa = Get-Content .\service-account.json -Raw
# then add SHEET_URL (or SHEET_ID) and GOOGLE_SERVICE_ACCOUNT to .env.local
```

2. Install dependencies and run:

```bash
npm install
npm run dev
```

Deployment:
- Push to GitHub and import the repo into Vercel. Set the environment variables in the Vercel project settings as above.
- Vercel will build and publish the app and the API route will be available as serverless function.

Notes:
- The API has a short in-memory cache (5s) to reduce API calls and reduce user-facing latency.
- Keep the service account JSON secret; never send it to clients.
