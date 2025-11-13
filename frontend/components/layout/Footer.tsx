import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className=" mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              TripNest
            </h3>
            <blockquote className="text-sm text-gray-700  rounded-lg ">
              <p className="mb-2">
                <strong>TripNest</strong>는 사용자가 전 세계 숙소를 탐색하고
                예약할 수 있으며, 호스트는 손쉽게 자신의 숙소를 등록하고 관리할
                수 있는 온라인 숙박 공유 플랫폼입니다.
              </p>
              <p className="text-gray-600">
                본 서비스의 목적은{' '}
                <strong>
                  게스트에게 편리하고 신뢰성 높은 예약 경험을 제공하고
                </strong>
                ,{' '}
                <strong>
                  호스트에게 효율적인 숙소 운영 환경을 제공하는 것
                </strong>
                입니다.
              </p>
            </blockquote>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
          <div>© {new Date().getFullYear()} TripNest. All rights reserved.</div>
          <div className="flex gap-4">
            <button className="hover:underline">개인정보 처리방침</button>
            <button className="hover:underline">이용약관</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
