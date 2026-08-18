const CUSTOMER_SEARCH_REGION_SUFFIX =
  /(특별자치도|특별자치시|특별시|광역시|도|시)$/u;

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
