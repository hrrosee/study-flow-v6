import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Clock, ChevronRight, X } from 'lucide-react';

export interface WorkspaceGoalStat {
  workspaceId: string;
  workspaceName: string;
  isStarred?: boolean;
  completedTasksCount: number;
  totalTasksCount: number;
  timeSpentMinutes: number;
}

export interface TodaysGoalPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: 'tasks' | 'time';
  onToggleMode: (mode: 'tasks' | 'time') => void;
  completedTasksToday: number;
  dailyTaskTarget: number;
  onUpdateTaskTarget?: (newTarget: number) => void;
  totalStudyMinutesToday: number;
  dailyTimeTargetMinutes: number;
  onUpdateDailyTimeTarget?: (newMinutes: number) => void;
  workspacesStats: WorkspaceGoalStat[];
  activeWorkspaceId: string;
  onSelectWorkspace: (workspaceId: string) => void;
  streakDays?: number;
}

export function formatGoalDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function getMotivationalMessage(percent: number, _isTimeMode?: boolean): { quote: string; emoji: string } {
  if (percent >= 100) {
    return {
      quote: "Goal crushed today! You're unstoppable!",
      emoji: "🏆"
    };
  }
  if (percent >= 80) {
    return { quote: "Almost at the finish line! Just a final push!", emoji: "🎯" };
  }
  if (percent >= 50) {
    return { quote: "Halfway there, fantastic momentum!", emoji: "⚡" };
  }
  if (percent >= 25) {
    return { quote: "Great progress, keep the focus going!", emoji: "🚀" };
  }
  return { quote: "Let's make today productive and focused!", emoji: "💪" };
}

export const TodaysGoalPopover: React.FC<TodaysGoalPopoverProps> = ({
  isOpen,
  onClose,
  currentMode,
  onToggleMode,
  completedTasksToday,
  dailyTaskTarget,
  totalStudyMinutesToday,
  dailyTimeTargetMinutes,
  workspacesStats,
  activeWorkspaceId,
  onSelectWorkspace,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (popoverRef.current && !popoverRef.current.contains(target) && !target.closest('[data-goal-card]')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const isTimeMode = currentMode === 'time';
  const targetNumber = isTimeMode ? dailyTimeTargetMinutes : dailyTaskTarget;
  const currentNumber = isTimeMode ? totalStudyMinutesToday : completedTasksToday;
  const percent = targetNumber > 0 ? Math.min(100, Math.round((currentNumber / targetNumber) * 100)) : 0;
  const motivation = getMotivationalMessage(percent, isTimeMode);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const activeWorkspacesWithProgress = workspacesStats.filter((ws) =>
    isTimeMode ? ws.timeSpentMinutes > 0 : ws.completedTasksCount > 0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for Mobile & Transparent Click-Away for Desktop */}
          <div
            className="fixed inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none z-[999990]"
            onClick={onClose}
          />

          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:top-full sm:left-0 sm:right-auto sm:mt-2 sm:translate-x-0 sm:translate-y-0 w-[92vw] sm:w-[400px] max-h-[85vh] sm:max-h-[580px] overflow-y-auto bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] z-[999999] p-4 space-y-3.5 select-none text-slate-800 dark:text-slate-100 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Header (Matching StreakPopover Header with status badge) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <Target className="w-4 h-4 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Today's Goal</h3>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{formattedDate}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  percent >= 100
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
                }`}
              >
                {percent >= 100 ? 'Goal Crushed 🎉' : `${percent}% Completed`}
              </span>
            </div>

            {/* 2. Main Stat Progress Banner with Linear Bar (Rich & Tall) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/5 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Target className="w-6 h-6 stroke-[2.4]" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-900 dark:text-slate-100 leading-none">
                        {isTimeMode ? formatGoalDuration(currentNumber) : currentNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        / {isTimeMode ? formatGoalDuration(targetNumber) : `${targetNumber} Tasks`}
                      </span>
                    </div>
                    <p className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {percent >= 100
                        ? 'Target completed! Outstanding focus'
                        : isTimeMode
                        ? `${formatGoalDuration(Math.max(0, targetNumber - currentNumber))} remaining to hit goal`
                        : `${Math.max(0, targetNumber - currentNumber)} ${targetNumber - currentNumber === 1 ? 'task' : 'tasks'} remaining`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Progress
                  </span>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Linear Visual Progress Fill */}
              <div className="w-full bg-slate-200/80 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent >= 100
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-[#176BFF] to-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(percent > 0 ? 5 : 0, percent))}%` }}
                />
              </div>
            </div>

            {/* 3. Task / Time Shifting Selector */}
            <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/70 dark:border-slate-800 select-none w-full">
              <button
                type="button"
                onClick={() => onToggleMode('tasks')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  !isTimeMode
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                <span>Tasks Goal</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleMode('time')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isTimeMode
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Time Goal</span>
              </button>
            </div>

            {/* 4. Dynamic Motivational Status Card */}
            <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-blue-50/60 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/20 rounded-xl p-2.5 px-3 border border-emerald-200/70 dark:border-emerald-900/40 flex items-center gap-2.5 shadow-2xs w-full box-border">
              <span className="text-base shrink-0 select-none">{motivation.emoji}</span>
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 leading-snug truncate flex-1">
                {motivation.quote}
              </p>
            </div>

            {/* 5. Breakdown By Workspace (Only Workspaces with Covered Tasks / Time) */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 w-full box-border">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Breakdown By Workspace
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  {activeWorkspacesWithProgress.length} {activeWorkspacesWithProgress.length === 1 ? 'Workspace' : 'Workspaces'}
                </span>
              </div>

              <div className="max-h-[220px] overflow-y-auto space-y-1.5 w-full box-border custom-scrollbar">
                {activeWorkspacesWithProgress.length === 0 ? (
                  <div className="py-6 px-4 text-center rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {isTimeMode ? 'No study time logged yet today' : 'No tasks completed yet today'}
                    </p>
                    <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {isTimeMode ? 'Start study timer in any workspace to log time' : 'Complete tasks to see workspace breakdown'}
                    </p>
                  </div>
                ) : (
                  activeWorkspacesWithProgress.map((ws) => {
                    const isActive = ws.workspaceId === activeWorkspaceId;
                    return (
                      <div
                        key={ws.workspaceId}
                        onClick={() => {
                          onSelectWorkspace(ws.workspaceId);
                          onClose();
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 w-full box-border ${
                          isActive
                            ? 'bg-blue-50/80 border-blue-200/90 shadow-2xs'
                            : 'bg-white hover:bg-slate-50/80 border-slate-200/70'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-[#176BFF]' : 'bg-slate-400'}`} />
                            <span className={`text-xs font-bold truncate ${isActive ? 'text-[#176BFF]' : 'text-slate-800'}`}>
                              {ws.workspaceName}
                            </span>
                            {isActive && (
                              <span className="text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] font-medium">
                            {isTimeMode ? (
                              <span className="text-emerald-700 font-semibold">
                                {formatGoalDuration(ws.timeSpentMinutes)} covered
                              </span>
                            ) : (
                              <span className="text-slate-500">
                                <span className="font-bold text-slate-700">{ws.completedTasksCount}</span> {ws.completedTasksCount === 1 ? 'task' : 'tasks'} completed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center text-slate-400 hover:text-slate-700">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
