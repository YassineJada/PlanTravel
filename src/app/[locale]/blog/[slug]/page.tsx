import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPost, getBlogPosts } from '@/data/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiClock, FiTag, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  params: { locale: string; slug: string };
}

// Generate metadata for SEO (2025 best practices)
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.locale, params.slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200';
  const articleUrl = `${baseUrl}/${params.locale}/blog/${params.slug}`;

  return {
    title: `${post.title} | PlanYourNextTravel Blog`,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || 'travel, trip planning, vacation',
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'PlanYourNextTravel',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: articleUrl,
      siteName: 'PlanYourNextTravel',
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: params.locale,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      creator: '@planyournexttravel',
    },
    alternates: {
      canonical: articleUrl,
      languages: {
        'en-US': `${baseUrl}/en/blog/${params.slug}`,
        'fr-FR': `${baseUrl}/fr/blog/${params.slug}`,
        'ar-AR': `${baseUrl}/ar/blog/${params.slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  const locales = ['en', 'fr', 'ar'];
  const params: { locale: string; slug: string }[] = [];

  locales.forEach((locale) => {
    const posts = getBlogPosts(locale);
    posts.forEach((post) => {
      params.push({ locale, slug: post.slug });
    });
  });

  return params;
}

export const dynamic = "force-dynamic";

export default function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = getBlogPost(params.locale, params.slug);
  const t = useTranslations('blog');

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200';
  const articleUrl = `${baseUrl}/${params.locale}/blog/${params.slug}`;

  // JSON-LD Structured Data for SEO (Google 2025 standards)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: `${baseUrl}/${params.locale}/blog?author=${encodeURIComponent(post.author)}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PlanYourNextTravel',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    inLanguage: params.locale,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: post.readTime,
  };

  // BreadcrumbList Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/${params.locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/${params.locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 opacity-90"></div>
          <Image
            src={post.image}
            alt={post.title}
            width={1920}
            height={800}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-sm mb-6 border-2 border-white/30">
                <FiTag />
                {post.category}
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-white/90 font-medium">
                <span className="flex items-center gap-2">
                  <FiCalendar />
                  {new Date(post.date).toLocaleDateString(params.locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <FiClock />
                  {post.readTime}
                </span>
                <span>•</span>
                <span>{post.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-100">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-12 pb-8 border-b-2 border-gray-100">
              <Link
                href={`/${params.locale}/blog`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all"
              >
                <FiArrowLeft />
                Back to Blog
              </Link>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                <FiShare2 />
                Share
              </button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-5xl font-black text-gray-900 mt-8 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-4xl font-black text-purple-900 mt-8 mb-4" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                  p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed my-4" {...props} />,
                  strong: ({ node, ...props }) => <strong className="text-purple-900 font-bold" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 my-4 text-gray-700" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700" {...props} />,
                  li: ({ node, ...props }) => <li className="text-gray-700 ml-4" {...props} />,
                  a: ({ node, ...props }) => <a className="text-purple-600 font-bold hover:text-pink-600 underline" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-600 pl-4 italic text-gray-600 my-4" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900">Tags:</span>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 rounded-full font-bold text-sm">
                    {post.category}
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 rounded-full font-bold text-sm">
                    Travel
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 rounded-full font-bold text-sm">
                    Tips
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Plan Your Trip? 🌍
            </h2>
            <p className="text-xl text-white/90 mb-8 font-medium">
              Use our AI-powered trip planner to create your perfect itinerary
            </p>
            <Link
              href={`/${params.locale}#generator`}
              className="inline-block px-10 py-5 bg-white text-purple-600 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-2xl"
            >
              Start Planning Now
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
    </>
  );
}

