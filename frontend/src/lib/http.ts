// lib/http.ts
import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
  withCredentials: true,
  timeout: 10000,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  },
);

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://54.116.28.243/api',
  timeout: 10000,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 요청 보내기전 수행할 작업
    const token = localStorage.getItem('token'); // 토큰 미사용시 무시
    // const token = AuthStorage.getToken(); // 토큰 미사용시 무시
    console.log({ token });
    if (token) {
      // 토큰 사용시 헤더에 토큰 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log({
      headers: config.headers,
      method: config.method,
      url: config.url,
      baseUrl: config.baseURL,
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log({
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      AuthStorage.clear();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  },
);

export const AuthStorage = {
  async setToken(token: string) {
    await localStorage.setItem('token', token);
  },

  async getToken(): Promise<string | null> {
    return await localStorage.getItem('token');
  },

  async clear() {
    await localStorage.removeItem('token');
  },
};
