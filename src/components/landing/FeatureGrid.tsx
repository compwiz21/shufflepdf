import Link from "next/link";
import {
  Shuffle,
  Type,
  PenTool,
  Combine,
  Scissors,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Shuffle,
    title: "Reorder pages",
    body: "Drag thumbnails into any order. The headline feature — try it in 5 seconds.",
    href: "/editor",
    color: "bg-primary-100 text-primary-600",
    rotate: "-rotate-2",
  },
  {
    icon: Type,
    title: "Add text & fill forms",
    body: "Click anywhere to add text. Perfect for filling out PDFs without a printer.",
    href: "/editor",
    color: "bg-accent-100 text-amber-700",
    rotate: "rotate-1",
  },
  {
    icon: PenTool,
    title: "Sign documents",
    body: "Draw, type, or upload a signature. Place it on any page and download.",
    href: "/editor",
    color: "bg-emerald-100 text-emerald-700",
    rotate: "-rotate-1",
  },
  {
    icon: Combine,
    title: "Merge PDFs",
    body: "Combine multiple PDFs into one. Drag to reorder before merging.",
    href: "/merge",
    color: "bg-rose-100 text-rose-700",
    rotate: "rotate-2",
  },
  {
    icon: Scissors,
    title: "Split PDFs",
    body: "Extract page ranges or split a PDF into chunks of N pages.",
    href: "/split",
    color: "bg-sky-100 text-sky-700",
    rotate: "-rotate-1",
  },
  {
    icon: ImageIcon,
    title: "Convert",
    body: "PDFs to JPG, JPGs to PDF, or PDFs to plain text — all in the browser.",
    href: "/pdf-to-jpg",
    color: "bg-indigo-100 text-indigo-700",
    rotate: "rotate-1",
  },
];

export function FeatureGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-display text-4xl font-bold">
          Every PDF tool you actually need
        </h2>
        <p className="mt-4 text-muted">
          We picked the things people do every day — and made them fast, free,
          and private.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className={`card p-6 hover:-translate-y-1 transition-transform ${f.rotate} hover:rotate-0`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}
            >
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-semibold mt-4">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{f.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { FileText };
