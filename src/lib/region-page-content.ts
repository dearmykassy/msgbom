import {
  formatNodeContext,
  getDirectChildren,
  getRegionBreadcrumbs,
  PROVINCES,
  resolveRegionNode,
  type RegionChild,
  type RegionNode,
  type RegionNodeKind,
} from "./regions";
import {
  ACTIVE_REGION_PAGE_COUNT,
  getRegionProfileIndex,
  LEGACY_ACTIVE_REGION_PAGE_COUNT,
} from "./region-profile-index";
import { formatKrw, PROVISIONAL_PRICING } from "../data/provisional-pricing";
import { buildRegionServiceFaqs } from "../data/service-guide";

export type RegionPageStat = {
  label: string;
  value: string;
};

export type RegionPageStep = {
  title: string;
  description: string;
};

export type RegionPageFaq = {
  question: string;
  answer: string;
};

export type RegionPageCoverageItem = {
  name: string;
  description: string;
  path?: string;
};

export type RegionPageRelatedLink = {
  name: string;
  path: string;
  description: string;
};

export type RegionPageContent = {
  regionName: string;
  facts: {
    kind: RegionNodeKind;
    availability: "active";
    parentContext: string;
    representativeCount: number;
    sourceUnitCount: number;
    childCount: number;
    childLabel: string;
    sourceLabel: string;
    sourceNames: readonly string[];
    hierarchyLabel: string;
    commercialName: string;
    siblingCount: number;
    directChildNames: readonly string[];
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  stats: RegionPageStat[];
  overview: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  localGuide: {
    eyebrow: string;
    title: string;
    lead: string;
    coverage: {
      title: string;
      description: string;
      items: RegionPageCoverageItem[];
    };
    selection: {
      title: string;
      paragraphs: string[];
    };
    related: {
      title: string;
      description: string;
      links: RegionPageRelatedLink[];
    };
  };
  steps: RegionPageStep[];
  faqs: RegionPageFaq[];
  directory: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
  };
};

export type RegionPageContentOptions = {
  /**
   * Optional display-only binding for a caller that already has a reviewed
   * public-facing region label. Counts and hierarchy facts always come from
   * the resolved RegionNode.
   */
  regionName?: string;
  /** Reviewed, path-bound public identity from the approved title manifest. */
  commercialName?: string;
};

export const REGION_PAGE_CONTENT_UNAVAILABLE =
  "REGION_PAGE_CONTENT_UNAVAILABLE" as const;
export const REGION_PAGE_CONTENT_DATA_MISMATCH =
  "REGION_PAGE_CONTENT_DATA_MISMATCH" as const;

export class RegionPageContentError extends Error {
  constructor(
    public readonly code:
      | typeof REGION_PAGE_CONTENT_UNAVAILABLE
      | typeof REGION_PAGE_CONTENT_DATA_MISMATCH,
    message: string,
  ) {
    super(message);
    this.name = "RegionPageContentError";
  }
}

