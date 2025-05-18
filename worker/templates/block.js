// Template for Block SVG rendering
import theme from '../../color/theme.js';

// Component logic for rendering Block SVG

export async function renderBlock(params) {
  let {
    width: widthParam,      // numeric width from URL (e.g. ?w=300)
    height = 200,           // numeric height from URL or default
    bgColor      = theme.colors.fond1,    // background color
    textColor    = theme.colors.contenuFond, // text color
    borderRadius = theme.boxes.b2,      // border radius
    padding      = 20,                 // inner padding in px
    title,
    description,
    font         = 'Arial, sans-serif',
    fsTitle      = 24,
    fsDesc       = 16,
    aboveText    = '', // text to render above the title
    fsAbove      = fsTitle, // font-size for aboveText, defaults to title size
    logoSrc      = '',         // URL of logo image to render above the title
    logoWidth    = fsTitle * 2, // width of logo in px, defaults to twice title size
    logoHeight   = fsTitle * 2, // height of logo in px, defaults to twice title size
    logoPosition = 'top',  // 'top' (above title), 'middle', or 'bottom'
    textSpacing  = 1.3,
    position     = 'bottom', // 'top' | 'bottom' | 'left' | 'right' position
    horizontalAlign = 'center', // 'left' | 'center' | 'right' alignment
    borderWidth   = 0,                     // border thickness
    borderColor   = theme.colors.fond3,    // border color
    borderStyle   = 'solid',               // 'solid' or 'dashed'
  } = params;

  // Fetch and encode logo to Data URI if provided
  let logoData = '';
  if (logoSrc) {
    const resp = await fetch(logoSrc);
    const buffer = await resp.arrayBuffer();
    const mime = resp.headers.get('Content-Type') || 'image/png';
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    logoData = `data:${mime};base64,${btoa(binary)}`;
  }

  const defaultWidth = 800;
  const width  = widthParam != null ? widthParam : defaultWidth;
  const heightV = height;

  // Responsive logo size defaults to 30% of block dimensions if not set
  const computedLogoWidth = params.logoWidth != null
    ? logoWidth
    : width * 0.3;
  const computedLogoHeight = params.logoHeight != null
    ? logoHeight
    : heightV * 0.3;

  // Background rect
  const radius = typeof borderRadius === 'string' && theme.boxes[borderRadius]
    ? parseFloat(theme.boxes[borderRadius].replace(',', '.'))
    : Number(borderRadius);

  // Support theme color tokens
  if (theme.colors[bgColor])    bgColor    = theme.colors[bgColor];
  if (theme.colors[textColor])  textColor  = theme.colors[textColor];
  if (theme.colors[borderColor]) borderColor = theme.colors[borderColor];


  // Build SVG header
  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg width="${widthParam != null ? widthParam : '100%'}" height="${heightV}" preserveAspectRatio="none" viewBox="0 0 ${width} ${heightV}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img">\n`;

  svg += `  <rect x="0" y="0" width="${width}" height="${heightV}" rx="${radius}" ry="${radius}" fill="${bgColor}"/>\n`;

  // Inner border
  if (borderWidth > 0) {
    const halfB = borderWidth / 2;
    const innerR = Math.max(radius - halfB, 0);
    const dash = borderStyle === 'dashed' ? ` stroke-dasharray="${borderWidth * 2},${borderWidth * 2}"` : '';
    svg += `  <rect x="${halfB}" y="${halfB}" width="${width - borderWidth}" height="${heightV - borderWidth}"`;
    svg += ` rx="${innerR}" ry="${innerR}" fill="none" stroke="${borderColor}"`;
    svg += ` stroke-width="${borderWidth}" vector-effect="non-scaling-stroke"${dash}/>\n`;
  }

  // Compute start X,Y and anchor based on horizontalAlign & verticalAlign
  let x, anchor;
  // Horizontal
  if (horizontalAlign === 'left') {
    x = padding;
    anchor = 'start';
  } else if (horizontalAlign === 'right') {
    x = width - padding;
    anchor = 'end';
  } else {
    x = width / 2;
    anchor = 'middle';
  }

  // Title
  let yTitle;
  let titleBaseline = 'middle';
  // only title + position top
  if (!aboveText && !description && position === 'top') {
    // place title so its top edge sits at padding
    yTitle = padding;
    titleBaseline = 'text-before-edge';
  }
  // only title + position bottom
  else if (!aboveText && !description && position === 'bottom') {
    yTitle = heightV - padding;
    titleBaseline = 'text-after-edge';
  }
  // only title: center vertically
  else if (!aboveText && !description) {
    yTitle = heightV / 2;
  } else {
    // default position above center, making room for aboveText/description
    yTitle = heightV / 2 - fsTitle;
  }
  // Above title
  let yAbove = yTitle - fsAbove * textSpacing;

  // If only aboveText provided (no title/description), position at top padding
  if (aboveText && !title && !description) {
    yAbove = padding + fsAbove; 
  }

  // Position overrides for title and description vertical placement
  let overrideDescY = null;
  // If both title and description and position=top, position at top padding
  if (position === 'top' && title && description) {
    // title just below top padding, description below title
    yTitle = padding + fsTitle;
    // override description Y
    overrideDescY = yTitle + fsTitle * textSpacing;
    // adjust aboveText if present
    yAbove = yTitle - fsAbove * textSpacing;
  }
  // If both title and description and position=bottom, position at bottom padding
  else if (position === 'bottom' && title && description) {
    yTitle = heightV - padding - fsDesc * textSpacing;
    overrideDescY = heightV - padding;
    yAbove = yTitle - fsAbove * textSpacing;
  }
  // If both title and description and position=middle, center vertically
  else if (position === 'middle' && title && description) {
    yTitle = heightV / 2 - fsTitle / 2;
    overrideDescY = yTitle + fsTitle * textSpacing;
    yAbove = yTitle - fsAbove * textSpacing;
  }

  // Logo positioning
  if (logoSrc) {
    let yLogo;
    if (logoPosition === 'bottom') {
      // place logo at bottom with padding
      yLogo = heightV - computedLogoHeight - padding;
    } else if (logoPosition === 'middle') {
      // center vertically
      yLogo = (heightV - computedLogoHeight) / 2;
    } else {
      // default: above title
      yLogo = yTitle - computedLogoHeight * textSpacing;
    }
    // compute x based on horizontal anchor
    const xLogo = anchor === 'middle'
      ? x - computedLogoWidth / 2
      : anchor === 'start'
        ? x
        : x - computedLogoWidth;
    svg += `  <image xlink:href="${logoData}" href="${logoData}" x="${xLogo}" y="${yLogo}" width="${computedLogoWidth}" height="${computedLogoHeight}" />\n`;
  }

  if (aboveText) {
    svg += `  <text x="${x}" y="${yAbove}" fill="${textColor}" font-family="${font}" font-size="${fsAbove}px" text-anchor="${anchor}" dominant-baseline="middle">${aboveText}</text>\n`;
  }
  if (title) {
    svg += `  <text x="${x}" y="${yTitle}" fill="${textColor}" font-family="${font}" font-size="${fsTitle}px" text-anchor="${anchor}" dominant-baseline="${titleBaseline}">${title}</text>\n`;
  }
  // Description below title
  if (description) {
    let yDesc = overrideDescY !== null ? overrideDescY : (yTitle + fsTitle * textSpacing);
    svg += `  <text x="${x}" y="${yDesc}" fill="${textColor}" font-family="${font}" font-size="${fsDesc}px" text-anchor="${anchor}" dominant-baseline="middle">${description}</text>\n`;
  }

  svg += `</svg>`;
  return svg;
}