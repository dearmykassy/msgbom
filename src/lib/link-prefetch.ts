export type SiteLinkPrefetchValue = boolean | "auto" | null | undefined;

/**
 * Googlebot renders the production App Router tree, so viewport prefetches can
 * consume crawl requests as React Server Component (`?_rsc=`) responses. Keep
 * development defaults for local navigation work, but never prefetch links in
 * the production build.
 */
export function resolveSiteLinkPrefetch(
  requested: SiteLinkPrefetchValue,
  environment: string | undefined,
): SiteLinkPrefetchValue {
  return environment === "production" ? false : requested;
}
