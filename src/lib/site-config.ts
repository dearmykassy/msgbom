export const SITE_ORIGIN = "https://msgbom.kr" as const;

/** Stable content revisions used by sitemap.xml. These are evidenced commit
 * author dates, not build time. Update only the group whose public content,
 * metadata, structured data, or internal links actually changed. */
export const INITIAL_PUBLIC_CONTENT_MODIFIED_AT =
  "2026-08-14T05:33:04+09:00" as const;
export const EDITORIAL_CONTENT_MODIFIED_AT =
  "2026-08-15T13:01:53+09:00" as const;
export const REGIONAL_CONTENT_MODIFIED_AT =
  "2026-08-19T00:59:42+09:00" as const;
