// ============================================================
// app.js — Meter Reading App
// ============================================================
// Replace these with your actual Supabase credentials
const SUPABASE_URL      = 'https://wzbteoqabsglctunhbkn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zUpN8fXy2jasPKmGt6Ur9A_QneEuvzC';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// CENTRAL CONFIG
// ============================================================
const THAI_MONTHS = [
  '','มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
];

const FORM_DEFS = {
  NPS_FORM: [
    {no:'1',   label:'ครั้งที่ Reset'},
    {no:'2.1', label:'ดีมานด์สะสมช่วง Peak (kW)'},
    {no:'2.2', label:'ดีมานด์สะสมช่วง Off-Peak (kW)'},
    {no:'6.1', label:'ดีมานด์ช่วง Peak (kW)'},
    {no:'6.1L',label:'ดีมานด์สูงสุดช่วง Peak (kW)'},
    {no:'',    label:'วันที่และเวลาสูงสุด (dd/tt:tt)'},
    {no:'6.2', label:'ดีมานด์ช่วง Off-Peak (kW)'},
    {no:'6.2L',label:'ดีมานด์สูงสุดช่วง Off-Peak (kW)'},
    {no:'',    label:'วันที่และเวลาสูงสุด (dd/tt:tt)'},
    {no:'8.1', label:'หน่วยพลังงานไฟฟ้า Peak (kWh)'},
    {no:'8.1L',label:'หน่วยพลังงานไฟฟ้า Peak (kWh)'},
    {no:'8.2', label:'หน่วยพลังงานไฟฟ้า Off-Peak (kWh)'},
    {no:'8.2L',label:'8.21 หน่วยพลังงานไฟฟ้า Off-Peak (kWh)'},
    {no:'20L', label:'หน่วยพลังงานไฟฟ้ารวม Export (kWh)'},
    {no:'21L', label:'หน่วยพลังงานไฟฟ้ารวม Import (kWh)'},
    {no:'7L',  label:'Max VAr'},
    {no:'',    label:'เวลาปัจจุบันของมิเตอร์'},
    {no:'',    label:'เวลาจริง'},
    {no:'',    label:'ผู้จดบันทึก'},
  ],
  INTER22_FORM: [
    {no:'1',   label:'ครั้งที่ Reset'},
    {no:'R1',  label:'ดีมานด์สะสม On peak (kW)'},
    {no:'R2',  label:'ดีมานด์สะสม Off peak (kW)'},
    {no:'6.1', label:'ดีมานด์สะสม On peak (kW)'},
    {no:'6.2', label:'ดีมานด์สะสม Off peak (kW)'},
    {no:'8.1', label:'หน่วยพลังงานไฟฟ้า On peak (kWh)'},
    {no:'8.2', label:'หน่วยพลังงานไฟฟ้า Off peak (kWh)'},
    {no:'6.1L',label:'ดีมานด์สูงสุด On peak (kW)'},
    {no:'',    label:'วันที่/เวลา'},
    {no:'6.2L',label:'ดีมานด์สูงสุด Off peak (kW)'},
    {no:'',    label:'วันที่/เวลา'},
    {no:'7L',  label:'ดีมานด์สูงสุด (kVar)'},
    {no:'',    label:'วันที่/เวลา'},
    {no:'8.1L',label:'หน่วยพลังงานไฟฟ้า On peak (kWh)'},
    {no:'8.2L',label:'หน่วยพลังงานไฟฟ้า Off peak (kWh)'},
    {no:'20',  label:'หน่วยพลังงานไฟฟ้ารวม Export (kWh)'},
    {no:'21',  label:'หน่วยพลังงานไฟฟ้ารวม Import (kWh)'},
    {no:'',    label:'เวลาปัจจุบันของมิเตอร์'},
    {no:'21L', label:'เวลาจริง'},
  ],
  INTER115_FORM: [
    {no:'',         label:'ครั้งที่ Reset'},
    {no:'',         label:'ดีมานด์สะสม On peak (MW)', isHeader:true},
    {no:'1.6.1',    label:'Export'},
    {no:'2.6.1',    label:'Import'},
    {no:'',         label:'ดีมานด์สะสม Off peak (MW)', isHeader:true},
    {no:'1.6.2',    label:'Export'},
    {no:'2.6.2',    label:'Import'},
    {no:'',         label:'หน่วยพลังงานไฟฟ้า On peak (MWh)', isHeader:true},
    {no:'1.8.1',    label:'Export'},
    {no:'2.8.1',    label:'Import'},
    {no:'',         label:'หน่วยพลังงานไฟฟ้า Off peak (MWh)', isHeader:true},
    {no:'1.8.2',    label:'Export'},
    {no:'2.8.2',    label:'Import'},
    {no:'',         label:'ดีมานด์สูงสุด On peak (MW)', isHeader:true},
    {no:'1.6.1..L', label:'Export'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'2.6.1..L', label:'Import'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'',         label:'ดีมานด์สูงสุด Off peak (MW)', isHeader:true},
    {no:'1.6.2..L', label:'Export'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'2.6.2..L', label:'Import'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'',         label:'ดีมานด์สูงสุด On peak (MVar)', isHeader:true},
    {no:'3.6.1..L', label:'Export'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'4.6.1..L', label:'Import'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'',         label:'ดีมานด์สูงสุด Off peak (MVar)', isHeader:true},
    {no:'3.6.2..L', label:'Export'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'4.6.2..L', label:'Import'},
    {no:'',         label:'วันที่และเวลา'},
    {no:'',         label:'หน่วยพลังงานไฟฟ้า On peak (MWh)', isHeader:true},
    {no:'1.8.1..L', label:'Export'},
    {no:'2.8.1..L', label:'Import'},
    {no:'',         label:'หน่วยพลังงานไฟฟ้า Off peak (MWh)', isHeader:true},
    {no:'1.8.2..L', label:'Export'},
    {no:'2.8.2..L', label:'Import'},
    {no:'',         label:'หน่วยพลังงานไฟฟ้า Total (MWh)', isHeader:true},
    {no:'1.8.0',    label:'Export'},
    {no:'2.8.0',    label:'Import'},
    {no:'',         label:'เวลาจริง'},
  ],
  SMP_FORM: 'SMP_SPECIAL'
};

