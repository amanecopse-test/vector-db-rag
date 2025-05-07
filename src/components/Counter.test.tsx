import { describe, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter', () => {
  test('초기 카운트는 0입니다', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('증가 버튼을 클릭하면 카운트가 1 증가합니다', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('Increment'));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('감소 버튼을 클릭하면 카운트가 1 감소합니다', () => {
    render(<Counter />);
    fireEvent.click(screen.getByText('Decrement'));
    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });
}); 