import React, { useState, useRef } from 'react';
import { Priority } from '../types';

interface TodoInputProps {
  onAdd: (text: string, priority: Priority, dueDate?: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text, priority, dueDate || undefined);
    setText('');
    setDueDate('');
    setPriority('medium');
    setShowOptions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="todo-input-wrapper">
      <div className="todo-input-row">
        <div className={`priority-dot priority-${priority}`} />
        <input
          ref={inputRef}
          className="todo-input"
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowOptions(true)}
        />
        <button
          className="options-toggle"
          onClick={() => setShowOptions(s => !s)}
          title="Options"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
          </svg>
        </button>
        <button className="add-btn" onClick={handleSubmit} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {showOptions && (
        <div className="todo-options">
          <div className="option-group">
            <label className="option-label">Priority</label>
            <div className="priority-selector">
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  className={`priority-btn priority-btn-${p} ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="option-group">
            <label className="option-label" htmlFor="due-date">Due Date</label>
            <input
              id="due-date"
              className="date-input"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
