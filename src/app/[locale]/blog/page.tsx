import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/data/blog';
import { FiCalendar, FiClock, FiTag, FiArrowRight } from 'react-icons/fi';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200';
  const pageUrl = `${baseUrl}/${params.locale}/blog`;

  const titles: Record<string, string> = {
    en: 'Travel Blog - Expert Guides, Tips & Inspiration | PlanYourNextTravel',
    fr: 'Blog Voyage - Guides d\'Expert, Conseils & Inspiration | PlanYourNextTravel',
    ar: 'مدونة السفر - أدلة الخبراء والنصائح والإلهام | PlanYourNextTravel',
  };

  const descriptions: Record<string, string> = {
    en: 'Discover expert travel guides, budget tips, destination recommendations, and travel inspiration. Learn from experienced travelers and plan your next adventure with confidence.',
    fr: 'Découvrez des guides de voyage d\'experts, des conseils budgétaires, des recommandations de destinations et de l\'inspiration voyage. Apprenez de voyageurs expérimentés et planifiez votre prochaine aventure en toute confiance.',
    ar: 'اكتشف أدلة السفر من الخبراء ونصائح الميزانية وتوصيات الوجهات والإلهام للسفر. تعلم من المسافرين ذوي الخبرة وخطط لمغامرتك القادمة بثقة.',
  };

  return {
    title: titles[params.locale] || titles.en,
    description: descriptions[params.locale] || descriptions.en,
    keywords: 'travel blog, travel guides, travel tips, destination guides, budget travel, travel inspiration, travel advice, vacation planning, travel stories',
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
      title: titles[params.locale] || titles.en,
      description: descriptions[params.locale] || descriptions.en,
      url: pageUrl,
      siteName: 'PlanYourNextTravel',
      type: 'website',
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[params.locale] || titles.en,
      description: descriptions[params.locale] || descriptions.en,
      creator: '@planyournexttravel',
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'en-US': `${baseUrl}/en/blog`,
        'fr-FR': `${baseUrl}/fr/blog`,
        'ar-AR': `${baseUrl}/ar/blog`,
      },
    },
  };
}

export default function BlogPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('blog');
  const blogPosts = getBlogPosts(params.locale);

  const gradients = [
    'from-purple-500 via-pink-500 to-red-500',
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-orange-500 via-yellow-500 to-green-500',
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-green-500 via-emerald-500 to-cyan-500',
    'from-red-500 via-rose-500 to-pink-500',
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200';

  // JSON-LD Structured Data for Blog
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PlanYourNextTravel Blog',
    description: 'Expert travel guides, tips, and inspiration for your next adventure',
    url: `${baseUrl}/${params.locale}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'PlanYourNextTravel',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    blogPost: blogPosts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      url: `${baseUrl}/${params.locale}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="flex-1 py-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center">
            <div className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-sm shadow-lg">
              📚 TRAVEL INSIGHTS
            </div>
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
              {t('title')}
            </h1>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Expert guides, tips, and inspiration for your next adventure
            </p>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105 border-2 border-transparent hover:border-purple-300"
              >
                {/* Image with Gradient Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={index < 6}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-20`}></div>
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-gray-900 shadow-lg">
                    <FiTag className="inline mr-1" />
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1 font-medium">
                      <FiCalendar className="text-purple-600" />
                      {new Date(post.date).toLocaleDateString(params.locale, { 
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <FiClock className="text-orange-600" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-500">{post.author}</span>
                    <Link
                      href={`/${params.locale}/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl group"
                    >
                      {t('readMore')}
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-black text-white mb-4">
              Stay Updated! 📬
            </h2>
            <p className="text-xl text-white/90 mb-8 font-medium">
              Get the latest travel tips and destination guides delivered to your inbox
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      </div>
    </>
  );
}
