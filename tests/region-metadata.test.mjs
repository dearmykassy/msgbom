import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const productionOrigin = "https://msgbom.kr";
const initialPublicLastModified = new Date("2026-08-14T05:33:04+09:00");
const editorialLastModified = new Date("2026-08-15T13:01:53+09:00");
const regionalLastModified = new Date("2026-08-19T00:59:42+09:00");
const fixedSitemapPaths = [
  "",
  "/areas",
  "/guide",
  "/bomchelin",
  "/notice",
  "/blog",
  "/blog/masaji-shop-gagi-himdeul-ttae",
  "/blog/jibeseo-masaji-badeul-su-issnayo",
];
const serviceKeywords = [
  "출장마사지",
  "출장안마",
  "출장타이마사지",
  "출장스웨디시",
  "출장홈타이",
  "토닥이",
  "남성전용마사지",
  "여성전용마사지",
];
const formalSuffix = /(특별자치도|특별자치시|특별시|광역시|도|시)$/u;

const approvedManifest = JSON.parse(
  readFileSync(
    join(repositoryRoot, "src/data/approved-region-titles.generated.json"),
    "utf8",
  ),
);
const prerenderManifest = JSON.parse(
  readFileSync(join(repositoryRoot, ".next/prerender-manifest.json"), "utf8"),
);
const sitemapXml = readFileSync(
  join(repositoryRoot, ".next/server/app/sitemap.xml.body"),
  "utf8",
);
const formalRegionTokens = [
  ...new Set(
    approvedManifest.entries.flatMap((entry) =>
      [entry.region, entry.locality_label, ...entry.context.split(/\s*·\s*/u)]
        .flatMap((label) => label.split(/\s+/u))
        .filter((token) => formalSuffix.test(token)),
    ),
  ),
].sort((left, right) => right.length - left.length);
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
const forbiddenFormalTarget = new RegExp(
  `(?:${formalRegionTokens.map(escapeRegExp).join("|")})(?=(?:${serviceKeywords.join("|")}))`,
  "u",
);

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/giu, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extract(html, pattern, label, route) {
  const value = pattern.exec(html)?.[1];
  assert.ok(value, `${route}: missing ${label}`);
  return decodeHtml(value);
}

function readRouteMetadata(entry) {
  const route = decodeURI(entry.path);
  assert.ok(prerenderManifest.routes[route], `${route}: missing prerender route`);

  const htmlPath = join(
    repositoryRoot,
    ".next/server/app",
    `${route.replace(/^\//u, "")}.html`,
  );
  const html = readFileSync(htmlPath, "utf8");
  const title = extract(html, /<title>([^<]+)<\/title>/u, "title", route);
  const description = extract(
    html,
    /<meta name="description" content="([^"]+)"\s*\/>/u,
    "description",
    route,
  );
  const keywords = extract(
    html,
    /<meta name="keywords" content="([^"]+)"\s*\/>/u,
    "keywords",
    route,
  );
  const canonical = extract(
    html,
    /<link rel="canonical" href="([^"]+)"\s*\/>/u,
    "canonical",
    route,
  );
  const breadcrumb = extract(
    html,
    /<nav class="region-landing-breadcrumbs"[^>]*>([\s\S]*?)<\/nav>/u,
    "visible breadcrumb",
    route,
  ).replace(/<[^>]+>|<!-- -->/gu, "");

  return {
    route,
    html,
    title,
    description,
    keywords,
    keywordList: keywords.split(","),
    canonical,
    breadcrumb,
  };
}

const metadataByPath = new Map(
  approvedManifest.entries.map((entry) => [entry.path, readRouteMetadata(entry)]),
);

function metadataFor(path) {
  const metadata = metadataByPath.get(path);
  assert.ok(metadata, `${path}: missing approved metadata fixture`);
  return metadata;
}

test("all approved regional routes have unique concise metadata", () => {
  assert.equal(approvedManifest.entries.length, 1_291);
  assert.equal(metadataByPath.size, 1_291);

  const titles = new Set();
  const descriptions = new Set();
  const keywordSets = new Set();
  const primaryKeywords = new Set();

  for (const entry of approvedManifest.entries) {
    const metadata = metadataFor(entry.path);
    const primaryKeyword = metadata.keywordList[0];

    assert.equal(metadata.keywordList.length, serviceKeywords.length, entry.path);
    assert.ok(metadata.title.startsWith(primaryKeyword), entry.path);
    assert.ok(metadata.description.includes(primaryKeyword), entry.path);
    assert.equal(
      metadata.canonical,
      `${productionOrigin}${entry.path}`,
      `${entry.path}: canonical changed`,
    );
    assert.ok(
      metadata.breadcrumb.includes(entry.region),
      `${entry.path}: official visible breadcrumb label changed`,
    );

    for (const [field, value] of [
      ["title", metadata.title],
      ["description", metadata.description],
      ["keywords", metadata.keywords],
    ]) {
      assert.doesNotMatch(
        value,
        forbiddenFormalTarget,
        `${entry.path}: formal suffix remains in ${field}`,
      );
      for (const formalRegionToken of formalRegionTokens) {
        assert.ok(
          !value.includes(formalRegionToken),
          `${entry.path}: official token ${formalRegionToken} remains in ${field}`,
        );
      }
    }

    assert.ok(!titles.has(metadata.title), `${entry.path}: duplicate title`);
    assert.ok(
      !descriptions.has(metadata.description),
      `${entry.path}: duplicate description`,
    );
    assert.ok(
      !keywordSets.has(metadata.keywords),
      `${entry.path}: duplicate keyword set`,
    );
    assert.ok(
      !primaryKeywords.has(primaryKeyword),
      `${entry.path}: duplicate primary keyword`,
    );
    titles.add(metadata.title);
    descriptions.add(metadata.description);
    keywordSets.add(metadata.keywords);
    primaryKeywords.add(primaryKeyword);
  }
});

