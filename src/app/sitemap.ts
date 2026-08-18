import type { MetadataRoute } from "next";

import {
  getAllRegionStaticParams,
  resolveRegionNode,
} from "@/lib/regions";
import {
  EDITORIAL_CONTENT_MODIFIED_AT,
  INITIAL_PUBLIC_CONTENT_MODIFIED_AT,
  REGIONAL_CONTENT_MODIFIED_AT,
  SITE_ORIGIN,
} from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedEntries = [
    { path: "", lastModified: INITIAL_PUBLIC_CONTENT_MODIFIED_AT },
    { path: "/areas", lastModified: INITIAL_PUBLIC_CONTENT_MODIFIED_AT },
    { path: "/guide", lastModified: INITIAL_PUBLIC_CONTENT_MODIFIED_AT },
    { path: "/bomchelin", lastModified: INITIAL_PUBLIC_CONTENT_MODIFIED_AT },
    { path: "/notice", lastModified: INITIAL_PUBLIC_CONTENT_MODIFIED_AT },
    { path: "/blog", lastModified: EDITORIAL_CONTENT_MODIFIED_AT },
    {
      path: "/blog/masaji-shop-gagi-himdeul-ttae",
      lastModified: EDITORIAL_CONTENT_MODIFIED_AT,
    },
    {
      path: "/blog/jibeseo-masaji-badeul-su-issnayo",
      lastModified: EDITORIAL_CONTENT_MODIFIED_AT,
    },
  ];

  const activeRegionPaths = getAllRegionStaticParams()
    .map(({ segments }) => resolveRegionNode(segments))
    .filter(
      (node): node is NonNullable<typeof node> =>
        node !== null &&
        node.availability === "active",
    )
    .map((node) => ({
      path: node.path,
      lastModified: REGIONAL_CONTENT_MODIFIED_AT,
    }));

  return [...fixedEntries, ...activeRegionPaths].map(({ path, lastModified }) => ({
    url: `${SITE_ORIGIN}${path}`,
    lastModified,
  }));
}
