import { render, renderWithSetup, screen } from 'shared-utils-test';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    text: 'Test Todo',
    completed: false,
  };

  test('할 일 항목이 올바르게 렌더링됩니다', () => {
    render(<TodoItem todo={mockTodo} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  test('완료된 할 일은 체크 표시가 됩니다', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('완료되지 않은 할 일은 체크 표시가 되지 않습니다', () => {
    render(<TodoItem todo={mockTodo} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('체크박스를 클릭하면 onToggle이 호출됩니다', async () => {
    const onToggle = vitest.fn();
    const { user } = renderWithSetup(
      <TodoItem todo={mockTodo} onToggle={onToggle} onDelete={() => {}} />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  test('삭제 버튼을 클릭하면 onDelete가 호출됩니다', async () => {
    const onDelete = vitest.fn();
    const { user } = renderWithSetup(
      <TodoItem todo={mockTodo} onToggle={() => {}} onDelete={onDelete} />
    );

    const deleteButton = screen.getByRole('button', { name: /삭제/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockTodo.id);
  });
}); 