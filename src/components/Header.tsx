'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';
import AuthModal from './AuthModal';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
];

export default function Header() {
  const t = useTranslations('nav');
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const currentLocale = pathname.split('/')[1] || 'en';

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const switchLanguage = (locale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|fr|ar)/, '');
    window.location.href = `/${locale}${pathWithoutLocale}`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center space-x-2">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-bold text-primary-600">AI Trip Planner</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${currentLocale}#features`} className="text-gray-700 hover:text-primary-600">
              {t('features')}
            </Link>
            <Link href={`/${currentLocale}#how-it-works`} className="text-gray-700 hover:text-primary-600">
              {t('howItWorks')}
            </Link>
            <Link href={`/${currentLocale}/blog`} className="text-gray-700 hover:text-primary-600">
              {t('blog')}
            </Link>

            {session ? (
              <>
                <Link href={`/${currentLocale}/dashboard`} className="text-gray-700 hover:text-primary-600">
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-primary-600"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  {t('signIn')}
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-gradient-to-r from-primary-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-blue-700 font-semibold transition shadow-md hover:shadow-lg"
                >
                  {t('signUp')}
                </button>
              </>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <FiGlobe />
                <span className="text-sm">{currentLocale.toUpperCase()}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        currentLocale === lang.code ? 'bg-primary-50 text-primary-600' : ''
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href={`/${currentLocale}#features`}
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('features')}
            </Link>
            <Link
              href={`/${currentLocale}#how-it-works`}
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('howItWorks')}
            </Link>
            <Link
              href={`/${currentLocale}/blog`}
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('blog')}
            </Link>

            {session ? (
              <>
                <Link
                  href={`/${currentLocale}/dashboard`}
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary-600"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    openAuthModal('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-primary-600"
                >
                  {t('signIn')}
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-primary-700 hover:to-blue-700 text-center font-semibold"
                >
                  {t('signUp')}
                </button>
              </>
            )}

            <div className="border-t pt-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    switchLanguage(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 rounded ${
                    currentLocale === lang.code ? 'bg-primary-50 text-primary-600' : ''
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
      />
    </header>
  );
}
