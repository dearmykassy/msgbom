import type { Metadata } from "next";
import Link from "@/components/SiteLink";

import { ProvinceDirectory } from "@/components/ProvinceDirectory";
import { RegionSearch } from "@/components/RegionSearch";

export const metadata: Metadata = {
  title: "우리 지역 찾기",
  description:
    "서울·인천·경기와 천안·아산·대전·대구·구미·포항·부산·제주의 지역을 확인할 수 있습니다.",
  alternates: { canonical: "/areas" },
  robots: { index: true, follow: true },
};

export default function AreasPage() {
  return (
    <main className="region-page region-index-page">
      <section className="region-page-hero">
        <div className="region-page-shell">
          <nav className="region-breadcrumbs" aria-label="현재 위치">
            <Link href="/">홈</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">지역 찾기</span>
          </nav>
          <p className="region-eyebrow">SERVICE AREA DIRECTORY</p>
          <h1>우리 지역 찾기</h1>
          <p className="region-page-lead">
            원하는 도시와 동네를 선택해 가까운 지역의 마사지봄 안내를
            살펴보세요.
          </p>
        </div>
      </section>

      <div className="region-page-shell region-page-content">
        <RegionSearch variant="inline" />

        <section className="region-province-section" aria-labelledby="region-province-title">
          <div className="region-section-heading">
            <p className="region-eyebrow">BROWSE BY AREA</p>
            <h2 id="region-province-title">지역별로 둘러보기</h2>
            <p>도시와 동네 이름을 눌러 원하는 지역을 빠르게 찾아보세요.</p>
          </div>
          <ProvinceDirectory labelledBy="region-province-title" />
        </section>
      </div>
    </main>
  );
}
