/**
 * ========================================================
 * 📊 records.js - 실적현황 페이지 필터링 로직
 * ========================================================
 * 역할:
 *   - JSON 데이터 로드
 *   - 기업별 필터링
 *   - 동적 테이블 렌더링
 * ======================================================== */

let companiesData = [];

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
  
  // 기존 옵션 유지 (전체 기업)
  const existingOptions = filterSelect.innerHTML;
  
  companiesData.forEach(company => {
    const option = document.createElement('option');
    option.value = company.id;
    option.textContent = company.name;
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
    
    let tableHTML = `
      <div class="company-header">
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
