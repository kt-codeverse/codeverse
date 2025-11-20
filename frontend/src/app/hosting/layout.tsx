'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  HOSTING_STEPS,
  HostingStep,
  useHostingStore,
} from '@/store/useHostingStore';

/**
 * 호스팅 단계 페이지들을 위한 공통 레이아웃입니다.
 * URL 경로가 변경될 때마다 Zustand 스토어의 현재 단계를 동기화합니다.
 */
export default function HostingStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setStep } = useHostingStore();

  useEffect(() => {
    const currentStep = pathname.split('/').pop() as HostingStep;
    if (currentStep && HOSTING_STEPS.includes(currentStep)) {
      setStep(currentStep);
    }
  }, [pathname, setStep]);

  return <>{children}</>;
}
