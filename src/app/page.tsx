import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/SiteLink";

import { ProvinceDirectory } from "@/components/ProvinceDirectory";
import { PricingTable } from "@/components/PricingTable";
import { RegionSearch } from "@/components/RegionSearch";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const serviceHighlights = [
  {
    index: "01",
    title: "100% 현장 후불",
    copy: "사전 예약금 없이 관리가 끝난 뒤 현장에서 결제합니다.",
  },
  {
    index: "02",
    title: "현장 카드 결제",
    copy: "무선 단말기를 이용한 현장 카드 결제가 가능합니다.",
  },
  {
    index: "03",
    title: "365일 24시간",
    copy: "새벽 시간을 포함해 상담과 운영을 이어갑니다.",
  },
  {
    index: "04",
    title: "2인 관리·위생 기준",
    copy: "커플·부부 동시 관리와 일회용 비품·소독 기준을 확인하세요.",
  },
] as const;

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="home-hero-media" aria-hidden="true">
          <picture>
            <Image
              alt=""
              fill
              priority
              sizes="100vw"
              src="/images/home/massagebom-home-hero-neon-standoff-v1.webp"
              unoptimized
            />
          </picture>
        </div>
        <div className="home-hero-shade" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />
        <div className="shell hero-layout">
          <div className="hero-copy">
            <div className="hero-service-badges" aria-label="서비스 안내">
              <span>전국 방문</span>
              <span>24시간 상담</span>
            </div>
            <h1 id="hero-title">전국 출장 마사지</h1>
            <p className="hero-description">
              원하는 지역과 코스를 한눈에 확인하고,
              전국 어디서든 24시간 상담받으세요.
            </p>
            <div className="hero-actions">
              <a className="button button-blossom" href="#region-search">
                내 지역 찾기
              </a>
              <Link className="button button-ghost" href="/bomchelin">
                봄슐랭 둘러보기
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section id="region-search" className="search-dock-section" aria-label="지역 검색">
        <div className="shell">
          <RegionSearch variant="hero" />
        </div>
      </section>

      <section className="proof-strip" aria-label="마사지봄 서비스 안내">
        <div className="shell proof-grid">
          <div>
            <strong>24시간</strong>
            <span>상담 안내</span>
          </div>
          <div>
            <strong>5가지</strong>
            <span>코스별 가격 제공</span>
          </div>
          <div>
            <strong>11개</strong>
            <span>운영 도시·권역</span>
          </div>
          <div>
            <strong>지역별</strong>
            <span>하위 지역까지 안내</span>
          </div>
        </div>
      </section>

      <section className="section section-paper" aria-labelledby="regions-heading">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">SERVICE AREA DIRECTORY</p>
              <h2 id="regions-heading">우리 지역 찾기</h2>
            </div>
            <p>마사지봄 운영 지역에서 우리 동네를 찾아보세요.</p>
          </div>

          <ProvinceDirectory labelledBy="regions-heading" />
        </div>
      </section>

      <section className="section section-forest" aria-labelledby="service-heading">
        <div className="shell service-layout">
          <div className="section-heading inverse sticky-heading">
            <p className="eyebrow light">SERVICE INFORMATION</p>
            <h2 id="service-heading">원하는 코스, 어렵지 않게 고르세요.</h2>
            <p>
              코스별 시간과 가격을 비교하고, 필요한 안내는 상담으로 확인할 수 있습니다.
            </p>
            <span className="status-pill">COURSE · PRICE · COUNSELING</span>
            <Link className="service-guide-link" href="/guide">
              전체 이용안내 보기 →
            </Link>
          </div>

          <ol className="awaiting-list">
            {serviceHighlights.map((item) => (
              <li key={item.index}>
                <span>{item.index}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
                <em>서비스 안내</em>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-paper" id="pricing">
        <div className="shell">
          <PricingTable />
        </div>
      </section>

      <section className="section section-sand" aria-labelledby="bomchelin-heading">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">BOMCHELIN GUIDE</p>
              <h2 id="bomchelin-heading">밥을 잘먹는 방법, 봄슐랭</h2>
            </div>
            <p>
              봄슐랭은 신뢰할 수 있는 정보를 바탕으로 지역별 맛집과 데이트 코스를
              보기 좋게 소개합니다.
            </p>
          </div>

          <div className="editorial-grid">
            <Link className="editorial-card editorial-food" href="/bomchelin/food">
              <div className="editorial-art editorial-art-food" aria-hidden="true">
                <span>食</span>
              </div>
              <div className="editorial-card-body">
                <p>FOOD · DISTRICT GUIDE</p>
                <h3>동네의 시간을 담은 맛집</h3>
                <span>
                  오늘 먹고 싶은 메뉴와 예산에 맞춰 가까운 동네 맛집을 찾아보세요.
                </span>
                <strong>맛집 둘러보기 →</strong>
              </div>
            </Link>

            <Link className="editorial-card editorial-date" href="/bomchelin/date">
              <div className="editorial-art editorial-art-date" aria-hidden="true">
                <span>春</span>
              </div>
              <div className="editorial-card-body">
                <p>DATE · CURATED ROUTE</p>
                <h3>하루가 자연스럽게 이어지는 코스</h3>
                <span>
                  이동시간, 체류시간, 예산과 우천 대안까지 고려한 데이트 코스를
                  소개합니다.
                </span>
                <strong>데이트 코스 둘러보기 →</strong>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-paper compact-section">
        <div className="shell editorial-principles">
          <div>
            <p className="eyebrow">BOMCHELIN GUIDE</p>
            <h2>맛있는 한 끼와 좋은 하루를 더 쉽게 고르세요.</h2>
          </div>
          <ul>
            <li>지역별로 한눈에 살펴보는 맛집 정보</li>
            <li>시간과 예산에 맞춰 고르는 데이트 코스</li>
            <li>광고·협찬 여부를 알기 쉽게 표시</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
