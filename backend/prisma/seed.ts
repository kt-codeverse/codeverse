import {
  PrismaClient,
  Role,
  User,
  Room,
  Booking,
  Amenity,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { roomImages } from './room-images';

const prisma = new PrismaClient();

/**
 * 데이터베이스의 모든 데이터를 삭제합니다.
 */
async function clearDatabase() {
  console.log('--- 기존 데이터 삭제 시작 ---');
  await prisma.message.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.image.deleteMany(); // Image 데이터 삭제 추가
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  await prisma.amenity.deleteMany(); // Amenity 데이터 삭제 추가
  console.log('기존 데이터 삭제 완료.\n');
}

/**
 * 사용자 시드 데이터를 생성합니다.
 */
async function seedUsers(): Promise<User[]> {
  console.log('--- 사용자 데이터 생성 시작 ---');
  const usersData = [
    // Hosts
    { name: '김민준', email: 'host1@example.com', role: Role.HOST },
    { name: '이서연', email: 'host2@example.com', role: Role.HOST },
    { name: '박도윤', email: 'host3@example.com', role: Role.HOST },
    { name: '최하은', email: 'host4@example.com', role: Role.HOST },
    { name: '정시우', email: 'host5@example.com', role: Role.HOST },
    // Guests
    { name: '강지우', email: 'guest1@example.com', role: Role.GUEST },
    { name: '조서아', email: 'guest2@example.com', role: Role.GUEST },
    { name: '윤예준', email: 'guest3@example.com', role: Role.GUEST },
    { name: '장하윤', email: 'guest4@example.com', role: Role.GUEST },
    { name: '임주원', email: 'guest5@example.com', role: Role.GUEST },
    { name: '한아린', email: 'guest6@example.com', role: Role.GUEST },
    { name: '오지호', email: 'guest7@example.com', role: Role.GUEST },
    { name: '신수아', email: 'guest8@example.com', role: Role.GUEST },
    { name: '권유준', email: 'guest9@example.com', role: Role.GUEST },
    { name: '황채원', email: 'guest10@example.com', role: Role.GUEST },
  ];

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('password123', saltRounds);

  const usersToCreate = usersData.map((user) => ({
    ...user,
    password: hashedPassword,
    verified: true,
    hashedRefreshToken: null, // hashedRefreshToken 필드를 null로 명시적으로 초기화
  }));

  const createdUsers = await Promise.all(
    usersToCreate.map((u) => prisma.user.create({ data: u })),
  );
  console.log(`사용자 ${createdUsers.length}명 생성 완료.\n`);
  return createdUsers;
}

/**
 * 편의시설 시드 데이터를 생성합니다.
 */
async function seedAmenities(): Promise<Amenity[]> {
  console.log('--- 편의시설 데이터 생성 시작 ---');
  const amenitiesData = [
    { name: 'WiFi' },
    { name: 'Kitchen' },
    { name: 'Air conditioning' },
    { name: 'Pool' },
    { name: 'Free parking' },
    { name: 'Garden' },
    { name: 'TV' },
    { name: 'Washer' },
  ];
  await prisma.amenity.createMany({
    data: amenitiesData,
    skipDuplicates: true,
  });
  const createdAmenities = await prisma.amenity.findMany();
  console.log(`편의시설 ${createdAmenities.length}개 생성 완료.\n`);
  return createdAmenities;
}

// Helper function to parse seed-images.md
interface RoomImagesMap {
  [roomIdentifier: string]: string[];
}

/**
 * 숙소 시드 데이터를 생성합니다.
 * @param hosts - 호스트 역할을 가진 사용자 배열
 */
async function seedRooms(
  hosts: User[],
  parsedRoomImages: RoomImagesMap,
): Promise<Room[]> {
  console.log('--- 숙소 데이터 생성 시작 ---');

  const getAmenityConnect = (names: string[]) => ({
    connect: names.map((name) => ({ name })),
  });

  const roomsToCreate = [
    {
      identifier: 'Seoul Room1',
      title: '서울역 근처 아늑한 아파트',
      description:
        '서울의 중심에서 도시의 활기를 느껴보세요. 교통이 편리하고 주변에 맛집이 많습니다.',
      structure: '아파트',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Seoul',
      pricePerNight: 120,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen', 'Air conditioning'],
      hostIndex: 0,
      lat: 37.555 + Math.random() * 0.05,
      lng: 126.972 + Math.random() * 0.05,
    },
    {
      identifier: 'Seoul Room2',
      title: '강남 스타일 모던 스튜디오',
      description:
        '강남의 활기찬 분위기를 만끽할 수 있는 모던한 스튜디오입니다.',
      structure: '아파트',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Seoul',
      pricePerNight: 150,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'TV', 'Pool'],
      hostIndex: 0,
      lat: 37.5 + Math.random() * 0.05,
      lng: 127.027 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room1',
      title: '오사카 도톤보리 근처 아파트',
      description:
        '오사카의 번화가 도톤보리에서 가까운 아파트입니다. 편리한 교통과 다양한 먹거리를 즐기세요.',
      structure: '아파트',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 130,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen'],
      hostIndex: 1,
      lat: 34.66 + Math.random() * 0.05,
      lng: 135.5 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room2',
      title: '오사카 유니버셜 스튜디오 근처 숙소',
      description:
        '유니버셜 스튜디오 재팬 방문에 최적화된 숙소입니다. 가족 여행에 좋습니다.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 160,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Free parking', 'TV'],
      hostIndex: 1,
      lat: 34.65 + Math.random() * 0.05,
      lng: 135.43 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room3',
      title: '오사카 난바역 도보 5분 거리',
      description:
        '난바역에서 도보 5분 거리에 위치한 편리한 숙소입니다. 쇼핑과 관광에 용이합니다.',
      structure: '아파트',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 140,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Air conditioning'],
      hostIndex: 1,
      lat: 34.66 + Math.random() * 0.05,
      lng: 135.5 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room4',
      title: '오사카 우메다 스카이빌딩 뷰 아파트',
      description:
        '우메다 스카이빌딩이 보이는 멋진 야경을 자랑하는 아파트입니다.',
      structure: '아파트',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 170,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen', 'TV'],
      hostIndex: 2,
      lat: 34.7 + Math.random() * 0.05,
      lng: 135.49 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room5',
      title: '오사카 신사이바시 쇼핑가 인접 숙소',
      description:
        '신사이바시 쇼핑가와 가까워 쇼핑을 즐기기에 최적의 위치입니다.',
      structure: '아파트',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 155,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Washer'],
      hostIndex: 2,
      lat: 34.67 + Math.random() * 0.05,
      lng: 135.5 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room6',
      title: '오사카 텐노지 동물원 근처 가족 숙소',
      description:
        '텐노지 동물원과 가까워 아이들과 함께하는 가족 여행에 좋습니다.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 145,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen', 'Garden'],
      hostIndex: 2,
      lat: 34.64 + Math.random() * 0.05,
      lng: 135.5 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room7',
      title: '오사카 교토 당일치기 여행에 좋은 숙소',
      description: '교토로의 당일치기 여행이 편리한 위치에 있습니다.',
      structure: '게스트하우스',
      privacyType: '다인실',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 135,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Air conditioning'],
      hostIndex: 3,
      lat: 34.7 + Math.random() * 0.05,
      lng: 135.5 + Math.random() * 0.05,
    },
    {
      identifier: 'Osaka Room8',
      title: '오사카 아베노 하루카스 뷰 아파트',
      description:
        '아베노 하루카스 타워가 보이는 고층 아파트에서 멋진 전망을 즐기세요.',
      structure: '아파트',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Osaka',
      pricePerNight: 180,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen', 'Pool', 'TV'],
      hostIndex: 3,
      lat: 34.64 + Math.random() * 0.05,
      lng: 135.51 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room1',
      title: '제주 돌담길 감성 숙소',
      description:
        '조용한 제주 시골 마을에서 즐기는 힐링 타임. 돌담과 귤밭이 어우러진 풍경을 제공합니다.',
      structure: '독특한 숙소',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 150,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['Kitchen', 'Free parking', 'Garden'],
      hostIndex: 2,
      lat: 33.4 + Math.random() * 0.05,
      lng: 126.55 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room2',
      title: '제주 서귀포 오션뷰 펜션',
      description:
        '서귀포 바다가 한눈에 보이는 아름다운 펜션입니다. 휴식에 최적화되어 있습니다.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 200,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Pool', 'Kitchen'],
      hostIndex: 2,
      lat: 33.25 + Math.random() * 0.05,
      lng: 126.56 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room3',
      title: '제주 동쪽 해안도로 감성 숙소',
      description:
        '제주 동쪽 해안도로를 따라 위치한 감성적인 숙소입니다. 일출을 감상하기 좋습니다.',
      structure: '주택',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 170,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Garden', 'TV'],
      hostIndex: 3,
      lat: 33.5 + Math.random() * 0.05,
      lng: 126.8 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room4',
      title: '제주 한라산 근처 독채 펜션',
      description:
        '한라산 등반 후 편안하게 쉴 수 있는 독채 펜션입니다. 자연 속에서 힐링하세요.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 190,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['Kitchen', 'Free parking', 'Air conditioning'],
      hostIndex: 3,
      lat: 33.36 + Math.random() * 0.05,
      lng: 126.53 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room5',
      title: '제주 애월읍 감성 카페거리 숙소',
      description:
        '애월읍 카페거리와 가까워 젊은 감성을 느낄 수 있는 숙소입니다.',
      structure: '독특한 숙소',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 160,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'TV', 'Washer'],
      hostIndex: 4,
      lat: 33.46 + Math.random() * 0.05,
      lng: 126.33 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room6',
      title: '제주 협재 해변 근처 게스트하우스',
      description:
        '협재 해변에서 도보 거리에 위치한 게스트하우스입니다. 서핑과 해수욕을 즐기세요.',
      structure: '게스트하우스',
      privacyType: '다인실',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 110,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen'],
      hostIndex: 4,
      lat: 33.39 + Math.random() * 0.05,
      lng: 126.23 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room7',
      title: '제주 성산일출봉 뷰 호텔',
      description:
        '성산일출봉이 보이는 객실에서 멋진 일출을 감상할 수 있습니다.',
      structure: '호텔',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 220,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Pool', 'Air conditioning'],
      hostIndex: 0,
      lat: 33.46 + Math.random() * 0.05,
      lng: 126.94 + Math.random() * 0.05,
    },
    {
      identifier: 'Jeju Room8',
      title: '제주 중문 관광단지 인접 리조트',
      description:
        '중문 관광단지와 가까워 다양한 관광지를 편리하게 이용할 수 있습니다.',
      structure: '호텔',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 250,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Pool', 'Free parking', 'TV'],
      hostIndex: 0,
      lat: 33.25 + Math.random() * 0.05,
      lng: 126.42 + Math.random() * 0.05,
    },
    {
      identifier: 'Gangneung Room1',
      title: '강릉 커피거리 감성 카페 2층',
      description:
        '커피향 가득한 강릉에서 특별한 하룻밤. 안목해변이 바로 앞에 있습니다.',
      structure: '독특한 숙소',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gangneung',
      pricePerNight: 130,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen'],
      hostIndex: 4,
      lat: 37.76 + Math.random() * 0.05,
      lng: 128.93 + Math.random() * 0.05,
    },
    {
      identifier: 'Gangneung Room2',
      title: '강릉 경포대 해변 근처 펜션',
      description:
        '경포대 해변에서 도보 거리에 위치한 펜션입니다. 여름 휴가에 좋습니다.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gangneung',
      pricePerNight: 160,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Free parking', 'Air conditioning'],
      hostIndex: 1,
      lat: 37.8 + Math.random() * 0.05,
      lng: 128.91 + Math.random() * 0.05,
    },
    {
      identifier: 'Gangneung Room3',
      title: '강릉 오죽헌 근처 한옥 스테이',
      description: '오죽헌과 가까운 전통 한옥에서 고즈넉한 시간을 보내세요.',
      structure: '독특한 숙소',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Gangneung',
      pricePerNight: 140,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Garden'],
      hostIndex: 1,
      lat: 37.79 + Math.random() * 0.05,
      lng: 128.87 + Math.random() * 0.05,
    },
    {
      identifier: 'Gangneung Room4',
      title: '강릉 주문진항 해산물 맛집 투어 숙소',
      description: '주문진항과 가까워 신선한 해산물을 맛볼 수 있는 숙소입니다.',
      structure: '게스트하우스',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Gangneung',
      pricePerNight: 125,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen', 'TV'],
      hostIndex: 2,
      lat: 37.88 + Math.random() * 0.05,
      lng: 128.82 + Math.random() * 0.05,
    },
    {
      identifier: 'Gangneung Room5',
      title: '강릉 정동진 일출 명소 펜션',
      description:
        '정동진 일출을 객실에서 감상할 수 있는 펜션입니다. 로맨틱한 여행에 추천합니다.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gangneung',
      pricePerNight: 180,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Pool', 'Air conditioning'],
      hostIndex: 2,
      lat: 37.68 + Math.random() * 0.05,
      lng: 129.03 + Math.random() * 0.05,
    },
    {
      identifier: 'Gangneung Room6',
      title: '강릉 사천 해변 서핑 게스트하우스',
      description: '사천 해변에서 서핑을 즐기기에 좋은 게스트하우스입니다.',
      structure: '게스트하우스',
      privacyType: '다인실',
      country: 'South Korea',
      city: 'Gangneung',
      pricePerNight: 115,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Washer'],
      hostIndex: 3,
      lat: 37.84 + Math.random() * 0.05,
      lng: 128.95 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room1',
      title: '경주 황리단길 한옥 스테이',
      description:
        '전통 한옥의 멋과 현대적인 편리함이 공존하는 공간. 황리단길 중심에 위치해 있습니다.',
      structure: '독특한 숙소',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 160,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Air conditioning'],
      hostIndex: 3,
      lat: 35.83 + Math.random() * 0.05,
      lng: 129.2 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room2',
      title: '경주 불국사 근처 조용한 펜션',
      description:
        '불국사와 석굴암 방문에 편리한 조용한 펜션입니다. 역사 탐방에 좋습니다.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 140,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Free parking', 'Garden'],
      hostIndex: 4,
      lat: 35.78 + Math.random() * 0.05,
      lng: 129.33 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room3',
      title: '경주 동궁과 월지 야경 뷰 숙소',
      description: '동궁과 월지의 아름다운 야경을 감상할 수 있는 숙소입니다.',
      structure: '아파트',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 180,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'TV', 'Kitchen'],
      hostIndex: 4,
      lat: 35.83 + Math.random() * 0.05,
      lng: 129.22 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room4',
      title: '경주 보문단지 호수 뷰 리조트',
      description:
        '보문호수의 아름다운 풍경을 즐길 수 있는 리조트입니다. 휴양에 적합합니다.',
      structure: '호텔',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 200,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Pool', 'Free parking'],
      hostIndex: 0,
      lat: 35.84 + Math.random() * 0.05,
      lng: 129.28 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room5',
      title: '경주 첨성대 근처 게스트하우스',
      description:
        '첨성대와 대릉원 등 주요 유적지와 가까운 게스트하우스입니다.',
      structure: '게스트하우스',
      privacyType: '다인실',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 100,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen'],
      hostIndex: 0,
      lat: 35.83 + Math.random() * 0.05,
      lng: 129.21 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room6',
      title: '경주 양동마을 전통 한옥 체험',
      description:
        '유네스코 세계유산 양동마을에서 전통 한옥을 체험할 수 있는 숙소입니다.',
      structure: '독특한 숙소',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 170,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['Garden', 'Free parking'],
      hostIndex: 1,
      lat: 36.0 + Math.random() * 0.05,
      lng: 129.25 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room7',
      title: '경주 감포항 바다 전망 펜션',
      description:
        '감포항 바다가 시원하게 보이는 펜션입니다. 신선한 해산물을 즐기세요.',
      structure: '주택',
      privacyType: '공간 전체',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 150,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'Kitchen', 'Air conditioning'],
      hostIndex: 1,
      lat: 35.8 + Math.random() * 0.05,
      lng: 129.47 + Math.random() * 0.05,
    },
    {
      identifier: 'Gyeongju Room8',
      title: '경주 월정교 야경 감상 숙소',
      description:
        '월정교의 아름다운 야경을 가까이서 감상할 수 있는 숙소입니다.',
      structure: '아파트',
      privacyType: '개인실',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 165,
      maxGuests: Math.floor(Math.random() * 4) + 2, // 2~5
      amenityNames: ['WiFi', 'TV'],
      hostIndex: 2,
      lat: 35.82 + Math.random() * 0.05,
      lng: 129.22 + Math.random() * 0.05,
    },
  ];

  const createdRooms: Room[] = [];

  for (const roomData of roomsToCreate) {
    const { identifier, amenityNames, hostIndex, ...rest } = roomData;
    const images = parsedRoomImages[identifier] || [];

    if (images.length === 0) {
      console.warn(
        `경고: ${identifier}에 대한 이미지를 찾을 수 없습니다. 기본 이미지를 사용합니다.`,
      );
      // Fallback to random images if no specific images are found
      images.push(
        `https://source.unsplash.com/random/800x600?apartment,${roomData.city}`,
        `https://source.unsplash.com/random/800x600?interior,${roomData.city}`,
        `https://source.unsplash.com/random/800x600?bedroom,${roomData.city}`,
      );
    } else {
      console.log(
        `'${identifier}'에 ${images.length}개의 이미지를 할당합니다.`,
      );
    }

    const room = await prisma.room.create({
      data: {
        ...rest,
        hostId: hosts[hostIndex].id,
        images: {
          create: images.map((url) => ({ url })),
        },
        amenities: getAmenityConnect(amenityNames),
      },
    });
    createdRooms.push(room);
  }
  console.log(`숙소 ${createdRooms.length}개 생성 완료.\n`);
  return createdRooms;
}

