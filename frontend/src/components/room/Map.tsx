'use client';

import { useEffect, useRef } from 'react';

// 🔥 kakao 타입 선언 (오류 해결)
declare global {
  interface Window {
    kakao;
  }
}

//const { kakao } = window;

interface MapProps {
  address?: string;
}

export default function Map({ address }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('window.kakao 확인:', window.kakao);
    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;

      const kakao = window.kakao;

      // 기본 좌표: 서울
      const defaultPosition = new kakao.maps.LatLng(37.5665, 126.978);

      const options = {
        center: defaultPosition,
        level: 3,
      };

      const map = new kakao.maps.Map(mapRef.current, options);

      // 주소가 없는 경우 기본 서울만 표시하고 종료
      if (!address) {
        new kakao.maps.Marker({
          map,
          position: defaultPosition,
        });
        return;
      }

      // 주소 → 좌표 변환
      const geocoder = new kakao.maps.services.Geocoder();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geocoder.addressSearch(address, function (result: any, status: any) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          map.setCenter(coords);

          new kakao.maps.Marker({
            map,
            position: coords,
          });
        }
      });
    };

    // 스크립트 로드 후 실행
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(loadMap);
    }

    // 스크립트 추가
    const script = document.createElement('script');
    script.async = false;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services,clusterer,drawing&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(loadMap);
    };
    document.head.appendChild(script);
  }, [address]);

  return <div ref={mapRef} className="w-full h-120 rounded-lg border" />;
}
