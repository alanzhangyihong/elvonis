export async function onRequest(context) {
  const owner = 'alanzhangyihong';
  const repo = 'elvonis';

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/_posts`,
    {
      headers: {
        'User-Agent': 'ELVONIS-CMS',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${context.env.GITHUB_TOKEN}`,
      }
    }
  );

  if (!response.ok) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const files = await response.json();

  const posts = await Promise.all(
    files
      .filter(f => f.name.endsWith('.md'))
      .map(async (file) => {
        const fileResponse = await fetch(file.download_url);
        const content = await fileResponse.text();
        const meta = parseMeta(content);
        const fileName = file.name.replace('.md', '');
        const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '');
        // 确保返回前端需要的所有字段
        return {
          title_en: meta.title_en || '',
          title_zh: meta.title_zh || '',
          excerpt_en: meta.excerpt_en || meta.description || meta.summary || '',
          excerpt_zh: meta.excerpt_zh || meta.description_zh || meta.summary_zh || '',
          category_en: meta.category_en || '',
          category_zh: meta.category_zh || '',
          date: meta.date || '',
          slug,
          fileName,
          url: '/post/' + slug
        };
      })
  );

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

/**
 * 解析 Markdown frontmatter，正确处理多行文本
 */
function parseMeta(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const meta = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentValue = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 检查是否为新 key: value 行
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1 && !line.startsWith(' ')) {
      // 保存上一个字段
      if (currentKey) {
        meta[currentKey] = currentValue.join('\n').trim();
      }
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      currentKey = key;
      currentValue = [value];
    } else if (currentKey && line.trim()) {
      // 这是多行文本的续行
      currentValue.push(line.trim());
    }
  }
  // 保存最后一个字段
  if (currentKey) {
    meta[currentKey] = currentValue.join('\n').trim();
  }

  return meta;
}
