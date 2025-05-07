import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { configure, render, RenderOptions } from '@testing-library/react';
import { ReactNode } from 'react';

// 테스트 ID 속성을 'data-sp-id'로 설정
configure({ testIdAttribute: 'data-sp-id' });

/**
 * 이벤트 버스 스토어의 모의 객체를 생성합니다.
 * @returns 이벤트 버스 스토어의 모의 객체
 */
export const createEventBusStore = () => ({
  getState: () => ({
    subscribe: vi.fn(),
    subscribeOne: vi.fn(),
    unsubscribe: vi.fn(),
    unsubscribeAll: vi.fn(),
    publish: vi.fn(),
    getLastEvent: vi.fn(),
  }),
});

/**
 * React 컴포넌트를 렌더링하고 사용자 이벤트 설정을 제공합니다.
 * React Testing Library의 render와 user event 설정을 결합하여 편의성을 제공합니다.
 *
 * @param jsx - 렌더링할 React 컴포넌트 또는 JSX 요소
 * @returns 사용자 이벤트 설정과 렌더링 결과를 포함하는 객체
 * @example
 * ```tsx
 * const { user, container } = renderWithSetup(<MyComponent />);
 * await user.click(container.querySelector('button'));
 * ```
 */
export const renderWithSetup = (jsx: ReactNode, options?: RenderOptions) => {
  return {
    user: userEvent.setup(),
    ...render(jsx, options),
  };
};

// Testing Library의 모든 기능을 재내보냅니다.
export * from '@testing-library/react'; 