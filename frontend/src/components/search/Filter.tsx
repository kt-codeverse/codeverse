'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import FilterDatePicker from '../filter/FilterDatePicker';
import FilterGuests from './FilterGuests';
import FilterAmenities from './FilterAmenities';
import FilterDestination from './FilterDestination';

export default function Filter({
  destination,
  checkIn,
  checkOut,
  guests,
}: {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateRangeChange = (dates: [string, string]) => {
    const [start, end] = dates;
    const newParams = new URLSearchParams(searchParams.toString());

    if (start && end) {
      newParams.set('startDate', start);
      newParams.set('endDate', end);
    }
    router.push(`/search?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <FilterDestination initialDestination={destination} />
      <FilterDatePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onRangeChange={handleDateRangeChange}
      />
      <FilterGuests maxGuests={guests} />
      <FilterAmenities />
    </div>
  );
}
