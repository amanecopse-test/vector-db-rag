import { describe, it, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from './TodoList';

describe('TodoList', () => {
  test('새로운 할일을 추가할 수 있습니다', () => {
    render(<TodoList />);
    
    const input = screen.getByPlaceholderText('새로운 할일을 입력하세요');
    fireEvent.change(input, { target: { value: '새로운 할일' } });
    fireEvent.click(screen.getByText('추가'));

    expect(screen.getByText('새로운 할일')).toBeInTheDocument();
  });

  test('할일을 완료 상태로 변경할 수 있습니다', () => {
    render(<TodoList />);
    
    // 할일 추가
    const input = screen.getByPlaceholderText('새로운 할일을 입력하세요');
    fireEvent.change(input, { target: { value: '테스트 할일' } });
    fireEvent.click(screen.getByText('추가'));

    // 체크박스 클릭
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // 완료 상태 확인
    const todoText = screen.getByText('테스트 할일');
    expect(todoText).toHaveStyle('text-decoration: line-through');
  });

  test('할일을 삭제할 수 있습니다', () => {
    render(<TodoList />);
    
    // 할일 추가
    const input = screen.getByPlaceholderText('새로운 할일을 입력하세요');
    fireEvent.change(input, { target: { value: '삭제할 할일' } });
    fireEvent.click(screen.getByText('추가'));

    // 삭제 버튼 클릭
    fireEvent.click(screen.getByText('삭제'));

    // 할일이 삭제되었는지 확인
    expect(screen.queryByText('삭제할 할일')).not.toBeInTheDocument();
  });
}); 