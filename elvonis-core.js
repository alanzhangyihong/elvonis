/* ============================================================
   ELVONIS CORE — shared across all pages
   (complete file, updated with polish recommendation fix)
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

    document.querySelectorAll('.lang-toggle-label').forEach(el => {
      el.textContent = lang === 'en' ? '中文' : 'English';
    });

    document.querySelectorAll('.lang-pill').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('lang-pill-active', isActive);
      btn.classList.toggle('lang-pill-inactive', !isActive);
    });

    document.querySelectorAll('[data-lang-drawer]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langDrawer === lang);
    });

    document.querySelectorAll('.wa-link').forEach(a => {
      const msg = lang === 'zh'
        ? 'Hi%20ELVONIS%EF%BC%8C%E6%88%91%E5%AF%B9%E8%B4%B5%E5%85%AC%E5%8F%B8%E7%9A%84%E5%95%86%E7%94%A8%E6%B8%85%E6%B4%81%E8%AE%BE%E5%A4%87%E6%84%9F%E5%85%B4%E8%B6%A3%EF%BC%8C%E6%83%B3%E8%BF%9B%E4%B8%80%E6%AD%A5%E4%BA%86%E8%A7%A3%E3%80%82'
        : 'Hi%20ELVONIS%20team%2C%20I%27m%20interested%20in%20your%20B2B%20cleaning%20equipment.';
      a.href = `https://wa.me/+8618057039893?text=${msg}`;
    });
  }

  let currentLang = detectInitialLang();
  applyLang(currentLang);

  document.querySelectorAll('.lang-pill, [data-lang-drawer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.lang || btn.dataset.langDrawer;
      if (target && target !== currentLang) {
        currentLang = target;
        applyLang(currentLang);
        const drawer = document.getElementById('mobile-drawer');
        if (drawer) drawer.classList.add('hidden');
      }
    });
  });

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

      const map = {
        en: {
          heavy:   { title: 'Heavy-Duty Industrial Vacuum', model: 'EV-V100P-40', note: '4.0kW, 100L, pulse-jet cleaning. Designed for continuous heavy-dust environments.' },
          labor:   { title: 'Walk-Behind Floor Scrubber',   model: 'EV-S56-60T', note: '56cm cleaning path, traction drive. One operator covers up to 2,500 m²/h.' },
          hygiene: { title: 'HEPA Industrial Vacuum',        model: 'EV-V30H-15', note: 'HEPA filtration, 30L. Ideal for precision manufacturing and pharmaceutical use.' },
          polish:  { title: 'Single-Disc Machine',           model: 'EV-D17-175', note: '175 RPM, 1200W. For floor polishing, stripping and stone care on all hard surfaces.' },
          oem:     { title: 'Full OEM / ODM Program',        model: 'All Series', note: 'We manufacture under your brand. Custom spec, colour, and packaging from MOQ 50 units.' },
          default: { title: 'Walk-Behind Floor Scrubber',   model: 'EV-S43-32', note: 'Versatile all-rounder for medium facilities. 430mm cleaning path, 32L tank.' },
        },
        zh: {
          heavy:   { title: '重型工业吸尘器', model: 'EV-V100P-40', note: '4.0kW，100L，脉冲反吹。专为持续高粉尘环境设计。' },
          labor:   { title: '手推式洗地机',   model: 'EV-S56-60T', note: '56cm清洁宽度，牵引驱动。一名操作员每小时可覆盖2,500m²。' },
          hygiene: { title: 'HEPA工业吸尘器',  model: 'EV-V30H-15', note: 'HEPA过滤，30L。适合精密制造与制药使用。' },
          polish:  { title: '单擦机',          model: 'EV-D17-175', note: '175 RPM，1200W。各类硬质地面的抛光、起蜡与石材护理。' },
          oem:     { title: '全套 OEM / ODM 合作方案', model: '全系列', note: '贴牌代工，从规格、颜色到包装全面定制，起订量低至50台。' },
          default: { title: '手推式洗地机', model: 'EV-S43-32', note: '中型场所的通用首选，430mm清洁宽度，32L水箱。' },
        }
      };

      let key = 'default';
      if (goal === 'Grease' || goal.includes('油污')) key = 'heavy';
      else if (goal === 'Labor' || goal.includes('人工')) key = 'labor';
      else if (goal === 'Hygiene' || goal.includes('卫生')) key = 'hygiene';
      else if (goal === 'Polish' || goal.includes('Polish')) key = 'polish';
      else if (goal === 'OEM' || goal.includes('代工')) key = 'oem';

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

  /* ── 6. PRODUCT DATA INJECTION ───────────────────────────── */
  const PRODUCT_DATA = {
    /* ── Industrial Vacuums (EV-V) ── */
    'v80a15': {
      model: 'EV-V80A-15',
      title: 'EV-V80A-15 Industrial Vacuum 80L | Battery Powered | ELVONIS',
      description: 'ELVONIS EV-V80A-15: 80L battery-powered industrial vacuum. 1.5kW, auto reverse-jet cleaning, polyester-coated filter. CE certified, OEM available.',
      specs: { power:'1.5 kW', airflow:'531 m³/h', suction:'160 mbar', weight:'62 kg', voltage:'24V Battery', tank:'80 L' }
    },
    'v80a21': {
      model: 'EV-V80A-21',
      title: 'EV-V80A-21 Industrial Vacuum 80L | 48V Battery | ELVONIS',
      description: 'ELVONIS EV-V80A-21: 80L heavy-duty battery vacuum. 2.1kW, 48V system, auto reverse-jet cleaning. For large factories.',
      specs: { power:'2.1 kW', airflow:'531 m³/h', suction:'160 mbar', weight:'73 kg', voltage:'48V Battery', tank:'80 L' }
    },
    'v80a48': {
      model: 'EV-V80A-48',
      title: 'EV-V80A-48 Industrial Vacuum 80L | 220V Mains | ELVONIS',
      description: 'ELVONIS EV-V80A-48: 80L mains-powered vacuum. 4.8kW, 220V, auto reverse-jet cleaning. For shopping malls and hotels.',
      specs: { power:'4.8 kW', airflow:'531 m³/h', suction:'220 mbar', weight:'30 kg', voltage:'220V', tank:'80 L' }
    },
    'v100p40': {
      model: 'EV-V100P-40',
      title: 'EV-V100P-40 Industrial Vacuum 100L | Pulse-Jet | ELVONIS',
      description: 'ELVONIS EV-V100P-40: 100L heavy-industry vacuum. 4.0kW, 380V, pulse-jet cleaning. Designed for continuous high-dust operation.',
      specs: { power:'4.0 kW', airflow:'420 m³/h', suction:'290 mbar', weight:'110 kg', voltage:'380V', tank:'100 L' }
    },
    'v100p75': {
      model: 'EV-V100P-75',
      title: 'EV-V100P-75 Industrial Vacuum 100L | 7.5kW | ELVONIS',
      description: 'ELVONIS EV-V100P-75: 100L large-scale vacuum. 7.5kW, 380V, pulse-jet. For major manufacturing facilities.',
      specs: { power:'7.5 kW', airflow:'530 m³/h', suction:'320 mbar', weight:'135 kg', voltage:'380V', tank:'100 L' }
    },
    'v30h15': {
      model: 'EV-V30H-15',
      title: 'EV-V30H-15 HEPA Vacuum 30L | Precision | ELVONIS',
      description: 'ELVONIS EV-V30H-15: 30L HEPA filtration vacuum. 1.5kW, manual cleaning. For CNC machine tools and precision manufacturing.',
      specs: { power:'1.5 kW', airflow:'210 m³/h', suction:'200 mbar', weight:'38 kg', voltage:'220V/380V', tank:'30 L' }
    },
    'v100t40': {
      model: 'EV-V100T-40',
      title: 'EV-V100T-40 High-Temp Vacuum 100L | ELVONIS',
      description: 'ELVONIS EV-V100T-40: 100L high-temperature vacuum. 4.0kW, 316L stainless steel filter. For foundries and heat treatment.',
      specs: { power:'4.0 kW', airflow:'420 m³/h', suction:'290 mbar', weight:'110 kg', voltage:'380V', tank:'100 L' }
    },
    'v80pair': {
      model: 'EV-V80P-Air',
      title: 'EV-V80P-Air Pneumatic Vacuum 80L | ATEX Zone | ELVONIS',
      description: 'ELVONIS EV-V80P-Air: 80L pneumatic vacuum with HEPA. No electricity required. For explosion-proof zones.',
      specs: { power:'Pneumatic', airflow:'256 m³/h', suction:'280 mbar', weight:'27 kg', voltage:'Air-powered', tank:'80 L' }
    },
    'v100ex40': {
      model: 'EV-V100EX-40',
      title: 'EV-V100EX-40 Explosion-Proof Vacuum 100L | ATEX | ELVONIS',
      description: 'ELVONIS EV-V100EX-40: 100L explosion-proof vacuum. 4.0kW, 380V. ATEX certified for chemical, grain, and paint applications.',
      specs: { power:'4.0 kW', airflow:'420 m³/h', suction:'290 mbar', weight:'100 kg', voltage:'380V', tank:'100 L' }
    },
    /* ── Walk-Behind Scrubbers (EV-S) ── */
    's3318': {
      model: 'EV-S33-18',
      title: 'EV-S33-18 Walk-Behind Scrubber 33cm | Compact | ELVONIS',
      description: 'ELVONIS EV-S33-18: 33cm compact walk-behind scrubber. 18L/20L tanks, 45kg. For small retail, clinics, and corridors.',
      specs: { cleaning_path:'330 mm', tank:'18/20 L', efficiency:'1,000 m²/h', weight:'45 kg', brush_motor:'360 W' }
    },
    's4332': {
      model: 'EV-S43-32',
      title: 'EV-S43-32 Walk-Behind Scrubber 43cm | Standard | ELVONIS',
      description: 'ELVONIS EV-S43-32: 43cm standard walk-behind scrubber. 32L/38L tanks. For mid-size retail and schools.',
      specs: { cleaning_path:'430 mm', tank:'32/38 L', efficiency:'1,500 m²/h', weight:'50 kg', brush_motor:'360 W' }
    },
    's5140': {
      model: 'EV-S51-40',
      title: 'EV-S51-40 Walk-Behind Scrubber 51cm | 40L | ELVONIS',
      description: 'ELVONIS EV-S51-40: 51cm workhorse scrubber. 40L/50L tanks, 30kg brush pressure. For warehouses and supermarkets.',
      specs: { cleaning_path:'510 mm', tank:'40/50 L', efficiency:'2,025 m²/h', weight:'65 kg', brush_motor:'550 W' }
    },
    's5150': {
      model: 'EV-S51-50',
      title: 'EV-S51-50 Walk-Behind Scrubber 51cm | Large Tank | ELVONIS',
      description: 'ELVONIS EV-S51-50: 51cm large-tank scrubber. 50L/55L tanks. Extended runtime for supermarkets and large retail.',
      specs: { cleaning_path:'510 mm', tank:'50/55 L', efficiency:'2,250 m²/h', weight:'75 kg', brush_motor:'550 W' }
    },
    's5660t': {
      model: 'EV-S56-60T',
      title: 'EV-S56-60T Walk-Behind Scrubber 56cm | Traction | ELVONIS',
      description: 'ELVONIS EV-S56-60T: 56cm traction-drive scrubber. 60L/65L tanks. 2,500 m²/h for logistics, hotels, and large commercial venues.',
      specs: { cleaning_path:'560 mm', tank:'60/65 L', efficiency:'2,500 m²/h', weight:'95 kg', brush_motor:'550 W', drive_motor:'Traction 300W' }
    },
    's5160': {
      model: 'EV-S51-60',
      title: 'EV-S51-60 Orbital Scrubber 51cm | Stone Care | ELVONIS',
      description: 'ELVONIS EV-S51-60: 51cm orbital scrubber. 2,200 RPM, 60L/65L tanks. For polished stone and fine surfaces.',
      specs: { cleaning_path:'510×360 mm', tank:'60/65 L', efficiency:'2,500 m²/h', weight:'95 kg', brush_motor:'750 W', drive_motor:'Traction 300W' }
    },
    /* ── Single Disc Machines (EV-D) ── */
    'd17154': {
      model: 'EV-D17-154',
      title: 'EV-D17-154 Single Disc Machine 17" | 154 RPM | ELVONIS',
      description: 'ELVONIS EV-D17-154: 17" single-disc machine. 154 RPM, 1200W. Entry-level for daily cleaning and standard commercial use.',
      specs: { disc:'17"', speed:'154 RPM', power:'1,200 W', weight:'Standard', voltage:'220V' }
    },
    'd17175': {
      model: 'EV-D17-175',
      title: 'EV-D17-175 Single Disc Machine 17" | 175 RPM | ELVONIS',
      description: 'ELVONIS EV-D17-175: 17" single-disc machine. 175 RPM, 1200W. Standard model for daily cleaning and polishing.',
      specs: { disc:'17"', speed:'175 RPM', power:'1,200 W', weight:'Standard', voltage:'220V' }
    },
    'd18175': {
      model: 'EV-D18-175',
      title: 'EV-D18-175 Single Disc Machine 18" | Large Pad | ELVONIS',
      description: 'ELVONIS EV-D18-175: 18" single-disc machine. 175 RPM, 1200W. Large pad for hotel lobbies and open areas.',
      specs: { disc:'18"', speed:'175 RPM', power:'1,200 W', weight:'Standard', voltage:'220V' }
    },
    'd13175': {
      model: 'EV-D13-175',
      title: 'EV-D13-175 Single Disc Machine 13" | Mini | ELVONIS',
      description: 'ELVONIS EV-D13-175: 13" mini single-disc machine. 175 RPM, 750W. For narrow corridors, elevators, and tight spaces.',
      specs: { disc:'13"', speed:'175 RPM', power:'750 W', weight:'Mini', voltage:'220V' }
    },
    'd18176h': {
      model: 'EV-D18-176H',
      title: 'EV-D18-176H Single Disc Machine 18" | Heavy-Duty | ELVONIS',
      description: 'ELVONIS EV-D18-176H: 18" heavy-duty single-disc machine. 176 RPM, 1860W. For marble restoration and stone refinishing.',
      specs: { disc:'18"', speed:'176 RPM', power:'1,860 W', weight:'Heavy', voltage:'220V' }
    },
    'd18170s': {
      model: 'EV-D18-170S',
      title: 'EV-D18-170S Single Disc Machine 18" | Stone | ELVONIS',
      description: 'ELVONIS EV-D18-170S: 18" stone-specialised single-disc machine. 170 RPM, 1800W. For professional stone crystallization.',
      specs: { disc:'18"', speed:'170 RPM', power:'1,800 W', weight:'Heavy', voltage:'220V' }
    },
    'd201500': {
      model: 'EV-D20-1500',
      title: 'EV-D20-1500 UHS Burnisher 20" | 1500 RPM | ELVONIS',
      description: 'ELVONIS EV-D20-1500: 20" ultra-high-speed burnisher. 1,500 RPM, 1800W. For mirror-finish polishing in premium facilities.',
      specs: { disc:'20"', speed:'1,500 RPM', power:'1,800 W', weight:'Standard', voltage:'220V' }
    }
  };

  const PAGE_CONFIG = {
    'page-v80a15':  'v80a15',
    'page-v80a21':  'v80a21',
    'page-v80a48':  'v80a48',
    'page-v100p40': 'v100p40',
    'page-v100p75': 'v100p75',
    'page-v30h15':  'v30h15',
    'page-v100t40': 'v100t40',
    'page-v80pair': 'v80pair',
    'page-v100ex40':'v100ex40',
    'page-s3318':   's3318',
    'page-s4332':   's4332',
    'page-s5140':   's5140',
    'page-s5150':   's5150',
    'page-s5660t':  's5660t',
    'page-s5160':   's5160',
    'page-d17154':  'd17154',
    'page-d17175':  'd17175',
    'page-d18175':  'd18175',
    'page-d13175':  'd13175',
    'page-d18176h': 'd18176h',
    'page-d18170s': 'd18170s',
    'page-d201500': 'd201500'
  };

  let productKey = null;
  for (const [cls, key] of Object.entries(PAGE_CONFIG)) {
    if (document.body.classList.contains(cls)) {
      productKey = key;
      break;
    }
  }

  if (productKey && PRODUCT_DATA[productKey]) {
    const data = PRODUCT_DATA[productKey];
    document.title = data.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', data.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', data.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', data.description);
    const specsContainer = document.querySelector('[data-product-specs]');
    if (specsContainer) {
      let specsHTML = '';
      for (const [label, value] of Object.entries(data.specs)) {
        const displayLabel = label.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        specsHTML += `<div class="px-4"><p class="text-xs text-gray-400 uppercase tracking-widest mb-1">${displayLabel}</p><p class="text-3xl font-light">${value}</p></div>`;
      }
      specsContainer.innerHTML = specsHTML;
      specsContainer.style.display = 'grid';
      specsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
      specsContainer.style.gap = '2rem';
      specsContainer.style.textAlign = 'center';
    }
    document.querySelectorAll('[data-product-model]').forEach(el => {
      el.textContent = data.model;
    });
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
      try {
        let schema = JSON.parse(schemaScript.textContent);
        if (schema.name) schema.name = data.model;
        if (schema.description) schema.description = data.description;
        schemaScript.textContent = JSON.stringify(schema);
      } catch(e) {}
    }
  }
});
