import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200';
  const locales = ['en', 'fr', 'ar'];
  
  const staticPages = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  // Generate static page URLs for all locales
  const staticUrls: MetadataRoute.Sitemap = [];
  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : page === '/blog' ? 'daily' : 'monthly',
        priority: page === '' ? 1 : page === '/blog' ? 0.9 : 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            fr: `${baseUrl}/fr${page}`,
            ar: `${baseUrl}/ar${page}`,
          },
        },
      });
    });
  });

  // Generate blog article URLs for all locales
  const blogUrls: MetadataRoute.Sitemap = [];
  locales.forEach((locale) => {
    const posts = getBlogPosts(locale);
    posts.forEach((post) => {
      blogUrls.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/blog/${post.slug}`,
            fr: `${baseUrl}/fr/blog/${post.slug}`,
            ar: `${baseUrl}/ar/blog/${post.slug}`,
          },
        },
      });
    });
  });

  return [...staticUrls, ...blogUrls];
}
