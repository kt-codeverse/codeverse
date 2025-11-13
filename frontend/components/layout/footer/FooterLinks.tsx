export default function FooterLinks() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-12 text-gray-800 text-left">
        {/* 지원 */}
        <div className="w-48">
          <h3 className="text-lg font-semibold mb-4">트립네스트 지원</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline hover:text-gray-600">
                도움말 센터
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-gray-600">
                안전 문제 관련 도움받기
              </a>
            </li>
          </ul>
        </div>

        {/* 호스팅 */}
        <div className="w-48">
          <h3 className="text-lg font-semibold mb-4">호스팅</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline hover:text-gray-600">
                당신의 공간을 트립네스트하세요
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-gray-600">
                트립네스트에서 체험 호스팅하기
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
