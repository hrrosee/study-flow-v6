import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, ExternalLink } from 'lucide-react';

export interface ActiveStudyTimerSession {
  topicId: string;
  topicTitle: string;
  taskId: string;
  taskTitle: string;
  workspaceId?: string;
  seconds: number;
  isPaused: boolean;
}

export interface FloatingStudyTimerProps {
  session: ActiveStudyTimerSession | null;
  isVisible: boolean;
  onPause: () => void;
  onResume: () => void;
  onStopAndLog: () => void;
  onOpenDrawer: () => void;
}

export function formatTimerClock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

export const FloatingStudyTimer: React.FC<FloatingStudyTimerProps> = ({
  session,
  isVisible,
  onPause,
  onResume,
  onStopAndLog,
  onOpenDrawer,
}) => {
  const lastSessionRef = React.useRef(session);
  if (session) {
    lastSessionRef.current = session;
  }
  const currentSession = session || lastSessionRef.current;
  const isCurrentlyVisible = Boolean(isVisible && currentSession);

  const { taskTitle, topicTitle, seconds, isPaused } = currentSession || {
    taskTitle: '',
    topicTitle: '',
    seconds: 0,
    isPaused: false,
  };
  const clockText = formatTimerClock(seconds);

  return (
    <AnimatePresence>
      {isCurrentlyVisible && (
        <motion.div
          key="floating-study-timer-widget"
          initial={{ opacity: 0, y: 45, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 45, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="fixed bottom-5 right-4 sm:right-6 z-[9999999] select-none"
        >
        <div className="bg-[#0F172A]/95 backdrop-blur-2xl border border-slate-700/80 text-white rounded-2xl p-2 sm:p-2.5 shadow-2xl shadow-slate-950/50 flex items-center gap-2.5 sm:gap-3.5 max-w-[calc(100vw-2rem)] sm:max-w-md">
          {/* Live Pulsing Dot + Clock */}
          <div
            onClick={onOpenDrawer}
            className="h-8 sm:h-8 flex items-center gap-2 px-2.5 bg-white/10 hover:bg-white/15 rounded-xl transition-all cursor-pointer group shrink-0 border border-white/10"
            title="Click to open topic drawer"
          >
            <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
              {!isPaused ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#176BFF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#176BFF]" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400" />
              )}
            </div>

            <span className="text-xs sm:text-sm font-bold tabular-nums tracking-normal text-white group-hover:text-blue-300 transition-colors leading-none">
              {clockText}
            </span>
          </div>

          {/* Task and Topic Titles */}
          <div
            onClick={onOpenDrawer}
            className="min-w-0 flex-1 cursor-pointer pl-1 pr-2 py-0.5"
            title="Click to view task details"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-100 truncate block px-0.5 leading-snug">
                {taskTitle || 'Study Task'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 font-medium truncate mt-0.5 px-0.5 leading-normal">
              <span className="truncate">{topicTitle}</span>
              {isPaused && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300 border border-white/10 shrink-0">
                  Paused
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 border-l border-slate-700/80 pl-2 sm:pl-2.5">
            {/* Pause / Resume Button (Primary Blue) */}
            {isPaused ? (
              <button
                type="button"
                onClick={onResume}
                className="w-8 h-8 sm:w-8 sm:h-8 rounded-xl bg-[#176BFF] hover:bg-blue-600 text-white flex items-center justify-center font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                title="Resume Timer"
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className="w-8 h-8 sm:w-8 sm:h-8 rounded-xl bg-[#176BFF] hover:bg-blue-600 text-white flex items-center justify-center font-bold transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                title="Pause Timer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Stop & Log Session Button (Red Background) */}
            <button
              type="button"
              onClick={onStopAndLog}
              className="h-8 sm:h-8 px-2.5 sm:px-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap shrink-0"
              title="Stop & Log Session"
            >
              <Square className="w-3 h-3 fill-white shrink-0" />
              <span className="hidden sm:inline leading-none">Stop</span>
            </button>

            {/* Expand / Open Drawer Button */}
            <button
              type="button"
              onClick={onOpenDrawer}
              className="w-8 h-8 sm:w-8 sm:h-8 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Open Topic Details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
