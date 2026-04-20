/* ============================================================
   ELVONIS CORE — shared across all pages
   • Bilingual EN/ZH with browser-lang auto-detect
   • Mobile nav (drawer)
   • Language-aware WhatsApp message
   • Scroll-reveal
   • Sticky nav shadow on scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. LANGUAGE SYSTEM ─────────────────────────────── */
  const htmlTag   = document.documentElement;
  const LANG_KEY  = 'elvonis_lang';

  function detectInitialLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return nav.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

  function applyLang(lang) {
    htmlTag.setAttribute('lang', lang);
    localStorage.setItem(LANG_KEY, lang);
    document.dispatchEvent(new CustomEvent('elvonis:langchange', {detail:{lang:lang}}));

    /* Update every toggle-button label */
    document.querySelectorAll('.lang-toggle-label').forEach(el => {
      el.textContent = lang === 'en' ? '中文' : 'English';
    });

    /* Sync desktop + mobile active pills */
    document.querySelectorAll('.lang-pill').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('lang-pill-active', isActive);
      btn.classList.toggle('lang-pill-inactive', !isActive);
    });

    /* Update mobile drawer lang buttons */
    document.querySelectorAll('[data-lang-drawer]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langDrawer === lang);
    });

    /* Sync WhatsApp link language */
    document.querySelectorAll('.wa-link').forEach(a => {
      const msg = lang === 'zh'
        ? 'Hi%20ELVONIS%EF%BC%8C%E6%88%91%E5%AF%B9%E8%B4%B5%E5%85%AC%E5%8F%B8%E7%9A%84%E5%95%86%E7%94%A8%E6%B8%85%E6%B4%81%E8%AE%BE%E5%A4%87%E6%84%9F%E5%85%B4%E8%B6%A3%EF%BC%8C%E6%83%B3%E8%BF%9B%E4%B8%80%E6%AD%A5%E4%BA%86%E8%A7%A3%E3%80%82'
        : 'Hi%20ELVONIS%20team%2C%20I%27m%20interested%20in%20your%20B2B%20cleaning%20equipment.';
      a.href = `https://wa.me/+8618057039893?text=${msg}`;
    });
  }

  /* Init */
  let currentLang = detectInitialLang();
  applyLang(currentLang);

  /* Click handlers */
  document.querySelectorAll('.lang-pill, [data-lang-drawer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.lang || btn.dataset.langDrawer;
      if (target && target !== currentLang) {
        currentLang = target;
        applyLang(currentLang);
        /* Close drawer if open */
        const drawer = document.getElementById('mobile-drawer');
        if (drawer) drawer.classList.add('hidden');
      }
    });
  });

  /* Legacy .lang-toggle-btn support */
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      applyLang(currentLang);
    });
  });


  /* ── 2. MOBILE NAV DRAWER ───────────────────────────── */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const drawer        = document.getElementById('mobile-drawer');
  const iconOpen      = document.getElementById('menu-icon-open');
  const iconClose     = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && drawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = drawer.classList.contains('hidden');
      drawer.classList.toggle('hidden', !isHidden);
      if (iconOpen)  iconOpen.classList.toggle('hidden', !isHidden);
      if (iconClose) iconClose.classList.toggle('hidden', isHidden);
    });
    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        drawer.classList.add('hidden');
        if (iconOpen)  iconOpen.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
      }
    });
  }


  /* ── 3. STICKY NAV SHADOW ───────────────────────────── */
  const navbar = document.getElementById('main-nav');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('shadow-md', window.scrollY > 8);
    }, { passive: true });
  }


  /* ── 4. SCROLL REVEAL ───────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }


  /* ── 5. RECOMMENDATION TOOL (index only) ────────────── */
  const recBtn = document.getElementById('rec-btn');
  const recOut = document.getElementById('rec-output');
  if (recBtn && recOut) {
    recBtn.addEventListener('click', () => {
      const app  = document.getElementById('sel-app')?.value  || '';
      const size = document.getElementById('sel-size')?.value || '';
      const goal = document.getElementById('sel-goal')?.value || '';
      const lang = htmlTag.getAttribute('lang') || 'en';

      /* Simple mapping table */
      const map = {
        en: {
          heavy:   { title: 'Heavy-Duty Ride-On Scrubber', model: 'EV-RS Series', note: 'Best for large industrial floors with heavy grease & soiling. Ride-on for maximum efficiency.' },
          labor:   { title: 'Autonomous Scrubber Robot',   model: 'EV-AR Series', note: 'AI-navigated robot that operates unmanned, dramatically reducing labour costs.' },
          hygiene: { title: 'HEPA Walk-Behind Scrubber',   model: 'EV-WS-H Series', note: 'Ultra-quiet (<58 dB) with H14 HEPA filtration. Ideal for healthcare environments.' },
          oem:     { title: 'Full OEM / ODM Program',      model: 'All Series',   note: 'We manufacture under your brand. Custom spec, colour, and packaging from MOQ 20 units.' },
          default: { title: 'Walk-Behind Floor Scrubber',  model: 'EV-WS Series', note: 'Versatile all-rounder for medium facilities. Multiple brush configs available.' },
        },
        zh: {
          heavy:   { title: '重型驾驶式洗地机', model: 'EV-RS 系列', note: '专为承受重度污染的大型工业地面设计，驾驶式操作，效率最高。' },
          labor:   { title: '自主清洁机器人', model: 'EV-AR 系列', note: 'AI 导航、无人驾驶作业，显著降低人工成本。' },
          hygiene: { title: 'HEPA 步行式洗地机', model: 'EV-WS-H 系列', note: '超低噪音 (<58 dB)，H14 HEPA 过滤，专为医疗场景设计。' },
          oem:     { title: '全套 OEM / ODM 合作方案', model: '全系列', note: '贴牌代工，从规格、颜色到包装全面定制，起订量低至 20 台。' },
          default: { title: '步行式洗地机', model: 'EV-WS 系列', note: '中型场所的通用首选，多种刷盘配置，适配性强。' },
        }
      };

      let key = 'default';
      if (goal.includes('Grease') || goal.includes('油污')) key = 'heavy';
      else if (goal.includes('Labor') || goal.includes('人工')) key = 'labor';
      else if (goal.includes('Hygiene') || goal.includes('卫生')) key = 'hygiene';
      else if (goal.includes('OEM') || goal.includes('代工')) key = 'oem';

      const t = map[lang] || map.en;
      const r = t[key] || t.default;

      recOut.innerHTML = lang === 'zh'
        ? `<div class="flex items-start gap-4">
             <div class="w-10 h-10 rounded-full bg-[#1a2a3a] flex items-center justify-center flex-shrink-0 mt-1">
               <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
             </div>
             <div class="text-left">
               <p class="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">推荐方案</p>
               <p class="text-xl font-bold text-[#1a2a3a] mb-1">${r.title}</p>
               <p class="text-sm text-gray-500 font-medium mb-2">型号：${r.model}</p>
               <p class="text-sm text-gray-600">${r.note}</p>
               <a href="contact.html" class="inline-block mt-4 bg-[#1a2a3a] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-blue-600 transition">获取专属报价 →</a>
             </div>
           </div>`
        : `<div class="flex items-start gap-4">
             <div class="w-10 h-10 rounded-full bg-[#1a2a3a] flex items-center justify-center flex-shrink-0 mt-1">
               <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
             </div>
             <div class="text-left">
               <p class="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Our Recommendation</p>
               <p class="text-xl font-bold text-[#1a2a3a] mb-1">${r.title}</p>
               <p class="text-sm text-gray-500 font-medium mb-2">Model: ${r.model}</p>
               <p class="text-sm text-gray-600">${r.note}</p>
               <a href="contact.html" class="inline-block mt-4 bg-[#1a2a3a] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-blue-600 transition">Get a Tailored Quote →</a>
             </div>
           </div>`;

      recOut.classList.remove('hidden');
      recOut.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

});
