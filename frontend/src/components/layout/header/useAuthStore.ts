import { create } from 'zustand';

/**
 * @interface AuthState
 * @description 인증 상태 관리를 위한 스토어 인터페이스
 * @property {boolean} isLoggedIn - 사용자 로그인 상태
 * @property {() => Promise<void>} checkAuth - 앱 로드 시 토큰을 확인하여 로그인 상태를 초기화하는 함수
 * @property {(token: string) => Promise<void>} login - 로그인 처리 함수
 * @property {() => Promise<void>} logout - 로그아웃 처리 함수
 */
interface AuthState {
  isLoggedIn: boolean;
  checkAuth: () => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 초기 상태
  checkAuth: () => {
    const token = localStorage.getItem('token');
    set({ isLoggedIn: !!token });
  },
  login: (token: string) => {
    localStorage.setItem('token', token);
    set({ isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isLoggedIn: false });
  },
}));
