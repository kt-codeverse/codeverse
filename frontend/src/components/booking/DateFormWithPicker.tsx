'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users } from 'lucide-react';

const BookingSchema = z.object({
  start: z.date().nullable().optional(),
  end: z.date().nullable().optional(),
  guests: z.number().min(1),
});

type BookingForm = z.infer<typeof BookingSchema>;

export default function DateFormWithPicker({
  onSubmit,
}: {
  onSubmit?: (data: BookingForm) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(BookingSchema),
    defaultValues: { guests: 1 },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit && onSubmit(data))}
      className="space-y-4 w-full max-w-md"
    >
      <div>
        <label className="text-sm font-medium mb-1 block">체크인</label>
        <Controller
          control={control}
          name="start"
          render={({ field }) => (
            <div className="relative">
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="yyyy/MM/dd"
                className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholderText="체크인 날짜 선택"
              />
              <Calendar
                className="absolute right-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          )}
        />
        {errors.start && (
          <p className="text-xs text-red-600 mt-1">체크인 날짜를 선택하세요</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">체크아웃</label>
        <Controller
          control={control}
          name="end"
          render={({ field }) => (
            <div className="relative">
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="yyyy/MM/dd"
                className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholderText="체크아웃 날짜 선택"
              />
              <Calendar
                className="absolute right-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          )}
        />
        {errors.end && (
          <p className="text-xs text-red-600 mt-1">
            체크아웃 날짜를 선택하세요
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">게스트 수</label>
        <Controller
          control={control}
          name="guests"
          render={({ field }) => (
            <div className="relative">
              <input
                type="number"
                min={1}
                value={field.value ?? 1}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Users
                className="absolute right-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          )}
        />
        {errors.guests && (
          <p className="text-xs text-red-600 mt-1">게스트 수를 입력하세요</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
        >
          예약하기
        </button>
      </div>
    </form>
  );
}
