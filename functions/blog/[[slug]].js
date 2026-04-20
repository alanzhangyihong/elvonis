export async function onRequest(context) {
  const { request, env, params } = context;
  const slug = params.slug ? params.slug.join('/') : '';

  if (!slug) {
    return Response.redirect('/blog.html', 302);
  }

  // 从GitHub读取对应的markdown文件
  const owner = 'alanzhangyihong';
  const repo = 'elvonis';
  const branch = 'main';

  // 尝试匹配_posts文件夹里的文件
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/_posts`;

  const listResponse = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'ELVONIS-CMS',
      'Accept': 'application/vnd.github.v3+json',
    }
  });

  if (!listResponse.ok) {
    return new Response('Posts not found', { status: 404 });
  }

  const files = await listResponse.json();

  // 找到slug匹配的文件
  const matchedFile = files.find(f => {
    const fileName = f.name.replace('.md', '');
    // 移除日期前缀 2026-04-20-slug -> slug
    const fileSlug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    return fileSlug === slug || fileName === slug;
  });

  if (!matchedFile) {
    return new Response('Post not found', { status: 404 });
  }

  // 获取文件内容
  const fileResponse = await fetch(matchedFile.download_url);
  const rawContent = await fileResponse.text();

  // 解析frontmatter和内容
  const post = parseFrontmatter(rawContent);

  // 生成HTML页面
  const html = renderPost(post, slug);

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body_en: content, body_zh: '' };

  const frontmatter = match[1];
  const rest = match[2];

  const meta = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      meta[key] = value;
    }
  });

  // 分离EN和ZH正文（在frontmatter里存储）
  return { meta, body_en: meta.body_en || rest, body_zh: meta.body_zh || '' };
}

function markdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '')
    .split('\n').map(line => {
      if (!line.startsWith('<')) return `<p>${line}</p>`;
      return line;
    }).join('\n');
}

function renderPost(post, slug) {
  const { meta } = post;
  const title_en = meta.title_en || 'Article';
  const title_zh = meta.title_zh || title_en;
  const category_en = meta.category_en || 'Insights';
  const category_zh = meta.category_zh || category_en;
  const date = meta.date ? new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const date_zh = meta.date ? new Date(meta.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const excerpt_en = meta.excerpt_en || '';
  const excerpt_zh = meta.excerpt_zh || '';

  const body_en_html = markdownToHtml(meta.body_en || '');
  const body_zh_html = markdownToHtml(meta.body_zh || '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title_en} | ELVONIS</title>
  <meta name="description" content="${excerpt_en}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:site_name" content="ELVONIS"/>
  <meta property="og:title" content="${title_en} | ELVONIS"/>
  <meta property="og:description" content="${excerpt_en}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Noto+Sans+SC:wght@300;400;500;700;900&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/style.css"/>
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
      <span class="lang-en">${category_en}</span>
      <span class="lang-zh">${category_zh}</span>
    </span>
    <h1 style="text-align:left;">
      <span class="lang-en">${title_en}</span>
      <span class="lang-zh">${title_zh}</span>
    </h1>
    <div style="display:flex;gap:1rem;align-items:center;margin-top:1.25rem;font-size:0.8125rem;color:rgba(255,255,255,0.45);">
      <span class="lang-en">${date}</span>
      <span class="lang-zh">${date_zh}</span>
      <span>·</span>
      <span>Alan Zhang · ELVONIS Engineering</span>
    </div>
  </div>
</div>

<section class="section" style="background:#fff;">
  <div class="container" style="max-width:48rem;">

    <p style="font-size:1.0625rem;color:#374151;line-height:1.8;margin-bottom:2rem;font-weight:500;">
      <span class="lang-en">${excerpt_en}</span>
      <span class="lang-zh">${excerpt_zh}</span>
    </p>

    <div class="lang-en" style="font-size:0.9375rem;color:#374151;line-height:1.85;">
      ${body_en_html}
    </div>
    <div class="lang-zh" style="font-size:0.9375rem;color:#374151;line-height:1.85;">
      ${body_zh_html}
    </div>

    <div style="margin-top:3rem;padding-top:2rem;border-top:1px solid #e5e7eb;">
      <a href="/blog.html" style="font-size:0.875rem;font-weight:700;color:#1a2a3a;text-decoration:none;border-bottom:1px solid #1a2a3a;padding-bottom:2px;">
        <span class="lang-en">← Back to all articles</span>
        <span class="lang-zh">← 返回所有文章</span>
      </a>
    </div>

  </div>
</section>

<div style="background:#1a2a3a;padding:3rem 1.5rem;text-align:center;margin-top:4rem;">
  <p style="color:rgba(255,255,255,0.5);font-size:0.8125rem;margin:0;">
    © 2026 ELVONIS · <a href="/contact.html" style="color:rgba(255,255,255,0.5);">info@elvonis.com</a>
  </p>
</div>

<script src="/language.js"></script>
<script>
  (function() {
    var p = document.getElementById('lang-pills-desktop');
    var c = document.getElementById('nav-cta-desktop');
    if (p) p.style.display = 'flex';
    if (c) c.style.display = 'flex';
  })();
</script>
</body>
</html>`;
}
