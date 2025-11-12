import Image from "next/image";

export default function MyPageTrips() {
  const trips = [
    {
      id: 1,
      city: "대전",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      date: "2025년 7월 8일 ~ 9일",
    },
  ];

  return (
    <>
      <h3 className="text-3xl font-extrabold mb-6">이전 여행</h3>

      <div className="grid gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="max-w-sm">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={trip.image}
                alt={trip.city}
                width={400}
                height={300}
                className="aspect-[4/3] object-cover"
              />
            </div>
            <div className="mt-3 font-medium">{trip.city}</div>
            <div className="text-sm text-gray-500">{trip.date}</div>
          </div>
        ))}
      </div>
    </>
  );
}
