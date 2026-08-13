import {
  getAllRegionStaticParams,
  resolveRegionNode,
  type RegionNode,
} from "./regions";

/**
 * The first production release contained exactly these 862 Seoul, Incheon,
 * and Gyeonggi routes. Their sorted positions are part of the copy contract:
 * several deterministic copy generators use the position as a mixed-radix
 * variation seed. New provinces must therefore be appended to the profile
 * space instead of being allowed to shift an already published route.
 */
export const LEGACY_ACTIVE_REGION_PAGE_COUNT = 862 as const;

const LEGACY_ROOTS = new Set(["seoul", "incheon", "gyeonggi"]);

function isRenderableActiveNode(
  node: RegionNode | null,
): node is RegionNode {
  return (
    node !== null &&
    node.availability === "active" &&
    node.records.length > 0
  );
}

const ACTIVE_NODES = getAllRegionStaticParams()
  .map(({ segments }) => resolveRegionNode(segments))
  .filter(isRenderableActiveNode);

const LEGACY_PATHS = ACTIVE_NODES
  .filter((node) => LEGACY_ROOTS.has(node.segments[0]))
  .map((node) => node.path)
  .sort((left, right) => left.localeCompare(right));

if (
  LEGACY_PATHS.length !== LEGACY_ACTIVE_REGION_PAGE_COUNT ||
  new Set(LEGACY_PATHS).size !== LEGACY_ACTIVE_REGION_PAGE_COUNT
) {
  throw new Error("LEGACY_REGION_PROFILE_INDEX_INTEGRITY_FAILURE");
}

const NEW_PATHS = ACTIVE_NODES
  .filter((node) => !LEGACY_ROOTS.has(node.segments[0]))
  .map((node) => node.path)
  .sort((left, right) => left.localeCompare(right));

export const ACTIVE_REGION_PAGE_COUNT =
  LEGACY_PATHS.length + NEW_PATHS.length;

const ACTIVE_REGION_PROFILE_INDEX = new Map<string, number>([
  ...LEGACY_PATHS.map(
    (path, index) => [path, index] as const,
  ),
  ...NEW_PATHS.map(
    (path, index) =>
      [path, LEGACY_ACTIVE_REGION_PAGE_COUNT + index] as const,
  ),
]);

if (
  ACTIVE_REGION_PROFILE_INDEX.size !== ACTIVE_REGION_PAGE_COUNT ||
  ACTIVE_REGION_PAGE_COUNT !== ACTIVE_NODES.length
) {
  throw new Error("ACTIVE_REGION_PROFILE_INDEX_INTEGRITY_FAILURE");
}

export function getRegionProfileIndex(path: string): number {
  const index = ACTIVE_REGION_PROFILE_INDEX.get(path);
  if (index === undefined) {
    throw new Error(`REGION_PROFILE_INDEX_MISSING:${path}`);
  }
  return index;
}

export function getActiveRegionPathsInProfileOrder(): readonly string[] {
  return [...LEGACY_PATHS, ...NEW_PATHS];
}

