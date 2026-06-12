/* ==============================================
   조이산업 - 공통 스크립트
   Navbar / Footer 삽입 + 인터랙션
   ============================================== */
(function () {
  'use strict';

  /* ── 네비 HTML ──────────────────────────────── */
    var NAV = [
    '<nav class="navbar" id="main-navbar">',
    '  <div class="navbar-container">',
    '    <a class="navbar-brand" href="home.html">',
    '      <div class="brand-logo">JOY</div>',
    '      조이산업',
    '    </a>',
    '    <button class="navbar-toggler" id="navToggler" aria-label="메뉴 열기">',
    '      <i class="fas fa-bars"></i>',
    '    </button>',
    '    <div class="navbar-collapse" id="navbar-collapse">',
    '      <ul class="navbar-nav">',
    '        <li class="nav-item" id="aboutDropdown">',
    '          <a class="nav-link dropdown-toggle" href="#" data-target="aboutDropdown">',
    '            회사소개 <span class="caret"><i class="fas fa-chevron-down" style="font-size:0.65rem;"></i></span>',
    '          </a>',
    '          <div class="dropdown-menu">',
    '            <a class="dropdown-item" href="ceo_greeting.html">대표자 인사말</a>',
    '            <a class="dropdown-item" href="history.html">회사연혁</a>',
    '            <a class="dropdown-item" href="org_chart.html">조직도</a>',
    '            <a class="dropdown-item" href="certification.html">인허가현황</a>',
    '          </div>',
    '        </li>',
    '        <li class="nav-item"><a class="nav-link" href="project.html">사업분야</a></li>',
    '        <li class="nav-item"><a class="nav-link" href="records.html">실적현황</a></li>',
    '        <li class="nav-item"><a class="nav-link" href="contact.html">오시는길</a></li>',
    '        <li class="nav-item"><a class="nav-link" href="board.html">고객문의</a></li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '</nav>'
  ].join('');

  /* ── 푸터 HTML ──────────────────────────────── */
  var FOOTER = [
    '<footer class="agency-footer">',
    '  <a href="#top" class="go-top" id="goTopBtn" title="맨 위로">',
    '    <i class="fas fa-chevron-up"></i>',
    '    <span style="font-size:9px;letter-spacing:1px;">TOP</span>',
    '  </a>',
    '  <div class="container">',
    '    <div class="footer-row">',
    '      <div class="footer-col">',
    '        <h4>Legal</h4>',
    '        <p><a class="legal" href="http://www.maegu.com" target="_blank" rel="noopener noreferrer">',
    '          &copy; JOY Industry Co., Ltd. 2018 All right reserved by MaeGu.com',
    '        </a></p>',
    '      </div>',
    '      <div class="footer-col">',
    '        <h4>Address</h4>',
    '        <p>울산광역시 울주군 청량읍 화창1길 42-18</p>',
    '      </div>',
    '      <div class="footer-col">',
    '        <h4>Contact</h4>',
    '        <p>Tel : 052-249-9199</p>',
    '        <p>Fax : 052-249-9250</p>',
    '        <p>joy052@hanmail.net</p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</footer>',
    '<a href="#" class="scrollup" id="scrollupBtn" title="맨 위로">',
    '  <i class="fas fa-chevron-up"></i>',
    '</a>'
  ].join('\n');

  /* ── 삽입 ───────────────────────────────────── */
  function inject() {
    var n = document.getElementById('navbar-placeholder');
    var f = document.getElementById('footer-placeholder');
    if (n) n.outerHTML = NAV;
    if (f) f.outerHTML = FOOTER;
  }

  /* ── 스크롤 투 탑 ───────────────────────────── */
  function initScroll() {
    window.addEventListener('scroll', function () {
      var btn = document.getElementById('scrollupBtn');
      if (btn) btn.style.display = window.scrollY > 100 ? 'block' : 'none';
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest('#scrollupBtn') || e.target.closest('#goTopBtn')) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ── 모바일 네비 ─────────────────────────────── */
  function initNav() {
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest('#navToggler')) {
        var c = document.getElementById('navbar-collapse');
        if (c) c.classList.toggle('open');
        return;
      }
      var dl = e.target.closest('.dropdown-toggle');
      if (dl && window.innerWidth <= 992) {
        e.preventDefault();
        var id = dl.getAttribute('data-target');
        var item = document.getElementById(id);
        if (item) item.classList.toggle('open');
      }
    });
  }

  /* ── 현재 페이지 메뉴 활성화 ─────────────────── */
  function setActive() {
    var page = window.location.pathname.split('/').pop() || 'home.html';
    page = page.split('?')[0] || 'home.html';
    document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item')
      .forEach(function (a) {
        var href = (a.getAttribute('href') || '').split('?')[0];
        if (href && href !== '#' && href === page) {
          a.classList.add('active');
          var li = a.closest('.nav-item');
          if (li) {
            var pl = li.querySelector(':scope > .nav-link');
            if (pl) pl.classList.add('active');
          }
        }
      });
  }

  function init() { inject(); initScroll(); initNav(); setActive(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
