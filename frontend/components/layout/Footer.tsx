import RecommendedDestinations from '../RecommendedDestinations';

export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-zinc-500">
      <section className="max-w-7xl mx-auto px-4">
        <RecommendedDestinations />
      </section>
      <section className="max-w-7xl mx-auto px-4">
        © {new Date().getFullYear()} My App
      </section>
    </footer>
  );
}
