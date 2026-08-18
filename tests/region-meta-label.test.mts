import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildUniqueMetaRegionLabels,
  shortenMetaRegionLabel,
  type MetaRegionLabelSource,
} from "../src/lib/region-meta-label-normalization.ts";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const approvedManifest = JSON.parse(
  readFileSync(
    join(repositoryRoot, "src/data/approved-region-titles.generated.json"),
    "utf8",
  ),
) as { entries: MetaRegionLabelSource[] };
const formalSuffix = /(특별자치도|특별자치시|특별시|광역시|도|시)$/u;

test("customer-search labels remove only approved token-final suffixes", () => {
  assert.equal(shortenMetaRegionLabel("서울특별시"), "서울");
  assert.equal(shortenMetaRegionLabel("인천광역시"), "인천");
  assert.equal(shortenMetaRegionLabel("경기도"), "경기");
  assert.equal(shortenMetaRegionLabel("수원시"), "수원");
  assert.equal(shortenMetaRegionLabel("제주특별자치도 제주시"), "제주 제주");
  assert.equal(shortenMetaRegionLabel("세종특별자치시"), "세종");
});

test("customer-search labels preserve lower administrative suffixes", () => {
  assert.equal(
    shortenMetaRegionLabel("서울특별시 강남구 역삼동"),
    "서울 강남구 역삼동",
  );
  assert.equal(shortenMetaRegionLabel("기장군 정관읍"), "기장군 정관읍");
  assert.equal(shortenMetaRegionLabel("우도면 서광리"), "우도면 서광리");
});

test("normalization rejects an empty label", () => {
  assert.throws(
    () => shortenMetaRegionLabel(" \n "),
    /META_REGION_LABEL_REQUIRED/u,
  );
});

test("all approved source routes produce unique concise search labels", () => {
  const labels = buildUniqueMetaRegionLabels(approvedManifest.entries);

  assert.equal(approvedManifest.entries.length, 1_291);
  assert.equal(labels.size, 1_291);
  assert.equal(new Set(labels.values()).size, 1_291);

  for (const [path, label] of labels) {
    for (const token of label.split(/\s+/u)) {
      assert.doesNotMatch(token, formalSuffix, `${path}: ${token}`);
    }
  }

  assert.equal(labels.get("/areas/seoul"), "서울");
  assert.equal(labels.get("/areas/incheon"), "인천");
  assert.equal(labels.get("/areas/gyeonggi"), "경기");
  assert.equal(
    labels.get("/areas/gyeonggi/%EC%88%98%EC%9B%90%EC%8B%9C"),
    "수원",
  );
  assert.equal(labels.get("/areas/cheonan"), "천안");
  assert.equal(labels.get("/areas/jeju"), "제주");
  assert.equal(labels.get("/areas/seoul/%EC%A4%91%EA%B5%AC"), "서울 중구");
  assert.equal(labels.get("/areas/busan/%EC%A4%91%EA%B5%AC"), "부산 중구");
});
