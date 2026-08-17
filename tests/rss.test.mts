import assert from "node:assert/strict";
import test from "node:test";
import { buildRssXml, escapeXml } from "../src/lib/rss.ts";

const SITE_URL = "https://msgbom.kr/";
const FEED_URL = "https://msgbom.kr/rss.xml";

test("RSS 2.0 feed escapes XML and exposes canonical discovery metadata", () => {
  const xml = buildRssXml({
    title: "마사지봄 & 이용 안내",
    siteUrl: SITE_URL,
    feedUrl: FEED_URL,
    description: "테스트 <설명>",
    language: "ko-KR",
    items: [
      {
        title: "글 & 하나",
        url: "https://msgbom.kr/blog/one",
        description: "본문 <전체> & 확인",
        publishedAt: "2026-08-15T00:00:00+09:00",
        category: "이용 안내",
      },
    ],
  });
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<rss version="2\.0"/);
  assert.match(xml, /<language>ko-KR<\/language>/);
  assert.match(xml, /href="https:\/\/msgbom\.kr\/rss\.xml" rel="self"/);
  assert.match(xml, /<title>마사지봄 &amp; 이용 안내<\/title>/);
  assert.match(xml, /본문 &lt;전체&gt; &amp; 확인/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/msgbom\.kr\/blog\/one<\/guid>/);
  assert.equal((xml.match(/<item>/g) ?? []).length, 1);
  assert.equal(escapeXml(`&<>"'`), "&amp;&lt;&gt;&quot;&apos;");
});

test("RSS feed fails closed for empty, duplicate, cross-origin or invalid dates", () => {
  const base = {
    title: "마사지봄",
    siteUrl: SITE_URL,
    feedUrl: FEED_URL,
    description: "설명",
    language: "ko-KR" as const,
  };
  const item = {
    title: "글",
    url: "https://msgbom.kr/blog/one",
    description: "본문 전체",
    publishedAt: "2026-08-15T00:00:00+09:00",
  };
  assert.throws(() => buildRssXml({ ...base, items: [] }));
  assert.throws(() => buildRssXml({ ...base, items: [item, item] }));
  assert.throws(() =>
    buildRssXml({
      ...base,
      items: [{ ...item, url: "https://example.com/post" }],
    }),
  );
  assert.throws(() =>
    buildRssXml({ ...base, items: [{ ...item, publishedAt: "today" }] }),
  );
});
