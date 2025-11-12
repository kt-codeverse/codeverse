import Image from "next/image";
import Link from "next/link";

export default function MyPageRelationships() {
  const hasRelationships = false;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {hasRelationships ? (
        <p>여기에 인연 목록이 표시됩니다.</p>
      ) : (
        <>
          <Image
            src="https://a0.muscache.com/im/pictures/1e1e2c16-dfd8-4b73-b54b-f6492e7df02e.jpg?im_w=720"
            alt="people"
            width={300}
            height={200}
            className="object-contain"
          />
          <p className="mt-6 text-gray-600 text-sm leading-relaxed">
            체험에 참여하거나 여행에 일행을 초대하면,<br />
            다른 게스트의 프로필이 여기에 표시됩니다.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-block rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            여행 예약
          </Link>
          <p className="mt-2 text-xs text-gray-500 underline hover:text-gray-700 cursor-pointer">
            자세히 알아보기
          </p>
        </>
      )}
    </div>
  );
}
