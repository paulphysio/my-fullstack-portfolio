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
    '> Specialties: Solana • Rust • React • Next.js • Python • Django',
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
                  Web3 & Full‑Stack Engineer — Solana · Rust · React · Next.js · TypeScript · Node.js · Python/Django · PostgreSQL · AWS · Docker
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
          <Link href="/projects" className="quick-link-card">
            <div className="card-icon">
              <pre>{`
  ┌───┐
  │ > │
  └───┘
              `}</pre>
            </div>
            <h3>Projects</h3>
            <p>Explore my work</p>
          </Link>

          <Link href="/about" className="quick-link-card">
            <div className="card-icon">
              <pre>{`
  ┌─┬─┐
  │ │ │
  └─┴─┘
              `}</pre>
            </div>
            <h3>About</h3>
            <p>Get to know me</p>
          </Link>

          <Link href="/blog" className="quick-link-card">
            <div className="card-icon">
              <pre>{`
  ┌───┐
  │═══│
  └───┘
              `}</pre>
            </div>
            <h3>Blog</h3>
            <p>Read my thoughts</p>
          </Link>

          <Link href="/contact" className="quick-link-card">
            <div className="card-icon">
              <pre>{`
  ┌─@─┐
  │   │
  └───┘
              `}</pre>
            </div>
            <h3>Contact</h3>
            <p>Let's connect</p>
          </Link>
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
