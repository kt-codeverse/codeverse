'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TitleFormData {
  title: string;
  description: string;
}

interface TitleFormProps {
  onDataChange: (data: TitleFormData) => void;
  initialData?: TitleFormData;
}

const MAX_TITLE_LENGTH = 32;
const MAX_DESC_LENGTH = 500;

/**
 * 숙소의 제목과 설명을 입력받는 폼 컴포넌트입니다.
 * 글자 수 제한 및 카운터 기능을 제공합니다.
 * @param {TitleFormProps} props - onDataChange: 입력 데이터 변경 시 호출될 콜백, initialData: 초기 데이터
 */
export default function TitleForm({
  onDataChange,
  initialData = { title: '', description: '' },
}: TitleFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);

  /**
   * 제목 변경 시 호출되며, 부모 컴포넌트로 데이터를 전달합니다.
   * @param e - 입력 이벤트
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onDataChange({ title: newTitle, description });
  };

  /**
   * 설명 변경 시 호출되며, 부모 컴포넌트로 데이터를 전달합니다.
   * @param e - 입력 이벤트
   */
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onDataChange({ title, description: newDescription });
  };

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">숙소 이름</Label>
        <Input
          id="title"
          placeholder="예: 도심 속 힐링 아파트"
          value={title}
          onChange={handleTitleChange}
          maxLength={MAX_TITLE_LENGTH}
        />
        <p className="text-sm text-right text-muted-foreground">
          {title.length} / {MAX_TITLE_LENGTH}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">숙소 설명</Label>
        <Textarea
          id="description"
          placeholder="숙소의 특징과 매력을 마음껏 뽐내보세요."
          value={description}
          onChange={handleDescriptionChange}
          maxLength={MAX_DESC_LENGTH}
          className="h-100 resize-none"
        />
        <p className="text-sm text-right text-muted-foreground">
          {description.length} / {MAX_DESC_LENGTH}
        </p>
      </div>
    </div>
  );
}
