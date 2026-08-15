import type { Metadata } from "next";

import { SITE_ORIGIN } from "@/lib/site-config";

type BlogSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type BlogPost = {
  slug:
    | "masaji-shop-gagi-himdeul-ttae"
    | "jibeseo-masaji-badeul-su-issnayo";
  category: string;
  publishedAt: string;
  publishedLabel: string;
  metaTitle: string;
  description: string;
  h1: string;
  intro: string;
  sections: readonly BlogSection[];
  consultationItems: readonly string[];
  relatedSlug: "masaji-shop-gagi-himdeul-ttae" | "jibeseo-masaji-badeul-su-issnayo";
};

const BLOG_PUBLISHED_AT = "2026-08-15T00:00:00+09:00";

export const BLOG_POSTS = [
  {
    slug: "masaji-shop-gagi-himdeul-ttae",
    category: "이용 전 읽기",
    publishedAt: BLOG_PUBLISHED_AT,
    publishedLabel: "2026.08.15",
    metaTitle: "마사지 받으러 나가기 힘든 날, 방문 전 확인할 것",
    description:
      "샵까지 이동하기 버거운 날, 출장마사지 이용 전 서비스 주소·희망 시간·코스와 결제 방식을 확인하는 방법을 안내합니다.",
    h1: "몸이 무거운 날, 샵까지 가기 전 확인할 것",
    intro:
      "몸이 무겁고 일정이 길어진 날에는 마사지 자체보다 샵까지 오가는 일이 더 크게 느껴질 수 있습니다. 그럴수록 서둘러 결정하기보다, 오늘 이용 방식이 내 상황에 맞는지 먼저 나눠 생각해 보세요. 마사지봄은 전화상담에서 확인한 서비스 주소를 기준으로 이용 정보를 안내합니다.",
    sections: [
      {
        heading: "이동 부담을 따로 생각해 보기",
        paragraphs: [
          "샵 방문은 이용자가 직접 이동해 시간을 맞추는 방식입니다. 출장마사지는 상담한 장소에서 이용하는 방식이라, 외출이 부담스러운 날에는 서비스 주소와 희망 시간을 먼저 확인하는 편이 실용적입니다.",
          "다만 지역마다 방문 가능 여부와 일정은 같지 않을 수 있습니다. 가능 여부를 미리 단정하지 않고 전화상담에서 확인해야, 필요한 정보를 정확히 들을 수 있습니다.",
        ],
      },
      {
        heading: "전화 전에 세 가지만 정리하세요",
        paragraphs: [
          "전화하기 전에 세 가지를 간단히 메모해 두면 대화가 훨씬 분명해집니다. 서비스를 받을 정확한 주소, 원하는 시간대, 고를 코스와 이용 시간을 순서대로 알려주세요.",
          "아파트나 숙소처럼 주소 확인에 보탬이 되는 내용이 있다면 함께 전달하면 됩니다. 막연한 지명으로 말하기보다 서비스 받을 주소를 직접 말하는 편이 좋습니다.",
        ],
      },
      {
        heading: "코스와 금액은 따로 확인하기",
        paragraphs: [
          "코스 선택이 어렵다면 당장의 컨디션과 원하는 시간부터 정리해 보세요. 타이, 아로마, 힐링, 스페셜, 남성전용 코스가 있으며 시간별 금액은 코스·가격 페이지에서 확인할 수 있습니다.",
          "가격을 따로 확인한 뒤 상담하면 이용에 필요한 질문에 집중하기 좋습니다. 코스별 시간과 금액을 한 번 보고, 내가 원하는 선택지를 말해 보세요.",
        ],
      },
      {
        heading: "결제 방식까지 분명히 짚기",
        paragraphs: [
          "마사지봄은 선입금 없는 100% 현장 후불이며 현장 카드 결제가 가능합니다. 결제 방식도 통화 중 분명히 짚어두면 이용 전 확인할 내용이 줄어듭니다.",
          "늦은 시간이나 외출이 버거운 날일수록 확인할 내용을 생략하지 말고, 지역과 일정의 가능 여부를 전화상담으로 차분히 확인하세요.",
        ],
      },
    ],
    consultationItems: [
      "서비스를 받을 정확한 주소",
      "원하는 시간대",
      "코스와 이용 시간",
    ],
    relatedSlug: "jibeseo-masaji-badeul-su-issnayo",
  },
  {
    slug: "jibeseo-masaji-badeul-su-issnayo",
    category: "집·숙소 이용 안내",
    publishedAt: BLOG_PUBLISHED_AT,
    publishedLabel: "2026.08.15",
    metaTitle: "집에서도 출장마사지를 이용할 수 있나요?",
    description:
      "집이나 숙소에서 출장마사지를 고려할 때, 서비스 주소·이용 공간·코스와 시간을 전화상담으로 확인하는 순서를 정리했습니다.",
    h1: "집이나 숙소에서 받는 마사지, 전화 전에 준비할 내용",
    intro:
      "집이나 숙소에서 출장마사지를 이용할 수 있는지 궁금하다면, 먼저 장소 이름보다 실제 서비스 주소와 시간부터 확인하는 편이 좋습니다. 자택·숙소처럼 상담에서 전달한 장소라도 지역별 방문 가능 여부와 일정은 전화상담으로 확인해야 합니다. 가능한지 추측하기보다 필요한 정보를 준비해 통화하는 것이 가장 분명한 방법입니다.",
    sections: [
      {
        heading: "집·숙소 이용은 주소 확인부터",
        paragraphs: [
          "집에서 이용을 생각한다면 주소를 정확히 알려주는 것이 첫 단계입니다. 같은 동네라도 건물명이나 호수, 출입에 필요한 정보에 따라 상담 내용이 달라질 수 있으니 서비스 받을 정확한 주소를 준비하세요.",
          "막연한 지명이나 주변 지역만 말하기보다 실제 이용할 장소를 기준으로 이야기해야 확인이 수월합니다. 방문 가능 여부와 일정은 이 내용을 바탕으로 전화상담에서 확인합니다.",
        ],
      },
      {
        heading: "이용 공간은 내가 확인할 범위만 살펴보기",
        paragraphs: [
          "선택한 장소에서 이용 시간을 확보할 수 있는지, 주변을 간단히 정리할 수 있는지처럼 내가 확인할 수 있는 범위를 생각해 보세요. 복잡한 준비를 약속할 필요는 없습니다.",
          "전화상담에서 장소 상황을 간단히 말하고 이용 가능 여부와 일정을 확인하면 됩니다. 필요한 안내가 있다면 통화 중 바로 물어보는 편이 좋습니다.",
        ],
      },
      {
        heading: "코스와 시간을 함께 알려주세요",
        paragraphs: [
          "코스와 시간은 주소와 함께 알려주세요. 타이, 아로마, 힐링, 스페셜, 남성전용 중 어떤 코스를 생각하는지와 60분·90분·120분 중 원하는 시간을 정리하면 코스·가격 안내를 보기에도 편합니다.",
          "남성전용 코스는 60분과 90분으로 운영합니다. 다른 코스의 시간별 금액도 가격표에서 먼저 살펴본 뒤 상담하면 선택이 한결 단순해집니다.",
        ],
      },
      {
        heading: "후불·카드 결제도 함께 확인하기",
        paragraphs: [
          "결제는 선입금 없는 100% 현장 후불로 진행하며 현장 카드 결제가 가능합니다. 결제 방식을 추측해 준비하기보다 상담에서 필요한 내용을 다시 확인하세요.",
          "마사지봄은 24시간 전화상담을 운영합니다. 자택이나 숙소 이용을 고려할 때도 지역 안내와 가격표를 함께 보고, 필요한 내용을 차분하게 문의할 수 있습니다.",
        ],
      },
    ],
    consultationItems: [
      "서비스를 받을 정확한 주소",
      "이용 장소의 간단한 상황",
      "희망 코스와 이용 시간",
    ],
    relatedSlug: "masaji-shop-gagi-himdeul-ttae",
  },
] as const satisfies readonly BlogPost[];

export function getBlogPost(slug: BlogPost["slug"]): BlogPost {
  const post = BLOG_POSTS.find((candidate) => candidate.slug === slug);

  if (!post) {
    throw new Error(`Unknown blog post: ${slug}`);
  }

  return post;
}

export function getBlogPostPath(post: Pick<BlogPost, "slug">): string {
  return `/blog/${post.slug}`;
}

export function createBlogPostMetadata(post: BlogPost): Metadata {
  const path = getBlogPostPath(post);
  const socialTitle = `${post.metaTitle} | 마사지봄`;

  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: path },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: "마사지봄",
      url: path,
      title: socialTitle,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description: post.description,
    },
  };
}

export function createBlogPostingJsonLd(post: BlogPost) {
  const url = `${SITE_ORIGIN}${getBlogPostPath(post)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.h1,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "ko-KR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    author: {
      "@type": "Organization",
      name: "마사지봄",
    },
    publisher: {
      "@type": "Organization",
      name: "마사지봄",
      url: SITE_ORIGIN,
    },
  };
}

export function getBlogPostText(post: BlogPost): string {
  return [
    post.intro,
    ...post.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
    ]),
  ].join(" ");
}
