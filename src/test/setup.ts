import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

declare global {
  const describe: typeof import('vitest')['describe'];
  const test: typeof import('vitest')['test'];
  const expect: typeof import('vitest')['expect'];
  const vi: typeof import('vitest')['vi'];
}

// 각 테스트 후에 cleanup 실행
afterEach(() => {
  cleanup();
}); 