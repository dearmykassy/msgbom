import type { Metadata } from "next";
import Link from "@/components/SiteLink";

import { BLOG_POSTS, getBlogPostPath } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "마사지봄 블로그",
  description:
    "출장마사지 이용 전 확인할 주소, 시간, 코스, 결제 정보를 정리한 마사지봄 블로그입니다.",
  alternates: { canonical: "/blog" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "마사지봄",
    url: "/blog",
    title: "마사지봄 블로그 | 이용 전 읽기",
    description:
      "출장마사지 이용 전 확인할 주소, 시간, 코스, 결제 정보를 정리한 마사지봄 블로그입니다.",
  },
  twitter: {
    card: "summary",
    title: "마사지봄 블로그 | 이용 전 읽기",
    description:
      "출장마사지 이용 전 확인할 주소, 시간, 코스, 결제 정보를 정리한 마사지봄 블로그입니다.",
  },
};

export default function BlogPage() {
  return (
    <main>
      <section className="page-hero blog-hub-hero">
        <div className="shell">
          <p className="eyebrow light">MASSAGE BOM BLOG</p>
          <h1>이용 전 필요한 내용을 차분히 읽어보세요.</h1>
          <p>
            출장마사지 이용을 생각할 때 주소, 시간, 코스와 결제 방식처럼 먼저
            확인하면 좋은 내용을 정리했습니다.
          </p>
        </div>
      </section>

      <section className="section section-paper">
        <div className="content-shell blog-board">
          <div className="blog-board-heading">
            <div>
              <p className="eyebrow">LATEST POSTS</p>
              <h2>이용 전 읽기</h2>
            </div>
            <p>필요한 정보를 먼저 확인하고 전화상담을 준비해 보세요.</p>
          </div>

          <div className="blog-board-list">
            {BLOG_POSTS.map((post) => (
              <article className="blog-board-item" key={post.slug}>
                <div className="blog-board-meta">
                  <span>{post.category}</span>
                  <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
                </div>
                <div>
                  <h2>
                    <Link href={getBlogPostPath(post)}>{post.metaTitle}</Link>
                  </h2>
                  <p>{post.description}</p>
                </div>
                <Link
                  aria-label={`${post.metaTitle} 읽기`}
                  className="blog-board-link"
                  href={getBlogPostPath(post)}
                >
                  읽기 →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
