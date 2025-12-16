'use client';

import { useState } from 'react';
import { FiUsers, FiMap, FiTrendingUp, FiCalendar, FiMail, FiClock, FiDollarSign, FiDownload, FiActivity, FiMapPin, FiHeart } from 'react-icons/fi';
import Link from 'next/link';

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

interface AdminDashboardWrapperProps {
  locale: string;
  stats: Stats;
}

export function AdminDashboardWrapper({ locale, stats }: AdminDashboardWrapperProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'trips' | 'subscribers'>('analytics');

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`;
          }
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportUsers = () => {
    const data = stats.recentUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name || 'N/A',
      isAdmin: user.isAdmin ? 'Yes' : 'No',
      createdAt: new Date(user.createdAt).toLocaleDateString(),
    }));
    exportToCSV(data, 'users');
  };

  const exportTrips = () => {
    const data = stats.recentTrips.map(trip => ({
      id: trip.id,
      destination: trip.destination,
      userEmail: trip.user?.email || 'Anonymous',
      userName: trip.user?.name || 'N/A',
      startDate: new Date(trip.startDate).toLocaleDateString(),
      endDate: new Date(trip.endDate).toLocaleDateString(),
      budget: trip.budget,
      travelType: trip.travelType,
      activities: trip.activities.join(', '),
      createdAt: new Date(trip.createdAt).toLocaleDateString(),
    }));
    exportToCSV(data, 'trips');
  };

  const exportSubscribers = () => {
    const data = stats.recentSubscribers.map(sub => ({
      id: sub.id,
      email: sub.email,
      subscribedAt: new Date(sub.subscribedAt).toLocaleDateString(),
    }));
    exportToCSV(data, 'subscribers');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage your application data and view analytics</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${locale}/dashboard`}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                User Dashboard
              </Link>
              <Link
                href={`/${locale}`}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <FiUsers className="text-5xl text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Trips</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalTrips}</p>
                </div>
                <FiMap className="text-5xl text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Subscribers</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalSubscribers}</p>
                </div>
                <FiMail className="text-5xl text-pink-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            {(['analytics', 'users', 'trips', 'subscribers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Top Destinations */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiMapPin className="text-2xl text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-800">Top Destinations</h3>
                    </div>
                    <div className="space-y-3">
                      {stats.topDestinations.slice(0, 5).map((dest, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="font-medium text-gray-700">{dest.destination}</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {dest.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Distribution */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiDollarSign className="text-2xl text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-800">Budget Distribution</h3>
                    </div>
                    <div className="space-y-3">
                      {stats.budgetDistribution.map((budget, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="font-medium text-gray-700">{budget.budget}</span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {budget.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Travel Types */}
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiActivity className="text-2xl text-green-600" />
                      <h3 className="text-xl font-bold text-gray-800">Travel Types</h3>
                    </div>
                    <div className="space-y-3">
                      {stats.travelTypeDistribution.map((type, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="font-medium text-gray-700">{type.travelType}</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {type.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Activities */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiHeart className="text-2xl text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-800">Popular Activities</h3>
                    </div>
                    <div className="space-y-3">
                      {stats.topActivities.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <span className="font-medium text-gray-700">{activity.activity}</span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                            {activity.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Recent Users</h3>
                  <button
                    onClick={exportUsers}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiDownload />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.name || 'N/A'}</td>
                          <td className="py-3 px-4">
                            {user.isAdmin ? (
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                Admin
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                User
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trips Tab */}
            {activeTab === 'trips' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Recent Trips</h3>
                  <button
                    onClick={exportTrips}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FiDownload />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Destination</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Dates</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Budget</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentTrips.map((trip) => (
                        <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{trip.destination}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {trip.user?.email || 'Anonymous'}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {trip.budget}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{trip.travelType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h3>
                  <button
                    onClick={exportSubscribers}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    <FiDownload />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Subscribed At</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{subscriber.email}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(subscriber.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
