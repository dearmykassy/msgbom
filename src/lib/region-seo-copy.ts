import {
  getRegionBreadcrumbs,
  type RegionNode,
  type RegionNodeKind,
} from "./regions";
import {
  getRegionProfileIndex,
  LEGACY_ACTIVE_REGION_PAGE_COUNT,
} from "./region-profile-index";
import {
  buildRegionServiceKeywords,
  REGION_SERVICE_KEYWORD_SUFFIXES,
  type RegionServiceKeywordSuffix,
} from "../data/region-service-keywords";
import { getMetaRegionLabel } from "./region-meta-label";

export const REGION_SEO_COPY_UNAVAILABLE =
  "REGION_SEO_COPY_UNAVAILABLE" as const;

export class RegionSeoCopyError extends Error {
  constructor(
    public readonly code: typeof REGION_SEO_COPY_UNAVAILABLE,
    message: string,
  ) {
    super(message);
    this.name = "RegionSeoCopyError";
  }
}

export type RegionKeywordKey = RegionServiceKeywordSuffix;

export type SemanticText<Tag extends "h1" | "h2" | "h3" | "p"> = {
  tag: Tag;
  text: string;
};

export type RegionSeoSubsection = {
  heading: SemanticText<"h3">;
  paragraphs: Array<SemanticText<"p">>;
};

export type RegionSeoSection = {
  id: string;
  heading: SemanticText<"h2">;
  lead: SemanticText<"p">;
  subsections: RegionSeoSubsection[];
};

export type RegionSeoCopy = {
  locality: {
    regionName: string;
    hierarchy: readonly string[];
    scopeLabel: string;
    path: string;
    kind: RegionNodeKind;
  };
  /**
   * A stable integration/debug key. The path makes it unique even when two
   * different parents contain a child with the same display name.
   */
  variationKey: string;
  keywords: {
    all: Readonly<Record<RegionKeywordKey, string>>;
    metadata: Readonly<Record<RegionKeywordKey, string>>;
    primary: string;
    visible: readonly string[];
  };
  metadata: {
    title: string;
    description: string;
    variationPlan: string;
  };
  hero: {
    heading: SemanticText<"h1">;
    lead: SemanticText<"p">;
  };
  sections: RegionSeoSection[];
};

export type RegionSeoCopyOptions = {
  approvedHeading?: string;
  approvedIdentity?: {
    commercialName: string;
    localityLabel: string;
    pageHeading: string;
  };
};

