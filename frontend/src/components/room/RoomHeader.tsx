'use client';
import { Share, Heart } from 'lucide-react';
import React from 'react';

interface RoomHeaderProps {
  title: string;
}

export default function RoomHeader({ title }: RoomHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <h1 className="flex-1 font-bold text-2xl">{title}</h1>
      <div className="flex items-center gap-2 ml-4">
        <button className="flex items-center gap-2 text-sm px-2.5 py-2.5 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-all">
          <Share className="w-4 h-4" />
          공유하기
        </button>
        <button className="flex items-center gap-2 text-sm px-2.5 py-2.5 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-all">
          <Heart className="w-4 h-4" />
          저장
        </button>
      </div>
    </div>
  );
}
