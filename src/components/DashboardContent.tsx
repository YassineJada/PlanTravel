'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Trip } from '@/db/schema';
import { FiMapPin, FiCalendar, FiTrash2, FiShield } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardContentProps {
  trips: Trip[];
  locale: string;
  userName: string;
  isAdmin?: boolean;
}

export default function DashboardContent({ trips, locale, userName, isAdmin }: DashboardContentProps) {
  const t = useTranslations('dashboard');
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (tripId: string) => {
    if (!confirm(t('confirmDelete'))) return;

    setDeleting(tripId);
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('welcome')}, {userName}!</p>
        </div>
        {isAdmin && (
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiShield className="text-xl" />
            <span className="font-semibold">Admin Panel</span>
          </Link>
        )}
      </div>

      {trips.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('noTrips')}</h2>
          <p className="text-gray-600 mb-6">{t('createFirst')}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            {t('createFirst')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const itinerary = trip.itinerary as any;
            return (
              <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4">
                  <h3 className="font-semibold text-lg truncate">{itinerary.title}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMapPin className="flex-shrink-0" />
                      <span className="truncate">{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCalendar className="flex-shrink-0" />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString(locale)} -{' '}
                        {new Date(trip.endDate).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/trip/${trip.id}`}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-center hover:bg-primary-700 transition"
                    >
                      {t('viewTrip')}
                    </Link>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      disabled={deleting === trip.id}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                      title={t('deleteTrip')}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
