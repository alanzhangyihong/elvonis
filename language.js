// ═══════════════════════════════════════════════════════════
// ELVONIS — Language & Data System
// 双按钮切换（参考CleanPro），中英文数据统一管理
// ═══════════════════════════════════════════════════════════

// ── 1. 全站配置 ──────────────────────────────────────────
const SITE_CONFIG = {
  brand:     'ELVONIS',
  brandZh:   '',
  slogan_en: 'Serious Clean for Serious Business',
  slogan_zh: '专为清洁，专为商用',
  whatsapp:  '60123456789',   // ← 替换成真实号码
  email:     'info@elvonis.com',
  formspree: 'YOUR_FORM_ID',  // ← 替换成 formspree.io 表单ID
};

// ── 2. 语言检测 ──────────────────────────────────────────
// 优先级：① 用户手动选择过 → ② 浏览器语言 → ③ 默认英文
function detectLang() {
  // ① 用户已手动选择，尊重选择
  const saved = localStorage.getItem('elvonis_lang');
  if (saved) return saved;
  // ② 浏览器语言（手机/电脑/平板逻辑相同）
  const bl = navigator.language || navigator.userLanguage || '';
  return /^zh/i.test(bl) ? 'zh' : 'en';
}
let currentLang = detectLang();

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('elvonis_lang', lang);

  // 更新双按钮激活状态
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // 更新 html lang
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // 批量替换 data-i18n 元素
  applyI18n();

  // 更新 WhatsApp 浮窗
  const waBtn = document.getElementById('wa-float');
  if (waBtn) {
    const msg = encodeURIComponent(T('wa.greeting'));
    waBtn.href = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${msg}`;
    waBtn.title = T('wa.tooltip');
  }

  // 通知页面各模块重新渲染
  if (typeof onLangChange === 'function') onLangChange();
}

// 翻译函数
function T(key) {
  const d = I18N[currentLang] || I18N['en'];
  return d[key] !== undefined ? d[key] : (I18N['en'][key] || key);
}

// 批量应用翻译
function applyI18n() {
  // Standard data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const val = T(key);
    if (!val) return;
    if (attr) el.setAttribute(attr, val);
    else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
    else el.textContent = val;
  });
  // Placeholder via data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const val = T(el.getAttribute('data-i18n-ph'));
    if (val) el.placeholder = val;
  });
  // Select option text via data-i18n-opt
  document.querySelectorAll('[data-i18n-opt]').forEach(el => {
    const val = T(el.getAttribute('data-i18n-opt'));
    if (val) el.textContent = val;
  });
}

// 初始化
function initLang() {
  setLang(currentLang);
}
document.addEventListener('DOMContentLoaded', initLang);

// ── 3. 翻译字典 ──────────────────────────────────────────
const I18N = {
  zh: {
    // META
    'meta.home.title':    'ELVONIS | 商用清洁设备 专为清洁 专为商用',
    'meta.home.desc':     'ELVONIS，直接从认证工厂供应CE认证商用清洁设备，高压清洗机、工业吸尘器、商用洗地机、商用扫地机器人。',
    'meta.products.title':'产品中心 | ELVONIS 商用清洁设备',
    'meta.about.title':   '关于我们 | ELVONIS',
    'meta.contact.title': '联系我们 | ELVONIS 获取报价',
    'meta.blog.title':    '知识博客 | ELVONIS',
    'meta.apps.title':    '应用场景 | ELVONIS 商用清洁设备',

    // NAV
    'nav.home':     '首页',
    'nav.products': '产品中心',
    'nav.apps':     '应用场景',
    'nav.blog':     '知识博客',
    'nav.about':    '关于我们',
    'nav.contact':  '联系我们',
    'nav.inquiry':  '立即询价',

    // HERO
    'hero.eyebrow': '工业级品质 · 工厂直供 · CE认证',
    'hero.h1.line1':'专为清洁，',
    'hero.h1.line2':'专为商用',
    'hero.desc':    'ELVONIS，用工业级清洁设备，帮助全球企业降低成本、提升运营效率。直接从认证工厂供应高压清洗机、工业吸尘器、商用洗地机和商用扫地机器人，CE认证，工厂直供。',
    'hero.btn1':    '查看产品系列',
    'hero.btn2':    '立即询价',

    // STATS
    'stat.countries': '已覆盖国家',
    'stat.certified': 'CE认证产品',
    'stat.moq':       '低起订量',
    'stat.response':  '响应时间',

    // TRUST BAR
    'trust.ce.title':      'CE认证',
    'trust.ce.sub':        '符合欧盟市场标准',
    'trust.oem.title':     '支持OEM',
    'trust.oem.sub':       '定制品牌贴牌服务',
    'trust.direct.title':  '工厂直供',
    'trust.direct.sub':    '无中间商差价',
    'trust.reply.title':   '24小时响应',
    'trust.reply.sub':     'WhatsApp / 邮件',
    'trust.parts.title':   '耗材配件',
    'trust.parts.sub':     '全套耗材持续供应',
    'trust.ship.title':    '全球发货',
    'trust.ship.sub':      'DHL · FedEx · 海运',

    // PRODUCTS SECTION
    'prod.section.eyebrow': '产品系列',
    'prod.section.title':   '工业级清洁设备，应对各种清洁挑战',
    'prod.section.sub':     '全系产品CE认证 · 低起订量 · 提供完整耗材和配件持续供应',
    'prod.featured':        '明星产品',
    'prod.view':            '查看产品 →',
    'prod.viewall':         '查看全部产品',
    'prod.viewdetail':      '查看详情',
    'prod.getquote':        '立即询价',
    'prod.filter.all':      '全部产品',
    'prod.filter.pressure': '高压清洗机',
    'prod.filter.vacuum':   '工业吸尘器',
    'prod.filter.scrubber': '商用洗地机',
    'prod.filter.sweeper':  '扫地机器人',
    'prod.filter.consumable': '配件耗材',
    'prod.search':          '搜索产品...',
    'prod.showing':         '显示',
    'prod.items':           '个产品',
    'prod.notfound':        '未找到相关产品',
    'prod.badge.ce':        'CE认证',
    'prod.badge.oem':       '支持OEM',
    'prod.badge.hot':       '热销',
    'prod.badge.new':       '新品',

    // PRODUCT DETAIL
    'detail.tab.overview':    '产品概述',
    'detail.tab.specs':       '技术规格',
    'detail.tab.apps':        '适用场景',
    'detail.tab.consumables': '耗材配件',
    'detail.btn.quote':       '立即询价',
    'detail.btn.whatsapp':    'WhatsApp咨询',
    'detail.label.model':     '型号',
    'detail.label.cert':      '认证',
    'detail.label.moq':       '最小起订量',
    'detail.label.lead':      '交货周期',
    'detail.spec.title':      '详细技术规格',
    'detail.app.title':       '适用行业与场景',
    'detail.related':         '相关产品',
    'detail.oem.title':       '支持OEM贴牌定制',
    'detail.oem.desc':        '我们提供完整OEM服务——定制品牌、颜色、包装和产品文档，适合批量采购和经销商合作。',

    // APPLICATIONS
    'app.section.eyebrow': '行业覆盖',
    'app.section.title':   '专为高要求场所打造',
    'app.hero.title':      '应用场景',
    'app.hero.sub':        '了解ELVONIS清洁设备如何在全球不同行业和场所中发挥价值。',
    'app.factory':         '工厂/制造业',
    'app.factory.sub':     '汽车 · 电子 · 食品 · 制药',
    'app.factory.desc':    '重型油污、金属粉尘、化学残留，工业级设备完整解决方案。',
    'app.warehouse':       '物流/仓储',
    'app.warehouse.sub':   '第三方物流 · 冷库 · 港口',
    'app.warehouse.desc':  '超大面积地面，驾驶式洗地机和扫地机器人高效覆盖。',
    'app.mall':            '购物中心/零售',
    'app.mall.sub':        '超市 · 商场 · 展厅',
    'app.mall.desc':       '低噪音不影响营业，高效清洁大面积地面。',
    'app.hospital':        '医疗/医院',
    'app.hospital.sub':    '综合医院 · 诊所 · 实验室',
    'app.hospital.desc':   'HEPA过滤，医疗级卫生标准，无菌环境清洁。',
    'app.airport':         '机场/交通枢纽',
    'app.airport.sub':     '机场 · 地铁 · 火车站',
    'app.airport.desc':    '24小时连续作业，自主机器人夜间清洁不间断。',
    'app.hotel':           '酒店/度假村',
    'app.hotel.sub':       '五星酒店 · 度假村 · 会议中心',
    'app.hotel.desc':      '静音设计，夜间清洁不打扰住客，高颜值设备提升形象。',
    'app.parking':         '停车场/户外',
    'app.parking.sub':     '停车场 · 广场 · 园区',
    'app.parking.desc':    '抗腐蚀，IP55防护，户外使用油渍混凝土清洁。',
    'app.food':            '食品/制药工厂',
    'app.food.sub':        '食品加工 · 制药 · 洁净室',
    'app.food.desc':       'IP67不锈钢机型，食品级材质，最严格卫生标准。',
    'app.factory.slogan':  '工业级强度，为制造而生',
    'app.hotel.slogan':    '静音高效，专业空间首选',
    'app.warehouse.slogan':'中国可靠采购伙伴',
    'app.hospital.slogan': '认证清洁，关键环境专用',
    'app.airport.slogan':  '全天候高效，交通枢纽首选',
    'app.mall.slogan':     '营业时间内安静高效',
    'app.parking.slogan':  '抗腐蚀，户外重型清洁',
    'app.food.slogan':     '食品级认证，最严格卫生标准',

    // MARKETS
    'market.eyebrow': '目标市场',
    'market.title':   '核心市场覆盖 · 全球均可发货',
    'market.badge.priority': '重点市场',
    'market.badge.growth':   '成长市场',
    'market.badge.premium':  '高利润市场',
    'market.badge.expanding':'扩展中',
    'market.badge.worldwide':'全球',
    'market.my.desc':  '制造业 · 酒店 · 购物中心',
    'market.vn.desc':  '电子工厂 · 纺织业 · 工业园区',
    'market.id.desc':  '东南亚最大经济体 · 食品 · 物流',
    'market.ph.desc':  '购物中心 · BPO办公 · 酒店',
    'market.ae.desc':  '豪华酒店 · 超大商场 · 经销商',
    'market.sa.desc':  'Vision 2030 · 医疗 · 酒店扩张',
    'market.th.desc':  '汽车制造 · 旅游业 · 零售',
    'market.ww.desc':  '我们向全球所有地区发货，无论您身在何处，ELVONIS都能为您提供服务。',

    // PROCESS
    'process.eyebrow':  '合作流程',
    'process.title':    '从询盘到交货——简单透明',
    'step1.title':      '发送需求',
    'step1.desc':       '告诉我们您的行业、使用场景和数量需求，我们24小时内为您推荐最合适的产品方案。',
    'step2.title':      '收到详细报价',
    'step2.desc':       '清晰的报价单：产品规格、认证证书、最低起订量、交货周期，无隐性费用。',
    'step3.title':      '确认订单发货',
    'step3.desc':       '30%预付款启动生产，提单后付清尾款，DHL快递或海运直达您的门口。',
    'step4.title':      '持续售后支持',
    'step4.desc':       '安装指导视频、耗材定期补货、配件采购，专属WhatsApp联系渠道。',

    // CTA
    'cta.title1':      '准备好更聪明地',
    'cta.title2':      '采购了吗？',
    'cta.sub':         '告诉我们您的需求，我们24小时内发送详细报价。CE认证 · 低起订量 · 完善售后支持。',
    'cta.email.ph':    '您的邮箱地址',
    'cta.btn':         '获取免费报价 →',
    'cta.note1':       '无垃圾邮件',
    'cta.note2':       '24小时内回复',
    'cta.note3':       '免费咨询',

    // BLOG
    'blog.hero.eyebrow':'知识博客',
    'blog.hero.title':  '知识中心',
    'blog.hero.sub':    '为设施管理人员和采购团队提供清洁设备选购指南、使用技巧和行业资讯。',
    'blog.title':       '最新文章',
    'blog.readmore':    '阅读全文 →',

    // ABOUT
    'about.hero.title':    'ELVONIS',
    'about.hero.sub':      '全球商用及工业清洁设备品牌供应商',
    'about.mission.tag':   'OUR MISSION',
    'about.mission.label': '我们的使命',
    'about.mission':       'ELVONIS，用工业级清洁设备，帮助全球企业降低成本、提升运营效率。',
    'about.story.tag':     'OUR STORY',
    'about.story.title':   '我们的故事',
    'about.story':         '然而现实是，太多企业在这件事上反复踩坑——设备质量参差不齐、售后服务缺失、配件断供、供应商承诺与实际交付严重脱节。这些问题年复一年地消耗着企业的时间和成本，却长期得不到真正的解决。\n\nELVONIS的诞生，就是为了改变这一切。我们深度整合中国优质制造资源，精选通过CE等国际认证的商用清洁设备，涵盖高压清洗机、工业吸尘器、商用洗地机、商用扫地机器人等核心品类，为全球工厂、仓库、酒店、商场、医院、学校等专业场所，提供真正可以依赖的清洁解决方案。\n\n我们服务的客户遍布全球，从本地的物业管理公司，到跨国企业的采购团队。他们对ELVONIS的共同期待只有一个——买得放心，用得安心。\n\n我们不是行业里最大的品牌，但我们是最认真对待每一个客户的那一个。',
    'about.quote':         '「我们相信，每一个认真运营的企业，都值得拥有同样认真的清洁设备。」',
    'about.val1.title':    '品质优先',
    'about.val1':          'CE认证产品，使用品牌核心零部件。我们按品质标准筛选工厂，而不是按价格。',
    'about.val2.title':    '诚实沟通',
    'about.val2':          '我们会告诉您产品的优点，也会告诉您限制和注意事项。我们不过度推销。',
    'about.val3.title':    '长期合作',
    'about.val3':          '我们的商业模式建立在复购之上，这意味着您的满意度才是我们的第一优先。',
    'about.val4.title':    '全球服务',
    'about.val4':          '从采购到交货，耗材补货，配件供应，全球范围内一站式服务。',
    'about.prod.title':    '四大核心产品系列',

    // CONTACT
    'contact.hero.eyebrow': '联系我们',
    'contact.hero.title':   '联系我们',
    'contact.hero.sub':     '获取报价、咨询问题，或寻找当地经销商。我们24小时内回复。',
    'contact.form.title':   '发送询盘',
    'contact.name':         '姓名',
    'contact.company':      '公司名称',
    'contact.email':        '邮箱',
    'contact.phone':        '电话 / WhatsApp',
    'contact.country':      '国家/地区',
    'contact.product':      '感兴趣的产品',
    'contact.qty':          '预计采购数量',
    'contact.message':      '留言（可选）',
    'contact.submit':       '发送消息',
    'contact.sending':      '发送中...',
    'contact.success':      '消息已发送！我们将在24小时内回复。',
    'contact.error':        '发送失败，请直接发邮件至 info@elvonis.com',
    'contact.info.title':   '联系方式',
    'contact.email.label':  '邮箱',
    'contact.wa.label':     'WhatsApp',
    'contact.hours.label':  '工作时间',
    'contact.hours.val':    '周一至周六 9:00–18:00 (UTC+8)',
    // Contact form dropdowns
    'contact.country.ph':      '请填写您所在的国家/地区',
    'contact.inquiry.label':   '询盘类型',
    'contact.inquiry.opt1':    '采购新设备',
    'contact.inquiry.opt2':    '耗材补货',
    'contact.inquiry.opt3':    '配件采购',
    'contact.inquiry.opt4':    'OEM贴牌合作',
    'contact.inquiry.opt5':    '经销商合作',
    'contact.inquiry.opt6':    '其他',
    'contact.product.label':   '感兴趣的产品',
    'contact.product.opt1':    '高压清洗机',
    'contact.product.opt2':    '工业吸尘器',
    'contact.product.opt3':    '商用洗地机',
    'contact.product.opt4':    '扫地机器人',
    'contact.product.opt5':    '多个品类',

    // FOOTER
    'footer.desc':     'ELVONIS直接从认证工厂向全球企业供应CE认证商用清洁设备。',
    'footer.slogan':   '全球商用及工业清洁设备品牌供应商',
    'footer.products': '产品中心',
    'footer.company':  '公司',
    'footer.support':  '支持',
    'footer.cert':     'CE认证 · 支持OEM贴牌 · 全球发货',
    'footer.copy':     '© 2025 ELVONIS 版权所有',

    // WHATSAPP
    'wa.tooltip':  'WhatsApp联系我们',
    'wa.greeting': '您好！我对ELVONIS清洁设备感兴趣，能帮我提供报价吗？',

    // BUTTONS
    'btn.viewall': '查看全部',
  },

  en: {
    'meta.home.title':    'ELVONIS — Commercial Cleaning Equipment | Serious Clean for Serious Business',
    'meta.home.desc':     'ELVONIS supplies CE-certified commercial cleaning equipment factory direct. Pressure washers, industrial vacuums, floor scrubbers and robotic sweepers.',
    'meta.products.title':'Products | ELVONIS Commercial Cleaning Equipment',
    'meta.about.title':   'About Us | ELVONIS',
    'meta.contact.title': 'Contact Us | ELVONIS — Get a Quote',
    'meta.blog.title':    'Knowledge Hub | ELVONIS',
    'meta.apps.title':    'Applications | ELVONIS Commercial Cleaning Equipment',

    'nav.home':     'Home',
    'nav.products': 'Products',
    'nav.apps':     'Applications',
    'nav.blog':     'Blog',
    'nav.about':    'About',
    'nav.contact':  'Contact',
    'nav.inquiry':  'Get Quote',

    'hero.eyebrow': 'INDUSTRIAL-GRADE · FACTORY DIRECT · CE CERTIFIED',
    'hero.h1.line1':'Serious Clean for',
    'hero.h1.line2':'Serious Business',
    'hero.desc':    'ELVONIS empowers businesses worldwide with industrial-grade cleaning equipment that reduces costs and improves operational efficiency. Factory direct, CE certified.',
    'hero.btn1':    'View Products',
    'hero.btn2':    'Get a Quote',

    'stat.countries': 'Countries Served',
    'stat.certified': 'CE Certified',
    'stat.moq':       'Low MOQ',
    'stat.response':  'Response Time',

    'trust.ce.title':      'CE Certified',
    'trust.ce.sub':        'EU market ready',
    'trust.oem.title':     'OEM Available',
    'trust.oem.sub':       'Custom branding',
    'trust.direct.title':  'Factory Direct',
    'trust.direct.sub':    'No middlemen',
    'trust.reply.title':   '24h Response',
    'trust.reply.sub':     'WhatsApp & email',
    'trust.parts.title':   'Spare Parts',
    'trust.parts.sub':     'Full consumables supply',
    'trust.ship.title':    'Global Shipping',
    'trust.ship.sub':      'DHL · FedEx · Sea freight',

    'prod.section.eyebrow': 'PRODUCT RANGE',
    'prod.section.title':   'Industrial-grade equipment for every cleaning challenge',
    'prod.section.sub':     'All products CE certified · Low MOQ · Full spare parts and consumables available',
    'prod.featured':        'Featured Products',
    'prod.view':            'View products →',
    'prod.viewall':         'View All Products',
    'prod.viewdetail':      'View Details',
    'prod.getquote':        'Get Quote',
    'prod.filter.all':      'All Products',
    'prod.filter.pressure': 'Pressure Washers',
    'prod.filter.vacuum':   'Industrial Vacuums',
    'prod.filter.scrubber': 'Floor Scrubbers',
    'prod.filter.sweeper':  'Robotic Sweepers',
    'prod.filter.consumable': 'Parts & Consumables',
    'prod.search':          'Search products...',
    'prod.showing':         'Showing',
    'prod.items':           'products',
    'prod.notfound':        'No products found',
    'prod.badge.ce':        'CE',
    'prod.badge.oem':       'OEM',
    'prod.badge.hot':       'Hot',
    'prod.badge.new':       'New',

    'detail.tab.overview':    'Overview',
    'detail.tab.specs':       'Specifications',
    'detail.tab.apps':        'Applications',
    'detail.tab.consumables': 'Consumables',
    'detail.btn.quote':       'Request Quote',
    'detail.btn.whatsapp':    'WhatsApp Us',
    'detail.label.model':     'Model',
    'detail.label.cert':      'Certification',
    'detail.label.moq':       'MOQ',
    'detail.label.lead':      'Lead Time',
    'detail.spec.title':      'Technical Specifications',
    'detail.app.title':       'Suitable Applications',
    'detail.related':         'Related Products',
    'detail.oem.title':       'OEM / Private Label Available',
    'detail.oem.desc':        'Full OEM service — custom branding, color, packaging and documentation. Minimum order quantities apply.',

    'app.section.eyebrow': 'INDUSTRIES SERVED',
    'app.section.title':   'Built for demanding environments',
    'app.hero.title':      'Applications',
    'app.hero.sub':        'See how ELVONIS equipment serves different industries and environments worldwide.',
    'app.factory':         'Manufacturing & Factories',
    'app.factory.sub':     'Auto · Electronics · Food · Pharma',
    'app.factory.desc':    'Heavy oil, metal dust and chemical residues — complete industrial cleaning solutions.',
    'app.warehouse':       'Logistics & Warehousing',
    'app.warehouse.sub':   '3PL · Cold storage · Ports',
    'app.warehouse.desc':  'Vast floor areas handled efficiently by ride-on scrubbers and robotic sweepers.',
    'app.mall':            'Retail & Shopping Malls',
    'app.mall.sub':        'Hypermarkets · Showrooms · Centers',
    'app.mall.desc':       'Silent operation during business hours, high-efficiency large-area coverage.',
    'app.hospital':        'Healthcare & Hospitals',
    'app.hospital.sub':    'Hospitals · Clinics · Labs',
    'app.hospital.desc':   'HEPA filtration, medical-grade hygiene, clean-room compliant equipment.',
    'app.airport':         'Airports & Transport Hubs',
    'app.airport.sub':     'Airports · Metro · Railway stations',
    'app.airport.desc':    '24/7 operation, autonomous robots clean overnight without disruption.',
    'app.hotel':           'Hotels & Hospitality',
    'app.hotel.sub':       '5-star hotels · Resorts · Conventions',
    'app.hotel.desc':      'Silent operation, premium aesthetics, robot sweepers for corridors overnight.',
    'app.parking':         'Car Parks & Outdoor',
    'app.parking.sub':     'Car parks · Plazas · Campuses',
    'app.parking.desc':    'IP55 rated, corrosion-resistant, handles oil stains on concrete.',
    'app.food':            'Food & Pharmaceutical Plants',
    'app.food.sub':        'Food processing · Pharma · Clean rooms',
    'app.food.desc':       'IP67 stainless steel models, food-grade materials, strictest hygiene standards.',
    'app.factory.slogan':  'Built Tough for Industrial Demands',
    'app.hotel.slogan':    'Quiet Power for Professional Spaces',
    'app.warehouse.slogan':'Your Reliable Sourcing Partner from China',
    'app.hospital.slogan': 'Certified Clean for Critical Environments',
    'app.airport.slogan':  '24/7 Coverage for High-Traffic Hubs',
    'app.mall.slogan':     'Silent Efficiency During Business Hours',
    'app.parking.slogan':  'Corrosion-Resistant Outdoor Heavy-Duty',
    'app.food.slogan':     'Food-Grade Certified for the Strictest Standards',

    'market.eyebrow': 'TARGET MARKETS',
    'market.title':   'Key Markets Served · Worldwide Shipping Available',
    'market.badge.priority': 'Priority Market',
    'market.badge.growth':   'Growth Market',
    'market.badge.premium':  'Premium Market',
    'market.badge.expanding':'Expanding',
    'market.badge.worldwide':'Worldwide',
    'market.my.desc':  'Manufacturing · Hotels · Shopping malls',
    'market.vn.desc':  'Electronics factories · Textile · Industrial zones',
    'market.id.desc':  "SE Asia's largest economy · F&B · Logistics",
    'market.ph.desc':  'Malls · BPO offices · Hospitality',
    'market.ae.desc':  'Luxury hotels · Mega malls · Distributors',
    'market.sa.desc':  'Vision 2030 · Healthcare · Hospitality',
    'market.th.desc':  'Auto manufacturing · Tourism · Retail',
    'market.ww.desc':  'ELVONIS ships worldwide. No matter where you are, we can supply and support you.',

    'process.eyebrow': 'HOW IT WORKS',
    'process.title':   'From enquiry to delivery — simple and transparent',
    'step1.title':     'Send your requirements',
    'step1.desc':      'Tell us your industry, application, and scale. We\'ll recommend the right equipment within 24 hours.',
    'step2.title':     'Receive a detailed quote',
    'step2.desc':      'Clear pricing with specs, certifications, MOQ, and lead time. No hidden costs.',
    'step3.title':     'Confirm and we ship',
    'step3.desc':      '30% deposit to start. Balance on bill of lading. DHL or sea freight to your door.',
    'step4.title':     'Ongoing support',
    'step4.desc':      'Setup guides, consumables replenishment, spare parts, and a dedicated WhatsApp contact.',

    'cta.title1':     'Ready to source',
    'cta.title2':     'smarter?',
    'cta.sub':        'Tell us your requirements and we\'ll send a detailed quote within 24 hours.',
    'cta.email.ph':   'your@company.com',
    'cta.btn':        'Get Free Quote →',
    'cta.note1':      'No spam',
    'cta.note2':      'Reply within 24h',
    'cta.note3':      'Free consultation',

    'blog.hero.eyebrow':'Knowledge Blog',
    'blog.hero.title': 'Knowledge Hub',
    'blog.hero.sub':   'Guides, tips and industry insights for facility managers and procurement teams.',
    'blog.title':      'Latest Articles',
    'blog.readmore':   'Read more →',

    'about.hero.title':    'About ELVONIS',
    'about.hero.sub':      'Global Commercial & Industrial Cleaning Equipment Supplier',
    'about.mission.tag':   'OUR MISSION',
    'about.mission.label': 'Our Mission',
    'about.mission':       'ELVONIS empowers businesses worldwide with industrial-grade cleaning equipment that reduces costs and improves operational efficiency.',
    'about.story.tag':     'OUR STORY',
    'about.story.title':   'Our Story',
    'about.story':         'The reality is that too many businesses keep making the same costly mistakes — unreliable equipment, absent after-sales support, unavailable spare parts, and suppliers who disappear once payment is made. Year after year, these problems drain time, money, and operational efficiency, with no real solution in sight.\n\nELVONIS was built to change that. We work directly with certified manufacturing partners across China, carefully selecting commercial cleaning equipment that meets international standards — including CE certification. From high-pressure washers and industrial vacuum cleaners to floor scrubbers and commercial robotic sweepers, every product we offer is chosen because we would stake our reputation on it.\n\nToday, ELVONIS serves businesses and institutions across the globe — from local property management companies to multinational procurement teams. What they all share is one simple expectation: equipment they can rely on, and a supplier who stands behind it.\n\nWe may not be the biggest name in the industry. But we are the most serious about every single customer we serve.',
    'about.quote':         '"We believe every business that runs seriously deserves cleaning equipment that\'s just as serious."',
    'about.val1.title':    'Quality First',
    'about.val1':          'CE-certified products with brand-name core components. We select factories by quality standards, not price alone.',
    'about.val2.title':    'Honest Communication',
    'about.val2':          'We tell you both the advantages and limitations. We don\'t oversell.',
    'about.val3.title':    'Long-term Partnership',
    'about.val3':          'Our business model is built on repeat orders — your satisfaction is always our first priority.',
    'about.val4.title':    'Global Service',
    'about.val4':          'From sourcing to delivery, consumables replenishment and spare parts supply — worldwide.',
    'about.prod.title':    'Four Core Product Categories',

    'contact.hero.eyebrow': 'Contact',
    'contact.hero.title':   'Contact Us',
    'contact.hero.sub':     'Get a quote, ask a question, or find a distributor near you. We respond within 24 hours.',
    'contact.form.title':   'Send an Enquiry',
    'contact.name':         'Full Name',
    'contact.company':      'Company',
    'contact.email':        'Email',
    'contact.phone':        'Phone / WhatsApp',
    'contact.country':      'Country',
    'contact.product':      'Product of Interest',
    'contact.qty':          'Estimated Quantity',
    'contact.message':      'Message (optional)',
    'contact.submit':       'Send Message',
    'contact.sending':      'Sending...',
    'contact.success':      'Message sent! We\'ll reply within 24 hours.',
    'contact.error':        'Send failed. Please email us at info@elvonis.com',
    'contact.info.title':   'Get in Touch',
    'contact.email.label':  'Email',
    'contact.wa.label':     'WhatsApp',
    'contact.hours.label':  'Business Hours',
    'contact.hours.val':    'Mon–Sat 9:00–18:00 (UTC+8)',
    // Contact form dropdowns
    'contact.country.ph':      'Your country / region',
    'contact.inquiry.label':   'Inquiry Type',
    'contact.inquiry.opt1':    'New Equipment Purchase',
    'contact.inquiry.opt2':    'Consumables Replenishment',
    'contact.inquiry.opt3':    'Spare Parts',
    'contact.inquiry.opt4':    'OEM Partnership',
    'contact.inquiry.opt5':    'Distributorship',
    'contact.inquiry.opt6':    'Other',
    'contact.product.label':   'Product of Interest',
    'contact.product.opt1':    'Pressure Washers',
    'contact.product.opt2':    'Industrial Vacuums',
    'contact.product.opt3':    'Floor Scrubbers',
    'contact.product.opt4':    'Robotic Sweepers',
    'contact.product.opt5':    'Multiple Products',

    'footer.desc':     'ELVONIS supplies CE-certified commercial cleaning equipment directly from factories to businesses worldwide.',
    'footer.slogan':   'Global Commercial & Industrial Cleaning Equipment Supplier',
    'footer.products': 'Products',
    'footer.company':  'Company',
    'footer.support':  'Support',
    'footer.cert':     'CE Certified · OEM Available · Global Shipping',
    'footer.copy':     '© 2025 ELVONIS. All rights reserved.',

    'wa.tooltip':  'Chat on WhatsApp',
    'wa.greeting': 'Hello! I\'m interested in ELVONIS cleaning equipment. Can you help me with a quote?',

    'btn.viewall': 'View All',
  }
};

// ── 4. 50个产品数据库（中英文统一管理）──────────────────
const PRODUCTS = [
  // HIGH-PRESSURE WASHERS
  { id:'hp-100e', cat:'pressure',
    name:     { zh:'HP-100E 冷水高压清洗机',          en:'HP-100E Cold Water Pressure Washer' },
    spec:     { zh:'1400W · 100bar · 6L/min · 电动',  en:'1400W · 100 bar · 6L/min · Electric' },
    desc:     { zh:'入门级电动冷水高压清洗机，适合车辆、户外家具和轻型商业清洁，结构紧凑，携带方便。',
                en:'Entry-level electric cold water washer. Ideal for vehicles, outdoor furniture and light commercial cleaning.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'hp-150e', cat:'pressure',
    name:     { zh:'HP-150E 冷水高压清洗机',           en:'HP-150E Cold Water Pressure Washer' },
    spec:     { zh:'2000W · 150bar · 8L/min · 电动',   en:'2000W · 150 bar · 8L/min · Electric' },
    desc:     { zh:'中档商用高压清洗机，150bar强劲压力，适合洗车店、车间和中等强度工业清洁。',
                en:'Mid-range commercial washer with powerful 150 bar output. Suitable for workshops and car washes.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce','oem'], hot:true },
  { id:'hp-200e', cat:'pressure',
    name:     { zh:'HP-200E 工业高压清洗机',            en:'HP-200E Industrial Pressure Washer' },
    spec:     { zh:'3000W · 200bar · 12L/min · 电动',   en:'3000W · 200 bar · 12L/min · Electric' },
    desc:     { zh:'工业级200bar电动高压清洗机，可调压力，不锈钢泵头，适合工厂、仓库和重型清洁任务。',
                en:'Industrial-grade 200 bar washer with adjustable pressure and stainless pump head. For factories and warehouses.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:true },
  { id:'hp-200g', cat:'pressure',
    name:     { zh:'HP-200G 汽油高压清洗机',            en:'HP-200G Petrol Pressure Washer' },
    spec:     { zh:'6.5HP · 200bar · 10L/min · 汽油',  en:'6.5HP · 200 bar · 10L/min · Petrol' },
    desc:     { zh:'200bar汽油高压清洗机，适合无电源的户外和远程作业场所，本田或隆鑫发动机可选。',
                en:'Petrol-driven 200 bar washer for outdoor and remote sites without power supply.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce'], hot:false },
  { id:'hp-250d', cat:'pressure',
    name:     { zh:'HP-250D 柴油高压清洗机',            en:'HP-250D Diesel Pressure Washer' },
    spec:     { zh:'8HP · 250bar · 15L/min · 柴油',    en:'8HP · 250 bar · 15L/min · Diesel' },
    desc:     { zh:'重型柴油高压清洗机，适合港口、建筑工地和远程工业场所，坚固不锈钢机架。',
                en:'Heavy-duty diesel washer for ports, construction sites and remote industrial applications.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:false },
  { id:'hp-300hw', cat:'pressure',
    name:     { zh:'HP-300HW 热水高压清洗机',           en:'HP-300HW Hot Water Pressure Washer' },
    spec:     { zh:'6kW · 300bar · 15L/min · 热水',    en:'6kW · 300 bar · 15L/min · Hot Water' },
    desc:     { zh:'工业热水高压清洗机，专攻油脂顽固污渍，最高95°C水温，适合食品加工和汽车行业。',
                en:'Industrial hot water washer for oil and grease. Max 95°C. Food processing and automotive sectors.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:true },
  { id:'hp-150t', cat:'pressure',
    name:     { zh:'HP-150T 推车式高压清洗机',          en:'HP-150T Trolley Pressure Washer' },
    spec:     { zh:'2200W · 150bar · 10L/min · 推车式', en:'2200W · 150 bar · 10L/min · Trolley' },
    desc:     { zh:'商用推车式高压清洗机，配备大容量水箱和工具收纳，适合大型设施灵活操作。',
                en:'Trolley-mounted commercial washer with large water tank and tool storage.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'hp-200pro', cat:'pressure',
    name:     { zh:'HP-200PRO 专业高压清洗机',          en:'HP-200PRO Professional Pressure Washer' },
    spec:     { zh:'3500W · 200bar · 14L/min · 感应电机', en:'3500W · 200 bar · 14L/min · Induction Motor' },
    desc:     { zh:'专业级感应电机高压清洗机，设计日连续工作8小时以上，适合清洁外包公司和洗车店。',
                en:'Induction motor design for 8h+ continuous daily operation. Ideal for cleaning contractors.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'hp-400i', cat:'pressure',
    name:     { zh:'HP-400I 工业大流量清洗机',          en:'HP-400I Industrial High-Flow Washer' },
    spec:     { zh:'7.5kW · 400bar · 20L/min · 三相电', en:'7.5kW · 400 bar · 20L/min · 3-Phase' },
    desc:     { zh:'大流量工业清洗机，适合混凝土、钢结构和除漆作业，需要三相电源。',
                en:'High-pressure high-flow washer for concrete, steel structures and paint removal.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:false },
  { id:'hp-500hw', cat:'pressure',
    name:     { zh:'HP-500HW 超高压热水清洗机',        en:'HP-500HW Super High-Pressure Hot Water Washer' },
    spec:     { zh:'12kW · 500bar · 25L/min · 热水',   en:'12kW · 500 bar · 25L/min · Hot Water' },
    desc:     { zh:'极限压力工业热水清洗系统，适合极端工业脱脂、管道清洗和船舶维保。',
                en:'Maximum pressure hot water system for extreme degreasing, pipeline cleaning and ship maintenance.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'hp-150wall', cat:'pressure',
    name:     { zh:'HP-150W 壁挂式高压清洗机',         en:'HP-150W Wall-Mount Pressure Washer' },
    spec:     { zh:'2200W · 150bar · 10L/min · 壁挂式', en:'2200W · 150 bar · 10L/min · Wall Mount' },
    desc:     { zh:'壁挂式商用高压清洗机，适合洗车店、车间和装卸码头的固定安装。',
                en:'Wall-mounted commercial washer for fixed installations in car washes and workshops.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'hp-200combo', cat:'pressure',
    name:     { zh:'HP-200C 冷热两用高压清洗机',       en:'HP-200C Combo Washer (Hot + Cold)' },
    spec:     { zh:'5kW · 200bar · 12L/min · 冷热可切换', en:'5kW · 200 bar · 12L/min · Switchable' },
    desc:     { zh:'冷热两用高压清洗机，一键切换模式，一台搞定所有清洁任务。',
                en:'Switchable cold and hot water modes. One machine for all cleaning tasks.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:false },
  { id:'hp-100bat', cat:'pressure',
    name:     { zh:'HP-100B 锂电池高压清洗机',         en:'HP-100B Battery Pressure Washer' },
    spec:     { zh:'20V · 80bar · 4L/min · 无线锂电',  en:'20V · 80 bar · 4L/min · Cordless' },
    desc:     { zh:'无线锂电高压清洗机，适合狭小空间和无电源区域，轻便易携。',
                en:'Cordless battery washer for tight spaces and areas without power access.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'hp-300sand', cat:'pressure',
    name:     { zh:'HP-300S 湿喷砂清洗系统',           en:'HP-300S Wet Sand-blasting System' },
    spec:     { zh:'5kW · 300bar · 15L/min + 喷砂装置', en:'5kW · 300 bar · 15L/min + Sand Blaster' },
    desc:     { zh:'湿喷砂系统，用于除锈、表面处理和涂鸦清除，比干喷砂更环保安全。',
                en:'Wet sandblasting for rust removal, surface preparation and graffiti removal.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'hp-120foam', cat:'pressure',
    name:     { zh:'HP-120F 泡沫炮高压清洗套装',       en:'HP-120F Foam Lance Pressure Washer Set' },
    spec:     { zh:'1800W · 120bar · 7L/min + 泡沫炮', en:'1800W · 120 bar · 7L/min + Foam Cannon' },
    desc:     { zh:'完整高压清洗套装，含专业雪泡枪，适合汽车美容和外墙清洁业务。',
                en:'Complete set with professional snow foam lance. Perfect for car detailing businesses.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce'], hot:false },

  // INDUSTRIAL VACUUMS
  { id:'wv-20l', cat:'vacuum',
    name:     { zh:'WV-20L 干湿两用吸尘器 20L',        en:'WV-20L Wet & Dry Vacuum 20L' },
    spec:     { zh:'1200W · 20L · 干湿两用 · HEPA',    en:'1200W · 20L · Dry & Wet · HEPA' },
    desc:     { zh:'紧凑型20L干湿两用吸尘器，适合轻型商业和办公室使用，HEPA过滤捕捉99.97%粉尘。',
                en:'Compact 20L wet & dry vacuum for light commercial use. HEPA captures 99.97% of particles.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'wv-30l', cat:'vacuum',
    name:     { zh:'WV-30L 工业干湿吸尘器 30L',        en:'WV-30L Industrial Wet & Dry Vacuum' },
    spec:     { zh:'1500W · 30L · 不锈钢桶 · HEPA',    en:'1500W · 30L · Stainless Body · HEPA' },
    desc:     { zh:'30L工业吸尘器，不锈钢桶体，可处理大量粉尘、液体和杂物，适合制造业环境。',
                en:'30L industrial vacuum with stainless steel body for manufacturing environments.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce','oem'], hot:true },
  { id:'wv-50l', cat:'vacuum',
    name:     { zh:'WV-50L 重型工业吸尘器 50L',        en:'WV-50L Heavy-Duty Industrial Vacuum' },
    spec:     { zh:'2200W · 50L · 三电机 · 重型',       en:'2200W · 50L · 3-Motor · Heavy Duty' },
    desc:     { zh:'50L三电机工业吸尘器，适合重型作业，CNC车间、金属加工和大型工厂首选。',
                en:'50L three-motor industrial vacuum for CNC workshops and metalworking.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'wv-anti', cat:'vacuum',
    name:     { zh:'WV-AS 防静电工业吸尘器',           en:'WV-AS Anti-Static Industrial Vacuum' },
    spec:     { zh:'1800W · 40L · 防静电 · ESD安全',   en:'1800W · 40L · Anti-Static · ESD Safe' },
    desc:     { zh:'防静电工业吸尘器，专为电子制造设计，接地保护防止静电放电，适合PCB组装环境。',
                en:'Anti-static vacuum for electronics manufacturing. ESD grounding protection.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'wv-hepa', cat:'vacuum',
    name:     { zh:'WV-H14 HEPA H14级吸尘器',          en:'WV-H14 HEPA Class H14 Vacuum' },
    spec:     { zh:'2000W · 35L · HEPA H14 · 医疗级',  en:'2000W · 35L · HEPA H14 · Medical Grade' },
    desc:     { zh:'HEPA H14医疗级吸尘器，捕捉99.995%微粒，适合医院、洁净室和制药生产。',
                en:'Medical-grade HEPA H14 vacuum capturing 99.995% of particles. For hospitals and clean rooms.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'wv-explosion', cat:'vacuum',
    name:     { zh:'WV-EX 防爆工业吸尘器',             en:'WV-EX Explosion-Proof Vacuum' },
    spec:     { zh:'ATEX认证 · 40L · 防爆 · Zone 21',  en:'ATEX · 40L · Explosion-Proof · Zone 21' },
    desc:     { zh:'ATEX认证防爆吸尘器，适合危险环境，如喷漆房、化工设施和粮食存储。',
                en:'ATEX-certified explosion-proof vacuum for hazardous environments and chemical facilities.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce'], hot:false },
  { id:'wv-backpack', cat:'vacuum',
    name:     { zh:'WV-BP 背负式吸尘器',                en:'WV-BP Backpack Vacuum Cleaner' },
    spec:     { zh:'1200W · 6L · 背负式 · 轻量',        en:'1200W · 6L · Backpack · Lightweight' },
    desc:     { zh:'轻量背负式吸尘器，适合楼梯、狭小空间和酒店办公室快速清洁，人体工学设计。',
                en:'Lightweight backpack vacuum for stairs and tight spaces. Ergonomic design.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'wv-central', cat:'vacuum',
    name:     { zh:'WV-CV 中央吸尘系统',                en:'WV-CV Central Vacuum System' },
    spec:     { zh:'5.5kW · 200L · 中央系统 · 多接口',  en:'5.5kW · 200L · Central System · Multi-port' },
    desc:     { zh:'工业中央吸尘系统，适合大型工厂固定安装，设施内多个吸入阀接口。',
                en:'Industrial central vacuum for large factories. Fixed installation with multiple inlet valves.' },
    moq:'1 set', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'wv-woodshop', cat:'vacuum',
    name:     { zh:'WV-WS 木工吸尘集尘器',             en:'WV-WS Woodworking Dust Extractor' },
    spec:     { zh:'2200W · 80L · 袋+桶 · 木粉专用',   en:'2200W · 80L · Bag + Drum · Wood Dust' },
    desc:     { zh:'大容量木工集尘器，适合家具厂和木工车间，布袋+桶双重过滤，快速清空。',
                en:'High-capacity wood dust extractor for furniture factories and carpentry workshops.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce'], hot:false },
  { id:'wv-2m', cat:'vacuum',
    name:     { zh:'WV-2M 双电机商用吸尘器',           en:'WV-2M Twin-Motor Commercial Vacuum' },
    spec:     { zh:'2×1000W · 25L · 双电机 · 旁通冷却', en:'2×1000W · 25L · Twin Motor · Bypass Cooling' },
    desc:     { zh:'双电机旁通冷却商用吸尘器，适合持续日常作业，自冷却延长使用寿命，酒店品质。',
                en:'Twin-motor bypass commercial vacuum for continuous daily operation. Hotel and hospitality grade.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce','oem'], hot:true },
  { id:'wv-ride', cat:'vacuum',
    name:     { zh:'WV-RI 驾驶式扫吸一体机',           en:'WV-RI Ride-On Industrial Sweeper-Vac' },
    spec:     { zh:'24V电池 · 200L · 扫+吸一体',        en:'24V Battery · 200L · Sweep + Vacuum' },
    desc:     { zh:'驾驶式扫吸一体机，适合大面积地面，单次通过同时完成扫地和吸尘。',
                en:'Ride-on sweeper-vacuum for large floor areas. Single-pass sweeping and dust extraction.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:false },
  { id:'wv-robot', cat:'vacuum',
    name:     { zh:'WV-RV 商用扫地机器人（小型）',     en:'WV-RV Robot Vacuum for Commercial Spaces' },
    spec:     { zh:'28V · 2L · 激光雷达 · 自动回充',    en:'28V · 2L · LiDAR · Auto-Charge' },
    desc:     { zh:'商用激光雷达扫地机器人，适合办公室和酒店客房，定时清洁，自动回充。',
                en:'Commercial robot vacuum with LiDAR mapping for offices and hotel rooms.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce'], hot:false },

  // FLOOR SCRUBBERS
  { id:'fs-43w', cat:'scrubber',
    name:     { zh:'FS-43W 手推式洗地机 43cm',          en:'FS-43W Walk-Behind Floor Scrubber 43cm' },
    spec:     { zh:'36V 30Ah · 43cm圆盘刷 · 170㎡/h',   en:'36V 30Ah · 43cm Disc · 170 sq.m/h' },
    desc:     { zh:'紧凑手推式洗地机，适合便利店、小型餐厅和走廊，噪音低于65dB。',
                en:'Compact walk-behind scrubber for convenience stores and corridors. Under 65dB.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce'], hot:false },
  { id:'fs-50w', cat:'scrubber',
    name:     { zh:'FS-50W 手推式洗地机 50cm',          en:'FS-50W Walk-Behind Floor Scrubber 50cm' },
    spec:     { zh:'36V 50Ah · 50cm圆盘刷 · 220㎡/h · 3h续航', en:'36V 50Ah · 50cm Disc · 220 sq.m/h · 3h runtime' },
    desc:     { zh:'50cm手推式洗地机，3小时续航，适合酒店、超市和学校。',
                en:'50cm walk-behind scrubber with 3h battery life for hotels, supermarkets and schools.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:true },
  { id:'fs-65w', cat:'scrubber',
    name:     { zh:'FS-65W 手推式洗地机 65cm',          en:'FS-65W Walk-Behind Floor Scrubber 65cm' },
    spec:     { zh:'48V 70Ah · 65cm滚刷 · 310㎡/h',     en:'48V 70Ah · 65cm Cylindrical · 310 sq.m/h' },
    desc:     { zh:'65cm滚刷手推式洗地机，适合粗糙地面，包括瓷砖缝和不平整地面清洁。',
                en:'65cm cylindrical brush scrubber for rough floors and tile grout cleaning.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'fs-75w', cat:'scrubber',
    name:     { zh:'FS-75W 手推式洗地机 75cm',          en:'FS-75W Walk-Behind Floor Scrubber 75cm' },
    spec:     { zh:'48V 80Ah · 75cm圆盘刷 · 380㎡/h · 4h续航', en:'48V 80Ah · 75cm Disc · 380 sq.m/h · 4h runtime' },
    desc:     { zh:'专业75cm手推式洗地机，4小时续航，适合购物中心、物流中心和大型商业设施。',
                en:'Professional 75cm scrubber with 4h runtime. For shopping malls and logistics centers.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:true },
  { id:'fs-80r', cat:'scrubber',
    name:     { zh:'FS-80R 驾驶式洗地机 80cm',          en:'FS-80R Ride-On Floor Scrubber 80cm' },
    spec:     { zh:'48V 150Ah · 80cm · 3200㎡/h · 驾驶式', en:'48V 150Ah · 80cm · 3200 sq.m/h · Ride-On' },
    desc:     { zh:'80cm驾驶式洗地机，清洁效率3200㎡/h，单人操作高效处理大型仓库和购物中心。',
                en:'80cm ride-on scrubber covering 3200 sq.m/h for warehouses and shopping centers.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:true },
  { id:'fs-100r', cat:'scrubber',
    name:     { zh:'FS-100R 驾驶式洗地机 100cm',        en:'FS-100R Ride-On Floor Scrubber 100cm' },
    spec:     { zh:'48V 200Ah · 100cm · 5000㎡/h · 驾驶式', en:'48V 200Ah · 100cm · 5000 sq.m/h · Ride-On' },
    desc:     { zh:'大型100cm驾驶式洗地机，5000㎡/h清洁效率，适合机场、会展中心和大型工业设施。',
                en:'100cm ride-on with 5000 sq.m/h capacity for airports and convention centers.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:false },
  { id:'fs-120r', cat:'scrubber',
    name:     { zh:'FS-120R 旗舰驾驶洗地机 120cm',      en:'FS-120R Mega Ride-On Floor Scrubber 120cm' },
    spec:     { zh:'72V 300Ah · 120cm · 7000㎡/h · 旗舰级', en:'72V 300Ah · 120cm · 7000 sq.m/h · Premium' },
    desc:     { zh:'旗舰级120cm驾驶洗地机，7000㎡/h产能，大幅降低大型设施人工成本。',
                en:'Premium 120cm ride-on with 7000 sq.m/h throughput. Significantly reduces labor costs.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'fs-65eco', cat:'scrubber',
    name:     { zh:'FS-65ECO 节能手推洗地机',           en:'FS-65ECO Eco Walk-Behind Scrubber' },
    spec:     { zh:'48V · 65cm · 节能模式 · 节水30%',   en:'48V · 65cm · Eco Mode · 30% Water-Saving' },
    desc:     { zh:'节能手推洗地机，30%节水技术，适合注重可持续发展的设施绿色清洁解决方案。',
                en:'Eco-mode scrubber with 30% water-saving technology for sustainability-focused facilities.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'fs-outdoor', cat:'scrubber',
    name:     { zh:'FS-OD 户外洗扫一体机',              en:'FS-OD Outdoor Scrubber-Sweeper' },
    spec:     { zh:'48V · 70cm · IP55 · 户外级',         en:'48V · 70cm · IP55 · Outdoor Grade' },
    desc:     { zh:'IP55户外手推洗扫一体机，适合广场、停车场和户外硬质地面。',
                en:'IP55 outdoor-rated scrubber-sweeper for plazas, car parks and outdoor surfaces.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:false },
  { id:'fs-steam', cat:'scrubber',
    name:     { zh:'FS-ST 蒸汽洗地机',                  en:'FS-ST Steam Floor Cleaner' },
    spec:     { zh:'3kW · 50cm · 蒸汽160°C · 无化学品', en:'3kW · 50cm · Steam 160°C · Chemical-Free' },
    desc:     { zh:'商用蒸汽洗地机，无化学品深层消毒，160°C蒸汽杀灭99.9%细菌和病毒。',
                en:'Chemical-free deep sanitisation at 160°C. Kills 99.9% of bacteria and viruses.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'fs-mini', cat:'scrubber',
    name:     { zh:'FS-M50 迷你洗地吸干机',             en:'FS-M50 Mini Scrubber-Dryer' },
    spec:     { zh:'24V 20Ah · 25cm · 微型 · 缝隙清洁', en:'24V 20Ah · 25cm · Micro · Grout Cleaning' },
    desc:     { zh:'超紧凑微型洗地机，适合狭窄通道、卫生间和瓷砖缝隙，锂电2小时续航。',
                en:'Ultra-compact micro scrubber for narrow aisles, restrooms and tile grout.' },
    moq:'1 unit', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'fs-dualbrush', cat:'scrubber',
    name:     { zh:'FS-2B 双刷手推式洗地机',            en:'FS-2B Dual Brush Walk-Behind Scrubber' },
    spec:     { zh:'48V 60Ah · 2×35cm · 双圆盘刷 · 260㎡/h', en:'48V 60Ah · 2×35cm Dual Disc · 260 sq.m/h' },
    desc:     { zh:'双反转刷洗地机，专攻纹理地面、窑砖和防滑地面深层清洁。',
                en:'Dual counter-rotating brush for deep cleaning textured floors and anti-slip surfaces.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },

  // ROBOTIC SWEEPERS
  { id:'rs-s100', cat:'sweeper',
    name:     { zh:'RS-S100 商用扫地机器人',             en:'RS-S100 Commercial Robotic Sweeper' },
    spec:     { zh:'24V · 激光雷达 · 800㎡/h · 自动回充', en:'24V · LiDAR · 800 sq.m/h · Auto-Charge' },
    desc:     { zh:'入门商用扫地机器人，激光雷达导航，800㎡/h覆盖，定时清洁，App控制。',
                en:'Entry commercial robotic sweeper with LiDAR. 800 sq.m/h coverage, app control.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce'], hot:false },
  { id:'rs-s200', cat:'sweeper',
    name:     { zh:'RS-S200 进阶商用扫地机器人',        en:'RS-S200 Advanced Commercial Robotic Sweeper' },
    spec:     { zh:'48V · 激光雷达+视觉 · 1500㎡/h · 自动倒垃圾', en:'48V · LiDAR+Vision · 1500 sq.m/h · Auto-Empty' },
    desc:     { zh:'进阶机器人，激光雷达+视觉融合导航，1500㎡/h，自动倒垃圾，适合酒店、医院和大型办公室。',
                en:'Advanced LiDAR+vision navigation, 1500 sq.m/h with auto-empty dock. For hotels and hospitals.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:true },
  { id:'rs-scrub200', cat:'sweeper',
    name:     { zh:'RS-SC200 扫洗一体机器人',            en:'RS-SC200 Robotic Scrubber-Sweeper' },
    spec:     { zh:'48V · 激光雷达 · 扫+洗一体 · 1200㎡/h', en:'48V · LiDAR · Sweep + Scrub · 1200 sq.m/h' },
    desc:     { zh:'扫洗一体机器人，一次通过完成扫地、清洗和干燥，适合美食广场、医院走廊和商场。',
                en:'Sweeps, scrubs and dries in one pass. Ideal for food courts and hospital corridors.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:true },
  { id:'rs-outdoor', cat:'sweeper',
    name:     { zh:'RS-OD200 户外扫地机器人',            en:'RS-OD200 Outdoor Robotic Sweeper' },
    spec:     { zh:'48V · GPS+激光雷达 · IP65 · 2000㎡/h', en:'48V · GPS+LiDAR · IP65 · 2000 sq.m/h' },
    desc:     { zh:'IP65户外扫地机器人，适合停车场、广场和校园，GPS辅助导航覆盖大型户外区域。',
                en:'IP65 outdoor robotic sweeper for carparks, plazas and campuses. GPS-assisted navigation.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'rs-industrial', cat:'sweeper',
    name:     { zh:'RS-IND300 工业级扫地机器人',         en:'RS-IND300 Industrial Robotic Sweeper' },
    spec:     { zh:'72V · 激光雷达 · 3000㎡/h · 80kg垃圾容量', en:'72V · LiDAR · 3000 sq.m/h · 80kg Capacity' },
    desc:     { zh:'重型工业扫地机器人，适合仓库和工厂，80kg垃圾容量，可处理金属屑和工业粉尘。',
                en:'Heavy-duty industrial robot for warehouses and factories. 80kg debris capacity.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'rs-disinfect', cat:'sweeper',
    name:     { zh:'RS-DIS 消毒机器人',                  en:'RS-DIS Disinfection Robot' },
    spec:     { zh:'48V · UV-C+喷雾 · 500㎡/h · 医疗级', en:'48V · UV-C + Spray · 500 sq.m/h · Medical' },
    desc:     { zh:'自主消毒机器人，UV-C照射结合消毒液雾化，适合医院、机场和隔离设施。',
                en:'Autonomous disinfection robot with UV-C and misting. For hospitals and airports.' },
    moq:'1 unit', lead:'15-20 days', badges:['ce','oem'], hot:false },
  { id:'rs-hotel', cat:'sweeper',
    name:     { zh:'RS-HTL 酒店走廊扫地机器人',         en:'RS-HTL Hotel Corridor Robotic Sweeper' },
    spec:     { zh:'24V · 纤薄45cm · 静音55dB · 酒店级', en:'24V · Slim 45cm · Silent 55dB · Hotel Grade' },
    desc:     { zh:'超薄45cm酒店走廊机器人，55dB静音运行，夜间清洁不打扰住客。',
                en:'Ultra-slim 45cm hotel corridor robot. Silent 55dB for overnight cleaning.' },
    moq:'1 unit', lead:'10-15 days', badges:['ce','oem'], hot:false },
  { id:'rs-food', cat:'sweeper',
    name:     { zh:'RS-FP 食品厂扫洗机器人',             en:'RS-FP Food Plant Robotic Scrubber-Sweeper' },
    spec:     { zh:'48V · 不锈钢 · IP67 · 食品级 · 可冲洗', en:'48V · Stainless · IP67 · Food Grade · Wash-Down' },
    desc:     { zh:'IP67不锈钢扫洗机器人，专为食品加工厂设计，耐高压冲洗和食品级化学品。',
                en:'IP67 stainless steel robotic scrubber-sweeper for food processing plants.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'rs-window', cat:'sweeper',
    name:     { zh:'RS-WC 玻璃幕墙清洁机器人',          en:'RS-WC Glass Facade Cleaning Robot' },
    spec:     { zh:'吸附式 · 磁性 · 玻璃幕墙 · 自动路径', en:'Suction Mount · Magnetic · Auto-Path Planning' },
    desc:     { zh:'高层建筑玻璃幕墙清洁机器人，消除绳降风险，远程监控，自动路径规划。',
                en:'Robotic glass facade cleaner for high-rise buildings. Eliminates rope-access risk.' },
    moq:'1 unit', lead:'20-30 days', badges:['ce','oem'], hot:false },
  { id:'rs-fleet', cat:'sweeper',
    name:     { zh:'RS-FLT 机器人集群管理系统（5台套）', en:'RS-FLT Fleet Management System (5-Pack)' },
    spec:     { zh:'5× RS-S200 + 云平台 + API接口',      en:'5× RS-S200 + Cloud Platform + API' },
    desc:     { zh:'5台机器人套装，含中央云管理平台，实时监控、任务调度和报告API，适合大型设施统一管理。',
                en:'5-robot fleet with centralised cloud management, real-time monitoring and reporting API.' },
    moq:'1 set (5 units)', lead:'20-30 days', badges:['ce','oem'], hot:false },

  // PARTS & CONSUMABLES
  { id:'con-nozzle', cat:'consumable',
    name:{ zh:'高压喷嘴套装（5件）', en:'Pressure Washer Nozzle Set (5-Pack)' },
    spec:{ zh:'0°/15°/25°/40°/65° · 1/4"快插', en:'0°/15°/25°/40°/65° · 1/4" Quick-Connect' },
    desc:{ zh:'通用高压清洗机喷嘴套装，包含五种角度，适配绝大多数品牌高压清洗机1/4"快插接口。建议备2套。', en:'Universal nozzle set covering 5 angles. Fits most 1/4" quick-connect pressure washers. Keep 2 sets in stock.' },
    moq:'5 sets', lead:'5-10 days', badges:['ce'], hot:true },
  { id:'con-hepa', cat:'consumable',
    name:{ zh:'HEPA H14 滤芯（3件装）', en:'HEPA H14 Filter Cartridge (3-Pack)' },
    spec:{ zh:'HEPA H14 · 99.995% · 吸尘器适用', en:'HEPA H14 · 99.995% · For Industrial Vacuums' },
    desc:{ zh:'工业吸尘器HEPA H14替换滤芯，过滤效率99.995%，建议每2个月更换一次，3件装备足三季用量。', en:'Replacement HEPA H14 filter cartridges for industrial vacuums. 99.995% efficiency. Replace every 2 months.' },
    moq:'3 packs', lead:'5-10 days', badges:['ce'], hot:true },
  { id:'con-brush', cat:'consumable',
    name:{ zh:'洗地机刷盘套装（圆盘/滚刷）', en:'Floor Scrubber Brush Pad Set (Disc/Cylindrical)' },
    spec:{ zh:'43/50/65/75cm · 圆盘+滚刷可选', en:'43/50/65/75cm · Disc or Cylindrical options' },
    desc:{ zh:'兼容FS系列洗地机的替换刷盘，有圆盘型和滚刷型两种规格，建议备2套，粗糙地面每2月更换。', en:'Compatible brush pads for FS-series scrubbers. Disc and cylindrical options. Keep 2 sets in stock.' },
    moq:'2 sets', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'con-squeegee', cat:'consumable',
    name:{ zh:'洗地机刮水条套装（前+后）', en:'Scrubber Squeegee Blade Set (Front+Rear)' },
    spec:{ zh:'天然橡胶 · 适配FS系列 · 前后套装', en:'Natural Rubber · FS Series Compatible · Front+Rear Set' },
    desc:{ zh:'天然橡胶刮水条，前刮+后刮一套，吸水效果好。每3个月或吸水效果下降时更换，建议前后同时换。', en:'Natural rubber squeegee blades, front and rear set. Replace every 3 months or when water pickup degrades.' },
    moq:'2 sets', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'con-sidebr', cat:'consumable',
    name:{ zh:'扫地机器人边刷（6件装）', en:'Robot Sweeper Side Brush Set (6-Pack)' },
    spec:{ zh:'适配RS系列 · 左右各3件 · 3个月用量', en:'RS Series Compatible · L+R×3 · 3-month supply' },
    desc:{ zh:'扫地机器人边刷，最高频更换耗材，建议备6个月用量。刷毛弯曲变形或脱落时立即更换。', en:'Robot sweeper side brushes. The most frequently replaced consumable. Replace when bristles bend or fall out.' },
    moq:'6 packs', lead:'5-10 days', badges:['ce'], hot:false },
  { id:'con-filter-vac', cat:'consumable',
    name:{ zh:'吸尘器滤袋（无纺布，10件装）', en:'Vacuum Filter Bag Set (Non-woven, 10-Pack)' },
    spec:{ zh:'无纺布 · 适配WV系列 · 防尘外漏', en:'Non-woven · WV Series Compatible · Dust-proof' },
    desc:{ zh:'工业吸尘器替换滤袋，无纺布材质，装满立即更换，10件装约2个月用量，建议随机备货。', en:'Replacement filter bags for WV-series vacuums. Non-woven. Replace when full. 10-pack ~2 month supply.' },
    moq:'10 packs', lead:'5-10 days', badges:['ce'], hot:false },
  { id:'con-cleaner', cat:'consumable',
    name:{ zh:'中性地板清洁剂（5L 浓缩型）', en:'Neutral Floor Cleaner Concentrate (5L)' },
    spec:{ zh:'中性pH · 1:50稀释 · 适配洗地机水箱', en:'Neutral pH · 1:50 dilution · Compatible with scrubber tanks' },
    desc:{ zh:'专业中性地板清洁剂，5L浓缩型，1:50稀释使用，不损伤地面涂层，适用于大理石、瓷砖、环氧地坪。', en:'Professional neutral floor cleaner, 5L concentrate. 1:50 dilution. Safe for marble, tile and epoxy floors.' },
    moq:'6 bottles', lead:'5-10 days', badges:['ce'], hot:true },
  { id:'con-pump-seal', cat:'consumable',
    name:{ zh:'高压泵密封圈套装', en:'High-Pressure Pump Seal Kit' },
    spec:{ zh:'AR/CAT泵通用 · O形圈+油封', en:'AR/CAT Pump Compatible · O-rings + Oil Seals' },
    desc:{ zh:'高压清洗机泵头密封圈套装，适配意大利AR/CAT品牌泵，出现漏水或压力不稳时及时更换。', en:'Pump seal kit for AR/CAT pumps. Replace when leaks or unstable pressure occur. Internationally available.' },
    moq:'5 kits', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'con-hose', cat:'consumable',
    name:{ zh:'高压水管 15m（8mm 内径）', en:'High-Pressure Hose 15m (8mm ID)' },
    spec:{ zh:'15m · 8mm内径 · 耐压400bar · 1/4"快插', en:'15m · 8mm ID · 400 bar rated · 1/4" Quick-Connect' },
    desc:{ zh:'耐压400bar高压水管，15米标准长度，出现鼓包或裂缝时更换，建议DHL发货或当地采购。', en:'400 bar rated high-pressure hose, 15m. Replace if blistering or cracked. Recommend DHL or local sourcing.' },
    moq:'2 units', lead:'7-14 days', badges:['ce'], hot:false },
  { id:'con-robot-brush', cat:'consumable',
    name:{ zh:'扫地机器人主滚刷', en:'Robot Sweeper Main Rolling Brush' },
    spec:{ zh:'适配RS-S200/RS-SC200 · 3个月用量', en:'Fits RS-S200 / RS-SC200 · 3-month replacement cycle' },
    desc:{ zh:'扫地机器人主滚刷，刷毛严重磨损或持续缠绕时更换，建议每3个月检查一次，备2件。', en:'Main rolling brush for robotic sweepers. Replace when heavily worn or persistently tangled. Keep 2 spares.' },
    moq:'2 units', lead:'7-14 days', badges:['ce'], hot:false },
];

// ── 5. 博客文章（中英文统一管理）────────────────────────
const BLOG_POSTS = [
  { id:1, imgKey:'blog-guide-scrubber', cat:{ zh:'选购指南', en:'Buying Guide' },
    title:  { zh:'2025年商用洗地机选购完全指南：驾驶式 vs 手推式怎么选？',
              en:'2025 Complete Guide: Ride-On vs Walk-Behind Floor Scrubber — Which Is Right for You?' },
    excerpt:{ zh:'根据清洁面积、地面材质、预算三步快速锁定最适合您场所的洗地机型号。',
              en:'Three steps to quickly identify the best scrubber model for your facility based on area, floor type and budget.' },
    date:'2025-03-15', readZh:'5分钟', readEn:'5 min', icon:'📊' },
  { id:2, imgKey:'blog-pressure-mistakes', cat:{ zh:'维护技巧', en:'Maintenance' },
    title:  { zh:'高压清洗机7大常见误用，99%的买家都踩过坑',
              en:'7 Common Pressure Washer Mistakes — 99% of Buyers Have Made Them' },
    excerpt:{ zh:'空转烧泵、硬水损坏、错误喷嘴选择——避免这些错误，大幅延长高压清洗机使用寿命。',
              en:'Running dry, hard water damage, wrong nozzle selection — avoid these mistakes to extend machine life significantly.' },
    date:'2025-03-08', readZh:'4分钟', readEn:'4 min', icon:'🔧' },
  { id:3, imgKey:'blog-sea-market', cat:{ zh:'行业资讯', en:'Industry' },
    title:  { zh:'2025年东南亚商用清洁设备市场分析',
              en:'Commercial Cleaning Equipment Market in Southeast Asia 2025' },
    excerpt:{ zh:'东南亚清洁服务市场预计2030年达66亿美元，对于设施管理者意味着什么？',
              en:'The SE Asian cleaning market is projected to reach $6.6B by 2030. What it means for facility managers.' },
    date:'2025-02-28', readZh:'6分钟', readEn:'6 min', icon:'📈' },
  { id:4, imgKey:'blog-vacuum-guide', cat:{ zh:'选购指南', en:'Buying Guide' },
    title:  { zh:'工业吸尘器选购指南：干式、湿式、HEPA、防爆型怎么选？',
              en:'Industrial Vacuum Guide: Dry, Wet, HEPA, Anti-Static or Explosion-Proof — Which Do You Need?' },
    excerpt:{ zh:'五种类型工业吸尘器各自适用哪些场景，一文彻底搞清楚。',
              en:'Each type serves a specific environment. A complete breakdown to help you choose the right one.' },
    date:'2025-02-20', readZh:'5分钟', readEn:'5 min', icon:'🔍' },
  { id:5, imgKey:'blog-malaysia-case', cat:{ zh:'客户案例', en:'Case Study' },
    title:  { zh:'马来西亚汽配工厂如何将清洁成本降低40%',
              en:'How a Malaysian Auto Parts Factory Reduced Cleaning Costs by 40%' },
    excerpt:{ zh:'从人工拖地转换为手推洗地机，这家工厂大幅削减清洁时间和成本，ROI不到8个月。',
              en:'By switching from manual mopping to a walk-behind scrubber, this factory cut cleaning time and costs with ROI under 8 months.' },
    date:'2025-02-12', readZh:'4分钟', readEn:'4 min', icon:'🏭' },
  { id:6, imgKey:'blog-robot-worth', cat:{ zh:'产品介绍', en:'Product' },
    title:  { zh:'商用扫地机器人：2025年值不值得买？',
              en:'Commercial Robotic Sweepers: Are They Worth It in 2025?' },
    excerpt:{ zh:'ROI分析、适用环境、局限性及建议——考虑购买自主清洁机器人的企业必读。',
              en:'ROI analysis, suitable environments, limitations and recommendations for businesses considering autonomous cleaning robots.' },
    date:'2025-02-05', readZh:'5分钟', readEn:'5 min', icon:'🤖' },
  { id:7, imgKey:'blog-battery-care', cat:{ zh:'维护技巧', en:'Maintenance' },
    title:  { zh:'洗地机电池保养手册：延长50%电池寿命的正确方法',
              en:'Floor Scrubber Battery Care: Extend Battery Life by 50% With These Simple Steps' },
    excerpt:{ zh:'电池衰减是洗地机投诉第一大原因，正确保养可将电池寿命从2年延长到4年以上。',
              en:'Battery degradation is the #1 complaint. Proper care can extend battery life from 2 to 4+ years.' },
    date:'2025-01-28', readZh:'3分钟', readEn:'3 min', icon:'🔋' },
  { id:8, imgKey:'blog-uae-market', cat:{ zh:'行业资讯', en:'Industry' },
    title:  { zh:'UAE清洁设备市场：中国品牌的机遇与挑战',
              en:'UAE Cleaning Equipment Market: Opportunities and Challenges for Chinese Brands' },
    excerpt:{ zh:'UAE是中东清洁设备贸易枢纽，认证要求、经销商格局和增长领域全面解析。',
              en:'UAE is the Middle East hub for cleaning equipment trade. Certification requirements and growth sectors explained.' },
    date:'2025-01-20', readZh:'5分钟', readEn:'5 min', icon:'🇦🇪' },
  { id:9, imgKey:'blog-ce-explained', cat:{ zh:'选购指南', en:'Buying Guide' },
    title:  { zh:'CE认证详解：从中国采购清洁设备必须知道的事',
              en:'CE Certification Explained: What You Must Know When Sourcing Cleaning Equipment from China' },
    excerpt:{ zh:'CE认证真正含义、涵盖范围，以及为什么对采购商来说它比价格更重要。',
              en:'What CE marking really means, what it covers, and why it matters more than price when sourcing from China.' },
    date:'2025-01-12', readZh:'4分钟', readEn:'4 min', icon:'📋' },
];

// ── 6. 产品工具函数 ──────────────────────────────────────
function getProducts(cat, query) {
  let list = cat && cat !== 'all' ? PRODUCTS.filter(p => p.cat === cat) : [...PRODUCTS];
  // Exclude consumables from "all" view unless explicitly selected
  if (!cat || cat === 'all') list = list.filter(p => p.cat !== 'consumable');
  if (query) {
    const q = query.toLowerCase();
    const lang = currentLang;
    list = list.filter(p =>
      p.name[lang].toLowerCase().includes(q) ||
      p.spec[lang].toLowerCase().includes(q) ||
      p.desc[lang].toLowerCase().includes(q)
    );
  }
  return list;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function renderProductCard(p) {
  const lang = currentLang;
  const name = p.name[lang];
  const spec = p.spec[lang];
  const isHot = p.hot;
  const ceLabel  = T('prod.badge.ce');
  const oemLabel = T('prod.badge.oem');
  const hotLabel = T('prod.badge.hot');
  const viewLabel  = T('prod.viewdetail');
  const quoteLabel = T('prod.getquote');

  const badges = [
    p.badges.includes('ce')  ? `<span class="badge badge-cyan">${ceLabel}</span>` : '',
    p.badges.includes('oem') ? `<span class="badge badge-navy">${oemLabel}</span>` : '',
    isHot                    ? `<span class="badge badge-hot">${hotLabel}</span>` : '',
  ].join('');

  return `<div class="product-card" onclick="location.href='product.html?id=${p.id}'">
    <div class="product-card-img">
      <img src="images/${p.id}.svg" alt="${name}" style="width:100%;height:100%;object-fit:cover;"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="product-card-placeholder" style="display:none;">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor">
          <rect x="8" y="8" width="32" height="32" rx="4" stroke-width="1.5"/>
          <circle cx="24" cy="24" r="8" stroke-width="1.5"/>
          <path d="M24 16v4M24 28v4M16 24h4M28 24h4" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="product-card-badges">${badges}</div>
    </div>
    <div class="product-card-body">
      <div class="product-card-name">${name}</div>
      <div class="product-card-spec">${spec}</div>
    </div>
    <div class="product-card-footer">
      <a href="product.html?id=${p.id}" class="btn-sm btn-primary-sm">${viewLabel}</a>
      <a href="contact.html?product=${encodeURIComponent(name)}" class="btn-sm btn-outline-sm">${quoteLabel}</a>
    </div>
  </div>`;
}

// ── 7. 博客工具函数 ──────────────────────────────────────
function getBlogPosts(limit) {
  const list = limit ? BLOG_POSTS.slice(0, limit) : BLOG_POSTS;
  return list;
}

function renderBlogCard(b) {
  const lang = currentLang;
  const readTime = lang === 'zh' ? b.readZh : b.readEn;
  const imgKey = b.imgKey || 'blog-guide-scrubber';
  return `<div class="blog-card" onclick="location.href='blog.html'">
    <div class="blog-card-img" style="overflow:hidden;position:relative;">
      <img src="images/${imgKey}.svg" alt="${b.title[lang]}" style="width:100%;height:100%;object-fit:cover;"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <span style="display:none;align-items:center;justify-content:center;font-size:48px;width:100%;height:100%">${b.icon}</span>
    </div>
    <div class="blog-card-body">
      <div class="blog-card-cat">${b.cat[lang]}</div>
      <h3 class="blog-card-title">${b.title[lang]}</h3>
      <p class="blog-card-excerpt">${b.excerpt[lang]}</p>
      <div class="blog-card-meta">
        <span>${b.date}</span>
        <span>${readTime}</span>
        <span class="blog-readmore" data-i18n="blog.readmore">${T('blog.readmore')}</span>
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════
// 8. 耗材 & 配件数据库（按设备品类分组）
// ═══════════════════════════════════════════════════════════

// 通用翻译键
const CONSUMABLE_I18N = {
  zh: {
    'con.section.title':  '配套耗材与备用配件',
    'con.section.sub':    '以下耗材均可单独采购，支持国际快递发货。首单建议同时备购3个月用量，避免断货影响运营。',
    'con.quote.btn':      '询价补货',
    'con.col.name':       '耗材名称',
    'con.col.cycle':      '更换周期',
    'con.col.condition':  '更换条件',
    'con.col.self':       '客户自换',
    'con.col.ship':       '国际快递',
    'con.yes':            '✓ 可以',
    'con.limited':        '⚠ 需申报',
    'con.no':             '✗ 需技术',
    'con.tip.title':      '💡 耗材采购建议',
    'con.tip.body':       '首次发货建议同时采购 3 个月用量的耗材包，随机发出。后续按季度定期补货，ELVONIS 可为您建立定期供货计划，锁定长期价格，避免缺货影响运营。',
    'con.tip.btn':        '建立定期补货计划',
    'con.cycle.1m':       '每月',
    'con.cycle.2m':       '每2个月',
    'con.cycle.3m':       '每3个月',
    'con.cycle.4m':       '每3–4个月',
    'con.cycle.6m':       '每6个月',
    'con.cycle.12m':      '每12个月',
    'con.cycle.24m':      '每24个月',
    'con.cycle.asneeded': '按需',
  },
  en: {
    'con.section.title':  'Consumables & Spare Parts',
    'con.section.sub':    'All consumables available for separate purchase with international shipping. We recommend ordering a 3-month supply alongside your equipment to avoid operational downtime.',
    'con.quote.btn':      'Order Consumables',
    'con.col.name':       'Item',
    'con.col.cycle':      'Replacement Cycle',
    'con.col.condition':  'Replace When',
    'con.col.self':       'Self-Replace',
    'con.col.ship':       'Int\'l Shipping',
    'con.yes':            '✓ Yes',
    'con.limited':        '⚠ Declare',
    'con.no':             '✗ Tech needed',
    'con.tip.title':      '💡 Consumables Tip',
    'con.tip.body':       'We recommend ordering a 3-month consumables pack alongside your first equipment order. For ongoing supply, ELVONIS can set up a quarterly replenishment plan with locked pricing to ensure you never run out.',
    'con.tip.btn':        'Set Up Replenishment Plan',
    'con.cycle.1m':       'Monthly',
    'con.cycle.2m':       'Every 2 months',
    'con.cycle.3m':       'Every 3 months',
    'con.cycle.4m':       'Every 3–4 months',
    'con.cycle.6m':       'Every 6 months',
    'con.cycle.12m':      'Annually',
    'con.cycle.24m':      'Every 2 years',
    'con.cycle.asneeded': 'As needed',
  }
};

function CT(key) {
  const d = CONSUMABLE_I18N[currentLang] || CONSUMABLE_I18N['en'];
  return d[key] || CONSUMABLE_I18N['en'][key] || key;
}

// 耗材数据库：按 cat 索引
const CONSUMABLES = {

  // ── 高压清洗机 ────────────────────────────────────────
  pressure: [
    { name:{ zh:'喷嘴套装（0°/15°/25°/40°/65°）', en:'Nozzle Set (0°/15°/25°/40°/65°)' },
      cycle:'con.cycle.4m', condition:{ zh:'压力下降或喷雾不均', en:'Pressure drops or uneven spray' },
      selfReplace:true, shipOK:true,
      note:{ zh:'最常用耗材，建议常备2套', en:'Most-used consumable — keep 2 sets in stock' } },
    { name:{ zh:'进水滤网', en:'Inlet Filter Screen' },
      cycle:'con.cycle.3m', condition:{ zh:'每月检查清洗，3月更换', en:'Clean monthly, replace every 3 months' },
      selfReplace:true, shipOK:true,
      note:{ zh:'防止杂质进入泵头', en:'Protects pump from debris' } },
    { name:{ zh:'泵头密封圈套装', en:'Pump Seal Kit' },
      cycle:'con.cycle.6m', condition:{ zh:'出现漏水或压力不稳', en:'Leaks or unstable pressure' },
      selfReplace:'limited', shipOK:true,
      note:{ zh:'建议选意大利AR/CAT泵，密封圈全球有售', en:'AR/CAT pump seals available worldwide' } },
    { name:{ zh:'高压水管（15m）', en:'High-Pressure Hose (15m)' },
      cycle:'con.cycle.24m', condition:{ zh:'出现鼓包、裂缝或接头漏水', en:'Blistering, cracks or leaking fittings' },
      selfReplace:true, shipOK:'limited',
      note:{ zh:'体积较大，建议DHL或当地采购', en:'Bulky — use DHL or source locally' } },
    { name:{ zh:'高压枪（扳机枪）', en:'Trigger Gun' },
      cycle:'con.cycle.24m', condition:{ zh:'漏水或扳机失灵', en:'Leaking or trigger malfunction' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'延伸喷杆（1m）', en:'Extension Lance (1m)' },
      cycle:'con.cycle.asneeded', condition:{ zh:'变形或接口损坏', en:'Bent or connector damaged' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'泡沫炮（选配）', en:'Foam Cannon (optional)' },
      cycle:'con.cycle.asneeded', condition:{ zh:'出液不均或堵塞', en:'Uneven foam or blockage' },
      selfReplace:true, shipOK:true, note:{ zh:'汽车美容和外墙清洁必备', en:'Essential for car detailing & facade cleaning' } },
  ],

  // ── 工业吸尘器 ────────────────────────────────────────
  vacuum: [
    { name:{ zh:'滤芯（HEPA / 标准）', en:'Filter Cartridge (HEPA / Standard)' },
      cycle:'con.cycle.2m', condition:{ zh:'吸力明显下降时立即更换', en:'Replace when suction noticeably drops' },
      selfReplace:true, shipOK:true,
      note:{ zh:'最关键耗材，建议备3–6个月用量', en:'Most critical — stock 3–6 months supply' } },
    { name:{ zh:'滤袋（无纺布）', en:'Filter Bag (Non-woven)' },
      cycle:'con.cycle.2m', condition:{ zh:'装满后立即更换', en:'Replace when full' },
      selfReplace:true, shipOK:true,
      note:{ zh:'建议随机附送备用2个', en:'Include 2 spares with initial shipment' } },
    { name:{ zh:'吸尘软管（32/38/50mm）', en:'Vacuum Hose (32/38/50mm)' },
      cycle:'con.cycle.12m', condition:{ zh:'出现裂缝或漏气', en:'Cracks or air leaks' },
      selfReplace:true, shipOK:true,
      note:{ zh:'规格需与机器匹配', en:'Must match machine inlet size' } },
    { name:{ zh:'地板吸嘴', en:'Floor Nozzle' },
      cycle:'con.cycle.12m', condition:{ zh:'磨损变形影响吸力', en:'Worn or deformed affecting suction' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'缝隙吸嘴', en:'Crevice Tool' },
      cycle:'con.cycle.asneeded', condition:{ zh:'断裂或变形', en:'Broken or deformed' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'桶盖密封圈', en:'Lid Seal Ring' },
      cycle:'con.cycle.12m', condition:{ zh:'漏气或密封不严', en:'Air leaks around lid' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
  ],

  // ── 商用洗地机 ────────────────────────────────────────
  scrubber: [
    { name:{ zh:'刷盘（圆盘型 / 滚刷型）', en:'Brush Pad (Disc / Cylindrical)' },
      cycle:'con.cycle.3m', condition:{ zh:'磨损至警戒线或清洁效果下降', en:'Worn to warning line or cleaning quality drops' },
      selfReplace:true, shipOK:true,
      note:{ zh:'最高频耗材，建议备2套，粗糙地面缩短至2个月', en:'Most frequent — keep 2 sets. Rough floors may need replacement every 2 months' } },
    { name:{ zh:'刮水条（前刮 + 后刮套装）', en:'Squeegee Blade Set (Front + Rear)' },
      cycle:'con.cycle.3m', condition:{ zh:'吸水效果变差、地面留水痕', en:'Poor water pickup or streaks left on floor' },
      selfReplace:true, shipOK:true,
      note:{ zh:'前后一起换效果最好', en:'Replace front and rear together for best results' } },
    { name:{ zh:'污水箱滤网', en:'Recovery Tank Filter Screen' },
      cycle:'con.cycle.3m', condition:{ zh:'每月清洗，3个月更换', en:'Clean monthly, replace every 3 months' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'中性地板清洁剂（5L 浓缩型）', en:'Neutral Floor Cleaner (5L Concentrate)' },
      cycle:'con.cycle.1m', condition:{ zh:'用完补充', en:'Replenish when empty' },
      selfReplace:true, shipOK:true,
      note:{ zh:'高频复购，建议随机备3桶', en:'High-frequency reorder — include 3 bottles with initial order' } },
    { name:{ zh:'充电器', en:'Charger' },
      cycle:'con.cycle.asneeded', condition:{ zh:'充电异常或不充电', en:'Abnormal charging or no charge' },
      selfReplace:true, shipOK:'limited',
      note:{ zh:'注意当地电压规格（110V / 220V）', en:'Check local voltage spec (110V / 220V)' } },
    { name:{ zh:'电池组（锂电）', en:'Battery Pack (Lithium)' },
      cycle:'con.cycle.asneeded', condition:{ zh:'续航不足额定时间50%时考虑更换', en:'Replace when runtime drops below 50% of rated capacity' },
      selfReplace:'limited', shipOK:'limited',
      note:{ zh:'航空运输受限，建议海运或当地采购，价格约占整机30–50%', en:'Air freight restricted — use sea freight or local sourcing. Costs ~30–50% of machine price' } },
    { name:{ zh:'吸水管 & 密封圈', en:'Suction Hose & Seals' },
      cycle:'con.cycle.12m', condition:{ zh:'漏水或吸水不畅', en:'Leaks or poor water recovery' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
  ],

  // ── 商用扫地机器人 ────────────────────────────────────
  sweeper: [
    { name:{ zh:'边刷（左 + 右）', en:'Side Brush (Left + Right)' },
      cycle:'con.cycle.1m', condition:{ zh:'刷毛弯曲变形或脱落', en:'Bristles bent, worn or missing' },
      selfReplace:true, shipOK:true,
      note:{ zh:'最高频耗材，建议备6个月用量', en:'Most frequent — stock 6 months supply' } },
    { name:{ zh:'中央滚刷', en:'Main Rolling Brush' },
      cycle:'con.cycle.3m', condition:{ zh:'刷毛严重磨损或缠绕严重', en:'Heavy wear or persistent tangling' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'滤芯（HEPA）', en:'HEPA Filter' },
      cycle:'con.cycle.3m', condition:{ zh:'吸力下降或报警提示', en:'Reduced suction or filter alert' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'尘盒（可清洗型）', en:'Dustbin (Washable)' },
      cycle:'con.cycle.asneeded', condition:{ zh:'破损时更换，日常清洗使用', en:'Replace if damaged; wash for daily use' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'驱动轮橡胶圈', en:'Drive Wheel Rubber Ring' },
      cycle:'con.cycle.12m', condition:{ zh:'轮面磨平、打滑或行走偏移', en:'Tread worn smooth, slipping or path deviation' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'充电触片', en:'Charging Contact Pad' },
      cycle:'con.cycle.asneeded', condition:{ zh:'充电接触不良时检查更换', en:'Replace if charging contact is intermittent' },
      selfReplace:true, shipOK:true, note:{ zh:'', en:'' } },
    { name:{ zh:'激光雷达保护罩', en:'LiDAR Protective Cover' },
      cycle:'con.cycle.asneeded', condition:{ zh:'划伤严重影响导航精度', en:'Heavy scratches affecting navigation accuracy' },
      selfReplace:true, shipOK:true,
      note:{ zh:'定期用软布擦拭，保持清洁', en:'Wipe regularly with soft cloth to maintain sensor clarity' } },
  ],
};

// ── 渲染耗材表格 ─────────────────────────────────────────
function renderConsumables(cat) {
  const items = CONSUMABLES[cat];
  if (!items || items.length === 0) return '';

  const lang = currentLang;
  const shipIcon = (val) => {
    if (val === true)      return `<span style="color:#1A7A4A;font-weight:500;">${CT('con.yes')}</span>`;
    if (val === 'limited') return `<span style="color:#B05A00;font-weight:500;">${CT('con.limited')}</span>`;
    return `<span style="color:#B02020;font-weight:500;">${CT('con.no')}</span>`;
  };

  const rows = items.map((item, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f9fafb';
    const noteHtml = item.note && item.note[lang]
      ? `<div style="font-size:10px;color:var(--slate);margin-top:3px;">${item.note[lang]}</div>` : '';
    return `<tr style="background:${bg};">
      <td style="padding:10px 12px;font-size:12px;font-weight:500;color:var(--navy);border-bottom:1px solid var(--silver-mid);">
        ${item.name[lang]}${noteHtml}
      </td>
      <td style="padding:10px 12px;font-size:12px;color:var(--text-muted);border-bottom:1px solid var(--silver-mid);white-space:nowrap;">
        ${CT(item.cycle)}
      </td>
      <td style="padding:10px 12px;font-size:11px;color:var(--text-muted);border-bottom:1px solid var(--silver-mid);">
        ${item.condition[lang]}
      </td>
      <td style="padding:10px 12px;text-align:center;border-bottom:1px solid var(--silver-mid);">
        ${shipIcon(item.selfReplace)}
      </td>
      <td style="padding:10px 12px;text-align:center;border-bottom:1px solid var(--silver-mid);">
        ${shipIcon(item.shipOK)}
      </td>
    </tr>`;
  }).join('');

  const quoteMsg = encodeURIComponent(
    lang === 'zh'
      ? `您好，我想询问${cat === 'pressure' ? '高压清洗机' : cat === 'vacuum' ? '工业吸尘器' : cat === 'scrubber' ? '洗地机' : '扫地机器人'}的耗材配件报价`
      : `Hi, I'd like to enquire about consumables and spare parts for your ${cat} products.`
  );

  return `
  <div style="margin-bottom:6px;">
    <p style="font-size:12px;color:var(--text-muted);line-height:1.65;margin-bottom:16px;">
      ${CT('con.section.sub')}
    </p>
    <div style="overflow-x:auto;border-radius:var(--radius);border:0.5px solid var(--silver-dark);">
      <table style="width:100%;border-collapse:collapse;min-width:560px;">
        <thead>
          <tr style="background:var(--navy);">
            <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:500;color:#fff;letter-spacing:.04em;">${CT('con.col.name')}</th>
            <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:500;color:#fff;white-space:nowrap;">${CT('con.col.cycle')}</th>
            <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:500;color:#fff;">${CT('con.col.condition')}</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:500;color:#fff;white-space:nowrap;">${CT('con.col.self')}</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:500;color:#fff;white-space:nowrap;">${CT('con.col.ship')}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>

  <div style="background:var(--cyan-pale);border-radius:var(--radius);padding:16px 18px;margin-top:16px;border-left:3px solid var(--cyan);">
    <div style="font-size:13px;font-weight:500;color:var(--navy);margin-bottom:5px;">${CT('con.tip.title')}</div>
    <p style="font-size:12px;color:var(--text-muted);line-height:1.7;margin-bottom:12px;">${CT('con.tip.body')}</p>
    <a href="contact.html?type=consumables&product=${encodeURIComponent(cat)}"
       class="btn btn-accent"
       style="font-size:12px;padding:8px 18px;display:inline-flex;">
      ${CT('con.tip.btn')} →
    </a>
  </div>`;
}
