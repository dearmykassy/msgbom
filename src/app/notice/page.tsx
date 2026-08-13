import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지사항",
  description: "마사지봄 서비스와 지역 정보의 변경 사항을 안내합니다.",
  alternates: { canonical: "/notice" },
};

export default function NoticePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow light">NOTICE</p>
          <h1>마사지봄 공지사항</h1>
          <p>마사지봄의 새로운 소식과 꼭 알아둘 안내를 전합니다.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="content-shell">
          <div className="empty-state">
            <strong>등록된 공지가 없습니다.</strong>
            <p>새로운 공지가 올라오면 이곳에서 바로 확인하실 수 있습니다.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