const AREAS = [
  { id:'nps22',   name:'NPS sub (22KV)',   meters:['AC3.3','AC3.4','AC3.6','AC3.8','J101','J102','J103','J104','RCPPH1','GCRCPPH1'], formType:'NPS_FORM' },
  { id:'nps115',  name:'NPS sub (115KV)',  meters:['Bay7'], formType:'NPS_FORM' },
  { id:'inter22', name:'Inter sub (22KV)', meters:['AC4.01','AC4.03','AC4.04','AC4.05','AC5.01','AC5.02','AC5.04','AC5.05','AC5.06','AC5.10','AC5.14'], formType:'INTER22_FORM' },
  { id:'inter115',name:'Inter sub (115KV)',meters:['Bay1','Bay2','Bay3','Bay4','Bay5'], formType:'INTER115_FORM' },
  { id:'smp',     name:'SMP Substation',   meters:['มิเตอร์น้ำ (m3)','มิเตอร์ไฟฟ้า (kWh)'], formType:'SMP_FORM' },
];

const NAV_ITEMS = [
  { id:'meter-entry', icon:'📋', label:'บันทึกมิเตอร์', page:'meter-entry', areaId:null },
  { id:'summary',     icon:'📊', label:'ตารางสรุป',     page:'summary',     areaId:null },
  { id:'chart',       icon:'📈', label:'กราฟการใช้งาน', page:'chart',       areaId:null },
  ...AREAS.map(a=>({ id:'area-'+a.id, icon:'🔌', label:a.name, page:'meter-entry', areaId:a.id }))
];

// ============================================================
// STATE
// ============================================================
const S = {
  loggedIn:    false,
  currentPage: 'meter-entry',
  currentArea: AREAS[0].id,
  currentMeter:null,
  entryYear:   null,
  entryMonth:  null,
  editMode:    {},          // {meterName: bool}
  formData:    {},          // {meterName: {values, photo_urls}}
  customMeters:{},          // {areaId: [name,...]}
  chartInstance: null,
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const sess = localStorage.getItem('meterapp_user');
  if (sess) { S.loggedIn = true; initApp(); showApp(); }
  else { showAuth(); }

  document.getElementById('btn-login').addEventListener('click', doLogin);
  document.getElementById('inp-pass').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
  document.getElementById('btn-logout').addEventListener('click', doLogout);
  document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
});

function showAuth() {
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('app').style.display='none';
}
function showApp() {
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('app').style.display='flex';
  document.getElementById('topbar-user').textContent = localStorage.getItem('meterapp_user')||'';
}

function doLogin() {
  const u = document.getElementById('inp-user').value.trim();
 const p = document.getElementById('inp-pass').value.trim();
  if (u==='NPSUser' && p==='NPSUser') {
    localStorage.setItem('meterapp_user', u);
    S.loggedIn = true;
    initApp(); showApp();
  } else {
    document.getElementById('auth-err').textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  }
}
function doLogout() {
  localStorage.removeItem('meterapp_user');
  S.loggedIn = false; location.reload();
}
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const btn = document.getElementById('toggle-sidebar');
  sb.classList.toggle('collapsed');
  const collapsed = sb.classList.contains('collapsed');
  btn.classList.toggle('open', !collapsed);
  btn.textContent = collapsed ? '>>' : '<';
}

