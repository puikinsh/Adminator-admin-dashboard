import { describe, it, expect, vi } from 'vitest';
import { initCharts } from '../src/assets/scripts/2026/charts.js';

const mocks = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn() }));
vi.mock('../src/assets/scripts/2026/vendor-chartjs.js', () => ({
  default: class Chart {
    static defaults = { font: {}, plugins: { legend: { labels: {} }, tooltip: {} } };
    constructor(canvas, config) {
      this.data = config.data;
      this.options = config.options;
      this.update = mocks.update;
      mocks.create(canvas, this);
    }
  },
}));

describe('chart theme updates', () => {
  it('updates the existing chart without rebuilding it or replaying animation', async () => {
    initCharts();
    expect(mocks.create).not.toHaveBeenCalled();
    document.body.innerHTML = '<canvas data-chart-key="dashboard-monthly"></canvas>';
    document.documentElement.style.setProperty('--primary', '#123456');
    initCharts();
    await vi.waitFor(() => expect(mocks.create).toHaveBeenCalledTimes(1));
    const chart = mocks.create.mock.calls[0][1];
    expect(chart.data.datasets[0].borderColor).toBe('#123456');
    document.documentElement.style.setProperty('--primary', '#654321');
    document.documentElement.setAttribute('data-theme', 'dark');
    await vi.waitFor(() => expect(mocks.update).toHaveBeenCalledWith('none'));
    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(chart.data.datasets[0].borderColor).toBe('#654321');
  });
});
