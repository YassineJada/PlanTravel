# AI Trip Planner - Quick Start Guide

## 🚀 Quick Installation (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
```bash
# Copy the example file
cp .env.example .env

# Edit with your favorite editor
# You need to fill in:
# - DATABASE_URL (from Render or Neon)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - GROQ_API_KEY (from console.groq.com)
```

### Step 3: Setup Database
```bash
# Push schema to database
npm run db:push

# Or manually run the SQL file
psql "your-database-url" < database-schema.sql
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🆓 Get Free API Keys

### 1. Groq API Key (Required)
1. Go to https://console.groq.com
2. Sign up (free)
3. Create API key
4. Copy key (starts with `gsk_`)
5. Add to `.env` as `GROQ_API_KEY`

### 2. Database (Required)
**Option A: Render (Recommended)**
1. Go to https://render.com
2. Sign up
3. Create PostgreSQL database (FREE tier)
4. Copy "External Database URL"
5. Add to `.env` as `DATABASE_URL`

**Option B: Neon**
1. Go to https://neon.tech
2. Sign up
3. Create project
4. Copy connection string
5. Add to `.env` as `DATABASE_URL`

### 3. Google OAuth (Optional)
1. Go to https://console.cloud.google.com
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret
7. Add to `.env`

---

## 📝 Environment Variables Checklist

```env
# Required
✅ DATABASE_URL=postgresql://...
✅ NEXTAUTH_SECRET=your-secret
✅ NEXTAUTH_URL=http://localhost:3000
✅ GROQ_API_KEY=gsk_...
✅ NEXT_PUBLIC_APP_URL=http://localhost:3000
✅ NEXT_PUBLIC_MAX_ANONYMOUS_TRIPS=3

# Optional
⭕ GOOGLE_CLIENT_ID=...
⭕ GOOGLE_CLIENT_SECRET=...
```

---

## 🧪 Test the Application

### 1. Test Anonymous User Flow
- Visit homepage
- Fill in trip details
- Generate first trip ✅
- Generate second trip ✅
- Generate third trip ✅
- Try fourth trip ❌ (should prompt signup)

### 2. Test Registered User Flow
- Click "Sign Up"
- Create account
- Generate unlimited trips ✅
- View dashboard
- Delete a trip

### 3. Test Languages
- Switch to French
- Switch to Arabic (check RTL)
- Switch back to English

### 4. Test Features
- Copy itinerary to clipboard
- Export as file
- Generate different budget levels
- Try different travel types
- Test various activities

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Test connection
psql "your-database-url"

# If fails, verify:
# 1. URL is correct
# 2. Database is running
# 3. Network allows connections
```

### Groq API Errors
```bash
# Test API key
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# Should return JSON with models
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
# The errors shown are expected before npm install
# They will disappear after installing dependencies
npm install
```

---

## 📦 Scripts Available

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run db:generate # Generate database migrations
npm run db:push     # Push schema to database
npm run db:studio   # Open Drizzle Studio (database GUI)
```

---

## 🌐 Deployment Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Database schema applied
- [ ] Test all features locally
- [ ] Update NEXTAUTH_URL to production URL
- [ ] Update NEXT_PUBLIC_APP_URL to production URL
- [ ] Test on mobile devices
- [ ] Test all three languages
- [ ] Verify SEO metadata
- [ ] Test Google OAuth (if enabled)
- [ ] Create first admin user

---

## 📚 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── db/              # Database schema & connection
├── lib/             # Utilities and configurations
├── locales/         # Translation files
└── types/           # TypeScript type definitions
```

---

## 🎯 Key Files to Understand

1. **src/app/[locale]/page.tsx** - Landing page
2. **src/components/TripGenerator.tsx** - Main form
3. **src/lib/ai.ts** - AI integration
4. **src/lib/usage.ts** - Usage tracking
5. **src/db/schema.ts** - Database schema
6. **src/app/api/trips/generate/route.ts** - Trip generation API

---

## 💡 Tips

### For Development
- Use `npm run db:studio` to view database in GUI
- Check browser console for client-side errors
- Check terminal for server-side errors
- Use React DevTools for component debugging

### For Production
- Monitor Vercel logs for errors
- Check Render database metrics
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor Groq API usage

### For Customization
- Edit `tailwind.config.js` for theme colors
- Edit `src/locales/*.json` for translations
- Edit `src/lib/ai.ts` for AI prompt tuning
- Edit `src/components/` for UI changes

---

## 🔒 Security Notes

- Never commit `.env` file
- Use strong NEXTAUTH_SECRET
- Keep API keys secret
- Use HTTPS in production
- Enable CORS properly
- Validate all user input (already done)
- Rate limit API endpoints (already done)

---

## 📈 Performance Optimization

Already implemented:
- ✅ Static page generation where possible
- ✅ Optimized images
- ✅ Code splitting
- ✅ CSS minification
- ✅ Database indexes

Optional improvements:
- Add Redis caching
- Enable CDN for static assets
- Add image optimization service
- Implement service worker for offline support

---

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation
- Add more translations

---

## 📄 License

MIT License - Use freely for personal or commercial projects

---

## 🎉 You're Ready!

Everything is set up and ready to go. Run `npm install` and `npm run dev` to get started!

Need help? Check:
- README.md - Main documentation
- DEPLOYMENT.md - Deployment guide
- PROJECT-COMPLETE.md - Feature overview
- Code comments - Inline documentation

**Happy coding! ✈️🌍**
