import { BLOG_POSTS, getBlogPostPath } from "@/data/blog-posts";
import { buildRssXml } from "@/lib/rss";
import { SITE_ORIGIN } from "@/lib/site-config";

export const dynamic = "force-static";
export const revalidate = false;

export function buildMassageBomRss(): string {
  return buildRssXml({
    title: "마사지봄 블로그",
    siteUrl: `${SITE_ORIGIN}/`,
    feedUrl: `${SITE_ORIGIN}/rss.xml`,
    description:
      "출장마사지 이용 전 확인할 주소, 시간, 코스와 결제 정보를 정리한 마사지봄 블로그입니다.",
    language: "ko-KR",
    items: BLOG_POSTS.map((post) => ({
      title: post.metaTitle,
      url: `${SITE_ORIGIN}${getBlogPostPath(post)}`,
      description: [
        post.intro,
        ...post.sections.flatMap((section) => [
          section.heading,
          ...section.paragraphs,
        ]),
        "전화상담 전에 준비하면 좋은 내용",
        ...post.consultationItems,
      ].join("\n\n"),
      publishedAt: post.publishedAt,
      modifiedAt: post.publishedAt,
      category: post.category,
    })),
  });
}

export function GET(): Response {
  return new Response(buildMassageBomRss(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
