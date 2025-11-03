import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import AsciiImage from '@/components/AsciiImage';
import { getProjectBySlug, getAllProjects } from '@/lib/projects';

export default function ProjectDetail({ project }) {
  const router = useRouter();

  if (!project) {
    return (
      <Layout>
        <div className="error-container">
          <h1>Project not found</h1>
          <Link href="/projects">← Back to projects</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{project.title} - Paul Madu</title>
        <meta name="description" content={project.description} />
      </Head>

      <div className="project-detail-container">
        <Link href="/projects" className="back-link">
          ← Back to projects
        </Link>

        <header className="project-detail-header">
          <div className="project-title-section">
            <h1 className="project-detail-title">{project.title}</h1>
            <div className="project-meta">
              <span className="project-status status-{project.status}">{project.status}</span>
              <span className="project-year">{project.year}</span>
            </div>
          </div>

          <div className="project-links">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link"
              >
                <span>GitHub</span> →
              </a>
            )}
            {project.live && (
              <a 
                href={project.live} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link primary"
              >
                <span>Live Demo</span> →
              </a>
            )}
          </div>
        </header>

        <div className="project-detail-content">
          <section className="project-overview">
            <TerminalWindow title={`${project.slug}/README.md`}>
              <div className="markdown-content">
                <h2>Overview</h2>
                <p>{project.longDescription}</p>

                <h2>Key Highlights</h2>
                <ul>
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </TerminalWindow>
          </section>

          <section className="project-tech-stack">
            <h2 className="section-title">
              <span className="prompt">$</span> cat package.json
            </h2>
            <div className="tech-stack-list">
              {project.tech.map((tech) => (
                <div key={tech} className="tech-stack-item">
                  <span className="tech-bullet">▸</span>
                  <span className="tech-name">{tech}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="project-architecture">
            <h2 className="section-title">
              <span className="prompt">$</span> cat architecture.txt
            </h2>
            <TerminalWindow title="architecture-diagram" showControls={false}>
              <pre className="architecture-diagram">
{`
┌─────────────────────────────────────────────┐
│            CLIENT LAYER                     │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   Next.js    │    │  React Native│      │
│  │   Frontend   │    │   Mobile App │      │
│  └──────┬───────┘    └──────┬───────┘      │
└─────────┼────────────────────┼──────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────────────────────────────┐
│            API LAYER                        │
│  ┌──────────────┐    ┌──────────────┐      │
│  │  REST API    │    │  GraphQL     │      │
│  │  (Express/   │    │  (Optional)  │      │
│  │   Django)    │    │              │      │
│  └──────┬───────┘    └──────┬───────┘      │
└─────────┼────────────────────┼──────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────────────────────────────┐
│          DATABASE LAYER                     │
│  ┌──────────────┐    ┌──────────────┐      │
│  │  PostgreSQL  │    │    Redis     │      │
│  │   (Primary)  │    │   (Cache)    │      │
│  └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────┘
`}
              </pre>
            </TerminalWindow>
          </section>

          <section className="project-deployment">
            <h2 className="section-title">
              <span className="prompt">$</span> npm run deploy
            </h2>
            <TerminalWindow title="deployment-logs" showControls={false}>
              <div className="deploy-logs">
                <div className="log-line">→ Building production bundle...</div>
                <div className="log-line success">✓ Build completed in 45s</div>
                <div className="log-line">→ Deploying to Vercel...</div>
                <div className="log-line success">✓ Deployment successful</div>
                <div className="log-line info">→ URL: {project.live}</div>
              </div>
            </TerminalWindow>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const projects = getAllProjects();
  const paths = projects.map((project) => ({
    params: { slug: project.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug);

  return {
    props: {
      project,
    },
  };
}
