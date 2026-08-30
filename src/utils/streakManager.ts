export interface StreakMilestone {
  days: number;
  title: string;
  badge: string;
  description: string;
  icon: string;
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: 'Flame Starter', badge: 'Bronze', description: '3 days of consistent study', icon: '🔥' },
  { days: 7, title: '1-Week Warrior', badge: 'Silver', description: '7 days streak milestone', icon: '⚔️' },
  { days: 14, title: 'Fortnight Champion', badge: 'Gold', description: '2 consecutive weeks strong', icon: '🏆' },
  { days: 30, title: 'Monthly Legend', badge: 'Diamond', description: '30 days master habit', icon: '💎' },
  { days: 50, title: 'Study Master', badge: 'Master', description: '50 days relentless focus', icon: '🚀' },
  { days: 100, title: 'Century Titan', badge: 'Titan', description: '100 days legendary scholar', icon: '👑' },
  { days: 365, title: 'Ultimate Scholar', badge: 'Mythic', description: '365 days of excellence', icon: '🌟' },
];

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastGoalAchievedDate: string | null; // Format: 'YYYY-MM-DD'
  lastActiveDate: string;             // Format: 'YYYY-MM-DD'
  history: Record<string, boolean>;  // Record of dates where goal was met
  freezesRemaining: number;          // Default 3 per calendar month
  lastFreezeMonth: string;           // Format: 'YYYY-MM'
  frozenDates: Record<string, boolean>; // Record of dates protected by freeze
  unlockedMilestones: number[];      // e.g. [3, 7]
}

const STORAGE_KEY = 'studyflow_daily_streak_v1';
const FREEZES_PER_MONTH = 3;

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getYesterdayDateKey(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadStreakData(): StreakData {
  const today = getTodayDateKey();
  const yesterday = getYesterdayDateKey();
  const currentMonth = getCurrentMonthKey();

  const defaultData: StreakData = {
    currentStreak: 0,
    bestStreak: 0,
    lastGoalAchievedDate: null,
    lastActiveDate: today,
    history: {},
    freezesRemaining: FREEZES_PER_MONTH,
    lastFreezeMonth: currentMonth,
    frozenDates: {},
    unlockedMilestones: [],
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed: StreakData = JSON.parse(raw);

    // Initialize missing fields for backwards compatibility
    if (parsed.freezesRemaining === undefined) parsed.freezesRemaining = FREEZES_PER_MONTH;
    if (!parsed.lastFreezeMonth) parsed.lastFreezeMonth = currentMonth;
    if (!parsed.frozenDates) parsed.frozenDates = {};
    if (!parsed.unlockedMilestones) parsed.unlockedMilestones = [];

    // Monthly freeze count reset: if month has rolled over, grant 3 freezes
    if (parsed.lastFreezeMonth !== currentMonth) {
      parsed.freezesRemaining = FREEZES_PER_MONTH;
      parsed.lastFreezeMonth = currentMonth;
    }

    // Validate streak continuity:
    // If last achieved date was before yesterday, check if yesterday was protected by freeze
    if (
      parsed.lastGoalAchievedDate &&
      parsed.lastGoalAchievedDate !== today &&
      parsed.lastGoalAchievedDate !== yesterday
    ) {
      // If yesterday was frozen, continuity is maintained
      const isYesterdayFrozen = !!parsed.frozenDates[yesterday];
      if (!isYesterdayFrozen) {
        parsed.currentStreak = 0;
      }
    }

    parsed.lastActiveDate = today;
    return parsed;
  } catch {
    return defaultData;
  }
}

export function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Graceful fallback
  }
}

/**
 * Call this when Today's Goal is achieved (100% completed)
 */
