import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  X,
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Target,
  BarChart2,
  AlertTriangle,
  Award,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
  Layers,
} from 'lucide-react';
import { StreakData } from '../utils/streakManager';
import { UserSettings } from '../types';

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  time: string;
  completedAt?: string;
  completedAtTime?: number;
  description?: string;
  priority?: 'high' | 'medium' | 'low' | 'none';
  dueDate?: string;
  timeSpentMinutes?: number;
  timeSpentSeconds?: number;
  confidence?: 'mastered' | 'high' | 'medium' | 'low' | 'none';
}

export interface Topic {
  id: string;
  title: string;
  section: string;
  expanded: boolean;
  isPinned?: boolean;
  tasks: TaskItem[];
  workspaceId: string;
  customColor?: string;
  customIcon?: string;
}

export interface WorkspaceWindow {
  id: string;
  name: string;
  isPinned?: boolean;
}

export interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: Topic[];
  workspaces: WorkspaceWindow[];
  streakData?: StreakData;
  userSettings?: UserSettings;
  onSelectTopic?: (topicId: string, workspaceId: string) => void;
}

type TabType = 'overview' | 'mastery' | 'focus' | 'badges';
type TimeFilterType = 'week' | 'month' | 'all';

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  topics,
  workspaces,
  streakData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('all');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Helper to parse dates safely from ISO or local format
  const parseTaskDate = (task: TaskItem): Date | null => {
    if (task.completedAt) {
      const d = new Date(task.completedAt);
      if (!isNaN(d.getTime())) return d;
    }
    if (task.completedAtTime) {
      const d = new Date(task.completedAtTime);
      if (!isNaN(d.getTime())) return d;
    }
    if (task.date) {
      // Handles DD/MM/YYYY or YYYY-MM-DD
      if (task.date.includes('/')) {
        const parts = task.date.split('/');
        if (parts.length === 3) {
          const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          if (!isNaN(d.getTime())) return d;
        }
      }
      const d = new Date(task.date);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  // Filter topics based on workspace filter
  const filteredTopics = useMemo(() => {
    if (selectedWorkspaceId === 'all') return topics;
    return topics.filter((t) => t.workspaceId === selectedWorkspaceId);
  }, [topics, selectedWorkspaceId]);

  // Flatten tasks with metadata
  const allTasksWithMeta = useMemo(() => {
    const list: Array<{
      task: TaskItem;
      topicTitle: string;
      topicId: string;
      sectionName: string;
      workspaceName: string;
      workspaceId: string;
    }> = [];

    filteredTopics.forEach((tp) => {
      const ws = workspaces.find((w) => w.id === tp.workspaceId);
      const wsName = ws?.name || 'Workspace';
      tp.tasks?.forEach((t) => {
        list.push({
          task: t,
          topicTitle: tp.title,
          topicId: tp.id,
          sectionName: tp.section || 'General',
          workspaceName: wsName,
          workspaceId: tp.workspaceId,
        });
      });
    });

    return list;
  }, [filteredTopics, workspaces]);

  // Filter tasks based on Time Range (This Week, This Month, All Time)
  const scopedTasks = useMemo(() => {
    if (timeFilter === 'all') return allTasksWithMeta;

    const now = new Date();
    const startOfScope = new Date();

    if (timeFilter === 'week') {
      // Last 7 days
      startOfScope.setDate(now.getDate() - 7);
      startOfScope.setHours(0, 0, 0, 0);
    } else if (timeFilter === 'month') {
      // Last 30 days
      startOfScope.setDate(now.getDate() - 30);
      startOfScope.setHours(0, 0, 0, 0);
    }

    return allTasksWithMeta.filter(({ task }) => {
      const taskDate = parseTaskDate(task);
      if (!taskDate) return true; // Keep if undated to avoid omitting
      return taskDate >= startOfScope;
    });
  }, [allTasksWithMeta, timeFilter]);

  // Core KPI Calculations
  const stats = useMemo(() => {
    const total = scopedTasks.length;
    const completedTasks = scopedTasks.filter((t) => t.task.completed);
    const completed = completedTasks.length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Total Study Time in Seconds
    let totalSeconds = 0;
    allTasksWithMeta.forEach(({ task }) => {
      if (task.timeSpentSeconds) {
        totalSeconds += task.timeSpentSeconds;
      } else if (task.timeSpentMinutes) {
        totalSeconds += task.timeSpentMinutes * 60;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const formattedStudyTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return {
      total,
      completed,
      pending,
      completionRate,
      totalSeconds,
      formattedStudyTime,
      hours,
      minutes,
    };
  }, [scopedTasks, allTasksWithMeta]);

  // 7-Day Activity Trend (Monday to Sunday)
  const weeklyActivity = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result: Array<{ day: string; fullDay: string; count: number; minutes: number; dateStr: string }> = [];

    const now = new Date();
    // Generate 7 days back from today
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const dayIndex = (targetDate.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
      const dayName = days[dayIndex];
      const dateStr = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Find tasks completed on this date
      let dayCompletedCount = 0;
      let dayMinutes = 0;

      allTasksWithMeta.forEach(({ task }) => {
        if (!task.completed) return;
        const d = parseTaskDate(task);
        if (d && d.toDateString() === targetDate.toDateString()) {
          dayCompletedCount++;
          const secs = task.timeSpentSeconds || (task.timeSpentMinutes || 0) * 60;
          dayMinutes += Math.round(secs / 60);
        }
      });

      result.push({
        day: dayName,
        fullDay: targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count: dayCompletedCount,
        minutes: dayMinutes,
        dateStr,
      });
    }

    const maxCount = Math.max(...result.map((r) => r.count), 1);
    return { data: result, maxCount };
  }, [allTasksWithMeta]);

  // 30-Day Contribution Heatmap Grid
  const heatmapData = useMemo(() => {
    const cells: Array<{ dateStr: string; count: number; intensity: number; isToday: boolean }> = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const dateStr = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isToday = targetDate.toDateString() === now.toDateString();

      let dayCount = 0;
      allTasksWithMeta.forEach(({ task }) => {
        if (!task.completed) return;
        const d = parseTaskDate(task);
        if (d && d.toDateString() === targetDate.toDateString()) {
          dayCount++;
        }
      });

      // Intensity level: 0 to 4
      let intensity = 0;
      if (dayCount >= 6) intensity = 4;
      else if (dayCount >= 4) intensity = 3;
      else if (dayCount >= 2) intensity = 2;
      else if (dayCount >= 1) intensity = 1;

      cells.push({ dateStr, count: dayCount, intensity, isToday });
    }

    return cells;
  }, [allTasksWithMeta]);

  // Recent Completed Tasks (Top 5)
  const recentCompletedTasks = useMemo(() => {
    const completedList = allTasksWithMeta.filter(({ task }) => task.completed);
    // Sort by completedAt descending
    completedList.sort((a, b) => {
      const da = parseTaskDate(a.task)?.getTime() || 0;
      const db = parseTaskDate(b.task)?.getTime() || 0;
      return db - da;
    });
    return completedList.slice(0, 5);
  }, [allTasksWithMeta]);

  // Subject/Workspace Mastery Breakdown
  const subjectMastery = useMemo(() => {
    return workspaces.map((ws) => {
      const wsTopics = topics.filter((t) => t.workspaceId === ws.id);
      let totalTasks = 0;
      let completedTasks = 0;
      let totalSeconds = 0;

      wsTopics.forEach((tp) => {
        tp.tasks?.forEach((t) => {
          totalTasks++;
          if (t.completed) completedTasks++;
          totalSeconds += t.timeSpentSeconds || (t.timeSpentMinutes || 0) * 60;
        });
      });

      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const mins = Math.round(totalSeconds / 60);

      return {
        id: ws.id,
        name: ws.name,
        totalTopics: wsTopics.length,
        totalTasks,
        completedTasks,
        percentage,
        studyTimeFormatted: mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`,
      };
    });
  }, [workspaces, topics]);

  // Stalled / Needs Attention Topics (Topics with < 50% completed and total >= 2)
  const needsAttentionTopics = useMemo(() => {
    const list: Array<{ topic: Topic; wsName: string; total: number; completed: number; rate: number }> = [];

    filteredTopics.forEach((tp) => {
      const total = tp.tasks?.length || 0;
      if (total === 0) return;
      const completed = tp.tasks?.filter((t) => t.completed).length || 0;
      const rate = Math.round((completed / total) * 100);

      if (rate < 50 && total >= 2) {
        const ws = workspaces.find((w) => w.id === tp.workspaceId);
        list.push({
          topic: tp,
          wsName: ws?.name || 'Workspace',
          total,
          completed,
          rate,
        });
      }
    });

    return list.slice(0, 4);
  }, [filteredTopics, workspaces]);

  // Mastered Topics (100% completed)
  const masteredTopicsList = useMemo(() => {
    return filteredTopics.filter((tp) => {
      const total = tp.tasks?.length || 0;
      if (total === 0) return false;
      const completed = tp.tasks?.filter((t) => t.completed).length || 0;
      return total === completed;
    });
  }, [filteredTopics]);

  // Priority Matrix
  const priorityStats = useMemo(() => {
    const priorities: Record<'high' | 'medium' | 'low' | 'none', { total: number; completed: number }> = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 },
      none: { total: 0, completed: 0 },
    };

    scopedTasks.forEach(({ task }) => {
      const p = task.priority || 'none';
      priorities[p].total++;
      if (task.completed) priorities[p].completed++;
    });

    return priorities;
  }, [scopedTasks]);

  // Peak Study Hours Quadrants (Morning, Afternoon, Evening, Night)
  const peakHoursData = useMemo(() => {
    const periods = {
      morning: { label: 'Morning (6 AM - 12 PM)', icon: Sunrise, count: 0, color: 'text-amber-500 bg-amber-50' },
      afternoon: { label: 'Afternoon (12 PM - 5 PM)', icon: Sun, count: 0, color: 'text-orange-500 bg-orange-50' },
      evening: { label: 'Evening (5 PM - 9 PM)', icon: Sunset, count: 0, color: 'text-indigo-500 bg-indigo-50' },
      night: { label: 'Night Owl (9 PM - 2 AM)', icon: Moon, count: 0, color: 'text-blue-500 bg-blue-50' },
    };

    let totalTimed = 0;
    allTasksWithMeta.forEach(({ task }) => {
      if (!task.completed) return;
      const d = parseTaskDate(task);
      if (!d) return;

      const hour = d.getHours();
      totalTimed++;
      if (hour >= 6 && hour < 12) periods.morning.count++;
      else if (hour >= 12 && hour < 17) periods.afternoon.count++;
      else if (hour >= 17 && hour < 21) periods.evening.count++;
      else periods.night.count++;
    });

    const entries = Object.entries(periods).map(([key, val]) => ({
      key,
      label: val.label,
      icon: val.icon,
      count: val.count,
      color: val.color,
      percentage: totalTimed > 0 ? Math.round((val.count / totalTimed) * 100) : 0,
    }));

    // Find top peak period
    const topPeak = [...entries].sort((a, b) => b.count - a.count)[0];

    return { entries, topPeak, totalTimed };
  }, [allTasksWithMeta]);

  // Milestone Badges Showcase
  const badgesList = useMemo(() => {
    const totalDone = allTasksWithMeta.filter((t) => t.task.completed).length;
    const currentStreak = streakData?.currentStreak || 0;
    const hasNightWork = peakHoursData.entries.find((e) => e.key === 'night')?.count || 0;
    const hasMorningWork = peakHoursData.entries.find((e) => e.key === 'morning')?.count || 0;
    const masteredCount = masteredTopicsList.length;

    return [
      {
        id: 'early-bird',
        title: 'Early Bird',
        desc: 'Completed morning study sessions',
        icon: '🌅',
        unlocked: hasMorningWork > 0,
        condition: 'Study before 12 PM',
      },
      {
        id: 'night-owl',
        title: 'Night Owl',
        desc: 'Late-night focus master',
        icon: '🌙',
        unlocked: hasNightWork > 0,
        condition: 'Study after 9 PM',
      },
      {
        id: 'streak-warrior',
        title: 'Streak Titan',
        desc: 'Maintained 7+ days consistent study streak',
        icon: '🔥',
        unlocked: currentStreak >= 7,
        condition: `${currentStreak}/7 days`,
      },
      {
        id: 'century-club',
        title: 'Century Club',
        desc: 'Completed 100 total study tasks',
        icon: '💯',
        unlocked: totalDone >= 100,
        condition: `${totalDone}/100 tasks`,
      },
      {
        id: 'speed-demon',
        title: 'Task Crusher',
        desc: 'Finished 5+ tasks in a single day',
        icon: '⚡',
        unlocked: weeklyActivity.maxCount >= 5,
        condition: '5 tasks in 1 day',
      },
      {
        id: 'mastery-champion',
        title: 'Topic Master',
        desc: '100% completed an entire study topic',
        icon: '🏆',
        unlocked: masteredCount > 0,
        condition: `${masteredCount} topics 100%`,
      },
    ];
  }, [allTasksWithMeta, streakData, peakHoursData, weeklyActivity, masteredTopicsList]);

  // Report Card Grade Calculation
  const reportGrade = useMemo(() => {
    const rate = stats.completionRate;
    if (rate >= 85) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', remark: 'Outstanding Focus & Execution! 🌟' };
    if (rate >= 70) return { grade: 'A', color: 'text-blue-600 bg-blue-50 border-blue-200', remark: 'Great Progress! Keep pushing. 🚀' };
    if (rate >= 50) return { grade: 'B', color: 'text-amber-600 bg-amber-50 border-amber-200', remark: 'Good Momentum. Aim for higher completion. ⚡' };
    return { grade: 'C', color: 'text-slate-600 bg-slate-50 border-slate-200', remark: 'Build daily consistency to level up! 🎯' };
  }, [stats.completionRate]);

  // Copy Summary Function
  const handleCopyReport = () => {
    const text = `📊 StudyFlow Performance Summary:\n• Total Study Time: ${stats.formattedStudyTime}\n• Tasks Completed: ${stats.completed}/${stats.total} (${stats.completionRate}%)\n• Streak: ${streakData?.currentStreak || 0} Days 🔥\n• Overall Grade: ${reportGrade.grade} (${reportGrade.remark})\nKeep crushing your goals! 🚀`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.1, ease: 'easeIn' } }}
        className="relative z-10 bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl flex flex-col gap-3.5 overflow-hidden max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#176BFF] shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#0F172A] leading-tight">StudyFlow Analytics</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100/70 text-[#176BFF]">
                  Insights
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Track your study patterns, velocity & mastery across workspaces
              </p>
            </div>
          </div>

          {/* Header Controls: Filters & Close */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Workspace Filter Dropdown */}
            <div className="relative flex items-center">
              <select
                aria-label="Filter by Workspace"
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none"
              >
                <option value="all">All Workspaces</option>
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              <button
                type="button"
                onClick={() => setTimeFilter('week')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  timeFilter === 'week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('month')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  timeFilter === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('all')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  timeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto shrink-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#176BFF] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mastery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'mastery'
                ? 'bg-[#176BFF] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subject Mastery</span>
            {needsAttentionTopics.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'focus'
                ? 'bg-[#176BFF] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Focus & Time</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'badges'
                ? 'bg-[#176BFF] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges & Report</span>
          </button>
        </div>

        {/* Modal Body Container with Scroll */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[calc(92vh-150px)]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* 4 Top KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Total Study Time */}
                <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Study Time</span>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">
                    {stats.formattedStudyTime}
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">Tracked via timer</p>
                </div>

                {/* 2. Tasks Completed */}
                <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Tasks Completed</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">
                    {stats.completed} <span className="text-xs font-bold text-slate-400">/ {stats.total}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.completionRate}%` }} />
                    </div>
                    <span className="text-[9.5px] font-bold text-emerald-600">{stats.completionRate}%</span>
                  </div>
                </div>

                {/* 3. Active Streak */}
                <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Active Streak</span>
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  </div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">
                    {streakData?.currentStreak || 0} <span className="text-xs font-bold text-slate-400">Days</span>
                  </div>
                  <p className="text-[10px] font-semibold text-orange-600 mt-0.5">
                    Best: {streakData?.bestStreak || 0} Days 🔥
                  </p>
                </div>

                {/* 4. Efficiency Score */}
                <div className="bg-[#FAFBFD] border border-[#E5EAF2] rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">Completion Mastery</span>
                    <Target className="w-4 h-4 text-[#176BFF]" />
                  </div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">
                    {stats.completionRate}%
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                    {stats.pending} remaining tasks
                  </p>
                </div>
              </div>

              {/* 2-Column Section: 7-Day Bar Chart & 30-Day Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {/* 7-Day Activity Trend Bar Chart */}
                <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">7-Day Study Activity</h4>
                      <p className="text-[10.5px] text-slate-400">Tasks completed per day</p>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-[#176BFF] rounded-md border border-blue-100">
                      Weekly Trend
                    </span>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-1 border-b border-slate-100">
                    {weeklyActivity.data.map((item, idx) => {
                      const heightPercent = weeklyActivity.maxCount > 0 ? Math.max((item.count / weeklyActivity.maxCount) * 100, 8) : 8;
                      const isToday = idx === weeklyActivity.data.length - 1;

                      return (
                        <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                          {/* Tooltip on hover */}
                          <div className="text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm">
                            {item.count} tasks
                          </div>

                          {/* Bar */}
                          <div className="w-full max-w-[28px] bg-slate-100 rounded-t-md relative overflow-hidden flex items-end h-full">
                            <div
                              className={`w-full rounded-t-md transition-all duration-500 ${
                                isToday
                                  ? 'bg-gradient-to-t from-[#176BFF] to-blue-400'
                                  : item.count > 0
                                  ? 'bg-[#176BFF]/80 group-hover:bg-[#176BFF]'
                                  : 'bg-slate-200/60'
                              }`}
                              style={{ height: `${item.count > 0 ? heightPercent : 6}%` }}
                            />
                          </div>

                          {/* Day Label */}
                          <span
                            className={`text-[10px] font-bold ${
                              isToday ? 'text-[#176BFF] font-extrabold' : 'text-slate-500'
                            }`}
                          >
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 30-Day Contribution Heatmap Grid */}
                <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">30-Day Activity Heatmap</h4>
                      <p className="text-[10.5px] text-slate-400">Consistency & study intensity</p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400">
                      <span>Less</span>
                      <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 border border-slate-200/50" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-blue-200" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-blue-400" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#176BFF]" />
                      <span>More</span>
                    </div>
                  </div>

                  {/* 30 Boxes Heatmap Grid */}
                  <div className="grid grid-cols-10 gap-1.5 p-2 bg-slate-50/80 rounded-xl border border-slate-100">
                    {heatmapData.map((cell) => {
                      const bgClasses = [
                        'bg-white border border-slate-200/60 text-slate-300',
                        'bg-blue-100 text-blue-700 font-bold',
                        'bg-blue-300 text-blue-900 font-bold',
                        'bg-blue-500 text-white font-bold',
                        'bg-[#176BFF] text-white font-black shadow-2xs',
                      ];

                      return (
                        <div
                          key={cell.dateStr}
                          title={`${cell.dateStr}: ${cell.count} tasks completed`}
                          className={`aspect-square rounded-md flex items-center justify-center text-[8.5px] transition-transform hover:scale-110 cursor-pointer ${
                            bgClasses[cell.intensity]
                          } ${cell.isToday ? 'ring-1.5 ring-offset-1 ring-[#176BFF]' : ''}`}
                        >
                          {cell.count > 0 ? cell.count : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Completed Tasks Stream */}
              <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 shadow-2xs">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Recent Completed Tasks</span>
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Showing latest {recentCompletedTasks.length}
                  </span>
                </div>

                {recentCompletedTasks.length > 0 ? (
                  <div className="space-y-1.5">
                    {recentCompletedTasks.map(({ task, topicTitle, workspaceName }) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50/90 hover:bg-slate-100/90 transition-colors border border-slate-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{task.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">
                              {workspaceName} <span className="text-slate-300">/</span> {topicTitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {task.priority && task.priority !== 'none' && (
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                                task.priority === 'high'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                  : task.priority === 'medium'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                  : 'bg-blue-50 text-blue-600 border border-blue-200'
                              }`}
                            >
                              {task.priority}
                            </span>
                          )}
                          <span className="text-[10px] font-medium text-slate-400">
                            {task.time || task.date || 'Completed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No completed tasks yet. Check off a task to see your live activity stream! 🚀
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECT MASTERY */}
          {activeTab === 'mastery' && (
            <div className="space-y-4">
              {/* Workspace Progress Grid */}
              <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#176BFF]" />
                  <span>Workspace & Subject Distribution</span>
                </h4>

                <div className="space-y-3">
                  {subjectMastery.map((ws) => (
                    <div key={ws.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800">{ws.name}</span>
                          <span className="text-[10px] font-medium text-slate-400">
                            ({ws.completedTasks}/{ws.totalTasks} Tasks · {ws.studyTimeFormatted})
                          </span>
                        </div>
                        <span className="text-[#176BFF] font-black">{ws.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#176BFF] h-full rounded-full transition-all duration-700"
                          style={{ width: `${ws.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {subjectMastery.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No workspaces found. Create a workspace to track subject mastery!
                    </div>
                  )}
                </div>
              </div>

              {/* 2-Column: Needs Attention vs Priority Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                {/* Needs Attention Topics */}
                <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>Needs Attention (Low Progress)</span>
                    </h4>
                    <span className="text-[9.5px] font-extrabold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                      Alert
                    </span>
                  </div>

                  {needsAttentionTopics.length > 0 ? (
                    <div className="space-y-2">
                      {needsAttentionTopics.map((item) => (
                        <div
                          key={item.topic.id}
                          className="p-2.5 rounded-lg bg-amber-50/40 border border-amber-100 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.topic.title}</p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {item.wsName} · {item.completed}/{item.total} Done
                            </p>
                          </div>
                          <span className="text-xs font-black text-amber-600">{item.rate}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      🎉 Great job! No subjects falling behind.
                    </div>
                  )}
                </div>

                {/* Priority Matrix */}
                <div className="bg-white border border-[#E5EAF2] rounded-xl p-3.5 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#176BFF]" />
                    <span>Priority Completion Breakdown</span>
                  </h4>

                  <div className="space-y-2.5">
                    {/* High Priority */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-rose-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500" /> High Priority
                        </span>
                        <span className="text-[11px] font-bold text-slate-700">
                          {priorityStats.high.completed}/{priorityStats.high.total} Done (
                          {priorityStats.high.total > 0
                            ? Math.round((priorityStats.high.completed / priorityStats.high.total) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{
                            width: `${
                              priorityStats.high.total > 0
                                ? (priorityStats.high.completed / priorityStats.high.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Medium Priority */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium Priority
                        </span>
                        <span className="text-[11px] font-bold text-slate-700">
                          {priorityStats.medium.completed}/{priorityStats.medium.total} Done (
                          {priorityStats.medium.total > 0
                            ? Math.round((priorityStats.medium.completed / priorityStats.medium.total) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{
                            width: `${
                              priorityStats.medium.total > 0
                                ? (priorityStats.medium.completed / priorityStats.medium.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Low Priority */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-blue-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500" /> Low Priority
                        </span>
                        <span className="text-[11px] font-bold text-slate-700">
                          {priorityStats.low.completed}/{priorityStats.low.total} Done (
                          {priorityStats.low.total > 0
                            ? Math.round((priorityStats.low.completed / priorityStats.low.total) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{
                            width: `${
                              priorityStats.low.total > 0
                                ? (priorityStats.low.completed / priorityStats.low.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 100% Mastered Topics Shelf */}
              {masteredTopicsList.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-200/70 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-amber-900">
                      100% Completed Mastered Topics ({masteredTopicsList.length})
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {masteredTopicsList.map((tp) => (
                      <span
                        key={tp.id}
                        className="text-[11px] font-bold bg-white/90 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <span>✨</span>
                        <span>{tp.title}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FOCUS & TIME */}
          {activeTab === 'focus' && (
            <div className="space-y-4">
              {/* Peak Productivity Quadrants */}
              <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Peak Productivity Hours</h4>
                    <p className="text-[10.5px] text-slate-400">When you complete the most study tasks</p>
                  </div>
                  {peakHoursData.topPeak && peakHoursData.topPeak.count > 0 && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#176BFF] border border-blue-100 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Peak: {peakHoursData.topPeak.label.split(' ')[0]}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {peakHoursData.entries.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.key}
                        className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.label}</p>
                            <p className="text-[10.5px] text-slate-400 font-medium">
                              {item.count} tasks completed
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-700">{item.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Productivity Tip Card */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#176BFF] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 leading-tight">Focus & Velocity Pro-Tip</h4>
                  <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
                    Use the <strong>Floating Study Timer</strong> for structured 25-minute sprints. Regularly completing high-priority tasks in your peak energy hours boosts memory retention by up to 40%!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BADGES & REPORT CARD */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              {/* Milestone Badges Shelf */}
              <div className="bg-white border border-[#E5EAF2] rounded-xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Milestone & Habit Badges</h4>
                    <p className="text-[10.5px] text-slate-400">Unlock awards by maintaining study streaks</p>
                  </div>
                  <span className="text-[10.5px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {badgesList.filter((b) => b.unlocked).length} / {badgesList.length} Unlocked
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {badgesList.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center relative ${
                        badge.unlocked
                          ? 'bg-gradient-to-b from-white to-amber-50/30 border-amber-200 shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200/60 opacity-60 grayscale'
                      }`}
                    >
                      {badge.unlocked && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black">
                          ✓
                        </span>
                      )}
                      <span className="text-2xl mb-1">{badge.icon}</span>
                      <span className="text-xs font-bold text-slate-900">{badge.title}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{badge.desc}</span>
                      <span className="text-[9px] font-extrabold uppercase mt-2 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {badge.condition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Performance Report Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-700 relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase text-blue-400">
                      StudyFlow Performance Card
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-0.5">Weekly Report & Grade</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">{reportGrade.remark}</p>
                  </div>

                  {/* Letter Grade Stamp */}
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center backdrop-blur-md shrink-0 shadow-lg">
                    <span className="text-2xl font-black text-amber-400 leading-none">{reportGrade.grade}</span>
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Grade</span>
                  </div>
                </div>

                {/* Report Card Metrics */}
                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-700/80 relative z-10 text-center">
                  <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Study Hours</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{stats.formattedStudyTime}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Tasks Done</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">{stats.completed}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Streak</span>
                    <span className="text-sm font-bold text-orange-400 mt-0.5 block">
                      {streakData?.currentStreak || 0}d 🔥
                    </span>
                  </div>
                </div>

                {/* Share / Copy Summary Action */}
                <div className="flex justify-end relative z-10">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                  >
                    {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReport ? 'Copied to Clipboard!' : 'Share / Copy Report'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-1 pt-3 border-t border-[#E9EDF3] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px]">Esc</kbd> to close
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-[#176BFF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
