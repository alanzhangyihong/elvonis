function parseMeta(raw) {
  // 防止 raw 为空
  if (!raw) return { _body_en: '', _body_zh: '' };

  const lines = raw.split('\n');
  let frontmatterEnd = -1;

  // 查找第二个 --- 的位置
  let dashCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashCount++;
      if (dashCount === 2) {
        frontmatterEnd = i;
        break;
      }
    }
  }

  if (frontmatterEnd === -1) {
    return { _body_en: raw, _body_zh: '' };
  }

  const frontmatterLines = lines.slice(1, frontmatterEnd);
  const bodyRaw = lines.slice(frontmatterEnd + 1).join('\n').trim();

  // 分离中英文正文
  const zhSplit = bodyRaw.indexOf('<!-- ZH -->');
  const _body_en = zhSplit > -1 ? bodyRaw.slice(0, zhSplit).trim() : bodyRaw;
  const _body_zh = zhSplit > -1 ? bodyRaw.slice(zhSplit + 11).trim() : '';

  const meta = {};
  let currentKey = null;
  let currentValues = [];

  for (const line of frontmatterLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // 检查是否为新 key: value 行（不以空格开头）
    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      // 保存上一个字段
      if (currentKey !== null) {
        meta[currentKey] = currentValues.join('\n').trim();
        currentValues = [];
      }

      const colonIdx = line.indexOf(':');
      if (colonIdx < 1) continue;
      currentKey = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      // 如果值不为空且不是多行标记，则作为起始值
      if (value && value !== '>' && value !== '|' && value !== '>-' && value !== '|-') {
        currentValues = [value];
      } else {
        currentValues = [];
      }
    } else {
      // 这是续行（以空格或tab开头）
      if (currentKey !== null) {
        currentValues.push(trimmed);
      }
    }
  }

  // 保存最后一个字段
  if (currentKey !== null) {
    meta[currentKey] = currentValues.join('\n').trim();
  }

  meta._body_en = _body_en;
  meta._body_zh = _body_zh;
  return meta;
}
