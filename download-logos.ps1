# PowerShell script to download all tech logos
# Run this from the techportfolio directory: ./download-logos.ps1

Write-Host "🎨 Downloading tech stack logos..." -ForegroundColor Cyan
Write-Host ""

# Create directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "public/ascii-art" | Out-Null

cd public/ascii-art

# Download each logo
$logos = @(
    @{name="git"; url="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png"},
    @{name="react"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png"},
    @{name="nextjs"; url="https://raw.githubusercontent.com/github/explore/28b02bbc9ad9f7a503c43775aebeb515dc2da5fc/topics/nextjs/nextjs.png"},
    @{name="solana"; url="https://cryptologos.cc/logos/solana-sol-logo.png"},
    @{name="python"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png"},
    @{name="django"; url="https://static.djangoproject.com/img/logos/django-logo-negative.png"},
    @{name="nodejs"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png"},
    @{name="postgresql"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/postgresql/postgresql.png"},
    @{name="docker"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/docker/docker.png"},
    @{name="rust"; url="https://www.rust-lang.org/logos/rust-logo-512x512.png"},
    @{name="bootstrap"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/bootstrap/bootstrap.png"},
    @{name="typescript"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png"},
    @{name="mongodb"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mongodb/mongodb.png"},
    @{name="redis"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/redis/redis.png"},
    @{name="express"; url="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/express/express.png"}
)

foreach ($logo in $logos) {
    try {
        Write-Host "⬇️  Downloading $($logo.name).png..." -NoNewline
        Invoke-WebRequest -Uri $logo.url -OutFile "$($logo.name).png" -ErrorAction Stop
        Write-Host " ✅" -ForegroundColor Green
    } catch {
        Write-Host " ❌ Failed" -ForegroundColor Red
        Write-Host "   Please download manually from: $($logo.url)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📝 Note: Some logos may need manual download:" -ForegroundColor Yellow
Write-Host "   - web3.png: https://cryptologos.cc/logos/web3-web3-logo.png"
Write-Host "   - aws.png: https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
Write-Host "   - vercel.png: https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png"
Write-Host "   - metamask.png: https://cryptologos.cc/logos/metamask-logo.png"
Write-Host "   - anchor.png: https://avatars.githubusercontent.com/u/79378589?s=280&v=4"
Write-Host ""
Write-Host "✨ Download complete! Check public/ascii-art/ folder" -ForegroundColor Green
Write-Host ""
Write-Host "Run 'npm run dev' to see your logos!" -ForegroundColor Cyan

cd ../..
