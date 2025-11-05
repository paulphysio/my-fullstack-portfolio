import Head from 'next/head';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import Typewriter from '@/components/Typewriter';

export default function About() {
  const skills = {
    'Web3 & Blockchain': ['Solana', 'Web3.js (Native)', 'Anchor Framework', 'Metaplex', 'Phantom', 'Solflare', 'SPL Tokens', 'Rust'],
    Frontend: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'React Native', 'Bootstrap'],
    Backend: ['Python', 'Django', 'Django REST Framework', 'Node.js', 'Express', 'FastAPI', 'GraphQL'],
    Database: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'SQLAlchemy'],
    DevOps: ['Docker', 'AWS (S3, Lambda, ECS)', 'Vercel', 'GitHub Actions', 'CI/CD'],
    Tools: ['Git', 'VSCode', 'NPM/Yarn', 'ESLint', 'Prettier', 'Jest', 'Vitest'],
    'Cloud & Hosting': ['AWS', 'Vercel', 'Hostinger', 'Namecheap', 'Supabase'],
  };

  const timeline = [
    {
      year: '2024 - Present',
      title: 'Web3 Developer',
      company: 'SempaiHQ',
      description: 'Leading the development of a fully decentralized anime platform on Solana blockchain. Building token-based content economy, in-app wallet systems, real-time chat, and on-chain gaming features.',
    },
    {
      year: '2022 - 2024',
      title: 'Tech Instructor & Freelance Developer',
      company: 'DigiTec Hub Institute',
      description: 'Taught comprehensive tech courses from computer basics to advanced development (frontend, backend, data analysis, forex trading). Simultaneously worked as a freelance developer building e-commerce platforms, learning management systems, and Web3 applications.',
    },
    {
      year: '2020 - 2022',
      title: 'Freelance Full-Stack Developer',
      company: 'Independent',
      description: 'Built custom web applications for various clients including e-commerce platforms, business websites, and portfolio sites. Specialized in React, Next.js, Python/Django stack.',
    },
    {
      year: '2019',
      title: 'The Beginning',
      company: 'Self-Taught Developer',
      description: 'Started my coding journey by learning HTML, CSS, and JavaScript. Quickly expanded to React, Node.js, and backend development. Passionate about building solutions that solve real-world problems.',
    },
  ];

  return (
    <Layout>
      <Head>
        <title>About - Paul Madu</title>
        <meta name="description" content="Learn about Paul Madu - Fullstack Developer" />
      </Head>

      <div className="about-container">
        <header className="page-header">
          <h1 className="page-title">
            <span className="prompt">$</span> cat about.txt
          </h1>
        </header>

        <section className="bio-section">
          <TerminalWindow title="bio.md">
            <div className="bio-content">
              <p>
                I'm Paul Madu, a self-taught Web3 developer and fullstack engineer currently leading development at 
                <strong> SempaiHQ</strong>, where we're building a fully decentralized anime platform on Solana blockchain. 
                My journey from teaching myself HTML and CSS in 2019 to architecting complex blockchain applications has been 
                driven by an insatiable curiosity and passion for creating solutions that matter.
              </p>
              <p>
                My coding journey began in 2019 when I wrote my first line of code. What started as curiosity quickly became 
                an obsession. I dove deep into JavaScript, React, and Node.js, building projects day and night. Within two years, 
                I was freelancing full-time, delivering custom web applications for clients worldwide. My stack expanded to include 
                Python, Django, PostgreSQL, and modern DevOps practices. Each project taught me not just how to code, but how to 
                solve real business problems with technology.
              </p>
              <p>
                From 2022 to 2024, I balanced two passions: teaching and building. At <strong>DigiTec Hub Institute</strong>, 
                I shared my knowledge by teaching comprehensive tech courses—from computer fundamentals to advanced web development, 
                data analysis, and forex trading. Teaching others reinforced my own understanding and kept me at the cutting edge. 
                Simultaneously, I continued freelancing, building e-commerce platforms like Virginia Cakes, learning management 
                systems, and exploring the emerging Web3 space.
              </p>
              <p>
                Today, at <strong>SempaiHQ</strong>, I'm combining everything I've learned to build the future of content creation. 
                I develop Solana programs using Anchor Framework and integrate them seamlessly with Web3.js, design token economics, 
                build React Native mobile apps, and create seamless Web3 experiences. From in-app Solana wallet creation using Web3.js 
                to on-chain gaming (Kaito Adventure), real-time chat systems, and creator monetization—I'm pushing the boundaries of 
                what's possible in decentralized applications.
              </p>
              <p>
                I believe in building with purpose, writing clean and secure code, and empowering users through decentralization. 
                Whether it's teaching the next generation of developers, building production-ready applications, or innovating in 
                the Web3 space—I'm driven by impact, not just code.
              </p>
            </div>
          </TerminalWindow>
        </section>

        <section className="skills-section">
          <h2 className="section-title">
            <span className="prompt">$</span> ls -R ./skills
          </h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="skill-category">
                <h3 className="skill-category-title">
                  <span className="folder-icon">📁</span> {category}
                </h3>
                <div className="skill-items">
                  {items.map((skill) => (
                    <div key={skill} className="skill-item">
                      <span className="skill-bullet">▸</span>
                      <span className="skill-name">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="timeline-section">
          <h2 className="section-title">
            <span className="prompt">$</span> git log --oneline --graph
          </h2>
          <div className="timeline">
            {timeline.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-year">{event.year}</span>
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-company">{event.company}</p>
                  <p className="timeline-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-cta">
          <TerminalWindow title="contact-invitation" showControls={false}>
            <Typewriter
              text={[
                'Interested in working together?',
                'Let\'s build something amazing.',
                '> Navigate to /contact or hit Ctrl+K',
              ]}
              speed={50}
              pauseAfterLine={400}
            />
          </TerminalWindow>
        </section>
      </div>
    </Layout>
  );
}
