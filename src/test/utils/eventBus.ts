import { vi } from 'vitest';

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