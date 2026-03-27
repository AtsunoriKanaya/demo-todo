import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoFilter } from './components/TodoFilter';
import { TodoItem } from './components/TodoItem';

export function App() {
  const {
    todos,
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
    totalCount,
  } = useTodos();

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h1 className="app-title">My Tasks</h1>
            <p className="app-subtitle">
              {totalCount === 0
                ? 'No tasks yet — add one below'
                : `${activeCount} of ${totalCount} remaining`}
            </p>
          </div>
        </header>

        <TodoInput onAdd={addTodo} />

        {totalCount > 0 && (
          <>
            <div className="todo-list">
              {todos.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p>All done! Great work.</p>
                </div>
              ) : (
                todos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    onEditDueDate={editDueDate}
                    onEditPriority={editPriority}
                  />
                ))
              )}
            </div>

            <TodoFilter
              filter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />
          </>
        )}

        <footer className="app-footer">
          <span>Double-click a task to edit &middot; Enter to add &middot; Esc to cancel</span>
        </footer>
      </div>
    </div>
  );
}