const META_OPENING_VARIANTS = [
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `${scopeLabel} 지역 정보를 살피는 마사지봄 ${identity.commercialName}에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `${scopeLabel} 안내를 담은 마사지봄 ${identity.commercialName}에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `마사지봄 ${identity.commercialName}의 ${scopeLabel} 지역 페이지에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `마사지봄이 구성한 ${scopeLabel} ${identity.commercialName} 안내에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `${scopeLabel} 기준의 마사지봄 ${identity.commercialName}에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `마사지봄 ${identity.commercialName}의 ${scopeLabel} 페이지에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `마사지봄 ${identity.commercialName}의 ${scopeLabel} 안내에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `${scopeLabel} 마사지봄 ${identity.commercialName}에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `마사지봄 ${identity.commercialName}의 ${scopeLabel} 코스 안내에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `마사지봄 ${scopeLabel} ${identity.commercialName} 안내를 통해`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `${scopeLabel} 정보를 다루는 마사지봄 ${identity.commercialName}에서`,
  (
    identity: NonNullable<RegionSeoCopyOptions["approvedIdentity"]>,
    scopeLabel: string,
  ) => `마사지봄 ${identity.commercialName}의 ${scopeLabel} 지역별 안내에서`,
] as const;

const META_CORE_VARIANTS = [
  (primary: string, secondary: string) =>
    `${primary}와 ${secondary} 코스·가격을 확인하세요.`,
  (primary: string, secondary: string) =>
    `${primary}, ${secondary}의 이용 시간과 가격을 비교해 보세요.`,
  (primary: string, secondary: string) =>
    `${primary} 및 ${secondary} 관련 코스와 운영 가격을 한눈에 살펴보세요.`,
  (primary: string, secondary: string) =>
    `${primary}와 ${secondary}를 찾을 때 코스별 시간·금액을 먼저 확인할 수 있습니다.`,
  (primary: string, secondary: string) =>
    `${primary}, ${secondary} 안내와 코스별 이용 시간을 차례로 확인하세요.`,
  (primary: string, secondary: string) =>
    `${primary}와 ${secondary}의 공개 코스·가격을 보기 쉽게 정리했습니다.`,
  (primary: string, secondary: string) =>
    `${primary} 또는 ${secondary}를 알아볼 때 이용 시간과 표시 가격을 함께 확인하세요.`,
  (primary: string, secondary: string) =>
    `${primary}, ${secondary} 코스를 시간과 가격 기준으로 살펴볼 수 있습니다.`,
  (primary: string, secondary: string) =>
    `${primary}와 ${secondary}에 필요한 코스·가격 정보를 순서대로 확인해 보세요.`,
  (primary: string, secondary: string) =>
    `${primary}, ${secondary}의 코스 구성과 현재 운영 가격을 확인할 수 있습니다.`,
  (primary: string, secondary: string) =>
    `${primary}와 ${secondary}를 비교하기 쉽도록 코스 시간과 가격을 모았습니다.`,
  (primary: string, secondary: string) =>
    `${primary}, ${secondary} 이용 전 코스별 시간과 금액부터 확인하세요.`,
] as const;

const META_CLOSING_VARIANTS = [
  "24시간 전화상담과 선입금 없는 현장 후불제로 안내합니다.",
  "선입금 없이 현장에서 결제하며 전화상담은 24시간 운영합니다.",
  "24시간 전화상담 후 예약금 없이 현장 후불제로 이용합니다.",
  "사전 예약금 없이 현장 결제로 이용하며 24시간 전화로 안내합니다.",
  "문의는 24시간 전화로 받고 결제는 선입금 없는 현장 후불 방식입니다.",
  "전화상담은 24시간 운영하며 사전 입금 없이 현장에서 결제합니다.",
  "예약 전 24시간 전화로 확인하고 비용은 선입금 없이 현장에서 결제합니다.",
  "24시간 상담으로 코스를 확인한 뒤 예약금 없이 현장 후불로 결제합니다.",
] as const;

const EXPANDED_META_ADDRESS_VARIANTS = [
  "방문 주소를 먼저 확인하고",
  "이용할 주소와 시간을 맞추고",
  "지역·시각·인원을 정리하고",
  "현재 위치와 일정을 살피고",
  "주소지와 희망 시각을 확인하고",
  "방문 지역부터 정확히 전달하고",
] as const;

const EXPANDED_META_COURSE_VARIANTS = [
  "코스별 시간과 금액을 비교한 뒤",
  "관리 코스와 이용 시간을 고른 뒤",
  "코스명·분 단위·금액을 확인하고",
  "희망 코스를 가격표에서 살펴본 뒤",
  "시간대별 운영 금액을 확인하고",
  "가격표에서 선택지를 좁힌 뒤",
] as const;

const EXPANDED_META_CALL_VARIANTS = [
  "24시간 전화상담으로 가능 일정을 안내받아",
  "24시간 상담에서 방문 시간을 확인해",
  "하루 24시간 전화로 조건을 맞춰",
  "새벽에도 열려 있는 24시간 상담으로 일정을 정해",
  "24시간 상담 창구에서 방문 순서를 확인해",
  "언제든 24시간 전화로 주소와 시간을 확정해",
] as const;

const EXPANDED_META_PAYMENT_VARIANTS = [
  "선입금 없이 현장에서 결제합니다.",
  "예약금 없이 방문 확인 뒤 현장 후불로 결제합니다.",
  "사전 입금 없이 현장 도착 후 결제하는 방식입니다.",
] as const;

const HERO_LEAD_VARIANTS = [
  (scopeLabel: string) =>
    `${scopeLabel} 범위에서 찾는 정보를 지역 안내, 코스·가격, 이용 전 확인 항목 순서로 정리했습니다.`,
  (scopeLabel: string) =>
    `${scopeLabel}에 해당하는 지역 범위를 먼저 확인한 뒤, 공개된 코스와 가격 정보를 차례로 살펴보세요.`,
  (scopeLabel: string) =>
    `이 페이지는 ${scopeLabel} 범위의 안내만 다룹니다. 코스·가격과 확인 항목을 한 흐름으로 볼 수 있습니다.`,
  (scopeLabel: string) =>
    `${scopeLabel}의 행정 경로를 확인하고 코스 시간, 표시 가격, 상담 항목 순으로 살펴보세요.`,
  (scopeLabel: string) =>
    `현재 안내 범위는 ${scopeLabel}입니다. 지역을 확정한 다음 공개된 코스와 이용 전 질문을 비교할 수 있습니다.`,
  (scopeLabel: string) =>
    `${scopeLabel} 페이지에서 지역 범위와 가격표를 함께 확인하고 필요한 질문을 전화상담 전에 정리하세요.`,
  (scopeLabel: string) =>
    `지역 선택 결과가 ${scopeLabel}와 일치하는지 먼저 살핀 뒤 시간별 코스와 결제 안내를 확인하세요.`,
  (scopeLabel: string) =>
    `${scopeLabel}에 연결된 지역 안내를 시작으로 코스 비교와 상담 준비 항목을 순서대로 제공합니다.`,
  (scopeLabel: string) =>
    `이 안내는 ${scopeLabel}를 기준으로 구성했습니다. 주소 범위를 고른 뒤 코스별 시간과 금액을 읽어보세요.`,
  (scopeLabel: string) =>
    `${scopeLabel}의 위치 경로, 코스 구성, 운영 가격을 한 페이지에서 차례로 확인할 수 있습니다.`,
] as const;

const SECTION_LEAD_VARIANTS = [
  (scopeLabel: string) =>
    `검색 표현이 비슷하더라도 이 페이지가 다루는 지역은 ${scopeLabel}로 한정됩니다.`,
  (scopeLabel: string) =>
    `먼저 현재 지역이 ${scopeLabel}인지 확인하면 다른 지역의 안내와 혼동을 줄일 수 있습니다.`,
  (scopeLabel: string) =>
    `${scopeLabel} 밖의 지역은 해당 지역 페이지에서 별도로 확인해야 합니다.`,
  (scopeLabel: string) =>
    `현재 위치 경로가 ${scopeLabel}로 이어지는지 확인한 다음 서비스 표현과 가격표를 비교하세요.`,
  (scopeLabel: string) =>
    `${scopeLabel}와 이름이 비슷한 다른 지역이 있을 수 있으므로 상위 행정명칭까지 함께 읽어야 합니다.`,
  (scopeLabel: string) =>
    `상담할 주소가 ${scopeLabel} 안에 있는지 정한 뒤 희망 코스와 이용 시간을 전달하세요.`,
  (scopeLabel: string) =>
    `${scopeLabel}의 마지막 지역명까지 맞으면 코스명과 분 단위를 이어서 확인할 수 있습니다.`,
  (scopeLabel: string) =>
    `검색 결과보다 ${scopeLabel}로 표시된 현재 위치 경로를 우선해 실제 주소 범위를 판단하세요.`,
  (scopeLabel: string) =>
    `${scopeLabel} 기준 페이지임을 확인하면 같은 동명이 있는 다른 시·구 안내와 섞이지 않습니다.`,
  (scopeLabel: string) =>
    `주소의 시·군·구 순서가 ${scopeLabel}와 다르면 지역 검색에서 올바른 경로를 다시 선택하세요.`,
] as const;

const COURSE_READING_VARIANTS = [
  "코스 이름만으로 범위를 단정하지 말고 이용 시간과 금액을 나란히 본 뒤 실제 제공 조건을 전화로 확인하세요.",
  "희망 코스의 분 단위와 표시 금액을 한 줄로 적어두면 상담에서 다른 코스와 혼동하기 어렵습니다.",
  "가격표에서는 코스명, 이용 시간, 현재 금액을 한 묶음으로 읽고 화면에 없는 조건은 별도로 질문하세요.",
  "비슷한 코스 표현이 보여도 시간과 금액이 다른 행인지 확인한 다음 상담할 후보를 정하세요.",
  "먼저 이용 시간을 고르고 해당 행의 코스 설명과 가격을 확인하면 비교 순서를 단순하게 만들 수 있습니다.",
  "코스 후보를 두 개까지 좁힌 뒤 각 시간과 금액을 비교하고 최종 적용 조건은 통화에서 다시 확인하세요.",
  "표시 가격은 같은 코스라도 시간에 따라 달라지므로 분 단위를 생략하지 말고 함께 전달해야 합니다.",
  "검색 표현과 실제 코스명은 다를 수 있으므로 가격표의 명칭을 그대로 읽어 상담에서 확인하세요.",
  "예산과 이용 시간을 각각 정한 뒤 두 조건에 맞는 가격 행을 찾아야 다른 금액을 잘못 적용하지 않습니다.",
  "화면에 공개된 코스만 비교 대상으로 삼고 세부 관리 범위와 일정은 전화 답변을 기준으로 확인하세요.",
] as const;

function expandedSeoBodySignature(profileIndex: number): string {
  const expandedIndex = profileIndex - LEGACY_ACTIVE_REGION_PAGE_COUNT;
  const addressIndex = expandedIndex % EXPANDED_META_ADDRESS_VARIANTS.length;
  const courseIndex =
    Math.floor(expandedIndex / EXPANDED_META_ADDRESS_VARIANTS.length) %
    EXPANDED_META_COURSE_VARIANTS.length;
  const callIndex =
    Math.floor(
      expandedIndex /
        (EXPANDED_META_ADDRESS_VARIANTS.length *
          EXPANDED_META_COURSE_VARIANTS.length),
    ) % EXPANDED_META_CALL_VARIANTS.length;
  const paymentIndex =
    Math.floor(
      expandedIndex /
        (EXPANDED_META_ADDRESS_VARIANTS.length *
          EXPANDED_META_COURSE_VARIANTS.length *
          EXPANDED_META_CALL_VARIANTS.length),
    ) % EXPANDED_META_PAYMENT_VARIANTS.length;

  return `${EXPANDED_META_ADDRESS_VARIANTS[addressIndex]} ${EXPANDED_META_COURSE_VARIANTS[courseIndex]} ${EXPANDED_META_CALL_VARIANTS[callIndex]} ${EXPANDED_META_PAYMENT_VARIANTS[paymentIndex]}`;
}

function profileIndexFor(node: RegionNode): number {
  return getRegionProfileIndex(node.path);
}

function assertAvailable(node: RegionNode): void {
  if (node.availability !== "active" || node.records.length === 0) {
    throw new RegionSeoCopyError(
      REGION_SEO_COPY_UNAVAILABLE,
      `${node.displayName} 지역은 검토된 SEO 카피를 생성할 수 없습니다.`,
    );
  }
}

function buildMetadata(
  node: RegionNode,
  options: RegionSeoCopyOptions,
  metaRegionLabel: string,
  profileIndex: number,
  metadataKeywords: ReturnType<typeof buildRegionServiceKeywords>,
): RegionSeoCopy["metadata"] {
  const identity = options.approvedIdentity;
  if (!identity) {
    return {
      title: `${metadataKeywords.출장마사지} 이용 정보 | 마사지봄`,
      description: `${metaRegionLabel} 기준 ${metadataKeywords.출장마사지} 정보를 찾을 때 지역 범위, 코스·가격, 이용 전 확인 항목을 순서대로 살펴볼 수 있는 안내 페이지입니다.`,
      variationPlan: "fallback",
    };
  }

  if (profileIndex >= LEGACY_ACTIVE_REGION_PAGE_COUNT) {
    const expandedIndex = profileIndex - LEGACY_ACTIVE_REGION_PAGE_COUNT;
    const addressIndex = expandedIndex % EXPANDED_META_ADDRESS_VARIANTS.length;
    const courseIndex =
      Math.floor(expandedIndex / EXPANDED_META_ADDRESS_VARIANTS.length) %
      EXPANDED_META_COURSE_VARIANTS.length;
    const callIndex =
      Math.floor(
        expandedIndex /
          (EXPANDED_META_ADDRESS_VARIANTS.length *
            EXPANDED_META_COURSE_VARIANTS.length),
      ) % EXPANDED_META_CALL_VARIANTS.length;
    const paymentIndex =
      Math.floor(
        expandedIndex /
          (EXPANDED_META_ADDRESS_VARIANTS.length *
            EXPANDED_META_COURSE_VARIANTS.length *
            EXPANDED_META_CALL_VARIANTS.length),
      ) % EXPANDED_META_PAYMENT_VARIANTS.length;
    const primaryKeyword = metadataKeywords["출장마사지"];
    const secondaryKeyword =
      metadataKeywords[REGION_SERVICE_KEYWORD_SUFFIXES[1]];
    const sourceNames = node.representative?.sourceNames ?? [];
    const coverageAnchor =
      sourceNames.length > 1
        ? ` ${sourceNames[0]} 외 ${sourceNames.length - 1}개 포함.`
        : "";

    return {
      title: `${primaryKeyword} ${secondaryKeyword} | ${identity.commercialName} · 마사지봄`,
      description:
        `${metaRegionLabel} 마사지봄 ${identity.commercialName}의 ${primaryKeyword}, ${secondaryKeyword} 안내입니다.${coverageAnchor} ` +
        `${EXPANDED_META_ADDRESS_VARIANTS[addressIndex]} ${EXPANDED_META_COURSE_VARIANTS[courseIndex]} ` +
        `${EXPANDED_META_CALL_VARIANTS[callIndex]} ${EXPANDED_META_PAYMENT_VARIANTS[paymentIndex]}`,
      variationPlan: `expanded:${addressIndex}:${courseIndex}:${callIndex}:${paymentIndex}`,
    };
  }

  const openingIndex = profileIndex % META_OPENING_VARIANTS.length;
  const coreIndex =
    Math.floor(profileIndex / META_OPENING_VARIANTS.length) %
    META_CORE_VARIANTS.length;
  const closingIndex =
    Math.floor(
      profileIndex /
        (META_OPENING_VARIANTS.length * META_CORE_VARIANTS.length),
    ) % META_CLOSING_VARIANTS.length;
  const opening = META_OPENING_VARIANTS[openingIndex](identity, metaRegionLabel);
  const primaryKeyword = metadataKeywords["출장마사지"];
  const secondaryKeyword = metadataKeywords[REGION_SERVICE_KEYWORD_SUFFIXES[1]];
  const core = META_CORE_VARIANTS[coreIndex](
    primaryKeyword,
    secondaryKeyword,
  );
  const closing = META_CLOSING_VARIANTS[closingIndex];
  const sourceNames = node.representative?.sourceNames ?? [];
  const coverageAnchor =
    sourceNames.length <= 1
      ? ""
      : ` 포함 행정동은 ${sourceNames[0]} 외 ${sourceNames.length - 1}개입니다.`;

  return {
    title: `${primaryKeyword} ${secondaryKeyword} | ${identity.commercialName} · 마사지봄`,
    description: `${opening} ${core}${coverageAnchor} ${closing}`,
    variationPlan: `${openingIndex}:${coreIndex}:${closingIndex}`,
  };
}

/**
 * Produces deterministic, region-scoped copy without adding local claims.
 *
 * The owner-approved eight phrases are each rendered once across useful
 * semantic sections. No phrase is repeated in the visible body.
 */
export function buildRegionSeoCopy(
  node: RegionNode,
  options: RegionSeoCopyOptions = {},
): RegionSeoCopy {
  assertAvailable(node);

  const regionName = node.displayName.normalize("NFC").trim();
  const hierarchy = getRegionBreadcrumbs(node)
    .slice(1)
    .map((breadcrumb) => breadcrumb.name);
  const scopeLabel = hierarchy.join(" ");
  const profileIndex = profileIndexFor(node);
  const keywords = buildRegionServiceKeywords(regionName);
  const metaRegionLabel = getMetaRegionLabel(node.path);
  const metadataKeywords = buildRegionServiceKeywords(metaRegionLabel);
  const visible = Object.values(keywords);
  const heroLead = HERO_LEAD_VARIANTS[profileIndex % HERO_LEAD_VARIANTS.length](
    scopeLabel,
  );
  const sectionLead = SECTION_LEAD_VARIANTS[
    Math.floor(profileIndex / HERO_LEAD_VARIANTS.length) %
      SECTION_LEAD_VARIANTS.length
  ](scopeLabel);
  const courseReadingBase = COURSE_READING_VARIANTS[
    Math.floor(
      profileIndex /
        (HERO_LEAD_VARIANTS.length * SECTION_LEAD_VARIANTS.length),
    ) % COURSE_READING_VARIANTS.length
  ];
  const courseReading =
    profileIndex < LEGACY_ACTIVE_REGION_PAGE_COUNT
      ? courseReadingBase
      : `${courseReadingBase} ${expandedSeoBodySignature(profileIndex)}`;

  return {
    locality: {
      regionName,
      hierarchy,
      scopeLabel,
      path: node.path,
      kind: node.kind,
    },
    variationKey: `${node.kind}:${node.path}`,
    keywords: {
      all: keywords,
      metadata: metadataKeywords,
      primary: keywords.출장마사지,
      visible,
    },
    metadata: buildMetadata(
      node,
      options,
      metaRegionLabel,
      profileIndex,
      metadataKeywords,
    ),
    hero: {
      heading: {
        tag: "h1",
        text:
          options.approvedHeading?.trim() ||
          `${regionName} 출장 마사지 이용 정보`,
      },
      lead: { tag: "p", text: heroLead },
    },
    sections: [
      {
        id: "region-scope",
        heading: {
          tag: "h2",
          text: `${keywords.출장마사지} 코스와 이용 안내`,
        },
        lead: {
          tag: "p",
          text: `${keywords.출장안마}를 검색해 방문했다면 먼저 이 페이지가 다루는 범위가 ${scopeLabel}인지 확인하세요. ${sectionLead}`,
        },
        subsections: [
          {
            heading: {
              tag: "h3",
              text: `${keywords.출장타이마사지}와 ${keywords.출장스웨디시} 비교`,
            },
            paragraphs: [
              {
                tag: "p",
                text: courseReading,
              },
            ],
          },
          {
            heading: {
              tag: "h3",
              text: `${keywords.출장홈타이}·${keywords.토닥이} 확인 항목`,
            },
            paragraphs: [
              {
                tag: "p",
                text: "검색 표현은 서비스의 세부 조건을 대신하지 않습니다. 방문 지역, 희망 코스, 이용 시간을 정한 뒤 공개된 안내와 상담 내용을 함께 비교하세요.",
              },
            ],
          },
        ],
      },
      {
        id: "course-reading-guide",
        heading: {
          tag: "h2",
          text: `${keywords.남성전용마사지}·${keywords.여성전용마사지} 이용 조건`,
        },
        lead: {
          tag: "p",
          text: "대상별 프로그램 제공 여부와 코스 구성은 검색어만으로 단정하지 않고 전화상담에서 확인해야 합니다. 코스명, 이용 시간, 표시 금액을 함께 알려주면 확인이 빠릅니다.",
        },
        subsections: [],
      },
    ],
  };
}

/** Returns only renderable semantic text, in document order. */
export function flattenRegionSeoBody(
  copy: RegionSeoCopy,
): SemanticText<"h1" | "h2" | "h3" | "p">[] {
  return [
    copy.hero.heading,
    copy.hero.lead,
    ...copy.sections.flatMap((section) => [
      section.heading,
      section.lead,
      ...section.subsections.flatMap((subsection) => [
        subsection.heading,
        ...subsection.paragraphs,
      ]),
    ]),
  ];
}
