/* =========================================================
 * 旅行星人工作台 v2 · 主逻辑
 * 模块：运势 / 待办 / 运动饮食 / 英语学习 / 科研灵感 /
 *       剪辑灵感 / 自媒体 / 记账 / 设置
 * ========================================================= */
'use strict';

/* ---------- 小工具 ---------- */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function todayStr(d) {
  d = d || new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function dateCN(d) {
  d = d || new Date();
  const wk = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 周${wk}`;
}
function dayOfYear(d) {
  d = d || new Date();
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
function fmtMoney(n) {
  return Number(n || 0).toLocaleString('zh-CN', { maximumFractionDigits: 2 });
}
function monthKey(d) {
  d = d || new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}
function monthCN(key) {
  const [y, m] = key.split('-');
  return `${y}年${Number(m)}月`;
}

function getStore(key, def) {
  try { const v = localStorage.getItem(key); return v == null ? def : JSON.parse(v); }
  catch (e) { return def; }
}
function setStore(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 忽略 */ }
}

let toastTimer = null;
function toast(msg, ms) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, ms || 2200);
}

function confirmDlg(title, text, onOk) {
  $('#cfTitle').textContent = title;
  $('#cfText').innerHTML = text;
  const m = $('#confirmModal');
  m.hidden = false;
  const ok = $('#cfOk');
  const done = () => { m.hidden = true; };
  ok.onclick = () => { done(); if (onOk) onOk(); };
  $$('[data-close]', m).forEach(b => b.onclick = done);
}

function confetti() {
  const colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];
  for (let i = 0; i < 26; i++) {
    const el = document.createElement('i');
    el.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-14px;width:9px;height:9px;border-radius:3px;background:${colors[i%colors.length]};z-index:999;pointer-events:none;opacity:.95;animation:confettiFall ${1.2+Math.random()*1.1}s ease-in forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
}
const confettiStyle = document.createElement('style');
confettiStyle.textContent = '@keyframes confettiFall{to{transform:translateY(105vh) rotate(720deg);opacity:0}}';
document.head.appendChild(confettiStyle);

/* ---------- 星星人卡通形象 ---------- */
function roundedStar(cx, cy, R, r, points, round) {
  points = points || 5; round = round || .3;
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const ang = -Math.PI / 2 + (i * Math.PI) / points;
    pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % pts.length], p2 = pts[(i + 2) % pts.length];
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
    d += ` Q ${p1[0]} ${p1[1]} ${mx} ${my}`;
  }
  return d + ' Z';
}

function starSvg(opts) {
  const o = Object.assign({ c1: '#8b5cf6', c2: '#c084fc', emoji: '⭐', face: 'happy' }, opts);
  const gid = 'sg' + (hashStr(o.c1 + o.c2) % 100000);
  const body = roundedStar(58, 60, 40, 17, 5, .34);
  return `<svg viewBox="0 0 116 116" xmlns="http://www.w3.org/2000/svg" class="star-svg" role="img" aria-label="星星人卡通">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${o.c2}"/><stop offset="1" stop-color="${o.c1}"/>
      </linearGradient>
    </defs>
    <ellipse cx="58" cy="103" rx="26" ry="6" fill="rgba(90,70,40,.14)"/>
    <path class="star-body" d="${body}" fill="url(#${gid})" stroke="${o.c1}" stroke-width="2.5" stroke-linejoin="round"/>
    <ellipse cx="47" cy="55" rx="4.4" ry="5.6" fill="#3b3142"/>
    <ellipse cx="69" cy="55" rx="4.4" ry="5.6" fill="#3b3142"/>
    <circle cx="49" cy="52.6" r="1.7" fill="#fff"/>
    <circle cx="71" cy="52.6" r="1.7" fill="#fff"/>
    <path d="M52 72 Q58 78 64 72" stroke="#3b3142" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="39" cy="64" rx="6" ry="3.6" fill="rgba(255,255,255,.4)"/>
    <ellipse cx="77" cy="64" rx="6" ry="3.6" fill="rgba(255,255,255,.4)"/>
    <circle cx="98" cy="27" r="17.5" fill="#fff" stroke="${o.c1}" stroke-width="2.4"/>
    <text x="98" y="34" text-anchor="middle" font-size="17">${o.emoji}</text>
    <path d="M26 88 q-8 -8 -2 -15 M24 90 q-11 -9 -4 -18" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"/>
    <path d="M90 92 q8 -8 2 -15 M92 94 q11 -9 4 -18" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"/>
  </svg>`;
}

const MOD_META = {
  fortune:  { c1: '#8b5cf6', c2: '#c084fc', emoji: '🔮', name: '每日运势' },
  todo:     { c1: '#3b82f6', c2: '#60a5fa', emoji: '📝', name: '每日待办' },
  fitness:  { c1: '#22c55e', c2: '#86efac', emoji: '💪', name: '运动饮食' },
  english:  { c1: '#06b6d4', c2: '#67e8f9', emoji: '🌍', name: '英语学习' },
  research: { c1: '#7c3aed', c2: '#c4b5fd', emoji: '🔬', name: '科研灵感' },
  editing:  { c1: '#ec4899', c2: '#f9a8d4', emoji: '✂️', name: '剪辑灵感' },
  media:    { c1: '#f59e0b', c2: '#fcd34d', emoji: '🚀', name: '自媒体' },
  ledger:   { c1: '#1e9e6a', c2: '#6ee7b7', emoji: '💰', name: '记账' },
  settings: { c1: '#64748b', c2: '#94a3b8', emoji: '⚙️', name: '个人设置' }
};

function renderMascots() {
  Object.keys(MOD_META).forEach(k => {
    const el = $('#mascot-' + k);
    if (el) el.innerHTML = starSvg(MOD_META[k]);
  });
  applyStarImage();
}

function applyStarImage() {
  const hero = $('#heroMascot');
  const img = getStore('wb.starImage', null);
  if (img) hero.innerHTML = `<img src="${img}" alt="我的星星人">`;
  else hero.innerHTML = starSvg({ c1: '#ffd75e', c2: '#ffe9a8', emoji: '🧳' });
  const p = getProfile();
  $('#heroSub').textContent = p && p.name ? `${p.name}，今天也要元气满满 ✨` : '带上星星，出发吧 ✨';
}

/* ---------- 语音 ---------- */
function getVoice(lang) {
  if (!('speechSynthesis' in window) || !window.speechSynthesis) return null;
  const pre = lang.split('-')[0];
  let vs = window.speechSynthesis.getVoices().filter(v => (v.lang || '').toLowerCase().startsWith(pre));
  if (!vs.length && pre === 'en') vs = window.speechSynthesis.getVoices();
  if (lang.startsWith('en')) return vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
  return vs.find(v => /zh[-_]CN/i.test(v.lang)) || vs[0] || null;
}
if ('speechSynthesis' in window && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

function speak(text, lang, btn, rate) {
  if (!('speechSynthesis' in window) || !window.speechSynthesis) { toast('当前浏览器不支持语音播放'); return; }
  window.speechSynthesis.cancel();
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate || (lang.startsWith('en') ? 0.92 : 1.0);
  const v = getVoice(lang);
  if (v) u.voice = v;
  if (btn) {
    btn.classList.add('speaking');
    u.onend = u.onerror = () => btn.classList.remove('speaking');
  }
  window.speechSynthesis.speak(u);
}
function stopSpeak() {
  if ('speechSynthesis' in window && window.speechSynthesis) window.speechSynthesis.cancel();
  $$('.tts-btn.speaking').forEach(b => b.classList.remove('speaking'));
}

/* 单词真人发音：有道词典美音优先，失败自动退回系统朗读 */
function playWord(word, btn) {
  if (!word) return;
  if (btn) btn.classList.add('speaking');
  const url = 'https://dict.youdao.com/dictvoice?audio=' + encodeURIComponent(word) + '&type=2';
  try {
    const a = new Audio(url);
    a.preload = 'auto';
    let fellBack = false;
    a.onended = () => { if (btn) btn.classList.remove('speaking'); };
    a.onerror = () => {
      if (btn) btn.classList.remove('speaking');
      if (!fellBack) { fellBack = true; speak(word, 'en-US', btn); }
    };
    const p = a.play();
    if (p && p.catch) {
      p.catch(() => { if (!fellBack) { fellBack = true; speak(word, 'en-US', btn); } });
    }
  } catch (e) {
    speak(word, 'en-US', btn);
  }
}

/* 播放本地音频文件（真人语音 MP3）：依次尝试多个路径，全部失败才退回 fallback */
function playAudioFile(urls, fallback, btn, rate) {
  const list = Array.isArray(urls) ? urls : [urls];
  const tryNext = i => {
    if (i >= list.length) { if (fallback) fallback(); return null; }
    try {
      const a = new Audio(list[i]);
      a.preload = 'auto';
      if (rate) a.playbackRate = rate;
      let used = false;
      const fb = () => { if (!used) { used = true; tryNext(i + 1); } };
      a.onerror = () => { if (btn) btn.classList.remove('speaking'); fb(); };
      a.onended = () => { used = true; if (btn) btn.classList.remove('speaking'); };
      if (btn) btn.classList.add('speaking');
      const p = a.play();
      if (p && p.catch) p.catch(fb);
      return a;
    } catch (e) {
      return tryNext(i + 1);
    }
  };
  return tryNext(0);
}

/* ---------- 导航 ---------- */
let currentMod = 'todo';
function showModule(mod) {
  currentMod = mod;
  $$('.module').forEach(s => s.classList.remove('active'));
  $('#mod-' + mod).classList.add('active');
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.mod === mod));
  $$('.bn-item').forEach(b => b.classList.toggle('active', b.dataset.mod === mod));
  closeDrawer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (mod === 'media') { renderMedia(); checkDuePlans(); }
  if (mod === 'ledger') renderLedger();
}
function openDrawer() {
  $('#sidebar').classList.add('open');
  $('#sidebarOverlay').classList.add('show');
}
function closeDrawer() {
  $('#sidebar').classList.remove('open');
  $('#sidebarOverlay').classList.remove('show');
}

/* ---------- 资料 ---------- */
function getProfile() { return getStore('wb.profile', null); }
function saveProfile(p) {
  setStore('wb.profile', p);
  applyStarImage();
  renderFortune();
  renderFitness();
  renderSettings();
}

/* =========================================================
 * 1. 每日运势（八字）
 * ========================================================= */
const STEM_ELEM = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
const BR_ELEM   = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };
const ELEM_ORDER = ['木', '火', '土', '金', '水'];
const KE = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const ELEM_LUCK = {
  木: { colors: '绿色 · 青色', nums: '3 · 8', dir: '东方' },
  火: { colors: '红色 · 紫色', nums: '2 · 7', dir: '南方' },
  土: { colors: '黄色 · 棕色', nums: '5 · 10', dir: '中部 · 西南' },
  金: { colors: '白色 · 金色', nums: '4 · 9', dir: '西方' },
  水: { colors: '黑色 · 蓝色', nums: '1 · 6', dir: '北方' }
};

function elemRel(a, b) {
  const ia = ELEM_ORDER.indexOf(a), ib = ELEM_ORDER.indexOf(b);
  if (ia === ib) return 0;
  if (ELEM_ORDER[(ia + 1) % 5] === b) return 2;
  if (ELEM_ORDER[(ib + 1) % 5] === a) return 1;
  return KE[a] === b ? 4 : 3;
}

function tenGod(dm, other) {
  const same = (ELEM_ORDER.indexOf(dm) % 2) === (ELEM_ORDER.indexOf(other) % 2);
  const rel = elemRel(dm, other);
  if (rel === 0) return same ? '比肩' : '劫财';
  if (rel === 1) return same ? '偏印' : '正印';
  if (rel === 2) return same ? '食神' : '伤官';
  if (rel === 4) return same ? '偏财' : '正财';
  return same ? '七杀' : '正官';
}

function elemOfGanzhi(gz) {
  return { stem: STEM_ELEM[gz[0]] || '', branch: BR_ELEM[gz[1]] || '' };
}

function baziOf(profile) {
  if (!profile || !profile.birth) return null;
  const [y, m, d] = profile.birth.split('-').map(Number);
  const [hh, mm] = (profile.time || '12:00').split(':').map(Number);
  const solar = Solar.fromYmdHms(y, m, d, hh || 12, mm || 0, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  return {
    solar, lunar, ec,
    pillars: {
      年: { gz: ec.getYear(),  wux: ec.getYearWuXing(), nayin: ec.getYearNaYin(), shishen: tenGod(STEM_ELEM[ec.getDay()[0]], STEM_ELEM[ec.getYear()[0]]) },
      月: { gz: ec.getMonth(), wux: ec.getMonthWuXing(), nayin: ec.getMonthNaYin(), shishen: tenGod(STEM_ELEM[ec.getDay()[0]], STEM_ELEM[ec.getMonth()[0]]) },
      日: { gz: ec.getDay(),   wux: ec.getDayWuXing(),   nayin: ec.getDayNaYin(),   shishen: '日主' },
      时: { gz: ec.getTime(),  wux: ec.getTimeWuXing(),  nayin: ec.getTimeNaYin(),  shishen: tenGod(STEM_ELEM[ec.getDay()[0]], STEM_ELEM[ec.getTime()[0]]) }
    },
    dayMaster: STEM_ELEM[ec.getDay()[0]]
  };
}

function zodiacOf(profile) {
  try {
    const [y, m, d] = profile.birth.split('-').map(Number);
    const [hh, mm] = (profile.time || '12:00').split(':').map(Number);
    return Solar.fromYmdHms(y, m, d, hh || 12, mm || 0, 0).getLunar().getYearShengXiao();
  } catch (e) { return '—'; }
}

function wuxingCount(bazi) {
  const cnt = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  Object.values(bazi.pillars).forEach(p => {
    const e = elemOfGanzhi(p.gz);
    cnt[e.stem] += 1;
    cnt[e.branch] += 0.7;
  });
  return cnt;
}

function dailyFortune(profile) {
  const today = Lunar.fromDate(new Date());
  const dayGz = today.getDayInGanZhi();
  const bazi = baziOf(profile);
  const dm = bazi.dayMaster;
  const dayElem = elemOfGanzhi(dayGz);
  const rel = elemRel(dm, dayElem.stem);
  const god = tenGod(dm, dayElem.stem);
  const cnt = wuxingCount(bazi);
  const sorted = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
  const xi = sorted[sorted.length - 1][0];
  const ji = sorted[0][0];
  const jit = hashStr(todayStr() + 'fortune');

  const base = { 事业: 62, 财运: 62, 健康: 62, 感情: 62, 人际: 62 };
  const bonus = {
    '印': { 事业: 8, 财运: 2, 健康: 8, 感情: 4, 人际: 3 },
    '比': { 事业: 4, 财运: -2, 健康: 4, 感情: 6, 人际: 6 },
    '食': { 事业: 6, 财运: -2, 健康: -3, 感情: 3, 人际: 7 },
    '财': { 事业: 2, 财运: 9, 健康: 1, 感情: 5, 人际: 2 },
    '官': { 事业: 7, 财运: -3, 健康: -6, 感情: -4, 人际: -2 }
  };
  const godKey = { 正印: '印', 偏印: '印', 比肩: '比', 劫财: '比', 食神: '食', 伤官: '食', 正财: '财', 偏财: '财', 正官: '官', 七杀: '官' }[god];
  const scores = {};
  Object.keys(base).forEach(k => {
    let v = base[k] + bonus[godKey][k];
    if (dayElem.branch === xi) v += 5;
    if (dayElem.branch === ji) v -= k === '健康' ? 6 : 3;
    v += (jit % 11) - 5;
    scores[k] = clamp(Math.round(v), 48, 98);
  });
  const total = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
  const tips = {
    '印': '印星当值，思路清晰、贵人运在线，适合学习新知识和推进计划。',
    '比': '比劫同气，精力旺盛但易冲动，合作多商量，钱包要捂紧。',
    '食': '食伤泄秀，表达欲强，适合沟通、创作和展示自己，少熬夜。',
    '财': '财星当值，财运和执行力都不错，适合谈钱、下单、做总结。',
    '官': '官杀加身，压力与机遇并存，稳住节奏、按规矩办事会有收获。'
  };
  const luck = ELEM_LUCK[xi];
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return {
    today, dayGz, total, scores, god, godKey, xi, ji, luck, best,
    tip: tips[godKey],
    dayYi: today.getDayYi() || [],
    dayJi: today.getDayJi() || [],
    chong: today.getDayChong(),
    sha: today.getDaySha(),
    zhishen: today.getDayTianShen(),
    zhiXing: today.getZhiXing(),
    lunar: `${today.getYearInChinese()}年${today.getMonthInChinese()}月${today.getDayInChinese()}`,
    ganzhiYear: today.getYearInGanZhi(),
    ganzhiMonth: today.getMonthInGanZhi(),
    shengxiao: today.getYearShengXiao(),
    xingzuo: bazi.solar.getXingZuo()
  };
}

function renderFortune() {
  const box = $('#body-fortune');
  const profile = getProfile();
  if (!profile || !profile.birth) {
    box.innerHTML = `
      <div class="card" style="text-align:center;padding:28px 18px">
        <div style="font-size:44px">🔮</div>
        <h3 style="margin:12px 0 6px">先填写你的出生资料</h3>
        <p class="muted" style="margin-bottom:14px">填写出生日期和时间后，每日运势会按你的八字自动排盘，每天更新。</p>
        <button class="btn btn-primary" id="fortuneProfileBtn">填写八字资料</button>
      </div>`;
    $('#fortuneProfileBtn').onclick = openProfileModal;
    return;
  }
  let f;
  try { f = dailyFortune(profile); }
  catch (e) {
    box.innerHTML = `<div class="card"><p class="hint">排盘出错：${esc(e.message)}</p><div class="btn-row" style="margin-top:10px"><button class="btn" id="fortuneProfileBtn2">重新填写资料</button></div></div>`;
    $('#fortuneProfileBtn2').onclick = openProfileModal;
    return;
  }
  const bazi = baziOf(profile);
  const pillarRows = Object.entries(bazi.pillars).map(([k, p]) =>
    `<tr><td>${k}柱</td><td class="stem">${p.gz}</td><td>${p.wux || elemOfGanzhi(p.gz).stem + elemOfGanzhi(p.gz).branch}</td><td>${p.nayin || '-'}</td><td>${p.shishen}</td></tr>`).join('');
  const areaNames = { 事业: '事业', 财运: '财运', 健康: '健康', 感情: '感情', 人际: '人际' };
  const bars = Object.keys(f.scores).map(k =>
    `<div class="bar-col"><small>${areaNames[k]}</small><div class="bar"><i style="--h:${f.scores[k]}%"></i></div><div class="score">${f.scores[k]}</div></div>`).join('');
  const yi = f.dayYi.length ? f.dayYi.slice(0, 8).map(t => `<span>${t}</span>`).join('') : '<span>诸事可为</span>';
  const ji = f.dayJi.length ? f.dayJi.slice(0, 8).map(t => `<span>${t}</span>`).join('') : '<span>无大忌</span>';
  box.innerHTML = `
    <div class="fortune-hero">
      <div class="row1">
        <div>
          <div class="ganzhi">${f.ganzhiYear}年 ${f.ganzhiMonth}月 ${f.dayGz}日</div>
          <div class="lunar">农历 ${f.lunar} · 值神 ${f.zhishen || '—'} · ${f.zhiXing || ''} · 冲${f.chong || '—'} 煞${f.sha || '—'}方</div>
        </div>
        <div style="text-align:right"><div style="font-size:30px;font-weight:800">${f.total}</div><small style="font-size:11px;opacity:.9">综合运势</small></div>
      </div>
      <div class="bars">${bars}</div>
      <div class="lucky-row">
        <span class="lucky-chip">🍀 幸运色 ${esc(f.luck.colors)}</span>
        <span class="lucky-chip">🔢 幸运数字 ${esc(f.luck.nums)}</span>
        <span class="lucky-chip">🧭 幸运方位 ${esc(f.luck.dir)}</span>
        <span class="lucky-chip">⭐ 今日${esc(f.god)} · 喜${esc(f.xi)}</span>
      </div>
    </div>
    <div class="grid2">
      <div class="card">
        <h3>🧾 我的八字</h3>
        <table class="bazi-table">
          <tr><th>柱</th><th>干支</th><th>五行</th><th>纳音</th><th>十神</th></tr>
          ${pillarRows}
        </table>
        <p class="muted" style="margin-top:8px">日主：<b>${esc(bazi.dayMaster)}</b> · 生肖 ${esc(f.shengxiao)} · 星座 ${esc(f.xingzuo)}</p>
      </div>
      <div>
        <div class="card">
          <h3>🗓️ 今日宜忌 <span class="sub">（黄历自动更新）</span></h3>
          <div class="yi-ji">
            <div class="box yi"><h4>✅ 宜</h4><div class="tags">${yi}</div></div>
            <div class="box ji"><h4>⚠️ 忌</h4><div class="tags">${ji}</div></div>
          </div>
        </div>
        <div class="card">
          <h3>💬 今日开运提示</h3>
          <p style="font-size:13.5px;line-height:1.8">${esc(f.tip)}<br><span class="muted">今天状态最好的方向：<b>${areaNames[f.best]}</b>。</span></p>
          <div class="btn-row" style="margin-top:10px"><button class="btn btn-sm" id="reProfileBtn">✏️ 修改出生资料</button></div>
        </div>
      </div>
    </div>`;
  $('#reProfileBtn').onclick = openProfileModal;
}

/* =========================================================
 * 2. 每日待办
 * ========================================================= */
let todoFilter = 'all';
function getTodos() { return getStore('wb.todos', []); }
function saveTodos(t) { setStore('wb.todos', t); renderTodo(); }

function renderTodo() {
  const box = $('#body-todo');
  const todos = getTodos();
  const today = todayStr();
  const doneToday = todos.filter(t => t.date === today && t.done).length;
  const totalToday = todos.filter(t => t.date === today).length;
  const pct = totalToday ? Math.round(doneToday / totalToday * 100) : 0;
  const cats = { 工作: '#3b82f6', 学习: '#8b5cf6', 生活: '#22c55e', 运动: '#f59e0b', 其他: '#64748b' };
  const pri = { 高: 'red', 中: 'gold', 低: 'gray' };

  let list = todos.slice();
  if (todoFilter === 'doing') list = list.filter(t => !t.done);
  if (todoFilter === 'done') list = list.filter(t => t.done);
  const groups = [
    { key: 'today', name: `今天 ${dateCN()}`, items: list.filter(t => t.date === today) },
    { key: 'future', name: '以后', items: list.filter(t => t.date && t.date > today) },
    { key: 'someday', name: '无日期', items: list.filter(t => !t.date) },
    { key: 'done', name: '已完成', items: list.filter(t => t.done) }
  ].filter(g => g.items.length);

  const itemsHtml = groups.map(g => `
    <div class="todo-group-title">${g.name} <span class="muted">${g.items.length} 项</span></div>
    ${g.items.map(t => `
      <div class="todo-item ${t.done ? 'done' : ''}" data-id="${t.id}">
        <button class="todo-check" data-act="toggle" aria-label="完成">${t.done ? '✓' : ''}</button>
        <div style="flex:1;min-width:0">
          <div class="todo-text">${esc(t.text)}</div>
          <div class="todo-meta">${esc(t.date || '无日期')} · <span class="tag" style="background:${cats[t.cat] || cats.其他}1a;color:${cats[t.cat] || cats.其他}">${esc(t.cat || '其他')}</span> ${t.prio ? `<span class="tag ${pri[t.prio]}">${t.prio}优先级</span>` : ''}</div>
        </div>
        <button class="todo-del" data-act="del" aria-label="删除">🗑</button>
      </div>`).join('')}
  `).join('') || '<p class="muted" style="text-align:center;padding:20px 0">这里空空如也，添加一件小事开始吧 ✨</p>';

  box.innerHTML = `
    <div class="card">
      <div class="ring-wrap">
        <div class="ring" style="--p:${pct}"><b>${pct}%</b><small>今日进度</small></div>
        <div style="flex:1">
          <h3 style="margin-bottom:4px">📌 今天要做的事</h3>
          <p class="muted">已完成 ${doneToday}/${totalToday} 项${totalToday && pct === 100 ? ' 🎉 全部搞定！' : ''}</p>
          <div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
      </div>
      <div class="todo-add" style="margin-top:14px">
        <input class="input" id="todoText" placeholder="添加任务，比如：背 10 个英语单词…">
        <select class="select" id="todoCat"><option>工作</option><option>学习</option><option>生活</option><option>运动</option><option>其他</option></select>
        <select class="select" id="todoPrio"><option>中</option><option>高</option><option>低</option></select>
        <input class="input" type="date" id="todoDate" value="${today}" style="max-width:150px">
        <button class="btn btn-primary" id="todoAdd">＋ 添加</button>
      </div>
      <div class="filter-tabs">
        ${[['all', '全部'], ['doing', '待办'], ['done', '已完成']].map(([k, n]) => `<span class="pill ${todoFilter === k ? 'active' : ''}" data-f="${k}">${n}</span>`).join('')}
      </div>
    </div>
    ${itemsHtml}
    ${todos.length ? '<div class="btn-row" style="margin-top:4px"><button class="btn btn-sm btn-ghost" id="clearDoneBtn">清除已完成</button></div>' : ''}`;

  $('#todoAdd').onclick = () => {
    const text = $('#todoText').value.trim();
    if (!text) { toast('先写点什么吧～'); return; }
    todos.push({ id: uid(), text, cat: $('#todoCat').value, prio: $('#todoPrio').value, date: $('#todoDate').value, done: false });
    saveTodos(todos);
    toast('已添加到待办 ✅');
  };
  $('#todoText').addEventListener('keydown', e => { if (e.key === 'Enter') $('#todoAdd').click(); });
  $$('.filter-tabs .pill').forEach(p => p.onclick = () => { todoFilter = p.dataset.f; renderTodo(); });
  $$('.todo-item').forEach(item => {
    const id = item.dataset.id;
    item.querySelector('[data-act=toggle]').onclick = () => {
      const t = getTodos();
      const it = t.find(x => x.id === id);
      if (!it) return;
      it.done = !it.done;
      if (it.done) it.doneAt = Date.now();
      saveTodos(t);
      const tt = getTodos().filter(x => x.date === today).length;
      const dd = getTodos().filter(x => x.date === today && x.done).length;
      if (tt && dd === tt && dd > 0) confetti();
    };
    item.querySelector('[data-act=del]').onclick = () => {
      saveTodos(getTodos().filter(x => x.id !== id));
      toast('已删除');
    };
  });
  const cb = $('#clearDoneBtn');
  if (cb) cb.onclick = () => saveTodos(getTodos().filter(t => !t.done));
}

/* =========================================================
 * 3. 运动饮食：喝水 + 打卡 + 健身参考视频库
 * ========================================================= */
function waterOf(date) { return getStore('wb.water.' + date, 0); }
function exState(date) { return getStore('wb.exercises.' + date, { log: [] }); }
function fitVideos() { return getStore('wb.fitVideos', []); }
function saveFitVideos(v) { setStore('wb.fitVideos', v); renderFitness(); }
function weightKg() { const p = getProfile(); return (p && p.weight) || 60; }

function videoBadge(u) {
  if (/bilibili|b23\.tv/i.test(u)) return '<span class="src-badge bili">B站</span>';
  if (/douyin|iesdouyin/i.test(u)) return '<span class="src-badge">抖音</span>';
  if (/xiaohongshu|xhslink/i.test(u)) return '<span class="src-badge xhs">小红书</span>';
  if (/youtube|youtu\.be/i.test(u)) return '<span class="src-badge yt">YouTube</span>';
  if (/v\.qq\.com/i.test(u)) return '<span class="src-badge other">腾讯视频</span>';
  return '<span class="src-badge other">链接</span>';
}

function renderFitness() {
  const box = $('#body-fitness');
  const today = todayStr();
  const goal = (getProfile() && getProfile().water) || 2000;
  const water = waterOf(today);
  const pct = clamp(Math.round(water / goal * 100), 0, 150);
  const ex = exState(today);
  const sug = EXERCISE_SUGGESTIONS[dayOfYear() % EXERCISE_SUGGESTIONS.length];
  const week = [0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = new Date(); d.setDate(d.getDate() - i);
    const w = waterOf(todayStr(d));
    return `<i class="${w >= goal ? 'on' : ''}" title="${dateCN(d)} ${Math.round(w / goal * 100)}%"></i>`;
  }).reverse().join('');
  const vids = fitVideos();
  const exHtml = ex.log.length ? ex.log.map((e, i) => `
    <div class="ex-row">
      <span style="font-size:19px">${e.emoji || '🏃'}</span>
      <div class="name">${esc(e.type)}</div>
      <div class="kcal">${e.min} 分钟 · 约 ${e.kcal} 千卡</div>
      <button class="todo-del" data-i="${i}">🗑</button>
    </div>`).join('') : '<p class="muted" style="text-align:center;padding:10px 0">今天还没运动，动起来吧 💪</p>';
  const vidHtml = vids.length ? vids.map(v => `
    <div class="lib-card">
      <div class="lt">${videoBadge(v.url)} ${esc(v.title || '未命名视频')}</div>
      <div class="lm"><a href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.url)}</a></div>
      ${v.note ? `<div class="ln">📝 ${esc(v.note)}</div>` : ''}
      <div class="actions">
        <span style="font-size:11px;color:var(--ink2)">${v.tags && v.tags.length ? v.tags.map(t => `<span class="tag">#${esc(t)}</span>`).join(' ') : ''}</span>
        <span class="muted" style="margin-left:auto">${esc(v.date || '')}</span>
        <button class="btn btn-sm btn-ghost" data-del-vid="${v.id}">🗑</button>
      </div>
    </div>`).join('') : '<p class="muted" style="text-align:center;padding:14px 0">还没有收藏视频，粘一条 B站/抖音/YouTube 链接试试</p>';

  box.innerHTML = `
    <div class="grid2">
      <div class="card">
        <h3>💧 今日喝水 <span class="sub">目标 ${goal} ml</span></h3>
        <div class="ring-wrap">
          <div class="ring" style="--p:${Math.min(pct, 100)}"><b>${water}<small style="font-size:9px">ml</small></b><small>${pct}%</small></div>
          <div style="flex:1">
            <p class="muted">${pct >= 100 ? '喝水目标达成 🎉' : `还差 ${Math.max(0, goal - water)} ml`}</p>
            <div class="progress-track" style="margin-top:8px"><div class="progress-fill" style="width:${Math.min(pct, 100)}%"></div></div>
            <div class="week-dots" title="近 7 天">${week}</div>
          </div>
        </div>
        <div class="water-ctrl">
          <button class="btn btn-sm" data-w="-250">-250</button>
          <button class="btn btn-sm" data-w="250">+250</button>
          <button class="btn btn-sm" data-w="500">+500</button>
          <button class="btn btn-sm btn-primary" data-w="0">清零</button>
        </div>
      </div>
      <div class="card">
        <h3>🏃 每日运动打卡 <span class="sub">今日建议：${esc(sug)}</span></h3>
        <div class="todo-add">
          <select class="select" id="exType">
            <option>快走</option><option>慢跑</option><option>游泳</option><option>骑行</option>
            <option>HIIT</option><option>瑜伽</option><option>跳绳</option><option>力量训练</option><option>其他</option>
          </select>
          <input class="input" type="number" id="exMin" placeholder="分钟" min="1" max="300" style="max-width:110px">
          <button class="btn btn-primary" id="exAdd">＋ 打卡</button>
        </div>
        ${exHtml}
      </div>
    </div>
    <div class="card">
      <h3>🎬 健身参考视频库 <span class="sub">随时收藏，随取随练</span></h3>
      <div class="todo-add">
        <input class="input" id="fvUrl" placeholder="粘贴视频链接（B站/抖音/小红书/YouTube…）" style="flex:2;min-width:170px">
        <input class="input" id="fvTitle" placeholder="标题（可选）" style="flex:1;min-width:120px">
        <input class="input" id="fvTags" placeholder="标签，逗号分隔（可选）" style="flex:1;min-width:120px">
        <button class="btn btn-primary" id="fvAdd">＋ 收藏</button>
      </div>
      <input class="input" id="fvNote" placeholder="备注：跟练感受、动作要点…（可选）" style="margin-top:8px">
      <div style="margin-top:12px">${vidHtml}</div>
    </div>`;

  $$('[data-w]').forEach(b => b.onclick = () => {
    let w = waterOf(today) + Number(b.dataset.w);
    w = b.dataset.w === '0' ? 0 : Math.max(0, w);
    setStore('wb.water.' + today, w);
    renderFitness();
  });
  $$('[data-del-vid]').forEach(b => b.onclick = () => saveFitVideos(fitVideos().filter(v => v.id !== b.dataset.delVid)));
  $('#exAdd').onclick = () => {
    const type = $('#exType').value;
    const min = Number($('#exMin').value);
    if (!min || min < 1) { toast('请输入运动分钟数'); return; }
    const MET = { 快走: 4, 慢跑: 8, 游泳: 7, 骑行: 6, HIIT: 9, 瑜伽: 3, 跳绳: 9, 力量训练: 5, 其他: 5 }[type] || 5;
    const kcal = Math.round(MET * weightKg() * min / 60);
    const st = exState(today);
    st.log.push({ type, min, kcal, emoji: { 快走: '🚶', 慢跑: '🏃', 游泳: '🏊', 骑行: '🚴', HIIT: '🔥', 瑜伽: '🧘', 跳绳: '🤸', 力量训练: '🏋️', 其他: '🎽' }[type] || '🏃' });
    setStore('wb.exercises.' + today, st);
    renderFitness();
    toast(`已打卡 ${type} ${min} 分钟，约消耗 ${kcal} 千卡 🎉`);
  };
  $('#fvAdd').onclick = () => {
    const url = $('#fvUrl').value.trim();
    if (!url) { toast('请先粘贴视频链接'); return; }
    const tags = $('#fvTags').value.split(/[,，]/).map(s => s.trim()).filter(Boolean);
    const v = { id: uid(), url, title: $('#fvTitle').value.trim(), tags, note: $('#fvNote').value.trim(), date: today };
    saveFitVideos([v].concat(fitVideos()));
    toast('已收藏到健身视频库 🎬');
  };
}

/* =========================================================
 * 4. 英语学习：CET-6 趣味听力游戏 + 口语
 * ========================================================= */
let engOffset = 0;
let biliKw = '六级英语听力';
function engPackFor(offsetDays) {
  return ENGLISH_PACKS[(((dayOfYear() + offsetDays - 1) % ENGLISH_PACKS.length) + ENGLISH_PACKS.length) % ENGLISH_PACKS.length];
}
function engState(date) {
  return getStore('wb.english.' + date, { words: {}, cloze: {}, quiz: {}, speaking: 0, note: '', customUrl: '', rate: 0.92 });
}

function biliPinned() {
  return getStore('wb.biliPinned', ['BV19w411i7iE', 'BV1ij411s7Fm']);
}
function saveBiliPinned(list) {
  setStore('wb.biliPinned', list);
}
function fmtBiliDur(sec) {
  sec = Number(sec) || 0;
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0');
}
async function fetchBiliInfo(bvid) {
  try {
    const r = await fetch('/api/biliinfo?bvid=' + encodeURIComponent(bvid));
    const d = await r.json();
    return d.ok && d.video ? d.video : null;
  } catch (e) {
    return null;
  }
}

async function loadBili(kw) {
  const list = $('#biliList');
  if (!list) return;
  list.innerHTML = '<p class="muted">加载中…</p>';
  const pinned = biliPinned();
  const pinInfos = {};
  await Promise.all(pinned.map(async bv => { pinInfos[bv] = await fetchBiliInfo(bv); }));
  let html = '';
  if (pinned.length) {
    html += '<div class="muted" style="margin:4px 0 6px;font-weight:700">⭐ 固定推荐</div>';
    html += pinned.map(bv => {
      const info = pinInfos[bv];
      const meta = (typeof BILI_PINNED_META !== 'undefined' && BILI_PINNED_META[bv]) || {};
      const title = (info && info.title) || meta.title || bv;
      const author = (info && info.author) || meta.author || '—';
      const dur = (info && info.duration) ? fmtBiliDur(info.duration) : (meta.dur || '');
      return `<div class="lib-card">
        <div class="lt">📌 ${esc(title)}</div>
        <div class="lm">UP：${esc(author)}${dur ? ' · ' + esc(dur) : ''}</div>
        <div class="actions">
          <button class="btn btn-sm btn-primary" data-buse="${bv}">▶ 用作今日视频</button>
          <a class="btn btn-sm" href="https://www.bilibili.com/video/${bv}" target="_blank" rel="noopener">打开</a>
          <button class="btn btn-sm btn-ghost" data-pin-del="${bv}">移除</button>
        </div>
      </div>`;
    }).join('');
  }
  try {
    const r = await fetch('/api/bili?kw=' + encodeURIComponent(kw));
    const d = await r.json();
    if (d.ok && d.items && d.items.length) {
      html += `<div class="muted" style="margin:10px 0 6px;font-weight:700">🔍 “${esc(kw)}” 最新视频</div>`;
      html += d.items.map(v => `
        <div class="lib-card">
          <div class="lt">📺 ${esc(v.title)}</div>
          <div class="lm">UP：${esc(v.author || '—')} · ${esc(v.duration || '')} · 播放 ${esc(v.play || '—')}</div>
          <div class="actions">
            <button class="btn btn-sm btn-primary" data-buse="${v.bvid}">▶ 用作今日视频</button>
            <a class="btn btn-sm" href="https://www.bilibili.com/video/${v.bvid}" target="_blank" rel="noopener">打开</a>
          </div>
        </div>`).join('');
    } else {
      html += '<p class="hint">搜索暂时没拿到结果，稍后再试。</p>';
    }
  } catch (e) {
    html += '<p class="hint">自动抓取需要本地服务：请启动 start.bat 或 start-public.bat 后刷新。</p>';
  }
  list.innerHTML = html;
  $$('[data-buse]', list).forEach(b => b.onclick = () => {
    const s = engState(todayStr());
    s.customUrl = 'https://www.bilibili.com/video/' + b.dataset.buse;
    setStore('wb.english.' + todayStr(), s);
    renderEnglish();
    toast('已替换为 B站视频 🎬');
  });
  $$('[data-pin-del]', list).forEach(b => b.onclick = () => {
    saveBiliPinned(biliPinned().filter(x => x !== b.dataset.pinDel));
    toast('已移除固定视频');
    loadBili(biliKw);
  });
}

function parseVideoUrl(u) {
  if (!u) return { type: 'none', url: null };
  if (/pan\.baidu\.com/.test(u)) return { type: 'baidu', url: u };
  if (/\.(mp4|webm|ogv|ogg|m3u8|mov)(\?|$)/i.test(u)) return { type: 'file', url: u };
  const bv = u.match(/bilibili\.com\/video\/(BV[\w]+)/i) || u.match(/b23\.tv\/(\w+)/i);
  if (bv) return { type: 'embed', url: `https://player.bilibili.com/player.html?bvid=${bv[1]}&page=1&high_quality=1&danmaku=0` };
  const yt = u.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/);
  if (yt) return { type: 'embed', url: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
  if (/player\.|embed|v\.qq\.com|bilibili\.com/i.test(u)) return { type: 'embed', url: u };
  return { type: 'link', url: u };
}

