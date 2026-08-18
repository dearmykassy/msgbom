const CUSTOMER_SEARCH_REGION_SUFFIX =
  /(특별자치도|특별자치시|특별시|광역시|도|시)$/u;

export type MetaRegionLabelSource = {
  path: string;
  kind: string;
  locality_label: string;
  context: string;
};

type MetaRegionLabelRecord = {
  path: string;
  baseLabel: string;
  parentLabels: string[];
  parentDepth: number;
  label: string;
};

/**
 * Converts official administrative labels into the form customers type.
 *
 * Only the approved token-final suffixes are removed. In particular, 구, 군,
 * 읍, 면, 동 and 리 remain part of the search label.
 */
export function shortenMetaRegionLabel(value: string): string {
  const normalized = value.normalize("NFC").trim();
  if (!normalized) throw new Error("META_REGION_LABEL_REQUIRED");

  return normalized
    .split(/\s+/u)
    .map((token) => {
      const shortened = token.replace(CUSTOMER_SEARCH_REGION_SUFFIX, "");
      return shortened || token;
    })
    .join(" ");
}

export function buildUniqueMetaRegionLabels(
  entries: readonly MetaRegionLabelSource[],
): ReadonlyMap<string, string> {
  const records: MetaRegionLabelRecord[] = entries.map((entry) => ({
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
  }));

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
