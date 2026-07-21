import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/*/src/**/*.test.ts',
      'packages/*/src/**/*.spec.ts',
      'apps/*/src/**/*.test.ts',
      'apps/*/src/**/*.spec.ts',
    ],
    exclude: ['node_modules', 'dist', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types.ts',
      ],
    },
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@schoolos/ui': path.resolve(__dirname, 'packages/ui/src'),
      '@schoolos/database': path.resolve(__dirname, 'packages/database/src'),
      '@schoolos/auth': path.resolve(__dirname, 'packages/auth/src'),
      '@schoolos/api': path.resolve(__dirname, 'packages/api/src'),
      '@schoolos/config': path.resolve(__dirname, 'packages/config/src'),
      '@schoolos/types': path.resolve(__dirname, 'packages/types/src'),
      '@schoolos/utils': path.resolve(__dirname, 'packages/utils/src'),
      '@schoolos/utils/server': path.resolve(__dirname, 'packages/utils/src/server'),
      '@schoolos/permissions': path.resolve(__dirname, 'packages/permissions/src'),
      '@schoolos/hooks': path.resolve(__dirname, 'packages/hooks/src'),
      '@schoolos/constants': path.resolve(__dirname, 'packages/constants/src'),
      '@schoolos/validation': path.resolve(__dirname, 'packages/validation/src'),
    },
  },
});