// ============================================================
// INIT APP
// ============================================================
async function initApp() {
  buildSidebar();
  await loadCustomMeters();
  initSelects();
  await loadDefaultDate();
  navigateTo('meter-entry', AREAS[0].id);
}

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  const sections = [
    { label:'จัดการข้อมูล', items: NAV_ITEMS.filter(n=>!n.areaId) },
    { label:'พื้นที่', items: NAV_ITEMS.filter(n=>n.areaId) },
  ];
  sections.forEach(sec=>{
    const h = document.createElement('div');
    h.className = 'nav-section'; h.textContent = sec.label;
    nav.appendChild(h);
    sec.items.forEach(item=>{
      const el = document.createElement('div');
      el.className = 'nav-item';
      el.id = 'nav-'+item.id;
      el.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}`;
      el.addEventListener('click', ()=> navigateTo(item.page, item.areaId));
      nav.appendChild(el);
    });
  });
}

async function loadCustomMeters() {
  const { data } = await db.from('custom_meters').select('*');
  S.customMeters = {};
  (data||[]).forEach(r=>{
    if (!S.customMeters[r.area]) S.customMeters[r.area]=[];
    S.customMeters[r.area].push(r.meter_name);
  });
}

function initSelects() {
  // Entry year/month
  const yNow = new Date().getFullYear()+543;
  const eYear = document.getElementById('entry-year');
  const eMonth = document.getElementById('entry-month');
  for(let y=yNow-3;y<=yNow+1;y++){
    const o=document.createElement('option'); o.value=y; o.textContent=y; eYear.appendChild(o);
  }
  eYear.value = yNow;
  for(let m=1;m<=12;m++){
    const o=document.createElement('option'); o.value=m; o.textContent=THAI_MONTHS[m]; eMonth.appendChild(o);
  }
  eMonth.value = new Date().getMonth()+1;
  eYear.addEventListener('change', ()=>{ S.entryYear=+eYear.value; S.entryMonth=+eMonth.value; loadMeterForm(); });
  eMonth.addEventListener('change',()=>{ S.entryYear=+eYear.value; S.entryMonth=+eMonth.value; loadMeterForm(); });

  // Summary
  const sYear=document.getElementById('sum-year');
  const sMonth=document.getElementById('sum-month');
  const sArea=document.getElementById('sum-area');
  for(let y=yNow-3;y<=yNow+1;y++){ const o=document.createElement('option');o.value=y;o.textContent=y;sYear.appendChild(o); }
  sYear.value=yNow;
  for(let m=1;m<=12;m++){ const o=document.createElement('option');o.value=m;o.textContent=THAI_MONTHS[m];sMonth.appendChild(o); }
  sMonth.value=new Date().getMonth()+1;
  const oAll=document.createElement('option');oAll.value='';oAll.textContent='ทุกพื้นที่';sArea.appendChild(oAll);
  AREAS.forEach(a=>{ const o=document.createElement('option');o.value=a.id;o.textContent=a.name;sArea.appendChild(o); });
  [sYear,sMonth,sArea].forEach(el=>el.addEventListener('change',loadSummary));

  // Chart
  const cYear=document.getElementById('chart-year');
  const cMonth=document.getElementById('chart-month');
  const cArea=document.getElementById('chart-area');
  const cMeter=document.getElementById('chart-meter');
  for(let y=yNow-3;y<=yNow+1;y++){ const o=document.createElement('option');o.value=y;o.textContent=y;cYear.appendChild(o); }
  cYear.value=yNow;
  const oAllM=document.createElement('option');oAllM.value='';oAllM.textContent='ทุกเดือน';cMonth.appendChild(oAllM);
  for(let m=1;m<=12;m++){ const o=document.createElement('option');o.value=m;o.textContent=THAI_MONTHS[m];cMonth.appendChild(o); }
  cMonth.value='';
  AREAS.forEach(a=>{ const o=document.createElement('option');o.value=a.id;o.textContent=a.name;cArea.appendChild(o); });
  cArea.value=AREAS[0].id;
  [cYear,cMonth,cArea].forEach(el=>el.addEventListener('change',()=>{ updateChartMeterFilter(); loadChart(); }));
  cMeter.addEventListener('change', loadChart);
}

async function loadDefaultDate() {
  const { data } = await db.from('meter_records').select('year_be,month').order('year_be',{ascending:false}).order('month',{ascending:false}).limit(1);
  if (data && data.length) {
    S.entryYear  = data[0].year_be;
    S.entryMonth = data[0].month;
  } else {
    const now = new Date();
    S.entryYear  = now.getFullYear()+543;
    S.entryMonth = now.getMonth()+1;
  }
  document.getElementById('entry-year').value  = S.entryYear;
  document.getElementById('entry-month').value = S.entryMonth;
  document.getElementById('sum-year').value    = S.entryYear;
  document.getElementById('sum-month').value   = S.entryMonth;
  document.getElementById('chart-year').value  = S.entryYear;
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page, areaId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));

  S.currentPage = page;

  if (page === 'meter-entry') {
    if (areaId) S.currentArea = areaId;
    document.getElementById('page-meter-entry').classList.add('active');
    const navId = areaId ? 'nav-area-'+areaId : 'nav-meter-entry';
    document.getElementById(navId)?.classList.add('active');
    loadMeterForm();
  } else if (page === 'summary') {
    document.getElementById('page-summary').classList.add('active');
    document.getElementById('nav-summary')?.classList.add('active');
    loadSummary();
  } else if (page === 'chart') {
    document.getElementById('page-chart').classList.add('active');
    document.getElementById('nav-chart')?.classList.add('active');
    updateChartMeterFilter();
    loadChart();
  }
}

// ============================================================
// METER ENTRY
// ============================================================
async function loadMeterForm() {
  const area = AREAS.find(a=>a.id===S.currentArea);
  if (!area) return;
  document.getElementById('entry-area-label').textContent = area.name;
  S.entryYear  = +document.getElementById('entry-year').value;
  S.entryMonth = +document.getElementById('entry-month').value;

  const allMeters = [...area.meters, ...(S.customMeters[area.id]||[])];
  if (!S.currentMeter || !allMeters.includes(S.currentMeter)) S.currentMeter = allMeters[0];

  renderMeterTabs(allMeters, area);

  if (area.formType === 'SMP_FORM') {
    await renderSMPForm(area);
  } else {
    await renderStandardForm(area, S.currentMeter);
  }
}

function renderMeterTabs(meters, area) {
  const container = document.getElementById('meter-tabs');
  if (area.formType === 'SMP_FORM') { container.innerHTML=''; return; }
  let html = '';
  meters.forEach(m=>{
    html += `<button class="meter-tab${m===S.currentMeter?' active':''}" data-meter="${m}">${m}</button>`;
  });
  html += `<button class="btn-add-meter" id="btn-add-meter">+ เพิ่มมิเตอร์</button>`;
  container.innerHTML = html;
  container.querySelectorAll('.meter-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      S.currentMeter = btn.dataset.meter;
      S.editMode[S.currentMeter] = false;
      loadMeterForm();
    });
  });
  document.getElementById('btn-add-meter').addEventListener('click', addCustomMeter);
}

async function addCustomMeter() {
  const name = prompt('ชื่อมิเตอร์ใหม่:');
  if (!name || !name.trim()) return;
  const n = name.trim();
  const area = AREAS.find(a=>a.id===S.currentArea);
  const { error } = await db.from('custom_meters').upsert({area:area.id, meter_name:n},{onConflict:'area,meter_name'});
  if (error) { toast('เกิดข้อผิดพลาด: '+error.message,'error'); return; }
  if (!S.customMeters[area.id]) S.customMeters[area.id]=[];
  if (!S.customMeters[area.id].includes(n)) S.customMeters[area.id].push(n);
  S.currentMeter = n;
  loadMeterForm();
  toast('เพิ่มมิเตอร์ '+n+' แล้ว','success');
}

async function renderStandardForm(area, meterName) {
  const rows = FORM_DEFS[area.formType];
  const fa = document.getElementById('meter-form-area');
  fa.innerHTML = '<div class="loading">กำลังโหลด...</div>';

  const { data } = await db.from('meter_records')
    .select('*').eq('area',area.id).eq('meter_name',meterName)
    .eq('year_be',S.entryYear).eq('month',S.entryMonth).maybeSingle();

  const vals = (data && data.values) || {};
  const editing = S.editMode[meterName] || false;
  const keyCounter = {};

  let tableRows = '';
  rows.forEach((row,i)=>{
    const key = row.no || ('__'+row.label.replace(/\s+/g,'_')+i);
    // Count duplicate keys for display-only rows
    let fieldKey = row.no;
    if (!row.no) {
      keyCounter[row.label] = (keyCounter[row.label]||0)+1;
      fieldKey = '__'+row.label.replace(/\s+/g,'_')+'_'+keyCounter[row.label];
    }
    if (row.isHeader) {
      tableRows += `<tr class="header-row"><td>${row.no||''}</td><td colspan="2">${row.label}</td></tr>`;
    } else {
      const val = vals[fieldKey]||'';
      const dis = editing?'':'disabled';
      tableRows += `<tr>
        <td>${row.no||''}</td>
        <td>${row.label}</td>
        <td><input type="text" value="${escHtml(val)}" data-key="${escHtml(fieldKey)}" ${dis}></td>
      </tr>`;
    }
  });

  fa.innerHTML = `
    <div class="form-card">
      <div class="form-card-header">
        <div class="form-card-title">${meterName} — ${THAI_MONTHS[S.entryMonth]} ${S.entryYear}</div>
        <button class="btn-edit${editing?' editing':''}" id="btn-edit-form">${editing?'กำลังแก้ไข...':'แก้ไข'}</button>
      </div>
      <table class="form-table">
        <tbody id="form-tbody">${tableRows}</tbody>
      </table>
      <div class="form-footer">
        <button class="btn-save" id="btn-save-form">💾 บันทึก</button>
      </div>
    </div>`;

  document.getElementById('btn-edit-form').addEventListener('click',()=>{
    S.editMode[meterName] = !S.editMode[meterName];
    renderStandardForm(area, meterName);
  });
  document.getElementById('btn-save-form').addEventListener('click',()=> saveStandardForm(area, meterName));
}

async function saveStandardForm(area, meterName) {
  const vals = {};
  document.querySelectorAll('#form-tbody input[type=text]').forEach(inp=>{
    vals[inp.dataset.key] = inp.value;
  });
  const { error } = await db.from('meter_records').upsert({
    area: area.id, meter_name: meterName,
    year_be: S.entryYear, month: S.entryMonth,
    values: vals,
    updated_by: localStorage.getItem('meterapp_user'),
    updated_at: new Date().toISOString()
  },{onConflict:'area,meter_name,year_be,month'});
  if (error) { toast('บันทึกล้มเหลว: '+error.message,'error'); return; }
  S.editMode[meterName] = false;
  toast('บันทึกสำเร็จ','success');
  renderStandardForm(area, meterName);
}

// ============================================================
// SMP FORM
// ============================================================
async function renderSMPForm(area) {
  const fa = document.getElementById('meter-form-area');
  fa.innerHTML = '<div class="loading">กำลังโหลด...</div>';

  // Get available months for this area
  const { data: allRec } = await db.from('meter_records').select('year_be,month,values,photo_urls,updated_by,updated_at')
    .eq('area',area.id).order('year_be').order('month');

  // Build month list (include current if not exists)
  const months = [];
  (allRec||[]).forEach(r=>{ months.push({y:r.year_be,m:r.month,data:r}); });
  const curKey = `${S.entryYear}-${S.entryMonth}`;
  if (!months.find(x=>x.y===S.entryYear&&x.m===S.entryMonth)) {
    months.push({y:S.entryYear,m:S.entryMonth,data:null});
  }
  months.sort((a,b)=>a.y!==b.y?a.y-b.y:a.m-b.m);

  // Controls
  let optHtml = months.map(x=>`<option value="${x.y}-${x.m}" ${x.y===S.entryYear&&x.m===S.entryMonth?'selected':''}>${THAI_MONTHS[x.m]} ${x.y}</option>`).join('');
  let controlHtml = `<div class="smp-controls">
    <label>เดือนที่บันทึก</label>
    <select id="smp-month-sel">${optHtml}</select>
    <button class="btn-secondary" id="btn-smp-add">+ เพิ่มเดือน</button>
  </div>`;

  // Find selected record
  const selMo = months.find(x=>x.y===S.entryYear&&x.m===S.entryMonth);
  const rec = selMo?.data;
  const vals = (rec && rec.values)||{};
  const photoUrls = (rec && rec.photo_urls)||{};
  const editing = S.editMode['__smp'] || false;

  const cards = [
    {id:'water', title:'มิเตอร์น้ำ', subtitle:THAI_MONTHS[S.entryMonth]+' '+S.entryYear, label:'ค่ามิเตอร์น้ำ (ลบ.ม.)', color:'#4f8ef7'},
    {id:'electric', title:'มิเตอร์ไฟฟ้า', subtitle:THAI_MONTHS[S.entryMonth]+' '+S.entryYear, label:'ค่ามิเตอร์ไฟฟ้า (kWh)', color:'#f59e0b'},
  ];

  let cardsHtml = `<div class="smp-grid">`;
  cards.forEach(c=>{
    const v = vals[c.id]||'';
    const pu = photoUrls[c.id]||'';
    const dis = editing?'':'disabled';
    cardsHtml += `<div class="smp-card">
      <div class="smp-card-title" style="color:${c.color}">🔵 ${c.title}</div>
      <div class="smp-card-sub">${c.subtitle}</div>
      <label>${c.label}</label>
      <input type="text" id="smp-val-${c.id}" value="${escHtml(v)}" ${dis} placeholder="กรอกค่ามิเตอร์">
      <label>รูปถ่าย</label>
      <div class="upload-zone" id="upload-zone-${c.id}">
        ${pu?`<img src="${pu}" id="smp-img-${c.id}">`:'<span id="smp-img-'+c.id+'">คลิกเพื่ออัปโหลดรูป</span>'}
        <input type="file" id="smp-file-${c.id}" accept="image/*" ${editing?'':'style="pointer-events:none"'}>
      </div>
    </div>`;
  });
  cardsHtml += '</div>';

  const editBtnClass = editing ? 'btn-edit editing' : 'btn-edit';
  const editBtnTxt   = editing ? 'กำลังแก้ไข...' : 'แก้ไข';

  fa.innerHTML = controlHtml + `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <span style="color:var(--text2);font-size:14px;">SMP Substation — ${THAI_MONTHS[S.entryMonth]} ${S.entryYear}</span>
      <button class="${editBtnClass}" id="btn-smp-edit">${editBtnTxt}</button>
    </div>
    ${cardsHtml}
    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
      <button class="btn-danger" id="btn-smp-del">🗑 ลบเดือน "${THAI_MONTHS[S.entryMonth]} ${S.entryYear}"</button>
      <button class="btn-save" id="btn-smp-save">💾 บันทึกข้อมูล</button>
    </div>`;

  // Events
  document.getElementById('smp-month-sel').addEventListener('change', e=>{
    const [y,m] = e.target.value.split('-').map(Number);
    S.entryYear=y; S.entryMonth=m;
    document.getElementById('entry-year').value=y;
    document.getElementById('entry-month').value=m;
    renderSMPForm(area);
  });
  document.getElementById('btn-smp-add').addEventListener('click',()=>{
    // Add next month
    let y=S.entryYear,m=S.entryMonth+1;
    if(m>12){m=1;y++;}
    S.entryYear=y;S.entryMonth=m;
    document.getElementById('entry-year').value=y;
    document.getElementById('entry-month').value=m;
    renderSMPForm(area);
  });
  document.getElementById('btn-smp-edit').addEventListener('click',()=>{
    S.editMode['__smp'] = !S.editMode['__smp'];
    renderSMPForm(area);
  });
  document.getElementById('btn-smp-del').addEventListener('click',()=> deleteSMPMonth(area));
  document.getElementById('btn-smp-save').addEventListener('click',()=> saveSMPForm(area));

  // File input preview
  ['water','electric'].forEach(id=>{
    document.getElementById('smp-file-'+id)?.addEventListener('change', e=>{
      const file = e.target.files[0]; if(!file) return;
      const reader = new FileReader();
      reader.onload = ev=>{
        const zone = document.getElementById('upload-zone-'+id);
        const prev = document.getElementById('smp-img-'+id);
        if(prev) prev.remove();
        const img = document.createElement('img');
        img.src=ev.target.result; img.id='smp-img-'+id;
        zone.insertBefore(img, zone.querySelector('input'));
      };
      reader.readAsDataURL(file);
    });
  });
}

async function saveSMPForm(area) {
  const vals = {
    water: document.getElementById('smp-val-water')?.value||'',
    electric: document.getElementById('smp-val-electric')?.value||''
  };
  const photoUrls = {};

  // Upload photos
  for (const id of ['water','electric']) {
    const fileInp = document.getElementById('smp-file-'+id);
    if (fileInp && fileInp.files[0]) {
      const file = fileInp.files[0];
      const path = `${area.id}/${S.entryYear}-${S.entryMonth}-${id}-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await db.storage.from('meter-photos').upload(path, file, {upsert:true});
      if (!error) {
        const { data: urlData } = db.storage.from('meter-photos').getPublicUrl(path);
        photoUrls[id] = urlData.publicUrl;
      }
    }
  }

  const { error } = await db.from('meter_records').upsert({
    area: area.id,
    meter_name: 'SMP',
    year_be: S.entryYear,
    month: S.entryMonth,
    values: vals,
    photo_urls: Object.keys(photoUrls).length ? photoUrls : undefined,
    updated_by: localStorage.getItem('meterapp_user'),
    updated_at: new Date().toISOString()
  },{onConflict:'area,meter_name,year_be,month'});

  if (error) { toast('บันทึกล้มเหลว: '+error.message,'error'); return; }
  S.editMode['__smp'] = false;
  toast('บันทึกสำเร็จ','success');
  renderSMPForm(area);
}

