import blogPostsData from '@/data/blog-posts.json';

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts() {
  return blogPostsData.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}

/**
 * Get featured blog posts
 */
export function getFeaturedPosts() {
  return blogPostsData
    .filter(post => post.featured)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug) {
  return blogPostsData.find(post => post.slug === slug);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category) {
  return blogPostsData
    .filter(post => post.category === category)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag) {
  return blogPostsData
    .filter(post => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  const categories = blogPostsData.map(post => post.category);
  return [...new Set(categories)];
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  const tags = blogPostsData.flatMap(post => post.tags);
  return [...new Set(tags)];
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get recent posts (limit)
 */
export function getRecentPosts(limit = 3) {
  return getAllPosts().slice(0, limit);
}
