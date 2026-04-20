export async function onRequest(context) {
  const owner = 'alanzhangyihong';
  const repo = 'elvonis';

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/_posts`,
    {
      headers: {
        'User-Agent': 'ELVONIS-CMS',
        'Accept': 'application/vnd.github.v3+json',
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
        return { ...meta, slug, fileName };
      })
  );

  // 按日期排序，最新的在前
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return new Response(JSON.stringify(posts), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

function parseMeta(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const meta = {};
  match[1].split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      meta[key] = value;
    }
  });
  return meta;
}