async function deleteSMPMonth(area) {
  if (!confirm(`ลบข้อมูลเดือน ${THAI_MONTHS[S.entryMonth]} ${S.entryYear}?`)) return;
  await db.from('meter_records').delete()
    .eq('area',area.id).eq('meter_name','SMP')
    .eq('year_be',S.entryYear).eq('month',S.entryMonth);
  toast('ลบแล้ว','success');
  renderSMPForm(area);
}

// ============================================================
// SUMMARY TABLE
// ============================================================
async function loadSummary() {

  const y = +document.getElementById('sum-year').value;
  const m = +document.getElementById('sum-month').value;
  const a = document.getElementById('sum-area').value;

  const container = document.getElementById('summary-content');
  container.innerHTML = '<div class="loading">กำลังโหลด...</div>';

  let q = db
    .from('meter_records')
    .select('*')
    .eq('year_be', y)
    .eq('month', m);

  if (a) q = q.eq('area', a);

  const { data } = await q.order('area').order('meter_name');

  if (!data || !data.length) {
    container.innerHTML = '<div class="loading">ไม่พบข้อมูล</div>';
    return;
  }

  const byArea = {};

  data.forEach(r => {
    if (!byArea[r.area]) byArea[r.area] = [];
    byArea[r.area].push(r);
  });

  let html = '';

  Object.entries(byArea).forEach(([areaId, recs]) => {

    const areaObj = AREAS.find(a => a.id === areaId);

    if (!areaObj) return;

    const formRows = FORM_DEFS[areaObj.formType];

    html += `
      <h3 style="margin:20px 0 10px;color:#4f8ef7">
        ${areaObj.name}
      </h3>

      <div class="table-wrap">
      <table class="summary">
      <thead>
      <tr>
        <th>No.</th>
        <th>รายการ</th>
    `;

    recs.forEach(r => {
      html += `
        <th>
          ${r.meter_name}<br>
          <small>${THAI_MONTHS[m]} ${y}</small>
        </th>
      `;
    });

    html += `
      </tr>
      </thead>
      <tbody>
    `;

    const duplicateCounter = {};

    formRows.forEach((row, index) => {

      let key;

      if (row.no) {

        key = row.no;

      } else {

        duplicateCounter[row.label] =
          (duplicateCounter[row.label] || 0) + 1;

        key =
          '__' +
          row.label.replace(/\s+/g, '_') +
          '_' +
          duplicateCounter[row.label];
      }

      html += `
        <tr>
          <td>${row.no || ''}</td>
          <td>${row.label}</td>
      `;

      recs.forEach(r => {

        const value = r.values?.[key] || '';

        html += `<td>${value}</td>`;

      });

      html += `</tr>`;
    });

    html += `
      </tbody>
      </table>
      </div>
    `;
  });

  container.innerHTML = html;
}
// ============================================================
// USAGE CHART
// ============================================================
function updateChartMeterFilter() {
  const areaId = document.getElementById('chart-area').value;
  const area   = AREAS.find(a=>a.id===areaId);
  const mSel   = document.getElementById('chart-meter');
  const mLabel = document.getElementById('chart-meter-label');

  if (!area || area.formType==='SMP_FORM') {
    mLabel.style.display='none'; mSel.style.display='none'; return;
  }
  mLabel.style.display=''; mSel.style.display='';
  const allMeters = [...area.meters, ...(S.customMeters[areaId]||[])];
  mSel.innerHTML = '<option value="">ทุกมิเตอร์</option>' +
    allMeters.map(m=>`<option value="${m}">${m}</option>`).join('');
}

