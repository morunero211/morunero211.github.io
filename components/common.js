/**
 * ========================================================
 * 📋 common.js - 모든 페이지에 공유 컴포넌트 주입
 * ========================================================
 * 기능:
 *   - Navbar(GNB) 상단 고정 바 삽입
 *   - Footer 페이지 하단 푸터 삽입
 * 레이아웃: 표준 GNB + 본문 + Footer
 * ======================================================== */

// ===== 드롭다운 메뉴 HTML (회사소개) =====
var NAV = `
<nav class="navbar" role="navigation">
  <div class="navbar-container">
    <a class="navbar-brand" href="/">
      <div class="brand-logo"><img src="../images/joy-log.png" alt="조이산업 로고" /></div>
      <span>조이산업</span>
    </a>
    <button class="navbar-toggler" type="button" onclick="toggleNavbar()" aria-label="Menu">
      <i class="fas fa-bars"></i>
    </button>
    <div class="navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="javascript:void(0);" onclick="toggleDropdown(this)">
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
          <a class="nav-link" href="/pages/records.html">실적현황</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/board.html">고객문의</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/contact.html">오시는 길</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
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
        <p>조이산업 | 대표: 박종남</p>
      </div>
      <div class="footer-col">
        <h4>주소</h4>
        <p>울산광역시 울주군 청량읍 화창1길 42-18</p>
      </div>
      <div class="footer-col">
        <h4>연락처</h4>
        <p>Tel: 052-249-9199</p>
        <p>Fax: 052-249-9250</p>
      </div>
    </div>
  </div>
</div>
`;

// ===== 주요 협력업체 및 거래처 =====
// 로고 순서 = 화면 표시 순서. 추가/삭제는 이 목록만 수정
var PARTNER_LOGOS = [
  'relate_09.jpg', 'relate_13.jpg', 'relate_08.jpg', 'relate_22.jpg', 'relate_22_1.jpg',
  'relate_24.jpg', 'relate_30.jpg', 'relate_15.jpg', 'relate_10.jpg', 'relate_01.jpg',
  'relate_04.jpg', 'relate_26.jpg', 'relate_27.jpg'
];

var PARTNERS = `
<section class="partners-section">
  <div class="container">
    <div class="section-heading">
      <h2>주요 협력업체 및 거래처</h2>
      <p>국내 주요 대기업 및 공공기관과 함께하고 있습니다.</p>
    </div>
    <div class="partners-image-grid">
      ${PARTNER_LOGOS.map(function(file) {
        return '<div class="partner-logo"><img src="../images/company_logo/' + file + '" alt="협력업체"></div>';
      }).join('\n      ')}
    </div>
  </div>
</section>
`;

// ===== 메인 주입 함수 =====
function inject() {
  // 1. Navbar 삽입 (body 맨 앞)
  var navWrapper = document.createElement('div');
  navWrapper.innerHTML = NAV;
  document.body.insertBefore(navWrapper.children[0], document.body.firstChild);

  // 2. Footer 삽입 (body 맨 뒤)
  var footerWrapper = document.createElement('div');
  footerWrapper.innerHTML = FOOTER;
  document.body.appendChild(footerWrapper.children[0]);

  // 3. 협력업체 섹션 삽입 (<div id="partners"></div>가 있는 페이지만)
  var partnersSlot = document.getElementById('partners');
  if (partnersSlot) {
    partnersSlot.outerHTML = PARTNERS;
  }

  // 4. 메뉴 액티브 상태 설정
  setActiveMenu();
}

// ===== 네비게이션 토글 (모바일) =====
function toggleNavbar() {
  var navbarCollapse = document.getElementById('navbarNav');
  navbarCollapse.classList.toggle('open');
}

// ===== 드롭다운 토글 (모바일) =====
function toggleDropdown(element) {
  var dropdownMenu = element.nextElementSibling;
  if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
    var navItem = element.closest('.nav-item');
    navItem.classList.toggle('open');
  }
}

// ===== 액티브 메뉴 설정 =====
function setActiveMenu() {
  var currentPath = window.location.pathname;

  // Navbar / 드롭다운 액티브 링크 설정
  var links = document.querySelectorAll('.nav-link, .dropdown-item');
  links.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href.indexOf('javascript:') !== 0 && currentPath.endsWith(href)) {
      link.classList.add('active');

      // 드롭다운 항목이면 상위 메뉴도 활성화
      var navItem = link.closest('.nav-item');
      var parentLink = navItem && navItem.querySelector('.nav-link');
      if (link.classList.contains('dropdown-item') && parentLink) {
        parentLink.classList.add('active');
      }
    }
  });
}

// ===== 스크롤 투 탑 =====
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 페이지 로드 시 실행 =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inject);
} else {
  inject();
}

// ===== 스크롤 트리거 애니메이션 초기화 =====
function initScrollAnimation() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // fade-up 클래스를 가진 모든 요소에 옵저버 적용
  const fadeUpElements = document.querySelectorAll('.fade-up');
  fadeUpElements.forEach(function(element) {
    observer.observe(element);
  });
}

// DOMContentLoaded 후 애니메이션 초기화
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initScrollAnimation, 100);
});