/**
 * 예약, 결제, 리뷰 시드 데이터를 생성합니다.
 * @param createdRooms - 생성된 숙소 배열
 * @param guests - 게스트 역할을 가진 사용자 배열
 */
async function seedBookingsAndReviews(
  createdRooms: Room[],
  guests: User[],
): Promise<Booking[]> {
  console.log('--- 예약, 결제, 리뷰 데이터 생성 시작 ---');
  const createdBookings: Booking[] = [];

  for (let i = 0; i < createdRooms.length; i++) {
    const room = createdRooms[i];
    const guest = guests[i % guests.length];

    // 각 숙소당 1~2개의 예약 생성
    for (let j = 0; j < Math.floor(Math.random() * 2) + 1; j++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 5 + j * 10)); // 날짜 겹치지 않게 설정
      const nights = Math.floor(Math.random() * 5) + 2;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + nights);
      const totalPrice = room.pricePerNight * nights;

      const booking = await prisma.booking.create({
        data: {
          startDate,
          endDate,
          totalPrice,
          roomId: room.id,
          guestId: guest.id,
          payment: {
            create: {
              amount: totalPrice,
              method: j % 2 === 0 ? 'CARD' : 'BANK',
              status: 'COMPLETED',
            },
          },
        },
      });
      createdBookings.push(booking);

      // 70% 확률로 리뷰 생성
      if (Math.random() < 0.7) {
        await prisma.review.create({
          data: {
            rating: Math.floor(Math.random() * 3) + 3, // 3, 4, 5점
            comment: [
              '정말 멋진 숙소였습니다! 호스트님도 친절하시고 위치도 좋았어요.',
              '깨끗하고 편안했습니다. 다음에 또 이용하고 싶네요.',
              '사진이랑 똑같아요. 기대 이상이었습니다!',
              '잘 쉬다 갑니다. 모든 것이 완벽했어요.',
            ][i % 4],
            bookingId: booking.id,
            roomId: room.id,
          },
        });
      }
    }
  }
  console.log(`예약 및 관련 데이터 ${createdBookings.length}개 생성 완료.\n`);
  return createdBookings;
}

