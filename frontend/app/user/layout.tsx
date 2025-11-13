import type { ReactNode } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 ">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
}
