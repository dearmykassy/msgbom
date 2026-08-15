import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import "@fontsource-variable/noto-sans-kr/wght.css";
import "@fontsource-variable/noto-serif-kr/wght.css";
import "@fontsource-variable/asta-sans/wght.css";

import { RegionAwareHeader } from "@/components/RegionAwareHeader";
import { DEFAULT_BUSINESS_CONTACT_PHONE } from "@/data/business-settings";
import { SITE_ORIGIN } from "@/lib/site-config";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "마사지봄 | 지역에서 시작하는 편안한 휴식",
    template: "%s | 마사지봄",
  },
  description:
    "전국 지역별 출장 마사지 코스와 가격을 한눈에 확인하는 마사지봄입니다.",
  applicationName: "마사지봄",
  authors: [{ name: "마사지봄" }],
  creator: "마사지봄",
  publisher: "마사지봄",
  keywords: ["마사지봄", "전국 출장 마사지", "지역별 마사지", "24시간 상담"],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "6YG_399Wipm_HSlmGm53HTzgga4RqY7z1JUmJUME7_c",
    other: {
      "naver-site-verification": "b4da94732000738805ad2a2bb96eab983fea7156",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "마사지봄",
    title: "마사지봄 | 전국 출장 마사지",
    description: "전국 지역별 출장 마사지 코스와 가격을 한눈에 확인하는 플랫폼",
  },
};

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={footer ? "brand-logo brand-logo-footer" : "brand-logo"}
      height={180}
      loading={footer ? "lazy" : "eager"}
      priority={!footer}
      src="/brand/massagebom-logo-header.png"
      width={360}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        <RegionAwareHeader>
          <div className="shell header-inner">
            <Link className="brand" href="/" aria-label="마사지봄 홈">
              <BrandLogo />
            </Link>
            <nav className="desktop-nav desktop-nav-right" aria-label="주요 메뉴">
              <Link className="nav-region-link" href="/areas">
                <span aria-hidden="true">⌕</span>
                지역 찾기
              </Link>
              <Link href="/guide">이용안내</Link>
              <Link href="/pricing">코스·가격</Link>
              <Link href="/blog">블로그</Link>
              <Link href="/bomchelin/food">봄슐랭 맛집</Link>
              <Link href="/bomchelin/date">데이트 코스</Link>
              <Link href="/notice">공지사항</Link>
            </nav>
          </div>
          <nav className="mobile-nav" aria-label="모바일 주요 메뉴">
            <Link className="mobile-region-link" href="/areas">
              <span aria-hidden="true">⌕</span>
              지역 찾기
            </Link>
            <Link href="/guide">이용안내</Link>
            <Link href="/pricing">코스·가격</Link>
            <Link href="/blog">블로그</Link>
            <Link href="/bomchelin/food">봄슐랭 맛집</Link>
            <Link href="/bomchelin/date">데이트 코스</Link>
            <Link href="/notice">공지사항</Link>
          </nav>
        </RegionAwareHeader>
        {children}
        <footer className="site-footer">
          <div className="shell footer-grid">
            <div className="footer-brand">
              <Link className="brand brand-light" href="/" aria-label="마사지봄 홈">
                <BrandLogo footer />
              </Link>
              <p>
                원하는 지역과 코스를 찾고, 맛집과 데이트 정보도 함께 둘러보세요.
              </p>
            </div>
            <div>
              <h2>둘러보기</h2>
              <Link href="/areas">지역 찾기</Link>
              <Link href="/guide">이용안내</Link>
              <Link href="/pricing">코스·가격</Link>
              <Link href="/bomchelin">봄슐랭</Link>
              <Link href="/notice">공지사항</Link>
            </div>
            <div>
              <h2>운영 정보</h2>
              <p>코스별 가격표 운영</p>
              <a href={DEFAULT_BUSINESS_CONTACT_PHONE.telHref}>
                전화상담 {DEFAULT_BUSINESS_CONTACT_PHONE.display}
              </a>
              <p>전화상담: 24시간</p>
              <Link href="/image-credits">지역 사진 출처</Link>
            </div>
          </div>
          <div className="shell footer-bottom">
            <span>© 2026 MASSAGE BOM</span>
            <span>24시간 전화상담 · 100% 현장 후불</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
