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

/**
 * 숙소 시드 데이터를 생성합니다.
 * @param hosts - 호스트 역할을 가진 사용자 배열
 */
async function seedRooms(hosts: User[]): Promise<Room[]> {
  console.log('--- 숙소 데이터 생성 시작 ---');
  const roomsData = [
    {
      title: '서울역 근처 아늑한 아파트',
      description:
        '서울의 중심에서 도시의 활기를 느껴보세요. 교통이 편리하고 주변에 맛집이 많습니다.',
      country: 'South Korea',
      city: 'Seoul',
      pricePerNight: 120,
      amenities: [
        { name: 'WiFi' },
        { name: 'Kitchen' },
        { name: 'Air conditioning' },
      ],
      hostId: hosts[0].id,
    },
    {
      title: '해운대 해변이 보이는 오션뷰 스튜디오',
      description:
        '아침에 눈을 뜨면 바로 보이는 바다. 낭만적인 부산 여행을 위한 최고의 숙소입니다.',
      country: 'South Korea',
      city: 'Busan',
      pricePerNight: 180,
      amenities: [{ name: 'WiFi' }, { name: 'Pool' }, { name: 'Free parking' }],
      hostId: hosts[1].id,
    },
    {
      title: '제주 돌담길 감성 숙소',
      description:
        '조용한 제주 시골 마을에서 즐기는 힐링 타임. 돌담과 귤밭이 어우러진 풍경을 제공합니다.',
      country: 'South Korea',
      city: 'Jeju',
      pricePerNight: 150,
      amenities: [
        { name: 'Kitchen' },
        { name: 'Free parking' },
        { name: 'Garden' },
      ],
      hostId: hosts[2].id,
    },
    {
      title: '경주 황리단길 한옥 스테이',
      description:
        '전통 한옥의 멋과 현대적인 편리함이 공존하는 공간. 황리단길 중심에 위치해 있습니다.',
      country: 'South Korea',
      city: 'Gyeongju',
      pricePerNight: 160,
      amenities: [{ name: 'WiFi' }, { name: 'Air conditioning' }],
      hostId: hosts[3].id,
    },
    {
      title: '강릉 커피거리 감성 카페 2층',
      description:
        '커피향 가득한 강릉에서 특별한 하룻밤. 안목해변이 바로 앞에 있습니다.',
      country: 'South Korea',
      city: 'Gangneung',
      pricePerNight: 130,
      amenities: [{ name: 'WiFi' }, { name: 'Kitchen' }],
      hostId: hosts[4].id,
    },
    // ... 10 more rooms
    ...Array.from({ length: 10 }).map((_, i) => ({
      title: `추가 숙소 ${i + 1}`,
      description: `이것은 ${
        hosts[i % hosts.length].name
      }님이 호스팅하는 멋진 숙소입니다.`,
      country: 'South Korea',
      city: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Gwangju'][i % 5],
      pricePerNight: 100 + i * 10,
      amenities: [{ name: 'WiFi' }, { name: 'Kitchen' }],
      hostId: hosts[i % hosts.length].id,
    })),
  ];

  const createdRooms = await Promise.all(
    roomsData.map((roomData) => {
      const { amenities, ...rest } = roomData;
      return prisma.room.create({
        data: {
          ...rest,
          lat: 33 + Math.random() * 5, // 33-38
          lng: 126 + Math.random() * 4, // 126-130
          images: {
            create: [
              {
                url: `https://source.unsplash.com/random/800x600?apartment,${roomData.city}`,
              },
              {
                url: `https://source.unsplash.com/random/800x600?interior,${roomData.city}`,
              },
              {
                url: `https://source.unsplash.com/random/800x600?bedroom,${roomData.city}`,
              },
            ],
          },
          amenities: { connect: amenities },
        },
      });
    }),
  );
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
  const createdRooms = await seedRooms(hosts);

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
