import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import TerminalWindow from '@/components/TerminalWindow';
import { getPostBySlug, getAllPosts, formatDate, getRecentPosts } from '@/lib/blog';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  const post = getPostBySlug(slug);
  const recentPosts = getRecentPosts(3).filter(p => p.slug !== slug);

  if (!post) {
    return (
      <Layout>
        <div className="blog-post-container">
          <TerminalWindow title="404.txt">
            <div className="blog-not-found">
              <h1>Post Not Found</h1>
              <p>The blog post you're looking for doesn't exist.</p>
              <Link href="/blog" className="back-link">
                ← Back to Blog
              </Link>
            </div>
          </TerminalWindow>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} - Paul Madu</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta name="author" content={post.author} />
        <meta name="keywords" content={post.tags.join(', ')} />
      </Head>

      <div className="blog-post-container">
        {/* Back Navigation */}
        <div className="blog-post-nav">
          <Link href="/blog" className="back-link">
            <span className="back-arrow">←</span> Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="blog-post-header-section">
          <TerminalWindow title={`${post.slug}.md`}>
            <div className="post-header-content">
              <div className="post-meta-top">
                <div className="post-category">
                  <span className="category-icon">📁</span>
                  {post.category}
                </div>
                {post.featured && (
                  <span className="featured-badge-large">
                    <span className="featured-star">★</span> Featured
                  </span>
                )}
              </div>

              <h1 className="post-title">{post.title}</h1>

              <div className="post-meta-bottom">
                <div className="author-info">
                  <div className="author-avatar">PM</div>
                  <div className="author-details">
                    <div className="author-name">{post.author}</div>
                    <div className="post-date-time">
                      <time>{formatDate(post.date)}</time>
                      <span className="separator">•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="post-tags-header">
                {post.tags.map(tag => (
                  <span key={tag} className="blog-tag-large">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </TerminalWindow>
        </header>

        {/* Post Content */}
        <article className="blog-post-article">
          <TerminalWindow title="content.md" showControls={false}>
            <div className="post-content">
              {post.content.split('\n\n').map((paragraph, index) => {
                // Check if it's a heading
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="content-heading">
                      <span className="heading-hash">##</span> {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                
                // Check if it's code block
                if (paragraph.startsWith('```')) {
                  const codeContent = paragraph.replace(/```\w*\n?/g, '');
                  return (
                    <pre key={index} className="content-code-block">
                      <code>{codeContent}</code>
                    </pre>
                  );
                }

                // Check if it's a list
                if (paragraph.match(/^\d+\./m) || paragraph.match(/^-/m)) {
                  return (
                    <div key={index} className="content-list">
                      {paragraph.split('\n').map((item, i) => (
                        <div key={i} className="list-item">
                          <span className="list-marker">→</span>
                          {item.replace(/^(\d+\.|-)\s*/, '')}
                        </div>
                      ))}
                    </div>
                  );
                }

                // Regular paragraph
                if (paragraph.trim()) {
                  return (
                    <p key={index} className="content-paragraph">
                      {paragraph}
                    </p>
                  );
                }

                return null;
              })}
            </div>
          </TerminalWindow>
        </article>

        {/* Related Posts */}
        {recentPosts.length > 0 && (
          <section className="related-posts-section">
            <h2 className="section-title">
              <span className="prompt">$</span> ls ./related-posts
            </h2>
            <div className="related-posts-grid">
              {recentPosts.map(relatedPost => (
                <Link 
                  key={relatedPost.slug} 
                  href={`/blog/${relatedPost.slug}`}
                  className="related-post-card"
                >
                  <div className="related-post-content">
                    <div className="related-post-category">
                      {relatedPost.category}
                    </div>
                    <h3 className="related-post-title">
                      {relatedPost.title}
                    </h3>
                    <div className="related-post-meta">
                      <time>{formatDate(relatedPost.date)}</time>
                      <span>•</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                  <div className="related-post-arrow">→</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Navigation */}
        <div className="blog-post-bottom-nav">
          <TerminalWindow title="navigation" showControls={false}>
            <div className="bottom-nav-content">
              <Link href="/blog" className="nav-button">
                <span className="nav-arrow">←</span>
                <span>All Posts</span>
              </Link>
              <Link href="/contact" className="nav-button nav-button-primary">
                <span>Get in Touch</span>
                <span className="nav-arrow">→</span>
              </Link>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </Layout>
  );
}
