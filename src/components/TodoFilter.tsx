import { FilterType } from '../types';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: TodoFilterProps) {
  return (
    <div className="todo-filter">
      <span className="item-count">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <div className="filter-tabs">
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            type="button"
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`clear-btn ${completedCount === 0 ? 'hidden' : ''}`}
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed ({completedCount})
      </button>
    </div>
  );
}