function makeVttDataUrl(text) {
  let t = String(text || '');
  t = t.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  if (!/^WEBVTT/i.test(t)) t = 'WEBVTT\n\n' + t;
  return 'data:text/vtt;charset=utf-8,' + encodeURIComponent(t);
}

function renderEnglish() {
  const box = $('#body-english');
  const today = todayStr();
  const pack = engPackFor(engOffset);
  const st = engState(today);
  const wordDone = pack.words.filter((w, i) => st.words[i]).length;
  const clozeDone = pack.cloze.filter((c, i) => st.cloze[i] === true).length;
  const quizDone = pack.quiz.filter((q, i) => st.quiz[i] === true).length;
  const parts = 4;
  const score = Math.round((wordDone / pack.words.length + clozeDone / pack.cloze.length + quizDone / pack.quiz.length + (st.speaking ? 1 : 0)) / parts * 100);
  const vSource = st.customUrl || `https://www.ted.com/talks/${pack.slug}/embed`;
  const vp = parseVideoUrl(vSource);
  const speedRow = [0.75, 0.92, 1.1].map(r => `<span class="pill ${Math.abs(st.rate - r) < 0.001 ? 'active' : ''}" data-rate="${r}">${r}x</span>`).join('');
  const subTrack = st.subText ? `<track kind="subtitles" src="${makeVttDataUrl(st.subText)}" srclang="en" label="字幕" default>` : '';
  const videoHtml = st.noVideo
    ? `<div class="hint">📖 无视频模式已开启：用内置朗读（🔊）+ 中英台词 + 听力游戏一样能练。点下方“恢复视频”可切回。</div>`
    : vp.type === 'embed'
    ? `<div class="vid-frame"><iframe src="${vp.url}" loading="lazy" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture" title="${esc(pack.title)}"></iframe></div>`
    : vp.type === 'file'
    ? `<video controls preload="metadata" src="${esc(vp.url)}" style="width:100%;border-radius:14px;background:#000;max-height:320px">${subTrack}</video>`
    : vp.type === 'baidu'
    ? `<div class="hint">📦 百度网盘链接无法在网页内直接播放（网盘限制）。请在手机/电脑网盘 App 里打开，或把视频下载后转成 .mp4 直链再粘贴回来。<a class="btn btn-sm" style="margin-left:8px" href="${esc(vp.url)}" target="_blank" rel="noopener">去网盘打开</a></div>`
    : vp.type === 'link'
    ? `<a class="btn" href="${esc(vp.url)}" target="_blank" rel="noopener">🔗 打开视频链接</a>`
    : '<p class="muted">暂无视频</p>';
  const biliSearch = 'https://search.bilibili.com/all?keyword=' + encodeURIComponent(`${pack.title} ${pack.speaker} TED`);
  const ytSearch = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`${pack.title} TED`);

  box.innerHTML = `
    <div class="card">
      <div class="pack-head">
        <div>
          <div class="pack-title">🎧 Day ${pack.day} · ${esc(pack.title)}</div>
          <div class="muted">${esc(pack.speaker)} · ${pack.dur} · 难度 ${pack.level} · ${esc(pack.fun)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <select class="select" id="engPackSelect" style="max-width:180px;font-size:12px;padding:7px 10px">
            ${ENGLISH_PACKS.map((p, i) => `<option value="${i}" ${p === pack ? 'selected' : ''}>Day ${p.day} ${esc(p.title)}</option>`).join('')}
          </select>
          <div class="ring" style="--p:${score};width:74px;height:74px"><b>${score}</b><small>今日完成</small></div>
        </div>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${score}%"></div></div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn btn-sm" id="engPrev">⬅ 前一天</button>
        <button class="btn btn-sm" id="engNext">后一天 ➡</button>
        <span class="speed-row">语速 ${speedRow}</span>
      </div>
    </div>

    <div class="card">
      <h3>🎬 今日视频 <span class="sub">像“每日英语听力”一样：先泛听 1-2 遍，再做游戏</span></h3>
      ${videoHtml}
      <div class="todo-add" style="margin-top:10px">
        <input class="input" id="engCustomUrl" placeholder="可粘贴 TED/B站/百度网盘/YouTube/.mp4 链接替换今日视频" value="${esc(st.customUrl || '')}">
        <button class="btn btn-sm" id="engSaveUrl">保存视频</button>
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn btn-sm" id="engToggleScript">📜 ${st.showScript ? '隐藏' : '显示'}中英台词</button>
        <label class="btn btn-sm">📁 导入字幕（可选）
          <input type="file" id="engSubFile" accept=".srt,.vtt,.txt" hidden>
        </label>
        ${st.subName ? `<span class="muted">已导入：${esc(st.subName)}</span><button class="btn btn-sm btn-ghost" id="engSubClear">移除</button>` : ''}
      </div>
      <div class="btn-row" style="margin-top:8px">
        <a class="btn btn-sm" href="https://www.ted.com/talks/${pack.slug}" target="_blank" rel="noopener">🌐 TED 官网观看</a>
        <a class="btn btn-sm" href="${biliSearch}" target="_blank" rel="noopener">🔍 B站搜本篇</a>
        <a class="btn btn-sm" href="${ytSearch}" target="_blank" rel="noopener">🔍 YouTube搜本篇</a>
        <button class="btn btn-sm" id="engNoVideo">${st.noVideo ? '📺 恢复视频' : '📖 无视频模式'}</button>
      </div>
      <p class="rss-note" style="margin-top:8px">💡 TED 播放器在国内网络偶尔加载失败（显示“拒绝连接”），属正常现象：可以点“TED 官网观看”跳到官网看，或去 B站搜同篇替换，或直接开“无视频模式”用朗读+台词+游戏学习。</p>
      ${st.showScript ? `<div class="dialogue" style="margin-top:10px">${pack.cloze.map(c => `
        <div class="dl-line">
          <div style="flex:1;min-width:0">
            <div class="en">${esc(c.s.replace(/\{([^}]+)\}/g, '$1'))}</div>
            <div class="cn">${esc(c.cn)}</div>
          </div>
        </div>`).join('')}</div>` : ''}
    </div>

    <div class="card">
      <h3>📺 每日新料 · B站最新英语视频 <span class="sub">自动抓取最新 · 点“用作今日视频”直接内嵌播放</span></h3>
      <div class="btn-row">
        ${['六级英语听力', '英语口语', '美剧英语', '四级听力'].map(k => `<span class="pill ${biliKw === k ? 'active' : ''}" data-bkw="${esc(k)}">${esc(k)}</span>`).join('')}
        <button class="btn btn-sm btn-primary" id="biliRefresh">🔄 刷新</button>
      </div>
      <div class="todo-add" style="margin-top:8px">
        <input class="input" id="biliPinUrl" placeholder="想固定哪条就粘贴 B站链接，如 …/video/BV1ij411s7Fm">
        <button class="btn btn-sm" id="biliPinAdd">⭐ 固定</button>
      </div>
      <div id="biliList"><p class="muted" style="padding:8px 0">点“刷新”从 B站拉取最新英语视频（需本地服务 / 公网通道）</p></div>
    </div>

    <div class="card">
      <h3>📖 听前热身 · 关键词 <span class="sub">${wordDone}/${pack.words.length}</span></h3>
      <p class="rss-note" style="margin-bottom:8px">🔊 单词用真人美音发音；如果还是没声音：① 请在系统浏览器打开（别在微信/内置浏览器里）② 检查手机音量/静音 ③ 网络不稳定时自动切回系统朗读。</p>
      ${pack.words.map((w, i) => `
        <div class="word-item ${st.words[i] ? 'learned' : ''}" data-i="${i}">
          <button class="tts-btn" data-w="${i}" aria-label="朗读">🔊</button>
          <div style="flex:1;min-width:0">
            <span class="en">${esc(w.en)}</span> <span class="ph">${esc(w.ph)}</span>
            <div class="cn">${esc(w.cn)}</div>
            <div class="ex">💬 ${esc(w.ex)}</div>
          </div>
          <button class="btn btn-sm ${st.words[i] ? 'btn-primary' : ''}" data-learn="${i}">${st.words[i] ? '✓ 已学' : '标记'}</button>
        </div>`).join('')}
    </div>

    <div class="card">
      <h3>🎮 听力填空游戏 <span class="sub">先听句子，再填单词 · ${clozeDone}/${pack.cloze.length}</span></h3>
      ${pack.cloze.map((c, i) => {
        const done = st.cloze[i] === true;
        const parts2 = c.s.split(/(\{[^}]+\})/g);
        const html = parts2.map(p => {
          if (p.startsWith('{')) {
            const ans = p.slice(1, -1);
            return `<input class="game-input" id="clz-${i}" data-ans="${esc(ans)}" placeholder="${ans.length} 个字母" ${done ? 'disabled' : ''}>`;
          }
          return esc(p);
        }).join('');
        return `<div class="game-box ${done ? '' : ''}">
          <div class="gs">${html}</div>
          <div class="cn-text ${st.showCn ? '' : 'hidden'}" style="font-size:12px;color:var(--ink2);margin-top:4px">${esc(c.cn)}</div>
          <div class="btn-row" style="margin-top:8px">
            <button class="tts-btn" data-clz="${i}" aria-label="听句子">🔊</button>
            <button class="btn btn-sm" data-check="${i}">${done ? '✓ 已答对' : '检查'}</button>
            <button class="btn btn-sm btn-ghost" data-show-cn="${i}">${st.showCn ? '隐藏中文' : '中文'}</button>
            ${done ? '' : `<button class="btn btn-sm btn-ghost" data-skip="${i}">看答案</button>`}
          </div>
          <div class="game-msg" id="msg-${i}" style="font-size:12px;margin-top:4px"></div>
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <h3>🧠 听力理解小测 <span class="sub">${quizDone}/${pack.quiz.length}</span></h3>
      ${pack.quiz.map((q, i) => `
        <div class="game-box">
          <div class="gs" style="font-weight:800">${i + 1}. ${esc(q.q)}</div>
          <div class="tts-btn-row" style="margin:6px 0"><button class="btn btn-sm" data-qplay="${i}">🔊 听问题</button></div>
          ${q.opts.map((o, j) => `<button class="quiz-opt ${st.quiz[i] === true && q.ans === j ? 'correct' : ''} ${st.quiz[i] === false && st.quizPick && st.quizPick[i] === j ? 'wrong' : ''}" data-q="${i}" data-opt="${j}">${String.fromCharCode(65 + j)}. ${esc(o)}</button>`).join('')}
          <div id="qmsg-${i}" style="font-size:12px;margin-top:4px;color:var(--ink2)">${st.quiz[i] === true ? '✅ 答对了！' + esc(q.cn) : st.quiz[i] === false ? '再听一遍试试～' : ''}</div>
        </div>`).join('')}
    </div>

    <div class="card">
      <h3>🗣️ 口语跟读 <span class="sub">${st.speaking ? `已自评 ${st.speaking} 星` : '先听，再跟读，最后自评'}</span></h3>
      <div class="practice-box">
        ${pack.speaking.lines.map((l, i) => `
          <div style="margin-bottom:10px">
            <div style="font-weight:700;font-size:14px">${esc(l.en)}</div>
            <div class="muted">${esc(l.cn)}</div>
            <div class="btn-row" style="margin-top:5px"><button class="btn btn-sm btn-primary" data-sline="${i}">🔊 听一句</button></div>
          </div>`).join('')}
        <div class="q">🎤 开口练：${esc(pack.speaking.prompt)}</div>
        <div style="margin-top:10px">
          <div class="muted" style="margin-bottom:4px">跟读自评：</div>
          <div class="stars" id="engStars">
            ${[1, 2, 3, 4, 5].map(i => `<span data-s="${i}" class="${st.speaking >= i ? 'on' : ''}">⭐</span>`).join('')}
          </div>
        </div>
        <textarea class="input" id="engNote" rows="2" placeholder="记录今天听到/卡住的句子…" style="margin-top:10px;resize:vertical">${esc(st.note || '')}</textarea>
      </div>
    </div>`;

  const en = $('#body-english');
  $$('.tts-btn[data-w]', en).forEach(b => {
    const i = Number(b.dataset.w);
    b.onclick = () => playAudioFile([`audio/d${pack.day}-w${i}.mp3`, `d${pack.day}-w${i}.mp3`], () => playWord(pack.words[i].en, b), b);
  });
  $$('.tts-btn[data-clz]', en).forEach(b => {
    const i = Number(b.dataset.clz);
    b.onclick = () => playAudioFile([`audio/d${pack.day}-c${i}.mp3`, `d${pack.day}-c${i}.mp3`], () => speak(pack.cloze[i].s.replace(/\{[^}]+\}/g, '____'), 'en-US', b, st.rate), b, st.rate);
  });
  $$('[data-qplay]', en).forEach(b => {
    const i = Number(b.dataset.qplay);
    b.onclick = () => playAudioFile([`audio/d${pack.day}-q${i}.mp3`, `d${pack.day}-q${i}.mp3`], () => speak(pack.quiz[i].q, 'en-US', b, st.rate), b, st.rate);
  });
  $$('[data-sline]', en).forEach(b => {
    const i = Number(b.dataset.sline);
    b.onclick = () => playAudioFile([`audio/d${pack.day}-s${i}.mp3`, `d${pack.day}-s${i}.mp3`], () => speak(pack.speaking.lines[i].en, 'en-US', b, st.rate), b, st.rate);
  });
  $$('[data-learn]', en).forEach(b => b.onclick = () => {
    const s = engState(today);
    const i = Number(b.dataset.learn);
    s.words[i] = !s.words[i];
    setStore('wb.english.' + today, s);
    renderEnglish();
  });
  $$('[data-rate]', en).forEach(b => b.onclick = () => {
    const s = engState(today);
    s.rate = Number(b.dataset.rate);
    setStore('wb.english.' + today, s);
    renderEnglish();
  });
  $$('[data-check]', en).forEach(b => b.onclick = () => {
    const i = Number(b.dataset.check);
    const inp = $('#clz-' + i);
    const ans = inp.dataset.ans.toLowerCase().trim();
    const val = inp.value.trim().toLowerCase();
    const ok = val === ans;
    inp.classList.toggle('ok', ok);
    inp.classList.toggle('no', !ok);
    const s = engState(today);
    if (ok) {
      s.cloze[i] = true;
      setStore('wb.english.' + today, s);
      $('#msg-' + i).innerHTML = '<span style="color:var(--ok);font-weight:700">✅ 正确！</span> ' + esc(pack.cloze[i].cn);
      renderEnglish();
      confetti();
    } else {
      $('#msg-' + i).innerHTML = '<span style="color:var(--danger)">再听一遍，注意字母拼写～</span>';
      playAudioFile([`audio/d${pack.day}-c${i}.mp3`, `d${pack.day}-c${i}.mp3`], () => speak(pack.cloze[i].s.replace(/\{[^}]+\}/g, '____'), 'en-US', null, Math.max(0.6, st.rate - 0.15)), null, st.rate);
    }
  });
  $$('[data-skip]', en).forEach(b => b.onclick = () => {
    const i = Number(b.dataset.skip);
    $('#msg-' + i).innerHTML = '答案：<b>' + esc(pack.cloze[i].s.match(/\{([^}]+)\}/)[1]) + '</b> ' + esc(pack.cloze[i].cn);
  });
  $$('[data-show-cn]', en).forEach(b => b.onclick = () => {
    const s = engState(today);
    s.showCn = !s.showCn;
    setStore('wb.english.' + today, s);
    renderEnglish();
  });
  $$('[data-q]', en).forEach(b => b.onclick = () => {
    const i = Number(b.dataset.q);
    const j = Number(b.dataset.opt);
    const q = pack.quiz[i];
    const s = engState(today);
    s.quiz[i] = (j === q.ans);
    s.quizPick = s.quizPick || {};
    s.quizPick[i] = j;
    setStore('wb.english.' + today, s);
    renderEnglish();
    if (j === q.ans) { toast('答对了！' + q.cn); confetti(); }
    else { toast('再听一遍原文找答案～'); }
  });
  $('#engSaveUrl').onclick = () => {
    const s = engState(today);
    s.customUrl = $('#engCustomUrl').value.trim();
    setStore('wb.english.' + today, s);
    renderEnglish();
    toast('视频链接已保存 🎬');
  };
  $('#engToggleScript').onclick = () => {
    const s = engState(today);
    s.showScript = !s.showScript;
    setStore('wb.english.' + today, s);
    renderEnglish();
  };
  const subFile = $('#engSubFile');
  if (subFile) subFile.onchange = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const s = engState(today);
      s.subText = String(ev.target.result || '');
      s.subName = file.name;
      setStore('wb.english.' + today, s);
      renderEnglish();
      toast('字幕已导入，.mp4 直链播放时会显示 📁');
    };
    reader.readAsText(file);
  };
  const subClear = $('#engSubClear');
  if (subClear) subClear.onclick = () => {
    const s = engState(today);
    delete s.subText; delete s.subName;
    setStore('wb.english.' + today, s);
    renderEnglish();
    toast('已移除字幕');
  };
  const noVideoBtn = $('#engNoVideo');
  if (noVideoBtn) noVideoBtn.onclick = () => {
    const s = engState(today);
    s.noVideo = !s.noVideo;
    if (s.noVideo) s.showScript = true;
    setStore('wb.english.' + today, s);
    renderEnglish();
    toast(s.noVideo ? '已开启无视频模式 📖' : '已恢复视频 📺');
  };
  const packSel = $('#engPackSelect');
  if (packSel) packSel.onchange = () => {
    const target = Number(packSel.value);
    engOffset = ((target - ((dayOfYear() - 1) % ENGLISH_PACKS.length)) + ENGLISH_PACKS.length) % ENGLISH_PACKS.length;
    renderEnglish();
  };
  $$('[data-bkw]', en).forEach(p => p.onclick = () => {
    biliKw = p.dataset.bkw;
    renderEnglish();
    loadBili(biliKw);
  });
  const biliRefresh = $('#biliRefresh');
  if (biliRefresh) biliRefresh.onclick = () => loadBili(biliKw);
  const biliPinAdd = $('#biliPinAdd');
  if (biliPinAdd) biliPinAdd.onclick = () => {
    const u = $('#biliPinUrl').value.trim();
    const m = u.match(/(BV[\w]+)/);
    if (!m) { toast('没识别到 B站视频号（BV…）'); return; }
    const list = biliPinned();
    if (!list.includes(m[1])) list.push(m[1]);
    saveBiliPinned(list);
    $('#biliPinUrl').value = '';
    toast('已加入固定推荐 ⭐');
    loadBili(biliKw);
  };
  loadBili(biliKw);
  $$('#engStars span', en).forEach(s => s.onclick = () => {
    const v = Number(s.dataset.s);
    const st2 = engState(today);
    st2.speaking = st2.speaking === v ? 0 : v;
    setStore('wb.english.' + today, st2);
    renderEnglish();
  });
  const note = $('#engNote');
  if (note) note.onchange = () => {
    const st2 = engState(today);
    st2.note = note.value;
    setStore('wb.english.' + today, st2);
  };
  $('#engPrev').onclick = () => { engOffset = Math.max(0, engOffset - 1); renderEnglish(); };
  $('#engNext').onclick = () => { engOffset += 1; renderEnglish(); };
}

/* =========================================================
 * 5. 科研灵感：文献链接 + 标签
 * ========================================================= */
function papers() { return getStore('wb.papers', []); }
function savePapers(p) { setStore('wb.papers', p); renderResearch(); }
let researchTag = '全部';

function renderResearch() {
  const box = $('#body-research');
  const all = papers();
  const tags = ['全部'].concat(Array.from(new Set(all.flatMap(p => p.tags || []))));
  const list = researchTag === '全部' ? all : all.filter(p => (p.tags || []).includes(researchTag));
  box.innerHTML = `
    <div class="card">
      <h3>📚 文献收藏 <span class="sub">${all.length} 篇</span></h3>
      <div class="todo-add">
        <input class="input" id="ppUrl" placeholder="文献链接（arXiv / DOI / 期刊页…）" style="flex:2;min-width:170px">
        <input class="input" id="ppTitle" placeholder="标题（可选）" style="flex:2;min-width:150px">
        <input class="input" id="ppTags" placeholder="标签，逗号分隔，如：大模型,推理" style="flex:1;min-width:150px">
        <button class="btn btn-primary" id="ppAdd">＋ 收藏</button>
      </div>
      <input class="input" id="ppNote" placeholder="备注：为什么想读 / 灵感点…（可选）" style="margin-top:8px">
      <div class="tag-cloud">
        ${tags.map(t => `<span class="pill ${researchTag === t ? 'active' : ''}" data-tag="${esc(t)}">${esc(t)}</span>`).join('')}
      </div>
    </div>
    ${list.length ? list.map(p => `
      <div class="lib-card">
        <div class="lt">${p.star ? '⭐ ' : '📄 '}${esc(p.title || p.url)}</div>
        <div class="lm"><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.url)}</a></div>
        ${p.note ? `<div class="ln">📝 ${esc(p.note)}</div>` : ''}
        <div class="actions">
          ${(p.tags || []).map(t => `<span class="tag">#${esc(t)}</span>`).join('')}
          <span class="muted" style="margin-left:auto">${esc(p.date || '')}</span>
          <button class="btn btn-sm btn-ghost" data-star="${p.id}">${p.star ? '取消星标' : '⭐ 星标'}</button>
          <button class="btn btn-sm btn-ghost" data-del="${p.id}">🗑</button>
        </div>
      </div>`).join('') : '<p class="muted" style="text-align:center;padding:16px 0">还没有文献，收藏第一篇开始积累吧</p>'}
  `;
  $('#ppAdd').onclick = () => {
    const url = $('#ppUrl').value.trim();
    if (!url) { toast('请先粘贴文献链接'); return; }
    const p = {
      id: uid(), url, title: $('#ppTitle').value.trim(), note: $('#ppNote').value.trim(),
      tags: $('#ppTags').value.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      date: todayStr(), star: false
    };
    savePapers([p].concat(papers()));
    toast('已收藏文献 📚');
  };
  $$('[data-tag]').forEach(b => b.onclick = () => { researchTag = b.dataset.tag; renderResearch(); });
  $$('[data-del]').forEach(b => b.onclick = () => savePapers(papers().filter(p => p.id !== b.dataset.del)));
  $$('[data-star]').forEach(b => b.onclick = () => {
    const list2 = papers().map(p => p.id === b.dataset.star ? Object.assign({}, p, { star: !p.star }) : p);
    savePapers(list2);
  });
}

/* =========================================================
 * 6. 剪辑灵感：抖音/小红书链接 + 简易标签
 * ========================================================= */
function ideas() { return getStore('wb.ideas', []); }
function saveIdeas(v) { setStore('wb.ideas', v); renderEditing(); }
let editingTag = '全部';

function detectPlatform(u) {
  if (/douyin\.com|iesdouyin/i.test(u)) return '抖音';
  if (/xiaohongshu\.com|xhslink/i.test(u)) return '小红书';
  if (/youtube\.com|youtu\.be/i.test(u)) return 'YouTube';
  if (/bilibili\.com|b23\.tv/i.test(u)) return 'B站';
  return '其他';
}
function platformBadge(p) {
  const map = { 抖音: 'src-badge', 小红书: 'src-badge xhs', YouTube: 'src-badge yt', B站: 'src-badge bili', 其他: 'src-badge other' };
  return `<span class="${map[p] || 'src-badge other'}">${p}</span>`;
}

function renderEditing() {
  const box = $('#body-editing');
  const all = ideas();
  const tags = ['全部'].concat(Array.from(new Set(all.flatMap(v => v.tags || []))));
  const list = editingTag === '全部' ? all : all.filter(v => (v.tags || []).includes(editingTag));
  box.innerHTML = `
    <div class="card">
      <h3>✂️ 灵感收藏 <span class="sub">${all.length} 条</span></h3>
      <div class="todo-add">
        <input class="input" id="idUrl" placeholder="粘贴抖音 / 小红书分享链接" style="flex:2;min-width:180px">
        <input class="input" id="idTitle" placeholder="这条灵感是什么？（可选）" style="flex:1;min-width:140px">
        <input class="input" id="idTags" placeholder="标签，逗号分隔，如：转场,卡点" style="flex:1;min-width:140px">
        <button class="btn btn-primary" id="idAdd">＋ 收藏</button>
      </div>
      <div class="tag-cloud">
        ${tags.map(t => `<span class="pill ${editingTag === t ? 'active' : ''}" data-tag="${esc(t)}">${esc(t)}</span>`).join('')}
      </div>
    </div>
    ${list.length ? list.map(v => `
      <div class="lib-card">
        <div class="lt">${platformBadge(v.platform)} ${esc(v.title || '未命名灵感')}</div>
        <div class="lm"><a href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.url)}</a></div>
        <div class="actions">
          ${(v.tags || []).map(t => `<span class="tag">#${esc(t)}</span>`).join('')}
          <span class="muted" style="margin-left:auto">${esc(v.date || '')}</span>
          <button class="btn btn-sm btn-ghost" data-del="${v.id}">🗑</button>
        </div>
      </div>`).join('') : '<p class="muted" style="text-align:center;padding:16px 0">还没有灵感，去刷一条收藏回来吧 ✂️</p>'}
  `;
  $('#idAdd').onclick = () => {
    const url = $('#idUrl').value.trim();
    if (!url) { toast('请先粘贴分享链接'); return; }
    const v = {
      id: uid(), url, title: $('#idTitle').value.trim(),
      tags: $('#idTags').value.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      platform: detectPlatform(url), date: todayStr()
    };
    saveIdeas([v].concat(ideas()));
    toast(`已收藏（${v.platform}）✂️`);
  };
  $$('[data-tag]').forEach(b => b.onclick = () => { editingTag = b.dataset.tag; renderEditing(); });
  $$('[data-del]').forEach(b => b.onclick = () => saveIdeas(ideas().filter(v => v.id !== b.dataset.del)));
}

