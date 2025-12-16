'use client';

import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiShield } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('cookies');

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      // Show after 1 second delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t-4 border-purple-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Icon and Text */}
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {t('title')}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t('description')}{' '}
                  <a
                    href="/privacy"
                    className="text-purple-600 hover:text-purple-700 underline font-semibold"
                  >
                    {t('learnMore')}
                  </a>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={declineCookies}
                className="flex-1 md:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                {t('decline')}
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 md:flex-none inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
              >
                <FiCheckCircle className="w-5 h-5" />
                <span>{t('accept')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
