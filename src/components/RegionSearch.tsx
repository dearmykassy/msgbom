"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import { searchRegions } from "@/lib/regions";

type RegionSearchProps = {
  variant?: "hero" | "inline";
};

const EXAMPLE_QUERIES = ["역삼동", "매탄3동", "송도동"];

export function RegionSearch({ variant = "hero" }: RegionSearchProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const results = useMemo(() => searchRegions(query, 10), [query]);
  const hasQuery = query.trim().length > 0;
  const isOpen = isFocused && hasQuery;

  return (
    <section className={`region-search region-search-${variant}`} aria-labelledby={`${inputId}-title`}>
      <div className="region-search-heading">
        <p className="region-eyebrow">REGION SEARCH</p>
        <h2 id={`${inputId}-title`}>동네 이름으로 바로 찾기</h2>
        <p>
          현재 행정동 이름도, 번호가 붙은 기존 동 이름도 검색할 수 있습니다.
        </p>
      </div>

      <div
        className="region-search-control"
        role="search"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsFocused(false);
          }
        }}
      >
        <label className="region-search-label" htmlFor={inputId}>
          지역명 검색
        </label>
        <div className="region-search-input-wrap">
          <span className="region-search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            id={inputId}
            className="region-search-input"
            type="search"
            value={query}
            placeholder="예: 강남구, 역삼동, 매탄3동"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setIsFocused(false);
                event.currentTarget.blur();
              }
            }}
          />
          {hasQuery ? (
            <button
              className="region-search-clear"
              type="button"
              aria-label="검색어 지우기"
              onClick={() => {
                setQuery("");
                setIsFocused(true);
              }}
            >
              지우기
            </button>
          ) : null}
        </div>

        {isOpen ? (
          <div className="region-search-results">
            <p className="region-search-status" role="status" aria-live="polite">
              {results.length > 0
                ? `일치하는 지역 ${results.length}개`
                : "일치하는 지역이 없습니다"}
            </p>
            {results.length > 0 ? (
              <ul className="region-search-result-list">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link
                      className="region-search-result"
                      href={result.path}
                      onClick={() => setIsFocused(false)}
                    >
                      <span className="region-search-result-main">
                        <strong>{result.matchedName}</strong>
                        {result.isAliasMatch ? (
                          <span className="region-search-alias">
                            {result.representativeName}에서 함께 안내
                          </span>
                        ) : null}
                      </span>
                      <span className="region-search-context">{result.context}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="region-search-empty">
                시·구·동 이름을 확인하거나 번호를 제외한 동네 이름으로 다시 검색해
                주세요.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="region-search-examples" aria-label="검색 예시">
        <span>빠른 검색</span>
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setQuery(example);
              setIsFocused(true);
            }}
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}