/* =========================================================
 * 7. 自媒体工作台：发布计划 + 提醒 + 数据分析建议
 * ========================================================= */
function plans() { return getStore('wb.plans', []); }
function savePlans(p) { setStore('wb.plans', p); renderMedia(); }
function mediaData() { return getStore('wb.mediaData', {}); }
function saveMediaData(d) { setStore('wb.mediaData', d); renderMedia(); }

function checkDuePlans() {
  const today = todayStr();
  const due = plans().filter(p => p.date === today && p.status !== '已发布');
  const notified = getStore('wb.notified', []);
  if (due.length) {
    toast(`📢 今天有 ${due.length} 个内容要发布/剪辑，去自媒体模块看看`);
    due.forEach(p => {
      if (!notified.includes(p.id) && 'Notification' in window && Notification.permission === 'granted') {
        try { new Notification('📢 自媒体提醒', { body: `${p.title} 今天（${p.date}）要${p.status === '已发布' ? '发布' : '处理'}啦！` }); } catch (e) { /* 忽略 */ }
        notified.push(p.id);
        setStore('wb.notified', notified);
      }
    });
  }
}

function renderMedia() {
  const box = $('#body-media');
  const today = todayStr();
  const all = plans().slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const dueToday = all.filter(p => p.date === today && p.status !== '已发布');
  const data = mediaData();
  const records = Object.entries(data).flatMap(([postId, rs]) => rs.map(r => Object.assign({ postId }, r))).sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const planHtml = all.length ? all.map(p => {
    const isDue = p.date === today && p.status !== '已发布';
    const cls = p.status === '已发布' ? 'done' : isDue ? 'due' : '';
    return `<div class="media-plan ${cls}">
      <div class="pt">${isDue ? '🔔 ' : ''}${esc(p.title)}</div>
      <div class="pm">
        <span>${esc(p.platform)} · ${esc(p.type)}</span>
        <span>📅 ${esc(p.date)}</span>
        <span class="status-chip ${esc(p.status)}">${esc(p.status)}</span>
        ${p.note ? `<span class="muted">${esc(p.note)}</span>` : ''}
      </div>
      <div class="actions">
        <button class="btn btn-sm" data-next="${p.id}">➡ 状态 → 下一阶段</button>
        <button class="btn btn-sm btn-ghost" data-del="${p.id}">🗑</button>
      </div>
    </div>`;
  }).join('') : '<p class="muted" style="text-align:center;padding:16px 0">还没有发布计划，先加一个吧 🚀</p>';

  const stats = calcMediaStats(records, all);
  const chart = renderMediaChart(records.slice(-10));

  box.innerHTML = `
    <div class="card">
      <h3>📅 发布计划 <span class="sub">${dueToday.length ? `今天有 ${dueToday.length} 个待处理 🔔` : '暂无今日待发布'}</span></h3>
      <div class="todo-add">
        <input class="input" id="mpTitle" placeholder="内容标题，如：六级听力技巧分享" style="flex:2;min-width:150px">
        <select class="select" id="mpPlatform">${MEDIA_PLATFORMS.map(p => `<option>${p}</option>`).join('')}</select>
        <select class="select" id="mpType"><option>视频</option><option>图文</option></select>
        <input class="input" type="date" id="mpDate" value="${today}" style="max-width:150px">
        <select class="select" id="mpStatus">${MEDIA_STATUS.map(s => `<option>${s}</option>`).join('')}</select>
        <button class="btn btn-primary" id="mpAdd">＋ 添加</button>
      </div>
      <input class="input" id="mpNote" placeholder="备注：脚本进度、素材清单…（可选）" style="margin-top:8px">
      <div class="btn-row" style="margin-top:10px">
        <button class="btn btn-sm" id="mpNotify">${'Notification' in window && Notification.permission === 'granted' ? '🔔 提醒已开启' : '🔕 开启浏览器提醒'}</button>
      </div>
      <div style="margin-top:12px">${planHtml}</div>
    </div>

    <div class="card">
      <h3>📊 数据记录与分析 <span class="sub">${records.length} 条记录</span></h3>
      <div class="todo-add">
        <select class="select" id="mdPost" style="flex:1;min-width:140px">
          <option value="">— 选择已发布内容 —</option>
          ${all.filter(p => p.status === '已发布').map(p => `<option value="${p.id}">${esc(p.title)}</option>`).join('')}
        </select>
        <input class="input" type="date" id="mdDate" value="${today}" style="max-width:145px">
        <input class="input" type="number" id="mdViews" placeholder="播放/浏览" style="max-width:105px">
        <input class="input" type="number" id="mdLikes" placeholder="点赞" style="max-width:90px">
        <input class="input" type="number" id="mdComments" placeholder="评论" style="max-width:90px">
        <input class="input" type="number" id="mdFavs" placeholder="收藏" style="max-width:90px">
        <button class="btn btn-primary" id="mdAdd">＋ 记录</button>
      </div>
      <div class="stat-cards" style="margin-top:12px">
        <div class="stat"><div class="v">${stats.views}</div><div class="l">总播放/浏览</div></div>
        <div class="stat"><div class="v">${stats.eng}%</div><div class="l">平均互动率</div></div>
        <div class="stat"><div class="v">${stats.best || '—'}</div><div class="l">最佳内容</div></div>
        <div class="stat"><div class="v">${stats.avg}</div><div class="l">单条平均播放</div></div>
      </div>
      ${chart}
      <div class="suggest-box" style="margin-top:10px">${stats.suggestions}</div>
    </div>`;

  $('#mpAdd').onclick = () => {
    const title = $('#mpTitle').value.trim();
    if (!title) { toast('请填写内容标题'); return; }
    const p = { id: uid(), title, platform: $('#mpPlatform').value, type: $('#mpType').value, date: $('#mpDate').value || today, status: $('#mpStatus').value, note: $('#mpNote').value.trim() };
    savePlans([p].concat(plans()));
    toast('已加入发布计划 📅');
  };
  $('#mpNotify').onclick = async () => {
    if (!('Notification' in window)) { toast('当前浏览器不支持通知'); return; }
    if (Notification.permission === 'granted') { toast('提醒已开启 🔔'); return; }
    const r = await Notification.requestPermission();
    toast(r === 'granted' ? '提醒已开启 🔔' : '未授权，可在浏览器设置里开启');
    renderMedia();
  };
  $$('[data-next]').forEach(b => b.onclick = () => {
    const list2 = plans().map(p => {
      if (p.id !== b.dataset.next) return p;
      const idx = MEDIA_STATUS.indexOf(p.status);
      return Object.assign({}, p, { status: MEDIA_STATUS[Math.min(idx + 1, MEDIA_STATUS.length - 1)] });
    });
    savePlans(list2);
    const cur = plans().find(p => p.id === b.dataset.next);
    if (cur && cur.status === '已发布') confetti();
  });
  $$('[data-del]').forEach(b => b.onclick = () => savePlans(plans().filter(p => p.id !== b.dataset.del)));
  $('#mdAdd').onclick = () => {
    const postId = $('#mdPost').value;
    const views = Number($('#mdViews').value);
    if (!postId) { toast('请先选择内容'); return; }
    if (!views || views < 0) { toast('请填写播放量'); return; }
    const rec = { date: $('#mdDate').value || today, views, likes: Number($('#mdLikes').value) || 0, comments: Number($('#mdComments').value) || 0, favs: Number($('#mdFavs').value) || 0 };
    const d = mediaData();
    d[postId] = d[postId] || [];
    d[postId].push(rec);
    saveMediaData(d);
    toast('数据已记录 📊');
  };
}

