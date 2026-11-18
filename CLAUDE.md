# CLAUDE.md

(주)조이산업(울산, 공조·냉동 설비 업체) 회사 소개 웹사이트. 빌드 도구·패키지 매니저·프레임워크 없는 **순수 정적 사이트**(HTML + CSS + 바닐라 JS)이며 GitHub Pages로 배포된다.

## 배포 · 브랜치

- **`feature/home` 브랜치가 실질적인 메인/배포 브랜치**(GitHub Pages 소스). `main`/`dev`는 배포 기준이 아니다.
- 작업 흐름: `fix/<날짜>/<주제>` 같은 작업 브랜치 → PR → `feature/home` 병합 (예: PR #5 `fix/10.15/site-update`).
- 커스텀 도메인 `www.joysanup.co.kr` (`CNAME`). 도메인 **루트에서 서빙**되므로 `/pages/...` 절대경로 링크가 정상 동작한다.
- `CNAME`은 GitHub 웹에서 직접 커밋된 적이 있으니 push 전에 fetch/rebase가 필요할 수 있다.
- 이 WSL 환경에는 HTTPS 자격증명이 없어 **push는 사용자가 직접** 한다.
- 커밋 메시지 형식: `type : 한글 설명` (예: `fix : VAN -> VAV 오타 수정`, `feat : ...`, `refactor : ...`).

## 로컬 확인

빌드 단계 없음. 단, `records.html`은 `fetch('./records-data.json')`을 쓰므로 `file://`로 열면 데이터가 안 뜬다. 또 GNB 링크가 `/pages/...` 절대경로라 **저장소 루트를 서버 루트로** 띄워야 한다.

```bash
python3 -m http.server 8000   # 저장소 루트에서 실행 → http://localhost:8000/
```

`.vscode/launch.json`에는 페이지별 Chrome 실행 설정(`file` 방식)이 있다 — 정적 페이지 확인용이며 실적현황·내비게이션 링크 확인에는 위 서버 방식을 쓴다.

## 구조

```
index.html              → pages/home.html 로 meta refresh 리다이렉트
components/common.js    → 모든 페이지에 GNB·푸터·협력업체 섹션 주입 + 스크롤 애니메이션
components/common.css   → 전역 스타일(리셋, GNB, 푸터, page-hero, 협력업체, 공통 테이블, 반응형)
pages/<name>.html/.css  → 페이지별 HTML + 같은 이름의 CSS 1:1
pages/records.js        → 실적현황 렌더링 로직 (records.html·records_photo.html 공용)
pages/records-data.json → 실적현황 데이터
images/                 → 로고, 조직도, 대표 서명, certification/, company_logo/, product/,
                          records/(현장 사진: 기업 폴더/공사 폴더/한글 파일명)
```

| 페이지 | 메뉴 | 비고 |
|---|---|---|
| `home.html` | 홈 | hero, 육각형 가치 카드, 퀵링크, CTA, 협력업체 |
| `ceo_greeting.html` | 회사소개 > CEO 인사말 | 대표 서명 이미지 `images/ceo_signature.png` |
| `org_chart.html` | 회사소개 > 조직도 | **HTML/CSS 트리**(`.org-node` / `.org-children` / `.org-child` / `.org-items`). 수정은 텍스트만 고치면 되고, 블록을 추가·삭제해도 연결선은 자동으로 그려진다. 1440px 폭에 맞춰 둔 상태라 항목을 늘리면 넘칠 수 있다(넘치면 가로 스크롤). 예전 `images/org_chart.png`는 미사용이지만 보관 중 |
| `history.html` | 회사소개 > 연혁 | 연도별 `<dl class="history"><dt>연도</dt><dd><b>월.</b> 내용</dd></dl>` 수작업 HTML, 최신 연도가 위 |
| `certification.html` | 회사소개 > 인허가현황 | `.img-bg` 카드의 inline `background-image`로 `images/certification/*.jpg`(한글 파일명) 표시, 페이지 내 스크립트로 클릭 시 라이트박스 모달 |
| `project.html` | 사업영역 | 사업분야 카드, 경쟁력, 협력업체 공정 개선 사례(`.case-study-card`), 사업부별 장비 카드(`images/product/*`, 카드당 이미지 2장) |
| `records.html` | 실적현황 > 기업별 실적 | JSON `companies` 기반 기업 선택 + 표 (아래 참고) |
| `records_photo.html` | 실적현황 > 현장 사진 | JSON `featured` 기반 공사별 사진 카드 그리드 + 라이트박스 |
| `board.html` | 고객문의 | 게시판 아님. 전화/팩스/이메일 정보 카드뿐 |
| `contact.html` | 오시는 길 | 주소/연락처 + 카카오맵 퍼가기(roughmap) 스크립트 |

## 공통 컴포넌트 (`components/common.js`)

각 페이지는 `<body>` 끝에서 `<script src="../components/common.js">`를 로드하고, 이 스크립트가 런타임에 DOM을 주입한다. **GNB·푸터·협력업체 섹션은 HTML 파일에 직접 쓰지 말고 common.js만 수정**한다.

- `NAV` — GNB 템플릿 문자열. 드롭다운은 회사소개(4개)와 실적현황(기업별 실적 / 현장 사진) 두 곳이다. 메뉴 추가/변경은 여기서. 링크는 `/pages/xxx.html` 절대경로, 로고는 `../images/joy-log-color.png`(파비콘과 동일, 32×32). `joy-log.png`는 현재 미사용이지만 보관 중.
- `FOOTER` — 회사명·대표(박종남)·주소·전화/팩스.
- `PARTNER_LOGOS` — "주요 협력업체 및 거래처" 로고 파일 목록(`images/company_logo/`). **배열 순서 = 화면 표시 순서**. 페이지에 `<div id="partners"></div>`가 있으면 그 자리에 섹션이 삽입된다(현재 home, records).
- `setActiveMenu()` — `location.pathname.endsWith(href)`로 현재 메뉴에 `.active`, 드롭다운 항목이면 상위 "회사소개"도 활성화.
- 모바일: `toggleNavbar()`(`.navbar-collapse.open`), `toggleDropdown()`(`.nav-item.open`). 햄버거 메뉴 전환 브레이크포인트는 **1200px** (`common.css` 하단 "반응형 디자인").
- `initScrollAnimation()` — IntersectionObserver로 `.fade-up` 요소에 `.animate` 추가. `.fade-up`/`.animate` 스타일과 `@keyframes fadeUpAnimation`은 `common.css`에 있어 어느 페이지에서든 클래스만 붙이면 동작한다.

회사 연락처(주소·전화·팩스·이메일 `joy052@hanmail.net`)는 common.js 푸터, `board.html`, `contact.html` 세 곳에 중복돼 있으니 변경 시 모두 수정.

## 실적현황 데이터 (`pages/records-data.json`)

```json
{ "companies": [
  { "id": "nav_06", "name": "무림피앤피(주)", "logo": "relate_09.jpg",
    "records": [ { "no": 1, "period": "2026.07.31", "content": "..." } ] }
]}
```

- `companies` 배열 순서가 곧 화면 표시 순서이자 드롭다운 번호(`1. 무림피앤피(주)` …). `id`(`nav_XX`)는 옛 탭 ID 잔재라 순서와 무관하며 select의 value로만 쓰인다.
- `no`는 **JSON에 직접 저장된 값**이다(자동 번호 아님). 레코드를 추가/삭제/재정렬하면 해당 기업의 `no`를 1부터 다시 매겨야 한다.
- 레코드는 최신 기간이 위로 오도록 정렬. `period` 형식은 `YYYY.MM.DD`, `YYYY.MM`, `2021~2026` 등이 섞여 있다.
- `content`는 `innerHTML`로 그대로 들어간다(이스케이프 없음).
- `logo`(선택): `images/company_logo/` 파일명. 있으면 기업 헤더의 회사명 왼쪽에 흰 칩으로 표시되고, 없으면 이름만 표시된다. 현재 삼양제넥스·울산화력·기타는 로고가 없다. 협력업체 섹션(`PARTNER_LOGOS`)에 없는 `relate_19`(태광)와 `relate_23`(한화케미칼)도 실적현황용으로 쓰이므로 지우지 말 것.
- 현재 12개 기업: 무림피앤피, 삼양사 울산공장, 롯데이네오스화학, 한화임팩트, S-OIL, 한화케미칼, 삼양제넥스, 귀뚜라미범양냉방, 울산화력, 현대미포조선, 태광산업, 기타.
- 대량 수정 시 python으로 JSON을 읽고 쓰는 편이 안전하다(`ensure_ascii=False, indent=2` 유지).

### 현장 사진 (`featured`)

```json
"featured": [
  { "company": "nav_03", "title": "AHU-2101 (AA Analyzer house용 공조기) 교체",
    "photos": [ { "src": "롯데/공사명  AHU-2101 (…) 교체/AA analyzer HVAC 기계실 (기존 노후 장비 방폭 철거 전).jpg",
                  "caption": "기존 노후 장비 방폭 철거 전" } ] }
]
```

- `src`는 `images/records/` 기준 경로. 한글·공백·괄호 파일명이므로 JS에서 경로 조각마다 `encodeURIComponent` 처리한다(`photoUrl()`). 폴더명에 공백 2칸(`공사명  `)이 있으니 그대로 복사해서 쓸 것.
- `caption`은 파일명 괄호 안 문구 기준. 파일명 오타를 고치면 `src`·`caption`을 둘 다 고친다.
- `period`(선택)는 지원하지만, **확인된 공사 기간이 없어서 현재는 넣지 않는다**(사용자 지시). 실적 표와 임의로 연결하지 말 것.
- 사진은 웹용으로 긴 변 1600px 안팎을 유지한다. 폰 원본(4000px·2~3MB)은 줄여서 넣는다. 이 환경에는 Pillow가 없어 headless Chromium canvas로 줄였다(EXIF 회전 반영됨).
- 무림 냉동기·삼양 3-1호 사진은 원본 자체가 220px 저해상도다(사용자 확인, 그대로 유지).

## 페이지 작성 관례

- `<head>` 공통: Font Awesome 5.6.3 CDN(`fas fa-*` 아이콘), Google Fonts Noto Sans KR(home·board는 Noto Serif KR 추가), 파비콘 `../images/joy-log-color.png`, `../components/common.css` → 페이지 CSS 순.
- 서브페이지 상단 배너는 공통 `.page-hero` 패턴:
  ```html
  <div class="page-hero">
    <div class="page-hero-bg-text">Records</div>
    <div class="page-hero-content"><h1>실적현황</h1></div>
  </div>
  ```
- 레이아웃 래퍼 `.container`(max 1140px). 색상 변수는 `common.css`의 `:root` (`--color-point1 #2A9D5D`, `--color-cyan`, `--color-dark #0F4D33`).
- 반응형 브레이크포인트: 1200 / 1024 / 768 / 480px.
- 페이지 내부 링크(home의 버튼 등)는 상대경로(`records.html`), GNB는 절대경로 — 둘 다 정상.

## 알려진 잔재 · 주의점

- `certification.html`의 `data-manus_*` 속성, `ceo_greeting.html`의 `customFadeInUp`/`data-scroll`, `contact.html`의 주석 처리된 구글맵 등은 옛 템플릿 잔재.
