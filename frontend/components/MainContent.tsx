import type { ReactNode } from "react";

export default function MainContent({ children }: { children?: ReactNode }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
