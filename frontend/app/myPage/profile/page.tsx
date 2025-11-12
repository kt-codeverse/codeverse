import ProfileCard from "@/components/profile/ProfileCard";

export default function MyPageProfile() {
  const user = {
    name: "민기",
    role: "게스트",
    trips: 1,
    reviews: 1,
    memberFor: "4개월",
    verified: true,
  };

  const reviews = [
    { id: "r1", author: "리나", date: "2025년 7월", text: "감사합니다 🙂" },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-extrabold">자기소개</h3>
        <button className="rounded-full border px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50">
          수정
        </button>
      </div>

      <div className="mt-6">
        <ProfileCard user={user} />
      </div>

      <div className="mt-8 flex items-center gap-2 text-gray-700">
        <span className="inline-block h-5 w-5 rounded-full border" />
        <span className="underline">본인 인증 완료</span>
      </div>

      <hr className="my-10" />

      <div className="mt-6">
        <h4 className="text-2xl font-bold">후기</h4>
        <ul className="mt-6 space-y-6">
          {reviews.map((r) => (
            <li key={r.id} className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200" />
              <div>
                <div className="font-medium">{r.author}</div>
                <div className="text-sm text-gray-500">{r.date}</div>
                <p className="mt-2">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
