import { render, renderWithSetup, screen } from 'shared-utils-test';
import { Counter } from './Counter';

describe('Counter', () => {
  test('초기 카운트는 1입니다', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('증가 버튼을 클릭하면 카운트가 1 증가합니다', async () => {
    const { user } = renderWithSetup(<Counter />);
    const incrementButton = screen.getByRole('button', { name: 'Increment' });
    
    await user.click(incrementButton);
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });

  test('감소 버튼을 클릭하면 카운트가 1 감소합니다', async () => {
    const { user } = renderWithSetup(<Counter />);
    const decrementButton = screen.getByRole('button', { name: 'Decrement' });
    
    await user.click(decrementButton);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
}); 