function formatCount(value: number, suffix: "개" | "곳"): string {
  return `${value.toLocaleString("ko-KR")}${suffix}`;
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function profileIndexFor(path: string): number {
  return getRegionProfileIndex(path);
}

function permutedProfileIndex(index: number, salt: number): number {
  const oddFactor = 3 + (salt % 143) * 2;
  if (index < LEGACY_ACTIVE_REGION_PAGE_COUNT) {
    return (index * oddFactor + salt * 17) % LEGACY_ACTIVE_REGION_PAGE_COUNT;
  }
  return (
    LEGACY_ACTIVE_REGION_PAGE_COUNT +
    ((index - LEGACY_ACTIVE_REGION_PAGE_COUNT) * oddFactor + salt * 17) %
      Math.max(1, ACTIVE_REGION_PAGE_COUNT - LEGACY_ACTIVE_REGION_PAGE_COUNT)
  );
}

function mixedRadixChoices(
  profileIndex: number,
  salt: number,
  radices: readonly [number, number, number],
): readonly [number, number, number] {
  const value = permutedProfileIndex(profileIndex, salt);
  const first = value % radices[0];
  const second = Math.floor(value / radices[0]) % radices[1];
  const third =
    Math.floor(value / (radices[0] * radices[1])) % radices[2];
  return [first, second, third];
}

const PAGE_SCOPE_CHECKS = [
  "현재 경로의 시·구·동 순서를 주소와 대조하세요.",
  "대표지역과 공식 동명 중 상담에 쓸 표기를 구분하세요.",
  "하위 카드인지 마지막 포함 동명인지 페이지 단계를 확인하세요.",
  "같은 이름의 다른 지역이 없는지 상위 행정명칭을 읽으세요.",
  "직속 지역 목록과 형제 지역 링크의 역할을 나눠 보세요.",
  "검색어의 지역명보다 실제 주소에 적힌 행정명을 우선하세요.",
  "지역 카드 수와 기준 행정단위 수를 같은 의미로 보지 마세요.",
  "상위 허브에서 들어왔다면 선택한 하위 범위를 다시 확인하세요.",
  "검색 결과로 바로 왔다면 현재 위치 경로부터 살펴보세요.",
  "대표동 묶음이라면 포함 행정동 가운데 실제 위치를 고르세요.",
] as const;

const PAGE_DECISION_CHECKS = [
  "가격표에서는 코스명·시간·금액을 한 묶음으로 읽습니다.",
  "시간이 우선인지 예산이 우선인지 비교 기준을 하나 정합니다.",
  "두 후보만 남기고 화면에 없는 조합은 임의로 계산하지 않습니다.",
  "코스 설명과 가격 행이 같은 선택지를 가리키는지 맞춥니다.",
  "인원과 결제 방식은 표시 가격과 별도 질문으로 적습니다.",
  "검색 키워드 대신 운영표의 공식 코스명을 메모합니다.",
  "같은 코스의 다른 시간과 같은 시간의 다른 코스를 구분합니다.",
  "가격 차이와 이용 시간 차이를 따로 비교해 봅니다.",
  "현재 가격표의 기준일을 확인하고 후보 항목을 고릅니다.",
  "코스 추천이 아니라 공개 조건 비교라는 점을 유지합니다.",
] as const;

const PAGE_CALL_CHECKS = [
  "전화에서는 지역·코스·시간·최종 금액 순으로 확인하세요.",
  "방문 가능 여부와 예상 도착 시간은 통화 답변으로 기록하세요.",
  "현장 후불과 카드 결제 조건을 예약 전에 다시 물어보세요.",
  "지역을 바꿨다면 같은 코스라도 일정 확인을 새로 하세요.",
  "화면과 다른 안내를 받으면 최신 적용 조건을 되물으세요.",
  "주소의 마지막 동명을 생략하지 말고 상담원에게 전달하세요.",
  "확정되지 않은 제공 범위나 추가 비용을 미리 추정하지 마세요.",
  "두 사람 이용이라면 인원과 동시 진행 여부를 별도로 확인하세요.",
  "통화 메모는 다른 지역의 비교 내용과 분리해 보관하세요.",
  "세부 조건이 모두 맞을 때 예약 내용을 마지막으로 반복하세요.",
] as const;

function pageGuidanceCue(profileIndex: number, salt: number): string {
  const [scopeIndex, decisionIndex, callIndex] = mixedRadixChoices(
    profileIndex,
    salt,
    [PAGE_SCOPE_CHECKS.length, PAGE_DECISION_CHECKS.length, PAGE_CALL_CHECKS.length],
  );
  return `${PAGE_SCOPE_CHECKS[scopeIndex]} ${PAGE_DECISION_CHECKS[decisionIndex]} ${PAGE_CALL_CHECKS[callIndex]}`;
}

function takeFromOffset<T>(
  values: readonly T[],
  offset: number,
  limit: number,
): T[] {
  if (values.length === 0 || limit <= 0) return [];
  const count = Math.min(values.length, limit);
  return Array.from(
    { length: count },
    (_, index) => values[(offset + index) % values.length],
  );
}

function hierarchyFor(node: RegionNode): string[] {
  return getRegionBreadcrumbs(node)
    .slice(1)
    .map((breadcrumb) => breadcrumb.name);
}

function siblingChildrenFor(node: RegionNode): RegionChild[] {
  if (node.kind === "province") {
    return PROVINCES.filter(
      (province) =>
        province.availability === "active" && province.path !== node.path,
    ).map((province) => ({
      kind: "province",
      name: province.name,
      path: province.path,
      representativeCount: 0,
      sourceUnitCount: 0,
    }));
  }

  const parent = resolveRegionNode(node.segments.slice(0, -1));
  if (!parent) return [];
  return getDirectChildren(parent).filter((child) => child.path !== node.path);
}

function describeChild(child: RegionChild): string {
  if (child.kind === "representative") {
    return `대표지역 1곳 · 기준 행정동 ${formatCount(child.sourceUnitCount, "개")}`;
  }
  return `대표지역 ${formatCount(child.representativeCount, "곳")} · 기준 행정단위 ${formatCount(child.sourceUnitCount, "개")}`;
}

function variantIndex(seed: number, salt: number, length: number): number {
  return Math.floor(seed / salt) % length;
}

function coverageNarrativeFor(
  node: RegionNode,
  regionName: string,
  children: readonly RegionChild[],
  seed: number,
  profileIndex: number,
): string {
  const sourceNames = node.representative?.sourceNames ?? [];
  const byUnits = [...children].sort(
    (left, right) =>
      right.sourceUnitCount - left.sourceUnitCount ||
      left.name.localeCompare(right.name, "ko"),
  );
  const byRepresentatives = [...children].sort(
    (left, right) =>
      right.representativeCount - left.representativeCount ||
      left.name.localeCompare(right.name, "ko"),
  );

  const factualClauses =
    node.kind === "representative"
      ? [
          `${regionName}은 ${sourceNames[0]}부터 ${sourceNames.at(-1)}까지 ${formatCount(sourceNames.length, "개")} 기준 동명을 한 페이지로 연결합니다.`,
          `${sourceNames.join(" · ")}은 서로 다른 페이지가 아니라 ${regionName} 대표지역 안에서 확인할 공식 동명 목록입니다.`,
          `이 페이지의 가장 앞 기준 동명은 ${sourceNames[0]}, 마지막 표기는 ${sourceNames.at(-1)}이며 모두 ${regionName} 범위에 속합니다.`,
          `${regionName}의 원장 단위는 대표지역 1곳과 기준 동명 ${formatCount(sourceNames.length, "개")}로 나뉩니다.`,
          `전화로 위치를 말할 때는 ${regionName}만 말하기보다 ${sourceNames[seed % sourceNames.length]}처럼 원장에 적힌 기준 동명을 함께 전하는 편이 정확합니다.`,
          `${sourceNames.length === 1 ? `${sourceNames[0]}은 별도 묶음 없이 ${regionName}과 바로 연결됩니다.` : `${sourceNames[0]} 외 ${formatCount(sourceNames.length - 1, "개")} 동명이 ${regionName} 아래에서 같은 대표지역을 공유합니다.`}`,
          `${regionName} 카드가 가리키는 행정 범위는 ${sourceNames.join(" → ")} 순으로 확인할 수 있습니다.`,
          `${sourceNames[Math.floor(sourceNames.length / 2)]}을 포함한 ${formatCount(sourceNames.length, "개")} 기준 동명은 모두 페이지 하단의 행정동 목록과 일치합니다.`,
        ]
      : [
          `${regionName} 직속 목록에서 기준 행정단위가 가장 많은 곳은 ${byUnits[0]?.name}, 가장 적은 곳은 ${byUnits.at(-1)?.name}입니다.`,
          `${regionName}의 대표지역 수를 기준으로 보면 ${byRepresentatives[0]?.name}이 목록의 앞쪽 비교 대상이고 ${byRepresentatives.at(-1)?.name}이 반대쪽 기준입니다.`,
          `${children[0]?.name}부터 ${children.at(-1)?.name}까지 ${formatCount(children.length, "개")} 직속 지역이 같은 행정단계로 연결됩니다.`,
          `${children.slice(0, 3).map((child) => child.name).join(" · ")}은 ${regionName} 바로 아래에서 선택할 수 있는 지역이며, 더 깊은 단계는 각 카드 안에서 확인합니다.`,
          `${byUnits[0]?.name}은 기준 행정단위 ${formatCount(byUnits[0]?.sourceUnitCount ?? 0, "개")}, ${byRepresentatives[0]?.name}은 대표지역 ${formatCount(byRepresentatives[0]?.representativeCount ?? 0, "곳")}를 연결합니다.`,
          `${regionName} 목록의 가운데 항목은 ${children[Math.floor(children.length / 2)]?.name}이며, 앞뒤 카드도 모두 동일한 직속 행정단계입니다.`,
          `${children.map((child) => child.name).slice(-3).join(" · ")}까지 내려가면 ${regionName} 직속 목록의 마지막 구간을 확인할 수 있습니다.`,
          `${regionName} 하위 카드는 이름순으로 배열되지만 각 카드의 대표지역 수와 기준 행정단위 수는 원장에 따라 서로 다릅니다.`,
        ];

  const readingActions = [
    "주소의 마지막 행정명칭과 카드 이름이 다르면 대표지역 안의 포함 동명 목록을 먼저 대조하세요.",
    "목적지가 어느 카드에 속하는지 정한 다음에야 같은 이름의 다른 시·구 페이지와 혼동하지 않습니다.",
    "검색창에서 들어왔더라도 상위 행정계층을 한 번 확인하면 동명이 같은 지역을 구분할 수 있습니다.",
    "직속 지역 수와 기준 행정단위 수는 의미가 다르므로 카드 수만 보고 실제 동명 수를 추정하지 마세요.",
    "대표지역 묶음은 탐색용 분류이며 전화상담에서는 실제 주소에 쓰이는 동명을 다시 알려줘야 합니다.",
    "하위 카드가 있는 페이지에서는 목적지 카드를 먼저 열고, 마지막 단계의 포함 행정동까지 내려가 확인하세요.",
    "행정구와 대표동을 한꺼번에 검색했다면 현재 위치 경로가 요청한 시·구 순서와 같은지 살펴보세요.",
    "같은 지역명이 다른 시·구에도 있을 수 있으므로 이 페이지의 상위 경로를 예약 메모에 함께 적어두세요.",
    "페이지에 표시된 묶음 수는 서비스 횟수가 아니라 지역 원장의 연결 단위를 뜻합니다.",
    "지역 선택을 끝낸 뒤에는 이 목록으로 돌아오기보다 선택한 하위 페이지에서 코스와 가격을 이어서 확인하세요.",
    "포함 동명이 하나여도 대표지역 명칭과 공식 주소 표기가 같은지 목록에서 확인하는 절차는 같습니다.",
    "여러 동명이 묶인 경우에는 대표지역 이름보다 주소에 적힌 세부 동명을 우선해 상담원에게 전달하세요.",
    "현재 카드가 상위 허브인지 마지막 대표지역인지 확인하면 다음에 눌러야 할 링크를 쉽게 고를 수 있습니다.",
    "목록 순서는 우열이나 추천 순위가 아니라 한글 이름순 탐색을 위한 배열입니다.",
    "지역 범위를 먼저 확정하면 뒤의 코스 비교에서 방문 위치를 반복해서 바꿀 필요가 없습니다.",
    "원장의 지역 수치는 페이지 생성 기준이며 실제 일정과 배정 가능 여부는 전화 확인 대상입니다.",
  ] as const;
  const verificationClosures = [
    "이 확인을 마치면 주소 범위는 고정하고 다음 가격 비교에서 코스 조건만 바꾸면 됩니다.",
    "선택 결과는 상담 메모 첫 줄에 상위 지역부터 마지막 동명 순으로 적어 두세요.",
    "범위가 맞지 않으면 가격표를 읽기 전에 상위 페이지나 검색으로 돌아가는 편이 정확합니다.",
    "마지막 동명이 확정될 때까지 방문 가능 여부를 같은 지역으로 추정하지 않습니다.",
    "페이지 하단 전체 목록은 일부 미리보기에서 빠진 직속 지역을 찾을 때 사용하세요.",
    "확인한 행정명칭은 검색 키워드가 아니라 실제 상담 위치를 구분하는 기준으로 씁니다.",
    "주소 단계가 하나라도 다르면 같은 대표명처럼 보여도 별도 지역 페이지에서 다시 확인합니다.",
    "이 범위 확인은 서비스 제공을 보장하는 표시가 아니며 실제 일정은 통화에서 정합니다.",
  ] as const;
  const [factIndex, actionIndex, closureIndex] = mixedRadixChoices(
    profileIndex,
    5,
    [factualClauses.length, readingActions.length, verificationClosures.length],
  );

  return `${factualClauses[factIndex]} ${readingActions[actionIndex]} ${verificationClosures[closureIndex]}`;
}

function priceReadingParagraphs(
  commercialName: string,
  primaryCourse: (typeof PROVISIONAL_PRICING)[number],
  primaryOption: (typeof primaryCourse.options)[number],
  secondaryCourse: (typeof PROVISIONAL_PRICING)[number],
  secondaryOption: (typeof secondaryCourse.options)[number],
  scopeInstruction: string,
  seed: number,
  profileIndex: number,
): string[] {
  const priceGap = Math.abs(primaryOption.priceKrw - secondaryOption.priceKrw);
  const minuteGap = Math.abs(primaryOption.minutes - secondaryOption.minutes);
  const comparisonFacts = [
    `${primaryCourse.name} ${primaryOption.minutes}분 ${formatKrw(primaryOption.priceKrw)}과 ${secondaryCourse.name} ${secondaryOption.minutes}분 ${formatKrw(secondaryOption.priceKrw)}을 나란히 놓으면 코스·시간·금액이 모두 같은 조건인지 바로 구분할 수 있습니다.`,
    `${commercialName} 가격표에서 이번 비교 기준은 ${primaryCourse.name} ${primaryOption.minutes}분과 ${secondaryCourse.name} ${secondaryOption.minutes}분이며 금액 차이는 ${formatKrw(priceGap)}입니다.`,
    `${primaryCourse.name}과 ${secondaryCourse.name}을 비교할 때 이용 시간 차이는 ${minuteGap}분, 표시 금액은 각각 ${formatKrw(primaryOption.priceKrw)}와 ${formatKrw(secondaryOption.priceKrw)}입니다.`,
    `${primaryOption.minutes}분 ${primaryCourse.name}은 ${formatKrw(primaryOption.priceKrw)}, ${secondaryOption.minutes}분 ${secondaryCourse.name}은 ${formatKrw(secondaryOption.priceKrw)}이므로 코스명보다 시간부터 맞춰 보는 방법도 가능합니다.`,
    `현재 운영표의 ${primaryCourse.name} ${primaryOption.minutes}분 항목과 ${secondaryCourse.name} ${secondaryOption.minutes}분 항목은 ${formatKrw(priceGap)} 차이가 나며, 이는 전달받은 표의 금액을 그대로 비교한 값입니다.`,
    `${commercialName}에서 예시로 고른 두 항목은 ${primaryCourse.name} ${formatKrw(primaryOption.priceKrw)}와 ${secondaryCourse.name} ${formatKrw(secondaryOption.priceKrw)}입니다. 시간은 각각 ${primaryOption.minutes}분과 ${secondaryOption.minutes}분입니다.`,
    `${primaryCourse.name}을 기준으로 보면 ${primaryOption.minutes}분 선택지이고, 반대 비교 항목인 ${secondaryCourse.name}은 ${secondaryOption.minutes}분 선택지입니다. 두 가격의 간격은 ${formatKrw(priceGap)}입니다.`,
    `${primaryCourse.name} ${primaryOption.minutes}분 → ${secondaryCourse.name} ${secondaryOption.minutes}분 순으로 읽으면 이용 시간은 ${minuteGap}분 차이이며 화면 금액도 함께 대조할 수 있습니다.`,
  ] as const;
  const decisionActions = [
    "희망 코스가 정해졌다면 같은 코스 안에서 시간별 금액을 다시 보고, 시간이 우선이라면 같은 시간대의 다른 코스를 비교하세요.",
    "두 항목 중 하나를 고르는 예시일 뿐 추천 순위는 아니며, 제공 범위는 코스 이름만으로 단정하지 않습니다.",
    "예약 메모에는 선택한 코스명과 분 단위 시간을 같이 적어 두어 서로 다른 가격 항목이 섞이지 않게 하세요.",
    "표시 금액은 기준일의 운영표이므로 결제 직전에는 코스와 시간뿐 아니라 최종 금액도 한 문장으로 재확인하세요.",
    "관리 방식 설명을 먼저 읽은 뒤 시간과 예산을 맞추면 이름이 비슷한 코스를 잘못 선택할 가능성을 줄일 수 있습니다.",
    "가격 차이만 보지 말고 이용 시간도 함께 비교해야 더 긴 코스가 무조건 같은 구성이라고 오해하지 않습니다.",
    "전화할 때 두 후보를 모두 말하면 지역 확인 뒤 각 코스의 현재 제공 조건을 차례로 문의할 수 있습니다.",
    "화면의 예시가 원하는 시간이 아니라면 전체 가격표에서 해당 코스의 다른 시간 항목을 선택해 다시 비교하세요.",
    "코스명은 검색 키워드와 다를 수 있으므로 검색어 대신 가격표에 적힌 공식 코스명을 상담 때 사용하세요.",
    "한 사람 이용과 두 사람 동시 이용은 같은 가격표 항목으로 추정하지 말고 인원과 진행 조건을 별도로 확인하세요.",
    "특정 신체 효과를 기대해 코스를 고르기보다 공개된 진행 방식과 시간 범위가 목적에 맞는지 살펴보세요.",
    "현재 표에 없는 조합을 임의로 계산하지 말고 표시된 시간·금액 중 가까운 후보를 정해 상담에서 질문하세요.",
    "지역을 바꾸더라도 이 페이지의 가격표 기준은 같지만, 실제 일정과 방문 가능 여부는 새 위치로 다시 확인해야 합니다.",
    "최종 선택 전에는 코스 설명, 이용 시간, 표시 금액의 세 항목을 소리 내어 한 번씩 맞춰 보는 방식이 안전합니다.",
    "가격표의 행을 위아래로 읽기보다 후보 두 개를 정해 가로로 비교하면 상담할 내용을 짧게 정리할 수 있습니다.",
    "결제 방식은 가격표 금액과 별도 확인 항목이므로 현장 후불과 카드 사용 조건도 예약 확정 전에 질문하세요.",
  ] as const;
  const comparisonClosures = [
    "두 후보의 제공 조건은 화면 설명과 전화 안내가 모두 일치하는지 확인한 뒤 결정합니다.",
    "이 차이는 추천 점수가 아니라 시간과 예산을 나누어 보는 계산 기준입니다.",
    "코스 후보를 바꾸면 이전 금액을 그대로 적용하지 말고 새 행의 표시 가격을 다시 읽습니다.",
    "한 항목을 정한 후에도 이용 인원과 방문 위치는 가격과 별개의 확인 항목으로 남습니다.",
    "비교 결과는 코스명 뒤에 시간과 금액을 붙인 한 줄 메모로 정리할 수 있습니다.",
    "같은 시간대라도 코스가 다르면 관리 설명을 별도로 읽어야 합니다.",
    "같은 코스라도 시간이 바뀌면 다른 가격 행이므로 상담 때 분 단위를 생략하지 않습니다.",
    "화면의 기준일 이후 변경 여부는 최종 통화에서 확인해야 합니다.",
  ] as const;
  const scopeClosures = [
    "지역과 코스를 한 문장에 함께 적으면 전화 첫 질문을 짧게 만들 수 있습니다.",
    "주소 후보가 두 곳이면 코스보다 방문 지역을 먼저 하나로 좁혀 주세요.",
    "동시 이용 인원이 있다면 선택한 가격 행과 분리해 추가 확인 목록에 적습니다.",
    "상담 전에는 후보를 무리하게 하나로 확정하지 않고 두 항목까지 비교해도 됩니다.",
    "가격표에서 찾지 못한 표현은 임의 코스명으로 바꾸지 말고 그대로 질문합니다.",
    "선택한 지역 페이지를 닫기 전에 상위 행정명칭도 메모에 남겨 두세요.",
    "결제 수단 질문은 가격 비교가 끝난 뒤 별도의 확인 순서로 둡니다.",
    "예상 도착 시간은 가격표가 제공하는 정보가 아니므로 통화에서만 확인합니다.",
    "코스 설명 중 의료적 효과로 오해할 표현은 선택 기준으로 사용하지 않습니다.",
    "새 지역 페이지로 이동했다면 같은 코스 후보라도 방문 범위를 다시 확인합니다.",
  ] as const;
  const recommendationClosures = [
    "표에 없는 할인이나 추가 구성을 전제로 최종 금액을 계산하지 않습니다.",
    "공개 항목만 후보로 삼고 상세 제공 범위는 전화 답변을 기록합니다.",
    "두 코스의 이름이 비슷해도 설명과 시간을 각각 읽어 혼동을 줄입니다.",
    "가격보다 시간이 중요하다면 상담 시작 때 그 우선순위를 먼저 말합니다.",
    "예산이 정해져 있다면 표시 금액 범위 안의 후보만 남겨 질문합니다.",
    "코스 선택 이유는 개인 선호로 남기고 페이지가 효능을 보장한다고 해석하지 않습니다.",
    "현장 결제 금액은 예약 확정 문답에서 마지막으로 반복 확인합니다.",
    "상담원 답변이 화면과 다르면 최신 적용 조건을 다시 질문한 뒤 결정합니다.",
  ] as const;
  const first = mixedRadixChoices(profileIndex, 7, [
    comparisonFacts.length,
    decisionActions.length,
    comparisonClosures.length,
  ]);
  const second = mixedRadixChoices(profileIndex, 11, [
    decisionActions.length,
    scopeClosures.length,
    comparisonClosures.length,
  ]);
  const third = mixedRadixChoices(profileIndex, 13, [
    decisionActions.length,
    recommendationClosures.length,
    comparisonClosures.length,
  ]);

  return [
    `${comparisonFacts[first[0]]} ${decisionActions[first[1]]} ${comparisonClosures[first[2]]}`,
    `${scopeInstruction} ${decisionActions[second[0]]} ${scopeClosures[second[1]]} ${comparisonClosures[second[2]]}`,
    `이 비교는 전달받은 운영 가격표를 읽는 예시이며 특정 코스 추천이 아닙니다. ${decisionActions[third[0]]} ${recommendationClosures[third[1]]} ${comparisonClosures[third[2]]}`,
  ];
}

function coverageItemsFor(
  node: RegionNode,
  children: readonly RegionChild[],
  seed: number,
  profileIndex: number,
): RegionPageCoverageItem[] {
  const itemRoles = [
    "첫 항목은 주소 표기 확인의 시작점입니다.",
    "둘째 항목은 앞 동명과 분리해 읽습니다.",
    "셋째 항목은 묶음 범위의 중간 확인점입니다.",
    "넷째 항목은 미리보기의 마지막 비교점입니다.",
    "다섯째 항목은 넓은 묶음에서 추가로 확인할 동명입니다.",
    "여섯째 항목은 앞선 표기와 같은 대표지역을 공유합니다.",
    "일곱째 항목도 별도 서비스명이 아닌 주소 기준 동명입니다.",
    "여덟째 항목은 목록 끝부분의 공식 표기입니다.",
    "아홉째 항목까지 확인하면 이 대표지역의 전체 동명 범위가 완성됩니다.",
  ] as const;
  if (node.kind === "representative" && node.representative) {
    return node.representative.sourceNames.map((sourceName, index) => ({
      name: sourceName,
      description: `${node.displayName} 대표지역에 연결된 공식 기준 동명입니다. ${itemRoles[index]} ${pageGuidanceCue(profileIndex, 53 + index)}`,
    }));
  }

  return takeFromOffset(children, seed % Math.max(children.length, 1), 4).map(
    (child, index) => ({
      name: child.name,
      path: child.path,
      description: `${describeChild(child)}. ${itemRoles[index]} ${pageGuidanceCue(profileIndex, 53 + index)}`,
    }),
  );
}

function relatedLinksFor(
  node: RegionNode,
  siblings: readonly RegionChild[],
  seed: number,
  profileIndex: number,
): RegionPageRelatedLink[] {
  const links: RegionPageRelatedLink[] = [];
  const parent =
    node.kind === "province"
      ? null
      : resolveRegionNode(node.segments.slice(0, -1));

  if (parent) {
    links.push({
      name: parent.displayName,
      path: parent.path,
      description: `${parent.displayName}의 하위 지역 전체 보기. 상위 범위를 넓히는 링크입니다. ${pageGuidanceCue(profileIndex, 71)}`,
    });
  }

  for (const [index, sibling] of takeFromOffset(
    siblings,
    Math.floor(seed / 7) % Math.max(siblings.length, 1),
    parent ? 3 : 2,
  ).entries()) {
    links.push({
      name: sibling.name,
      path: sibling.path,
      description:
        sibling.representativeCount > 0
          ? `${sibling.name} 대표지역 ${formatCount(sibling.representativeCount, "곳")} 보기. ${["같은 단계 첫 비교 링크", "같은 단계 둘째 비교 링크", "같은 단계 셋째 비교 링크"][index]}입니다. ${pageGuidanceCue(profileIndex, 73 + index)}`
          : `${sibling.name} 지역 안내 보기. ${["같은 단계 첫 비교 링크", "같은 단계 둘째 비교 링크", "같은 단계 셋째 비교 링크"][index]}입니다. ${pageGuidanceCue(profileIndex, 73 + index)}`,
    });
  }

  return links;
}

function relatedNarrativeFor(
  node: RegionNode,
  regionName: string,
  siblings: readonly RegionChild[],
  links: readonly RegionPageRelatedLink[],
  seed: number,
  profileIndex: number,
): string {
  const parentLink = links.find(
    (link) => link.path === resolveRegionNode(node.segments.slice(0, -1))?.path,
  );
  const siblingLinks = links.filter((link) => link !== parentLink);
  const siblingPosition =
    [
      ...siblings,
      {
        kind: node.kind,
        name: regionName,
        path: node.path,
        representativeCount: node.records.length,
        sourceUnitCount: node.records.reduce(
          (total, record) => total + record.sourceNames.length,
          0,
        ),
      } satisfies RegionChild,
    ]
      .sort((left, right) => left.name.localeCompare(right.name, "ko"))
      .findIndex((sibling) => sibling.path === node.path) + 1;
  const factualClauses = [
    parentLink
      ? `${parentLink.name} 페이지로 올라가면 ${regionName}과 같은 단계의 전체 지역 목록을 다시 볼 수 있습니다.`
      : `${regionName}은 수도권 최상위 지역이므로 다른 시·도 카드는 메인 지역 목록에서 나란히 비교합니다.`,
    siblingLinks.length > 0
      ? `${siblingLinks.map((link) => link.name).join(" · ")}은 현재 페이지와 같은 상위 행정단위에서 이어서 볼 수 있는 링크입니다.`
      : `${regionName}은 현재 원장의 마지막 안내 단계라 같은 단계의 추가 링크가 없습니다.`,
    siblings.length > 0
      ? `${regionName}과 같은 단계에는 ${formatCount(siblings.length, "개")} 다른 지역이 있으며, 현재 링크 묶음은 그중 ${formatCount(siblingLinks.length, "개")}를 먼저 보여줍니다.`
      : `${regionName}에서는 상위 지역으로 돌아가거나 메인 지역 검색을 이용해 다음 범위를 정할 수 있습니다.`,
    siblingPosition > 0
      ? `${regionName}은 같은 상위 목록의 이름순 ${siblingPosition}번째 위치입니다. 앞뒤 지역으로 이동해도 행정계층의 깊이는 바뀌지 않습니다.`
      : `${regionName}은 별도 상위 목록 없이 시·도 단계에서 바로 선택하는 페이지입니다.`,
    siblingLinks[0]
      ? `${siblingLinks[0].name} 링크는 ${regionName}의 하위지역이 아니라 같은 단계의 별도 범위이므로 주소가 바뀔 때만 이동하세요.`
      : `${regionName}의 다음 범위는 하위 카드나 메인 검색에서 선택해야 합니다.`,
    parentLink && siblingLinks.at(-1)
      ? `${parentLink.name}은 한 단계 위로, ${siblingLinks.at(-1)?.name}은 같은 단계 옆으로 이동하는 링크입니다.`
      : `${regionName} 링크 묶음은 현재 행정단계를 벗어나는지 여부를 설명과 함께 표시합니다.`,
  ];
  const navigationActions = [
    "주소가 같은 상위 지역에 남아 있다면 옆 링크를, 시·구 자체가 달라졌다면 상위 페이지를 먼저 고르세요.",
    "관련 링크는 추천 순위가 아니라 행정계층 이동 도구이므로 실제 목적지와 같은 이름의 카드만 선택하세요.",
    "뒤로가기를 반복하기보다 상위 링크 한 번으로 목록을 되짚으면 현재 경로를 놓치지 않습니다.",
    "동일한 동명이 보일 때는 링크 설명에 적힌 상위 지역을 확인한 후 새 페이지를 여세요.",
    "이웃 링크로 이동하면 코스표보다 먼저 새 페이지의 지역 범위 문단을 확인하는 순서가 좋습니다.",
    "하위지역을 찾는 중이라면 같은 단계 링크보다 페이지 하단의 직속 지역 카드를 우선 이용하세요.",
    "상위 페이지는 범위를 넓히고 같은 단계 링크는 범위를 바꾸므로 두 이동 방식의 목적이 다릅니다.",
    "전화상담 전 마지막으로 연 페이지의 경로가 실제 주소와 일치하는지 관련 링크 영역에서 역으로 확인하세요.",
    "메인 검색 결과와 현재 경로가 다르면 관련 링크를 임의로 따라가기보다 주소의 시·구부터 다시 입력하세요.",
    "한 페이지에서 가격을 확인했더라도 관련 지역으로 옮겼다면 새 지역명으로 방문 가능 여부를 다시 물어야 합니다.",
    "현재 페이지에 머물지 이동할지는 코스가 아니라 주소의 행정단계가 달라졌는지를 기준으로 판단하세요.",
    "여러 후보지를 비교할 때는 각 링크를 새 창에 열기보다 한 지역씩 범위를 확인해 상담 메모를 분리하세요.",
  ] as const;
  const navigationClosures = [
    "이동 뒤에는 새 페이지의 현재 위치 경로를 먼저 읽고 기존 상담 메모와 섞지 않습니다.",
    "관련 링크의 숫자는 서비스 순위가 아니라 원장 연결 규모를 설명합니다.",
    "상위로 이동하면 범위가 넓어지고 옆으로 이동하면 같은 깊이에서 지역만 바뀝니다.",
    "주소가 그대로라면 관련 링크를 더 누르지 않고 현재 페이지에서 상담 준비를 마칩니다.",
    "목적지가 바뀐 경우에만 새 링크의 지역명으로 방문 가능 여부를 다시 확인합니다.",
    "링크 설명과 실제 주소가 일치하지 않으면 메인 검색에서 상위 행정명칭부터 다시 찾습니다.",
    "페이지 이동 기록은 가격 후보와 분리해 적어 서로 다른 지역의 정보를 합치지 않습니다.",
    "마지막 대표지역까지 내려간 뒤에는 포함 동명 목록이 다음 확인 지점입니다.",
    "허브 페이지에 머문다면 하단 전체 카드에서 직속 지역 하나를 더 선택해야 합니다.",
    "관련 링크는 탐색을 돕지만 실제 방문 가능 범위를 확장한다고 뜻하지 않습니다.",
    "두 지역을 비교할 때는 각각의 전화 확인 결과를 별도 메모로 관리하세요.",
    "현재 경로가 맞다면 위·옆 링크 대신 전화상담 버튼으로 다음 단계를 진행합니다.",
  ] as const;
  const [factIndex, actionIndex, closureIndex] = mixedRadixChoices(
    profileIndex,
    17,
    [factualClauses.length, navigationActions.length, navigationClosures.length],
  );

  return `${factualClauses[factIndex]} ${navigationActions[actionIndex]} ${navigationClosures[closureIndex]}`;
}

function childLabelFor(children: readonly RegionChild[]): string {
  const kinds = new Set(children.map((child) => child.kind));

  if (kinds.size === 0) return "포함 행정동";
  if (kinds.size > 1) return "하위 지역";
  if (kinds.has("municipality")) return "시·군";
  if (kinds.has("district")) return "구·군";
  return "동·대표 지역";
}

function directoryTitleFor(
  node: RegionNode,
  regionName: string,
  children: readonly RegionChild[],
  childLabel: string,
): string {
  if (node.kind === "representative") return `${regionName}에 포함된 행정동`;
  if (
    node.kind === "municipality" &&
    children.every((child) => child.kind === "district")
  ) {
    return "행정구 선택";
  }
  return `${childLabel} 선택`;
}

function assertVerifiedChildren(
  node: RegionNode,
  children: readonly RegionChild[],
): void {
  const expected = getDirectChildren(node);
  const receivedByPath = new Map(children.map((child) => [child.path, child]));

  const matches =
    expected.length === children.length &&
    expected.every((expectedChild) => {
      const received = receivedByPath.get(expectedChild.path);
      return (
        received?.kind === expectedChild.kind &&
        received.name === expectedChild.name &&
        received.representativeCount === expectedChild.representativeCount &&
        received.sourceUnitCount === expectedChild.sourceUnitCount
      );
    });

  if (!matches) {
    throw new RegionPageContentError(
      REGION_PAGE_CONTENT_DATA_MISMATCH,
      `${node.path}의 하위 지역 데이터가 확정된 지역 원장과 일치하지 않습니다.`,
    );
  }
}

function leadFor(
  node: RegionNode,
  regionName: string,
  commercialName: string,
  hierarchyLabel: string,
  childCount: number,
  childLabel: string,
  sourceUnitCount: number,
  profileIndex: number,
): string {
  if (node.kind === "representative") {
    const coverage = node.representative?.sourceNames.join(" · ") ?? regionName;
    return `${commercialName}은 ${hierarchyLabel} 범위에서 ${coverage} ${formatCount(sourceUnitCount, "개")} 기준 동명을 ${regionName} 대표지역으로 연결합니다. 현재 코스·가격을 살펴본 뒤 실제 방문 동명과 이용 시간을 전화로 확인하세요. ${pageGuidanceCue(profileIndex, 37)}`;
  }

  const firstChildren = getDirectChildren(node)
    .slice(0, 3)
    .map((child) => child.name)
    .join(" · ");
  return `${commercialName}은 ${hierarchyLabel} 아래 ${childLabel} ${formatCount(childCount, "개")}를 연결합니다. ${firstChildren}${childCount > 3 ? " 등" : ""}에서 목적지를 먼저 고르고, 공개된 시간·가격과 방문 가능 여부를 순서대로 확인하세요. ${pageGuidanceCue(profileIndex, 37)}`;
}

function overviewParagraphsFor(
  node: RegionNode,
  regionName: string,
  commercialName: string,
  hierarchyLabel: string,
  children: readonly RegionChild[],
  childCount: number,
  childLabel: string,
  sourceUnitCount: number,
  profileIndex: number,
): string[] {
  if (node.kind === "representative" && node.representative) {
    const sourceNames = node.representative.sourceNames.join(" · ");
    return [
      `${commercialName}의 행정 범위는 ${hierarchyLabel}입니다. ${regionName} 대표지역은 ${sourceNames} 항목을 함께 안내하며, 공식 행정동 명칭을 바꾸지 않고 중복 탐색을 줄이기 위한 사이트 단위로만 사용합니다. ${pageGuidanceCue(profileIndex, 41)}`,
      `${formatCount(sourceUnitCount, "개")} 기준 동명 중 실제 방문 위치를 먼저 정한 뒤 가격표에서 코스와 시간을 비교하세요. 전화상담에서는 선택한 동명과 코스, 이용 시간을 전달합니다. ${pageGuidanceCue(profileIndex, 43)}`,
    ];
  }

  const childPreview = children
    .slice(0, 5)
    .map((child) => `${child.name}(${child.representativeCount}곳)`)
    .join(" · ");

  return [
    `${commercialName} 페이지는 ${hierarchyLabel} 행정계층에서 ${childLabel} ${formatCount(childCount, "개")}, 대표지역 ${formatCount(node.records.length, "곳")}, 기준 행정단위 ${formatCount(sourceUnitCount, "개")}를 연결합니다. ${pageGuidanceCue(profileIndex, 41)}`,
    `하위 목록은 ${childPreview}${childCount > 5 ? " 등" : ""} 순으로 개별 페이지에 이어집니다. 목적지 페이지를 정한 뒤 코스별 시간과 운영 가격을 비교하고, 실제 방문 가능 여부와 일정은 24시간 전화상담에서 확인합니다. ${pageGuidanceCue(profileIndex, 43)}`,
  ];
}

function localGuideFor(
  node: RegionNode,
  regionName: string,
  commercialName: string,
  hierarchyLabel: string,
  children: readonly RegionChild[],
  siblings: readonly RegionChild[],
  seed: number,
  profileIndex: number,
): RegionPageContent["localGuide"] {
  const coverageItems = coverageItemsFor(node, children, seed, profileIndex);
  const relatedLinks = relatedLinksFor(
    node,
    siblings,
    seed,
    profileIndex,
  );
  const primaryCourseIndex = seed % PROVISIONAL_PRICING.length;
  const secondaryCourseIndex =
    (primaryCourseIndex + 1 + (Math.floor(seed / 17) % (PROVISIONAL_PRICING.length - 1))) %
    PROVISIONAL_PRICING.length;
  const primaryCourse = PROVISIONAL_PRICING[primaryCourseIndex];
  const secondaryCourse = PROVISIONAL_PRICING[secondaryCourseIndex];
  const primaryOption =
    primaryCourse.options[
      Math.floor(seed / PROVISIONAL_PRICING.length) % primaryCourse.options.length
    ];
  const secondaryOption =
    secondaryCourse.options[
      Math.floor(seed / 11) % secondaryCourse.options.length
    ];
  const scopeInstruction =
    node.kind === "representative" && node.representative
      ? `${node.representative.sourceNames.join(" · ")} 가운데 실제 방문 동명을 알려주세요.`
      : `${children.map((child) => child.name).slice(0, 6).join(" · ")}${children.length > 6 ? " 등" : ""} 중 어느 하위 지역인지 먼저 정해 주세요.`;
  const coverageNarrative = coverageNarrativeFor(
    node,
    regionName,
    children,
    seed,
    profileIndex,
  );
  const selectionParagraphs = priceReadingParagraphs(
    commercialName,
    primaryCourse,
    primaryOption,
    secondaryCourse,
    secondaryOption,
    scopeInstruction,
    seed,
    profileIndex,
  );
  const relatedNarrative = relatedNarrativeFor(
    node,
    regionName,
    siblings,
    relatedLinks,
    seed,
    profileIndex,
  );
  const localLeadActions = [
    "행정 범위를 먼저 좁히고 가격표 후보를 고른 뒤 관련 지역으로 이동하는 순서입니다.",
    "현재 주소가 속한 단계를 확인한 다음 코스 두 개를 비교하고 전화 메모를 완성합니다.",
    "대표지역 묶음, 운영 가격표, 상하위 링크를 서로 다른 확인 항목으로 나눴습니다.",
    "지역 원장 수치와 코스표 수치를 섞지 않도록 범위·가격·이동 정보를 차례로 읽습니다.",
    "검색 결과로 바로 들어온 방문자를 위해 현재 위치 확인에서 상담 준비까지 한 흐름으로 연결합니다.",
    "하위지역 선택과 코스 선택을 분리해 주소 범위를 먼저 확정하도록 구성했습니다.",
    "공식 동명 확인, 가격 후보 비교, 인접 페이지 탐색을 각기 독립된 문단으로 제공합니다.",
    "같은 이름의 다른 지역과 섞이지 않게 전체 계층을 표시하고 다음 이동 방향도 구분합니다.",
    "직속 지역의 연결 규모를 읽은 뒤 시간·금액 후보를 비교하는 실용 안내입니다.",
    "상위 허브와 마지막 대표지역의 역할 차이를 반영해 필요한 확인 순서를 정리했습니다.",
    "페이지에 있는 사실과 전화로 다시 확인할 내용을 구분해 예약 메모를 만들 수 있습니다.",
    "지역 카드 선택, 가격 행 비교, 관련 링크 이동에서 각각 무엇을 볼지 설명합니다.",
  ] as const;
  const localLeadReaders = [
    "주소를 아직 정하지 않았다면 지역 카드부터, 주소가 확정됐다면 코스 비교부터 읽으세요.",
    "검색으로 바로 들어온 경우에는 상위 경로를, 하위 카드에서 들어온 경우에는 포함 동명을 우선 확인하세요.",
    "처음 이용한다면 세 문단을 순서대로 보고, 재확인 중이라면 필요한 항목만 골라 볼 수 있습니다.",
    "여러 지역을 비교할 때는 현재 페이지의 범위 문장을 각 메모 맨 위에 남겨 구분하세요.",
    "코스를 먼저 정했더라도 실제 주소가 이 범위에 속하는지 확인한 뒤 상담을 시작해야 합니다.",
    "행정명칭이 익숙하지 않다면 직속 지역 설명의 대표지역 수와 동명 목록을 함께 보세요.",
    "가격 후보가 이미 있다면 비교 예시에서 시간과 금액만 대조하고 지역 범위는 별도로 고정하세요.",
    "관련 지역으로 이동할 계획이 없다면 마지막 링크 문단은 현재 경로를 역확인하는 용도로 쓰면 됩니다.",
    "대표동 이름과 주소 표기가 다를 때는 포함 행정동 설명을 상담 메모에 그대로 옮겨 적으세요.",
    "허브 페이지에서는 하위지역 선택이 남아 있고 대표지역 페이지에서는 전화 확인만 남습니다.",
  ] as const;
  const localLeadOutcomes = [
    "세 항목을 마치면 통화에서 물어볼 지역·코스·이동 여부가 분리됩니다.",
    "이 방식은 동일한 지역명이나 비슷한 코스명이 한 요청에 섞이는 것을 줄입니다.",
    "완성된 메모는 주소 한 줄, 코스 한 줄, 확인 질문 한 줄로 정리됩니다.",
    "페이지 정보와 통화 확인 사항을 나누면 화면에 없는 조건을 추정하지 않게 됩니다.",
    "각 단계의 결과를 남겨 두면 다른 지역 페이지를 보더라도 조건을 비교하기 쉽습니다.",
    "확인 순서가 끝나기 전에는 가격이나 방문 일정을 확정된 것으로 보지 않습니다.",
    "지역 데이터와 운영 가격표의 역할을 구분해 필요한 질문만 전화로 이어갈 수 있습니다.",
    "현재 페이지가 담당하는 범위와 다음 링크가 담당하는 범위를 명확히 나눌 수 있습니다.",
  ] as const;
  const localLeadChoice = mixedRadixChoices(profileIndex, 19, [
    localLeadActions.length,
    localLeadReaders.length,
    localLeadOutcomes.length,
  ]);

  return {
    eyebrow: "LOCAL DETAIL",
    title: `${commercialName} 지역 범위와 코스 읽기`,
    lead: `${hierarchyLabel}에 연결된 데이터만 사용합니다. ${localLeadActions[localLeadChoice[0]]} ${localLeadReaders[localLeadChoice[1]]} ${localLeadOutcomes[localLeadChoice[2]]}`,
    coverage: {
      title:
        node.kind === "representative"
          ? `${regionName}에 묶인 공식 동명 ${formatCount(coverageItems.length, "개")}`
          : `${regionName} 직속 ${childLabelFor(children)} 중 먼저 볼 지역`,
      description: coverageNarrative,
      items: coverageItems,
    },
    selection: {
      title: `${primaryCourse.name} ${primaryOption.minutes}분과 ${secondaryCourse.name} ${secondaryOption.minutes}분 비교 예시`,
      paragraphs: selectionParagraphs,
    },
    related: {
      title: `${regionName}에서 이어서 볼 지역`,
      description: relatedNarrative,
      links: relatedLinks,
    },
  };
}

function processStepsFor(
  node: RegionNode,
  regionName: string,
  commercialName: string,
  hierarchyLabel: string,
  children: readonly RegionChild[],
  sourceNames: readonly string[],
  localGuide: RegionPageContent["localGuide"],
  seed: number,
  profileIndex: number,
): RegionPageStep[] {
  const regionActions = [
    node.kind === "representative"
      ? `${sourceNames.join(" · ")} 중 주소에 적힌 기준 동명을 골라 ${regionName} 묶음과 대조합니다.`
      : `${children.slice(0, 5).map((child) => child.name).join(" · ")}${children.length > 5 ? " 등" : ""}에서 실제 주소가 속한 직속 지역을 엽니다.`,
    `${hierarchyLabel} 경로를 위에서 아래로 읽고 마지막 명칭이 현재 주소 범위와 같은지 확인합니다.`,
    node.kind === "representative"
      ? `${regionName} 대표명과 공식 주소 동명을 함께 메모해 묶음 이름만 전달하는 실수를 피합니다.`
      : `${regionName} 하위 카드의 대표지역 수가 아니라 주소의 행정명칭을 기준으로 다음 페이지를 선택합니다.`,
    `검색어에서 지역명만 분리한 뒤 ${hierarchyLabel} 순서와 일치하는 페이지인지 먼저 판별합니다.`,
    `같은 이름의 다른 지역을 제외하려면 ${regionName} 앞의 상위 행정명칭까지 상담 메모에 적습니다.`,
    node.kind === "representative"
      ? `페이지 하단 ${formatCount(sourceNames.length, "개")} 동명 목록에서 방문 위치 한 곳을 확정합니다.`
      : `전체 ${formatCount(children.length, "개")} 직속 카드 가운데 방문 위치와 맞는 한 곳만 남깁니다.`,
  ];
  const courseActions = [
    `${localGuide.selection.title}을 기준으로 두 후보의 시간과 금액을 각각 한 줄씩 적습니다.`,
    `전체 가격표에서 희망 코스 하나를 먼저 고른 뒤 같은 코스의 다른 시간 항목을 비교합니다.`,
    `이용 시간이 우선이면 같은 분 단위 항목을 찾고, 예산이 우선이면 표시 금액부터 후보를 좁힙니다.`,
    `코스 설명과 가격 행을 번갈아 보며 이름·시간·금액 세 항목이 같은 선택지를 가리키는지 확인합니다.`,
    `화면에 없는 조합은 계산하지 않고 공개된 가격표 안에서 상담할 후보를 두 개까지 정합니다.`,
    `검색 키워드 대신 운영 가격표의 코스명을 사용해 희망 시간과 함께 메모합니다.`,
    `두 사람 이용이나 결제 방식은 코스 금액과 합쳐 추정하지 않고 별도 질문으로 남겨 둡니다.`,
    `가격 차이와 시간 차이를 따로 비교한 뒤 더 중요한 기준 하나를 상담 시작 때 전달합니다.`,
  ];
  const callActions = [
    `${commercialName} 상담에서 ${hierarchyLabel} 위치, 선택 코스, 이용 시간, 화면 금액 순으로 읽어 줍니다.`,
    `전화가 연결되면 주소 범위를 먼저 말하고 코스 후보와 이용 시간을 이어서 전달합니다.`,
    `방문 지역과 인원을 전달한 뒤 선택한 코스의 현재 제공 여부와 최종 금액을 질문합니다.`,
    `상담 내용을 메모와 대조해 지역명·분 단위 시간·결제 방식이 모두 맞을 때 예약을 정합니다.`,
    `다른 지역 링크를 본 뒤라면 현재 통화의 방문지가 ${regionName} 범위인지 다시 한 번 말합니다.`,
    `24시간 상담은 방문 일정과 제공 조건을 확인하는 단계이므로 화면 정보만 보고 일정을 확정하지 않습니다.`,
    `현장 후불과 카드 결제 조건을 묻고, 추가 비용 여부가 있다면 최종 금액과 함께 확인합니다.`,
    `최종 확인에서는 코스 이름보다 주소와 이용 시간을 먼저 반복해 서로 다른 요청이 섞이지 않게 합니다.`,
  ];
  const stepClosures = [
    "완료한 항목은 다음 단계에서 바꾸지 않고 새 조건이 생기면 다시 첫 단계부터 맞춥니다.",
    "확인 결과는 상담 중 되묻기 쉽도록 한 문장으로 짧게 기록합니다.",
    "화면에 없는 조건은 추정해서 채우지 않고 질문 목록으로 남겨 둡니다.",
    "다른 지역 페이지의 메모와 섞이지 않게 현재 경로를 함께 표시합니다.",
    "선택이 끝나면 해당 페이지의 버튼으로 전화해 같은 순서로 내용을 전달합니다.",
    "각 단계는 서비스 보장이 아니라 정확한 상담을 위한 준비 절차입니다.",
    "조건을 바꾼 경우 이전 가격이나 지역 범위를 자동으로 이어서 적용하지 않습니다.",
    "최종 답변은 화면 문구보다 통화에서 확인한 최신 조건을 기준으로 기록합니다.",
    "주소·코스·결제 방식은 서로 다른 항목이므로 하나의 답으로 합치지 않습니다.",
    "필요한 정보가 빠졌다면 예약을 서두르기보다 해당 단계로 돌아가 확인합니다.",
    "이 순서를 따르면 지역 검색과 가격 비교의 목적을 구분할 수 있습니다.",
    "메모가 완성되면 실제 요청과 관련 없는 링크나 코스 후보는 지웁니다.",
  ] as const;
  const regionChoice = mixedRadixChoices(profileIndex, 23, [
    regionActions.length,
    stepClosures.length,
    callActions.length,
  ]);
  const courseChoice = mixedRadixChoices(profileIndex, 29, [
    courseActions.length,
    stepClosures.length,
    regionActions.length,
  ]);
  const callChoice = mixedRadixChoices(profileIndex, 31, [
    callActions.length,
    stepClosures.length,
    courseActions.length,
  ]);

  const steps: RegionPageStep[] = [
    {
      title: `${regionName} 주소 범위 고르기`,
      description: `${regionActions[regionChoice[0]]} ${stepClosures[regionChoice[1]]} ${callActions[regionChoice[2]]}`,
    },
    {
      title: `${localGuide.selection.title} 준비`,
      description: `${courseActions[courseChoice[0]]} ${stepClosures[courseChoice[1]]} ${regionActions[courseChoice[2]]}`,
    },
    {
      title: `${commercialName} 전화 확인`,
      description: `${callActions[callChoice[0]]} ${stepClosures[callChoice[1]]} ${courseActions[callChoice[2]]}`,
    },
  ];

  const orderModes = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
  ] as const;
  return orderModes[variantIndex(seed, 43, orderModes.length)].map(
    (index) => steps[index],
  );
}

