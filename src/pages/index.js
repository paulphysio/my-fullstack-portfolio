import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import Typewriter from '@/components/Typewriter';
import AsciiImage from '@/components/AsciiImage';
import StackModal from '@/components/StackModal';
import { getStackInfo } from '@/lib/techStackData';

export default function Home() {
  const [selectedStack, setSelectedStack] = useState(null);

  const handleStackClick = (stackKey) => {
    const stackInfo = getStackInfo(stackKey);
    if (stackInfo) {
      setSelectedStack(stackInfo);
    }
  };

  const introLines = [
    '> Initializing portfolio...',
    '> Loading fullstack developer profile...',
    '> Name: Paul Madu',
    '> Role: Web3 Developer | Fullstack Engineer | Blockchain Architect',
    '> Specialties: Solana • Web3.js • React • Next.js • Python • Django',
    '> Focus: Building decentralized applications on Solana blockchain',
    '> Status: Available for Web3 projects',
    '> Type "help" or explore below ↓',
  ];

  return (
    <Layout>
      <Head>
        <title>Paul Madu - Fullstack Developer</title>
      </Head>

      <div className="home-container">
        <section className="hero-section">
          <TerminalWindow title="paulmadu@portfolio:~$" bootSequence={false}>
            <div className="hero-content">
              <div className="ascii-hero">
                <AsciiImage 
                  src="/ascii-assets/hero.svg" 
                  alt="Paul Madu ASCII Logo"
                />
              </div>
              <div className="hero-subtitle">
                <p>
                  Web3 & Full‑Stack Engineer — Solana · Web3.js · React · Next.js · TypeScript · Node.js · Python/Django · PostgreSQL · AWS · Rust · Docker
                </p>
              </div>
              
              <div className="intro-text">
                <Typewriter
                  text={introLines}
                  speed={40}
                  pauseAfterLine={300}
                  humanize={true}
                />
              </div>
              
              <div className="web3-badge">
                <div className="badge-container">
                  <AsciiImage src="/ascii-art/solana.png" alt="Solana" />
                </div>
                <div className="badge-container">
                  <AsciiImage src="/ascii-art/web3.png" alt="Web3" />
                </div>
              </div>
            </div>
          </TerminalWindow>
        </section>

        <section className="quick-links">
          <h2 className="section-title quick-links-title">
            <span className="prompt">$</span> ls -la ./navigation
          </h2>
          <div className="quick-links-grid">
            <Link href="/projects" className="quick-link-card">
              <div className="card-border-glow"></div>
              <div className="card-content-wrapper">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>
                  <div className="card-status">
                    <span className="status-dot"></span>
                    <span className="status-text">ACTIVE</span>
                  </div>
                </div>
                <h3 className="card-title">
                  <span className="title-bracket">[</span>
                  <span className="title-text">Projects</span>
                  <span className="title-bracket">]</span>
                </h3>
                <p className="card-description">
                  <span className="prompt-small">→</span> Explore decentralized applications, Web3 platforms, and full-stack solutions
                </p>
                <div className="card-footer">
                  <span className="card-command">cd ./projects</span>
                  <span className="card-arrow">→</span>
                </div>
              </div>
              <div className="card-scanline"></div>
            </Link>

            <Link href="/about" className="quick-link-card">
              <div className="card-border-glow"></div>
              <div className="card-content-wrapper">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="card-status">
                    <span className="status-dot"></span>
                    <span className="status-text">ONLINE</span>
                  </div>
                </div>
                <h3 className="card-title">
                  <span className="title-bracket">[</span>
                  <span className="title-text">About</span>
                  <span className="title-bracket">]</span>
                </h3>
                <p className="card-description">
                  <span className="prompt-small">→</span> Self-taught developer journey from 2019 to leading Web3 development at SempaiHQ
                </p>
                <div className="card-footer">
                  <span className="card-command">cat ./about.md</span>
                  <span className="card-arrow">→</span>
                </div>
              </div>
              <div className="card-scanline"></div>
            </Link>

            <Link href="/blog" className="quick-link-card">
              <div className="card-border-glow"></div>
              <div className="card-content-wrapper">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="card-status">
                    <span className="status-dot status-pulse"></span>
                    <span className="status-text">UPDATED</span>
                  </div>
                </div>
                <h3 className="card-title">
                  <span className="title-bracket">[</span>
                  <span className="title-text">Blog</span>
                  <span className="title-bracket">]</span>
                </h3>
                <p className="card-description">
                  <span className="prompt-small">→</span> Technical insights on Solana, Web3, blockchain development, and fullstack engineering
                </p>
                <div className="card-footer">
                  <span className="card-command">ls ./blog/*.md</span>
                  <span className="card-arrow">→</span>
                </div>
              </div>
              <div className="card-scanline"></div>
            </Link>

            <Link href="/contact" className="quick-link-card">
              <div className="card-border-glow"></div>
              <div className="card-content-wrapper">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="card-status">
                    <span className="status-dot"></span>
                    <span className="status-text">READY</span>
                  </div>
                </div>
                <h3 className="card-title">
                  <span className="title-bracket">[</span>
                  <span className="title-text">Contact</span>
                  <span className="title-bracket">]</span>
                </h3>
                <p className="card-description">
                  <span className="prompt-small">→</span> Let's collaborate on innovative Web3 projects and decentralized solutions
                </p>
                <div className="card-footer">
                  <span className="card-command">./contact.sh</span>
                  <span className="card-arrow">→</span>
                </div>
              </div>
              <div className="card-scanline"></div>
            </Link>
          </div>
        </section>

        <section className="tech-stack-preview">
          <h2 className="section-title">
            <span className="prompt">$</span> cat tech-stack.txt
          </h2>
          <div className="stack-grid">
            <div className="stack-category">
              <h3>⚡ Web3 & Blockchain</h3>
              <div className="stack-badges">
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('solana')}>
                  <AsciiImage src="/ascii-art/solana.png" alt="Solana" />
                  <span className="stack-badge-label">Solana</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('rust')}>
                  <AsciiImage src="/ascii-art/rust.png" alt="Rust" />
                  <span className="stack-badge-label">Rust</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('web3')}>
                  <AsciiImage src="/ascii-art/web3.png" alt="Web3" />
                  <span className="stack-badge-label">Web3</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('anchor')}>
                  <AsciiImage src="/ascii-art/anchor.png" alt="Anchor" />
                  <span className="stack-badge-label">Anchor</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('metamask')}>
                  <AsciiImage src="/ascii-art/metamask.png" alt="MetaMask" />
                  <span className="stack-badge-label">MetaMask</span>
                </div>
              </div>
            </div>
            <div className="stack-category">
              <h3>💻 Frontend</h3>
              <div className="stack-badges">
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('react')}>
                  <AsciiImage src="/ascii-art/react.png" alt="React" />
                  <span className="stack-badge-label">React</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('nextjs')}>
                  <AsciiImage src="/ascii-art/nextjs.png" alt="Next.js" />
                  <span className="stack-badge-label">Next.js</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('typescript')}>
                  <AsciiImage src="/ascii-art/typescript.png" alt="TypeScript" />
                  <span className="stack-badge-label">TypeScript</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('bootstrap')}>
                  <AsciiImage src="/ascii-art/bootstrap.png" alt="Bootstrap" />
                  <span className="stack-badge-label">Bootstrap</span>
                </div>
              </div>
            </div>
            <div className="stack-category">
              <h3>🔧 Backend</h3>
              <div className="stack-badges">
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('nextjs')}>
                  <AsciiImage src="/ascii-art/nextjs.png" alt="Next.js" />
                  <span className="stack-badge-label">Next.js</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('nodejs')}>
                  <AsciiImage src="/ascii-art/nodejs.png" alt="Node.js" />
                  <span className="stack-badge-label">Node.js</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('express')}>
                  <AsciiImage src="/ascii-art/express.png" alt="Express" />
                  <span className="stack-badge-label">Express</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('postgresql')}>
                  <AsciiImage src="/ascii-art/postgresql.png" alt="PostgreSQL" />
                  <span className="stack-badge-label">PostgreSQL</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('mongodb')}>
                  <AsciiImage src="/ascii-art/mongodb.png" alt="MongoDB" />
                  <span className="stack-badge-label">MongoDB</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('python')}>
                  <AsciiImage src="/ascii-art/python.png" alt="Python" />
                  <span className="stack-badge-label">Python</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('django')}>
                  <AsciiImage src="/ascii-art/django.png" alt="Django" />
                  <span className="stack-badge-label">Django</span>
                </div>
              </div>
            </div>
            <div className="stack-category">
              <h3>🗄️ Database & Cloud</h3>
              <div className="stack-badges">
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('supabase')}>
                  <AsciiImage src="/ascii-art/supabase.png" alt="Supabase" />
                  <span className="stack-badge-label">Supabase</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('firebase')}>
                  <AsciiImage src="/ascii-art/firebase.png" alt="Firebase" />
                  <span className="stack-badge-label">Firebase</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('redis')}>
                  <AsciiImage src="/ascii-art/redis.png" alt="Redis" />
                  <span className="stack-badge-label">Redis</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('aws')}>
                  <AsciiImage src="/ascii-art/aws.png" alt="AWS" />
                  <span className="stack-badge-label">AWS</span>
                </div>
              </div>
            </div>
            <div className="stack-category">
              <h3>🚀 DevOps</h3>
              <div className="stack-badges">
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('docker')}>
                  <AsciiImage src="/ascii-art/docker.png" alt="Docker" />
                  <span className="stack-badge-label">Docker</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('aws')}>
                  <AsciiImage src="/ascii-art/aws.png" alt="AWS" />
                  <span className="stack-badge-label">AWS</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('vercel')}>
                  <AsciiImage src="/ascii-art/vercel.png" alt="Vercel" />
                  <span className="stack-badge-label">Vercel</span>
                </div>
                <div className="stack-badge-wrapper" onClick={() => handleStackClick('git')}>
                  <AsciiImage src="/ascii-art/git.png" alt="Git" />
                  <span className="stack-badge-label">Git</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {selectedStack && (
        <StackModal 
          stack={selectedStack} 
          onClose={() => setSelectedStack(null)} 
        />
      )}
    </Layout>
  );
}
