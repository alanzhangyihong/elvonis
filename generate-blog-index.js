const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '_posts');
const outputFile = path.join(__dirname, 'blog-index.json');

const posts = [];

// 读取 _posts 目录下所有 .md 文件
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const frontmatter = content.split('---')[1];
  if (!frontmatter) continue;

  // 简单解析 frontmatter（YAML 格式）
  const lines = frontmatter.split('\n');
  const post = {};
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)/);
    if (match) {
      post[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }

  if (post.title_en && post.date) {
    posts.push({
      title_en: post.title_en,
      slug: file.replace('.md', ''),
      date: post.date
    });
  }
}

// 按日期倒序排列
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// 写入 JSON 文件
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`✅ Generated blog-index.json with ${posts.length} posts`);
