import regionDataJson from "../data/capital-regions.generated.json";
import serviceCityDataJson from "../data/service-city-regions.generated.json";

export type ActiveSidoKey =
  | "seoul"
  | "gyeonggi"
  | "incheon"
  | "cheonan"
  | "asan"
  | "daejeon"
  | "daegu"
  | "gumi"
  | "pohang"
  | "busan"
  | "jeju";

export type SidoKey =
  | ActiveSidoKey
  | "gwangju-jeonnam"
  | "ulsan"
  | "sejong"
  | "gangwon"
  | "chungbuk"
  | "chungnam"
  | "jeonbuk"
  | "gyeongbuk"
  | "gyeongnam";

export type ProvinceAvailability = "active" | "development";

export type RegionRecord = {
  id: string;
  sidoKey: ActiveSidoKey;
  sidoName: string;
  municipality: string;
  district: string | null;
  officialSigungu: string;
  name: string;
  groupType: string;
  reviewStatus: string;
  legalIdentityMode: string;
  sourceNames: string[];
  sourceCodes: string[];
  legalAreas: Array<{ code: string; name: string }>;
  pathSegments: string[];
  path: string;
};

type CapitalRegionData = {
  schemaVersion: number;
  status: string;
  effectiveDate: string;
  sourceArtifactDigest: string;
  sourceRawSha256: string;
  counts: {
    originalAdminUnits: number;
    representativeRegions: number;
    seoul: number;
    gyeonggi: number;
    incheon: number;
  };
  regions: RegionRecord[];
};

export type ServiceCityKey = Exclude<
  ActiveSidoKey,
  "seoul" | "gyeonggi" | "incheon"
>;

type ServiceCityRegionData = {
  schemaVersion: number;
  status: string;
  effectiveDate: string;
  source: {
    agency: string;
    page_url: string;
    archive_url: string;
    archive_file: string;
    archive_sha256: string;
    kikmix_entry: string;
    kikmix_sha256: string;
    kikcd_b_entry: string;
    kikcd_b_sha256: string;
  };
  sourceRawSha256: string;
  counts: {
    serviceCityRoots: number;
    intermediateHubs: number;
    sourceAdministrativeUnits: number;
    numberedSourceUnits: number;
    representativeFamilies: number;
    representativeRegions: number;
    administrativeUnits: number;
    activeRoutes: number;
    sourceLegalAreaMappings: number;
    representativeLegalAreaMappings: number;
    legalAreaMappings: number;
    byCity: Record<
      ServiceCityKey,
      {
        sourceAdministrativeUnits: number;
        numberedSourceUnits: number;
        representativeFamilies: number;
        representativeRegions: number;
        intermediateHubs: number;
        routes: number;
      }
    >;
  };
  regions: RegionRecord[];
};

export type RegionNodeKind =
  | "province"
  | "municipality"
  | "district"
  | "representative";

export type RegionNode = {
  kind: RegionNodeKind;
  name: string;
  displayName: string;
  segments: string[];
  path: string;
  availability: ProvinceAvailability;
  records: RegionRecord[];
  representative?: RegionRecord;
};

export type RegionChild = {
  kind: RegionNodeKind;
  name: string;
  path: string;
  representativeCount: number;
  sourceUnitCount: number;
};

export type RegionSearchResult = {
  id: string;
  representativeName: string;
  matchedName: string;
  isAliasMatch: boolean;
  context: string;
  path: string;
  sourceNames: string[];
};

const regionData = regionDataJson as unknown as CapitalRegionData;
const serviceCityData =
  serviceCityDataJson as unknown as ServiceCityRegionData;

if (
  regionData.schemaVersion !== 1 ||
  regionData.status !== "COMMITTED" ||
  regionData.counts.representativeRegions !== 768 ||
  regionData.counts.originalAdminUnits !== 1187 ||
  regionData.regions.length !== 768
) {
  throw new Error("REGION_DATA_INTEGRITY_FAILURE");
}

