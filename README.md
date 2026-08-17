# 마사지봄 Netlify 배포본

이 폴더는 `https://msgbom.kr` 운영 배포에 필요한 코드와 공개 이미지만 담은
Netlify용 Next.js 소스입니다. 원본 프로젝트의 테스트, DB, MCP, 생성 파이프라인,
내부 문서와 로그인 세션은 포함하지 않습니다.

## 권장 배포

1. 이 폴더만 별도 Git 저장소에 올립니다.
2. Netlify에서 **Add new project → Import an existing project**로 저장소를 연결합니다.
3. 빌드 설정은 `netlify.toml`에서 자동으로 읽습니다.
4. 배포가 끝나면 Domain management에서 `msgbom.kr`을 추가하고 primary domain으로 지정합니다.
5. `https://msgbom.kr/robots.txt`, `/sitemap.xml`, `/rss.xml`, `/areas/seoul`을 확인합니다.

현재 공개 앱은 DB나 비밀 API 키 없이 빌드됩니다. canonical, robots, sitemap의
운영 주소는 `src/lib/site-config.ts`에 `https://msgbom.kr`로 고정되어 있습니다.

## GA4 / Netlify 환경변수

이 사이트 전용 GA4 웹 데이터 스트림을 만든 뒤 Netlify의 **Site configuration →
Environment variables**에 `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`를 등록하고
다시 배포합니다. 이 공개 빌드 변수가 없거나 형식이 잘못되면 Google 태그를 전혀
로드하지 않습니다. 이벤트 정의, 개인정보 제한과 전화 클릭 지표의 한계는
[`docs/analytics.md`](docs/analytics.md)를 참고하세요.

`output: "export"`를 추가하지 마세요. 기존 번호 행정동 309개의 영구 308 이동과
Next 이미지 처리를 보존하기 위해 Netlify의 Next.js/OpenNext 배포를 사용합니다.
