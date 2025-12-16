import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200';
  const pageUrl = `${baseUrl}/${params.locale}/about`;

  return {
    title: 'About Us - PlanYourNextTravel | AI-Powered Trip Planning',
    description: 'Learn about PlanYourNextTravel, the AI-powered travel planning platform that creates personalized itineraries. Free, multilingual, and instant trip planning for travelers worldwide.',
    keywords: 'about us, travel planning, AI trip planner, company information, mission, vision',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: 'About PlanYourNextTravel',
      description: 'AI-powered travel planning platform creating personalized itineraries for travelers worldwide.',
      url: pageUrl,
      type: 'website',
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About AI Trip Planner</h1>
            
            <div className="prose max-w-none space-y-6">
              <p className="text-lg text-gray-700">
                AI Trip Planner is your intelligent travel companion, designed to make trip planning effortless and enjoyable. Using advanced artificial intelligence, we create personalized, detailed travel itineraries tailored to your preferences, budget, and travel style.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
              <p className="text-gray-700">
                We believe that everyone deserves to experience the world without the stress of planning. Our mission is to democratize travel planning by providing free, AI-powered itinerary generation to travelers worldwide.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Personalized day-by-day travel itineraries</li>
                <li>AI-powered recommendations based on your preferences</li>
                <li>Multi-language support (English, French, Arabic)</li>
                <li>Budget-friendly travel suggestions</li>
                <li>Local insights and safety tips</li>
                <li>Completely free for registered users</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How It Works</h2>
              <p className="text-gray-700">
                Simply tell us where you want to go, when, and what you like to do. Our AI analyzes your preferences and creates a comprehensive travel plan with activities, dining suggestions, and local experiences. Each itinerary is unique and tailored specifically to you.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Choose Us</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Instant Results:</strong> Get your itinerary in seconds, not hours</li>
                <li><strong>Always Free:</strong> No hidden costs, unlimited trips for registered users</li>
                <li><strong>Multilingual:</strong> Plan in your preferred language</li>
                <li><strong>Detailed Plans:</strong> Complete day-by-day breakdown with timings</li>
                <li><strong>Budget-Aware:</strong> Suggestions that match your budget level</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Technology</h2>
              <p className="text-gray-700">
                Powered by state-of-the-art large language models and built with modern web technologies, AI Trip Planner combines the best of AI and human travel knowledge to create itineraries that are both practical and exciting.
              </p>

              <div className="bg-primary-50 p-6 rounded-lg mt-8">
                <p className="text-gray-800 text-center">
                  <strong>Ready to start planning?</strong> Sign up today and get unlimited free trip itineraries!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
