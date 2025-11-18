import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * @interface Booking
 * @description 백엔드 예약 스키마와 일치하는 클라이언트 측 예약 정보 인터페이스.
 * @property {string} id - 예약 고유 ID.
 * @property {string} listingId - 숙소 고유 ID.
 * @property {string} userId - 예약을 생성한 사용자 ID.
 * @property {string} startDate - 예약 시작일 (ISO 8601 형식).
 * @property {string} endDate - 예약 종료일 (ISO 8601 형식).
 * @property {number} guests - 게스트 수.
 * @property {number} totalPrice - 총 예약 금액.
 * @property {'PENDING' | 'CONFIRMED' | 'CANCELLED'} status - 예약 상태.
 */

// interface Booking {
//   id: string;
//   listingId: string;
//   userId: string;
//   startDate: string;
//   endDate: string;
//   guests: number;
//   totalPrice: number;
//   status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
// }

/**
 * @interface BookingStore
 * @description 새로운 예약을 생성하는 과정(단계별)에서 사용될 상태와 액션을 정의하는 스토어 인터페이스.
 */
interface BookingStore {
  /**
   * 새로운 예약을 생성할 때 사용자가 선택한 정보를 임시로 저장하는 상태.
   */
  newBooking: {
    listingId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    guests: number;
  };
  /**
   * 새로운 예약 정보를 업데이트하는 액션.
   * @param {Partial<BookingStore['newBooking']>} details - 업데이트할 예약 정보의 일부.
   */
  setNewBookingDetails: (details: Partial<BookingStore['newBooking']>) => void;
  /**
   * `newBooking` 상태를 초기값으로 리셋하는 액션.
   * 예약 프로세스를 새로 시작할 때 사용됩니다.
   */
  resetNewBooking: () => void;
}

/**
 * @description `newBooking` 상태의 초기값.
 */
const initialState = {
  listingId: null,
  startDate: null,
  endDate: null,
  guests: 1,
};

/**
 * @description 예약 관련 상태 관리를 위한 Zustand 스토어.
 * 이 스토어는 여러 페이지에 걸쳐 진행되는 예약 생성 과정의 상태를 관리하며,
 * `persist` 미들웨어를 사용하여 페이지가 리로드되어도 상태가 유지됩니다.
 *
 * - `immer` 미들웨어를 사용하여 상태를 불변성을 유지하며 쉽게 업데이트합니다.
 * - `persist` 미들웨어를 사용하여 `localStorage`에 상태를 저장합니다.
 */
export const useBookingStore = create<BookingStore>()(
  persist(
    immer((set) => ({
      newBooking: initialState,
      setNewBookingDetails: (details) =>
        set((state) => {
          state.newBooking = { ...state.newBooking, ...details };
        }),
      resetNewBooking: () => set({ newBooking: initialState }),
    })),
    {
      name: 'booking-process-storage', // localStorage에 저장될 때 사용될 키 이름
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
