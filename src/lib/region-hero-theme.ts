import type { CSSProperties } from "react";

import generatedLedger from "@/data/region-hero-themes.generated.json";

export const REGION_HERO_THEME_SCHEMA_VERSION =
  "massagebom-region-hero-theme-v1" as const;

/**
 * The Seoul root is the owner-approved visual pilot that predates the bulk
 * 250-image assignment. Keep its reviewed MBH-174 image/header pairing pinned
 * while leaving the generated rollout ledger immutable for auditability.
 */
export const APPROVED_SEOUL_PILOT = {
  imageId: "MBH-174",
  route: "/areas/seoul",
} as const;

export const PARTIAL_250_REGION_HERO_CONTRACT = {
  campaignId: "massagebom-region-hero-345-v1",
  assignmentLedgerSha256:
    "52a6f958f6298b696c0976899adb4eb713c2502c17a7e94f66be69c87abf6987",
  refinementReceiptSha256:
    "7edcbbc24ed729983fb5adccd4cb82cb8468dc1389305e5cf3e2ac1ab4434b61",
  publicDeploymentManifestSha256:
    "ce39780cdd9e224682b3ea82530ef7f73afc01b6fb12bb99857b618e669f8fed",
  themeLedgerDigest:
    "97dbb3f883546d6fbf0e6a71465701edbdcef8858ceb956104e4a90a8863d993",
  routeProjectionFingerprint: "05a99a20fbeabb0c",
  imageCount: 250,
  routeCount: 1291,
  preservedBaseRouteCount: 862,
  addedRouteCount: 429,
  usedFiveTimes: 209,
  usedSixTimes: 41,
  serviceRootRouteCounts: {
    asan: 13,
    busan: 122,
    cheonan: 28,
    daegu: 96,
    daejeon: 72,
    gyeonggi: 504,
    gumi: 24,
    incheon: 96,
    jeju: 42,
    pohang: 32,
    seoul: 262,
  },
  variantDimensions: {
    desktop: { height: 922, width: 2048 },
    mobile: { height: 2048, width: 1024 },
    tablet: { height: 1024, width: 1536 },
  },
} as const;

/**
 * Temporary owner-approved rollout for the eight newly added service roots.
 * The original 862 routes remain on the frozen base250 records; only the
 * other 429 routes use the finalized completion095 images.  Extension-076 is
 * intentionally absent and remains reserved for a later 2-3-use rollout.
 */
export const TEMPORARY_COMPLETION095_REGION_HERO_CONTRACT = {
  campaignId:
    "massagebom-region-hero-composite-345-completion095-temporary-v1",
  assignmentLedgerSha256:
    "ec3534bedf60159ce263a28ebaa70685d57444e272ee44828142997fdd73dfb2",
  refinementReceiptSha256:
    "aaaaff41e6c3856dc889fa69f287f8fd26764aa3efa23b083f587fe008fa243d",
  publicDeploymentManifestSha256:
    "0d74773166d961053b3e9561ff2b190c7567ab97f07d1dbfaa125281feb5b60d",
  themeLedgerDigest:
    "1f8d83e9fc6fa07f9f805fab288779b19397b2b33f49d2f9c8fb38db2136dd8d",
  routeProjectionFingerprint: "ea370760c80c915c",
  imageCount: 345,
  routeCount: 1291,
  preservedBaseImageCount: 250,
  preservedLegacyRouteCount: 862,
  temporaryImageCount: 95,
  temporaryRouteCount: 429,
  temporaryUsedFourTimes: 46,
  temporaryUsedFiveTimes: 49,
  legacyUsedThreeTimes: 138,
  legacyUsedFourTimes: 112,
  serviceRootRouteCounts: {
    asan: 13,
    busan: 122,
    cheonan: 28,
    daegu: 96,
    daejeon: 72,
    gumi: 24,
    incheon: 96,
    jeju: 42,
    pohang: 32,
    seoul: 262,
    gyeonggi: 504,
  },
  variantDimensions: {
    desktop: { height: 922, width: 2048 },
    mobile: { height: 2048, width: 1024 },
    tablet: { height: 1024, width: 1536 },
  },
} as const;

