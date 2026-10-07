$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -Path $repoRoot

$cloudflaredExe = Join-Path $repoRoot 'cloudflared\cloudflared.exe'
$configPath     = Join-Path $repoRoot 'cloudflared.yml'
$serveScript    = Join-Path $repoRoot 'scripts\serve.py'
$logDir         = Join-Path $repoRoot 'logs'
$cloudflaredOut = Join-Path $logDir 'cloudflared.log'
$cloudflaredErr = Join-Path $logDir 'cloudflared.err.log'
$serveOut       = Join-Path $logDir 'serve.log'
$serveErr       = Join-Path $logDir 'serve.err.log'

$defaultCloudflaredDir = Join-Path $env:USERPROFILE '.cloudflared'
$originCertPath        = Join-Path $defaultCloudflaredDir 'cert.pem'

if (-not (Test-Path $cloudflaredExe)) { throw "cloudflared.exe not found at: $cloudflaredExe" }
if (-not (Test-Path $configPath))     { throw "cloudflared.yml not found at: $configPath" }
if (-not (Test-Path $serveScript))    { throw "serve.py not found at: $serveScript" }

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

# --- Python dev server (no-cache headers so Cloudflare never caches) ---
$serverRunning = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if (-not $serverRunning) {
    $pythonExe = 'C:/Users/micah/AppData/Local/Programs/Python/Python312/python.exe'
    Start-Process `
        -FilePath $pythonExe `
        -ArgumentList @($serveScript) `
        -WindowStyle Hidden `
        -RedirectStandardOutput $serveOut `
        -RedirectStandardError  $serveErr
}

# --- Cloudflare Tunnel ---
$existing = Get-Process cloudflared -ErrorAction SilentlyContinue
if (-not $existing) {
    $tunnelToken = $env:TUNNEL_TOKEN

    if (-not $tunnelToken) {
        # Preflight: Cloudflare auth artifacts (only required when NOT using a token)
        $configText = Get-Content -Path $configPath -Raw

        if (-not (Test-Path $originCertPath)) {
            throw "Cloudflare origin cert not found: $originCertPath`nFix: run '$cloudflaredExe tunnel login' once to generate cert.pem.`n`nAlternative: set environment variable TUNNEL_TOKEN and rerun this script."
        }

        $credMatch = [regex]::Match($configText, '(?m)^credentials-file:\s*(.+)$')
        if ($credMatch.Success) {
            $credentialsFile = $credMatch.Groups[1].Value.Trim()
            if (-not (Test-Path $credentialsFile)) {
                    Write-Host "Credentials file missing -- attempting auto-recovery via tunnel token..."
                # Extract tunnel name/id from config (the 'tunnel:' key)
                $tunnelMatch = [regex]::Match($configText, '(?m)^tunnel:\s*(.+)$')
                if (-not $tunnelMatch.Success) { throw "Could not determine tunnel name from $configPath" }
                $tunnelName = $tunnelMatch.Groups[1].Value.Trim()

                $rawToken = & $cloudflaredExe tunnel token $tunnelName 2>$null | Where-Object { $_ -match '^[A-Za-z0-9+/=]+$' } | Select-Object -First 1
                if (-not $rawToken) { throw "Failed to retrieve tunnel token for '$tunnelName'. Ensure cert.pem is valid and the tunnel exists." }

                $decoded  = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($rawToken.Trim()))
                $parsed   = $decoded | ConvertFrom-Json
                $credJson = [ordered]@{
                    AccountTag   = $parsed.a
                    TunnelSecret = $parsed.s
                    TunnelID     = $parsed.t
                } | ConvertTo-Json -Compress

                [System.IO.File]::WriteAllText($credentialsFile, $credJson, [System.Text.UTF8Encoding]::new($false))
                Write-Host "Credentials file restored: $credentialsFile"
            }
        }
    }

    $args = @('tunnel', '--config', $configPath, '--edge-ip-version', '4', 'run')
    if ($tunnelToken) {
        $args += @('--token', $tunnelToken)
    }

    Start-Process `
        -FilePath $cloudflaredExe `
        -ArgumentList $args `
        -WindowStyle Hidden `
        -RedirectStandardOutput $cloudflaredOut `
        -RedirectStandardError  $cloudflaredErr
}
