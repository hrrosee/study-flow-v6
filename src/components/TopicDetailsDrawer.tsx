import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence
} from 'motion/react';
import {
  X,
  Pin,
  MoreHorizontal,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Flag,
  FileText,
  Link as LinkIcon,
  Paperclip,
  ListChecks,
  ListTodo,
  Check,
  Sparkles,
  BookOpen,
  Atom,
  ExternalLink,
  Download,
  Youtube,
  LayoutGrid,
  Clock,
  Timer,
  Play,
  Pause,
  Square,
  RotateCcw,
  Award,
  Star,
  Volume2,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Pencil,
  CornerUpRight,
  FolderOutput,
  Copy,
  ArrowLeft,
  Palette,
  History
} from 'lucide-react';
import { Topic, TaskItem, ChecklistItem } from '../App';
import { ActiveStudyTimerSession } from './FloatingStudyTimer';

type HeaderTab = 'tasks' | 'notes' | 'files' | 'activity';
type TaskSubTab = 'details' | 'notes' | 'links' | 'files' | 'checklist' | 'subtasks';
type FilterMode = 'all' | 'completed' | 'in_progress';
type SortMode = 'default' | 'name';

type NoteItem = {
  id: string;
  text: string;
  date: string;
  isPinned?: boolean;
};

type LinkType = 'drive' | 'facebook' | 'youtube' | 'chrome';

type ResourceLink = {
  id: string;
  title: string;
  url: string;
  type?: LinkType | 'pdf';
};

type FileItem = {
  id: string;
  name: string;
  size: string;
  date: string;
};

type ActivityItem = {
  id: string;
  type: 'note' | 'rename' | 'edit' | 'task_complete' | 'task_add' | 'link';
  title: string;
  description: string;
  timestamp: string;
  timestampMs?: number;
  user?: string;
  badge?: string;
  category?: 'Task' | 'Topic' | 'Resource';
  taskId?: string;
};

interface TopicDetailsDrawerProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onTogglePin?: (topicId: string) => void;
  onToggleTask?: (topicId: string, taskId: string) => void;
  onAddTask?: (topicId: string, title: string) => void;
  onDeleteTask?: (topicId: string, taskId: string) => void;
  onUpdateTask?: (topicId: string, updatedTask: TaskItem) => void;
  onRenameTask?: (topicId: string, taskId: string, newTitle: string) => void;
  onRenameTopic?: (topicId: string, newTitle: string) => void;
  onStartRenameTopic?: (topic: Topic) => void;
  onDeleteTopic?: (topicId: string) => void;
  onMergeTopic?: (topic: Topic) => void;
  onMoveSectionTopic?: (topic: Topic) => void;
  onDuplicateTopic?: (topicId: string) => void;
  onBulkToggleTaskCompleted?: (topicId: string, taskIds: string[], completed: boolean) => void;
  onBulkDeleteTasks?: (topicId: string, taskIds: string[]) => void;
  onUpdateTopic?: (updatedTopic: Topic) => void;
  activeStudyTimerSession?: ActiveStudyTimerSession | null;
  onStartStudyTimer?: (topicId: string, topicTitle: string, taskId: string, taskTitle: string, workspaceId?: string) => void;
  onPauseStudyTimer?: () => void;
  onResumeStudyTimer?: () => void;
  onStopStudyTimer?: (taskId: string) => void;
  showToast?: (message: string) => void;
  theme?: {
    bg: string;
    cardIconBg: string;
    cardIconColor: string;
    progressBarBg: string;
    progressGradient: string;
    textColor: string;
    pinIconColor: string;
    icon: any;
    iconText?: string;
  };
  onOpenCustomizer?: () => void;
  requestedFocusTaskId?: string | null;
  onResetRequestedFocusTaskId?: () => void;
  allTopics?: Topic[];
  workspaces?: { id: string; name: string }[];
  onNavigateToTask?: (topicId: string, taskId: string, workspaceId?: string) => void;
  navigationTarget?: { headerTab?: HeaderTab; taskSubTab?: TaskSubTab; taskId?: string | null; timestamp?: number } | null;
  focusCheckIntervalMinutes?: number;
  focusCheckIntervalEnabled?: boolean;
  onSoftDeleteNoteItem?: (note: NoteItem, context: { topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string; isTopicNote?: boolean }) => void;
  onSoftDeleteLinkItem?: (link: ResourceLink, context: { topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string }) => void;
}

const FALLBACK_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    text: 'Important derivations from circular motion. Practice numericals.',
    date: 'May 18, 2024 • 10:30 AM',
  },
];

const FALLBACK_LINKS: ResourceLink[] = [
  {
    id: 'link-1',
    title: 'Class Notes (PDF)',
    url: 'drive.google.com/file/d/12345',
    type: 'pdf',
  },
  {
    id: 'link-2',
    title: 'NCERT Chapter Reference',
    url: 'youtu.be/abcd1234',
    type: 'youtube',
  },
];

const FALLBACK_FILES: FileItem[] = [
  {
    id: 'file-1',
    name: 'Formula Sheet - Motion in Plane.pdf',
    size: '1.2 MB',
    date: 'Uploaded May 18, 2024',
  },
];

const FALLBACK_CHECKLIST: ChecklistItem[] = [
  { id: 'check-1', title: 'Review projectile motion formulas', completed: true },
  { id: 'check-2', title: 'Solve numerical examples', completed: true },
  { id: 'check-3', title: 'Practice mixed concept problems', completed: false },
];

function formatNoteDate(dateStr?: string): string {
  if (!dateStr) return 'Just now';
  if (dateStr.includes('•')) return dateStr;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day) && !isNaN(year)) {
        return `${months[monthIdx]} ${day}, ${year} • 10:30 AM`;
      }
    }
  }
  return dateStr;
}

function formatDisplayDueDate(dueDateStr?: string): string {
  if (!dueDateStr) return 'Set Date';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDateStr)) {
    const [year, month, day] = dueDateStr.split('-').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month - 1]} ${day}, ${year}`;
  }
  return dueDateStr;
}

function getDueDateStatus(dueDateStr?: string): { label: string; color: string; isOverdue: boolean } | null {
  if (!dueDateStr) return null;
  let targetDate: Date | null = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDateStr)) {
    const [y, m, d] = dueDateStr.split('-').map(Number);
    targetDate = new Date(y, m - 1, d);
  } else {
    const parsed = Date.parse(dueDateStr);
    if (!isNaN(parsed)) targetDate = new Date(parsed);
  }
  if (!targetDate) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const lateDays = Math.abs(diffDays);
    return {
      label: lateDays === 1 ? 'Overdue (1d)' : `Overdue (${lateDays}d)`,
      color: 'bg-rose-100 text-rose-700 border-rose-200',
      isOverdue: true
    };
  } else if (diffDays === 0) {
    return {
      label: 'Today',
      color: 'bg-blue-100 text-[#176BFF] border-blue-200',
      isOverdue: false
    };
  } else if (diffDays === 1) {
    return {
      label: 'Tomorrow',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      isOverdue: false
    };
  } else if (diffDays <= 7) {
    return {
      label: `In ${diffDays}d`,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      isOverdue: false
    };
  }
  return null;
}

const PRIORITY_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; iconBg: string; fill: string; dot: string }> = {
  high: {
    label: 'High',
    bg: 'bg-[#FFF5F5] dark:bg-rose-950/30',
    border: 'border-[#FFE2E2]/90 dark:border-rose-900/40 hover:border-[#F43F5E]/40 dark:hover:border-rose-700/50',
    text: 'text-[#F43F5E] dark:text-rose-400',
    iconBg: 'bg-[#FFE6E6] dark:bg-rose-900/40',
    fill: 'fill-[#F43F5E]',
    dot: 'bg-[#F43F5E]'
  },
  medium: {
    label: 'Medium',
    bg: 'bg-[#FFFBEB] dark:bg-amber-950/30',
    border: 'border-[#FEF3C7]/90 dark:border-amber-900/40 hover:border-[#F59E0B]/40 dark:hover:border-amber-700/50',
    text: 'text-[#D97706] dark:text-amber-400',
    iconBg: 'bg-[#FEF3C7] dark:bg-amber-900/40',
    fill: 'fill-[#D97706]',
    dot: 'bg-[#F59E0B]'
  },
  low: {
    label: 'Low',
    bg: 'bg-[#F0FDF4] dark:bg-emerald-950/30',
    border: 'border-[#DCFCE7]/90 dark:border-emerald-900/40 hover:border-[#16A34A]/40 dark:hover:border-emerald-700/50',
    text: 'text-[#16A34A] dark:text-emerald-400',
    iconBg: 'bg-[#DCFCE7] dark:bg-emerald-900/40',
    fill: 'fill-[#16A34A]',
    dot: 'bg-[#16A34A]'
  },
  none: {
    label: 'None',
    bg: 'bg-white/95 dark:bg-slate-800/40 hover:bg-slate-50/90 dark:hover:bg-slate-800/70',
    border: 'border-slate-200/70 dark:border-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600/60',
    text: 'text-slate-800 dark:text-slate-200',
    iconBg: 'bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/40 text-slate-500 dark:text-slate-400',
    fill: 'fill-transparent',
    dot: 'bg-slate-300 dark:bg-slate-600'
  }
};

const CONFIDENCE_CONFIG: Record<string, { label: string; stars: number; bg: string; border: string; text: string; iconBg: string; fill: string; dot: string; subtitle: string }> = {
  mastered: {
    label: 'Mastered',
    stars: 5,
    bg: 'bg-[#F0FDF4] dark:bg-emerald-950/30',
    border: 'border-[#DCFCE7]/90 dark:border-emerald-900/40 hover:border-[#16A34A]/40 dark:hover:border-emerald-700/50',
    text: 'text-[#16A34A] dark:text-emerald-400',
    iconBg: 'bg-[#DCFCE7] dark:bg-emerald-900/40',
    fill: 'fill-[#16A34A]',
    dot: 'bg-[#16A34A]',
    subtitle: 'Fully Understood'
  },
  high: {
    label: 'High',
    stars: 4,
    bg: 'bg-[#F0FDF4] dark:bg-emerald-950/30',
    border: 'border-[#DCFCE7]/90 dark:border-emerald-900/40 hover:border-[#22C55E]/40 dark:hover:border-emerald-700/50',
    text: 'text-[#15803D] dark:text-emerald-400',
    iconBg: 'bg-[#E8FBE8] dark:bg-emerald-900/40',
    fill: 'fill-[#15803D]',
    dot: 'bg-[#22C55E]',
    subtitle: 'Confident & Clear'
  },
  medium: {
    label: 'Moderate',
    stars: 3,
    bg: 'bg-[#FFFBEB] dark:bg-amber-950/30',
    border: 'border-[#FEF3C7]/90 dark:border-amber-900/40 hover:border-[#F59E0B]/40 dark:hover:border-amber-700/50',
    text: 'text-[#D97706] dark:text-amber-400',
    iconBg: 'bg-[#FEF3C7] dark:bg-amber-900/40',
    fill: 'fill-[#D97706]',
    dot: 'bg-[#F59E0B]',
    subtitle: 'Needs Practice'
  },
  low: {
    label: 'Needs Work',
    stars: 2,
    bg: 'bg-[#FFF5F5] dark:bg-rose-950/30',
    border: 'border-[#FFE2E2]/90 dark:border-rose-900/40 hover:border-[#F43F5E]/40 dark:hover:border-rose-700/50',
    text: 'text-[#F43F5E] dark:text-rose-400',
    iconBg: 'bg-[#FFE6E6] dark:bg-rose-900/40',
    fill: 'fill-[#F43F5E]',
    dot: 'bg-[#F43F5E]',
    subtitle: 'Hard / Doubts'
  },
  none: {
    label: 'Not Rated',
    stars: 0,
    bg: 'bg-white/95 dark:bg-slate-800/40 hover:bg-slate-50/90 dark:hover:bg-slate-800/70',
    border: 'border-slate-200/70 dark:border-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600/60',
    text: 'text-slate-800 dark:text-slate-200',
    iconBg: 'bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/40 text-slate-500 dark:text-slate-400',
    fill: 'fill-transparent',
    dot: 'bg-slate-300 dark:bg-slate-600',
    subtitle: 'Rate Confidence'
  }
};

function formatDisplayTimeSpent(minutes?: number): string {
  if (!minutes || minutes <= 0) return '0m logged';
  if (minutes < 60) return `${minutes}m logged`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h logged`;
}

export function playFocusCheckChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }

    const now = ctx.currentTime;
    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.2);
    gain2.gain.setValueAtTime(0.45, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.85);
  } catch (e) {
    console.debug('Audio chime error:', e);
  }
}

export function triggerMilestoneNotificationAndVibrate(taskTitle: string, intervalMins: number) {
  // 1. Mobile Device Vibration (supported on Android Chrome, Samsung, etc.)
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([300, 150, 300, 150, 400]);
    }
  } catch (e) {
    console.debug('Vibrate error:', e);
  }

  // 2. Play audible audio chime
  try {
    playFocusCheckChime();
  } catch (e) {
    console.debug('Chime error:', e);
  }

  // 3. Mobile (Service Worker / Native API) & Desktop Browser Notification (shows on lockscreen / notifications tray)
  try {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const title = '🔔 Still Studying? - StudyFlow';
      const intervalDisplay = intervalMins === 0.5 ? '30-second' : `${intervalMins}-minute`;
      const options = {
        body: `You reached your ${intervalDisplay} focus milestone for "${taskTitle || 'your task'}"!`,
        icon: '/favicon.ico',
        tag: 'studyflow-focus-check',
      };

      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, options as any);
        }).catch(() => {
          const notif = new Notification(title, options as NotificationOptions);
          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        });
      } else {
        const notif = new Notification(title, options as NotificationOptions);
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      }
    }
  } catch (e) {
    console.debug('Notification error:', e);
  }
}

function ensureExternalUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function detectLinkType(url: string, title?: string): LinkType {
  const text = `${url} ${title || ''}`.toLowerCase();
  if (/drive\.google\.com|docs\.google\.com|sheets\.google\.com|slides\.google\.com|drive/i.test(text)) {
    return 'drive';
  }
  if (/facebook\.com|fb\.com|fb\.watch|fb\.gg|facebook/i.test(text)) {
    return 'facebook';
  }
  if (/youtube\.com|youtu\.be|youtube/i.test(text)) {
    return 'youtube';
  }
  return 'chrome';
}

function getAutoLinkTitle(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();

  // YouTube
  if (/youtu\.be|youtube\.com/i.test(lower)) {
    if (lower.includes('playlist')) return 'YouTube Playlist';
    if (lower.includes('/shorts/')) return 'YouTube Shorts';
    if (lower.includes('/channel/') || lower.includes('/c/') || lower.includes('/@')) return 'YouTube Channel';
    return 'YouTube Video';
  }

  // Google Drive & Docs
  if (/docs\.google\.com\/document/i.test(lower)) return 'Google Docs Document';
  if (/docs\.google\.com\/spreadsheets/i.test(lower)) return 'Google Sheets Spreadsheet';
  if (/docs\.google\.com\/presentation/i.test(lower)) return 'Google Slides Presentation';
  if (/docs\.google\.com\/forms|forms\.gle/i.test(lower)) return 'Google Form';
  if (/drive\.google\.com/i.test(lower)) return 'Google Drive File';

  // Social
  if (/facebook\.com|fb\.watch|fb\.com/i.test(lower)) {
    if (lower.includes('/groups/')) return 'Facebook Group';
    if (lower.includes('/videos/') || lower.includes('fb.watch')) return 'Facebook Video';
    return 'Facebook Resource';
  }

  // Files
  if (/\.pdf($|\?)/i.test(lower) || lower.includes('/pdf/')) return 'PDF Document';
  if (/\.docx?($|\?)/i.test(lower)) return 'Word Document';
  if (/\.xlsx?($|\?)/i.test(lower)) return 'Excel Spreadsheet';
  if (/\.pptx?($|\?)/i.test(lower)) return 'PowerPoint Presentation';

  // Coding & Tech
  if (/github\.com/i.test(lower)) return 'GitHub Repository';
  if (/wikipedia\.org/i.test(lower)) return 'Wikipedia Article';
  if (/medium\.com/i.test(lower)) return 'Medium Article';
  if (/notion\.so|notion\.site/i.test(lower)) return 'Notion Page';
  if (/10minuteschool\.com/i.test(lower)) return '10 Minute School';
  if (/khanacademy\.org/i.test(lower)) return 'Khan Academy';
  if (/geeksforgeeks\.org/i.test(lower)) return 'GeeksforGeeks';
  if (/w3schools\.com/i.test(lower)) return 'W3Schools';

  try {
    const fullUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(fullUrl);
    const host = parsed.hostname.replace(/^www\./i, '');
    if (host && host.includes('.')) {
      const parts = host.split('.');
      const domainName = parts[0];
      if (domainName && domainName.length > 1) {
        const capitalized = domainName.charAt(0).toUpperCase() + domainName.slice(1);
        return `${capitalized} Resource`;
      }
    }
  } catch {
    // Fallback on invalid URL parse
  }

  return 'Web Resource';
}

function renderLinkIcon(url: string, title?: string) {
  const type = detectLinkType(url, title);

  if (type === 'youtube') {
    return (
      <svg width="24" height="17" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path fillRule="evenodd" clipRule="evenodd" d="M27.0983 3.03362C26.7797 1.8436 25.8453 0.909181 24.6553 0.590623C22.5029 0.0136719 14.0006 0.0136719 14.0006 0.0136719C14.0006 0.0136719 5.49826 0.0136719 3.34591 0.590623C2.15589 0.909181 1.22147 1.8436 0.902914 3.03362C0.325963 5.18597 0.325963 9.99965 0.325963 9.99965C0.325963 9.99965 0.325963 14.8133 0.902914 16.9657C1.22147 18.1557 2.15589 19.0901 3.34591 19.4087C5.49826 19.9856 14.0006 19.9856 14.0006 19.9856C14.0006 19.9856 22.5029 19.9856 24.6553 19.4087C25.8453 19.0901 26.7797 18.1557 27.0983 16.9657C27.6752 14.8133 27.6752 9.99965 27.6752 9.99965C27.6752 9.99965 27.6752 5.18597 27.0983 3.03362ZM11.2612 14.2818V5.71754L18.6811 9.99965L11.2612 14.2818Z" fill="#FF0000" />
      </svg>
    );
  }

  if (type === 'facebook') {
    return (
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="w-[30px] h-[24px] shrink-0" />
    );
  }

  if (type === 'drive') {
    return (
      <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-[24px] h-[24px] shrink-0" />
    );
  }

  // Default: Chrome icon
  return (
    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" className="w-[24px] h-[24px] shrink-0" />
  );
}

