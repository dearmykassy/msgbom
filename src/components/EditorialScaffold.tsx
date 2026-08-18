import Link from "@/components/SiteLink";

type EditorialScaffoldProps = {
  kind: "food" | "date";
};

const copy = {
  food: {
    eyebrow: "BOMCHELIN · FOOD",
    title: "오늘 가고 싶은 동네 맛집",
    description:
      "봄슐랭은 신뢰할 수 있는 정보를 바탕으로 지역별 맛집을 보기 좋게 소개합니다.",
    featureTitle: "오늘 먹고 싶은 한 끼",
    featureCopy: "메뉴와 예산에 맞는 맛집을 편하게 둘러보세요.",
    emptyTitle: "맛있는 한 끼를 고르는 기준",
    emptyCopy:
      "메뉴와 예산, 방문하기 좋은 시간까지 살펴보고 오늘 마음에 드는 맛집을 찾아보세요.",
    fields: ["맛집의 매력", "추천 메뉴와 예산", "방문하기 좋은 시간", "광고·협찬 여부"],
  },
  date: {
    eyebrow: "BOMCHELIN · DATE COURSE",
    title: "오늘을 더 특별하게 만드는 데이트 코스",
    description:
      "이동시간, 체류시간, 예산과 우천 대안까지 고려한 데이트 코스를 소개합니다.",
    featureTitle: "함께 보내고 싶은 하루",
    featureCopy: "시간과 예산에 맞는 데이트 코스를 여유롭게 둘러보세요.",
    emptyTitle: "우리에게 맞는 하루를 골라보세요.",
    emptyCopy:
      "짧은 산책부터 여유로운 하루까지, 이동시간과 예산에 맞는 코스를 찾아보세요.",
    fields: ["코스 전체 동선", "예상 시간과 예산", "추천 계절·시간대", "우천·혼잡 대안"],
  },
} as const;

export function EditorialScaffold({ kind }: EditorialScaffoldProps) {
  const content = copy[kind];

  return (
    <main>
      <section className="page-hero editorial-page-hero">
        <div className="shell">
          <p className="eyebrow light">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
      </section>

      <section className="section section-sand">
        <div className="content-shell">
          <div className="editorial-scope-note">
            <span>BOMCHELIN CHOICE</span>
            <strong>{content.featureTitle}</strong>
            <p>{content.featureCopy}</p>
          </div>

          <div className="empty-state editorial-empty">
            <span className="empty-mark" aria-hidden="true">
              {kind === "food" ? "食" : "春"}
            </span>
            <strong>{content.emptyTitle}</strong>
            <p>{content.emptyCopy}</p>
          </div>

          <div className="article-template-preview" aria-labelledby="template-heading">
            <div>
              <p className="eyebrow">WHAT TO LOOK FOR</p>
              <h2 id="template-heading">봄슐랭에서 살펴볼 내용</h2>
            </div>
            <ol>
              {content.fields.map((field, index) => (
                <li key={field}>
                  <span>0{index + 1}</span>
                  <strong>{field}</strong>
                  <em>한눈에 보기</em>
                </li>
              ))}
            </ol>
          </div>

          <div className="page-actions">
            <Link className="button button-dark" href="/areas">
              지역부터 둘러보기
            </Link>
            <Link className="text-link" href="/bomchelin">
              봄슐랭 홈으로 →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
