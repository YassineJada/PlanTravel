import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getClientIP, linkAnonymousTripsToUser } from '@/lib/usage';

/**
 * API endpoint to link anonymous trips after user signs in or signs up
 * Called from the client after successful authentication
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const ipAddress = getClientIP(request);
    const linkedTripsCount = await linkAnonymousTripsToUser(session.user.id, ipAddress);

    console.log(`Linked ${linkedTripsCount} anonymous trips to user ${session.user.id}`);

    return NextResponse.json(
      { 
        success: true, 
        linkedTrips: linkedTripsCount,
        message: linkedTripsCount > 0 
          ? `Successfully linked ${linkedTripsCount} trip${linkedTripsCount > 1 ? 's' : ''} to your account!`
          : 'No anonymous trips to link.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error linking trips:', error);
    return NextResponse.json(
      { error: 'Failed to link trips' },
      { status: 500 }
    );
  }
}
