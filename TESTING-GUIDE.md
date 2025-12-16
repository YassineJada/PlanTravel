# 🧪 Testing Guide: Anonymous Trip Linking & Seamless Auth

## ✅ Server Status
**Server is running at:** http://localhost:5200

---

## 🎯 Test Scenarios

### Test 1: Sign-Up Flow with Anonymous Trips

**Objective**: Verify that trips created before sign-up appear in the dashboard after registration.

#### Steps:
1. **Open the app in Incognito/Private browsing mode**
   - Open: http://localhost:5200
   - Reason: Clean slate, no existing authentication

2. **Generate Trip #1**
   - Click "Plan Your Trip" or go to trip generator
   - Fill in:
     - Destination: Paris
     - Dates: Pick any dates (e.g., 3 days)
     - Budget: Medium
     - Travel Type: Solo
     - Activities: Select 2-3 activities
   - Click "Generate Trip"
   - ✅ Trip should generate successfully

3. **Generate Trip #2**
   - Click "Generate Another Trip"
   - Fill in:
     - Destination: Tokyo
     - Dates: 5 days
     - Budget: High
     - Travel Type: Couple
   - Click "Generate Trip"
   - ✅ Trip should generate successfully

4. **Generate Trip #3**
   - Click "Generate Another Trip"
   - Fill in:
     - Destination: London
     - Dates: 4 days
     - Budget: Low
     - Travel Type: Family
   - Click "Generate Trip"
   - ✅ Trip should generate successfully

5. **Try to Generate Trip #4 (Trigger Limit)**
   - Click "Generate Another Trip"
   - Fill in any destination
   - Click "Generate Trip"
   - ✅ **Trip Limit Modal should appear** with:
     - Title: "You've Used Your Free Trips!"
     - Benefits list (Unlimited, Save & Access, Free Forever)
     - Two buttons: "Sign Up Now 🚀" and "Already have an account? Sign In"

6. **Click "Sign Up Now 🚀"**
   - ✅ Trip limit modal should **close**
   - ✅ Auth modal should **open on the same page**
   - ✅ Modal should show sign-up form (Name, Email, Password fields)

7. **Fill Sign-Up Form**
   - Name: Test User
   - Email: test@example.com (use a unique email each time)
   - Password: password123 (at least 8 characters)
   - Click "Sign Up"

8. **Verify Results**
   - ✅ Page should reload
   - ✅ User should be signed in (check header for user name/icon)
   - ✅ Dashboard should open automatically
   - ✅ **All 3 trips should be visible:**
     - Paris trip
     - Tokyo trip
     - London trip

9. **Check Console (F12 Developer Tools)**
   - Open browser console
   - Look for: `Linked 3 anonymous trips to new account`
   - Or: `New user [id] created. Linked 3 anonymous trips.`

---

### Test 2: Sign-In Flow with Anonymous Trips

**Objective**: Verify that existing users can link new anonymous trips when signing in.

#### Prerequisites:
- You must have an existing account (create one first if needed)
- Use the same account from Test 1 OR create a new one

#### Steps:

1. **Sign Out (if signed in)**
   - Click user menu → Sign Out
   - OR open a new Incognito window

2. **Generate 2 Anonymous Trips**
   - Generate Trip #1: Barcelona, 3 days
   - Generate Trip #2: Rome, 4 days
   - ✅ Both should generate successfully

3. **Try to Generate Trip #3**
   - Should hit the limit
   - ✅ Trip limit modal appears

4. **Click "Already have an account? Sign In"**
   - ✅ Trip limit modal closes
   - ✅ Auth modal opens on same page
   - ✅ Modal shows sign-in form (Email, Password fields)

5. **Sign In with Existing Account**
   - Email: test@example.com (or your existing account)
   - Password: password123
   - Click "Sign In"

6. **Verify Results**
   - ✅ Page should reload
   - ✅ User should be signed in
   - ✅ Dashboard should show:
     - Old trips (Paris, Tokyo, London from Test 1)
     - **New trips (Barcelona, Rome) should now appear!**

7. **Check Console**
   - Look for: `Linked 2 anonymous trips to account`

---

### Test 3: Modal Flow (No Trip Linking)

**Objective**: Test the seamless modal experience without generating trips.

#### Steps:

1. **Visit Homepage (signed out)**
   - http://localhost:5200

2. **Open Trip Generator**
   - Fill in some details but don't generate
   - Just to see the interface

3. **Manually Trigger Auth Modal**
   - Click "Sign In" button in header
   - ✅ Auth modal should open on same page

