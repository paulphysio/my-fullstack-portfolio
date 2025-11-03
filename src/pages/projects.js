import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import { getAllProjects } from '@/lib/projects';

export default function Projects() {
  const projects = getAllProjects();
  const [hoveredProject, setHoveredProject] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (slug) => {
    setImageErrors(prev => ({ ...prev, [slug]: true }));
  };

  return (
    <Layout>
      <Head>
        <title>Projects - Paul Madu</title>
        <meta name="description" content="Explore Paul Madu's fullstack development projects" />
      </Head>

      <div className="projects-container">
        <header className="page-header">
          <h1 className="page-title">
            <span className="prompt">$</span> ls -la ./projects
          </h1>
          <p className="page-description">
            A collection of my fullstack projects showcasing modern web technologies
          </p>
        </header>

        <div className="projects-grid">
          {projects.map((project) => (
            <Link 
              key={project.slug} 
              href={`/projects/${project.slug}`}
              className="project-card"
              onMouseEnter={() => setHoveredProject(project.slug)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="project-image">
                {!imageErrors[project.slug] ? (
                  <div className="screenshot-container">
                    <img 
                      src={project.image} 
                      alt={`${project.title} screenshot`}
                      className="project-screenshot"
                      onError={() => handleImageError(project.slug)}
                    />
                  </div>
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
              </div>

              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span className="project-year">{project.year}</span>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-tech">
                  {project.tech.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="tech-tag">+{project.tech.length - 4}</span>
                  )}
                </div>

                {hoveredProject === project.slug && (
                  <div className="project-logs">
                    <TerminalWindow title={`build.log`} showControls={false}>
                      <div className="log-output">
                        <div className="log-line success">✓ Build successful</div>
                        <div className="log-line info">→ Status: {project.status}</div>
                        <div className="log-line info">→ Tech stack: {project.tech.length} technologies</div>
                        <div className="log-line success">✓ Ready to deploy</div>
                      </div>
                    </TerminalWindow>
                  </div>
                )}
              </div>

              <div className="project-footer">
                <span className="view-details">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
