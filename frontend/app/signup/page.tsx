'use client';

import TextInput from '@/components/user/TextInput';
import React, { useState } from 'react';
import { Mail, User, Phone } from 'lucide-react';
import PasswordInput from '@/components/user/PasswordInput';
import AuthButton from '@/components/user/AuthButton';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [checkedPW, setCheckedPW] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      checkedPW: checkedPW,
    };

    console.log(data);

    if (password !== checkedPW) {
      console.log('비밀번호가 일치하지 않습니다.');
      return;
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-linear-to-bl from-blue-50 to-purple-50 ">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-pink-500 mb-2 text-2xl font-bold">TripNest</h1>
            <p className="text-gray-600">새로운 여행을 시작하세요</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <TextInput
              label="이름"
              value={name}
              onChange={setName}
              placeholder="이름"
              icon={User}
            />
            <TextInput
              label="이메일"
              value={email}
              onChange={setEmail}
              placeholder="example@email.com"
              icon={Mail}
              type="email"
            />
            <TextInput
              label="전화번호"
              value={phone}
              onChange={setPhone}
              placeholder="010-1234-5678"
              icon={Phone}
            />
            <PasswordInput
              label="비밀번호"
              value={password}
              onChange={setPassword}
            />

            <PasswordInput
              label="비밀번호 확인"
              value={checkedPW}
              onChange={setCheckedPW}
            />
            <AuthButton label="회원가입" type="submit" />
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">이미 회원이신가요?</span>
            <Link
              href="signin"
              className="pl-2 font-bold text-[#FF385C] hover:text-pink-600"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
