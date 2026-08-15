import type { MetadataRoute } from "next";

import {
  getAllRegionStaticParams,
  resolveRegionNode,
} from "@/lib/regions";
import { SITE_ORIGIN } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/areas",
    "/guide",
    "/bomchelin",
    "/notice",
    "/blog",
    "/blog/masaji-shop-gagi-himdeul-ttae",
    "/blog/jibeseo-masaji-badeul-su-issnayo",
  ];

  const activeRegionPaths = getAllRegionStaticParams()
    .map(({ segments }) => resolveRegionNode(segments))
    .filter(
      (node): node is NonNullable<typeof node> =>
        node !== null &&
        node.availability === "active",
    )
    .map((node) => node.path);

  return [...paths, ...activeRegionPaths].map((path) => ({
    url: `${SITE_ORIGIN}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
