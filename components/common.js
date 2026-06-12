/**
 * ========================================================
 * 📋 common.js - 모든 페이지에 공유 컴포넌트 주입
 * ========================================================
 * 기능:
 *   - Navbar(GNB) 상단 고정 바 삽입
 *   - LNB(좌측 네비게이션) 사이드바 삽입
 *   - Footer 페이지 하단 푸터 삽입
 *   - 페이지 콘텐츠 자동으로 .content-wrapper에 이동
 * 레이아웃: Flexbox 기반 좌측 LNB + 우측 GNB/본문
 * ======================================================== */

// ===== 드롭다운 메뉴 HTML (회사소개) =====
var NAV = `
<nav class="navbar" role="navigation">
  <div class="navbar-container">
    <a class="navbar-brand" href="/">
      <div class="brand-logo">JB</div>
      <span>조이산업</span>
    </a>
    <button class="navbar-toggler" type="button" onclick="toggleNavbar()" aria-label="Menu">
      <i class="fas fa-bars"></i>
    </button>
    <div class="navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="javascript:void(0);">
            회사소개
            <i class="fas fa-chevron-down caret"></i>
          </a>
          <div class="dropdown-menu">
            <a class="dropdown-item" href="/pages/ceo_greeting.html">CEO 인사말</a>
            <a class="dropdown-item" href="/pages/org_chart.html">조직도</a>
            <a class="dropdown-item" href="/pages/history.html">연혁</a>
            <a class="dropdown-item" href="/pages/certification.html">인허가현황</a>
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/project.html">사업영역</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/records.html">실적/성과</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/board.html">커뮤니티</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/contact.html">오시는 길</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;

// ===== 좌측 LNB 사이드바 HTML =====
var SIDEBAR = `
<div class="lnb-logo-area">
  <div class="brand-logo">JB</div>
  <div class="brand-text">조이산업</div>
</div>
<div class="lnb-menu-area">
  <ul class="sidebar-menu">
    <li class="menu-section">
      <div class="menu-title" onclick="toggleMenu(this)">
        <span>회사소개</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <ul class="menu-items">
        <li><a href="/pages/ceo_greeting.html">CEO 인사말</a></li>
        <li><a href="/pages/org_chart.html">조직도</a></li>
        <li><a href="/pages/history.html">연혁</a></li>
        <li><a href="/pages/certification.html">인허가현황</a></li>
      </ul>
    </li>
    <li class="menu-section">
      <div class="menu-title" onclick="toggleMenu(this)">
        <span>사업영역</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <ul class="menu-items">
        <li><a href="/pages/project.html">전체 프로젝트</a></li>
      </ul>
    </li>
    <li class="menu-section">
      <div class="menu-title" onclick="toggleMenu(this)">
        <span>커뮤니티</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <ul class="menu-items">
        <li><a href="/pages/records.html">실적/성과</a></li>
        <li><a href="/pages/board.html">고객문의</a></li>
      </ul>
    </li>
  </ul>
</div>
`;

// ===== Footer HTML =====
var FOOTER = `
<div class="agency-footer">
  <a href="javascript:void(0)" onclick="scrollToTop()" class="go-top">
    <i class="fas fa-arrow-up"></i>
    <span style="font-size:10px;">TOP</span>
  </a>
  <div class="container">
    <div class="footer-row">
      <div class="footer-col">
        <h4>회사명</h4>
        <p>조이산업</p>
        <p>대표: 이상협</p>
      </div>
      <div class="footer-col">
        <h4>주소</h4>
        <p>서울시 강남구 테헤란로 123</p>
        <p>우 06000</p>
      </div>
      <div class="footer-col">
        <h4>연락처</h4>
        <p>Tel: (02) 1234-5678</p>
        <p>Fax: (02) 1234-5679</p>
      </div>
      <div class="footer-col">
        <h4>개인정보처리방침</h4>
        <p><a href="javascript:void(0)" class="legal">개인정보 수집 및 이용</a></p>
        <p><a href="javascript:void(0)" class="legal">서비스 이용약관</a></p>
      </div>
    </div>
  </div>
