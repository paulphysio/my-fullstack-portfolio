import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
global.mockRouter = {
  push: () => {},
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
};
