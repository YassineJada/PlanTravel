'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trip } from '@/db/schema';
import { FiCopy, FiDownload, FiSave, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TripDisplayProps {
  trip: Trip;
  locale: string;
}

export default function TripDisplay({ trip, locale }: TripDisplayProps) {
  const t = useTranslations('itinerary');
  const { data: session } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const itinerary = trip.itinerary as any;

  const handleCopy = async () => {
    const text = generateTextContent();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateTextContent = () => {
    let text = `${itinerary.title}\n\n`;
    text += `${t('overview')}: ${itinerary.overview}\n\n`;
    
    itinerary.days.forEach((day: any) => {
      text += `${t('day')} ${day.day} - ${day.date}\n`;
      text += `${t('morning')}: ${day.morning}\n`;
      text += `${t('afternoon')}: ${day.afternoon}\n`;
      text += `${t('evening')}: ${day.evening}\n\n`;
    });

    if (itinerary.budgetTips?.length) {
      text += `${t('budgetTips')}:\n`;
      itinerary.budgetTips.forEach((tip: string) => {
        text += `- ${tip}\n`;
      });
      text += '\n';
    }

    if (itinerary.localAdvice?.length) {
      text += `${t('localAdvice')}:\n`;
      itinerary.localAdvice.forEach((advice: string) => {
        text += `- ${advice}\n`;
      });
      text += '\n';
    }

    if (itinerary.safetyTips?.length) {
      text += `${t('safetyTips')}:\n`;
      itinerary.safetyTips.forEach((tip: string) => {
        text += `- ${tip}\n`;
      });
    }

    return text;
  };

  const handleExportPDF = () => {
    // Simple fallback: download as text file
    const text = generateTextContent();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip-${trip.destination}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">{itinerary.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FiMapPin />
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar />
            <span>
              {new Date(trip.startDate).toLocaleDateString(locale)} -{' '}
              {new Date(trip.endDate).toLocaleDateString(locale)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-b bg-gray-50 px-8 py-4 flex flex-wrap items-center gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <FiCopy />
          {copied ? t('copied') : t('copyToClipboard')}
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <FiDownload />
          {t('exportPDF')}
        </button>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          {t('generateNew')}
        </button>
        {/* Share to friends buttons */}
        <span className="ml-6 font-medium text-gray-700 flex items-center gap-2">
          {t('shareWithFriends')}
          <ShareButtons itineraryTitle={itinerary.title} locale={locale} />
        </span>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('overview')}</h2>
          <p className="text-gray-700 leading-relaxed">{itinerary.overview}</p>
        </section>

        {/* Day by Day */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <div className="space-y-6">
            {itinerary.days.map((day: any) => (
              <div key={day.day} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-primary-600 mb-4">
                  {t('day')} {day.day} - {day.date}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">☀️ {t('morning')}</h4>
                    <p className="text-gray-700 leading-relaxed">{day.morning}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🌤️ {t('afternoon')}</h4>
                    <p className="text-gray-700 leading-relaxed">{day.afternoon}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🌙 {t('evening')}</h4>
                    <p className="text-gray-700 leading-relaxed">{day.evening}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Budget Tips */}
        {itinerary.budgetTips?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 {t('budgetTips')}</h2>
            <ul className="space-y-2">
              {itinerary.budgetTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Local Advice */}
        {itinerary.localAdvice?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🗺️ {t('localAdvice')}</h2>
            <ul className="space-y-2">
              {itinerary.localAdvice.map((advice: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">•</span>
                  <span className="text-gray-700">{advice}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Safety Tips */}
        {itinerary.safetyTips?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🛡️ {t('safetyTips')}</h2>
            <ul className="space-y-2">
              {itinerary.safetyTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// Update ShareButtons to avoid hydration errors
function ShareButtons({ itineraryTitle, locale }: { itineraryTitle: string; locale: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const url = window.location.href;
  return (
    <span className="flex items-center gap-2">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(itineraryTitle + '\n' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.01L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.23-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.2-3.67.96.98-3.58-.23-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
        <span className="sr-only">WhatsApp</span>
      </a>
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
        <span className="sr-only">Facebook</span>
      </a>
      {/* TikTok */}
      <a
        href={`https://www.tiktok.com/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(itineraryTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on TikTok"
        className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 48 48"><path d="M41.5 17.5c-3.6 0-6.5-2.9-6.5-6.5V4h-6v28.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c.5 0 1 .1 1.5.2v-6.2c-.5-.1-1-.1-1.5-.1-5.8 0-10.5 4.7-10.5 10.5S18.2 43 24 43s10.5-4.7 10.5-10.5V22c1.8 1 3.8 1.5 6 1.5v-6z"/></svg>
        <span className="sr-only">TikTok</span>
      </a>
    </span>
  );
}
