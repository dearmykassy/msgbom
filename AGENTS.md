# Repository rules

- Preserve `https://msgbom.kr` as the sole production origin for canonical,
  sitemap, robots and feed output unless the owner explicitly changes it.
- Every current and future production platform must ship a tested RSS 2.0 feed
  at `/rss.xml`. Use only canonical indexable editorial pages, same-origin HTTPS
  links, stable permalink GUIDs, complete article text and verified timestamps.
  Never use build time as freshness or publish the regional URL inventory as
  RSS; sitemap remains the complete crawl inventory.
- Do not store secrets in tracked files. Preserve the current public phone,
  pricing, verification metadata and index policy unless explicitly changed.
- Every internal Next.js link must use `src/components/SiteLink.tsx`; no other
  source file may import `next/link` directly. The wrapper must force
  `prefetch={false}` in production so crawler rendering does not spend crawl
  requests on `?_rsc=` prefetch responses, while preserving the rendered
  anchor, client-side click navigation, handlers and accessibility props.
- Sitemap entries use stable, evidenced route-group `lastModified` values from
  `src/lib/site-config.ts`. Update only the group whose corresponding public
  metadata or content actually changes, never at build time. Do not emit
  `changeFrequency` or `priority`; preserve the exact canonical URL inventory.
- Regional `title`, `keywords` and `description` metadata must target the
  concise labels customers search. Remove only a token-final `특별자치도`,
  `특별자치시`, `특별시`, `광역시`, `도` or `시` (longest match first), so
  `서울특별시`, `인천광역시`, `경기도` and `수원시` become `서울`, `인천`,
  `경기` and `수원`. Never strip `구`, `군`, `읍`, `면`, `동` or `리`
  globally. When shortened names collide, prepend similarly shortened parent
  labels until every regional primary keyword is unique. Do not retain the
  qualified official form as a standalone locality phrase anywhere in those
  three metadata fields, including the descriptive opening sentence. This
  rule is metadata-only: keep official qualified names in visible content,
  breadcrumbs and schema, and never change regional URLs or canonicals for
  this optimization.
- This is not a Todaki-family platform. In every massage service or course
  image, the massage practitioner must be an adult woman. Treat the customer's
  gender and the practitioner's gender as separate roles and never infer one
  from the other.
