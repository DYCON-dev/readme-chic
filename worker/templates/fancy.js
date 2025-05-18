// Template for Fancy SVG rendering
import theme from '../../color/theme.js';
// Component logic for rendering Fancy SVG

export async function renderFancy(params) {
  let {
    width: widthParam,
    height        = 200,
    c1            = theme.colors.fond1,   // background color if no image or gradient
    c2,                        // gradient color if present
    r             = theme.boxes.b2,      // legacy corner radius parameter
    borderRadius,              // border radius token name (e.g., 'b1', 'b2', ...)
    borderColor   = theme.colors.fond3,   // default inner border color
    borderWidth   = 0,         // inner border thickness
    borderStyle   = 'solid',   // inner border style
    bgImageUrl,                // user-provided background image URL
    title,
    subtitle,
    description,
    fs1           = 36,
    fs2           = 18,
    textSpacing   = 1.2,        // multiplication factor for line spacing
    col1          = theme.colors.contenuFond, // primary text color
    col2          = theme.colors.contenuFond,
    font          = 'Arial, sans-serif',
    textAlign     = 'center',  // 'left' | 'center' | 'right'
    padding       = 20         // distance from border for left/right
  } = params;

  // Support theme color tokens for background, gradient and border
  if (theme.colors[c1]) {
    c1 = theme.colors[c1];
  }
  if (c2 && theme.colors[c2]) {
    c2 = theme.colors[c2];
  }
  if (borderColor && theme.colors[borderColor]) {
    borderColor = theme.colors[borderColor];
  }

  // If border enabled without color, use theme.colors.fond3
  let effectiveBorderColor = borderColor;
  if (borderWidth > 0 && (borderColor === 'none' || !borderColor)) {
    effectiveBorderColor = theme.colors.fond3;
  }

  // If image URL provided, fetch and encode as Data URI for GitHub
  let bgImageData;
  if (bgImageUrl) {
    const resp = await fetch(bgImageUrl);
    const buffer = await resp.arrayBuffer();
    const mime = resp.headers.get('Content-Type') || 'image/png';
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(binary);
    bgImageData = `data:${mime};base64,${b64}`;
  }

  // Calculate corner radius: support theme tokens
  let radius;
  if (borderRadius != null) {
    if (typeof borderRadius === 'string' && theme.boxes[borderRadius]) {
      // transforme la valeur du thème, ex '0,25rem' -> nombre
      const val = theme.boxes[borderRadius].replace(',', '.');
      radius = parseFloat(val);
    } else if (!isNaN(Number(borderRadius))) {
      radius = Number(borderRadius);
    } else {
      // fallback à la valeur r
      radius = r;
    }
  } else {
    radius = r;
  }
  const width   = widthParam || 800;
  const heightV = height;

  // Define background: image > gradient > color
  let defs = '';
  let useImage = false;
  let rectFill = c1;
  if (bgImageData) {
    defs = `<defs>
      <clipPath id="clip">
        <rect x="0" y="0" width="${width}" height="${heightV}" rx="${radius}" ry="${radius}" />
      </clipPath>
    </defs>`;
    useImage = true;
  } else if (c1 && c2) {
    defs = `<defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>`;
    rectFill = 'url(#grad)';
  }

  // Prepare text lines
  const lines = [];
  if (title)       lines.push({ text: title,       fontSize: fs1, fill: col1 });
  if (subtitle)    lines.push({ text: subtitle,    fontSize: fs2, fill: col2 });
  if (description) lines.push({ text: description, fontSize: fs2, fill: col2 });

  // Word-wrap long lines to fit within available width
  const wrappedLines = [];
  const maxTextWidth = width - 2 * padding - 2 * borderWidth;
  lines.forEach(({ text, fontSize, fill }) => {
    const words = text.split(' ');
    let current = '';
    words.forEach(word => {
      const test = current ? current + ' ' + word : word;
      // approximate text width: average 0.6 * fontSize per character
      if (test.length * fontSize * 0.6 > maxTextWidth) {
        wrappedLines.push({ text: current, fontSize, fill });
        current = word;
      } else {
        current = test;
      }
    });
    if (current) wrappedLines.push({ text: current, fontSize, fill });
  });
  // replace lines with wrappedLines for rendering
  const renderLines = wrappedLines;

  const lineSpacing = fs2 * textSpacing;
  const blockSpan   = (renderLines.length - 1) * lineSpacing;
  const startY      = heightV / 2 - blockSpan / 2;

  // Calculate horizontal text position
  const B = borderWidth;
  let xPos, anchor;
  switch (textAlign) {
    case 'left':
      // keep text clear of rounded corner: use max(radius, B) as offset
      xPos   = Math.max(radius, B) + padding;
      anchor = 'start';
      break;
    case 'right':
      xPos   = width - (Math.max(radius, B) + padding);
      anchor = 'end';
      break;
    default:
      xPos   = width / 2;
      anchor = 'middle';
  }

  // Generate text elements
  const textElements = renderLines.map((line, i) => `
    <text x="${xPos}" y="${startY + i * lineSpacing}" 
          dominant-baseline="middle" text-anchor="${anchor}"
          font-family="${font}" font-size="${line.fontSize}px" fill="${line.fill}">
      ${line.text}
    </text>
  `).join('');

  // Create inner border with solid or dashed styles
  let borderRect = '';
  if (B > 0) {
    const halfB = B / 2;
    const innerR = Math.max(radius - halfB, 0);
    const dash = borderStyle === 'dashed' ? ` stroke-dasharray="${B * 2},${B * 2}"` : '';
    borderRect = `
      <rect x="${halfB}" y="${halfB}" width="${width - B}" height="${heightV - B}"
            rx="${innerR}" ry="${innerR}"
            fill="none" stroke="${effectiveBorderColor}" stroke-width="${B}" vector-effect="non-scaling-stroke"${dash} />`;
  }

  // Assemble SVG
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${widthParam != null ? widthParam : '100%'}" height="${heightV}" preserveAspectRatio="none"
       viewBox="0 0 ${width} ${heightV}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img">
  ${defs}
  <!-- Background -->
  ${useImage
    ? `<image x="0" y="0" width="${width}" height="${heightV}" xlink:href="${bgImageData}" href="${bgImageData}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip)" />`
    : `<rect x="0" y="0" width="${width}" height="${heightV}" rx="${radius}" ry="${radius}" fill="${rectFill}" />`}
  <!-- Inner border -->
  ${borderRect}
  <!-- Text -->
  ${textElements}
</svg>`;
}
