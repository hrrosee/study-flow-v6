import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ListTodo,
  Check,
  Plus,
  Trash2,
  Edit2,
  Menu,
  Sparkles,
  CheckCircle2,
  X,
  ArrowUpDown,
  ChevronDown,
  Clock,
  Calendar,
  ArrowDownAZ,
  Filter,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { StandaloneTask } from '../types';
import { soundManager } from '../utils/audio';

interface TasksStudioProps {
  tasks: StandaloneTask[];
  onAddTask: (title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, newTitle: string) => void;
  onClearCompleted: () => void;
  onClose?: () => void;
  onToggleSidebar?: () => void;
  soundEnabled?: boolean;
}

export const TasksStudio: React.FC<TasksStudioProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onClearCompleted,
  onToggleSidebar,
  soundEnabled = true,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [isCategoryEnabled, setIsCategoryEnabled] = useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [isMobileFilterMenuOpen, setIsMobileFilterMenuOpen] = useState<boolean>(false);
  const [mobileMenuTaskId, setMobileMenuTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  // Hero Collapsible Mobile State & Gestures (100% 1:1 matching NotesStudio)
  const [isHeroOpen, setIsHeroOpen] = useState<boolean>(true);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [pullDirection, setPullDirection] = useState<'up' | 'down'>('up');
  const tasksScrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const touchStartScrollTopRef = useRef<number>(0);
  const isPullingDownRef = useRef<boolean>(false);
  const heroOpenAtTouchStartRef = useRef<boolean>(true);

  // Calculations
  const totalCount = tasks.length;
  const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const activeCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 1:1 Hero Opacity Calculation Matching NotesStudio.tsx
  const getHeroOpacity = (): number => {
    if (isHeroOpen && pullDistance === 0) return 1;
    if (!isHeroOpen && pullDistance === 0) return 0;

    if (pullDirection === 'up') {
      // 70% pull-up: Opacity goes 100% -> 0% in the first 70% of pull up (from 132 down to 39.6px)
      return Math.min(1, Math.max(0, (pullDistance - 39.6) / 92.4));
    } else {
      // Pull-down: 1-2% -> 10%, 3-4% -> 12%, 4-5% -> 14%, 6-7% -> 16%, 8-9% -> 18%, 9-10% -> 20%, 10-90% -> 20%-100%
      const pct = (pullDistance / 132) * 100;
      if (pct <= 0) return 0;
      if (pct <= 2) return Math.min(0.10, Math.max(0, pct * 0.05));
      if (pct <= 4) return 0.10 + (pct - 2) * 0.01;
      if (pct <= 5) return 0.12 + (pct - 4) * 0.02;
      if (pct <= 7) return 0.14 + (pct - 5) * 0.01;
      if (pct <= 9) return 0.16 + (pct - 7) * 0.01;
      if (pct <= 10) return 0.18 + (pct - 9) * 0.02;
      if (pct <= 90) return 0.20 + ((pct - 10) / 80) * 0.80;
      return 1.0;
    }
  };

  // Smart date/time formatter for completed time
  const formatCompletionTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return '';

      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = d.toDateString() === yesterday.toDateString();

      const timeStr = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      if (isToday) {
        return `Today, ${timeStr}`;
      } else if (isYesterday) {
        return `Yesterday, ${timeStr}`;
      } else {
        const dateStr = d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        return `${dateStr}, ${timeStr}`;
      }
    } catch {
      return '';
    }
  };

  // Date Grouping Formatter for Category Sort
  const formatGroupDate = (isoString?: string): { key: string; label: string; dateObj: Date } => {
    if (!isoString) {
      return { key: 'unknown', label: 'Undated Tasks', dateObj: new Date(0) };
    }
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) {
        return { key: 'unknown', label: 'Undated Tasks', dateObj: new Date(0) };
      }
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = d.toDateString() === yesterday.toDateString();

      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      if (isToday) {
        return { key: dateKey, label: 'Today', dateObj: d };
      }
      if (isYesterday) {
        return { key: dateKey, label: 'Yesterday', dateObj: d };
      }
      const label = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
      return { key: dateKey, label, dateObj: d };
    } catch {
      return { key: 'unknown', label: 'Undated Tasks', dateObj: new Date(0) };
    }
  };

  // Filter and Sort Tasks (Recent or Old)
  const filteredAndSortedTasks = useMemo(() => {
    let list = [...tasks];

    // 1. Filter
    if (activeFilter === 'pending') {
      list = list.filter(t => !t.completed);
    } else if (activeFilter === 'completed') {
      list = list.filter(t => t.completed);
    }

    // 2. Sort (Recent: Newest first, Oldest: Oldest first)
    return list.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return sortBy === 'recent' ? timeB - timeA : timeA - timeB;
    });
  }, [tasks, activeFilter, sortBy]);

  // Date Groups for Category View (When Category is On)
  const taskDateGroups = useMemo(() => {
    if (!isCategoryEnabled) return [];

    const groupsMap = new Map<string, { label: string; dateObj: Date; tasks: StandaloneTask[] }>();

    filteredAndSortedTasks.forEach(task => {
      const { key, label, dateObj } = formatGroupDate(task.createdAt);
      if (!groupsMap.has(key)) {
        groupsMap.set(key, { label, dateObj, tasks: [] });
      }
      groupsMap.get(key)!.tasks.push(task);
    });

    return Array.from(groupsMap.entries())
      .map(([key, value]) => ({
        key,
        dateLabel: value.label,
        dateObj: value.dateObj,
        tasks: value.tasks,
      }))
      .sort((a, b) => {
        return sortBy === 'recent'
          ? b.dateObj.getTime() - a.dateObj.getTime()
          : a.dateObj.getTime() - b.dateObj.getTime();
      });
  }, [filteredAndSortedTasks, isCategoryEnabled, sortBy]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTaskId]);

  const handleCreateTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setNewTaskTitle('');
    inputRef.current?.focus();
  };

  const handleToggle = (taskId: string, currentCompleted: boolean) => {
    if (!currentCompleted && soundEnabled) {
      soundManager.playTaskCheck();
    }
    onToggleTask(taskId);
  };

  const handleStartEdit = (task: StandaloneTask) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const handleSaveEdit = (taskId: string) => {
    const trimmed = editingTaskTitle.trim();
    if (trimmed) {
      onEditTask(taskId, trimmed);
    }
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#F8FAFC] dark:bg-slate-950 min-w-0 overflow-hidden select-none">
      {/* 1. TOP STICKY HEADER (Matches NotesStudio 1:1) */}
      <div className="h-12 sm:h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3.5 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-3xs">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => {
              if (onToggleSidebar) {
                onToggleSidebar();
              }
            }}
            className="w-[32px] h-[32px] rounded-lg border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-center shadow-3xs transition-all cursor-pointer select-none shrink-0"
            title="Open sidebar"
          >
            <Menu className="w-4 h-4 text-slate-700 dark:text-slate-200 stroke-[2.3]" />
          </button>

          {/* Mobile Compact Title (Smooth Fade-In when Hero is collapsed) */}
          <div
            className="flex items-center min-w-0 pointer-events-none transition-all duration-200"
            style={{
              opacity: isHeroOpen ? (pullDistance > 0 ? Math.max(0, 1 - pullDistance / 40) : 0) : Math.min(1, 1 - pullDistance / 60),
              transform: `translateY(${isHeroOpen ? 6 : 0}px)`,
              display: isHeroOpen && pullDistance === 0 ? 'none' : 'flex',
            }}
          >
            <h1 className="font-serif font-bold text-[15.5px] text-slate-900 dark:text-slate-100 tracking-tight truncate leading-none">
              Tasks
            </h1>
          </div>
        </div>

        {/* Right Actions: Header Gradient Progress Bar & Clear Completed Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Header Gradient Progress Bar (Both Mobile & Desktop) */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 shrink-0">
            <div className="flex flex-col min-w-[95px] sm:min-w-[150px]">
              <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                <span className="text-[#2563EB] dark:text-blue-400 font-extrabold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-700 overflow-hidden mt-0.5">
                <motion.div
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Clear Completed Button */}
          {completedCount > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="h-8 px-2.5 sm:px-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs shrink-0"
              title="Clear all completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear completed ({completedCount})</span>
              <span className="sm:hidden">Clear ({completedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split / Full Layout Container */}
      <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col min-h-0 relative bg-white dark:bg-slate-900 border-x border-slate-200/60 dark:border-slate-800 shadow-3xs">
          
          {/* Collapsible Hero Header Layer (1:1 with NotesStudio.tsx) */}
          <motion.div
            initial={false}
            animate={{
              height: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 132 : (isHeroOpen ? 132 : pullDistance > 0 ? pullDistance : 0),
              opacity: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : getHeroOpacity(),
            }}
            transition={{
              height: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              opacity: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            }}
            className="overflow-hidden bg-white dark:bg-slate-900 flex flex-col items-center text-center select-none shrink-0 md:!h-[132px] md:!opacity-100"
          >
            <motion.div
              animate={{
                y: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : (isHeroOpen ? 0 : pullDistance > 0 ? pullDistance - 132 : -132),
              }}
              transition={{
                y: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              }}
              className="pt-3.5 pb-1 px-4 flex flex-col items-center text-center select-none w-full md:!translate-y-0"
            >
              {/* 1. Gradient Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-[#2563EB] to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-2">
                <ListTodo className="w-[32px] h-[32px] stroke-[2.2]" />
              </div>

              {/* 2. Tasks Title */}
              <h1 className="font-serif font-extrabold text-[19px] text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Tasks
              </h1>

              {/* 3. Refined Tasks Count Badge (Soft Glass Blue Glow) */}
              <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 text-[11px] font-semibold text-blue-700 dark:text-blue-300 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400 shadow-[0_0_6px_rgba(37,99,235,0.3)] dark:shadow-[0_0_8px_rgba(96,165,250,0.6)] shrink-0" />
                <span>{activeCount} {activeCount === 1 ? 'Task' : 'Tasks'} pending</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Add Bar & Filter Chips (Pins permanently above task list like NotesStudio search bar) */}
          <div className="px-3.5 pt-2 pb-2.5 md:p-3.5 border-b border-slate-100 dark:border-slate-800 md:border-slate-200/80 dark:md:border-slate-800 flex flex-col gap-2.5 shrink-0 bg-white dark:bg-slate-900 z-30">
            {/* Quick Add Form */}
            <form onSubmit={handleCreateTask} className="w-full flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new task... (Press Enter)"
                  className="w-full h-[34px] pl-3 pr-8 text-[13px] rounded-lg bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 font-medium"
                />
                {newTaskTitle.trim() && (
                  <button
                    type="button"
                    onClick={() => setNewTaskTitle('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="h-[34px] px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </form>

            {/* Filter Tabs & Sort Dropdown Row */}
            <div className="flex items-center justify-between gap-2 py-0.5 text-[13px]">
              {/* Left Desktop: Full Filter Chips (Hidden on mobile) */}
              <div className="hidden sm:flex items-center gap-2">
                {[
                  { id: 'all', label: 'All', count: totalCount },
                  { id: 'pending', label: 'Pending', count: activeCount },
                  { id: 'completed', label: 'Completed', count: completedCount },
                ].map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-[7px] font-medium whitespace-nowrap transition-all cursor-pointer leading-none flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-3xs font-semibold'
                          : 'bg-slate-100/90 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`inline-flex items-center justify-center min-w-[15px] h-[14px] px-1 rounded-full text-[10px] font-medium leading-none shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/75 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Left Mobile: Clickable Filter Dropdown Menu (Only visible on mobile) */}
              <div className="relative sm:hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterMenuOpen(prev => !prev)}
                  className={`h-7 px-2.5 rounded-md border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer select-none shadow-3xs ${
                    isMobileFilterMenuOpen
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#2563EB]/40 text-[#2563EB] dark:text-blue-400'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                  title="Filter Tasks"
                >
                  <Filter className={`w-3 h-3 ${isMobileFilterMenuOpen ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`} />
                  <span className="text-slate-800 dark:text-slate-200 font-semibold capitalize">
                    {activeFilter === 'all' ? 'All' : activeFilter === 'pending' ? 'Pending' : 'Completed'}
                  </span>
                  <span
                    className="inline-flex items-center justify-center min-w-[15px] h-[14px] px-1 rounded-full text-[10px] font-bold leading-none bg-[#2563EB]/10 dark:bg-blue-950 text-[#2563EB] dark:text-blue-300"
                  >
                    {activeFilter === 'all' ? totalCount : activeFilter === 'pending' ? activeCount : completedCount}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isMobileFilterMenuOpen ? 'rotate-180 text-[#2563EB]' : ''}`} />
                </button>

                <AnimatePresence>
                  {isMobileFilterMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setIsMobileFilterMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12, ease: 'easeOut' }}
                        className="absolute left-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 p-1 z-[9999] flex flex-col gap-0.5"
                      >
                        {[
                          { id: 'all', label: 'All', count: totalCount, icon: ListTodo },
                          { id: 'pending', label: 'Pending', count: activeCount, icon: Clock },
                          { id: 'completed', label: 'Completed', count: completedCount, icon: CheckCircle2 },
                        ].map(opt => {
                          const isSelected = activeFilter === opt.id;
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setActiveFilter(opt.id as any);
                                setIsMobileFilterMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-bold'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`} />
                                <span>{opt.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`inline-flex items-center justify-center min-w-[15px] h-[14px] px-1 rounded-full text-[10px] font-bold leading-none ${
                                    isSelected
                                      ? 'bg-[#2563EB] text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                  }`}
                                >
                                  {opt.count}
                                </span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Custom Sort Dropdown */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(prev => !prev)}
                  className={`h-7 px-2.5 rounded-md border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer select-none shadow-3xs ${
                    isSortDropdownOpen
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 border-[#2563EB]/40 text-[#2563EB] dark:text-blue-400'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                  title="Sort Tasks"
                >
                  <ArrowUpDown className={`w-3 h-3 ${isSortDropdownOpen ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline text-slate-400 font-medium">Sort:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    {sortBy === 'recent' ? 'Recent' : 'Old'}
                  </span>
                  {isCategoryEnabled && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Category Active" />
                  )}
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180 text-[#2563EB]' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setIsSortDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 p-1.5 z-[9999] flex flex-col gap-1"
                      >
                        {/* Section 1: Order (Recent / Old) */}
                        <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Sort Order
                        </div>

                        {[
                          { id: 'recent', label: 'Recent', icon: Clock },
                          { id: 'oldest', label: 'Old', icon: Calendar },
                        ].map(opt => {
                          const isSelected = sortBy === opt.id;
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setSortBy(opt.id as any);
                                setIsSortDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-bold'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`} />
                                <span>{opt.label}</span>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400 stroke-[2.5]" />
                              )}
                            </button>
                          );
                        })}

                        {/* Divider */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 my-0.5" />

                        {/* Section 2: Category (On / Off) */}
                        <div className="px-2 pt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                          <span>Category</span>
                          <span className={`text-[9.5px] font-bold lowercase px-1.5 py-0.2 rounded ${isCategoryEnabled ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60' : 'text-slate-400'}`}>
                            {isCategoryEnabled ? 'active' : 'inactive'}
                          </span>
                        </div>

                        <div
                          onClick={() => setIsCategoryEnabled(prev => !prev)}
                          className="flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2">
                            <Layers className={`w-3.5 h-3.5 transition-colors ${isCategoryEnabled ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`} />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">By Date</span>
                          </div>

                          {/* Animated Toggle Switch */}
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[11px] font-semibold transition-colors ${isCategoryEnabled ? 'text-[#2563EB] dark:text-blue-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                              {isCategoryEnabled ? 'On' : 'Off'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCategoryEnabled(prev => !prev);
                              }}
                              className={`w-8 h-[18px] rounded-full p-0.5 transition-all cursor-pointer flex items-center shrink-0 ${
                                isCategoryEnabled
                                  ? 'bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-500 justify-end shadow-2xs'
                                  : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400/80 dark:hover:bg-slate-600 justify-start'
                              }`}
                              title={isCategoryEnabled ? 'Turn Off Category' : 'Turn On Category'}
                            >
                              <motion.div
                                layout
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="w-3.5 h-3.5 rounded-full bg-white shadow-xs"
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Task Cards Scroll Container (100% 1:1 matching NotesStudio Isolated Scroll Track) */}
          <div
            ref={tasksScrollRef}
            onTouchStart={(e) => {
              touchStartYRef.current = e.touches[0]?.clientY ?? 0;
              touchStartTimeRef.current = Date.now();
              const st = tasksScrollRef.current?.scrollTop ?? 0;
              touchStartScrollTopRef.current = st;
              isPullingDownRef.current = st <= 2;
              heroOpenAtTouchStartRef.current = isHeroOpen;
              setPullDirection(isHeroOpen ? 'up' : 'down');
            }}
            onTouchMove={(e) => {
              const currentY = e.touches[0]?.clientY ?? 0;
              const deltaY = currentY - touchStartYRef.current;
              const st = tasksScrollRef.current?.scrollTop ?? 0;

              // Only pull hero down if touch gesture STARTED when list was at top (scrollTop <= 2)
              if (!heroOpenAtTouchStartRef.current && deltaY > 0) {
                if (touchStartScrollTopRef.current <= 2 && st <= 2) {
                  setPullDirection('down');
                  const pull = Math.min(132, deltaY * 0.55);
                  setPullDistance(pull);
                }
              } else if (heroOpenAtTouchStartRef.current && deltaY < 0) {
                if (st <= 2) {
                  setPullDirection('up');
                  if (isHeroOpen) setIsHeroOpen(false);
                  const pull = Math.max(0, 132 + (deltaY * 0.55));
                  setPullDistance(pull);
                }
              }
            }}
            onTouchEnd={(e) => {
              const currentY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
              const deltaY = currentY - touchStartYRef.current;
              const deltaTime = Math.max(1, Date.now() - touchStartTimeRef.current);
              const velocityY = deltaY / deltaTime; // pixels per ms
              
              // Ignore simple taps but restore open state
              if (Math.abs(deltaY) < 5) {
                if (heroOpenAtTouchStartRef.current) setIsHeroOpen(true);
                setPullDistance(0);
                return;
              }

              if (!heroOpenAtTouchStartRef.current) {
                // Was closed: ONLY trigger hero open if touch gesture STARTED when list was AT TOP (touchStartScrollTop <= 2)
                if (touchStartScrollTopRef.current <= 2) {
                  const isFastFlickDown = velocityY > 0.35 && deltaY > 15;
                  if (pullDistance >= 46 || isFastFlickDown) {
                    setIsHeroOpen(true);
                  } else {
                    setIsHeroOpen(false);
                  }
                }
                setPullDistance(0);
              } else {
                // Was open:
                if (deltaY < 0) {
                  const isFastFlickUp = velocityY < -0.35 && deltaY < -15;
                  if (pullDistance < 86 || isFastFlickUp) {
                    setIsHeroOpen(false);
                  } else {
                    setIsHeroOpen(true); // Snap back open
                  }
                } else {
                  // User pulled down or dragged nowhere while already open -> keep it fully open!
                  setIsHeroOpen(true);
                }
                setPullDistance(0);
              }
            }}
            onScroll={(e) => {
              if (window.innerWidth < 768) {
                const st = e.currentTarget.scrollTop;
                if (isHeroOpen && st > 8) {
                  setPullDirection('up');
                  setIsHeroOpen(false);
                  setPullDistance(0);
                }
              }
            }}
            className={`flex-1 min-h-0 custom-scrollbar p-0 bg-white dark:bg-slate-900 ${
              (!isHeroOpen && pullDistance === 0) ? 'overflow-y-auto' : 'overflow-hidden'
            } md:!overflow-y-auto`}
          >
            <AnimatePresence mode="wait">
              {filteredAndSortedTasks.length === 0 ? (
                /* Empty State with Pure Fade */
                <motion.div
                  key={`empty-${activeFilter}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14, ease: 'linear' }}
                  className="py-14 px-4 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-[#2563EB] dark:text-blue-400 mb-3 shadow-3xs">
                    {activeFilter === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
                    ) : activeFilter === 'pending' ? (
                      <Clock className="w-6 h-6 stroke-[1.8]" />
                    ) : (
                      <ListTodo className="w-6 h-6 stroke-[1.8]" />
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
                    {activeFilter === 'completed'
                      ? 'No completed tasks yet'
                      : activeFilter === 'pending'
                      ? 'Great job! You have completed all pending tasks.'
                      : 'No tasks added yet'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
                    {activeFilter === 'completed'
                      ? 'Complete tasks from the pending list to see them here.'
                      : activeFilter === 'pending'
                      ? 'Great job! You have completed all pending tasks.'
                      : 'Type a task above and press Enter to quickly add to your daily checklist.'}
                  </p>
                </motion.div>
              ) : (
                /* Task Rows Container with Pure Fade (Full Width Dividers) */
                <motion.div
                  key={`tasks-list-${activeFilter}-${sortBy}-${isCategoryEnabled ? 'cat' : 'flat'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.14, ease: 'linear' }}
                  className="w-full bg-white dark:bg-slate-900"
                >
                  <AnimatePresence initial={false}>
                    {isCategoryEnabled ? (
                      /* Category Date Groups */
                      <div className="w-full">
                        {taskDateGroups.map((group) => (
                          <div key={group.key} className="w-full">
                            {/* Date Category Sticky Header */}
                            <div className="sticky top-0 z-10 px-4 sm:px-6 py-2 bg-slate-50/95 dark:bg-slate-800/90 backdrop-blur-sm border-y border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                                  {group.dateLabel}
                                </span>
                              </div>
                              <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 px-2 py-0.5 rounded-full shadow-3xs">
                                {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
                              </span>
                            </div>

                            {/* Group Tasks */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                              {group.tasks.map((task) => {
                                const isEditing = editingTaskId === task.id;

                                return (
                                  <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.14, ease: 'easeOut' }}
                                    className={`group relative flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 transition-colors ${
                                      isEditing
                                        ? 'bg-blue-50/50 dark:bg-blue-950/20'
                                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                                    }`}
                                  >
                                    {/* Left: Circular Checkbox + Task Title */}
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      {task.completed ? (
                                        <button
                                          type="button"
                                          onClick={() => handleToggle(task.id, task.completed)}
                                          className="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shadow-xs cursor-pointer shrink-0 transition-transform active:scale-95"
                                          title="Mark as pending"
                                        >
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleToggle(task.id, task.completed)}
                                          className="w-5 h-5 rounded-full border-[1.8px] border-slate-400 dark:border-slate-500 hover:border-emerald-500 flex items-center justify-center cursor-pointer shrink-0 transition-colors active:scale-95"
                                          title="Mark as completed"
                                        />
                                      )}

                                      <div className="min-w-0 flex-1">
                                        {isEditing ? (
                                          <form
                                            onSubmit={(e) => {
                                              e.preventDefault();
                                              handleSaveEdit(task.id);
                                            }}
                                            className="w-full flex items-center gap-1.5 m-0"
                                          >
                                            <input
                                              ref={editInputRef}
                                              type="text"
                                              value={editingTaskTitle}
                                              onChange={(e) => setEditingTaskTitle(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Escape') {
                                                  setEditingTaskId(null);
                                                  setEditingTaskTitle('');
                                                }
                                              }}
                                              className="flex-1 min-w-0 px-2.5 py-1 text-[13.5px] font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                                            />
                                            {/* OK (Confirm) Button */}
                                            <button
                                              type="submit"
                                              className="w-6 h-6 rounded-md bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                                              title="Save (Enter)"
                                            >
                                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </button>
                                            {/* Cancel (Cross) Button */}
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingTaskId(null);
                                                setEditingTaskTitle('');
                                              }}
                                              className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 flex items-center justify-center transition-all cursor-pointer shrink-0"
                                              title="Cancel (Esc)"
                                            >
                                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </button>
                                          </form>
                                        ) : (
                                          <span
                                            onDoubleClick={() => handleStartEdit(task)}
                                            className={`text-[13.5px] sm:text-[14px] font-medium truncate block cursor-pointer select-none leading-tight transition-colors ${
                                              task.completed
                                                ? 'line-through text-slate-400 dark:text-slate-500'
                                                : 'text-slate-800 dark:text-slate-100'
                                            }`}
                                            title="Double-click to rename"
                                          >
                                            {task.title}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Right: Actions + Status Column + Mobile 3-Dot Menu */}
                                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                      {/* Desktop Hover Edit & Delete Actions (Hidden on mobile) */}
                                      {!isEditing && (
                                        <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            type="button"
                                            onClick={() => handleStartEdit(task)}
                                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                            title="Edit task"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => onDeleteTask(task.id)}
                                            className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                            title="Delete task"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      )}

                                      {/* Status & Timestamp (Completed or Pending) */}
                                      <div className="flex flex-col items-end text-right shrink-0 min-w-[75px] sm:min-w-[85px]">
                                        {task.completed ? (
                                          <>
                                            <span className="text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 leading-tight">
                                              Completed
                                            </span>
                                            {(task.completedAt || task.createdAt) && (
                                              <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal leading-tight mt-0.5">
                                                {formatCompletionTime(task.completedAt || task.createdAt)}
                                              </span>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            <span className="text-[11.5px] font-semibold text-blue-500 dark:text-blue-400 leading-tight">
                                              Pending
                                            </span>
                                            {task.createdAt && (
                                              <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal leading-tight mt-0.5">
                                                {formatCompletionTime(task.createdAt)}
                                              </span>
                                            )}
                                          </>
                                        )}
                                      </div>

                                      {/* Mobile 3-Dot Menu Button & Dropdown (At far right on mobile) */}
                                      {!isEditing && (
                                        <div className="relative sm:hidden">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setMobileMenuTaskId(prev => (prev === task.id ? null : task.id));
                                            }}
                                            className="w-7 h-7 -mr-1 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer"
                                            title="Task options"
                                          >
                                            <MoreVertical className="w-4 h-4 stroke-[2]" />
                                          </button>

                                          <AnimatePresence>
                                            {mobileMenuTaskId === task.id && (
                                              <>
                                                <div
                                                  className="fixed inset-0 z-[9998]"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMobileMenuTaskId(null);
                                                  }}
                                                />
                                                <motion.div
                                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                                  transition={{ duration: 0.12, ease: 'easeOut' }}
                                                  className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 p-1 z-[9999] flex flex-col gap-0.5"
                                                >
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setMobileMenuTaskId(null);
                                                      handleStartEdit(task);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                                  >
                                                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Rename</span>
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setMobileMenuTaskId(null);
                                                      onDeleteTask(task.id);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                    <span>Delete</span>
                                                  </button>
                                                </motion.div>
                                              </>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Flat Sorted Tasks List */
                      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {filteredAndSortedTasks.map((task) => {
                          const isEditing = editingTaskId === task.id;

                          return (
                            <motion.div
                              key={task.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.14, ease: 'easeOut' }}
                              className={`group relative flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 transition-colors ${
                                isEditing
                                  ? 'bg-blue-50/50 dark:bg-blue-950/20'
                                  : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30'
                              }`}
                            >
                              {/* Left: Circular Checkbox + Task Title */}
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {task.completed ? (
                                  <button
                                    type="button"
                                    onClick={() => handleToggle(task.id, task.completed)}
                                    className="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shadow-xs cursor-pointer shrink-0 transition-transform active:scale-95"
                                    title="Mark as pending"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleToggle(task.id, task.completed)}
                                    className="w-5 h-5 rounded-full border-[1.8px] border-slate-400 dark:border-slate-500 hover:border-emerald-500 flex items-center justify-center cursor-pointer shrink-0 transition-colors active:scale-95"
                                    title="Mark as completed"
                                  />
                                )}

                                <div className="min-w-0 flex-1">
                                  {isEditing ? (
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSaveEdit(task.id);
                                      }}
                                      className="w-full flex items-center gap-1.5 m-0"
                                    >
                                      <input
                                        ref={editInputRef}
                                        type="text"
                                        value={editingTaskTitle}
                                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setEditingTaskId(null);
                                            setEditingTaskTitle('');
                                          }
                                        }}
                                        className="flex-1 min-w-0 px-2.5 py-1 text-[13.5px] font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                                      />
                                      {/* OK (Confirm) Button */}
                                      <button
                                        type="submit"
                                        className="w-6 h-6 rounded-md bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
                                        title="Save (Enter)"
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </button>
                                      {/* Cancel (Cross) Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingTaskId(null);
                                          setEditingTaskTitle('');
                                        }}
                                        className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 flex items-center justify-center transition-all cursor-pointer shrink-0"
                                        title="Cancel (Esc)"
                                      >
                                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                      </button>
                                    </form>
                                  ) : (
                                    <span
                                      onDoubleClick={() => handleStartEdit(task)}
                                      className={`text-[13.5px] sm:text-[14px] font-medium truncate block cursor-pointer select-none leading-tight transition-colors ${
                                        task.completed
                                          ? 'line-through text-slate-400 dark:text-slate-500'
                                          : 'text-slate-800 dark:text-slate-100'
                                      }`}
                                      title="Double-click to rename"
                                    >
                                      {task.title}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Right: Actions + Status Column + Mobile 3-Dot Menu */}
                              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                {/* Desktop Hover Edit & Delete Actions (Hidden on mobile) */}
                                {!isEditing && (
                                  <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(task)}
                                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                      title="Edit task"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onDeleteTask(task.id)}
                                      className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                      title="Delete task"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}

                                {/* Status & Timestamp (Completed or Pending) */}
                                <div className="flex flex-col items-end text-right shrink-0 min-w-[75px] sm:min-w-[85px]">
                                  {task.completed ? (
                                    <>
                                      <span className="text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 leading-tight">
                                        Completed
                                      </span>
                                      {(task.completedAt || task.createdAt) && (
                                        <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal leading-tight mt-0.5">
                                          {formatCompletionTime(task.completedAt || task.createdAt)}
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-[11.5px] font-semibold text-blue-500 dark:text-blue-400 leading-tight">
                                        Pending
                                      </span>
                                      {task.createdAt && (
                                        <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal leading-tight mt-0.5">
                                          {formatCompletionTime(task.createdAt)}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>

                                {/* Mobile 3-Dot Menu Button & Dropdown (At far right on mobile) */}
                                {!isEditing && (
                                  <div className="relative sm:hidden">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMobileMenuTaskId(prev => (prev === task.id ? null : task.id));
                                      }}
                                      className="w-7 h-7 -mr-1 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer"
                                      title="Task options"
                                    >
                                      <MoreVertical className="w-4 h-4 stroke-[2]" />
                                    </button>

                                    <AnimatePresence>
                                      {mobileMenuTaskId === task.id && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-[9998]"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setMobileMenuTaskId(null);
                                            }}
                                          />
                                          <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                            transition={{ duration: 0.12, ease: 'easeOut' }}
                                            className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 p-1 z-[9999] flex flex-col gap-0.5"
                                          >
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setMobileMenuTaskId(null);
                                                handleStartEdit(task);
                                              }}
                                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                            >
                                              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                              <span>Rename</span>
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setMobileMenuTaskId(null);
                                                onDeleteTask(task.id);
                                              }}
                                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                            >
                                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                              <span>Delete</span>
                                            </button>
                                          </motion.div>
                                        </>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};
