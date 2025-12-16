import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { trips } from '@/db/schema';
import { generateItinerary } from '@/lib/ai';
import { checkAnonymousLimit, incrementAnonymousUsage, getClientIP } from '@/lib/usage';
import { z } from 'zod';

const tripSchema = z.object({
  destination: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.enum(['low', 'medium', 'high']),
  travelType: z.enum(['solo', 'couple', 'friends', 'family']),
  activities: z.array(z.string()),
  language: z.enum(['en', 'fr', 'ar']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    console.log('=== Trip Generation Request ===');
    console.log('Body:', JSON.stringify(body, null, 2));
    console.log('Session:', session ? 'Authenticated' : 'Anonymous');
    console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
    
    const validatedData = tripSchema.parse(body);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));

    // Check usage limits for anonymous users
    if (!session) {
      const ipAddress = getClientIP(request);
      const { allowed, remaining } = await checkAnonymousLimit(ipAddress);

      if (!allowed) {
        return NextResponse.json(
          { error: 'Trip generation limit reached. Please sign up to continue.', remaining: 0 },
          { status: 429 }
        );
      }
    }

    // Generate itinerary using AI
    console.log('Calling generateItinerary...');
    const itinerary = await generateItinerary({
      destination: validatedData.destination,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      budget: validatedData.budget,
      travelType: validatedData.travelType,
      activities: validatedData.activities,
      language: validatedData.language,
    });
    console.log('Itinerary generated successfully');

    // Get IP address for anonymous users
    const ipAddress = !session ? getClientIP(request) : null;

    // Save trip to database
    console.log('Saving to database...');
    const [trip] = await db
      .insert(trips)
      .values({
        userId: session?.user?.id || null,
        ipAddress: ipAddress,
        destination: validatedData.destination,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        budget: validatedData.budget,
        travelType: validatedData.travelType,
        activities: validatedData.activities,
        language: validatedData.language,
        itinerary: itinerary as any,
      })
      .returning();
    console.log('Saved to database with ID:', trip.id);

    // Increment anonymous usage if not logged in
    if (!session) {
      const ipAddress = getClientIP(request);
      await incrementAnonymousUsage(ipAddress);
    }

    return NextResponse.json({ tripId: trip.id }, { status: 201 });
  } catch (error) {
    console.error('=== Trip generation error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Zod validation errors:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate trip. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
