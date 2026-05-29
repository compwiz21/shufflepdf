import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-display font-bold text-lg">ShufflePDF</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link className="btn-ghost" href="/editor">Editor</Link>
          <Link className="btn-ghost" href="/merge">Merge</Link>
          <Link className="btn-ghost" href="/split">Split</Link>
          <Link className="btn-ghost" href="/pdf-to-jpg">PDF→JPG</Link>
          <Link className="btn-ghost" href="/jpg-to-pdf">JPG→PDF</Link>
          <Link className="btn-ghost" href="/pdf-to-text">PDF→Text</Link>
          <Link className="btn-ghost" href="/faq">FAQ</Link>
        </nav>
        <Link href="/editor" className="btn-primary !py-2 !px-4 text-sm">
          Open editor
        </Link>
      </div>
    </header>
  );
}
