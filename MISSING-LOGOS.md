# Missing Logos - Download These

You need to download **3 more logos** for your stack:

---

## 1. Anchor (Solana Framework)
**Download:** https://avatars.githubusercontent.com/u/79378589?s=280&v=4
- Save as: `anchor.png`
- Location: `/public/ascii-art/anchor.png`

OR try: https://www.anchor-lang.com/favicon.ico (then resize to PNG)

---

## 2. Supabase
**Download:** https://raw.githubusercontent.com/github/explore/main/topics/supabase/supabase.png

**Alternative sources:**
- https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png
- https://avatars.githubusercontent.com/u/54469796?s=200&v=4

**Steps:**
1. Go to one of the URLs above
2. Right-click → Save Image As...
3. Save as: `supabase.png`
4. Location: `/public/ascii-art/supabase.png`

---

## 3. Firebase
**Download:** https://raw.githubusercontent.com/github/explore/main/topics/firebase/firebase.png

**Alternative sources:**
- https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg (convert to PNG)
- https://cdn.worldvectorlogo.com/logos/firebase-1.svg (convert to PNG)
- https://seeklogo.com/images/F/firebase-logo-402F407EE0-seeklogo.com.png

**Steps:**
1. Go to one of the URLs above
2. Right-click → Save Image As...
3. Save as: `firebase.png`
4. Location: `/public/ascii-art/firebase.png`

---

## Quick PowerShell Download Script

Run this in your project root:

```powershell
cd public/ascii-art

# Anchor
Invoke-WebRequest -Uri "https://avatars.githubusercontent.com/u/79378589?s=280&v=4" -OutFile "anchor.png"

# Supabase
Invoke-WebRequest -Uri "https://avatars.githubusercontent.com/u/54469796?s=200&v=4" -OutFile "supabase.png"

# Firebase
Invoke-WebRequest -Uri "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" -OutFile "firebase.svg"
# Note: Convert SVG to PNG if needed

Write-Host "✅ Logos downloaded!" -ForegroundColor Green
cd ../..
```

---

## Manual Download Alternative

If links don't work:

### Supabase:
1. Go to https://supabase.com/brand-assets
2. Download official logo
3. Save as `supabase.png`

### Firebase:
1. Go to https://firebase.google.com
2. Right-click their logo
3. Save image as `firebase.png`

### Anchor:
1. Go to https://www.anchor-lang.com/
2. Get their logo/icon
3. Save as `anchor.png`

---

## After Downloading

Once all 3 files are in `/public/ascii-art/`:

```bash
npm run dev
# Visit http://localhost:3000
```

You should see all your stacks now! 🚀

---

## Current Status

### ✅ Already Have (19 logos):
- git.png
- react.png
- nextjs.png
- solana.png
- python.png
- django.png
- nodejs.png
- postgresql.png
- docker.png
- rust.png
- web3.png
- bootstrap.png
- typescript.png
- aws.png
- vercel.png
- metamask.png
- mongodb.png
- redis.png
- express.png

### ⏳ Need to Download (3 logos):
- anchor.png
- supabase.png
- firebase.png

**Total when complete: 22 logos** 🎯
