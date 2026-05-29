import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  title: string;
  tagline: string;
  children: ReactNode;
}

export function TaskLayout({ title, tagline, children }: Props) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-12 pb-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {tagline}
          </p>
        </section>
        <section className="max-w-4xl mx-auto px-6 pb-20">{children}</section>
      </main>
      <Footer />
    </>
  );
}
