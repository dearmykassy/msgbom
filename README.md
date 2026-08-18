# 마사지봄

[마사지봄 공식 사이트](https://msgbom.kr/)

마사지봄은 지역을 단계별로 찾아보고 코스, 이용 절차와 예약 전 확인사항을
살펴볼 수 있는 방문 마사지 안내 사이트입니다. 이 저장소는 운영 배포에 필요한
Next.js 코드와 공개 이미지만 담으며 DB, 로그인 세션과 비밀 키는 포함하지 않습니다.

## 운영 페이지

- [지역 찾기](https://msgbom.kr/areas)
- [가격 안내](https://msgbom.kr/pricing)
- [이용 가이드](https://msgbom.kr/guide)
- [공지사항](https://msgbom.kr/notice)
- [블로그](https://msgbom.kr/blog)
- [XML 사이트맵](https://msgbom.kr/sitemap.xml)
- [RSS 2.0 피드](https://msgbom.kr/rss.xml)

## 지역 안내와 검색 구조

- 11개 상위 권역에서 시·군·구와 세부 지역으로 내려가는 내부 링크 구조를 사용합니다.
- 운영 중인 지역 페이지는 1,291개이며 각 페이지는 고유 canonical URL을 가집니다.
- 사이트맵에는 홈, 지역·안내·편집 페이지를 합친 1,299개 URL이 들어 있습니다.
- 사이트맵의 `lastmod`는 초기 고정 페이지, 편집 문서, 지역 문서별로 실제 마지막
  유의미한 배포 커밋 시각을 사용합니다. 빌드할 때마다 날짜를 바꾸지 않으며 해당
  경로 그룹의 실제 공개 내용이 수정될 때만 그 그룹의 revision을 갱신합니다.
  검색엔진이 참고하지 않는 `changefreq`와 `priority`는 내보내지 않습니다.
- `robots.txt`는 공개 페이지 수집을 허용하고 사이트맵 위치를 안내합니다. 관리자,
  API와 계정 경로는 수집 대상에서 제외합니다.
- RSS에는 발행일이 확인된 블로그 글 2건의 본문을 싣습니다. 지역 URL 전체 목록은
  RSS가 아니라 사이트맵에서 관리합니다.

지역 문서는 확인 가능한 행정구역과 실제 운영 정보를 기준으로 작성합니다. 근거 없는
도착 시간, 후기, 인력 규모, 효능이나 지역 이용량을 만들지 않으며 제목과 본문은
키워드 반복보다 사람이 읽기 쉬운 안내를 우선합니다.

## 개발과 배포

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test:analytics
pnpm test:region-meta-label
pnpm test:region-metadata
pnpm build
```

`test:region-metadata`는 먼저 프로덕션 빌드를 만든 뒤 1,291개 운영 지역의
title·keywords·description, 고유성, 메타 내 공식 행정 토큰 부재, canonical과
공식 breadcrumb 표기를 전수 검사합니다.

모든 내부 링크는 `src/components/SiteLink.tsx`를 통합니다. 운영 빌드에서는
자동 prefetch를 꺼 Googlebot 렌더링이 대량의 `?_rsc=` 응답을 미리 요청하지
않게 하되, 서버 HTML의 실제 `<a href>`, 클릭 이동과 접근성 속성은 유지합니다.
`test:crawl-contract`는 중앙 wrapper 밖의 직접 `next/link` import가 다시
생기지 않는지와 운영 prefetch 강제 차단을 검사합니다.

Netlify는 `netlify.toml`의 설정으로 이 저장소를 빌드합니다. 운영 origin은
`src/lib/site-config.ts`에 `https://msgbom.kr`로 고정되어 canonical, Open Graph,
robots와 sitemap이 같은 호스트를 가리킵니다.

`output: "export"`를 추가하지 마세요. 기존 번호 행정동 309개의 영구 308 이동과
Next 이미지 처리를 보존하기 위해 Netlify의 Next.js/OpenNext 배포를 사용합니다.

## GA4 / Netlify 환경변수

이 사이트 전용 GA4 웹 데이터 스트림을 만든 뒤 Netlify의 **Site configuration →
Environment variables**에 `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`를 등록하고
다시 배포합니다. 이 공개 빌드 변수가 없거나 형식이 잘못되면 Google 태그를 전혀
로드하지 않습니다. 이벤트 정의, 개인정보 제한과 전화 클릭 지표의 한계는
[`docs/analytics.md`](docs/analytics.md)를 참고하세요.
