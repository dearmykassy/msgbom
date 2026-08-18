import Link from "@/components/SiteLink";

import { PricingTable } from "@/components/PricingTable";
import { RegionGrid } from "@/components/RegionGrid";
import { ServiceGuide } from "@/components/ServiceGuide";
import { getRegionContactPhone } from "@/data/business-settings";
import { formatKrw, PROVISIONAL_PRICING } from "@/data/provisional-pricing";
import {
  COURSE_SELECTION_GUIDE,
  SERVICE_PROCESS_STEPS,
} from "@/data/service-guide";
import { getApprovedRegionTitle } from "@/lib/approved-region-titles";
import {
  buildRegionCustomerCopy,
  type RegionCustomerCopy,
} from "@/lib/region-customer-copy";
import {
  buildRegionEditorialCopy,
  type RegionEditorialCopy,
} from "@/lib/region-editorial-copy";
import { buildRegionSeoCopy } from "@/lib/region-seo-copy";
import { resolveRegionHeroTheme } from "@/lib/region-hero-theme";
import type { RegionChild, RegionNode } from "@/lib/regions";

type Breadcrumb = {
  name: string;
  path: string;
};

type RegionLandingTemplateProps = {
  breadcrumbs: Breadcrumb[];
  items: RegionChild[];
  node: RegionNode;
};

const STARTING_PRICE = Math.min(
  ...PROVISIONAL_PRICING.flatMap((course) =>
    course.options.map((option) => option.priceKrw),
  ),
);

function RegionBreadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <nav className="region-landing-breadcrumbs" aria-label="현재 위치">
      <Link href="/">홈</Link>
      <span aria-hidden="true">/</span>
      {breadcrumbs.map((breadcrumb, index) => {
        const isCurrent = index === breadcrumbs.length - 1;
        return (
          <span className="region-landing-breadcrumb-item" key={breadcrumb.path}>
            {isCurrent ? (
              <span aria-current="page">{breadcrumb.name}</span>
            ) : (
              <Link href={breadcrumb.path}>{breadcrumb.name}</Link>
            )}
            {!isCurrent ? <span aria-hidden="true">/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}

function RegionFactStrip({ regionName }: { regionName: string }) {
  const facts = [
    { label: "타이 60분 기준", value: `${formatKrw(STARTING_PRICE)}부터` },
    { label: "전화상담", value: "24시간" },
    { label: "선입금 없이", value: "100% 현장 후불" },
    { label: "현장 결제", value: "카드 가능" },
  ] as const;

  return (
    <dl className="region-landing-facts" aria-label={`${regionName} 이용 핵심 정보`}>
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function RegionEditorialIntroduction({
  copy,
  regionName,
}: {
  copy: RegionEditorialCopy["introduction"];
  regionName: string;
}) {
  const [localParagraph, homeParagraph, bodyParagraph, privacyParagraph, serviceParagraph] =
    copy.paragraphs;

  return (
    <section
      className="region-editorial-story"
      data-copy-zone="regional-editorial"
      id="region-introduction"
      aria-labelledby="region-introduction-title"
    >
      <div className="region-page-shell region-editorial-story-grid">
        <header className="region-editorial-story-heading">
          <p>{copy.eyebrow}</p>
          <h2 id="region-introduction-title">{copy.title}</h2>
          <span>
            익숙한 공간에서 시작되는 {regionName} 프라이빗 방문 케어를
            소개합니다.
          </span>
        </header>
        <div className="region-editorial-story-copy">
          <p className="region-editorial-story-lead">{localParagraph}</p>
          <h3>{regionName} 자택에서 누리는 프라이빗 케어</h3>
          <p>{homeParagraph}</p>
          <h3>피로와 긴장을 풀어내는 맞춤 테라피</h3>
          <p>{bodyParagraph}</p>
          <p>{privacyParagraph}</p>
          <h3>원하는 코스와 시간에 맞춘 방문 관리</h3>
          <p>{serviceParagraph}</p>
        </div>
      </div>
    </section>
  );
}

function RegionPaymentTrust({
  copy,
  contactPhone,
  regionName,
}: {
  copy: RegionEditorialCopy["trust"];
  contactPhone: ReturnType<typeof getRegionContactPhone>;
  regionName: string;
}) {
  return (
    <section
      className="region-editorial-trust"
      data-copy-zone="regional-editorial"
      id="region-payment-safety"
      aria-labelledby="region-payment-safety-title"
    >
      <div className="region-page-shell region-editorial-trust-grid">
        <div className="region-editorial-trust-heading">
          <p>{copy.eyebrow}</p>
          <h2 id="region-payment-safety-title">{copy.title}</h2>
          <a
            aria-label={`${contactPhone.display}으로 ${regionName} 전화상담`}
            data-analytics-location="region_payment"
            href={contactPhone.telHref}
          >
            공식 번호로 전화상담
          </a>
        </div>
        <div className="region-editorial-trust-copy">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul aria-label={`${regionName} 안심 결제 원칙`}>
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CourseChoiceGuide({
  copy,
}: {
  copy: RegionCustomerCopy["courseChoice"];
}) {
  return (
    <section
      className="region-course-choice"
      id="region-course-choice"
      aria-labelledby="region-course-choice-title"
    >
      <div className="region-page-shell">
        <div className="region-landing-section-heading">
          <p>COURSE FINDER</p>
          <h2 id="region-course-choice-title">{copy.title}</h2>
          <span>{copy.lead}</span>
        </div>
        <ol className="region-course-choice-list">
          {COURSE_SELECTION_GUIDE.map((guide, index) => {
            const itemCopy = copy.items[index];
            return (
              <li key={guide.courseId}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{guide.courseName}</p>
                  <h3>{itemCopy.title}</h3>
                  <p>{itemCopy.description}</p>
                </div>
                <a href={`#course-${guide.courseId}`}>{itemCopy.linkLabel}</a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function RegionProcess({
  copy,
}: {
  copy: RegionCustomerCopy["process"];
}) {
  return (
    <section className="region-landing-process" aria-labelledby="region-process-title">
      <div className="region-page-shell">
        <div className="region-landing-section-heading is-inverse">
          <p>HOW TO USE</p>
          <h2 id="region-process-title">{copy.title}</h2>
        </div>
        <ol>
          {SERVICE_PROCESS_STEPS.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{copy.itemDescriptions[index]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function RegionFaq({
  copy,
  regionName,
}: {
  copy: RegionCustomerCopy["faq"];
  regionName: string;
}) {
  return (
    <section className="region-landing-faq" aria-labelledby="region-faq-title">
      <div className="region-landing-section-heading">
        <p>QUICK ANSWERS</p>
        <h2 id="region-faq-title">{regionName} {copy.title}</h2>
      </div>
      <div className="region-landing-faq-list">
        {copy.items.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function RepresentativeCoverage({
  copy,
  node,
}: {
  copy: RegionCustomerCopy["directory"];
  node: RegionNode;
}) {
  const sourceNames = node.representative?.sourceNames ?? [];

  return (
    <section className="region-landing-coverage" aria-labelledby="region-coverage-title">
      <div className="region-landing-section-heading">
        <p>AREA DIRECTORY</p>
        <h2 id="region-coverage-title">{copy.coverageTitle}</h2>
        <span>{copy.coverageLead}</span>
      </div>
      <ul aria-label={`${node.displayName} 포함 행정동`}>
        {sourceNames.map((sourceName) => (
          <li key={sourceName}>{sourceName}</li>
        ))}
      </ul>
    </section>
  );
}

function RegionDirectory({
  copy,
  items,
  node,
}: {
  copy: RegionCustomerCopy["directory"];
  items: RegionChild[];
  node: RegionNode;
}) {
  if (items.length === 0) {
    return (
      <div id="region-directory">
        <RepresentativeCoverage copy={copy} node={node} />
      </div>
    );
  }

  return (
    <section
      className="region-landing-directory"
      id="region-directory"
      aria-labelledby="region-directory-title"
    >
      <div className="region-landing-directory-intro">
        <p>AREA DIRECTORY</p>
        <h2 id="region-directory-title">{copy.title}</h2>
        <span>{copy.lead}</span>
      </div>
      <RegionGrid items={items} />
    </section>
  );
}

export function RegionLandingTemplate({
  breadcrumbs,
  items,
  node,
}: RegionLandingTemplateProps) {
  const approvedTitle = getApprovedRegionTitle(node.path);
  const contactPhone = getRegionContactPhone(node.path);
  const customerCopy = buildRegionCustomerCopy(
    node,
    approvedTitle.commercial_name,
  );
  const editorialCopy = buildRegionEditorialCopy(
    node,
    approvedTitle.commercial_name,
  );
  const seoCopy = buildRegionSeoCopy(node, {
    approvedHeading: approvedTitle.page_heading,
    approvedIdentity: {
      commercialName: approvedTitle.commercial_name,
      localityLabel: approvedTitle.locality_label,
      pageHeading: approvedTitle.page_heading,
    },
  });
  const hierarchyLabel = breadcrumbs
    .slice(1)
    .map((breadcrumb) => breadcrumb.name)
    .join(" › ");
  const regionName = node.displayName;
  const heroTheme = resolveRegionHeroTheme(node.path);

  return (
    <main className={`region-landing region-landing-${node.kind}`}>
      <section
        className={`region-landing-hero${heroTheme ? " has-region-hero-media" : ""}`}
        aria-labelledby="region-landing-title"
      >
        {heroTheme ? (
          <div className="region-landing-hero-media" aria-hidden="true">
            <picture>
              <source
                media="(max-width: 480px)"
                srcSet={heroTheme.image.variants.mobile.public_path}
              />
              <source
                media="(max-width: 980px)"
                srcSet={heroTheme.image.variants.tablet.public_path}
              />
              <img
                alt=""
                decoding="async"
                fetchPriority="high"
                height={heroTheme.image.variants.desktop.height}
                src={heroTheme.image.variants.desktop.public_path}
                width={heroTheme.image.variants.desktop.width}
              />
            </picture>
          </div>
        ) : null}
        <div className="region-landing-hero-shade" aria-hidden="true" />
        <div className="region-page-shell region-landing-hero-inner">
          <RegionBreadcrumbs breadcrumbs={breadcrumbs} />
          <div className="region-landing-hero-copy">
            <p className="region-landing-eyebrow">
              {hierarchyLabel} · 24시간 전화상담
            </p>
            <h1 id="region-landing-title">{seoCopy.hero.heading.text}</h1>
            <p className="region-landing-lead" data-copy-zone="hero-welcome">
              {editorialCopy.heroLead}
            </p>
            <div className="region-landing-actions">
              <a
                aria-label={`${contactPhone.display}으로 전화상담`}
                className="button button-blossom"
                data-analytics-location="region_hero"
                href={contactPhone.telHref}
              >
                전화상담
              </a>
              <a className="button button-ghost" href="#region-pricing">
                코스·가격 보기
              </a>
            </div>
          </div>
          <RegionFactStrip regionName={regionName} />
        </div>
      </section>

      <nav className="region-landing-jump" aria-label="페이지 바로가기">
        <div className="region-page-shell">
          <a href="#region-directory">
            {items.length === 0 ? "포함 행정동" : "하위 지역"}
          </a>
          <a href="#region-introduction">지역 소개</a>
          <a href="#region-payment-safety">안심 후불제</a>
          <a href="#region-pricing">코스·가격</a>
          <a href="#region-course-choice">코스 선택</a>
          <a href="#region-service-guide">전화 전 준비</a>
          <a href="#region-service-standards">운영 기준</a>
          <a href="#region-process">이용 절차</a>
          <a href="#region-faq">자주 묻는 내용</a>
        </div>
      </nav>

      <div className="region-page-shell region-landing-directory-top">
        <RegionDirectory
          copy={customerCopy.directory}
          items={items}
          node={node}
        />
      </div>

      <RegionEditorialIntroduction
        copy={editorialCopy.introduction}
        regionName={regionName}
      />

      <RegionPaymentTrust
        contactPhone={contactPhone}
        copy={editorialCopy.trust}
        regionName={regionName}
      />

      <section className="region-landing-pricing" id="region-pricing">
        <div className="region-page-shell">
          <PricingTable
            regionalCopy={customerCopy.pricing}
            regionName={regionName}
          />
          <div className="region-pricing-call">
            <p>{customerCopy.pricing.callPrompt}</p>
            <a
              aria-label={`${contactPhone.display}으로 코스 전화상담`}
              data-analytics-location="region_pricing"
              href={contactPhone.telHref}
            >
              이 코스로 전화상담
            </a>
          </div>
        </div>
      </section>

      <CourseChoiceGuide copy={customerCopy.courseChoice} />

      <div id="region-service-guide">
        <ServiceGuide
          contactPhone={contactPhone}
          regionalCopy={customerCopy}
          regionName={regionName}
          showMoreLink
        />
      </div>

      <div id="region-process">
        <RegionProcess copy={customerCopy.process} />
      </div>

      <div className="region-page-shell region-landing-lower">
        <div id="region-faq">
          <RegionFaq copy={customerCopy.faq} regionName={regionName} />
        </div>
      </div>

      <a
        className="region-phone-fab"
        data-analytics-location="region_floating"
        href={contactPhone.telHref}
        aria-label={`${contactPhone.display}으로 전화상담`}
      >
        <span aria-hidden="true">☎</span>
        <strong>전화상담</strong>
      </a>
    </main>
  );
}