</div>
`;

// ===== 메인 주입 함수 =====
function inject() {
  // 현재 페이지가 홈페이지인지 확인
  var isHomePage = 
    window.location.pathname.includes('home.html') ||
    window.location.pathname.includes('index.html') ||
    window.location.pathname === '/';

  // 1. site-container 생성 (Flexbox 레이아웃의 최상위 컨테이너)
  var siteContainer = document.createElement('div');
  siteContainer.className = 'site-container';

  // 2. 좌측 LNB 영역 (홈페이지에서는 숨김)
  var sideLnbZone = document.createElement('div');
  sideLnbZone.className = 'side-lnb-zone';
  if (!isHomePage) {
    sideLnbZone.innerHTML = SIDEBAR;
  } else {
    sideLnbZone.style.display = 'none';
    document.body.classList.add('home-page');
  }

  // 3. 우측 메인 바디 영역 (GNB + 콘텐츠)
  var mainBodyZone = document.createElement('div');
  mainBodyZone.className = 'main-body-zone';
  mainBodyZone.innerHTML = `
    <div id="navbar-placeholder"></div>
    <div class="content-wrapper"></div>
  `;

  // 4. 구조 조합
  siteContainer.appendChild(sideLnbZone);
  siteContainer.appendChild(mainBodyZone);
  
  // 5. body 첫 번째 자식으로 삽입
  document.body.insertBefore(siteContainer, document.body.firstChild);

  // 6. 기존 본문 콘텐츠를 .content-wrapper로 이동
  var contentWrapper = document.querySelector('.content-wrapper');
  var originalContent = document.body.children;
  
  // site-container 이후의 모든 노드를 content-wrapper로 이동
  while (document.body.children.length > 1) {
    var node = document.body.children[1];
    if (node !== siteContainer) {
      contentWrapper.appendChild(node);
    } else {
      break;
    }
  }

  // 7. Navbar 삽입
  var navbarPlaceholder = document.getElementById('navbar-placeholder');
  navbarPlaceholder.innerHTML = NAV;

  // 8. Footer 삽입
  contentWrapper.innerHTML = contentWrapper.innerHTML + FOOTER;

  // 9. 메뉴 액티브 상태 설정
  setActiveMenu();
}

// ===== 메뉴 토글 (좌측 LNB) =====
function toggleMenu(element) {
  var menuTitle = element;
  var menuItems = menuTitle.nextElementSibling;
  
  // 같은 레벨의 다른 메뉴 닫기
  var allSections = document.querySelectorAll('.menu-section');
  allSections.forEach(function(section) {
    var title = section.querySelector('.menu-title');
    var items = section.querySelector('.menu-items');
    if (title !== menuTitle) {
      title.classList.remove('active');
      items.classList.remove('expanded');
    }
  });

  // 현재 메뉴 토글
  menuTitle.classList.toggle('active');
  menuItems.classList.toggle('expanded');
}

// ===== 네비게이션 토글 (모바일) =====
function toggleNavbar() {
  var navbarCollapse = document.getElementById('navbarNav');
  navbarCollapse.classList.toggle('open');
}

// ===== 액티브 메뉴 설정 =====
function setActiveMenu() {
  var currentPath = window.location.pathname;
  var menuLinks = document.querySelectorAll('.menu-items a');
  
  menuLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (currentPath.includes(href.replace(/\//g, ''))) {
      link.classList.add('active');
      // 부모 메뉴 자동 열기
      var parentSection = link.closest('.menu-section');
      if (parentSection) {
        var menuTitle = parentSection.querySelector('.menu-title');
        var menuItems = parentSection.querySelector('.menu-items');
        menuTitle.classList.add('active');
        menuItems.classList.add('expanded');
      }
    }
  });

  // Navbar 액티브 링크 설정
  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href !== 'javascript:void(0);' && currentPath.includes(href.replace(/\//g, ''))) {
      link.classList.add('active');
    }
  });
}

// ===== 스크롤 투 탑 =====
function scrollToTop() {
  var contentWrapper = document.querySelector('.content-wrapper');
  if (contentWrapper) {
    contentWrapper.scrollTop = 0;
  } else {
    window.scrollTop = 0;
  }
}

// ===== 페이지 로드 시 실행 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inject);
} else {
  inject();
}
