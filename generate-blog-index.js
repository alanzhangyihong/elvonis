const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '_posts');
const outputFile = path.join(__dirname, 'blog-index.json');

const posts = [];

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const frontmatter = content.split('---')[1];
  if (!frontmatter) continue;

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
      title_zh: post.title_zh || '',
      slug: file.replace('.md', ''),
      date: post.date,
      excerpt_en: post.excerpt_en || post.description || post.summary || '',
      excerpt_zh: post.excerpt_zh || post.description_zh || post.summary_zh || '',
      category_en: post.category_en || '',
      category_zh: post.category_zh || '',
      author: post.author || ''
    });
  }
}

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`✅ Generated blog-index.json with ${posts.length} posts`);