async function loadChart() {
  const y      = +document.getElementById('chart-year').value;
  const mVal   = document.getElementById('chart-month').value;
  const areaId = document.getElementById('chart-area').value;
  const meterF = document.getElementById('chart-meter').value;
  const area   = AREAS.find(a=>a.id===areaId);
  if (!area) return;

  // Fetch data for year (need prev month too)
  const { data } = await db.from('meter_records').select('*')
    .eq('area', areaId).eq('year_be', y).order('month');
  const recs = data||[];

  // Also fetch prev year Dec for January calculation
  const { data: prevData } = await db.from('meter_records').select('*')
    .eq('area', areaId).eq('year_be', y-1).eq('month', 12);
  const allRecs = [...(prevData||[]), ...recs];

  if (S.chartInstance) { S.chartInstance.destroy(); S.chartInstance=null; }

  const ctx = document.getElementById('main-chart').getContext('2d');
  const months = mVal ? [+mVal] : [1,2,3,4,5,6,7,8,9,10,11,12];
  const labels = months.map(m=>THAI_MONTHS[m]);

  if (area.formType==='SMP_FORM') {
    drawSMPChart(ctx, allRecs, months, labels, y);
  } else if (area.formType==='INTER115_FORM') {
    drawInter115Chart(ctx, allRecs, months, labels, y, meterF, area);
  } else {
    drawNPSOrInter22Chart(ctx, allRecs, months, labels, y, meterF, area);
  }
}

