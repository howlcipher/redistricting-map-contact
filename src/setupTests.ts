import '@testing-library/jest-dom';
import { vi } from 'vitest';

(globalThis as any).localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as unknown as Storage;
