import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shufflepdf.com";
  const now = new Date();
  return [
    "",
    "/editor",
    "/merge",
    "/split",
    "/pdf-to-jpg",
    "/jpg-to-pdf",
    "/pdf-to-text",
    "/faq",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
