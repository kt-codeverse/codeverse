'use client';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/user/TextInput';
import PasswordInput from '@/components/user/PasswordInput';
import { Mail } from 'lucide-react';
import AuthButton from '@/components/user/AuthButton';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/components/layout/header/useAuthStore';

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const route = useRouter();

  // store에서 login 함수 가져오기
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { email, password } = data;
      const res = await fetch(`${process.env.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      const accessToken = result.access_token;
      login(accessToken);
      route.push('/');
    } catch (error) {
      console.log(error);
      alert('로그인에 실패했습니다');
    }
  };

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
