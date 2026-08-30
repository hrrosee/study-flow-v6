import React, { useState, useEffect, useRef } from 'react';
import { 
  GripVertical, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Check, 
  Trash2, 
  Edit2, 
  Copy,
  Flag
} from 'lucide-react';
import { Task } from '../types';

interface TaskRowProps {
  task: Task;
  onToggleTask: (id: string, e?: React.MouseEvent) => void;
  onRenameTask: (id: string, newTitle: string) => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask: (id: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggleTask,
  onRenameTask,
  onDeleteTask,
  onDuplicateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(task.title);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  const handleSaveTitle = () => {
    if (editingTitle.trim()) {
      onRenameTask(task.id, editingTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="group relative overflow-hidden flex items-center justify-between px-3 py-2.5 border-b border-[#E9EDF3] dark:border-slate-800 hover:bg-[#FAFBFD] dark:hover:bg-slate-800/40 transition-colors select-none text-xs">
      {/* Left side: Drag handle, checkbox, title */}
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
        {/* Grip handle dots */}
        <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleTask(task.id, e);
          }}
          className={`w-4 h-4 rounded flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            task.completed
              ? 'bg-[#176BFF] dark:bg-blue-600 border border-[#176BFF] text-white shadow-2xs'
              : 'border border-[#D8E0EC] dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-[#176BFF] dark:hover:border-blue-400 shadow-3xs'
          }`}
        >
          {task.completed && <Check className="w-3 h-3 stroke-[3] text-white" />}
        </button>

        {/* Title / Editable Input */}
        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="flex-1 bg-white dark:bg-slate-900 border border-[#176BFF] rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`font-semibold transition-colors truncate cursor-pointer ${
              task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100 hover:text-[#176BFF] dark:hover:text-blue-400'
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Right side: Date, Time, Priority, Options */}
      <div className="flex items-center gap-2.5 sm:gap-3 text-slate-400 text-[11px] font-medium shrink-0">
        {/* Priority Badge if set */}
        {task.priority && task.priority !== 'none' && (
          <div className="flex items-center gap-1 font-bold text-[10.5px]">
            <Flag
              className={`w-3.5 h-3.5 ${
                task.priority === 'high'
                  ? 'text-[#F43F5E] fill-[#F43F5E]'
                  : task.priority === 'medium'
                  ? 'text-[#D97706] fill-[#D97706]'
                  : 'text-[#2563EB] fill-[#2563EB]'
              }`}
            />
            <span
              className={`hidden sm:inline ${
                task.priority === 'high'
                  ? 'text-[#F43F5E]'
                  : task.priority === 'medium'
                  ? 'text-[#D97706]'
                  : 'text-[#2563EB]'
              }`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        )}

        {/* Date */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{task.createdDate}</span>
        </div>

        {/* Time */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{task.createdTime}</span>
        </div>

        {/* Action Menu Trigger Button */}
        <div ref={menuRef} className={`relative ${showMenu ? 'z-[99999]' : 'z-10'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-6 z-[999999] w-36 bg-white border border-[#E3E9F2] rounded-[8px] shadow-2xl py-1 text-xs text-slate-700"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" /> Rename
              </button>

              <button
                onClick={() => {
                  onDuplicateTask(task.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" /> Duplicate
              </button>

              <button
                onClick={() => {
                  onDeleteTask(task.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Move to Bin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
