import {
  formatKrw,
  PROVISIONAL_PRICING,
} from "@/data/provisional-pricing";
import { PricingGuide } from "@/components/PricingGuide";
import type { RegionCustomerCopy } from "@/lib/region-customer-copy";

type PricingTableProps = {
  compact?: boolean;
  regionalCopy?: RegionCustomerCopy["pricing"];
  regionName?: string;
};

export function PricingTable({
  compact = false,
  regionalCopy,
  regionName,
}: PricingTableProps) {
  return (
    <section
      className={`pricing-table-section${compact ? " pricing-table-compact" : ""}`}
      aria-labelledby="pricing-title"
    >
      <div className="pricing-heading">
        <div>
          <p className="eyebrow">COURSE &amp; PRICE</p>
          <h2 id="pricing-title">
            {regionalCopy?.heading ?? "코스 가격 안내"}
          </h2>
        </div>
        <div className="pricing-source-note">
          <span>코스 가격표</span>
          <p>
            {regionalCopy?.note ?? "코스별 이용 시간과 금액을 확인하세요."}
          </p>
        </div>
      </div>

      <div className="pricing-course-grid">
        {PROVISIONAL_PRICING.map((course) => (
          <article
            className="pricing-course"
            id={`course-${course.id}`}
            key={course.id}
          >
            <header>
              <span aria-hidden="true">MASSAGE BOM</span>
              <h3>{course.name}</h3>
              <p>
                {regionalCopy?.courseDescriptions[course.id] ??
                  course.description}
              </p>
            </header>
            <ul>
              {course.options.map((option) => (
                <li key={`${course.id}-${option.minutes}`}>
                  <strong>
                    <span className="sr-only">이용 시간 </span>
                    {option.minutes}분
                  </strong>
                  <div className="pricing-price-stack">
                    <b>
                      <span className="sr-only">이용 금액 </span>
                      {formatKrw(option.priceKrw)}
                    </b>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <PricingGuide
        copy={
          regionalCopy
            ? {
                title: regionalCopy.guideTitle,
                items: regionalCopy.guideItems,
              }
            : undefined
        }
        regionName={regionName}
      />
    </section>
  );
}
