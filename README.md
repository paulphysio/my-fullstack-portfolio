# Paul Madu - Terminal Portfolio

```
██████╗  █████╗ ██╗   ██╗██╗         ███╗   ███╗ █████╗ ██████╗ ██╗   ██╗
██╔══██╗██╔══██╗██║   ██║██║         ████╗ ████║██╔══██╗██╔══██╗██║   ██║
██████╔╝███████║██║   ██║██║         ██╔████╔██║███████║██║  ██║██║   ██║
██╔═══╝ ██╔══██║██║   ██║██║         ██║╚██╔╝██║██╔══██║██║  ██║██║   ██║
██║     ██║  ██║╚██████╔╝███████╗    ██║ ╚═╝ ██║██║  ██║██████╔╝╚██████╔╝
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝

FULLSTACK DEVELOPER | CLOUD ARCHITECT | PROBLEM SOLVER
```

A production-ready portfolio showcasing fullstack development skills with a **terminal/hacker aesthetic**. Built with Next.js, React, and React Native, featuring ASCII art, typewriter animations, and a command palette interface.

## 🚀 Features

- **Terminal-Themed UI**: Hacker aesthetic with neon cyan/green accents
- **ASCII Art**: All visual elements rendered as SVG-based ASCII art
- **Typewriter Effect**: Animated typing with customizable speed and human-like pauses
- **Command Palette**: Keyboard-first navigation (Ctrl+K / Cmd+K)
- **Responsive Design**: Mobile-first, works beautifully on all devices
- **Accessibility**: WCAG compliant with screen reader support
- **React Native App**: Companion mobile app with the same terminal theme
- **Static Generation**: Optimized for performance with Next.js SSG
- **DevOps Ready**: Docker, CI/CD, testing infrastructure included

## 📦 Tech Stack

### Frontend
- **Next.js 14** - React framework with Pages Router
- **React 18** - UI library
- **Bootstrap 5** - UI framework for responsive design
- **CSS3** - Custom CSS with design tokens
- **JavaScript** - Core language (no TypeScript as requested)

### Mobile
- **React Native** - Cross-platform mobile development
- **Expo** - Development and build tooling

### Backend (Ready to Integrate)
- **Next.js API Routes** - Serverless functions
- Instructions for **Django + DRF** or **Node.js + Express + Prisma**

### DevOps & Tools
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Deployment platform
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality

## 🏗️ Project Structure

```
techportfolio/
├── src/
│   ├── pages/
│   │   ├── index.jsx              # Home page
│   │   ├── projects.jsx           # Projects listing
│   │   ├── projects/[slug].jsx    # Project details
│   │   ├── about.jsx              # About page
│   │   ├── blog.jsx               # Blog listing
│   │   ├── contact.jsx            # Contact form
│   │   └── api/
│   │       └── contact.js         # Contact API endpoint
│   ├── components/
│   │   ├── Layout.jsx             # Main layout wrapper
│   │   ├── TerminalWindow.jsx     # Terminal component
│   │   ├── Typewriter.jsx         # Typing animation
│   │   ├── CommandPalette.jsx     # Keyboard command UI
│   │   └── AsciiImage.jsx         # ASCII art renderer
│   ├── styles/
│   │   ├── globals.css            # Global styles
│   │   ├── theme.css              # Design tokens
│   │   ├── components.css         # Component styles
│   │   └── pages.css              # Page-specific styles
│   ├── lib/
│   │   └── projects.js            # Project data
│   └── test/
│       ├── setup.js               # Test configuration
│       └── **/*.test.jsx          # Component tests
├── public/
│   └── ascii-assets/
│       ├── hero.svg               # Hero ASCII art
│       ├── react.svg              # Tech stack badges
│       └── ...                    # More SVG assets
├── mobile/
│   ├── App.jsx                    # React Native app
│   ├── screens/                   # Mobile screens
│   └── components/                # Mobile components
├── scripts/
│   ├── generate-ascii.js          # ASCII generator tool
│   └── lighthouse-check.sh        # Performance audit
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD pipeline
├── Dockerfile                     # Container definition
├── docker-compose.yml             # Local dev stack
├── vercel.json                    # Vercel config
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Docker** (optional, for containerized development)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/paulmadu/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

The site will auto-reload when you make changes.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run generate-ascii # Generate ASCII art
```

## 🐳 Docker Development

Run the full stack with Docker:

```bash
# Start all services (Next.js + PostgreSQL + Redis)
docker-compose up

# Or build and run in detached mode
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f web
```

Services:
- **Web App**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📱 Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## 🎨 Generating Custom ASCII Art

Use the included script to generate ASCII SVGs:

```bash
# Generate banner-style ASCII
node scripts/generate-ascii.js "YOUR TEXT" > output.svg

# Generate badge-style ASCII
node scripts/generate-ascii.js "REACT" badge "#00f0ff" "⚛️" > react-badge.svg

# Using npm script
npm run generate-ascii "FULLSTACK" > custom.svg
```

### Regenerating the Hero

```bash
# Create new hero with your name
node scripts/generate-ascii.js "YOUR NAME" banner "#00f0ff" > public/ascii-assets/hero.svg
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

Tests are written with Vitest and React Testing Library. Coverage reports are generated in the `coverage/` directory.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest deployment option for Next.js:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/paulmadu/portfolio)

#### Environment Variables (Vercel)

Add these in your Vercel dashboard:

```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Deploy to AWS

#### Option 1: AWS Amplify