function renderNoteIcon() {
  return (
    <svg width="27" height="33.5" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 block">
      <path d="M4 0C1.79086 0 0 1.79086 0 4V38C0 40.2091 1.79086 42 4 42H30C32.2091 42 34 40.2091 34 38V12L22 0H4Z" fill="url(#note_grad)" />
      <path d="M22 0V8C22 10.2091 23.7909 12 26 12H34L22 0Z" fill="url(#fold_grad)" />
      <rect x="9" y="16" width="16" height="3" rx="1.5" fill="white" />
      <rect x="9" y="24" width="16" height="3" rx="1.5" fill="white" />
      <rect x="9" y="32" width="11" height="3" rx="1.5" fill="white" />
      <defs>
        <linearGradient id="note_grad" x1="0" y1="0" x2="34" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--note-grad-start, #60A5FA)" />
          <stop offset="1" stopColor="var(--note-grad-end, #2563EB)" />
        </linearGradient>
        <linearGradient id="fold_grad" x1="22" y1="0" x2="34" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--note-fold-start, #93C5FD)" />
          <stop offset="1" stopColor="var(--note-fold-end, #3B82F6)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const TopicDetailsDrawer: React.FC<TopicDetailsDrawerProps> = ({
  topic,
  isOpen,
  onClose,
  onTogglePin,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onRenameTask,
  onRenameTopic,
  onStartRenameTopic,
  onDeleteTopic,
  onMergeTopic,
  onMoveSectionTopic,
  onDuplicateTopic,
  onBulkToggleTaskCompleted,
  onBulkDeleteTasks,
  onUpdateTopic,
  activeStudyTimerSession,
  onStartStudyTimer,
  onPauseStudyTimer,
  onResumeStudyTimer,
  onStopStudyTimer,
  showToast,
  theme,
  onOpenCustomizer,
  onActiveTaskStateChange,
  requestedFocusTaskId,
  onResetRequestedFocusTaskId,
  allTopics = [],
  workspaces = [],
  onNavigateToTask,
  navigationTarget,
  focusCheckIntervalMinutes = 20,
  focusCheckIntervalEnabled = true,
  onSoftDeleteNoteItem,
  onSoftDeleteLinkItem,
}) => {
  const [activeHeaderTab, setActiveHeaderTab] = useState<HeaderTab>('tasks');
  const [activeTaskSubTab, setActiveTaskSubTab] = useState<TaskSubTab>('details');
  const [mobileActiveView, setMobileActiveView] = useState<'list' | 'details'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [isTaskFilterOpen, setIsTaskFilterOpen] = useState(false);
  const taskFilterRef = useRef<HTMLDivElement>(null);
  const [isMarkMenuOpen, setIsMarkMenuOpen] = useState(false);
  const markMenuRef = useRef<HTMLDivElement>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [topicMenuOpen, setTopicMenuOpen] = useState(false);
  const [activeTaskMenuId, setActiveTaskMenuId] = useState<string | null>(null);
  const [taskMenuPlacement, setTaskMenuPlacement] = useState<'bottom' | 'top'>('bottom');
  const [noteMenuPlacement, setNoteMenuPlacement] = useState<'bottom' | 'top'>('bottom');
  const [linkMenuPlacement, setLinkMenuPlacement] = useState<'bottom' | 'top'>('bottom');
  const [openLinkMenuId, setOpenLinkMenuId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [isBulkDeleteTaskConfirmOpen, setIsBulkDeleteTaskConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{ id: string; text: string; isTopicNote?: boolean; taskId?: string } | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<{ id: string; title: string } | null>(null);
  const [lastTaskCheckedTime, setLastTaskCheckedTime] = useState<number | null>(null);
  const [, setTicker] = useState(0);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  const rightColumnScrollRef = useRef<HTMLDivElement>(null);
  const subTabRowRef = useRef<HTMLDivElement>(null);
  const subTabContentWrapperRef = useRef<HTMLDivElement>(null);
  const [dynamicSubTabMinHeight, setDynamicSubTabMinHeight] = useState<number | undefined>(undefined);
  const descTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCustomLinkTitle, setIsCustomLinkTitle] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isMobileNoteModalOpen, setIsMobileNoteModalOpen] = useState(false);
  const [mobileNoteTarget, setMobileNoteTarget] = useState<'task' | 'topic'>('task');
  const [editingNoteTaskId, setEditingNoteTaskId] = useState<string | undefined>(undefined);
  const [isMobileLinkModalOpen, setIsMobileLinkModalOpen] = useState(false);
  const [mobileLinkTarget, setMobileLinkTarget] = useState<'task' | 'topic'>('task');
  const [mobileKeyboardBottomInset, setMobileKeyboardBottomInset] = useState(0);

  const handleCopyNote = (noteId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(noteId);
    if (showToast) showToast('Note copied to clipboard');
    setTimeout(() => setCopiedNoteId((curr) => (curr === noteId ? null : curr)), 2000);
  };

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.touchAction = 'auto';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getRelativeUpdatedTime = (timestamp: number | null): string => {
    if (!timestamp) return 'Updated 2h ago';
    const now = Date.now();
    const diffMs = Math.max(0, now - timestamp);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 30) return 'Updated Just Now';
    if (diffSec < 60) return 'Updated 30s ago';
    if (diffMin < 60) return `Updated ${diffMin}m ago`;
    if (diffHour < 24) return `Updated ${diffHour}h ago`;
    if (diffDay < 30) return `Updated ${diffDay}d ago`;
    if (diffMonth < 12) return `Updated ${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
    return 'Updated Long time ago';
  };

  const [filesList] = useState<FileItem[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color: string }>>([
    { id: '1', name: 'Mechanics', color: 'blue' },
    { id: '2', name: 'Kinematics', color: 'purple' },
    { id: '3', name: 'Physics', color: 'emerald' },
  ]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingDescInput, setEditingDescInput] = useState('');
  const keyboardScrollTimerRef = useRef<number | null>(null);

  // High-Performance 60fps Single-Shot Debounced Smooth Scroll Controller
  const scrollToInputAboveKeyboard = (element: HTMLElement | null, delay: number = 60, offsetFromKeyboard: number = 10) => {
    if (!element) return;

    // Do NOT scroll if the element is inside a fixed floating modal
    if (element.closest('.fixed')) return;

    if (keyboardScrollTimerRef.current) {
      clearTimeout(keyboardScrollTimerRef.current);
      keyboardScrollTimerRef.current = null;
    }

    keyboardScrollTimerRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        const formEl = element.closest('form') || element;
        const scrollContainer = (formEl.closest('.overflow-y-auto') as HTMLElement) || (document.querySelector('.mac-scrollbar') as HTMLElement);
        if (!scrollContainer) return;

        const formRect = formEl.getBoundingClientRect();
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

        const targetBottom = viewportHeight - offsetFromKeyboard;

        // If the form/input is already visible in viewport, do NOT scroll
        if (formRect.bottom <= targetBottom && formRect.top >= 65) {
          return;
        }

        let deltaY = 0;
        if (formRect.bottom > targetBottom) {
          deltaY = formRect.bottom - targetBottom;
        } else if (formRect.top < 65) {
          deltaY = formRect.top - 65;
        }

        if (Math.abs(deltaY) > 5) {
          scrollContainer.scrollBy({
            top: deltaY,
            behavior: 'smooth'
          });
        }
      });
    }, delay);
  };

  // Helper to dynamically calculate max allowable textarea height so Save & Cancel buttons NEVER hide under keyboard
  const autoExpandDescriptionTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    const scrollH = el.scrollHeight;

    // Calculate available space above virtual keyboard
    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const formEl = el.closest('form');

    let maxAllowedHeight = 360; // Desktop default limit
    if (formEl) {
      const formRect = formEl.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      // Distance from top of textarea to bottom of form (including buttons and padding ~ 44px)
      const buttonsAndPaddingHeight = formRect.bottom - elRect.bottom;
      // Max height = viewportHeight - keyboardMargin(10px) - topOffsetOfTextarea - buttonsHeight
      const calculatedMax = viewportHeight - 10 - elRect.top - Math.max(buttonsAndPaddingHeight, 44);
      if (calculatedMax > 72) {
        maxAllowedHeight = calculatedMax;
      }
    }

    const finalHeight = Math.max(72, Math.min(scrollH, maxAllowedHeight));
    el.style.height = `${finalHeight}px`;
    el.style.overflowY = scrollH > maxAllowedHeight ? 'auto' : 'hidden';
  };

  // Auto-expand Description textarea whenever opened or input changes
  useEffect(() => {
    if (isEditingDescription && descTextareaRef.current) {
      autoExpandDescriptionTextarea(descTextareaRef.current);
    }
  }, [isEditingDescription, editingDescInput]);

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteInput, setEditingNoteInput] = useState('');
  const [openNoteMenuId, setOpenNoteMenuId] = useState<string | null>(null);

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkTitle, setEditingLinkTitle] = useState('');
  const [editingLinkUrl, setEditingLinkUrl] = useState('');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Mobile screen detection & Visual Viewport software keyboard tracking
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 640 || ('ontouchstart' in window && window.innerWidth < 768));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;

    let timeoutId: number;
    let lastSetInset = 0;
    const handleVisualViewportChange = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));

      if (keyboardHeight > 0) {
        if (timeoutId) clearTimeout(timeoutId);
        if (lastSetInset === 0 || Math.abs(keyboardHeight - lastSetInset) > 35) {
          lastSetInset = keyboardHeight;
          setMobileKeyboardBottomInset(keyboardHeight);
        }
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          lastSetInset = 0;
          setMobileKeyboardBottomInset(0);
        }, 200);
      }
    };

    vv.addEventListener('resize', handleVisualViewportChange);
    vv.addEventListener('scroll', handleVisualViewportChange);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      vv.removeEventListener('resize', handleVisualViewportChange);
      vv.removeEventListener('scroll', handleVisualViewportChange);
    };
  }, [isAddingNote, editingNoteId, isAddingLink, editingLinkId]);
  // Subtask / Checklist States
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | 'tasks' | 'notes' | 'links'>('all');

  const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
  const priorityMenuRef = useRef<HTMLDivElement>(null);
  const [isDueDatePickerOpen, setIsDueDatePickerOpen] = useState(false);
  const dueDatePickerRef = useRef<HTMLDivElement>(null);
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(() => new Date());

  // Time Tracking & Live Study Timer States
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [isTimerConflictModalOpen, setIsTimerConflictModalOpen] = useState(false);
  const timeMenuRef = useRef<HTMLDivElement>(null);
  const [customTimeInput, setCustomTimeInput] = useState('');
  const timerStartTimeRef = useRef<number | null>(null);
  const timerAccumulatedSecondsRef = useRef<number>(0);
  const lastActivityRef = useRef<number>(Date.now());
  const [isStillStudyingPromptOpen, setIsStillStudyingPromptOpen] = useState<boolean>(false);
  const lastTriggeredMilestoneSecRef = useRef<number>(0);
  const activeMilestonePromptRef = useRef<{
    milestoneSec: number;
    milestoneTriggeredAt: number;
    isAutoPaused: boolean;
  } | null>(null);

  // Confidence States
  const [isConfidenceMenuOpen, setIsConfidenceMenuOpen] = useState(false);
  const confidenceMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic tasks list strictly based on topic.tasks (no preloaded tasks)
  const tasksList: TaskItem[] = useMemo(() => {
    if (!topic) return [];
    return topic.tasks || [];
  }, [topic]);

  const activeTask = useMemo(() => {
    if (!tasksList.length) return null;
    if (selectedTaskId) {
      const selected = tasksList.find((task) => task.id === selectedTaskId);
      if (selected) return selected;
    }
    return tasksList.find((task) => !task.completed) ?? tasksList[tasksList.length - 1];
  }, [selectedTaskId, tasksList]);

  // Confirmation modal state for unsaved input
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Helper check to see if any input box currently has modified unsaved text
  const hasUnsavedChanges = useMemo(() => {
    const originalDesc = activeTask?.description || '';
    if (isEditingDescription && editingDescInput.trim() !== originalDesc.trim()) return true;
    if (isAddingTag && newTagInput.trim().length > 0) return true;
    if (isAddingNote && newNoteInput.trim().length > 0) return true;
    if (editingNoteId && editingNoteInput.trim().length > 0) return true;
    if (isAddingLink && (newLinkTitle.trim().length > 0 || newLinkUrl.trim().length > 0)) return true;
    return false;
  }, [activeTask?.description, isEditingDescription, editingDescInput, isAddingTag, newTagInput, isAddingNote, newNoteInput, editingNoteId, editingNoteInput, isAddingLink, newLinkTitle, newLinkUrl]);

  // Generic guard executor for any interactive action (task click, filter click, close click, tab click)
  const withUnsavedGuard = (action: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
    } else {
      // Auto-close any open empty input forms if no text was typed
      setIsEditingDescription(false);
      setEditingDescInput('');
      setIsAddingTag(false);
      setNewTagInput('');
      setIsAddingNote(false);
      setNewNoteInput('');
      setEditingNoteId(null);
      setEditingNoteInput('');
      setIsAddingLink(false);
      setNewLinkTitle('');
      setNewLinkUrl('');
      setIsAddingSubtask(false);
      setNewSubtaskTitle('');
      setEditingTaskId(null);

      action();
    }
  };

  // Handler for tab switching with unsaved changes protection (Zero Mobile Scroll Jump)
  const handleSubTabSwitch = (targetTab: TaskSubTab) => {
    if (targetTab === activeTaskSubTab) return;

    // Capture current scroll position and content height before switching tab
    const scrollContainer = rightColumnScrollRef.current;
    const currentScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

    // Calculate exact visible space for the sub-tab content so it perfectly hits the bottom with 0px overflow
    if (scrollContainer && subTabContentWrapperRef.current) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const wrapperRect = subTabContentWrapperRef.current.getBoundingClientRect();

      const computedStyle = window.getComputedStyle(scrollContainer);
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

      // Use exact bounding rects minus padding.
      const visibleSpace = containerRect.bottom - wrapperRect.top - paddingBottom;

      if (visibleSpace > 0) {
        // Use Math.ceil so scrollHeight is at least equal to (clientHeight + currentScrollTop)
        // This completely eliminates scroll clamping and prevents downward position drift on consecutive tab switches
        setDynamicSubTabMinHeight(Math.ceil(visibleSpace));
      } else {
        setDynamicSubTabMinHeight(undefined);
      }
    }

    withUnsavedGuard(() => {
      setIsAddingNote(false);
      setNewNoteInput('');
      setEditingNoteId(null);
      setEditingNoteInput('');
      setIsAddingLink(false);
      setNewLinkTitle('');
      setNewLinkUrl('');
      setIsAddingSubtask(false);
      setNewSubtaskTitle('');
      setEditingTaskId(null);
      setActiveTaskSubTab(targetTab);

      // Lock & preserve exact scroll position so mobile view never moves/scrolls down
      if (scrollContainer) {
        scrollContainer.scrollTop = currentScrollTop;
        requestAnimationFrame(() => {
          if (scrollContainer) scrollContainer.scrollTop = currentScrollTop;
          setTimeout(() => {
            if (scrollContainer) scrollContainer.scrollTop = currentScrollTop;
          }, 0);
        });
      }
    });
  };

  const handleDiscardAndProceed = () => {
    // Reset all unsaved form states
    setIsEditingDescription(false);
    setEditingDescInput('');
    setIsAddingTag(false);
    setNewTagInput('');
    setIsAddingNote(false);
    setNewNoteInput('');
    setEditingNoteId(null);
    setEditingNoteInput('');
    setIsAddingLink(false);
    setNewLinkTitle('');
    setNewLinkUrl('');

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const notesList = useMemo(() => activeTask?.notes || [], [activeTask?.notes]);
  const linksList = useMemo(() => activeTask?.links || [], [activeTask?.links]);
  const topicLinks = useMemo(() => topic?.links || [], [topic?.links]);

  // Dynamically generated activity log sorted strictly by NEWEST FIRST (Chronological descending)
  const activityLogs = useMemo<ActivityItem[]>(() => {
    if (!topic) return [];
    const logs: ActivityItem[] = [];

    const parseLogTimestamp = (id: string, dateStr?: string, fallbackOffset = 0): number => {
      const idMatch = id.match(/(\d{12,14})/);
      if (idMatch && idMatch[1]) {
        const num = parseInt(idMatch[1], 10);
        if (!isNaN(num) && num > 1000000000000) return num;
      }
      if (!dateStr) return fallbackOffset;
      if (/just now/i.test(dateStr)) return Date.now() - fallbackOffset;
      const clean = dateStr.replace(/•/g, ' ').replace(/uploaded/i, '').trim();
      const parsed = Date.parse(clean);
      if (!isNaN(parsed)) return parsed - fallbackOffset;
      return fallbackOffset;
    };

    // 1. Topic-level notes
    (topic.notes || []).forEach((n, idx) => {
      const timeMs = parseLogTimestamp(n.id, n.date, (topic.notes?.length || 0) - idx);
      logs.push({
        id: `act-tnote-${n.id}`,
        type: 'note',
        title: 'Added Topic Note',
        description: `"${n.text.length > 60 ? n.text.substring(0, 60) + '...' : n.text}"`,
        timestamp: n.date || 'Recent',
        timestampMs: timeMs,
        user: 'You',
        badge: 'Topic Note',
        category: 'Topic',
      });
    });

    // 2. Task completions, task notes & links
    (topic.tasks || []).forEach((tk) => {
      (tk.notes || []).forEach((n, idx) => {
        const timeMs = parseLogTimestamp(n.id, n.date, (tk.notes?.length || 0) - idx);
        logs.push({
          id: `act-note-${tk.id}-${n.id}`,
          type: 'note',
          title: `Note on "${tk.title}"`,
          description: `"${n.text.length > 55 ? n.text.substring(0, 55) + '...' : n.text}"`,
          timestamp: n.date || 'Recent',
          timestampMs: timeMs,
          user: 'You',
          badge: 'Task Note',
          category: 'Task',
          taskId: tk.id,
        });
      });

      if (tk.completed) {
        const timeMs = (tk as any).completedAtTime || (tk.completedAt
          ? parseLogTimestamp(tk.id, tk.completedAt)
          : (tk.id.match(/(\d{12,14})/) ? parseInt(tk.id.match(/(\d{12,14})/)![1], 10) : Date.now() - 3600000));

        logs.push({
          id: `act-comp-${tk.id}`,
          type: 'task_complete',
          title: 'Task Completed',
          description: `Successfully finished "${tk.title}"`,
          timestamp: tk.completedAt || 'Completed',
          timestampMs: timeMs,
          user: 'You',
          badge: 'Completed',
          category: 'Task',
          taskId: tk.id,
        });
      }

      (tk.links || []).forEach((l, idx) => {
        const timeMs = parseLogTimestamp(l.id, 'Just now', (tk.links?.length || 0) - idx);
        logs.push({
          id: `act-link-${tk.id}-${l.id}`,
          type: 'link',
          title: `Resource Attached`,
          description: `Linked ${l.title} (${l.url}) to "${tk.title}"`,
          timestamp: 'Just now',
          timestampMs: timeMs,
          user: 'You',
          badge: 'Resource',
          category: 'Resource',
          taskId: tk.id,
        });
      });
    });

    // 3. Topic structure genesis log
    logs.push({
      id: `act-topic-init-${topic.id}`,
      type: 'edit',
      title: 'Topic Configured',
      description: `Topic "${topic.title}" initialized in section "${topic.section}"`,
      timestamp: 'Initial Setup',
      timestampMs: 0,
      user: 'System',
      badge: 'Workspace',
      category: 'Topic',
    });

    // Strict sort: NEWEST FIRST (highest timestampMs at the top)
    return logs.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
  }, [topic]);

  const activityCompletedCount = useMemo(
    () => activityLogs.filter((l) => l.type === 'task_complete').length,
    [activityLogs]
  );
  const activityNotesCount = useMemo(
    () => activityLogs.filter((l) => l.type === 'note').length,
    [activityLogs]
  );
  const activityLinksCount = useMemo(
    () => activityLogs.filter((l) => l.type === 'link').length,
    [activityLogs]
  );

  const filteredActivityLogs = useMemo(() => {
    if (activityFilter === 'tasks') {
      return activityLogs.filter((l) => l.type === 'task_complete' || l.type === 'task_add');
    }
    if (activityFilter === 'notes') {
      return activityLogs.filter((l) => l.type === 'note');
    }
    if (activityFilter === 'links') {
      return activityLogs.filter((l) => l.type === 'link');
    }
    return activityLogs;
  }, [activityLogs, activityFilter]);

  // Deep Search across Title, Description, Notes, and Links
  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...tasksList]
      .filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(normalizedQuery);
        const descMatch = (task.description || '').toLowerCase().includes(normalizedQuery);
        const noteMatch = (task.notes || []).some((n) => n.text.toLowerCase().includes(normalizedQuery));
        const linkMatch = (task.links || []).some(
          (l) => l.title.toLowerCase().includes(normalizedQuery) || l.url.toLowerCase().includes(normalizedQuery)
        );

        const matchesSearch = !normalizedQuery || titleMatch || descMatch || noteMatch || linkMatch;
        if (!matchesSearch) return false;
        if (filterMode === 'completed') return task.completed;
        if (filterMode === 'in_progress') return !task.completed;
        return true;
      })
      .sort((a, b) => {
        if (sortMode === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [filterMode, searchQuery, sortMode, tasksList]);

  const [currentSearchMatchIndex, setCurrentSearchMatchIndex] = useState(0);

  const matchingTaskIndices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return filteredTasks
      .map((t, idx) => {
        const titleMatch = t.title.toLowerCase().includes(q);
        const descMatch = (t.description || '').toLowerCase().includes(q);
        const noteMatch = (t.notes || []).some((n) => n.text.toLowerCase().includes(q));
        const linkMatch = (t.links || []).some(
          (l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
        );
        return titleMatch || descMatch || noteMatch || linkMatch ? idx : -1;
      })
      .filter((idx) => idx !== -1);
  }, [filteredTasks, searchQuery]);

  useEffect(() => {
    setCurrentSearchMatchIndex(0);
  }, [searchQuery]);

  const goToNextMatch = () => {
    if (matchingTaskIndices.length === 0) return;
    const nextIdx = (currentSearchMatchIndex + 1) % matchingTaskIndices.length;
    setCurrentSearchMatchIndex(nextIdx);
    const targetTaskIdx = matchingTaskIndices[nextIdx];
    if (filteredTasks[targetTaskIdx]) {
      setSelectedTaskId(filteredTasks[targetTaskIdx].id);
    }
  };

  const goToPrevMatch = () => {
    if (matchingTaskIndices.length === 0) return;
    const prevIdx = (currentSearchMatchIndex - 1 + matchingTaskIndices.length) % matchingTaskIndices.length;
    setCurrentSearchMatchIndex(prevIdx);
    const targetTaskIdx = matchingTaskIndices[prevIdx];
    if (filteredTasks[targetTaskIdx]) {
      setSelectedTaskId(filteredTasks[targetTaskIdx].id);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        goToPrevMatch();
      } else {
        goToNextMatch();
      }
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      setCurrentSearchMatchIndex(0);
    }
  };

  const topicMenuContainerRef = useRef<HTMLDivElement>(null);
  const descContainerRef = useRef<HTMLDivElement>(null);
  const tagFormRef = useRef<HTMLDivElement>(null);
  const noteFormRef = useRef<HTMLDivElement>(null);
  const linkFormRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [useTwoByTwoGrid, setUseTwoByTwoGrid] = useState<boolean>(true);

  // Responsive Container Monitor: If cards container has insufficient width for 4 columns (< 590px),
  // automatically adapt to a clean 2x2 grid layout
  useEffect(() => {
    if (!cardsContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setUseTwoByTwoGrid(width < 590);
      }
    });
    observer.observe(cardsContainerRef.current);
    return () => observer.disconnect();
  }, [selectedTaskId, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Close popover/dropdown menus if clicked or touched outside
      if (dueDatePickerRef.current && !dueDatePickerRef.current.contains(target)) {
        setIsDueDatePickerOpen(false);
      }
      if (priorityMenuRef.current && !priorityMenuRef.current.contains(target)) {
        setIsPriorityMenuOpen(false);
      }
      if (timeMenuRef.current && !timeMenuRef.current.contains(target)) {
        setIsTimeMenuOpen(false);
      }
      if (confidenceMenuRef.current && !confidenceMenuRef.current.contains(target)) {
        setIsConfidenceMenuOpen(false);
      }
      if (taskFilterRef.current && !taskFilterRef.current.contains(target)) {
        setIsTaskFilterOpen(false);
      }
      if (markMenuRef.current && !markMenuRef.current.contains(target)) {
        setIsMarkMenuOpen(false);
      }
      if (topicMenuContainerRef.current && !topicMenuContainerRef.current.contains(target)) {
        setTopicMenuOpen(false);
      }
      if (!target.closest?.('[data-task-menu]')) {
        setActiveTaskMenuId(null);
      }
      if (!target.closest?.('[data-note-menu]')) {
        setOpenNoteMenuId(null);
      }
      if (!target.closest?.('[data-link-menu]')) {
        setOpenLinkMenuId(null);
      }

      // If clicking inside mobile note/link bottom sheets, do not trigger outside click guards for inline forms
      if (isMobileNoteModalOpen || isMobileLinkModalOpen || target.closest?.('[data-modal-overlay]')) {
        return;
      }

      if (descContainerRef.current && !descContainerRef.current.contains(target)) {
        if (isEditingDescription) {
          withUnsavedGuard(() => setIsEditingDescription(false));
        }
      }
      if (tagFormRef.current && !tagFormRef.current.contains(target)) {
        if (isAddingTag && !newTagInput.trim()) {
          setIsAddingTag(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isEditingDescription, isAddingTag, isAddingNote, editingNoteId, isAddingLink, isMobileNoteModalOpen, isMobileLinkModalOpen, hasUnsavedChanges]);

  // Live Browser Tab Title Ticker & Alert
  useEffect(() => {
    if (isStillStudyingPromptOpen) {
      document.title = '🔔 Still Studying? - StudyFlow';
      return;
    }

    if (activeTimerTaskId) {
      const runningTaskForTitle = tasksList.find((t) => t.id === activeTimerTaskId);
      const mins = Math.floor(timerSeconds / 60);
      const secs = timerSeconds % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const taskName = runningTaskForTitle?.title
        ? runningTaskForTitle.title.length > 20
          ? runningTaskForTitle.title.slice(0, 20) + '...'
          : runningTaskForTitle.title
        : (activeTask?.title || 'Studying');
      const statusIcon = isTimerPaused ? '⏸️' : '⏱️';
      document.title = `(${statusIcon} ${formatted} • ${taskName}) StudyFlow`;
    } else {
      document.title = 'StudyFlow';
    }

    return () => {
      document.title = 'StudyFlow';
    };
  }, [activeTimerTaskId, timerSeconds, tasksList, activeTask?.title, isStillStudyingPromptOpen, isTimerPaused]);

  // Track last clicked task index for Shift+Click range toggling
  const lastClickedTaskIndexRef = useRef<number | null>(null);
  const lastSelectedTaskIndexRef = useRef<number | null>(null);

  const handleToggleTaskWithShift = (taskId: string, index: number, e: React.MouseEvent) => {
    if (!topic) return;
    const currentTask = filteredTasks.find((t) => t.id === taskId) || (topic.tasks || []).find((t) => t.id === taskId);
    if (!currentTask) return;
    const targetState = !currentTask.completed;

    if (e.shiftKey && lastClickedTaskIndexRef.current !== null && lastClickedTaskIndexRef.current !== index) {
      const start = Math.min(lastClickedTaskIndexRef.current, index);
      const end = Math.max(lastClickedTaskIndexRef.current, index);
      const tasksInRange = filteredTasks.slice(start, end + 1).map((t) => t.id);

      if (onBulkToggleTaskCompleted) {
        onBulkToggleTaskCompleted(topic.id, tasksInRange, targetState);
      } else {
        tasksInRange.forEach((id) => onToggleTask?.(topic.id, id));
      }
    } else {
      if (!currentTask.completed) {
        setLastTaskCheckedTime(Date.now());
      }
      onToggleTask?.(topic.id, taskId);
    }
    lastClickedTaskIndexRef.current = index;
  };

  // Scoped Keyboard Shortcuts when Topic Details Drawer is Open
  useEffect(() => {
    if (!isOpen || !topic) return;

    const handleDrawerKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as any).isContentEditable);

      if (e.key === 'Escape') {
        if (!isTyping) {
          e.preventDefault();
          onClose();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        // Ctrl + Shift + S: Pin / Star Topic
        e.preventDefault();
        onTogglePin?.(topic.id);
      } else if (e.altKey && !e.shiftKey && e.key.toLowerCase() === 't') {
        // Alt + T: Focus / Add Task
        e.preventDefault();
        setIsAddingTask(true);
      } else if (e.altKey && !e.shiftKey && e.key.toLowerCase() === 'l') {
        // Alt + L: Add Link
        e.preventDefault();
        setIsAddingLink(true);
      } else if (e.altKey && !e.shiftKey && e.key.toLowerCase() === 'n') {
        // Alt + N: Add Note
        e.preventDefault();
        setIsAddingNote(true);
      } else if (e.altKey && !e.shiftKey && e.key.toLowerCase() === 'd') {
        // Alt + D: Edit Description
        e.preventDefault();
        setIsEditingDescription(true);
      }
    };

    window.addEventListener('keydown', handleDrawerKeyDown);
    return () => window.removeEventListener('keydown', handleDrawerKeyDown);
  }, [isOpen, topic?.id, onTogglePin, onClose]);

  // Repeating audio chime warning every 6s up to 10 times (60s total grace window) while "Still Studying?" prompt is active
  useEffect(() => {
    if (!isStillStudyingPromptOpen) return;

    let chimeCount = 0;
    playFocusCheckChime();
    chimeCount++;

    const interval = setInterval(() => {
      if (activeMilestonePromptRef.current?.isAutoPaused || chimeCount >= 10) {
        clearInterval(interval);
        return;
      }
      playFocusCheckChime();
      chimeCount++;
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [isStillStudyingPromptOpen]);

  // Live Timer Interval Effect (Runs ONLY when standalone without global timer)
  useEffect(() => {
    if (onStartStudyTimer) return; // Managed globally by App.tsx to prevent duplicate interval conflict
    if (!activeTimerTaskId || isTimerPaused) return;

    if (!timerStartTimeRef.current) {
      timerStartTimeRef.current = Date.now();
    }

    const intervalSec = Math.max(10, Math.round(focusCheckIntervalMinutes * 60));

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current!) / 1000);
      const totalSec = timerAccumulatedSecondsRef.current + elapsedSinceStart;

      // Check if total study time reached a multiple of focusCheckIntervalMinutes
      const currentMilestoneIndex = Math.floor(totalSec / intervalSec);
      const currentMilestoneSec = currentMilestoneIndex * intervalSec;

      // 1. New milestone reached -> trigger prompt and keep running during 60s grace
      if (currentMilestoneIndex > 0 && currentMilestoneSec > lastTriggeredMilestoneSecRef.current) {
        lastTriggeredMilestoneSecRef.current = currentMilestoneSec;
        activeMilestonePromptRef.current = {
          milestoneSec: currentMilestoneSec,
          milestoneTriggeredAt: now,
          isAutoPaused: false,
        };
        setIsStillStudyingPromptOpen(true);
        triggerMilestoneNotificationAndVibrate(activeTask?.title || 'Study Task', focusCheckIntervalMinutes);
        setTimerSeconds(totalSec);
      }
      // 2. 60 seconds grace period expired without response -> Auto-Pause & Rewind to milestoneSec
      else if (
        activeMilestonePromptRef.current &&
        !activeMilestonePromptRef.current.isAutoPaused &&
        totalSec >= activeMilestonePromptRef.current.milestoneSec + 60
      ) {
        const rewindSec = activeMilestonePromptRef.current.milestoneSec;
        activeMilestonePromptRef.current.isAutoPaused = true;
        timerAccumulatedSecondsRef.current = rewindSec;
        timerStartTimeRef.current = null;
        setTimerSeconds(rewindSec);
        setIsTimerPaused(true);
      } else {
        setTimerSeconds(totalSec);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onStartStudyTimer, activeTimerTaskId, isTimerPaused, focusCheckIntervalMinutes, activeTask?.title]);

  // Mobile & Background Sync: Check accurate elapsed time & milestones immediately when returning to tab / waking screen
  useEffect(() => {
    if (onStartStudyTimer) return; // Managed globally by App.tsx
    if (!activeTimerTaskId || isTimerPaused) return;

    const handleSyncOnWake = () => {
      if (!timerStartTimeRef.current || isTimerPaused) return;
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current) / 1000);
      const totalSec = timerAccumulatedSecondsRef.current + elapsedSinceStart;

      const intervalSec = Math.max(10, Math.round(focusCheckIntervalMinutes * 60));
      const currentMilestoneIndex = Math.floor(totalSec / intervalSec);
      const currentMilestoneSec = currentMilestoneIndex * intervalSec;

      if (currentMilestoneIndex > 0 && currentMilestoneSec > lastTriggeredMilestoneSecRef.current) {
        lastTriggeredMilestoneSecRef.current = currentMilestoneSec;
        activeMilestonePromptRef.current = {
          milestoneSec: currentMilestoneSec,
          milestoneTriggeredAt: now,
          isAutoPaused: false,
        };
        setIsStillStudyingPromptOpen(true);
        triggerMilestoneNotificationAndVibrate(activeTask?.title || 'Study Task', focusCheckIntervalMinutes);
        setTimerSeconds(totalSec);
      } else if (
        activeMilestonePromptRef.current &&
        !activeMilestonePromptRef.current.isAutoPaused &&
        totalSec >= activeMilestonePromptRef.current.milestoneSec + 60
      ) {
        const rewindSec = activeMilestonePromptRef.current.milestoneSec;
        activeMilestonePromptRef.current.isAutoPaused = true;
        timerAccumulatedSecondsRef.current = rewindSec;
        timerStartTimeRef.current = null;
        setTimerSeconds(rewindSec);
        setIsTimerPaused(true);
      } else {
        setTimerSeconds(totalSec);
      }
    };

    document.addEventListener('visibilitychange', handleSyncOnWake);
    window.addEventListener('focus', handleSyncOnWake);
    window.addEventListener('pageshow', handleSyncOnWake);

    return () => {
      document.removeEventListener('visibilitychange', handleSyncOnWake);
      window.removeEventListener('focus', handleSyncOnWake);
      window.removeEventListener('pageshow', handleSyncOnWake);
    };
  }, [onStartStudyTimer, activeTimerTaskId, isTimerPaused, focusCheckIntervalMinutes, activeTask?.title]);

  // Synchronize local timer state with activeStudyTimerSession and check focus milestone alert
  useEffect(() => {
    if (activeStudyTimerSession && topic && activeStudyTimerSession.topicId === topic.id) {
      setActiveTimerTaskId(activeStudyTimerSession.taskId);
      setIsTimerPaused(activeStudyTimerSession.isPaused);
      setTimerSeconds(activeStudyTimerSession.seconds);

      const intervalSec = Math.max(10, Math.round(focusCheckIntervalMinutes * 60));

      // Initialize milestone tracking on first sync if opening drawer after timer has been running
      if (lastTriggeredMilestoneSecRef.current === 0 && activeStudyTimerSession.seconds > 0) {
        lastTriggeredMilestoneSecRef.current = Math.floor(activeStudyTimerSession.seconds / intervalSec) * intervalSec;
      }
    } else if (!activeStudyTimerSession) {
      setActiveTimerTaskId(null);
      setIsTimerPaused(false);
      setTimerSeconds(0);
      lastTriggeredMilestoneSecRef.current = 0;
      activeMilestonePromptRef.current = null;
    }
  }, [activeStudyTimerSession, topic?.id, focusCheckIntervalMinutes, activeTask?.title]);

  // Auto-focus the running task ONLY ONCE when the drawer opens
  const hasAutoFocusedTimerTaskRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      isOpen &&
      activeStudyTimerSession &&
      topic &&
      activeStudyTimerSession.topicId === topic.id &&
      hasAutoFocusedTimerTaskRef.current !== activeStudyTimerSession.taskId
    ) {
      hasAutoFocusedTimerTaskRef.current = activeStudyTimerSession.taskId;
      setSelectedTaskId(activeStudyTimerSession.taskId);
    }
    if (!isOpen) {
      hasAutoFocusedTimerTaskRef.current = null;
    }
  }, [isOpen, activeStudyTimerSession?.taskId, activeStudyTimerSession?.topicId, topic?.id]);

  const [highlightPulseTaskId, setHighlightPulseTaskId] = useState<string | null>(null);

  // Handle explicit focus request (e.g. clicking task in Today's Goal Popover or floating timer)
  useEffect(() => {
    if (requestedFocusTaskId) {
      setSelectedTaskId(requestedFocusTaskId);
      setActiveHeaderTab('tasks');
      setMobileActiveView('details');
      setHighlightPulseTaskId(requestedFocusTaskId);
      const timer = setTimeout(() => {
        setHighlightPulseTaskId(null);
      }, 2500);
      onResetRequestedFocusTaskId?.();
      return () => clearTimeout(timer);
    }
  }, [requestedFocusTaskId, onResetRequestedFocusTaskId]);

  // Handle global search deep linking navigation target
  useEffect(() => {
    if (navigationTarget && navigationTarget.timestamp) {
      if (navigationTarget.headerTab) {
        setActiveHeaderTab(navigationTarget.headerTab);
      }
      if (navigationTarget.taskId) {
        setSelectedTaskId(navigationTarget.taskId);
        setMobileActiveView('details');
      }
      if (navigationTarget.taskSubTab) {
        setActiveTaskSubTab(navigationTarget.taskSubTab);
      }
    }
  }, [navigationTarget]);

  // Notify parent of currently visible active task state in the drawer
  useEffect(() => {
    if (isOpen) {
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 640;
      const isViewingDetails = isDesktop || mobileActiveView === 'details';
      onActiveTaskStateChange?.({
        selectedTaskId: activeTask?.id ?? selectedTaskId,
        activeTab: activeHeaderTab,
        isViewingDetails,
        isTimeMenuOpen,
      });
    } else {
      onActiveTaskStateChange?.({
        selectedTaskId: null,
        activeTab: 'tasks',
        isViewingDetails: false,
        isTimeMenuOpen: false,
      });
    }
  }, [isOpen, activeTask?.id, selectedTaskId, activeHeaderTab, mobileActiveView, isTimeMenuOpen, onActiveTaskStateChange]);

  const handleStartTimer = (taskId: string) => {
    if (activeStudyTimerSession && activeStudyTimerSession.taskId !== taskId) {
      showToast?.(`⚠️ "${activeStudyTimerSession.taskTitle || 'Another task'}"-এ টাইমার চলছে! নতুন টাইমার চালু করতে আগে সেটি বন্ধ করুন।`);
      return;
    }
    if (activeTimerTaskId && activeTimerTaskId !== taskId) {
      const runningTask = tasksList.find((t) => t.id === activeTimerTaskId);
      showToast?.(`⚠️ "${runningTask?.title || 'Another task'}"-এ টাইমার চলছে! নতুন টাইমার চালু করতে আগে সেটি বন্ধ করুন।`);
      return;
    }

    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().catch(() => { });
      }
    } catch { }

    const targetTask = tasksList.find((t) => t.id === taskId) || activeTask;
    if (onStartStudyTimer && topic && targetTask) {
      onStartStudyTimer(topic.id, topic.title, taskId, targetTask.title);
      showToast?.('Study timer started! ⏱️ Stay focused');
      return;
    }

    setActiveTimerTaskId(taskId);
    setIsTimerPaused(false);
    setTimerSeconds(0);
    timerStartTimeRef.current = Date.now();
    timerAccumulatedSecondsRef.current = 0;
    lastTriggeredMilestoneSecRef.current = 0;
    setIsStillStudyingPromptOpen(false);
    showToast?.('Study timer started! ⏱️ Stay focused');
  };

  const handlePauseTimer = () => {
    if (onPauseStudyTimer && activeStudyTimerSession) {
      onPauseStudyTimer();
      return;
    }

    if (!activeTimerTaskId || isTimerPaused) return;
    const now = Date.now();
    const elapsedSinceStart = timerStartTimeRef.current ? Math.floor((now - timerStartTimeRef.current) / 1000) : 0;
    const totalSec = timerAccumulatedSecondsRef.current + elapsedSinceStart;
    timerAccumulatedSecondsRef.current = totalSec;
    timerStartTimeRef.current = null;
    setTimerSeconds(totalSec);
    setIsTimerPaused(true);
    showToast?.('Timer paused ⏸️');
  };

  const handleResumeTimer = () => {
    if (onResumeStudyTimer && activeStudyTimerSession) {
      onResumeStudyTimer();
      return;
    }

    if (!activeTimerTaskId || !isTimerPaused) return;
    timerStartTimeRef.current = Date.now();
    setIsTimerPaused(false);
    showToast?.('Timer resumed ▶️ Keep it up!');
  };

  const handleStopTimer = (taskId: string) => {
    if (onStopStudyTimer && activeStudyTimerSession) {
      onStopStudyTimer(taskId);
      setActiveTimerTaskId(null);
      setIsTimerPaused(false);
      setTimerSeconds(0);
      return;
    }

    let sessionSeconds = timerSeconds;
    if (!isTimerPaused && timerStartTimeRef.current) {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current) / 1000);
      sessionSeconds = timerAccumulatedSecondsRef.current + elapsedSinceStart;
    }
    const targetTask = tasksList.find((t) => t.id === taskId) || activeTask;
    if (topic && targetTask) {
      const previousTotalSeconds = targetTask.timeSpentSeconds ?? ((targetTask.timeSpentMinutes || 0) * 60);
      const newTotalSeconds = previousTotalSeconds + sessionSeconds;
      const newSession = {
        id: `sess-${Date.now()}`,
        timestamp: Date.now(),
        durationSeconds: sessionSeconds,
      };

      onUpdateTask?.(topic.id, {
        ...targetTask,
        timeSpentSeconds: newTotalSeconds,
        timeSpentMinutes: newMinutes,
        studySessions: [...((targetTask as any).studySessions || []), newSession],
        lastStudyDate: new Date().toISOString(),
      });

      const sessionMins = Math.floor(sessionSeconds / 60);
      const sessionSecs = sessionSeconds % 60;
      const sessionFormatted = sessionMins > 0 
        ? (sessionSecs > 0 ? `+${sessionMins}m ${sessionSecs}s` : `+${sessionMins}m`)
        : `+${sessionSecs}s`;

      showToast?.(`Study session saved for "${targetTask.title}"! ${sessionFormatted} (Total: ${formatDisplayTimeSpent(newMinutes)})`);
    }
    setActiveTimerTaskId(null);
    setIsTimerPaused(false);
    setTimerSeconds(0);
    timerStartTimeRef.current = null;
    timerAccumulatedSecondsRef.current = 0;
    lastTriggeredMilestoneSecRef.current = 0;
    setIsStillStudyingPromptOpen(false);
  };

  const handleToggleTimer = (taskId: string) => {
    if (activeTimerTaskId === taskId) {
      handleStopTimer(taskId);
    } else {
      handleStartTimer(taskId);
    }
  };

  const handleResumeStillStudying = () => {
    setIsStillStudyingPromptOpen(false);
    if (onResumeStudyTimer && activeStudyTimerSession) {
      onResumeStudyTimer();
    } else {
      if (isTimerPaused) {
        timerStartTimeRef.current = Date.now();
        setIsTimerPaused(false);
      }
      showToast?.('Awesome! Timer resumed 🚀 Keep it up!');
    }
    activeMilestonePromptRef.current = null;
  };

  const handleStopAndSaveFromPrompt = () => {
    setIsStillStudyingPromptOpen(false);
    if (onStopStudyTimer && activeStudyTimerSession) {
      onStopStudyTimer(activeStudyTimerSession.taskId);
    } else {
      if (activeTask && topic) {
        const sessionSeconds = activeMilestonePromptRef.current
          ? activeMilestonePromptRef.current.milestoneSec
          : timerSeconds;
        const previousTotalSeconds = activeTask.timeSpentSeconds ?? ((activeTask.timeSpentMinutes || 0) * 60);
        const newTotalSeconds = previousTotalSeconds + sessionSeconds;
        const newMinutes = Math.floor(newTotalSeconds / 60);

        const newSession = {
          id: `sess-${Date.now()}`,
          timestamp: Date.now(),
          durationSeconds: sessionSeconds,
        };

        onUpdateTask?.(topic.id, {
          ...activeTask,
          timeSpentSeconds: newTotalSeconds,
          timeSpentMinutes: newMinutes,
          studySessions: [...((activeTask as any).studySessions || []), newSession],
          lastStudyDate: new Date().toISOString(),
        });

        const sessionMins = Math.floor(sessionSeconds / 60);
        const sessionSecs = sessionSeconds % 60;
        const sessionFormatted = sessionMins > 0 
          ? (sessionSecs > 0 ? `+${sessionMins}m ${sessionSecs}s` : `+${sessionMins}m`)
          : `+${sessionSecs}s`;

        showToast?.(`Study session finished! ${sessionFormatted} logged.`);
      }
    }
    setActiveTimerTaskId(null);
    setIsTimerPaused(false);
    setTimerSeconds(0);
    timerStartTimeRef.current = null;
    timerAccumulatedSecondsRef.current = 0;
    lastTriggeredMilestoneSecRef.current = 0;
    activeMilestonePromptRef.current = null;
  };

  const handleSetCustomMinutes = (minutes: number, isDirectSet: boolean) => {
    if (!topic || !activeTask) return;
    const currentTotalSecs = activeTask.timeSpentSeconds ?? ((activeTask.timeSpentMinutes || 0) * 60);
    const addedSecs = minutes * 60;
    const newTotalSeconds = Math.max(0, isDirectSet ? addedSecs : currentTotalSecs + addedSecs);
    const newMinutes = Math.floor(newTotalSeconds / 60);

    onUpdateTask?.(topic.id, {
      ...activeTask,
      timeSpentSeconds: newTotalSeconds,
      timeSpentMinutes: newMinutes
    });
    showToast?.(`Study time updated: ${formatDisplayTimeSpent(newMinutes)}`);
    setIsTimeMenuOpen(false);
  };

  const handleResetLoggedTime = () => {
    if (!topic || !activeTask) return;
    onUpdateTask?.(topic.id, {
      ...activeTask,
      timeSpentMinutes: 0,
      timeSpentSeconds: 0
    });
    setActiveTimerTaskId(null);
    setIsTimerPaused(false);
    setTimerSeconds(0);
    timerStartTimeRef.current = null;
    timerAccumulatedSecondsRef.current = 0;
    lastTriggeredMilestoneSecRef.current = 0;
    showToast?.('Logged study time cleared');
    setIsTimeMenuOpen(false);
  };

  const updateTaskConfidence = (confidence: 'mastered' | 'high' | 'medium' | 'low' | 'none') => {
    if (!topic || !activeTask) return;
    const updatedTask: TaskItem = { ...activeTask, confidence };
    onUpdateTask?.(topic.id, updatedTask);
    const cfg = CONFIDENCE_CONFIG[confidence] || CONFIDENCE_CONFIG.none;
    showToast?.(`Confidence set to ${cfg.label}`);
    setIsConfidenceMenuOpen(false);
  };

  const updateTaskPriority = (priority: 'high' | 'medium' | 'low' | 'none') => {
    if (!topic || !activeTask) return;
    const updatedTask: TaskItem = { ...activeTask, priority };
    onUpdateTask?.(topic.id, updatedTask);
    showToast?.(`Priority set to ${priority.charAt(0).toUpperCase() + priority.slice(1)}`);
    setIsPriorityMenuOpen(false);
  };

  const updateTaskDueDate = (dueDate: string | undefined) => {
    if (!topic || !activeTask) return;
    const updatedTask: TaskItem = { ...activeTask, dueDate };
    onUpdateTask?.(topic.id, updatedTask);
    showToast?.(dueDate ? `Due date set to ${formatDisplayDueDate(dueDate)}` : 'Due date cleared');
    setIsDueDatePickerOpen(false);
  };

  useEffect(() => {
    if (!topic) return;
    if (navigationTarget && navigationTarget.timestamp && (Date.now() - navigationTarget.timestamp < 3000)) {
      if (navigationTarget.headerTab) {
        setActiveHeaderTab(navigationTarget.headerTab);
      }
      if (navigationTarget.taskId) {
        setSelectedTaskId(navigationTarget.taskId);
        setMobileActiveView('details');
      }
      if (navigationTarget.taskSubTab) {
        setActiveTaskSubTab(navigationTarget.taskSubTab);
      }
      setSelectedTaskIds([]);
      setIsSelectionMode(false);
      setSearchQuery('');
      setFilterMode('all');
      setSortMode('default');
      setTopicMenuOpen(false);
      return;
    }
    const lastOpenTask = tasksList.find((task) => !task.completed) ?? tasksList[tasksList.length - 1];
    setSelectedTaskId(lastOpenTask?.id ?? null);
    setSelectedTaskIds([]);
    setIsSelectionMode(false);
    setActiveHeaderTab('tasks');
    setActiveTaskSubTab('details');
    setSearchQuery('');
    setFilterMode('all');
    setSortMode('default');
    setTopicMenuOpen(false);
  }, [topic?.id, navigationTarget]);

  const isAllFilteredSelected = useMemo(() => {
    if (filteredTasks.length === 0) return false;
    return filteredTasks.every((t) => selectedTaskIds.includes(t.id));
  }, [filteredTasks, selectedTaskIds]);

  const toggleSelectAll = () => {
    setIsSelectionMode(true);
    if (isAllFilteredSelected) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((t) => t.id));
    }
  };

  const toggleSelectTask = (taskId: string, e?: React.MouseEvent, index?: number) => {
    if (e) e.stopPropagation();
    setIsSelectionMode(true);

    if (e?.shiftKey && lastSelectedTaskIndexRef.current !== null && typeof index === 'number') {
      const start = Math.min(lastSelectedTaskIndexRef.current, index);
      const end = Math.max(lastSelectedTaskIndexRef.current, index);
      const rangeIds = filteredTasks.slice(start, end + 1).map((t) => t.id);
      setSelectedTaskIds((prev) => Array.from(new Set([...prev, ...rangeIds])));
    } else {
      setSelectedTaskIds((prev) =>
        prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
      );
    }

    if (typeof index === 'number') {
      lastSelectedTaskIndexRef.current = index;
    }
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      setSelectedTaskIds([]);
    } else {
      setIsSelectionMode(true);
    }
  };

  const handleBulkComplete = (completed: boolean) => {
    if (!topic || selectedTaskIds.length === 0) return;
    onBulkToggleTaskCompleted?.(topic.id, selectedTaskIds, completed);
    showToast?.(`Marked ${selectedTaskIds.length} task(s) as ${completed ? 'completed' : 'pending'}`);
    setSelectedTaskIds([]);
    setIsSelectionMode(false);
  };

  const handleBulkDelete = () => {
    if (!topic || selectedTaskIds.length === 0) return;
    onBulkDeleteTasks?.(topic.id, selectedTaskIds);
    setSelectedTaskIds([]);
    setIsSelectionMode(false);
  };

  const completedCount = tasksList.filter((task) => task.completed).length;
  const totalCount = tasksList.length;
  const dueCount = tasksList.filter((task) => !task.completed).length;
  const percent = 64; // Exact percent from image

  if (!topic || !isOpen) return null;

  const createTask = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;
    onAddTask?.(topic.id, title);
    showToast?.(`Task "${title}" added`);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const addNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newNoteInput.trim();
    if (!text || !topic) return;
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const date = `${month} ${day}, ${year} • ${hours}:${minutes} ${ampm}`;

    const newNoteItem: NoteItem = { id: `note-${Date.now()}`, text, date };

    if (activeHeaderTab === 'notes') {
      // Adding note to Topic
      const updatedTopicNotes = [...(topic.notes || []), newNoteItem];
      onUpdateTopic?.({ ...topic, notes: updatedTopicNotes });
      showToast?.('Note added to topic');
    } else if (activeTask) {
      // Adding note to selected Task
      const updatedTaskNotes = [...(activeTask.notes || []), newNoteItem];
      onUpdateTask?.(topic.id, { ...activeTask, notes: updatedTaskNotes });
      showToast?.('Note added to task');
    }

    setNewNoteInput('');
    setIsAddingNote(false);
  };

  const deleteNoteItem = (noteId: string, isTopicNote?: boolean, taskId?: string) => {
    if (!topic) return;
    if (taskId) {
      const targetTask = (topic.tasks || []).find((t) => t.id === taskId);
      if (targetTask) {
        const deletedNote = (targetTask.notes || []).find((item) => item.id === noteId);
        const updatedTaskNotes = (targetTask.notes || []).filter((item) => item.id !== noteId);
        onUpdateTask?.(topic.id, { ...targetTask, notes: updatedTaskNotes });
        if (deletedNote) {
          if (onSoftDeleteNoteItem) {
            onSoftDeleteNoteItem(deletedNote, {
              topicId: topic.id,
              topicTitle: topic.title,
              workspaceId: topic.workspaceId,
              taskId: targetTask.id,
              taskTitle: targetTask.title,
              isTopicNote: false
            });
          }
          showToast?.(
            'Task note moved to Recycle Bin',
            () => {
              const restoredNotes = [...updatedTaskNotes, deletedNote];
              onUpdateTask?.(topic.id, { ...targetTask, notes: restoredNotes });
              showToast?.('Restored task note');
            },
            6000
          );
        }
      }
    } else if (isTopicNote || activeHeaderTab === 'notes') {
      const deletedNote = (topic.notes || []).find((item) => item.id === noteId);
      const updatedTopicNotes = (topic.notes || []).filter((item) => item.id !== noteId);
      onUpdateTopic?.({ ...topic, notes: updatedTopicNotes });
      if (deletedNote) {
        if (onSoftDeleteNoteItem) {
          onSoftDeleteNoteItem(deletedNote, {
            topicId: topic.id,
            topicTitle: topic.title,
            workspaceId: topic.workspaceId,
            isTopicNote: true
          });
        }
        showToast?.(
          'Topic note moved to Recycle Bin',
          () => {
            const restoredNotes = [...updatedTopicNotes, deletedNote];
            onUpdateTopic?.({ ...topic, notes: restoredNotes });
            showToast?.('Restored topic note');
          },
          6000
        );
      }
    } else if (activeTask) {
      const deletedNote = (activeTask.notes || []).find((item) => item.id === noteId);
      const updatedTaskNotes = (activeTask.notes || []).filter((item) => item.id !== noteId);
      onUpdateTask?.(topic.id, { ...activeTask, notes: updatedTaskNotes });
      if (deletedNote) {
        if (onSoftDeleteNoteItem) {
          onSoftDeleteNoteItem(deletedNote, {
            topicId: topic.id,
            topicTitle: topic.title,
            workspaceId: topic.workspaceId,
            taskId: activeTask.id,
            taskTitle: activeTask.title,
            isTopicNote: false
          });
        }
        showToast?.(
          'Task note moved to Recycle Bin',
          () => {
            const restoredNotes = [...updatedTaskNotes, deletedNote];
            onUpdateTask?.(topic.id, { ...activeTask, notes: restoredNotes });
            showToast?.('Restored task note');
          },
          6000
        );
      }
    }
    setOpenNoteMenuId(null);
  };

  const saveEditedNote = (noteId: string, isTopicNote?: boolean, taskId?: string) => {
    const text = editingNoteInput.trim();
    if (!text || !topic) return;
    if (taskId) {
      const targetTask = (topic.tasks || []).find((t) => t.id === taskId);
      if (targetTask) {
        const updatedTaskNotes = (targetTask.notes || []).map((item) =>
          item.id === noteId ? { ...item, text } : item
        );
        onUpdateTask?.(topic.id, { ...targetTask, notes: updatedTaskNotes });
        showToast?.('Task note updated');
      }
    } else if (isTopicNote || activeHeaderTab === 'notes') {
      const updatedTopicNotes = (topic.notes || []).map((item) =>
        item.id === noteId ? { ...item, text } : item
      );
      onUpdateTopic?.({ ...topic, notes: updatedTopicNotes });
      showToast?.('Topic note updated');
    } else if (activeTask) {
      const updatedTaskNotes = (activeTask.notes || []).map((item) =>
        item.id === noteId ? { ...item, text } : item
      );
      onUpdateTask?.(topic.id, { ...activeTask, notes: updatedTaskNotes });
      showToast?.('Task note updated');
    }
    setEditingNoteId(null);
    setEditingNoteInput('');
  };

  const togglePinNote = (noteId: string, isTopicNote?: boolean, taskId?: string) => {
    if (!topic) return;
    if (taskId) {
      const targetTask = (topic.tasks || []).find((t) => t.id === taskId);
      if (targetTask) {
        const updatedNotes = (targetTask.notes || []).map((item) =>
          item.id === noteId ? { ...item, isPinned: !item.isPinned } : item
        );
        onUpdateTask?.(topic.id, { ...targetTask, notes: updatedNotes });
        const target = updatedNotes.find((item) => item.id === noteId);
        showToast?.(target?.isPinned ? '📌 Note pinned to top' : 'Note unpinned');
      }
    } else if (isTopicNote || activeHeaderTab === 'notes') {
      const updatedTopicNotes = (topic.notes || []).map((item) =>
        item.id === noteId ? { ...item, isPinned: !item.isPinned } : item
      );
      onUpdateTopic?.({ ...topic, notes: updatedTopicNotes });
      const target = updatedTopicNotes.find((item) => item.id === noteId);
      showToast?.(target?.isPinned ? '📌 Topic note pinned to top' : 'Topic note unpinned');
    } else if (activeTask) {
      const updatedTaskNotes = (activeTask.notes || []).map((item) =>
        item.id === noteId ? { ...item, isPinned: !item.isPinned } : item
      );
      onUpdateTask?.(topic.id, { ...activeTask, notes: updatedTaskNotes });
      const target = updatedTaskNotes.find((item) => item.id === noteId);
      showToast?.(target?.isPinned ? '📌 Note pinned to top' : 'Note unpinned');
    }
    setOpenNoteMenuId(null);
  };

  const addLink = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const rawUrl = newLinkUrl.trim();
    if (!rawUrl || !topic) return;
    let finalUrl = rawUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }
    const title = newLinkTitle.trim() || getAutoLinkTitle(finalUrl);
    const newLinkItem: ResourceLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      url: finalUrl,
      type: detectLinkType(finalUrl, title),
    };

    if (activeHeaderTab === 'files' || mobileLinkTarget === 'topic') {
      const updatedTopicLinks = [...(topic.links || []), newLinkItem];
      onUpdateTopic?.({ ...topic, links: updatedTopicLinks });
      showToast?.('Link added to topic');
    } else if (activeTask) {
      const updatedLinks = [...(activeTask.links || []), newLinkItem];
      onUpdateTask?.(topic.id, { ...activeTask, links: updatedLinks });
      showToast?.('Link added to task');
    }

    setNewLinkTitle('');
    setNewLinkUrl('');
    setIsAddingLink(false);
    setIsMobileLinkModalOpen(false);
  };

  const deleteLinkItem = (linkId: string) => {
    if (!topic) return;
    if (activeHeaderTab === 'files' || (topic.links || []).some((l) => l.id === linkId)) {
      const deletedLink = (topic.links || []).find((l) => l.id === linkId);
      const updatedTopicLinks = (topic.links || []).filter((item) => item.id !== linkId);
      onUpdateTopic?.({ ...topic, links: updatedTopicLinks });
      if (deletedLink) {
        if (onSoftDeleteLinkItem) {
          onSoftDeleteLinkItem(deletedLink, {
            topicId: topic.id,
            topicTitle: topic.title,
            workspaceId: topic.workspaceId
          });
        }
        showToast?.(
          'Topic link moved to Recycle Bin',
          () => {
            const restoredLinks = [...updatedTopicLinks, deletedLink];
            onUpdateTopic?.({ ...topic, links: restoredLinks });
            showToast?.('Restored topic link');
          },
          6000
        );
      }
    } else if (activeTask) {
      const deletedLink = (activeTask.links || []).find((l) => l.id === linkId);
      const updatedLinks = (activeTask.links || []).filter((item) => item.id !== linkId);
      onUpdateTask?.(topic.id, { ...activeTask, links: updatedLinks });
      if (deletedLink) {
        if (onSoftDeleteLinkItem) {
          onSoftDeleteLinkItem(deletedLink, {
            topicId: topic.id,
            topicTitle: topic.title,
            workspaceId: topic.workspaceId,
            taskId: activeTask.id,
            taskTitle: activeTask.title
          });
        }
        showToast?.(
          'Link moved to Recycle Bin',
          () => {
            const restoredLinks = [...updatedLinks, deletedLink];
            onUpdateTask?.(topic.id, { ...activeTask, links: restoredLinks });
            showToast?.('Restored link');
          },
          6000
        );
      }
    }
  };

  const handleStartEditLink = (l: ResourceLink, target: 'task' | 'topic' = 'task') => {
    setEditingLinkId(l.id);
    setEditingLinkTitle(l.title);
    setEditingLinkUrl(l.url);
    if (isMobileDevice) {
      setMobileLinkTarget(target);
      setIsMobileLinkModalOpen(true);
    }
  };

  const handleSaveEditedLink = (linkId: string) => {
    if (!topic) return;
    const rawUrl = editingLinkUrl.trim();
    if (!rawUrl) return;
    let finalUrl = rawUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }
    const title = editingLinkTitle.trim() || getAutoLinkTitle(finalUrl);

    if (activeHeaderTab === 'files' || (topic.links || []).some((item) => item.id === linkId)) {
      const updatedTopicLinks = (topic.links || []).map((item) =>
        item.id === linkId
          ? { ...item, title, url: finalUrl, type: detectLinkType(finalUrl, title) }
          : item
      );
      onUpdateTopic?.({ ...topic, links: updatedTopicLinks });
      setEditingLinkId(null);
      setIsMobileLinkModalOpen(false);
      setEditingLinkTitle('');
      setEditingLinkUrl('');
      setNewLinkTitle('');
      setNewLinkUrl('');
      showToast?.('Topic link updated successfully');
    } else if (activeTask) {
      const updatedLinks = (activeTask.links || []).map((item) =>
        item.id === linkId
          ? { ...item, title, url: finalUrl, type: detectLinkType(finalUrl, title) }
          : item
      );
      onUpdateTask?.(topic.id, { ...activeTask, links: updatedLinks });
      setEditingLinkId(null);
      setIsMobileLinkModalOpen(false);
      setEditingLinkTitle('');
      setEditingLinkUrl('');
      setNewLinkTitle('');
      setNewLinkUrl('');
      showToast?.('Link updated successfully');
    }
  };

  const handleCopyLink = (linkId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkId(linkId);
    showToast?.('Link URL copied to clipboard');
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!activeTask || !topic) return;
    const currentList = activeTask.subtasks || [];
    const updatedSubtasks = currentList.map((item) =>
      item.id === subtaskId ? { ...item, completed: !item.completed } : item
    );
    onUpdateTask?.(topic.id, { ...activeTask, subtasks: updatedSubtasks });
    const toggledItem = updatedSubtasks.find((s) => s.id === subtaskId);
    if (toggledItem?.completed) {
      const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);
      if (allDone) {
        showToast?.('All subtasks completed! 🎉 Great work!');
      }
    }
  };

  const handleAddSubtaskSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSubtaskTitle.trim();
    if (!trimmed) {
      setIsAddingSubtask(false);
      return;
    }
    if (!activeTask || !topic) return;
    const currentList = activeTask.subtasks || [];
    const newItem: ChecklistItem = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: trimmed,
      completed: false,
    };
    const updatedSubtasks = [...currentList, newItem];
    onUpdateTask?.(topic.id, { ...activeTask, subtasks: updatedSubtasks });
    setNewSubtaskTitle('');
    // Auto-focus next line for rapid continuous typing
    setTimeout(() => {
      subtaskInputRef.current?.focus();
    }, 40);
  };

  const handleSaveEditedSubtask = (subtaskId: string) => {
    if (!activeTask || !topic) return;
    const trimmed = editingSubtaskTitle.trim();
    if (!trimmed) {
      setEditingSubtaskId(null);
      return;
    }
    const currentList = activeTask.subtasks || [];
    const updatedSubtasks = currentList.map((item) =>
      item.id === subtaskId ? { ...item, title: trimmed } : item
    );
    onUpdateTask?.(topic.id, { ...activeTask, subtasks: updatedSubtasks });
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!activeTask || !topic) return;
    const currentList = activeTask.subtasks || [];
    const deletedSubtask = currentList.find((item) => item.id === subtaskId);
    const updatedSubtasks = currentList.filter((item) => item.id !== subtaskId);
    onUpdateTask?.(topic.id, { ...activeTask, subtasks: updatedSubtasks });
    if (deletedSubtask) {
      showToast?.(
        'Subtask removed',
        () => {
          const restored = [...updatedSubtasks, deletedSubtask];
          onUpdateTask?.(topic.id, { ...activeTask, subtasks: restored });
          showToast?.('Restored subtask');
        },
        6000
      );
    }
  };

  const renameTopic = () => {
    const nextName = window.prompt('Rename topic', topic.title)?.trim();
    if (!nextName || nextName === topic.title) return;
    onRenameTopic?.(topic.id, nextName);
    setTopicMenuOpen(false);
  };

  const deleteTopic = () => {
    const confirmed = window.confirm(`Delete "${topic.title}"? This action cannot be undone.`);
    if (!confirmed) return;
    onDeleteTopic?.(topic.id);
    setTopicMenuOpen(false);
    onClose();
  };

  const handleMacScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.classList.add('is-scrolling');
    const timerId = target.getAttribute('data-scroll-timer');
    if (timerId) clearTimeout(parseInt(timerId, 10));
    const newTimer = window.setTimeout(() => {
      target.classList.remove('is-scrolling');
    }, 1000);
    target.setAttribute('data-scroll-timer', newTimer.toString());
  };
  const displayTaskTitle = activeTask?.title || 'No task selected';

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-4 md:p-5 overflow-hidden overscroll-none touch-none font-['Inter',sans-serif]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}
            onClick={onClose}
            className="absolute inset-0 cursor-pointer bg-slate-900/35 backdrop-blur-[2px] touch-none"
          />

          {/* Modal Outer Window Container (Full Screen on Mobile, Windowed on Desktop) */}
          <motion.aside
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}
            className="relative z-10 flex h-[100dvh] sm:h-[94vh] max-h-none sm:max-h-[calc(100vh-1.5rem)] min-h-0 sm:min-h-[480px] w-full max-w-[1178px] flex-col rounded-none sm:rounded-xl border-0 sm:border border-slate-200/80 bg-white text-slate-900 shadow-2xl shadow-slate-900/15 my-auto overflow-hidden"
          >
            {/* ==================== 1. TOPIC HEADER (Ultra-Premium & Modern UI) ==================== */}
            <div className="shrink-0 bg-white px-4 sm:px-6 pt-3.5 pb-3.5 sm:pt-4 sm:pb-4 flex flex-col gap-3.5 sm:gap-4 border-b border-slate-200/70 relative z-30 rounded-none sm:rounded-t-xl">
              {/* Header Top Row */}
              <div className="flex items-start justify-between gap-4 relative z-30">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* World-Class Gradient Icon Box with Glow (Theme-matched) */}
                  <div className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${theme?.cardIconBg || 'bg-gradient-to-tr from-[#176BFF] via-[#4F46E5] to-[#7C36F5]'} text-white shadow-md shadow-blue-500/15 ring-1 ring-white/30`}>
                    {theme?.iconText ? (
                      <span className="text-white text-xl font-black font-serif leading-none">{theme.iconText}</span>
                    ) : theme?.icon ? (
                      (() => {
                        const IconComponent = theme.icon;
                        return <IconComponent className="w-6 h-6 stroke-[2.2] text-white" />;
                      })()
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current sm:w-6 sm:h-6">
                        <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.75" strokeDasharray="3 3" />
                        <circle cx="12" cy="12" r="3" fill="white" />
                        <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  {/* Title, Subtitles & Progress Indicator */}
                  <div className="flex flex-col min-w-0 justify-center">
                    <h2 className="text-[15px] sm:text-[17px] font-semibold font-serif text-[#0F172A] tracking-normal truncate leading-snug">
                      {topic.title || 'Physics'}
                    </h2>

                    {/* Subtitle Badges & Metrics (Task on line 1, Done & Due together on line 2 on Mobile) */}
                    <div className="mt-0.5 sm:mt-1.5 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3.5 text-[10.5px] sm:text-xs font-medium text-slate-500">
                      {/* Line 1: Total Tasks */}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-slate-700 font-semibold shrink-0">
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${theme?.bg || 'bg-[#176BFF]'} shrink-0`} />
                        <span>{tasksList.length} {tasksList.length === 1 ? 'Task' : 'Tasks'}</span>
                      </div>

                      {/* Line 2 on Mobile: Done & Due side-by-side */}
                      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-600 font-semibold">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{tasksList.filter((t) => t.completed).length} <span className="hidden sm:inline">Completed</span><span className="sm:hidden">Done</span></span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 text-red-500 font-semibold">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 shrink-0" />
                          <span>{tasksList.filter((t) => !t.completed).length} Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Right Action Buttons & Progress Widget (Tightened Gap & Clean Compact Roundness) */}
                <div className="flex flex-col items-end sm:flex-row sm:items-center gap-1.5 sm:gap-2 shrink-0 self-start -mt-0.5 relative z-30">
                  {/* Progress Pill Bar */}
                  <div className="flex items-center gap-2 h-6 px-2.5 sm:h-7.5 sm:px-2.5 bg-white border border-slate-200/80 rounded-md sm:rounded-lg shadow-2xs order-2 sm:order-1">
                    <div className="w-20 sm:w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${theme?.progressGradient || 'from-[#176BFF] via-[#7C36F5] to-[#D946EF]'} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">{percent}%</span>
                  </div>

                  {/* Top Action Buttons (Pin, More, Close - Tightened Gap & Subtle Roundness) */}
                  <div className="flex items-center gap-1 order-1 sm:order-2">
                    <button
                      type="button"
                      onClick={() => onTogglePin?.(topic.id)}
                      className={`flex h-6.5 px-2 sm:h-7.5 sm:px-2.5 items-center justify-center gap-1.5 rounded-md sm:rounded-lg border text-[11px] sm:text-xs font-semibold transition-all shadow-2xs ${topic.isPinned
                        ? 'border-blue-200 text-[#176BFF] bg-blue-50/80 font-bold'
                        : 'border-slate-200/90 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      title={topic.isPinned ? 'Unpin topic' : 'Pin topic'}
                    >
                      <Pin className={`h-3 w-3 shrink-0 ${topic.isPinned ? 'fill-current' : ''}`} />
                      <span>{topic.isPinned ? 'Pinned' : 'Pin'}</span>
                    </button>

                    <div ref={topicMenuContainerRef} className="relative z-[999]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTopicMenuOpen((prev) => !prev);
                        }}
                        className={`flex h-6.5 w-6.5 sm:h-7.5 sm:w-7.5 items-center justify-center rounded-md sm:rounded-lg border transition-all shadow-2xs cursor-pointer ${topicMenuOpen ? 'border-blue-200 text-[#176BFF] bg-blue-50/80' : 'border-slate-200/90 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                          }`}
                      >
                        <MoreHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </button>
                      <AnimatePresence>
                        {topicMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.12, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 sm:top-9 z-[9999999] w-48 overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1.5 shadow-2xl shadow-slate-900/20"
                          >
                            {/* 1. Rename */}
                            <button
                              type="button"
                              onClick={() => {
                                setTopicMenuOpen(false);
                                if (topic && onStartRenameTopic) {
                                  onStartRenameTopic(topic);
                                } else {
                                  renameTopic();
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">Rename</span>
                            </button>

                            {/* 1.5 Customize Icon & Color */}
                            {onOpenCustomizer && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTopicMenuOpen(false);
                                  onOpenCustomizer();
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                              >
                                <Palette className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                <span className="truncate">Customize Icon & Color</span>
                              </button>
                            )}

                            {/* 2. Merge Topic */}
                            <button
                              type="button"
                              onClick={() => {
                                setTopicMenuOpen(false);
                                if (topic && onMergeTopic) {
                                  onMergeTopic(topic);
                                } else if (showToast) {
                                  showToast('Opened Merge Topic dialog');
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                            >
                              <CornerUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">Merge Topic</span>
                            </button>

                            {/* 3. Move to section */}
                            <button
                              type="button"
                              onClick={() => {
                                setTopicMenuOpen(false);
                                if (topic && onMoveSectionTopic) {
                                  onMoveSectionTopic(topic);
                                } else if (showToast) {
                                  showToast('Opened Move to Section dialog');
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                            >
                              <FolderOutput className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">Move to section</span>
                            </button>

                            {/* 4. Duplicate */}
                            <button
                              type="button"
                              onClick={() => {
                                setTopicMenuOpen(false);
                                if (topic && onDuplicateTopic) {
                                  onDuplicateTopic(topic.id);
                                } else if (showToast) {
                                  showToast('Topic duplicated successfully');
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">Duplicate</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            {/* 5. Move to Bin */}
                            <button
                              type="button"
                              onClick={() => {
                                setTopicMenuOpen(false);
                                deleteTopic();
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="truncate">Move to Bin</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      type="button"
                      onClick={() => withUnsavedGuard(onClose)}
                      className="flex h-6.5 w-6.5 sm:h-7.5 sm:w-7.5 items-center justify-center rounded-md sm:rounded-lg border border-slate-200/90 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-2xs cursor-pointer"
                    >
                      <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tab Navigation (Ultra-Minimal Clean Sliding Control) */}
            <div className="sm:hidden px-3 py-1.5 bg-[#FAFBFD] border-b border-slate-200/70 shrink-0 z-20">
              <div className="flex items-center justify-between relative select-none">
                {[
                  { id: 'tasks', label: 'Tasks', icon: LayoutGrid },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'files', label: 'Files', icon: Paperclip },
                  { id: 'activity', label: 'Activity', icon: Bell }
                ].map((tab) => {
                  const isActive = activeHeaderTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        withUnsavedGuard(() => {
                          setActiveHeaderTab(tab.id as HeaderTab);
                          if (tab.id === 'tasks') {
                            setMobileActiveView('list');
                          } else {
                            setMobileActiveView('details');
                          }
                        });
                      }}
                      className={`relative py-1.5 px-3 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 z-10 ${isActive
                        ? 'text-[#176BFF]'
                        : 'text-slate-500 hover:text-slate-800 font-medium'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-segmented-active-pill"
                          className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80 z-[-1]"
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                      <tab.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#176BFF] stroke-[2.2]' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================== 2. MAIN BODY (TWO COLUMNS) ==================== */}
            <div className="flex-1 overflow-hidden flex flex-row bg-white rounded-none sm:rounded-b-xl">
              {/* LEFT COLUMN: Tasks List Panel (Visible on Mobile when mobileActiveView === 'list') */}
              <div
                className={`${mobileActiveView === 'details' ? 'hidden sm:flex' : 'flex'
                  } w-full sm:w-[46%] max-w-full sm:max-w-[520px] min-w-0 sm:min-w-[340px] md:min-w-[420px] shrink-0 border-r-0 sm:border-r border-slate-200/80 bg-white flex-col rounded-none sm:rounded-bl-xl overflow-hidden`}
              >
                <div className="flex-1 flex flex-col p-4 sm:p-5 gap-3 min-h-0 overflow-hidden">

                  {/* Search & Filter Control Bar */}
                  <div className="flex items-center gap-2 px-0.5">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="search"
                        id="drawer-task-search-input"
                        name="task-search-field"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck="false"
                        inputMode="search"
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search tasks..."
                        className="w-full h-9 bg-white border border-slate-200/90 rounded-[8px] pl-9 pr-24 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#176BFF] transition-all [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                      />
                      {searchQuery.length > 0 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-20">
                          <span className="text-[10.5px] text-slate-400 font-semibold mr-1 select-none">
                            {matchingTaskIndices.length > 0 ? `${currentSearchMatchIndex + 1}/${matchingTaskIndices.length}` : '0/0'}
                          </span>
                          <button
                            type="button"
                            onClick={goToPrevMatch}
                            className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Previous match (Shift+Enter)"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={goToNextMatch}
                            className="p-0.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                            title="Next match (Enter)"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setCurrentSearchMatchIndex(0);
                            }}
                            className="p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer ml-0.5"
                            title="Clear search (Esc)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="relative" ref={taskFilterRef}>
                      <button
                        type="button"
                        onClick={() => setIsTaskFilterOpen(!isTaskFilterOpen)}
                        className="h-9 px-3 bg-white border border-slate-200 rounded-[8px] text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <Filter className="w-3.5 h-3.5 text-slate-500" />
                        <span>Filter</span>
                      </button>

                      <AnimatePresence>
                        {isTaskFilterOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.82, x: 10, y: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, x: 8, y: -8 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{ transformOrigin: 'top right' }}
                            className="absolute right-0 top-full mt-1.5 w-44 rounded-[8px] border border-slate-200 bg-white p-1 shadow-xl z-50 select-none origin-top-right"
                          >
                            {[
                              { mode: 'all' as FilterMode, label: 'All Tasks', count: tasksList.length },
                              { mode: 'in_progress' as FilterMode, label: 'Pending', count: dueCount },
                              { mode: 'completed' as FilterMode, label: 'Completed', count: completedCount },
                            ].map(({ mode, label, count }) => (
                              <button
                                key={mode}
                                onClick={() => {
                                  setFilterMode(mode);
                                  setIsTaskFilterOpen(false);
                                }}
                                className={`flex w-full items-center justify-between rounded-[6px] px-3 py-2 text-xs transition-colors cursor-pointer ${filterMode === mode
                                  ? 'bg-blue-50 text-blue-600 font-bold'
                                  : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <span>{label}</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500">
                                    {count}
                                  </span>
                                </span>
                                {filterMode === mode && <Check className="w-3.5 h-3.5 text-blue-600" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Section Title & Selection Bar Header Row */}
                  <div className="flex items-center gap-3 my-0.5 select-none min-h-[20px] px-0.5">
                    <AnimatePresence mode="wait" initial={false}>
                      {isSelectionMode ? (
                        <motion.div
                          key="selection-bar"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center justify-between w-full"
                        >
                          <button
                            type="button"
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isAllFilteredSelected
                                ? 'bg-[#176BFF] text-white'
                                : selectedTaskIds.length > 0
                                  ? 'bg-slate-100 text-[#176BFF]'
                                  : 'border-slate-300 hover:border-slate-400 bg-white'
                                }`}
                              style={{ borderColor: isAllFilteredSelected ? '#176BFF' : selectedTaskIds.length > 0 ? '#176BFF' : undefined }}
                            >
                              {isAllFilteredSelected ? (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              ) : selectedTaskIds.length > 0 ? (
                                <div className="w-2 h-0.5 bg-[#176BFF] rounded-full" />
                              ) : null}
                            </div>
                            <span className="text-xs font-bold text-slate-700">
                              {selectedTaskIds.length > 0
                                ? `Selected (${selectedTaskIds.length}/${filteredTasks.length})`
                                : 'Select All'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsSelectionMode(false);
                              setSelectedTaskIds([]);
                            }}
                            className="text-xs font-bold text-[#176BFF] hover:underline cursor-pointer"
                          >
                            Done
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="static-bar"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center justify-between w-full"
                        >
                          <span className="text-xs font-bold text-slate-800 tracking-tight">
                            {searchQuery.trim().length > 0
                              ? `Search Results (${filteredTasks.length})`
                              : filterMode === 'all'
                                ? `All Tasks (${filteredTasks.length})`
                                : filterMode === 'completed'
                                  ? `Completed Tasks (${filteredTasks.length})`
                                  : `Pending Tasks (${filteredTasks.length})`}
                          </span>

                          {tasksList.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setIsSelectionMode(true)}
                              className="text-xs font-semibold text-slate-500 hover:text-[#176BFF] transition-colors cursor-pointer"
                            >
                              Select
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Middle Scrollable Task List / Empty State Container */}
                  <div
                    onScroll={handleMacScroll}
                    className="flex-1 min-h-0 overflow-y-auto mac-scrollbar pr-0.5 space-y-2"
                  >
                    {/* Task List Items (Grouped Box Container) */}
                    {filteredTasks.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center border border-dashed border-slate-200/90 rounded-xl bg-slate-50/50 my-1 select-none min-h-[220px] mx-0.5">
                        <FileText className="w-7 h-7 text-slate-300 mb-2" />
                        <p className="text-xs font-semibold text-slate-600">No tasks found</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-1">
                          {searchQuery ? 'Try adjusting your search query or filter.' : 'Click "+ Add Task" below to add your first task to this topic.'}
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-visible mx-0.5">
                        {filteredTasks.map((t, idx) => {
                          const isSelected = activeTask?.id === t.id && activeHeaderTab === 'tasks';
                          const isLast = idx === filteredTasks.length - 1;
                          const isOrangeMatch = matchingTaskIndices.length > 0 && matchingTaskIndices[currentSearchMatchIndex] === idx;

                          // Highlight helper function for search matches
                          const renderHighlightedTitle = (title: string, query: string, isOrange: boolean) => {
                            if (!query.trim()) return title;
                            const q = query.trim();
                            const lowerTitle = title.toLowerCase();
                            const lowerQuery = q.toLowerCase();
                            const matchIndex = lowerTitle.indexOf(lowerQuery);

                            if (matchIndex === -1) return title;

                            const before = title.slice(0, matchIndex);
                            const matched = title.slice(matchIndex, matchIndex + q.length);
                            const after = title.slice(matchIndex + q.length);

                            const bgClass = isOrange
                              ? 'bg-orange-500 text-white font-bold'
                              : 'bg-yellow-300 text-slate-950 font-bold';

                            return <>{before}<mark className={`${bgClass} m-0 px-0.5 rounded-[2px] inline leading-tight`}>{matched}</mark>{after}</>;
                          };

                          const isEditingThisTask = editingTaskId === t.id;
                          const isMenuOpenThisTask = activeTaskMenuId === t.id;

                          // Deep Search Match Snippet helper
                          const q = searchQuery.trim().toLowerCase();
                          const titleMatched = q && t.title.toLowerCase().includes(q);
                          const noteMatch = q && !titleMatched ? (t.notes || []).find((n) => n.text.toLowerCase().includes(q)) : null;
                          const descMatch = q && !titleMatched && !noteMatch && (t.description || '').toLowerCase().includes(q) ? t.description : null;
                          const linkMatch = q && !titleMatched && !noteMatch && !descMatch ? (t.links || []).find((l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)) : null;

                          return (
                            <div
                              key={t.id}
                              onClick={(e) => {
                                if (e.ctrlKey || e.metaKey) {
                                  e.stopPropagation();
                                  setIsSelectionMode(true);
                                  toggleSelectTask(t.id);
                                } else {
                                  withUnsavedGuard(() => {
                                    setSelectedTaskId(t.id);
                                    setActiveHeaderTab('tasks');
                                    setMobileActiveView('details');
                                  });
                                }
                              }}
                              className={`group relative transition-colors duration-150 cursor-pointer flex items-center justify-between gap-3 text-xs min-h-[48px] py-1.5 pl-3.5 pr-3 ${!isLast ? 'border-b border-slate-100' : ''
                                } ${highlightPulseTaskId === t.id
                                  ? 'ring-2 ring-[#2563EB] bg-blue-50/90 dark:bg-blue-950/70 shadow-md shadow-blue-500/25 animate-pulse rounded-[5px] z-20'
                                  : isMenuOpenThisTask
                                  ? 'z-[9999] relative bg-white'
                                  : isSelected
                                    ? 'bg-[#EFF6FF] text-[#0F172A] font-bold rounded-[5px] z-10'
                                    : 'hover:bg-slate-50 text-slate-700 bg-white'
                                }`}
                            >

                              <div className="flex items-center min-w-0 flex-1 pl-1 overflow-hidden">
                                {/* Multi-Select Checkbox Container (Continuous 60 FPS animation for Open and Close) */}
                                <motion.div
                                  initial={false}
                                  animate={{
                                    width: isSelectionMode ? 16 : 0,
                                    opacity: isSelectionMode ? 1 : 0,
                                    marginRight: isSelectionMode ? 10 : 0,
                                  }}
                                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden shrink-0 flex items-center justify-center"
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => toggleSelectTask(t.id, e, idx)}
                                    className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center cursor-pointer ${selectedTaskIds.includes(t.id)
                                      ? 'bg-[#176BFF] text-white'
                                      : 'border-slate-300 hover:border-slate-400 bg-white'
                                      }`}
                                    style={{ borderColor: selectedTaskIds.includes(t.id) ? '#176BFF' : undefined }}
                                    title="Select task for bulk actions"
                                  >
                                    {selectedTaskIds.includes(t.id) && <Check className="w-3 h-3 stroke-[3]" />}
                                  </button>
                                </motion.div>

                                {/* Task Content Container */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleTaskWithShift(t.id, idx, e);
                                    }}
                                    className="shrink-0 flex items-center justify-center cursor-pointer"
                                  >
                                    {t.completed ? (
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#22C55E" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" fill="#22C55E" />
                                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ) : isSelected ? (
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9" stroke="#176BFF" strokeWidth="2.2" />
                                        <circle cx="12" cy="12" r="4" fill="#176BFF" />
                                      </svg>
                                    ) : (
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9" stroke="#CBD5E1" strokeWidth="2" />
                                      </svg>
                                    )}
                                  </button>

                                  {/* Inline Rename or Static Title */}
                                  {isEditingThisTask ? (
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        if (editingTaskTitle.trim()) {
                                          onRenameTask?.(topic.id, t.id, editingTaskTitle.trim());
                                        }
                                        setEditingTaskId(null);
                                      }}
                                      className="flex items-center gap-1.5 flex-1 min-w-0 pr-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        ref={(el) => {
                                          renameInputRef.current = el;
                                          if (el && el !== document.activeElement) {
                                            el.focus();
                                            requestAnimationFrame(() => {
                                              if (el) {
                                                el.setSelectionRange(0, el.value.length);
                                              }
                                            });
                                          }
                                        }}
                                        type="text"
                                        value={editingTaskTitle}
                                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                                        onClick={(e) => {
                                          const input = e.currentTarget;
                                          if (input.selectionStart !== input.selectionEnd) {
                                            const cursorPos = input.selectionEnd || input.value.length;
                                            input.setSelectionRange(cursorPos, cursorPos);
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setEditingTaskId(null);
                                          }
                                        }}
                                        className="flex-1 min-w-0 task-item-font font-[600] text-slate-800 bg-white border border-[#176BFF] ring-2 ring-blue-100/80 rounded-md px-2.5 py-1 text-xs outline-none shadow-2xs"
                                      />
                                      <button
                                        type="submit"
                                        className="p-1 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                                        title="Save (Enter)"
                                      >
                                        <Check className="w-4 h-4 stroke-[2.5]" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingTaskId(null)}
                                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                                        title="Cancel (Esc)"
                                      >
                                        <X className="w-4 h-4 stroke-[2.2]" />
                                      </button>
                                    </form>
                                  ) : (
                                    <div className="flex flex-col min-w-0 flex-1">
                                      <span className={`truncate task-item-font ${isSelected ? 'font-[600] text-[#0F172A]' : 'font-[450] text-slate-800'}`}>
                                        {renderHighlightedTitle(t.title, searchQuery, isOrangeMatch)}
                                      </span>
                                      {noteMatch && (
                                        <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50/90 rounded px-1.5 py-0.5 mt-0.5 truncate max-w-full font-medium">
                                          <span className="font-bold shrink-0">Note:</span>
                                          <span className="truncate">{renderHighlightedTitle(noteMatch.text, searchQuery, isOrangeMatch)}</span>
                                        </span>
                                      )}
                                      {descMatch && (
                                        <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50/90 rounded px-1.5 py-0.5 mt-0.5 truncate max-w-full font-medium">
                                          <span className="font-bold shrink-0">Desc:</span>
                                          <span className="truncate">{renderHighlightedTitle(descMatch, searchQuery, isOrangeMatch)}</span>
                                        </span>
                                      )}
                                      {linkMatch && (
                                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50/90 rounded px-1.5 py-0.5 mt-0.5 truncate max-w-full font-medium">
                                          <span className="font-bold shrink-0">Link:</span>
                                          <span className="truncate">{renderHighlightedTitle(linkMatch.title, searchQuery, isOrangeMatch)}</span>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {!isEditingThisTask && (
                                <div className="flex items-center gap-3 shrink-0">
                                  {activeTimerTaskId === t.id && (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-[#176BFF] border border-blue-200 text-[10.5px] font-mono font-extrabold shrink-0 shadow-2xs">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#176BFF] shrink-0" />
                                      <span>{`${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(timerSeconds % 60).padStart(2, '0')}`}</span>
                                    </span>
                                  )}

                                  {t.completed && (
                                    <div className="flex flex-col items-end shrink-0 justify-center gap-[1px]">
                                      <span className="text-[11.5px] font-bold text-[#22C55E] leading-tight">
                                        Completed
                                      </span>
                                      <span className="text-[11px] font-medium text-slate-400 leading-tight">
                                        {t.completedAt || 'May 18, 3:40 PM'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2.5 text-slate-400">
                                    {t.priority && t.priority !== 'none' && (
                                      <Flag
                                        className={`w-3.5 h-3.5 ${PRIORITY_CONFIG[t.priority]?.text || 'text-rose-500'} ${PRIORITY_CONFIG[t.priority]?.fill || 'fill-rose-500'}`}
                                        title={`Priority: ${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}`}
                                      />
                                    )}
                                    {t.notes && t.notes.length > 0 && (
                                      <FileText className="w-4 h-4 text-[#176BFF]" title={`${t.notes.length} note(s)`} />
                                    )}
                                    {t.links && t.links.length > 0 && (
                                      <LinkIcon className="w-4 h-4 text-indigo-500" title={`${t.links.length} link(s)`} />
                                    )}

                                    {!isSelectionMode && (
                                      <div data-task-menu className="relative">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const spaceBelow = window.innerHeight - rect.bottom;
                                            setTaskMenuPlacement(spaceBelow < 170 ? 'top' : 'bottom');
                                            setActiveTaskMenuId((prev) => (prev === t.id ? null : t.id));
                                          }}
                                          className={`p-1 rounded transition-colors cursor-pointer ${isMenuOpenThisTask ? 'text-[#176BFF] bg-blue-50' : 'hover:text-slate-700 hover:bg-slate-100'
                                            }`}
                                          title="Task options"
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>

                                        <AnimatePresence>
                                          {isMenuOpenThisTask && (
                                            <motion.div
                                              initial={{ opacity: 0, scale: 0.95, y: taskMenuPlacement === 'top' ? 4 : -4 }}
                                              animate={{ opacity: 1, scale: 1, y: 0 }}
                                              exit={{ opacity: 0, scale: 0.95, y: taskMenuPlacement === 'top' ? 4 : -4 }}
                                              transition={{ duration: 0.12, ease: 'easeOut' }}
                                              onClick={(e) => e.stopPropagation()}
                                              className={`absolute right-0 w-[185px] whitespace-nowrap bg-white border border-slate-200 shadow-xl backdrop-blur-md rounded-xl p-1 z-[9999999] text-xs font-medium text-slate-700 select-none ${taskMenuPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                                                }`}
                                            >
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveTaskMenuId(null);
                                                  setEditingTaskId(t.id);
                                                  setEditingTaskTitle(t.title);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                                              >
                                                <Edit3 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span className="truncate">Rename</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveTaskMenuId(null);
                                                  setTaskToDelete(t);
                                                }}
                                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                              >
                                                <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                <span className="truncate">Move to Recycle Bin</span>
                                              </button>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bottom Row of Left Column - Fixed & Always Visible */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100/90 dark:border-slate-800 shrink-0 select-none">
                    {isAddingTask ? (
                      <div className="flex items-center gap-2 flex-1">
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
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              createTask();
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsAddingTask(false);
                              setNewTaskTitle('');
                            }
                          }}
                          placeholder="Task name..."
                          className="min-w-0 flex-1 task-item-font font-[450] text-xs text-slate-800 dark:text-slate-100 rounded-lg border border-blue-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 h-8 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                        />
                        <button
                          type="button"
                          onClick={() => createTask()}
                          className="h-8 px-3 rounded-lg bg-[#176BFF] text-xs font-bold text-white cursor-pointer hover:bg-blue-600 transition-colors shrink-0"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTask(false);
                            setNewTaskTitle('');
                          }}
                          className="h-8 px-2.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingTask(true)}
                          className="h-8 px-3 bg-[#176BFF] text-white rounded-lg text-xs font-bold hover:bg-blue-600 inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Task</span>
                        </button>

                        <div className="relative inline-flex items-center shrink-0" ref={markMenuRef}>
                          <div className="inline-flex items-center overflow-hidden rounded-lg text-white shadow-xs transition-colors bg-[#176BFF] hover:bg-blue-600">
                            <button
                              type="button"
                              onClick={toggleSelectionMode}
                              className="h-8 px-2.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-black/10 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>{selectedTaskIds.length > 0 ? `Mark (${selectedTaskIds.length})` : 'Mark'}</span>
                            </button>

                            <div className="w-[1px] h-4 bg-white/25 shrink-0" />

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsMarkMenuOpen(!isMarkMenuOpen);
                              }}
                              className="px-2.5 py-2 text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
                              title="Mark options"
                            >
                              <ChevronUp className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-150 ${isMarkMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          <AnimatePresence>
                            {isMarkMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute left-0 bottom-full mb-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 space-y-1 select-none"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleSelectAll();
                                    setIsMarkMenuOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#176BFF] rounded-lg transition-colors cursor-pointer text-left"
                                >
                                  <span className="flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-[#176BFF]" />
                                    Mark All Tasks
                                  </span>
                                  {isAllFilteredSelected && <Check className="w-3.5 h-3.5 text-[#176BFF] stroke-[3]" />}
                                </button>

                                {/* 2. Deselect All */}
                                {selectedTaskIds.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTaskIds([]);
                                      setIsSelectionMode(false);
                                      setIsMarkMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer text-left"
                                  >
                                    <span className="flex items-center gap-2">
                                      <X className="w-3.5 h-3.5 text-slate-400" />
                                      Deselect All
                                    </span>
                                  </button>
                                )}

                                {/* Bulk Actions inside Up Arrow menu when tasks are selected */}
                                {selectedTaskIds.length > 0 && (
                                  <>
                                    <div className="my-1 border-t border-slate-100" />

                                    <div className="px-2.5 py-1 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                      Bulk Actions ({selectedTaskIds.length})
                                    </div>

                                    {/* Complete Selected */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleBulkComplete(true);
                                        setIsMarkMenuOpen(false);
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer text-left"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Mark Completed</span>
                                    </button>

                                    {/* Pending Selected */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleBulkComplete(false);
                                        setIsMarkMenuOpen(false);
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer text-left"
                                    >
                                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Mark Pending</span>
                                    </button>

                                    {/* Delete Selected */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsBulkDeleteTaskConfirmOpen(true);
                                        setIsMarkMenuOpen(false);
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                      <span>Delete Selected</span>
                                    </button>
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Task Details Panel (Full Plain White Background) */}
              <div
                className={`${mobileActiveView === 'details' ? 'flex' : 'hidden sm:flex'
                  } flex-1 bg-white border-l border-slate-200/70 flex-col h-full min-h-0 rounded-none sm:rounded-br-xl overflow-hidden`}
              >
                {/* Tab Navigation Bar (Fixed at Top of Right Column on Desktop) */}
                <div className="hidden sm:flex items-center justify-[#176BFF] px-3.5 sm:px-4 lg:px-5 py-2 bg-white border-b border-slate-200/70 shrink-0 relative select-none z-10">
                  <div className="flex items-center gap-2 w-full">
                    {[
                      { id: 'tasks', label: 'Tasks', icon: LayoutGrid },
                      { id: 'notes', label: 'Notes', icon: FileText },
                      { id: 'files', label: 'Files', icon: Paperclip },
                      { id: 'activity', label: 'Activity', icon: Bell }
                    ].map((tab) => {
                      const isActive = activeHeaderTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => withUnsavedGuard(() => setActiveHeaderTab(tab.id as HeaderTab))}
                          className={`relative flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 z-10 ${isActive
                            ? 'text-[#176BFF]'
                            : 'text-slate-500 hover:text-slate-800 font-medium'
                            }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="desktop-segmented-active-pill"
                              className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80 z-[-1]"
                              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}
                          <tab.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#176BFF] stroke-[2.2]' : 'text-slate-400'}`} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scrollable Content Container (Starts right underneath the Tab Bar) */}
                <div
                  ref={rightColumnScrollRef}
                  onScroll={handleMacScroll}
                  className="flex-1 overflow-y-auto mac-scrollbar px-3.5 pt-3.5 pb-6 sm:px-4 sm:pt-4 sm:pb-6 lg:px-5 lg:pt-4 lg:pb-7 flex flex-col min-h-0 bg-white"
                >
                  {activeHeaderTab === 'tasks' && activeTask && (
                    <div className="flex-1 flex flex-col space-y-5">
                      {(() => {
                        const dueDateStatus = getDueDateStatus(activeTask.dueDate);
                        const currentPriorityKey = (activeTask.priority || 'none') as 'high' | 'medium' | 'low' | 'none';
                        const currentPriorityCfg = PRIORITY_CONFIG[currentPriorityKey] || PRIORITY_CONFIG.none;
                        const currentConfidenceKey = (activeTask.confidence || 'none') as 'mastered' | 'high' | 'medium' | 'low' | 'none';
                        const currentConfidenceCfg = CONFIDENCE_CONFIG[currentConfidenceKey] || CONFIDENCE_CONFIG.none;
                        const isTimerRunningOnThisTask = activeTimerTaskId === activeTask.id;

                        const hasDueDate = Boolean(activeTask.dueDate);

                        return (
                          <div
                            ref={cardsContainerRef}
                            className={`grid ${useTwoByTwoGrid ? 'grid-cols-2' : 'grid-cols-4'} gap-2 sm:gap-2.5 text-left w-full transition-all duration-150`}
                          >
                            {/* Card 1: Due Date (Interactive Dropdown & Smart Countdown Badge) */}
                            <div ref={dueDatePickerRef} className={`relative min-w-0 w-full select-none ${isDueDatePickerOpen ? 'z-50' : 'z-10'}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsDueDatePickerOpen((prev) => !prev);
                                  setIsPriorityMenuOpen(false);
                                  setIsTimeMenuOpen(false);
                                  setIsConfidenceMenuOpen(false);
                                }}
                                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl ${dueDateStatus?.isOverdue
                                  ? 'bg-[#FFF5F5] dark:bg-rose-950/30 border-[#FFE2E2]/90 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-700/50'
                                  : hasDueDate
                                    ? 'bg-[#F4F8FF] dark:bg-blue-950/30 border-[#E0EDFF]/80 dark:border-blue-900/40 hover:border-[#176BFF]/30 dark:hover:border-blue-700/50'
                                    : 'bg-white/95 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600/60 hover:bg-slate-50/90 dark:hover:bg-slate-800/70'
                                  } border shadow-2xs transition-all cursor-pointer min-w-0 w-full overflow-hidden text-left`}
                                title="Click to set or change Due Date"
                              >
                                <div
                                  className={`flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg ${dueDateStatus?.isOverdue
                                    ? 'bg-[#FFE6E6] dark:bg-rose-900/40 text-rose-500 dark:text-rose-400'
                                    : hasDueDate
                                      ? 'bg-[#E6F0FF] dark:bg-blue-900/40 text-[#176BFF] dark:text-blue-400'
                                      : 'bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/40 text-slate-500 dark:text-slate-400'
                                    }`}
                                >
                                  <CalendarDays className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${dueDateStatus?.isOverdue ? 'text-rose-500 dark:text-rose-400' : hasDueDate ? 'text-[#176BFF] dark:text-blue-400' : ''}`} />
                                </div>
                                <div className="flex flex-col min-w-0 text-left flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight text-left whitespace-nowrap">Due Date</span>
                                    {dueDateStatus && (
                                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border leading-tight shrink-0 ${dueDateStatus.color}`}>
                                        {dueDateStatus.label}
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className={`text-[11px] sm:text-[11.5px] font-bold ${dueDateStatus?.isOverdue
                                      ? 'text-rose-600 dark:text-rose-400'
                                      : hasDueDate
                                        ? 'text-[#176BFF] dark:text-blue-400'
                                        : 'text-slate-800 dark:text-slate-200'
                                      } leading-tight truncate mt-0.5 text-left`}
                                  >
                                    {formatDisplayDueDate(activeTask.dueDate)}
                                  </span>
                                </div>
                              </button>

                              <AnimatePresence>
                                {isDueDatePickerOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute left-0 top-full mt-2 w-[275px] sm:w-[285px] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-3 shadow-2xl z-[99999] space-y-2.5 select-none"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* 1. Quick Presets Chips */}
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const todayStr = new Date().toISOString().slice(0, 10);
                                          updateTaskDueDate(todayStr);
                                        }}
                                        className="flex-1 py-1.5 px-1 rounded-lg text-[10.5px] font-bold text-slate-700 hover:text-[#176BFF] hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                                      >
                                        <Sparkles className="w-2.5 h-2.5 text-[#176BFF]" /> Today
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const tomorrow = new Date();
                                          tomorrow.setDate(tomorrow.getDate() + 1);
                                          updateTaskDueDate(tomorrow.toISOString().slice(0, 10));
                                        }}
                                        className="flex-1 py-1.5 px-1 rounded-lg text-[10.5px] font-bold text-slate-700 hover:text-[#176BFF] hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                                      >
                                        <Clock className="w-2.5 h-2.5 text-amber-500" /> Tomorrow
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextWeek = new Date();
                                          nextWeek.setDate(nextWeek.getDate() + 7);
                                          updateTaskDueDate(nextWeek.toISOString().slice(0, 10));
                                        }}
                                        className="flex-1 py-1.5 px-1 rounded-lg text-[10.5px] font-bold text-slate-700 hover:text-[#176BFF] hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                                      >
                                        <CalendarDays className="w-2.5 h-2.5 text-indigo-500" /> +1 Week
                                      </button>
                                    </div>

                                    {/* 2. Month & Year Navigation Header */}
                                    <div className="flex items-center justify-between px-1 pt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCalendarViewDate((curr) => new Date(curr.getFullYear(), curr.getMonth() - 1, 1));
                                        }}
                                        className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Previous Month"
                                      >
                                        <ChevronLeft className="w-4 h-4" />
                                      </button>

                                      <span className="text-xs font-bold text-slate-800 tracking-tight">
                                        {calendarViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCalendarViewDate((curr) => new Date(curr.getFullYear(), curr.getMonth() + 1, 1));
                                        }}
                                        className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Next Month"
                                      >
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </div>

                                    {/* 3. Day of Week Labels */}
                                    <div className="grid grid-cols-7 gap-1 text-center">
                                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                        <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">
                                          {day}
                                        </span>
                                      ))}
                                    </div>

                                    {/* 4. Calendar Monthly Grid Cells */}
                                    <div className="grid grid-cols-7 gap-1">
                                      {(() => {
                                        const year = calendarViewDate.getFullYear();
                                        const month = calendarViewDate.getMonth();
                                        const firstDayOfWeek = new Date(year, month, 1).getDay();
                                        const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
                                        const daysInPrevMonth = new Date(year, month, 0).getDate();

                                        const todayObj = new Date();
                                        const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
                                        const activeDueStr = activeTask.dueDate || '';

                                        const cells = [];

                                        // Previous month trailing days
                                        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                                          const dayNum = daysInPrevMonth - i;
                                          cells.push(
                                            <div key={`prev-${dayNum}`} className="h-7 flex items-center justify-center text-[10.5px] font-medium text-slate-300 select-none">
                                              {dayNum}
                                            </div>
                                          );
                                        }

                                        // Current month active days
                                        for (let d = 1; d <= daysInCurrentMonth; d++) {
                                          const dateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                          const isSelected = activeDueStr === dateISO;
                                          const isToday = todayStr === dateISO;

                                          cells.push(
                                            <button
                                              key={`day-${d}`}
                                              type="button"
                                              onClick={() => updateTaskDueDate(dateISO)}
                                              className={`h-7 w-full rounded-lg text-[11px] font-semibold flex items-center justify-center transition-all cursor-pointer relative ${isSelected
                                                ? 'bg-[#176BFF] text-white font-bold shadow-xs'
                                                : isToday
                                                  ? 'bg-blue-50 text-[#176BFF] font-bold hover:bg-blue-100'
                                                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                            >
                                              {d}
                                              {isToday && !isSelected && (
                                                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#176BFF]" />
                                              )}
                                            </button>
                                          );
                                        }

                                        // Next month trailing days to fill last row
                                        const totalCells = cells.length;
                                        const remainder = totalCells % 7;
                                        if (remainder > 0) {
                                          const fillCount = 7 - remainder;
                                          for (let n = 1; n <= fillCount; n++) {
                                            cells.push(
                                              <div key={`next-${n}`} className="h-7 flex items-center justify-center text-[10.5px] font-medium text-slate-300 select-none">
                                                {n}
                                              </div>
                                            );
                                          }
                                        }

                                        return cells;
                                      })()}
                                    </div>

                                    {/* 5. Bottom Footer Actions */}
                                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                                      {activeTask.dueDate ? (
                                        <button
                                          type="button"
                                          onClick={() => updateTaskDueDate(undefined)}
                                          className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                                        >
                                          <Trash2 className="w-3 h-3" /> Clear Due Date
                                        </button>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 font-medium px-1">Pick a date</span>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => setIsDueDatePickerOpen(false)}
                                        className="px-3 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Card 2: Priority (Interactive Switcher) */}
                            <div ref={priorityMenuRef} className={`relative min-w-0 w-full select-none ${isPriorityMenuOpen ? 'z-50' : 'z-10'}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsPriorityMenuOpen((prev) => !prev);
                                  setIsDueDatePickerOpen(false);
                                  setIsTimeMenuOpen(false);
                                  setIsConfidenceMenuOpen(false);
                                }}
                                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl ${currentPriorityCfg.bg} border ${currentPriorityCfg.border} shadow-2xs transition-all cursor-pointer min-w-0 w-full overflow-hidden text-left`}
                                title="Click to change Priority"
                              >
                                <div
                                  className={`flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg ${currentPriorityCfg.iconBg} ${currentPriorityCfg.text}`}
                                >
                                  <Flag className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentPriorityCfg.fill}`} />
                                </div>
                                <div className="flex flex-col min-w-0 text-left flex-1">
                                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight text-left whitespace-nowrap">Priority</span>
                                  <span className={`text-[11px] sm:text-[11.5px] font-bold ${currentPriorityCfg.text} leading-tight truncate mt-0.5 text-left`}>
                                    {currentPriorityCfg.label}
                                  </span>
                                </div>
                              </button>

                              <AnimatePresence>
                                {isPriorityMenuOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.12, ease: 'easeOut' }}
                                    className={`absolute ${useTwoByTwoGrid ? 'right-0' : 'left-0'} top-full mt-1.5 w-44 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-[99999] space-y-0.5 select-none`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="px-2.5 py-1 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                      Set Priority
                                    </div>

                                    {(['high', 'medium', 'low', 'none'] as const).map((pKey) => {
                                      const cfg = PRIORITY_CONFIG[pKey];
                                      const isSelected = (activeTask.priority || 'none') === pKey;
                                      return (
                                        <button
                                          key={pKey}
                                          type="button"
                                          onClick={() => updateTaskPriority(pKey)}
                                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${isSelected ? `${cfg.bg} ${cfg.text} font-bold` : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                          <span className="flex items-center gap-2">
                                            <Flag className={`w-3.5 h-3.5 ${cfg.text} ${cfg.fill}`} />
                                            <span>{cfg.label}</span>
                                          </span>
                                          {isSelected && <Check className={`w-3.5 h-3.5 stroke-[2.5] ${cfg.text}`} />}
                                        </button>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Card 3: Time Tracking (Live Stopwatch / Study Logger) */}
                            <div ref={timeMenuRef} className={`relative min-w-0 w-full select-none ${isTimeMenuOpen ? 'z-50' : 'z-10'}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  // If a timer is already running on another task, trigger the Warning Conflict Modal
                                  const isOtherTimerActive = Boolean(
                                    (activeStudyTimerSession && activeStudyTimerSession.taskId !== activeTask.id) ||
                                    (activeTimerTaskId && activeTimerTaskId !== activeTask.id)
                                  );

                                  if (isOtherTimerActive) {
                                    setIsTimerConflictModalOpen(true);
                                    setIsTimeMenuOpen(false);
                                    setIsDueDatePickerOpen(false);
                                    setIsPriorityMenuOpen(false);
                                    setIsConfidenceMenuOpen(false);
                                    return;
                                  }

                                  setIsTimeMenuOpen((prev) => !prev);
                                  setIsDueDatePickerOpen(false);
                                  setIsPriorityMenuOpen(false);
                                  setIsConfidenceMenuOpen(false);
                                }}
                                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl ${isTimerRunningOnThisTask
                                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/90 dark:border-blue-800/60 text-blue-950 dark:text-blue-200 shadow-2xs'
                                  : (activeTask.timeSpentMinutes || 0) > 0
                                    ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 text-slate-900 dark:text-slate-200'
                                    : 'bg-white/95 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/90 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                                  } border shadow-2xs transition-all cursor-pointer min-w-0 w-full overflow-hidden text-left`}
                                title="Click to track study time"
                              >
                                <div
                                  className={`flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg ${isTimerRunningOnThisTask
                                    ? 'bg-blue-100 dark:bg-blue-900/50 text-[#176BFF] dark:text-blue-400'
                                    : (activeTask.timeSpentMinutes || 0) > 0
                                      ? 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/40 text-[#176BFF] dark:text-blue-400'
                                      : 'bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/40 text-slate-500 dark:text-slate-400'
                                    }`}
                                >
                                  <Timer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTimerRunningOnThisTask ? 'text-[#176BFF]' : (activeTask.timeSpentMinutes || 0) > 0 ? 'text-[#176BFF] dark:text-blue-400' : ''}`} />
                                </div>
                                <div className="flex flex-col min-w-0 text-left flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight text-left whitespace-nowrap">Time Spent</span>
                                    {isTimerRunningOnThisTask && isTimerPaused && (
                                      <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        Paused
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className={`text-[11px] sm:text-[11.5px] font-bold ${isTimerRunningOnThisTask
                                      ? 'text-[#176BFF] dark:text-blue-400 font-mono'
                                      : (activeTask.timeSpentMinutes || 0) > 0
                                        ? 'text-[#176BFF] dark:text-blue-400'
                                        : 'text-slate-800 dark:text-slate-200'
                                      } leading-tight truncate mt-0.5 text-left`}
                                  >
                                    {isTimerRunningOnThisTask
                                      ? `+${Math.floor(timerSeconds / 60)}m ${timerSeconds % 60}s`
                                      : formatDisplayTimeSpent(activeTask.timeSpentMinutes)}
                                  </span>
                                </div>
                              </button>

                              <AnimatePresence>
                                {isTimeMenuOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.12, ease: 'easeOut' }}
                                    className={`absolute ${useTwoByTwoGrid ? 'left-0' : 'left-0 sm:left-auto sm:right-0'} top-full mt-1.5 w-[295px] sm:w-[310px] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-3 shadow-2xl z-[99999] space-y-2.5 select-none`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Live Stopwatch Header Display */}
                                    <div className="bg-slate-50/90 dark:bg-slate-950/60 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                                      <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                          Focus Stopwatch
                                        </span>
                                        {isTimerRunningOnThisTask && (
                                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                                            isTimerPaused
                                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                              : 'bg-[#176BFF] text-white'
                                          }`}>
                                            {isTimerPaused ? 'PAUSED' : 'LIVE'}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-normal text-slate-900 dark:text-slate-100">
                                        {isTimerRunningOnThisTask
                                          ? `${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(timerSeconds % 60).padStart(2, '0')}`
                                          : '00:00'}
                                      </div>
                                      {isTimerRunningOnThisTask ? (
                                        <div className="flex items-center gap-2 w-full pt-0.5">
                                          {isTimerPaused ? (
                                            <button
                                              type="button"
                                              onClick={handleResumeTimer}
                                              className="py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 bg-[#176BFF] hover:bg-blue-600 active:scale-[0.98] text-white whitespace-nowrap shrink-0"
                                            >
                                              <Play className="w-3.5 h-3.5 fill-white shrink-0" />
                                              <span>Resume</span>
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={handlePauseTimer}
                                              className="py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 bg-[#176BFF] hover:bg-blue-600 active:scale-[0.98] text-white whitespace-nowrap shrink-0"
                                            >
                                              <Pause className="w-3.5 h-3.5 fill-white shrink-0" />
                                              <span>Pause</span>
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => handleStopTimer(activeTask.id)}
                                            className="flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 dark:shadow-rose-950/40 cursor-pointer flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white whitespace-nowrap"
                                          >
                                            <Square className="w-3 h-3 fill-white shrink-0" />
                                            <span>Stop & Log Session</span>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleStartTimer(activeTask.id)}
                                          className="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 bg-[#176BFF] hover:bg-blue-600 active:scale-[0.98] text-white"
                                        >
                                          <Play className="w-3.5 h-3.5 fill-white" />
                                          <span>Start Live Timer</span>
                                        </button>
                                      )}
                                    </div>

                                    {/* Custom Time (Set or Add Study Time) */}
                                    <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                                        Custom Study Time (Minutes)
                                      </div>
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          const mins = parseInt(customTimeInput, 10);
                                          if (!isNaN(mins) && mins > 0) {
                                            handleSetCustomMinutes(mins, false);
                                            setCustomTimeInput('');
                                          }
                                        }}
                                        className="space-y-1.5"
                                      >
                                        <input
                                          type="number"
                                          min="1"
                                          max="9999"
                                          placeholder="Enter minutes (e.g. 45)"
                                          value={customTimeInput}
                                          onChange={(e) => setCustomTimeInput(e.target.value)}
                                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 focus:bg-white dark:focus:bg-slate-950 focus:border-[#176BFF] outline-none text-slate-800 dark:text-slate-100 transition-colors"
                                        />
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            type="submit"
                                            disabled={!customTimeInput || parseInt(customTimeInput, 10) <= 0}
                                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center border ${
                                              customTimeInput && parseInt(customTimeInput, 10) > 0
                                                ? 'bg-[#176BFF] hover:bg-blue-600 border-transparent text-white shadow-3xs cursor-pointer'
                                                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                            }`}
                                          >
                                            + Add Time
                                          </button>
                                          <button
                                            type="button"
                                            disabled={!customTimeInput || parseInt(customTimeInput, 10) <= 0}
                                            onClick={() => {
                                              const mins = parseInt(customTimeInput, 10);
                                              if (!isNaN(mins) && mins >= 0) {
                                                handleSetCustomMinutes(mins, true);
                                                setCustomTimeInput('');
                                              }
                                            }}
                                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center border ${
                                              customTimeInput && parseInt(customTimeInput, 10) > 0
                                                ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 shadow-3xs cursor-pointer'
                                                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                            }`}
                                          >
                                            Set Total
                                          </button>
                                        </div>
                                      </form>
                                    </div>

                                    {/* Focus Check-in Interval Banner Info (Only if enabled in Settings) */}
                                    {focusCheckIntervalEnabled !== false && (() => {
                                      const isTimerActive = Boolean(
                                        (activeStudyTimerSession && activeStudyTimerSession.taskId === activeTask.id) ||
                                        (activeTimerTaskId && activeTimerTaskId === activeTask.id)
                                      );
                                      const currentSecs = activeStudyTimerSession && activeStudyTimerSession.taskId === activeTask.id
                                        ? activeStudyTimerSession.seconds
                                        : timerSeconds;
                                      const intervalSec = Math.max(10, Math.round(focusCheckIntervalMinutes * 60));
                                      const nextMilestoneSec = isTimerActive ? (Math.floor(currentSecs / intervalSec) + 1) * intervalSec : intervalSec;
                                      const secondsUntilNext = isTimerActive ? Math.max(0, nextMilestoneSec - currentSecs) : intervalSec;
                                      const remainingMins = Math.floor(secondsUntilNext / 60);
                                      const remainingSecs = secondsUntilNext % 60;
                                      const countdownClock = `${String(remainingMins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

                                      return (
                                        <div className="pt-2 pb-1 border-t border-slate-100/90 dark:border-slate-800 text-left select-none">
                                          <div className="flex items-center justify-between text-[10.5px] text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                              <Bell className="w-3 h-3 text-slate-400 shrink-0" />
                                              <span className="truncate">
                                                Check in: <strong className="text-slate-700 dark:text-slate-100 font-semibold">{focusCheckIntervalMinutes === 0.5 ? '30 seconds' : `${focusCheckIntervalMinutes} ${focusCheckIntervalMinutes === 1 ? 'minute' : 'minutes'}`}</strong>
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 pl-2">
                                              <span>{countdownClock}</span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Footer Reset Action (Always available with Total time count) */}
                                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between select-none">
                                      <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                                        Total: {formatDisplayTimeSpent(activeTask.timeSpentMinutes)}
                                        {(activeTask.timeSpentSeconds || 0) % 60 > 0 && (
                                          <span className="text-[9.5px] text-slate-400 font-mono ml-1">
                                            (+{(activeTask.timeSpentSeconds || 0) % 60}s)
                                          </span>
                                        )}
                                      </span>
                                      <button
                                        type="button"
                                        disabled={!((activeTask.timeSpentSeconds || 0) > 0 || (activeTask.timeSpentMinutes || 0) > 0)}
                                        onClick={handleResetLoggedTime}
                                        className="text-[10.5px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1"
                                        title="Reset logged study time"
                                      >
                                        <RotateCcw className="w-3 h-3" /> Reset
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Card 4: Confidence / Mastery Level */}
                            <div ref={confidenceMenuRef} className={`relative min-w-0 w-full select-none ${isConfidenceMenuOpen ? 'z-50' : 'z-10'}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsConfidenceMenuOpen((prev) => !prev);
                                  setIsDueDatePickerOpen(false);
                                  setIsPriorityMenuOpen(false);
                                  setIsTimeMenuOpen(false);
                                }}
                                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl ${currentConfidenceCfg.bg} border ${currentConfidenceCfg.border} shadow-2xs transition-all cursor-pointer min-w-0 w-full overflow-hidden text-left`}
                                title="Click to rate your confidence level"
                              >
                                <div
                                  className={`flex h-7.5 w-7.5 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg ${currentConfidenceCfg.iconBg} ${currentConfidenceCfg.text}`}
                                >
                                  <Award className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentConfidenceCfg.fill}`} />
                                </div>
                                <div className="flex flex-col min-w-0 text-left flex-1">
                                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight text-left whitespace-nowrap">Confidence</span>
                                  <span className={`text-[11px] sm:text-[11.5px] font-bold ${currentConfidenceCfg.text} leading-tight truncate mt-0.5 text-left`}>
                                    {currentConfidenceCfg.label}
                                  </span>
                                </div>
                              </button>

                              <AnimatePresence>
                                {isConfidenceMenuOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.12, ease: 'easeOut' }}
                                    className="absolute right-0 top-full mt-1.5 w-52 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-2 shadow-2xl z-[99999] space-y-1 select-none"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="px-2.5 py-1 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                      Confidence Level
                                    </div>

                                    {(['mastered', 'high', 'medium', 'low', 'none'] as const).map((cKey) => {
                                      const cfg = CONFIDENCE_CONFIG[cKey];
                                      const isSelected = (activeTask.confidence || 'none') === cKey;
                                      return (
                                        <button
                                          key={cKey}
                                          type="button"
                                          onClick={() => updateTaskConfidence(cKey)}
                                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer text-left ${isSelected
                                            ? `${cfg.bg} ${cfg.text} font-bold border ${cfg.border}`
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Award className={`w-3.5 h-3.5 ${cfg.text} ${cfg.fill}`} />
                                            <div>
                                              <div className="text-xs font-bold leading-tight">{cfg.label}</div>
                                              <div className="text-[10px] text-slate-400 font-normal leading-tight">{cfg.subtitle}</div>
                                            </div>
                                          </div>
                                          {isSelected && <Check className={`w-3.5 h-3.5 stroke-[2.5] ${cfg.text}`} />}
                                        </button>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Description Section with Interactive Edit Pencil Icon */}
                      <div ref={descContainerRef} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[13px] font-semibold font-serif text-[#0F172A] flex items-center gap-1.5">
                            <span>Description</span>
                          </h4>
                          {!isEditingDescription && (
                            <button
                              type="button"
                              onClick={() => {
                                const desc = activeTask.description || '';
                                setEditingDescInput(desc);
                                setIsEditingDescription(true);

                                const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024));

                                if (isMobileDevice) {
                                  // Mobile: Smoothly scroll the description box into comfortable top position BEFORE keyboard appears
                                  const descEl = descContainerRef.current;
                                  if (descEl) {
                                    const container = (descEl.closest('.overflow-y-auto') as HTMLElement) || (document.querySelector('.mac-scrollbar') as HTMLElement);
                                    if (container) {
                                      const containerRect = container.getBoundingClientRect();
                                      const descRect = descEl.getBoundingClientRect();
                                      const relativeTop = descRect.top - containerRect.top + container.scrollTop;
                                      container.scrollTo({
                                        top: Math.max(0, relativeTop - 8),
                                        behavior: 'smooth'
                                      });
                                    }
                                  }

                                  // Focus after scroll settles
                                  setTimeout(() => {
                                    if (descTextareaRef.current) {
                                      const el = descTextareaRef.current;
                                      autoExpandDescriptionTextarea(el);
                                      try {
                                        el.focus({ preventScroll: true });
                                      } catch {
                                        el.focus();
                                      }
                                      const len = el.value.length;
                                      el.setSelectionRange(len, len);
                                    }
                                  }, 240);
                                } else {
                                  // Desktop: NO scroll at all. Just smoothly open input box and focus immediately
                                  setTimeout(() => {
                                    if (descTextareaRef.current) {
                                      const el = descTextareaRef.current;
                                      autoExpandDescriptionTextarea(el);
                                      el.focus({ preventScroll: true });
                                      const len = el.value.length;
                                      el.setSelectionRange(len, len);
                                    }
                                  }, 50);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-[#176BFF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                              title={activeTask.description ? "Edit Description" : "Add Description"}
                            >
                              {activeTask.description && <Pencil className="w-3.5 h-3.5" />}
                              <span className="text-[11px] text-slate-500 hover:text-[#176BFF]">
                                {activeTask.description ? 'Edit' : '+ Add'}
                              </span>
                            </button>
                          )}
                        </div>
                        {/* Clean Smooth Open Container (Single Animation Only) */}
                        <div
                          className={`grid transition-all duration-200 ease-out ${isEditingDescription ? 'grid-rows-[1fr] opacity-100 mb-1' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                            }`}
                        >
                          <div className="overflow-hidden">
                            <form
                              style={{ scrollMarginBottom: '10px' }}
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (topic && activeTask && onUpdateTopic) {
                                  const updatedTasks = (topic.tasks || []).map((t) =>
                                    t.id === activeTask.id ? { ...t, description: editingDescInput.trim() } : t
                                  );
                                  onUpdateTopic({ ...topic, tasks: updatedTasks });
                                  if (showToast) showToast('Description updated');
                                }
                                setIsEditingDescription(false);
                              }}
                              className="space-y-2 pt-1 pb-1"
                            >
                              <textarea
                                ref={descTextareaRef}
                                value={editingDescInput}
                                onInput={(e) => {
                                  autoExpandDescriptionTextarea(e.currentTarget);
                                }}
                                onChange={(e) => {
                                  setEditingDescInput(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                    e.preventDefault();
                                    if (topic && activeTask && onUpdateTopic) {
                                      const updatedTasks = (topic.tasks || []).map((t) =>
                                        t.id === activeTask.id ? { ...t, description: editingDescInput.trim() } : t
                                      );
                                      onUpdateTopic({ ...topic, tasks: updatedTasks });
                                      if (showToast) showToast('Description updated');
                                    }
                                    setIsEditingDescription(false);
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    setIsEditingDescription(false);
                                  }
                                }}
                                rows={3}
                                placeholder="Write task description..."
                                className="w-full p-3 bg-white border border-slate-300 focus:border-[#176BFF] rounded-lg text-slate-800 outline-none focus:outline-none ring-0 focus:ring-0 shadow-none resize-none min-h-[72px] leading-relaxed overflow-hidden desc-font"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsEditingDescription(false)}
                                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 rounded-md transition-colors cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>

                        {/* Static Paragraph text or Clickable Empty State when not editing */}
                        {!isEditingDescription && (
                          activeTask.description ? (
                            <p className="text-[#0F172A] leading-relaxed font-normal whitespace-pre-line text-justify desc-font">
                              {activeTask.description}
                            </p>
                          ) : (
                            <p
                              onClick={() => {
                                setEditingDescInput('');
                                setIsEditingDescription(true);
                                const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024));
                                if (isMobileDevice) {
                                  const descEl = descContainerRef.current;
                                  if (descEl) {
                                    const container = (descEl.closest('.overflow-y-auto') as HTMLElement) || (document.querySelector('.mac-scrollbar') as HTMLElement);
                                    if (container) {
                                      const containerRect = container.getBoundingClientRect();
                                      const descRect = descEl.getBoundingClientRect();
                                      const relativeTop = descRect.top - containerRect.top + container.scrollTop;
                                      container.scrollTo({
                                        top: Math.max(0, relativeTop - 8),
                                        behavior: 'smooth'
                                      });
                                    }
                                  }
                                  setTimeout(() => {
                                    if (descTextareaRef.current) {
                                      const el = descTextareaRef.current;
                                      autoExpandDescriptionTextarea(el);
                                      try { el.focus({ preventScroll: true }); } catch { el.focus(); }
                                    }
                                  }, 240);
                                } else {
                                  setTimeout(() => {
                                    if (descTextareaRef.current) {
                                      const el = descTextareaRef.current;
                                      autoExpandDescriptionTextarea(el);
                                      el.focus({ preventScroll: true });
                                    }
                                  }, 50);
                                }
                              }}
                              className="text-slate-400 italic text-[12.5px] leading-relaxed cursor-pointer hover:text-[#176BFF] transition-colors py-0.5"
                            >
                              Add a description to this task...
                            </p>
                          )
                        )}
                      </div>

                      {/* Sub-Tabs Row (Tightened Horizontal Spacing & Real Dynamic Counts) */}
                      <div ref={subTabRowRef} className="flex items-center gap-3.5 sm:gap-4 border-b border-slate-200/80 text-xs font-semibold text-slate-500 overflow-x-auto no-scrollbar pt-1">
                        {[
                          { id: 'details', label: 'Overview', badge: null },
                          { id: 'notes', label: 'Notes', badge: notesList.length },
                          { id: 'links', label: 'Links', badge: linksList.length },
                          { id: 'checklist', label: 'Subtask', badge: (activeTask?.subtasks || []).length },
                          { id: 'files', label: 'Files', badge: filesList.length },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleSubTabSwitch(tab.id as TaskSubTab)}
                            className={`relative pb-2.5 transition-colors cursor-pointer whitespace-nowrap flex items-center ${activeTaskSubTab === tab.id
                              ? 'text-[#176BFF] font-semibold'
                              : 'hover:text-slate-900'
                              }`}
                          >
                            <span>{tab.label}</span>
                            {tab.badge !== null && (
                              <span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded-md text-[10px] font-bold leading-none ml-0">
                                {tab.badge}
                              </span>
                            )}
                            {activeTaskSubTab === tab.id && (
                              <motion.div
                                layoutId="subtab-active-indicator"
                                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#176BFF] rounded-full"
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Sub-Tab Details Grid (Exact Dynamic Visible Space on Both Mobile & Desktop) */}
                      <div
                        ref={subTabContentWrapperRef}
                        style={{
                          minHeight: dynamicSubTabMinHeight ? `${dynamicSubTabMinHeight}px` : undefined
                        }}
                        className="space-y-4 relative"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={activeTaskSubTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.10, ease: 'easeInOut' }}
                            className="space-y-4"
                          >
                            {activeTaskSubTab === 'details' && (
                              <>
                                {/* 1. Notes & Links Summary Cards */}
                                {(() => {
                                  const previewLinks = linksList.slice(0, 3);
                                  const previewLinksCount = previewLinks.length;
                                  const rawNoteText = notesList[0]?.text || '';

                                  // Dynamically scale note preview text based on the number of links in the right card
                                  // so the Notes card strictly follows the Links card's height
                                  let maxChars = 160;
                                  if (previewLinksCount === 2) {
                                    maxChars = 105;
                                  } else if (previewLinksCount === 1) {
                                    maxChars = 65;
                                  } else if (previewLinksCount === 0) {
                                    maxChars = 80;
                                  }

                                  const displayNoteText = rawNoteText.length > maxChars
                                    ? rawNoteText.slice(0, maxChars).trim() + '...'
                                    : rawNoteText;

                                  return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                                      {/* Notes Card */}
                                      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs h-full flex flex-col justify-between">
                                        <div>
                                          <div className="flex items-center justify-between mb-2.5">
                                            <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                                              <span>Notes</span>
                                              {notesList.length > 1 && (
                                                <span className="bg-blue-50 dark:bg-blue-950/60 text-[#176BFF] dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 px-2 py-0.5 rounded-full text-[10.5px] font-bold">
                                                  +{notesList.length - 1} more
                                                </span>
                                              )}
                                            </h4>
                                            <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer hover:text-[#176BFF] hover:translate-x-0.5 transition-all" onClick={() => setActiveTaskSubTab('notes')} title="View all notes" />
                                          </div>
                                          {notesList.length > 0 ? (
                                            <p className="text-slate-800 dark:text-slate-200 font-normal text-justify break-words note-font">
                                              <span className="float-left mr-3 mb-0.5 mt-[3px] inline-block align-top select-none">
                                                {renderNoteIcon()}
                                              </span>
                                              {displayNoteText}
                                            </p>
                                          ) : (
                                            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium py-1">
                                              No notes added for this task yet.
                                            </div>
                                          )}
                                        </div>
                                        {notesList.length > 0 && (
                                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium leading-snug">{notesList[0].date}</p>
                                        )}
                                      </div>

                                      {/* Links Card */}
                                      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs h-full flex flex-col justify-between">
                                        <div>
                                          <div className="flex items-center justify-between mb-2.5">
                                            <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2">
                                              <span>Links</span>
                                              {linksList.length > 3 && (
                                                <span className="bg-blue-50 dark:bg-blue-950/60 text-[#176BFF] dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 px-2 py-0.5 rounded-full text-[10.5px] font-bold">
                                                  +{linksList.length - 3} more
                                                </span>
                                              )}
                                            </h4>
                                            <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer hover:text-[#176BFF] hover:translate-x-0.5 transition-all" onClick={() => setActiveTaskSubTab('links')} title="View all links" />
                                          </div>
                                          {previewLinks.length > 0 ? (
                                            <div className="space-y-2.5">
                                              {previewLinks.map((l) => (
                                                <div key={l.id} className="flex items-center gap-3 min-w-0 w-full">
                                                  <span className="flex w-6 h-6 shrink-0 items-center justify-center">
                                                    {renderLinkIcon(l.url, l.title)}
                                                  </span>
                                                  <div className="min-w-0 flex-1 overflow-hidden">
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{l.title}</p>
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{l.url.replace(/^https?:\/\/(www\.)?/, '')}</p>
                                                  </div>
                                                  <a href={ensureExternalUrl(l.url)} target="_blank" rel="noreferrer">
                                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 cursor-pointer hover:text-[#176BFF] transition-colors" />
                                                  </a>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium py-1">
                                              No links added for this task yet.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* 2. Subtasks & Labels/Tags Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Subtask Card (Linear / Things 3 Style with Animated Checkbox, Real Progress, Quick Add & Inline Edit) */}
                                  {(() => {
                                    const activeSubtasks = activeTask?.subtasks || [];
                                    const totalSubtasks = activeSubtasks.length;
                                    const completedSubtasks = activeSubtasks.filter((s) => s.completed).length;
                                    const subtaskProgressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
                                    const previewSubtasks = activeSubtasks.slice(0, 3);

                                    return (
                                      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
                                        {/* Header with Right Arrow */}
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#176BFF] dark:text-blue-400 flex items-center justify-center">
                                              <ListTodo className="w-3.5 h-3.5" />
                                            </div>
                                            <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Subtasks</h4>
                                            {totalSubtasks > 0 && (
                                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">
                                                {completedSubtasks}/{totalSubtasks}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            {totalSubtasks > 0 && (
                                              <span className={`text-[11px] font-bold ${subtaskProgressPercent === 100 ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                {subtaskProgressPercent === 100 ? 'All done! 🎉' : `${subtaskProgressPercent}%`}
                                              </span>
                                            )}
                                            {/* Right Arrow to navigate directly to Subtasks Section */}
                                            <button
                                              type="button"
                                              onClick={() => handleSubTabSwitch('checklist')}
                                              className="p-1 -mr-1 text-slate-400 hover:text-[#176BFF] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-0.5 group/arrow"
                                              title="Open Subtasks section"
                                            >
                                              <ChevronRight className="w-4 h-4 group-hover/arrow:translate-x-0.5 transition-transform" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Empty State */}
                                        {activeSubtasks.length === 0 && (
                                          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                                            <div>
                                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-200">No subtasks added</p>
                                              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">Manage checklist in Subtasks tab</p>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleSubTabSwitch('checklist')}
                                              className="text-[11px] font-bold text-[#176BFF] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                            >
                                              <span>Open Subtasks Tab</span>
                                              <ChevronRight className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}

                                        {/* Subtasks Preview Item List (Max 3 items with dividers & +N more) */}
                                        {previewSubtasks.length > 0 && (
                                          <div className="space-y-1.5 pt-0.5">
                                            {previewSubtasks.map((item, index) => {
                                              return (
                                                <div
                                                  key={item.id}
                                                  onClick={() => handleSubTabSwitch('checklist')}
                                                  className="group flex items-center justify-between p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                                                >
                                                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                                                    <span
                                                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all shrink-0 ${
                                                        item.completed
                                                          ? 'bg-[#176BFF] border-[#176BFF] text-white'
                                                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#176BFF]'
                                                      }`}
                                                    >
                                                      {item.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                    </span>
                                                    <span
                                                      className={`text-xs truncate select-none ${
                                                        item.completed
                                                          ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                                                          : 'text-slate-700 dark:text-slate-300 font-medium group-hover:text-[#176BFF]'
                                                      }`}
                                                      title={item.title}
                                                    >
                                                      {item.title}
                                                    </span>
                                                  </div>

                                                  {/* +N More Badge directly beside 3rd Subtask */}
                                                  {index === 2 && totalSubtasks > 3 ? (
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSubTabSwitch('checklist');
                                                      }}
                                                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold text-[#176BFF] dark:text-blue-400 bg-blue-50/90 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/60 transition-all cursor-pointer shrink-0 shadow-2xs hover:scale-105"
                                                      title={`View all ${totalSubtasks} subtasks`}
                                                    >
                                                      <span>+{totalSubtasks - 3} more</span>
                                                      <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                                                    </button>
                                                  ) : (
                                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#176BFF] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}

                                  {/* Labels & Tags Card (Interactive Dynamic Badge Pills) */}
                                  <div ref={tagFormRef} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-[#176BFF]" />
                                        <span>Labels & Tags</span>
                                      </h4>
                                      {!isAddingTag && (
                                        <button
                                          type="button"
                                          onClick={() => setIsAddingTag(true)}
                                          className="text-[11px] font-semibold text-[#176BFF] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" /> Add Tag
                                        </button>
                                      )}
                                    </div>

                                    {/* Interactive Tag Input Form (Symmetric 60fps Smooth Open & Close Container) */}
                                    <div
                                      className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAddingTag ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                        }`}
                                    >
                                      <div className="overflow-hidden">
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            const trimmed = newTagInput.trim();
                                            if (trimmed) {
                                              if (trimmed.length > 20) {
                                                if (showToast) showToast('⚠️ Tag name cannot exceed 20 characters.');
                                                return;
                                              }
                                              const colors = ['blue', 'purple', 'emerald', 'amber', 'rose', 'indigo', 'cyan', 'teal', 'violet', 'fuchsia', 'pink', 'sky'];
                                              const randomColor = colors[Math.floor(Math.random() * colors.length)];
                                              setTags((prev) => [...prev, { id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, name: trimmed, color: randomColor }]);
                                              setNewTagInput('');
                                              setIsAddingTag(false);
                                              if (showToast) showToast(`Added tag "${trimmed}"`);
                                            }
                                          }}
                                          className="p-2.5 bg-slate-50/90 dark:bg-slate-800/80 border border-blue-200/90 dark:border-slate-700 rounded-xl shadow-xs space-y-2 my-0.5"
                                        >
                                          <div className="relative flex items-center">
                                            <Tag className="w-3.5 h-3.5 text-blue-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                            <input
                                              type="text"
                                              value={newTagInput}
                                              onChange={(e) => setNewTagInput(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Escape') {
                                                  setIsAddingTag(false);
                                                  setNewTagInput('');
                                                }
                                              }}
                                              placeholder="Enter tag name (e.g. Exam, Physics)"
                                              maxLength={20}
                                              className="w-full pl-8 pr-12 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#176BFF] focus:ring-2 focus:ring-[#176BFF]/15 transition-all"
                                            />
                                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
                                              {newTagInput.length}/20
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-end gap-2 pt-0.5">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setIsAddingTag(false);
                                                setNewTagInput('');
                                              }}
                                              className="px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              type="submit"
                                              disabled={!newTagInput.trim()}
                                              className="px-3.5 py-1 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                                            >
                                              <Plus className="w-3 h-3" />
                                              <span>Add Tag</span>
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>

                                    {/* Tag List */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {tags.map((tg) => {
                                        const colorStyles: Record<string, { bg: string; text: string; border: string; dot: string }> = {
                                          blue: { bg: 'bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100/90 dark:hover:bg-blue-900/50', text: 'text-[#176BFF] dark:text-blue-300', border: 'border-blue-200/90 dark:border-blue-800/60', dot: 'bg-[#176BFF] dark:bg-blue-400' },
                                          purple: { bg: 'bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100/90 dark:hover:bg-purple-900/50', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200/90 dark:border-purple-800/60', dot: 'bg-purple-600 dark:bg-purple-400' },
                                          emerald: { bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200/90 dark:border-emerald-800/60', dot: 'bg-emerald-600 dark:bg-emerald-400' },
                                          amber: { bg: 'bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100/90 dark:hover:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200/90 dark:border-amber-800/60', dot: 'bg-amber-500 dark:bg-amber-400' },
                                          rose: { bg: 'bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/90 dark:hover:bg-rose-900/50', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200/90 dark:border-rose-800/60', dot: 'bg-rose-500 dark:bg-rose-400' },
                                          indigo: { bg: 'bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100/90 dark:hover:bg-indigo-900/50', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200/90 dark:border-indigo-800/60', dot: 'bg-indigo-600 dark:bg-indigo-400' },
                                          cyan: { bg: 'bg-cyan-50/80 dark:bg-cyan-950/40 hover:bg-cyan-100/90 dark:hover:bg-cyan-900/50', text: 'text-cyan-800 dark:text-cyan-300', border: 'border-cyan-200/90 dark:border-cyan-800/60', dot: 'bg-cyan-600 dark:bg-cyan-400' },
                                          teal: { bg: 'bg-teal-50/80 dark:bg-teal-950/40 hover:bg-teal-100/90 dark:hover:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-300', border: 'border-teal-200/90 dark:border-teal-800/60', dot: 'bg-teal-600 dark:bg-teal-400' },
                                          violet: { bg: 'bg-violet-50/80 dark:bg-violet-950/40 hover:bg-violet-100/90 dark:hover:bg-violet-900/50', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200/90 dark:border-violet-800/60', dot: 'bg-violet-600 dark:bg-violet-400' },
                                          fuchsia: { bg: 'bg-fuchsia-50/80 dark:bg-fuchsia-950/40 hover:bg-fuchsia-100/90 dark:hover:bg-fuchsia-900/50', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-200/90 dark:border-fuchsia-800/60', dot: 'bg-fuchsia-600 dark:bg-fuchsia-400' },
                                          pink: { bg: 'bg-pink-50/80 dark:bg-pink-950/40 hover:bg-pink-100/90 dark:hover:bg-pink-900/50', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200/90 dark:border-pink-800/60', dot: 'bg-pink-500 dark:bg-pink-400' },
                                          sky: { bg: 'bg-sky-50/80 dark:bg-sky-950/40 hover:bg-sky-100/90 dark:hover:bg-sky-900/50', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200/90 dark:border-sky-800/60', dot: 'bg-sky-500 dark:bg-sky-400' },
                                        };
                                        const conf = colorStyles[tg.color] || colorStyles.blue;
                                        const bgClass = `${conf.bg} ${conf.text} ${conf.border}`;
                                        const dotClass = conf.dot;

                                        return (
                                          <span
                                            key={tg.id}
                                            className={`group relative inline-flex items-center gap-1.5 px-2.5 py-0.5 ${bgClass} border rounded-md text-[11px] font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none`}
                                          >
                                            <span className={`w-1.5 h-1.5 rounded-full ${dotClass} shrink-0`} />
                                            <span className="leading-snug">{tg.name}</span>
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setTags((prev) => prev.filter((t) => t.id !== tg.id));
                                                if (showToast) showToast(`Removed tag "${tg.name}"`);
                                              }}
                                              className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer ml-0.5"
                                              title="Remove tag"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </span>
                                        );
                                      })}
                                      {tags.length === 0 && !isAddingTag && (
                                        <p className="text-xs text-slate-400 font-medium italic">No tags added yet. Click "+ Add Tag" above.</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            {activeTaskSubTab === 'notes' && (
                              <div ref={noteFormRef} className="space-y-2">
                                {!isAddingNote && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isMobileDevice) {
                                        setMobileNoteTarget('task');
                                        setNewNoteInput('');
                                        setIsMobileNoteModalOpen(true);
                                      } else {
                                        setIsAddingNote(true);
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176BFF] hover:text-blue-700 cursor-pointer pt-0.5 mb-1"
                                  >
                                    <Plus className="w-4 h-4 stroke-[2.5]" />
                                    <span>Add Note</span>
                                  </button>
                                )}
                                <div
                                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAddingNote ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                    }`}
                                >
                                  <div className="overflow-hidden">
                                    <form onSubmit={addNote} style={{ scrollMarginBottom: '10px' }} className="space-y-2 p-3.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 focus-within:border-[#176BFF] dark:focus-within:border-blue-500 rounded-xl transition-colors my-0.5 shadow-sm">
                                      <textarea
                                        ref={(el) => {
                                          if (el) {
                                            el.style.height = 'auto';
                                            el.style.height = `${Math.min(Math.max(el.scrollHeight, 56), 240)}px`;
                                            if (isAddingNote && document.activeElement !== el) {
                                              setTimeout(() => {
                                                el.focus();
                                              }, 50);
                                            }
                                          }
                                        }}
                                        value={newNoteInput}
                                        onChange={(e) => {
                                          setNewNoteInput(e.target.value);
                                          const target = e.currentTarget;
                                          target.style.height = 'auto';
                                          target.style.height = `${Math.min(Math.max(target.scrollHeight, 56), 240)}px`;
                                        }}
                                        onKeyDown={(e) => {
                                          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                            e.preventDefault();
                                            addNote(e as any);
                                          } else if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setIsAddingNote(false);
                                            setNewNoteInput('');
                                          }
                                        }}
                                        rows={2}
                                        placeholder="Write a note for this task…"
                                        className="w-full resize-none border-0 bg-transparent dark:bg-transparent p-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-h-[56px] max-h-[240px] overflow-y-auto mac-scrollbar note-font"
                                      />
                                      <div className="flex items-center justify-end gap-2 pt-0.5">
                                        <button
                                          type="button"
                                          onClick={() => setIsAddingNote(false)}
                                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 hover:text-slate-800 rounded-md transition-colors cursor-pointer text-center"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={!newNoteInput.trim()}
                                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer text-center"
                                        >
                                          Save Note
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                                {notesList.length === 0 && !isAddingNote && (
                                  <div className="p-6 text-center flex flex-col items-center justify-center border border-dashed border-slate-200/90 rounded-xl bg-slate-50/50 my-1 select-none">
                                    <FileText className="w-6 h-6 text-slate-300 mb-1.5" />
                                    <p className="text-xs font-semibold text-slate-600">No notes added for this task</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Note" above to write a note.</p>
                                  </div>
                                )}
                                {[...notesList]
                                  .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                                  .map((n) => {
                                    const isEditingThisNote = !isMobileDevice && editingNoteId === n.id;
                                    return (
                                      <div key={n.id} className={`space-y-1 relative ${openNoteMenuId === n.id ? 'z-40' : 'z-0'}`}>
                                        <AnimatePresence mode="wait" initial={false}>
                                          {isEditingThisNote ? (
                                            <motion.form
                                              key={`edit-${n.id}`}
                                              initial={{ opacity: 0, y: -4 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: -4 }}
                                              transition={{ duration: 0.15, ease: 'easeOut' }}
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                saveEditedNote(n.id);
                                              }}
                                              style={{ scrollMarginBottom: '10px' }}
                                              className="space-y-2 p-3.5 bg-white dark:bg-slate-900 border border-[#D8E0EC] dark:border-slate-800 focus-within:border-[#176BFF] dark:focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 rounded-xl transition-colors my-0.5"
                                            >
                                              <textarea
                                                autoFocus
                                                ref={(el) => {
                                                  if (el) {
                                                    el.style.height = 'auto';
                                                    el.style.height = `${Math.min(Math.max(el.scrollHeight, 56), 240)}px`;
                                                  }
                                                }}
                                                value={editingNoteInput}
                                                onChange={(e) => {
                                                  setEditingNoteInput(e.target.value);
                                                  const target = e.currentTarget;
                                                  target.style.height = 'auto';
                                                  target.style.height = `${Math.min(Math.max(target.scrollHeight, 56), 240)}px`;
                                                }}
                                                onKeyDown={(e) => {
                                                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                                    e.preventDefault();
                                                    saveEditedNote(n.id);
                                                  } else if (e.key === 'Escape') {
                                                    e.preventDefault();
                                                    setEditingNoteId(null);
                                                    setEditingNoteInput('');
                                                  }
                                                }}
                                                placeholder="Edit note…"
                                                className="w-full resize-none border-0 bg-transparent p-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-h-[56px] max-h-[240px] overflow-y-auto mac-scrollbar note-font"
                                              />
                                              <div className="flex items-center justify-end gap-2 pt-0.5">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setEditingNoteId(null);
                                                    setEditingNoteInput('');
                                                  }}
                                                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer text-center"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  type="submit"
                                                  disabled={!editingNoteInput.trim()}
                                                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer text-center"
                                                >
                                                  Save Note
                                                </button>
                                              </div>
                                            </motion.form>
                                          ) : (
                                            <motion.div
                                              key={`card-${n.id}`}
                                              initial={{ opacity: 0, y: -4 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: -4 }}
                                              transition={{ duration: 0.15, ease: 'easeOut' }}
                                              className={`group relative px-3.5 pt-2 pb-3 ${n.isPinned ? 'bg-amber-50/30 dark:bg-amber-950/25 border-amber-200/90 dark:border-amber-900/40' : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800'} border rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors shadow-2xs space-y-1.5`}
                                            >
                                              {/* Top Header Row with Date & Time, Pin Badge and 3-Dot Options */}
                                              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400 border-b border-slate-200/60 dark:border-slate-800/80 pb-1.5 mb-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                  <span className="shrink-0">{formatNoteDate(n.date)}</span>
                                                  {n.isPinned && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100/90 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold shadow-2xs shrink-0 select-none">
                                                      <Pin className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                                                      <span>Pinned</span>
                                                    </span>
                                                  )}
                                                </div>

                                                {/* 3-Dot Options Menu */}
                                                <div
                                                  data-note-menu
                                                  className="relative shrink-0 -mr-1 z-30 flex items-center gap-1.5"
                                                >
                                                  {copiedNoteId === n.id && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold shadow-2xs animate-in fade-in zoom-in duration-150">
                                                      <Check className="w-2.5 h-2.5 stroke-[3] text-emerald-600" />
                                                      <span>Copied</span>
                                                    </span>
                                                  )}
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const rect = e.currentTarget.getBoundingClientRect();
                                                      const spaceBelow = window.innerHeight - rect.bottom;
                                                      setNoteMenuPlacement(spaceBelow < 180 ? 'top' : 'bottom');
                                                      setOpenNoteMenuId((prev) => (prev === n.id ? null : n.id));
                                                    }}
                                                    className={`p-1 rounded-md transition-colors cursor-pointer ${openNoteMenuId === n.id ? 'text-[#176BFF] bg-blue-100/80 dark:bg-blue-950/60' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-blue-100/50 dark:hover:bg-slate-800'
                                                      }`}
                                                    title="Options"
                                                  >
                                                    <MoreVertical className="w-4 h-4" />
                                                  </button>

                                                  <AnimatePresence>
                                                    {openNoteMenuId === n.id && (
                                                      <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: noteMenuPlacement === 'top' ? 4 : -4 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: noteMenuPlacement === 'top' ? 4 : -4 }}
                                                        transition={{ duration: 0.12, ease: 'easeOut' }}
                                                        className={`absolute right-0 w-36 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-[99999] space-y-0.5 ${noteMenuPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                                                          }`}
                                                        onClick={(e) => e.stopPropagation()}
                                                      >
                                                        {/* 1. Pin to Top */}
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            togglePinNote(n.id);
                                                          }}
                                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors cursor-pointer text-left"
                                                        >
                                                          <Pin className={`w-3.5 h-3.5 ${n.isPinned ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                                                          <span>{n.isPinned ? 'Unpin Note' : 'Pin to Top'}</span>
                                                        </button>
                                                        {/* 2. Copy Text */}
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            setOpenNoteMenuId(null);
                                                            handleCopyNote(n.id, n.text);
                                                          }}
                                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#176BFF] rounded-lg transition-colors cursor-pointer text-left"
                                                        >
                                                          <Copy className="w-3.5 h-3.5" /> Copy Text
                                                        </button>
                                                        {/* 3. Edit Note */}
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            setOpenNoteMenuId(null);
                                                            if (isMobileDevice) {
                                                              setEditingNoteId(n.id);
                                                              setEditingNoteInput(n.text);
                                                              setMobileNoteTarget('task');
                                                              setIsMobileNoteModalOpen(true);
                                                            } else {
                                                              setEditingNoteId(n.id);
                                                              setEditingNoteInput(n.text);
                                                            }
                                                          }}
                                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#176BFF] rounded-lg transition-colors cursor-pointer text-left"
                                                        >
                                                          <Edit3 className="w-3.5 h-3.5" /> Edit Note
                                                        </button>
                                                        {/* 4. Delete Note */}
                                                        <button
                                                          type="button"
                                                          onClick={() => {
                                                            setOpenNoteMenuId(null);
                                                            setNoteToDelete({ id: n.id, text: n.text });
                                                          }}
                                                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                                                        >
                                                          <Trash2 className="w-3.5 h-3.5" /> Delete Note
                                                        </button>
                                                      </motion.div>
                                                    )}
                                                  </AnimatePresence>
                                                </div>
                                              </div>

                                              {/* Note Body Text with wrap around icon and flow-root clearfix to prevent boundary overflow */}
                                              <div className="min-w-0 flow-root">
                                                <p className="text-xs font-normal text-slate-800 dark:text-slate-200 leading-[19px] text-justify whitespace-pre-wrap note-font">
                                                  <span className="float-left mr-3 mb-0.5 mt-[3px] inline-block align-top select-none">
                                                    {renderNoteIcon()}
                                                  </span>
                                                  {n.text}
                                                </p>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}

                              </div>
                            )}

                            {activeTaskSubTab === 'links' && (
                              <div ref={linkFormRef} className="space-y-2 w-full min-w-0">
                                {!isAddingLink && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      if (isMobileDevice) {
                                        setMobileLinkTarget('task');
                                        setNewLinkTitle('');
                                        setNewLinkUrl('');
                                        setIsMobileLinkModalOpen(true);
                                      } else {
                                        setIsAddingLink(true);
                                        setIsCustomLinkTitle(false);
                                        setNewLinkTitle('');
                                        setNewLinkUrl('');
                                        const btnEl = e.currentTarget;
                                        const container = btnEl.closest('.overflow-y-auto');
                                        if (container) {
                                          container.scrollBy({ top: 120, behavior: 'smooth' });
                                        }
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176BFF] hover:text-blue-700 cursor-pointer pt-0.5 mb-1"
                                  >
                                    <Plus className="w-4 h-4 stroke-[2.5]" />
                                    <span>Add Link</span>
                                  </button>
                                )}
                                {/* Smooth Collapsible Add Link Form */}
                                <div
                                  className={`grid w-full min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAddingLink ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                    }`}
                                >
                                  <div className="overflow-hidden w-full min-w-0">
                                    <form
                                      onSubmit={addLink}
                                      style={{ scrollMarginBottom: '5px' }}
                                      className="space-y-3 p-3.5 bg-white border border-slate-200 rounded-xl my-0.5 w-full min-w-0"
                                    >
                                      <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-slate-500">Resource URL</label>
                                        <input
                                          value={newLinkUrl}
                                          onChange={(e) => {
                                            const urlVal = e.target.value;
                                            setNewLinkUrl(urlVal);
                                            if (!isCustomLinkTitle) {
                                              if (urlVal.trim()) {
                                                const auto = getAutoLinkTitle(urlVal);
                                                setNewLinkTitle(auto);
                                              } else {
                                                setNewLinkTitle('');
                                              }
                                            }
                                          }}
                                          onPaste={(e) => {
                                            const pasted = e.clipboardData.getData('text');
                                            if (pasted && !isCustomLinkTitle) {
                                              const auto = getAutoLinkTitle(pasted);
                                              if (auto) setNewLinkTitle(auto);
                                            }
                                          }}
                                          placeholder="Paste URL (YouTube, Drive, Facebook, Docs, PDF...)"
                                          className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#176BFF] focus:bg-white transition-colors"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <label className="text-[11px] font-semibold text-slate-500">Link Title</label>
                                          {newLinkUrl.trim() && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const auto = getAutoLinkTitle(newLinkUrl);
                                                setNewLinkTitle(auto);
                                                setIsCustomLinkTitle(false);
                                              }}
                                              className="text-[10.5px] font-bold text-[#176BFF] hover:underline cursor-pointer"
                                            >
                                              Auto-detect title
                                            </button>
                                          )}
                                        </div>
                                        <input
                                          value={newLinkTitle}
                                          onFocus={(e) => e.target.select()}
                                          onClick={(e) => (e.target as HTMLInputElement).select()}
                                          onChange={(e) => {
                                            setNewLinkTitle(e.target.value);
                                            setIsCustomLinkTitle(true);
                                          }}
                                          placeholder="Link title (auto-detected from URL)"
                                          className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#176BFF] focus:bg-white transition-colors"
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2 pt-0.5">
                                        <button
                                          type="button"
                                          onClick={() => setIsAddingLink(false)}
                                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-md transition-colors cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={!newLinkUrl.trim()}
                                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer"
                                        >
                                          Add Link
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                                {linksList.length === 0 && !isAddingLink && (
                                  <div className="p-6 text-center flex flex-col items-center justify-center border border-dashed border-slate-200/90 rounded-xl bg-slate-50/50 my-1 select-none">
                                    <LinkIcon className="w-6 h-6 text-slate-300 mb-1.5" />
                                    <p className="text-xs font-semibold text-slate-600">No resource links added for this task</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Click "+ Add Link" above to attach a link.</p>
                                  </div>
                                )}
                                {linksList.map((l, lIdx) => {
                                  const isEditing = !isMobileDevice && editingLinkId === l.id;
                                  const isCopied = copiedLinkId === l.id;
                                  const isMenuOpen = openLinkMenuId === l.id;

                                  return (
                                    <div
                                      key={l.id || `task-link-${lIdx}`}
                                      className={`w-full min-w-0 max-w-full relative ${isMenuOpen ? 'z-[9999]' : 'z-0'}`}
                                    >
                                      {/* Static Card with Smooth Accordion */}
                                      <div
                                        className={`grid w-full min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                          !isEditing ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                        }`}
                                      >
                                        <div className={`w-full min-w-0 ${isEditing ? 'overflow-hidden' : 'overflow-visible'}`}>
                                          <div className="group flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all w-full min-w-0 max-w-full">
                                            <a
                                              href={ensureExternalUrl(l.url)}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="flex items-center gap-3 min-w-0 flex-1 mr-2 overflow-hidden"
                                            >
                                              <span className="flex w-6 h-6 shrink-0 items-center justify-center">
                                                {renderLinkIcon(l.url, l.title)}
                                              </span>
                                              <div className="min-w-0 flex-1 overflow-hidden">
                                                <p className="text-xs font-bold text-slate-800 group-hover:text-[#176BFF] truncate transition-colors">
                                                  {l.title}
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                                                  {l.url.replace(/^https?:\/\/(www\.)?/, '')}
                                                </p>
                                              </div>
                                            </a>

                                            {/* Action Bar (Copy Button + 3-Dot Options Dropdown) */}
                                            <div className="flex items-center gap-1 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => handleCopyLink(l.id, l.url)}
                                                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${isCopied
                                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                  : 'text-slate-400 hover:text-[#176BFF] hover:bg-blue-50'
                                                  }`}
                                                title={isCopied ? 'Copied to clipboard' : 'Copy link'}
                                              >
                                                {isCopied ? (
                                                  <>
                                                    <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                                                    <span className="text-[10px] text-emerald-600 font-extrabold">Copied</span>
                                                  </>
                                                ) : (
                                                  <Copy className="w-3.5 h-3.5" />
                                                )}
                                              </button>

                                              {/* 3-Dot Options Button & Dropdown Wrapper */}
                                              <div className="relative shrink-0 flex items-center z-30" data-link-menu>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const spaceBelow = window.innerHeight - rect.bottom;
                                                    setLinkMenuPlacement(spaceBelow < 180 ? 'top' : 'bottom');
                                                    setOpenLinkMenuId((prev) => (prev === l.id ? null : l.id));
                                                  }}
                                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isMenuOpen ? 'text-[#176BFF] bg-blue-100/80' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                                    }`}
                                                  title="More options"
                                                >
                                                  <MoreVertical className="w-3.5 h-3.5" />
                                                </button>

                                                {/* 3-Dot Options Dropdown */}
                                                <AnimatePresence>
                                                  {isMenuOpen && (
                                                    <motion.div
                                                      initial={{ opacity: 0, scale: 0.95, y: linkMenuPlacement === 'top' ? 8 : -8, originX: 1, originY: linkMenuPlacement === 'top' ? 1 : 0 }}
                                                      animate={{ opacity: 1, scale: 1, y: 0, originX: 1, originY: linkMenuPlacement === 'top' ? 1 : 0 }}
                                                      exit={{ opacity: 0, scale: 0.95, y: linkMenuPlacement === 'top' ? 8 : -8, originX: 1, originY: linkMenuPlacement === 'top' ? 1 : 0 }}
                                                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                                      className={`absolute right-0 w-36 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl z-[999999] space-y-0.5 ${linkMenuPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                                                        }`}
                                                      onClick={(e) => e.stopPropagation()}
                                                    >
                                                      {/* 1. Open in new tab */}
                                                      <a
                                                        href={ensureExternalUrl(l.url)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={() => setOpenLinkMenuId(null)}
                                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#176BFF] rounded-lg transition-colors text-left"
                                                      >
                                                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Open</span>
                                                      </a>

                                                      {/* 2. Edit */}
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setOpenLinkMenuId(null);
                                                          handleStartEditLink(l, 'task');
                                                        }}
                                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#176BFF] rounded-lg transition-colors cursor-pointer text-left"
                                                      >
                                                        <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Edit</span>
                                                      </button>

                                                      <div className="h-px bg-slate-100 my-1" />

                                                      {/* 3. Delete */}
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setOpenLinkMenuId(null);
                                                          setLinkToDelete({ id: l.id, title: l.title });
                                                        }}
                                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                                                      >
                                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Delete</span>
                                                      </button>
                                                    </motion.div>
                                                  )}
                                                </AnimatePresence>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Edit Form with Smooth Accordion */}
                                      <div
                                        className={`grid w-full min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                          isEditing ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                        }`}
                                      >
                                        <div className="overflow-hidden w-full min-w-0">
                                          <form
                                            onSubmit={(e) => {
                                              e.preventDefault();
                                              handleSaveEditedLink(l.id);
                                            }}
                                            style={{ scrollMarginBottom: '5px' }}
                                            className="space-y-3 p-3.5 bg-white border border-slate-200 rounded-xl w-full min-w-0 my-0.5"
                                          >
                                            <div className="space-y-1">
                                              <label className="text-[11px] font-semibold text-slate-500">Resource URL</label>
                                              <input
                                                type="text"
                                                value={editingLinkUrl}
                                                onChange={(e) => setEditingLinkUrl(e.target.value)}
                                                placeholder="Paste URL (YouTube, Drive, Facebook, Docs, PDF...)"
                                                className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#176BFF] focus:bg-white transition-colors"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-[11px] font-semibold text-slate-500">Link Title</label>
                                              <input
                                                type="text"
                                                value={editingLinkTitle}
                                                onFocus={(e) => e.target.select()}
                                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                                onChange={(e) => setEditingLinkTitle(e.target.value)}
                                                placeholder="Link title"
                                                className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#176BFF] focus:bg-white transition-colors"
                                              />
                                            </div>
                                            <div className="flex justify-end gap-2 pt-0.5">
                                              <button
                                                type="button"
                                                onClick={() => setEditingLinkId(null)}
                                                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-md transition-colors cursor-pointer"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="submit"
                                                disabled={!editingLinkUrl.trim()}
                                                className="px-4 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer"
                                              >
                                                Save Changes
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {activeTaskSubTab === 'files' && (
                              <div className="space-y-2">
                                {filesList.map((f) => (
                                  <div key={f.id} className="flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-lg">
                                    <div>
                                      <p className="text-xs font-semibold text-slate-800">{f.name}</p>
                                      <p className="text-[11px] text-slate-400">{f.size} • {f.date}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-slate-500 cursor-pointer" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {activeTaskSubTab === 'checklist' && (
                              (() => {
                                const activeSubtasks = activeTask?.subtasks || [];
                                const totalSubtasks = activeSubtasks.length;
                                const completedSubtasks = activeSubtasks.filter((s) => s.completed).length;
                                const subtaskProgressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

                                return (
                                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2.5">
                                    {/* Compact 1-line Minimal Header */}
                                    <div className="flex items-center justify-between pb-1">
                                      <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-md bg-blue-50 text-[#176BFF] flex items-center justify-center">
                                          <ListTodo className="w-3.5 h-3.5" />
                                        </div>
                                        <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Subtasks</h4>
                                        {totalSubtasks > 0 && (
                                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-none">
                                            {completedSubtasks}/{totalSubtasks}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2.5">
                                        {totalSubtasks > 0 && (
                                          <span className={`text-[11px] font-bold ${subtaskProgressPercent === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {subtaskProgressPercent === 100 ? 'All done! 🎉' : `${subtaskProgressPercent}%`}
                                          </span>
                                        )}
                                        {!isAddingSubtask && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsAddingSubtask(true);
                                              setTimeout(() => subtaskInputRef.current?.focus(), 40);
                                            }}
                                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-[#176BFF] text-[#176BFF] hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                          >
                                            <Plus className="w-3 h-3" />
                                            <span>Add Subtask</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Ultra-slim Minimal Progress Bar */}
                                    {totalSubtasks > 0 && (
                                      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all duration-300 ease-out ${subtaskProgressPercent === 100 ? 'bg-emerald-500' : 'bg-[#176BFF]'
                                            }`}
                                          style={{ width: `${subtaskProgressPercent}%` }}
                                        />
                                      </div>
                                    )}

                                    {/* Empty State */}
                                    {activeSubtasks.length === 0 && !isAddingSubtask && (
                                      <div className="py-6 text-center flex flex-col items-center justify-center border border-dashed border-slate-200/80 dark:border-slate-800 rounded-lg bg-slate-50/40 dark:bg-slate-900/40">
                                        <ListChecks className="w-5 h-5 text-slate-300 dark:text-slate-500 mb-1" />
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-200">No subtasks yet</p>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Break this task down into smaller actionable steps</p>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setIsAddingSubtask(true);
                                            setTimeout(() => subtaskInputRef.current?.focus(), 40);
                                          }}
                                          className="mt-2 px-3.5 py-1.5 bg-[#176BFF] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                                        >
                                          <Plus className="w-3 h-3" /> Add First Subtask
                                        </button>
                                      </div>
                                    )}

                                    {/* Subtasks Item List (Slim Minimal Linear Rows) */}
                                    {activeSubtasks.length > 0 && (
                                      <div className="space-y-0.5 max-h-[380px] overflow-y-auto mac-scrollbar pr-0.5">
                                        {activeSubtasks.map((item) => {
                                          const isEditing = editingSubtaskId === item.id;
                                          return (
                                            <div
                                              key={item.id}
                                              className="group flex items-center gap-2.5 px-2 py-1 hover:bg-slate-50/80 rounded-lg transition-colors border border-transparent hover:border-slate-200/50"
                                            >
                                              {/* Custom Minimal Checkbox */}
                                              <button
                                                type="button"
                                                onClick={() => handleToggleSubtask(item.id)}
                                                className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all cursor-pointer ${item.completed
                                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs scale-100'
                                                  : 'border-slate-300 hover:border-[#176BFF] hover:bg-blue-50/50 bg-white'
                                                  }`}
                                              >
                                                {item.completed && <Check className="w-2.5 h-2.5 stroke-[3] text-white" />}
                                              </button>

                                              {/* Title / Inline Edit */}
                                              {isEditing ? (
                                                <input
                                                  autoFocus
                                                  type="text"
                                                  value={editingSubtaskTitle}
                                                  onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEditedSubtask(item.id);
                                                    if (e.key === 'Escape') setEditingSubtaskId(null);
                                                  }}
                                                  onBlur={() => handleSaveEditedSubtask(item.id)}
                                                  className="flex-1 text-xs font-medium text-slate-900 bg-blue-50/60 border border-blue-300 rounded-md px-2 py-0.5 outline-none focus:ring-1 focus:ring-[#176BFF]"
                                                />
                                              ) : (
                                                <span
                                                  onClick={() => {
                                                    setEditingSubtaskId(item.id);
                                                    setEditingSubtaskTitle(item.title);
                                                  }}
                                                  className={`flex-1 text-xs cursor-text transition-all leading-normal ${item.completed
                                                    ? 'line-through text-slate-400 opacity-70 font-normal'
                                                    : 'text-slate-800 font-medium hover:text-[#176BFF]'
                                                    }`}
                                                  title="Click to edit subtask"
                                                >
                                                  {item.title}
                                                </span>
                                              )}

                                              {/* Ghost Hover Actions (Edit & Delete) */}
                                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setEditingSubtaskId(item.id);
                                                    setEditingSubtaskTitle(item.title);
                                                  }}
                                                  className="p-1 text-slate-400 hover:text-[#176BFF] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                  title="Edit subtask"
                                                >
                                                  <Pencil className="w-3 h-3" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeleteSubtask(item.id)}
                                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                                  title="Delete subtask"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {/* Inline Seamless Fast Add Row */}
                                    {isAddingSubtask && (
                                      <form
                                        onSubmit={handleAddSubtaskSubmit}
                                        className="flex items-center gap-2 pt-1.5 border-t border-slate-100"
                                      >
                                        <div className="w-4 h-4 rounded-full border border-dashed border-slate-300 shrink-0 flex items-center justify-center">
                                          <Plus className="w-2.5 h-2.5 text-slate-400" />
                                        </div>
                                        <input
                                          ref={subtaskInputRef}
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
                                          value={newSubtaskTitle}
                                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                              setIsAddingSubtask(false);
                                              setNewSubtaskTitle('');
                                            }
                                          }}
                                          placeholder="Type subtask and press Enter..."
                                          className="flex-1 text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#176BFF] rounded-lg px-2.5 py-1 outline-none transition-all [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                                        />
                                        <button
                                          type="submit"
                                          disabled={!newSubtaskTitle.trim()}
                                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                                        >
                                          <Plus className="w-3 h-3" />
                                          <span>Add</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setIsAddingSubtask(false);
                                            setNewSubtaskTitle('');
                                          }}
                                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </form>
                                    )}
                                  </div>
                                );
                              })()
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* End of Sub-Tab Details */}
                    </div>
                  )}

                  {/* TOPIC NOTES TAB VIEW */}
                  {activeHeaderTab === 'notes' && (() => {
                    const allTaskNotesList = tasksList.flatMap((tk) =>
                      (tk.notes || []).map((n) => ({ ...n, taskId: tk.id, taskTitle: tk.title }))
                    );
                    return (
                      <div className="flex-1 flex flex-col space-y-4">
                      {/* 1. Header with Title and Subtitle */}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-slate-100">Topic Notes</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Topic note and all task notes for {topic.title || 'Topic'}</p>
                      </div>

                      {/* 2. Full-Width Quick Add Action Card (Option 2 Style) */}
                      {!isAddingNote && (
                        <button
                          type="button"
                          onClick={() => {
                            if (isMobileDevice) {
                              setMobileNoteTarget('topic');
                              setNewNoteInput('');
                              setIsMobileNoteModalOpen(true);
                            } else {
                              setIsAddingNote(true);
                            }
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors shadow-2xs group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#176BFF] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-[#0F172A] dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">
                                Add Topic Note
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                Write summary, formulas, or key study insights
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      )}

                      {/* Smooth Collapsible Add Note Form for Topic (Desktop Inline) */}
                      <div
                        className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAddingNote ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                          }`}
                      >
                        <div className="overflow-hidden">
                          <form onSubmit={addNote} style={{ scrollMarginBottom: '32px' }} className="space-y-2 p-3.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-800 focus-within:border-[#176BFF] dark:focus-within:border-blue-500 rounded-xl transition-colors my-0.5 shadow-sm">
                            <textarea
                              ref={(el) => {
                                if (el) {
                                  el.style.height = 'auto';
                                  el.style.height = `${Math.min(Math.max(el.scrollHeight, 56), 240)}px`;
                                  if (isAddingNote && document.activeElement !== el) {
                                    setTimeout(() => {
                                      el.focus();
                                    }, 50);
                                  }
                                }
                              }}
                              value={newNoteInput}
                              onChange={(e) => {
                                setNewNoteInput(e.target.value);
                                const target = e.currentTarget;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(Math.max(target.scrollHeight, 56), 240)}px`;
                              }}
                              onKeyDown={(e) => {
                                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                  e.preventDefault();
                                  addNote(e as any);
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  setIsAddingNote(false);
                                  setNewNoteInput('');
                                }
                              }}
                              rows={2}
                              placeholder="Write key revision points, formulas, or takeaways for this topic…"
                              className="w-full resize-none border-0 bg-transparent p-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-h-[56px] max-h-[240px] overflow-y-auto mac-scrollbar note-font"
                            />
                            <div className="flex items-center justify-end gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingNote(false);
                                  setNewNoteInput('');
                                }}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white rounded-md transition-colors cursor-pointer text-center"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={!newNoteInput.trim()}
                                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer text-center"
                              >
                                Save Note
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* 1. TOPIC-LEVEL NOTES */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                            <span>Topic Note</span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-[#176BFF] dark:text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                              {(topic.notes || []).length}
                            </span>
                          </h4>
                        </div>

                        {(topic.notes || []).length === 0 && !isAddingNote && (
                          <div className="p-6 bg-[#FAFBFD] dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-[#176BFF] dark:text-blue-400">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">No topic note added yet</p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[240px] mt-0.5">
                                Tap above to write key revision points, formulas, or general takeaways.
                              </p>
                            </div>
                          </div>
                        )}

                        {[...(topic.notes || [])]
                          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                          .map((n) => {
                            const isEditingThisNote = !isMobileDevice && editingNoteId === n.id;
                            return (
                              <div key={n.id} className={`relative ${openNoteMenuId === n.id ? 'z-40' : 'z-0'}`}>
                                <AnimatePresence mode="wait" initial={false}>
                                  {isEditingThisNote ? (
                                    <motion.form
                                      key={`edit-${n.id}`}
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{ duration: 0.15, ease: 'easeOut' }}
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        saveEditedNote(n.id, true);
                                      }}
                                      style={{ scrollMarginBottom: '32px' }}
                                      className="space-y-2 p-3 bg-[#FAFBFD] dark:bg-slate-900 border border-[#D8E0EC] dark:border-slate-800 focus-within:border-[#176BFF] dark:focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 rounded-xl transition-colors my-0.5"
                                    >
                                      <textarea
                                        autoFocus
                                        ref={(el) => {
                                          if (el) {
                                            el.style.height = 'auto';
                                            el.style.height = `${Math.min(Math.max(el.scrollHeight, 56), 240)}px`;
                                          }
                                        }}
                                        value={editingNoteInput}
                                        onChange={(e) => {
                                          setEditingNoteInput(e.target.value);
                                          const target = e.currentTarget;
                                          target.style.height = 'auto';
                                          target.style.height = `${Math.min(Math.max(target.scrollHeight, 56), 240)}px`;
                                        }}
                                        onKeyDown={(e) => {
                                          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                            e.preventDefault();
                                            saveEditedNote(n.id, true);
                                          } else if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setEditingNoteId(null);
                                            setEditingNoteInput('');
                                          }
                                        }}
                                        placeholder="Edit note…"
                                        className="w-full resize-none border-0 bg-transparent p-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-h-[56px] max-h-[240px] overflow-y-auto mac-scrollbar note-font"
                                      />
                                      <div className="flex items-center justify-end gap-2 pt-0.5">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingNoteId(null);
                                            setEditingNoteInput('');
                                          }}
                                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white rounded-md transition-colors cursor-pointer text-center"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          disabled={!editingNoteInput.trim()}
                                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer text-center"
                                        >
                                          Save Note
                                        </button>
                                      </div>
                                    </motion.form>
                                  ) : (
                                    <motion.div
                                      key={`card-${n.id}`}
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{ duration: 0.15, ease: 'easeOut' }}
                                      className={`group relative px-3.5 pt-2 pb-3 ${n.isPinned ? 'bg-amber-50/30 dark:bg-amber-950/25 border-amber-200/90 dark:border-amber-900/40' : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800'} border rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors shadow-2xs space-y-1.5`}
                                    >
                                      {/* Top Header Row with Date & Time, Pin Badge and 3-Dot Options */}
                                      <div className="flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400 border-b border-slate-200/60 dark:border-slate-800/80 pb-1.5 mb-1.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="shrink-0">{formatNoteDate(n.date)}</span>
                                          {n.isPinned && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100/90 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold shadow-2xs shrink-0 select-none">
                                              <Pin className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                                              <span>Pinned</span>
                                            </span>
                                          )}
                                        </div>

                                        {/* 3-Dot Options Menu */}
                                        <div
                                          data-note-menu
                                          className="relative shrink-0 -mr-1 z-30 flex items-center gap-1.5"
                                        >
                                          {copiedNoteId === n.id && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold shadow-2xs animate-in fade-in zoom-in duration-150">
                                              <Check className="w-2.5 h-2.5 stroke-[3] text-emerald-600" />
                                              <span>Copied</span>
                                            </span>
                                          )}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const rect = e.currentTarget.getBoundingClientRect();
                                              const spaceBelow = window.innerHeight - rect.bottom;
                                              setNoteMenuPlacement(spaceBelow < 180 ? 'top' : 'bottom');
                                              setOpenNoteMenuId((prev) => (prev === n.id ? null : n.id));
                                            }}
                                            className={`p-1 rounded-md transition-colors cursor-pointer ${openNoteMenuId === n.id ? 'text-[#176BFF] bg-blue-100/80 dark:bg-blue-950/60' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                              }`}
                                            title="Options"
                                          >
                                            <MoreVertical className="w-4 h-4" />
                                          </button>

                                          <AnimatePresence>
                                            {openNoteMenuId === n.id && (
                                              <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: noteMenuPlacement === 'top' ? 4 : -4 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: noteMenuPlacement === 'top' ? 4 : -4 }}
                                                transition={{ duration: 0.12, ease: 'easeOut' }}
                                                className={`absolute right-0 w-36 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-[99999] space-y-0.5 ${noteMenuPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                                                  }`}
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                {/* 1. Pin to Top */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    togglePinNote(n.id, true);
                                                  }}
                                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-700 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer text-left"
                                                >
                                                  <Pin className={`w-3.5 h-3.5 ${n.isPinned ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                                                  <span>{n.isPinned ? 'Unpin Note' : 'Pin to Top'}</span>
                                                </button>
                                                {/* 2. Copy Text */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setOpenNoteMenuId(null);
                                                    handleCopyNote(n.id, n.text);
                                                  }}
                                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#176BFF] dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer text-left"
                                                >
                                                  <Copy className="w-3.5 h-3.5" /> Copy Text
                                                </button>
                                                {/* 3. Edit Note */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setOpenNoteMenuId(null);
                                                    if (isMobileDevice) {
                                                      setEditingNoteId(n.id);
                                                      setEditingNoteInput(n.text);
                                                      setMobileNoteTarget('topic');
                                                      setIsMobileNoteModalOpen(true);
                                                    } else {
                                                      setEditingNoteId(n.id);
                                                      setEditingNoteInput(n.text);
                                                    }
                                                  }}
                                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#176BFF] dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer text-left"
                                                >
                                                  <Pencil className="w-3.5 h-3.5" /> Edit Note
                                                </button>
                                                {/* 4. Delete Note */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setOpenNoteMenuId(null);
                                                    setNoteToDelete({ id: n.id, text: n.text, isTopicNote: true });
                                                  }}
                                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-left"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" /> Delete Note
                                                </button>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      </div>

                                      {/* Note Body Text with wrap around icon */}
                                      <div className="min-w-0 flow-root">
                                        <p className="text-xs font-normal text-slate-800 dark:text-slate-200 leading-[19px] text-justify whitespace-pre-wrap note-font">
                                          <span className="float-left mr-3 mb-0.5 mt-[3px] inline-block align-top select-none">
                                            {renderNoteIcon()}
                                          </span>
                                          {n.text}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                      </div>

                      {/* 2. ALL TASK NOTES ACROSS THIS TOPIC */}
                      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                            <span>All Task Notes</span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                              {allTaskNotesList.length}
                            </span>
                          </h4>
                        </div>

                        {allTaskNotesList.length === 0 ? (
                          <div className="p-6 bg-[#FAFBFD] dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">No task notes yet</p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[240px] mt-0.5">
                                Notes added inside individual tasks will automatically show up here.
                              </p>
                            </div>
                          </div>
                        ) : (
                          allTaskNotesList
                            .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                            .map((n) => {
                              const isEditingThisNote = !isMobileDevice && editingNoteId === n.id;
                              return (
                                <div key={n.id} className={`relative ${openNoteMenuId === n.id ? 'z-40' : 'z-0'}`}>
                                  <AnimatePresence mode="wait" initial={false}>
                                    {isEditingThisNote ? (
                                      <motion.form
                                        key={`edit-${n.id}`}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          saveEditedNote(n.id, false, n.taskId);
                                        }}
                                        style={{ scrollMarginBottom: '32px' }}
                                        className="space-y-2 p-3 bg-[#FAFBFD] dark:bg-slate-900 border border-[#D8E0EC] dark:border-slate-800 focus-within:border-[#176BFF] dark:focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 rounded-xl transition-colors my-0.5"
                                      >
                                        <textarea
                                          autoFocus
                                          ref={(el) => {
                                            if (el) {
                                              el.style.height = 'auto';
                                              el.style.height = `${Math.min(Math.max(el.scrollHeight, 56), 240)}px`;
                                            }
                                          }}
                                          value={editingNoteInput}
                                          onChange={(e) => {
                                            setEditingNoteInput(e.target.value);
                                            const target = e.currentTarget;
                                            target.style.height = 'auto';
                                            target.style.height = `${Math.min(Math.max(target.scrollHeight, 56), 240)}px`;
                                          }}
                                          onKeyDown={(e) => {
                                            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                              e.preventDefault();
                                              saveEditedNote(n.id, false, n.taskId);
                                            } else if (e.key === 'Escape') {
                                              e.preventDefault();
                                              setEditingNoteId(null);
                                              setEditingNoteInput('');
                                            }
                                          }}
                                          placeholder="Edit note…"
                                          className="w-full resize-none border-0 bg-transparent p-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none min-h-[56px] max-h-[240px] overflow-y-auto mac-scrollbar note-font"
                                        />
                                        <div className="flex items-center justify-end gap-2 pt-0.5">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingNoteId(null);
                                              setEditingNoteInput('');
                                            }}
                                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer text-center"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="submit"
                                            disabled={!editingNoteInput.trim()}
                                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer text-center"
                                          >
                                            Save Note
                                          </button>
                                        </div>
                                      </motion.form>
                                    ) : (
                                      <motion.div
                                        key={`card-${n.id}`}
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className={`px-3.5 pt-2 pb-3 ${n.isPinned ? 'bg-amber-50/30 dark:bg-amber-950/25 border-amber-200/90 dark:border-amber-900/40' : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800'} border rounded-lg space-y-1.5 shadow-2xs transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/60`}
                                      >
                                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800/80 pb-1.5 mb-1.5">
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedTaskId(n.taskId);
                                                setActiveHeaderTab('tasks');
                                                setActiveTaskSubTab('notes');
                                                setMobileActiveView('details');
                                              }}
                                              className="truncate text-[#176BFF] dark:text-blue-400 hover:underline font-bold text-left cursor-pointer"
                                              title="Click to open this task"
                                            >
                                              Task: {n.taskTitle}
                                            </button>
                                            {n.isPinned && (
                                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100/90 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold shadow-2xs shrink-0 select-none">
                                                <Pin className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                                                <span>Pinned</span>
                                              </span>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatNoteDate(n.date)}</span>

                                            {/* 3-Dot Options Menu to the right of Date */}
                                            <div
                                              data-note-menu
                                              className="relative shrink-0 -mr-1 z-30 flex items-center gap-1.5"
                                            >
                                              {copiedNoteId === n.id && (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold shadow-2xs animate-in fade-in zoom-in duration-150">
                                                  <Check className="w-2.5 h-2.5 stroke-[3] text-emerald-600" />
                                                  <span>Copied</span>
                                                </span>
                                              )}
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const rect = e.currentTarget.getBoundingClientRect();
                                                  const spaceBelow = window.innerHeight - rect.bottom;
                                                  setNoteMenuPlacement(spaceBelow < 180 ? 'top' : 'bottom');
                                                  setOpenNoteMenuId((prev) => (prev === n.id ? null : n.id));
                                                }}
                                                className={`p-1 rounded-md transition-colors cursor-pointer ${openNoteMenuId === n.id ? 'text-[#176BFF] bg-blue-100/80 dark:bg-blue-950/60' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                  }`}
                                                title="Options"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              <AnimatePresence>
                                                {openNoteMenuId === n.id && (
                                                  <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: noteMenuPlacement === 'top' ? 4 : -4 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: noteMenuPlacement === 'top' ? 4 : -4 }}
                                                    transition={{ duration: 0.12, ease: 'easeOut' }}
                                                    className={`absolute right-0 w-36 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl z-[99999] space-y-0.5 ${noteMenuPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                                                      }`}
                                                    onClick={(e) => e.stopPropagation()}
                                                  >
                                                    {/* 1. Pin to Top */}
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        togglePinNote(n.id, false, n.taskId);
                                                      }}
                                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-700 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer text-left"
                                                    >
                                                      <Pin className={`w-3.5 h-3.5 ${n.isPinned ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                                                      <span>{n.isPinned ? 'Unpin Note' : 'Pin to Top'}</span>
                                                    </button>
                                                    {/* 2. Copy Text */}
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setOpenNoteMenuId(null);
                                                        handleCopyNote(n.id, n.text);
                                                      }}
                                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#176BFF] dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer text-left"
                                                    >
                                                      <Copy className="w-3.5 h-3.5" /> Copy Text
                                                    </button>
                                                    {/* 3. Edit Note */}
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setOpenNoteMenuId(null);
                                                        if (isMobileDevice) {
                                                          setEditingNoteId(n.id);
                                                          setEditingNoteTaskId(n.taskId);
                                                          setEditingNoteInput(n.text);
                                                          setMobileNoteTarget('task');
                                                          setIsMobileNoteModalOpen(true);
                                                        } else {
                                                          setEditingNoteId(n.id);
                                                          setEditingNoteInput(n.text);
                                                        }
                                                      }}
                                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-[#176BFF] dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer text-left"
                                                    >
                                                      <Pencil className="w-3.5 h-3.5" /> Edit Note
                                                    </button>
                                                    {/* 4. Delete Note */}
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        setOpenNoteMenuId(null);
                                                        setNoteToDelete({ id: n.id, text: n.text, taskId: n.taskId, isTopicNote: false });
                                                      }}
                                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-left"
                                                    >
                                                      <Trash2 className="w-3.5 h-3.5" /> Delete Note
                                                    </button>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flow-root">
                                          <p className="text-xs font-normal text-slate-800 dark:text-slate-200 leading-[19px] text-justify whitespace-pre-wrap note-font">
                                            <span className="float-left mr-3 mb-0.5 mt-[3px] inline-block align-top select-none">
                                              {renderNoteIcon()}
                                            </span>
                                            {n.text}
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>
                  );
                })()}

                  {/* TOPIC FILES & LINKS TAB VIEW */}
                  {activeHeaderTab === 'files' && (
                    <div className="flex-1 flex flex-col space-y-4">
                      {/* 1. Header with Title and Subtitle */}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">Topic Links & Attachments</h3>
                        <p className="text-xs text-slate-500">Reference links, drive files, videos and PDF notes</p>
                      </div>

                      {/* 2. Full-Width Quick Add Action Card (Option 2 - Notion/Linear Mobile Style) */}
                      {!isAddingLink && (
                        <button
                          type="button"
                          onClick={(e) => {
                            if (isMobileDevice) {
                              setMobileLinkTarget('topic');
                              setNewLinkTitle('');
                              setNewLinkUrl('');
                              setIsMobileLinkModalOpen(true);
                            } else {
                              setIsAddingLink(true);
                              setIsCustomLinkTitle(false);
                              setNewLinkTitle('');
                              setNewLinkUrl('');
                              const btnEl = e.currentTarget;
                              const container = btnEl.closest('.overflow-y-auto');
                              if (container) {
                                container.scrollBy({ top: 120, behavior: 'smooth' });
                              }
                            }
                          }}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors shadow-2xs group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#176BFF] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-[#0F172A] dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">
                                Add Link or Attachment
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                Paste URL from YouTube, Drive, Docs, PDFs
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      )}

                      {/* Smooth Collapsible Add Link Form in Topic Files Tab (Desktop Inline) */}
                      <div
                        className={`grid w-full min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAddingLink ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                          }`}
                      >
                        <div className="overflow-hidden w-full min-w-0">
                          <form
                            onSubmit={addLink}
                            autoComplete="off"
                            data-form-type="other"
                            data-lpignore="true"
                            data-1p-ignore="true"
                            style={{ scrollMarginBottom: '5px' }}
                            className="space-y-3 p-3.5 bg-white border border-slate-200 rounded-xl my-0.5 w-full min-w-0 shadow-sm"
                          >
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-500">Resource URL</label>
                              <input
                                type="text"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                data-form-type="other"
                                data-lpignore="true"
                                data-1p-ignore="true"
                                value={newLinkUrl}
                                onChange={(e) => {
                                  const urlVal = e.target.value;
                                  setNewLinkUrl(urlVal);
                                  if (!isCustomLinkTitle) {
                                    if (urlVal.trim()) {
                                      const auto = getAutoLinkTitle(urlVal);
                                      setNewLinkTitle(auto);
                                    } else {
                                      setNewLinkTitle('');
                                    }
                                  }
                                }}
                                onPaste={(e) => {
                                  const pasted = e.clipboardData.getData('text');
                                  if (pasted && !isCustomLinkTitle) {
                                    const auto = getAutoLinkTitle(pasted);
                                    if (auto) setNewLinkTitle(auto);
                                  }
                                }}
                                placeholder="Paste URL (YouTube, Drive, Facebook, Docs, PDF...)"
                                className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-colors"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-slate-500">Link Title</label>
                                {newLinkUrl.trim() && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const auto = getAutoLinkTitle(newLinkUrl);
                                      setNewLinkTitle(auto);
                                      setIsCustomLinkTitle(false);
                                    }}
                                    className="text-[10.5px] font-bold text-[#176BFF] hover:underline cursor-pointer"
                                  >
                                    Auto-detect title
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                data-form-type="other"
                                data-lpignore="true"
                                data-1p-ignore="true"
                                value={newLinkTitle}
                                onFocus={(e) => e.target.select()}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                onChange={(e) => {
                                  setNewLinkTitle(e.target.value);
                                  setIsCustomLinkTitle(true);
                                }}
                                placeholder="Link title (auto-detected from URL)"
                                className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-colors"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => setIsAddingLink(false)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-md transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={!newLinkUrl.trim()}
                                className="px-4 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer"
                              >
                                Add Link
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* 3. Resource Links List & Polished Empty State */}
                      <div className="space-y-3 w-full min-w-0">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resource Links ({topicLinks.length})</h4>
                        {topicLinks.length === 0 && !isAddingLink && (
                          <div className="p-6 bg-[#FAFBFD] dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#176BFF]">
                              <LinkIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">No resource links added yet</p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[240px] mt-0.5">
                                Tap above to attach study materials, YouTube lectures, or Google Drive notes.
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-1 gap-2.5 w-full min-w-0">
                          {topicLinks.map((l, lIdx) => {
                            const isEditing = !isMobileDevice && editingLinkId === l.id;
                            const isCopied = copiedLinkId === l.id;
                            const isMenuOpen = openLinkMenuId === l.id;

                            return (
                              <div
                                key={l.id || `topic-link-${lIdx}`}
                                className={`w-full min-w-0 max-w-full relative ${isMenuOpen ? 'z-[9999]' : 'z-0'}`}
                              >
                                      {/* Static Card with Smooth Accordion */}
                                      <div
                                        className={`grid w-full min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                          !isEditing ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                        }`}
                                      >
                                        <div className={`w-full min-w-0 ${isEditing ? 'overflow-hidden' : 'overflow-visible'}`}>
                                          <div className="group flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all w-full min-w-0 max-w-full">
                                            <a
                                              href={ensureExternalUrl(l.url)}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="flex items-center gap-3 min-w-0 flex-1 mr-2 overflow-hidden"
                                            >
                                              <span className="flex w-6 h-6 shrink-0 items-center justify-center">
                                                {renderLinkIcon(l.url, l.title)}
                                              </span>
                                              <div className="min-w-0 flex-1 overflow-hidden">
                                                <p className="text-xs font-bold text-slate-800 group-hover:text-[#176BFF] truncate transition-colors">
                                                  {l.title}
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                                                  {l.url.replace(/^https?:\/\/(www\.)?/, '')}
                                                </p>
                                              </div>
                                            </a>

                                            {/* Quick Action Bar (Copy with Feedback, Open, Edit, Delete) */}
                                            <div className="flex items-center gap-1 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => handleCopyLink(l.id, l.url)}
                                                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${isCopied
                                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                  : 'text-slate-400 hover:text-[#176BFF] hover:bg-blue-50'
                                                  }`}
                                                title={isCopied ? 'Copied to clipboard' : 'Copy link'}
                                              >
                                                {isCopied ? (
                                                  <>
                                                    <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                                                    <span className="text-[10px] text-emerald-600 font-extrabold">Copied</span>
                                                  </>
                                                ) : (
                                                  <Copy className="w-3.5 h-3.5" />
                                                )}
                                              </button>

                                              {/* 3-Dot Options Button & Dropdown Wrapper */}
                                              <div className="relative shrink-0 flex items-center z-30" data-link-menu>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const spaceBelow = window.innerHeight - rect.bottom;
                                                    setLinkMenuPlacement(spaceBelow < 180 ? 'top' : 'bottom');
                                                    setOpenLinkMenuId((prev) => (prev === l.id ? null : l.id));
                                                  }}
                                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isMenuOpen ? 'text-[#176BFF] bg-blue-100/80' : 'text-slate-400 hover:text-slate-700 hover:bg-blue-100/50'
                                                    }`}
                                                  title="More options"
                                                >
                                                  <MoreVertical className="w-3.5 h-3.5" />
                                                </button>

                                                {/* 3-Dot Options Dropdown */}
                                                <AnimatePresence>
                                                  {isMenuOpen && (
                                                    <motion.div
                                                      initial={{ opacity: 0, scale: 0.95, y: linkMenuPlacement === 'top' ? 8 : -8, originX: 1, originY: linkMenuPlacement === 'top' ? 1 : 0 }}
                                                      animate={{ opacity: 1, scale: 1, y: 0, originX: 1, originY: linkMenuPlacement === 'top' ? 1 : 0 }}
                                                      exit={{ opacity: 0, scale: 0.95, y: linkMenuPlacement === 'top' ? 8 : -8, originX: 1, originY: linkMenuPlacement === 'top' ? 1 : 0 }}
                                                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                                      className={`absolute right-0 w-36 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl z-[999999] space-y-0.5 ${linkMenuPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                                                        }`}
                                                      onClick={(e) => e.stopPropagation()}
                                                    >
                                                      {/* 1. Open in new tab */}
                                                      <a
                                                        href={ensureExternalUrl(l.url)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        onClick={() => setOpenLinkMenuId(null)}
                                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#176BFF] rounded-lg transition-colors text-left"
                                                      >
                                                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Open</span>
                                                      </a>

                                                      {/* 2. Edit */}
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setOpenLinkMenuId(null);
                                                          handleStartEditLink(l, 'topic');
                                                        }}
                                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#176BFF] rounded-lg transition-colors cursor-pointer text-left"
                                                      >
                                                        <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Edit</span>
                                                      </button>

                                                      <div className="h-px bg-slate-100 my-1" />

                                                      {/* 3. Delete */}
                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setOpenLinkMenuId(null);
                                                          setLinkToDelete({ id: l.id, title: l.title });
                                                        }}
                                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                                                      >
                                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Delete</span>
                                                      </button>
                                                    </motion.div>
                                                  )}
                                                </AnimatePresence>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Edit Form with Smooth Accordion */}
                                      <div
                                        className={`grid w-full min-w-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                          isEditing ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                                        }`}
                                      >
                                        <div className="overflow-hidden w-full min-w-0">
                                          <form
                                            onSubmit={(e) => {
                                              e.preventDefault();
                                              handleSaveEditedLink(l.id);
                                            }}
                                            style={{ scrollMarginBottom: '5px' }}
                                            className="space-y-3 p-3.5 bg-white border border-slate-200 rounded-xl w-full min-w-0 my-0.5"
                                          >
                                            <div className="space-y-1">
                                              <label className="text-[11px] font-semibold text-slate-500">Resource URL</label>
                                              <input
                                                type="text"
                                                value={editingLinkUrl}
                                                onChange={(e) => setEditingLinkUrl(e.target.value)}
                                                placeholder="Paste URL (YouTube, Drive, Facebook, Docs, PDF...)"
                                                className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#176BFF] focus:bg-white transition-colors"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-[11px] font-semibold text-slate-500">Link Title</label>
                                              <input
                                                type="text"
                                                value={editingLinkTitle}
                                                onFocus={(e) => e.target.select()}
                                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                                onChange={(e) => setEditingLinkTitle(e.target.value)}
                                                placeholder="Link title"
                                                className="w-full rounded-lg border border-[#D8E0EC] bg-[#FAFBFD] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#176BFF] focus:bg-white transition-colors"
                                              />
                                            </div>
                                            <div className="flex justify-end gap-2 pt-0.5">
                                              <button
                                                type="button"
                                                onClick={() => setEditingLinkId(null)}
                                                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-md transition-colors cursor-pointer"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="submit"
                                                disabled={!editingLinkUrl.trim()}
                                                className="px-4 py-1.5 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-40 rounded-md transition-colors cursor-pointer"
                                              >
                                                Save Changes
                                              </button>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                              </div>
                            );
                          })}
                        </div>

                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-3">Attached Files ({filesList.length})</h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {filesList.map((f) => (
                            <div key={f.id} className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4 text-red-500" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-800 truncate">{f.name}</p>
                                  <p className="text-[11px] text-slate-400">{f.size} • {f.date}</p>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-800 transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TOPIC & TASK ACTIVITY TAB VIEW (Clean, Minimal & Ultra-Premium) */}
                  {activeHeaderTab === 'activity' && (
                    <div className="flex-1 flex flex-col space-y-4 sm:space-y-5">
                      {/* Clean Minimal & Ultra-Premium Activity Header */}
                      <div className="bg-gradient-to-r from-blue-50/50 via-slate-50/30 to-white dark:from-slate-900/90 dark:via-slate-900/60 dark:to-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-2xs flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#176BFF] text-white flex items-center justify-center shadow-xs shrink-0 ring-4 ring-blue-50/80 dark:ring-blue-950/40">
                          <History className="w-4.5 h-4.5 stroke-[2.2]" />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-[15px] font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
                              Activity Timeline
                            </h3>
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/95 dark:bg-slate-800/90 text-slate-500 dark:text-slate-300 rounded-md text-[10.5px] font-medium border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{getRelativeUpdatedTime(lastTaskCheckedTime)}</span>
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal truncate">
                            Real-time stream of task completions, notes & attached resources
                          </p>
                        </div>
                      </div>

                      {/* Activity Category Filter Pills (Ultra-Clean & Snappy) */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        <button
                          type="button"
                          onClick={() => setActivityFilter('all')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 ${activityFilter === 'all'
                            ? 'bg-[#0F172A] text-white shadow-xs'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-[#0F172A]'
                            }`}
                        >
                          <span>All</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${activityFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {activityLogs.length}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActivityFilter('tasks')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 ${activityFilter === 'tasks'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                            }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${activityFilter === 'tasks' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {activityCompletedCount}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActivityFilter('notes')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 ${activityFilter === 'notes'
                            ? 'bg-[#176BFF] text-white shadow-xs'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-[#176BFF]'
                            }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Notes</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${activityFilter === 'notes' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {activityNotesCount}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActivityFilter('links')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 ${activityFilter === 'links'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-amber-700'
                            }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Resources</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${activityFilter === 'links' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {activityLinksCount}
                          </span>
                        </button>
                      </div>

                      {/* Connected Timeline View (Ultra-Professional & Linear-Grade UI) */}
                      {filteredActivityLogs.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center border border-dashed border-slate-200/90 rounded-2xl bg-slate-50/50 my-1 select-none flex-1 min-h-[220px]">
                          <Clock className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="text-xs font-semibold text-slate-700">
                            {activityFilter === 'all'
                              ? 'No activity logged yet'
                              : `No ${activityFilter} activity recorded yet`}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-xs leading-relaxed">
                            {activityFilter === 'all'
                              ? 'Complete tasks, add notes, or attach links to build your topic study history.'
                              : `Switch filter or add ${activityFilter} to view their event stream.`}
                          </p>
                        </div>
                      ) : (
                        <div className="relative pl-6 sm:pl-7 space-y-4 pb-4">
                          {/* Continuous Connected Vertical Spine Line (Perfect Center Alignment) */}
                          <div className="absolute left-[15px] sm:left-[18px] -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 rounded-full pointer-events-none" />

                          {filteredActivityLogs.map((log, idx) => {
                            let IconComponent = FileText;
                            let nodeBgClass = 'bg-[#176BFF] ring-slate-100 text-white';
                            let badgeClass = 'bg-slate-100 text-[#176BFF] border-slate-200';

                            if (log.type === 'task_complete') {
                              IconComponent = CheckCircle2;
                              nodeBgClass = 'bg-emerald-500 ring-emerald-100 text-white';
                              badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                            } else if (log.type === 'rename' || log.type === 'edit') {
                              IconComponent = Edit3;
                              nodeBgClass = 'bg-purple-500 ring-purple-100 text-white';
                              badgeClass = 'bg-purple-50 text-purple-700 border-purple-100';
                            } else if (log.type === 'link') {
                              IconComponent = LinkIcon;
                              nodeBgClass = 'bg-amber-500 ring-amber-100 text-white';
                              badgeClass = 'bg-amber-50 text-amber-700 border-amber-100';
                            } else if (log.type === 'task_add') {
                              IconComponent = Plus;
                              nodeBgClass = 'bg-sky-500 ring-sky-100 text-white';
                              badgeClass = 'bg-sky-50 text-sky-700 border-sky-100';
                            }

                            const isLatest = idx === 0;

                            return (
                              <div key={log.id} className="relative group">
                                {/* Connected Timeline Node Dot with Icon */}
                                <div className="absolute -left-[23px] sm:-left-[25px] top-3 z-10">
                                  {isLatest && (
                                    <span className="absolute -inset-1 rounded-full bg-blue-400/25 animate-ping" />
                                  )}
                                  <div
                                    className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ring-4 transition-transform group-hover:scale-110 ${nodeBgClass}`}
                                  >
                                    <IconComponent className="w-3.5 h-3.5 stroke-[2.4]" />
                                  </div>
                                </div>

                                {/* Timeline Card Container */}
                                <div className="p-3.5 sm:p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs hover:border-[#176BFF]/40 hover:shadow-xs transition-all duration-150 space-y-2">
                                  {/* Card Header Row */}
                                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                                      <span className="text-xs sm:text-[13px] font-bold text-[#0F172A] truncate">
                                        {log.title}
                                      </span>
                                      {log.badge && (
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border shrink-0 ${badgeClass}`}>
                                          {log.badge}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10.5px] sm:text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-300" />
                                      {log.timestamp}
                                    </span>
                                  </div>

                                  {/* Description Content */}
                                  <p className="text-[11.5px] sm:text-xs text-slate-600 font-normal leading-relaxed whitespace-pre-line break-words">
                                    {log.description}
                                  </p>

                                  {/* Footer Metadata */}
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] sm:text-[11px] text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-4 h-4 rounded-full bg-[#176BFF] text-white text-[9px] font-extrabold flex items-center justify-center">
                                        U
                                      </div>
                                      <span className="font-semibold text-slate-600">By {log.user || 'You'}</span>
                                    </div>
                                    <span className="font-medium text-slate-400">{log.category || 'Topic'}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </AnimatePresence>

      {/* Move Task to Recycle Bin Confirmation Modal inside TopicDetailsDrawer */}
      <AnimatePresence>
        {taskToDelete && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setTaskToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[420px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col items-center text-center overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Move task to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[340px]">
                “<span className="font-semibold text-slate-800">{taskToDelete.title}</span>” will be moved to the Recycle Bin. You can restore it later without losing progress.
              </p>

              <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setTaskToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (topic) {
                      onDeleteTask?.(topic.id, taskToDelete.id);
                    }
                    setTaskToDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Move to Recycle Bin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Move Tasks to Recycle Bin Confirmation Modal inside TopicDetailsDrawer */}
      <AnimatePresence>
        {isBulkDeleteTaskConfirmOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsBulkDeleteTaskConfirmOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[420px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col items-center text-center overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setIsBulkDeleteTaskConfirmOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Move {selectedTaskIds.length} task{selectedTaskIds.length > 1 ? 's' : ''} to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[340px]">
                The selected <span className="font-semibold text-slate-800">{selectedTaskIds.length} task{selectedTaskIds.length > 1 ? 's' : ''}</span> will be moved to the Recycle Bin. You can restore them later without losing progress.
              </p>

              <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setIsBulkDeleteTaskConfirmOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleBulkDelete();
                    setIsBulkDeleteTaskConfirmOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Move to Recycle Bin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Note Confirmation Modal */}
      <AnimatePresence>
        {noteToDelete && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-xs cursor-pointer"
              onClick={() => setNoteToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.14, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-2xl max-w-[440px] w-full pt-4 px-6 pb-5 shadow-2xl shadow-slate-900/20 border border-slate-200/90 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Playful Premium Trash Can Illustration */}
              <div className="relative mb-2 -mt-1 flex items-center justify-center select-none pointer-events-none">
                <svg
                  width="128"
                  height="94"
                  viewBox="0 0 140 102"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible"
                >
                  {/* Soft Ground Shadow */}
                  <ellipse cx="70" cy="94" rx="46" ry="4" fill="#FFE2E7" />

                  {/* Floating Sparkles & Dots */}
                  {/* Top Right Cross */}
                  <path d="M102 16V24M98 20H106" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Middle Left Cross */}
                  <path d="M35 38V46M31 42H39" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Lower Left Cross */}
                  <path d="M22 71V79M18 75H26" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
                  {/* Top Center Dot */}
                  <circle cx="65" cy="18" r="2.4" fill="#E11D48" />
                  {/* Middle Right Ring */}
                  <circle cx="108" cy="69" r="3.2" stroke="#E11D48" strokeWidth="2" fill="none" />
                  {/* Lower Right Dot */}
                  <circle cx="98" cy="90" r="2.4" fill="#E11D48" />

                  {/* Tilted Lid with Handle (Rotated -8.5deg around center) */}
                  <g transform="rotate(-8.5 70 34)">
                    {/* Handle */}
                    <path
                      d="M62 20C62 17.2 64.2 15 67 15H73C75.8 15 78 17.2 78 20V26H62V20Z"
                      fill="#E11D48"
                    />
                    <path
                      d="M65.5 20.5C65.5 19.5 66.2 18.5 67.5 18.5H72.5C73.8 18.5 74.5 19.5 74.5 20.5V26H65.5V20.5Z"
                      fill="white"
                    />
                    {/* Lid Main Bar */}
                    <rect x="46" y="25" width="48" height="11" rx="5.5" fill="#E11D48" />
                  </g>

                  {/* Bin Bucket Body */}
                  <path
                    d="M49 41.5H91L87 78.5C86.6 82.5 83.2 85.5 79.2 85.5H60.8C56.8 85.5 53.4 82.5 53 78.5L49 41.5Z"
                    fill="#E11D48"
                  />

                  {/* 3 White Slats on Bin */}
                  <rect x="56.5" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="67.75" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                  <rect x="79" y="47.5" width="4.5" height="28" rx="2.25" fill="white" />
                </svg>
              </div>

              {/* Modal Header */}
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Delete This Note?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[360px]">
                Are you sure? This note will be permanently deleted.
              </p>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-end gap-2.5 mt-5">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setNoteToDelete(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteNoteItem(noteToDelete.id, noteToDelete.isTopicNote, noteToDelete.taskId);
                    setNoteToDelete(null);
                  }}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Delete Note</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Link Confirmation Modal */}
      <AnimatePresence>
        {linkToDelete && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setLinkToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-2xl max-w-[400px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 flex flex-col items-center text-center overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setLinkToDelete(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-3.5 shrink-0 shadow-2xs">
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Delete this link?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[320px] truncate">
                “<span className="font-semibold text-slate-800">{linkToDelete.title}</span>” will be permanently removed.
              </p>

              <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => setLinkToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteLinkItem(linkToDelete.id);
                    setLinkToDelete(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Delete Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* UNSAVED CHANGES CONFIRMATION MODAL */}
      <AnimatePresence>
        {pendingAction && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setPendingAction(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-2xl max-w-[400px] w-full p-6 shadow-2xl shadow-slate-900/20 border border-slate-200/90 flex flex-col items-center text-center overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center mb-3.5 shrink-0 shadow-2xs">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Discard unsaved changes?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                You have typed text in an input box. If you continue now, your unsaved changes will be lost.
              </p>

              <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleDiscardAndProceed}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Discard Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STILL STUDYING PRESENCE CHECK MODAL (Standalone fallback) */}
      <AnimatePresence>
        {!onStartStudyTimer && isStillStudyingPromptOpen && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative z-10 bg-white rounded-3xl max-w-[380px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/90 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#176BFF] border border-blue-200/80 flex items-center justify-center mb-3.5 shrink-0 shadow-sm animate-bounce" style={{ animationDuration: '2s' }}>
                <Bell className="w-7 h-7 stroke-[2.3]" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Still Studying? 📖
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[310px]">
                You reached your <b>{focusCheckIntervalMinutes === 0.5 ? '30-second' : `${focusCheckIntervalMinutes}-minute`}</b> focus milestone for “<span className="font-semibold text-slate-800">{activeTask?.title || 'this task'}</span>”!
              </p>

              <div className="w-full flex flex-col gap-2 mt-6">
                <button
                  autoFocus
                  type="button"
                  onClick={handleResumeStillStudying}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Yes, Keep Studying!
                </button>
                <button
                  type="button"
                  onClick={handleStopAndSaveFromPrompt}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Take a Break & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 📱💻 ULTRA-PREMIUM KEYBOARD-AWARE QUICK NOTE MODAL / SHEET (MOBILE & DESKTOP) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileNoteModalOpen && (
          <div className="fixed inset-0 z-[99999999] flex flex-col justify-end sm:justify-center sm:items-center sm:p-4">
            {/* Backdrop with quick tap to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-[3px] cursor-pointer"
              onClick={() => {
                setIsMobileNoteModalOpen(false);
                setEditingNoteId(null);
                setEditingNoteTaskId(undefined);
                setEditingNoteInput('');
                setNewNoteInput('');
              }}
            />

            {/* Modal / Sheet Container */}
            <motion.div
              initial={{ y: isMobileDevice ? '100%' : 8, opacity: 0, scale: isMobileDevice ? 1 : 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: isMobileDevice ? '100%' : 8, opacity: 0, scale: isMobileDevice ? 1 : 0.96 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 350,
                mass: 0.8
              }}
              style={{
                marginBottom: isMobileDevice ? `${mobileKeyboardBottomInset}px` : undefined,
                transition: isMobileDevice ? 'margin-bottom 0.18s cubic-bezier(0.16, 1, 0.3, 1)' : undefined
              }}
              className="relative z-10 w-full sm:max-w-[480px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200/90 p-4 sm:p-6 flex flex-col gap-3.5 max-h-[85vh] overflow-hidden select-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  {editingNoteId
                    ? 'Edit Note'
                    : mobileNoteTarget === 'topic'
                      ? `Add Note to Topic (${topic?.title || 'Topic'})`
                      : `Add Note to Task (${activeTask?.title || 'Task'})`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNoteModalOpen(false);
                    setEditingNoteId(null);
                    setEditingNoteTaskId(undefined);
                    setEditingNoteInput('');
                    setNewNoteInput('');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingNoteId) {
                    saveEditedNote(editingNoteId, mobileNoteTarget === 'topic', editingNoteTaskId);
                  } else {
                    addNote(e);
                  }
                  setIsMobileNoteModalOpen(false);
                  setEditingNoteTaskId(undefined);
                }}
                className="flex flex-col gap-3.5"
              >
                <textarea
                  autoFocus
                  ref={(el) => {
                    if (el) {
                      el.focus();
                    }
                  }}
                  value={editingNoteId ? editingNoteInput : newNoteInput}
                  onChange={(e) => {
                    if (editingNoteId) {
                      setEditingNoteInput(e.target.value);
                    } else {
                      setNewNoteInput(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      if (editingNoteId) {
                        if (editingNoteInput.trim()) {
                          saveEditedNote(editingNoteId, mobileNoteTarget === 'topic', editingNoteTaskId);
                          setIsMobileNoteModalOpen(false);
                          setEditingNoteTaskId(undefined);
                        }
                      } else {
                        if (newNoteInput.trim()) {
                          addNote(e as any);
                          setIsMobileNoteModalOpen(false);
                        }
                      }
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      setIsMobileNoteModalOpen(false);
                      setEditingNoteId(null);
                      setEditingNoteTaskId(undefined);
                      setEditingNoteInput('');
                      setNewNoteInput('');
                    }
                  }}
                  rows={4}
                  placeholder="Write your note here…"
                  className="w-full text-sm sm:text-xs text-slate-900 dark:text-slate-100 bg-[#FAFBFD] dark:bg-slate-900 border border-[#D8E0EC] dark:border-slate-800 rounded-xl p-3.5 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-[#176BFF] dark:focus:border-blue-500 transition-colors resize-none min-h-[110px] max-h-[220px] overflow-y-auto note-font"
                />

                {/* Keyboard / Bottom Accessory Action Bar */}
                <div className="flex items-center justify-between gap-3 pt-0.5">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {editingNoteId ? `${editingNoteInput.trim().length} chars` : `${newNoteInput.trim().length} chars`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileNoteModalOpen(false);
                        setEditingNoteId(null);
                        setEditingNoteTaskId(undefined);
                        setEditingNoteInput('');
                        setNewNoteInput('');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editingNoteId ? !editingNoteInput.trim() : !newNoteInput.trim()}
                      className="px-5 py-2 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{editingNoteId ? 'Update Note' : 'Save Note'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 🔗 ULTRA-PREMIUM KEYBOARD-AWARE FLOATING QUICK LINK SHEET (MOBILE UX)     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileLinkModalOpen && (
          <div className="fixed inset-0 z-[99999999] flex flex-col justify-end sm:justify-center sm:items-center sm:p-4">
            {/* Backdrop with quick tap to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-[3px] cursor-pointer touch-none"
              onClick={() => {
                setIsMobileLinkModalOpen(false);
                setEditingLinkId(null);
                setNewLinkTitle('');
                setNewLinkUrl('');
                setEditingLinkTitle('');
                setEditingLinkUrl('');
              }}
            />

            {/* Floating Sheet Container */}
            <motion.div
              initial={{ y: isMobileDevice ? '100%' : 8, opacity: 0, scale: isMobileDevice ? 1 : 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: isMobileDevice ? '100%' : 8, opacity: 0, scale: isMobileDevice ? 1 : 0.96 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 350,
                mass: 0.8
              }}
              style={{
                marginBottom: isMobileDevice ? `${mobileKeyboardBottomInset}px` : undefined,
                transition: isMobileDevice ? 'margin-bottom 0.18s cubic-bezier(0.16, 1, 0.3, 1)' : undefined
              }}
              className="relative z-10 w-full sm:max-w-[480px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col gap-3.5 max-h-[85vh] overflow-hidden"
            >
              {/* Sheet Drag Indicator & Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#176BFF]" />
                  <span className="text-xs font-bold text-slate-800">
                    {editingLinkId
                      ? 'Edit Link'
                      : mobileLinkTarget === 'topic'
                        ? `Add Link to Topic (${topic?.title || 'Topic'})`
                        : `Add Link to Task (${activeTask?.title || 'Task'})`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileLinkModalOpen(false);
                    setEditingLinkId(null);
                    setNewLinkTitle('');
                    setNewLinkUrl('');
                    setEditingLinkTitle('');
                    setEditingLinkUrl('');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Clean Mobile Link Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingLinkId) {
                    handleSaveEditedLink(editingLinkId);
                  } else {
                    addLink(e);
                  }
                }}
                autoComplete="off"
                data-form-type="other"
                className="flex flex-col gap-2.5"
              >
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="mobile-link-url" className="text-[10.5px] font-semibold text-slate-600">Resource URL</label>
                  <input
                    id="mobile-link-url"
                    name="studyflow-resource-url-field"
                    type="search"
                    inputMode="text"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    data-lpignore="true"
                    data-form-type="other"
                    value={editingLinkId ? editingLinkUrl : newLinkUrl}
                    onChange={(e) => {
                      if (editingLinkId) {
                        setEditingLinkUrl(e.target.value);
                      } else {
                        setNewLinkUrl(e.target.value);
                      }
                    }}
                    placeholder="Paste URL (e.g. https://...)"
                    className="w-full h-[34px] text-xs text-slate-900 bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 outline-none focus:bg-white focus:border-slate-400 placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <label htmlFor="mobile-link-title" className="text-[10.5px] font-semibold text-slate-600">
                    {editingLinkId ? 'Link Title' : 'Link Title (Optional)'}
                  </label>
                  <input
                    id="mobile-link-title"
                    name="studyflow-resource-title-field"
                    type="search"
                    inputMode="text"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    data-lpignore="true"
                    data-form-type="other"
                    value={editingLinkId ? editingLinkTitle : newLinkTitle}
                    onChange={(e) => {
                      if (editingLinkId) {
                        setEditingLinkTitle(e.target.value);
                      } else {
                        setNewLinkTitle(e.target.value);
                      }
                    }}
                    placeholder={editingLinkId ? 'Link title' : 'Custom title (leave blank for auto-generate)'}
                    className="w-full h-[34px] text-xs text-slate-900 bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 outline-none focus:bg-white focus:border-slate-400 placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
                  />
                </div>

                {/* Keyboard Accessory Action Bar */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileLinkModalOpen(false);
                      setEditingLinkId(null);
                      setNewLinkTitle('');
                      setNewLinkUrl('');
                      setEditingLinkTitle('');
                      setEditingLinkUrl('');
                    }}
                    className="h-[32px] px-3.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editingLinkId ? !editingLinkUrl.trim() : !newLinkUrl.trim()}
                    className="h-[32px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {editingLinkId ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== ACTIVE TIMER CONFLICT WARNING MODAL ==================== */}
      <AnimatePresence>
        {isTimerConflictModalOpen && (() => {
          // Resolve info for the currently running timer
          const runningTopicId = activeStudyTimerSession?.topicId;
          const runningTaskId = activeStudyTimerSession?.taskId || activeTimerTaskId;
          const runningTopic = allTopics.find((t) => t.id === runningTopicId) || topic;
          const runningTask =
            runningTopic?.tasks?.find((tk) => tk.id === runningTaskId) ||
            tasksList.find((tk) => tk.id === runningTaskId);

          const runningWorkspaceId = activeStudyTimerSession?.workspaceId || runningTopic?.workspaceId;
          const runningWorkspace = workspaces.find((w) => w.id === runningWorkspaceId);
          const workspaceName = runningWorkspace?.name || 'My Workspace';
          const sectionName = runningTopic?.section && runningTopic.section.trim().length > 0 ? runningTopic.section.trim() : null;
          const topicName = runningTopic?.title || activeStudyTimerSession?.topicTitle || 'Active Topic';
          const taskName = runningTask?.title || activeStudyTimerSession?.taskTitle || 'Active Task';

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm select-none"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-950/20 dark:shadow-slate-950/50 overflow-hidden"
              >
                {/* Red Warning Header */}
                <div className="p-6 text-center space-y-3 pb-5">
                  {/* Warning Icon Badge */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 shadow-xs">
                    <AlertTriangle className="w-7 h-7 stroke-[2.2] animate-pulse text-rose-600 dark:text-rose-400" />
                  </div>

                  {/* Warning Label & Header Text */}
                  <div>
                    <span className="text-[11px] font-black tracking-widest text-rose-600 dark:text-rose-400 uppercase">
                      Warning
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      Study Timer Already Active
                    </h3>
                  </div>

                  {/* Warning Message */}
                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                    A study session is already running on another task. Please stop and log the ongoing timer before tracking time here, or switch directly.
                  </p>

                  {/* 2 Info Card Details (Workspace, Section [if exists], Topic, Task) */}
                  <div className="bg-slate-50/90 dark:bg-slate-950/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 text-left space-y-2 mt-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Workspace:</span>
                      <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[210px] text-right">
                        {workspaceName}
                      </span>
                    </div>

                    {sectionName && (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Section:</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[210px] text-right">
                          {sectionName}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Topic:</span>
                      <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[210px] text-right">
                        {topicName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Task:</span>
                      <span className="text-rose-700 dark:text-rose-400 font-bold truncate max-w-[210px] text-right">
                        "{taskName}"
                      </span>
                    </div>
                  </div>

                  {/* 3 Action Buttons */}
                  <div className="space-y-2 pt-2">
                    {/* Action 1: View Running Task */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerConflictModalOpen(false);
                        if (runningTopicId && runningTaskId) {
                          if (onNavigateToTask) {
                            onNavigateToTask(runningTopicId, runningTaskId, runningWorkspaceId);
                          } else {
                            setSelectedTaskId(runningTaskId);
                            setMobileActiveView('details');
                            setActiveHeaderTab('tasks');
                          }
                        }
                      }}
                      className="w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      <span>View Running Task</span>
                    </button>

                    {/* Action 2: Stop & Switch Here */}
                    <button
                      type="button"
                      onClick={() => {
                        const prevTaskId = runningTaskId || activeStudyTimerSession?.taskId;
                        // Stop and log the previous running session
                        if (prevTaskId && onStopStudyTimer) {
                          onStopStudyTimer(prevTaskId);
                        }

                        setIsTimerConflictModalOpen(false);

                        // Start timer on this present task and open its Time Spent modal
                        if (activeTask && topic) {
                          if (onStartStudyTimer) {
                            onStartStudyTimer(topic.id, topic.title, activeTask.id, activeTask.title);
                          } else {
                            setActiveTimerTaskId(activeTask.id);
                            setIsTimerPaused(false);
                            setTimerSeconds(0);
                            timerStartTimeRef.current = Date.now();
                            timerAccumulatedSecondsRef.current = 0;
                            lastTriggeredMilestoneSecRef.current = 0;
                            setIsStillStudyingPromptOpen(false);
                          }
                          setIsTimeMenuOpen(true);
                          showToast?.('Switched study timer to this task! ⏱️');
                        }
                      }}
                      className="w-full h-10 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop & Switch Here</span>
                    </button>

                    {/* Action 3: Dismiss */}
                    <button
                      type="button"
                      onClick={() => setIsTimerConflictModalOpen(false)}
                      className="w-full h-10 rounded-xl bg-[#176BFF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ========================================================================= */}
    </>
  );
};