export const UNDERUSED345_TEMPORARY_V2_REGION_HERO_CONTRACT = {
  campaignId: "massagebom-region-hero-composite-345-underused-temporary-v2",
  assignmentLedgerSha256:
    "9f7978e62c705c3dd75e8090e162193a4e2c688cc8dcd47d684f67e8454cc788",
  refinementReceiptSha256:
    "aaaaff41e6c3856dc889fa69f287f8fd26764aa3efa23b083f587fe008fa243d",
  publicDeploymentManifestSha256:
    "0d74773166d961053b3e9561ff2b190c7567ab97f07d1dbfaa125281feb5b60d",
  themeLedgerDigest:
    "30847d639f5e9c1351ef1136085f2cedd0b0a65fe19ad2d5f8fc64da2d712f88",
  routeProjectionFingerprint: "b3e8addeb2199c52",
  imageCount: 345,
  routeCount: 1291,
  preservedLegacyRouteCount: 862,
  addedRouteCount: 429,
  globallyUsedThreeTimes: 89,
  globallyUsedFourTimes: 256,
  globalMaxReuse: 4,
  serviceRootRouteCounts: {
    asan: 13,
    busan: 122,
    cheonan: 28,
    daegu: 96,
    daejeon: 72,
    gumi: 24,
    incheon: 96,
    jeju: 42,
    pohang: 32,
    seoul: 262,
    gyeonggi: 504,
  },
  variantDimensions: {
    desktop: { height: 922, width: 2048 },
    mobile: { height: 2048, width: 1024 },
    tablet: { height: 1024, width: 1536 },
  },
} as const;

export type RegionHeroVariantName = "desktop" | "tablet" | "mobile";

export type RegionHeroPalette = {
  family: {
    id: string;
    label_ko: string;
  };
  base: {
    hex: string;
    hsl: [number, number, number];
    luminance: number;
    rgb: [number, number, number];
  };
  derived: {
    accent: string;
    accent_glow: string;
    border: string;
    gradient_end: string;
    gradient_mid: string;
    gradient_start: string;
    muted_text: string;
    overlay: string;
    text: string;
  };
  contrast: {
    accent_min: number;
    text_min: number;
  };
  sample: {
    excluded_highlight_count: number;
    pixel_count: number;
    top_band_fraction: number;
  };
};

export type RegionHeroImageVariant = {
  height: number;
  public_path: string;
  sha256: string;
  width: number;
};

export type RegionHeroThemeImage = {
  analyzer_version: string;
  image_id: string;
  palettes: Record<RegionHeroVariantName, RegionHeroPalette>;
  source_sha256: string;
  variants: Record<RegionHeroVariantName, RegionHeroImageVariant>;
};

export type RegionHeroThemeLedger = {
  assignment_ledger_sha256: string | null;
  campaign_id: string;
  digest: string | null;
  generated_at: string | null;
  images: Record<string, RegionHeroThemeImage>;
  preview_only: boolean;
  public_deployment_manifest_sha256: string | null;
  refinement_receipt_sha256: string | null;
  routes: Record<string, string>;
  schema_version: typeof REGION_HERO_THEME_SCHEMA_VERSION;
};

export type ResolvedRegionHeroTheme = {
  canonicalPath: string;
  image: RegionHeroThemeImage;
  imageId: string;
};

export type RegionHeaderStyle = CSSProperties &
  Record<`--region-header-${string}`, string>;

/**
 * These image-derived families produced the flat brown/taupe bars the owner
 * rejected. Keep the hero itself untouched, but normalize the header chrome
 * to the same deep-forest/blossom language used by the approved home header.
 */
export const REGION_HEADER_DEEP_FOREST_FAMILIES = [
  "neutral-taupe",
  "amber-walnut",
  "beige-gold",
  "warm-ivory",
  "olive",
] as const;

export const REGION_HEADER_DEEP_FOREST_THEME = {
  accent: "#f8dce1",
  accentGlow: "rgba(251, 189, 194, 0.14)",
  border: "rgba(253, 236, 230, 0.20)",
  end: "#11170f",
  mid: "#090f09",
  start: "#020704",
  text: "#fffaf4",
} as const;

const REGION_HEADER_DEEP_FOREST_FAMILY_SET = new Set<string>(
  REGION_HEADER_DEEP_FOREST_FAMILIES,
);

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const HEX_COLOR_PATTERN = /^#[a-f0-9]{6}$/i;
const CSS_RGBA_PATTERN = /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (?:0|1|0?\.\d+)\)$/;
const PARTIAL_250_IMAGE_ID_PATTERN = /^MBH-(?:00[1-9]|0[1-9]\d|1\d{2}|2[0-4]\d|250)$/;
const PARTIAL_250_PUBLIC_PATH_PATTERN =
  /^\/images\/region-heroes\/partial-250-v1\/(MBH-\d{3})\/(desktop|tablet|mobile)\.webp$/;
