# Project Screenshots

This directory contains the screenshots for all projects displayed on the portfolio website.

## Screenshot Requirements

### File Naming Convention
Each screenshot must be named **exactly** as specified below (case-sensitive):

1. **sempaihq.png** - SempaiHQ screenshot
2. **virginiacakes.png** - Virginia Cakes & Confectioneries screenshot
3. **digitec.png** - DigiTec Learning Platform screenshot
4. **web3broker.png** - Ledger Quantum Vault screenshot
5. **marvbroker.png** - Marv Broker screenshot
6. **ekenebroker.png** - Ekene Broker screenshot

### File Specifications
- **Format**: PNG, JPG, or JPEG
- **Recommended Resolution**: 1920x1080 or 1200x800 (landscape)
- **Max File Size**: 500KB recommended for optimal loading
- **Aspect Ratio**: 16:9 or 3:2 (landscape orientation)

### Image Quality Guidelines
- Use high-quality screenshots that clearly show the website interface
- Capture the homepage or key features of each project
- Ensure good lighting/contrast for visibility
- Crop out browser chrome/UI if possible (just the website content)
- Optimize images before uploading (use tools like TinyPNG, ImageOptim)

## How to Add Screenshots

1. Take screenshots of each website
2. Rename them according to the naming convention above
3. Place all 6 PNG files in this directory: `public/projects/`
4. Screenshots will automatically appear on the portfolio projects page

## Current Status

Place your screenshots here:
```
public/
  projects/
    ✓ sempaihq.png         (required)
    ✓ virginiacakes.png    (required)
    ✓ digitec.png          (required)
    ✓ web3broker.png       (required)
    ✓ marvbroker.png       (required)
    ✓ ekenebroker.png      (required)
```

## Troubleshooting

- **Image not showing**: Check the filename matches exactly (including .png extension)
- **Image looks pixelated**: Use higher resolution source image (minimum 1200px wide)
- **Slow loading**: Compress/optimize the image file size
- **Wrong aspect ratio**: Crop to 16:9 landscape format

## Alternative Formats

If you prefer JPG format, simply change the extension in both:
1. This filename (e.g., `sempaihq.jpg`)
2. Update the `image` path in `/src/lib/projects.js` to match

---
**Note**: After adding screenshots, the website will automatically detect and display them on the projects page.
