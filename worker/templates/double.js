// Template for Double SVG rendering
// templates/double.js
import theme from '../../color/theme.js';
import { renderBlock } from './block.js';

// Component logic for rendering Double SVG

/**
 * renderDouble: Generates multiple blocks side-by-side in a single SVG,
 * with a gap parameter (space in pixels) between each block.
 * Parameters are suffixed 1,2,3,... for each block.
 */
export async function renderDouble(params) {
  // Gap between blocks in pixels
  const gap = params.gap != null ? parseInt(params.gap, 10) : 0;

  // Collect blocks by index
  const blocks = {};
  for (const [key, value] of Object.entries(params)) {
    const m = key.match(/^(.*?)(\d+)$/);
    if (m) {
      const name = m[1];
      const idx  = m[2];
      blocks[idx] = blocks[idx] || {};
      blocks[idx][name] = value;
    }
  }
  const indexes = Object.keys(blocks).sort((a, b) => a - b);
  if (indexes.length < 2) {
    throw new Error('Il faut au moins deux blocs suffixés 1 et 2');
  }

  // Dimensions of the first block
  const ref = blocks[indexes[0]];
  const w = ref.w != null ? Number(ref.w) : 400;
  const h = ref.h != null ? Number(ref.h) : 200;

  // Ensure each block has width and height
  indexes.forEach(i => {
    const b = blocks[i];
    b.w = b.w != null ? Number(b.w) : w;
    b.h = b.h != null ? Number(b.h) : h;
  });

  // Generate each block fragment
  const fragments = [];
  for (const i of indexes) {
    const b = blocks[i];
    const p = { ...b, width: b.w, height: b.h };
    const svgStr = await renderBlock(p);
    // Remove <svg>...</svg> wrapper and XML declaration
    const inner = svgStr
      // remove XML declaration
      .replace(/<\?xml[^>]*\?>\s*/, '')
      // remove opening <svg> tag
      .replace(/<svg[^>]*>/, '')
      // remove closing </svg> tag
      .replace(/<\/svg>\s*$/, '');
    fragments.push({ inner, w: b.w });
  }

  // Calculate total size (sum of widths + gaps)
  const totalWidth = fragments.reduce((sum, f) => sum + f.w, 0) + gap * (fragments.length - 1);
  const totalHeight = h;

  // Assemble final SVG
  let out = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  out += `<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n`;
  let xOffset = 0;
  fragments.forEach((f, idx) => {
    out += `  <g transform="translate(${xOffset},0)">\n${f.inner}\n  </g>\n`;
    xOffset += f.w + gap;
  });
  out += `</svg>`;
  // Remove any leading whitespace/newlines so XML declaration is first
  out = out.replace(/^[\s\r\n]*/, '');
  return out;
}