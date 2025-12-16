import { notFound } from 'next/navigation';
import { db } from '@/db';
import { trips } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TripDisplay from '@/components/TripDisplay';

export default async function TripPage({ params }: { params: { id: string; locale: string } }) {
  const trip = await db.query.trips.findFirst({
    where: eq(trips.id, params.id),
  });

  if (!trip) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TripDisplay trip={trip} locale={params.locale} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