function calcMediaStats(records, all) {
  const s = { views: 0, likes: 0, comments: 0, favs: 0, best: null, bestViews: -1, eng: 0, avg: 0, suggestions: [] };
  records.forEach(r => {
    s.views += r.views || 0; s.likes += r.likes || 0; s.comments += r.comments || 0; s.favs += r.favs || 0;
    if ((r.views || 0) > s.bestViews) { s.bestViews = r.views || 0; const p = all.find(x => x.id === r.postId); s.best = p ? p.title : '(已删除)'; }
  });
  s.eng = s.views ? ((s.likes + s.comments + s.favs) / s.views * 100).toFixed(1) : 0;
  s.avg = records.length ? Math.round(s.views / records.length) : 0;
  if (!records.length) {
    s.suggestions.push('还没有数据记录。发布后回来添加播放/点赞/评论/收藏，我会帮你分析。');
  } else {
    if (s.eng < 2) s.suggestions.push(`<b>互动率偏低（${s.eng}%）</b>：试着在结尾加一句提问或引导收藏，封面字更大更直白，标题给出具体收益（如“听完这 5 句，六级听力不再慌”）。`);
    else if (s.eng >= 8) s.suggestions.push(`<b>互动率不错（${s.eng}%）</b>：保持节奏，多发同系列内容；记得逐条回复评论，进一步撬动推荐。`);
    else s.suggestions.push(`互动率 ${s.eng}% 处于正常区间，可尝试把高互动内容的开头 3 秒复制到新选题里。`);
    const sorted = records.slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (sorted.length >= 2) {
      const last = sorted[sorted.length - 1], prev = sorted[sorted.length - 2];
      const diff = (last.views || 0) - (prev.views || 0);
      if (diff > 0) s.suggestions.push(`<b>播放上升趋势</b>：最新记录比上一条多 ${diff} 播放，选题方向被验证，建议趁热出续集。`);
      else if (diff < 0) s.suggestions.push(`<b>播放回落（-${Math.abs(diff)}）</b>：别灰心，对比一下高播放内容的标题/封面差异，把有效元素迁移过来。`);
      else s.suggestions.push('播放量与上一条持平，试试更换发布时间或加一个互动钩子。');
    }
    const publishing = all.filter(p => p.status === '已发布').length;
    if (all.length && !publishing) s.suggestions.push('有计划但还没有标记“已发布”，发布后记得回来记录数据。');
    const drafts = all.filter(p => p.status === '草稿').length;
    if (drafts >= 3) s.suggestions.push(`草稿攒了 ${drafts} 条，建议挑 1 条今天先剪完发布，降低库存压力。`);
  }
  s.suggestions = s.suggestions.map(t => `• ${t}`).join('<br>');
  return s;
}