4. **Switch Between Sign-In and Sign-Up**
   - Click "Sign Up" link at bottom of sign-in form
   - ✅ Modal should switch to sign-up form
   - Click "Already have an account? Sign In"
   - ✅ Modal should switch back to sign-in form

5. **Close Modal**
   - Click X button or click outside modal
   - ✅ Modal should close
   - ✅ Should stay on same page

---

### Test 4: Mobile Responsiveness

**Objective**: Verify modals work on mobile devices.

#### Steps:

1. **Open Chrome DevTools (F12)**
   - Click "Toggle Device Toolbar" (Ctrl+Shift+M)
   - Select "iPhone 12 Pro" or "Pixel 5"

2. **Repeat Test 1 on Mobile View**
   - Generate 3 trips
   - Trigger limit modal
   - ✅ Modal should be responsive and readable
   - Sign up
   - ✅ Auth modal should work properly on mobile

3. **Test Different Devices**
   - iPhone SE (small screen)
   - iPad (tablet)
   - Galaxy S21 (Android)

---

## 🐛 Common Issues & Solutions

### Issue 1: Trips Not Appearing After Sign-Up
**Symptom**: Dashboard is empty after signing up

**Check**:
1. Open browser console (F12)
2. Look for errors in Network tab
3. Check if linking endpoint was called
4. Verify IP address is being captured

**Solution**:
- Check if migrations ran: `npx drizzle-kit push`
- Verify `ipAddress` column exists in trips table
- Check server logs for linking errors

### Issue 2: Modal Doesn't Open
**Symptom**: Clicking "Sign Up" navigates to different page

**Solution**:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Verify TripGeneratorWizard.tsx changes are applied

### Issue 3: Authentication Fails
**Symptom**: Sign up/sign in shows error

**Check**:
- Database connection (check .env DATABASE_URL)
- NextAuth configuration (check NEXTAUTH_SECRET)

**Solution**:
- Restart development server
- Check database is accessible
- Verify credentials are correct

---

## 📊 What to Check

### In Browser Console (F12):
```
✅ Should see: "Linked X anonymous trips to new account"
✅ Should see: "New user [id] created. Linked X trips"
❌ Should NOT see: Database errors, module not found errors
```

### In Server Terminal:
```
✅ Should see: "New user abc-123 created. Linked 3 anonymous trips."
✅ Should see: "Linked 2 trips to user abc-123"
❌ Should NOT see: Error linking anonymous trips
```

### In Database:
```sql
-- Check if trips have userId after linking
SELECT id, user_id, ip_address, destination 
FROM trips 
WHERE user_id = 'your-user-id';

-- Should show:
-- - userId is populated
-- - ipAddress is NULL (cleared after linking)
```

---

## ✅ Success Criteria

### Must Pass:
- [ ] Trip limit modal appears after 3 anonymous trips
- [ ] Clicking "Sign Up" opens auth modal on same page (no redirect)
- [ ] Clicking "Sign In" opens auth modal on same page (no redirect)
- [ ] After sign-up, all 3 anonymous trips appear in dashboard
- [ ] After sign-in, new anonymous trips are added to existing trips
- [ ] Page refreshes after authentication
- [ ] Console shows "Linked X trips" message
- [ ] No TypeScript or runtime errors

### Should Pass:
- [ ] Modals are responsive on mobile devices
- [ ] Can switch between sign-in and sign-up in modal
- [ ] Modal close button works
- [ ] Clicking outside modal closes it
- [ ] Loading states show during authentication
- [ ] Error messages display clearly

---

## 📝 Notes for Testing

### Using Different Emails:
For testing sign-up multiple times, use email aliases:
- test+1@example.com
- test+2@example.com
- test+paris@example.com

### Clearing Test Data:
To start fresh, either:
1. Use Incognito mode (easiest)
2. Clear browser cookies
3. Or manually delete test users from database

### Best Practices:
- Test in Incognito to avoid auth conflicts
- Check both browser console AND server terminal
- Take screenshots of successful flows
- Note any errors or unexpected behavior

---

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ Mark feature as complete
2. 📝 Document any edge cases found
3. 🎨 Consider UX improvements (toast notifications, etc.)
4. 🚀 Ready for staging/production deployment

If tests fail:
1. 🐛 Note exactly which step failed
2. 📋 Copy error messages from console
3. 🔍 Check server logs
4. 💬 Report issues for debugging

---

**Happy Testing! 🎉**

*Current Server: http://localhost:5200*
*Server Status: ✅ Running and Ready*
