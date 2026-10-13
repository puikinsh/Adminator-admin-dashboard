/**
 * Chart.js wiring for the 2026 design system.
 *
 * Pages declare charts as <canvas data-chart-key="<seed>"></canvas>.
 * This module reads CSS variables for theme colors so charts match the active
 * theme, instantiates a Chart.js instance, and re-renders on theme toggle.
 *
 * To keep the chart-page demo visually rich, the seeds are baked-in samples
 * keyed by data-chart-key.
 *
 * Chart.js (~192 KB) is loaded with a dynamic import() so only the two pages
 * that actually draw charts pay for it. initCharts() bails before the import
 * when the page has no [data-chart-key] canvas.
 */

let Chart = null;

async function loadChartJs() {
  if (Chart) return Chart;
  const mod = await import(/* webpackChunkName: "vendor-chartjs" */ './vendor-chartjs.js');
  Chart = mod.default;
  return Chart;
}

function tokens() {
  const cs = getComputedStyle(document.documentElement);
  return {
    primary: cs.getPropertyValue('--primary').trim(),
    success: cs.getPropertyValue('--success').trim(),
    danger:  cs.getPropertyValue('--danger').trim(),
    warning: cs.getPropertyValue('--warning').trim(),
    info:    cs.getPropertyValue('--info').trim(),
    purple:  cs.getPropertyValue('--purple').trim(),
    pink:    cs.getPropertyValue('--pink').trim(),
    orange:  cs.getPropertyValue('--orange').trim(),
    teal:    cs.getPropertyValue('--teal').trim(),
    text:    cs.getPropertyValue('--t-base').trim(),
    muted:   cs.getPropertyValue('--t-muted').trim(),
    light:   cs.getPropertyValue('--t-light').trim(),
    border:  cs.getPropertyValue('--border').trim(),
    soft:    cs.getPropertyValue('--border-soft').trim(),
    bg:      cs.getPropertyValue('--bg-card').trim(),
  };
}

function applyDefaults(t) {
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = t.muted;
  Chart.defaults.borderColor = t.soft;
  Chart.defaults.plugins.legend.position = 'bottom';
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.legend.labels.boxWidth = 8;
  Chart.defaults.plugins.legend.labels.boxHeight = 8;
  Chart.defaults.plugins.tooltip.backgroundColor = t.text;
  Chart.defaults.plugins.tooltip.titleColor = t.bg;
  Chart.defaults.plugins.tooltip.bodyColor = t.bg;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 6;
  Chart.defaults.plugins.tooltip.displayColors = false;
}