function renderMediaChart(records) {
  if (!records.length) return '';
  const max = Math.max(...records.map(r => r.views || 0), 1);
  const w = Math.max(280, records.length * 42);
  const bw = 26;
  const bars = records.map((r, i) => {
    const h = Math.max(3, (r.views || 0) / max * 92);
    const x = 34 + i * (w - 60) / Math.max(records.length, 1);
    return `<rect class="bar" x="${x}" y="${102 - h}" width="${bw}" height="${h}" rx="4">
      <title>${esc(r.date)}：${r.views} 播放</title></rect>
      <text x="${x + bw / 2}" y="116" text-anchor="middle">${(r.date || '').slice(5)}</text>`;
  }).join('');
  return `<svg class="data-chart" viewBox="0 0 ${w} 124" role="img" aria-label="播放量趋势图">
    <line class="axis" x1="28" y1="8" x2="28" y2="104"/><line class="axis" x1="28" y1="104" x2="${w - 6}" y2="104"/>
    ${bars}
  </svg>`;
}

/* =========================================================
 * 8. 记账：支出/收入，金额默认隐藏
 * ========================================================= */
function ledger() { return getStore('wb.ledger', []); }
function saveLedger(l) { setStore('wb.ledger', l); renderLedger(); }
function ledgerVisible() { return getStore('wb.ledger.show', false); }
let ledgerMonth = monthKey();
let ledgerType = '支出';

