import { RoomCard } from '@/components/room/RoomCard';
import type { Room } from '@/types/room';

/**
 * 서버에서 숙소 목록 데이터를 가져옵니다.
 * 실제 애플리케이션에서는 API 엔드포인트에서 데이터를 가져와야 합니다.
 * @returns Promise<Room[]> 숙소 목록
 */
async function getRooms(): Promise<Room[]> {
  // TODO: 실제 API 엔드포인트로 교체하세요. (예: 'http://localhost:4000/api/rooms')
  // const res = await fetch('YOUR_API_ENDPOINT/rooms', { cache: 'no-store' });
  // if (!res.ok) {
  //   throw new Error('Failed to fetch data');
  // }
  // return res.json();

  // 임시 목업 데이터 사용
  const mockRoom: Room = {
    id: '0905fee5-f4ed-4f95-ba4a-5bed05214f31',
    title: '제주 애월읍 감성 카페거리 숙소',
    description:
      '애월읍 카페거리와 가까워 젊은 감성을 느낄 수 있는 숙소입니다.',
    country: 'South Korea',
    city: 'Jeju',
    rules: null,
    lat: 33.47417077959098,
    lng: 126.367563965354,
    pricePerNight: 160,
    createdAt: '2025-11-18T05:28:53.987Z',
    updatedAt: '2025-11-18T05:28:53.987Z',
    hostId: '0f94074b-7de9-4029-b9c9-166ef704f3b8',
    images: [
      {
        id: '1b18435b-9ae0-49c2-a822-a0ff8dc6f5c6',
        url: 'https://res.cloudinary.com/dqvnc7aht/image/upload/v1763090062/06100321-721c-4675-ad16-822e32884348_xe99o0.jpg',
        createdAt: '2025-11-18T05:28:53.987Z',
        roomId: '0905fee5-f4ed-4f95-ba4a-5bed05214f31',
      },
      {
        id: '259b9344-a3ca-4a2d-b25c-568a3bc81294',
        url: 'https://res.cloudinary.com/dqvnc7aht/image/upload/v1763090255/d92a4734-6657-4dbc-a5a2-09921d1d6e33_tdcacj.jpg',
        createdAt: '2025-11-18T05:28:53.987Z',
        roomId: '0905fee5-f4ed-4f95-ba4a-5bed05214f31',
      },
      {
        id: '935ab0d5-5b20-4ff1-8e0c-069f303b31c7',
        url: 'https://res.cloudinary.com/dqvnc7aht/image/upload/v1763090147/04cabc9e-18f8-4bee-a989-b11079f0de52_ozb7hq.jpg',
        createdAt: '2025-11-18T05:28:53.987Z',
        roomId: '0905fee5-f4ed-4f95-ba4a-5bed05214f31',
      },
    ],
    amenities: [
      {
        id: 'f3fff2d2-0ff4-4091-bd8d-50f611d2f5cb',
        name: 'WiFi',
        createdAt: '2025-11-18T05:28:53.919Z',
      },
    ],
  };
  return Array(8)
    .fill(mockRoom)
    .map((room, index) => ({ ...room, id: `${room.id}-${index}` }));
}

export default async function Page() {
  const rooms = await getRooms();
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </section>
    </main>
  );
}