if (
  serviceCityData.schemaVersion !== 1 ||
  serviceCityData.status !== "COMMITTED" ||
  serviceCityData.effectiveDate !== "2026-07-20" ||
  serviceCityData.counts.serviceCityRoots !== 8 ||
  serviceCityData.counts.intermediateHubs !== 36 ||
  serviceCityData.counts.sourceAdministrativeUnits !== 583 ||
  serviceCityData.counts.numberedSourceUnits !== 309 ||
  serviceCityData.counts.representativeFamilies !== 111 ||
  serviceCityData.counts.representativeRegions !== 385 ||
  serviceCityData.counts.administrativeUnits !== 583 ||
  serviceCityData.counts.activeRoutes !== 429 ||
  serviceCityData.regions.length !== 385
) {
  throw new Error("SERVICE_CITY_REGION_DATA_INTEGRITY_FAILURE");
}

export const REGION_COUNTS = regionData.counts;
export const REGION_EFFECTIVE_DATE = regionData.effectiveDate;
export const CAPITAL_REGIONS = regionData.regions;
export const SERVICE_CITY_COUNTS = serviceCityData.counts;
export const SERVICE_CITY_EFFECTIVE_DATE = serviceCityData.effectiveDate;
export const SERVICE_CITY_SOURCE = serviceCityData.source;
export const SERVICE_CITY_REGIONS = serviceCityData.regions;
export const REGIONS = [...CAPITAL_REGIONS, ...SERVICE_CITY_REGIONS];

export type Province = {
  key: SidoKey;
  name: string;
  shortName: string;
  path: string;
  availability: ProvinceAvailability;
  scopeLabel: string;
};

export const PROVINCES: ReadonlyArray<Province> = [
  { key: "seoul", name: "서울특별시", shortName: "서울", path: "/areas/seoul", availability: "active", scopeLabel: "25개 구" },
  { key: "gyeonggi", name: "경기도", shortName: "경기", path: "/areas/gyeonggi", availability: "active", scopeLabel: "31개 시·군" },
  { key: "incheon", name: "인천광역시", shortName: "인천", path: "/areas/incheon", availability: "active", scopeLabel: "11개 군·구" },
  { key: "cheonan", name: "천안시", shortName: "천안", path: "/areas/cheonan", availability: "active", scopeLabel: "2개 구" },
  { key: "asan", name: "아산시", shortName: "아산", path: "/areas/asan", availability: "active", scopeLabel: "12개 지역" },
  { key: "daejeon", name: "대전광역시", shortName: "대전", path: "/areas/daejeon", availability: "active", scopeLabel: "5개 구" },
  { key: "daegu", name: "대구광역시", shortName: "대구", path: "/areas/daegu", availability: "active", scopeLabel: "9개 군·구" },
  { key: "gumi", name: "구미시", shortName: "구미", path: "/areas/gumi", availability: "active", scopeLabel: "23개 지역" },
  { key: "pohang", name: "포항시", shortName: "포항", path: "/areas/pohang", availability: "active", scopeLabel: "2개 구" },
  { key: "busan", name: "부산광역시", shortName: "부산", path: "/areas/busan", availability: "active", scopeLabel: "16개 군·구" },
  { key: "jeju", name: "제주특별자치도", shortName: "제주", path: "/areas/jeju", availability: "active", scopeLabel: "2개 행정시" },
  { key: "gwangju-jeonnam", name: "전남광주통합특별시", shortName: "전남광주", path: "/areas/gwangju-jeonnam", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "ulsan", name: "울산광역시", shortName: "울산", path: "/areas/ulsan", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "sejong", name: "세종특별자치시", shortName: "세종", path: "/areas/sejong", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "gangwon", name: "강원특별자치도", shortName: "강원", path: "/areas/gangwon", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "chungbuk", name: "충청북도", shortName: "충북", path: "/areas/chungbuk", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "chungnam", name: "충청남도", shortName: "충남", path: "/areas/chungnam", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "jeonbuk", name: "전북특별자치도", shortName: "전북", path: "/areas/jeonbuk", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "gyeongbuk", name: "경상북도", shortName: "경북", path: "/areas/gyeongbuk", availability: "development", scopeLabel: "서비스 준비 중" },
  { key: "gyeongnam", name: "경상남도", shortName: "경남", path: "/areas/gyeongnam", availability: "development", scopeLabel: "서비스 준비 중" },
];

