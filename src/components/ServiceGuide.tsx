import Link from "next/link";

import type { BusinessContactPhone } from "@/data/business-settings";
import {
  CONSULTATION_ITEMS,
  SERVICE_STANDARDS,
} from "@/data/service-guide";
import type { RegionCustomerCopy } from "@/lib/region-customer-copy";

type ServiceGuideProps = {
  contactPhone?: Pick<BusinessContactPhone, "display" | "telHref">;
  regionalCopy?: Pick<RegionCustomerCopy, "consultation" | "standards">;
  regionName?: string;
  showMoreLink?: boolean;
};

export function ServiceGuide({
  contactPhone,
  regionalCopy,
  regionName,
  showMoreLink = false,
}: ServiceGuideProps) {
  const locationLabel = regionName ? `${regionName} 방문 상담` : "방문 상담";

  return (
    <section className="service-guide" aria-labelledby="service-guide-title">
      <div className="region-page-shell">
        <div className="service-guide-heading">
          <div>
            <p className="eyebrow">BEFORE YOU CALL</p>
            <h2 id="service-guide-title">
              {regionalCopy?.consultation.title ??
                "전화할 때 네 가지만 알려주세요"}
            </h2>
          </div>
          <div className="service-guide-heading-copy">
            <p>
              {regionalCopy?.consultation.lead ?? (
                <>
                  {locationLabel}에서는 방문 지역과 희망 시각, 코스·이용 시간,
                  인원을 먼저 확인합니다. 방문 가능 여부는 전화상담에서 안내합니다.
                </>
              )}
            </p>
            {showMoreLink ? (
              <Link href="/guide">전체 이용안내 보기 →</Link>
            ) : null}
          </div>
        </div>

        <ol className="service-consultation-grid">
          {CONSULTATION_ITEMS.map((item, index) => (
            <li key={item.index}>
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p>
                {regionalCopy?.consultation.itemDescriptions[index] ??
                  item.description}
              </p>
            </li>
          ))}
        </ol>

        {contactPhone ? (
          <div className="service-guide-phone-row">
            <p>
              {regionalCopy?.consultation.phonePrompt ??
                "네 가지를 정했다면 전화로 방문 가능 여부와 예약 내용을 확인하세요."}
            </p>
            <a
              aria-label={`${contactPhone.display}으로 전화상담`}
              href={contactPhone.telHref}
            >
              {contactPhone.display} 전화상담
            </a>
          </div>
        ) : null}

        <div className="service-standards-heading" id="region-service-standards">
          <div>
            <p className="eyebrow">SERVICE STANDARD</p>
            <h2>{regionalCopy?.standards.title ?? "운영 기준 안내"}</h2>
          </div>
          <p>
            {regionalCopy?.standards.lead ??
              "결제 방식과 위생, 운영시간 등 이용 전 알아둘 기준을 한곳에 정리했습니다."}
          </p>
        </div>

        <ul className="service-standard-grid">
          {SERVICE_STANDARDS.map((standard, index) => (
            <li key={standard.label}>
              <span>{standard.label}</span>
              <h3>{standard.title}</h3>
              <p>
                {regionalCopy?.standards.itemDescriptions[index] ??
                  standard.description}
              </p>
            </li>
          ))}
        </ul>

        <aside className="service-safety-note" aria-label="이용 전 안전 안내">
          <div>
            <span>PLEASE NOTE</span>
            <strong>
              {regionalCopy?.standards.safetyTitle ??
                "건강 상태가 걱정된다면 먼저 전문가와 상담하세요."}
            </strong>
          </div>
          <p>
            {regionalCopy?.standards.safetyDescription ?? (
              <>
                마사지봄의 안내는 휴식·관리 서비스 이용 정보이며 의료 진단이나 치료를
                대신하지 않습니다. 몸 상태로 이용이 망설여진다면 예약보다 의료 전문가
                상담을 우선해 주세요.
              </>
            )}
          </p>
        </aside>
      </div>
    </section>
  );
}
