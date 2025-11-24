import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import {
  Fan,
  ChefHat,
  UtensilsCrossed,
  WashingMachine,
  Bath,
  Wifi,
  KeyRound,
  Refrigerator,
  Microwave,
  Wine,
  Lock,
  AlarmSmoke,
  BadgeAlert,
  FireExtinguisher,
  Briefcase,
  LucideWashingMachine,
  Shirt,
  Blinds,
} from 'lucide-react';

export default function RoomAmenity() {
  const amenities = [
    { label: '헤어드라이어', icon: Fan },
    { label: '샴푸', icon: Bath },
    { label: '컨디셔너', icon: Bath },
    { label: '바디워시', icon: Bath },
    { label: '온수', icon: Bath },
    { label: '세탁기', icon: WashingMachine },
    { label: '건조기', icon: LucideWashingMachine },
    { label: '주방', icon: ChefHat },
    { label: '냉장고', icon: Refrigerator },
    { label: '전자레인지', icon: Microwave },
    { label: '식기류', icon: UtensilsCrossed },
    { label: '냉동고', icon: Refrigerator },
    { label: '와인잔', icon: Wine },
    { label: '옷걸이', icon: Shirt },
    { label: '셀프 체크인', icon: KeyRound },
    { label: '열쇠 보관함', icon: Lock },
    { label: '암막 커튼', icon: Blinds },
    { label: '화재경보기', icon: AlarmSmoke },
    { label: '일산화탄소 경보기', icon: BadgeAlert },
    { label: '소화기', icon: FireExtinguisher },
    { label: '와이파이', icon: Wifi },
    { label: '업무 전용 공간', icon: Briefcase },
  ];

  // 10개만 미리보기
  const previewAmenities = amenities.slice(0, 10);

  return (
    <div>
      <h1 className="pb-3 pt-8 text-2xl">숙소 편의시설</h1>
      <div className="grid grid-cols-2 gap-4">
        {previewAmenities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <Icon className="w-5 h-5 text-gray-700" />
              {item.label}
            </div>
          );
        })}
      </div>

      {/* 10개 넘으면 더보기 모달 */}
      {amenities.length > 10 && (
        <Dialog>
          <DialogTrigger asChild>
            <button className="h-12  w-[110px] mt-4 text-gray-700 font-medium rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              모두 보기
            </button>
          </DialogTrigger>

          {/* 모달내용 */}
          <DialogContent forceMount className="sm:max-w-2xl">
            <DialogTitle className="text-3xl font-semibold mb-4">
              숙소 편의시설
            </DialogTitle>

            <DialogDescription>
              {amenities.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div className="flex p-5 border-b gap-4" key={idx}>
                    <Icon className="h-5 w-5 " />
                    {item.label}
                  </div>
                );
              })}
            </DialogDescription>

            {/* 닫기 버튼 */}
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button className="px-5 py-2 w-[70px]">닫기</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
