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

  const zhSplit = bodyRaw.indexOf('<!-- ZH -->');
  const _body_en = zhSplit > -1 ? bodyRaw.slice(0, zhSplit).trim() : bodyRaw;
  const _body_zh = zhSplit > -1 ? bodyRaw.slice(zhSplit + 11).trim() : '';

  const meta = {};
  let currentKey = null;
  let currentValue = [];

  for (const line of frontmatterLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 检查是否为新 key: value 行（不以空格开头）
    if (!line.startsWith(' ')) {
      // 保存上一个字段
      if (currentKey) {
        meta[currentKey] = currentValue.join('\n').trim();
      }
      const colonIdx = line.indexOf(':');
      if (colonIdx < 1) continue;
      currentKey = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      // 如果值不为空，作为起始值；否则等待续行
      if (value && value !== '>' && value !== '|' && value !== '>-' && value !== '|-') {
        currentValue = [value];
      } else {
        currentValue = [];
      }
    } else {
      // 这是续行（以空格开头）
      if (currentKey !== null) {
        currentValue.push(trimmed);
      }
    }
  }

  // 保存最后一个字段
  if (currentKey) {
    meta[currentKey] = currentValue.join('\n').trim();
  }

  meta._body_en = _body_en;
  meta._body_zh = _body_zh;
  return meta;
}
