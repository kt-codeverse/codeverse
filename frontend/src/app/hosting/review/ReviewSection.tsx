'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}

/**
 * @description 각 검토 항목을 표시하는 재사용 가능한 컴포넌트
 * @param title - 섹션 제목
 * @param children - 표시할 데이터 컨텐츠
 * @param onEdit - '수정' 버튼 클릭 시 호출될 함수
 */
export default function ReviewSection({
  title,
  children,
  onEdit,
}: ReviewSectionProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          수정
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}
