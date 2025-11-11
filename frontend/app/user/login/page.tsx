'use client';

import { useState } from 'react';
//import { useRouter } from 'next/navigation';
//import axios from 'axios';

import TextInput from '@/components/user/TextInput';
import PasswordInput from '@/components/user/PasswordInput';
import { Mail } from 'lucide-react';
import AuthButton from '@/components/user/AuthButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('이메일:', email);
    console.log('비밀번호:', password);

    /* const loginData = {
      email: email,
      password: password,
    };
 */
    //router.push('/home');
  };

  return (
    <>
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-pink-500 mb-2 text-2xl font-bold">TripNest</h1>
        <p className="text-gray-600">여행의 새로운 시작</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <TextInput
          label="이메일"
          value={email}
          onChange={setEmail}
          placeholder="example@email.com"
          icon={Mail}
        />

        <PasswordInput
          label="비밀번호"
          value={password}
          onChange={setPassword}
        />

        <AuthButton label="로그인" type="submit" />
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-600">아직 회원이 아니신가요?</span>
        <button className="pl-2 font-bold text-[#FF385C] hover:text-pink-600">
          회원가입
        </button>
      </div>
    </>
  );
}
