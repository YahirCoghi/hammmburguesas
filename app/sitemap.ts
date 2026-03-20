import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.siteUrl,
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.siteUrl}/admin`,
      changeFrequency: "weekly",
      priority: 0.4,
      lastModified: new Date(),
    },
  ];
}
