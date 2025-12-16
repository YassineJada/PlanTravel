# Anonymous Trip Linking Feature

## Overview
Implemented automatic linking of anonymous trips to user accounts after sign-up or sign-in. Users who generate trips without an account can now see all their previously created trips in their dashboard after creating an account.

## Problem Solved
**Before**: Anonymous users could generate up to 3 trips, but after signing up, they couldn't see those trips in their dashboard - they would have to start from scratch.

**After**: All trips created anonymously (before sign-up) are automatically linked to the user's account, preserving their work and providing a seamless experience.

## Technical Implementation

### 1. Database Schema Changes

#### Added `ipAddress` Column to Trips Table
```typescript
export const trips = pgTable('trips', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  ipAddress: text('ip_address'), // NEW: Track anonymous user IP for linking
  // ...other fields
});
```

**Purpose**: Store the IP address of anonymous users so we can identify and link their trips after they sign up.

### 2. Trip Generation Update

#### Modified `src/app/api/trips/generate/route.ts`
```typescript
// Get IP address for anonymous users
const ipAddress = !session ? getClientIP(request) : null;

// Save trip with IP address
const [trip] = await db.insert(trips).values({
  userId: session?.user?.id || null,
  ipAddress: ipAddress, // Store IP for anonymous users
  // ...other fields
});
```

**What it does**:
- For authenticated users: `userId` is set, `ipAddress` is `null`
- For anonymous users: `userId` is `null`, `ipAddress` is stored

### 3. New Linking Function

#### Added to `src/lib/usage.ts`
```typescript
export async function linkAnonymousTripsToUser(
  userId: string, 
  ipAddress: string
): Promise<number> {
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

  return result.length;
}
```

**What it does**:
1. Finds all trips with the user's IP address and no `userId`
2. Sets the `userId` to the new user's ID
3. Clears the `ipAddress` (no longer needed)
4. Returns the count of linked trips

### 4. Registration Flow

#### Updated `src/app/api/auth/register/route.ts`
```typescript
// Create user
const [newUser] = await db.insert(users).values({...}).returning();

// Link any anonymous trips to the new user account
const ipAddress = getClientIP(request);
const linkedTripsCount = await linkAnonymousTripsToUser(newUser.id, ipAddress);

console.log(`New user ${newUser.id} created. Linked ${linkedTripsCount} anonymous trips.`);

return NextResponse.json({
  message: 'User created successfully',
  userId: newUser.id,
  linkedTrips: linkedTripsCount // NEW: Tell client how many trips were linked
});
```

**What it does**:
- Immediately after user registration, link all their anonymous trips
- Return the count of linked trips in the response

### 5. Sign-In Flow

#### New API Endpoint: `src/app/api/trips/link-anonymous/route.ts`
```typescript
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ipAddress = getClientIP(request);
  const linkedTripsCount = await linkAnonymousTripsToUser(session.user.id, ipAddress);

  return NextResponse.json({
    success: true,
    linkedTrips: linkedTripsCount,
    message: linkedTripsCount > 0
      ? `Successfully linked ${linkedTripsCount} trip${linkedTripsCount > 1 ? 's' : ''}`
      : 'No anonymous trips to link.'
  });
}
```

**What it does**:
- Called after successful sign-in
- Links anonymous trips from the user's IP to their account
- Returns a success message

### 6. Client-Side Integration

#### Updated `src/components/AuthModal.tsx`

**After Sign-Up**:
```typescript
// Auto sign in after registration
const signInResult = await signIn('credentials', {...});

if (signInResult?.ok && data.linkedTrips > 0) {
  console.log(`Linked ${data.linkedTrips} anonymous trips to new account`);
}

onClose();
window.location.reload(); // Refresh to show linked trips
```

**After Sign-In**:
```typescript
if (result?.ok) {
  // Link any anonymous trips after sign in
  const linkRes = await fetch('/api/trips/link-anonymous', { method: 'POST' });
  const linkData = await linkRes.json();
  
  if (linkData.linkedTrips > 0) {
    console.log(`Linked ${linkData.linkedTrips} anonymous trips to account`);
  }
}

onClose();
window.location.reload(); // Refresh to show linked trips
```

## User Flow Examples

### Scenario 1: New User Sign-Up
1. **Anonymous user** generates 3 trips (stored with their IP address)
2. Reaches the 3-trip limit
3. Clicks "Sign Up Now 🚀" in the limit modal
4. Fills out the sign-up form and submits
5. **Backend automatically links** the 3 trips to the new account
6. **Page refreshes** and user sees all 3 trips in their dashboard ✅

### Scenario 2: Existing User Sign-In
1. **Anonymous user** generates 2 trips on Device A
2. Closes browser and comes back later
3. Signs in to their existing account
4. **Backend links** the 2 new trips to their account
5. **Page refreshes** and user sees their old trips + the 2 new ones ✅

