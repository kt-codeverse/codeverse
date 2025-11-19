'use client';
//import { useRouter } from 'next/navigation';
//import axios from 'axios';
import TextInput from '@/components/user/TextInput';
import PasswordInput from '@/components/user/PasswordInput';
import { Mail } from 'lucide-react';
import AuthButton from '@/components/user/AuthButton';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const onSubmit = (data: FormValues) => {
    console.log('로그인 데이터 : ', data);
  };

  //const router = useRouter();

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-linear-to-bl from-blue-50 to-purple-50 ">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-pink-500 mb-2 text-2xl font-bold">TripNest</h1>
            <p className="text-gray-600">여행의 새로운 시작</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <TextInput
              label="이메일"
              placeholder="example@email.com"
              icon={Mail}
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message:
                    '유효한 이메일 형식으로 입력하세요.(example@email.com)',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <PasswordInput
              label="비밀번호"
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <AuthButton label="로그인" type="submit" />
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">아직 회원이 아니신가요?</span>
            <Link
              href="/signup"
              className="pl-2 font-bold text-[#FF385C] hover:text-pink-600"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
