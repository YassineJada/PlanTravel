# Deployment Guide - AI Trip Planner

## Quick Deployment Checklist ✅

### 1. Database Setup (Render - FREE)

1. Go to https://render.com and sign up
2. Click "New +" → "PostgreSQL"
3. Choose:
   - Name: `aitripplanner-db`
   - Database: `aitripplanner`
   - User: `aitripplanner`
   - Region: Choose closest to you
   - Plan: **FREE**
4. Click "Create Database"
5. Wait 2-3 minutes for provisioning
6. Copy the "External Database URL" (starts with `postgresql://`)
7. Run the schema:
   ```bash
   # Use the database URL from Render
   psql "your-database-url" < database-schema.sql
   ```

### 2. Get Groq API Key (FREE)

1. Go to https://console.groq.com
2. Sign up or login
3. Click "Create API Key"
4. Name it "AI Trip Planner"
5. Copy the key (starts with `gsk_`)

### 3. Generate NextAuth Secret

Run in terminal:
```bash
openssl rand -base64 32
```
Copy the output

### 4. Deploy to Vercel

#### A. Push to GitHub

```bash
cd PlanYourNextTravel
git init
git add .
git commit -m "Initial commit - AI Trip Planner"
git branch -M main
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-trip-planner.git
git push -u origin main
```

#### B. Deploy on Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:

```env
DATABASE_URL=postgresql://... (from Render)
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-app.vercel.app
GROQ_API_KEY=gsk_... (from Groq)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_MAX_ANONYMOUS_TRIPS=3
```

6. Click "Deploy"
7. Wait 3-5 minutes

### 5. Post-Deployment Setup

1. Visit your deployed URL
2. Sign up for an account
3. To make yourself admin:
   ```sql
   -- Connect to your Render database
   UPDATE users SET is_admin = true WHERE email = 'your@email.com';
   ```

## Alternative: Neon Database (Also FREE)

If you prefer Neon over Render:

1. Go to https://neon.tech
2. Sign up
3. Create new project
4. Copy connection string
5. Use it as DATABASE_URL

## Google OAuth (Optional)

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Copy Client ID and Secret
7. Add to Vercel environment variables:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql "your-database-url"

# If fails, check:
# 1. URL is correct
# 2. Database is active on Render
# 3. No firewall blocking
```

### Build Errors on Vercel

```bash
# Test build locally first
npm install
npm run build

# If succeeds locally but fails on Vercel:
# 1. Check environment variables are set
# 2. Look at Vercel build logs
# 3. Ensure all dependencies are in package.json
```

### Groq API Errors

```bash
# Test API key
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# Should return list of models
```

## Performance Optimization

### 1. Add Database Indexes (Already in schema.sql)

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_created_at ON trips(created_at);
```

### 2. Enable Vercel Analytics

In Vercel dashboard:
- Go to your project
- Click "Analytics"
- Enable Web Analytics (free)

### 3. Add Caching Headers

Already configured in `next.config.js`

## Monitoring

### Check Application Health

- Visit: `https://your-app.vercel.app`
- Generate a test trip
- Check dashboard works
- Try admin panel (if admin)

### Monitor Database

Render Dashboard:
- Go to your database
- Check "Metrics" tab
- Monitor connections, queries

### View Logs

Vercel:
- Go to project
- Click "Deployments"
- Click latest deployment
- View "Runtime Logs"

## Custom Domain (Optional)

### 1. In Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your domain: `aitripplanner.com`
4. Follow DNS instructions

### 2. Update Environment Variables

```env
NEXTAUTH_URL=https://aitripplanner.com
NEXT_PUBLIC_APP_URL=https://aitripplanner.com
```

## Backup Strategy

### Database Backups (Render)

Render automatically backs up your database daily (free tier)

### Manual Backup

```bash
# Export database
pg_dump "your-database-url" > backup.sql

# Restore
psql "your-database-url" < backup.sql
```

## Scaling

### When you need to scale:

1. **Database**: Upgrade Render plan ($7/month for 1GB)
2. **API**: Groq has generous free tier
3. **Hosting**: Vercel Pro ($20/month) for more bandwidth

## Security Checklist

- [x] Environment variables not in code
- [x] Passwords hashed with bcrypt
- [x] Rate limiting on API routes
- [x] CSRF protection (NextAuth)
- [x] SQL injection prevention (Drizzle ORM)
- [x] XSS protection (React)

## Launch Checklist

Before going live:

- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Test all three languages
- [ ] Verify email/password signup works
- [ ] Test Google OAuth (if enabled)
- [ ] Generate sample trips
- [ ] Check admin dashboard
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] Set up error monitoring
- [ ] Test anonymous trip limits
- [ ] Verify database backups working

## Support

If you encounter issues:

1. Check Vercel logs
2. Check Render database status
3. Verify all environment variables
4. Test Groq API key
5. Check GitHub Issues

## Cost Summary (Monthly)

- Database (Render): **$0**
- Hosting (Vercel): **$0**
- Groq API: **$0** (generous free tier)
- Domain (optional): ~$12/year

**Total: $0** ✨

---

**🎉 You're ready to deploy!**
