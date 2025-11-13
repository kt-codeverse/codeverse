"use client";

import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import Image from "next/image";

type Trip = { id: string; city: string; date: string; imageUrl: string };

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get("/bookings");
        setTrips(res.data);
      } catch {
        setTrips([
          {
            id: "1",
            city: "대전",
            date: "2025년 7월 8일 ~ 9일",
            imageUrl:
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          },
        ]);
      }
    })();
  }, []);

  return (
    <>
      <h3 className="text-3xl font-extrabold mb-6">이전 여행</h3>

      <div className="grid gap-6">
        {trips.map((t) => (
          <div key={t.id} className="max-w-sm">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={t.imageUrl}
                alt={t.city}
                width={400}
                height={300}
                className="aspect-[4/3] object-cover"
              />
            </div>
            <div className="mt-3 font-medium">{t.city}</div>
            <div className="text-sm text-gray-500">{t.date}</div>
          </div>
        ))}
      </div>
    </>
  );
}
