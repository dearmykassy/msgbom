import { getAllApprovedRegionTitles } from "./approved-region-titles";
import { shortenMetaRegionLabel } from "./region-meta-label-normalization";

export { shortenMetaRegionLabel } from "./region-meta-label-normalization";

type MetaRegionLabelRecord = {
  path: string;
  baseLabel: string;
  parentLabels: string[];
  parentDepth: number;
  label: string;
};

function buildMetaRegionLabels(): ReadonlyMap<string, string> {
  const records: MetaRegionLabelRecord[] = getAllApprovedRegionTitles().map(
    (entry) => ({
      path: entry.path,
      baseLabel: shortenMetaRegionLabel(entry.locality_label),
      parentLabels:
        entry.kind === "province"
          ? []
          : entry.context
              .split(/\s*·\s*/u)
              .filter(Boolean)
              .map(shortenMetaRegionLabel),
      parentDepth: 0,
      label: shortenMetaRegionLabel(entry.locality_label),
    }),
  );

  for (let pass = 0; pass <= records.length; pass += 1) {
    const recordsByLabel = new Map<string, MetaRegionLabelRecord[]>();
    for (const record of records) {
      const matches = recordsByLabel.get(record.label) ?? [];
      matches.push(record);
      recordsByLabel.set(record.label, matches);
    }

    const duplicateGroups = [...recordsByLabel.values()].filter(
      (matches) => matches.length > 1,
    );
    if (duplicateGroups.length === 0) {
      return new Map(records.map((record) => [record.path, record.label]));
    }

    let expanded = false;
    for (const duplicateGroup of duplicateGroups) {
      for (const record of duplicateGroup) {
        if (record.parentDepth >= record.parentLabels.length) continue;

        record.parentDepth += 1;
        record.label = [
          ...record.parentLabels.slice(-record.parentDepth),
          record.baseLabel,
        ].join(" ");
        expanded = true;
      }
    }

    if (!expanded) break;
  }

  throw new Error("META_REGION_LABEL_UNIQUENESS_FAILURE");
}

const META_REGION_LABEL_BY_PATH = buildMetaRegionLabels();

export function getMetaRegionLabel(path: string): string {
  const label = META_REGION_LABEL_BY_PATH.get(path);
  if (!label) throw new Error(`META_REGION_LABEL_MISSING:${path}`);
  return label;
}

export function getAllMetaRegionLabels(): ReadonlyMap<string, string> {
  return META_REGION_LABEL_BY_PATH;
}
