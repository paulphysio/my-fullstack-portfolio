import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import { getAllPosts, getAllCategories, formatDate } from '@/lib/blog';
import { usePageDrones, titleScene, DroneHeader } from '@/components/drones/page';

const HEADER = {
  eyebrow: '$ cat blog/*.md',
  title: 'Blog',
  sub: 'Technical insights on Web3, Solana, blockchain, and full-stack development.',
};

export default function Blog() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const meta = `${allPosts.length} posts · ${categories.length} topics`;
  usePageDrones(async (ctx) => [{ key: 'title', elements: titleScene(ctx, { ...HEADER, meta }) }], null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredPosts = selectedCategory === 'all' 
    ? allPosts 
    : allPosts.filter(post => post.category === selectedCategory);
  return (
    <Layout>
      <Head>
        <title>Blog - Paul Madu</title>
        <meta name="description" content="Technical blog by Paul Madu featuring articles on Solana development, Web3.js, blockchain technology, DeFi strategies, React Native mobile apps, and full-stack engineering with Next.js and modern frameworks." />
      </Head>

      <div className="blog-container">
        <DroneHeader {...HEADER} meta={meta} />

        {/* Category Filter */}
        <div className="blog-filters" data-reveal>
          <TerminalWindow title="filters" showControls={false}>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <span className="prompt">→</span> All Posts ({allPosts.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="prompt">→</span> {category} ({allPosts.filter(p => p.category === category).length})
                </button>
              ))}
            </div>
          </TerminalWindow>
        </div>

        <div className="blog-list">
          {filteredPosts.map((post, index) => (
            <article key={post.slug} className="blog-post-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <TerminalWindow title={`${post.slug}.md`} showControls={false}>
                <div className="blog-post-content">
                  <div className="blog-post-header">
                    <div className="blog-post-meta">
                      <time className="blog-date">{formatDate(post.date)}</time>
                      <span className="blog-separator">•</span>
                      <span className="blog-read-time">{post.readTime}</span>
                    </div>
                    {post.featured && (
                      <span className="featured-badge">
                        <span className="featured-star">★</span> Featured
                      </span>
                    )}
                  </div>

                  <h2 className="blog-post-title">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <div className="blog-category-badge">
                    <span className="category-icon">📁</span>
                    {post.category}
                  </div>

                  <p className="blog-post-excerpt">{post.excerpt}</p>

                  <div className="blog-post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blog-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="blog-read-more">
                    <span>Read full article</span>
                    <span className="arrow">→</span>
                  </Link>
                </div>
              </TerminalWindow>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="blog-empty">
            <TerminalWindow title="no-results" showControls={false}>
              <p className="empty-message">
                <span className="prompt">$</span> No posts found in this category.
              </p>
            </TerminalWindow>
          </div>
        )}

        <div className="blog-footer">
          <TerminalWindow title="stats.txt" showControls={false}>
            <div className="blog-stats">
              <div className="stat-item">
                <span className="stat-label">Total Posts:</span>
                <span className="stat-value">{allPosts.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Categories:</span>
                <span className="stat-value">{categories.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Latest:</span>
                <span className="stat-value">{formatDate(allPosts[0]?.date)}</span>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </Layout>
  );
}
