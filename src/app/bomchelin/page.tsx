import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "봄슐랭",
  description: "맛있는 한 끼와 즐거운 데이트 코스를 소개하는 마사지봄 봄슐랭 가이드입니다.",
  alternates: { canonical: "/bomchelin" },
};

export default function BomchelinPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow light">BOMCHELIN · FOOD &amp; DATE</p>
          <h1>밥부터 데이트까지, 봄슐랭에서 찾아보세요.</h1>
          <p>
            가까운 맛집과 하루가 자연스럽게 이어지는 데이트 코스를 한곳에서
            둘러보세요.
          </p>
        </div>
      </section>

      <section className="section section-paper">
        <div className="shell">
          <div className="editorial-grid">
            <Link className="editorial-card editorial-food" href="/bomchelin/food">
              <div className="editorial-art editorial-art-food" aria-hidden="true">
                <span>食</span>
              </div>
              <div className="editorial-card-body">
                <p>FOOD</p>
                <h2>봄슐랭 맛집</h2>
                <span>지역별로 찾아보기 쉬운 맛집 이야기</span>
                <strong>맛집 둘러보기 →</strong>
              </div>
            </Link>
            <Link className="editorial-card editorial-date" href="/bomchelin/date">
              <div className="editorial-art editorial-art-date" aria-hidden="true">
                <span>春</span>
              </div>
              <div className="editorial-card-body">
                <p>DATE COURSE</p>
                <h2>데이트 코스</h2>
                <span>시간과 예산을 고려해 즐기기 좋은 데이트 코스</span>
                <strong>데이트 코스 둘러보기 →</strong>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-forest">
        <div className="content-shell publication-gate">
          <p className="eyebrow light">BOMCHELIN PICKS</p>
          <h2>오늘의 선택이 즐거워지는 한곳</h2>
          <div>
            <span>맛집 찾기</span>
            <i aria-hidden="true">→</i>
            <span>코스 고르기</span>
            <i aria-hidden="true">→</i>
            <span>즐거운 하루</span>
          </div>
          <p>
            먹고 싶은 메뉴와 함께 가고 싶은 사람을 떠올리며, 지금 마음에 드는
            봄슐랭 이야기를 골라보세요.
          </p>
        </div>
      </section>
    </main>
  );
}
