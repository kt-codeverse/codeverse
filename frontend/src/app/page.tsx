import { RoomCard } from '@/components/room/RoomCard';
import type { Room } from '@/types/room';

/**
 * 서버에서 숙소 목록 데이터를 가져옵니다.
 * 실제 애플리케이션에서는 API 엔드포인트에서 데이터를 가져와야 합니다.
 * @returns Promise<Room[]> 숙소 목록
 */
async function getRooms() {
  const url = `${process.env.API_URL}/rooms`;
  console.log({ url });
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export default async function Page() {
  const rooms: Room[] = await getRooms();
  console.log({ rooms });

  return (
    <main>
      <section
        className="grid 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
        gap-x-5 gap-y-10 
        sm:px-4 lg:px-4
        "
      >
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </section>
    </main>
  );
}