test("representative roots and city routes use customer-search labels", () => {
  const examples = new Map([
    ["/areas/seoul", "서울출장마사지"],
    ["/areas/incheon", "인천출장마사지"],
    ["/areas/gyeonggi", "경기출장마사지"],
    [
      "/areas/gyeonggi/%EC%88%98%EC%9B%90%EC%8B%9C",
      "수원출장마사지",
    ],
    ["/areas/cheonan", "천안출장마사지"],
    ["/areas/jeju", "제주출장마사지"],
  ]);

  for (const [path, expectedPrimaryKeyword] of examples) {
    const metadata = metadataFor(path);
    assert.equal(metadata.keywordList[0], expectedPrimaryKeyword, path);
    assert.ok(metadata.title.startsWith(expectedPrimaryKeyword), path);
    assert.ok(metadata.description.includes(expectedPrimaryKeyword), path);
  }
});

test("duplicate short names use similarly shortened parent labels", () => {
  const examples = new Map([
    ["/areas/seoul/%EC%A4%91%EA%B5%AC", "서울 중구출장마사지"],
    ["/areas/busan/%EC%A4%91%EA%B5%AC", "부산 중구출장마사지"],
    ["/areas/daegu/%EC%A4%91%EA%B5%AC", "대구 중구출장마사지"],
    [
      "/areas/gyeonggi/%EA%B3%BC%EC%B2%9C%EC%8B%9C/%EC%A4%91%EC%95%99%EB%8F%99",
      "과천 중앙동출장마사지",
    ],
    [
      "/areas/gyeonggi/%EB%8F%99%EB%91%90%EC%B2%9C%EC%8B%9C/%EC%A4%91%EC%95%99%EB%8F%99",
      "동두천 중앙동출장마사지",
    ],
  ]);

  for (const [path, expectedPrimaryKeyword] of examples) {
    assert.equal(metadataFor(path).keywordList[0], expectedPrimaryKeyword, path);
  }
});

test("sitemap keeps the 1,299 canonical inventory and truthful lastmod only", () => {
  const entries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map(
    (match) => match[1],
  );
  const expectedUrls = new Set(
    [...fixedSitemapPaths, ...approvedManifest.entries.map((entry) => entry.path)].map(
      (path) => `${productionOrigin}${path}`,
    ),
  );
  const actualUrls = new Set();

  assert.equal(entries.length, 1_299);
  assert.doesNotMatch(sitemapXml, /<changefreq>|<priority>/u);

  for (const entry of entries) {
    const location = /<loc>([^<]+)<\/loc>/u.exec(entry)?.[1];
    const lastModifiedValues = [...entry.matchAll(/<lastmod>([^<]+)<\/lastmod>/gu)].map(
      (match) => match[1],
    );

    assert.ok(location, "sitemap entry is missing loc");
    assert.deepEqual(lastModifiedValues.length, 1, `${location}: lastmod count`);
    const expectedLastModified = location.startsWith(`${productionOrigin}/areas/`)
      ? regionalLastModified
      : location === `${productionOrigin}/blog` ||
          location.startsWith(`${productionOrigin}/blog/`)
        ? editorialLastModified
        : initialPublicLastModified;
    assert.equal(
      new Date(lastModifiedValues[0]).toISOString(),
      expectedLastModified.toISOString(),
      `${location}: lastmod changed without a page revision`,
    );
    assert.ok(!actualUrls.has(location), `${location}: duplicate sitemap URL`);
    actualUrls.add(location);
  }

  assert.deepEqual(actualUrls, expectedUrls);
});

test("구 군 읍 면 동 리 remain intact in regional metadata", () => {
  for (const suffix of ["구", "군", "읍", "면", "동", "리"]) {
    const entry = approvedManifest.entries.find(({ region }) =>
      region.endsWith(suffix),
    );
    if (!entry) continue;

    assert.ok(
      metadataFor(entry.path).keywordList[0].includes(entry.region),
      `${entry.path}: ${suffix} was removed`,
    );
  }
});
