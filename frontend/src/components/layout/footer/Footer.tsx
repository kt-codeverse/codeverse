import FooterInfo from './FooterInfo';
import FooterLinks from './FooterLinks';
import FooterRecommendations from './FooterRecommendations';

export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-zinc-500">
      <section className="max-w-7xl mx-auto px-4 border border-dashed">
        <FooterRecommendations />
        <FooterLinks />
        <FooterInfo />
      </section>
    </footer>
  );
}
