export default function SiteHeader() {
  return (
    <header className="py-4 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">My App</h1>
          <nav>{/* Nav links can be added here */}</nav>
        </div>
      </div>
    </header>
  );
}