export const SEEDS = {
  'revenue-line': (t) => ({
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: '2026',
          data: [42, 56, 50, 78, 88, 96, 110, 124, 118, 142, 158, 184],
          borderColor: t.primary,
          backgroundColor: `${t.primary}20`,
          tension: 0.35,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2.5,
        },
        {
          label: '2025',
          data: [38, 44, 46, 60, 70, 74, 82, 90, 92, 102, 110, 118],
          borderColor: t.muted,
          backgroundColor: 'transparent',
          tension: 0.35,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2,
          borderDash: [4, 4],
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { grid: { color: t.soft, drawBorder: false }, ticks: { color: t.light } },
        x: { grid: { display: false }, ticks: { color: t.light } },
      },
    },
  }),

  'channels-bar': (t) => ({
    type: 'bar',
    data: {
      labels: ['Direct','Search','Social','Email','Affiliate','Display','Other'],
      datasets: [{
        label: 'Visitors',
        data: [124, 88, 72, 54, 36, 28, 18],
        backgroundColor: [t.primary, t.success, t.purple, t.info, t.warning, t.pink, t.muted],
        borderRadius: 6, borderSkipped: false,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: t.soft, drawBorder: false }, ticks: { color: t.light } },
        x: { grid: { display: false }, ticks: { color: t.muted } },
      },
    },
  }),

  'devices-doughnut': (t) => ({
    type: 'doughnut',
    data: {
      labels: ['Desktop','Mobile','Tablet'],
      datasets: [{
        data: [62, 30, 8],
        backgroundColor: [t.primary, t.purple, t.info],
        borderColor: t.bg,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: { legend: { position: 'right' } },
    },
  }),

  'sources-radar': (t) => ({
    type: 'radar',
    data: {
      labels: ['Speed','UX','Reliability','Pricing','Support','Features'],
      datasets: [
        {
          label: 'Adminator',
          data: [85, 92, 88, 76, 80, 95],
          borderColor: t.primary,
          backgroundColor: `${t.primary}30`,
          pointBackgroundColor: t.primary,
        },
        {
          label: 'Competitor',
          data: [70, 65, 75, 82, 60, 70],
          borderColor: t.muted,
          backgroundColor: `${t.muted}20`,
          pointBackgroundColor: t.muted,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        r: { angleLines: { color: t.soft }, grid: { color: t.soft }, pointLabels: { color: t.muted, font: { size: 11 } }, ticks: { display: false } },
      },
    },
  }),

  'mrr-stacked': (t) => ({
    type: 'bar',
    data: {
      labels: ['Q1','Q2','Q3','Q4'],
      datasets: [
        { label: 'Starter', data: [12, 18, 22, 28], backgroundColor: t.info,    borderRadius: 4, stack: 'a' },
        { label: 'Pro',     data: [38, 48, 56, 64], backgroundColor: t.primary, borderRadius: 4, stack: 'a' },
        { label: 'Team',    data: [22, 28, 36, 44], backgroundColor: t.purple,  borderRadius: 4, stack: 'a' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { stacked: true, grid: { color: t.soft, drawBorder: false }, ticks: { color: t.light } },
        x: { stacked: true, grid: { display: false }, ticks: { color: t.muted } },
      },
    },
  }),

  'dashboard-monthly': (t) => ({
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Revenue',
        data: [42, 38, 56, 50, 78, 70, 96, 88, 118, 102, 144, 168],
        borderColor: t.primary,
        backgroundColor: `${t.primary}24`,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: t.primary,
        pointHoverBorderColor: t.bg,
        pointHoverBorderWidth: 3,
        borderWidth: 2.5,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: t.soft, drawBorder: false }, ticks: { color: t.light, maxTicksLimit: 4 } },
        x: { grid: { display: false }, ticks: { color: t.light, font: { size: 10 } } },
      },
    },
  }),

  'sessions-area': (t) => ({
    type: 'line',
    data: {
      labels: Array.from({length: 30}, (_, i) => `${i + 1}`),
      datasets: [{
        label: 'Sessions',
        data: [120, 132, 110, 145, 162, 158, 175, 188, 172, 195, 210, 224, 218, 240, 256, 248, 272, 290, 282, 308, 322, 318, 340, 358, 352, 376, 392, 388, 410, 432],
        borderColor: t.success,
        backgroundColor: `${t.success}24`,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: t.soft, drawBorder: false }, ticks: { color: t.light } },
        x: { grid: { display: false }, ticks: { color: t.light, maxTicksLimit: 6 } },
      },
    },
  }),
};

const instances = new Map();

async function buildAll() {
  await loadChartJs();
  const t = tokens();
  applyDefaults(t);
  document.querySelectorAll('canvas[data-chart-key]').forEach((canvas) => {
    const key = canvas.getAttribute('data-chart-key');
    const seed = SEEDS[key];
    if (!seed) return;
    const existing = instances.get(canvas);
    const config = seed(t);
    if (existing) {
      existing.data.datasets.forEach((dataset, i) => Object.assign(dataset, config.data.datasets[i]));
      existing.options = config.options;
      existing.update('none');
    } else {
      instances.set(canvas, new Chart(canvas, config));
    }
  });
}

export function initCharts() {
  if (!document.querySelector('canvas[data-chart-key]')) return;
  buildAll();
  // Re-render charts whenever the theme changes.
  const observer = new MutationObserver((records) => {
    if (records.some((r) => r.attributeName === 'data-theme')) buildAll();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
