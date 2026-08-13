import type { Metadata } from "next";
import Link from "next/link";

import { PricingTable } from "@/components/PricingTable";
import { ServiceGuide } from "@/components/ServiceGuide";

export const metadata: Metadata = {
  title: "이용안내",
  description:
    "마사지봄 상담 준비 항목과 현장 후불, 카드 결제, 24시간 운영, 위생 기준을 확인하세요.",
  alternates: { canonical: "/guide" },
  robots: { index: true, follow: true },
};

export default function GuidePage() {
  return (
    <main>
      <section className="page-hero guide-page-hero">
        <div className="shell">
          <p className="eyebrow light">SERVICE GUIDE</p>
          <h1>예약 전 알아둘 내용을 한곳에</h1>
          <p>
            코스를 고르는 순서부터 결제와 위생 기준까지, 처음 이용할 때 필요한
            정보만 간결하게 정리했습니다.
          </p>
          <div className="guide-page-actions">
            <Link className="button button-blossom" href="/#region-search">
              내 지역 찾기
            </Link>
            <a className="button button-ghost" href="#guide-pricing">
              코스·가격 보기
            </a>
          </div>
        </div>
      </section>

      <ServiceGuide />

      <section className="section section-ivory" id="guide-pricing">
        <div className="shell">
          <PricingTable compact />
        </div>
      </section>
    </main>
  );
}
