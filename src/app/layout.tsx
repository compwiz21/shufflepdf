import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shufflepdf.com"),
  title: {
    default: "ShufflePDF — Free PDF Editor in Your Browser",
    template: "%s — ShufflePDF",
  },
  description:
    "Edit, reorder, merge, split, sign, and convert PDFs online. 100% free, no signup, files never leave your computer.",
  keywords: [
    "pdf editor",
    "reorder pdf pages",
    "merge pdf",
    "split pdf",
    "sign pdf",
    "free pdf editor",
    "online pdf editor",
  ],
  openGraph: {
    type: "website",
    siteName: "ShufflePDF",
    title: "ShufflePDF — Free PDF Editor in Your Browser",
    description:
      "Edit, reorder, merge, split, sign and convert PDFs online — free, no signup, private.",
    url: "https://shufflepdf.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShufflePDF — Free PDF Editor in Your Browser",
    description:
      "Edit, reorder, merge, split, sign and convert PDFs online — free, no signup, private.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
