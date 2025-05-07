import { useState } from 'react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      onToggle(Date.now());
      setNewTodo('');
    }
  };

  return (
    <div className="todo-list">
      <h2>할일 목록</h2>
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새로운 할일을 입력하세요"
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <ul>
        {todos.length === 0 ? (
          <li>할 일이 없습니다.</li>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </ul>
    </div>
  );
}; 