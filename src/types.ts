export interface Workspace {
  id: string;
  name: string;
  isStarred?: boolean;
  createdAt: string;
}

export interface Section {
  id: string;
  workspaceId: string;
  name: string;
}

export interface Topic {
  id: string;
  sectionId: string;
  workspaceId: string;
  name: string;
  isCollapsed?: boolean;
  createdAt?: string;
}

export interface Task {
  id: string;
  topicId: string;
  sectionId: string;
  workspaceId: string;
  title: string;
  completed: boolean;
  createdDate: string; // e.g., "21/07/2026"
  createdTime: string; // e.g., "10:46 PM"
  completedAt?: string; // ISO string when toggled complete
  priority?: 'high' | 'medium' | 'low' | 'none';
}

export interface StandaloneTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export type DeletedItemType = 'workspace' | 'section' | 'topic' | 'task';

export interface RecycleItem {
  id: string;
  type: DeletedItemType;
  name: string;
  deletedFrom: string; // Breadcrumb path
  deletedOn: string;   // e.g., "Jul 28, 2026 10:46 PM"
  daysLeft: number;    // Countdown days (default 30)
  originalData: {
    workspace?: Workspace;
    section?: Section;
    topic?: Topic;
    task?: Task;
    // Child items if restoring container
    sections?: Section[];
    topics?: Topic[];
    tasks?: Task[];
  };
}

export interface UserSettings {
  dailyTarget: number;
  dailyGoalMode?: 'tasks' | 'time';
  dailyTimeTargetMinutes?: number;
  theme?: 'light' | 'dark' | 'system';
  primaryColor?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'amber';
  darkMode?: boolean;
  autoSync: boolean;
  soundEffects: boolean;
  confettiCelebration?: boolean;
  defaultTaskPriority?: 'high' | 'medium' | 'low' | 'none';
  focusCheckIntervalMinutes?: number;
  focusCheckIntervalEnabled?: boolean;
}
