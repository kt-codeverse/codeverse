// app/myPage/layout.tsx
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import type { ReactNode } from "react";

export const metadata = {
  title: "TripNest - 마이페이지",
};

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh">
      {/* 공통 헤더 */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-7 w-7 rounded-full bg-rose-500" />
            <span className="text-xl font-semibold">tripnest</span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <button className="rounded-full bg-gray-900 text-white h-9 w-9">민</button>
            <button className="rounded-full border h-9 w-9">≡</button>
          </nav>
        </div>
      </header>

      {/* 공통 레이아웃 */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[260px_1fr]">
        <aside>
          <h2 className="mb-6 text-3xl font-extrabold">프로필</h2>
          <ProfileSidebar basePath="/myPage" />
        </aside>

        <section className="pb-24">{children}</section>
      </div>
    </main>
  );
}
