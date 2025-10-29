# Test Webhook Locally

# This script simulates a webhook call from Google Apps Script
# Make sure your Next.js dev server is running on port 3000

$webhookUrl = "http://localhost:3000/api/sheet-webhook"

$body = @{
    event = "test"
    range = "Out1_Oversigt"
    timestamp = (Get-Date -Format "o")
    changeDetails = @{
        message = "Test from PowerShell"
    }
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Sending test webhook to $webhookUrl..." -ForegroundColor Cyan
Write-Host "Body: $body" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body $body -Headers $headers -UseBasicParsing
    
    Write-Host "`nSuccess! Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    
} catch {
    Write-Host "`nError! Status Code: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Gray
    }
}

Write-Host "`nCheck your Next.js server console for cache refresh logs." -ForegroundColor Yellow
