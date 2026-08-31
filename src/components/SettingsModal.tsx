import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Settings,
  Check,
  Target,
  Bell,
  RefreshCw,
  Sliders,
  Palette,
  HardDrive,
  Keyboard,
  Info,
  Download,
  Upload,
  Trash2,
  Sparkles,
  PartyPopper,
  Volume2,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Flag,
  ChevronDown,
  Clock,
  Plus,
  Minus,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { UserSettings } from '../types';
import { TimeWheelPicker } from './TimeWheelPicker';
import { ThemeMode, PrimaryAccentColor, applyTheme, applyAccentColor } from '../utils/themeManager';

interface SettingsModalProps {
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  onClose: () => void;
  onExportJSON?: () => void;
  onImportTrigger?: () => void;
}

type SettingsTab = 'general' | 'appearance' | 'data' | 'shortcuts' | 'about';

const TASK_PRIORITY_OPTIONS: {
  value: 'high' | 'medium' | 'low' | 'none';
  label: string;
  color: string;
  fill: string;
  bg: string;
}[] = [
  { value: 'high', label: 'High', color: 'text-[#F43F5E]', fill: 'fill-[#F43F5E]', bg: 'bg-[#FFF5F5]' },
  { value: 'medium', label: 'Medium', color: 'text-[#D97706]', fill: 'fill-[#D97706]', bg: 'bg-[#FFFBEB]' },
  { value: 'low', label: 'Low', color: 'text-[#16A34A]', fill: 'fill-[#16A34A]', bg: 'bg-[#F0FDF4]' },
  { value: 'none', label: 'None', color: 'text-slate-600', fill: 'fill-none', bg: 'bg-slate-50' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSaveSettings,
  onClose,
  onExportJSON,
  onImportTrigger,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Form states
  const [dailyTarget, setDailyTarget] = useState(settings.dailyTarget || 10);
  const [dailyGoalMode, setDailyGoalMode] = useState<'tasks' | 'time'>(settings.dailyGoalMode || 'tasks');
  const [dailyTimeTargetMinutes, setDailyTimeTargetMinutes] = useState(settings.dailyTimeTargetMinutes || 120);
  const [autoSync, setAutoSync] = useState(settings.autoSync ?? true);
  const [soundEffects, setSoundEffects] = useState(settings.soundEffects ?? true);

  // Additional pro preferences
  const [confettiCelebration, setConfettiCelebration] = useState(settings.confettiCelebration ?? true);
  const [defaultTaskPriority, setDefaultTaskPriority] = useState<'high' | 'medium' | 'low' | 'none'>(settings.defaultTaskPriority || 'none');
  const [focusCheckIntervalMinutes, setFocusCheckIntervalMinutes] = useState<number>(settings.focusCheckIntervalMinutes || 20);
  const [focusCheckIntervalEnabled, setFocusCheckIntervalEnabled] = useState<boolean>(settings.focusCheckIntervalEnabled ?? true);
  const [isPrioritySelectOpen, setIsPrioritySelectOpen] = useState(false);
  const prioritySelectRef = useRef<HTMLDivElement>(null);
  const dailyTargetInputRef = useRef<HTMLInputElement>(null);
  const taskStepperContainerRef = useRef<HTMLDivElement>(null);
  const [defaultTopicPriority, setDefaultTopicPriority] = useState('Medium');
  const [autoCleanTrashDays, setAutoCleanTrashDays] = useState('30');

  // Smooth mouse wheel listener to adjust daily task target cleanly by 1 step, and prevent page scrolling
  useEffect(() => {
    const el = taskStepperContainerRef.current;
    if (!el || dailyGoalMode !== 'tasks') return;

    let accumulatedDelta = 0;
    let wheelTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      accumulatedDelta += e.deltaY;
      if (Math.abs(accumulatedDelta) >= 20) {
        if (accumulatedDelta < 0) {
          setDailyTarget(prev => Math.min(100, prev + 1));
        } else {
          setDailyTarget(prev => Math.max(1, prev - 1));
        }
        accumulatedDelta = 0;
      }

      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        accumulatedDelta = 0;
      }, 100);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [dailyGoalMode]);

  // Storage calculation
  const [storageUsedKb, setStorageUsedKb] = useState<number>(0);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');

  // Theme state with instant preview support
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (settings.theme === 'dark' || settings.theme === 'light' || settings.theme === 'system') {
      return settings.theme;
    }
    return settings.darkMode ? 'dark' : 'light';
  });

  // Primary Accent Color state with instant preview support
  const [primaryColor, setPrimaryColor] = useState<PrimaryAccentColor>(settings.primaryColor || 'blue');

  // Sync external setting changes (e.g., from Sidebar Quick Picker) to local state
  useEffect(() => {
    if (settings.primaryColor) {
      setPrimaryColor(settings.primaryColor);
    }
    const nextTheme = settings.theme || (settings.darkMode ? 'dark' : 'light');
    setTheme(nextTheme);
  }, [settings.primaryColor, settings.theme, settings.darkMode]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    applyTheme(newTheme, primaryColor);
  };

  const handleAccentColorChange = (newAccent: PrimaryAccentColor) => {
    setPrimaryColor(newAccent);
    applyAccentColor(newAccent);
  };

  const handleClose = () => {
    // Revert live preview if closed without saving
    applyTheme(settings.theme || (settings.darkMode ? 'dark' : 'light'), settings.primaryColor || 'blue');
    onClose();
  };

  const handleSave = () => {
    applyTheme(theme, primaryColor);
    onSaveSettings({
      ...settings,
      dailyTarget,
      dailyGoalMode,
      dailyTimeTargetMinutes,
      autoSync,
      soundEffects,
      confettiCelebration,
      defaultTaskPriority,
      focusCheckIntervalMinutes,
      focusCheckIntervalEnabled,
      theme,
      primaryColor,
      darkMode: theme === 'dark',
    });
    onClose();
  };

  const handleFactoryReset = () => {
    if (resetConfirmInput.trim().toUpperCase() === 'RESET') {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Storage', icon: HardDrive },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs cursor-pointer"
        onClick={handleClose}
      />

      {/* Main Settings Modal Container: Fullscreen on Mobile / Card on Desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, scale: 0.96, y: 6, transition: { duration: 0.15, ease: 'easeIn' } }}
        className="relative z-10 bg-white dark:bg-slate-900 border-0 sm:border border-[#E2E8F0] dark:border-slate-800 rounded-none sm:rounded-2xl shadow-2xl w-full max-w-3xl h-full sm:h-[560px] sm:max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Top Header */}
        <div className="h-14 sm:h-[60px] px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-[#FAFBFD] dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0">
              <Settings className="w-4 h-4 shrink-0" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">Preferences</h3>
              <p className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-400 font-medium truncate">Manage your workspace settings & productivity defaults</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
            title="Close"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Body (Sidebar Tabs + Content Area) */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden bg-white dark:bg-slate-900">
          {/* Left Category Navigation */}
          <div className="w-full sm:w-48 sm:border-r border-b sm:border-b-0 border-slate-100 dark:border-slate-800 bg-[#F8FAFC]/70 dark:bg-slate-950/40 p-1.5 sm:p-3 flex sm:flex-col gap-1 shrink-0 overflow-x-auto sm:overflow-x-visible no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap outline-none focus:outline-none border shrink-0 sm:shrink sm:w-full ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-xs border-slate-200/90 dark:border-slate-700 font-bold'
                      : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            <AnimatePresence mode="wait">
              {/* TAB 1: GENERAL */}
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Daily Goals & Focus</h4>
                    
                    {/* Daily Target Mode & Stepper Card */}
                    <motion.div
                      layout
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="p-3.5 bg-[#FAFBFD] border border-slate-200/80 rounded-xl space-y-3 overflow-hidden"
                    >
                      {/* Mode Selector Tabs */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Goal Tracking Mode</span>
                          <span className="text-[11px] text-slate-400">Choose how you want to track today's focus</span>
                        </div>
                        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60 shrink-0">
                          <button
                            type="button"
                            onClick={() => setDailyGoalMode('tasks')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              dailyGoalMode === 'tasks'
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>Tasks</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDailyGoalMode('time')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              dailyGoalMode === 'time'
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Time</span>
                          </button>
                        </div>
                      </div>

                      {dailyGoalMode === 'tasks' ? (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                                <span>Daily Task Goal</span>
                              </div>
                              <p className="hidden sm:block text-[11px] text-slate-400 mt-0.5">
                                Target count for global <span className="font-semibold text-slate-600">Today's Goal</span> tracker
                              </p>
                            </div>

                            {/* Thicker Bolder Stepper Pill for Tasks */}
                            <div ref={taskStepperContainerRef} className="inline-flex items-center justify-between sm:justify-center self-start sm:self-auto bg-white border border-slate-200/90 rounded-xl p-1 shadow-xs w-full sm:w-auto">
                              <button
                                type="button"
                                onClick={() => setDailyTarget(prev => Math.max(1, prev - 1))}
                                className="w-8 h-8 sm:w-7.5 sm:h-7.5 rounded-lg bg-slate-100 hover:bg-slate-200/90 active:scale-95 text-slate-800 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer select-none shadow-2xs"
                                title="Decrease Goal"
                              >
                                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>

                              <div className="flex items-center justify-center px-2 min-w-[48px] cursor-text">
                                <input
                                  ref={dailyTargetInputRef}
                                  id="daily-target-input"
                                  type="search"
                                  inputMode="numeric"
                                  enterKeyHint="done"
                                  autoComplete="one-time-code"
                                  autoCorrect="off"
                                  autoCapitalize="off"
                                  spellCheck={false}
                                  aria-autocomplete="none"
                                  data-form-type="other"
                                  data-lpignore="true"
                                  data-1p-ignore="true"
                                  data-bwignore="true"
                                  className="w-10 text-center font-sans text-sm font-black text-slate-900 bg-transparent focus:outline-none tabular-nums cursor-text select-all [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                                  value={dailyTarget}
                                  onFocus={(e) => e.target.select()}
                                  onClick={(e) => (e.target as HTMLInputElement).select()}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, '');
                                    setDailyTarget(raw === '' ? 1 : Math.min(100, Math.max(1, parseInt(raw, 10))));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                      setDailyTarget(prev => Math.min(100, prev + 1));
                                      setTimeout(() => (e.target as HTMLInputElement).select(), 0);
                                    } else if (e.key === 'ArrowDown') {
                                      e.preventDefault();
                                      setDailyTarget(prev => Math.max(1, prev - 1));
                                      setTimeout(() => (e.target as HTMLInputElement).select(), 0);
                                    } else if (e.key === 'Enter') {
                                      e.preventDefault();
                                      (e.target as HTMLInputElement).blur();
                                    }
                                  }}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => setDailyTarget(prev => Math.min(100, prev + 1))}
                                className="w-8 h-8 sm:w-7.5 sm:h-7.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer select-none"
                                title="Increase Goal"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Presets for Tasks */}
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <div className="text-[11px] font-semibold text-slate-400">
                              Quick Presets:
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                              {[5, 10, 15, 20, 25].map(count => {
                                const isSelected = dailyTarget === count;
                                return (
                                  <button
                                    key={count}
                                    type="button"
                                    onClick={() => setDailyTarget(count)}
                                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center select-none border whitespace-nowrap active:scale-95 flex items-center justify-center gap-1 ${
                                      isSelected
                                        ? 'bg-blue-50 text-[#2563EB] border-blue-200 font-extrabold shadow-2xs'
                                        : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                  >
                                    <span>{count} Tasks</span>
                                  </button>
                                );
                              })}
                              {(() => {
                                const isCustom = ![5, 10, 15, 20, 25].includes(dailyTarget);
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const inputEl = document.getElementById('daily-target-input') as HTMLInputElement | null;
                                      if (inputEl) {
                                        inputEl.focus();
                                        inputEl.select();
                                      }
                                    }}
                                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center select-none border whitespace-nowrap active:scale-95 flex items-center justify-center gap-1 ${
                                      isCustom
                                        ? 'bg-blue-50 text-[#2563EB] border-blue-200 font-extrabold shadow-2xs'
                                        : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                  >
                                    <span>Custom</span>
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        </>
                      ) : (
                        <TimeWheelPicker
                          totalMinutes={dailyTimeTargetMinutes}
                          onChange={setDailyTimeTargetMinutes}
                        />
                      )}
                    </motion.div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Feedback & Celebrations</h4>

                    <div className="space-y-2">
                      {/* Confetti Celebration */}
                      <div className="flex items-center justify-between py-2.5 px-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300/80 transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs text-[15px] select-none leading-none">
                            🎉
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 leading-tight">Task Completion Confetti</div>
                            <div className="hidden sm:block text-[11px] text-slate-400">Celebration fireworks when topic completes</div>
                          </div>
                        </div>
                        {/* iOS Smooth Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => setConfettiCelebration(prev => !prev)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 focus:outline-none shrink-0 ${
                            confettiCelebration ? 'bg-[#2563EB]' : 'bg-slate-200'
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`bg-white w-4 h-4 rounded-full shadow-xs transform ${
                              confettiCelebration ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Sound Effects */}
                      <div className="flex items-center justify-between py-2.5 px-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300/80 transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                            <Volume2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 leading-tight">Interactive Sound Effects</div>
                            <div className="hidden sm:block text-[11px] text-slate-400">Subtle audio feedback on task completion</div>
                          </div>
                        </div>
                        {/* iOS Smooth Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => setSoundEffects(prev => !prev)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 focus:outline-none shrink-0 ${
                            soundEffects ? 'bg-[#2563EB]' : 'bg-slate-200'
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`bg-white w-4 h-4 rounded-full shadow-xs transform ${
                              soundEffects ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      {/* Check-in Alert Interval */}
                      <div className="py-2.5 px-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300/80 transition-all space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 leading-tight">Focus Check-in Interval</div>
                              <div className="text-[11px] text-slate-400">Milestone alert interval during active study timer</div>
                            </div>
                          </div>
                          {/* iOS Smooth Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => setFocusCheckIntervalEnabled((prev) => !prev)}
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 focus:outline-none shrink-0 ${
                              focusCheckIntervalEnabled ? 'bg-[#2563EB]' : 'bg-slate-200'
                            }`}
                          >
                            <motion.div
                              layout
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className={`bg-white w-4 h-4 rounded-full shadow-xs transform ${
                                focusCheckIntervalEnabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Butter-smooth 60fps CSS Grid Accordion Collapse/Expand */}
                        <div
                          className={`grid transition-all duration-200 ease-out ${
                            focusCheckIntervalEnabled ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-2 border-t border-slate-100 mt-0.5">
                              {[
                                { label: '2m', val: 2 },
                                { label: '10m', val: 10 },
                                { label: '15m', val: 15 },
                                { label: '20m', val: 20 },
                                { label: '25m', val: 25 },
                                { label: '30m', val: 30 },
                                { label: '45m', val: 45 },
                                { label: '60m', val: 60 },
                              ].map((opt) => {
                                const isSelected = focusCheckIntervalMinutes === opt.val;
                                return (
                                  <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => setFocusCheckIntervalMinutes(opt.val)}
                                    className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center select-none ${
                                      isSelected
                                        ? 'bg-[#2563EB] text-white shadow-xs'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Topic & Task Defaults</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Default Task Priority (Active & Functional) */}
                      <div className="p-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300/80 transition-all relative">
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">Default Task Priority</label>
                        <div ref={prioritySelectRef} className="relative">
                          <button
                            type="button"
                            onClick={() => setIsPrioritySelectOpen(!isPrioritySelectOpen)}
                            className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {(() => {
                                const current = TASK_PRIORITY_OPTIONS.find(p => p.value === defaultTaskPriority) || TASK_PRIORITY_OPTIONS[3];
                                return (
                                  <>
                                    <Flag className={`w-3.5 h-3.5 ${current.color} ${current.fill}`} />
                                    <span className="font-semibold text-slate-800">{current.label}</span>
                                  </>
                                );
                              })()}
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isPrioritySelectOpen ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isPrioritySelectOpen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.12 }}
                                className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200/90 rounded-xl shadow-xl p-1 z-50 space-y-0.5"
                              >
                                {TASK_PRIORITY_OPTIONS.map((opt) => {
                                  const isSelected = defaultTaskPriority === opt.value;
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setDefaultTaskPriority(opt.value);
                                        setIsPrioritySelectOpen(false);
                                      }}
                                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                                        isSelected ? `${opt.bg} ${opt.color} font-bold` : 'text-slate-700 hover:bg-slate-50'
                                      }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <Flag className={`w-3.5 h-3.5 ${opt.color} ${opt.fill}`} />
                                        <span>{opt.label}</span>
                                      </span>
                                      {isSelected && <Check className={`w-3.5 h-3.5 stroke-[2.5] ${opt.color}`} />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Default Topic Priority (Dummy Option) */}
                      <div className="p-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300/80 transition-all">
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">Default Topic Priority</label>
                        <select
                          value={defaultTopicPriority}
                          onChange={(e) => setDefaultTopicPriority(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                        >
                          <option value="Low">Low Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="High">High Priority</option>
                          <option value="Urgent">Urgent 🔥</option>
                        </select>
                      </div>

                      {/* Auto-clean Trash */}
                      <div className="p-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300/80 transition-all sm:col-span-2">
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">Auto-clean Trash</label>
                        <select
                          value={autoCleanTrashDays}
                          onChange={(e) => setAutoCleanTrashDays(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#FAFBFD] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                        >
                          <option value="7">After 7 Days</option>
                          <option value="15">After 15 Days</option>
                          <option value="30">After 30 Days (Recommended)</option>
                          <option value="never">Never (Manual Only)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: APPEARANCE (THEME & DARK MODE) */}
              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {/* Appearance (3 Mode Cards: Light, Dark, System) */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                      Appearance
                    </h4>

                    {/* 3 Theme Mode Cards (Slim, Compact & Side-by-Side 3 Column Grid) */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        {
                          id: 'light',
                          label: 'Light',
                          icon: Sun,
                        },
                        {
                          id: 'dark',
                          label: 'Dark',
                          icon: Moon,
                        },
                        {
                          id: 'system',
                          label: 'System',
                          icon: Monitor,
                        },
                      ].map((opt) => {
                        const isSelected = theme === opt.id;
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleThemeChange(opt.id as any)}
                            className={`relative p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2 group ${
                              isSelected
                                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-xs'
                                : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-2xs">
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            )}

                            {/* Black & White Monochrome Icon Container */}
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                              isSelected
                                ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 text-slate-900 dark:text-white shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700/90 text-slate-800 dark:text-slate-200'
                            }`}>
                              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                            </div>

                            <div className="text-[11.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 truncate w-full">
                              {opt.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accent Color (3 Color Swatch Cards: Blue, Purple, Cyan) */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                      Accent Color
                    </h4>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5">
                      {[
                        {
                          id: 'blue',
                          label: 'Blue',
                          color: '#2563EB',
                          borderClass: 'border-[#2563EB]',
                          ringClass: 'ring-[#2563EB]/20',
                        },
                        {
                          id: 'purple',
                          label: 'Purple',
                          color: '#8B5CF6',
                          borderClass: 'border-[#8B5CF6]',
                          ringClass: 'ring-[#8B5CF6]/20',
                        },
                        {
                          id: 'green',
                          label: 'Green',
                          color: '#10B981',
                          borderClass: 'border-[#10B981]',
                          ringClass: 'ring-[#10B981]/20',
                        },
                        {
                          id: 'orange',
                          label: 'Orange',
                          color: '#EA580C',
                          borderClass: 'border-[#EA580C]',
                          ringClass: 'ring-[#EA580C]/20',
                        },
                        {
                          id: 'pink',
                          label: 'Pink',
                          color: '#F43F5E',
                          borderClass: 'border-[#F43F5E]',
                          ringClass: 'ring-[#F43F5E]/20',
                        },
                        {
                          id: 'cyan',
                          label: 'Cyan',
                          color: '#06B6D4',
                          borderClass: 'border-[#06B6D4]',
                          ringClass: 'ring-[#06B6D4]/20',
                        },
                        {
                          id: 'amber',
                          label: 'Amber',
                          color: '#F59E0B',
                          borderClass: 'border-[#F59E0B]',
                          ringClass: 'ring-[#F59E0B]/20',
                        },
                      ].map((opt) => {
                        const isSelected = primaryColor === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleAccentColorChange(opt.id as any)}
                            className={`relative p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2 group ${
                              isSelected
                                ? `bg-blue-50/50 dark:bg-slate-800/80 ${opt.borderClass} ring-2 ${opt.ringClass} shadow-xs`
                                : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {isSelected && (
                              <div
                                style={{ backgroundColor: opt.color }}
                                className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full text-white flex items-center justify-center shadow-2xs"
                              >
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            )}

                            {/* Color Circle Swatch */}
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center p-0.5 border border-slate-200/80 dark:border-slate-700 group-hover:scale-105 transition-transform shadow-2xs">
                              <div
                                style={{ backgroundColor: opt.color }}
                                className="w-full h-full rounded-full"
                              />
                            </div>

                            <div className="text-[11.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 truncate w-full">
                              {opt.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visual Preferences Information */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                      Typography & Fonts
                    </h4>

                    <div className="p-3.5 bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Interface Typography Font</div>
                        <div className="text-[11px] text-slate-400">Noto Serif Bengali + Inter Sans</div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 border border-slate-200 dark:border-slate-600 rounded-lg">
                        Noto Serif Bengali
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: DATA & STORAGE */}
              {activeTab === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Storage & Local Database</h4>

                    {/* Storage Meter */}
                    <div className="p-4 bg-[#FAFBFD] border border-slate-200/80 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-[#2563EB]" />
                          <span className="text-xs font-bold text-slate-800">Local Browser Storage Usage</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 border border-slate-200 rounded-lg shadow-2xs">
                          {storageUsedKb} KB / 5,000 KB (5 MB Max)
                        </span>
                      </div>

                      <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(2, (storageUsedKb / 5000) * 100))}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        All your workspaces, topics, and tasks are safely stored locally in your browser with zero latency.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Backups & Data Portability</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (onExportJSON) {
                            onExportJSON();
                          }
                        }}
                        className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 rounded-xl text-left transition-all duration-150 cursor-pointer group flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Download className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                            Export Backup (.json)
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Download full snapshot of your workspaces</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onImportTrigger) {
                            onImportTrigger();
                          }
                        }}
                        className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 rounded-xl text-left transition-all duration-150 cursor-pointer group flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Import Backup (.json)
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Restore data from a saved backup file</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-3">Danger Zone</h4>

                    {!isResetConfirmOpen ? (
                      <div className="p-3.5 bg-red-50/50 dark:bg-rose-950/30 border border-red-200/80 dark:border-rose-900/50 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-red-950 dark:text-rose-200">Factory Reset StudyFlow</div>
                          <div className="text-[11px] text-red-700/80 dark:text-rose-300/80">Erase all local workspaces, tasks, and settings</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsResetConfirmOpen(true)}
                          className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-red-300 dark:border-rose-800 text-red-600 dark:text-rose-400 font-bold text-xs rounded-lg hover:bg-red-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer shadow-2xs"
                        >
                          Clear All Data
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 dark:bg-rose-950/40 border border-red-300 dark:border-rose-900/80 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-rose-300">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Type "RESET" to confirm complete data deletion</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Type RESET"
                            value={resetConfirmInput}
                            onChange={(e) => setResetConfirmInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-red-300 dark:border-rose-800 rounded-lg text-xs font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                          <button
                            type="button"
                            onClick={handleFactoryReset}
                            disabled={resetConfirmInput.trim().toUpperCase() !== 'RESET'}
                            className="px-3.5 py-1.5 bg-red-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            Confirm Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsResetConfirmOpen(false);
                              setResetConfirmInput('');
                            }}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: KEYBOARD SHORTCUTS */}
              {activeTab === 'shortcuts' && (
                <motion.div
                  key="shortcuts"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Navigation Hotkeys</h4>

                    <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                      {[
                        { label: 'Global Search Topics & Tasks', keys: ['Ctrl', 'K'] },
                        { label: 'Create New Task under active topic', keys: ['Ctrl', 'N'] },
                        { label: 'Toggle Sidebar Collapse/Expand', keys: ['Ctrl', 'B'] },
                        { label: 'Open Daily Progress View', keys: ['Ctrl', 'G'] },
                        { label: 'Close Active Modal or Drawer', keys: ['Esc'] },
                        { label: 'Add New Workspace', keys: ['Ctrl', 'Shift', 'W'] },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                          <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                          <div className="flex items-center gap-1.5">
                            {item.keys.map((k, kidx) => (
                              <kbd
                                key={kidx}
                                className="px-2 py-0.5 bg-slate-100 border border-slate-200/90 rounded-[6px] text-[11px] font-bold text-slate-700 shadow-2xs font-mono"
                              >
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: ABOUT & CREDITS */}
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-4">
                    <div className="preserve-color relative w-11 h-11 flex items-center justify-center shrink-0">
                      <div className="absolute top-0 left-0 w-8 h-8 bg-[#2563EB] rounded-[7px]"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[7px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">Study Flow Pro</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Version 4.2.0 (Build 2026.08)</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/70 mt-1.5">
                        <ShieldCheck className="w-3 h-3" /> PWA & Offline Storage Active
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-2 text-xs text-slate-600 leading-relaxed font-medium">
                    <p>
                      <strong>Study Flow</strong> is an advanced, focused workspace management suite designed for students, researchers, and productivity enthusiasts.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Crafted with modern React, Tailwind CSS, Framer Motion, and Noto Serif Bengali typography.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-[#FAFBFD] dark:bg-slate-900/90 flex items-center justify-end sm:justify-between shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>Changes autosave to browser session</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-sm shadow-blue-500/25 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
