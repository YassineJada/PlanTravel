'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelType: string;
  activities: string[];
  language: string;
}

const ACTIVITIES = [
  'activityCulture',
  'activityNature',
  'activityFood',
  'activityAdventure',
  'activityShopping',
  'activityNightlife',
  'activityRelaxation',
];

export default function TripGenerator() {
  const t = useTranslations('generator');
  const tErrors = useTranslations('errors');
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'medium',
    travelType: 'solo',
    activities: [],
    language: locale || 'en',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingTrips, setRemainingTrips] = useState<number | null>(null);

  const handleActivityToggle = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.destination || !formData.startDate || !formData.endDate) {
        setError(tErrors('required'));
        setLoading(false);
        return;
      }

      if (formData.activities.length === 0) {
        setError(tErrors('required'));
        setLoading(false);
        return;
      }

      // Call API to generate trip
      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(tErrors('limitReached'));
          setRemainingTrips(0);
        } else {
          setError(data.error || tErrors('generic'));
        }
        setLoading(false);
        return;
      }

      // Redirect to trip result page
      router.push(`/${locale}/trip/${data.tripId}`);
    } catch (err) {
      console.error('Error generating trip:', err);
      setError(tErrors('generic'));
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('title')}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          {remainingTrips === 0 && (
            <div className="mt-2">
              <a href={`/${locale}/auth/signup`} className="underline font-semibold">
                {t('signUp')}
              </a>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('destination')} *
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder={t('destinationPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('startDate')} *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('endDate')} *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('budget')} *
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['low', 'medium', 'high'].map((budget) => (
              <button
                key={budget}
                type="button"
                onClick={() => setFormData({ ...formData, budget })}
                className={`px-4 py-3 rounded-lg border-2 transition ${
                  formData.budget === budget
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {t(`budget${budget.charAt(0).toUpperCase() + budget.slice(1)}` as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('travelType')} *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['solo', 'couple', 'friends', 'family'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, travelType: type })}
                className={`px-4 py-3 rounded-lg border-2 transition ${
                  formData.travelType === type
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {t(`travel${type.charAt(0).toUpperCase() + type.slice(1)}` as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('activities')} *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => handleActivityToggle(activity)}
                className={`px-4 py-3 rounded-lg border-2 transition text-sm ${
                  formData.activities.includes(activity)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {t(activity as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? t('generating') : t('generate')}
        </button>
      </form>
    </div>
  );
}
