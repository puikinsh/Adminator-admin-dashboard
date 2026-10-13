import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/assets/scripts/2026/**/*.js'],
      exclude: ['node_modules', 'dist', 'tests', 'src/assets/scripts/2026/index.js'],
    },
  },
});