function renderLedger() {
  const box = $('#body-ledger');
  const show = ledgerVisible();
  const all = ledger().filter(x => (x.date || '').startsWith(ledgerMonth));
  const income = all.filter(x => x.type === '收入').reduce((a, x) => a + Number(x.amount || 0), 0);
  const expense = all.filter(x => x.type === '支出').reduce((a, x) => a + Number(x.amount || 0), 0);
  const balance = income - expense;
  const mm = n => show ? `<span class="amount">¥ ${fmtMoney(n)}</span>` : '<span class="masked">¥ ···</span>';
  const expByCat = {};
  all.filter(x => x.type === '支出').forEach(x => { expByCat[x.cat] = (expByCat[x.cat] || 0) + Number(x.amount || 0); });
  const maxCat = Math.max(...Object.values(expByCat), 1);
  const catRows = Object.entries(expByCat).sort((a, b) => b[1] - a[1]).map(([c, v]) => `
    <div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;font-size:12.5px"><span>${esc(c)}</span><b>${show ? '¥ ' + fmtMoney(v) : '¥ ···'}</b></div>
      <div class="stat-bar"><i style="width:${v / maxCat * 100}%"></i></div>
    </div>`).join('');
  const rows = all.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(x => `
    <div class="ledger-row">
      <span class="ico">${x.type === '支出' ? '💸' : '💰'}</span>
      <div class="mid">
        <b>${esc(x.note || x.cat)}</b>
        <div class="cat">${esc(x.type)} · ${esc(x.cat)} · ${esc(x.date || '')}</div>
      </div>
      <span class="amount ${x.type === '支出' ? 'out' : 'in'}">${show ? (x.type === '支出' ? '-' : '+') + ' ¥ ' + fmtMoney(x.amount) : '<span class="masked">¥ ···</span>'}</span>
      <button class="todo-del" data-del="${x.id}">🗑</button>
    </div>`).join('') || '<p class="muted" style="text-align:center;padding:14px 0">这个月还没有记录</p>';

  box.innerHTML = `
    <div class="card">
      <div class="pack-head">
        <h3>📒 记账 <span class="sub">金额默认隐藏，点眼睛查看</span></h3>
        <button class="eye-btn" id="lgEye" aria-label="显示金额">${show ? '🙈 隐藏' : '👁️ 显示'}</button>
      </div>
      <div class="todo-add">
        <input class="input" type="month" id="lgMonth" value="${ledgerMonth}" style="max-width:150px">
        <div class="ledger-opt" style="display:flex;align-items:center">
          ${['支出', '收入'].map(t => `<span class="pill ${ledgerType === t ? 'active' : ''}" data-type="${t}">${t}</span>`).join('')}
        </div>
        <input class="input" type="number" id="lgAmount" placeholder="金额" min="0" step="0.01" style="max-width:120px">
        <select class="select" id="lgCat">${(LEDGER_CATS[ledgerType] || []).map(c => `<option>${c}</option>`).join('')}</select>
        <input class="input" type="date" id="lgDate" value="${todayStr()}" style="max-width:145px">
        <button class="btn btn-primary" id="lgAdd">＋ 记一笔</button>
      </div>
      <input class="input" id="lgNote" placeholder="备注（可选），如：午饭、房租、工资…" style="margin-top:8px">
    </div>
    <div class="stat-cards">
      <div class="stat"><div class="v out">${mm(expense)}</div><div class="l">本月支出</div></div>
      <div class="stat"><div class="v in">${mm(income)}</div><div class="l">本月收入</div></div>
      <div class="stat"><div class="v">${mm(balance)}</div><div class="l">本月结余</div></div>
      <div class="stat"><div class="v">${all.length}</div><div class="l">记录笔数</div></div>
    </div>
    ${Object.keys(expByCat).length ? `<div class="card"><h3>📊 支出分类</h3>${catRows}</div>` : ''}
    <div class="card"><h3>📋 明细（${monthCN(ledgerMonth)}）</h3>${rows}</div>
  `;
  $('#lgEye').onclick = () => { setStore('wb.ledger.show', !show); renderLedger(); };
  $('#lgMonth').onchange = () => { ledgerMonth = $('#lgMonth').value; renderLedger(); };
  $$('[data-type]').forEach(b => b.onclick = () => { ledgerType = b.dataset.type; renderLedger(); });
  $('#lgAdd').onclick = () => {
    const amount = Number($('#lgAmount').value);
    if (!amount || amount <= 0) { toast('请输入金额'); return; }
    const rec = { id: uid(), type: ledgerType, cat: $('#lgCat').value, amount, date: $('#lgDate').value || todayStr(), note: $('#lgNote').value.trim() };
    saveLedger([rec].concat(ledger()));
    toast(`${ledgerType}已记录 ✅`);
  };
  $$('[data-del]').forEach(b => b.onclick = () => saveLedger(ledger().filter(x => x.id !== b.dataset.del)));
}

