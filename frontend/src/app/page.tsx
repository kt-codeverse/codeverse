import type { Room } from '@/types/room';
import RoomCard from '@/components/room/RoomCard';

async function getRooms() {
  try {
    const url = `${process.env.API_URL}/rooms`;
    // console.log({ url });
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch rooms');
    return res.json();
  } catch (e) {
    console.error('Failed to fetch rooms', e);
    return [];
  }
}

export default async function Page() {
  const rooms: Room[] = await getRooms();
  console.log({ rooms });

  return (
    <main>
      <section>
        <ul
          className="grid
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
          gap-x-5 gap-y-10
          sm:px-4 lg:px-4
          pt-10
          "
        >
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </ul>
      </section>
    </main>
  );
}
