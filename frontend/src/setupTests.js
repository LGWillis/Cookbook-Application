import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock window.location
const mockLocation = new URL('http://localhost/');
delete window.location;
window.location = {
  ...mockLocation,
  href: mockLocation.href,
  assign: vi.fn(),
  replace: vi.fn(),
};

// Cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
