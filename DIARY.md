# 마사지봄 배포 기록

## 2026-08-19 — Googlebot RSC prefetch 요청 차단

- Search Console 호스트 크롤 통계에서 총 3,061건 중 React Server Component
  `?_rsc=` 요청이 2,643건(86%)을 차지하고, 실제 HTML은 9%에 그친 상태를
  기준으로 링크 prefetch 계약을 점검했다. 응답 실패나 속도 문제가 아니라
  Googlebot 렌더링 중 자동 prefetch가 수집 요청을 소모하는 형태다.
- 모든 내부 `next/link` 사용을 `SiteLink` 경계로 모으고 운영 빌드에서는 호출부
  설정과 관계없이 `prefetch={false}`를 적용한다. 실제 `<a href>`, 클릭
  내비게이션, 이벤트 처리와 접근성 속성은 Next Link에 그대로 전달한다.
- sitemap 1,299개 URL은 초기 고정 페이지(2026-08-14 05:33:04 KST), 편집
  문서(2026-08-15 13:01:53 KST), 지역 메타(2026-08-19 00:59:42 KST)의
  실제 유의미한 배포 커밋 시각을 경로별 `lastModified`로 기록했다. 빌드 시각은
  사용하지 않으며 해당 경로 그룹의 공개 내용이 다시 바뀔 때만 갱신한다.
  검색엔진이 무시하는 `changefreq`와 `priority`는 제거했다.
- `pnpm test`, `pnpm typecheck`, 운영 빌드를 통과했다. 빌드는 정적 페이지
  1,318개를 생성했고, sitemap의 canonical URL 1,299개와 `lastmod` 1,299개를
  전수 비교했다. 중앙 wrapper 밖의 `next/link` import/동적 import/require는
  0개이며 빌드 HTML에는 실제 anchor 63,910개가 남아 있다. 운영 산출물에
  직렬화된 link prefetch 값 146,947개도 전부 `false`로 확인했다.

## 2026-08-19 — 고객 검색형 지역 메타

- 지역 페이지의 `title`, `keywords`, `description`에서만 행정명 끝의
  `특별자치도`, `특별자치시`, `특별시`, `광역시`, `도`, `시`를 제거해
  `서울출장마사지`, `인천출장마사지`, `경기출장마사지`,
  `수원출장마사지`처럼 실제 검색형 표현을 사용한다.
- `구`, `군`, `읍`, `면`, `동`, `리`는 제거하지 않는다. 축약 뒤 같은 이름은
  `서울 중구`, `부산 중구`처럼 같은 규칙으로 축약한 부모 지역을 붙여
  1,291개 운영 경로의 기본 키워드를 모두 고유하게 유지한다.
- 공식 행정명은 화면 본문과 breadcrumb에 그대로 두고 URL·canonical도 바꾸지
  않는다. 단위 정규화 테스트와 1,291개 빌드 산출물 전수 테스트가 이 경계를
  고정한다.
- 후속 운영 감사에서 description 첫 문장의 지역 문맥에 공식 행정명이 남은
  사례를 확인해, 이 문맥도 같은 검색형 라벨만 사용하도록 분리했다. 소스 라벨
  1,291개와 빌드된 title·keywords·description 1,291세트 모두에서 알려진 공식
  `특별자치도`·`특별자치시`·`특별시`·`광역시`·`도`·`시` 토큰의 잔존을 막는다.

## 2026-08-17 — 서비스 이미지 역할 규칙

- 토닥이 계열이 아닌 플랫폼의 코스·서비스 이미지에서는 마사지사를 항상
  성인 여성으로 사용한다. 고객 성별과 마사지사 성별을 서로 다른 역할로
  검토하며 혼동하지 않는 영구 규칙을 `AGENTS.md`에 기록했다.

## 2026-08-17 — RSS 2.0 피드

- 네이버 공식 RSS 가이드에 맞춰 최신 블로그 글 2건의 전체 본문을
  `https://msgbom.kr/rss.xml`에서 제공한다.
- 링크와 GUID는 `msgbom.kr`의 self-canonical HTTPS URL이며, 날짜는 기존 글의
  검증된 `publishedAt`을 사용한다. 빌드 시각으로 갱신하지 않는다.
- 지역 1,291개 URL은 RSS에 복제하지 않고 기존 sitemap에서 계속 관리한다.
- RSS 단위 테스트 2건과 기존 analytics 테스트 6건이 통과했고, Next 전체
  빌드는 1,318개 정적 페이지와 `/rss.xml`을 생성했다. 빌드 XML은 6,374
  bytes·item 2건이며 `xmllint`와 홈의 RSS 자동 발견 링크 1건을 통과했다.
- 운영 배포 후 `https://msgbom.kr/rss.xml`은 HTTP 200,
  `application/rss+xml`, item 2건, SHA-256
  `b0d5cf63d4184c5bec3cfe563c64e37f3e2c050de3a0c12fc5bec2b11b5035ff`이며
  운영 홈의 autodiscovery 링크도 정확히 1건이다.
