import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * @constant HOSTING_STEPS
 * @description 호스팅 프로세스의 각 단계를 정의한 배열.
 * URL 경로와 컴포넌트 매핑에 사용됩니다.
 */
export const HOSTING_STEPS = [
  'privacy-type',
  'location',
  'floor-plan',
  'amenities',
  'photos',
  'title',
  'description', // 제목과 설명을 함께 또는 별도로 관리할 수 있습니다.
  'price',
  'review', // 최종 검토 단계
];

/**
 * @interface ListingData
 * @description 호스팅할 숙소의 데이터를 정의하는 인터페이스.
 */
interface ListingData {
  privacyType: string | null;
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  floorPlan: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  amenities: string[];
  photos: string[]; // 업로드 후 URL 목록
  title: string;
  description: string;
  price: number;
}

/**
 * @interface HostingStore
 * @description 호스팅 프로세스 상태 관리를 위한 스토어 인터페이스.
 */
interface HostingStore {
  step: number; // 현재 단계의 인덱스
  listingData: Partial<ListingData>; // 단계별로 수집되는 숙소 데이터
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateListingData: (data: Partial<ListingData>) => void;
  reset: () => void;
}

const initialState = {
  step: 0,
  listingData: {
    floorPlan: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    amenities: [],
    photos: [],
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
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: state.step - 1 })),
      updateListingData: (data) =>
        set((state) => {
          state.listingData = { ...state.listingData, ...data };
        }),
      reset: () => set(initialState),
    })),
    {
      name: 'hosting-process-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
