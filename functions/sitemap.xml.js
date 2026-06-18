export async function onRequest(context) {
  const domain = 'https://www.elvonis.com';

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/products', priority: '0.9', changefreq: 'weekly' },
  { loc: '/product-detail-ev-v100p-40', priority: '0.8', changefreq: 'monthly' },
  { loc: '/product-detail-ev-v56-60t', priority: '0.8', changefreq: 'monthly' },
  { loc: '/product-detail-ev-d17-175', priority: '0.8', changefreq: 'monthly' },
  { loc: '/solutions', priority: '0.8', changefreq: 'monthly' },
  { loc: '/distributor', priority: '0.8', changefreq: 'monthly' },
  { loc: '/about-partners', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.6', changefreq: 'yearly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' }
];

  let blogPosts = [];
  try {
    const response = await fetch(`${domain}/api/posts`);
    if (response.ok) {
      blogPosts = await response.json();
    }
  } catch (e) {
    // 忽略
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const today = new Date().toISOString().split('T')[0];

  // 固定页面
  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${domain}${page.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // 博客文章（对应 functions/post/[[slug]].js）
  if (blogPosts && blogPosts.length > 0) {
    for (const post of blogPosts) {
      const slug = post.slug || '';
      if (!slug) continue;
      xml += '  <url>\n';
      xml += `    <loc>${domain}/post/${slug}</loc>\n`;
      xml += `    <lastmod>${post.date || today}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
