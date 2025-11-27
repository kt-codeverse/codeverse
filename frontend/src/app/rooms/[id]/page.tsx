import RoomDetail from '@/components/room/RoomDetail';

async function getRoomDetail(id: string) {
  try {
    const url = `${process.env.API_URL}/rooms/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch room detail');
    return res.json();
  } catch (e) {
    console.error('Failed to fetch rooms', e);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoomDetail(id);
  console.log({ room });

  return (
    <main>
      <section>
        <RoomDetail room={room} />
      </section>
    </main>
  );
}
