import type { Metadata } from "next";

import { PricingTable } from "@/components/PricingTable";

export const metadata: Metadata = {
  title: "코스·가격",
  description: "타이마사지, 아로마마사지, 힐링마사지, 스페셜마사지, 남성전용 코스의 운영 가격표입니다.",
  alternates: { canonical: "/pricing" },
  robots: { index: false, follow: true },
};

export default function PricingPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow light">COURSE &amp; PRICE</p>
          <h1>코스와 가격을 한눈에</h1>
          <p>
            타이마사지부터 남성전용 코스까지 이용 시간별 가격을 한눈에
            확인하세요.
          </p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="shell">
          <PricingTable compact />
        </div>
      </section>
    </main>
  );
}