function getRecordValue(recs,meterName,year,month,key) {
  const r = recs.find(x=>x.meter_name===meterName&&x.year_be===year&&x.month===month);
  return r ? parseFloat(r.values?.[key]||0)||0 : null;
}

function drawNPSOrInter22Chart(ctx, allRecs, months, labels, y, meterF, area) {
  const allMeters = meterF ? [meterF] : [...area.meters,...(S.customMeters[area.id]||[])];
  const colors = ['#4f8ef7','#34d399','#f59e0b','#ef4444','#a78bfa','#fb923c','#38bdf8','#4ade80','#f472b6','#facc15','#60a5fa','#fb7185'];

  const datasets = allMeters.map((meter,i)=>{
    const data = months.map(m=>{
      const pm = m===1?12:m-1; const py = m===1?y-1:y;
      const cur8_1L = getRecordValue(allRecs,meter,y,m,'8.1L');
      const pre8_1L = getRecordValue(allRecs,meter,py,pm,'8.1L');
      const cur8_2L = getRecordValue(allRecs,meter,y,m,'8.2L');
      const pre8_2L = getRecordValue(allRecs,meter,py,pm,'8.2L');
      if (cur8_1L===null||pre8_1L===null) return null;
      return (cur8_1L-pre8_1L)+(cur8_2L||0)-(pre8_2L||0);
    });
    return {
  label:meter,
  data,
  backgroundColor:colors[i%colors.length],
  borderWidth:1
};
  });

  S.chartInstance = new Chart(ctx,{
    type:'bar',
    data:{ labels, datasets },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'#8892b0'}}}, scales:{x:{ticks:{color:'#8892b0'},grid:{color:'#2e3350'}},y:{ticks:{color:'#8892b0'},grid:{color:'#2e3350'}}} }
  });
}

