'use client';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('비밀번호:', password);

    const loginData = {
      email: email,
      password: password,
    };

    const API_URL = '/api/auth/login'; // 백엔드 로그인 API 주소 (예시)
    try {
      console.log('로그인 요청중: ', loginData);
      const response = await axios.post(API_URL, loginData);
      console.log('로그인 응답: ', response.data);

      router.push('/home');

      alert('로그인 성공!');
    } catch (error) {
      if (error instanceof Error) {
        // Axios 에러를 포함한 대부분의 에러는 Error 객체를 상속합니다.
        console.error('로그인 실패:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-pink-500 mb-2 text-2xl font-bold">TripNest</h1>
          <p className="text-gray-600">여행의 새로운 시작</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* 이메일 입력 */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 h-9 w-full"
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-gray-50 border-gray-200 h-9 w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full text-white font-bold py-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition duration-150"
          >
            로그인
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="text-center mt-6">
          <span className="text-gray-600">아직 회원이 아니신가요?</span>
          <button
            type="button"
            className="pl-2 font-bold text-[#FF385C] cursor-pointer hover:text-pink-600"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
