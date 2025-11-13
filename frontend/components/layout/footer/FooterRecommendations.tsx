'use client';

import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FooterRecommendations() {
  const destinations = [
    { name: '포틀랜드', type: '독채 숙소', href: '/portland-me/stays/houses' },
    {
      name: '로스앤젤레스',
      type: '아파트 숙소',
      href: '/los-angeles-ca/stays/apartments',
    },
    {
      name: '브레켄리지',
      type: '장기 숙소',
      href: '/breckenridge-co/stays/monthly',
    },
    { name: '마이애미', type: '휴가지 숙소', href: '/miami-fl/stays' },
    {
      name: '카일루아코나',
      type: '아파트 숙소',
      href: '/kailua-kona-hi/stays/apartments',
    },
    { name: '방콕', type: '휴가지 숙소', href: '/bangkok-thailand/stays' },
    {
      name: '루이스빌',
      type: '장기 숙소',
      href: '/louisville-ky/stays/monthly',
    },
    { name: '휴스턴', type: '통나무집 숙소', href: '/houston-tx/stays/cabins' },
  ];

  return (
    <section className="w-full py-10">
      <h2 className="text-2xl font-semibold mb-6 text-left">
        다음 여행을 위한 추천 여행지
      </h2>

      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="popular">인기</TabsTrigger>
          <TabsTrigger value="arts-culture">예술 및 문화</TabsTrigger>
        </TabsList>

        <TabsContent value="popular">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {destinations.map((d) => (
              <li key={d.href}>
                <Link
                  href="#"
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-medium text-gray-800">{d.name}</span>{' '}
                  <span className="text-gray-600">{d.type}</span>
                </Link>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="arts-culture">
          {/* 예술 및 문화 탭 콘텐츠 */}
        </TabsContent>
      </Tabs>
    </section>
  );
}
