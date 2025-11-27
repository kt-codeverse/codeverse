'use client';

import { usePathname } from 'next/navigation';
import FooterInfo from './FooterInfo';
import FooterLinks from './FooterLinks';
import FooterRecommendations from './FooterRecommendations';

export default function Footer() {
  const pathname = usePathname();

  const hiddenPages = ['/signin', '/signup', '/hosting'];
  const isHiddenPage = hiddenPages.some((page) => pathname.startsWith(page));
  if (isHiddenPage) return null;

  return (
    <footer className="mt-30 py-8 text-center text-sm text-zinc-500">
      <section>
        <FooterRecommendations />
        <FooterLinks />
        <FooterInfo />
      </section>
    </footer>
  );
}
