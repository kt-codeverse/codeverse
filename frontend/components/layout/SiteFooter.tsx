export default function SiteFooter() {
  return (
    <footer className="py-8 text-center text-sm text-zinc-500 border-t border-border">
      <div className="container mx-auto px-4">
        © {new Date().getFullYear()} My App
      </div>
    </footer>
  );
}
