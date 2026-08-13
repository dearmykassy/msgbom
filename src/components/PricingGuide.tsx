type PricingGuideProps = {
  copy?: {
    title: string;
    items: readonly [string, string];
  };
  regionName?: string;
};

export function PricingGuide({ copy, regionName }: PricingGuideProps) {
  const visitLabel = regionName ? `${regionName} 방문` : "방문";

  return (
    <section className="pricing-guide" aria-labelledby="pricing-guide-title">
      <div className="pricing-guide-heading">
        <span className="pricing-guide-mark" aria-hidden="true">i</span>
        <div>
          <p>BEFORE RESERVATION</p>
          <h3 id="pricing-guide-title">
            {copy?.title ?? "예약 전, 아래 내용만 확인해 주세요"}
          </h3>
        </div>
      </div>

      <ul className="pricing-guide-list">
        {copy ? (
          copy.items.map((item) => <li key={item}>{item}</li>)
        ) : (
          <>
            <li>
              예약할 때 <strong>방문 지역·희망 코스·이용 시간</strong>을 함께
              알려주세요.
            </li>
            <li>
              <strong>24시간 상담</strong>이 가능하며, {visitLabel} 가능 여부와 예상
              도착 시간은 일정을 확인한 뒤 안내합니다.
            </li>
          </>
        )}
      </ul>
    </section>
  );
}
