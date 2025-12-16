import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { trips, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${params.locale}/auth/signin`);
  }

  // Check if user is admin
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  const userTrips = await db.query.trips.findMany({
    where: eq(trips.userId, session.user.id),
    orderBy: [desc(trips.createdAt)],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardContent 
            trips={userTrips} 
            locale={params.locale} 
            userName={session.user.name || session.user.email}
            isAdmin={user?.isAdmin || false}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
