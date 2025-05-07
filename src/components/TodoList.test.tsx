import { render, renderWithSetup, screen } from 'shared-utils-test';
import { TodoList } from './TodoList';

describe('TodoList', () => {
  const mockTodos = [
    { id: 1, text: '할 일 1', completed: false },
    { id: 2, text: '할 일 2', completed: true },
  ];

  test('할 일 목록이 올바르게 렌더링됩니다', () => {
    render(<TodoList todos={mockTodos} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('할 일 1')).toBeInTheDocument();
    expect(screen.getByText('할 일 2')).toBeInTheDocument();
  });

  test('할 일이 없을 때 메시지가 표시됩니다', () => {
    render(<TodoList todos={[]} onToggle={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });

  test('할 일 항목의 체크박스를 클릭하면 onToggle이 호출됩니다', async () => {
    const onToggle = vitest.fn();
    const { user } = renderWithSetup(
      <TodoList todos={mockTodos} onToggle={onToggle} onDelete={() => {}} />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(onToggle).toHaveBeenCalledWith(mockTodos[0].id);
  });

  test('할 일 항목의 삭제 버튼을 클릭하면 onDelete가 호출됩니다', async () => {
    const onDelete = vitest.fn();
    const { user } = renderWithSetup(
      <TodoList todos={mockTodos} onToggle={() => {}} onDelete={onDelete} />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /삭제/i });
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(mockTodos[0].id);
  });
}); 