import Image from "next/image";
import Link from "next/link";

import { AREA_DIRECTORY_CARDS } from "@/data/area-directory-cards";

type ProvinceDirectoryProps = {
  labelledBy: string;
};

export function ProvinceDirectory({ labelledBy }: ProvinceDirectoryProps) {
  return (
    <ul className="province-grid" aria-labelledby={labelledBy}>
      {AREA_DIRECTORY_CARDS.map((area, index) => {
        const isActive = area.availability === "active";
        return (
          <li className="province-grid-item" key={area.key}>
            <Link
              className={`province-card ${isActive ? "is-active" : "is-development"}`}
              href={area.path}
              aria-label={`${area.name}, ${area.scopeLabel}, ${isActive ? "운영 중 지역 보기" : "서비스 준비 중 안내 보기"}`}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="province-card-image"
                fill
                loading={index < 4 ? "eager" : "lazy"}
                sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 980px) 46vw, 24vw"
                src={`/images/regions/${area.imageKey}.webp`}
                unoptimized
              />
              <span className="province-card-kicker">
                {isActive ? "운영 중" : "준비 중"}
              </span>
              <strong className="province-card-name">{area.shortName}</strong>
              <span className="province-card-scope">{area.scopeLabel}</span>
              <span className="province-card-state">
                {isActive ? "지역 보기" : "준비 현황 보기"}{" "}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
