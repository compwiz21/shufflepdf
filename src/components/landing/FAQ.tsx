"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

const defaultFaqs: FaqItem[] = [
  {
    q: "Are my files actually private?",
    a: "Yes. ShufflePDF runs entirely in your browser — your PDF never gets uploaded to a server. You can disconnect from the internet after the page loads and the editor will keep working.",
  },
  {
    q: "Is it really free? What's the catch?",
    a: "No catch. No ads, no signup, no watermarks, no page-count limit. The project is built and run for the love of bureaucracy-free PDF editing.",
  },
  {
    q: "What's the largest file I can edit?",
    a: "Roughly 200 MB. Larger PDFs may work on a powerful computer but the browser can run out of memory.",
  },
  {
    q: "Which browsers are supported?",
    a: "Chrome 100+, Firefox 100+, Edge 100+, and Safari 15+. Mobile browsers work for viewing and basic editing.",
  },
  {
    q: "Does it work offline?",
    a: "Yes, after the first visit. The editor is fully client-side, so once it loads you can use it without an internet connection.",
  },
  {
    q: "Can I OCR a scanned PDF?",
    a: "Not yet — that's on the roadmap. For now, PDF→Text only extracts text that's already embedded in the document.",
  },
];

export function FAQ({ items = defaultFaqs }: { items?: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h2 className="font-display text-4xl font-bold text-center mb-10">
        Questions?
      </h2>
      <div className="space-y-3">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="card overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="font-display font-semibold">{f.q}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-muted leading-relaxed">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
