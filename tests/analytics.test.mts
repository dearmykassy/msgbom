import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPhoneCtaEventParams,
  buildPageViewParams,
  deriveCtaLocation,
  GA_CONFIG_PARAMS,
  inferPageType,
  normalizeGaMeasurementId,
  normalizePagePath,
  normalizePageTitle,
} from "../src/lib/analytics.ts";

test("GA measurement IDs are opt-in and validated", () => {
  assert.equal(normalizeGaMeasurementId(undefined), null);
  assert.equal(normalizeGaMeasurementId(" g-abc123def4 "), "G-ABC123DEF4");
  assert.equal(normalizeGaMeasurementId('G-ABC123\" onload=alert(1)'), null);
});

test("GA config disables automatic page views and advertising signals", () => {
  assert.deepEqual(GA_CONFIG_PARAMS, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
});

test("page paths omit query strings and redact obvious PII", () => {
  assert.equal(normalizePagePath("/areas/seoul/?utm_source=test#hero"), "/areas/seoul");
  assert.equal(normalizePagePath("/call/0508-1234-5678"), "/call/[redacted]");
  assert.equal(normalizePagePath("/member/person@example.com"), "/member/[redacted]");
  assert.equal(inferPageType("/areas/seoul"), "region");
  assert.equal(inferPageType("/blog/wellness"), "blog_post");
  assert.equal(inferPageType("/unknown"), undefined);
});

test("page view fields contain a clean location and redacted bounded title", () => {
  const params = buildPageViewParams(
    "msgbom",
    "/areas/seoul?utm_source=test#hero",
    {
      origin: "https://msgbom.kr/ignored/path",
      title: `고객 person@example.com · 0508-1234-5678 ${"가".repeat(200)}`,
    },
  );

  assert.equal(params.page_location, "https://msgbom.kr/areas/seoul");
  assert.equal(params.page_title.includes("person@example.com"), false);
  assert.equal(params.page_title.includes("0508"), false);
  assert.equal(params.page_title.length, 150);
  assert.equal(normalizePageTitle("  정상   제목  "), "정상 제목");
});

test("CTA location is a controlled category, never raw text", () => {
  assert.equal(deriveCtaLocation("region_hero", "0508-1234-5678"), "region_hero");
  assert.equal(deriveCtaLocation(undefined, "지금 전화상담 0508-1234-5678"), "phone_consultation");
  assert.equal(deriveCtaLocation(undefined, "0508-1234-5678"), "tel_link");
});

test("phone CTA payload contains no telephone href, number, or raw label", () => {
  const params = buildPhoneCtaEventParams({
    platformId: "msgbom",
    path: "/areas/seoul?customer=person@example.com",
    dataLocation: "region_floating",
    textContent: "전화상담 0508-1234-5678",
    context: {
      origin: "https://msgbom.kr/path?private=0508-1234-5678",
      title: "고객 person@example.com · 0508-1234-5678",
    },
  });
  const serialized = JSON.stringify(params);

  assert.deepEqual(Object.keys(params).sort(), [
    "cta_location",
    "page_location",
    "page_path",
    "page_title",
    "page_type",
    "platform_id",
    "transport_type",
  ]);
  assert.equal(params.transport_type, "beacon");
  assert.equal(serialized.includes("0508"), false);
  assert.equal(serialized.includes("tel:"), false);
  assert.equal(serialized.includes("person@example.com"), false);
  assert.equal(params.page_location, "https://msgbom.kr/areas/seoul");
});