const TEMPORARY_COMPLETION095_IMAGE_ID_PATTERN =
  /^MBH-(?:00[1-9]|0[1-9]\d|[12]\d{2}|3[0-3]\d|34[0-5])$/;
const TEMPORARY_COMPLETION095_PUBLIC_PATH_PATTERN =
  /^\/images\/region-heroes\/(partial-250-v1|completion-095-v1)\/(MBH-\d{3})\/(desktop|tablet|mobile)\.webp$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSha256(value: unknown): value is string {
  return typeof value === "string" && SHA256_PATTERN.test(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([key, entry]) => [key, stableValue(entry)]),
    );
  }
  return value;
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function stableJson(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

function routeProjectionFingerprint(routes: Record<string, string>): string {
  const serialized = JSON.stringify(
    Object.entries(routes).sort(([left], [right]) =>
      left.localeCompare(right, "en"),
    ),
  );
  const bytes = new TextEncoder().encode(serialized);
  const fingerprint = (seed: number) => {
    let hash = seed >>> 0;
    for (const byte of bytes) {
      hash ^= byte;
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  };
  return `${fingerprint(0x811c9dc5)}${fingerprint(0x9e3779b9)}`;
}

function isRgbTuple(value: unknown): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255,
    )
  );
}

function isHslTuple(value: unknown): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(isFiniteNumber) &&
    value[0] >= 0 &&
    value[0] <= 360 &&
    value[1] >= 0 &&
    value[1] <= 100 &&
    value[2] >= 0 &&
    value[2] <= 100
  );
}

function isPublicAssetPath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("..") &&
    !value.includes("?") &&
    !value.includes("#")
  );
}

function isPalette(value: unknown): value is RegionHeroPalette {
  if (
    !isRecord(value) ||
    !isRecord(value.family) ||
    !isRecord(value.base) ||
    !isRecord(value.derived) ||
    !isRecord(value.contrast) ||
    !isRecord(value.sample)
  ) {
    return false;
  }
  const derived = value.derived;
  return (
    typeof value.family.id === "string" &&
    value.family.id.length > 0 &&
    typeof value.family.label_ko === "string" &&
    value.family.label_ko.length > 0 &&
    typeof value.base.hex === "string" &&
    HEX_COLOR_PATTERN.test(value.base.hex) &&
    isRgbTuple(value.base.rgb) &&
    isHslTuple(value.base.hsl) &&
    isFiniteNumber(value.base.luminance) &&
    value.base.luminance >= 0 &&
    value.base.luminance <= 1 &&
    [
      derived.accent,
      derived.gradient_end,
      derived.gradient_mid,
      derived.gradient_start,
      derived.muted_text,
      derived.text,
    ].every((color) => typeof color === "string" && HEX_COLOR_PATTERN.test(color)) &&
    typeof derived.accent_glow === "string" &&
    CSS_RGBA_PATTERN.test(derived.accent_glow) &&
    typeof derived.border === "string" &&
    CSS_RGBA_PATTERN.test(derived.border) &&
    typeof derived.overlay === "string" &&
    derived.overlay.startsWith("linear-gradient(") &&
    isFiniteNumber(value.contrast.accent_min) &&
    value.contrast.accent_min >= 3 &&
    isFiniteNumber(value.contrast.text_min) &&
    value.contrast.text_min >= 4.5 &&
    Number.isInteger(value.sample.excluded_highlight_count) &&
    Number(value.sample.excluded_highlight_count) >= 0 &&
    Number.isInteger(value.sample.pixel_count) &&
    Number(value.sample.pixel_count) >= 64 &&
    isFiniteNumber(value.sample.top_band_fraction) &&
    value.sample.top_band_fraction > 0 &&
    value.sample.top_band_fraction <= 0.5
  );
}

function isVariant(value: unknown): value is RegionHeroImageVariant {
  return (
    isRecord(value) &&
    Number.isInteger(value.width) &&
    Number(value.width) > 0 &&
    Number.isInteger(value.height) &&
    Number(value.height) > 0 &&
    isPublicAssetPath(value.public_path) &&
    isSha256(value.sha256)
  );
}

