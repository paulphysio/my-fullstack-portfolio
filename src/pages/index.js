import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getStackInfo } from '@/lib/techStackData';
import { getAllProjects } from '@/lib/projects';

// The drone show is WebGL + canvas: browser only.
const DroneHome = dynamic(() => import('@/components/drones/DroneHome'), { ssr: false, loading: () => null });

const DRONE_LOGOS = ['solana', 'rust', 'react', 'nextjs', 'python', 'docker'];
const REST = ['TypeScript', 'Node.js', 'Express', 'Django', 'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase', 'Redis', 'AWS', 'Vercel', 'Git', 'Anchor', 'Web3.js', 'MetaMask', 'Bootstrap'];

export default function Home() {
  const projects = getAllProjects();
  const years = new Date().getFullYear() - 2019;
  const data = {
    years,
    projects: projects.map(({ slug, title, description, tech, live, image, year }) => ({ slug, title, description, tech, live, image, year })),
    logos: DRONE_LOGOS.map((k) => {
      const s = getStackInfo(k);
      return { key: k, name: s.name, description: s.description, uses: s.uses, image: `/ascii-art/${k}.png` };
    }),
    rest: REST,
    stats: [
      { value: `${years}+`, label: 'years writing code' },
      { value: String(projects.length), label: 'products shipped live' },
      { value: '3.74', label: 'CGPA · B.Eng, FUTO' },
      { value: String(DRONE_LOGOS.length + REST.length), label: 'tools in the stack' },
    ],
  };

  return (
    <Layout immersive>
      <Head>
        <title>Paul Madu - Fullstack Developer</title>
      </Head>

      <DroneHome data={data}>
        <article className="home-semantic">
          <header>
            <p>Available for Web3 projects</p>
            <h1>Paul Madu</h1>
            <p>Web3 &amp; Full-Stack Engineer — shipping on Solana.</p>
            <p>
              <a href="#work">See the work</a> · <a href="/cv.pdf">Download CV</a>
            </p>
          </header>

          <section>
            <h2>Whoami</h2>
            <ul>
              <li>Role: Web3 Developer · Full-Stack Engineer · Blockchain Architect</li>
              <li>Stack: Solana · Rust · Web3.js · React · Next.js · Python · Django</li>
              <li>Focus: Decentralized applications on Solana</li>
              <li>Study: B.Eng Petroleum Engineering, FUTO 2024 · 3.74 CGPA</li>
              <li>Now: Leading Web3 development at SempaiHQ</li>
            </ul>
          </section>

          <section>
            <h2>Manifesto</h2>
            <p>
              I turn ideas into decentralized products — Solana programs in Rust, wallets in the browser, and interfaces people
              actually enjoy. Petroleum engineer by degree. Software engineer by obsession.
            </p>
          </section>

          <section>
            <h2>By the numbers</h2>
            <ul>
              {data.stats.map((s) => (
                <li key={s.label}>
                  {s.value} {s.label}
                </li>
              ))}
            </ul>
          </section>

          <section id="work">
            <h2>Selected work</h2>
            {data.projects.map((p) => (
              <div key={p.slug}>
                <h3>
                  <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                </h3>
                <p>{p.description}</p>
                <p>{p.tech.join(' · ')}</p>
                {p.live && <a href={p.live}>Live site</a>}
              </div>
            ))}
          </section>

          <section>
            <h2>Stack</h2>
            {data.logos.map((l) => (
              <div key={l.key}>
                <h3>{l.name}</h3>
                <p>{l.description}</p>
              </div>
            ))}
            <p>Also: {REST.join(', ')}.</p>
          </section>

          <section>
            <h2>Explore</h2>
            <ul>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </section>

          <section>
            <h2>Let&apos;s build something legendary.</h2>
            <p>
              <Link href="/contact">Start a conversation</Link> · <a href="https://github.com/paulphysio">GitHub</a> ·{' '}
              <a href="https://www.linkedin.com/in/paul-madu-a69235222">LinkedIn</a> · <a href="https://x.com/physiodev_1">X</a>
            </p>
          </section>
        </article>
      </DroneHome>
    </Layout>
  );
}