/**
 * 메시지 시드 데이터를 생성합니다.
 */
async function seedMessages() {
  console.log('--- 메시지 데이터 생성 시작 ---');
  const bookingWithGuestAndRoom = await prisma.booking.findFirst({
    include: { guest: true, room: { include: { host: true } } },
  });

  if (bookingWithGuestAndRoom) {
    await prisma.message.create({
      data: {
        content:
          '안녕하세요, 예약 관련해서 문의드립니다. 체크인 시간 조정이 가능할까요?',
        fromUserId: bookingWithGuestAndRoom.guest.id,
        toUserId: bookingWithGuestAndRoom.room.host.id,
      },
    });

    await prisma.message.create({
      data: {
        content: '네, 안녕하세요! 몇 시쯤 도착 예정이신가요?',
        fromUserId: bookingWithGuestAndRoom.room.host.id,
        toUserId: bookingWithGuestAndRoom.guest.id,
      },
    });
    console.log('샘플 메시지 2개 생성 완료.\n');
  }
}

async function main() {
  console.log(`시드 스크립트 시작...`);

  // 1. 데이터베이스 초기화
  await clearDatabase();

  // 2. 사용자 생성
  const createdUsers = await seedUsers();
  const hosts = createdUsers.filter((user) => user.role === Role.HOST);
  const guests = createdUsers.filter((user) => user.role === Role.GUEST);

  // 3. 편의시설 생성
  await seedAmenities();

  // 4. 숙소 생성
  const createdRooms = await seedRooms(hosts, roomImages);

  // 5. 예약, 결제, 리뷰 생성
  await seedBookingsAndReviews(createdRooms, guests);

  // 6. 메시지 생성
  await seedMessages();

  console.log(`시드 스크립트 완료.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 데이터베이스 연결 종료
    await prisma.$disconnect();
  });
