# AI Trip Planner 🌍✈️

A complete, production-ready multilingual AI-powered web application that generates detailed travel itineraries based on user preferences.

## 🚀 Features

### Core Functionality
- **AI-Powered Itinerary Generation**: Uses Groq API to generate detailed day-by-day travel plans
- **Multilingual Support**: Full support for English, French, and Arabic (with RTL)
- **Usage Tracking**: Anonymous users get 3 free trips, unlimited for registered users
- **User Authentication**: Email/password and Google OAuth
- **Trip Management**: Save, view, and delete trips
- **Admin Dashboard**: Statistics and user management

### Technical Features
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- PostgreSQL database with Drizzle ORM
- NextAuth.js for authentication
- SEO optimized
- Mobile responsive
- AdSense ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (Render, Neon, or local)
- Groq API key (free from https://console.groq.com)
- Google OAuth credentials (optional)

## 🛠️ Installation

### 1. Clone and Install

```bash
cd PlanYourNextTravel
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database (PostgreSQL from Render or Neon)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# NextAuth
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Groq API
GROQ_API_KEY=your-groq-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_ANONYMOUS_TRIPS=3
```

### 3. Database Setup

```bash
# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🗄️ Database Schema

### Users Table
- id (UUID)
- email (unique)
- password (hashed)
- name
- isAdmin (boolean)
- createdAt, updatedAt

### Trips Table
- id (UUID)
- userId (nullable - for anonymous trips)
- destination
- startDate, endDate
- budget (low/medium/high)
- travelType (solo/couple/friends/family)
- activities (array)
- language (en/fr/ar)
- itinerary (JSON)
- createdAt

### Usage Tracking Table
- id (UUID)
- ipAddress (unique)
- tripsGenerated (count)
- lastUsedAt

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Trips
- `POST /api/trips/generate` - Generate new trip itinerary
- `GET /api/trips` - Get user's trips
- `GET /api/trips/[id]` - Get specific trip
- `DELETE /api/trips/[id]` - Delete trip

### Admin
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/users` - Get all users

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database (Render - Free)

1. Sign up at https://render.com
2. Create new PostgreSQL database
3. Copy connection string
4. Add to `DATABASE_URL` in Vercel

### Get Groq API Key (Free)

1. Sign up at https://console.groq.com
2. Create new API key
3. Add to `GROQ_API_KEY`

## 📱 Pages Structure

```
/                           - Landing page with generator
/[locale]/auth/signin       - Sign in page
/[locale]/auth/signup       - Sign up page
/[locale]/dashboard         - User dashboard (saved trips)
/[locale]/trip/[id]         - Trip result page
/[locale]/admin             - Admin dashboard
/[locale]/blog              - Blog listing
/[locale]/blog/[slug]       - Blog post
/[locale]/about             - About page
/[locale]/contact           - Contact page
/[locale]/privacy           - Privacy policy
/[locale]/terms             - Terms of service
```

## 🔧 Development

### Project Structure

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Home page
│   │   ├── auth/          # Auth pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── trip/          # Trip result
│   │   ├── admin/         # Admin dashboard
│   │   └── blog/          # Blog pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── db/                    # Database schema & config
├── lib/                   # Utilities
│   ├── auth.ts           # Auth configuration
│   ├── ai.ts             # AI generation logic
│   ├── usage.ts          # Usage tracking
│   └── utils.ts          # Helper functions
├── locales/              # Translation files
│   ├── en.json           # English
│   ├── fr.json           # French
│   └── ar.json           # Arabic
├── types/                # TypeScript types
└── middleware.ts         # Next.js middleware
```

### Adding Translations

Edit files in `src/locales/`:
- `en.json` - English
- `fr.json` - French  
- `ar.json` - Arabic

### Database Migrations

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

## 🔒 Security

- Passwords hashed with bcrypt
- JWT sessions with NextAuth
- CSRF protection enabled
- Rate limiting on API routes
- IP-based anonymous tracking
- SQL injection prevention with Drizzle ORM

## 📊 Admin Features

Create an admin user by updating the database:

```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

Admin can:
- View total users and trips
- Export user list
- View API usage statistics
- Generate trips as any user

## 🎨 Customization

### Branding
Edit in `src/components/Header.tsx` and `src/components/Footer.tsx`

### Styling
Modify `tailwind.config.js` and `src/app/globals.css`

### AI Prompts
Edit `src/lib/ai.ts` to customize itinerary generation

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is accessible
- Run `npm run db:push` to sync schema

### Groq API Errors
- Verify API key is valid
- Check rate limits
- Ensure API key has correct permissions

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📞 Support

For issues or questions, open a GitHub issue.

## 🙏 Credits

- Built with Next.js, TypeScript, and Tailwind CSS
- AI powered by Groq
- Icons from React Icons
- Fonts from Google Fonts

---

**Ready to deploy!** This is a complete, production-ready application. 🚀