/**
 * Builds copy exclusively from reviewed RegionNode facts and site-wide facts.
 * It deliberately contains no claims about local landmarks, travel times,
 * popularity, staff availability, or unconfirmed service coverage.
 */
export function buildRegionPageContent(
  node: RegionNode,
  children: readonly RegionChild[],
  options: RegionPageContentOptions = {},
): RegionPageContent {
  if (node.availability !== "active" || node.records.length === 0) {
    throw new RegionPageContentError(
      REGION_PAGE_CONTENT_UNAVAILABLE,
      `${node.displayName} 지역은 아직 상세 콘텐츠를 생성할 수 없습니다.`,
    );
  }

  assertVerifiedChildren(node, children);

  const boundRegionName = options.regionName?.trim();
  const regionName = boundRegionName || node.displayName;
  const commercialName =
    options.commercialName?.normalize("NFC").trim() || `${regionName} 마사지봄`;
  const parentContext = formatNodeContext(node);
  const hierarchyLabel = hierarchyFor(node).join(" › ");
  const representativeCount = node.records.length;
  const sourceUnitCount = node.records.reduce(
    (total, record) => total + record.sourceNames.length,
    0,
  );
  const childCount = children.length;
  const childLabel = childLabelFor(children);
  const sourceNames = node.representative?.sourceNames ?? [];
  const siblings = siblingChildrenFor(node);
  const profileIndex = profileIndexFor(node.path);
  const seed = stableHash(
    `${node.path}|${commercialName}|${hierarchyLabel}|${sourceNames.join("|")}`,
  );
  const localGuide = localGuideFor(
    node,
    regionName,
    commercialName,
    hierarchyLabel,
    children,
    siblings,
    seed,
    profileIndex,
  );
  const steps = processStepsFor(
    node,
    regionName,
    commercialName,
    hierarchyLabel,
    children,
    sourceNames,
    localGuide,
    seed,
    profileIndex,
  );

  const stats: RegionPageStat[] =
    node.kind === "representative"
      ? [
          { label: "대표 지역", value: "1곳" },
          { label: "포함 행정동", value: formatCount(sourceUnitCount, "개") },
          { label: "상담 안내", value: "24시간" },
        ]
      : [
          { label: childLabel, value: formatCount(childCount, "개") },
          {
            label: "대표 지역",
            value: formatCount(representativeCount, "곳"),
          },
          {
            label: "기준 행정단위",
            value: formatCount(sourceUnitCount, "개"),
          },
        ];

  return {
    regionName,
    facts: {
      kind: node.kind,
      availability: "active",
      parentContext,
      representativeCount,
      sourceUnitCount,
      childCount,
      childLabel,
      sourceLabel:
        node.kind === "representative" ? "포함 행정동" : "기준 행정단위",
      sourceNames,
      hierarchyLabel,
      commercialName,
      siblingCount: siblings.length,
      directChildNames: children.map((child) => child.name),
    },
    hero: {
      eyebrow: `${parentContext} · 전국 방문 · 24시간 상담`,
      title: `${regionName} 출장 마사지`,
      lead: leadFor(
        node,
        regionName,
        commercialName,
        hierarchyLabel,
        childCount,
        childLabel,
        sourceUnitCount,
        profileIndex,
      ),
    },
    stats,
    overview: {
      eyebrow: "REGION GUIDE",
      title: `${regionName} 지역 안내`,
      paragraphs: overviewParagraphsFor(
        node,
        regionName,
        commercialName,
        hierarchyLabel,
        children,
        childCount,
        childLabel,
        sourceUnitCount,
        profileIndex,
      ),
    },
    localGuide,
    steps,
    faqs: [...buildRegionServiceFaqs(regionName)],
    directory: {
      eyebrow:
        node.kind === "representative" ? "ADMINISTRATIVE COVERAGE" : "AREA DIRECTORY",
      title: directoryTitleFor(node, regionName, children, childLabel),
      description:
        node.kind === "representative"
          ? `${commercialName}이 ${regionName} 대표지역으로 함께 연결한 ${sourceNames.join(" · ")} 기준 동명입니다. ${pageGuidanceCue(profileIndex, 47)}`
          : `${hierarchyLabel} 아래의 ${childLabel} ${formatCount(childCount, "개")}를 행정계층에 따라 확인하세요. 목록은 ${children.slice(0, 4).map((child) => child.name).join(" · ")}${childCount > 4 ? " 등으로 이어집니다." : "으로 구성됩니다."} ${pageGuidanceCue(profileIndex, 47)}`,
      note:
        node.kind === "representative"
          ? `대표지역은 탐색 중복을 줄이기 위한 안내 단위이며, 공식 행정동이나 법정동의 명칭을 바꾸지 않습니다. ${sourceNames[0]}부터 ${sourceNames.at(-1)}까지는 원장 표기를 유지합니다. ${pageGuidanceCue(profileIndex, 79)}`
          : `${regionName} 아래 카드는 행정계층 탐색을 위한 목록이며 추천 순위가 아닙니다. ${pageGuidanceCue(profileIndex, 79)}`,
    },
  };
}
