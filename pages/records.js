/**
 * ========================================================
 * 📊 records.js - 실적현황 페이지 필터링 로직
 * ========================================================
 * 사용: records.html(기업별 실적), records_photo.html(현장 사진)
 *   페이지에 있는 요소만 렌더링한다 (#records-display / #featured-section)
 * 역할:
 *   - JSON 데이터 로드
 *   - 기업별 필터링
 *   - 동적 테이블 렌더링
 *   - 현장 사진 그리드 + 라이트박스
 * ======================================================== */

let companiesData = [];
let featuredData = [];

// 페이지 로드 시 JSON 데이터 불러오기
document.addEventListener('DOMContentLoaded', function() {
  loadRecordsData();
});

// JSON 데이터 로드
async function loadRecordsData() {
  try {
    const response = await fetch('./records-data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    companiesData = data.companies;
    featuredData = data.featured || [];

    // 대표 실적 (사진)
    initFeatured();
    
    // 드롭다운 옵션 업데이트
    updateDropdownOptions();
    
    // 초기 렌더링 (전체 기업)
    renderRecords('');
    
    // 필터 이벤트 리스너 추가
    const filterSelect = document.getElementById('company-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', function(e) {
        renderRecords(e.target.value);
      });
    }
  } catch (error) {
    console.error('Error loading records data:', error);
    const recordsDisplay = document.getElementById('records-display');
    if (recordsDisplay) {
      recordsDisplay.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">데이터를 불러올 수 없습니다.</p>';
    }
  }
}

// 드롭다운 옵션 동적으로 업데이트
function updateDropdownOptions() {
  const filterSelect = document.getElementById('company-filter');
  if (!filterSelect) return;
  
  // HTML에는 "전체 기업"만 두고, 기업 목록은 JSON 순서대로 번호를 붙여 추가
  companiesData.forEach((company, index) => {
    const option = document.createElement('option');
    option.value = company.id;
    option.textContent = `${index + 1}. ${company.name}`;
    filterSelect.appendChild(option);
  });
}

// 테이블 렌더링
function renderRecords(selectedId) {
  const recordsDisplay = document.getElementById('records-display');
  if (!recordsDisplay) return;
  
  recordsDisplay.innerHTML = '';
  
  let toRender = [];
  
  if (selectedId === '') {
    // 전체 기업
    toRender = companiesData;
  } else {
    // 선택한 기업만
    const company = companiesData.find(c => c.id === selectedId);
    if (company) {
      toRender = [company];
    }
  }
  
  toRender.forEach(company => {
    const section = document.createElement('div');
    section.className = 'company-section';
    
    // 로고는 records-data.json의 logo 필드(images/company_logo/ 파일명)가 있는 기업만 표시
    const logoHTML = company.logo
      ? `<span class="company-logo"><img src="../images/company_logo/${company.logo}" alt="${company.name} 로고"></span>`
      : '';

    let tableHTML = `
      <div class="company-header">
        ${logoHTML}
        <h4>${company.name}</h4>
      </div>
      <div class="company-table">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>기간</th>
              <th>공사내역</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    company.records.forEach(record => {
      tableHTML += `
        <tr>
          <td>${record.no}</td>
          <td>${record.period}</td>
          <td>${record.content}</td>
        </tr>
      `;
    });
    
    tableHTML += `
          </tbody>
        </table>
      </div>
    `;
    
    section.innerHTML = tableHTML;
    recordsDisplay.appendChild(section);
  });
}


/* ========================================================
 * 📷 대표 실적 (사진)
 * - 데이터: records-data.json의 featured
 *     { company: 기업 id, title: 공사명, period: 기간(선택), photos: [{ src, caption }] }
 *     src는 images/records/ 기준 경로
 * - 공사마다 제목 + 사진 카드 그리드
 * - 사진 클릭 시 라이트박스(공사 단위로 넘겨보기)
 * ======================================================== */
const PHOTO_BASE = '../images/records/';

function photoUrl(src) {
  return PHOTO_BASE + src.split('/').map(encodeURIComponent).join('/');
}

function companyOf(id) {
  return companiesData.find(c => c.id === id) || { name: '' };
}

function initFeatured() {
  const section = document.getElementById('featured-section');
  if (!section || featuredData.length === 0) return;
  section.hidden = false;

  buildLightbox();
  renderFeatured();
}

function projectMeta(project) {
  const company = companyOf(project.company);
  return `
    <span class="featured-company">${company.name}</span>
    <h4 class="featured-title">${project.title}</h4>
    ${project.period ? `<span class="featured-period">${project.period}</span>` : ''}
  `;
}

function renderFeatured() {
  const display = document.getElementById('featured-display');
  if (!display) return;
  display.className = 'featured-photo-groups';
  display.innerHTML = renderPhotoGroups();

  display.querySelectorAll('[data-open]').forEach(el => {
    el.addEventListener('click', function() {
      const [p, i] = this.dataset.open.split(':').map(Number);
      openLightbox(p, i);
    });
  });
}

// ----- 공사마다 제목 + 사진 카드 그리드 -----
function renderPhotoGroups() {
  return featuredData.map((project, p) => `
    <div class="photo-group">
      <div class="photo-group-header">
        ${projectMeta(project)}
        <span class="photo-group-count">사진 ${project.photos.length}장</span>
      </div>
      <div class="photo-grid">
        ${project.photos.map((photo, i) => `
          <figure class="photo-card" data-open="${p}:${i}">
            <img src="${photoUrl(photo.src)}" alt="${photo.caption}" loading="lazy">
            <figcaption>${photo.caption}</figcaption>
          </figure>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ----- 라이트박스 -----
let lightbox = null;
let lbProject = 0;
let lbIndex = 0;

function buildLightbox() {
  lightbox = document.createElement('div');
  lightbox.className = 'photo-lightbox';
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button type="button" class="lb-close" aria-label="닫기"><i class="fas fa-times"></i></button>
    <button type="button" class="lb-nav prev" aria-label="이전 사진"><i class="fas fa-chevron-left"></i></button>
    <figure class="lb-figure">
      <img alt="">
      <figcaption>
        <span class="lb-title"></span>
        <span class="lb-caption"></span>
        <span class="lb-count"></span>
      </figcaption>
    </figure>
    <button type="button" class="lb-nav next" aria-label="다음 사진"><i class="fas fa-chevron-right"></i></button>
  `;
  document.body.appendChild(lightbox);

  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lb-nav.prev').addEventListener('click', () => stepLightbox(-1));
  lightbox.querySelector('.lb-nav.next').addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
}

function openLightbox(p, i) {
  lbProject = p;
  lbIndex = i;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function stepLightbox(delta) {
  const n = featuredData[lbProject].photos.length;
  lbIndex = (lbIndex + delta + n) % n;
  updateLightbox();
}

function updateLightbox() {
  const project = featuredData[lbProject];
  const photo = project.photos[lbIndex];
  lightbox.querySelector('img').src = photoUrl(photo.src);
  lightbox.querySelector('img').alt = photo.caption;
  lightbox.querySelector('.lb-title').textContent = companyOf(project.company).name + ' · ' + project.title;
  lightbox.querySelector('.lb-caption').textContent = photo.caption;
  lightbox.querySelector('.lb-count').textContent = (lbIndex + 1) + ' / ' + project.photos.length;
  const multi = project.photos.length > 1;
  lightbox.querySelectorAll('.lb-nav').forEach(b => { b.style.display = multi ? '' : 'none'; });
}
