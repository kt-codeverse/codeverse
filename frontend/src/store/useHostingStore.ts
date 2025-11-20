import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * @constant HOSTING_STEPS
 * @description 호스팅 프로세스의 각 단계를 정의한 배열.
 * URL 경로와 컴포넌트 매핑에 사용됩니다.
 */
export const HOSTING_STEPS = [
  'structure',
  'privacy-type',
  'location',
  'floor-plan',
  'amenities',
  'photos',
  'title',
  // 'price',
  // 'review', // 최종 검토 단계
];

/**
 * @type HostingStep
 * @description 호스팅 프로세스의 각 단계를 나타내는 문자열 리터럴 타입.
 */
export type HostingStep = (typeof HOSTING_STEPS)[number];

/**
 * @interface HostingData
 * @description 호스팅할 숙소의 데이터를 정의하는 인터페이스.
 */
interface HostingData {
  structure: string;
  privacyType: string;
  location: { address: string; lat: number; lng: number };
  floorPlan: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[];
  photos: { [key: string]: unknown }[];
  title: string;
  description: string;
  price: number;
}

/**
 * @interface HostingStore
 * @description 호스팅 프로세스 상태 관리를 위한 스토어 인터페이스.
 */
interface HostingStore {
  step: HostingStep; // 현재 단계
  hostingData: HostingData; // 단계별로 수집되는 숙소 데이터
  setStep: (step: HostingStep) => void;
  updateHostingData: (data: Partial<HostingData>) => void;
  reset: () => void;
}

export const initialState: Pick<HostingStore, 'step' | 'hostingData'> = {
  step: HOSTING_STEPS[0],
  hostingData: {
    structure: '',
    privacyType: '',
    location: {
      address: '',
      lat: 0,
      lng: 0,
    },
    floorPlan: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    amenities: [],
    photos: [],
    title: '',
    description: '',
    price: 0,
  },
};

/**
 * @description 호스팅 프로세스 관리를 위한 Zustand 스토어.
 * `persist`를 사용하여 페이지 리로드 시에도 데이터가 유지됩니다.
 */
export const useHostingStore = create<HostingStore>()(
  persist(
    immer((set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      updateHostingData: (data) =>
        set((state) => ({ hostingData: { ...state.hostingData, ...data } })),
      reset: () => set(initialState),
    })),
    {
      name: 'hosting-process-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
