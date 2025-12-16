import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200';
  const pageUrl = `${baseUrl}/${params.locale}/contact`;

  return {
    title: 'Contact Us - PlanYourNextTravel | Get Support & Help',
    description: 'Have questions about trip planning? Contact PlanYourNextTravel for support, feedback, or partnership inquiries. 24/7 online support available.',
    keywords: 'contact us, support, customer service, help, feedback, business inquiries',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: 'Contact PlanYourNextTravel',
      description: 'Get in touch with our team for support, feedback, or partnership inquiries.',
      url: pageUrl,
      type: 'website',
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
            
            <div className="space-y-8">
              <p className="text-lg text-gray-700">
                Have questions, feedback, or need assistance? We'd love to hear from you!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                  <FiMail className="text-4xl text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <a href="mailto:support@aitripplanner.com" className="text-primary-600 hover:text-primary-700">
                    support@aitripplanner.com
                  </a>
                </div>

                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                  <FiMapPin className="text-4xl text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">Global - Serving worldwide</p>
                </div>

                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                  <FiPhone className="text-4xl text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
                  <p className="text-gray-600">24/7 Online Support</p>
                </div>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-700 mb-4">
                  Before reaching out, check our FAQ section on the homepage for quick answers to common questions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Business Inquiries</h2>
                <p className="text-gray-700 mb-2">
                  For partnerships, press inquiries, or business opportunities:
                </p>
                <a href="mailto:business@aitripplanner.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                  business@aitripplanner.com
                </a>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Support</h2>
                <p className="text-gray-700 mb-2">
                  Experiencing technical issues? Report bugs or request features:
                </p>
                <a href="mailto:tech@aitripplanner.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                  tech@aitripplanner.com
                </a>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-600">
                  We aim to respond to all inquiries within 24-48 hours. For urgent matters, please mark your email as "Urgent" in the subject line.
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
