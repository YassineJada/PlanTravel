import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { users, trips, subscribers } from '@/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is logged in and is admin
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch dashboard statistics
    const [allUsers, allTrips, allSubscribers, recentUsers, recentTrips, recentSubscribers] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(trips),
      db.select({ count: count() }).from(subscribers).where(eq(subscribers.isActive, true)),
      db.select().from(users).orderBy(desc(users.createdAt)).limit(20),
      db
        .select({
          id: trips.id,
          destination: trips.destination,
          startDate: trips.startDate,
          endDate: trips.endDate,
          budget: trips.budget,
          travelType: trips.travelType,
          activities: trips.activities,
          language: trips.language,
          createdAt: trips.createdAt,
          user: {
            id: users.id,
            email: users.email,
            name: users.name,
          },
        })
        .from(trips)
        .leftJoin(users, eq(trips.userId, users.id))
        .orderBy(desc(trips.createdAt))
        .limit(50),
      db.select().from(subscribers).where(eq(subscribers.isActive, true)).orderBy(desc(subscribers.subscribedAt)).limit(50),
    ]);

    // Get trips per day for the last 30 days
    const tripsPerDay = await db
      .select({
        date: sql<string>`DATE(${trips.createdAt})`,
        count: count(),
      })
      .from(trips)
      .where(sql`${trips.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE(${trips.createdAt})`)
      .orderBy(sql`DATE(${trips.createdAt})`);

    // Get top destinations
    const topDestinations = await db
      .select({
        destination: trips.destination,
        count: count(),
      })
      .from(trips)
      .groupBy(trips.destination)
      .orderBy(desc(count()))
      .limit(10);

    // Get budget distribution
    const budgetDistribution = await db
      .select({
        budget: trips.budget,
        count: count(),
      })
      .from(trips)
      .groupBy(trips.budget)
      .orderBy(desc(count()));

    // Get travel type distribution
    const travelTypeDistribution = await db
      .select({
        travelType: trips.travelType,
        count: count(),
      })
      .from(trips)
      .groupBy(trips.travelType)
      .orderBy(desc(count()));

    // Get most popular activities
    const allActivities = await db.select({ activities: trips.activities }).from(trips);
    const activityCount: Record<string, number> = {};
    allActivities.forEach((trip) => {
      trip.activities?.forEach((activity) => {
        activityCount[activity] = (activityCount[activity] || 0) + 1;
      });
    });
    const topActivities = Object.entries(activityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([activity, count]) => ({ activity, count }));

    const stats = {
      totalUsers: allUsers[0].count,
      totalTrips: allTrips[0].count,
      totalSubscribers: allSubscribers[0].count,
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
      })),
      recentTrips: recentTrips.map(trip => ({
        id: trip.id,
        destination: trip.destination,
        startDate: trip.startDate.toISOString(),
        endDate: trip.endDate.toISOString(),
        budget: trip.budget,
        travelType: trip.travelType,
        activities: trip.activities || [],
        language: trip.language,
        createdAt: trip.createdAt.toISOString(),
        user: trip.user ? {
          id: trip.user.id,
          email: trip.user.email,
          name: trip.user.name,
        } : null,
      })),
      recentSubscribers: recentSubscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        subscribedAt: sub.subscribedAt.toISOString(),
        isActive: sub.isActive,
      })),
      tripsPerDay: tripsPerDay.map(day => ({
        date: day.date,
        count: Number(day.count),
      })),
      topDestinations: topDestinations.map(dest => ({
        destination: dest.destination,
        count: Number(dest.count),
      })),
      budgetDistribution: budgetDistribution.map(budget => ({
        budget: budget.budget,
        count: Number(budget.count),
      })),
      travelTypeDistribution: travelTypeDistribution.map(type => ({
        travelType: type.travelType,
        count: Number(type.count),
      })),
      topActivities: topActivities.map(activity => ({
        activity: activity.activity,
        count: Number(activity.count),
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
