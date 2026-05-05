export async function onRequest(context) {
  // 从环境变量获取当前部署的域名
  const domain = context.env.DOMAIN || 'https://elvonis.com';

  // 固定页面列表（手动维护一次，以后不用动）
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/products.html', priority: '0.9', changefreq: 'weekly' },
    { loc: '/product-detail-ev-v100p-40.html', priority: '0.8', changefreq: 'monthly' },
    { loc: '/product-detail-ev-s56-60t.html', priority: '0.8', changefreq: 'monthly' },
    { loc: '/product-detail-ev-d17-175.html', priority: '0.8', changefreq: 'monthly' },
    { loc: '/solutions.html', priority: '0.8', changefreq: 'monthly' },
    { loc: '/distributor.html', priority: '0.8', changefreq: 'monthly' },
    { loc: '/about-partners.html', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact.html', priority: '0.6', changefreq: 'yearly' },
    { loc: '/blog.html', priority: '0.8', changefreq: 'weekly' },
  ];

  // 从 blog-index.json 获取博客文章列表
  let blogPosts = [];
  try {
    const response = await fetch(`${domain}/blog-index.json`);
    if (response.ok) {
      blogPosts = await response.json();
    }
  } catch (e) {
    // blog-index.json 不存在或读取失败，跳过
  }

  // 生成 XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 固定页面
  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${domain}${page.loc}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // 博客文章（动态部分）
  if (blogPosts && blogPosts.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    for (const post of blogPosts) {
      xml += '  <url>\n';
      xml += `    <loc>${domain}/blog/${post.slug || post.id}</loc>\n`;
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
      'Cache-Control': 'public, max-age=3600',
    },
  });
}