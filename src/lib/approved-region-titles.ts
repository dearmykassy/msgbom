import approvedManifestJson from "@/data/approved-region-titles.generated.json";

export const APPROVED_REGION_TITLE_MANIFEST_SHA256 =
  "sha256:c1e33beeb06996e16ea4fd0ed84ab1a723cc1a5e6842c1cd1958f570a69739e7" as const;
export const APPROVED_REGION_TITLE_SOURCE_GRAPH_DIGEST =
  "sha256:fe0dc2b6ff54ebff6e6afcf25910e7bb2f15953025dd167dbb0d942852567363" as const;
export const APPROVED_REGION_TITLE_COUNT = 1291 as const;

export type ApprovedRegionTitle = {
  path: string;
  region: string;
  context: string;
  locality_label: string;
  kind: "province" | "municipality" | "district" | "representative";
  stem: string;
  suffix: "마사지" | "타이" | "홈타이" | "스웨디시" | "출장마사지";
  commercial_name: string;
  page_heading: string;
  title: string;
};

type ApprovedManifest = {
  schema_version: number;
  employee_name: string;
  review_status: string;
  source_graph_digest: string;
  entries: ApprovedRegionTitle[];
};

const approvedManifest = approvedManifestJson as unknown as ApprovedManifest;

if (
  approvedManifest.schema_version !== 1 ||
  approvedManifest.employee_name !== "시윤" ||
  approvedManifest.review_status !== "APPROVED" ||
  approvedManifest.source_graph_digest !==
    APPROVED_REGION_TITLE_SOURCE_GRAPH_DIGEST ||
  approvedManifest.entries.length !== APPROVED_REGION_TITLE_COUNT
) {
  throw new Error("APPROVED_REGION_TITLE_MANIFEST_INTEGRITY_FAILURE");
}

const approvedTitleByPath = new Map(
  approvedManifest.entries.map((entry) => [entry.path, entry]),
);

if (
  approvedTitleByPath.size !== APPROVED_REGION_TITLE_COUNT ||
  new Set(approvedManifest.entries.map((entry) => entry.page_heading)).size !==
    APPROVED_REGION_TITLE_COUNT ||
  new Set(approvedManifest.entries.map((entry) => entry.title)).size !==
    APPROVED_REGION_TITLE_COUNT
) {
  throw new Error("APPROVED_REGION_TITLE_ENTRY_INTEGRITY_FAILURE");
}

export function getApprovedRegionTitle(path: string): ApprovedRegionTitle {
  const title = approvedTitleByPath.get(path);
  if (!title) throw new Error(`APPROVED_REGION_TITLE_MISSING:${path}`);
  return title;
}

export function getAllApprovedRegionTitles(): readonly ApprovedRegionTitle[] {
  return approvedManifest.entries;
}
