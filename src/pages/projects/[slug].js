import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import { getProjectBySlug } from '@/lib/projects';

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [imageLoaded, setImageLoaded] = useState(false);

  const project = typeof slug === 'string' ? getProjectBySlug(slug) : null;

  if (!project) {
    return (
      <Layout>
        <div className="project-container">
          <TerminalWindow title="404.txt" showControls={false}>
            <div className="blog-not-found">
              <h1>Project Not Found</h1>
              <p>The project you’re looking for doesn’t exist or its slug has changed.</p>
              <Link href="/projects" className="back-link">← Back to Projects</Link>
            </div>
          </TerminalWindow>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{project.title} - Projects - Paul Madu</title>
        <meta name="description" content={project.description} />
      </Head>

      <div className="project-detail-page">
        {/* Navigation */}
        <div className="project-detail-nav">
          <Link href="/projects" className="terminal-back-link">
            <span className="prompt-char">$</span>
            <span className="cmd-text">cd ../projects</span>
            <span className="back-arrow">←</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="project-hero-section">
          <TerminalWindow title={`${project.slug}/config.json`}>
            <div className="project-hero-content">
              <div className="status-bar">
                <div className="status-item">
                  <span className="status-dot status-live"></span>
                  <span className="status-text">{project.status.toUpperCase()}</span>
                </div>
                <div className="status-divider">|</div>
                <div className="status-item">
                  <span className="year-label">DEPLOYED:</span>
                  <span className="year-value">{project.year}</span>
                </div>
              </div>

              <h1 className="project-hero-title">{project.title}</h1>
              
              <p className="project-hero-desc">{project.description}</p>

              <div className="project-action-buttons">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noreferrer" className="action-btn action-btn-primary">
                    <span className="btn-icon">→</span>
                    <span>Launch Live Site</span>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" className="action-btn action-btn-secondary">
                    <span className="btn-icon">⚡</span>
                    <span>View Source</span>
                  </a>
                )}
              </div>
            </div>
          </TerminalWindow>
        </section>

        {/* Screenshot Section */}
        <section className="project-screenshot-section">
          <div className="section-header-terminal">
            <span className="prompt-char">$</span>
            <span className="cmd-text">cat ./preview.png</span>
          </div>
          
          <TerminalWindow title="website-preview" showControls={false}>
            <div className="screenshot-container">
              {project.image ? (
                <div className="screenshot-wrapper">
                  <div className={`screenshot-image-container ${imageLoaded ? 'loaded' : 'loading'}`}>
                    {!imageLoaded && (
                      <div className="loading-skeleton">
                        <div className="skeleton-pulse"></div>
                        <div className="loading-text">Loading preview...</div>
                      </div>
                    )}
                    <img 
                      src={project.image} 
                      alt={`${project.title} screenshot`} 
                      className="screenshot-image"
                      onLoad={() => setImageLoaded(true)}
                    />
                  </div>
                  <div className="screenshot-overlay">
                    <div className="overlay-grid"></div>
                  </div>
                </div>
              ) : (
                <div className="screenshot-placeholder-modern">
                  <div className="placeholder-icon-wrapper">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <p className="placeholder-text">Preview Not Available</p>
                </div>
              )}
            </div>
          </TerminalWindow>
        </section>

        {/* Tech Stack Section */}
        <section className="project-tech-section">
          <div className="section-header-terminal">
            <span className="prompt-char">$</span>
            <span className="cmd-text">cat package.json | grep dependencies</span>
          </div>
          
          <TerminalWindow title="tech-stack" showControls={false}>
            <div className="tech-stack-grid">
              {project.tech.map((tech, index) => (
                <div key={tech} className="tech-stack-card">
                  <div className="tech-card-inner">
                    <div className="tech-card-header">
                      <span className="tech-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="tech-status-dot"></span>
                    </div>
                    <div className="tech-card-name">{tech}</div>
                    <div className="tech-card-footer">
                      <span className="tech-version">latest</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TerminalWindow>
        </section>

        {/* Description Section */}
        <section className="project-description-section">
          <div className="section-header-terminal">
            <span className="prompt-char">$</span>
            <span className="cmd-text">cat README.md</span>
          </div>
          
          <TerminalWindow title="project-overview" showControls={false}>
            <div className="readme-content">
              <div className="readme-header">
                <span className="readme-marker">#</span>
                <h2 className="readme-title">Project Overview</h2>
              </div>
              
              <p className="readme-text">{project.longDescription || project.description}</p>

              {project.highlights?.length > 0 && (
                <div className="readme-section">
                  <div className="readme-header">
                    <span className="readme-marker">##</span>
                    <h3 className="readme-subtitle">Key Features</h3>
                  </div>
                  
                  <div className="features-list">
                    {project.highlights.map((highlight, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-marker">
                          <span className="feature-icon">▸</span>
                          <span className="feature-number">{String(index + 1).padStart(2, '0')}</span>
                        </div>
                        <div className="feature-text">{highlight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="readme-footer">
                <div className="footer-line">
                  <span className="footer-text">─── END OF README ───</span>
                </div>
              </div>
            </div>
          </TerminalWindow>
        </section>

        {/* Terminal Output Section */}
        <section className="project-deploy-section">
          <div className="section-header-terminal">
            <span className="prompt-char">$</span>
            <span className="cmd-text">tail -f deployment.log</span>
          </div>
          
          <TerminalWindow title="deployment-status" showControls={false}>
            <div className="deploy-log-content">
              <div className="log-entry">
                <span className="log-time">[{new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}]</span>
                <span className="log-label">INFO</span>
                <span className="log-message">Building production bundle...</span>
              </div>
              <div className="log-entry success">
                <span className="log-time">[{new Date().getHours()}:{String(new Date().getMinutes() + 1).padStart(2, '0')}]</span>
                <span className="log-label">SUCCESS</span>
                <span className="log-message">✓ Build completed successfully</span>
              </div>
              <div className="log-entry">
                <span className="log-time">[{new Date().getHours()}:{String(new Date().getMinutes() + 2).padStart(2, '0')}]</span>
                <span className="log-label">INFO</span>
                <span className="log-message">Deploying to production...</span>
              </div>
              <div className="log-entry success">
                <span className="log-time">[{new Date().getHours()}:{String(new Date().getMinutes() + 3).padStart(2, '0')}]</span>
                <span className="log-label">SUCCESS</span>
                <span className="log-message">✓ Deployment successful</span>
              </div>
              <div className="log-entry info">
                <span className="log-time">[{new Date().getHours()}:{String(new Date().getMinutes() + 3).padStart(2, '0')}]</span>
                <span className="log-label">URL</span>
                <span className="log-message">
                  <a href={project.live} target="_blank" rel="noreferrer" className="log-link">
                    {project.live}
                  </a>
                </span>
              </div>
              <div className="log-entry cursor-line">
                <span className="log-cursor">▊</span>
              </div>
            </div>
          </TerminalWindow>
        </section>
      </div>
    </Layout>
  );
}
