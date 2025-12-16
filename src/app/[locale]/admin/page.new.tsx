'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminDashboardWrapper } from '@/components/AdminDashboardSimple';

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
}

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelType: string;
  activities: string[];
  language: string;
  createdAt: string;
  user: {
    id: string | null;
    email: string | null;
    name: string | null;
  } | null;
}

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

interface Stats {
  totalUsers: number;
  totalTrips: number;
  totalSubscribers: number;
  recentUsers: User[];
  recentTrips: Trip[];
  recentSubscribers: Subscriber[];
  tripsPerDay: { date: string; count: number }[];
  topDestinations: { destination: string; count: number }[];
  budgetDistribution: { budget: string; count: number }[];
  travelTypeDistribution: { travelType: string; count: number }[];
  topActivities: { activity: string; count: number }[];
}

export default function AdminPage({ params }: { params: { locale: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push(`/${params.locale}/auth/signin`);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        
        if (response.status === 401) {
          router.push(`/${params.locale}/auth/signin`);
          return;
        }
        
        if (response.status === 403) {
          router.push(`/${params.locale}`);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch admin statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router, params.locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return <AdminDashboardWrapper locale={params.locale} stats={stats} />;
}
