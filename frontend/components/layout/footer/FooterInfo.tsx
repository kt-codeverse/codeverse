import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import Link from 'next/link';

export default function FooterInfo() {
  return (
    <div>
      {/* 저작권 및 정책 링크 */}
      <div className="flex flex-wrap items-center gap-2 text-left mt-10 py-4 border-t">
        <span className="text-gray-500">© 2025 Tripnest, Inc.</span>
        <nav
          aria-label="법적 및 정책 링크"
          className="flex flex-wrap items-center gap-2"
        >
          <Link href="#">개인정보 처리방침</Link>
          <span>·</span>
          <Link href="#">쿠키 정책</Link>
          <span>·</span>
          <Link href="#">이용약관</Link>
          <span>·</span>
          <Link href="#">한국의 변경된 환불 정책</Link>
          <span>·</span>
          <Link href="#">회사 세부정보</Link>
        </nav>

        <div className="ml-auto flex items-center font-medium text-gray-800">
          <Button variant={'ghost'}>
            <Globe />
            한국어 (KR)
          </Button>
          <Button variant={'ghost'}>₩ KRW</Button>
        </div>
      </div>

      {/* 회사 및 법적 정보 */}
      <div className="flex flex-wrap gap-x-4 text-xs text-gray-500 text-left border-t py-4">
        <div>
          웹사이트 제공자:{' '}
          <span className="font-medium text-gray-800">Tripnest Ireland UC</span>
          , private unlimited company
        </div>
        <div>주소: 8 Hanover Quay, Dublin 2, D02 DP23, Ireland</div>
        <div>이사: Dermot Clarke, Killian Pattwell, Andrea Finnegan</div>
        <div>VAT 번호: IE9827384L · 사업자 등록 번호: IE 511825</div>
        <div>
          연락처:<a href="mailto:terms@tripnest.com">terms@tripnest.com</a>,
          <Link href="/">웹사이트</Link>,080-822-0230
        </div>
        <div>호스팅 서비스 제공업체: Amazon Web Services</div>
        <p className="mt-1 text-gray-700 leading-relaxed">
          트립네스트는 통신판매 중개자로, 플랫폼을 통해 게스트와 호스트 간
          이루어지는 통신판매의 당사자가 아닙니다. 플랫폼을 통해 예약된
          숙소·체험·호스트 서비스에 관한 의무와 책임은 해당 서비스를 제공하는
          호스트에게 있습니다.
        </p>
      </div>
    </div>
  );
}
