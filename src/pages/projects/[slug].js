import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import { getProjectBySlug } from '@/lib/projects';

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = router.query;

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

      <div className="project-container">
        {/* Top nav */}
        <div className="blog-post-nav">
          <Link href="/projects" className="back-link">
            <span className="back-arrow">←</span> All Projects
          </Link>
        </div>

        {/* Header */}
        <header className="blog-post-header-section">
          <TerminalWindow title={`${project.slug}.json`}>
            <div className="post-header-content">
              <div className="post-meta-top">
                <div className="post-category">
                  <span className="category-icon">⚙️</span>
                  {project.status?.toUpperCase() || 'LIVE'} · {project.year}
                </div>
              </div>

              <h1 className="post-title">{project.title}</h1>

              <div className="post-meta-bottom">
                <div className="author-info">
                  <div className="author-avatar">PM</div>
                  <div className="author-details">
                    <div className="author-name">Tech Stack</div>
                    <div className="post-date-time">
                      <span>{project.tech?.join(' · ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TerminalWindow>
        </header>

        {/* Screenshot + Actions */}
        <section className="blog-post-article">
          <TerminalWindow title="preview.png" showControls={false}>
            <div className="project-preview">
              {project.image ? (
                <img src={project.image} alt={`${project.title} screenshot`} className="project-detail-screenshot" />
              ) : (
                <div className="screenshot-placeholder">
                  <div className="placeholder-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <p>{project.title}</p>
                </div>
              )}

              <div className="project-actions">
                {project.live && (
                  <a className="nav-button nav-button-primary" href={project.live} target="_blank" rel="noreferrer">
                    Visit Live ↗
                  </a>
                )}
                {project.github && (
                  <a className="nav-button" href={project.github} target="_blank" rel="noreferrer">
                    View Code ↗
                  </a>
                )}
              </div>
            </div>
          </TerminalWindow>
        </section>

        {/* Description */}
        <section className="blog-post-article">
          <TerminalWindow title="README.md" showControls={false}>
            <p className="content-paragraph">{project.longDescription || project.description}</p>

            {project.highlights?.length > 0 && (
              <div className="content-list" style={{ marginTop: '1rem' }}>
                {project.highlights.map((h) => (
                  <div className="list-item" key={h}>
                    <span className="list-marker">→</span>
                    {h}
                  </div>
                ))}
              </div>
            )}
          </TerminalWindow>
        </section>
      </div>
    </Layout>
  );
}
