'use client';

import AccommodationCard from '@/components/room/AccommodationCard';
import { Accommodation } from '@/components/room/AccommodationCard';

export default function AccommodationList({
  accommodations,
}: {
  accommodations: Accommodation[];
}) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {accommodations.map((acc) => (
        <AccommodationCard key={acc.id} accommodation={acc} />
      ))}
    </ul>
  );
}
