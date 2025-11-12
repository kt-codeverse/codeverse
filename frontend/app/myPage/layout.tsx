import type { ReactNode } from "react";
import Container from "@/components/layout/Container";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

export const metadata = {
  title: "TripNest - 마이페이지",
};

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh flex flex-col">
      {/* 상단 공용 헤더 (기존 SiteHeader 그대로 사용) */}
      <SiteHeader />

      {/* 마이페이지 본문 */}
      <Container>
        <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-[260px_1fr]">
          {/* 왼쪽 사이드바 */}
          <aside>
            <h2 className="mb-6 text-3xl font-extrabold">프로필</h2>
            <ProfileSidebar basePath="/myPage" />
          </aside>

          {/* 오른쪽 콘텐츠 (각 페이지의 내용이 여기에 렌더링됨) */}
          <section className="pb-24">{children}</section>
        </div>
      </Container>

      {/* 하단 공용 푸터 (기존 SiteFooter 그대로 사용) */}
      <SiteFooter />
    </main>
  );
}