export function recordDailyGoalAchieved(): {
  currentStreak: number;
  bestStreak: number;
  isFirstTimeToday: boolean;
  isNewMilestone: boolean;
  milestone?: StreakMilestone;
} {
  const today = getTodayDateKey();
  const yesterday = getYesterdayDateKey();
  const data = loadStreakData();

  if (data.lastGoalAchievedDate === today) {
    // Already recorded today's achievement
    return {
      currentStreak: data.currentStreak,
      bestStreak: data.bestStreak,
      isFirstTimeToday: false,
      isNewMilestone: false,
    };
  }

  // Calculate new streak:
  // Continuous if last achieved was yesterday OR yesterday was frozen
  let newStreak = 1;
  const isYesterdayFrozen = !!data.frozenDates[yesterday];
  if (data.lastGoalAchievedDate === yesterday || isYesterdayFrozen) {
    newStreak = (data.currentStreak || 0) + 1;
  } else {
    newStreak = 1;
  }

  const bestStreak = Math.max(data.bestStreak || 0, newStreak);

  // Check if a new milestone is unlocked
  const unlocked = data.unlockedMilestones || [];
  const newlyReachedMilestone = STREAK_MILESTONES.find(
    (m) => m.days === newStreak && !unlocked.includes(m.days)
  );

  const updatedUnlocked = newlyReachedMilestone
    ? [...unlocked, newlyReachedMilestone.days]
    : unlocked;

  const updated: StreakData = {
    ...data,
    currentStreak: newStreak,
    bestStreak,
    lastGoalAchievedDate: today,
    lastActiveDate: today,
    history: {
      ...data.history,
      [today]: true,
    },
    unlockedMilestones: updatedUnlocked,
  };

  saveStreakData(updated);

  return {
    currentStreak: newStreak,
    bestStreak,
    isFirstTimeToday: true,
    isNewMilestone: !!newlyReachedMilestone,
    milestone: newlyReachedMilestone,
  };
}

/**
 * Use a Freeze Shield to protect a missed date (usually yesterday or today)
 */
export function useStreakFreeze(targetDateKey?: string): {
  success: boolean;
  freezesRemaining: number;
  data: StreakData;
} {
  const data = loadStreakData();
  const target = targetDateKey || getYesterdayDateKey();

  if (data.freezesRemaining <= 0) {
    return { success: false, freezesRemaining: 0, data };
  }

  if (data.frozenDates[target]) {
    // Already frozen
    return { success: false, freezesRemaining: data.freezesRemaining, data };
  }

  const updated: StreakData = {
    ...data,
    freezesRemaining: data.freezesRemaining - 1,
    frozenDates: {
      ...data.frozenDates,
      [target]: true,
    },
  };

  saveStreakData(updated);
  return { success: true, freezesRemaining: updated.freezesRemaining, data: updated };
}

export interface WeeklyDayStatus {
  dateKey: string;
  dayLabel: string;   // 'M', 'T', 'W', etc.
  fullDayName: string; // 'Monday', 'Tuesday', etc.
  dayNumber: number;  // 1-31
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  status: 'achieved' | 'frozen' | 'missed' | 'today-achieved' | 'today-pending' | 'future';
}

/**
 * Get current week's 7 days status (Monday to Sunday)
 */
export function getWeeklyStreakStatus(streakData: StreakData): WeeklyDayStatus[] {
  const now = new Date();
  const todayKey = getTodayDateKey();
  
  // Calculate current Monday (start of week)
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);

  const days: WeeklyDayStatus[] = [];
  const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayNamesFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const isToday = dateKey === todayKey;
    const isPast = dateKey < todayKey;
    const isFuture = dateKey > todayKey;

    const isAchieved = !!streakData.history[dateKey];
    const isFrozen = !!streakData.frozenDates[dateKey];

    let status: WeeklyDayStatus['status'] = 'future';
    if (isToday) {
      status = isAchieved ? 'today-achieved' : 'today-pending';
    } else if (isPast) {
      if (isAchieved) status = 'achieved';
      else if (isFrozen) status = 'frozen';
      else status = 'missed';
    } else {
      status = 'future';
    }

    days.push({
      dateKey,
      dayLabel: dayNamesShort[i],
      fullDayName: dayNamesFull[i],
      dayNumber: d.getDate(),
      isToday,
      isPast,
      isFuture,
      status,
    });
  }

  return days;
}

/**
 * Get next upcoming milestone and progress
 */
export function getNextMilestone(currentStreak: number): {
  nextMilestone: StreakMilestone | null;
  daysRemaining: number;
  progressPercent: number;
} {
  const next = STREAK_MILESTONES.find((m) => m.days > currentStreak);
  if (!next) {
    return { nextMilestone: null, daysRemaining: 0, progressPercent: 100 };
  }

  // Find previous milestone days
  const prevMilestone = [...STREAK_MILESTONES].reverse().find((m) => m.days <= currentStreak);
  const prevDays = prevMilestone ? prevMilestone.days : 0;

  const totalSegment = next.days - prevDays;
  const currentSegment = Math.max(0, currentStreak - prevDays);
  const progressPercent = Math.min(100, Math.round((currentSegment / totalSegment) * 100));

  return {
    nextMilestone: next,
    daysRemaining: next.days - currentStreak,
    progressPercent,
  };
}