/* =========================================================
 * 9. 个人设置
 * ========================================================= */
function renderSettings() {
  const box = $('#body-settings');
  const p = getProfile();
  const star = getStore('wb.starImage', null);
  box.innerHTML = `
    <div class="grid2">
      <div class="card">
        <h3>👤 我的资料</h3>
        <div class="set-row"><span class="lbl">八字 / 出生资料<span class="sub">运势按此排盘，每天更新</span></span>
          <button class="btn btn-sm btn-primary" id="setProfile">${p && p.birth ? '修改资料' : '去填写'}</button></div>
        ${p && p.birth ? `<div class="set-row"><span class="lbl">当前资料<span class="sub">${esc(p.name || '未命名')} · ${esc(p.birth)} ${esc(p.time || '—')} · ${esc(p.gender || '')} · 生肖 ${esc(zodiacOf(p))}</span></div>` : ''}
        <div class="set-row"><span class="lbl">喝水目标<span class="sub">每日目标毫升数</span></span>
          <input class="input" type="number" id="setWater" value="${(p && p.water) || 2000}" style="max-width:110px">
          <button class="btn btn-sm" id="setWaterBtn">保存</button></div>
        <div class="set-row"><span class="lbl">体重（估算消耗用）<span class="sub">单位 kg</span></span>
          <input class="input" type="number" id="setWeight" value="${(p && p.weight) || 60}" style="max-width:110px">
          <button class="btn btn-sm" id="setWeightBtn">保存</button></div>
      </div>
      <div class="card">
        <h3>⭐ 星星人头像（圆形）</h3>
        <p class="hint" style="margin-bottom:10px">上传你自己的星星人图片后，顶部会用它替换默认形象（图片仅保存在本机浏览器）。</p>
        <div class="star-preview" id="starPreview">${star ? `<img src="${star}" alt="我的星星人">` : starSvg({ c1: '#ffd75e', c2: '#ffe9a8', emoji: '🧳' })}</div>
        <div class="btn-row" style="margin-top:10px">
          <button class="btn btn-sm" id="setStarBtn">📷 上传图片</button>
          <button class="btn btn-sm btn-ghost" id="setStarClear">恢复默认</button>
        </div>
        <input type="file" id="starFile" accept="image/*" hidden>
      </div>
    </div>
    <div class="card">
      <h3>🗄️ 数据管理 <span class="sub">待办、喝水、学习记录等保存在浏览器本地</span></h3>
      <div class="btn-row">
        <button class="btn btn-sm" id="setExport">📤 导出数据</button>
        <button class="btn btn-sm" id="setImportBtn">📥 导入数据</button>
        <button class="btn btn-sm btn-danger" id="setClear">🗑 清空全部数据</button>
      </div>
      <input type="file" id="importFile" accept="application/json" hidden>
      <p class="rss-note" style="margin-top:8px">版本 v${APP_VERSION} · 手机访问：和电脑连同一 Wi-Fi，启动 start.bat 后用手机浏览器打开显示的网址（或扫 outputs 里的二维码）。</p>
    </div>`;
  $('#setProfile').onclick = openProfileModal;
  $('#setWaterBtn').onclick = () => {
    const q = Number($('#setWater').value);
    if (!q || q < 500) { toast('目标需 ≥ 500ml'); return; }
    const prof = getProfile() || {};
    prof.water = q;
    saveProfile(prof);
    toast('喝水目标已保存 💧');
  };
  $('#setWeightBtn').onclick = () => {
    const w = Number($('#setWeight').value);
    if (!w || w < 20) { toast('请输入有效体重'); return; }
    const prof = getProfile() || {};
    prof.weight = w;
    saveProfile(prof);
    toast('体重已保存 ⚖️');
  };
  $('#setStarBtn').onclick = () => $('#starFile').click();
  $('#starFile').onchange = uploadStarImage;
  $('#setStarClear').onclick = () => {
    localStorage.removeItem('wb.starImage');
    applyStarImage();
    renderSettings();
    toast('已恢复默认星星人');
  };
  $('#setExport').onclick = exportData;
  $('#setImportBtn').onclick = () => $('#importFile').click();
  $('#importFile').onchange = importData;
  $('#setClear').onclick = () => {
    confirmDlg('清空数据', '将删除本机保存的全部待办、记录和资料，且无法恢复。确定继续吗？', () => {
      Object.keys(localStorage).filter(k => k.startsWith('wb.')).forEach(k => localStorage.removeItem(k));
      location.reload();
    });
  };
}

