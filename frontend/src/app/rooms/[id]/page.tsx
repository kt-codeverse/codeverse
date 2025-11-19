'use client';
import BookCard from '@/src/components/room/BookCard';
import RoomHeader from '@/src/components/room/RoomHeader';
import RoomImages from '@/src/components/room/RoomImages';
import RoomInfo from '@/src/components/room/RoomInfo';

export default function RoomPage() {
  // 임시 데이터
  const roomData = {
    id: '1',
    title:
      'Modern Stay | Winter Seoul Mood | 명동·동대문·경복궁·종로 접근 편리',
    description: '한국의 집 전체',
    explanation: `Located near Seoul’s top attractions like Myeongdong, Hongdae, Gyeongbokgung, Seongsu (the Brooklyn of Seoul), and the lively Jongno 3-ga Night Market.

안녕하세요! 호스트 Yong입니다. 😊
용하우스 1호는 한 층 전체를 단독으로 사용하는 조용하고 프라이빗한 숙소입니다.

성신여대입구역 2분 거리,
명동과 경복궁에 가깝지만 서울의 로컬 분위기를 느낄 수 있는 동네에 있습니다.

직접 관리로 항상 깨끗하게 유지하며, 리뷰에서도 청결이 가장 높은 평가를 받았습니다.
안전하고 편안한 숙소를 준비했습니다.

서울의 로컬 일상을 느끼며 머물러보세요. 🌿
숙소
✅ 4호선 성신여대입구역 도보 2분, 완벽한 교통 접근성

동대문디자인플라자(DDP): 지하철로 10분

명동 / 남산타워: 지하철로 15~20분

경복궁 / 광화문: 버스 또는 지하철로 20~25분

홍대: 지하철 환승 30~35분

인천공항: 공항철도 + 환승 약 1시간 20분

김포공항: 공항철도 + 환승 약 50분

✅ 서울 어디든 편리한 중심 입지

성신여대입구역 1번 출구 도보 2분

명동, 경복궁 등 주요 명소와 가깝지만 조용한 주거 지역

✅ 주변 하이라이트

편의시설: 다이소(3분), 올리브영(1분), 스타벅스(옆 건물)

현지 분위기: 카페, 베이커리, 한식당이 모여 있는 로컬 거리

돈암시장(도보 5분): 떡볶이, 호떡, 순대 등 서울식 길거리 음식

산책 코스: 성북천(5분) / 북한산 정릉 탐방센터(15분)

✅ 숙소 구성 및 편의시설

퀸사이즈 침대 2개

에어컨(냉방) / 온돌 바닥난방

주방: 전자레인지, 전기포트, 조리도구, 냉장고

욕실: 샴푸, 트리트먼트, 바디워시, 수건 제공
(칫솔·치약은 위생상 제공되지 않습니다)

기타: Wi-Fi, TV(OTT 시청 가능), 세탁기, 건조기 완비

✅ 체크인 / 체크아웃

체크인: 오후 3시 이후

체크아웃: 오전 11시 (시간 연장 시 추가 요금 발생)

✅ 이용 안내

실내 금연 (흡연 시 퇴실 및 청소비 부과)

소음 자제 (이웃 민원 시 퇴실 조치 가능)

분리배출 필수 (객실 내 안내문 참고)

반려동물 불가

냄새가 강한 요리(튀김, 장류 등) 제한

✅ 로컬 감성 & 편안한 숙소
청결을 가장 중요하게 생각하며 항상 직접 관리하고 있습니다.
서울의 중심에 있으면서도 조용하고 안전한 숙소에서
현지의 일상과 여유를 함께 느껴보세요. 🌿

✅ 합법 등록 숙소 안내
본 숙소는 미스터멘션 실증특례 제도에 따라 정식 등록된 합법 숙소입니다.
국내외 게스트 모두 안심하고 이용하실 수 있습니다. 🙏`,
  };

  const images = [
    'https://res.cloudinary.com/dgvgxnwos/image/upload/v1763134157/3f6a77c9-d87f-41be-9f51-96ca892d19db_wq8nod.avif',
    'https://res.cloudinary.com/dgvgxnwos/image/upload/v1763134521/00e2b2db-f89c-485d-9450-cf71d7f4aa43_oqjxdp.avif',
    'https://res.cloudinary.com/dgvgxnwos/image/upload/v1763134521/3f2ef16c-c99c-4377-99f9-dbbb06a23d91_vry34b.avif',
    'https://res.cloudinary.com/dgvgxnwos/image/upload/v1763134521/7af1b43e-74d7-4436-b3a5-ca9ca186e116_pcxt3y.avif',
    'https://res.cloudinary.com/dgvgxnwos/image/upload/v1763134520/c4350a2e-bd5b-4487-8484-afb3887a60c7_egje2a.avif',
  ];
  const amenities = [
    '성신여대입구역 근처',
    '셀프체크인',
    '여행 가방 보관 가능',
    '무료 주차 공간',
    '세탁기 및 건조기',
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-[1120px] mx-auto px-6 py-6">
          <div className="mb-6">
            <RoomHeader title={roomData.title} />
          </div>

          {/* 사진 */}
          <RoomImages images={images} />

          {/* 이미지 하단 정보 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            <div className="lg:col-span-2">
              <RoomInfo
                description={roomData.description}
                explanation={roomData.explanation}
                amenities={amenities}
              />

              {/* <div className="p-4">
                <RoomDescription fullText={roomData.explanation} />
              </div> */}
            </div>
            {/* 오른쪽 예약 카드 */}
            <div className="lg:col-span-1">
              <BookCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
