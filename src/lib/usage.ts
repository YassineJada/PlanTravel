import { db } from '@/db';
import { usageTracking, trips } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

const MAX_ANONYMOUS_TRIPS = parseInt(process.env.NEXT_PUBLIC_MAX_ANONYMOUS_TRIPS || '3', 10);

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  return 'unknown';
}

/**
 * Check if anonymous user has reached trip generation limit
 */
export async function checkAnonymousLimit(ipAddress: string): Promise<{
  allowed: boolean;
  remaining: number;
  total: number;
}> {
  try {
    const usage = await db.query.usageTracking.findFirst({
      where: eq(usageTracking.ipAddress, ipAddress),
    });

    const tripsGenerated = usage?.tripsGenerated || 0;
    const remaining = Math.max(0, MAX_ANONYMOUS_TRIPS - tripsGenerated);

    return {
      allowed: tripsGenerated < MAX_ANONYMOUS_TRIPS,
      remaining,
      total: MAX_ANONYMOUS_TRIPS,
    };
  } catch (error) {
    console.error('Error checking anonymous limit:', error);
    // In case of error, be permissive
    return {
      allowed: true,
      remaining: MAX_ANONYMOUS_TRIPS,
      total: MAX_ANONYMOUS_TRIPS,
    };
  }
}

/**
 * Increment anonymous user trip count
 */
export async function incrementAnonymousUsage(ipAddress: string): Promise<void> {
  try {
    const existing = await db.query.usageTracking.findFirst({
      where: eq(usageTracking.ipAddress, ipAddress),
    });

    if (existing) {
      await db
        .update(usageTracking)
        .set({
          tripsGenerated: existing.tripsGenerated + 1,
          lastUsedAt: new Date(),
        })
        .where(eq(usageTracking.ipAddress, ipAddress));
    } else {
      await db.insert(usageTracking).values({
        ipAddress,
        tripsGenerated: 1,
        lastUsedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error incrementing anonymous usage:', error);
    throw error;
  }
}

/**
 * Link anonymous trips to user account after signup
 */
export async function linkAnonymousTripsToUser(userId: string, ipAddress: string): Promise<number> {
  try {
    console.log(`Linking anonymous trips for IP ${ipAddress} to user ${userId}`);
    
    // Update all trips with this IP and no userId
    const result = await db
      .update(trips)
      .set({ 
        userId: userId,
        ipAddress: null // Clear IP after linking
      })
      .where(
        and(
          eq(trips.ipAddress, ipAddress),
          isNull(trips.userId)
        )
      )
      .returning();

    console.log(`Linked ${result.length} trips to user ${userId}`);
    return result.length;
  } catch (error) {
    console.error('Error linking anonymous trips:', error);
    // Don't throw - this is not critical
    return 0;
  }
}
