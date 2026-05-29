import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display font-bold text-lg">ShufflePDF</span>
          </div>
          <p className="mt-3 text-sm text-muted max-w-xs">
            Free, private, browser-based PDF editing. Built to fight
            bureaucracy.
          </p>
        </div>
        <div>
          <h3 className="font-display font-semibold mb-3">Editor</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-muted hover:text-foreground" href="/editor">Open editor</Link></li>
            <li><Link className="text-muted hover:text-foreground" href="/merge">Merge PDFs</Link></li>
            <li><Link className="text-muted hover:text-foreground" href="/split">Split PDF</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display font-semibold mb-3">Convert</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-muted hover:text-foreground" href="/pdf-to-jpg">PDF → JPG</Link></li>
            <li><Link className="text-muted hover:text-foreground" href="/jpg-to-pdf">JPG → PDF</Link></li>
            <li><Link className="text-muted hover:text-foreground" href="/pdf-to-text">PDF → Text</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display font-semibold mb-3">About</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-muted hover:text-foreground" href="/faq">FAQ</Link></li>
            <li><span className="text-muted">Privacy first · No ads · No tracking</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} ShufflePDF — Free PDF tools, forever.
      </div>
    </footer>
  );
}
