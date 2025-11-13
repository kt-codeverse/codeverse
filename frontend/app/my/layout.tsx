import type { ReactNode } from "react";
import Container from "@/components/layout/Container";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

export const metadata = {
  title: "TripNest - 마이페이지",
};

export default function MyLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh flex flex-col">
      {/* 공통 헤더 */}
      <SiteHeader />

      <Container>
        <div className="grid grid-cols-1 gap-8 py-10 md:grid-cols-[260px_1fr]">
          {/* 왼쪽 사이드바 */}
          <aside>
            <h2 className="mb-6 text-3xl font-extrabold">프로필</h2>
            <ProfileSidebar basePath="/my" /> {/* ✅ basePath 수정 */}
          </aside>

          {/* 오른쪽 콘텐츠 */}
          <section className="pb-24">{children}</section>
        </div>
      </Container>

      {/* 공통 푸터 */}
      <SiteFooter />
    </main>
  );
}
