import Container from '@/src/components/layout/Container';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-12">
        <Container>
          <h2 className="text-2xl font-semibold">Welcome</h2>
          <p className="mt-4 text-zinc-600">
            This is the home page. Add sections or components here.
          </p>
        </Container>
      </main>
    </div>
  );
}
