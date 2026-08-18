import assert from "node:assert/strict";
import test from "node:test";

import { shortenMetaRegionLabel } from "../src/lib/region-meta-label-normalization.ts";

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