```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Initialize Amplify
amplify init

# 3. Add hosting
amplify add hosting

# 4. Deploy
amplify publish
```

#### Option 2: AWS ECS (Docker)

```bash
# 1. Build Docker image
docker build -t portfolio .

# 2. Tag for ECR
docker tag portfolio:latest <your-ecr-repo>:latest

# 3. Push to ECR
docker push <your-ecr-repo>:latest

# 4. Update ECS service
aws ecs update-service --cluster <cluster> --service <service> --force-new-deployment
```

### Deploy to Hostinger

1. Build the static export:
```bash
# Add to next.config.js:
# output: 'export'

npm run build
```

2. Upload the `out/` directory to Hostinger via FTP/SFTP

3. Point your domain to the upload directory

### Custom Domain Setup (Namecheap)

1. **Purchase domain** on Namecheap
2. **Add DNS records**:
   - For Vercel:
     - Type: `A`, Name: `@`, Value: `76.76.21.21`
     - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
   - For AWS CloudFront:
     - Type: `A`, Name: `@`, Alias to CloudFront distribution
   - For Hostinger:
     - Use Hostinger nameservers or point A record to Hostinger IP

3. **Configure in platform**:
   - **Vercel**: Add domain in Project Settings → Domains
   - **AWS**: Update Route 53 or CloudFront settings
   - **Hostinger**: Add domain in hosting control panel

4. **Wait for DNS propagation** (up to 48 hours)

## 🎯 Lighthouse Performance

Run performance audits locally:

```bash
# Make script executable (Unix/Mac)
chmod +x scripts/lighthouse-check.sh

# Run audit
./scripts/lighthouse-check.sh http://localhost:3000
```

**Target Scores:**
- ✅ Performance: > 90
- ✅ Accessibility: > 95
- ✅ Best Practices: > 90
- ✅ SEO: > 90

## 🔧 Customization Guide

### Update Personal Information

1. **Name and Title**: Edit `/src/pages/index.jsx`
2. **About Section**: Edit `/src/pages/about.jsx`
3. **Projects**: Edit `/src/lib/projects.js`
4. **Contact Info**: Edit `/src/pages/contact.jsx`
5. **Social Links**: Edit `/src/components/Layout.jsx`

### Change Color Theme

Edit `/src/styles/theme.css`:

```css
:root {
  --color-accent-cyan: #00f0ff;    /* Primary accent */
  --color-accent-green: #00ff9f;   /* Secondary accent */
  --color-accent-violet: #b185ff;  /* Tertiary accent */
}
```

### Add New Tech Stacks

```bash
# Generate badge
npm run generate-ascii "DOCKER" badge "#00f0ff" "🐳" > public/ascii-assets/docker.svg

# Use in component
<AsciiImage src="/ascii-assets/docker.svg" alt="Docker" />
```

## 📧 Contact Form Integration

The contact form uses a Next.js API route (`/src/pages/api/contact.js`). To enable email sending:

### Option 1: SendGrid

```bash
npm install @sendgrid/mail
```

Add to `.env.local`:
```
SENDGRID_API_KEY=your_api_key
```

Uncomment SendGrid code in `/src/pages/api/contact.js`

### Option 2: AWS SES

```bash
npm install @aws-sdk/client-ses
```

Add AWS credentials and uncomment SES code in the API route.

## 🔐 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ Honeypot field for spam prevention
- ✅ Input validation on all forms
- ✅ CSP headers in production
- ✅ Rate limiting on API routes (recommended)

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📬 Contact

- **Email**: paul@example.com
- **GitHub**: [@paulmadu](https://github.com/paulmadu)
- **LinkedIn**: [paulmadu](https://linkedin.com/in/paulmadu)

---

## 🚀 Deployment Checklist

Use this checklist when deploying:

### Pre-Deployment
- [ ] Update personal information (name, email, social links)
- [ ] Add real projects to `/src/lib/projects.js`
- [ ] Generate custom ASCII hero
- [ ] Test all pages locally
- [ ] Run `npm run build` successfully
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run lint` - no errors
- [ ] Check accessibility with screen reader

### Vercel Deployment
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy to preview environment
- [ ] Test preview deployment
- [ ] Deploy to production
- [ ] Add custom domain

### Domain Setup (Namecheap)
- [ ] Purchase domain on Namecheap
- [ ] Add DNS A record: `@` → `76.76.21.21`
- [ ] Add DNS CNAME: `www` → `cname.vercel-dns.com`
- [ ] Add domain in Vercel dashboard
- [ ] Wait for DNS propagation
- [ ] Verify HTTPS certificate

### AWS Deployment (Optional)
- [ ] Create AWS account
- [ ] Set up S3 bucket for static assets
- [ ] Configure CloudFront distribution
- [ ] Set up Route 53 for DNS
- [ ] Deploy via Amplify or ECS
- [ ] Configure SSL certificate

### Post-Deployment
- [ ] Test all pages on production
- [ ] Verify form submissions
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit (target: 90+ all scores)
- [ ] Set up analytics (Google Analytics/Plausible)
- [ ] Submit sitemap to search engines
- [ ] Share on social media!

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [React Native Docs](https://reactnative.dev)

---

**Built with ❤️ by Paul Madu**

```
$ whoami
fullstack-developer

$ ls -la ./skills
React • Next.js • Python • Django • Node.js • PostgreSQL • AWS

$ cat motto.txt
Building elegant solutions to complex problems, one line of code at a time.
```
"# my-fullstack-portfolio" 
