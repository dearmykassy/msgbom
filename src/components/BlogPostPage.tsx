import Link from "next/link";

import { DEFAULT_BUSINESS_CONTACT_PHONE } from "@/data/business-settings";
import {
  createBlogPostingJsonLd,
  getBlogPost,
  getBlogPostPath,
  type BlogPost,
} from "@/data/blog-posts";

type BlogPostPageProps = {
  post: BlogPost;
};

export function BlogPostPage({ post }: BlogPostPageProps) {
  const relatedPost = getBlogPost(post.relatedSlug);
  const jsonLd = createBlogPostingJsonLd(post);

  return (
    <main>
      <article className="blog-article">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <header className="blog-post-hero">
          <div className="content-shell">
            <nav aria-label="블로그 경로" className="blog-breadcrumbs">
              <Link href="/blog">마사지봄 블로그</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{post.category}</span>
            </nav>
            <p className="eyebrow light">{post.category}</p>
            <h1>{post.h1}</h1>
            <p>{post.intro}</p>
            <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
          </div>
        </header>

        <div className="section section-paper">
          <div className="content-shell blog-reading">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <aside className="blog-consultation" aria-labelledby="blog-call-title">
              <div>
                <p className="eyebrow">BEFORE YOU CALL</p>
                <h2 id="blog-call-title">전화상담 전에 준비하면 좋은 내용</h2>
              </div>
              <ul>
                {post.consultationItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="blog-consultation-links">
                <Link href="/areas">운영 지역 안내</Link>
                <Link href="/guide">전화상담 준비 항목</Link>
                <Link href="/pricing">코스·가격표</Link>
                <a href={DEFAULT_BUSINESS_CONTACT_PHONE.telHref}>
                  {DEFAULT_BUSINESS_CONTACT_PHONE.display} 전화상담
                </a>
              </div>
            </aside>

            <nav aria-label="관련 글" className="blog-related">
              <p className="eyebrow">RELATED POST</p>
              <Link href={getBlogPostPath(relatedPost)}>
                <span>관련 글</span>
                <strong>{relatedPost.h1}</strong>
                <em>읽어보기 →</em>
              </Link>
            </nav>
          </div>
        </div>
      </article>
    </main>
  );
}
