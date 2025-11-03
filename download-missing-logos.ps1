# PowerShell script to download missing logos
Write-Host "⬇️  Downloading missing tech logos..." -ForegroundColor Cyan
Write-Host ""

cd public/ascii-art

# Anchor
Write-Host "Downloading Anchor..." -NoNewline
try {
    Invoke-WebRequest -Uri "https://avatars.githubusercontent.com/u/79378589?s=280&v=4" -OutFile "anchor.png" -ErrorAction Stop
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "   Manually download from: https://avatars.githubusercontent.com/u/79378589?s=280&v=4" -ForegroundColor Yellow
}

# Supabase
Write-Host "Downloading Supabase..." -NoNewline
try {
    Invoke-WebRequest -Uri "https://avatars.githubusercontent.com/u/54469796?s=200&v=4" -OutFile "supabase.png" -ErrorAction Stop
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "   Manually download from: https://avatars.githubusercontent.com/u/54469796?s=200&v=4" -ForegroundColor Yellow
}

# Firebase
Write-Host "Downloading Firebase..." -NoNewline
try {
    # Try PNG source
    Invoke-WebRequest -Uri "https://www.gstatic.com/devrel-devsite/prod/vf4ca5122eb3ef021234e77b847b97b933932f4647a9f01eea6b2b2d894e5b99e/firebase/images/touchicon-180.png" -OutFile "firebase.png" -ErrorAction Stop
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "   Manually download from: https://firebase.google.com" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Download complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Run 'npm run dev' to see all your logos!" -ForegroundColor Cyan

cd ../..
