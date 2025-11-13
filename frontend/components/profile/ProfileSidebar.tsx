// components/profile/ProfileSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { basePath?: string };
export default function ProfileSidebar({ basePath = "" }: Props) {
  const pathname = usePathname();
  const items = [
    { href: `${basePath}/profile`, label: "자기소개", icon: "민" },
    { href: `${basePath}/trips`, label: "이전 여행", icon: "🏠" },
    { href: `${basePath}/relationships`, label: "인연", icon: "👥" },
  ];
  return (
    <nav className="space-y-2">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-sm ${
              active ? "bg-gray-100 shadow-sm" : "hover:bg-gray-50"
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm">
              {it.icon}
            </span>
            <span className="font-medium">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
