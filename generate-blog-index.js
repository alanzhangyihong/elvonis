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

  // 解析 frontmatter（YAML 格式）
  const lines = frontmatter.split('\n');
  const post = {};
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)/);
    if (match) {
      post[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }

  // ✅ 修改点：增加摘要字段提取
  if (post.title_en && post.date) {
    // 尝试多个可能的摘要字段名
    const summary = post.description || post.summary || post.excerpt || '';
    
    posts.push({
      title_en: post.title_en,
      slug: file.replace('.md', ''),
      date: post.date,
      summary: summary,                    // ✅ 新增：摘要
      title_zh: post.title_zh || '',      // ✅ 新增：中文标题（如果有）
      author: post.author || '',          // ✅ 新增：作者（如果有）
      tags: post.tags || ''               // ✅ 新增：标签（如果有）
    });
  }
}

// 按日期倒序排列
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// 写入 JSON 文件
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`✅ Generated blog-index.json with ${posts.length} posts`);