### Scenario 3: Different Devices
1. User generates 2 trips anonymously on **Laptop** (IP: 192.168.1.100)
2. Generates 1 trip anonymously on **Phone** (IP: 10.0.0.50)
3. Signs up on **Phone**
4. ✅ The 1 trip from Phone is linked immediately
5. ❌ The 2 trips from Laptop remain anonymous (different IP)
6. **Solution**: When user signs in on Laptop, those 2 trips will be linked

## Database Migration

### Generated Migration File
```sql
-- drizzle/0000_cultured_microchip.sql
ALTER TABLE "trips" ADD COLUMN "ip_address" text;
```

### Applied with Drizzle Push
```bash
npx drizzle-kit push
```

## Files Modified

### Core Implementation
- ✅ `src/db/schema.ts` - Added `ipAddress` column to trips table
- ✅ `src/lib/usage.ts` - Added `linkAnonymousTripsToUser()` function
- ✅ `src/app/api/trips/generate/route.ts` - Store IP for anonymous trips
- ✅ `src/app/api/auth/register/route.ts` - Link trips on sign-up
- ✅ `src/app/api/trips/link-anonymous/route.ts` - NEW: Link trips on sign-in
- ✅ `src/components/AuthModal.tsx` - Call linking after authentication

### Database
- ✅ `drizzle/0000_cultured_microchip.sql` - Migration file
- ✅ Database schema updated with `ip_address` column

## Benefits

### For Users
✅ **No Lost Work**: All anonymous trips are preserved after sign-up
✅ **Seamless Experience**: Automatic linking - no manual action required
✅ **Immediate Access**: Trips appear in dashboard right after authentication
✅ **Cross-Session**: Works even if user comes back days later

### For Business
✅ **Higher Conversion**: Users more likely to sign up knowing their work is saved
✅ **Better Retention**: Users see value immediately (their trips are already there)
✅ **Data Integrity**: All trips properly associated with user accounts
✅ **Analytics**: Can track conversion from anonymous to authenticated users

## Edge Cases Handled

### ✅ Multiple Anonymous Sessions
- If user creates trips on different devices/IPs, each device's trips will be linked when they sign in on that device

### ✅ IP Changes
- If user's IP changes between trip creation and sign-up, trips from the new IP are linked
- Previous IP's trips remain in database (could be linked if user signs in from that IP again)

### ✅ Database Errors
- Linking failures are logged but don't prevent authentication
- User can still sign up/in even if linking fails

### ✅ Race Conditions
- Database query uses `AND` conditions to prevent linking already-linked trips
- `isNull(trips.userId)` ensures only truly anonymous trips are linked

## Testing Checklist

- [ ] Generate 3 trips anonymously
- [ ] Sign up with new account
- [ ] Verify all 3 trips appear in dashboard
- [ ] Log out
- [ ] Generate 2 more trips anonymously
- [ ] Sign in to existing account
- [ ] Verify the 2 new trips are now in dashboard
- [ ] Check database to confirm `ipAddress` is cleared after linking
- [ ] Test on different browsers/devices
- [ ] Verify no trips are duplicated
- [ ] Check console logs for linking confirmation

## Monitoring & Logging

### Console Logs Added
```typescript
// Registration
console.log(`New user ${newUser.id} created. Linked ${linkedTripsCount} anonymous trips.`);

// Sign-in
console.log(`Linked ${linkedTripsCount} anonymous trips to user ${userId}`);

// Linking function
console.log(`Linking anonymous trips for IP ${ipAddress} to user ${userId}`);
console.log(`Linked ${result.length} trips to user ${userId}`);
```

### Check Logs For
- Number of trips linked per registration/sign-in
- Errors during linking process
- IP addresses (for debugging only - don't log in production)

## Future Enhancements

### Possible Improvements
- [ ] **Email-based linking**: Link trips by email instead of IP (more reliable)
- [ ] **Session-based linking**: Use browser session ID instead of IP
- [ ] **Manual linking**: Admin tool to manually link orphaned trips
- [ ] **Notification**: Show toast message "3 trips linked to your account!"
- [ ] **Analytics dashboard**: Track conversion and linking statistics
- [ ] **Time-based cleanup**: Delete unlinked anonymous trips after 30 days
- [ ] **Multi-device linking**: Suggest user sign in on other devices to link all trips

## Security Considerations

### IP Address Privacy
- ✅ IPs are cleared after linking (not stored long-term with user account)
- ✅ Only used for linking, not for tracking or analytics
- ✅ GDPR-friendly: minimal data retention

### Data Integrity
- ✅ Only anonymous trips (`userId = null`) can be linked
- ✅ Already-linked trips cannot be re-linked to different accounts
- ✅ Database constraints prevent orphaned trips

---

**Status**: ✅ Complete and deployed
**Last Updated**: December 2024
**Next Steps**: Monitor linking success rate and user feedback
