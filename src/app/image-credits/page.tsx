import type { Metadata } from "next";

import imageManifest from "../../../public/images/regions/source-manifest.json";

type ImageCredit = {
  key: string;
  status: string;
  resolvedTitle?: string;
  alt?: string;
  sourceUrl?: string;
  license?: string;
  licenseUrl?: string | null;
  artist?: string;
  transformation?: string;
  derivativeLicense?: string;
};

export const metadata: Metadata = {
  title: "지역 사진 출처",
  description: "마사지봄 지역 카드에 사용된 사진의 작가와 라이선스를 안내합니다.",
  alternates: { canonical: "/image-credits" },
  robots: { index: false, follow: true },
};

export default function ImageCreditsPage() {
  const records = (imageManifest.records as ImageCredit[]).filter(
    (record) => record.status === "downloaded" && record.sourceUrl,
  );

  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow light">IMAGE CREDITS</p>
          <h1>지역 사진 출처</h1>
          <p>전국 지역 카드에 사용한 사진의 원본, 작가, 라이선스를 안내합니다.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="content-shell">
          <ul className="image-credit-list">
            {records.map((record) => (
              <li key={record.key}>
                <strong>{record.alt ?? record.resolvedTitle ?? record.key}</strong>
                <span>
                  {record.artist ? `촬영·제작: ${record.artist}` : "작가 정보 없음"}
                </span>
                <span>
                  라이선스: {record.license ?? "원본 페이지 참조"}
                </span>
                {record.transformation ? (
                  <span>
                    편집: {record.transformation}
                    {record.derivativeLicense
                      ? ` · 편집본 라이선스 ${record.derivativeLicense}`
                      : ""}
                  </span>
                ) : null}
                <div>
                  <a href={record.sourceUrl} rel="external noreferrer" target="_blank">
                    원본 보기
                  </a>
                  {record.licenseUrl ? (
                    <a href={record.licenseUrl} rel="license noreferrer" target="_blank">
                      라이선스 보기
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
