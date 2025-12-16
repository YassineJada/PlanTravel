import { NextResponse } from 'next/server';
import { db } from '@/db';
import { subscribers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, email),
    });

    if (existing) {
      if (!existing.isActive) {
        // Reactivate subscription
        await db
          .update(subscribers)
          .set({ isActive: true, subscribedAt: new Date() })
          .where(eq(subscribers.email, email));
      }
      return NextResponse.json({ message: 'Already subscribed!' });
    }

    // Create new subscriber
    await db.insert(subscribers).values({ email });

    return NextResponse.json({ message: 'Subscribed successfully!' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
