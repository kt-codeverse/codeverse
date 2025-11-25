async function getRoomDetail(id: string) {
  try {
    const url = `${process.env.API_URL}/rooms/${id}`;
    console.log({ url });
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch room detail');
    return res.json();
  } catch (e) {
    console.error('Failed to fetch rooms', e);
    return [];
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
        {/* 상세 컴포넌트 */}
        {/* <RoomDetail /> */}
      </section>
    </main>
  );
}
