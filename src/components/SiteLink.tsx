import NextLink from "next/link";
import type { ComponentProps } from "react";

import { resolveSiteLinkPrefetch } from "@/lib/link-prefetch";

export type SiteLinkProps = ComponentProps<typeof NextLink>;

/**
 * The single internal-link boundary for the site. NextLink still renders a
 * real anchor and keeps client navigation, click handlers and anchor ARIA
 * attributes; only production prefetching is forced off.
 */
export default function SiteLink({ prefetch, ...props }: SiteLinkProps) {
  return (
    <NextLink
      {...props}
      prefetch={resolveSiteLinkPrefetch(prefetch, process.env.NODE_ENV)}
    />
  );
}
