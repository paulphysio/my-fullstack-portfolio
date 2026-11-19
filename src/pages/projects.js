import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import { getAllProjects } from '@/lib/projects';
import { usePageDrones, titleScene, DroneHeader, loadImage } from '@/components/drones/page';
import { picture } from '@/components/drones/compose';

const HEADER = {
  eyebrow: '$ ls -la ./projects',
  title: 'Projects',
  sub: 'Decentralized apps, Web3 platforms and full-stack products — designed, built and shipped.',
};

export default function Projects() {
  const projects = getAllProjects();
  const [hoveredProject, setHoveredProject] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const years = projects.map((p) => p.year);
  const meta = `${projects.length} projects · ${Math.min(...years)} — ${Math.max(...years)}`;

  // Drones write the title; hovering a card paints that project's site
  // across the night sky behind the grid.
  const drones = usePageDrones(
    async (ctx) => [{ key: 'title', elements: titleScene(ctx, { ...HEADER, meta }) }],
    async (ctx) => {
      const imgs = await Promise.all(projects.map((p) => loadImage(p.image)));
      const budget = ctx.mobile ? 16000 : 52000;
      const spacing = Math.max(2.4, Math.sqrt((ctx.W * ctx.H) / budget));
      return projects.map((p, i) => ({
        key: `shot:${p.slug}`,
        elements: imgs[i]
          ? [picture({ id: 'shot', slot: 'shot', img: imgs[i], x: 0, y: 0, w: ctx.W, h: ctx.H, fit: 'cover', alignTop: true, spacing, brightness: 0.2, order: 0.3 })]
          : [],
      }));
    }
  );

  const handleImageError = (slug) => {
    setImageErrors(prev => ({ ...prev, [slug]: true }));
  };

  return (
    <Layout>
      <Head>
        <title>Projects - Paul Madu</title>
        <meta name="description" content="Explore Paul Madu's fullstack development projects including VERTIKAL originals streetwear store, SempaiHQ (Web3 platform), ChatsUp live chat for websites, Yuvlex academic records delivery, Virginia Cakes e-commerce, and Jeshfield Global corporate website." />
      </Head>

      <div className="projects-container">
        <DroneHeader {...HEADER} meta={meta} />

        <div className="projects-grid" data-stagger>
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="project-card"
              data-tilt
              data-cursor="View"
              onMouseEnter={() => {
                setHoveredProject(project.slug);
                drones.current.show(`shot:${project.slug}`);
              }}
              onMouseLeave={() => {
                setHoveredProject(null);
                drones.current.clear();
              }}
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
