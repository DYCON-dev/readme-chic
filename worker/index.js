// Worker entry point: handles fetch events and routes to SVG template renderers
import { renderFancy } from './templates/fancy.js';
import { renderBadge } from './templates/badge.js';
import { renderBlock } from './templates/block.js';
import { renderDouble } from './templates/double.js';  // ← new import

// Registry of available SVG renderers
const renderers = {
  fancy: renderFancy,
  badge: renderBadge,
  block: renderBlock,
  double: renderDouble,      // ← added multi-block template
};

/**
 * Selects and executes the corresponding renderer function.
 * @param {string} tpl - template key
 * @param {object} params - parameters for the renderer
 */
async function renderByTemplate(tpl, params) {
  const renderer = renderers[tpl] || renderers.fancy;
  return await renderer(params);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// Utility function to escape HTML special characters in query values
function escapeHtml(s = '') {
  return s.replace(/[&<>'"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }[c]));
}

/**
 * Retrieves all query parameters, maps generic keys,
 * and dispatches to the chosen template renderer.
 */
async function handleRequest(request) {
  const qp = new URL(request.url).searchParams;
  const tpl = qp.get('template') || 'fancy';

  const params = {};
  for (const [key, value] of qp.entries()) {
    if (key === 'w') {
      params.width = parseInt(value);
    } else if (key === 'h') {
      params.height = parseInt(value);
    } else {
      params[key] = escapeHtml(value);
    }
  }

  const svg = await renderByTemplate(tpl, params);
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml;charset=UTF-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}