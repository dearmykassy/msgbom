import { getAllApprovedRegionTitles } from "./approved-region-titles";
import { buildUniqueMetaRegionLabels } from "./region-meta-label-normalization";

export {
  buildUniqueMetaRegionLabels,
  shortenMetaRegionLabel,
} from "./region-meta-label-normalization";

const META_REGION_LABEL_BY_PATH = buildUniqueMetaRegionLabels(
  getAllApprovedRegionTitles(),
);

export function getMetaRegionLabel(path: string): string {
  const label = META_REGION_LABEL_BY_PATH.get(path);
  if (!label) throw new Error(`META_REGION_LABEL_MISSING:${path}`);
  return label;
}

export function getAllMetaRegionLabels(): ReadonlyMap<string, string> {
  return META_REGION_LABEL_BY_PATH;
}
