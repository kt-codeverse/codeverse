import Filter from '@/components/search/Filter';
import RoomCard from '@/components/room/RoomCard';
import { Room } from '@/types/room';
import { getBaseUrl } from '@/lib/getBaseUrl';

async function getRooms(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    console.error('Failed to get base API URL.');
    return [];
  }

  const url = new URL(`${baseUrl}/rooms`);
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value == null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, value);
    }
  });
  url.search = params.toString();
  console.log({ url });

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rooms: Room[] = await getRooms(params);

  return (
    <main>
      <section>
        <h1 className="text-2xl font-semibold mb-4">검색 결과</h1>
        <Filter
          destination={(params.destination as string) ?? ''}
          checkIn={(params.startDate as string) ?? ''}
          checkOut={(params.endDate as string) ?? ''}
          guests={(params.guests as string) ?? ''}
        />
        <ul
          className="grid 
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </ul>
      </section>
    </main>
  );
}
