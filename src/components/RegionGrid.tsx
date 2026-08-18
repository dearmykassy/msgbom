import Link from "@/components/SiteLink";

import type { RegionChild } from "@/lib/regions";

type RegionGridProps = {
  items: RegionChild[];
  heading?: string;
};

function childDescription(child: RegionChild): string {
  if (child.kind === "representative") {
    return child.sourceUnitCount > 1
      ? `함께 안내하는 동네 ${child.sourceUnitCount}곳`
      : "동네 상세 안내";
  }

  return `하위 지역 ${child.representativeCount}곳`;
}

export function RegionGrid({ items, heading }: RegionGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="region-grid-section" aria-labelledby={heading ? "region-grid-title" : undefined}>
      {heading ? (
        <div className="region-section-heading">
          <p className="region-eyebrow">AREA DIRECTORY</p>
          <h2 id="region-grid-title">{heading}</h2>
        </div>
      ) : null}

      <ul className="region-grid" aria-label={heading ?? "하위 지역"}>
        {items.map((child) => (
          <li className="region-grid-item" key={child.path}>
            <Link className="region-card" href={child.path}>
              <span className="region-card-name">{child.name}</span>
              <span className="region-card-description">
                {childDescription(child)}
              </span>
              <span className="region-card-action" aria-hidden="true">
                지역 보기 <span>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
