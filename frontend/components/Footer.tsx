export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-zinc-500">
      <div className="container mx-auto px-4">
        © {new Date().getFullYear()} My App
      </div>
    </footer>
  );
}
