import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/assets/scripts/utils/**/*.js'],
      exclude: ['node_modules', 'dist', 'tests'],
    },
    setupFiles: ['./tests/setup.js'],
  },
});
