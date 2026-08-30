import React from 'react';
import { TrendingUp, Folder, Target, Flame, Clock } from 'lucide-react';

interface StatCardsProps {
  workspaceTasksCount: { total: number; completed: number };
  sectionTasksCount: { total: number; completed: number };
  dailyGoal: { total: number; completed: number };
  streakDays: number;
  lastUpdatedText: string;
}

export const StatCards: React.FC<StatCardsProps> = ({
  workspaceTasksCount,
  sectionTasksCount,
  dailyGoal,
  streakDays,
  lastUpdatedText,
}) => {
  const wsPercent = workspaceTasksCount.total > 0
    ? Math.round((workspaceTasksCount.completed / workspaceTasksCount.total) * 100)
    : 0;

  const secPercent = sectionTasksCount.total > 0
    ? Math.round((sectionTasksCount.completed / sectionTasksCount.total) * 100)
    : 0;

  const goalPercent = dailyGoal.total > 0
    ? Math.round((dailyGoal.completed / dailyGoal.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 select-none">
      {/* 1. Workspace Progress Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-[10px] p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#176BFF] shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Workspace Progress</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#176BFF] h-full rounded-full transition-all duration-500"
                style={{ width: `${wsPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-extrabold text-[#176BFF] shrink-0">{wsPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{workspaceTasksCount.completed} / {workspaceTasksCount.total} Tasks</p>
        </div>
      </div>

      {/* 2. Section Progress Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-[10px] p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
            <Folder className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Section Progress</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${secPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-extrabold text-purple-600 shrink-0">{secPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{sectionTasksCount.completed} / {sectionTasksCount.total} Tasks</p>
        </div>
      </div>

      {/* 3. Today's Goal Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-[10px] p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#176BFF] shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Today's Goal</span>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-900 tracking-tight">
            {dailyGoal.completed} / {dailyGoal.total} Tasks
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">{goalPercent}% Completed</p>
        </div>
      </div>

      {/* 4. Streak Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-[10px] p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Streak</span>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-900 tracking-tight">
            {streakDays} Days
          </div>
          <p className="text-[11px] text-orange-600 font-medium mt-1 flex items-center gap-1">
            Keep it up! 🔥
          </p>
        </div>
      </div>

      {/* 5. Last Updated Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-[10px] p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#176BFF] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Last Updated</span>
        </div>

        <div>
          <div className="text-sm font-bold text-slate-900 tracking-tight truncate">
            {lastUpdatedText || '2 hours ago'}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Auto-synced</p>
        </div>
      </div>
    </div>
  );
};
