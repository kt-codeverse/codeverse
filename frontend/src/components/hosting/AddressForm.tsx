'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressFormProps {
  onAddressChange: (address: { main: string; detail: string }) => void;
}

/**
 * Daum 우편번호 서비스의 oncomplete 콜백으로 반환되는 데이터 타입입니다.
 * @see https://postcode.map.daum.net/guide#attributes
 */
interface DaumPostcodeData {
  address: string;
  zonecode: string;
}

/**
 * Daum 우편번호 서비스를 사용하여 주소를 입력받는 폼 컴포넌트입니다.
 * @param {AddressFormProps} props - onAddressChange 콜백 함수
 */
export default function AddressForm({ onAddressChange }: AddressFormProps) {
  const [mainAddress, setMainAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  /**
   * '주소 검색' 버튼 클릭 시 Daum 우편번호 서비스를 엽니다.
   */
  const handleSearchClick = () => {
    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        setMainAddress(data.address);
        onAddressChange({ main: data.address, detail: detailAddress });
      },
    }).open();
  };

  /**
   * 상세 주소 입력 시 상태를 업데이트하고 부모 컴포넌트로 전달합니다.
   * @param e - 입력 이벤트
   */
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDetailAddress = e.target.value;
    setDetailAddress(newDetailAddress);
    onAddressChange({ main: mainAddress, detail: newDetailAddress });
  };

  return (
    <div className="sm:min-w-xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">주소</Label>
        <div className="flex gap-2">
          <Input
            id="address"
            placeholder="주소를 검색하세요"
            value={mainAddress}
            readOnly
          />
          <Button type="button" variant="outline" onClick={handleSearchClick}>
            주소 검색
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="detailAddress">상세주소</Label>
        <Input
          id="detailAddress"
          placeholder="상세주소를 입력하세요 (예: 2층, 201호)"
          value={detailAddress}
          onChange={handleDetailChange}
        />
      </div>
    </div>
  );
}
