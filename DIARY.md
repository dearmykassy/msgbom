# 마사지봄 배포 기록

## 2026-08-17 — RSS 2.0 피드

- 네이버 공식 RSS 가이드에 맞춰 최신 블로그 글 2건의 전체 본문을
  `https://msgbom.kr/rss.xml`에서 제공한다.
- 링크와 GUID는 `msgbom.kr`의 self-canonical HTTPS URL이며, 날짜는 기존 글의
  검증된 `publishedAt`을 사용한다. 빌드 시각으로 갱신하지 않는다.
- 지역 1,291개 URL은 RSS에 복제하지 않고 기존 sitemap에서 계속 관리한다.
- RSS 단위 테스트 2건과 기존 analytics 테스트 6건이 통과했고, Next 전체
  빌드는 1,318개 정적 페이지와 `/rss.xml`을 생성했다. 빌드 XML은 6,374
  bytes·item 2건이며 `xmllint`와 홈의 RSS 자동 발견 링크 1건을 통과했다.
