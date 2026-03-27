import { useState, useEffect, useCallback } from 'react';
import { Todo, Priority, FilterType } from '../types';

const STORAGE_KEY = 'todos-app-v1';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Todo[];
  } catch {
    return [];
  }
}

function saveToStorage(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    saveToStorage(todos);
  }, [todos]);

  const addTodo = useCallback((text: string, priority: Priority, dueDate?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev => [
      {
        id: generateId(),
        text: trimmed,
        completed: false,
        priority,
        dueDate: dueDate || undefined,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, text: trimmed } : t))
    );
  }, []);

  const editDueDate = useCallback((id: string, dueDate: string | undefined) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, dueDate } : t))
    );
  }, []);

  const editPriority = useCallback((id: string, priority: Priority) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, priority } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, []);

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    editDueDate,
    editPriority,
    clearCompleted,
    activeCount,
    completedCount,
    totalCount: todos.length,
  };
}
