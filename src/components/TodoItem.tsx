import React, { useState, useRef, useEffect } from 'react';
import { Todo, Priority } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onEditDueDate: (id: string, dueDate: string | undefined) => void;
  onEditPriority: (id: string, priority: Priority) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  return due < today;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, onEditDueDate, onEditPriority }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editingDate, setEditingDate] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      editRef.current?.focus();
      editRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    if (editingDate) {
      dateRef.current?.focus();
      dateRef.current?.showPicker?.();
    }
  }, [editingDate]);

  const commitDate = (value: string) => {
    onEditDueDate(todo.id, value || undefined);
    setEditingDate(false);
  };

  const commitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  };

  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate);

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
      <div className={`priority-bar priority-${todo.priority}`} />

      <button
        type="button"
        className={`checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="todo-content">
        {editing ? (
          <input
            ref={editRef}
            className="edit-input"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitEdit}
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={() => !todo.completed && setEditing(true)}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}

        <div className="todo-meta">
          {editingPriority ? (
            <div className="priority-inline-selector">
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  className={`priority-inline-btn priority-badge priority-badge-${p} ${todo.priority === p ? 'active' : ''}`}
                  onClick={() => { onEditPriority(todo.id, p); setEditingPriority(false); }}
                >
                  {p}
                </button>
              ))}
              <button type="button" className="priority-inline-cancel" onClick={() => setEditingPriority(false)}>✕</button>
            </div>
          ) : (
            <span
              className={`priority-badge priority-badge-${todo.priority}`}
              onClick={() => setEditingPriority(true)}
              title="Click to change priority"
              style={{ cursor: 'pointer' }}
            >
              {todo.priority}
            </span>
          )}
          {editingDate ? (
            <input
              ref={dateRef}
              className="date-input-inline"
              type="date"
              defaultValue={todo.dueDate ?? ''}
              onChange={e => commitDate(e.target.value)}
              onBlur={e => commitDate(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') setEditingDate(false);
              }}
            />
          ) : todo.dueDate ? (
            <span
              className={`due-date ${overdue ? 'overdue' : ''}`}
              onClick={() => setEditingDate(true)}
              title="Click to change date"
              style={{ cursor: 'pointer' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {overdue ? 'Overdue · ' : ''}{formatDate(todo.dueDate)}
            </span>
          ) : (
            <span
              className="due-date add-date"
              onClick={() => setEditingDate(true)}
              title="Add due date"
              style={{ cursor: 'pointer', opacity: 0.45 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Add date
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        {!todo.completed && (
          <button
            type="button"
            className="action-btn edit-btn"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          className="action-btn delete-btn"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
