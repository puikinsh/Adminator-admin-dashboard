/**
 * jsvectormap wiring for the 2026 design system.
 *
 * Pages declare a vector map as <div data-vmap></div>; this module fills it
 * with a world map themed using the active CSS variables and re-renders on
 * theme change.
 *
 * jsvectormap plus its world map data is loaded with a dynamic import() so
 * only vector-maps.html pays for it — initVectorMaps() bails before the
 * import when the page has no [data-vmap] host.
 */

let jsVectorMap = null;

async function loadVectorMap() {
  if (jsVectorMap) return jsVectorMap;
  const mod = await import(/* webpackChunkName: "vendor-jsvectormap" */ './vendor-jsvectormap.js');
  jsVectorMap = mod.default;
  return jsVectorMap;
}

const MARKERS = [
  { name: 'Riga',         coords: [56.95, 24.10] },
  { name: 'New York',     coords: [40.71, -74.00] },
  { name: 'San Francisco',coords: [37.77, -122.42] },
  { name: 'London',       coords: [51.50, -0.12] },
  { name: 'Berlin',       coords: [52.52, 13.40] },
  { name: 'Tokyo',        coords: [35.68, 139.69] },
  { name: 'Sydney',       coords: [-33.86, 151.21] },
  { name: 'São Paulo',    coords: [-23.55, -46.63] },
  { name: 'Cape Town',    coords: [-33.92, 18.42] },
  { name: 'Dubai',        coords: [25.27, 55.30] },
];

const instances = new Map();

function tokens() {
  const cs = getComputedStyle(document.documentElement);
  return {
    primary: cs.getPropertyValue('--primary').trim(),
    purple:  cs.getPropertyValue('--purple').trim(),
    soft:    cs.getPropertyValue('--bg-muted').trim(),
    border:  cs.getPropertyValue('--border').trim(),
    text:    cs.getPropertyValue('--t-base').trim(),
    bg:      cs.getPropertyValue('--bg-card').trim(),
  };
}

async function buildOne(host) {
  await loadVectorMap();
  // Destroy old instance if rebuilding
  const prev = instances.get(host);
  if (prev) {
    try { prev.destroy(); } catch { /* swallow — host is about to be replaced */ }
    host.innerHTML = '';
  }
  const t = tokens();
  const map = new jsVectorMap({
    selector: host,
    map: 'world',
    backgroundColor: 'transparent',
    zoomOnScroll: false,
    regionStyle: {
      initial: { fill: t.soft, stroke: t.border, strokeWidth: 0.4, fillOpacity: 1 },
      hover:   { fill: t.primary, fillOpacity: 0.5 },
    },
    markers: MARKERS,
    markerStyle: {
      initial: { fill: t.primary, stroke: t.bg, strokeWidth: 2, r: 5 },
      hover:   { fill: t.purple,  stroke: t.bg, strokeWidth: 2, r: 7 },
    },
    labels: { markers: { render: (m) => m.name } },
  });
  instances.set(host, map);
}

function buildAll() {
  document.querySelectorAll('[data-vmap]').forEach(buildOne);
}

export function initVectorMaps() {
  if (!document.querySelector('[data-vmap]')) return;
  buildAll();
  const observer = new MutationObserver((records) => {
    if (records.some((r) => r.attributeName === 'data-theme')) buildAll();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
