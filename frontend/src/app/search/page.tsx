import Filter from '@/components/search/Filter';
import AccommodationList from '@/components/room/AccommodationList';
import type { Accommodation } from '@/components/room/AccommodationCard';

async function getAccommodations(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<Accommodation[]> {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    console.error('환경 변수 API_URL이 설정되지 않았습니다.');
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
    if (!res.ok) throw new Error('Failed to fetch accommodations');
    return res.json();
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return [];
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const accommodations: Accommodation[] = await getAccommodations(params);

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
        <AccommodationList accommodations={accommodations} />
      </section>
    </main>
  );
}
