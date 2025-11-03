# How to Create ASCII Art Images

You have two options to create the ASCII art images from the text provided in `/public/ascii-art/README.md`

## Option 1: Using Figma (Recommended)

1. **Open Figma** (free at figma.com)
2. **Create new file** with artboard size: **400x200px**
3. **Set background**: Black (#000000)
4. **Add text box**:
   - Font: "Courier New" or "SF Mono"
   - Size: 10-14px
   - Color: Use the brand color for each tech (listed in README)
5. **Copy-paste** the ASCII art from the README
6. **Adjust spacing** until it looks good
7. **Export** as PNG (2x resolution for retina displays)
8. **Rename** to match tech name (e.g., `git.png`, `react.png`)
9. **Save to** `/public/ascii-art/`

### Color Reference:
- Git: #F05032
- React: #61DAFB
- Solana: #9945FF
- Python: #3776AB
- etc. (see README for full list)

---

## Option 2: Using VS Code + Screenshot

1. **Open VS Code**
2. **Install extension**: "Peacock" or use dark theme
3. **Create new file** (any name)
4. **Copy-paste** ASCII art from README
5. **Set font**:
   - Preferences → Settings → Font Family
   - Use: "Courier New", "Consolas", or "SF Mono"
6. **Zoom in** (Cmd/Ctrl + '+') to make text bigger
7. **Take screenshot** (crop to just the ASCII art)
8. **Edit screenshot**:
   - Use Preview (Mac) or Paint (Windows)
   - Change text color to brand color
   - Make background pure black
   - Crop tightly
9. **Save** as PNG to `/public/ascii-art/`

---

## Option 3: Using ASCII Art Generator Tools

### Online Tools:
1. **ASCII-Generator.net**
   - Upload a simple logo shape
   - Generate ASCII
   - Copy and style

2. **Textcraft.net**
   - Type tech name
   - Choose ASCII style
   - Export as image

3. **Patorjk.com/software/taag**
   - Type text
   - Choose font (try "ANSI Shadow" or "Big")
   - Copy ASCII output

---

## Option 4: Quick Method - Screenshot this File

1. **Open** `/public/ascii-art/README.md` in VS Code
2. **Set theme**: Dark+ (default dark)
3. **Change text color**:
   - Cmd+Shift+P → "Preferences: Open Settings (JSON)"
   - Add: `"editor.tokenColorCustomizations": { "textMateRules": [{ "scope": "text", "settings": { "foreground": "#61DAFB" }}]}`
4. **Screenshot each ASCII art block**
5. **Crop and save**

---

## File Naming Convention

Save all images with lowercase names matching the tech:

```
/public/ascii-art/
├── git.png
├── react.png
├── nextjs.png
├── solana.png
├── python.png
├── django.png
├── nodejs.png
├── postgresql.png
├── docker.png
├── rust.png
├── web3.png
├── bootstrap.png
├── typescript.png
├── aws.png
├── vercel.png
├── metamask.png
├── mongodb.png
├── redis.png
├── express.png
└── anchor.png
```

---

## Testing Your Images

After creating the images:

1. Place them in `/public/ascii-art/`
2. Run `npm run dev`
3. Visit `http://localhost:3000`
4. Check if images load correctly
5. Adjust size/color if needed

---

## Quick Cheat: Use Similar Style as Your Git Logo

Since you already have a Git logo in that style, you can:

1. **Use the same tool/method** you used for Git
2. **Apply the same style** to other tech names
3. **Keep consistency**:
   - Same font
   - Same size ratio
   - Similar character density
   - Black background
   - Colored text matching brand

---

## Recommended Image Specs

- **Format**: PNG (with transparency or black background)
- **Size**: 400x200px (or 800x400px for retina)
- **Background**: Black (#000000) or transparent
- **Text color**: Match brand color
- **Font**: Monospace (Courier New, Consolas, SF Mono)
- **File size**: Keep under 50KB each

---

## Alternative: Keep Using SVGs with ASCII Style

If creating PNG images is too tedious, I can create SVGs that render the ASCII art as actual text elements (similar to what we had, but with the ASCII designs from the README). Let me know if you want this option instead!