function openProfileModal() {
  const p = getProfile() || {};
  $('#pfName').value = p.name || '';
  $('#pfBirth').value = p.birth || '';
  $('#pfTime').value = p.time || '08:00';
  $('#pfGender').value = p.gender || '男';
  $('#pfWater').value = p.water || 2000;
  $('#profileModal').hidden = false;
}

function bindModalClose() {
  $$('.modal').forEach(m => {
    $$('[data-close]', m).forEach(b => b.onclick = () => { m.hidden = true; });
    m.addEventListener('click', e => { if (e.target === m) m.hidden = true; });
  });
}

function uploadStarImage(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { toast('请选择图片文件'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const max = 320;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setStore('wb.starImage', canvas.toDataURL('image/png'));
      applyStarImage();
      renderSettings();
      toast('星星人头像已更新 ⭐');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function exportData() {
  const out = { app: 'travel-star-workbench', version: APP_VERSION, exported: new Date().toISOString() };
  Object.keys(localStorage).filter(k => k.startsWith('wb.')).forEach(k => { out[k] = localStorage.getItem(k); });
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `workbench-backup-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('数据已导出 📤');
}

function importData(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      let n = 0;
      Object.entries(data).forEach(([k, v]) => {
        if (k.startsWith('wb.')) { localStorage.setItem(k, v); n++; }
      });
      toast(`已导入 ${n} 条数据，正在刷新…`);
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      toast('导入失败：文件格式不正确');
    }
  };
  reader.readAsText(file);
}

/* =========================================================
 * 初始化
 * ========================================================= */
function setDateBadges() {
  const d = dateCN();
  const td = $('#topDate');
  if (td) td.textContent = d;
  $$('.date-badge').forEach(el => el.textContent = d);
}

function init() {
  setDateBadges();
  renderMascots();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* 本地 http 环境忽略 */ });
  }

  $$('.nav-item').forEach(b => b.onclick = () => showModule(b.dataset.mod));
  $$('.bn-item').forEach(b => b.onclick = () => showModule(b.dataset.mod));
  $('#bnMore').onclick = openDrawer;
  $('#closeSidebar').onclick = closeDrawer;
  $('#sidebarOverlay').onclick = closeDrawer;

  bindModalClose();
  $('#pfSave').onclick = () => {
    const birth = $('#pfBirth').value;
    if (!birth) { toast('请选择出生日期'); return; }
    const p = {
      name: $('#pfName').value.trim() || '旅行星人',
      birth,
      time: $('#pfTime').value || '12:00',
      gender: $('#pfGender').value,
      water: Number($('#pfWater').value) || 2000,
      weight: (getProfile() && getProfile().weight) || 60
    };
    saveProfile(p);
    $('#profileModal').hidden = true;
    toast('资料已保存，运势已按你的八字更新 🔮');
    renderFitness();
  };

  renderFortune();
  renderTodo();
  renderFitness();
  renderEnglish();
  renderResearch();
  renderEditing();
  renderMedia();
  renderLedger();
  renderSettings();
  checkDuePlans();
}

document.addEventListener('DOMContentLoaded', init);
