/**
 * 비동기 작업이 완료될 때까지 대기합니다.
 * @param ms - 대기할 시간 (밀리초)
 * @returns Promise
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); 