import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';

const blogPosts = [
  {
    slug: 'building-this-portfolio',
    title: 'Building a Terminal-Themed Portfolio with Next.js',
    date: '2024-01-15',
    excerpt: 'How I built this portfolio with a hacker aesthetic using Next.js, ASCII art, and custom animations.',
    readTime: '8 min read',
    tags: ['Next.js', 'React', 'Design'],
  },
  {
    slug: 'fullstack-architecture',
    title: 'Modern Fullstack Architecture Patterns',
    date: '2024-01-10',
    excerpt: 'Exploring scalable architecture patterns using Next.js, Django, and PostgreSQL.',
    readTime: '12 min read',
    tags: ['Architecture', 'Django', 'PostgreSQL'],
  },
  {
    slug: 'typescript-tips',
    title: '10 TypeScript Tips for Better Code',
    date: '2024-01-05',
    excerpt: 'Practical TypeScript techniques to improve your development workflow and code quality.',
    readTime: '6 min read',
    tags: ['TypeScript', 'Tips', 'Best Practices'],
  },
];

export default function Blog() {
  return (
    <Layout>
      <Head>
        <title>Blog - Paul Madu</title>
        <meta name="description" content="Technical blog by Paul Madu" />
      </Head>

      <div className="blog-container">
        <header className="page-header">
          <h1 className="page-title">
            <span className="prompt">$</span> cat blog/*.md
          </h1>
          <p className="page-description">
            Thoughts on web development, architecture, and technology
          </p>
        </header>

        <div className="blog-list">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-post-card">
              <TerminalWindow title={`${post.slug}.md`} showControls={false}>
                <div className="blog-post-content">
                  <div className="blog-post-meta">
                    <time className="blog-date">{post.date}</time>
                    <span className="blog-separator">•</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>

                  <h2 className="blog-post-title">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="blog-post-excerpt">{post.excerpt}</p>

                  <div className="blog-post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blog-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="blog-read-more">
                    Read more →
                  </Link>
                </div>
              </TerminalWindow>
            </article>
          ))}
        </div>

        <div className="blog-footer">
          <TerminalWindow title="note" showControls={false}>
            <p className="blog-note">
              More posts coming soon. Subscribe to my newsletter or follow me on social media 
              to get notified about new articles.
            </p>
          </TerminalWindow>
        </div>
      </div>
    </Layout>
  );
}
