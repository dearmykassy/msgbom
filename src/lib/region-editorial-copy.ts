import { buildRegionServiceKeywords } from "@/data/region-service-keywords";
import {
  getDirectChildren,
  getRegionBreadcrumbs,
  resolveRegionNode,
  type RegionNode,
} from "@/lib/regions";
import { getRegionProfileIndex } from "@/lib/region-profile-index";

export type RegionEditorialCopy = {
  profileIndex: number;
  variationSignature: string;
  heroLead: string;
  introduction: {
    eyebrow: string;
    title: string;
    paragraphs: readonly [string, string, string, string, string];
  };
  trust: {
    eyebrow: string;
    title: string;
    paragraphs: readonly [string, string];
    points: readonly [string, string, string];
  };
  facts: {
    contextLine: string;
    hierarchy: string;
    locality: string;
    parentName: string | null;
    relatedNames: readonly string[];
  };
};

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function pickIndex(path: string, key: string, length: number): number {
  return stableHash(`${path}\u0000${key}`) % length;
}

function hasFinalConsonant(value: string): boolean {
  const character = [...value.normalize("NFC")].at(-1);
  if (!character) return false;
  const code = character.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

function topic(value: string): string {
  return `${value}${hasFinalConsonant(value) ? "은" : "는"}`;
}

function and(value: string): string {
  return `${value}${hasFinalConsonant(value) ? "과" : "와"}`;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  if (values.length === 0) return [];
  const start = offset % values.length;
  return [...values.slice(start), ...values.slice(0, start)];
}

function joinNames(values: readonly string[]): string {
  if (values.length === 0) return "여러 생활권";
  return values.join("·");
}

type LocalFacts = {
  contextLine: string;
  hierarchy: string;
  parentName: string | null;
  relatedNames: string[];
};

function buildLocalFacts(node: RegionNode): LocalFacts {
  const breadcrumbs = getRegionBreadcrumbs(node).slice(1);
  const hierarchy = breadcrumbs.map((item) => item.name).join(" ");
  const parent =
    node.segments.length > 1
      ? resolveRegionNode(node.segments.slice(0, -1))
      : null;
  const parentName = parent?.displayName ?? null;
  const children = getDirectChildren(node);
  const siblings = parent
    ? getDirectChildren(parent).filter((item) => item.name !== node.displayName)
    : [];
  const sourceNames = (node.representative?.sourceNames ?? []).filter(
    (name) => name !== node.displayName,
  );
  const candidates =
    children.length > 0
      ? children.map((item) => item.name)
      : sourceNames.length > 0
        ? sourceNames
        : siblings.map((item) => item.name);
  const relatedNames = rotate(
    candidates,
    stableHash(`${node.path}\u0000local-anchors`),
  ).slice(0, 4);
  const names = joinNames(relatedNames);

  if (children.length > 0) {
    return {
      hierarchy,
      parentName,
      relatedNames,
      contextLine: `${topic(node.displayName)} ${names} 등 서로 다른 생활권의 자택과 고객이 머무는 공간까지 프라이빗 방문 케어를 이어갑니다.`,
    };
  }

  if (sourceNames.length > 0) {
    return {
      hierarchy,
      parentName,
      relatedNames,
      contextLine: `${names}의 주거지와 오피스텔 등 고객이 머무는 공간으로 신속하게 찾아가는 방문 관리를 준비합니다.`,
    };
  }

  if (parentName && relatedNames.length > 0) {
    return {
      hierarchy,
      parentName,
      relatedNames,
      contextLine: `${parentName}의 ${and(node.displayName)} ${names} 등 인접 생활권에서도 고객 일정에 맞춰 신속한 방문을 준비합니다.`,
    };
  }

  return {
    hierarchy,
    parentName,
    relatedNames,
    contextLine: `${topic(node.displayName)} 주거지와 고객이 머무는 공간을 중심으로 편안한 프라이빗 방문 관리를 제공합니다.`,
  };
}

const CARE_SIGNATURE_CONTEXTS = [
  "퇴근 뒤 다시 외출하기 부담스러운 밤에도",
  "늦은 일정으로 귀가가 미뤄진 날에도",
  "주말의 여유를 이동과 대기로 쓰고 싶지 않을 때도",
  "업무와 약속이 겹쳐 몸을 돌볼 시간이 부족한 날에도",
  "목과 어깨에 하루의 긴장이 오래 남은 저녁에도",
  "익숙한 공간에서 조용히 컨디션을 회복하고 싶을 때도",
  "외부 매장의 소음과 시선이 부담스러운 순간에도",
  "관리 뒤 바로 샤워하고 편안한 밤을 보내고 싶을 때도",
  "강한 압보다 섬세한 맞춤 관리를 원하는 날에도",
  "가족과 보내는 시간을 해치지 않고 관리받고 싶을 때도",
  "장시간 이동과 반복된 자세로 몸이 무거운 날에도",
  "하루의 마지막을 오롯이 나에게 돌리고 싶은 순간에도",
] as const;

const CARE_SIGNATURE_ACTIONS = [
  "원하는 시작 시각과 관리 강도를 함께 맞춰",
  "집중 부위와 코스 시간을 차분히 조율해",
  "자택의 공간 조건과 이용 인원을 미리 살펴",
  "타이와 아로마 가운데 선호하는 흐름을 골라",
  "몸의 반응에 따라 압의 깊이와 속도를 세밀하게 바꿔",
  "상담에서 전한 요청을 현장 관리에 꼼꼼히 이어",
  "개인의 생활 리듬을 깨뜨리지 않는 일정으로 준비해",
  "피로가 몰린 부위와 전신 이완의 균형을 맞춰",
  "불필요한 이동과 대기 없이 방문 순서를 정리해",
  "프라이버시와 편안함을 우선하는 방식으로 진행해",
  "처음 상담부터 관리가 끝나는 순간까지 요청을 지켜",
  "관리 전후의 휴식까지 고려한 흐름으로 구성해",
] as const;

const CARE_SIGNATURE_LINKS = [
  "하루의 마지막을 온전히 회복에 쓸 수 있게 합니다",
  "외출 없이도 깊은 이완과 개운함을 누리게 합니다",
  "고객만을 위한 프라이빗 관리 시간을 완성합니다",
  "굳은 근육과 쌓인 피로를 보다 깊게 풀어냅니다",
  "관리 뒤의 샤워와 숙면까지 편안하게 이어 줍니다",
  "몸의 긴장과 마음의 피로를 함께 내려놓게 합니다",
  "바쁜 일상 속 부족했던 회복 시간을 되찾아 줍니다",
  "원하는 압과 리듬에 맞는 정밀 테라피를 제공합니다",
  "익숙한 공간을 나만의 프리미엄 케어룸으로 바꿉니다",
  "예약부터 마무리까지 편안한 흐름을 지켜 줍니다",
  "다음 날의 움직임이 한층 가벼워지도록 관리합니다",
  "시간과 사생활을 모두 지키는 홈케어를 완성합니다",
] as const;

const SAFETY_SIGNATURE_CONTEXTS = [
  "처음 이용해 업체를 구분하기 어려운 상황에서도",
  "빠른 배정을 내세워 송금을 재촉하는 연락을 받아도",
  "보증금이나 출발금이라는 낯선 명목을 들어도",
  "계좌 오류를 핑계로 추가 입금을 요구받아도",
  "프로필 사진과 친절한 말투가 그럴듯해 보여도",
  "환불을 위해 한 번 더 보내야 한다는 말을 들어도",
  "예약이 취소된다며 즉시 입금을 재촉해도",
  "공식 번호가 아닌 SNS 계정에서 연락이 와도",
  "관리사 출발을 위해 돈이 필요하다는 말을 들어도",
  "안전 확인비나 보험금이라는 표현을 사용해도",
  "소액만 먼저 보내면 된다는 제안을 받아도",
  "현장 후불이라고 말한 뒤 태도를 바꾸더라도",
] as const;

const SAFETY_SIGNATURE_ACTIONS = [
  "공식 전화번호와 현장 후불 원칙을 다시 대조하면",
  "관리사 도착 전에는 결제하지 않는 기준을 지키면",
  "송금보다 실제 방문 확인을 먼저 생각하면",
  "상담을 잠시 멈추고 결제 시점을 차분히 따져 보면",
  "예약 내용과 금전 요구가 일치하는지 살펴보면",
  "첫 입금부터 단호하게 거절하는 원칙을 세우면",
  "온라인 말보다 현장에서 확인할 권리를 우선하면",
  "사칭 가능성을 의심하고 공식 창구로 재확인하면",
  "조급함을 내려놓고 정상 예약 순서를 되짚어 보면",
  "현금 요구와 카드 가능 여부를 함께 확인하면",
  "추가 송금 요구에 더 이상 응하지 않으면",
  "주소와 일정 외에 돈부터 묻는 상담을 중단하면",
] as const;

const SAFETY_SIGNATURE_LINKS = [
  "선입금 사기의 가장 흔한 접근을 피할 수 있습니다",
  "고객이 결제 주도권을 끝까지 지킬 수 있습니다",
  "실제 방문 전 금전 피해를 원천적으로 막을 수 있습니다",
  "사칭 연락과 정상 예약을 분명하게 가를 수 있습니다",
  "관리보다 결제가 앞서는 위험한 거래를 멈출 수 있습니다",
  "현장에서 직접 확인할 권리를 안전하게 지킬 수 있습니다",
  "추가 송금으로 피해가 커지는 상황을 차단할 수 있습니다",
  "처음부터 투명한 예약 절차만 선택할 수 있습니다",
  "조급함을 노리는 입금 유도에 흔들리지 않을 수 있습니다",
  "공식 번호와 운영 원칙이 다른 연락을 걸러낼 수 있습니다",
  "관리 확인 뒤 결제하는 정상 순서를 지킬 수 있습니다",
  "안전한 현장 후불 예약으로 마음 편히 이어갈 수 있습니다",
] as const;

function signatureIndex(profileIndex: number, salt: number): number {
  // 1728 = 12³. 863 is coprime with 1728, so each salt maps the active
  // profile range to a collision-free tuple while the profile index module
  // keeps every original production route in its historical slot.
  return (profileIndex * 863 + salt * 149) % 1728;
}

function editorialTail(
  locality: string,
  subject: string,
  profileIndex: number,
  salt: number,
  tone: "care" | "safety" = "care",
): string {
  const tuple = signatureIndex(profileIndex, salt);
  const contextIndex = tuple % 12;
  const actionIndex = Math.floor(tuple / 12) % 12;
  const linkIndex = Math.floor(tuple / 144) % 12;
  const contexts =
    tone === "care" ? CARE_SIGNATURE_CONTEXTS : SAFETY_SIGNATURE_CONTEXTS;
  const actions =
    tone === "care" ? CARE_SIGNATURE_ACTIONS : SAFETY_SIGNATURE_ACTIONS;
  const links = tone === "care" ? CARE_SIGNATURE_LINKS : SAFETY_SIGNATURE_LINKS;

  return `${topic(`${locality} ${subject}`)} ${contexts[contextIndex]} ${actions[actionIndex]} ${links[linkIndex]}.`;
}

const HERO_OPENINGS = [
  (region: string) => `${region} 고객님, 마사지봄에 오신 것을 환영합니다.`,
  (region: string) => `${region}에서 편안한 방문 관리를 찾으셨다면 반갑습니다.`,
  (region: string) => `바쁜 하루를 마친 ${region} 고객님께 인사드립니다.`,
  (region: string) => `${region}에서 집으로 찾아오는 프라이빗 케어를 만나보세요.`,
  (region: string) => `${region}의 오늘을 편안하게 마무리할 시간을 준비했습니다.`,
  (region: string) => `${region}에서 이동 없이 받는 홈케어를 찾고 계신가요?`,
  (region: string) => `${region} 고객님의 익숙한 공간으로 편안한 관리를 전합니다.`,
  (region: string) => `${region}에서 나만을 위한 방문 테라피를 시작해 보세요.`,
  (region: string) => `${region}의 긴 하루 끝, 집에서 받는 관리를 소개합니다.`,
  (region: string) => `${region} 고객님을 위한 프라이빗 방문 케어입니다.`,
  (region: string) => `${region}에서 오늘의 피로를 내려놓을 곳을 찾으셨나요?`,
  (region: string) => `${region}의 밤과 일상에 어울리는 홈케어를 준비했습니다.`,
  (region: string) => `${region}에서 편안함을 우선한 방문 관리를 만나보세요.`,
  (region: string) => `${region} 고객님, 집이 가장 편안한 관리 공간이 됩니다.`,
  (region: string) => `${region}에서 보다 여유로운 하루의 마무리를 시작하세요.`,
  (region: string) => `${region}의 익숙한 조명 아래에서 받는 케어를 소개합니다.`,
] as const;

const HERO_CLOSINGS = [
  (name: string) => `${topic(name)} 고객님의 공간과 일정에 맞춘 관리를 정성껏 준비하겠습니다.`,
  (name: string) => `${topic(name)} 집에서 누리는 프리미엄 테라피로 편안한 시간을 전합니다.`,
  (name: string) => `${topic(name)} 24시간 전화상담으로 원하는 방문 일정을 함께 맞춰드립니다.`,
  (name: string) => `${topic(name)} 익숙한 공간에서 시작되는 맞춤 케어를 약속드립니다.`,
  (name: string) => `${topic(name)} 이동 부담 없이 받을 수 있는 집중 관리를 준비합니다.`,
  (name: string) => `${topic(name)} 나만의 공간에서 온전히 집중하는 관리 시간을 전합니다.`,
  (name: string) => `${topic(name)} 오늘 필요한 코스와 시간을 세심하게 찾아드립니다.`,
  (name: string) => `${topic(name)} 처음 상담부터 현장 관리까지 편안하게 함께하겠습니다.`,
  (name: string) => `${topic(name)} 익숙한 공간을 나만을 위한 프라이빗 케어룸으로 바꿔드립니다.`,
  (name: string) => `${topic(name)} 24시간 상담과 투명한 현장 후불 원칙을 지킵니다.`,
  (name: string) => `${topic(name)} 바쁜 일상 뒤에 필요한 깊은 휴식과 회복을 전합니다.`,
  (name: string) => `${topic(name)} 집에서 받는 집중 테라피를 정성스럽게 준비합니다.`,
  (name: string) => `${topic(name)} 원하는 시간과 코스에 맞춰 빈틈없이 준비하겠습니다.`,
  (name: string) => `${topic(name)} 편안함과 프라이버시를 함께 지키는 방문 케어입니다.`,
  (name: string) => `${topic(name)} 하루의 긴장을 풀어낼 관리 시간을 세심하게 준비합니다.`,
  (name: string) => `${topic(name)} 이동 부담 없는 프라이빗 방문 케어로 함께하겠습니다.`,
] as const;

const INTRO_TITLES = [
  (region: string) => `${region} 방문 케어 — 집에서 누리는 프라이빗 테라피`,
  (region: string) => `${region} 홈케어 — 하루의 피로를 집에서 내려놓는 시간`,
  (region: string) => `${region} 출장 케어 — 바쁜 일상 뒤에 만나는 맞춤 관리`,
  (region: string) => `${region} 프라이빗 마사지 — 이동 없이 받는 집중 테라피`,
  (region: string) => `${region} 방문 마사지 — 익숙한 공간이 케어룸이 되는 순간`,
  (region: string) => `${region} 홈테라피 — 귀가 후 바로 시작하는 편안한 관리`,
  (region: string) => `${region} 맞춤 케어 — 나만의 공간에서 완성하는 휴식`,
  (region: string) => `${region} 출장 테라피 — 시간과 프라이버시를 지키는 선택`,
  (region: string) => `${region} 방문 홈케어 — 외출 없이 누리는 깊은 이완`,
  (region: string) => `${region} 프리미엄 케어 — 오늘의 피로를 집에서 정리하세요`,
  (region: string) => `${region} 맞춤 테라피 — 일상 가까이 찾아오는 관리`,
  (region: string) => `${region} 출장 마사지 — 편안한 집에서 받는 정밀 케어`,
] as const;

const LOCAL_OPENINGS = [
  (hierarchy: string) => `${hierarchy}에서 하루를 보내는 고객의 생활 리듬은 모두 다릅니다.`,
  (hierarchy: string) => `${hierarchy}의 하루는 출근과 귀가, 약속과 휴식이 빠르게 교차합니다.`,
  (hierarchy: string) => `${hierarchy}에서 바쁜 일정을 마친 뒤 다시 외출하는 일은 생각보다 큰 부담입니다.`,
  (hierarchy: string) => `${hierarchy}의 저녁은 업무를 마친 사람과 일상을 정리하는 주민의 시간이 함께 흐릅니다.`,
  (hierarchy: string) => `${hierarchy}처럼 생활 반경이 다양한 곳에서는 내 일정에 맞는 관리가 중요합니다.`,
  (hierarchy: string) => `${hierarchy} 고객이 원하는 것은 복잡한 이동보다 편안하고 분명한 예약입니다.`,
  (hierarchy: string) => `${hierarchy}에서 하루를 꽉 채워 보낸 몸에는 이동 부담 없는 관리가 잘 어울립니다.`,
  (hierarchy: string) => `${hierarchy}의 일상은 시간대와 생활권에 따라 각기 다른 속도로 움직입니다.`,
  (hierarchy: string) => `${hierarchy}에서 퇴근과 귀가를 마친 뒤에는 익숙한 공간이 가장 편안합니다.`,
  (hierarchy: string) => `${hierarchy} 고객에게는 예약 과정부터 관리가 끝나는 순간까지 시간의 효율이 중요합니다.`,
  (hierarchy: string) => `${hierarchy}의 바쁜 하루 끝에는 멀리 나가지 않아도 되는 관리가 필요합니다.`,
  (hierarchy: string) => `${hierarchy}에서 프라이빗 케어를 찾는 이유는 저마다 달라도 편안함을 바라는 마음은 같습니다.`,
] as const;

const LOCAL_KEYWORD_LINES = [
  (primary: string, anma: string) => `${primary}와 ${anma}는 고객의 주소로 찾아가는 프라이빗 홈케어를 지향합니다.`,
  (primary: string, anma: string) => `${primary} 또는 ${anma}를 찾는 고객에게 이동 없이 받는 맞춤 관리를 제안합니다.`,
  (primary: string, anma: string) => `${primary}와 ${anma}의 핵심은 익숙한 공간에서 원하는 코스를 받는 편안함입니다.`,
  (primary: string, anma: string) => `${anma}를 알아보거나 ${primary}를 예약할 때 가장 중요한 기준은 편안함과 신뢰입니다.`,
  (primary: string, anma: string) => `${primary}를 찾는 분과 ${anma}를 원하는 분 모두 집에서 시작되는 편안함을 기대합니다.`,
  (primary: string, anma: string) => `${anma}의 간편함과 ${primary}의 집중 관리를 고객의 생활 공간으로 연결합니다.`,
  (primary: string, anma: string) => `${primary}와 ${anma}는 외부 매장을 다시 찾아갈 필요 없는 방문형 관리입니다.`,
  (primary: string, anma: string) => `${anma} 문의부터 ${primary} 코스 선택까지 한 번의 전화로 편안하게 이어집니다.`,
  (primary: string, anma: string) => `${primary}와 ${anma}를 찾는 시간부터 관리가 끝나는 순간까지 고객 중심으로 생각합니다.`,
  (primary: string, anma: string) => `${primary} 또는 ${anma}를 고를 때는 내 공간에서 받는 안정감까지 함께 고려해 보세요.`,
  (primary: string, anma: string) => `${anma}의 편의성과 ${primary}의 맞춤 관리를 프라이빗한 자택에서 만나보세요.`,
  (primary: string, anma: string) => `${primary}와 ${anma}는 귀가 후 바로 이어지는 휴식 시간을 더욱 깊게 만듭니다.`,
] as const;

const LOCAL_CLOSINGS = [
  "마사지봄은 지역과 희망 시간을 확인한 뒤 가장 빠른 동선으로 방문팀을 연결합니다.",
  "24시간 상담팀이 주소와 일정을 확인하고 신속한 방문 준비를 시작합니다.",
  "예약이 정리되면 가까운 동선을 우선 확인해 기다림을 줄이는 방문을 진행합니다.",
  "상담 접수와 동시에 지역·시간·코스를 맞추고 빠른 방문을 준비합니다.",
  "고객의 위치와 희망 시각을 기준으로 신속하고 매끄러운 방문 절차를 이어갑니다.",
  "전화 한 통으로 주소와 코스를 확인한 뒤 방문팀이 고객의 일정에 맞춰 움직입니다.",
  "복잡한 절차 없이 상담에서 필요한 내용을 맞추고 빠르게 방문 일정을 잡습니다.",
  "24시간 연결되는 상담 창구가 고객의 위치를 확인하고 방문 순서를 정리합니다.",
  "주소 확인부터 출발 안내까지 한 흐름으로 이어져 예약의 번거로움을 줄입니다.",
  "희망 일정이 정해지면 방문팀이 가까운 이동 경로를 살펴 신속하게 준비합니다.",
  "고객이 기다리는 시간을 줄일 수 있도록 접수 뒤 동선과 일정을 곧바로 확인합니다.",
  "지역별 이동 흐름을 고려한 상담으로 편안하고 빠른 방문 케어를 준비합니다.",
] as const;

const HOME_OPENINGS = [
  "관리를 받기 위해 다시 옷을 챙겨 입고 매장으로 이동할 필요가 없습니다.",
  "가장 익숙한 집은 낯선 공간보다 몸과 마음의 긴장을 빠르게 내려놓게 합니다.",
  "귀가 뒤의 소중한 시간을 이동과 대기에 쓰지 않는 것이 방문 케어의 시작입니다.",
  "집에서 받는 관리의 가장 큰 장점은 내 생활 흐름을 깨뜨리지 않는다는 점입니다.",
  "외부 공간의 소음과 시선을 벗어나면 관리에 더 깊게 집중할 수 있습니다.",
  "방문 테라피는 고객이 편안한 장소와 시간을 직접 선택할 수 있는 관리 방식입니다.",
  "익숙한 조명과 온도, 편안한 옷차림은 관리 전부터 긴장을 낮춰 줍니다.",
  "하루를 마친 장소에서 곧바로 시작되는 관리는 시간과 체력을 함께 아껴 줍니다.",
  "프라이빗 홈케어는 이동 부담 없이 나만의 리듬으로 받는 테라피입니다.",
  "내 공간을 다른 사람과 공유하지 않아도 된다는 점은 방문 관리만의 선명한 가치입니다.",
  "예약한 시간에 맞춰 집에서 준비하면 불필요한 대기 없이 관리에 집중할 수 있습니다.",
  "관리 전후의 이동이 사라지면 휴식 시간은 더 길고 온전해집니다.",
] as const;

const HOME_MIDDLES = [
  "문을 나서는 번거로움 없이 준비된 공간에서 바로 관리가 시작되고, 끝난 뒤에는 곧바로 편안한 일상으로 돌아갈 수 있습니다.",
  "관리 직후 샤워를 마치고 내 침대에서 깊이 잠들 수 있어 늦은 시간에도 여유로운 마무리가 가능합니다.",
  "혼자만의 공간에서 강도와 집중 부위를 차분히 전달할 수 있어 맞춤 관리의 만족도를 높여 줍니다.",
  "주변 시선을 신경 쓰지 않고 몸 상태와 선호 압을 이야기할 수 있어 보다 섬세한 테라피가 가능합니다.",
  "퇴근 뒤 남은 시간을 아끼면서도 호텔 스파처럼 정돈된 프라이빗 케어를 누릴 수 있습니다.",
  "익숙한 환경이 주는 안정감은 테라피스트의 압과 스트레칭에 몸을 자연스럽게 맡기도록 돕습니다.",
  "관리 전 준비부터 종료 뒤 휴식까지 한 공간에서 이어지므로 하루의 리듬을 부드럽게 유지할 수 있습니다.",
  "자택·오피스텔·숙소 등 고객이 편안한 공간에서 받는 방식이라 예약 시간을 더 효율적으로 사용할 수 있습니다.",
  "타인의 출입과 소음이 적은 공간에서 온전히 나에게 집중하는 시간을 확보할 수 있습니다.",
  "외부 매장의 운영시간과 이동 거리에 얽매이지 않고 24시간 상담을 통해 내 일정에 맞출 수 있습니다.",
  "따뜻한 조명 아래에서 호흡을 고르고 관리를 받으면 바쁜 하루의 긴장도 한층 빠르게 가라앉습니다.",
  "관리 후 다시 운전하거나 대중교통을 탈 필요가 없어 이완된 상태를 그대로 오래 이어갈 수 있습니다.",
] as const;

const HOME_CLOSINGS = [
  "이동 시간을 아낀 만큼 내 몸과 휴식에 더 많은 시간을 돌려줄 수 있습니다.",
  "그래서 방문 홈케어는 바쁜 직장인과 늦은 귀가가 잦은 고객에게 특히 잘 맞습니다.",
  "익숙한 공간이 주는 안정감은 관리의 집중도와 만족감을 한 단계 높여 줍니다.",
  "관리의 시작과 끝을 내 공간에서 완성하는 경험은 일반 로드숍과 다른 깊은 편안함을 전합니다.",
  "프라이버시와 시간 효율을 함께 원하는 고객에게 가장 현실적인 선택이 됩니다.",
  "오늘의 일정에 관리를 억지로 끼워 넣지 않고, 관리가 고객의 일상 안으로 찾아옵니다.",
  "온전히 나만을 위한 공간에서 받는 테라피는 하루의 마무리를 더욱 부드럽게 바꿉니다.",
  "집이라는 안정된 환경이 더해지면 몸의 이완과 정신적인 편안함이 함께 깊어집니다.",
  "관리 후 남은 시간까지 편안하게 이어지는 것이 방문 케어의 가장 큰 매력입니다.",
  "시간·공간·프라이버시를 고객이 직접 선택한다는 점에서 한층 주도적인 관리가 가능합니다.",
  "한 번의 방문으로 이동 부담과 대기 시간을 줄이고 집중 관리의 가치를 높일 수 있습니다.",
  "편안한 장소에서 시작된 관리는 관리가 끝난 뒤의 깊은 휴식으로 자연스럽게 이어집니다.",
] as const;

const BODY_OPENINGS = [
  "정교한 압과 부드러운 스트레칭은 목·어깨·등·허리 라인에 쌓인 뻐근함을 깊게 풀어냅니다.",
  "오랜 업무와 반복된 자세로 굳은 근육은 섬세한 압 조절과 전신 스트레칭으로 부드럽게 이완됩니다.",
  "하루 종일 쌓인 신체 긴장은 리듬감 있는 수기 관리와 집중 압을 통해 빠르게 가라앉습니다.",
  "어깨 결림과 허리의 묵직함, 다리의 피로는 신체 흐름을 따라 이어지는 정밀 테라피로 해소됩니다.",
  "뻣뻣해진 관절과 굳은 근육을 충분히 늘리고 눌러 주면 몸의 가동 범위와 순환 리듬이 살아납니다.",
  "목에서 어깨, 척추와 하체로 이어지는 전신 라인을 세심하게 관리해 깊은 피로 회복을 이끌어냅니다.",
  "단단하게 뭉친 부위를 찾아 압의 깊이와 속도를 조절하면 몸 전체의 긴장이 자연스럽게 풀립니다.",
  "스트레칭과 지압, 오일 테라피를 몸 상태에 맞게 활용해 일상에 쌓인 피로를 깨끗하게 정리합니다.",
  "집중 관리가 필요한 부위와 전신 밸런스를 함께 살펴 뻐근함과 무거움을 섬세하게 덜어냅니다.",
  "장시간 앉아 있거나 서서 일한 몸은 맞춤 압 관리로 근육의 답답함과 피로감을 빠르게 회복합니다.",
  "호흡에 맞춘 부드러운 압과 이완 동작은 경직된 몸을 편안한 상태로 되돌려 놓습니다.",
  "피로가 집중된 부위를 세밀하게 짚고 전신 흐름을 연결해 한층 가벼운 몸의 감각을 완성합니다.",
] as const;

const BODY_MIDDLES = [
  "타이의 스트레칭, 아로마의 부드러운 오일감, 힐링의 편안한 리듬 가운데 원하는 방식을 선택할 수 있습니다.",
  "압이 강한 관리를 선호하는지, 부드럽고 감성적인 흐름을 원하는지에 따라 코스를 맞출 수 있습니다.",
  "테라피스트는 관리 전 원하는 강도와 집중 부위를 확인하고 전신 밸런스에 맞춰 순서를 조절합니다.",
  "어깨·등 중심의 집중 관리부터 하체와 전신을 잇는 긴 코스까지 컨디션에 따라 선택할 수 있습니다.",
  "리듬 있는 압과 깊은 이완이 함께 이어지면서 신체 피로와 정신적인 긴장을 동시에 정리합니다.",
  "바쁜 업무로 굳은 상체와 오래 이동해 무거워진 하체를 균형 있게 풀어 활력을 되찾아 줍니다.",
  "관리 강도는 고객의 반응에 맞춰 세밀하게 조절되며 편안함과 시원함의 균형을 만들어냅니다.",
  "부드러운 터치와 깊은 압을 적절히 배치해 피부 감각부터 심부 근육까지 단계적으로 이완합니다.",
  "관리 중 불편한 부위나 선호 방향을 바로 말할 수 있어 더욱 정교한 맞춤 테라피가 완성됩니다.",
  "몸이 보내는 피로 신호를 따라 관리 흐름을 조절해 회복감과 깊은 안정감을 함께 높입니다.",
  "긴장된 근육을 충분히 풀고 호흡을 안정시키면 관리 뒤의 개운함과 숙면까지 자연스럽게 이어집니다.",
  "단순히 강한 압을 반복하지 않고 몸의 균형과 리듬을 살펴 필요한 부위를 집중적으로 관리합니다.",
] as const;

const BODY_CLOSINGS = [
  "관리 직후 느껴지는 가벼움과 개운함이 바쁜 일상으로 돌아갈 힘을 채워 줍니다.",
  "몸이 편안해지면 복잡했던 생각도 잦아들고 깊은 수면으로 이어질 준비가 됩니다.",
  "굳어 있던 근육이 풀리면서 움직임은 한층 부드러워지고 전신의 활력이 되살아납니다.",
  "오늘 쌓인 피로를 오늘 정리하는 관리가 다음 날의 컨디션을 선명하게 바꿉니다.",
  "정밀한 손길과 충분한 관리 시간이 만나 깊고 오래가는 회복감을 전합니다.",
  "관리 뒤에는 따뜻한 샤워와 숙면으로 이어지는 완전한 휴식의 흐름을 누릴 수 있습니다.",
  "뻐근함이 줄고 몸의 중심이 가벼워지면서 일상의 움직임도 한결 편안해집니다.",
  "일시적인 시원함을 넘어 전신 균형과 깊은 이완을 함께 느낄 수 있습니다.",
  "몸의 긴장이 풀리면 호흡과 마음까지 차분해져 진정한 회복의 시간을 만듭니다.",
  "충분히 이완된 상태를 집에서 그대로 이어갈 수 있어 관리의 만족감이 더욱 오래갑니다.",
  "피로가 머물던 자리를 편안함과 활력으로 채우는 것이 맞춤 테라피의 목표입니다.",
  "집중 관리와 전신 이완이 조화를 이루며 몸과 마음의 컨디션을 동시에 끌어올립니다.",
] as const;

const PRIVACY_OPENINGS = [
  "방문 관리는 고객만의 공간에서 진행되므로 프라이버시를 지키기 좋습니다.",
  "낯선 사람과 공간을 공유하지 않는 환경은 관리에 집중할 수 있는 안정감을 만듭니다.",
  "자택에서 받는 테라피는 고객의 생활 공간과 개인 시간을 가장 우선에 둡니다.",
  "예약된 고객만을 위한 단독 관리는 외부의 시선과 소음에서 한 걸음 벗어나게 합니다.",
  "내가 고른 장소에서 진행되는 관리는 공간에 대한 긴장 없이 편안하게 시작할 수 있습니다.",
  "프라이빗 케어의 가치는 단순한 편의보다 고객의 시간과 사생활을 존중하는 데 있습니다.",
  "집이라는 독립된 공간은 관리 중 대화와 요청을 더욱 편안하게 전달하도록 해 줍니다.",
  "다른 고객의 출입을 신경 쓸 필요 없이 예약 시간 전체를 오직 나에게 집중할 수 있습니다.",
  "방문형 서비스는 외부 매장의 혼잡함을 피하고 조용한 환경에서 관리를 받을 수 있게 합니다.",
  "개인 공간에서 진행되는 만큼 관리 전후의 모습과 시간을 타인에게 드러낼 필요가 없습니다.",
  "호텔 스파의 정돈된 감각을 고객의 공간으로 옮기면서도 익숙함은 그대로 유지합니다.",
  "프라이버시가 확보된 환경에서는 몸 상태와 원하는 관리 방향을 더욱 솔직하게 말할 수 있습니다.",
] as const;

const PRIVACY_CLOSINGS = [
  "상담에서는 방문 주소와 희망 시간, 코스, 인원만 정확히 전달하면 됩니다.",
  "필요한 내용은 전화로 간결하게 확인하고 관리에 필요한 준비는 방문팀이 안내합니다.",
  "고객의 요청과 공간 조건을 먼저 확인해 보다 안정적이고 매끄러운 방문을 준비합니다.",
  "관리 강도와 집중 부위처럼 개인적인 요청도 통화와 현장에서 편안하게 조율할 수 있습니다.",
  "예약 과정은 단순하게, 실제 관리는 섬세하게 진행해 고객의 부담을 낮춥니다.",
  "방문 전 필요한 내용만 확인하고 불필요한 절차 없이 관리에 집중합니다.",
  "주소와 일정이 정해지면 고객은 편안한 복장과 관리 공간만 준비하면 됩니다.",
  "정확한 상담과 프라이빗한 현장 진행으로 처음 이용하는 고객도 안심할 수 있습니다.",
  "고객이 원하는 방식과 공간의 특성을 존중하며 예약부터 마무리까지 차분하게 이어갑니다.",
  "관리 중에는 원하는 압과 불편한 부분을 바로 조율해 나만의 맞춤 시간을 완성합니다.",
  "고객의 생활 리듬을 방해하지 않도록 방문 전후의 과정까지 간결하게 설계했습니다.",
  "편안함과 보안을 함께 지키는 운영으로 집에서 받는 관리의 가치를 높입니다.",
] as const;

const SERVICE_OPENINGS = [
  "타이·아로마·힐링·스페셜·남성전용 코스를 시간과 선호 방식에 따라 선택할 수 있습니다.",
  "스트레칭 중심의 타이부터 부드러운 아로마와 집중형 스페셜까지 원하는 흐름을 고를 수 있습니다.",
  "짧고 선명한 60분 관리부터 여유로운 120분·150분 코스까지 일정에 맞춰 선택하세요.",
  "강한 압, 부드러운 오일, 전신 이완처럼 그날 필요한 관리 방식에 따라 코스를 고를 수 있습니다.",
  "컨디션과 예산, 이용 시간을 함께 살펴 다섯 가지 코스 가운데 알맞은 선택을 찾을 수 있습니다.",
  "혼자 받는 집중 관리와 커플·부부 2인 관리 등 인원에 맞는 조건도 상담에서 확인할 수 있습니다.",
  "몸의 뻐근함이 큰 날과 편안한 감성 관리가 필요한 날에 맞춰 서로 다른 코스를 준비했습니다.",
  "가격표에는 코스별 시간과 금액을 분명하게 표시해 예약 전에 한눈에 비교할 수 있습니다.",
  "원하는 압과 오일 사용 여부, 집중 부위를 먼저 정하면 나에게 맞는 코스를 고르기 쉽습니다.",
  "같은 코스도 이용 시간에 따라 깊이가 달라지므로 일정과 컨디션을 함께 고려해 선택하세요.",
  "24시간 상담을 통해 늦은 밤이나 이른 시간에도 코스와 방문 일정을 확인할 수 있습니다.",
  "처음 이용한다면 선호 강도와 피로 부위를 알려주면 코스 선택을 보다 쉽게 안내받을 수 있습니다.",
] as const;

const SERVICE_CLOSINGS = [
  "예약은 전화로 간단히 확인하며, 선택한 코스와 시간은 방문 전에 다시 안내합니다.",
  "상담팀이 24시간 연결되어 주소와 희망 일정을 확인하고 빠른 방문을 준비합니다.",
  "가격과 코스가 정해지면 방문 가능 여부와 예상 도착 흐름을 전화로 안내합니다.",
  "고객의 희망 시간에 맞춰 신속하게 일정을 확인하고 가장 가까운 방문팀을 연결합니다.",
  "전화 한 통이면 코스 선택부터 방문 일정, 결제 방식까지 한 번에 정리할 수 있습니다.",
  "이용 전 궁금한 관리 방식과 인원 조건도 24시간 상담에서 바로 확인할 수 있습니다.",
  "관리사는 일회용 비품과 위생 기준을 지키며 정돈된 방문 케어를 진행합니다.",
  "관리 전에는 코스·시간·금액을 다시 맞추고 현장에서는 원하는 압을 세밀하게 조절합니다.",
  "예약 접수 뒤에는 주소와 동선을 확인해 기다림을 줄이는 방향으로 방문을 준비합니다.",
  "현장 카드 결제가 가능하므로 결제 방식까지 미리 걱정할 필요가 없습니다.",
  "고객이 원하는 관리 조건을 통화에서 확인한 뒤 맞춤 방문 케어로 이어갑니다.",
  "처음부터 마무리까지 분명한 안내와 24시간 상담으로 편안한 예약 경험을 제공합니다.",
] as const;

const TRUST_TITLES = [
  (region: string) => `${region} 안심 예약 원칙 — 선입금 없는 100% 현장 후불`,
  (region: string) => `${region} 예약 전 꼭 확인하세요 — 보증금·출발금 요구는 거절`,
  (region: string) => `${region} 현장 후불 안내 — 먼저 송금하지 않는 안전한 예약`,
  (region: string) => `${region} 선입금 사기 주의 — 도착 전 결제는 없습니다`,
  (region: string) => `${region} 신뢰 운영 기준 — 관리 확인 후 현장에서 결제`,
  (region: string) => `${region} 안전 예약 가이드 — 예약금 없이 전화로 확인`,
  (region: string) => `${region} 100% 후불 원칙 — 출발금과 보증금을 요구하지 않습니다`,
  (region: string) => `${region} 사기 예방 안내 — 선입금 요구에 응하지 마세요`,
] as const;

const FRAUD_OPENINGS = [
  "출장 서비스를 검색하다 보면 보증금·출발금·안전 확인금이라는 이름으로 먼저 송금을 요구하는 경우가 있습니다.",
  "프로필 사진과 친절한 상담만 믿고 예약금부터 보내 달라는 요구에 응해서는 안 됩니다.",
  "관리사가 출발하려면 돈을 먼저 보내야 한다거나 계좌 확인을 위해 입금하라는 말은 명백한 사기 신호입니다.",
  "온라인 상담 중 시스템 오류·계좌 인증·첫 이용 보증을 핑계로 송금을 재촉한다면 즉시 대화를 중단하세요.",
  "예약을 확정하려면 선입금이 필요하다는 안내는 안전한 현장 후불 운영과 정반대입니다.",
  "정체를 확인하기 어려운 SNS 계정이나 사이트에서 예약금과 추가 송금을 반복 요구하는 피해가 이어집니다.",
  "출발비를 먼저 보내면 곧 도착한다는 말로 송금을 유도한 뒤 추가 입금을 요구하는 수법을 주의해야 합니다.",
  "신원 확인비·보험금·취소 방지금처럼 그럴듯한 이름을 붙여도 도착 전 송금 요구는 받아들이지 마세요.",
  "선입금을 보낸 뒤 금액 오류를 이유로 두 번째·세 번째 송금을 요구하는 것은 전형적인 사기 방식입니다.",
  "빠른 배정을 약속하며 계좌이체부터 재촉하는 곳이라면 예약을 멈추고 운영 원칙을 다시 확인하세요.",
  "처음에는 소액만 요구한 뒤 환불을 핑계로 더 큰 금액을 보내라는 수법이 있으니 각별히 주의하세요.",
  "도착 전에 보증금이나 예약금을 보내라는 요구는 고객의 불안함을 악용하는 위험한 신호입니다.",
] as const;

const FRAUD_CLOSINGS = [
  "어떤 명목이든 현장 도착 전 송금을 요구한다면 단호하게 거절하고 추가 연락에도 응하지 마세요.",
  "한 번 송금하면 오류나 환불을 핑계로 추가 금액을 요구할 수 있으므로 첫 입금부터 하지 않는 것이 중요합니다.",
  "계좌번호와 프로필만으로 업체를 신뢰하지 말고 반드시 후불 여부와 실제 결제 시점을 확인하세요.",
  "예약금이 없다는 안내와 달리 송금을 요구받았다면 해당 상담을 즉시 중단하는 것이 안전합니다.",
  "도착 전에는 결제하지 않는다는 원칙 하나만 지켜도 대표적인 선입금 사기 피해를 막을 수 있습니다.",
  "급하게 입금을 재촉할수록 멈춰서 확인하고, 현장 후불이 아니라면 거래하지 마세요.",
  "송금 뒤 돌려주겠다는 약속보다 처음부터 돈을 보내지 않는 원칙이 가장 확실한 예방입니다.",
  "추가 입금으로 기존 금액을 환불해 준다는 말도 믿지 말고 금융기관과 수사기관에 도움을 요청하세요.",
  "전화상담 단계에서는 주소와 일정만 확인하고 결제는 실제 도착 뒤 진행되는지 분명히 물어보세요.",
  "예약 과정에서 금전 요구가 먼저 나온다면 관리 품질보다 안전을 우선해 상담을 종료하세요.",
  "선입금과 현장 후불은 동시에 성립할 수 없으므로 운영 원칙이 흔들리는 곳은 이용하지 마세요.",
  "고객의 조급함을 이용한 송금 요구에 타협하지 않는 것이 가장 강력한 사기 예방입니다.",
] as const;

const POSTPAY_OPENINGS = [
  "마사지봄은 사전 예약금·보증금·출발금을 요구하지 않는 100% 현장 후불 원칙을 지킵니다.",
  "마사지봄 예약은 선입금 없이 진행되며 관리사가 현장에 도착한 뒤 결제합니다.",
  "고객이 관리사를 직접 확인하기 전에는 어떠한 금액도 먼저 결제하지 않습니다.",
  "예약 단계에서는 주소·시간·코스만 확인하고 실제 결제는 현장에서 진행합니다.",
  "마사지봄은 도착 전 송금을 받지 않으며 현장 확인 뒤 후불로 결제합니다.",
  "전화상담만으로 예약금을 요구하지 않고 약속된 장소에 도착한 뒤 결제를 안내합니다.",
  "선입금 없는 순수 현장 후불제가 마사지봄이 지키는 가장 기본적인 신뢰 원칙입니다.",
  "고객의 불안을 줄이기 위해 온라인 송금 없이 현장에서 관리와 결제를 확인합니다.",
  "예약금을 먼저 보내지 않아도 상담과 방문 일정 확인이 정상적으로 진행됩니다.",
  "마사지봄은 현장 도착 전 결제 0원, 관리 확인 뒤 후불 결제라는 원칙을 분명히 합니다.",
  "보증금이나 안전 확인금 없이 전화로 예약하고 현장에서 직접 결제할 수 있습니다.",
  "사전 송금 없이 방문이 진행되며 고객이 현장을 확인한 다음 결제하는 방식입니다.",
] as const;

const POSTPAY_CLOSINGS = [
  "현장 카드 결제도 가능하므로 코스와 최종 금액을 확인한 뒤 편안하게 결제하세요.",
  "도착 뒤 코스와 시간을 다시 확인하고 현금 또는 현장 카드로 결제할 수 있습니다.",
  "예약 전에 선택한 코스와 이용 시간을 맞춘 뒤 현장에서 분명하게 결제합니다.",
  "24시간 전화상담에서 방문 조건을 확인하되 금전 결제는 현장까지 기다리면 됩니다.",
  "처음 이용하는 고객도 선입금 부담 없이 실제 방문을 확인한 뒤 결제할 수 있습니다.",
  "결제보다 방문 확인이 먼저라는 원칙으로 온라인 사기 가능성을 원천 차단합니다.",
  "코스·시간·금액을 다시 확인한 다음 현장에서 결제해 예약 과정의 불안을 줄입니다.",
  "마사지봄을 사칭해 먼저 송금을 요구하는 연락을 받았다면 결제하지 말고 상담을 중단하세요.",
  "고객이 납득할 수 있는 순서로 방문과 결제를 진행해 신뢰를 지킵니다.",
  "현장 후불과 카드 결제 원칙은 처음 상담부터 관리가 끝날 때까지 동일하게 유지됩니다.",
  "먼저 돈을 보내지 않아도 되므로 실제 방문과 제공 내용을 직접 확인할 수 있습니다.",
  "안전한 예약은 선입금 거절에서 시작되고, 투명한 결제는 현장 확인 뒤 완성됩니다.",
] as const;

export function buildRegionEditorialCopy(
  node: RegionNode,
  commercialName: string,
): RegionEditorialCopy {
  const profileIndex = getRegionProfileIndex(node.path);

  const locality = node.displayName;
  const localFacts = buildLocalFacts(node);
  const keywords = buildRegionServiceKeywords(locality);
  const indices = {
    heroOpening: pickIndex(node.path, "hero-opening", HERO_OPENINGS.length),
    heroClosing: pickIndex(node.path, "hero-closing", HERO_CLOSINGS.length),
    title: pickIndex(node.path, "intro-title", INTRO_TITLES.length),
    localOpening: pickIndex(node.path, "local-opening", LOCAL_OPENINGS.length),
    localKeyword: pickIndex(node.path, "local-keyword", LOCAL_KEYWORD_LINES.length),
    localClosing: pickIndex(node.path, "local-closing", LOCAL_CLOSINGS.length),
    homeOpening: pickIndex(node.path, "home-opening", HOME_OPENINGS.length),
    homeMiddle: pickIndex(node.path, "home-middle", HOME_MIDDLES.length),
    homeClosing: pickIndex(node.path, "home-closing", HOME_CLOSINGS.length),
    bodyOpening: pickIndex(node.path, "body-opening", BODY_OPENINGS.length),
    bodyMiddle: pickIndex(node.path, "body-middle", BODY_MIDDLES.length),
    bodyClosing: pickIndex(node.path, "body-closing", BODY_CLOSINGS.length),
    privacyOpening: pickIndex(node.path, "privacy-opening", PRIVACY_OPENINGS.length),
    privacyClosing: pickIndex(node.path, "privacy-closing", PRIVACY_CLOSINGS.length),
    serviceOpening: pickIndex(node.path, "service-opening", SERVICE_OPENINGS.length),
    serviceClosing: pickIndex(node.path, "service-closing", SERVICE_CLOSINGS.length),
    trustTitle: pickIndex(node.path, "trust-title", TRUST_TITLES.length),
    fraudOpening: pickIndex(node.path, "fraud-opening", FRAUD_OPENINGS.length),
    fraudClosing: pickIndex(node.path, "fraud-closing", FRAUD_CLOSINGS.length),
    postpayOpening: pickIndex(node.path, "postpay-opening", POSTPAY_OPENINGS.length),
    postpayClosing: pickIndex(node.path, "postpay-closing", POSTPAY_CLOSINGS.length),
  };

  let sentenceSalt = 0;
  const careTail = (subject: string) =>
    editorialTail(locality, subject, profileIndex, sentenceSalt++, "care");
  const safetyTail = (subject: string) =>
    editorialTail(locality, subject, profileIndex, sentenceSalt++, "safety");

  const localParagraph = [
    LOCAL_OPENINGS[indices.localOpening](localFacts.hierarchy),
    localFacts.contextLine,
    LOCAL_KEYWORD_LINES[indices.localKeyword](
      keywords["출장마사지"],
      keywords["출장안마"],
    ),
    LOCAL_CLOSINGS[indices.localClosing],
    careTail("방문 케어"),
  ].join(" ");
  const homeParagraph = [
    HOME_OPENINGS[indices.homeOpening],
    HOME_MIDDLES[indices.homeMiddle],
    HOME_CLOSINGS[indices.homeClosing],
    careTail("자택 홈케어"),
  ].join(" ");
  const bodyParagraph = [
    BODY_OPENINGS[indices.bodyOpening],
    BODY_MIDDLES[indices.bodyMiddle],
    BODY_CLOSINGS[indices.bodyClosing],
    careTail("집중 테라피"),
  ].join(" ");
  const privacyParagraph = [
    PRIVACY_OPENINGS[indices.privacyOpening],
    PRIVACY_CLOSINGS[indices.privacyClosing],
    careTail("프라이버시 케어"),
  ].join(" ");
  const serviceParagraph = [
    SERVICE_OPENINGS[indices.serviceOpening],
    SERVICE_CLOSINGS[indices.serviceClosing],
    careTail("24시간 방문 서비스"),
  ].join(" ");
  const fraudParagraph = [
    FRAUD_OPENINGS[indices.fraudOpening],
    FRAUD_CLOSINGS[indices.fraudClosing],
    safetyTail("안전 예약"),
  ].join(" ");
  const postpayParagraph = [
    POSTPAY_OPENINGS[indices.postpayOpening],
    POSTPAY_CLOSINGS[indices.postpayClosing],
    safetyTail("현장 후불 원칙"),
  ].join(" ");

  return {
    profileIndex,
    variationSignature: Object.values(indices).join("-"),
    heroLead: `${HERO_OPENINGS[indices.heroOpening](locality)} ${HERO_CLOSINGS[indices.heroClosing](commercialName)}`,
    introduction: {
      eyebrow: "LOCAL PRIVATE CARE",
      title: INTRO_TITLES[indices.title](locality),
      paragraphs: [
        localParagraph,
        homeParagraph,
        bodyParagraph,
        privacyParagraph,
        serviceParagraph,
      ],
    },
    trust: {
      eyebrow: "SAFE PAYMENT PROMISE",
      title: TRUST_TITLES[indices.trustTitle](locality),
      paragraphs: [fraudParagraph, postpayParagraph],
      points: [
        "사전 예약금·보증금·출발금 0원",
        "관리사 현장 도착 후 100% 후불 결제",
        "현장 카드 결제 가능",
      ],
    },
    facts: {
      contextLine: localFacts.contextLine,
      hierarchy: localFacts.hierarchy,
      locality,
      parentName: localFacts.parentName,
      relatedNames: localFacts.relatedNames,
    },
  };
}
