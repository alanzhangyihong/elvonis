export async function onRequest(context) {
  const { params, env } = context;

  if (!params.slug || params.slug.length === 0) {
    return Response.redirect('/blog.html', 302);
  }

  const slug = params.slug.join('/');

  try {
    const owner = 'alanzhangyihong';
    const repo = 'elvonis';

    const listRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/_posts`,
      {
        headers: {
          'User-Agent': 'ELVONIS',
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        }
      }
    );

    if (!listRes.ok) {
      return new Response('List error: ' + listRes.status, { status: 404 });
    }

    const files = await listRes.json();

    const matched = files.find(f => {
      if (!f.name.endsWith('.md')) return false;
      const clean = f.name.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      return clean === slug || f.name.replace('.md', '') === slug;
    });

    if (!matched) {
      return new Response('Post not found: ' + slug, { status: 404 });
    }

    const fileRes = await fetch(matched.download_url, {
      headers: {
        'User-Agent': 'ELVONIS',
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      }
    });

    const raw = await fileRes.text();
    const meta = parseMeta(raw);

    return new Response(buildPage(meta), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (err) {
    return new Response('Error: ' + err.message, { status: 500 });
  }
}

function parseMeta(raw) {
  const lines = raw.split('\n');
  let frontmatterEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    if (i === 0 && lines[i].trim() === '---') continue;
    if (i > 0 && lines[i].trim() === '---') {
      frontmatterEnd = i;
      break;
    }
  }

  if (frontmatterEnd === -1) return { _body_en: raw, _body_zh: '' };

  const frontmatterLines = lines.slice(1, frontmatterEnd);
  const bodyRaw = lines.slice(frontmatterEnd + 1).join('\n').trim();

  // 用 <!-- ZH --> 分隔英中正文
  const zhSplit = bodyRaw.indexOf('<!-- ZH -->');
  const _body_en = zhSplit > -1 ? bodyRaw.slice(0, zhSplit).trim() : bodyRaw;
  const _body_zh = zhSplit > -1 ? bodyRaw.slice(zhSplit + 11).trim() : '';

  const meta = {};
  for (const line of frontmatterLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx < 1 || line.startsWith(' ')) continue;
    const k = line.slice(0, colonIdx).trim();
    const v = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (v && v !== '>-' && v !== '|-' && v !== '>' && v !== '|') {
      meta[k] = v;
    }
  }

  meta._body_en = _body_en;
  meta._body_zh = _body_zh;
  return meta;
}

function md(text) {
  if (!text) return '';
  return text
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.375rem;font-weight:800;color:#1a2a3a;margin:2rem 0 1rem">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.125rem;font-weight:700;color:#1a2a3a;margin:1.5rem 0 0.75rem">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:0.5rem">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, '<ul style="padding-left:1.5rem;margin:1rem 0">$&</ul>')
    .replace(/\n\n+/g, '</p><p style="margin-bottom:1.25rem">')
    .replace(/^(?!<[hul])(.+)$/gm, (line) => {
      if (!line.trim()) return '';
      if (line.startsWith('<')) return line;
      return `<p style="margin-bottom:1.25rem">${line}</p>`;
    });
}

function buildPage(meta) {
  const ten = meta.title_en || 'Article';
  const tzh = meta.title_zh || ten;
  const cen = meta.category_en || 'Insights';
  const czh = meta.category_zh || cen;
  const een = meta.excerpt_en || '';
  const ezh = meta.excerpt_zh || '';
  const ben = md(meta._body_en || '');
const bzh = md(meta._body_zh || '');

  let date = '', datezh = '';
  if (meta.date) {
    const d = new Date(meta.date);
    date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    datezh = d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${ten} | ELVONIS</title>
  <meta name="description" content="${een}"/>
  <meta property="og:title" content="${ten} | ELVONIS"/>
  <meta property="og:description" content="${een}"/>
  <meta property="og:type" content="article"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/elvonis-style.css"/>
</head>
<body style="padding-top:68px;">

<header id="main-nav">
  <div class="nav-inner">
    <a href="/index.html" class="nav-logo">ELVONIS</a>
    <ul class="nav-links">
      <li><a href="/products.html"><span class="lang-en">Products</span><span class="lang-zh">全线产品</span></a></li>
      <li><a href="/applications.html"><span class="lang-en">Solutions</span><span class="lang-zh">行业方案</span></a></li>
      <li><a href="/about.html"><span class="lang-en">About &amp; OEM</span><span class="lang-zh">关于与代工</span></a></li>
      <li><a href="/blog.html" class="active"><span class="lang-en">Insights</span><span class="lang-zh">行业资讯</span></a></li>
    </ul>
    <div style="display:flex;align-items:center;gap:0.75rem;">
      <div style="display:none;gap:0;" class="lang-pills-desktop" id="lang-pills-desktop">
        <button class="lang-pill lang-pill-inactive" data-lang="en">EN</button>
        <button class="lang-pill lang-pill-inactive" data-lang="zh">中文</button>
      </div>
      <a href="/contact.html" class="nav-cta" style="display:none;" id="nav-cta-desktop">
        <span class="lang-en">Technical Quote</span><span class="lang-zh">获取技术报价</span>
      </a>
      <button class="menu-toggle" id="mobile-menu-btn" aria-label="Toggle menu">
        <span id="menu-icon-open" style="display:flex;flex-direction:column;gap:5px;">
          <span></span><span></span><span></span>
        </span>
        <span id="menu-icon-close" class="hidden" style="font-size:1.375rem;line-height:1;color:#1a2a3a;">✕</span>
      </button>
    </div>
  </div>
</header>

<div id="mobile-drawer" class="hidden">
  <nav>
    <a href="/products.html"><span class="lang-en">Products</span><span class="lang-zh">全线产品</span></a>
    <a href="/applications.html"><span class="lang-en">Solutions</span><span class="lang-zh">行业方案</span></a>
    <a href="/about.html"><span class="lang-en">About &amp; OEM</span><span class="lang-zh">关于与代工</span></a>
    <a href="/blog.html"><span class="lang-en">Insights</span><span class="lang-zh">行业资讯</span></a>
    <a href="/contact.html"><span class="lang-en">Technical Quote</span><span class="lang-zh">获取技术报价</span></a>
  </nav>
  <div class="drawer-lang-row">
    <button data-lang-drawer="en" class="lang-pill">EN — English</button>
    <button data-lang-drawer="zh" class="lang-pill">中文</button>
  </div>
</div>

<div class="page-hero" style="padding:4rem 1.5rem 3rem;">
  <div class="page-hero-inner" style="text-align:left;max-width:48rem;">
    <span class="eyebrow">
      <span class="lang-en">${cen}</span>
      <span class="lang-zh">${czh}</span>
    </span>
    <h1 style="text-align:left;">
      <span class="lang-en">${ten}</span>
      <span class="lang-zh">${tzh}</span>
    </h1>
    <div style="display:flex;gap:1rem;align-items:center;margin-top:1.25rem;font-size:0.8125rem;color:rgba(255,255,255,0.45);">
      <span class="lang-en">${date}</span>
      <span class="lang-zh">${datezh}</span>
      <span>·</span>
      <span>Alan Zhang · ELVONIS Engineering</span>
    </div>
  </div>
</div>

<section class="section" style="background:#fff;">
  <div class="container" style="max-width:48rem;">
    <p style="font-size:1.0625rem;color:#374151;line-height:1.8;margin-bottom:2rem;font-weight:500;border-left:3px solid #2563eb;padding-left:1.25rem;">
      <span class="lang-en">${een}</span>
      <span class="lang-zh">${ezh}</span>
    </p>
    <div class="lang-en" style="font-size:0.9375rem;color:#374151;line-height:1.85;">
      ${ben}
    </div>
    <div class="lang-zh" style="font-size:0.9375rem;color:#374151;line-height:1.85;display:none;">
      ${bzh}
    </div>
    <div style="margin-top:3rem;padding-top:2rem;border-top:1px solid #e5e7eb;">
      <a href="/blog.html" style="font-size:0.875rem;font-weight:700;color:#1a2a3a;text-decoration:none;border-bottom:1px solid #1a2a3a;padding-bottom:2px;">
        <span class="lang-en">← Back to all articles</span>
        <span class="lang-zh">← 返回所有文章</span>
      </a>
    </div>
  </div>
</section>

<footer style="background:#1a2a3a;padding:3rem 1.5rem;text-align:center;margin-top:4rem;">
  <p style="color:rgba(255,255,255,0.5);font-size:0.8125rem;margin:0;">
    © 2026 ELVONIS · <a href="/contact.html" style="color:rgba(255,255,255,0.5);">info@elvonis.com</a>
  </p>
</footer>

<script src="/elvonis-core.js"></script>
<script>
  (function() {
    var p = document.getElementById('lang-pills-desktop');
    var c = document.getElementById('nav-cta-desktop');
    if (p) p.style.display = 'flex';
    if (c) c.style.display = 'flex';

    // 语言切换处理
    function applyLang(lang) {
      var enEls = document.querySelectorAll('.lang-en');
      var zhEls = document.querySelectorAll('.lang-zh');
      if (lang === 'zh') {
        enEls.forEach(function(el) { el.style.display = 'none'; });
        zhEls.forEach(function(el) { el.style.display = ''; });
      } else {
        enEls.forEach(function(el) { el.style.display = ''; });
        zhEls.forEach(function(el) { el.style.display = 'none'; });
      }
    }

    // 读取当前语言
    var savedLang = localStorage.getItem('elvonis_lang') || 'en';
    applyLang(savedLang);

    // 监听语言切换事件
    document.addEventListener('elvonis:langchange', function(e) {
      var lang = e.detail && e.detail.lang ? e.detail.lang : 'en';
      applyLang(lang);
    });
  })();
</script>
</body>
</html>`;
}