function drawInter115Chart(ctx, allRecs, months, labels, y, meterF, area) {
  const allMeters = meterF ? [meterF] : [...area.meters,...(S.customMeters[area.id]||[])];
  const exportColors = ['#4f8ef7','#38bdf8','#60a5fa','#93c5fd','#bfdbfe'];
  const importColors = ['#34d399','#4ade80','#86efac','#a7f3d0','#d1fae5'];

  const datasets = [];
  allMeters.forEach((meter,i)=>{
    const expData = months.map(m=>{
      const pm=m===1?12:m-1;const py=m===1?y-1:y;
      const c1=getRecordValue(allRecs,meter,y,m,'1.8.1..L');const p1=getRecordValue(allRecs,meter,py,pm,'1.8.1..L');
      const c2=getRecordValue(allRecs,meter,y,m,'1.8.2..L');const p2=getRecordValue(allRecs,meter,py,pm,'1.8.2..L');
      if(c1===null||p1===null) return null;
      return (c1-p1)+(c2||0)-(p2||0);
    });
    const impData = months.map(m=>{
      const pm=m===1?12:m-1;const py=m===1?y-1:y;
      const c1=getRecordValue(allRecs,meter,y,m,'2.8.1..L');const p1=getRecordValue(allRecs,meter,py,pm,'2.8.1..L');
      const c2=getRecordValue(allRecs,meter,y,m,'2.8.2..L');const p2=getRecordValue(allRecs,meter,py,pm,'2.8.2..L');
      if(c1===null||p1===null) return null;
      return (c1-p1)+(c2||0)-(p2||0);
    });
    datasets.push({
  label:`${meter} Export`,
  data:expData,
  backgroundColor:exportColors[i%5]
});
    datasets.push({
  label:`${meter} Import`,
  data:impData,
  backgroundColor:importColors[i%5]
});
  });

  S.chartInstance = new Chart(ctx,{
    type:'bar',
    data:{ labels, datasets },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{labels:{color:'#8892b0'}}}, scales:{x:{ticks:{color:'#8892b0'},grid:{color:'#2e3350'}},y:{ticks:{color:'#8892b0'},grid:{color:'#2e3350'}}} }
  });
}

