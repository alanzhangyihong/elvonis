export async function onRequest(context) {
  const { params, env } = context;

  if (!params.slug || params.slug.length === 0) {
    return Response.redirect('/blog.html', 302);
  }

  const slug = params.slug.join('/');

  try {
    const owner = 'alanzhangyihong';
    const repo = 'elvonis';

    // 1. 获取 _posts 目录文件列表
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

    // 2. 根据 slug 匹配文章文件
    const matched = files.find(f => {
      if (!f.name.endsWith('.md')) return false;
      const clean = f.name.replace('.md', '');
      return clean === slug;
    });

    if (!matched) {
      return new Response('Post not found: ' + slug, { status: 404 });
    }

    // 3. 获取文章内容
    const fileRes = await fetch(matched.download_url, {
      headers: {
        'User-Agent': 'ELVONIS',
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      }
    });

    const raw = await fileRes.text();
    const meta = parseMeta(raw);

    // 4. 检测访客语言偏好
    const cookieLang = context.request.headers.get('Cookie')?.match(/elvonis_lang=([^;]+)/)?.[1];
    const acceptLang = context.request.headers.get('Accept-Language') || '';
    const browserLang = acceptLang.includes('zh') ? 'zh' : 'en';
    const lang = cookieLang || browserLang || 'en';

    return new Response(buildPage(meta, lang), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (err) {
    return new Response('Error: ' + err.message, { status: 500 });
  }
}

function parseMeta(raw) {
  const lines = raw.split('\n');
  let frontmatterEnd = -1;

  // 寻找 frontmatter 结束位置（第二个 ---）
  let dashes = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashes++;
      if (dashes === 2) {
        frontmatterEnd = i;
        break;
      }
    }
  }

  if (frontmatterEnd === -1) return { _body_en: raw, _body_zh: '' };

  const frontmatterLines = lines.slice(1, frontmatterEnd);
  const bodyRaw = lines.slice(frontmatterEnd + 1).join('\n').trim();

  // 用 <!-- ZH --> 分隔中英文正文
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

function buildPage(meta, lang) {
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
<html lang="${lang}">
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
  <li><a href="/solutions.html"><span class="lang-en">Solutions</span><span class="lang-zh">行业方案</span></a></li>
  <li><a href="/distributor.html"><span class="lang-en">Distributors</span><span class="lang-zh">经销商</span></a></li>
  <li><a href="/about-partners.html"><span class="lang-en">About &amp; OEM</span><span class="lang-zh">关于与代工</span></a></li>
  <li><a href="/blog.html" class="active"><span class="lang-en">Insights</span><span class="lang-zh">行业资讯</span></a></li>
</ul>
    <div style="display:flex;align-items:center;gap:0.75rem;">
      <div style="display:none;gap:0;" class="lang-pills-desktop" id="lang-pills-desktop">
        <button class="lang-pill lang-pill-inactive" data-lang="en">EN</button>
        <button class="lang-pill lang-pill-inactive" data-lang="zh">中文</button>
      </div>
      <a href="/contact.html" class="nav-cta" style="display:none;" id="nav-cta-desktop">
        <span class="lang-en">Request Quote</span><span class="lang-zh">获取报价</span>
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
    <a href="/solutions.html"><span class="lang-en">Solutions</span><span class="lang-zh">行业方案</span></a>
    <a href="/distributor.html"><span class="lang-en">Distributors</span><span class="lang-zh">经销商</span></a>
    <a href="/about-partners.html"><span class="lang-en">About &amp; OEM</span><span class="lang-zh">关于与代工</span></a>
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

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="footer-logo">ELVONIS</a>
        <p class="footer-tagline">
          <span class="lang-en">Specification-Driven Equipment Partner. We define what goes inside the machine — not just which factory makes it.</span>
          <span class="lang-zh">规格驱动型设备合作伙伴。我们决定机器内部装什么，而不只是选哪家工厂来做。</span>
        </p>
        <div class="cert-pills"><span class="cert-pill">ISO 9001</span><span class="cert-pill">CE</span><span class="cert-pill">RoHS</span></div>
        <div class="social-icons">
          <a href="https://www.linkedin.com/company/elvonis" class="social-icon" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
          <a href="https://www.youtube.com/channel/UCkMgcGqms-o9_5U7unH9cvw" class="social-icon" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
        </div>
      </div>
      <div>
        <p class="footer-col-title"><span class="lang-en">Equipment</span><span class="lang-zh">设备中心</span></p>
        <ul class="footer-links">
          <li><a href="products.html#vacuums"><span class="lang-en">Industrial Vacuums</span><span class="lang-zh">工业吸尘器</span></a></li>
          <li><a href="products.html#singledisc"><span class="lang-en">Single-Disc Machines</span><span class="lang-zh">单擦机/抛光机</span></a></li>
          <li><a href="products.html#scrubbers"><span class="lang-en">Walk-Behind Scrubbers</span><span class="lang-zh">手推式洗地机</span></a></li>
          <li><a href="products.html#parts"><span class="lang-en">Parts &amp; Consumables</span><span class="lang-zh">配件与耗材</span></a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title"><span class="lang-en">Engineering & Support</span><span class="lang-zh">工程与技术支持</span></p>
        <ul class="footer-links">
          <li><a href="about-partners.html"><span class="lang-en">OEM / ODM Services</span><span class="lang-zh">贴牌代工服务</span></a></li>
          <li><a href="distributor.html"><span class="lang-en">Distributor Application</span><span class="lang-zh">经销商申请</span></a></li>
          <li><a href="solutions.html"><span class="lang-en">Industry Solutions</span><span class="lang-zh">行业解决方案</span></a></li>
          <li><a href="blog.html"><span class="lang-en">Knowledge Base</span><span class="lang-zh">行业知识库</span></a></li>
          <li><a href="contact.html"><span class="lang-en">Contact Engineering Team</span><span class="lang-zh">联系工程团队</span></a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title"><span class="lang-en">Partner Intelligence</span><span class="lang-zh">获取合作伙伴简报</span></p>
        <p style="font-size:0.8125rem;color:rgba(255,255,255,0.45);margin-bottom:1rem;line-height:1.65;">
          <span class="lang-en">Receive specification guides, maintenance checklists and procurement frameworks from the ELVONIS engineering team.</span>
          <span class="lang-zh">获取 ELVONIS 工程团队发布的设备规格指南、维护清单与采购决策框架。</span>
        </p>
        <form action="https://formspree.io/f/xlgpzqpq" method="POST" class="footer-email-form">
          <input type="email" name="_replyto" class="footer-email-input" placeholder="Work email…" required/>
          <button type="submit" class="footer-email-btn" aria-label="Subscribe">→</button>
        </form>
        <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.8125rem;color:rgba(255,255,255,0.45);">
          <span>✉ info@elvonis.com</span>
          <span>📍 <span class="lang-en">Zhejiang, China</span><span class="lang-zh">浙江 · 中国</span></span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 ELVONIS. <span class="lang-en">All rights reserved.</span><span class="lang-zh">保留所有权利。</span></p>
      <div style="display:flex;gap:1.25rem;flex-wrap:wrap;">
        <a href="about-partners.html"><span class="lang-en">Specification-Driven Equipment Partner</span><span class="lang-zh">规格驱动型设备合作伙伴</span></a>
      </div>
    </div>
  </div>
</footer>
<div class="wa-float">
  <div class="wa-tooltip"><span class="lang-en">Direct WhatsApp Support</span><span class="lang-zh">WhatsApp 专线支持</span></div>
  <a href="https://wa.me/+8618057039893?text=Hi" class="wa-float-btn wa-link" target="_blank" rel="noopener" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
  </a>
</div>
<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
<script src="/elvonis-core.js"></script>
<script>
  (function() {
    var p = document.getElementById('lang-pills-desktop');
    var c = document.getElementById('nav-cta-desktop');
    if (p) p.style.display = 'flex';
    if (c) c.style.display = 'flex';

    // 根据页面 lang 属性初始化语言显示
    var htmlEl = document.documentElement;
    var initLang = htmlEl.getAttribute('lang') || 'en';
    var enEls = document.querySelectorAll('.lang-en');
    var zhEls = document.querySelectorAll('.lang-zh');
    
    if (initLang === 'zh') {
      enEls.forEach(function(el) { el.style.display = 'none'; });
      zhEls.forEach(function(el) { el.style.display = ''; });
    } else {
      enEls.forEach(function(el) { el.style.display = ''; });
      zhEls.forEach(function(el) { el.style.display = 'none'; });
    }
  })();
</script>
</body>
</html>`;
}