const PROVINCE_BY_KEY = new Map(PROVINCES.map((province) => [province.key, province]));

export function decodeRegionSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function canonicalizeSegments(segments: readonly string[]): string[] {
  return segments.map((segment) => decodeRegionSegment(segment).normalize("NFC"));
}

export function regionPath(segments: readonly string[]): string {
  return `/areas/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

function hasPrefix(record: RegionRecord, segments: readonly string[]): boolean {
  return segments.every((segment, index) => record.pathSegments[index] === segment);
}

function kindForSegments(
  segments: readonly string[],
  matchingRecords: readonly RegionRecord[],
): RegionNodeKind {
  if (
    matchingRecords.some(
      (record) =>
        record.pathSegments.length === segments.length &&
        hasPrefix(record, segments),
    )
  ) {
    return "representative";
  }

  if (segments.length === 1) return "province";
  if (
    (segments[0] === "gyeonggi" || segments[0] === "jeju") &&
    segments.length === 2
  ) {
    return "municipality";
  }
  return "district";
}

function displayNameForNode(
  kind: RegionNodeKind,
  segments: readonly string[],
): string {
  if (kind === "province") {
    return PROVINCE_BY_KEY.get(segments[0] as SidoKey)?.name ?? segments[0];
  }
  return segments.at(-1) ?? "지역";
}

export function resolveRegionNode(inputSegments: readonly string[]): RegionNode | null {
  const segments = canonicalizeSegments(inputSegments);
  if (segments.length === 0 || segments.length > 4) return null;
  const province = PROVINCE_BY_KEY.get(segments[0] as SidoKey);
  if (!province) return null;

  if (province.availability === "development") {
    if (segments.length !== 1) return null;
    return {
      kind: "province",
      name: province.key,
      displayName: province.name,
      segments,
      path: province.path,
      availability: province.availability,
      records: [],
    };
  }

  const matchingRecords = REGIONS.filter((record) => hasPrefix(record, segments));
  if (matchingRecords.length === 0) return null;

  const exactRepresentative = matchingRecords.find(
    (record) => record.pathSegments.length === segments.length,
  );
  const kind = kindForSegments(segments, matchingRecords);

  return {
    kind,
    name: segments.at(-1) ?? "지역",
    displayName: displayNameForNode(kind, segments),
    segments,
    path: regionPath(segments),
    availability: province.availability,
    records: matchingRecords,
    representative: kind === "representative" ? exactRepresentative : undefined,
  };
}

export function getDirectChildren(node: RegionNode): RegionChild[] {
  if (node.kind === "representative") return [];

  const nextIndex = node.segments.length;
  const childNames = new Set(
    node.records
      .map((record) => record.pathSegments[nextIndex])
      .filter((name): name is string => Boolean(name)),
  );

  return [...childNames]
    .map((name) => {
      const segments = [...node.segments, name];
      const records = node.records.filter((record) => hasPrefix(record, segments));
      const kind = kindForSegments(segments, records);

      return {
        kind,
        name,
        path: regionPath(segments),
        representativeCount: records.length,
        sourceUnitCount: records.reduce(
          (count, record) => count + record.sourceNames.length,
          0,
        ),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ko"));
}

export function getRegionBreadcrumbs(
  node: RegionNode,
): Array<{ name: string; path: string }> {
  const crumbs: Array<{ name: string; path: string }> = [
    { name: "지역 찾기", path: "/areas" },
  ];

  for (let index = 1; index <= node.segments.length; index += 1) {
    const segments = node.segments.slice(0, index);
    const resolved = resolveRegionNode(segments);
    if (resolved) {
      crumbs.push({ name: resolved.displayName, path: resolved.path });
    }
  }

  return crumbs;
}

export function getAllRegionStaticParams(): Array<{ segments: string[] }> {
  const paths = new Map<string, string[]>();

  for (const province of PROVINCES) {
    const segments = [province.key];
    paths.set(JSON.stringify(segments), segments);
  }

  for (const region of REGIONS) {
    for (let length = 1; length <= region.pathSegments.length; length += 1) {
      const segments = region.pathSegments.slice(0, length);
      paths.set(JSON.stringify(segments), segments);
    }
  }

  return [...paths.values()].map((segments) => ({ segments }));
}

export function formatRegionContext(region: RegionRecord): string {
  const parts = [region.sidoName];
  if (region.municipality !== region.sidoName) parts.push(region.municipality);
  if (region.district) parts.push(region.district);
  return [...new Set(parts)].join(" · ");
}

export function formatNodeContext(node: RegionNode): string {
  const sample = node.records[0];
  if (!sample) {
    return PROVINCE_BY_KEY.get(node.segments[0] as SidoKey)?.name ?? "전국 지역 안내";
  }

  if (node.kind === "province") return node.displayName;
  if (node.kind === "representative" && node.representative) {
    return formatRegionContext(node.representative);
  }

  const parentNames = node.segments.slice(0, -1).map((segment, index) => {
    if (index === 0) {
      return PROVINCE_BY_KEY.get(segment as SidoKey)?.name ?? segment;
    }
    return segment;
  });
  return parentNames.join(" · ");
}

export function normalizeRegionQuery(value: string): string {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("ko-KR")
    .replace(/제(?=\d)/g, "")
    .replace(/[\s·.・,_-]+/g, "");
}

function bestMatchingName(region: RegionRecord, normalizedQuery: string): string {
  const candidates = [region.name, ...region.sourceNames];
  return (
    candidates.find((candidate) => normalizeRegionQuery(candidate) === normalizedQuery) ??
    candidates.find((candidate) =>
      normalizeRegionQuery(candidate).startsWith(normalizedQuery),
    ) ??
    candidates.find((candidate) =>
      normalizeRegionQuery(candidate).includes(normalizedQuery),
    ) ??
    region.name
  );
}

function searchScore(region: RegionRecord, query: string): number | null {
  const representative = normalizeRegionQuery(region.name);
  const sources = region.sourceNames.map(normalizeRegionQuery);
  const context = normalizeRegionQuery(
    [region.sidoName, region.municipality, region.district ?? ""].join(" "),
  );
  const full = normalizeRegionQuery(
    [
      region.sidoName,
      region.municipality,
      region.district ?? "",
      region.name,
      ...region.sourceNames,
    ].join(" "),
  );

  if (representative === query) return 0;
  if (sources.includes(query)) return 1;
  if (representative.startsWith(query)) return 2;
  if (sources.some((source) => source.startsWith(query))) return 3;
  if (representative.includes(query)) return 4;
  if (sources.some((source) => source.includes(query))) return 5;
  if (context.includes(query) || full.includes(query)) return 6;
  return null;
}

export function searchRegions(
  queryValue: string,
  limit = 12,
): RegionSearchResult[] {
  const query = normalizeRegionQuery(queryValue);
  if (query.length === 0) return [];

  return REGIONS.map((region) => ({
    region,
    score: searchScore(region, query),
  }))
    .filter(
      (entry): entry is { region: RegionRecord; score: number } =>
        entry.score !== null,
    )
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.region.name.localeCompare(right.region.name, "ko") ||
        formatRegionContext(left.region).localeCompare(
          formatRegionContext(right.region),
          "ko",
        ),
    )
    .slice(0, Math.max(0, limit))
    .map(({ region }) => {
      const matchedName = bestMatchingName(region, query);
      return {
        id: region.id,
        representativeName: region.name,
        matchedName,
        isAliasMatch:
          normalizeRegionQuery(matchedName) !== normalizeRegionQuery(region.name),
        context: formatRegionContext(region),
        path: region.path,
        sourceNames: region.sourceNames,
      };
    });
}
