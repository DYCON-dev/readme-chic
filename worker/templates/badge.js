// Template for Badge SVG rendering
import theme from '../../color/theme.js';

/**
 * Render a badge SVG with fixed sizes (small, medium, large), an image on the left, and text on the right.
 * @param {object} params
 * @param {'small'|'medium'|'large'} [params.size='medium'] - Badge size preset
 * @param {string} params.bgImageUrl - URL of the left image (e.g., logo). Required.
 * @param {string} params.text - Text to display on the right.
 * @param {string} [params.bgColor=theme.colors.fond1] - Background color of the badge.
 * @param {string} [params.textColor=theme.colors.contenuFond] - Text color.
 * @param {string} [params.font='Arial, sans-serif'] - Font family.
 */
// Component logic for rendering Badge SVG
export async function renderBadge(params) {
  let {
    size = 'medium',
    bgImageUrl,
    text,
    bgColor = theme.colors.fond1,
    textColor = theme.colors.contenuFond,
    font = 'Arial, sans-serif',
    borderRadius,
    borderWidth    = 0,                     // border thickness
    borderColor    = theme.colors.fond3,    // border color
    borderStyle    = 'solid',               // 'solid' or 'dashed'
    contentAlign   = 'center',             // 'left' | 'center' | 'right' alignment
  } = params;

  // Support theme color tokens for bgColor, textColor, and borderColor
  if (theme.colors[bgColor]) {
    bgColor = theme.colors[bgColor];
  }
  if (theme.colors[textColor]) {
    textColor = theme.colors[textColor];
  }
  if (theme.colors[borderColor]) {
    borderColor = theme.colors[borderColor];
  }

  // Parse user-specified borderWidth, defaulting to 0 if absent or invalid
  const bw = Number(borderWidth) || 0;

  // Size presets
  const presets = {
    small: { width: 200, height: 30, fontSize: 10 },
    medium: { width: 200, height: 50, fontSize: 16 },
    large: {  width: 300, height: 70, fontSize: 24  }
  };

  // Padding presets per size to ensure image fits
  const paddings = {
    small: 5,
    medium: 10,
    large: 15
  };

  let { width, height, fontSize } = presets[size] || presets.medium;
  const padding = paddings[size] !== undefined ? paddings[size] : 10;

  // Compute imgSize based on block height minus padding
  const imgSize = height - padding * 2;

  // Compute corner radius: default pill shape or theme token / numeric override
  let radius = height / 2;
  if (borderRadius != null) {
    if (theme.boxes[borderRadius]) {
      radius = parseFloat(theme.boxes[borderRadius].replace(',', '.'));
    } else if (!isNaN(Number(borderRadius))) {
      radius = Number(borderRadius);
    }
  }

  // Fetch and encode image to Data URI
  let imgData = '';
  if (bgImageUrl) {
    const resp = await fetch(bgImageUrl);
    const buffer = await resp.arrayBuffer();
    const mime = resp.headers.get('Content-Type') || 'image/png';
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    imgData = `data:${mime};base64,${btoa(binary)}`;
  }

  const imgY = (height - imgSize) / 2;
  const textY = height / 2;
  const textLen = text ? text.length : 0;
  const approxTextWidth = textLen * fontSize * 0.6;

  // Determine content width depending on presence of image and/or text
  let contentWidth;
  if (imgData && text) {
    contentWidth = imgSize + padding + approxTextWidth;
  } else if (imgData) {
    contentWidth = imgSize;
  } else {
    contentWidth = approxTextWidth;
  }

  // Adjust badge width dynamically based on content
  width = contentWidth + padding * 2;
  // If only image (no text), force badge to be square
  if (imgData && !text) {
    width = height;
  }
  let groupX;
  switch (contentAlign) {
    case 'left':
      groupX = padding;
      break;
    case 'right':
      groupX = width - contentWidth - padding;
      break;
    default:
      groupX = (width - contentWidth) / 2;
  }

  const imgX = imgData ? groupX : undefined;
  let textX = text ? (imgData ? imgX + imgSize + padding : groupX) : undefined;

  // Special case: only image → square badge and centered within
  const onlyImage = imgData && !text;
  let imageWidth = imgSize;
  let imageHeight = imgSize;
  let imageX = imgX;
  let imageY = imgY;
  let preserveAttr = '';
  if (onlyImage) {
    // Force square badge but keep padding around image
    imageWidth = imgSize;
    imageHeight = imgSize;
    imageX = padding;
    imageY = padding;
    preserveAttr = ' preserveAspectRatio="xMidYMid meet"';
  }

  // If only text, center it
  const onlyText = text && !imgData;
  let anchor = 'start';
  if (onlyText) {
    textX = width / 2;
    anchor = 'middle';
  }

  // Prepare background and stroke rectangles for perfect corner alignment
  const halfB = bw / 2;
  const innerR = Math.max(radius - halfB, 0);
  let bgRect, strokeRect;
  if (bw > 0) {
    bgRect = `<rect x="${halfB}" y="${halfB}" width="${width - bw}" height="${height - bw}" fill="${bgColor}" rx="${innerR}" ry="${innerR}" />`;
    const dash = borderStyle === 'dashed' ? ` stroke-dasharray="${bw*2},${bw*2}"` : '';
    strokeRect = `<rect x="${halfB}" y="${halfB}" width="${width - bw}" height="${height - bw}" fill="none" stroke="${borderColor}" stroke-width="${bw}" rx="${innerR}" ry="${innerR}" vector-effect="non-scaling-stroke"${dash} />`;
  } else {
    bgRect = `<rect x="0" y="0" width="${width}" height="${height}" fill="${bgColor}" rx="${radius}" ry="${radius}" />`;
    strokeRect = '';
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" overflow="visible" xmlns="http://www.w3.org/2000/svg" role="img">
  ${bgRect}
  ${strokeRect}
  ${imgData ? `<!-- Image${onlyImage ? '' : ' Left'} -->
    <image x="${imageX}" y="${imageY}" width="${imageWidth}" height="${imageHeight}" href="${imgData}"${preserveAttr} />` : ''}
  ${text ? `<!-- Text -->
    <text x="${textX}" y="${textY}" text-anchor="${anchor}" dominant-baseline="middle" alignment-baseline="middle" dy="-0em" font-family="${font}" font-size="${fontSize}px" fill="${textColor}">
      ${text}
    </text>` : ''}
</svg>`;
}
