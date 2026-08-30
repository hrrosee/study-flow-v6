import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit2, 
  ArrowUpDown, 
  Bell, 
  MoreVertical, 
  Check, 
  X, 
  Trash2
} from 'lucide-react';
import { Topic, Task } from '../types';
import { TaskRow } from './TaskRow';

interface TopicCardProps {
  topic: Topic;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onRenameTask: (taskId: string, newTitle: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (taskId: string) => void;
  onAddTask: (topicId: string, taskTitle: string) => void;
  onRenameTopic: (topicId: string, newName: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onToggleMarkAll: (topicId: string, markComplete: boolean) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  tasks,
  onToggleTask,
  onRenameTask,
  onDeleteTask,
  onDuplicateTask,
  onAddTask,
  onRenameTopic,
  onDeleteTopic,
  onToggleMarkAll,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(topic.isCollapsed || false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editingTopicName, setEditingTopicName] = useState(topic.name);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastClickedTaskIndexRef = useRef<number | null>(null);

  const handleToggleTaskWithShift = (taskId: string, index: number, e?: React.MouseEvent) => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;
    const targetState = !currentTask.completed;

    if (e?.shiftKey && lastClickedTaskIndexRef.current !== null && lastClickedTaskIndexRef.current !== index) {
      const start = Math.min(lastClickedTaskIndexRef.current, index);
      const end = Math.max(lastClickedTaskIndexRef.current, index);
      const tasksToToggle = tasks.slice(start, end + 1);
      tasksToToggle.forEach((t) => {
        if (t.completed !== targetState) {
          onToggleTask(t.id);
        }
      });
    } else {
      onToggleTask(taskId);
    }
    lastClickedTaskIndexRef.current = index;
  };

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

  // Calculate percentage completed
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isAllMarked = totalTasks > 0 && completedTasks === totalTasks;

  const handleTopicRenameSubmit = () => {
    if (editingTopicName.trim()) {
      onRenameTopic(topic.id, editingTopicName.trim());
      setIsEditingTopic(false);
    }
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(topic.id, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white border border-[#E5EAF2] rounded-[10px] mb-4 shadow-2xs select-none">
      {/* Topic Card Header */}
      <div className="px-4 py-3 bg-[#FAFBFD] border-b border-[#E9EDF3] flex items-center justify-between">
          {/* Left Side: Chevron, Name, Percentage Pill, Mark All */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-500 hover:text-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isEditingTopic ? (
              <div className="flex items-center gap-1">
                <input
                  type="search"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-autocomplete="none"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  autoFocus
                  value={editingTopicName}
                  onChange={(e) => setEditingTopicName(e.target.value)}
                  ref={(el) => {
                    if (el && !el.dataset.initSelected) {
                      el.dataset.initSelected = 'true';
                      setTimeout(() => el.select(), 20);
                    }
                  }}
                  onClick={(e) => {
                    const input = e.currentTarget;
                    if (input.selectionStart === 0 && input.selectionEnd === input.value.length && input.value.length > 0) {
                      const len = input.value.length;
                      input.setSelectionRange(len, len);
                    }
                  }}
                  onBlur={handleTopicRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTopicRenameSubmit();
                    if (e.key === 'Escape') setIsEditingTopic(false);
                  }}
                  className="bg-white dark:bg-slate-900 border border-[#176BFF] rounded px-2 py-0.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                />
                <button type="button" onClick={handleTopicRenameSubmit} className="text-emerald-600 dark:text-emerald-400 p-0.5 cursor-pointer">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                {topic.name}
              </h4>
            )}

            {/* Percentage Pill */}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#176BFF] text-white">
              {percentage}%
            </span>

            {/* Mark All Checkbox */}
            <label className="hidden sm:flex items-center gap-1.5 ml-2 cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 select-none">
              <input
                type="checkbox"
                checked={isAllMarked}
                onChange={(e) => onToggleMarkAll(topic.id, e.target.checked)}
                className="w-4 h-4 rounded border border-[#CBD5E1] dark:border-slate-600 accent-[#176BFF] cursor-pointer"
              />
              <span className="text-[11px]">Mark All</span>
            </label>
          </div>

          {/* Right Side Header Icons: +, Rename, Reorder, Bell, Menu */}
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400">
            {/* + Add Task Icon */}
            <button
              onClick={() => setIsAddingTask(true)}
              className="p-1 hover:text-[#176BFF] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors"
              title="Add task to this topic"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Rename Icon */}
            <button
              onClick={() => setIsEditingTopic(true)}
              className="hidden sm:inline-flex p-1 hover:text-[#176BFF] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded transition-colors"
              title="Rename topic"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            {/* Sort Icon */}
            <button
              className="hidden sm:inline-flex p-1 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Reorder tasks"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>

            {/* Bell Icon */}
            <button
              className="hidden sm:inline-flex p-1 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              title="Set reminder"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            {/* More Options Dropdown Button */}
            <div ref={menuRef} className={`relative ${showMenu ? 'z-[99999]' : 'z-10'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
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
                      onDeleteTopic(topic.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Topic
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Task Rows Body */}
      {!isCollapsed && (
        <div className="divide-y divide-[#E9EDF3]">
          {/* New Task Inline Input */}
          {isAddingTask && (
            <div className="p-2.5 bg-blue-50/50 flex items-center gap-2 border-b border-[#E9EDF3]">
              <input
                type="search"
                autoComplete="one-time-code"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-autocomplete="none"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                autoFocus
                placeholder="Enter new task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newTaskTitle.trim()) {
                      onAddTask(topic.id, newTaskTitle.trim());
                      setNewTaskTitle('');
                      setIsAddingTask(false);
                    }
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsAddingTask(false);
                    setNewTaskTitle('');
                  }
                }}
                className="flex-1 bg-white border border-[#176BFF] rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTaskTitle.trim()) {
                    onAddTask(topic.id, newTaskTitle.trim());
                    setNewTaskTitle('');
                    setIsAddingTask(false);
                  }
                }}
                className="px-3 py-1 bg-[#176BFF] text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {tasks.length === 0 && !isAddingTask ? (
            <div className="py-6 text-center text-xs text-slate-400 italic">
              No tasks in this topic. Click <span className="font-bold text-[#176BFF]">+</span> in the header to add one.
            </div>
          ) : (
            tasks.map((task, idx) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggleTask={(id, e) => handleToggleTaskWithShift(id, idx, e)}
                onRenameTask={onRenameTask}
                onDeleteTask={onDeleteTask}
                onDuplicateTask={onDuplicateTask}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
