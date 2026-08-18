import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RegionLandingTemplate } from "@/components/RegionLandingTemplate";
import { getApprovedRegionTitle } from "@/lib/approved-region-titles";
import { buildRegionSeoCopy } from "@/lib/region-seo-copy";
import {
  getAllRegionStaticParams,
  getDirectChildren,
  getRegionBreadcrumbs,
  resolveRegionNode,
  type RegionNode,
} from "@/lib/regions";

type AreaRouteProps = {
  params: Promise<{ segments: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRegionStaticParams();
}

function metadataDescription(node: RegionNode): string {
  if (node.kind === "province") {
    return node.availability === "development"
      ? `${node.displayName} 마사지봄 서비스는 현재 준비 중입니다. 가까운 운영 지역을 확인해 보세요.`
      : `${node.displayName}의 시·군·구와 하위 지역을 한눈에 확인할 수 있습니다.`;
  }
  if (node.kind === "representative" && node.representative) {
    return `${node.displayName} 출장 마사지 코스와 운영 가격표, 포함 행정동, 24시간 상담 안내를 확인할 수 있습니다.`;
  }

  return `${node.displayName} 출장 마사지 코스와 운영 가격표, 하위 지역, 24시간 상담 안내를 확인할 수 있습니다.`;
}

export async function generateMetadata({ params }: AreaRouteProps): Promise<Metadata> {
  const { segments } = await params;
  const node = resolveRegionNode(segments);

  if (!node) {
    return {
      title: "지역을 찾을 수 없습니다",
      robots: { index: false, follow: false },
    };
  }

  const isNoindex = node.availability === "development";

  const approvedTitle =
    node.availability === "active" ? getApprovedRegionTitle(node.path) : null;
  const seoCopy =
    node.availability === "active" && approvedTitle
      ? buildRegionSeoCopy(node, {
          approvedHeading: approvedTitle.page_heading,
          approvedIdentity: {
            commercialName: approvedTitle.commercial_name,
            localityLabel: approvedTitle.locality_label,
            pageHeading: approvedTitle.page_heading,
          },
        })
      : null;
  const description = seoCopy?.metadata.description ?? metadataDescription(node);

  return {
    title: seoCopy
      ? { absolute: seoCopy.metadata.title }
      : `${node.displayName} 지역 안내`,
    description,
    keywords: seoCopy ? Object.values(seoCopy.keywords.metadata) : undefined,
    alternates: { canonical: node.path },
    openGraph: seoCopy
      ? {
          type: "website",
          locale: "ko_KR",
          siteName: "마사지봄",
          title: seoCopy.metadata.title,
          description,
          url: node.path,
        }
      : undefined,
    twitter: seoCopy
      ? {
          card: "summary",
          title: seoCopy.metadata.title,
          description,
        }
      : undefined,
    robots: isNoindex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true, "max-image-preview": "large" },
        }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}

function DevelopmentPlaceholder({ node }: { node: RegionNode }) {
  return (
    <section className="region-development-panel" aria-labelledby="region-development-title">
      <span className="region-status-badge">서비스 준비 중</span>
      <h2 id="region-development-title">{node.displayName} 서비스 안내 준비 중</h2>
      <p>
        마사지봄 서비스 지역을 넓혀가고 있습니다. 가까운 운영 지역은 지역 찾기에서
        확인해 주세요.
      </p>
      <Link className="text-link" href="/areas">
        전국 지역 목록으로 돌아가기 →
      </Link>
    </section>
  );
}

export default async function AreaDetailPage({ params }: AreaRouteProps) {
  const { segments } = await params;
  const node = resolveRegionNode(segments);
  if (!node) notFound();

  const breadcrumbs = getRegionBreadcrumbs(node);
  const children = getDirectChildren(node);

  if (node.availability === "active") {
    return (
      <RegionLandingTemplate
        breadcrumbs={breadcrumbs}
        items={children}
        node={node}
      />
    );
  }

  return (
    <main className={`region-page region-${node.kind}-page`}>
      <section className="region-page-hero">
        <div className="region-page-shell">
          <nav className="region-breadcrumbs" aria-label="현재 위치">
            <Link href="/">홈</Link>
            <span aria-hidden="true">/</span>
            {breadcrumbs.map((breadcrumb, index) => {
              const isCurrent = index === breadcrumbs.length - 1;
              return (
                <span className="region-breadcrumb-item" key={breadcrumb.path}>
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
          <p className="region-eyebrow">{node.displayName}</p>
          <h1>{node.displayName} 지역 둘러보기</h1>
          <p className="region-page-lead">
            {node.displayName} 서비스는 현재 준비 중입니다. 가까운 운영 지역을 먼저
            둘러보세요.
          </p>
        </div>
      </section>

      <div className="region-page-shell region-page-content">
        <DevelopmentPlaceholder node={node} />
      </div>
    </main>
  );
}