function drawSMPChart(ctx, allRecs, months, labels, y) {
  const waterData = months.map(m=>{
    const pm=m===1?12:m-1;const py=m===1?y-1:y;
    const cur=allRecs.find(x=>x.meter_name==='SMP'&&x.year_be===y&&x.month===m);
    const pre=allRecs.find(x=>x.meter_name==='SMP'&&x.year_be===py&&x.month===pm);
    if(!cur||!pre) return null;
    return (parseFloat(cur.values?.water||0)||0)-(parseFloat(pre.values?.water||0)||0);
  });
  const elecData = months.map(m=>{
    const pm=m===1?12:m-1;const py=m===1?y-1:y;
    const cur=allRecs.find(x=>x.meter_name==='SMP'&&x.year_be===y&&x.month===m);
    const pre=allRecs.find(x=>x.meter_name==='SMP'&&x.year_be===py&&x.month===pm);
    if(!cur||!pre) return null;
    return (parseFloat(cur.values?.electric||0)||0)-(parseFloat(pre.values?.electric||0)||0);
  });

  S.chartInstance = new Chart(ctx,{
    type:'bar',
    data:{ labels, datasets:[
      { label:'การใช้น้ำ (ลบ.ม.)', data:waterData, backgroundColor:'#4f8ef7aa', borderColor:'#4f8ef7', borderWidth:1, yAxisID:'y' },
      { label:'การใช้ไฟฟ้า (kWh)', data:elecData,  backgroundColor:'#f59e0baa', borderColor:'#f59e0b', borderWidth:1, yAxisID:'y1' },
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{labels:{color:'#8892b0'}}},
      scales:{
        x:{ ticks:{color:'#8892b0'}, grid:{color:'#2e3350'} },
        y:{ type:'linear', position:'left',  ticks:{color:'#4f8ef7'}, grid:{color:'#2e3350'}, title:{display:true,text:'ลบ.ม.',color:'#4f8ef7'} },
        y1:{ type:'linear', position:'right', ticks:{color:'#f59e0b'}, grid:{drawOnChartArea:false}, title:{display:true,text:'kWh',color:'#f59e0b'} },
      }
    }
  });
}

// ============================================================
// HELPERS
// ============================================================
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toast(msg, type='success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`; t.textContent = msg;
  c.appendChild(t);
  setTimeout(()=>t.remove(), 3500);
}
