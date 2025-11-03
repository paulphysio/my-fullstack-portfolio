#!/bin/bash

# Lighthouse Audit Script
# Requires: npm install -g lighthouse
# Usage: ./scripts/lighthouse-check.sh [URL]

URL=${1:-"http://localhost:3000"}

echo "🔍 Running Lighthouse audit on: $URL"
echo "================================"

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "❌ Lighthouse is not installed. Install it with:"
    echo "   npm install -g lighthouse"
    exit 1
fi

# Run Lighthouse audit
lighthouse "$URL" \
  --output=html \
  --output=json \
  --output-path=./lighthouse-report \
  --chrome-flags="--headless" \
  --only-categories=performance,accessibility,best-practices,seo

echo ""
echo "✅ Audit complete!"
echo "📊 Reports saved to:"
echo "   - lighthouse-report.html"
echo "   - lighthouse-report.json"
echo ""
echo "Lighthouse checklist:"
echo "  [ ] Performance score > 90"
echo "  [ ] Accessibility score > 95"
echo "  [ ] Best Practices score > 90"
echo "  [ ] SEO score > 90"
echo ""
echo "⚠️  Note: This is a local audit. Production audits may vary."
