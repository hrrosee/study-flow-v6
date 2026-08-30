import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Shield, Trophy, Check, Clock, AlertCircle } from 'lucide-react';
import {
  StreakData,
  getWeeklyStreakStatus,
  getNextMilestone,
  STREAK_MILESTONES,
  useStreakFreeze,
  getYesterdayDateKey,
} from '../utils/streakManager';
import { soundManager } from '../utils/audio';

export interface StreakPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  streakData: StreakData;
  onStreakUpdate: (updated: StreakData) => void;
  isTodayGoalAchieved: boolean;
}

export const StreakPopover: React.FC<StreakPopoverProps> = ({
  isOpen,
  onClose,
  streakData,
  onStreakUpdate,
  isTodayGoalAchieved,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (popoverRef.current && !popoverRef.current.contains(target) && !target.closest('[data-streak-card]')) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const weeklyDays = getWeeklyStreakStatus(streakData);
  const { nextMilestone, daysRemaining, progressPercent } = getNextMilestone(streakData.currentStreak);
  const currentMilestone = [...STREAK_MILESTONES].reverse().find((m) => streakData.currentStreak >= m.days);

  // Check if yesterday was missed and eligible for freeze
  const yesterdayKey = getYesterdayDateKey();
  const isYesterdayAchieved = !!streakData.history[yesterdayKey];
  const isYesterdayFrozen = !!streakData.frozenDates[yesterdayKey];
  const canFreezeYesterday =
    !isYesterdayAchieved && !isYesterdayFrozen && streakData.freezesRemaining > 0;

  const handleApplyFreeze = () => {
    const res = useStreakFreeze(yesterdayKey);
    if (res.success) {
      soundManager.playStreakFreeze();
      onStreakUpdate(res.data);
    }
  };

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:translate-x-0 sm:translate-y-0 w-[92vw] sm:w-[400px] max-h-[85vh] sm:max-h-[580px] overflow-y-auto bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] z-[999999] p-4 select-none text-slate-800 dark:text-slate-100 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
          {/* 1. Header (No X icon) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 dark:text-orange-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 fill-orange-500 dark:fill-orange-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Streak Tracker</h3>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Consistency Dashboard</p>
              </div>
            </div>

            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                isTodayGoalAchieved
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 animate-pulse'
              }`}
            >
              {isTodayGoalAchieved ? 'Protected Today' : 'Goal Pending'}
            </span>
          </div>

          {/* 2. Main Stat Banner */}
          <div className="my-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 dark:from-orange-950/40 dark:via-amber-950/30 dark:to-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-900 dark:text-slate-100 leading-none">
                    {streakData.currentStreak}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {streakData.currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
                  </span>
                </div>
                <p className="text-[10.5px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
                  {streakData.currentStreak > 0 ? 'You are on a roll! Keep it going' : "Complete today's goal to ignite streak"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Best Record
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-end gap-1 mt-0.5">
                <Trophy className="w-3 h-3 text-amber-500" />
                {streakData.bestStreak} {streakData.bestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>

          {/* 3. Weekly 7-Day Bubble Activity Strip */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">This Week's Activity</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Mon — Sun</span>
            </div>

            <div className="grid grid-cols-7 gap-1 bg-slate-50/90 dark:bg-slate-950/60 p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-center">
              {weeklyDays.map((d) => {
                const isAchieved = d.status === 'achieved' || d.status === 'today-achieved';
                const isFrozen = d.status === 'frozen';
                const isPending = d.status === 'today-pending';

                return (
                  <div key={d.dateKey} className="flex flex-col items-center gap-1.5">
                    <span
                      className={`text-[10.5px] tracking-tight font-bold ${
                        d.isToday ? 'text-orange-600 dark:text-orange-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d.dayLabel}
                    </span>

                    <div
                      title={`${d.fullDayName}: ${
                        isAchieved
                          ? 'Goal Completed'
                          : isFrozen
                          ? 'Protected by Freeze Shield'
                          : isPending
                          ? 'Goal Pending'
                          : d.isPast
                          ? 'Missed'
                          : 'Upcoming'
                      }`}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[8.5px] font-bold transition-all ${
                        isAchieved
                          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-2xs'
                          : isFrozen
                          ? 'bg-sky-500 text-white shadow-2xs'
                          : isPending
                          ? 'bg-white dark:bg-slate-900 border-1.5 border-dashed border-orange-400 text-orange-500 animate-pulse'
                          : d.isPast
                          ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 border border-slate-200/60 dark:border-slate-800'
                      }`}
                    >
                      {isAchieved ? (
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      ) : isFrozen ? (
                        <Shield className="w-3 h-3 fill-white text-white" />
                      ) : isPending ? (
                        <Clock className="w-2.5 h-2.5" />
                      ) : (
                        <span>{d.dayNumber}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Streak Freeze Shields Section (3 per month) */}
          <div className="mb-3 p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100/90 dark:border-sky-900/40">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 fill-sky-500 dark:fill-sky-400" />
                <span className="text-[11px] font-bold text-sky-900 dark:text-sky-200">
                  Monthly Streak Freezes
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((slot) => {
                  const isAvailable = slot <= streakData.freezesRemaining;
                  return (
                    <div
                      key={slot}
                      title={isAvailable ? 'Shield Available' : 'Shield Used this month'}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isAvailable
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'bg-sky-200/60 dark:bg-sky-900/50 text-sky-400 dark:text-sky-500'
                      }`}
                    >
                      <Shield className="w-3 h-3 fill-current" />
                    </div>
                  );
                })}
                <span className="text-[10.5px] font-bold text-sky-800 dark:text-sky-300 ml-1">
                  {streakData.freezesRemaining}/3
                </span>
              </div>
            </div>

            <p className="text-[10px] text-sky-700/90 dark:text-sky-300/80 leading-snug">
              Protects your streak if you miss a study day. Resets to 3 every new month.
            </p>

            {/* If yesterday was missed, offer instant 1-click rescue */}
            {canFreezeYesterday && (
              <div className="mt-2 pt-2 border-t border-sky-200/60 dark:border-sky-900/50 flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-medium text-amber-800 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                  Missed yesterday?
                </span>
                <button
                  type="button"
                  onClick={handleApplyFreeze}
                  className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[10.5px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 fill-white" />
                  Use 1 Freeze
                </button>
              </div>
            )}
          </div>

          {/* 5. Executive Rank Passport & Milestone Shelf */}
          <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-950 dark:to-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            {/* Top Row: Current Rank Banner + Next Target Chip */}
            <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200/70 dark:border-slate-800">
              <div className="min-w-0">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Current Rank
                </span>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate mt-0.5">
                  {currentMilestone ? `${currentMilestone.title} ${currentMilestone.icon}` : 'Study Apprentice ⚡'}
                </h4>
              </div>

              {nextMilestone && (
                <div className="bg-white/90 dark:bg-slate-900/90 border border-orange-200/80 dark:border-orange-900/50 rounded-xl px-2.5 py-1.5 text-right shrink-0 shadow-2xs">
                  <span className="text-[9px] font-bold text-orange-500 dark:text-orange-400 block uppercase tracking-wider">
                    Next in {daysRemaining}d
                  </span>
                  <span className="text-[10.5px] font-black text-slate-800 dark:text-slate-200 flex items-center justify-end gap-1 mt-0.5">
                    <span>{nextMilestone.icon}</span>
                    <span className="truncate">{nextMilestone.title}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Row: 5 Milestone Badges Shelf with Unlock Status */}
            <div className="grid grid-cols-5 gap-1.5 pt-2.5 text-center">
              {STREAK_MILESTONES.slice(0, 5).map((m) => {
                const isUnlocked = streakData.currentStreak >= m.days;
                return (
                  <div
                    key={m.days}
                    title={`${m.title} (${m.days} Days Milestone): ${m.description} · ${
                      isUnlocked ? 'Unlocked ✓' : `${m.days - streakData.currentStreak} days left`
                    }`}
                    className={`relative flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-500/50 shadow-xs shadow-orange-500/10'
                        : 'bg-slate-100/60 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-800 opacity-50 grayscale'
                    }`}
                  >
                    {isUnlocked && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-black shadow-2xs">
                        ✓
                      </span>
                    )}
                    <span className="text-base leading-none mb-1 mt-0.5">{m.icon}</span>
                    <span
                      className={`text-[9.5px] font-black truncate w-full ${
                        isUnlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {m.days}d
                    </span>
                    <span className="text-[7.5px] font-semibold text-slate-500 dark:text-slate-400 leading-tight line-clamp-2 px-0.5 text-center">
                      {m.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};