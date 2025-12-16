import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Cairo } from 'next/font/google';
import { locales } from '@/i18n';
import SessionProvider from '@/components/SessionProvider';
import CookieConsent from '@/components/CookieConsent';
import NewsletterPopup from '@/components/NewsletterPopup';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5200'),
  title: {
    default: 'PlanYourNextTravel - AI-Powered Trip Planner & Itinerary Generator',
    template: '%s | PlanYourNextTravel',
  },
  description: 'Create personalized travel itineraries with AI. Get budget estimates, activities, and day-by-day plans for your perfect trip. Free, multilingual, and instant results.',
  keywords: 'AI trip planner, travel itinerary generator, vacation planner, travel planning, AI travel assistant, budget travel, itinerary maker, travel recommendations, personalized travel, free trip planner, travel guide, trip organizer',
  authors: [{ name: 'PlanYourNextTravel', url: 'https://planyournexttravel.com' }],
  creator: 'PlanYourNextTravel',
  publisher: 'PlanYourNextTravel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    type: 'website',
    siteName: 'PlanYourNextTravel',
    title: 'PlanYourNextTravel - AI-Powered Trip Planner & Itinerary Generator',
    description: 'Create personalized travel itineraries with AI. Get budget estimates, activities, and day-by-day plans for your perfect trip.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlanYourNextTravel - AI-Powered Trip Planner',
    description: 'Create personalized travel itineraries with AI. Free, multilingual, and instant results.',
    creator: '@planyournexttravel',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code-here',
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <CookieConsent />
            <NewsletterPopup />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
