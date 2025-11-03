# 🚀 Deployment Guide

Complete step-by-step guide to deploy your terminal portfolio to production.

## Quick Deploy Commands

```bash
# Install dependencies and build
npm install
npm run build

# Deploy to Vercel (recommended)
npm install -g vercel
vercel --prod

# Or deploy to AWS Amplify
npm install -g @aws-amplify/cli
amplify publish
```

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- **Free tier** with generous limits
- **Automatic deployments** from GitHub
- **Built-in CI/CD** 
- **Global CDN** for fast loading
- **Zero config** for Next.js

### Steps

#### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

#### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import your repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Click **Deploy**

#### 3. Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 4. Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

#### 5. Custom Domain

1. Go to **Project Settings** → **Domains**
2. Add your domain (e.g., `paulmadu.com`)
3. Configure DNS (see Namecheap section below)
4. Wait for SSL certificate (automatic)

---

## Option 2: AWS Deployment

### AWS Amplify (Easiest)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### AWS S3 + CloudFront (Static)

```bash
# Build static export
# First, update next.config.js:
# module.exports = { output: 'export' }

npm run build

# Upload to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### AWS ECS (Docker)

```bash
# Build Docker image
docker build -t portfolio:latest .

# Tag for ECR
docker tag portfolio:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/portfolio:latest

# Push to ECR
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/portfolio:latest

# Update ECS service
aws ecs update-service \
  --cluster your-cluster \
  --service portfolio-service \
  --force-new-deployment
```

---

## Option 3: Hostinger (Shared Hosting)

### Build Static Export

1. Update `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

2. Build:

```bash
npm run build
```

3. Upload `out/` folder via:
   - **FTP/SFTP** using FileZilla
   - **Hostinger File Manager**
   - **cPanel File Manager**

4. Point domain to the upload directory

---

## DNS Configuration (Namecheap)

### For Vercel

1. Login to Namecheap
2. Go to **Domain List** → **Manage**
3. **Advanced DNS** tab
4. Add/Update records:

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

5. In Vercel dashboard, add domain and verify

### For AWS CloudFront

```
Type: A Record (Alias)
Host: @
Value: Your CloudFront distribution domain

Type: CNAME
Host: www
Value: Your CloudFront distribution domain
```

### For Hostinger

1. Use **Hostinger nameservers**, OR
2. Point A record to Hostinger server IP (provided by Hostinger)

---

## GitHub Actions CI/CD Setup

Your `.github/workflows/ci.yml` is already configured. To enable:

### 1. Add GitHub Secrets

Go to Repository → Settings → Secrets → Actions:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

Get these from:
- **Vercel Token**: vercel.com/account/tokens
- **Org ID & Project ID**: Run `vercel link` locally

### 2. Customize Workflow

Edit `.github/workflows/ci.yml` to match your needs.

### 3. Push to Trigger

```bash
git push origin main
```

CI will automatically:
- ✅ Lint code
- ✅ Run tests
- ✅ Build app
- ✅ Deploy to Vercel
- ✅ Run Lighthouse audit

---

## Mobile App Deployment

### Expo Build

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Post-Deployment Checklist

### Essential

- [ ] Test all pages on production URL
- [ ] Verify contact form works
- [ ] Check mobile responsiveness
- [ ] Test command palette (Ctrl+K)
- [ ] Verify all ASCII assets load
- [ ] Check console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

### SEO & Analytics

- [ ] Add Google Analytics / Plausible
- [ ] Submit sitemap to Google Search Console
- [ ] Add meta tags and Open Graph images
- [ ] Set up Google Search Console
- [ ] Create `sitemap.xml`
- [ ] Create `robots.txt`

### Performance

- [ ] Run Lighthouse audit (target: 90+ all scores)
- [ ] Check Core Web Vitals
- [ ] Optimize images (already using SVG)
- [ ] Enable compression (automatic on Vercel)
- [ ] Test loading speed on slow 3G

### Security

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers configured
- [ ] Contact form honeypot working
- [ ] No sensitive data exposed
- [ ] Environment variables secure

---

## Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel Dashboard → Analytics

### Error Tracking

Install Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Uptime Monitoring

Use:
- [UptimeRobot](https://uptimerobot.com) (Free)
- [Pingdom](https://pingdom.com)
- [Better Uptime](https://betteruptime.com)

---

## Rollback Procedures

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### AWS Amplify

```bash
amplify publish --restore
```

### Manual Rollback

```bash
# Checkout previous commit
git checkout [commit-hash]

# Force deploy
vercel --prod --force
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Domain Not Working

1. Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
2. Wait 24-48 hours for full propagation
3. Clear browser cache
4. Try incognito mode

### Assets Not Loading

1. Check public folder structure
2. Verify paths are absolute (`/ascii-assets/...`)
3. Check console for 404 errors
4. Redeploy if needed

### Contact Form Not Working

1. Check API route is deployed
2. Verify environment variables
3. Check browser console for errors
4. Test API endpoint directly: `/api/contact`

---

## Performance Optimization Tips

### 1. Enable Caching

Vercel handles this automatically. For others:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/ascii-assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 2. Optimize Assets

Already optimized (using SVG), but for future:

```bash
# Install image optimizer
npm install next-optimized-images

# Compress SVGs
npm install svgo -g
svgo public/ascii-assets/*.svg
```

### 3. Monitor Performance

```bash
# Run Lighthouse
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

---

## Cost Estimates

### Free Tier Options

- **Vercel**: Free for personal projects (Hobby plan)
- **AWS Amplify**: Free tier (12 months)
- **GitHub Pages**: Free (static only)
- **Netlify**: Free tier available

### Paid Options

- **Vercel Pro**: $20/month (team features)
- **AWS**: ~$5-20/month (depends on traffic)
- **Hostinger**: $2-10/month (shared hosting)
- **Domain (Namecheap)**: $10-15/year

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **AWS Amplify**: https://docs.amplify.aws
- **Expo Docs**: https://docs.expo.dev

---

**Need help?** Create an issue or contact paul@example.com

---

Last Updated: 2024
