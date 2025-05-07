import { describe, it, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: '테스트 할일',
    completed: false,
  };

  test('할일 텍스트를 표시합니다', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('테스트 할일')).toBeInTheDocument();
  });

  test('체크박스 클릭 시 onToggle이 호출됩니다', () => {
    const handleToggle = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={handleToggle}
        onDelete={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleToggle).toHaveBeenCalledWith(1);
  });

  test('삭제 버튼 클릭 시 onDelete가 호출됩니다', () => {
    const handleDelete = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onDelete={handleDelete}
      />
    );
    fireEvent.click(screen.getByText('삭제'));
    expect(handleDelete).toHaveBeenCalledWith(1);
  });
}); 