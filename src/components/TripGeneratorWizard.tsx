'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { DayPicker } from 'react-day-picker';
import { differenceInDays, format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import {
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiHome,
} from 'react-icons/fi';
import { MdFlight, MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import AuthModal from '@/components/AuthModal';

export default function TripGeneratorWizard() {
  const t = useTranslations('generator');
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState<false | 'start' | 'end'>(false); // Changed to handle start/end
  const [dateMode, setDateMode] = useState<'calendar' | 'duration'>('calendar'); // New: date selection mode
  const [tripDuration, setTripDuration] = useState<number>(7); // New: number of days
  const [generatedTrip, setGeneratedTrip] = useState<any>(null); // New: store generated trip
  const [showAuthModal, setShowAuthModal] = useState(false); // New: show limit modal
  const [showAuthForm, setShowAuthForm] = useState(false); // New: show auth form modal
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup'); // New: track auth mode
  const [tripCount, setTripCount] = useState(0); // New: track anonymous trips

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'medium',
    customBudget: '',
    travelType: 'solo',
    activities: [] as string[],
    language: currentLocale, // Add language field with default value
    includeFlights: true,
    includeHotel: true,
  });

  // Calculate number of days
  const numberOfDays = useMemo(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      return differenceInDays(end, start) + 1;
    }
    return 0;
  }, [formData.startDate, formData.endDate]);

  const steps = [
    {
      id: 1,
      title: t('step1.title'),
      icon: <FiMapPin className="w-6 h-6" />,
      description: t('step1.description'),
    },
    {
      id: 2,
      title: t('step2.title'),
      icon: <FiDollarSign className="w-6 h-6" />,
      description: t('step2.description'),
    },
    {
      id: 3,
      title: t('step3.title'),
      icon: <FiHeart className="w-6 h-6" />,
      description: t('step3.description'),
    },
    {
      id: 4,
      title: t('step4.title'),
      icon: <FiCheckCircle className="w-6 h-6" />,
      description: t('step4.description'),
    },
  ];

  const activityOptions = [
    { id: 'culture', label: t('activityCulture'), icon: '🏛️' },
    { id: 'nature', label: t('activityNature'), icon: '🏞️' },
    { id: 'food', label: t('activityFood'), icon: '🍽️' },
    { id: 'adventure', label: t('activityAdventure'), icon: '🎢' },
    { id: 'shopping', label: t('activityShopping'), icon: '🛍️' },
    { id: 'nightlife', label: t('activityNightlife'), icon: '🌃' },
    { id: 'relaxation', label: t('activityRelaxation'), icon: '🧘' },
  ];

  const toggleActivity = (activity: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const canProceed = () => {
    if (currentStep === 1) {
      if (dateMode === 'calendar') {
        return formData.destination && formData.startDate && formData.endDate;
      } else {
        return formData.destination && tripDuration > 0;
      }
    }
    if (currentStep === 2) {
      return formData.budget && formData.travelType;
    }
    if (currentStep === 3) {
      return formData.activities.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // If duration mode, calculate dates from today
      let submitData = { ...formData };
      if (dateMode === 'duration') {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + tripDuration - 1);
        submitData.startDate = format(today, 'yyyy-MM-dd');
        submitData.endDate = format(endDate, 'yyyy-MM-dd');
      }

      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate trip');
      }

      // Store the generated trip and show it on the same page
      setGeneratedTrip(data);
      setCurrentStep(1); // Reset to step 1
      
      // Reset form for next trip
      setFormData({
        destination: '',
        startDate: '',
        endDate: '',
        budget: 'medium',
        customBudget: '',
        travelType: 'solo',
        activities: [],
        language: currentLocale,
        includeFlights: true,
        includeHotel: true,
      });
      setShowCalendar(false);
      setTripDuration(7);

      // Increment trip count for anonymous users
      if (!session) {
        const newCount = tripCount + 1;
        setTripCount(newCount);
        
        // Show auth modal after 3 trips
        if (newCount >= 3) {
          setShowAuthModal(true);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-br from-primary-500 to-blue-500 text-white shadow-lg scale-110'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <FiCheckCircle className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Destination & Dates - Redesigned */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
                <FiMapPin className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {steps[0].title}
              </h2>
              <p className="text-lg text-gray-600 font-medium">{steps[0].description}</p>
            </div>

            {/* Destination Input */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FiMapPin className="w-4 h-4 text-white" />
                </div>
                {t('destination')}
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder={t('destinationPlaceholder')}
                  className="w-full px-6 py-4 bg-gradient-to-br from-blue-50 to-purple-50 border-3 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition text-lg font-medium placeholder:text-gray-400 group-hover:shadow-lg"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl">
                  🌍
                </div>
              </div>
            </div>

            {/* Date Selection Mode Toggle */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-4 h-4 text-white" />
                </div>
                When do you want to travel?
              </label>

              {/* Mode Selector */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setDateMode('calendar')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    dateMode === 'calendar'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-300 bg-gray-50 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-2">📅</div>
                  <div className="font-bold text-sm">Pick Dates</div>
                  <div className="text-xs text-gray-600">Choose start & end dates</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDateMode('duration')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    dateMode === 'duration'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-300 bg-gray-50 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="font-bold text-sm">Trip Duration</div>
                  <div className="text-xs text-gray-600">Number of days</div>
                </button>
              </div>

              {/* Calendar Mode - Separate Start and End Date Pickers */}
              {dateMode === 'calendar' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Start Date</label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(showCalendar === 'start' ? false : 'start')}
                      className="w-full px-4 py-3 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:border-green-500 hover:shadow-lg transition text-left flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <MdFlightTakeoff className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          {formData.startDate ? (
                            <div className="font-semibold text-gray-900 text-sm">
                              {format(new Date(formData.startDate), 'MMM dd, yyyy')}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">Choose date</div>
                          )}
                        </div>
                      </div>
                      <FiCalendar className="w-4 h-4 text-green-600 group-hover:scale-110 transition" />
                    </button>

                    {showCalendar === 'start' && (
                      <div className="absolute z-50 mt-2 bg-white border-3 border-green-200 rounded-2xl p-4 shadow-2xl">
                        <DayPicker
                          mode="single"
                          selected={formData.startDate ? new Date(formData.startDate) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const newStartDate = format(date, 'yyyy-MM-dd');
                              setFormData({ ...formData, startDate: newStartDate });
                              setShowCalendar(false);
                              
                              // If end date is before new start date, clear it
                              if (formData.endDate && new Date(formData.endDate) < date) {
                                setFormData({ ...formData, startDate: newStartDate, endDate: '' });
                              }
                            }
                          }}
                          disabled={{ before: new Date() }}
                          styles={{
                            caption: { color: '#059669', fontWeight: 'bold', fontSize: '1rem' },
                            day: { borderRadius: '0.5rem' },
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* End Date Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">End Date</label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(showCalendar === 'end' ? false : 'end')}
                      disabled={!formData.startDate}
                      className="w-full px-4 py-3 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition text-left flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <MdFlightLand className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          {formData.endDate ? (
                            <div className="font-semibold text-gray-900 text-sm">
                              {format(new Date(formData.endDate), 'MMM dd, yyyy')}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">
                              {formData.startDate ? 'Choose date' : 'Select start first'}
                            </div>
                          )}
                        </div>
                      </div>
                      <FiCalendar className="w-4 h-4 text-orange-600 group-hover:scale-110 transition" />
                    </button>

                    {showCalendar === 'end' && formData.startDate && (
                      <div className="absolute z-50 mt-2 bg-white border-3 border-orange-200 rounded-2xl p-4 shadow-2xl">
                        <DayPicker
                          mode="single"
                          selected={formData.endDate ? new Date(formData.endDate) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setFormData({ ...formData, endDate: format(date, 'yyyy-MM-dd') });
                              setShowCalendar(false);
                            }
                          }}
                          disabled={{ before: new Date(formData.startDate) }}
                          styles={{
                            caption: { color: '#ea580c', fontWeight: 'bold', fontSize: '1rem' },
                            day: { borderRadius: '0.5rem' },
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Duration Mode */}
              {dateMode === 'duration' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-3 border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-gray-900">How many days?</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {tripDuration} {tripDuration === 1 ? 'Day' : 'Days'}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={tripDuration}
                      onChange={(e) => setTripDuration(parseInt(e.target.value))}
                      className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>1 day</span>
                      <span>30 days</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded-xl p-4 text-sm text-gray-700">
                    <div className="font-semibold mb-1">📍 Trip starts today</div>
                    <div>Your {tripDuration}-day adventure begins on {format(new Date(), 'MMM dd, yyyy')}</div>
                  </div>
                </div>
              )}

              {/* Number of Days Display (for calendar mode) */}
              {dateMode === 'calendar' && numberOfDays > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg">
                  <div className="text-3xl">🗓️</div>
                  <div>
                    <div className="text-sm opacity-90">Trip Duration</div>
                    <div className="text-2xl font-black">{numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Tip */}
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Pro Tip</div>
                <div className="text-gray-700">Choose dates with flexibility for better flight deals and accommodation options!</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget & Travel Type - Redesigned */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl mb-6 shadow-2xl">
                <FiDollarSign className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                {steps[1].title}
              </h2>
              <p className="text-lg text-gray-600 font-medium">{steps[1].description}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="w-4 h-4 text-white" />
                </div>
                {t('budget')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'low', label: t('budgetLow'), emoji: '💰', amount: '< $500' },
                  { value: 'medium', label: t('budgetMedium'), emoji: '💰💰', amount: '$500-$2000' },
                  { value: 'high', label: t('budgetHigh'), emoji: '💰💰💰', amount: '$2000-$5000' },
                  { value: 'custom', label: 'Custom', emoji: '✏️', amount: 'Your budget' },
                ].map((budget) => (
                  <button
                    key={budget.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: budget.value })}
                    className={`relative p-5 rounded-2xl border-3 transition-all overflow-hidden group ${
                      formData.budget === budget.value
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl scale-105'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="text-3xl mb-2">{budget.emoji}</div>
                    <div className="font-bold text-sm text-gray-900 mb-1">
                      {budget.label}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {budget.amount}
                    </div>
                    {formData.budget === budget.value && (
                      <div className="absolute top-2 right-2">
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Budget Input */}
              {formData.budget === 'custom' && (
                <div className="mt-4">
                  <input
                    type="number"
                    value={formData.customBudget}
                    onChange={(e) => setFormData({ ...formData, customBudget: e.target.value })}
                    placeholder="Enter your budget in USD"
                    className="w-full px-6 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-3 border-green-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition text-lg font-medium"
                  />
                </div>
              )}

              {/* Flight and Hotel Inclusion Toggles */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, includeFlights: !formData.includeFlights })}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    formData.includeFlights
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.includeFlights ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <MdFlight className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-900 text-sm">Include Flights</div>
                    <div className="text-xs text-gray-600">Add flight recommendations</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.includeFlights ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {formData.includeFlights && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, includeHotel: !formData.includeHotel })}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    formData.includeHotel
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    formData.includeHotel ? 'bg-purple-500' : 'bg-gray-300'
                  }`}>
                    <FiHome className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-900 text-sm">Include Hotels</div>
                    <div className="text-xs text-gray-600">Add accommodation tips</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.includeHotel ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                  }`}>
                    {formData.includeHotel && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <FiUsers className="w-4 h-4 text-white" />
                </div>
                {t('travelType')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['solo', 'couple', 'friends', 'family'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelType: type })}
                    className={`relative p-6 rounded-2xl border-3 transition-all group ${
                      formData.travelType === type
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl scale-105'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="text-4xl mb-3">
                      {type === 'solo' ? '🧳' : type === 'couple' ? '💑' : type === 'friends' ? '👥' : '👨‍👩‍👧‍👦'}
                    </div>
                    <div className="font-bold text-base text-gray-900">
                      {t(`travel${type.charAt(0).toUpperCase() + type.slice(1)}`)}
                    </div>
                    {formData.travelType === type && (
                      <div className="absolute top-3 right-3">
                        <FiCheckCircle className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Tip */}
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Budget Tip</div>
                <div className="text-gray-700">Your budget helps us recommend the perfect accommodations, dining, and activities!</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Activities - Redesigned */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl mb-6 shadow-2xl animate-pulse-slow">
                <FiHeart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {steps[2].title}
              </h2>
              <p className="text-lg text-gray-600 font-medium">{steps[2].description}</p>
              <p className="text-sm text-gray-500 mt-2">Select all that apply ✨</p>
            </div>

            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activityOptions.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => toggleActivity(activity.id)}
                    className={`relative p-6 rounded-2xl border-3 transition-all group ${
                      formData.activities.includes(activity.id)
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-pink-50 shadow-2xl scale-105'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg hover:scale-102'
                    }`}
                  >
                    <div className="text-4xl mb-3">{activity.icon}</div>
                    <div className="font-bold text-sm text-gray-900 leading-tight">
                      {activity.label}
                    </div>
                    {formData.activities.includes(activity.id) && (
                      <div className="absolute top-3 right-3 bg-orange-500 rounded-full p-1">
                        <FiCheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected count */}
            {formData.activities.length > 0 && (
              <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border-2 border-orange-200 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">
                  {formData.activities.length === activityOptions.length ? '🎉' : '✅'}
                </div>
                <div className="font-bold text-gray-900 text-lg">
                  {formData.activities.length} {formData.activities.length === 1 ? 'Activity' : 'Activities'} Selected
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  Perfect! We'll customize your itinerary based on your interests.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review & Generate - Redesigned */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
                <FiCheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {steps[3].title}
              </h2>
              <p className="text-lg text-gray-600 font-medium">{steps[3].description}</p>
            </div>

            <div className="space-y-4">
              {/* Destination Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FiMapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blue-900 mb-1">{t('destination')}</div>
                    <div className="font-black text-2xl text-gray-900 mb-2">{formData.destination}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span className="font-semibold">
                        {new Date(formData.startDate).toLocaleDateString()} → {new Date(formData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget & Travel Type Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FiDollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-green-900 mb-1">{t('budget')} & {t('travelType')}</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full font-black text-gray-900 shadow-sm">
                        💰 {t(`budget${formData.budget.charAt(0).toUpperCase() + formData.budget.slice(1)}`)}
                      </span>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full font-black text-gray-900 shadow-sm">
                        {formData.travelType === 'solo' ? '🧳' : formData.travelType === 'couple' ? '💑' : formData.travelType === 'friends' ? '👥' : '👨‍👩‍👧‍👦'}
                        {t(`travel${formData.travelType.charAt(0).toUpperCase() + formData.travelType.slice(1)}`)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities Card */}
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FiHeart className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-orange-900 mb-2">{t('activities')}</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.activities.map((id) => {
                        const activity = activityOptions.find((a) => a.id === id);
                        return (
                          <span key={id} className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-full text-sm font-bold text-gray-900 shadow-sm">
                            <span>{activity?.icon}</span>
                            <span>{activity?.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ready Message */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-2xl">
              <div className="text-5xl mb-4">🎉</div>
              <div className="text-2xl font-black mb-2">Everything Looks Perfect!</div>
              <div className="text-lg font-medium opacity-90">
                Click below to generate your personalized itinerary
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <FiArrowLeft />
            {t('back')}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {t('next')}
              <FiArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  {t('generating')}
                </>
              ) : (
                <>
                  {t('generate')}
                  <FiCheckCircle />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Generated Trip Display */}
      {generatedTrip && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-4">
              <FiCheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Trip Generated Successfully! 🎉</h3>
            <p className="text-gray-600">
              {!session && `You have ${3 - tripCount} more free ${tripCount >= 2 ? 'trip' : 'trips'} remaining`}
            </p>
          </div>

          {/* Trip Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{generatedTrip.destination}</h4>
                <p className="text-sm text-gray-600">
                  {generatedTrip.days} day{generatedTrip.days > 1 ? 's' : ''} • {generatedTrip.budget} budget
                </p>
              </div>
              <a
                href={`/${currentLocale}/trip/${generatedTrip.tripId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
              >
                View Full Itinerary
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setGeneratedTrip(null)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Generate Another Trip 🚀
            </button>
            {!session && tripCount >= 3 && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
              >
                Sign Up for Unlimited Trips ✨
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
                <span className="text-4xl">🎁</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">You've Used Your Free Trips!</h3>
              <p className="text-gray-600">
                Sign up now to get <span className="font-bold text-green-600">unlimited trip planning</span> completely free!
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <div className="font-bold text-gray-900">Unlimited Trips</div>
                    <div className="text-sm text-gray-600">Generate as many itineraries as you want</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💾</div>
                  <div>
                    <div className="font-bold text-gray-900">Save & Access</div>
                    <div className="text-sm text-gray-600">All your trips saved to your dashboard</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎨</div>
                  <div>
                    <div className="font-bold text-gray-900">100% Free Forever</div>
                    <div className="text-sm text-gray-600">No credit card required</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(false);
                  setShowAuthForm(true);
                }}
                className="block w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition"
              >
                Sign Up Now 🚀
              </button>
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setShowAuthModal(false);
                  setShowAuthForm(true);
                }}
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition"
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Form Modal */}
      <AuthModal
        isOpen={showAuthForm}
        onClose={() => setShowAuthForm(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
      />
    </div>
  );
}
