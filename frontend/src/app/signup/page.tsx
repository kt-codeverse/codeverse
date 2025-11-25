'use client';

import TextInput from '@/components/user/TextInput';
import { Mail, User, Phone } from 'lucide-react';
import PasswordInput from '@/components/user/PasswordInput';
import AuthButton from '@/components/user/AuthButton';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/http';
import { useRouter } from 'next/navigation';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  checkedPW: string;
};

export default function RegisterPage() {
  const route = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange', // 입력할때마다 유효성 검사 실행
  });

  const onSubmit = async (data: FormValues) => {
    if (data.password !== data.checkedPW) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    //console.log('회원가입 데이터: ', data);

    try {
      const register = await api.post('/users/register', {
        email: data.email,
        password: data.password,
        passwordConfirm: data.checkedPW,
        name: data.name,
        phoneNumber: data.phone,
      });

      const accessToken = register.data.access_token;
      //console.log('accessToken: ', accessToken);

      localStorage.setItem('token', accessToken);

      route.push('/signin');
    } catch (error) {
      console.log(error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  // removed unused handleSignup helper; form uses handleSubmit(onSubmit)

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-linear-to-bl from-blue-50 to-purple-50 ">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-pink-500 mb-2 text-2xl font-bold">TripNest</h1>
            <p className="text-gray-600">새로운 여행을 시작하세요</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 이름 */}
            <TextInput
              label="이름"
              placeholder="이름"
              icon={User}
              {...register('name', { required: '이름을 입력해주세요' })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            {/* 이메일 */}
            <TextInput
              label="이메일"
              placeholder="example@email.com"
              icon={Mail}
              type="email"
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

            <TextInput
              label="전화번호"
              placeholder="010-1234-5678"
              icon={Phone}
              {...register('phone', {
                required: '전화번호를 입력해주세요.',
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
            <PasswordInput
              label="비밀번호"
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
              })}
            />

            <PasswordInput
              label="비밀번호 확인"
              {...register('checkedPW', {
                required: '비밀번호 확인이 필요합니다.',
                validate: (value: string) =>
                  value === getValues('password') ||
                  '비밀번호가 일치하지 않습니다.',
              })}
              error={errors.checkedPW?.message}
            />
            {/* {errors.checkedPW && (
              <p className="text-red-500 text-sm">{errors.checkedPW.message}</p>
            )} */}

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