function isThemeImage(value: unknown, expectedId: string): value is RegionHeroThemeImage {
  if (
    !isRecord(value) ||
    value.image_id !== expectedId ||
    typeof value.analyzer_version !== "string" ||
    !isSha256(value.source_sha256) ||
    !isRecord(value.variants) ||
    !isRecord(value.palettes)
  ) {
    return false;
  }

  const variants = value.variants;
  const palettes = value.palettes;

  return (["desktop", "tablet", "mobile"] as const).every(
    (profile) =>
      isVariant(variants[profile]) && isPalette(palettes[profile]),
  );
}

export function validateRegionHeroThemeLedger(
  value: unknown,
): value is RegionHeroThemeLedger {
  if (
    !isRecord(value) ||
    value.schema_version !== REGION_HERO_THEME_SCHEMA_VERSION ||
    typeof value.campaign_id !== "string" ||
    typeof value.preview_only !== "boolean" ||
    !isRecord(value.images) ||
    !isRecord(value.routes) ||
    !(
      value.assignment_ledger_sha256 === null ||
      isSha256(value.assignment_ledger_sha256)
    ) ||
    !(
      value.refinement_receipt_sha256 === null ||
      isSha256(value.refinement_receipt_sha256)
    ) ||
    !(value.digest === null || isSha256(value.digest)) ||
    !(
      value.public_deployment_manifest_sha256 === null ||
      value.public_deployment_manifest_sha256 === undefined ||
      isSha256(value.public_deployment_manifest_sha256)
    ) ||
    !(value.generated_at === null || typeof value.generated_at === "string")
  ) {
    return false;
  }

  for (const [imageId, image] of Object.entries(value.images)) {
    if (!isThemeImage(image, imageId)) return false;
  }

  for (const [route, imageId] of Object.entries(value.routes)) {
    if (
      canonicalizeRegionPath(route) !== route ||
      typeof imageId !== "string" ||
      !(imageId in value.images)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Deployment gate for the owner-approved MBH-001..250 rollout across every
 * active service route. The original 862 bindings stay byte-for-byte stable;
 * an audited expansion assignment adds the 429 grouped service routes.
 *
 * Preview ledgers deliberately do not pass this contract. The optional route
 * list lets tests and release tooling bind the generic theme ledger to the
 * application's exact active route graph without pulling that graph into the
 * client-side header bundle.
 */
export function validatePartial250RegionHeroContract(
  value: unknown,
  expectedActiveRoutes?: readonly string[],
): value is RegionHeroThemeLedger {
  if (!validateRegionHeroThemeLedger(value) || value.preview_only) return false;

  const contract = PARTIAL_250_REGION_HERO_CONTRACT;
  const imageEntries = Object.entries(value.images);
  const routeEntries = Object.entries(value.routes);
  if (
    value.campaign_id !== contract.campaignId ||
    value.assignment_ledger_sha256 !== contract.assignmentLedgerSha256 ||
    value.refinement_receipt_sha256 !== contract.refinementReceiptSha256 ||
    value.public_deployment_manifest_sha256 !==
      contract.publicDeploymentManifestSha256 ||
    value.digest !== contract.themeLedgerDigest ||
    !value.generated_at ||
    imageEntries.length !== contract.imageCount ||
    routeEntries.length !== contract.routeCount ||
    routeProjectionFingerprint(value.routes) !==
      contract.routeProjectionFingerprint
  ) {
    return false;
  }

  const expectedImageIds = new Set(
    Array.from(
      { length: contract.imageCount },
      (_, index) => `MBH-${String(index + 1).padStart(3, "0")}`,
    ),
  );
  const sourceHashes = new Set<string>();
  const variantHashes = new Set<string>();

  for (const [imageId, image] of imageEntries) {
    if (
      !PARTIAL_250_IMAGE_ID_PATTERN.test(imageId) ||
      !expectedImageIds.delete(imageId)
    ) {
      return false;
    }
    sourceHashes.add(image.source_sha256);

    for (const profile of ["desktop", "tablet", "mobile"] as const) {
      const variant = image.variants[profile];
      const match = PARTIAL_250_PUBLIC_PATH_PATTERN.exec(variant.public_path);
      const dimensions = contract.variantDimensions[profile];
      if (
        !match ||
        match[1] !== imageId ||
        match[2] !== profile ||
        variant.width !== dimensions.width ||
        variant.height !== dimensions.height
      ) {
        return false;
      }
      variantHashes.add(variant.sha256);
    }
  }

  if (
    expectedImageIds.size !== 0 ||
    sourceHashes.size !== contract.imageCount ||
    variantHashes.size !== contract.imageCount * 3
  ) {
    return false;
  }

  const reuseCounts = new Map<string, number>();
  const serviceRootCounts = Object.fromEntries(
    Object.keys(contract.serviceRootRouteCounts).map((root) => [root, 0]),
  ) as Record<keyof typeof contract.serviceRootRouteCounts, number>;
  for (const [route, imageId] of routeEntries) {
    const root = /^\/areas\/([^/]+)(?:\/|$)/u.exec(route)?.[1] as
      | keyof typeof serviceRootCounts
      | undefined;
    if (!root || !(root in serviceRootCounts)) return false;
    serviceRootCounts[root] += 1;
    reuseCounts.set(imageId, (reuseCounts.get(imageId) ?? 0) + 1);
  }

  const usedFiveTimes = [...reuseCounts.values()].filter(
    (count) => count === 5,
  ).length;
  const usedSixTimes = [...reuseCounts.values()].filter(
    (count) => count === 6,
  ).length;
  if (
    reuseCounts.size !== contract.imageCount ||
    usedFiveTimes !== contract.usedFiveTimes ||
    usedSixTimes !== contract.usedSixTimes ||
    [...reuseCounts.values()].some((count) => count !== 5 && count !== 6) ||
    Object.entries(contract.serviceRootRouteCounts).some(
      ([root, count]) =>
        serviceRootCounts[root as keyof typeof serviceRootCounts] !== count,
    )
  ) {
    return false;
  }

  if (expectedActiveRoutes) {
    const canonicalExpected = expectedActiveRoutes.map(canonicalizeRegionPath);
    if (
      canonicalExpected.length !== contract.routeCount ||
      canonicalExpected.some((route) => route === null) ||
      new Set(canonicalExpected).size !== contract.routeCount
    ) {
      return false;
    }
    const expectedRoutes = canonicalExpected as string[];
    const actualRoutes = new Set(Object.keys(value.routes));
    if (expectedRoutes.some((route) => !actualRoutes.has(route))) return false;
  }

  return true;
}

/** Build/release check that also recomputes the immutable ledger digest. */
export async function verifyPartial250RegionHeroLedgerDigest(
  value: unknown,
): Promise<boolean> {
  if (!validatePartial250RegionHeroContract(value)) return false;
  const ledger = value as RegionHeroThemeLedger;
  const unsigned = { ...ledger, digest: undefined };
  return (await sha256Hex(stableJson(unsigned))) === ledger.digest;
}

/** Fail-closed contract for the temporary 95-image service-city rollout. */
export function validateTemporaryCompletion095RegionHeroContract(
  value: unknown,
  expectedActiveRoutes?: readonly string[],
): value is RegionHeroThemeLedger {
  if (!validateRegionHeroThemeLedger(value) || value.preview_only) return false;

  const contract = TEMPORARY_COMPLETION095_REGION_HERO_CONTRACT;
  const imageEntries = Object.entries(value.images);
  const routeEntries = Object.entries(value.routes);
  if (
    value.campaign_id !== contract.campaignId ||
    value.assignment_ledger_sha256 !== contract.assignmentLedgerSha256 ||
    value.refinement_receipt_sha256 !== contract.refinementReceiptSha256 ||
    value.public_deployment_manifest_sha256 !==
      contract.publicDeploymentManifestSha256 ||
    value.digest !== contract.themeLedgerDigest ||
    !value.generated_at ||
    imageEntries.length !== contract.imageCount ||
    routeEntries.length !== contract.routeCount ||
    routeProjectionFingerprint(value.routes) !==
      contract.routeProjectionFingerprint
  ) {
    return false;
  }

  const expectedImageIds = new Set(
    Array.from(
      { length: contract.imageCount },
      (_, index) => `MBH-${String(index + 1).padStart(3, "0")}`,
    ),
  );
  const sourceHashes = new Set<string>();
  const variantHashes = new Set<string>();
  for (const [imageId, image] of imageEntries) {
    if (
      !TEMPORARY_COMPLETION095_IMAGE_ID_PATTERN.test(imageId) ||
      !expectedImageIds.delete(imageId)
    ) {
      return false;
    }
    const numericId = Number(imageId.slice(4));
    sourceHashes.add(image.source_sha256);
    for (const profile of ["desktop", "tablet", "mobile"] as const) {
      const variant = image.variants[profile];
      const match = TEMPORARY_COMPLETION095_PUBLIC_PATH_PATTERN.exec(
        variant.public_path,
      );
      const dimensions = contract.variantDimensions[profile];
      const expectedBatch =
        numericId <= contract.preservedBaseImageCount
          ? "partial-250-v1"
          : "completion-095-v1";
      if (
        !match ||
        match[1] !== expectedBatch ||
        match[2] !== imageId ||
        match[3] !== profile ||
        variant.width !== dimensions.width ||
        variant.height !== dimensions.height
      ) {
        return false;
      }
      variantHashes.add(variant.sha256);
    }
  }
  if (
    expectedImageIds.size !== 0 ||
    sourceHashes.size !== contract.imageCount ||
    variantHashes.size !== contract.imageCount * 3
  ) {
    return false;
  }

  const legacyReuse = new Map<string, number>();
  const temporaryReuse = new Map<string, number>();
  const serviceRootCounts = Object.fromEntries(
    Object.keys(contract.serviceRootRouteCounts).map((root) => [root, 0]),
  ) as Record<keyof typeof contract.serviceRootRouteCounts, number>;
  for (const [route, imageId] of routeEntries) {
    const root = /^\/areas\/([^/]+)(?:\/|$)/u.exec(route)?.[1] as
      | keyof typeof serviceRootCounts
      | undefined;
    if (!root || !(root in serviceRootCounts)) return false;
    serviceRootCounts[root] += 1;
    const target =
      Number(imageId.slice(4)) <= contract.preservedBaseImageCount
        ? legacyReuse
        : temporaryReuse;
    target.set(imageId, (target.get(imageId) ?? 0) + 1);
  }
  if (
    legacyReuse.size !== contract.preservedBaseImageCount ||
    [...legacyReuse.values()].filter((count) => count === 3).length !==
      contract.legacyUsedThreeTimes ||
    [...legacyReuse.values()].filter((count) => count === 4).length !==
      contract.legacyUsedFourTimes ||
    [...legacyReuse.values()].some((count) => count !== 3 && count !== 4) ||
    temporaryReuse.size !== contract.temporaryImageCount ||
    [...temporaryReuse.values()].filter((count) => count === 4).length !==
      contract.temporaryUsedFourTimes ||
    [...temporaryReuse.values()].filter((count) => count === 5).length !==
      contract.temporaryUsedFiveTimes ||
    [...temporaryReuse.values()].some((count) => count !== 4 && count !== 5) ||
    Object.entries(contract.serviceRootRouteCounts).some(
      ([root, count]) =>
        serviceRootCounts[root as keyof typeof serviceRootCounts] !== count,
    )
  ) {
    return false;
  }

  if (expectedActiveRoutes) {
    const canonicalExpected = expectedActiveRoutes.map(canonicalizeRegionPath);
    if (
      canonicalExpected.length !== contract.routeCount ||
      canonicalExpected.some((route) => route === null) ||
      new Set(canonicalExpected).size !== contract.routeCount
    ) {
      return false;
    }
    const actualRoutes = new Set(Object.keys(value.routes));
    if (
      (canonicalExpected as string[]).some((route) => !actualRoutes.has(route))
    ) {
      return false;
    }
  }
  return true;
}

export async function verifyTemporaryCompletion095RegionHeroLedgerDigest(
  value: unknown,
): Promise<boolean> {
  if (!validateTemporaryCompletion095RegionHeroContract(value)) return false;
  const ledger = value as RegionHeroThemeLedger;
  const unsigned = { ...ledger, digest: undefined };
  return (await sha256Hex(stableJson(unsigned))) === ledger.digest;
}

/** Strict runtime gate for the user-revised max-four temporary rollout. */
export function validateUnderused345TemporaryV2RegionHeroContract(
  value: unknown,
  expectedActiveRoutes?: readonly string[],
): value is RegionHeroThemeLedger {
  if (!validateRegionHeroThemeLedger(value) || value.preview_only) return false;
  const contract = UNDERUSED345_TEMPORARY_V2_REGION_HERO_CONTRACT;
  const imageEntries = Object.entries(value.images);
  const routeEntries = Object.entries(value.routes);
  if (
    value.campaign_id !== contract.campaignId ||
    value.assignment_ledger_sha256 !== contract.assignmentLedgerSha256 ||
    value.refinement_receipt_sha256 !== contract.refinementReceiptSha256 ||
    value.public_deployment_manifest_sha256 !==
      contract.publicDeploymentManifestSha256 ||
    value.digest !== contract.themeLedgerDigest ||
    !value.generated_at ||
    imageEntries.length !== contract.imageCount ||
    routeEntries.length !== contract.routeCount ||
    routeProjectionFingerprint(value.routes) !==
      contract.routeProjectionFingerprint
  ) {
    return false;
  }

  const expectedImageIds = new Set(
    Array.from(
      { length: contract.imageCount },
      (_, index) => `MBH-${String(index + 1).padStart(3, "0")}`,
    ),
  );
  const sourceHashes = new Set<string>();
  const variantHashes = new Set<string>();
  for (const [imageId, image] of imageEntries) {
    if (
      !TEMPORARY_COMPLETION095_IMAGE_ID_PATTERN.test(imageId) ||
      !expectedImageIds.delete(imageId)
    ) {
      return false;
    }
    sourceHashes.add(image.source_sha256);
    const numericId = Number(imageId.slice(4));
    for (const profile of ["desktop", "tablet", "mobile"] as const) {
      const variant = image.variants[profile];
      const match = TEMPORARY_COMPLETION095_PUBLIC_PATH_PATTERN.exec(
        variant.public_path,
      );
      const dimensions = contract.variantDimensions[profile];
      const expectedBatch =
        numericId <= 250 ? "partial-250-v1" : "completion-095-v1";
      if (
        !match ||
        match[1] !== expectedBatch ||
        match[2] !== imageId ||
        match[3] !== profile ||
        variant.width !== dimensions.width ||
        variant.height !== dimensions.height
      ) {
        return false;
      }
      variantHashes.add(variant.sha256);
    }
  }
  if (
    expectedImageIds.size !== 0 ||
    sourceHashes.size !== contract.imageCount ||
    variantHashes.size !== contract.imageCount * 3
  ) {
    return false;
  }

  const reuse = new Map<string, number>();
  const serviceRootCounts = Object.fromEntries(
    Object.keys(contract.serviceRootRouteCounts).map((root) => [root, 0]),
  ) as Record<keyof typeof contract.serviceRootRouteCounts, number>;
  for (const [route, imageId] of routeEntries) {
    const root = /^\/areas\/([^/]+)(?:\/|$)/u.exec(route)?.[1] as
      | keyof typeof serviceRootCounts
      | undefined;
    if (!root || !(root in serviceRootCounts)) return false;
    serviceRootCounts[root] += 1;
    reuse.set(imageId, (reuse.get(imageId) ?? 0) + 1);
  }
  if (
    reuse.size !== contract.imageCount ||
    Math.max(...reuse.values()) !== contract.globalMaxReuse ||
    [...reuse.values()].filter((count) => count === 3).length !==
      contract.globallyUsedThreeTimes ||
    [...reuse.values()].filter((count) => count === 4).length !==
      contract.globallyUsedFourTimes ||
    [...reuse.values()].some((count) => count !== 3 && count !== 4) ||
    Object.entries(contract.serviceRootRouteCounts).some(
      ([root, count]) =>
        serviceRootCounts[root as keyof typeof serviceRootCounts] !== count,
    )
  ) {
    return false;
  }
  if (expectedActiveRoutes) {
    const canonicalExpected = expectedActiveRoutes.map(canonicalizeRegionPath);
    if (
      canonicalExpected.length !== contract.routeCount ||
      canonicalExpected.some((route) => route === null) ||
      new Set(canonicalExpected).size !== contract.routeCount
    ) {
      return false;
    }
    const actualRoutes = new Set(Object.keys(value.routes));
    if (
      (canonicalExpected as string[]).some((route) => !actualRoutes.has(route))
    ) {
      return false;
    }
  }
  return true;
}

export async function verifyUnderused345TemporaryV2RegionHeroLedgerDigest(
  value: unknown,
): Promise<boolean> {
  if (!validateUnderused345TemporaryV2RegionHeroContract(value)) return false;
  const ledger = value as RegionHeroThemeLedger;
  const unsigned = { ...ledger, digest: undefined };
  return (await sha256Hex(stableJson(unsigned))) === ledger.digest;
}

export function canonicalizeRegionPath(pathname: string): string | null {
  const withoutQuery = pathname.split(/[?#]/u, 1)[0];
  const rawSegments = withoutQuery.split("/").filter(Boolean);
  if (rawSegments.length < 2 || rawSegments[0] !== "areas") return null;

  try {
    const segments = rawSegments.map((segment) =>
      encodeURIComponent(decodeURIComponent(segment).normalize("NFC")),
    );
    return `/${segments.join("/")}`;
  } catch {
    return null;
  }
}

const EMPTY_LEDGER: RegionHeroThemeLedger = {
  assignment_ledger_sha256: null,
  campaign_id: "massagebom-region-hero-345-v1",
  digest: null,
  generated_at: null,
  images: {},
  preview_only: false,
  public_deployment_manifest_sha256: null,
  refinement_receipt_sha256: null,
  routes: {},
  schema_version: REGION_HERO_THEME_SCHEMA_VERSION,
};

export const REGION_HERO_THEME_LEDGER: RegionHeroThemeLedger =
  validateRegionHeroThemeLedger(generatedLedger) &&
  (generatedLedger.preview_only ||
    validatePartial250RegionHeroContract(generatedLedger) ||
    validateUnderused345TemporaryV2RegionHeroContract(generatedLedger))
    ? generatedLedger
    : EMPTY_LEDGER;

export function resolveRegionHeroTheme(
  pathname: string | null | undefined,
  ledger: RegionHeroThemeLedger = REGION_HERO_THEME_LEDGER,
): ResolvedRegionHeroTheme | null {
  if (
    !pathname ||
    (ledger.preview_only && process.env.NODE_ENV === "production") ||
    (ledger !== REGION_HERO_THEME_LEDGER &&
      !validateRegionHeroThemeLedger(ledger))
  ) {
    return null;
  }
  const canonicalPath = canonicalizeRegionPath(pathname);
  if (!canonicalPath) return null;
  const imageId =
    ledger === REGION_HERO_THEME_LEDGER &&
    canonicalPath === APPROVED_SEOUL_PILOT.route &&
    APPROVED_SEOUL_PILOT.imageId in ledger.images
      ? APPROVED_SEOUL_PILOT.imageId
      : ledger.routes[canonicalPath];
  const image = imageId ? ledger.images[imageId] : undefined;
  return imageId && image ? { canonicalPath, image, imageId } : null;
}

function hexToRgb(value: string): [number, number, number] | null {
  if (!HEX_COLOR_PATTERN.test(value)) return null;
  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ];
}

/**
 * A few palettes are labelled charcoal even though their generated header
 * ramp is visibly brown. Catch only those warm charcoal ramps; true neutral,
 * blue, green and approved blue-grey/Seoul palettes remain image-derived.
 */
export function shouldUseDeepForestRegionHeader(
  palette: RegionHeroPalette,
): boolean {
  if (REGION_HEADER_DEEP_FOREST_FAMILY_SET.has(palette.family.id)) return true;
  if (palette.family.id !== "charcoal") return false;

  const end = hexToRgb(palette.derived.gradient_end);
  if (!end) return false;
  const [red, green, blue] = end;
  return red >= green && green >= blue && red - blue >= 8;
}

export function buildRegionHeaderStyle(
  image: RegionHeroThemeImage,
): RegionHeaderStyle {
  const style = {} as RegionHeaderStyle;
  for (const profile of ["desktop", "tablet", "mobile"] as const) {
    const palette = image.palettes[profile];
    const deepForest = shouldUseDeepForestRegionHeader(palette);
    style[`--region-header-${profile}-start`] = deepForest
      ? REGION_HEADER_DEEP_FOREST_THEME.start
      : palette.derived.gradient_start;
    style[`--region-header-${profile}-mid`] = deepForest
      ? REGION_HEADER_DEEP_FOREST_THEME.mid
      : palette.derived.gradient_mid;
    style[`--region-header-${profile}-end`] = deepForest
      ? REGION_HEADER_DEEP_FOREST_THEME.end
      : palette.derived.gradient_end;
    style[`--region-header-${profile}-accent`] = deepForest
      ? REGION_HEADER_DEEP_FOREST_THEME.accent
      : palette.derived.accent;
    style[`--region-header-${profile}-accent-glow`] =
      deepForest
        ? REGION_HEADER_DEEP_FOREST_THEME.accentGlow
        : palette.derived.accent_glow;
    style[`--region-header-${profile}-border`] = deepForest
      ? REGION_HEADER_DEEP_FOREST_THEME.border
      : palette.derived.border;
    style[`--region-header-${profile}-text`] = deepForest
      ? REGION_HEADER_DEEP_FOREST_THEME.text
      : palette.derived.text;
  }
  return style;
}
