export const REGION_SERVICE_KEYWORD_SUFFIXES = [
  "출장마사지",
  "출장안마",
  "출장타이마사지",
  "출장스웨디시",
  "출장홈타이",
  "토닥이",
  "남성전용마사지",
  "여성전용마사지",
] as const;

export type RegionServiceKeywordSuffix =
  (typeof REGION_SERVICE_KEYWORD_SUFFIXES)[number];

export const REGION_SERVICE_KEYWORD_TEMPLATES =
  REGION_SERVICE_KEYWORD_SUFFIXES.map((suffix) => `{지역}${suffix}`);

export function buildRegionServiceKeywords(
  regionName: string,
): Readonly<Record<RegionServiceKeywordSuffix, string>> {
  const normalizedRegionName = regionName.normalize("NFC").trim();
  if (!normalizedRegionName) {
    throw new Error("REGION_SERVICE_KEYWORD_REGION_REQUIRED");
  }

  return Object.fromEntries(
    REGION_SERVICE_KEYWORD_SUFFIXES.map((suffix) => [
      suffix,
      `${normalizedRegionName}${suffix}`,
    ]),
  ) as Record<RegionServiceKeywordSuffix, string>;
}
