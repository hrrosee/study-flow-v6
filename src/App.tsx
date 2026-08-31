import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Command,
  Folder,
  Plus,
  Star,
  Trash2,
  Download,
  Upload,
  Settings,
  Menu,
  Clock,
  Bell,
  Play,
  ExternalLink,
  Youtube,
  SlidersHorizontal,
  Loader2,
  Grid,
  TrendingUp,
  Target,
  Flame,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Pencil,
  ArrowUpDown,
  ArrowDownAZ,
  Check,
  Calendar,
  X,
  CheckCircle2,
  RotateCcw,
  BarChart2,
  AlignLeft,
  AlertCircle,
  GripVertical,
  ListTodo,
  CheckSquare,
  Square,
  PieChart,
  Info,
  Keyboard,
  BookOpen,
  Atom,
  FlaskConical,
  FileText,
  Feather,
  PenTool,
  MessageSquare,
  Activity,
  LayoutGrid,
  List,
  Hash,
  Pin,
  Copy,
  CornerUpRight,
  AlertTriangle,
  Mic,
  Headphones,
  Book,
  Filter,
  FolderOutput,
  Calculator,
  Percent,
  Shapes,
  Triangle,
  Binary,
  BrainCircuit,
  Lightbulb,
  Scale,
  Landmark,
  Flag,
  Medal,
  Shield,
  CircleDollarSign,
  Coins,
  Waves,
  Mountain,
  Trees,
  Sprout,
  Zap,
  Building,
  Code2,
  Terminal,
  ShieldCheck,
  Lock,
  Globe,
  Cloud,
  Wifi,
  Database,
  Cpu,
  HardDrive,
  Bot,
  Languages,
  SpellCheck,
  Timer,
  History,
  Compass,
  Globe2,
  BookMarked,
  Pi,
  Radical,
  Infinity,
  Variable,
  Divide,
  Equal,
  Sigma,
  Superscript,
  Subscript,
  GraduationCap,
  Microscope,
  Dna,
  Binary as BinaryIcon,
  Library,
  BookOpenCheck,
  NotebookPen,
  Scroll,
  FileCode2,
  FileSpreadsheet,
  GlobeLock,
  Workflow,
  Network,
  Award,
  Crown,
  Trophy,
  Landmark as LandmarkIcon,
  Building2,
  HeartPulse,
  Syringe,
  Pill,
  Stethoscope,
  Radio,
  Satellite,
  Gauge,
  Magnet,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Droplets,
  Milestone,
  MapPin,
  Map,
  Layers,
  Presentation,
  Lightbulb as LightbulbIcon,
  Train,
  Ship,
  HelpCircle,
  Dices,
  Box,
  Users,
  UserCheck,
  Wheat,
  Factory,
  Wallet,
  Vote,
  Fingerprint,
  Eye,
  ShieldAlert,
  HelpCircle as QuestionIcon,
  Palette,
  // 25 Subjects Rich Icon Set
  Type,
  BookA,
  NotebookTabs,
  WholeWord,
  TextCursor,
  Pilcrow,
  CaseSensitive,
  Brackets,
  BookOpenText,
  Quote,
  Notebook,
  PenLine,
  BookCopy,
  BadgeCheck,
  ScrollText,
  Theater,
  SquareFunction,
  ChartNoAxesColumn,
  Brain,
  Puzzle,
  Blocks,
  Route,
  ScanSearch,
  GitBranch,
  Waypoints,
  MapPinned,
  Earth,
  Handshake,
  Plane,
  Telescope,
  TestTube,
  TestTubes,
  Orbit,
  Thermometer,
  Leaf,
  Radiation,
  Monitor,
  Computer,
  Microchip,
  Server,
  Navigation,
  TreePine,
  Recycle,
  CloudSun,
  Flower,
  Flower2,
  Biohazard,
  Siren,
  CloudLightning,
  LifeBuoy,
  Ambulance,
  Cross,
  HeartHandshake,
  HandHeart,
  Heart,
  Smile,
  Gem,
  ThumbsUp,
  FileCheck,
  ClipboardCheck,
  Gavel,
  Newspaper,
  Rss,
  Megaphone,
  CalendarDays,
  Tv,
  Podcast,
  MessageSquareMore,
  CircleHelp,
  Castle,
  Swords,
  Hourglass,
  Clock3,
  BookCheck,
  Banknote,
  CreditCard,
  WalletCards,
  Receipt,
  ChartNoAxesCombined,
  PiggyBank,
  Vault,
  BadgeDollarSign,
  HandCoins,
  Tractor,
  Shovel,
  Apple,
  Warehouse,
  Dumbbell,
  Volleyball,
  Bike,
  Goal,
  FlagTriangleRight,
  Volume2,
  LogIn,
  LogOut,
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  ListOrdered,
  Highlighter,
  Minus,
  Code,
  Edit3,
  Underline
} from 'lucide-react';
import { CustomSelect } from './components/CustomSelect';
import { TopicDetailsDrawer } from './components/TopicDetailsDrawer';
import { CardTopicHeader } from './components/CardTopicHeader';
import { SettingsModal } from './components/SettingsModal';
import { ShortcutsAndGuideModal } from './components/ShortcutsAndGuideModal';
import { AnalyticsStudio } from './components/AnalyticsStudio';
import { AuthModal } from './components/AuthModal';
import { UserProfilePopover } from './components/UserProfilePopover';
import { EditProfileModal } from './components/EditProfileModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { auth, onAuthStateChanged, getRedirectResult, logoutUser, sendPasswordReset, User as FirebaseUser } from './firebase';
import { saveUserDataToCloud, fetchUserDataFromCloud, subscribeToCloudData } from './utils/firestoreSync';
import { TopicCelebrationModal, CelebrationTopicData } from './components/TopicCelebrationModal';
import { TodaysGoalPopover, WorkspaceGoalStat, GoalTaskItem, formatGoalDuration, getMotivationalMessage } from './components/TodaysGoalPopover';
import { GoalCelebrationModal } from './components/GoalCelebrationModal';
import { StreakPopover } from './components/StreakPopover';
import { FloatingStudyTimer, ActiveStudyTimerSession, formatTimerClock } from './components/FloatingStudyTimer';
import { triggerMilestoneNotificationAndVibrate } from './components/TopicDetailsDrawer';
import { loadStreakData, recordDailyGoalAchieved, StreakData } from './utils/streakManager';
import { UserSettings, StandaloneTask } from './types';
import { useLongPress } from './hooks/useLongPress';
import { soundManager } from './utils/audio';
import { triggerMiniTaskConfetti, triggerTopicCompleteCelebration } from './utils/confetti';
import { applyTheme, getInitialTheme, getInitialAccentColor } from './utils/themeManager';
import { SmartTopicStudioModal } from './components/SmartTopicStudioModal';
import { detectLinkType } from './utils/studioMarkdownParser';
import { NotesStudio } from './components/NotesStudio';
import { SearchView } from './components/SearchView';
import { RecycleBinStudio } from './components/RecycleBinStudio';
import { TasksStudio } from './components/TasksStudio';

// Custom Reorder Workspaces SVG Icon (Up Chevron + Middle Bar + Down Chevron)
const ReorderWorkspacesIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 7l6-5 6 5" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <path d="M6 17l6 5 6-5" />
  </svg>
);

// Interfaces
export interface NoteItem {
  id: string;
  text: string;
  date: string;
  isPinned?: boolean;
}

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  workspaceId?: string;
  color?: 'default' | 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';
  isPinned?: boolean;
  createdAt: number;
  updatedAt: number;
}

export function formatNoteRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  const d = new Date(timestamp);
  const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const timeStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${dateStr}, ${timeStr}`;
}

export function getNoteDisplayTitle(note: StudyNote): string {
  if (note.title && note.title.trim()) {
    return note.title.trim();
  }
  if (note.content && note.content.trim()) {
    const firstLine = note.content.trim().split('\n')[0] || '';
    const cleanLine = firstLine.replace(/^(#+\s*|-\s*\[[ xX]\]\s*|[-*]\s*|\d+\.\s*|>\s*)/, '').trim();
    if (cleanLine) {
      return cleanLine.length > 60 ? `${cleanLine.substring(0, 60)}...` : cleanLine;
    }
  }
  return 'Untitled Note';
}

// Helper for inline markdown: **bold**, *italic*, ~~strike~~, ==highlight==, `code`
export const formatInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return '';

  const regex = /(\*\*.*?\*\*|==.*?==|~~.*?~~|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('==') && part.endsWith('==') && part.length >= 4) {
      return (
        <mark key={index} className="bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded font-medium shadow-3xs">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return <del key={index} className="line-through text-slate-400">{part.slice(2, -2)}</del>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index} className="italic text-slate-700">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const renderStudyNoteMarkdown = (
  content: string,
  onToggleCheckbox: (lineIdx: number) => void,
  onStartEditing?: () => void
) => {
  if (!content.trim()) {
    return (
      <div
        onClick={onStartEditing}
        className="py-16 text-center text-slate-400 font-sans text-xs flex flex-col items-center justify-center gap-2 cursor-text hover:bg-slate-100/50 rounded-xl transition-colors select-none"
      >
        <Edit3 className="w-6 h-6 text-slate-300 stroke-[1.5]" />
        <p className="font-semibold text-slate-600">Note is empty</p>
        <p className="text-[11.5px] text-slate-400">Tap anywhere to start typing...</p>
      </div>
    );
  }

  const lines = content.split('\n');

  return (
    <div
      onClick={onStartEditing}
      className="space-y-1 font-sans text-[14px] sm:text-[15px] leading-relaxed text-slate-800 select-text cursor-text min-h-[300px]"
    >
      {lines.map((line, idx) => {
        // Horizontal Rule
        if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
          return <hr key={idx} className="my-4 border-slate-200" />;
        }

        // H1
        if (line.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-serif text-2xl font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-100">
              {formatInlineMarkdown(line.substring(2))}
            </h1>
          );
        }

        // H2
        if (line.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-serif text-xl font-bold text-slate-800 mt-3 mb-1.5">
              {formatInlineMarkdown(line.substring(3))}
            </h2>
          );
        }

        // H3
        if (line.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-serif text-lg font-semibold text-slate-800 mt-2.5 mb-1">
              {formatInlineMarkdown(line.substring(4))}
            </h3>
          );
        }

        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-4 border-[#2563EB]/60 pl-3 py-1 bg-blue-50/40 text-slate-700 rounded-r-md my-1.5 italic text-[13.5px]">
              {formatInlineMarkdown(line.substring(2))}
            </blockquote>
          );
        }

        // Checklist Item
        const checkMatch = line.match(/^(\s*)-\s\[([ xX])\]\s(.*)$/);
        if (checkMatch) {
          const isChecked = checkMatch[2].toLowerCase() === 'x';
          const text = checkMatch[3];
          return (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCheckbox(idx);
              }}
              className="flex items-start gap-2.5 py-1 px-1 rounded-md hover:bg-slate-100/60 transition-colors cursor-pointer group select-none"
            >
              <button
                type="button"
                className={`mt-1 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  isChecked
                    ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-3xs'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className={`flex-1 select-text ${isChecked ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                {formatInlineMarkdown(text)}
              </span>
            </div>
          );
        }

        // Bullet Item
        const bulletMatch = line.match(/^(\s*)[-*]\s(.*)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 py-0.5 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-2 shrink-0" />
              <span className="flex-1">{formatInlineMarkdown(bulletMatch[2])}</span>
            </div>
          );
        }

        // Numbered Item
        const numMatch = line.match(/^(\s*)(\d+)\.\s(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 py-0.5 pl-2">
              <span className="font-semibold text-xs text-[#2563EB] mt-1 shrink-0 w-4">{numMatch[2]}.</span>
              <span className="flex-1">{formatInlineMarkdown(numMatch[3])}</span>
            </div>
          );
        }

        // Blank line
        if (!line.trim()) {
          return <div key={idx} className="h-2.5" />;
        }

        return (
          <p key={idx} className="py-0.5 leading-relaxed">
            {formatInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Intelligent Bangla & English Grapheme Cluster Initial Extractor
 * Extracts complete consonant conjuncts with vowel signs (kar) and modifiers:
 * e.g., "রোজ" -> "রো", "জ্ঞানী" -> "জ্ঞা", "বিজ্ঞান" -> "বি", "স্কুল" -> "স্কু", "Math" -> "M"
 */
export function getWorkspaceInitial(name: string): string {
  if (!name || !name.trim()) return 'W';
  const trimmed = name.trim();

  // If first character is Bengali
  if (/[\u0980-\u09FF]/.test(trimmed)) {
    const banglaGraphemeRegex = /^([\u0985-\u09B9\u09CE\u09DC-\u09DF](\u09CD[\u0985-\u09B9\u09DC-\u09DF])*[\u09BE-\u09CC\u09D7\u0981-\u0983]?)/u;
    const match = trimmed.match(banglaGraphemeRegex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return trimmed.charAt(0).toUpperCase();
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type?: 'drive' | 'facebook' | 'youtube' | 'chrome' | 'pdf';
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

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
  studySessions?: Array<{ id: string; timestamp: number; durationSeconds: number }>;
  lastStudyDate?: string;
  confidence?: 'mastered' | 'high' | 'medium' | 'low' | 'none';
  notes?: NoteItem[];
  links?: ResourceLink[];
  subtasks?: ChecklistItem[];
}

export interface Topic {
  id: string;
  title: string;
  section: string;
  expanded: boolean;
  isPinned?: boolean;
  tasks: TaskItem[];
  workspaceId: string;
  notes?: NoteItem[];
  links?: ResourceLink[];
  customColor?: string;
  customIcon?: string;
  createdAt?: string;
}

export interface WorkspaceWindow {
  id: string;
  name: string;
  isPinned?: boolean;
  pinnedAt?: number;
}

// Animated Number Component for Smooth Counter Transitions
function AnimatedNumber({ value, duration = 400, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const startVal = previousValueRef.current;
    const endVal = value;
    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        previousValueRef.current = endVal;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
      previousValueRef.current = endVal;
    };
  }, [value, duration]);

  return <span>{prefix}{displayValue}{suffix}</span>;
}

function playNotificationAudioChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
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

export interface SectionItem {
  id: string;
  workspaceId: string;
  name: string;
}

export const LongPressItem: React.FC<{
  onLongPress: () => void;
  onClick?: (e?: any) => void;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}> = ({ onLongPress, onClick, className, children, ...restProps }) => {
  const { handlers, ripple, isPressed } = useLongPress({
    threshold: 380,
    onLongPress,
    onClick,
  });

  return (
    <div
      {...handlers}
      {...restProps}
      className={`relative overflow-hidden transition-colors duration-150 ${
        isPressed ? 'bg-slate-100/60' : ''
      } ${className || ''}`}
    >
      {children}
      {ripple && (
        <motion.span
          key={ripple.key}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 4.2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-24 h-24 bg-blue-500/25 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-40"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
    </div>
  );
};

export function App() {

  

  // --- LocalStorage Helpers ---
  const loadInitialData = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  // --- Clock State ---
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setDateString(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Professional Notification & Toast System ---
  interface NotificationItem {
    id: string;
    title: string;
    time: string;
    read: boolean;
    type?: 'focus' | 'reminders' | 'system';
    description?: string;
  }
  interface ToastData {
    message: string;
    undoAction?: () => void;
    duration?: number;
  }
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    { id: 'notif-1', title: 'Welcome to StudyFlow Workspace!', time: 'Just now', read: false, type: 'system', description: 'Your focus dashboard and topic tracker are active.' },
    { id: 'notif-2', title: 'Focus Check-in Timer Ready ⏱️', time: '5m ago', read: false, type: 'focus', description: 'Interval milestone alerts will keep your study sessions sharp.' }
  ]);

  const showToast = (message: string, undoAction?: () => void, duration?: number) => {
    const effectiveDuration = duration !== undefined ? duration : (undoAction ? 6000 : 3500);
    setToastData({ message, undoAction, duration: effectiveDuration });

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const isStudy = /study|timer|focus|milestone|session|check-in/i.test(message);
    const isReminder = /due|overdue|deadline|date|recycle/i.test(message);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: message,
      time: formattedTime,
      read: false,
      type: isStudy ? 'focus' : isReminder ? 'reminders' : 'system'
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  useEffect(() => {
    if (!toastData) return;
    const timer = setTimeout(() => {
      setToastData(null);
    }, toastData.duration || 6000);
    return () => clearTimeout(timer);
  }, [toastData]);

  // --- Workspaces State ---
  const [workspaces, setWorkspaces] = useState<WorkspaceWindow[]>(() =>
    loadInitialData('studyflow_workspaces', [
      { id: '1', name: 'Workspace' }
    ])
  );
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() =>
    loadInitialData('studyflow_active_workspace', '1')
  );

  useEffect(() => {
    localStorage.setItem('studyflow_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('studyflow_active_workspace', JSON.stringify(activeWorkspaceId));
    if (activeWorkspaceId) {
      const desktopEl = document.getElementById(`sidebar-workspace-${activeWorkspaceId}`);
      if (desktopEl) {
        desktopEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      const mobileEl = document.getElementById(`mobile-sidebar-workspace-${activeWorkspaceId}`);
      if (mobileEl) {
        mobileEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeWorkspaceId]);

  // Workspaces sorted so pinned workspaces are always at the top, preserving master custom order
  const sortedWorkspaces = useMemo(() => {
    return [...workspaces].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [workspaces]);

  // --- Workspace Reordering State & Handlers ---
  const [isReorderingWorkspaces, setIsReorderingWorkspaces] = useState<boolean>(false);
  const [reorderSnapshot, setReorderSnapshot] = useState<WorkspaceWindow[] | null>(null);
  const [draggedWsIdx, setDraggedWsIdx] = useState<number | null>(null);
  const [dragOverWsIdx, setDragOverWsIdx] = useState<number | null>(null);
  const touchCurrentIdx = useRef<number | null>(null);

  const startReorderingWorkspaces = () => {
    setReorderSnapshot([...workspaces]);
    setIsReorderingWorkspaces(true);
  };

  const handleDoneReorder = () => {
    setIsReorderingWorkspaces(false);
    setReorderSnapshot(null);
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
    localStorage.setItem('studyflow_workspaces', JSON.stringify(workspaces));
    showToast('Workspaces reordered successfully');
  };

  const handleCancelReorder = () => {
    if (reorderSnapshot) {
      setWorkspaces(reorderSnapshot);
      localStorage.setItem('studyflow_workspaces', JSON.stringify(reorderSnapshot));
    }
    setIsReorderingWorkspaces(false);
    setReorderSnapshot(null);
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  const handleMoveWorkspace = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= workspaces.length || fromIndex === toIndex) return;
    setWorkspaces(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      localStorage.setItem('studyflow_workspaces', JSON.stringify(next));
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedWsIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverWsIdx !== index) {
      setDragOverWsIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedWsIdx !== null && draggedWsIdx !== targetIndex) {
      handleMoveWorkspace(draggedWsIdx, targetIndex);
    }
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchCurrentIdx.current = index;
    setDraggedWsIdx(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchCurrentIdx.current === null) return;
    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemEl = targetElement?.closest('[data-reorder-index]');
    if (itemEl) {
      const targetIdx = parseInt(itemEl.getAttribute('data-reorder-index') || '-1', 10);
      if (targetIdx !== -1 && targetIdx !== dragOverWsIdx) {
        setDragOverWsIdx(targetIdx);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchCurrentIdx.current !== null && dragOverWsIdx !== null && touchCurrentIdx.current !== dragOverWsIdx) {
      handleMoveWorkspace(touchCurrentIdx.current, dragOverWsIdx);
    }
    touchCurrentIdx.current = null;
    setDraggedWsIdx(null);
    setDragOverWsIdx(null);
  };

  // --- Sidebar Collapse ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // --- User Settings State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('studyflow_user_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          theme: parsed.theme || getInitialTheme(),
          primaryColor: parsed.primaryColor || getInitialAccentColor(),
        };
      } catch {
        // fallback
      }
    }
    return {
      dailyTarget: 10,
      dailyGoalMode: 'tasks',
      dailyTimeTargetMinutes: 120,
      autoSync: true,
      soundEffects: true,
      focusCheckIntervalMinutes: 20,
      focusCheckIntervalEnabled: true,
      theme: getInitialTheme(),
      primaryColor: getInitialAccentColor(),
    };
  });

  // Apply active theme (light/dark/system) and primary accent color dynamically
  useEffect(() => {
    const cleanup = applyTheme(userSettings.theme || 'light', userSettings.primaryColor || 'blue');
    return cleanup;
  }, [userSettings.theme, userSettings.primaryColor]);

  const ACCENT_COLOR_OPTIONS: Array<{ id: PrimaryAccentColor; label: string; color: string }> = [
    { id: 'blue', label: 'Blue', color: '#2563EB' },
    { id: 'purple', label: 'Purple', color: '#7C3AED' },
    { id: 'cyan', label: 'Cyan', color: '#0891B2' },
    { id: 'green', label: 'Green', color: '#059669' },
    { id: 'orange', label: 'Orange', color: '#EA580C' },
    { id: 'pink', label: 'Pink', color: '#DB2777' },
    { id: 'amber', label: 'Amber', color: '#F59E0B' },
  ];

  const [isAccentQuickPickerOpen, setIsAccentQuickPickerOpen] = useState<boolean>(false);

  const handleSelectAccentColor = (accent: PrimaryAccentColor) => {
    applyAccentColor(accent);
    const updated = {
      ...userSettings,
      primaryColor: accent,
    };
    setUserSettings(updated);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
    soundManager.playClick();
    showToast(`Accent theme set to ${accent.charAt(0).toUpperCase() + accent.slice(1)}! 🎨`);
    setIsAccentQuickPickerOpen(false);
  };

  // Close quick accent picker on outside click
  useEffect(() => {
    if (!isAccentQuickPickerOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest('[data-accent-picker-container]')) {
        setIsAccentQuickPickerOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('touchend', handleOutsideClick);
    }, 60);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('touchend', handleOutsideClick);
    };
  }, [isAccentQuickPickerOpen]);

  const handleSaveSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(newSettings));
    showToast('Preferences saved successfully');
  };

  // --- Today's Goal Popover & Streak State ---
  const [isGoalPopoverOpen, setIsGoalPopoverOpen] = useState<boolean>(false);
  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = useState<boolean>(false);
  const [isGoalCelebrationOpen, setIsGoalCelebrationOpen] = useState<boolean>(false);
  const [streakData, setStreakData] = useState<StreakData>(() => loadStreakData());
  const [latestMilestoneInfo, setLatestMilestoneInfo] = useState<{ isMilestone: boolean; title?: string; icon?: string }>({ isMilestone: false });
  const previousGoalAchievedRef = useRef<boolean>(false);

  // Periodic and on-focus rollover check for midnight streak tracking
  useEffect(() => {
    const checkRollover = () => {
      setStreakData(loadStreakData());
    };
    const interval = setInterval(checkRollover, 60000);
    window.addEventListener('focus', checkRollover);
    document.addEventListener('visibilitychange', checkRollover);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkRollover);
      document.removeEventListener('visibilitychange', checkRollover);
    };
  }, []);

  // --- Topic 100% Completion Celebration State ---
  const [congratulationsTopic, setCongratulationsTopic] = useState<CelebrationTopicData | null>(null);

  // --- Section Tabs State & Scroll Ref ---
  const [workspaceSections, setWorkspaceSections] = useState<SectionItem[]>(() => {
    return loadInitialData<SectionItem[]>('studyflow_workspace_sections', []);
  });

  const [activeSection, setActiveSection] = useState<string | null>(() => {
    const savedSecs = loadInitialData<SectionItem[]>('studyflow_workspace_sections', []);
    const currentWsId = loadInitialData('studyflow_active_workspace', '1');
    const wsSecs = (savedSecs || []).filter(s => s.workspaceId === currentWsId);
    return wsSecs.length > 0 ? wsSecs[0].name : null;
  });

  useEffect(() => {
    localStorage.setItem('studyflow_workspace_sections', JSON.stringify(workspaceSections));
  }, [workspaceSections]);

  const currentWorkspaceSections = useMemo(() => {
    return workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);
  }, [workspaceSections, activeWorkspaceId]);

  // --- Global Active Study Timer Session (Persists across navigation and drawer close) ---
  const [activeStudyTimer, setActiveStudyTimer] = useState<ActiveStudyTimerSession | null>(null);
  const [isGlobalStillStudyingOpen, setIsGlobalStillStudyingOpen] = useState<boolean>(false);
  const activeMilestonePromptRef = useRef<{
    milestoneSec: number;
    milestoneTriggeredAt: number;
    isAutoPaused: boolean;
  } | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerAccumulatedSecondsRef = useRef<number>(0);
  const lastGlobalMilestoneSecRef = useRef<number>(0);

  // Active drawer task state to dynamically show floating timer when navigating across tasks/tabs
  const [drawerActiveTaskState, setDrawerActiveTaskState] = useState<{
    selectedTaskId: string | null;
    activeTab: string;
    isViewingDetails: boolean;
    isTimeMenuOpen: boolean;
  }>({
    selectedTaskId: null,
    activeTab: 'tasks',
    isViewingDetails: true,
    isTimeMenuOpen: false,
  });
  const [requestedFocusTaskId, setRequestedFocusTaskId] = useState<string | null>(null);
  const [drawerNavigationTarget, setDrawerNavigationTarget] = useState<{
    headerTab?: 'tasks' | 'notes' | 'files' | 'activity';
    taskSubTab?: 'details' | 'notes' | 'links' | 'files' | 'checklist' | 'subtasks';
    taskId?: string | null;
    timestamp: number;
  } | null>(null);

  // Global interval ticking for live active study timer with 60s grace milestone check & auto-rewind
  useEffect(() => {
    if (!activeStudyTimer || activeStudyTimer.isPaused) return;

    if (!timerStartTimeRef.current) {
      timerStartTimeRef.current = Date.now();
    }

    const intervalSec = Math.max(10, Math.round((userSettings.focusCheckIntervalMinutes || 20) * 60));

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current!) / 1000);
      const totalSec = timerAccumulatedSecondsRef.current + elapsedSinceStart;

      const currentMilestoneIndex = Math.floor(totalSec / intervalSec);
      const currentMilestoneSec = currentMilestoneIndex * intervalSec;

      // 1. Check if a new milestone has just been reached (Timer continues running during 60s grace period)
      if (
        userSettings.focusCheckIntervalEnabled !== false &&
        currentMilestoneIndex > 0 &&
        currentMilestoneSec > lastGlobalMilestoneSecRef.current
      ) {
        lastGlobalMilestoneSecRef.current = currentMilestoneSec;
        activeMilestonePromptRef.current = {
          milestoneSec: currentMilestoneSec,
          milestoneTriggeredAt: now,
          isAutoPaused: false,
        };
        setIsGlobalStillStudyingOpen(true);
        triggerMilestoneNotificationAndVibrate(
          activeStudyTimer.taskTitle || 'Study Task',
          userSettings.focusCheckIntervalMinutes || 20
        );
        setActiveStudyTimer(prev => prev ? { ...prev, seconds: totalSec } : null);
      }
      // 2. Check if 60 seconds grace period expired without user response -> Auto-Pause & Rewind to milestone
      else if (
        activeMilestonePromptRef.current &&
        !activeMilestonePromptRef.current.isAutoPaused &&
        totalSec >= activeMilestonePromptRef.current.milestoneSec + 60
      ) {
        const rewindSec = activeMilestonePromptRef.current.milestoneSec;
        activeMilestonePromptRef.current.isAutoPaused = true;
        timerAccumulatedSecondsRef.current = rewindSec;
        timerStartTimeRef.current = null;
        setActiveStudyTimer(prev => prev ? { ...prev, seconds: rewindSec, isPaused: true } : null);
      } else {
        setActiveStudyTimer(prev => prev ? { ...prev, seconds: totalSec } : null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeStudyTimer?.isPaused, activeStudyTimer?.taskId, activeStudyTimer?.taskTitle, userSettings.focusCheckIntervalMinutes, userSettings.focusCheckIntervalEnabled]);

  // Periodic audio chime warning every 6s up to 10 times (60s total grace window) while prompt is active
  useEffect(() => {
    if (!isGlobalStillStudyingOpen) return;

    let chimeCount = 0;
    chimeCount++;

    const interval = setInterval(() => {
      // If user has already auto-paused after 60s, stop chime
      if (activeMilestonePromptRef.current?.isAutoPaused || chimeCount >= 10) {
        clearInterval(interval);
        return;
      }
      triggerMilestoneNotificationAndVibrate(activeStudyTimer?.taskTitle || 'Study Task', userSettings.focusCheckIntervalMinutes || 20);
      chimeCount++;
    }, 6000);

    return () => clearInterval(interval);
  }, [isGlobalStillStudyingOpen, userSettings.focusCheckIntervalMinutes, activeStudyTimer?.taskTitle]);

  // Sync browser document title when timer is running
  useEffect(() => {
    if (activeStudyTimer) {
      const { seconds, taskTitle, isPaused } = activeStudyTimer;
      const formatted = formatTimerClock(seconds);
      const icon = isPaused ? '⏸️' : '⏱️';
      const cleanTitle = taskTitle && taskTitle.length > 18 ? taskTitle.slice(0, 18) + '...' : (taskTitle || 'Task');
      document.title = `(${icon} ${formatted} • ${cleanTitle}) Study Flow`;
    } else {
      document.title = 'Study Flow';
    }
  }, [activeStudyTimer?.seconds, activeStudyTimer?.isPaused, activeStudyTimer?.taskTitle]);

  const handleStartGlobalStudyTimer = (
    topicId: string,
    topicTitle: string,
    taskId: string,
    taskTitle: string,
    workspaceId?: string
  ) => {
    timerStartTimeRef.current = Date.now();
    timerAccumulatedSecondsRef.current = 0;
    lastGlobalMilestoneSecRef.current = 0;
    activeMilestonePromptRef.current = null;
    setIsGlobalStillStudyingOpen(false);
    setActiveStudyTimer({
      topicId,
      topicTitle,
      taskId,
      taskTitle,
      workspaceId: workspaceId || activeWorkspaceId,
      seconds: 0,
      isPaused: false,
    });
  };

  const handlePauseGlobalStudyTimer = () => {
    if (!activeStudyTimer || activeStudyTimer.isPaused) return;
    const now = Date.now();
    const elapsedSinceStart = timerStartTimeRef.current ? Math.floor((now - timerStartTimeRef.current) / 1000) : 0;
    const totalSec = timerAccumulatedSecondsRef.current + elapsedSinceStart;
    timerAccumulatedSecondsRef.current = totalSec;
    timerStartTimeRef.current = null;
    setActiveStudyTimer(prev => prev ? { ...prev, seconds: totalSec, isPaused: true } : null);
    showToast('Timer paused ⏸️');
  };

  const handleResumeGlobalStudyTimer = () => {
    if (!activeStudyTimer) return;
    
    // If it was auto-paused after 60s grace period, resume fresh from the rewinded milestone seconds
    if (activeStudyTimer.isPaused) {
      timerStartTimeRef.current = Date.now();
      setActiveStudyTimer(prev => prev ? { ...prev, isPaused: false } : null);
    }
    // If user clicked while still running inside 60s grace, it continues seamlessly without restart

    activeMilestonePromptRef.current = null;
    setIsGlobalStillStudyingOpen(false);
    showToast('Awesome! Timer resumed 🚀 Keep it up!');
  };

  const handleStopAndLogGlobalStudyTimer = (targetTaskId?: string) => {
    if (!activeStudyTimer) return;
    const taskIdToLog = targetTaskId || activeStudyTimer.taskId;

    let sessionSeconds = activeStudyTimer.seconds;
    // If milestone prompt was active, log the exact milestone time (excluding grace period extra seconds)
    if (activeMilestonePromptRef.current) {
      sessionSeconds = activeMilestonePromptRef.current.milestoneSec;
    } else if (!activeStudyTimer.isPaused && timerStartTimeRef.current) {
      const now = Date.now();
      const elapsedSinceStart = Math.floor((now - timerStartTimeRef.current) / 1000);
      sessionSeconds = timerAccumulatedSecondsRef.current + elapsedSinceStart;
    }

    const topicId = activeStudyTimer.topicId;
    const targetTopic = topics.find(t => t.id === topicId);
    if (targetTopic) {
      const targetTask = (targetTopic.tasks || []).find(tk => tk.id === taskIdToLog);
      if (targetTask) {
        const previousTotalSeconds = targetTask.timeSpentSeconds ?? ((targetTask.timeSpentMinutes || 0) * 60);
        const newTotalSeconds = previousTotalSeconds + sessionSeconds;
        const newMinutes = Math.floor(newTotalSeconds / 60);

        const newSession = {
          id: `sess-${Date.now()}`,
          timestamp: Date.now(),
          durationSeconds: sessionSeconds,
        };

        handleUpdateTask(topicId, {
          ...targetTask,
          timeSpentSeconds: newTotalSeconds,
          timeSpentMinutes: newMinutes,
          studySessions: [...(targetTask.studySessions || []), newSession],
          lastStudyDate: new Date().toISOString(),
        });

        const sessionMins = Math.floor(sessionSeconds / 60);
        const sessionSecs = sessionSeconds % 60;
        const sessionFormatted = sessionMins > 0 
          ? (sessionSecs > 0 ? `+${sessionMins}m ${sessionSecs}s` : `+${sessionMins}m`)
          : `+${sessionSecs}s`;

        showToast(`Study session saved for "${targetTask.title}"! ${sessionFormatted}`);
      }
    }

    timerStartTimeRef.current = null;
    timerAccumulatedSecondsRef.current = 0;
    lastGlobalMilestoneSecRef.current = 0;
    activeMilestonePromptRef.current = null;
    setIsGlobalStillStudyingOpen(false);
    setActiveStudyTimer(null);
  };

  // Mobile drawer body scroll lock
  useEffect(() => {
    if (!sidebarCollapsed && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarCollapsed]);

  // Global Intelligent Floating Tooltip State (Smooth Intentional Hover with 150ms delay)
  const [tooltipData, setTooltipData] = useState<{
    content: string;
    x: number;
    y: number;
    side: 'top' | 'bottom' | 'left' | 'right';
  } | null>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-tooltip]') as HTMLElement | null;
      if (!target) {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setTooltipData(null);
        return;
      }
      const content = target.getAttribute('data-tooltip');
      if (!content) {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setTooltipData(null);
        return;
      }
      const side = (target.getAttribute('data-tooltip-side') || 'top') as 'top' | 'bottom' | 'left' | 'right';

      const rect = target.getBoundingClientRect();
      let x = rect.left + rect.width / 2;
      let y = rect.top - 6;

      if (side === 'right') {
        const sidebarEl = document.querySelector('aside');
        if (sidebarEl && target.closest('aside')) {
          x = Math.round(sidebarEl.getBoundingClientRect().right) + 8;
        } else {
          x = Math.round(rect.right) + 8;
        }

        const iconEl = target.querySelector('svg') || target.querySelector('.shrink-0');
        if (iconEl) {
          const iconRect = iconEl.getBoundingClientRect();
          y = iconRect.top + iconRect.height / 2;
        } else {
          y = rect.top + rect.height / 2;
        }
      } else if (side === 'bottom') {
        x = rect.left + rect.width / 2;
        y = rect.bottom + 6;
      }

      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = setTimeout(() => {
        setTooltipData({ content, x, y, side });
      }, 150);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest('[data-tooltip]')) {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setTooltipData(null);
      }
    };

    const handleGlobalClick = () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      setTooltipData(null);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('mousedown', handleGlobalClick);

    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);

  // Auto-collapse sidebar ONLY when screen width actually changes across mobile breakpoint (not on virtual keyboard height changes)
  useEffect(() => {
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Only trigger if horizontal screen width actually changed
      if (Math.abs(currentWidth - lastWidth) > 10) {
        if (currentWidth < 768 && lastWidth >= 768) {
          setSidebarCollapsed(true);
        }
        lastWidth = currentWidth;
      }
    };

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const secs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);
    if (secs.length > 0) {
      if (!activeSection || !secs.some(s => s.name === activeSection)) {
        setActiveSection(secs[0].name);
      }
    } else {
      setActiveSection(null);
    }
  }, [activeWorkspaceId, workspaceSections]);

  const sectionNavRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const checkSectionScroll = () => {
    if (sectionNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sectionNavRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    checkSectionScroll();
    const navEl = sectionNavRef.current;
    if (navEl) {
      navEl.addEventListener('scroll', checkSectionScroll);
      window.addEventListener('resize', checkSectionScroll);
    }
    return () => {
      if (navEl) navEl.removeEventListener('scroll', checkSectionScroll);
      window.removeEventListener('resize', checkSectionScroll);
    };
  }, [currentWorkspaceSections]);

  const scrollSections = (direction: 'left' | 'right') => {
    if (sectionNavRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      sectionNavRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };



  // --- Professional Notification & Toast System ---
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'focus' | 'reminders'>('all');
  const [deviceNotifStatus, setDeviceNotifStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const handleToggleDeviceNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('⚠️ Notifications not supported on this browser.');
      return;
    }

    if (window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      showToast('⚠️ Mobile browsers require HTTPS. Please open with https://192.168.0.202:3000');
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        playNotificationAudioChime();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
        
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification('🔔 StudyFlow Notifications Active', {
              body: 'You will receive study focus milestones & task alerts on this device!',
              icon: '/favicon.ico',
              tag: 'studyflow-test'
            });
            showToast('Test notification sent to your device! 🔔');
            return;
          } catch {}
        }
        new Notification('🔔 StudyFlow Notifications Active', {
          body: 'You will receive study focus milestones & task alerts on this device!',
          icon: '/favicon.ico',
          tag: 'studyflow-test'
        });
        showToast('Test notification sent to your device! 🔔');
      } catch {
        playNotificationAudioChime();
        showToast('Test notification dispatched! 🔔');
      }
    } else if (Notification.permission === 'denied') {
      showToast('⚠️ Notifications blocked in site settings. Tap lock 🔒 in URL bar to allow.');
    } else {
      try {
        let permResult: NotificationPermission = 'default';
        try {
          const req = Notification.requestPermission();
          if (req && typeof req.then === 'function') {
            permResult = await req;
          } else {
            permResult = await new Promise((resolve) => {
              Notification.requestPermission((p) => resolve(p));
            });
          }
        } catch {
          permResult = await new Promise((resolve) => {
            Notification.requestPermission((p) => resolve(p));
          });
        }

        setDeviceNotifStatus(permResult);

        if (permResult === 'granted') {
          try {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
              try {
                const reg = await navigator.serviceWorker.ready;
                await reg.showNotification('🚀 Notifications Enabled!', {
                  body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                  icon: '/favicon.ico',
                  tag: 'studyflow-welcome'
                });
              } catch {
                new Notification('🚀 Notifications Enabled!', {
                  body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                  icon: '/favicon.ico',
                  tag: 'studyflow-welcome'
                });
              }
            } else {
              new Notification('🚀 Notifications Enabled!', {
                body: 'Welcome to StudyFlow Push Alerts. Stay focused!',
                icon: '/favicon.ico',
                tag: 'studyflow-welcome'
              });
            }
          } catch {}
          showToast('Device Push Notifications enabled! 🚀');
        } else if (permResult === 'denied') {
          showToast('⚠️ Notification permission denied. Tap lock 🔒 in URL bar to enable.');
        } else {
          showToast('Notification permission dismissed.');
        }
      } catch (err) {
        console.error('Request permission error:', err);
        showToast('Could not request notification permission.');
      }
    }
  };

  const unreadNotifCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Safe initial topics loader from localStorage
  const loadInitialTopics = (): Topic[] => {
    try {
      const saved = localStorage.getItem('studyflow_topics');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  };

  const [topics, setTopics] = useState<Topic[]>(loadInitialTopics);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState<boolean>(false);
  const [syncedTopics, setSyncedTopics] = useState<Topic[]>(loadInitialTopics);

  const isViewingActiveTimerTask = Boolean(
    isDetailsDrawerOpen &&
    activeStudyTimer &&
    selectedTopicId === activeStudyTimer.topicId &&
    drawerActiveTaskState.activeTab === 'tasks' &&
    drawerActiveTaskState.selectedTaskId === activeStudyTimer.taskId &&
    drawerActiveTaskState.isViewingDetails &&
    (drawerActiveTaskState.isTimeMenuOpen || false)
  );
  const isFloatingTimerVisible = Boolean(activeStudyTimer && !isViewingActiveTimerTask && !isGlobalStillStudyingOpen);

  useEffect(() => {
    if (!isDetailsDrawerOpen) {
      setSyncedTopics(topics);
    }
  }, [topics, isDetailsDrawerOpen]);
  const [deletedTopics, setDeletedTopics] = useState<Topic[]>(() =>
    loadInitialData('studyflow_deleted_topics', [])
  );
  const [deletedWorkspaces, setDeletedWorkspaces] = useState<{ workspace: WorkspaceWindow; topics: Topic[]; sections?: SectionItem[]; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_workspaces', [])
  );
  const [deletedNotes, setDeletedNotes] = useState<{ note: StudyNote; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_notes', [])
  );
  const [deletedSections, setDeletedSections] = useState<{ section: SectionItem; topics?: Topic[]; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_sections', [])
  );
  const [deletedTasks, setDeletedTasks] = useState<{ task: TaskItem; topicId: string; topicTitle: string; workspaceId: string; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_tasks', [])
  );
  const [deletedTopicNotes, setDeletedTopicNotes] = useState<{ note: NoteItem; topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string; isTopicNote?: boolean; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_topic_notes', [])
  );
  const [deletedTopicLinks, setDeletedTopicLinks] = useState<{ link: ResourceLink; topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string; deletedAt?: string }[]>(() =>
    loadInitialData('studyflow_deleted_topic_links', [])
  );
  const [suppressSidebarTooltip, setSuppressSidebarTooltip] = useState(false);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_workspaces', JSON.stringify(deletedWorkspaces));
  }, [deletedWorkspaces]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_notes', JSON.stringify(deletedNotes));
  }, [deletedNotes]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_sections', JSON.stringify(deletedSections));
  }, [deletedSections]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_tasks', JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_topic_notes', JSON.stringify(deletedTopicNotes));
  }, [deletedTopicNotes]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_topic_links', JSON.stringify(deletedTopicLinks));
  }, [deletedTopicLinks]);

  // --- View Mode & Filter Controls ---
  const [viewMode, setViewMode] = useState<'grid-cards' | 'grid-banner' | 'list'>('grid-cards');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'not_started' | 'overdue'>('all');
  const [sortCategory, setSortCategory] = useState<'date' | 'name' | 'progress'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterDirection, setFilterDirection] = useState<number>(0);

  const handleSortSelect = (category: 'date' | 'name' | 'progress') => {
    if (sortCategory === category) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCategory(category);
      setSortDirection(category === 'date' ? 'desc' : 'asc');
    }
  };

// --- View Layer Height Sync ---
  const cardsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const generatorInputRef = useRef<HTMLInputElement>(null);
  const [layerHeight, setLayerHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    if (viewMode === 'list') {
      setLayerHeight('auto');
      return;
    }
    
    const updateHeight = () => {
      if (viewMode === 'grid-cards' && cardsRef.current) {
        setLayerHeight(cardsRef.current.offsetHeight || 'auto');
      } else if (viewMode === 'grid-banner' && bannerRef.current) {
        setLayerHeight(bannerRef.current.offsetHeight || 'auto');
      } else {
        setLayerHeight('auto');
      }
    };

    updateHeight();
    
    const observer = new ResizeObserver(updateHeight);
    if (cardsRef.current) observer.observe(cardsRef.current);
    if (bannerRef.current) observer.observe(bannerRef.current);
    
    return () => observer.disconnect();
  }, [viewMode, topics, statusFilter, activeSection, sortCategory, sortDirection]);

  const handleSectionChange = (newSection: string) => {
    if (newSection === activeSection) return;
    const currentSecNames = currentWorkspaceSections.map(s => s.name);
    const currentIdx = currentSecNames.indexOf(activeSection || '');
    const newIdx = currentSecNames.indexOf(newSection);
    setFilterDirection(newIdx > currentIdx ? 1 : -1);
    setActiveSection(newSection);
  };

  const handleStatusFilterChange = (newFilter: 'all' | 'completed' | 'in_progress' | 'not_started' | 'overdue') => {
    if (newFilter === statusFilter) return;
    const filterOrder: Record<string, number> = {
      all: 0,
      completed: 1,
      in_progress: 2,
      not_started: 3,
      overdue: 4,
    };
    const currentIdx = filterOrder[statusFilter] ?? 0;
    const newIdx = filterOrder[newFilter] ?? 0;
    setFilterDirection(newIdx > currentIdx ? 1 : -1);
    setStatusFilter(newFilter);
  };

  const handleViewModeChange = (targetMode: 'grid-cards' | 'grid-banner' | 'list') => {
    let nextMode = targetMode;
    if (targetMode === 'grid-cards' && viewMode === 'grid-cards') {
      nextMode = 'grid-banner';
    } else if (targetMode === 'grid-cards' && viewMode === 'grid-banner') {
      nextMode = 'grid-cards';
    }

    if (viewMode.startsWith('grid') && nextMode === 'list') {
      // Grid (left tab) -> List (right tab): Tab moves RIGHT (→), Topic cards slide OPPOSITE (LEFT, dir = 1)
      setFilterDirection(1);
    } else if (viewMode === 'list' && nextMode.startsWith('grid')) {
      // List (right tab) -> Grid (left tab): Tab moves LEFT (←), Topic cards slide OPPOSITE (RIGHT, dir = -1)
      setFilterDirection(-1);
    } else if (viewMode === 'grid-cards' && nextMode === 'grid-banner') {
      setFilterDirection(1);
    } else if (viewMode === 'grid-banner' && nextMode === 'grid-cards') {
      setFilterDirection(-1);
    }

    setViewMode(nextMode);
  };

  useEffect(() => {
    localStorage.setItem('studyflow_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('studyflow_deleted_topics', JSON.stringify(deletedTopics));
  }, [deletedTopics]);

  // --- Generator State ---
  const [generatorInput, setGeneratorInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [highlightedTopicId, setHighlightedTopicId] = useState<string | null>(null);

  // --- Persistent View State (Workspace, Notes, Tasks, Trash, Search, Analytics) & URL Routing ---
  const initialActiveView = (() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
        if (path === '/tasks') return 'tasks';
        if (path === '/notes') return 'notes';
        if (path === '/trash' || path === '/recycle-bin') return 'trash';
        if (path === '/search') return 'search';
        if (path === '/analytics') return 'analytics';
        if (path === '' || path === '/workspace' || path === '/dashboard') return 'workspace';
      }
      const saved = localStorage.getItem('studyflow_active_view');
      if (!saved) return 'workspace';
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'string' && ['workspace', 'notes', 'tasks', 'trash', 'search', 'analytics'].includes(parsed)) {
          return parsed as 'workspace' | 'notes' | 'tasks' | 'trash' | 'search' | 'analytics';
        }
      } catch {}
      if (['workspace', 'notes', 'tasks', 'trash', 'search', 'analytics'].includes(saved)) {
        return saved as 'workspace' | 'notes' | 'tasks' | 'trash' | 'search' | 'analytics';
      }
      return 'workspace';
    } catch {
      return 'workspace';
    }
  })();

  // --- Dedicated Full-Page Global Search State ---
  const [isSearchPageOpen, setIsSearchPageOpen] = useState<boolean>(() => initialActiveView === 'search');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  // --- Dedicated Full-Page Tasks Studio State ---
  const [isTasksPageOpen, setIsTasksPageOpen] = useState<boolean>(() => initialActiveView === 'tasks');
  const [standaloneTasks, setStandaloneTasks] = useState<StandaloneTask[]>(() =>
    loadInitialData('studyflow_standalone_tasks', [
      {
        id: 'standalone-task-welcome',
        title: 'Welcome to Daily Tasks! Check off this task to get started 🎉',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ])
  );

  useEffect(() => {
    localStorage.setItem('studyflow_standalone_tasks', JSON.stringify(standaloneTasks));
  }, [standaloneTasks]);

  // --- Dedicated Full-Page Notes Studio State ---
  const [isNotesPageOpen, setIsNotesPageOpen] = useState<boolean>(() => initialActiveView === 'notes');
  const [notes, setNotes] = useState<StudyNote[]>(() =>
    loadInitialData('studyflow_notes', [
      {
        id: 'note-welcome-guide',
        title: 'Welcome to Notes Studio — User Guide & Shortcuts',
        content: `<h1>Notes Studio — Pro User Guide & Shortcuts</h1><p class="text-slate-600 leading-relaxed">Welcome to your distraction-free, professional study notepad! Here is everything you can do to supercharge your note-taking experience.</p><hr class="my-4 border-slate-200" /><h2>⌨️ 1. Essential Keyboard Shortcuts</h2><ul class="list-disc list-inside my-1.5 space-y-1"><li><b>Numbered List:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + N</code> — Start or toggle a numbered list (<ol class="list-decimal list-inside ml-5 my-1"><li>Item 1</li><li>Item 2</li></ol>)</li><li><b>Bullet List:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + B</code> — Start or toggle a bullet list</li><li><b>Heading 1:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + 1</code></li><li><b>Heading 2:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + 2</code></li><li><b>Heading 3:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Alt + 3</code></li><li><b>Inline Code / Formula:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + E</code> or <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + \`</code></li><li><b>Bold:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + B</code> | <b>Italic:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + I</code></li><li><b>Quote Block:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + Q</code></li><li><b>Insert / Edit Link:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + K</code></li><li><b>Strikethrough:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + Shift + X</code></li><li><b>Highlighter:</b> <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Ctrl + Shift + H</code></li></ul><hr class="my-4 border-slate-200" /><h2>🪄 2. Live Markdown Auto-Formatting</h2><p class="leading-relaxed my-1">Turn on the <b>🪄 Markdown</b> icon in your toolbar to format as you type:</p><ul class="list-disc list-inside my-1.5 space-y-1"><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">**bold**</code> ➔ <b>bold</b></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">\`Y = 200px\`</code> ➔ <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">Y = 200px</code></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">==highlight==</code> ➔ <mark class="bg-amber-100 text-amber-950 px-1 py-0.5 rounded">highlight</mark></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">~~strike~~</code> ➔ <del class="text-slate-400">strike</del></li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70"># + Space</code> ➔ Heading 1 | <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">## + Space</code> ➔ Heading 2</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">- + Space</code> ➔ Bullet List | <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">1. + Space</code> ➔ Numbered List</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">&gt; + Space</code> ➔ Quote block</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">[] + Space</code> ➔ Interactive Task Checkbox</li><li>Type <code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">--- + Space</code> ➔ Horizontal Divider</li></ul><hr class="my-4 border-slate-200" /><h2>📋 3. Interactive Checklists</h2><div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="true"><span class="chk-box mt-1 w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 bg-[#2563EB] border-[#2563EB] text-white font-bold">✓</span><span class="chk-text flex-1 select-text line-through text-slate-400">Review Notes Studio features</span></div><div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="false"><span class="chk-box mt-1 w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-xs shrink-0"></span><span class="chk-text flex-1 select-text text-slate-800">Try creating your first custom study note</span></div><div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="false"><span class="chk-box mt-1 w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-xs shrink-0"></span><span class="chk-text flex-1 select-text text-slate-800">Use Quick Copy to export notes to Notion or ChatGPT</span></div><hr class="my-4 border-slate-200" /><h2>💬 4. Pro Tips & Quoting</h2><blockquote class="border-l-4 border-[#2563EB]/60 pl-3 py-1 bg-blue-50/40 text-slate-700 rounded-r-md my-2 italic">"Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family." — Kofi Annan</blockquote><p class="text-xs text-slate-500 mt-2">💡 <i>Tip: Click anywhere in Preview mode to instantly jump into editing at that exact character!</i></p>`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPinned: true,
        color: 'blue'
      }
    ])
  );

  useEffect(() => {
    localStorage.setItem('studyflow_notes', JSON.stringify(notes));
  }, [notes]);

  // --- Selected Topic for Right Progress Card & Details Drawer ---
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState<boolean>(() => initialActiveView === 'trash');
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState<boolean>(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState<string>('');
  const [isNewTopicOpen, setIsNewTopicOpen] = useState<boolean>(false);
  const [isSmartStudioOpen, setIsSmartStudioOpen] = useState<boolean>(false);
  const [smartStudioInitialMode, setSmartStudioInitialMode] = useState<'visual' | 'markdown'>('visual');
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');
  const [isNewSectionOpen, setIsNewSectionOpen] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>('');
  const [isAnalyticsPageOpen, setIsAnalyticsPageOpen] = useState<boolean>(() => initialActiveView === 'analytics');

  // Track and persist active view route to URL and localStorage
  useEffect(() => {
    let currentView: 'workspace' | 'notes' | 'tasks' | 'trash' | 'search' | 'analytics' = 'workspace';
    if (isTasksPageOpen) currentView = 'tasks';
    else if (isNotesPageOpen) currentView = 'notes';
    else if (isRecycleBinOpen) currentView = 'trash';
    else if (isSearchPageOpen) currentView = 'search';
    else if (isAnalyticsPageOpen) currentView = 'analytics';

    try {
      localStorage.setItem('studyflow_active_view', currentView);
      const targetPath = currentView === 'workspace' ? '/' : `/${currentView}`;
      const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const expectedNormalized = targetPath === '/' ? '' : targetPath;
      if (currentPath !== expectedNormalized) {
        window.history.pushState({ view: currentView }, '', targetPath);
      }
    } catch {}
  }, [isTasksPageOpen, isNotesPageOpen, isRecycleBinOpen, isSearchPageOpen, isAnalyticsPageOpen]);

  // Handle Browser Back and Forward Button navigation (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      setIsTasksPageOpen(path === '/tasks');
      setIsNotesPageOpen(path === '/notes');
      setIsRecycleBinOpen(path === '/trash' || path === '/recycle-bin');
      setIsSearchPageOpen(path === '/search');
      setIsAnalyticsPageOpen(path === '/analytics');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState<boolean>(false);
  const [isWorkspaceSwitcherOpen, setIsWorkspaceSwitcherOpen] = useState<boolean>(false);
  const [isMobileWorkspaceDropdownOpen, setIsMobileWorkspaceDropdownOpen] = useState<boolean>(false);
  const [isMoreSectionsOpen, setIsMoreSectionsOpen] = useState<boolean>(false);
  const [isStatusFilterDropdownOpen, setIsStatusFilterDropdownOpen] = useState<boolean>(false);
  const [mobileKeyboardBottomInset, setMobileKeyboardBottomInset] = useState<number>(0);

  // --- Firebase Authentication States ---
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [profileMenuTarget, setProfileMenuTarget] = useState<'header' | 'sidebar' | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // --- Sidebar Workspaces Section Collapse State ---
  const [isWorkspacesCollapsed, setIsWorkspacesCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('study_flow_workspaces_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleWorkspacesCollapse = useCallback(() => {
    setIsWorkspacesCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('study_flow_workspaces_collapsed', String(next));
      } catch {}
      return next;
    });
  }, []);

  // Smooth mobile virtual keyboard tracking for popup modals
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;

    let timeoutId: number;
    const handleVisualViewportChange = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      if (keyboardHeight > 0) {
        if (timeoutId) clearTimeout(timeoutId);
        setMobileKeyboardBottomInset(keyboardHeight);
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          setMobileKeyboardBottomInset(0);
        }, 150);
      }
    };

    vv.addEventListener('resize', handleVisualViewportChange);
    vv.addEventListener('scroll', handleVisualViewportChange);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      vv.removeEventListener('resize', handleVisualViewportChange);
      vv.removeEventListener('scroll', handleVisualViewportChange);
    };
  }, []);

  // --- Inline Edit / Add States ---
  const [addingTaskTopicId, setAddingTaskTopicId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState<string>('');

  const editingTopic = useMemo(() => {
    return topics.find(t => t.id === editingTopicId) || null;
  }, [topics, editingTopicId]);

  // --- Topic Card Menu, Pin Animation & Delete Confirmation States ---
  const [activeMenuTopicId, setActiveMenuTopicId] = useState<string | null>(null);
  const [animatingPinTopicId, setAnimatingPinTopicId] = useState<string | null>(null);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [animatingDeleteTopicId, setAnimatingDeleteTopicId] = useState<string | null>(null);
  const [customizingTopic, setCustomizingTopic] = useState<Topic | null>(null);
  const [customColorSelection, setCustomColorSelection] = useState<string>('');
  const [customIconSelection, setCustomIconSelection] = useState<string>('');

  // --- Merge Topic State ---
  const [mergeSourceTopic, setMergeSourceTopic] = useState<Topic | null>(null);
  const [targetTopicIdForMerge, setTargetTopicIdForMerge] = useState<string>('');

  // --- Move Topic to Section State ---
  const [moveSectionSourceTopic, setMoveSectionSourceTopic] = useState<Topic | null>(null);
  const [targetSectionForMove, setTargetSectionForMove] = useState<string>('');

  const handleConfirmMergeTopic = () => {
    if (!mergeSourceTopic || !targetTopicIdForMerge) return;
    const sourceTopic = mergeSourceTopic;
    const targetTopic = topics.find(t => t.id === targetTopicIdForMerge);
    if (!targetTopic) return;

    // Merge tasks, notes, links from source topic into target topic
    setTopics(prev =>
      prev.map(t => {
        if (t.id === targetTopicIdForMerge) {
          const mergedTasks = [...t.tasks, ...sourceTopic.tasks];
          const mergedNotes = [...(t.notes || []), ...(sourceTopic.notes || [])];
          const mergedLinks = [...(t.links || []), ...(sourceTopic.links || [])];
          return {
            ...t,
            tasks: mergedTasks,
            notes: mergedNotes.length > 0 ? mergedNotes : undefined,
            links: mergedLinks.length > 0 ? mergedLinks : undefined
          };
        }
        return t;
      }).filter(t => t.id !== sourceTopic.id)
    );

    showToast(`Merged "${sourceTopic.title}" into "${targetTopic.title}"!`);

    // If the topic opened in TopicDetailsDrawer is being merged, switch drawer focus to destination targetTopic
    if (selectedTopicId === sourceTopic.id) {
      setSelectedTopicId(targetTopic.id);
    }

    setMergeSourceTopic(null);
    setTargetTopicIdForMerge('');
  };

  const handleConfirmMoveTopicToSection = () => {
    if (!moveSectionSourceTopic || !targetSectionForMove) return;
    const destSection = targetSectionForMove;
    setTopics(prev =>
      prev.map(t =>
        t.id === moveSectionSourceTopic.id
          ? { ...t, section: destSection }
          : t
      )
    );
    setActiveSection(destSection);
    showToast(`Moved "${moveSectionSourceTopic.title}" to section "${destSection}"!`);
    setMoveSectionSourceTopic(null);
    setTargetSectionForMove('');
  };

  // --- Subtask 3-Dot Menu, Inline Rename & Recycle Bin Confirmation States ---
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<{ topicId: string; taskId: string } | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>('');
  const [taskToDelete, setTaskToDelete] = useState<{ topicId: string; task: TaskItem } | null>(null);

  const handleStartRenameTask = (topicId: string, task: TaskItem) => {
    setEditingTaskId({ topicId, taskId: task.id });
    setEditingTaskTitle(task.title);
    setActiveMenuTaskId(null);
  };

  const handleSaveRenameTask = (topicId: string, taskId: string, newTitle?: string) => {
    const titleToSave = (newTitle !== undefined ? newTitle : editingTaskTitle).replace(/\s+/g, ' ').trim();
    if (!titleToSave) {
      setEditingTaskId(null);
      return;
    }
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? {
              ...t,
              tasks: t.tasks.map(tk =>
                tk.id === taskId ? { ...tk, title: titleToSave } : tk
              ),
            }
          : t
      )
    );
    setEditingTaskId(null);
    showToast('Task renamed successfully');
  };

  const handleUpdateTask = (topicId: string, updatedTask: TaskItem) => {
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? {
              ...t,
              tasks: t.tasks.map(tk =>
                tk.id === updatedTask.id ? updatedTask : tk
              ),
            }
          : t
      )
    );
  };

  const handleBulkToggleTaskCompleted = (topicId: string, taskIds: string[], completed: boolean) => {
    const nowStr = new Date().toISOString();
    const nowTime = Date.now();
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? {
              ...t,
              tasks: t.tasks.map(tk =>
                taskIds.includes(tk.id)
                  ? {
                      ...tk,
                      completed,
                      completedAt: completed ? nowStr : undefined,
                      completedAtTime: completed ? nowTime : undefined,
                    }
                  : tk
              ),
            }
          : t
      )
    );
  };

  const handleBulkDeleteTasks = (topicId: string, taskIds: string[]) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const tasksToDeleteList = topic.tasks.filter(tk => taskIds.includes(tk.id));
    if (tasksToDeleteList.length === 0) return;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newDeletedTaskItems = tasksToDeleteList.map(task => ({
      task,
      topicId: topic.id,
      topicTitle: topic.title,
      workspaceId: topic.workspaceId,
      deletedAt: formattedDate,
    }));

    setDeletedTasks(prev => [...newDeletedTaskItems, ...prev]);

    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? { ...t, tasks: t.tasks.filter(tk => !taskIds.includes(tk.id)) }
          : t
      )
    );

    showToast(
      `Moved ${tasksToDeleteList.length} task(s) to Recycle Bin`,
      () => {
        setTopics(prev =>
          prev.map(t =>
            t.id === topicId
              ? { ...t, tasks: [...t.tasks, ...tasksToDeleteList] }
              : t
          )
        );
        setDeletedTasks(prev => prev.filter(item => !taskIds.includes(item.task.id)));
        showToast(`Restored ${tasksToDeleteList.length} task(s)`);
      },
      6000
    );
  };

  const handleConfirmMoveTaskToRecycleBin = () => {
    if (!taskToDelete) return;
    const { topicId, task } = taskToDelete;
    setTopics(prev =>
      prev.map(t =>
        t.id === topicId
          ? { ...t, tasks: t.tasks.filter(tk => tk.id !== task.id) }
          : t
      )
    );
    setTaskToDelete(null);
    showToast(`Moved "${task.title}" to Recycle Bin`, () => {
      setTopics(prev =>
        prev.map(t =>
          t.id === topicId
            ? { ...t, tasks: [...t.tasks, task] }
            : t
        )
      );
    });
  };

  // --- Workspace Menu & Edit States ---
  const [activeMenuWorkspaceId, setActiveMenuWorkspaceId] = useState<string | null>(null);
  const [workspaceMenuPos, setWorkspaceMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState<string>('');
  const [workspaceToDelete, setWorkspaceToDelete] = useState<WorkspaceWindow | null>(null);

  const toggleWorkspaceMenu = (wsId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeMenuWorkspaceId === wsId) {
      setActiveMenuWorkspaceId(null);
      setWorkspaceMenuPos(null);
    } else {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const isNearBottom = rect.bottom + 190 > window.innerHeight;
      const top = isNearBottom ? Math.max(10, rect.top - 180) : rect.bottom + 4;
      const left = Math.min(Math.max(10, rect.right - 180), window.innerWidth - 190);
      setWorkspaceMenuPos({ top, left });
      setActiveMenuWorkspaceId(wsId);
    }
  };

  // --- Section Menu & Edit States ---
  const [activeMenuSection, setActiveMenuSection] = useState<string | null>(null);
  const [sectionMenuPos, setSectionMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState<string>('');
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  // Master Body Scroll Lock whenever ANY modal, drawer, or mobile sidebar is active
  useEffect(() => {
    const isModalOrDrawerActive = Boolean(
      (!sidebarCollapsed && window.innerWidth < 768) ||
      isNewWorkspaceOpen ||
      isNewSectionOpen ||
      isNewTopicOpen ||
      editingWorkspaceId ||
      editingSection ||
      editingTopicId ||
      isShortcutsOpen ||
      workspaceToDelete ||
      sectionToDelete ||
      topicToDelete ||
      isDetailsDrawerOpen
    );

    const checkAndLockScroll = () => {
      if (isModalOrDrawerActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    
    checkAndLockScroll();
    window.addEventListener('resize', checkAndLockScroll);
    
    return () => {
      window.removeEventListener('resize', checkAndLockScroll);
      document.body.style.overflow = '';
    };
  }, [
    sidebarCollapsed,
    isNewWorkspaceOpen,
    isNewSectionOpen,
    isNewTopicOpen,
    editingWorkspaceId,
    editingSection,
    editingTopicId,
    isShortcutsOpen,
    workspaceToDelete,
    topicToDelete,
    isDetailsDrawerOpen,
  ]);

  // Close section 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuSection) {
        const target = e.target as HTMLElement;
        if (!target.closest('.section-menu') && !target.closest('.section-menu-btn')) {
          setActiveMenuSection(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuSection]);

  // Close workspace 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuWorkspaceId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.workspace-menu') && !target.closest('.workspace-menu-btn')) {
          setActiveMenuWorkspaceId(null);
          setWorkspaceMenuPos(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuWorkspaceId]);

  // Close 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuTopicId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.topic-card-menu') && !target.closest('.topic-card-menu-btn')) {
          setActiveMenuTopicId(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuTopicId]);

  // Close task 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuTaskId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.task-item-menu') && !target.closest('.task-item-menu-btn')) {
          setActiveMenuTaskId(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuTaskId]);

  // Close +N More Sections dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMoreSectionsOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.more-sections-dropdown-container')) {
          setIsMoreSectionsOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isMoreSectionsOpen]);

  // Close Notification Panel on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isNotificationPanelOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.notification-dropdown-container')) {
          setIsNotificationPanelOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isNotificationPanelOpen]);

  // Close Workspace Switcher and Section Switcher dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isWorkspaceDropdownOpen || isWorkspaceSwitcherOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.workspace-dropdown-container')) {
          setIsWorkspaceDropdownOpen(false);
          setIsWorkspaceSwitcherOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isWorkspaceDropdownOpen, isWorkspaceSwitcherOpen]);

  // Close Mobile Workspace Switcher dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileWorkspaceDropdownOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.mobile-avatar-dropdown-container')) {
          setIsMobileWorkspaceDropdownOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isMobileWorkspaceDropdownOpen]);

  // Close Status Filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isStatusFilterDropdownOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.filter-dropdown-container')) {
          setIsStatusFilterDropdownOpen(false);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isStatusFilterDropdownOpen]);

  // Listen to Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Close User Profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuTarget) {
        const target = e.target as HTMLElement;
        if (!target.closest('.user-profile-dropdown-container')) {
          setProfileMenuTarget(null);
        }
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [profileMenuTarget]);

  // Profile Action Handlers
  const handleChangePassword = () => {
    setProfileMenuTarget(null);
    setIsChangePasswordOpen(true);
  };

  const handleSwitchAccount = () => {
    setProfileMenuTarget(null);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    setProfileMenuTarget(null);
    await logoutUser();
    setToastData({ message: 'Signed out successfully.' });
  };

  // Flag to prevent loopback saving while applying cloud updates
  const isCloudApplyingRef = useRef<boolean>(false);
  // Flag to prevent auto-save from overwriting cloud data before initial load completes
  const isInitialSyncCompleteRef = useRef<boolean>(false);

  // Initial Cloud Data Load & Real-Time Sync on User Login
  useEffect(() => {
    if (!currentUser) {
      isInitialSyncCompleteRef.current = false;
      return;
    }

    let isMounted = true;
    isInitialSyncCompleteRef.current = false;

    // 1. Initial Load / Migration
    const syncInitial = async () => {
      try {
        const cloudData = await fetchUserDataFromCloud(currentUser.uid);
        if (!isMounted) return;

        if (cloudData && (cloudData.workspaces?.length || cloudData.topics?.length || cloudData.notes?.length)) {
          // Cloud data exists: Sync into local state with safe non-destructive merging
          isCloudApplyingRef.current = true;
          if (cloudData.workspaces) setWorkspaces(cloudData.workspaces);
          if (cloudData.workspaceSections) setWorkspaceSections(cloudData.workspaceSections);
          if (cloudData.activeWorkspaceId) setActiveWorkspaceId(cloudData.activeWorkspaceId);
          if (cloudData.topics) {
            setTopics(prev => {
              const cloudTopicIds = new Set((cloudData.topics || []).map((t: any) => t.id));
              const localOnlyTopics = prev.filter(t => !cloudTopicIds.has(t.id));
              return [...(cloudData.topics || []), ...localOnlyTopics];
            });
          }
          if (cloudData.deletedTopics) setDeletedTopics(cloudData.deletedTopics);
          if (cloudData.deletedWorkspaces) setDeletedWorkspaces(cloudData.deletedWorkspaces);
          if (cloudData.deletedNotes) setDeletedNotes(cloudData.deletedNotes);
          if (cloudData.deletedSections) setDeletedSections(cloudData.deletedSections);
          if (cloudData.deletedTasks) setDeletedTasks(cloudData.deletedTasks);
          if (cloudData.deletedTopicNotes) setDeletedTopicNotes(cloudData.deletedTopicNotes);
          if (cloudData.deletedTopicLinks) setDeletedTopicLinks(cloudData.deletedTopicLinks);
          if (cloudData.notes) {
            setNotes(prev => {
              const cloudNoteIds = new Set((cloudData.notes || []).map((n: any) => n.id));
              const localOnlyNotes = prev.filter(n => !cloudNoteIds.has(n.id));
              return [...(cloudData.notes || []), ...localOnlyNotes];
            });
          }
          if (cloudData.standaloneTasks) {
            setStandaloneTasks(cloudData.standaloneTasks);
          }
          if (cloudData.userSettings) {
            setUserSettings(prev => {
              const { theme: _cloudTheme, ...restCloudSettings } = cloudData.userSettings as any;
              return {
                ...prev,
                ...restCloudSettings,
                theme: prev.theme || getInitialTheme()
              };
            });
          }
          setTimeout(() => {
            isCloudApplyingRef.current = false;
            isInitialSyncCompleteRef.current = true;
          }, 500);
        } else {
          // First time user: Upload local data to Firestore
          await saveUserDataToCloud(currentUser.uid, {
            workspaces,
            workspaceSections,
            topics,
            deletedTopics,
            deletedWorkspaces,
            deletedNotes,
            deletedSections,
            deletedTasks,
            deletedTopicNotes,
            deletedTopicLinks,
            notes,
            standaloneTasks,
            userSettings
          });
          isInitialSyncCompleteRef.current = true;
        }
      } catch (err) {
        console.error('Initial cloud sync error:', err);
        isInitialSyncCompleteRef.current = true;
      }
    };

    syncInitial();

    // 2. Real-time subscription for live multi-device updates
    const unsubscribe = subscribeToCloudData(currentUser.uid, (cloudData) => {
      if (isCloudApplyingRef.current) return;
      if (cloudData) {
        isCloudApplyingRef.current = true;
        if (cloudData.workspaces) {
          setWorkspaces(cloudData.workspaces);
          // Keep activeWorkspaceId valid if current active workspace was deleted on another device
          setActiveWorkspaceId(prev => {
            const exists = (cloudData.workspaces || []).some((ws: any) => ws.id === prev);
            return exists ? prev : (cloudData.workspaces && cloudData.workspaces.length > 0 ? cloudData.workspaces[0].id : prev);
          });
        }
        if (cloudData.workspaceSections) setWorkspaceSections(cloudData.workspaceSections);
        if (cloudData.topics) {
          setTopics(prev => {
            const cloudTopicIds = new Set((cloudData.topics || []).map((t: any) => t.id));
            const localOnlyTopics = prev.filter(t => !cloudTopicIds.has(t.id));
            return [...(cloudData.topics || []), ...localOnlyTopics];
          });
        }
        if (cloudData.deletedTopics) setDeletedTopics(cloudData.deletedTopics);
        if (cloudData.deletedWorkspaces) setDeletedWorkspaces(cloudData.deletedWorkspaces);
        if (cloudData.deletedNotes) setDeletedNotes(cloudData.deletedNotes);
        if (cloudData.deletedSections) setDeletedSections(cloudData.deletedSections);
        if (cloudData.deletedTasks) setDeletedTasks(cloudData.deletedTasks);
        if (cloudData.deletedTopicNotes) setDeletedTopicNotes(cloudData.deletedTopicNotes);
        if (cloudData.deletedTopicLinks) setDeletedTopicLinks(cloudData.deletedTopicLinks);
        if (cloudData.notes) {
          setNotes(prev => {
            const cloudNoteIds = new Set((cloudData.notes || []).map((n: any) => n.id));
            const localOnlyNotes = prev.filter(n => !cloudNoteIds.has(n.id));
            return [...(cloudData.notes || []), ...localOnlyNotes];
          });
        }
        if (cloudData.standaloneTasks) {
          setStandaloneTasks(cloudData.standaloneTasks);
        }
        if (cloudData.userSettings) {
          setUserSettings(prev => {
            const { theme: _cloudTheme, ...restCloudSettings } = cloudData.userSettings as any;
            return {
              ...prev,
              ...restCloudSettings,
              theme: prev.theme || getInitialTheme()
            };
          });
        }
        setTimeout(() => {
          isCloudApplyingRef.current = false;
        }, 500);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentUser]);

  // Keep a live ref to the latest state for instant flush on refresh / tab close
  const latestDataRef = useRef<any>({});
  useEffect(() => {
    latestDataRef.current = {
      workspaces,
      workspaceSections,
      topics,
      deletedTopics,
      deletedWorkspaces,
      deletedNotes,
      deletedSections,
      deletedTasks,
      deletedTopicNotes,
      deletedTopicLinks,
      notes,
      standaloneTasks,
      userSettings
    };
  }, [workspaces, workspaceSections, topics, deletedTopics, deletedWorkspaces, deletedNotes, deletedSections, deletedTasks, deletedTopicNotes, deletedTopicLinks, notes, standaloneTasks, userSettings]);

  // Immediate flush save to Firebase when browser is refreshed (F5) or closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentUser && isInitialSyncCompleteRef.current && !isCloudApplyingRef.current) {
        saveUserDataToCloud(currentUser.uid, latestDataRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser]);

  // Immediate Real-Time Cloud Auto-Save on any local data changes (0ms Delay - Instant Save)
  useEffect(() => {
    if (!currentUser || isCloudApplyingRef.current || !isInitialSyncCompleteRef.current) return;

    const payload = {
      workspaces,
      workspaceSections,
      topics,
      deletedTopics,
      deletedWorkspaces,
      deletedNotes,
      deletedSections,
      deletedTasks,
      deletedTopicNotes,
      deletedTopicLinks,
      notes,
      standaloneTasks,
      userSettings
    };
    latestDataRef.current = payload;
    saveUserDataToCloud(currentUser.uid, payload);
  }, [currentUser, workspaces, workspaceSections, topics, deletedTopics, deletedWorkspaces, deletedNotes, deletedSections, deletedTasks, deletedTopicNotes, deletedTopicLinks, notes, standaloneTasks, userSettings]);

  // Online / Offline Network Status Tracking
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastData({ message: 'Back online! Syncing changes with cloud... ☁️' });
    };
    const handleOffline = () => {
      setIsOnline(false);
      setToastData({ message: 'Offline Mode: Changes saved securely on this device 💾' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Multi-Tab Real-Time Sync (Cross-Tab Broadcast)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || isCloudApplyingRef.current) return;
      try {
        if (e.key === 'studyflow_topics' && e.newValue) {
          setTopics(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_workspaces' && e.newValue) {
          setWorkspaces(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_workspace_sections' && e.newValue) {
          setWorkspaceSections(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_notes' && e.newValue) {
          setNotes(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_user_settings' && e.newValue) {
          setUserSettings(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_deleted_topics' && e.newValue) {
          setDeletedTopics(JSON.parse(e.newValue));
        } else if (e.key === 'studyflow_deleted_workspaces' && e.newValue) {
          setDeletedWorkspaces(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error('Multi-tab sync parse error:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- Active Workspace Object ---
  const activeWorkspace = useMemo(() => {
    return workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0] || { id: '1', name: 'Workspace' };
  }, [workspaces, activeWorkspaceId]);

  // --- Filtered Topics for Active Workspace & Active Section ---
  const currentWorkspaceTopics = useMemo(() => {
    return syncedTopics.filter(t => t.workspaceId === activeWorkspaceId);
  }, [syncedTopics, activeWorkspaceId]);

  const filteredTopics = useMemo(() => {
    let list = currentWorkspaceTopics;
    if (activeSection) {
      list = currentWorkspaceTopics.filter(t => t.section === activeSection);
    }
    return list;
  }, [currentWorkspaceTopics, activeSection]);

  // Sort pinned topics first
  const sortedFilteredTopics = useMemo(() => {
    return [...filteredTopics].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [filteredTopics]);

  // --- Central System Keyboard Shortcuts Engine ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        (target as any).isContentEditable
      );

      const isAnyModalActive = Boolean(
        isNewWorkspaceOpen ||
        editingWorkspaceId ||
        isNewSectionOpen ||
        editingSection ||
        isNewTopicOpen ||
        isSmartStudioOpen ||
        editingTopicId ||
        isShortcutsOpen ||
        isSettingsOpen ||
        isAuthModalOpen ||
        isEditProfileOpen ||
        isChangePasswordOpen ||
        workspaceToDelete ||
        sectionToDelete ||
        topicToDelete ||
        isDetailsDrawerOpen
      );

      // Escape: Close recycle bin, notes page, search page, shortcuts modal, goal/streak popovers if open
      if (e.key === 'Escape') {
        if (isTasksPageOpen) {
          setIsTasksPageOpen(false);
          return;
        }
        if (isRecycleBinOpen) {
          setIsRecycleBinOpen(false);
          return;
        }
        if (isNotesPageOpen) {
          setIsNotesPageOpen(false);
          return;
        }
        if (isSearchPageOpen) {
          setIsSearchPageOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isAnalyticsPageOpen) {
          setIsAnalyticsPageOpen(false);
          return;
        }
        if (isGoalPopoverOpen) {
          setIsGoalPopoverOpen(false);
          return;
        }
        if (isStreakPopoverOpen) {
          setIsStreakPopoverOpen(false);
          return;
        }
      }

      // 1. Search, Sidebar, Help Cheatsheet (Ctrl / Meta shortcuts)
      if ((e.metaKey || e.ctrlKey) && !e.altKey) {
        if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (!isAnyModalActive || isSearchPageOpen) {
            setIsSearchPageOpen(prev => {
              const next = !prev;
              if (next) {
                setIsTasksPageOpen(false);
                setIsNotesPageOpen(false);
                setIsAnalyticsPageOpen(false);
              }
              return next;
            });
          }
          return;
        }
        if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          if (!isAnyModalActive) {
            setSidebarCollapsed(prev => !prev);
          }
          return;
        }
        if (e.key === '/') {
          e.preventDefault();
          if (!isAnyModalActive || isShortcutsOpen) {
            setIsShortcutsOpen(prev => !prev);
          }
          return;
        }
      }

      // 2. Alt-Based Shortcuts
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const keyLower = e.key.toLowerCase();

        // 2a. Alt + Space: Start / Pause Study Timer Toggle (Allowed globally unless typing)
        if (e.code === 'Space' || e.key === ' ') {
          if (!isTyping) {
            e.preventDefault();
            if (activeStudyTimer) {
              if (activeStudyTimer.isPaused) {
                handleResumeGlobalStudyTimer();
              } else {
                handlePauseGlobalStudyTimer();
              }
            } else {
              showToast('Select a task or open topic drawer to start study timer ⏱️');
            }
          }
          return;
        }

        // 2b. Alt + L (without shift): Stop & Log Study Time
        if (!e.shiftKey && keyLower === 'l') {
          if (activeStudyTimer && !isTyping) {
            e.preventDefault();
            handleStopAndLogGlobalStudyTimer();
            return;
          }
        }

        // If ANY modal or Topic Details Drawer is currently active, DO NOT trigger other modal openers or workspace switches!
        if (isAnyModalActive || isTyping) {
          return;
        }

        const isGlobalPageActive = Boolean(isRecycleBinOpen || isNotesPageOpen || isSearchPageOpen || isAnalyticsPageOpen);

        // 2c. Alt + S (without shift): Create Section Modal (Requires an active workspace view!)
        if (!e.shiftKey && keyLower === 's') {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            showToast('Please open a workspace first to create sections 📁');
            return;
          }
          setNewSectionName('');
          setIsNewSectionOpen(true);
          return;
        }

        // 2d. Alt + Shift + S: Rename Active Section
        if (e.shiftKey && keyLower === 's') {
          if (!isGlobalPageActive && activeSection) {
            e.preventDefault();
            setEditingSection(activeSection);
            setEditingSectionName(activeSection);
            return;
          }
        }

        // 2e. Alt + G (without shift): Toggle Today's Goal Popover
        if (!e.shiftKey && keyLower === 'g') {
          e.preventDefault();
          setIsGoalPopoverOpen(prev => !prev);
          return;
        }

        // 2f. Alt + Shift + G: Toggle Streak Consistency Dashboard
        if (e.shiftKey && keyLower === 'g') {
          e.preventDefault();
          setIsStreakPopoverOpen(prev => !prev);
          return;
        }

        // 2g. Alt + W (without shift): New Workspace Modal
        if (!e.shiftKey && keyLower === 'w') {
          e.preventDefault();
          setNewWorkspaceName('');
          setIsNewWorkspaceOpen(true);
          return;
        }

        // 2h. Alt + Shift + W: Rename Active Workspace
        if (e.shiftKey && keyLower === 'w') {
          if (!isGlobalPageActive && activeWorkspace) {
            e.preventDefault();
            setEditingWorkspaceId(activeWorkspace.id);
            setEditingWorkspaceName(activeWorkspace.name);
            return;
          }
        }

        // 2i. Alt + T (without shift): Create Single Topic Modal (Requires active workspace view!)
        if (!e.shiftKey && keyLower === 't') {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            showToast('Please open a workspace first to add topics 📚');
            return;
          }
          setNewTopicTitle('');
          setIsNewTopicOpen(true);
          return;
        }

        // 2j. Alt + Shift + T: Smart Topic Studio (Visual Form - Requires active workspace view!)
        if (e.shiftKey && keyLower === 't') {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            showToast('Please open a workspace first to open Topic Studio 📚');
            return;
          }
          setSmartStudioInitialMode('visual');
          setIsSmartStudioOpen(true);
          return;
        }

        // 2k. Alt + Shift + M: Smart Topic Studio (Markdown Text Mode - Requires active workspace view!)
        if (e.shiftKey && keyLower === 'm') {
          e.preventDefault();
          if (isGlobalPageActive || !activeWorkspaceId || workspaces.length === 0) {
            showToast('Please open a workspace first to open Topic Studio 📚');
            return;
          }
          setSmartStudioInitialMode('markdown');
          setIsSmartStudioOpen(true);
          return;
        }

        // 2l. Alt + R: Toggle Recycle Bin View
        if (!e.shiftKey && keyLower === 'r') {
          e.preventDefault();
          setIsRecycleBinOpen(prev => !prev);
          return;
        }

        // 2m. Alt + 1..9, Alt + 0: Switch directly to 1st..10th Workspace
        if (!e.shiftKey && /^[0-9]$/.test(e.key)) {
          const num = parseInt(e.key, 10);
          const targetIndex = num === 0 ? 9 : num - 1;
          const list = sortedWorkspaces.length > 0 ? sortedWorkspaces : workspaces;
          if (list[targetIndex]) {
            e.preventDefault();
            setActiveWorkspaceId(list[targetIndex].id);
            if (isRecycleBinOpen) setIsRecycleBinOpen(false);
            if (isNotesPageOpen) setIsNotesPageOpen(false);
            if (isAnalyticsPageOpen) setIsAnalyticsPageOpen(false);
            return;
          }
        }

        // 2n. Alt + ] or Alt + ArrowDown: Next Workspace
        if (e.key === ']' || e.key === 'ArrowDown') {
          const list = sortedWorkspaces.length > 0 ? sortedWorkspaces : workspaces;
          if (list.length > 0) {
            e.preventDefault();
            const currIdx = list.findIndex(w => w.id === activeWorkspaceId);
            const nextIdx = currIdx === -1 ? 0 : (currIdx + 1) % list.length;
            setActiveWorkspaceId(list[nextIdx].id);
            if (isRecycleBinOpen) setIsRecycleBinOpen(false);
            return;
          }
        }

        // 2o. Alt + [ or Alt + ArrowUp: Previous Workspace
        if (e.key === '[' || e.key === 'ArrowUp') {
          const list = sortedWorkspaces.length > 0 ? sortedWorkspaces : workspaces;
          if (list.length > 0) {
            e.preventDefault();
            const currIdx = list.findIndex(w => w.id === activeWorkspaceId);
            const prevIdx = currIdx === -1 ? 0 : (currIdx - 1 + list.length) % list.length;
            setActiveWorkspaceId(list[prevIdx].id);
            if (isRecycleBinOpen) setIsRecycleBinOpen(false);
            return;
          }
        }

        // 2p. Alt + ArrowRight: Next Section
        if (e.key === 'ArrowRight') {
          if (currentWorkspaceSections.length > 0) {
            e.preventDefault();
            const secNames = currentWorkspaceSections.map(s => s.name);
            const currIdx = activeSection ? secNames.indexOf(activeSection) : -1;
            const nextIdx = (currIdx + 1) % secNames.length;
            setActiveSection(secNames[nextIdx]);
            return;
          }
        }

        // 2q. Alt + ArrowLeft: Previous Section
        if (e.key === 'ArrowLeft') {
          if (currentWorkspaceSections.length > 0) {
            e.preventDefault();
            const secNames = currentWorkspaceSections.map(s => s.name);
            const currIdx = activeSection ? secNames.indexOf(activeSection) : 0;
            const prevIdx = (currIdx - 1 + secNames.length) % secNames.length;
            setActiveSection(secNames[prevIdx]);
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    isSearchPageOpen,
    isNotesPageOpen,
    isAnalyticsPageOpen,
    isShortcutsOpen,
    isGoalPopoverOpen,
    isStreakPopoverOpen,
    activeStudyTimer,
    activeWorkspace,
    activeWorkspaceId,
    workspaces,
    activeSection,
    currentWorkspaceSections,
    handleResumeGlobalStudyTimer,
    handlePauseGlobalStudyTimer,
    handleStopAndLogGlobalStudyTimer
  ]);

  // --- Full-Page Global Search Indexing Engine ---
  // Completed Topics Count for Daily Target Goal
  const completedTopicsCount = useMemo(() => {
    return currentWorkspaceTopics.filter(t => t.tasks.length > 0 && t.tasks.every(tk => tk.completed)).length;
  }, [currentWorkspaceTopics]);

  // Smart Next Incomplete Topic Detector for Celebration Modal
  const nextIncompleteTopic = useMemo(() => {
    if (!congratulationsTopic) return null;
    const sameSectionTopics = currentWorkspaceTopics.filter(t => t.section === congratulationsTopic.sectionName);
    const incomplete = sameSectionTopics.find(t => t.id !== congratulationsTopic.id && t.tasks.some(tk => !tk.completed));
    if (incomplete) return { id: incomplete.id, title: incomplete.title };

    // Fallback: any other incomplete topic in workspace
    const anyIncomplete = currentWorkspaceTopics.find(t => t.id !== congratulationsTopic.id && t.tasks.some(tk => !tk.completed));
    return anyIncomplete ? { id: anyIncomplete.id, title: anyIncomplete.title } : null;
  }, [congratulationsTopic, currentWorkspaceTopics]);

  // Theme generator for Deep Colorful Icons & Micro-Topic Semantic Icon Matching with 7-Color Variety
  const getTopicTheme = (topicOrTitle: string | Topic, index?: number) => {
    const title = typeof topicOrTitle === 'string' ? topicOrTitle : topicOrTitle.title;
    const customColor = typeof topicOrTitle === 'object' ? topicOrTitle.customColor : undefined;
    const customIconName = typeof topicOrTitle === 'object' ? topicOrTitle.customIcon : undefined;
    const t = title.toLowerCase().trim();

    // 7 Highlighted Colors Palette for Dynamic Rotation & Variety
    const palettes = [
      { id: 'blue', bg: 'bg-[#2563EB]', cardIconBg: 'bg-[#2563EB]', cardIconColor: 'text-white', progressBarBg: 'bg-[#3B82F6]', progressGradient: 'from-[#1E40AF] via-[#2563EB] to-[#60A5FA]', textColor: 'text-[#2563EB]', pinIconColor: 'text-[#2563EB] fill-[#2563EB]' }, // 1. Royal Blue
      { id: 'purple', bg: 'bg-[#8B5CF6]', cardIconBg: 'bg-[#8B5CF6]', cardIconColor: 'text-white', progressBarBg: 'bg-[#8B5CF6]', progressGradient: 'from-[#6D28D9] via-[#8B5CF6] to-[#C084FC]', textColor: 'text-[#8B5CF6]', pinIconColor: 'text-[#8B5CF6] fill-[#8B5CF6]' }, // 2. Purple
      { id: 'green', bg: 'bg-[#10B981]', cardIconBg: 'bg-[#10B981]', cardIconColor: 'text-white', progressBarBg: 'bg-[#10B981]', progressGradient: 'from-[#047857] via-[#10B981] to-[#34D399]', textColor: 'text-[#10B981]', pinIconColor: 'text-[#10B981] fill-[#10B981]' }, // 3. Emerald Green
      { id: 'orange', bg: 'bg-[#EA580C]', cardIconBg: 'bg-[#EA580C]', cardIconColor: 'text-white', progressBarBg: 'bg-[#EA580C]', progressGradient: 'from-[#C2410C] via-[#EA580C] to-[#FB923C]', textColor: 'text-[#EA580C]', pinIconColor: 'text-[#EA580C] fill-[#EA580C]' }, // 4. Warm Orange
      { id: 'pink', bg: 'bg-[#F43F5E]', cardIconBg: 'bg-[#F43F5E]', cardIconColor: 'text-white', progressBarBg: 'bg-[#F43F5E]', progressGradient: 'from-[#BE123C] via-[#F43F5E] to-[#FDA4AF]', textColor: 'text-[#F43F5E]', pinIconColor: 'text-[#F43F5E] fill-[#F43F5E]' }, // 5. Rose Pink
      { id: 'cyan', bg: 'bg-[#06B6D4]', cardIconBg: 'bg-[#06B6D4]', cardIconColor: 'text-white', progressBarBg: 'bg-[#06B6D4]', progressGradient: 'from-[#0E7490] via-[#06B6D4] to-[#67E8F9]', textColor: 'text-[#06B6D4]', pinIconColor: 'text-[#06B6D4] fill-[#06B6D4]' }, // 6. Ocean Cyan
      { id: 'amber', bg: 'bg-[#F59E0B]', cardIconBg: 'bg-[#F59E0B]', cardIconColor: 'text-white', progressBarBg: 'bg-[#F59E0B]', progressGradient: 'from-[#B45309] via-[#F59E0B] to-[#FDE68A]', textColor: 'text-[#F59E0B]', pinIconColor: 'text-[#F59E0B] fill-[#F59E0B]' }  // 7. Amber Gold
    ];

    // Compute consistent hash from title so each card deterministically retains its exact same color
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash << 5) - hash + title.charCodeAt(i);
      hash |= 0;
    }
    const colorIdx = Math.abs(hash) % palettes.length;
    let baseColor = palettes[colorIdx];

    if (customColor) {
      const matchCustom = palettes.find(p => p.id === customColor || p.bg.includes(customColor));
      if (matchCustom) baseColor = matchCustom;
    }

    // Comprehensive Icon lookup helper if customIconName is set
    const getCustomIconComponent = (name: string) => {
      switch (name.toLowerCase()) {
        // 1. বাংলা ব্যাকরণ & Grammar
        case 'languages': return Languages;
        case 'type': return Type;
        case 'spellcheck': return SpellCheck;
        case 'booka': return BookA;
        case 'notebooktabs': return NotebookTabs;
        case 'wholeword': return WholeWord;
        case 'textcursor': return TextCursor;
        case 'pilcrow': return Pilcrow;
        case 'casesensitive': return CaseSensitive;
        case 'brackets': return Brackets;
        case 'filetext': return FileText;
        case 'badgecheck': return BadgeCheck;

        // 2. সাহিত্য / Literature
        case 'bookopen': return BookOpen;
        case 'bookopentext': return BookOpenText;
        case 'library': return Library;
        case 'feather': return Feather;
        case 'pentool': return PenTool;
        case 'scroll': return Scroll;
        case 'scrolltext': return ScrollText;
        case 'notebook': return Notebook;
        case 'quote': return Quote;
        case 'bookmarked': return BookMarked;
        case 'graduationcap': return GraduationCap;
        case 'penline': return PenLine;
        case 'bookcopy': return BookCopy;
        case 'notebookpen': return NotebookPen;
        case 'theater': return Theater;

        // 5. গণিত / Mathematics
        case 'calculator': return Calculator;
        case 'sigma': return Sigma;
        case 'radical': return Radical;
        case 'pi': return Pi;
        case 'percent': return Percent;
        case 'divide': return Divide;
        case 'squarefunction': return SquareFunction;
        case 'equal': return Equal;
        case 'variable': return Variable;
        case 'binary': return Binary;
        case 'chartnoaxescolumn': return ChartNoAxesColumn;
        case 'hash': return Hash;

        // 6. মানসিক দক্ষতা / Mental Ability
        case 'brain': return Brain;
        case 'braincircuit': return BrainCircuit;
        case 'puzzle': return Puzzle;
        case 'lightbulb': return Lightbulb;
        case 'blocks': return Blocks;
        case 'route': return Route;
        case 'network': return Network;
        case 'scansearch': return ScanSearch;
        case 'workflow': return Workflow;
        case 'gitbranch': return GitBranch;
        case 'shapes': return Shapes;
        case 'waypoints': return Waypoints;
        case 'triangle': return Triangle;
        case 'box': return Box;
        case 'dices': return Dices;

        // 7 & 8. বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি
        case 'map': return Map;
        case 'mappinned': return MapPinned;
        case 'landmark': return Landmark;
        case 'flag': return Flag;
        case 'building2': return Building2;
        case 'building': return Building;
        case 'scale': return Scale;
        case 'users': return Users;
        case 'usercheck': return UserCheck;
        case 'factory': return Factory;
        case 'wheat': return Wheat;
        case 'globe': return Globe;
        case 'earth': return Earth;
        case 'handshake': return Handshake;
        case 'plane': return Plane;
        case 'ship': return Ship;

        // 9. সাধারণ বিজ্ঞান
        case 'atom': return Atom;
        case 'flaskconical': return FlaskConical;
        case 'microscope': return Microscope;
        case 'telescope': return Telescope;
        case 'dna': return Dna;
        case 'testtube': return TestTube;
        case 'testtubes': return TestTubes;
        case 'orbit': return Orbit;
        case 'magnet': return Magnet;
        case 'zap': return Zap;
        case 'thermometer': return Thermometer;
        case 'leaf': return Leaf;
        case 'radiation': return Radiation;

        // 10. ICT / Computer
        case 'monitor': return Monitor;
        case 'computer': return Computer;
        case 'cpu': return Cpu;
        case 'microchip': return Microchip;
        case 'database': return Database;
        case 'server': return Server;
        case 'wifi': return Wifi;
        case 'code2': return Code2;
        case 'terminal': return Terminal;
        case 'cloud': return Cloud;
        case 'shieldcheck': return ShieldCheck;

        // 11, 12, 13. ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা
        case 'mountain': return Mountain;
        case 'waves': return Waves;
        case 'compass': return Compass;
        case 'navigation': return Navigation;
        case 'trees': return Trees;
        case 'treepine': return TreePine;
        case 'sprout': return Sprout;
        case 'recycle': return Recycle;
        case 'droplets': return Droplets;
        case 'wind': return Wind;
        case 'sun': return Sun;
        case 'cloudsun': return CloudSun;
        case 'flower': return Flower;
        case 'flower2': return Flower2;
        case 'biohazard': return Biohazard;
        case 'alerttriangle': return AlertTriangle;
        case 'siren': return Siren;
        case 'shieldalert': return ShieldAlert;
        case 'cloudlightning': return CloudLightning;
        case 'flame': return Flame;
        case 'lifebuoy': return LifeBuoy;
        case 'ambulance': return Ambulance;
        case 'radio': return Radio;
        case 'cross': return Cross;

        // 14, 15, 16. নৈতিকতা, মূল্যবোধ ও সুশাসন
        case 'hearthandshake': return HeartHandshake;
        case 'handheart': return HandHeart;
        case 'heart': return Heart;
        case 'smile': return Smile;
        case 'gem': return Gem;
        case 'thumbsup': return ThumbsUp;
        case 'checkcircle2': return CheckCircle2;
        case 'award': return Award;
        case 'star': return Star;
        case 'sparkles': return Sparkles;
        case 'vote': return Vote;
        case 'filecheck': return FileCheck;
        case 'clipboardcheck': return ClipboardCheck;
        case 'gavel': return Gavel;
        case 'eye': return Eye;
        case 'fingerprint': return Fingerprint;

        // 17, 18, 19, 20. Current Affairs, GK, ইতিহাস ও সংবিধান
        case 'newspaper': return Newspaper;
        case 'rss': return Rss;
        case 'megaphone': return Megaphone;
        case 'calendardays': return CalendarDays;
        case 'clock': return Clock;
        case 'clock3': return Clock3;
        case 'bell': return Bell;
        case 'trendingup': return TrendingUp;
        case 'tv': return Tv;
        case 'podcast': return Podcast;
        case 'messagesquaremore': return MessageSquareMore;
        case 'circlehelp': return CircleHelp;
        case 'trophy': return Trophy;
        case 'castle': return Castle;
        case 'crown': return Crown;
        case 'swords': return Swords;
        case 'hourglass': return Hourglass;
        case 'history': return History;
        case 'bookcheck': return BookCheck;

        // 21, 22, 23. অর্থনীতি, ব্যাংকিং ও কৃষি
        case 'banknote': return Banknote;
        case 'creditcard': return CreditCard;
        case 'walletcards': return WalletCards;
        case 'receipt': return Receipt;
        case 'chartnoaxescombined': return ChartNoAxesCombined;
        case 'piggybank': return PiggyBank;
        case 'vault': return Vault;
        case 'badgedollarsign': return BadgeDollarSign;
        case 'wallet': return Wallet;
        case 'coins': return Coins;
        case 'circledollarsign': return CircleDollarSign;
        case 'handcoins': return HandCoins;
        case 'piechart': return PieChart;
        case 'tractor': return Tractor;
        case 'shovel': return Shovel;
        case 'apple': return Apple;
        case 'warehouse': return Warehouse;

        // 24, 25. মুক্তিযুদ্ধ ও খেলাধুলা
        case 'medal': return Medal;
        case 'shield': return Shield;
        case 'dumbbell': return Dumbbell;
        case 'volleyball': return Volleyball;
        case 'bike': return Bike;
        case 'goal': return Goal;
        case 'timer': return Timer;
        case 'flagtriangleright': return FlagTriangleRight;
        case 'target': return Target;
        default: return null;
      }
    };

    if (customIconName) {
      const customComp = getCustomIconComponent(customIconName);
      if (customComp) {
        return { ...baseColor, icon: customComp };
      }
    }

    // --- 25-SUBJECT SEMANTIC TOPIC ICON MATCHER (Exact Syllabus Keyword Mapping) ---

    // 1. বাংলা ব্যাকরণ (Bangla Grammar)
    if (['বাংলা ব্যাকরণ', 'ব্যাকরণ', 'ধ্বনি', 'বর্ণ', 'শব্দ', 'পদ', 'সন্ধি', 'সমাস', 'কারক', 'বিভক্তি', 'প্রত্যয়', 'প্রত্যয়', 'উপসর্গ', 'অনুসর্গ', 'লিঙ্গ', 'বচন', 'পুরুষ', 'ক্রিয়া', 'কাল', 'সমার্থক শব্দ', 'বিপরীতার্থক শব্দ', 'বিপরীত শব্দ', 'এককথায় প্রকাশ', 'এককথায় প্রকাশ', 'বাগধারা', 'প্রবাদ', 'পারিভাষিক শব্দ', 'বিদেশি শব্দ', 'বানান', 'শুদ্ধ প্রয়োগ', 'শুদ্ধ-অশুদ্ধ', 'বাক্য শুদ্ধিকরণ', 'যতিচিহ্ন', 'বিরামচিহ্ন', 'প্রকৃতি ও প্রত্যয়', 'ধাতু', 'উক্তি পরিবর্তন', 'বাচ্য পরিবর্তন'].some(k => t.includes(k))) {
      const banglaGrammarIcons = [Languages, Type, SpellCheck, BookA, NotebookTabs, WholeWord, TextCursor, Pilcrow, CaseSensitive, Brackets];
      return { ...baseColor, icon: banglaGrammarIcons[Math.abs(hash) % banglaGrammarIcons.length] };
    }

    // 2. বাংলা সাহিত্য (Bangla Literature)
    if (['বাংলা সাহিত্য', 'প্রাচীন যুগ', 'চর্যাপদ', 'মধ্যযুগ', 'শ্রীকৃষ্ণকীর্তন', 'মঙ্গলকাব্য', 'বৈষ্ণব পদাবলী', 'ইউসুফ জুলেখা', 'পদ্মাবতী', 'লোকসাহিত্য', 'মৈমনসিংহ গীতিকা', 'নাথ সাহিত্য', 'মরমি সাহিত্য', 'বাউল গান', 'লালন শাহ', 'শাহ আবদুল করিম', 'প্রণয়োপাখ্যান', 'আধুনিক যুগ', 'ফোর্ট উইলিয়াম', 'ঈশ্বরচন্দ্র বিদ্যাসাগর', 'মাইকেল মধুসূদন', 'বঙ্কিমচন্দ্র', 'মীর মশাররফ', 'রবীন্দ্রনাথ', 'কাজী নজরুল', 'জীবনানন্দ', 'জসীম উদ্‌দীন', 'বেগম রোকেয়া', 'তারাশঙ্কর', 'মানিক বন্দ্যোপাধ্যায়', 'বিভূতিভূষণ', 'শওকত ওসমান', 'সৈয়দ ওয়ালীউল্লাহ্', 'মুনীর চৌধুরী', 'শামসুর রাহমান', 'আল মাহমুদ', 'হুমায়ূন আহমেদ', 'আখতারুজ্জামান ইলিয়াস', 'সেলিনা হোসেন', 'সৈয়দ শামসুল হক', 'উপন্যাস', 'কবিতা', 'নাটক', 'প্রবন্ধ', 'মহাকাব্য'].some(k => t.includes(k))) {
      const banglaLitIcons = [BookOpen, BookOpenText, Library, Feather, PenTool, Scroll, Notebook, Quote, BookMarked, GraduationCap, PenLine, BookCopy];
      return { ...baseColor, icon: banglaLitIcons[Math.abs(hash) % banglaLitIcons.length] };
    }

    // 3. English Grammar
    if (['english grammar', 'parts of speech', 'article', 'gender', 'person', 'case', 'tense', 'right form of verb', 'subject-verb agreement', 'voice change', 'voice', 'narration', 'speech', 'transformation of sentences', 'degree', 'conditional sentence', 'clause', 'phrase', 'modifier', 'preposition', 'conjunction', 'appropriate preposition', 'synonym', 'antonym', 'one word substitution', 'idioms & phrases', 'idioms', 'phrasal verb', 'group verb', 'spelling', 'vocabulary', 'analogy', 'completing sentence', 'sentence correction', 'error detection', 'fill in the blanks', 'cloze test', 'tag question', 'question formation', 'parallelism', 'redundancy', 'translation', 'comprehension', 'rearrangement', 'prefix', 'suffix', 'foreign words', 'proverbs'].some(k => t.includes(k))) {
      const englishGrammarIcons = [Languages, SpellCheck, WholeWord, CaseSensitive, Type, Brackets, TextCursor, Pilcrow, BookA, BadgeCheck];
      return { ...baseColor, icon: englishGrammarIcons[Math.abs(hash) % englishGrammarIcons.length] };
    }

    // 4. English Literature
    if (['english literature', 'literary terms', 'figures of speech', 'literary ages', 'old english', 'middle english', 'renaissance', 'elizabethan', 'jacobean', 'puritan', 'restoration', 'neoclassical', 'augustan', 'romantic age', 'victorian age', 'modern age', 'postmodern', 'william shakespeare', 'shakespeare', 'john milton', 'wordsworth', 'coleridge', 'lord byron', 'shelley', 'keats', 'blake', 'jane austen', 'charles dickens', 'thomas hardy', 'bernard shaw', 't.s. eliot', 'w.b. yeats', 'hemingway', 'george orwell', 'drama', 'poetry', 'novel'].some(k => t.includes(k))) {
      const englishLitIcons = [BookOpen, Library, Feather, ScrollText, Quote, PenTool, BookMarked, NotebookPen, BookOpenText, GraduationCap, Theater];
      return { ...baseColor, icon: englishLitIcons[Math.abs(hash) % englishLitIcons.length] };
    }

    // 5. গণিত / Mathematics
    if (['গণিত', 'math', 'mathematics', 'পাটিগণিত', 'বাস্তব সংখ্যা', 'লসাগু', 'গসাগু', 'শতকরা', 'লাভ-ক্ষতি', 'লাভ ক্ষতি', 'মুনাফা', 'অনুপাত', 'সমানুপাত', 'ভগ্নাংশ', 'দশমিক', 'ঐকিক নিয়ম', 'ঐকিক নিয়ম', 'কাজ ও সময়', 'কাজ ও সময়', 'নল ও চৌবাচ্চা', 'গতি ও দূরত্ব', 'নৌকা ও স্রোত', 'নৌকা', 'স্রোত', 'ট্রেন', 'বীজগণিত', 'সূচক', 'লগারিদম', 'ধারা', 'সমান্তর ধারা', 'গুণোত্তর ধারা', 'দ্বিপদী', 'সমীকরণ', 'অসমতা', 'ফাংশন', 'সেট', 'জ্যামিতি', 'রেখা', 'কোণ', 'ত্রিভুজ', 'চতুর্ভুজ', 'বৃত্ত', 'পিথাগোরাস', 'পরিমিতি', 'ত্রিকোণমিতি', 'বিন্যাস', 'সমাবেশ', 'সম্ভাবনা', 'পরিসংখ্যান', 'calculus', 'algebra', 'geometry', 'triangle', 'percent'].some(k => t.includes(k))) {
      if (['ত্রিভুজ', 'কোণ', 'geometry', 'triangle'].some(k => t.includes(k))) return { ...baseColor, icon: Triangle };
      if (['শতকরা', 'লাভ-ক্ষতি', 'লাভ ক্ষতি', 'মুনাফা', 'percentage'].some(k => t.includes(k))) return { ...baseColor, icon: Percent };
      if (['অনুপাত', 'ভগ্নাংশ', 'divide', 'ratio'].some(k => t.includes(k))) return { ...baseColor, icon: Divide };
      if (['ট্রেন', 'train'].some(k => t.includes(k))) return { ...baseColor, icon: Train };
      if (['নৌকা', 'স্রোত', 'boat', 'stream'].some(k => t.includes(k))) return { ...baseColor, icon: Ship };
      if (['নল ও চৌবাচ্চা', 'চৌবাচ্চা', 'pipe'].some(k => t.includes(k))) return { ...baseColor, icon: Droplets };
      if (['ধারা', 'সমষ্টি', 'sigma'].some(k => t.includes(k))) return { ...baseColor, icon: Sigma };
      if (['সূচক', 'করণী', 'মূল', 'রুট', 'radical'].some(k => t.includes(k))) return { ...baseColor, icon: Radical };
      if (['লগারিদম', 'পাই', 'pi'].some(k => t.includes(k))) return { ...baseColor, icon: Pi };
      const mathIcons = [Calculator, Sigma, Radical, Pi, Percent, Divide, SquareFunction, Equal, Variable, Binary, ChartNoAxesColumn];
      return { ...baseColor, icon: mathIcons[Math.abs(hash) % mathIcons.length] };
    }

    // 6. মানসিক দক্ষতা / Mental Ability
    if (['মানসিক দক্ষতা', 'mental ability', 'reasoning', 'ভাষাগত যৌক্তিক', 'রক্ত সম্পর্ক', 'দিক নির্ণয়', 'দিক নির্ণয়', 'ঘড়ি', 'ঘড়ি', 'ক্যালেন্ডার', 'বয়স', 'বয়স', 'গাণিতিক যুক্তি', 'সংখ্যা ও বর্ণ সিরিজ', 'কোডিং', 'ডিকোডিং', 'অনুরূপ সম্পর্ক', 'স্থানিক সম্পর্ক', 'চিত্র', 'প্রতিবিম্ব', 'ঘনক', 'পাশা', 'কাগজ ভাঁজ', 'যান্ত্রিক যুক্তি', 'স্থানাঙ্ক সম্পর্ক', 'সাদৃশ্য', 'শ্রেণিবিন্যাস', 'ধাঁধা', 'বিশ্লেষণাত্মক', 'সিলোজিজম', 'ভেনচিত্র', 'puzzle'].some(k => t.includes(k))) {
      if (['ঘনক', 'পাশা', 'cube', 'dice'].some(k => t.includes(k))) return { ...baseColor, icon: Box };
      if (['রক্ত সম্পর্ক', 'blood relation'].some(k => t.includes(k))) return { ...baseColor, icon: Users };
      if (['দিক নির্ণয়', 'দিক নির্ণয়', 'direction', 'compass'].some(k => t.includes(k))) return { ...baseColor, icon: Compass };
      if (['ঘড়ি', 'ঘড়ি', 'ক্যালেন্ডার', 'বয়স', 'বয়স', 'clock', 'timer', 'calendar'].some(k => t.includes(k))) return { ...baseColor, icon: Timer };
      const mentalIcons = [Brain, BrainCircuit, Puzzle, Lightbulb, Blocks, Route, Network, ScanSearch, Workflow, GitBranch, Shapes, Waypoints];
      return { ...baseColor, icon: mentalIcons[Math.abs(hash) % mentalIcons.length] };
    }

    // 7. বাংলাদেশ বিষয়াবলি (Bangladesh Affairs)
    if (['বাংলাদেশ বিষয়াবলি', 'বাংলাদেশ বিষয়াবলি', 'বাংলাদেশ', 'bangladesh', 'প্রাচীন বাংলার ইতিহাস', 'জনপদ', 'মৌর্য', 'গুপ্ত', 'শশাঙ্ক', 'পাল বংশ', 'সেন বংশ', 'সুলতানি আমল', 'মুঘল আমল', 'নবাবী আমল', 'ব্রিটিশ শাসন', 'পলাশীর যুদ্ধ', 'সিপাহি বিদ্রোহ', 'বঙ্গভঙ্গ', 'পাকিস্তান আমল', 'ভাষা আন্দোলন', 'যুক্তফ্রন্ট', 'ছয় দফা', '৬ দফা', 'গণঅভ্যুত্থান', '৭০ এর নির্বাচন', 'ঐতিহাসিক স্থান', 'প্রত্নতাত্ত্বিক', 'সীমানা', 'ছিটমহল', 'সমুদ্রসীমা', 'আদমশুমারি', 'জনশুমারি', 'উপজাতি', 'ক্ষুদ্র নৃগোষ্ঠী', 'জাতীয় প্রতীক'].some(k => t.includes(k))) {
      const bdIcons = [Map, MapPinned, Landmark, Flag, Building2, Scale, BadgeCheck, ScrollText, Users, Factory, Wheat];
      return { ...baseColor, icon: bdIcons[Math.abs(hash) % bdIcons.length] };
    }

    // 8. আন্তর্জাতিক বিষয়াবলি (International Affairs)
    if (['আন্তর্জাতিক বিষয়াবলি', 'আন্তর্জাতিক বিষয়াবলি', 'আন্তর্জাতিক', 'international affairs', 'বিশ্ব রাজনীতি', 'ভূ-রাজনীতি', 'geopolitics', 'জাতিসংঘ', 'united nations', 'সাধারণ পরিষদ', 'নিরাপত্তা পরিষদ', 'আন্তর্জাতিক সংস্থা', 'আঞ্চলিক সংস্থা', 'সার্ক', 'আসিয়ান', 'ন্যাটো', 'ব্রিকস', 'ইউপিপিপি', 'বিশ্বব্যাংক', 'আন্তর্জাতিক চুক্তি', 'সম্মেলন', 'প্রথম বিশ্বযুদ্ধ', 'দ্বিতীয় বিশ্বযুদ্ধ', 'স্নায়ুযুদ্ধ', 'উপসাগরীয় যুদ্ধ', 'প্রণালী', 'খাল', 'দ্বীপ', 'উপদ্বীপ', 'সীমান্ত রেখা', 'বিরোধপূর্ণ অঞ্চল', 'নোবেল পুরস্কার', 'বিশ্বের বৃহত্তম'].some(k => t.includes(k))) {
      const intlIcons = [Globe, Earth, Landmark, Flag, Handshake, Plane, Map, Ship, Languages, Network, Building];
      return { ...baseColor, icon: intlIcons[Math.abs(hash) % intlIcons.length] };
    }

    // 9. সাধারণ বিজ্ঞান (General Science)
    if (['সাধারণ বিজ্ঞান', 'বিজ্ঞান', 'science', 'পদার্থবিজ্ঞান', 'পদার্থের অবস্থা', 'গতি', 'বল', 'মহাকর্ষ', 'অভিকর্ষ', 'কাজ, ক্ষমতা ও শক্তি', 'শব্দ', 'আলো', 'তাপ ও তাপমাত্রা', 'বিদ্যুৎ', 'চৌম্বকত্ব', 'আধুনিক পদার্থবিজ্ঞান', 'তেজস্ক্রিয়তা', 'রসায়ন', 'পরমাণুর গঠন', 'পর্যায় সারণি', 'রাসায়নিক বন্ধন', 'এসিড', 'ক্ষার', 'লবণ', 'রাসায়নিক বিক্রিয়া', 'জারণ বিজারণ', 'ধাতু ও অধাতু', 'পলিমার', 'প্লাস্টিক', 'জীববিজ্ঞান', 'কোষ', 'টিস্যু', 'অঙ্গ সংস্থান', 'জিনতত্ত্ব', 'বংশগতি', 'ডিএনএ', 'আরএনএ', 'উদ্ভিদের শ্রেণিবিন্যাস', 'সালোকসংশ্লেষণ', 'শ্বসন', 'খাদ্য ও পুষ্টি', 'ভিটামিন', 'খনিজ', 'মানবদেহের অঙ্গসংস্থান', 'রক্ত সংবহন', 'হৃদরোগ', 'স্নায়ুতন্ত্র', 'মস্তিষ্ক', 'হরমোন', 'রোগব্যাধি', 'ব্যাকটেরিয়া', 'ভাইরাস', 'টিকা', 'physics', 'chemistry', 'biology'].some(k => t.includes(k))) {
      const scienceIcons = [Atom, FlaskConical, Microscope, Telescope, Dna, TestTube, TestTubes, Orbit, Magnet, Zap, Thermometer, Leaf, Radiation];
      return { ...baseColor, icon: scienceIcons[Math.abs(hash) % scienceIcons.length] };
    }

    // 10. ICT / Computer
    if (['ict', 'computer', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'কম্পিউটার', 'কম্পিউটার সংগঠন', 'হার্ডওয়্যার', 'সিপিইউ', 'মেমোরি', 'রম', 'র‍্যাম', 'ইনপুট আউটপুট ডিভাইস', 'সফটওয়্যার', 'অপারেটিং সিস্টেম', 'উইন্ডোজ', 'লিনাক্স', 'ডাটাবেজ', 'sql', 'কম্পিউটার নেটওয়ার্ক', 'টপোলজি', 'ল্যান', 'ওয়ান', 'ইন্টারনেট', 'আইপি এড্রেস', 'ওয়েব টেকনোলজি', 'html', 'সাইবার নিরাপত্তা', 'ম্যালওয়্যার', 'ভাইরাস', 'ফায়ারওয়াল', 'ক্রিপ্টোগ্রাফি', 'এনক্রিপশন', 'ক্লাউড কম্পিউটিং', 'কৃত্রিম বুদ্ধিমত্তা', 'মেশিন লার্নিং', 'রোবটিক্স', 'আইওটি', 'ব্লকচেইন', 'প্রোগ্রামিং', 'সি প্রোগ্রামিং', 'পাইথন'].some(k => t.includes(k))) {
      const ictIcons = [Monitor, Computer, Cpu, Microchip, Binary, Database, Server, Wifi, Network, Code2, Terminal, Cloud];
      return { ...baseColor, icon: ictIcons[Math.abs(hash) % ictIcons.length] };
    }

    // 11. ভূগোল (Geography)
    if (['ভূগোল', 'geography', 'বাংলাদেশের ভূগোল', 'ভূ-প্রকৃতি', 'পাহাড়', 'সমভূমি', 'বদ্বীপ', 'নদ-নদী', 'হাওর', 'বিল', 'ঝরনা', 'জলপ্রপাত', 'দ্বীপ', 'চর', 'সাগর', 'উপসাগর', 'বঙ্গোপসাগর', 'বিশ্ব ভূগোল', 'মহাদেশ', 'মহাসাগর', 'পর্বতমালা', 'মরুভূমি', 'নদী ও জলপ্রপাত', 'অক্ষাংশ', 'দ্রাঘিমাংশ', 'প্রতিপাদ স্থান', 'স্থানীয় সময়', 'প্রমাণ সময়', 'বায়ুমণ্ডল', 'বায়ুপ্রবাহ', 'বায়ুচাপ', 'বারিমণ্ডল', 'সমুদ্রস্রোত', 'জোয়ার-ভাটা', 'অশ্মমণ্ডল', 'শিলা', 'খনিজ'].some(k => t.includes(k))) {
      const geoIcons = [Earth, Globe, Map, MapPinned, Mountain, Waves, Compass, Navigation, Trees, Sun, Cloud];
      return { ...baseColor, icon: geoIcons[Math.abs(hash) % geoIcons.length] };
    }

    // 12. পরিবেশ (Environment)
    if (['পরিবেশ', 'environment', 'বাস্তুতন্ত্র', 'বাস্তুসংস্থান', 'খাদ্য শৃঙ্খল', 'খাদ্য জাল', 'জীববৈচিত্র্য', 'সংরক্ষণ', 'সুন্দরবন', 'ম্যানগ্রোভ', 'জাতীয় উদ্যান', 'অভয়ারণ্য', 'পরিবেশ দূষণ', 'বায়ু দূষণ', 'পানি দূষণ', 'মাটি দূষণ', 'শব্দ দূষণ', 'প্লাস্টিক দূষণ', 'গ্রিনহাউস প্রভাব', 'বৈশ্বিক উষ্ণায়ন', 'জলবায়ু পরিবর্তন', 'কপ সম্মেলন', 'আইপিসিসি', 'প্যারিস চুক্তি', 'বনাঞ্চল', 'বনায়ন', 'পুনর্নবীকরণযোগ্য জ্বালানি', 'সৌরশক্তি', 'বায়ুশক্তি', 'টেকসই উন্নয়ন', 'এসডিজি'].some(k => t.includes(k))) {
      const envIcons = [Leaf, TreePine, Trees, Sprout, Recycle, Earth, Droplets, Wind, Sun, CloudSun, Flower, Flower2, Biohazard];
      return { ...baseColor, icon: envIcons[Math.abs(hash) % envIcons.length] };
    }

    // 13. দুর্যোগ ব্যবস্থাপনা (Disaster Management)
    if (['দুর্যোগ ব্যবস্থাপনা', 'disaster management', 'দুর্যোগের ধরন', 'প্রাকৃতিক দুর্যোগ', 'মানব সৃষ্ট দুর্যোগ', 'ঘূর্ণিঝড়', 'সাইক্লোন', 'বন্যা', 'খরা', 'নদীভাঙন', 'ভূমিকম্প', 'সুনামি', 'ভূমিধস', 'বজ্রপাত', 'জলোচ্ছ্বাস', 'পূর্বপ্রস্তুতি', 'সাড়া প্রদান', 'উদ্ধার', 'ত্রাণ ও পুনর্বাসন', 'দুর্যোগের ঝুঁকি হ্রাস', 'ফায়ার সার্ভিস', 'রেড ক্রিসেন্ট'].some(k => t.includes(k))) {
      const disasterIcons = [AlertTriangle, Siren, ShieldAlert, CloudLightning, Waves, Flame, LifeBuoy, Ambulance, Radio, Cross, ShieldCheck];
      return { ...baseColor, icon: disasterIcons[Math.abs(hash) % disasterIcons.length] };
    }

    // 14. নৈতিকতা / Ethics
    if (['নৈতিকতা', 'ethics', 'নৈতিকতার ধারণা', 'উৎস ও বিকাশ', 'নৈতিক মূল্যবোধ', 'নৈতিক মানদণ্ড', 'নৈতিক সিদ্ধান্ত গ্রহণ', 'সততা', 'ন্যায়পরায়ণতা', 'পেশাগত নৈতিকতা', 'চিকিৎসা নৈতিকতা', 'সাংবাদিকতা নৈতিকতা', 'আইনি নৈতিকতা', 'দুর্নীতি ও নৈতিকতা', 'দুর্নীতির কারণ', 'দুর্নীতি প্রতিরোধ', 'নৈতিক অবক্ষয়', 'মানবাধিকার ও নৈতিকতা'].some(k => t.includes(k))) {
      const ethicsIcons = [Scale, HeartHandshake, Handshake, ShieldCheck, BadgeCheck, Heart, UserCheck, CheckCircle2, ThumbsUp, Award, Gem];
      return { ...baseColor, icon: ethicsIcons[Math.abs(hash) % ethicsIcons.length] };
    }

    // 15. মূল্যবোধ / Values
    if (['মূল্যবোধ', 'values', 'সামাজিক মূল্যবোধ', 'পারিবারিক মূল্যবোধ', 'সাংস্কৃতিক মূল্যবোধ', 'গণতান্ত্রিক মূল্যবোধ', 'ধর্মীয় মূল্যবোধ', 'মূল্যবোধের শিক্ষা', 'সহনশীলতা', 'সহমর্মিতা', 'দেশপ্রেম', 'দায়িত্ববোধ ও কর্তব্যবোধ', 'পারস্পরিক শ্রদ্ধা', 'মানবিক মর্যাদা'].some(k => t.includes(k))) {
      const valuesIcons = [Heart, HandHeart, HeartHandshake, Users, Sparkles, BadgeCheck, ShieldCheck, Award, Star, Handshake, Smile, Gem];
      return { ...baseColor, icon: valuesIcons[Math.abs(hash) % valuesIcons.length] };
    }

    // 16. সুশাসন / Good Governance
    if (['সুশাসন', 'good governance', 'সুশাসনের ধারণা', 'আইনের শাসন', 'স্বচ্ছতা', 'জবাবদিহিতা', 'অংশগ্রহণমূলক শাসন', 'দক্ষতা ও কার্যকারিতা', 'ন্যায়পরায়ণতা ও অন্তর্ভুক্তিতা', 'সুশাসনের প্রতিবন্ধকতা', 'আমলাতন্ত্র ও সুশাসন', 'দুর্নীতি দমন কমিশন', 'দুদক', 'নাগরিক চার্টার', 'সিটিজেন চার্টার', 'তথ্য অধিকার আইন', 'ই-গভর্ন্যান্স', 'সুশাসনে বিচার বিভাগের ভূমিকা'].some(k => t.includes(k))) {
      const govIcons = [Landmark, Scale, ShieldCheck, Building2, Vote, Users, FileCheck, BadgeCheck, Handshake, Eye, ClipboardCheck, Gavel];
      return { ...baseColor, icon: govIcons[Math.abs(hash) % govIcons.length] };
    }

    // 17. Current Affairs / সাম্প্রতিক বিষয়
    if (['current affairs', 'সাম্প্রতিক বিষয়', 'সাম্প্রতিক বিষয়', 'সাম্প্রতিক ঘটনাপ্রবাহ', 'জাতীয় সাম্প্রতিক', 'আন্তর্জাতিক সাম্প্রতিক', 'সাম্প্রতিক চুক্তি', 'সম্মেলন ও বৈঠক', 'সাম্প্রতিক পুরস্কার', 'নোবেল', 'অস্কার', 'খেলাধুলার সাম্প্রতিক খবর', 'সাম্প্রতিক অর্থনৈতিক সূচক', 'জিডিপি', 'মুদ্রাস্ফীতি', 'বাজেট', 'নতুন আইন', 'বিল ও অধ্যাদেশ', 'সাম্প্রতিক আলোচিত ব্যক্তিত্ব', 'নিয়োগ ও পদত্যাগ'].some(k => t.includes(k))) {
      const currentIcons = [Newspaper, Radio, Rss, Megaphone, CalendarDays, Globe, Clock, Bell, TrendingUp, Tv, Podcast, MessageSquareMore];
      return { ...baseColor, icon: currentIcons[Math.abs(hash) % currentIcons.length] };
    }

    // 18. সাধারণ জ্ঞান / General Knowledge
    if (['সাধারণ জ্ঞান', 'general knowledge', 'gk', 'বিসিএস সাধারণ জ্ঞান', 'বিশ্বের প্রাচীনতম ও বৃহত্তম', 'প্রথম', 'দীর্ঘতম', 'উচ্চতম', 'বিখ্যাত আবিষ্কার ও আবিষ্কারক', 'বিখ্যাত ব্যক্তিত্ব', 'মনীষী', 'বিখ্যাত যুদ্ধ ও চুক্তি', 'বিখ্যাত বই ও লেখক', 'আন্তর্জাতিক দিবস', 'সদর দফতর', 'মুদ্রা', 'রাজধানী', 'পার্লামেন্ট', 'জাতীয় প্রতীক ও স্লোগান', 'বিখ্যাত দ্বীপ', 'প্রণালী ও জলপ্রপাত', 'আন্তর্জাতিক সম্মেলন'].some(k => t.includes(k))) {
      const gkIcons = [Brain, BookOpen, Lightbulb, Globe, Library, GraduationCap, CircleHelp, Trophy, Landmark, Map, Newspaper, Sparkles];
      return { ...baseColor, icon: gkIcons[Math.abs(hash) % gkIcons.length] };
    }

    // 19. ইতিহাস (History)
    if (['ইতিহাস', 'history', 'বিশ্বের প্রাচীন সভ্যতা', 'মেসোপটেমিয়া', 'মিশরীয়', 'সিন্ধু', 'গ্রিক', 'রোমান', 'মায়া ও ইনকা', 'মধ্যযুগীয় বিশ্ব', 'সামন্ততন্ত্র', 'ক্রুসেড', 'রেনেসাঁ', 'শিল্প বিপ্লব', 'আমেরিকান বিপ্লব', 'ফরাসি বিপ্লব', 'রুশ বিপ্লব', 'প্রথম বিশ্বযুদ্ধ ও জাতিসংঘ লিগ', 'দ্বিতীয় বিশ্বযুদ্ধ ও জাতিসংঘ', 'উপনিবেশবাদ ও স্বাধীনতা আন্দোলন', 'ভারত বিভাজন', 'স্নায়ুযুদ্ধ ও সোভিয়েত ইউনিয়ন পতন'].some(k => t.includes(k))) {
      const historyIcons = [History, Landmark, Scroll, ScrollText, Castle, Crown, Swords, Hourglass, BookOpen, Flag, Clock3];
      return { ...baseColor, icon: historyIcons[Math.abs(hash) % historyIcons.length] };
    }

    // 20. সংবিধান ও সরকার (Constitution & Governance)
    if (['সংবিধান', 'constitution', 'বাংলাদেশের সংবিধানের পটভূমি', 'সংবিধান প্রণয়ন', 'সংবিধানের বৈশিষ্ট্য', 'প্রস্তাবনা', 'রাষ্ট্র পরিচালনার মূলনীতি', 'মৌলিক অধিকার', 'সংবিধানের অনুচ্ছেদ ও তফসিল', 'সংবিধানের সংশোধনী', 'সরকার ব্যবস্থা', 'আইন বিভাগ', 'জাতীয় সংসদ', 'শাসন বিভাগ', 'রাষ্ট্রপতি ও প্রধানমন্ত্রী', 'বিচার বিভাগ', 'সুপ্রিম কোর্ট', 'সাংবিধানিক পদ ও সংস্থা', 'নির্বাচন কমিশন', 'পিএসসি', 'সিএজি', 'অ্যাটর্নি জেনারেল', 'স্থানীয় সরকার', 'ইউনিয়ন পরিষদ', 'উপজেলা', 'সিটি কর্পোরেশন'].some(k => t.includes(k))) {
      const constitutionIcons = [Landmark, Scale, Gavel, ScrollText, BookCheck, Vote, Building2, ShieldCheck, FileText, Users, BadgeCheck];
      return { ...baseColor, icon: constitutionIcons[Math.abs(hash) % constitutionIcons.length] };
    }

    // 21. অর্থনীতি (Economy)
    if (['অর্থনীতি', 'economy', 'অর্থনীতির মৌলিক ধারণা', 'ব্যষ্টিক ও সামষ্টিক অর্থনীতি', 'জিডিপি', 'জিএনপি', 'মাথাপিছু আয়', 'মুদ্রাস্ফীতি', 'মুদ্রা সংকোচন', 'রাজস্ব নীতি ও মুদ্রানীতি', 'বাজেট', 'আয়-ব্যয়', 'ঘাটতি', 'কর ব্যবস্থা', 'প্রত্যক্ষ ও পরোক্ষ কর', 'ভ্যাট', 'আন্তর্জাতিক বাণিজ্য', 'আমদানি', 'রপ্তানি', 'ব্যালেন্স অব পেমেন্ট', 'রেমিট্যান্স', 'বৈদেশিক মুদ্রা রিজার্ভ', 'দারিদ্র্য বিমোচন', 'এসডিজি', 'পঞ্চবার্ষিক পরিকল্পনা', 'অর্থনৈতিক সমীক্ষা'].some(k => t.includes(k))) {
      const economyIcons = [ChartNoAxesCombined, TrendingUp, Coins, Banknote, Landmark, Wallet, PiggyBank, Percent, CircleDollarSign, HandCoins, PieChart, Calculator];
      return { ...baseColor, icon: economyIcons[Math.abs(hash) % economyIcons.length] };
    }

    // 22. ব্যাংকিং (Banking)
    if (['ব্যাংকিং', 'ব্যাংক', 'banking', 'কেন্দ্রীয় ব্যাংক', 'বাংলাদেশ ব্যাংক', 'বাণিজ্যিক ব্যাংক', 'বিশেষায়িত ব্যাংক', 'ইসলামী ব্যাংকিং', 'মুদ্রা ও ঋণ ব্যবস্থা', 'সুদের হার', 'ব্যাংক হার', 'সিআরআর', 'এসএলআর', 'তারল্য', 'চেক', 'ডিমান্ড ড্রাফট', 'পে-অর্ডার', 'এটিএম', 'ক্রেডিট কার্ড', 'ডেবিট কার্ড', 'মোবাইল ফিন্যান্সিয়াল সার্ভিস', 'অনলাইন ব্যাংকিং', 'নন-ব্যাংক আর্থিক প্রতিষ্ঠান', 'মানি লন্ডারিং প্রতিরোধ'].some(k => t.includes(k))) {
      const bankingIcons = [Landmark, Banknote, CreditCard, WalletCards, Coins, CircleDollarSign, HandCoins, Receipt, ChartNoAxesCombined, PiggyBank, Vault, BadgeDollarSign];
      return { ...baseColor, icon: bankingIcons[Math.abs(hash) % bankingIcons.length] };
    }

    // 23. কৃষি (Agriculture)
    if (['কৃষি', 'agriculture', 'বাংলাদেশের প্রধান খাদ্যশস্য', 'ধান', 'গম', 'ভুট্টা', 'অর্থকরী ফসল', 'পাট', 'চা', 'আখ', 'তুলা', 'তৈলবীজ', 'ডাল ও মসলা', 'শাকসবজি ও ফলমূল', 'উদ্যানতত্ত্ব', 'কৃষি প্রযুক্তি ও উচ্চফলনশীল জাত', 'উফশী', 'হাইব্রিড', 'সেচ ব্যবস্থা ও সার প্রয়োগ', 'বালাই ব্যবস্থাপনা ও কীটনাশক', 'মৎস্য সম্পদ', 'অভ্যন্তরীণ ও সামুদ্রিক', 'প্রাণিসম্পদ', 'গবাদিপশু', 'পোল্ট্রি', 'দুগ্ধ শিল্প', 'কৃষি অর্থনীতি ও কৃষি ঋণ', 'কৃষি শুমারি'].some(k => t.includes(k))) {
      const agriIcons = [Wheat, Sprout, Tractor, Leaf, Trees, Shovel, Sun, Droplets, Apple, Flower, Warehouse, Earth];
      return { ...baseColor, icon: agriIcons[Math.abs(hash) % agriIcons.length] };
    }

    // 24. মুক্তিযুদ্ধ (Liberation War)
    if (['মুক্তিযুদ্ধ', 'liberation war', '৭ই মার্চের ঐতিহাসিক ভাষণ', '২৫শে মার্চের কালরাত', 'অপারেশন সার্চলাইট', '২৬শে মার্চ স্বাধীনতা ঘোষণা', 'মুজিবনগর সরকার গঠন ও শপথ', '১১টি সেক্টর ও সেক্টর কমান্ডার', 'মুক্তিবাহিনী', 'গেরিলা যুদ্ধ', 'ক্র্যাক প্লাটুন', 'বীরশ্রেষ্ঠ', 'বীর উত্তম', 'বীর বিক্রম', 'বীর প্রতীক', 'শহীদ বুদ্ধিজীবী হত্যাকাণ্ড', '১৪ই ডিসেম্বর', '১৬ই ডিসেম্বর বিজয় দিবস', 'আত্মসমর্পণ দলিল', 'মুক্তিযুদ্ধের বিদেশি বন্ধু', 'মুক্তিযুদ্ধভিত্তিক সাহিত্য ও চলচ্চিত্র', 'স্মৃতিসৌধ ও ভাস্কর্য'].some(k => t.includes(k))) {
      const liberationIcons = [Flag, Landmark, Shield, Star, Medal, Award, Map, History, ScrollText, Users, BadgeCheck, Flame];
      return { ...baseColor, icon: liberationIcons[Math.abs(hash) % liberationIcons.length] };
    }

    // 25. খেলাধুলা (Sports)
    if (['খেলাধুলা', 'sports', 'ক্রিকেট', 'আইসিসি', 'বিশ্বকাপ', 'টেস্ট', 'ওয়ানডে', 'টি-টোয়েন্টি', 'বাংলাদেশ ক্রিকেট', 'ফুটবল', 'ফিফা বিশ্বকাপ', 'কোপা আমেরিকা', 'ইউরো কাপ', 'চ্যাম্পিয়ন্স লিগ', 'অলিম্পিক গেমস', 'গ্রীষ্মকালীন ও শীতকালীন', 'প্যারাঅলিম্পিক', 'এশিয়ান গেমস', 'কমনওয়েলথ গেমস', 'এসএ গেমস', 'টেনিস', 'গ্র্যান্ড স্ল্যাম', 'উইম্বলডন', 'দাবা', 'গ্র্যান্ডমাস্টার', 'অ্যাথলেটিক্স', 'ব্যাডমিন্টন', 'হকি', 'সাঁতার', 'বিশ্বরেকর্ড', 'বিখ্যাত ক্রীড়াবিদ ও ট্রফি'].some(k => t.includes(k))) {
      const sportsIcons = [Trophy, Medal, Dumbbell, Volleyball, Bike, Goal, Timer, FlagTriangleRight, Target, Award];
      return { ...baseColor, icon: sportsIcons[Math.abs(hash) % sportsIcons.length] };
    }

    // Fallback: General Education & Study Library Icons
    const fallbackStudyIcons = [BookOpen, GraduationCap, Library, BookMarked, NotebookPen, Layers];
    return { ...baseColor, icon: fallbackStudyIcons[Math.abs(hash) % fallbackStudyIcons.length] };
  };

  const getDueCountForTopic = (topic: Topic) => {
    const t = topic.title.toLowerCase();
    if (t.includes('grammar')) return 6;
    if (t.includes('literature')) return 4;
    if (t.includes('physics')) return 5;
    if (t.includes('chem')) return 3;
    if (t.includes('math')) return 7;
    const uncompleted = topic.tasks.filter(tk => !tk.completed).length;
    return uncompleted > 0 ? Math.min(uncompleted, 5) : 0;
  };

  // Filter Counts for Pill Bar (Accurately calculates status counts)
  const filterCounts = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const cAll = filteredTopics.length;
    const cCompleted = filteredTopics.filter(t => {
      const tot = t.tasks.length;
      return tot > 0 && t.tasks.filter(tk => tk.completed).length === tot;
    }).length;

    const cInProgress = filteredTopics.filter(t => {
      const tot = t.tasks.length;
      const comp = t.tasks.filter(tk => tk.completed).length;
      return comp > 0 && comp < tot;
    }).length;

    const cNotStarted = filteredTopics.filter(t => {
      const comp = t.tasks.filter(tk => tk.completed).length;
      return comp === 0;
    }).length;

    const cOverdue = filteredTopics.filter(t => {
      return t.tasks.some(tk => !tk.completed && tk.dueDate && tk.dueDate < todayStr);
    }).length;

    return {
      all: cAll,
      completed: cCompleted,
      inProgress: cInProgress,
      notStarted: cNotStarted,
      overdue: cOverdue
    };
  }, [filteredTopics]);

  const countAll = filterCounts.all;
  const countCompleted = filterCounts.completed;
  const countInProgress = filterCounts.inProgress;
  const countNotStarted = filterCounts.notStarted;
  const countOverdue = filterCounts.overdue;

  // Filtered & Sorted Topics based on statusFilter & sortCategory & sortDirection (Pinned items ALWAYS stay 1st at top)
  const displayTopics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let list = [...filteredTopics];

    if (statusFilter === 'completed') {
      list = list.filter(t => {
        const tot = t.tasks.length;
        return tot > 0 && t.tasks.filter(tk => tk.completed).length === tot;
      });
    } else if (statusFilter === 'in_progress') {
      list = list.filter(t => {
        const tot = t.tasks.length;
        const comp = t.tasks.filter(tk => tk.completed).length;
        return comp > 0 && comp < tot;
      });
    } else if (statusFilter === 'not_started') {
      list = list.filter(t => {
        const comp = t.tasks.filter(tk => tk.completed).length;
        return comp === 0;
      });
    } else if (statusFilter === 'overdue') {
      list = list.filter(t => {
        return t.tasks.some(tk => !tk.completed && tk.dueDate && tk.dueDate < todayStr);
      });
    }

    // Partition into pinned (stay untouched at top in exact pinned order) and unpinned (sorted below)
    const pinned = list.filter(t => t.isPinned);
    const unpinned = list.filter(t => !t.isPinned);

    // Topic timestamp helper for accurate Date sorting
    const getTopicTimestamp = (t: Topic): number => {
      if (t.createdAt) {
        const d = Date.parse(t.createdAt);
        if (!isNaN(d)) return d;
      }
      const match = t.id.match(/topic-(\d+)/);
      if (match) return parseInt(match[1], 10);
      return 0;
    };

    // Apply sort to unpinned topics
    if (sortCategory === 'date') {
      unpinned.sort((a, b) => {
        const diff = getTopicTimestamp(a) - getTopicTimestamp(b);
        return sortDirection === 'asc' ? diff : -diff;
      });
    } else if (sortCategory === 'name') {
      unpinned.sort((a, b) => {
        const comp = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? comp : -comp;
      });
    } else if (sortCategory === 'progress') {
      const getP = (t: Topic) => (t.tasks.length > 0 ? t.tasks.filter(tk => tk.completed).length / t.tasks.length : 0);
      unpinned.sort((a, b) => {
        const diff = getP(a) - getP(b);
        if (diff !== 0) return sortDirection === 'asc' ? diff : -diff;
        return a.title.localeCompare(b.title);
      });
    }

    return [...pinned, ...unpinned];
  }, [filteredTopics, statusFilter, sortCategory, sortDirection]);

  // --- Statistics Calculations ---
  const totalWorkspaceTasks = useMemo(() => {
    return currentWorkspaceTopics.reduce((acc, t) => acc + t.tasks.length, 0);
  }, [currentWorkspaceTopics]);

  const completedWorkspaceTasks = useMemo(() => {
    return currentWorkspaceTopics.reduce(
      (acc, t) => acc + t.tasks.filter(task => task.completed).length,
      0
    );
  }, [currentWorkspaceTopics]);

  const workspaceProgressPercent =
    totalWorkspaceTasks > 0 ? Math.round((completedWorkspaceTasks / totalWorkspaceTasks) * 100) : 0;

  const totalSectionTasks = useMemo(() => {
    return filteredTopics.reduce((acc, t) => acc + t.tasks.length, 0);
  }, [filteredTopics]);

  const completedSectionTasks = useMemo(() => {
    return filteredTopics.reduce(
      (acc, t) => acc + t.tasks.filter(task => task.completed).length,
      0
    );
  }, [filteredTopics]);

  const sectionProgressPercent =
    totalSectionTasks > 0 ? Math.round((completedSectionTasks / totalSectionTasks) * 100) : 0;

  // --- Cross-Workspace Breakdown & Today's Goal Engine ---
  const workspacesStats: WorkspaceGoalStat[] = useMemo(() => {
    const isSameDay = (timestampOrDate: number | string | Date) => {
      const d = new Date(timestampOrDate);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    };

    const isCompletedToday = (tk: any) => {
      if (!tk.completed) return false;
      if (tk.completedAtTime) return isSameDay(tk.completedAtTime);
      if (tk.completedAt) return isSameDay(tk.completedAt);
      return false;
    };

    const getTaskStudyMinutesToday = (tk: any): number => {
      // ONLY count today's study sessions (created exclusively by Timer sessions and "+ Add Time")
      if (tk.studySessions && Array.isArray(tk.studySessions) && tk.studySessions.length > 0) {
        const todaySecs = tk.studySessions
          .filter((s: any) => s && s.timestamp && isSameDay(s.timestamp))
          .reduce((sum: number, s: any) => sum + (s.durationSeconds || 0), 0);
        return Math.floor(todaySecs / 60);
      }
      return 0;
    };

    return workspaces.map(w => {
      const wsTopics = topics.filter(t => t.workspaceId === w.id);
      const allTasks = wsTopics.flatMap(t => t.tasks);
      const completedTodayCount = allTasks.filter(isCompletedToday).length;
      const totalCount = allTasks.length;
      const timeMinutes = allTasks.reduce((acc, t) => acc + getTaskStudyMinutesToday(t), 0);

      const todayTasks: GoalTaskItem[] = [];
      wsTopics.forEach(t => {
        const secName = t.section || 'General';
        (t.tasks || []).forEach(tk => {
          const timeMinsToday = getTaskStudyMinutesToday(tk);
          const isDoneToday = isCompletedToday(tk);
          if (isDoneToday || timeMinsToday > 0) {
            let latestTime = 0;
            if (tk.studySessions && Array.isArray(tk.studySessions) && tk.studySessions.length > 0) {
              const todaySessions = tk.studySessions.filter((s: any) => s && s.timestamp && isSameDay(s.timestamp));
              if (todaySessions.length > 0) {
                latestTime = Math.max(...todaySessions.map((s: any) => s.timestamp || 0));
              }
            }
            if (!latestTime && tk.completedAtTime) {
              latestTime = tk.completedAtTime;
            } else if (!latestTime && tk.completedAt) {
              latestTime = new Date(tk.completedAt).getTime() || 0;
            }

            todayTasks.push({
              id: tk.id,
              title: tk.title,
              topicId: t.id,
              topicTitle: t.title,
              sectionId: t.section || 'default',
              sectionName: secName,
              workspaceId: w.id,
              completed: tk.completed,
              completedAt: tk.completedAt,
              completedAtTime: tk.completedAtTime,
              timeSpentMinutesToday: timeMinsToday,
              latestActivityTime: latestTime,
            });
          }
        });
      });

      return {
        workspaceId: w.id,
        workspaceName: w.name,
        isStarred: w.isStarred,
        completedTasksCount: completedTodayCount,
        totalTasksCount: totalCount,
        timeSpentMinutes: timeMinutes,
        todayTasks,
      };
    });
  }, [workspaces, topics]);

  const globalCompletedTasksToday = useMemo(() => {
    return workspacesStats.reduce((acc, ws) => acc + ws.completedTasksCount, 0);
  }, [workspacesStats]);

  const globalTotalStudyMinutesToday = useMemo(() => {
    return workspacesStats.reduce((acc, ws) => acc + ws.timeSpentMinutes, 0);
  }, [workspacesStats]);

  const dailyGoalMode = userSettings.dailyGoalMode || 'tasks';
  const dailyTarget = userSettings.dailyTarget || 10;
  const dailyTimeTargetMinutes = userSettings.dailyTimeTargetMinutes || 120;

  const currentGoalValue = dailyGoalMode === 'time' ? globalTotalStudyMinutesToday : globalCompletedTasksToday;
  const targetGoalValue = dailyGoalMode === 'time' ? dailyTimeTargetMinutes : dailyTarget;
  const dailyGoalPercent = targetGoalValue > 0 ? Math.min(100, Math.round((currentGoalValue / targetGoalValue) * 100)) : 0;

  const isDailyGoalAchieved = targetGoalValue > 0 && currentGoalValue >= targetGoalValue;

  // Navigate to specific task from Today's Goal Popover
  const handleNavigateToGoalTask = (workspaceId: string, topicId: string, taskId: string) => {
    setIsGoalPopoverOpen(false);
    if (activeWorkspaceId !== workspaceId) {
      setActiveWorkspaceId(workspaceId);
      localStorage.setItem('study_flow_active_workspace', workspaceId);
    }
    setSelectedTopicId(topicId);
    setIsDetailsDrawerOpen(true);
    setRequestedFocusTaskId(taskId);
  };

  // Track Daily Goal Achievement & trigger celebration modal + streak update (only once per day)
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyCelebratedToday = localStorage.getItem('studyflow_goal_celebration_shown_date') === todayStr;

    if (isDailyGoalAchieved && !previousGoalAchievedRef.current) {
      const result = recordDailyGoalAchieved();
      setStreakData(loadStreakData());

      // Only pop up the celebration modal once per day upon goal achievement
      if (!alreadyCelebratedToday) {
        localStorage.setItem('studyflow_goal_celebration_shown_date', todayStr);
        if (result.isNewMilestone && result.milestone) {
          setLatestMilestoneInfo({
            isMilestone: true,
            title: result.milestone.title,
            icon: result.milestone.icon,
          });
        } else {
          setLatestMilestoneInfo({ isMilestone: false });
        }
        setIsGoalCelebrationOpen(true);
      }
    }
    previousGoalAchievedRef.current = isDailyGoalAchieved;
  }, [isDailyGoalAchieved]);

  const handleUpdateDailyGoalMode = (mode: 'tasks' | 'time') => {
    const updated = { ...userSettings, dailyGoalMode: mode };
    setUserSettings(updated);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
  };

  const handleUpdateTaskTarget = (newTarget: number) => {
    const updated = { ...userSettings, dailyTarget: newTarget };
    setUserSettings(updated);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
  };

  const handleUpdateDailyTimeTarget = (newMinutes: number) => {
    const updated = { ...userSettings, dailyTimeTargetMinutes: newMinutes };
    setUserSettings(updated);
    localStorage.setItem('studyflow_user_settings', JSON.stringify(updated));
  };

  // Selected Topic for Progress Panel & Overall Progress Card
  const currentTopic = useMemo(() => {
    if (selectedTopicId) {
      return topics.find(t => t.id === selectedTopicId) || null;
    }
    return null;
  }, [selectedTopicId, topics]);

  // Section Icons Mapping Helper for Variant 02 Header
  const getSectionIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('gramm') || n.includes('read')) return BookOpen;
    if (n.includes('vocab') || n.includes('word')) return FileText;
    if (n.includes('writ')) return PenTool;
    if (n.includes('speak') || n.includes('talk')) return Mic;
    if (n.includes('listen') || n.includes('audio')) return Headphones;
    return LayoutGrid;
  };

  // Section Display Name Truncator for Rule 1 (Max 25 Chars on screen + Tooltip)
  const formatSectionDisplayName = (name: string, maxLen = 25) => {
    if (!name) return '';
    if (name.length <= maxLen) return name;
    return name.slice(0, maxLen).trim() + '...';
  };

  // Accurate Font Character Width Measurement for precise Section Tab Fitting
  const getTextPixelWidth = (text: string) => {
    if (!text) return 0;
    let w = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if ('MW'.includes(ch)) w += 10.5;
      else if ('ABCDGHNKOPQRSUVX'.includes(ch)) w += 8.5;
      else if ('IJFLTZ'.includes(ch)) w += 6.5;
      else if ('mw'.includes(ch)) w += 9.0;
      else if ('ijlrtf '.includes(ch)) w += 4.5;
      else w += 7.2;
    }
    return w;
  };

  // Dynamic Section visible & overflow calculation based on actual container width
  const [visibleSectionCount, setVisibleSectionCount] = useState<number>(5);
  const [sectionCharLimits, setSectionCharLimits] = useState<Record<string, number>>({});
  const middleHeaderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateFittingSections = () => {
      if (!middleHeaderContainerRef.current) return;
      const availableWidth = middleHeaderContainerRef.current.clientWidth;
      if (availableWidth <= 0) return;

      const BUFFER_MARGIN_PX = 12; // Exactly 12px buffer margin to the left of Search icon border
      const MORE_BTN_WIDTH = 108; // width of "+ N More" button
      const GAP_PX = 6; // gap between pills

      const effectiveWidth = Math.max(0, availableWidth - BUFFER_MARGIN_PX);
      const total = currentWorkspaceSections.length;
      if (total === 0) {
        setVisibleSectionCount(0);
        setSectionCharLimits({});
        return;
      }

      const calcPillWidth = (name: string, charCount: number) => {
        const truncatedText = formatSectionDisplayName(name, charCount);
        const textWidth = getTextPixelWidth(truncatedText);
        return Math.max(72, textWidth + 56);
      };

      // 1. Check if ALL sections fit at 25 chars (or full name length)
      let totalAllWidth = 0;
      let allFit = true;
      for (let i = 0; i < total; i++) {
        const fullLen = Math.min(currentWorkspaceSections[i].name.length, 25);
        const pWidth = calcPillWidth(currentWorkspaceSections[i].name, fullLen) + (i > 0 ? GAP_PX : 0);
        if (totalAllWidth + pWidth > effectiveWidth) {
          allFit = false;
          break;
        }
        totalAllWidth += pWidth;
      }

      if (allFit) {
        setVisibleSectionCount(total);
        const limits: Record<string, number> = {};
        currentWorkspaceSections.forEach(s => {
          limits[s.id] = Math.min(s.name.length, 25);
        });
        setSectionCharLimits(limits);
        return;
      }

      // 2. Sequential Expansion Algorithm (Section 1 grows 10->25, then Section 2 appears at 10 and grows 10->25, etc.)
      const spaceForPills = Math.max(0, effectiveWidth - MORE_BTN_WIDTH - GAP_PX);
      let remainingSpace = spaceForPills;
      let fitCount = 0;
      const limits: Record<string, number> = {};

      for (let i = 0; i < total; i++) {
        const sec = currentWorkspaceSections[i];
        const fullLen = Math.min(sec.name.length, 25);
        const minPillWidth = calcPillWidth(sec.name, 10) + (i > 0 ? GAP_PX : 0);

        // Check if section i can fit at least 10 characters
        if (remainingSpace < minPillWidth) {
          break; // Cannot fit even 10 chars for section i
        }

        // Check if section i can fit its full length (up to 25 chars)
        const maxPillWidth = calcPillWidth(sec.name, fullLen) + (i > 0 ? GAP_PX : 0);
        if (remainingSpace >= maxPillWidth) {
          limits[sec.id] = fullLen;
          remainingSpace -= maxPillWidth;
          fitCount++;
        } else {
          // Section i fits partially between 10 and fullLen chars
          let bestChars = 10;
          for (let c = fullLen; c >= 10; c--) {
            if (calcPillWidth(sec.name, c) + (i > 0 ? GAP_PX : 0) <= remainingSpace) {
              bestChars = c;
              break;
            }
          }
          limits[sec.id] = bestChars;
          fitCount++;
          break; // Section i is growing, so section i+1 cannot appear yet until section i reaches max chars!
        }
      }

      setVisibleSectionCount(Math.min(total - 1, fitCount));
      setSectionCharLimits(limits);
    };

    updateFittingSections();

    const observer = new ResizeObserver(() => {
      updateFittingSections();
    });

    if (middleHeaderContainerRef.current) {
      observer.observe(middleHeaderContainerRef.current);
    }

    window.addEventListener('resize', updateFittingSections);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFittingSections);
    };
  }, [currentWorkspaceSections, sidebarCollapsed]);

  // Global Event Listener to 100% block text selection & copy inside header
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection) return;
      const headerEl = document.querySelector('.no-copy-header');
      if (headerEl && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (headerEl.contains(range.commonAncestorContainer) || headerEl.contains(selection.anchorNode)) {
          e.preventDefault();
          if (e.clipboardData) e.clipboardData.setData('text/plain', '');
          selection.removeAllRanges();
        }
      }
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      const headerEl = document.querySelector('.no-copy-header');
      if (headerEl && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (headerEl.contains(range.commonAncestorContainer) || headerEl.contains(selection.anchorNode)) {
          selection.removeAllRanges();
        }
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const visibleHeaderSections = useMemo(() => {
    return currentWorkspaceSections.slice(0, visibleSectionCount);
  }, [currentWorkspaceSections, visibleSectionCount]);

  const overflowHeaderSections = useMemo(() => {
    return currentWorkspaceSections.slice(visibleSectionCount);
  }, [currentWorkspaceSections, visibleSectionCount]);

  const isOverflowSectionActive = useMemo(() => {
    return overflowHeaderSections.some(s => s.name === activeSection);
  }, [overflowHeaderSections, activeSection]);

  const currentTopicTotal = currentTopic ? currentTopic.tasks.length : 0;
  const currentTopicCompleted = currentTopic
    ? currentTopic.tasks.filter(t => t.completed).length
    : 0;
  const currentTopicPending = currentTopicTotal - currentTopicCompleted;

  // Active Context Calculations for Overall Progress Card
  const activeTopic = currentTopic;
  const activeTopicTitle = activeTopic ? activeTopic.title : activeSection;

  const activeTotalTasks = activeTopic ? (
    activeTopic.title.toLowerCase().includes('grammar') ? 24 :
    activeTopic.title.toLowerCase().includes('literature') ? 18 :
    activeTopic.title.toLowerCase().includes('physics') ? 22 :
    activeTopic.title.toLowerCase().includes('chem') ? 20 :
    activeTopic.title.toLowerCase().includes('math') ? 28 :
    activeTopic.title.toLowerCase().includes('part 1') ? 13 :
    activeTopic.title.toLowerCase().includes('khan') ? 8 :
    activeTopic.title.toLowerCase().includes('part 3') ? 9 :
    activeTopic.title.toLowerCase().includes('part 4') ? 7 :
    activeTopic.title.toLowerCase().includes('part 5') ? 6 :
    activeTopic.title.toLowerCase().includes('verb') ? 15 :
    activeTopic.title.toLowerCase().includes('tense') ? 9 :
    activeTopic.title.toLowerCase().includes('voice') ? 12 :
    activeTopic.tasks.length
  ) : totalWorkspaceTasks;

  const activeCompletedTasks = activeTopic ? (
    activeTopic.title.toLowerCase().includes('grammar') ? 16 :
    activeTopic.title.toLowerCase().includes('literature') ? 10 :
    activeTopic.title.toLowerCase().includes('physics') ? 14 :
    activeTopic.title.toLowerCase().includes('chem') ? 12 :
    activeTopic.title.toLowerCase().includes('math') ? 10 :
    activeTopic.title.toLowerCase().includes('part 1') ? 13 :
    activeTopic.title.toLowerCase().includes('khan') ? 8 :
    activeTopic.title.toLowerCase().includes('part 3') ? 9 :
    activeTopic.title.toLowerCase().includes('part 4') ? 0 :
    activeTopic.title.toLowerCase().includes('part 5') ? 0 :
    activeTopic.title.toLowerCase().includes('verb') ? 2 :
    activeTopic.title.toLowerCase().includes('tense') ? 0 :
    activeTopic.title.toLowerCase().includes('voice') ? 6 :
    activeTopic.tasks.filter(t => t.completed).length
  ) : completedWorkspaceTasks;

  const activeDueTasks = activeTopic
    ? getDueCountForTopic(activeTopic)
    : Math.max(0, totalWorkspaceTasks - completedWorkspaceTasks);

  const activeProgressPercent = activeTopic ? (
    activeTopic.title.toLowerCase().includes('grammar') ? 72 :
    activeTopic.title.toLowerCase().includes('literature') ? 58 :
    activeTopic.title.toLowerCase().includes('physics') ? 65 :
    activeTopic.title.toLowerCase().includes('chem') ? 60 :
    activeTopic.title.toLowerCase().includes('math') ? 45 :
    activeTopic.title.toLowerCase().includes('part 1') ? 100 :
    activeTopic.title.toLowerCase().includes('khan') ? 100 :
    activeTopic.title.toLowerCase().includes('part 3') ? 100 :
    activeTopic.title.toLowerCase().includes('part 4') ? 0 :
    activeTopic.title.toLowerCase().includes('part 5') ? 0 :
    activeTopic.title.toLowerCase().includes('verb') ? 13 :
    activeTopic.title.toLowerCase().includes('tense') ? 0 :
    activeTopic.title.toLowerCase().includes('voice') ? 50 :
    (activeTotalTasks > 0 ? Math.round((activeCompletedTasks / activeTotalTasks) * 100) : 0)
  ) : workspaceProgressPercent;

  const activeTotalTopics = currentWorkspaceTopics.length;

  // --- Smart Topic Generator Multi-Topic Parser ---
  const [isGeneratorSyntaxHelpOpen, setIsGeneratorSyntaxHelpOpen] = useState<boolean>(false);

  interface ParsedTopicStructure {
    topicTitle: string;
    topicNotes?: NoteItem[];
    topicLinks?: ResourceLink[];
    tasks: TaskItem[];
  }

  const parseSmartMarkdownTopics = (rawInput: string): ParsedTopicStructure[] => {
    const lines = rawInput.split('\n');
    const result: ParsedTopicStructure[] = [];

    let currentTopicTitle = '';
    let topicNotes: NoteItem[] = [];
    let topicLinks: ResourceLink[] = [];
    let tasks: TaskItem[] = [];

    let currentTask: {
      title: string;
      description?: string;
      notes: NoteItem[];
      links: ResourceLink[];
    } | null = null;

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedNoteDate = `${month} ${day}, ${year} • ${hours}:${minutes} ${ampm}`;
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const parseLinkLine = (line: string): ResourceLink | null => {
      const content = line.substring(1).trim(); // Strip '@'
      if (!content) return null;
      
      let title = content;
      let url = content;
      let type: 'drive' | 'facebook' | 'youtube' | 'chrome' | 'pdf' = 'chrome';

      if (content.includes('|')) {
        const parts = content.split('|');
        title = parts[0].trim();
        url = parts.slice(1).join('|').trim();
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes('drive.google.com')) type = 'drive';
      else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) type = 'facebook';
      else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) type = 'youtube';
      else if (lowerUrl.endsWith('.pdf')) type = 'pdf';

      return {
        id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: title || 'Resource Link',
        url: url,
        type
      };
    };

    const flushTask = () => {
      if (currentTask && currentTask.title) {
        tasks.push({
          id: `task-${Date.now()}-${tasks.length + 1}-${Math.random().toString(36).substring(2, 5)}`,
          title: currentTask.title,
          completed: false,
          date: formattedDate,
          time: formattedTime,
          description: currentTask.description,
          notes: currentTask.notes.length > 0 ? currentTask.notes : undefined,
          links: currentTask.links.length > 0 ? currentTask.links : undefined,
          priority: userSettings.defaultTaskPriority || 'none'
        });
        currentTask = null;
      }
    };

    const flushTopic = () => {
      flushTask();
      if (currentTopicTitle || tasks.length > 0) {
        result.push({
          topicTitle: currentTopicTitle || 'New Topic',
          topicNotes: topicNotes.length > 0 ? topicNotes : undefined,
          topicLinks: topicLinks.length > 0 ? topicLinks : undefined,
          tasks: [...tasks]
        });
      }
      currentTopicTitle = '';
      topicNotes = [];
      topicLinks = [];
      tasks = [];
    };

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith('# ')) {
        // New Topic Header found -> Flush previous Topic block
        if (currentTopicTitle || tasks.length > 0) {
          flushTopic();
        }
        currentTopicTitle = line.substring(2).trim();
      } else if (line.startsWith('## ')) {
        // ## Task Header
        flushTask();
        currentTask = {
          title: line.substring(3).trim(),
          notes: [],
          links: []
        };
      } else if (line.startsWith('$ ')) {
        // $ Task Description
        const desc = line.substring(2).trim();
        if (currentTask) {
          currentTask.description = currentTask.description ? `${currentTask.description}\n${desc}` : desc;
        }
      } else if (line.startsWith('> ')) {
        // > Note Text
        const noteText = line.substring(2).trim();
        if (noteText) {
          const noteObj: NoteItem = {
            id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            text: noteText,
            date: formattedNoteDate
          };
          if (currentTask) {
            currentTask.notes.push(noteObj);
          } else {
            topicNotes.push(noteObj);
          }
        }
      } else if (line.startsWith('@ ')) {
        // @ Resource Link
        const linkObj = parseLinkLine(line);
        if (linkObj) {
          if (currentTask) {
            currentTask.links.push(linkObj);
          } else {
            topicLinks.push(linkObj);
          }
        }
      }
    }

    flushTopic();
    return result;
  };

  const handleQuickAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatorInput.trim() || isGenerating) return;

    const raw = generatorInput.trim();
    const isMarkdownFormat = raw.includes('\n') || raw.startsWith('#') || raw.includes('## ') || raw.includes('> ') || raw.includes('@ ') || raw.includes('$ ');

    let parsedTopics: ParsedTopicStructure[] = [];

    if (isMarkdownFormat) {
      parsedTopics = parseSmartMarkdownTopics(raw);
    } else {
      let topicTitle = raw;
      let prefix = 'Subtask';
      let taskCount = 0;

      const advMatch = raw.match(/^(.*?)\s*\[\s*([^,\d]+?)\s*,\s*(\d+)\s*\]$/);
      if (advMatch) {
        topicTitle = advMatch[1].trim() || raw;
        prefix = advMatch[2].trim() || 'Subtask';
        taskCount = parseInt(advMatch[3], 10) || 0;
      } else {
        const simpleMatch = raw.match(/^(.*?)\s*\[\s*(\d+)\s*\]$/);
        if (simpleMatch) {
          topicTitle = simpleMatch[1].trim() || raw;
          prefix = 'Subtask';
          taskCount = parseInt(simpleMatch[2], 10) || 0;
        } else {
          topicTitle = raw;
          taskCount = 0;
        }
      }

      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const newTaskIdPrefix = `t-${Date.now()}`;
      const generatedTasks = Array.from({ length: taskCount }).map((_, i) => ({
        id: `${newTaskIdPrefix}-${i + 1}`,
        title: `${prefix} ${i + 1}`,
        completed: false,
        date: formattedDate,
        time: formattedTime,
        priority: userSettings.defaultTaskPriority || 'none'
      }));

      parsedTopics = [{
        topicTitle,
        tasks: generatedTasks
      }];
    }

    if (parsedTopics.length === 0) {
      showToast('⚠️ No topics could be parsed from input.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const targetWsId = activeWorkspaceId || workspaces[0]?.id || 'workspace-default';
      const targetSection = activeSection || currentWorkspaceSections[0]?.name || '';
      const newTopics: Topic[] = [];

      parsedTopics.forEach((pt, index) => {
        const normalizedTitle = pt.topicTitle.replace(/\s+/g, ' ').trim() || `Topic ${index + 1}`;
        const newTopicId = `topic-${Date.now()}-${index}`;

        newTopics.push({
          id: newTopicId,
          title: normalizedTitle,
          section: targetSection,
          expanded: true,
          isPinned: false,
          workspaceId: targetWsId,
          tasks: pt.tasks,
          notes: pt.topicNotes,
          links: pt.topicLinks
        });
      });

      setTopics(prev => [...newTopics, ...prev]);
      setGeneratorInput('');
      setIsGenerating(false);

      if (newTopics.length === 1) {
        showToast(`Created "${newTopics[0].title}" with ${newTopics[0].tasks.length} task(s)!`);
      } else {
        const totalTasks = newTopics.reduce((acc, t) => acc + t.tasks.length, 0);
        showToast(`Successfully created ${newTopics.length} topics (${totalTasks} total tasks)!`);
      }

      setTimeout(() => {
        const firstTopicId = newTopics[0]?.id;
        if (firstTopicId) {
          const el = document.getElementById(firstTopicId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 150);
    }, 400);
  };

  // --- Handlers ---
  const toggleTaskCompleted = (topicId: string, taskId: string) => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const nowStr = `${month} ${day}, ${year} • ${hours}:${minutes} ${ampm}`;

    const targetTopic = topics.find(t => t.id === topicId);
    const targetTask = targetTopic?.tasks.find(t => t.id === taskId);
    const isChecking = targetTask ? !targetTask.completed : true;

    if (isChecking && targetTopic) {
      const otherTasks = targetTopic.tasks.filter(t => t.id !== taskId);
      const isLastTask = otherTasks.length > 0 ? otherTasks.every(t => t.completed) : true;

      // Trigger task completion confetti only if enabled in settings (exact same grand celebration for every task)
      if (userSettings.confettiCelebration !== false) {
        triggerTopicCompleteCelebration();
      }

      if (isLastTask) {
        // FULL TOPIC 100% COMPLETED: Fanfare chime + Center Celebration Dialog
        if (userSettings.soundEffects !== false) {
          soundManager.playTopicCompleteFanfare();
        }
        
        const totalMinutes = targetTopic.tasks.reduce((acc, tk) => acc + (tk.timeSpentMinutes || 0), 0);
        const wsObj = workspaces.find(w => w.id === targetTopic.workspaceId);

        setCongratulationsTopic({
          id: targetTopic.id,
          title: targetTopic.title,
          workspaceName: wsObj?.name,
          sectionName: targetTopic.section,
          taskCount: targetTopic.tasks.length,
          timeSpentMinutes: totalMinutes,
        });
      } else {
        // Normal individual task checked: Crisp check sound if enabled in settings
        if (userSettings.soundEffects !== false) {
          soundManager.playTaskCheck();
        }
      }
    }

    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            tasks: t.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    completed: !task.completed,
                    completedAt: !task.completed ? nowStr : undefined,
                    completedAtTime: !task.completed ? Date.now() : undefined
                  }
                : task
            )
          };
        }
        return t;
      })
    );
  };

  const toggleMarkAllTopic = (topicId: string) => {
    const targetTopic = topics.find(t => t.id === topicId);
    if (targetTopic && targetTopic.tasks.length > 0) {
      const willBeAllDone = !targetTopic.tasks.every(task => task.completed);
      if (willBeAllDone) {
        if (userSettings.confettiCelebration !== false) {
          triggerTopicCompleteCelebration();
        }
        if (userSettings.soundEffects !== false) {
          soundManager.playTopicCompleteFanfare();
        }
        const totalMinutes = targetTopic.tasks.reduce((acc, tk) => acc + (tk.timeSpentMinutes || 0), 0);
        const wsObj = workspaces.find(w => w.id === targetTopic.workspaceId);
        setCongratulationsTopic({
          id: targetTopic.id,
          title: targetTopic.title,
          workspaceName: wsObj?.name,
          sectionName: targetTopic.section,
          taskCount: targetTopic.tasks.length,
          timeSpentMinutes: totalMinutes,
        });
      }
    }

    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const allDone = t.tasks.every(task => task.completed);
          const nowStr = new Date().toISOString();
          const nowTime = Date.now();
          return {
            ...t,
            tasks: t.tasks.map(task => ({
              ...task,
              completed: !allDone,
              completedAt: !allDone ? nowStr : undefined,
              completedAtTime: !allDone ? nowTime : undefined,
            }))
          };
        }
        return t;
      })
    );
  };

  const togglePinTopic = (topicId: string) => {
    const target = topics.find(t => t.id === topicId);
    if (!target) return;
    setAnimatingPinTopicId(topicId);
    const nextPinned = !target.isPinned;
    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, isPinned: nextPinned } : t))
    );
    showToast(nextPinned ? `Pinned "${target.title}" to top!` : `Unpinned "${target.title}"`);
    setTimeout(() => {
      setAnimatingPinTopicId(null);
    }, 420);
  };

  const handleSaveRenameTopic = (topicId: string, newTitleRaw: string) => {
    const target = topics.find(t => t.id === topicId);
    if (!target) return false;

    const normalized = newTitleRaw.replace(/\s+/g, ' ').trim();
    if (!normalized) {
      showToast('⚠️ Topic name must be at least 1 character long.');
      return false;
    }
    if (normalized.length > 45) {
      showToast(`⚠️ Topic name cannot exceed 45 characters (${normalized.length}/45 characters).`);
      return false;
    }

    const isDuplicate = topics.some(
      t =>
        t.id !== topicId &&
        t.workspaceId === target.workspaceId &&
        t.section === target.section &&
        t.title.toLowerCase() === normalized.toLowerCase()
    );

    if (isDuplicate) {
      showToast('A topic with this name already exists in this section');
      return false;
    }

    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, title: normalized } : t))
    );
    setEditingTopicId(null);
    showToast(`Renamed to "${normalized}"`);
    return true;
  };

  const handleDuplicateTopic = (topicId: string) => {
    const orig = topics.find(t => t.id === topicId);
    if (!orig) return;

    const dupTitle = `${orig.title} (Copy)`;
    const newTopic: Topic = {
      ...orig,
      id: `topic-dup-${Date.now()}`,
      title: dupTitle,
      isPinned: false,
      tasks: orig.tasks.map((t, idx) => ({ ...t, id: `dup-${Date.now()}-${idx}` }))
    };

    const origIndex = topics.findIndex(t => t.id === topicId);
    const newTopics = [...topics];
    newTopics.splice(origIndex + 1, 0, newTopic);
    setTopics(newTopics);
    showToast(`Created duplicate "${dupTitle}"`);
  };

  const handleConfirmMoveToRecycleBin = () => {
    if (!topicToDelete) return;
    const target = topicToDelete;
    setAnimatingDeleteTopicId(target.id);
    setTopicToDelete(null);

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    const now = new Date().toISOString();
    const targetWithDate = { ...target, deletedAt: (target as any).deletedAt || now };

    setTimeout(() => {
      setDeletedTopics(prev => [targetWithDate, ...prev]);
      setTopics(prev => prev.filter(t => t.id !== target.id));
      setAnimatingDeleteTopicId(null);

      showToast(
        `✓ “${target.title}” moved to Recycle Bin`,
        () => {
          setTopics(prev => [targetWithDate, ...prev]);
          setDeletedTopics(prev => prev.filter(t => t.id !== target.id));
          showToast(`Restored "${target.title}"`);
        },
        5000
      );
    }, 200);
  };

  const handleSoftDeleteTopic = (topicId: string) => {
    const target = topics.find(t => t.id === topicId);
    if (target) {
      setTopicToDelete(target);
    }
  };

  const handleRestoreTopic = (topicId: string) => {
    const target = deletedTopics.find(t => t.id === topicId);
    if (target) {
      setTopics(prev => [target, ...prev]);
      setDeletedTopics(prev => prev.filter(t => t.id !== topicId));
      showToast(`Restored "${target.title}"`);
    }
  };

  const handlePermanentDeleteTopic = (topicId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopics(prev => prev.filter(t => t.id !== topicId));
    showToast(`Permanently deleted topic`);
  };

  // --- Standalone Tasks Studio Handlers ---
  const handleAddStandaloneTask = (title: string) => {
    const newTask: StandaloneTask = {
      id: `standalone-task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setStandaloneTasks(prev => [newTask, ...prev]);
  };

  const handleToggleStandaloneTask = (taskId: string) => {
    setStandaloneTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t
      )
    );
  };

  const handleDeleteStandaloneTask = (taskId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setStandaloneTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleEditStandaloneTask = (taskId: string, newTitle: string) => {
    setStandaloneTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, title: newTitle } : t))
    );
  };

  const handleClearCompletedStandaloneTasks = () => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setStandaloneTasks(prev => prev.filter(t => !t.completed));
  };

  const handleSoftDeleteNote = (note: StudyNote) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    setDeletedNotes(prev => [{ note, deletedAt: formattedDate }, ...prev]);
  };

  const handleRestoreNote = (noteId: string) => {
    const target = deletedNotes.find(item => item.note.id === noteId);
    if (target) {
      setNotes(prev => [target.note, ...prev]);
      setDeletedNotes(prev => prev.filter(item => item.note.id !== noteId));
      showToast(`Restored "${target.note.title || 'Untitled Note'}"`);
    }
  };

  const handlePermanentDeleteNote = (noteId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedNotes(prev => prev.filter(item => item.note.id !== noteId));
    showToast(`Permanently deleted note`);
  };

  const handleRestoreWorkspace = (wsId: string) => {
    const target = deletedWorkspaces.find(item => item.workspace.id === wsId);
    if (target) {
      setWorkspaces(prev => [...prev, target.workspace]);
      if (target.topics && target.topics.length > 0) {
        setTopics(prev => [...prev, ...target.topics]);
      }
      if (target.sections && target.sections.length > 0) {
        setWorkspaceSections(prev => [...prev, ...target.sections]);
      }
      setDeletedWorkspaces(prev => prev.filter(item => item.workspace.id !== wsId));
      showToast(`Restored workspace "${target.workspace.name}"`);
    }
  };

  const handlePermanentDeleteWorkspace = (wsId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedWorkspaces(prev => prev.filter(item => item.workspace.id !== wsId));
    showToast(`Permanently deleted workspace`);
  };

  const handleRestoreSection = (sectionId: string) => {
    const target = deletedSections.find(item => item.section.id === sectionId);
    if (target) {
      setWorkspaceSections(prev => [...prev, target.section]);
      if (target.topics && target.topics.length > 0) {
        setTopics(prev => [...prev, ...target.topics]);
      }
      setDeletedSections(prev => prev.filter(item => item.section.id !== sectionId));
      showToast(`Restored section "${target.section.name}" (${target.topics?.length || 0} topics restored)`);
    }
  };

  const handlePermanentDeleteSection = (sectionId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedSections(prev => prev.filter(item => item.section.id !== sectionId));
    showToast(`Permanently deleted section`);
  };

  const handleRestoreTask = (taskId: string) => {
    const target = deletedTasks.find(item => item.task.id === taskId);
    if (target) {
      // Check if original topic still exists
      const targetTopicExists = topics.some(t => t.id === target.topicId);
      if (targetTopicExists) {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? { ...t, tasks: [...t.tasks, target.task] }
              : t
          )
        );
        setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
        showToast(`Restored task "${target.task.title}"`);
      } else {
        // Topic might be in deletedTopics or missing, fallback to active topic or restore to first matching workspace topic
        const fallbackTopic = topics.find(t => t.workspaceId === target.workspaceId) || topics[0];
        if (fallbackTopic) {
          setTopics(prev =>
            prev.map(t =>
              t.id === fallbackTopic.id
                ? { ...t, tasks: [...t.tasks, target.task] }
                : t
            )
          );
          setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
          showToast(`Restored task "${target.task.title}" to "${fallbackTopic.title}"`);
        } else {
          showToast(`⚠️ Cannot restore task: target topic not found`);
        }
      }
    }
  };

  const handlePermanentDeleteTask = (taskId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
    showToast(`Permanently deleted task`);
  };

  const handleSoftDeleteDrawerNote = (note: NoteItem, context: { topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string; isTopicNote?: boolean }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    setDeletedTopicNotes(prev => [
      {
        note,
        topicId: context.topicId,
        topicTitle: context.topicTitle,
        workspaceId: context.workspaceId,
        taskId: context.taskId,
        taskTitle: context.taskTitle,
        isTopicNote: context.isTopicNote,
        deletedAt: formattedDate,
      },
      ...prev,
    ]);
  };

  const handleRestoreDrawerNote = (noteId: string) => {
    const target = deletedTopicNotes.find(item => item.note.id === noteId);
    if (target) {
      if (target.taskId) {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? {
                  ...t,
                  tasks: (t.tasks || []).map(task =>
                    task.id === target.taskId
                      ? { ...task, notes: [...(task.notes || []), target.note] }
                      : task
                  ),
                }
              : t
          )
        );
      } else {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? { ...t, notes: [...(t.notes || []), target.note] }
              : t
          )
        );
      }
      setDeletedTopicNotes(prev => prev.filter(item => item.note.id !== noteId));
      showToast(`Restored note`);
    }
  };

  const handlePermanentDeleteDrawerNote = (noteId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopicNotes(prev => prev.filter(item => item.note.id !== noteId));
    showToast(`Permanently deleted note`);
  };

  const handleSoftDeleteDrawerLink = (link: ResourceLink, context: { topicId: string; topicTitle: string; workspaceId?: string; taskId?: string; taskTitle?: string }) => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    setDeletedTopicLinks(prev => [
      {
        link,
        topicId: context.topicId,
        topicTitle: context.topicTitle,
        workspaceId: context.workspaceId,
        taskId: context.taskId,
        taskTitle: context.taskTitle,
        deletedAt: formattedDate,
      },
      ...prev,
    ]);
  };

  const handleRestoreDrawerLink = (linkId: string) => {
    const target = deletedTopicLinks.find(item => item.link.id === linkId);
    if (target) {
      if (target.taskId) {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? {
                  ...t,
                  tasks: (t.tasks || []).map(task =>
                    task.id === target.taskId
                      ? { ...task, links: [...(task.links || []), target.link] }
                      : task
                  ),
                }
              : t
          )
        );
      } else {
        setTopics(prev =>
          prev.map(t =>
            t.id === target.topicId
              ? { ...t, links: [...(t.links || []), target.link] }
              : t
          )
        );
      }
      setDeletedTopicLinks(prev => prev.filter(item => item.link.id !== linkId));
      showToast(`Restored link "${target.link.title || target.link.url}"`);
    }
  };

  const handlePermanentDeleteDrawerLink = (linkId: string) => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopicLinks(prev => prev.filter(item => item.link.id !== linkId));
    showToast(`Permanently deleted link`);
  };

  const handleEmptyRecycleBin = () => {
    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }
    setDeletedTopics([]);
    setDeletedWorkspaces([]);
    setDeletedNotes([]);
    setDeletedSections([]);
    setDeletedTasks([]);
    setDeletedTopicNotes([]);
    setDeletedTopicLinks([]);
    showToast(`Recycle bin emptied`);
  };

  const handleAddTask = (topicId: string, titleParam?: string) => {
    const titleToUse = titleParam || newTaskTitle;
    if (!titleToUse.trim()) return;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: titleToUse.trim(),
      completed: false,
      date: formattedDate,
      time: formattedTime,
      priority: userSettings.defaultTaskPriority || 'none'
    };

    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, tasks: [...t.tasks, newTask] } : t))
    );
    if (!titleParam) setNewTaskTitle('');
    setAddingTaskTopicId(null);
    showToast(`Task added!`);
  };

  const handleDeleteTask = (topicId: string, taskId: string) => {
    const targetTopic = topics.find(t => t.id === topicId);
    const targetTask = targetTopic?.tasks.find(tk => tk.id === taskId);

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (targetTask && targetTopic) {
      setDeletedTasks(prev => [
        {
          task: targetTask,
          topicId: targetTopic.id,
          topicTitle: targetTopic.title,
          workspaceId: targetTopic.workspaceId,
          deletedAt: formattedDate,
        },
        ...prev,
      ]);
    }

    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          return {
            ...t,
            tasks: t.tasks.filter(task => task.id !== taskId)
          };
        }
        return t;
      })
    );

    if (targetTask) {
      showToast(
        `Moved "${targetTask.title}" to Recycle Bin`,
        () => {
          setTopics(prev =>
            prev.map(t =>
              t.id === topicId
                ? { ...t, tasks: [...t.tasks, targetTask] }
                : t
            )
          );
          setDeletedTasks(prev => prev.filter(item => item.task.id !== taskId));
          showToast(`Restored "${targetTask.title}"`);
        },
        6000
      );
    }
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = newWorkspaceName.replace(/\s+/g, ' ').trim();
    if (normalized.length < 1) {
      showToast('⚠️ Workspace name must be at least 1 character long.');
      return;
    }
    if (normalized.length > 40) {
      showToast(`⚠️ Workspace name cannot exceed 40 characters (${normalized.length}/40 characters).`);
      return;
    }

    const newWs: WorkspaceWindow = {
      id: `ws-${Date.now()}`,
      name: normalized
    };

    const newSec: SectionItem = {
      id: `sec-${Date.now()}`,
      workspaceId: newWs.id,
      name: 'General'
    };

    setWorkspaces(prev => [...prev, newWs]);
    setWorkspaceSections(prev => [...prev, newSec]);
    setActiveWorkspaceId(newWs.id);
    setActiveSection('General');
    setNewWorkspaceName('');
    setIsNewWorkspaceOpen(false);
    showToast(`Workspace "${normalized}" created successfully!`);
  };

  const handleCreateTopicModal = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTitle = newTopicTitle.replace(/\s+/g, ' ').trim();

    if (normalizedTitle.length < 1) {
      showToast('⚠️ Topic name must be at least 1 character long.');
      return;
    }

    if (normalizedTitle.length > 45) {
      showToast(`⚠️ Topic name cannot exceed 45 characters (${normalizedTitle.length}/45 characters).`);
      return;
    }

    if (!activeWorkspaceId) return;
    const targetSection = activeSection || currentWorkspaceSections[0]?.name || '';

    const newTopicId = `topic-${Date.now()}`;
    const newTopic: Topic = {
      id: newTopicId,
      title: normalizedTitle,
      section: targetSection,
      expanded: true,
      isPinned: false,
      workspaceId: activeWorkspaceId,
      tasks: []
    };

    setTopics(prev => [newTopic, ...prev]);
    setNewTopicTitle('');
    setIsNewTopicOpen(false);
    showToast(`Created topic "${normalizedTitle}"!`);
  };

  const handleCreateTopicsFromStudio = (studioTopics: any[]) => {
    const targetWsId = activeWorkspaceId || workspaces[0]?.id || 'workspace-default';
    const targetSection = activeSection || currentWorkspaceSections[0]?.name || 'General';

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const newTopics: Topic[] = studioTopics.map((st, idx) => ({
      id: `topic-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      title: st.title?.trim() || 'Untitled Topic',
      section: st.section || targetSection,
      expanded: true,
      isPinned: false,
      workspaceId: targetWsId,
      customColor: st.color,
      customIcon: st.icon,
      links: (st.links || []).filter((l: any) => l.url && l.url.trim()).map((l: any) => ({
        id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: l.title?.trim() || 'Resource Link',
        url: l.url.trim(),
        type: detectLinkType(l.url.trim(), l.title?.trim())
      })),
      notes: (st.notes || []).filter((n: any) => n.text && n.text.trim()).map((n: any) => ({
        id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: n.text.trim(),
        date: formattedDate,
      })),
      tasks: (st.tasks || []).filter((tk: any) => tk.title && tk.title.trim()).map((tk: any, tIdx: number) => {
        let taskLinks: any[] = [];
        if (Array.isArray(tk.links)) {
          taskLinks = tk.links.filter((l: any) => l.url && l.url.trim()).map((l: any, lIdx: number) => ({
            id: `tk-link-${Date.now()}-${tIdx}-${lIdx}-${Math.random().toString(36).substring(2, 5)}`,
            title: l.title?.trim() || 'Resource Link',
            url: l.url.trim(),
            type: detectLinkType(l.url.trim(), l.title?.trim())
          }));
        } else if (tk.link && tk.link.trim()) {
          taskLinks = [{ 
            id: `tk-link-${Date.now()}-${tIdx}`, 
            title: tk.linkTitle?.trim() || 'Resource Link', 
            url: tk.link.trim(),
            type: detectLinkType(tk.link.trim(), tk.linkTitle?.trim())
          }];
        }

        let taskNotes: any[] = [];
        if (Array.isArray(tk.notes)) {
          taskNotes = tk.notes.filter((n: any) => n.text && n.text.trim()).map((n: any, nIdx: number) => ({
            id: `tk-note-${Date.now()}-${tIdx}-${nIdx}-${Math.random().toString(36).substring(2, 5)}`,
            text: n.text.trim(),
            date: formattedDate 
          }));
        } else if (tk.note && tk.note.trim()) {
          taskNotes = [{ 
            id: `tk-note-${Date.now()}-${tIdx}`, 
            text: tk.note.trim(), 
            date: formattedDate 
          }];
        }

        return {
          id: `task-${Date.now()}-${idx}-${tIdx}-${Math.random().toString(36).substring(2, 7)}`,
          title: tk.title.trim(),
          description: tk.description?.trim() || undefined,
          priority: tk.priority || 'none',
          completed: false,
          date: formattedDate,
          time: formattedTime,
          links: taskLinks,
          notes: taskNotes,
          subtasks: []
        };
      })
    }));

    if (newTopics.length === 0) return;

    setTopics(prev => [...newTopics, ...prev]);
    setIsSmartStudioOpen(false);
    
    const taskCount = newTopics.reduce((acc, t) => acc + t.tasks.length, 0);
    showToast(`✨ Created ${newTopics.length} topic${newTopics.length > 1 ? 's' : ''} and ${taskCount} task${taskCount !== 1 ? 's' : ''}!`);
    if (userSettings.soundEffects !== false) {
      soundManager.playTopicCompleteFanfare();
    }
  };

  const handleWorkspaceNewSection = (wsId: string) => {
    setActiveWorkspaceId(wsId);
    setIsNewSectionOpen(true);
    setActiveMenuWorkspaceId(null);
  };

  const togglePinWorkspace = (wsId: string) => {
    const targetWs = workspaces.find(w => w.id === wsId);
    if (!targetWs) return;
    const nextPin = !targetWs.isPinned;
    setWorkspaces(prev => prev.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          isPinned: nextPin,
          pinnedAt: nextPin ? Date.now() : undefined,
        };
      }
      return w;
    }));
    showToast(nextPin ? `Pinned "${targetWs.name}" workspace` : `Unpinned "${targetWs.name}" workspace`);
    setActiveMenuWorkspaceId(null);
  };

  const handleStartRenameWorkspace = (ws: WorkspaceWindow) => {
    setEditingWorkspaceId(ws.id);
    setEditingWorkspaceName(ws.name);
    setActiveMenuWorkspaceId(null);
  };

  const handleSaveRenameWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkspaceId) return;
    const normalized = editingWorkspaceName.replace(/\s+/g, ' ').trim();
    if (normalized.length < 1) {
      showToast('⚠️ Workspace name must be at least 1 character long.');
      return;
    }
    if (normalized.length > 40) {
      showToast(`⚠️ Workspace name cannot exceed 40 characters (${normalized.length}/40 characters).`);
      return;
    }

    setWorkspaces(prev => prev.map(w => w.id === editingWorkspaceId ? { ...w, name: normalized } : w));
    showToast(`Workspace renamed to "${normalized}"`);
    setEditingWorkspaceId(null);
    setEditingWorkspaceName('');
  };

  const handleMoveWorkspaceToRecycleBin = (wsId: string) => {
    const targetWs = workspaces.find(w => w.id === wsId);
    if (!targetWs) return;

    if (workspaces.length <= 1) {
      showToast('Cannot delete the only workspace');
      setActiveMenuWorkspaceId(null);
      return;
    }

    setActiveMenuWorkspaceId(null);
    setWorkspaceToDelete(targetWs);
  };

  const handleConfirmMoveWorkspaceToRecycleBin = () => {
    if (!workspaceToDelete) return;
    const targetWs = workspaceToDelete;
    const wsId = targetWs.id;
    setWorkspaceToDelete(null);

    if (userSettings.soundEffects !== false) {
      soundManager.playTrash();
    }

    // Get topics and sections in this workspace
    const wsTopics = topics.filter(t => t.workspaceId === wsId);
    const wsSections = workspaceSections.filter(s => s.workspaceId === wsId);

    const now = new Date().toISOString();

    setDeletedWorkspaces(prev => [{ workspace: targetWs, topics: wsTopics, sections: wsSections, deletedAt: now }, ...prev]);

    if (wsTopics.length > 0) {
      setTopics(prev => prev.filter(t => t.workspaceId !== wsId));
    }
    if (wsSections.length > 0) {
      setWorkspaceSections(prev => prev.filter(s => s.workspaceId !== wsId));
    }

    setWorkspaces(prev => prev.filter(w => w.id !== wsId));
    if (activeWorkspaceId === wsId) {
      const remaining = workspaces.filter(w => w.id !== wsId);
      if (remaining.length > 0) {
        setActiveWorkspaceId(remaining[0].id);
      }
    }
    showToast(
      `Workspace "${targetWs.name}" moved to Recycle Bin`,
      () => {
        setWorkspaces(prev => [...prev, targetWs]);
        if (wsTopics.length > 0) {
          setTopics(prev => [...prev, ...wsTopics]);
        }
        if (wsSections.length > 0) {
          setWorkspaceSections(prev => [...prev, ...wsSections]);
        }
        setDeletedWorkspaces(prev => prev.filter(item => item.workspace.id !== wsId));
        setActiveWorkspaceId(wsId);
        showToast(`Restored workspace "${targetWs.name}"`);
      },
      6000
    );
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspaceId) return;
    
    // Multiple space auto remove
    const sanitized = newSectionName.replace(/\s+/g, ' ').trim();
    if (sanitized.length < 1) {
      showToast('⚠️ Section name must be at least 1 character long.');
      return;
    }

    if (sanitized.length > 35) {
      showToast(`⚠️ Section name cannot exceed 35 characters (${sanitized.length}/35 characters).`);
      return;
    }

    const currentSecs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);

    // Duplicate Name Rule inside same workspace
    if (currentSecs.some(s => s.name.toLowerCase() === sanitized.toLowerCase())) {
      showToast(`⚠️ Section "${sanitized}" already exists in this workspace!`);
      return;
    }

    const isFirstSectionInWorkspace = currentSecs.length === 0;

    const newSec: SectionItem = {
      id: `sec-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: sanitized
    };

    setWorkspaceSections(prev => [...prev, newSec]);
    setActiveSection(sanitized);

    // Only if this is the FIRST section created in this workspace, assign existing unassigned topics to this section
    if (isFirstSectionInWorkspace) {
      setTopics(prev => prev.map(t => {
        if (t.workspaceId === activeWorkspaceId) {
          return { ...t, section: sanitized };
        }
        return t;
      }));
    }

    setNewSectionName('');
    setIsNewSectionOpen(false);
    showToast(`Created section "${sanitized}"`);
  };

  const handleStartRenameSection = (sec: string) => {
    setEditingSection(sec);
    setEditingSectionName(sec);
    setActiveMenuSection(null);
  };

  const handleSaveRenameSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !activeWorkspaceId) return;

    const sanitized = editingSectionName.replace(/\s+/g, ' ').trim();
    if (sanitized.length < 1) {
      showToast('⚠️ Section name must be at least 1 character long.');
      return;
    }

    if (sanitized.length > 35) {
      showToast(`⚠️ Section name cannot exceed 35 characters (${sanitized.length}/35 characters).`);
      return;
    }

    const currentSecs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);
    if (currentSecs.some(s => s.name.toLowerCase() === sanitized.toLowerCase() && s.name !== editingSection)) {
      showToast(`⚠️ Section "${sanitized}" already exists in this workspace!`);
      return;
    }

    const oldName = editingSection;
    setWorkspaceSections(prev => prev.map(s => s.workspaceId === activeWorkspaceId && s.name === oldName ? { ...s, name: sanitized } : s));
    setTopics(prev => prev.map(t => t.workspaceId === activeWorkspaceId && t.section === oldName ? { ...t, section: sanitized } : t));
    if (activeSection === oldName) setActiveSection(sanitized);

    showToast(`Renamed section to "${sanitized}"`);
    setEditingSection(null);
    setEditingSectionName('');
  };

  const handleDeleteSection = (secToDelete: string) => {
    if (!activeWorkspaceId) return;
    const currentSecs = workspaceSections.filter(s => s.workspaceId === activeWorkspaceId);
    const remainingSecs = currentSecs.filter(s => s.name !== secToDelete);
    
    const deletedSectionItem = currentSecs.find(s => s.name === secToDelete);
    const affectedTopics = topics.filter(t => t.workspaceId === activeWorkspaceId && t.section === secToDelete);

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (deletedSectionItem) {
      setDeletedSections(prev => [{ section: deletedSectionItem, deletedAt: formattedDate }, ...prev]);
    }

    setWorkspaceSections(prev => prev.filter(s => !(s.workspaceId === activeWorkspaceId && s.name === secToDelete)));

    if (remainingSecs.length > 0) {
      const fallbackSection = remainingSecs[0].name;
      setTopics(prev => prev.map(t => (t.workspaceId === activeWorkspaceId && t.section === secToDelete) ? { ...t, section: fallbackSection } : t));
      if (activeSection === secToDelete) {
        setActiveSection(fallbackSection);
      }
      showToast(
        `Deleted section "${secToDelete}". Topics moved to "${fallbackSection}"`,
        () => {
          if (deletedSectionItem) {
            setWorkspaceSections(prev => [...prev, deletedSectionItem]);
            setDeletedSections(prev => prev.filter(s => s.section.id !== deletedSectionItem.id));
          }
          if (affectedTopics.length > 0) {
            setTopics(prev => prev.map(t => {
              const matched = affectedTopics.find(at => at.id === t.id);
              return matched ? { ...t, section: secToDelete } : t;
            }));
          }
          setActiveSection(secToDelete);
          showToast(`Restored section "${secToDelete}"`);
        },
        6000
      );
    } else {
      setActiveSection(null);
      showToast(
        `Deleted section "${secToDelete}"`,
        () => {
          if (deletedSectionItem) {
            setWorkspaceSections(prev => [...prev, deletedSectionItem]);
            setDeletedSections(prev => prev.filter(s => s.section.id !== deletedSectionItem.id));
          }
          setActiveSection(secToDelete);
          showToast(`Restored section "${secToDelete}"`);
        },
        6000
      );
    }
    setActiveMenuSection(null);
  };

  // Move topic Up/Down in list
  const moveTopicIndex = (topicId: string, direction: 'up' | 'down') => {
    const index = topics.findIndex(t => t.id === topicId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;

    const newTopics = [...topics];
    const [moved] = newTopics.splice(index, 1);
    newTopics.splice(targetIndex, 0, moved);
    setTopics(newTopics);
  };

  // Comprehensive Export JSON: Exports all workspaces, sections, topics, tasks with all properties, notes, daily tasks (standaloneTasks), userSettings, streakData, and recycle bin
  const handleExportJSON = () => {
    try {
      const backupData = {
        app: 'StudyFlow',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        activeWorkspaceId,
        workspaces,
        workspaceSections,
        topics,
        notes,
        standaloneTasks,
        userSettings,
        streakData,
        deletedTopics,
        deletedWorkspaces,
        deletedNotes,
        deletedSections,
        deletedTasks,
        deletedTopicNotes,
        deletedTopicLinks
      };
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('download', `studyflow_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      showToast('Exported complete backup file successfully!');
    } catch (err) {
      showToast('⚠️ Failed to export backup file.');
    }
  };

  // Comprehensive Import JSON: Restores all workspaces, sections, topics, tasks with all properties, notes, daily tasks, userSettings, streakData, and recycle bin
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const rawText = event.target?.result as string;
        const parsed = JSON.parse(rawText);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON structure');
        }

        // Support both structured backup format and legacy array format
        let importedWorkspaces: WorkspaceWindow[] = Array.isArray(parsed.workspaces) ? parsed.workspaces : [];
        let importedSections: SectionItem[] = Array.isArray(parsed.workspaceSections)
          ? parsed.workspaceSections
          : Array.isArray(parsed.sections)
          ? parsed.sections
          : [];
        let importedTopics: Topic[] = Array.isArray(parsed.topics)
          ? parsed.topics
          : Array.isArray(parsed)
          ? parsed
          : [];
        const importedNotes: StudyNote[] = Array.isArray(parsed.notes) ? parsed.notes : [];
        const importedStandaloneTasks: StandaloneTask[] = Array.isArray(parsed.standaloneTasks)
          ? parsed.standaloneTasks
          : Array.isArray(parsed.dailyTasks)
          ? parsed.dailyTasks
          : Array.isArray(parsed.tasksStudio)
          ? parsed.tasksStudio
          : [];

        const importedUserSettings: UserSettings | null = parsed.userSettings && typeof parsed.userSettings === 'object' ? parsed.userSettings : null;
        const importedStreakData: StreakData | null = parsed.streakData && typeof parsed.streakData === 'object' ? parsed.streakData : null;
        const importedDeletedTopics: Topic[] = Array.isArray(parsed.deletedTopics) ? parsed.deletedTopics : [];
        const importedDeletedWorkspaces = Array.isArray(parsed.deletedWorkspaces) ? parsed.deletedWorkspaces : [];
        const importedDeletedNotes = Array.isArray(parsed.deletedNotes) ? parsed.deletedNotes : [];
        const importedDeletedSections = Array.isArray(parsed.deletedSections) ? parsed.deletedSections : [];
        const importedDeletedTasks = Array.isArray(parsed.deletedTasks) ? parsed.deletedTasks : [];
        const importedDeletedTopicNotes = Array.isArray(parsed.deletedTopicNotes) ? parsed.deletedTopicNotes : [];
        const importedDeletedTopicLinks = Array.isArray(parsed.deletedTopicLinks) ? parsed.deletedTopicLinks : [];

        if (
          importedTopics.length === 0 &&
          importedWorkspaces.length === 0 &&
          importedNotes.length === 0 &&
          importedStandaloneTasks.length === 0
        ) {
          throw new Error('No valid topics, workspaces, notes, or tasks found in backup file.');
        }

        // 1. Ensure at least one Workspace exists
        if (importedWorkspaces.length === 0) {
          importedWorkspaces = [{ id: '1', name: 'Workspace' }];
        }

        // Determine target active workspace
        const targetWsId = parsed.activeWorkspaceId && importedWorkspaces.some(w => w.id === parsed.activeWorkspaceId)
          ? parsed.activeWorkspaceId
          : importedWorkspaces[0].id;

        // 2. Normalize topics to guarantee valid workspaceId and section
        importedTopics = importedTopics.map(t => ({
          ...t,
          workspaceId: t.workspaceId || targetWsId,
          section: t.section || 'General'
        }));

        // 3. Normalize sections (Auto-extract missing sections from topics if sections array is empty or incomplete)
        const existingSecKeys = new Set(importedSections.map(s => `${s.workspaceId}:::${s.name.toLowerCase()}`));
        importedTopics.forEach((t, i) => {
          const wsId = t.workspaceId || targetWsId;
          const secName = t.section || 'General';
          const key = `${wsId}:::${secName.toLowerCase()}`;
          if (!existingSecKeys.has(key)) {
            existingSecKeys.add(key);
            importedSections.push({
              id: `sec-import-${Date.now()}-${i}`,
              workspaceId: wsId,
              name: secName
            });
          }
        });

        // 4. Auto-detect active section with content for active workspace
        const targetWsTopics = importedTopics.filter(t => t.workspaceId === targetWsId);
        const topicSec = targetWsTopics.find(t => t.section)?.section;
        const availableSecs = importedSections.filter(s => s.workspaceId === targetWsId);
        const targetSection = topicSec || availableSecs[0]?.name || null;

        // 5. Commit all states
        setWorkspaces(importedWorkspaces);
        setActiveWorkspaceId(targetWsId);
        setWorkspaceSections(importedSections);
        setActiveSection(targetSection);
        setTopics(importedTopics);
        setSyncedTopics(importedTopics);
        setDeletedTopics(importedDeletedTopics);
        setDeletedWorkspaces(importedDeletedWorkspaces);
        setDeletedNotes(importedDeletedNotes);
        setDeletedSections(importedDeletedSections);
        setDeletedTasks(importedDeletedTasks);
        setDeletedTopicNotes(importedDeletedTopicNotes);
        setDeletedTopicLinks(importedDeletedTopicLinks);

        if (Array.isArray(parsed.notes)) {
          setNotes(importedNotes);
          localStorage.setItem('studyflow_notes', JSON.stringify(importedNotes));
        }

        if (Array.isArray(parsed.standaloneTasks) || Array.isArray(parsed.dailyTasks) || Array.isArray(parsed.tasksStudio)) {
          setStandaloneTasks(importedStandaloneTasks);
          localStorage.setItem('studyflow_standalone_tasks', JSON.stringify(importedStandaloneTasks));
        }

        if (importedUserSettings) {
          setUserSettings(importedUserSettings);
          localStorage.setItem('studyflow_user_settings', JSON.stringify(importedUserSettings));
        }

        if (importedStreakData) {
          setStreakData(importedStreakData);
          localStorage.setItem('studyflow_daily_streak_v1', JSON.stringify(importedStreakData));
        }

        // Reset search, filters & open modals to prevent accidental blank views
        setStatusFilter('all');
        setIsSearchPageOpen(false);
        setSelectedTopicId(null);
        setIsDetailsDrawerOpen(false);
        if (window.innerWidth < 768) {
          setSidebarCollapsed(true);
        }

        // Synchronize to localStorage
        localStorage.setItem('studyflow_workspaces', JSON.stringify(importedWorkspaces));
        localStorage.setItem('studyflow_active_workspace', JSON.stringify(targetWsId));
        localStorage.setItem('studyflow_workspace_sections', JSON.stringify(importedSections));
        localStorage.setItem('studyflow_topics', JSON.stringify(importedTopics));
        localStorage.setItem('studyflow_deleted_topics', JSON.stringify(importedDeletedTopics));
        localStorage.setItem('studyflow_deleted_workspaces', JSON.stringify(importedDeletedWorkspaces));
        localStorage.setItem('studyflow_deleted_notes', JSON.stringify(importedDeletedNotes));
        localStorage.setItem('studyflow_deleted_sections', JSON.stringify(importedDeletedSections));
        localStorage.setItem('studyflow_deleted_tasks', JSON.stringify(importedDeletedTasks));
        localStorage.setItem('studyflow_deleted_topic_notes', JSON.stringify(importedDeletedTopicNotes));
        localStorage.setItem('studyflow_deleted_topic_links', JSON.stringify(importedDeletedTopicLinks));

        showToast('Complete StudyFlow data imported successfully!');
      } catch (err: any) {
        showToast(`⚠️ Import failed: ${err?.message || 'Invalid StudyFlow backup file.'}`);
      } finally {
        if (e.target) {
          e.target.value = '';
        }
      }
    };
    reader.onerror = () => {
      showToast('⚠️ Failed to read backup file.');
      if (e.target) {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  // 1. Splash / Session check loading screen
  if (isAuthChecking) {
    return (
      <div className="h-[100dvh] w-full bg-slate-900 flex flex-col items-center justify-center font-sans relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center shadow-2xl relative mb-5 animate-pulse">
            <div className="preserve-color relative w-[32px] h-[32px] flex items-center justify-center shrink-0">
              <div className="absolute top-0 left-0 w-[21px] h-[21px] bg-[#2563EB] rounded-[5.5px] shadow-3xs"></div>
              <div className="absolute bottom-0 right-0 w-[21px] h-[21px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[5.5px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90 shadow-3xs"></div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300 font-semibold text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span>Connecting to Study Flow...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Mandatory Auth Wall (Requires Login or Sign Up)
  if (!currentUser) {
    return (
      <div className="h-[100dvh] w-full bg-slate-900 flex items-center justify-center relative overflow-hidden font-sans select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-950"></div>
        <AuthModal
          isOpen={true}
          isClosable={false}
          onClose={() => {}}
          onSuccess={() => {
            setToastData({ message: 'Welcome to Study Flow! 🚀' });
          }}
        />
        {/* Toast Notification */}
        <AnimatePresence>
          {toastData && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-6 right-4 sm:right-6 z-[999999999] pointer-events-auto select-none max-w-[calc(100vw-2rem)] sm:max-w-[420px] transition-all duration-200"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-[#0F172A]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/70 text-xs font-semibold tracking-tight min-w-[280px]">
                <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 text-white shadow-xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="flex-1 text-slate-100 leading-snug">{toastData.message}</span>
                <button
                  type="button"
                  onClick={() => setToastData(null)}
                  className="p-1 hover:bg-slate-700/60 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-slate-50 dark:bg-[#0b0f19] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-slate-900/40 via-slate-50 dark:via-[#0b0f19] to-white dark:to-[#0b0f19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-row font-sans overflow-hidden">
      {/* Hidden file input for import with broad mobile mime-type support */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json,application/json,text/plain,*/*"
        className="hidden"
      />

      {/* Mobile Drawer (Spring Physics, Swipe-Ready, Google Gemini / Notion Style) */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <>
            {/* Mobile Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => setSidebarCollapsed(true)}
              className="md:hidden fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] z-[99998] cursor-pointer"
            />

            {/* Smooth Spring Gliding Mobile Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 380, mass: 0.75 }}
              className="md:hidden fixed inset-y-0 left-0 w-[275px] max-w-[85vw] h-[100dvh] z-[99999] bg-white border-r border-[#E5EAF2] shadow-2xl shadow-slate-950/25 flex flex-col select-none font-sans"
              style={{ height: '100dvh' }}
            >
              {/* Brand Header with Close Button (Exact 56px matching main header) */}
              <div className="h-[56px] sm:h-[60px] px-3.5 flex items-center justify-between shrink-0 border-b border-slate-200/80 dark:border-slate-800 relative z-50 overflow-visible">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <div className="preserve-color relative w-[23px] h-[23px] flex items-center justify-center shrink-0">
                      <div className="absolute top-0 left-0 w-[16px] h-[16px] bg-[#2563EB] rounded-[4px]"></div>
                      <div className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[4px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90"></div>
                    </div>
                  </div>
                  <div className="relative" data-accent-picker-container="mobile">
                    <span className="font-[700] text-[16px] text-[#101828] dark:text-slate-100 tracking-tight flex items-center">
                      Study&nbsp;
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAccentQuickPickerOpen(prev => !prev);
                        }}
                        className="brand-flow-highlight font-extrabold cursor-pointer hover:opacity-80 active:scale-95 transition-all inline-flex items-center rounded-md px-1 py-0.5 -mx-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Click to choose accent color"
                      >
                        Flow
                      </button>
                    </span>

                    <AnimatePresence>
                      {isAccentQuickPickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: 4 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-0 top-full mt-2.5 z-[99999] p-2.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-950/20 flex flex-col gap-2 min-w-[210px]"
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between px-1 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <span>Accent Color</span>
                            <button
                              type="button"
                              onClick={() => setIsAccentQuickPickerOpen(false)}
                              className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-1.5 px-0.5">
                            {ACCENT_COLOR_OPTIONS.map((opt) => {
                              const isSelected = (userSettings.primaryColor || 'blue') === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAccentColor(opt.id);
                                  }}
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    handleSelectAccentColor(opt.id);
                                  }}
                                  className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-115 active:scale-95 cursor-pointer shadow-3xs ${
                                    isSelected ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110' : ''
                                  }`}
                                  style={{ backgroundColor: opt.color }}
                                  title={opt.label}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(true)}
                  className="w-7 h-7 flex items-center justify-center border border-[#E5EAF2] dark:border-slate-800 rounded-[8px] text-[#667085] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 shrink-0 cursor-pointer active:scale-95"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              {/* Mobile Drawer Main Content Container (No whole-sidebar scroll) */}
              <div className="flex-1 min-h-0 px-2 flex flex-col pt-1.5 pb-2 overflow-hidden">
                {/* Section 1: Views (Fixed at top) */}
                <div className="flex flex-col gap-[2px] shrink-0">
                  <div className="px-2 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none">
                    Views
                  </div>

                  {/* Mobile Search Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchPageOpen(true);
                      setIsNotesPageOpen(false);
                      setIsTasksPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isSearchPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Search
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isSearchPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className={`truncate font-serif text-[13px] leading-tight ${isSearchPageOpen ? 'font-semibold text-white' : 'font-medium text-[#334155] dark:text-slate-200'}`}>Search</span>
                    </div>
                    <kbd
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 h-[19px] rounded-[4px] border leading-none select-none shrink-0 transition-colors ${
                        isSearchPageOpen
                          ? 'bg-white/20 border-white/30 text-white'
                          : 'bg-slate-100/90 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-3xs'
                      }`}
                    >
                      <Command className={`w-[10.5px] h-[10.5px] stroke-[2.3] shrink-0 ${isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span className={`text-[10px] font-bold leading-none ${isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>K</span>
                    </kbd>
                  </button>

                  {/* Mobile Notes Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotesPageOpen(true);
                      setIsTasksPageOpen(false);
                      setIsSearchPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isNotesPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <NotebookPen
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isNotesPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className={`truncate font-serif text-[13px] leading-tight ${isNotesPageOpen ? 'font-semibold text-white' : 'font-medium text-[#334155] dark:text-slate-200'}`}>Notes</span>
                    </div>
                    {notes.length > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 min-w-[20px] h-[18px] flex items-center justify-center rounded-full border shrink-0 transition-colors ${
                          isNotesPageOpen
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80'
                        }`}
                      >
                        {notes.length}
                      </span>
                    )}
                  </button>

                  {/* Mobile Tasks Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsTasksPageOpen(true);
                      setIsNotesPageOpen(false);
                      setIsSearchPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isTasksPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ListTodo
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isTasksPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className={`truncate font-serif text-[13px] leading-tight ${isTasksPageOpen ? 'font-semibold text-white' : 'font-medium text-[#334155] dark:text-slate-200'}`}>Tasks</span>
                    </div>
                    {standaloneTasks.filter(t => !t.completed).length > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 min-w-[20px] h-[18px] flex items-center justify-center rounded-full border shrink-0 transition-colors ${
                          isTasksPageOpen
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80'
                        }`}
                      >
                        {standaloneTasks.filter(t => !t.completed).length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast('Showing starred topics');
                      setSidebarCollapsed(true);
                    }}
                    className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    <Star className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                    <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">Starred</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsShortcutsOpen(true);
                      setSidebarCollapsed(true);
                    }}
                    className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    <Keyboard className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                    <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">Shortcuts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAnalyticsPageOpen(true);
                      setIsTasksPageOpen(false);
                      setIsSearchPageOpen(false);
                      setIsNotesPageOpen(false);
                      setIsRecycleBinOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isAnalyticsPageOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <TrendingUp
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isAnalyticsPageOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className={`truncate font-serif text-[13px] leading-tight ${isAnalyticsPageOpen ? 'font-semibold text-white' : 'font-medium text-[#334155] dark:text-slate-200'}`}>Analytics</span>
                    </div>
                  </button>
                </div>

                {/* Section 2: Workspaces Header (Fixed) */}
                <div className="h-2 shrink-0" />
                <div
                  onClick={() => {
                    if (!isReorderingWorkspaces) {
                      toggleWorkspacesCollapse();
                    }
                  }}
                  className={`relative group/ws-header w-full h-6 flex items-center justify-between text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none transition-colors shrink-0 px-1.5 ${
                    !isReorderingWorkspaces ? 'cursor-pointer hover:text-slate-600' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-14">
                    {isReorderingWorkspaces ? (
                      <span className="text-[#2563EB] font-extrabold flex items-center gap-1.5">
                        <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </span>
                    ) : (
                      <>
                        <span>Workspaces</span>
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100/90 text-slate-500 border border-slate-200/50">
                          {sortedWorkspaces.length}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isWorkspacesCollapsed ? '-rotate-90 text-slate-400' : 'rotate-0 text-slate-500 hover:text-slate-700'}`} />
                      </>
                    )}
                  </div>

                  {!isReorderingWorkspaces ? (
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 shrink-0 z-10">
                      {workspaces.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startReorderingWorkspaces();
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                          title="Reorder Workspaces"
                        >
                          <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsNewWorkspaceOpen(true);
                          setSidebarCollapsed(true);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                        title="New Workspace"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 shrink-0 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelReorder();
                        }}
                        className="px-1.5 py-0.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[11px] font-medium transition-all cursor-pointer"
                        title="Cancel Reordering"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDoneReorder();
                        }}
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#2563EB] text-white hover:bg-blue-700 text-[11px] font-bold transition-all cursor-pointer shadow-3xs"
                        title="Done Reordering"
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Done</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Workspaces Scrollable Section (SCROLL IS STRICTLY LIMITED HERE) */}
                <div
                  className={`flex-1 min-h-0 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    !isWorkspacesCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none max-h-0'
                  }`}
                >
                  {isReorderingWorkspaces ? (
                    /* Mobile Reorder Mode (Up/Down Buttons + Touch Support) */
                    <div 
                      className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5 touch-pan-y"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {workspaces.map((ws, idx) => {
                        const isDragging = draggedWsIdx === idx;
                        const isDragOver = dragOverWsIdx === idx && draggedWsIdx !== idx;
                        const isDragBelow = draggedWsIdx !== null && draggedWsIdx < idx;
                        return (
                          <div
                            key={ws.id}
                            data-reorder-index={idx}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragEnd={handleDragEnd}
                            className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md px-1.5 gap-1.5 transition-all duration-150 select-none outline-none focus:outline-none focus:ring-0 ${
                              isDragging
                                ? 'opacity-40 scale-[0.98] bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700'
                                : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:bg-slate-200/60 dark:active:bg-slate-700/60'
                            }`}
                          >
                            {isDragOver && (
                              <div
                                className={`absolute left-1 right-1 h-[2px] bg-[#2563EB] dark:bg-blue-500 rounded-full shadow-sm shadow-blue-500/50 z-30 pointer-events-none ${
                                  isDragBelow ? '-bottom-[2px]' : '-top-[2px]'
                                }`}
                              />
                            )}

                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <div
                                onTouchStart={(e) => handleTouchStart(e, idx)}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                className="p-0.5 -ml-0.5 cursor-grab active:cursor-grabbing touch-none flex items-center"
                                title="Drag to reorder"
                              >
                                <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0" />
                              </div>
                              {ws.isPinned ? (
                                <Pin className="w-[15px] h-[15px] text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500 shrink-0" />
                              ) : (
                                <BookOpen className="w-[15px] h-[15px] text-slate-500 dark:text-slate-400 shrink-0" strokeWidth={1.75} />
                              )}
                              <span className="truncate font-serif text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-tight">
                                {ws.name}
                              </span>
                            </div>

                            {/* Up/Down Move Buttons */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveWorkspace(idx, idx - 1)}
                                className={`p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                                  idx === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                title="Move up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === workspaces.length - 1}
                                onClick={() => handleMoveWorkspace(idx, idx + 1)}
                                className={`p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                                  idx === workspaces.length - 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                title="Move down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div 
                      className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5 touch-pan-y"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {sortedWorkspaces.map(ws => {
                        const isActive = ws.id === activeWorkspaceId && !isSearchPageOpen && !isNotesPageOpen && !isTasksPageOpen && !isRecycleBinOpen && !isAnalyticsPageOpen;
                        return (
                          <div
                            key={ws.id}
                            id={`mobile-sidebar-workspace-${ws.id}`}
                            className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md transition-all duration-150 ${
                              isActive
                                ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                                : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <div
                              onClick={() => {
                                setActiveWorkspaceId(ws.id);
                                setIsSearchPageOpen(false);
                                setIsNotesPageOpen(false);
                                setIsTasksPageOpen(false);
                                setIsAnalyticsPageOpen(false);
                                setIsRecycleBinOpen(false);
                                setSidebarCollapsed(true);
                              }}
                              className="flex-1 h-[32px] px-2 flex items-center gap-2 truncate min-w-0 cursor-pointer pr-2"
                            >
                              {ws.isPinned ? (
                                <Pin className={`w-[15px] h-[15px] shrink-0 ${isActive ? 'text-white fill-white' : 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500'}`} />
                              ) : (
                                <BookOpen className={`w-[17px] h-[17px] shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={1.75} />
                              )}
                              <span className={`truncate font-serif text-[13px] leading-tight ${isActive ? 'font-semibold text-white' : 'font-medium text-[#334155] dark:text-slate-200'}`}>
                                {ws.name}
                              </span>
                            </div>

                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-30 transition-all duration-150 shrink-0">

                              <button
                                type="button"
                                onClick={(e) => toggleWorkspaceMenu(ws.id, e)}
                                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors cursor-pointer workspace-menu-btn ${
                                  isActive
                                    ? activeMenuWorkspaceId === ws.id
                                      ? 'bg-white/25 text-white'
                                      : 'text-white/90 hover:text-white hover:bg-white/20'
                                    : activeMenuWorkspaceId === ws.id
                                      ? 'bg-slate-200/70 text-[#0F172A]'
                                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60'
                                }`}
                                title="Options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Bottom Preferences & Profile (Fixed Footer) */}
                <div className="px-2 pb-2 pt-1 flex flex-col gap-[2px] shrink-0 bg-white">
                  <div className="px-2 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none">
                    Preferences
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleExportJSON();
                      setSidebarCollapsed(true);
                    }}
                    className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    <Download className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                    <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">Export</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setSidebarCollapsed(true);
                    }}
                    className="w-full h-[32px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer shrink-0"
                  >
                    <Upload className="w-[17px] h-[17px] shrink-0 text-slate-500" strokeWidth={1.75} />
                    <span className="truncate font-serif text-[13px] leading-tight font-medium text-[#334155]">Import</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecycleBinOpen(true);
                      setIsTasksPageOpen(false);
                      setIsNotesPageOpen(false);
                      setIsSearchPageOpen(false);
                      setIsAnalyticsPageOpen(false);
                      setSidebarCollapsed(true);
                    }}
                    className={`w-full h-[32px] px-2 rounded-md flex items-center justify-between transition-colors cursor-pointer shrink-0 ${
                      isRecycleBinOpen
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#334155] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Trash2
                        className={`w-[17px] h-[17px] shrink-0 ${
                          isRecycleBinOpen ? 'text-white stroke-[2]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className={`truncate font-serif text-[13px] leading-tight ${isRecycleBinOpen ? 'font-semibold text-white' : 'font-medium text-[#334155] dark:text-slate-200'}`}>Trash</span>
                    </div>
                    {(deletedTopics.length > 0 || deletedWorkspaces.length > 0) && (
                      <span
                        className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold ${
                          isRecycleBinOpen
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80'
                        }`}
                      >
                        {deletedTopics.length + deletedWorkspaces.length}
                      </span>
                    )}
                  </button>

                  <div className="h-2 shrink-0" />

                  {/* Mobile Drawer Bottom Minimal 2-Line User Profile + Settings Gear */}
                  <div className="relative user-profile-dropdown-container flex items-center gap-2 w-full">
                    {currentUser && (
                      <UserProfilePopover
                        isOpen={profileMenuTarget === 'sidebar'}
                        onClose={() => setProfileMenuTarget(null)}
                        currentUser={currentUser}
                        isOnline={isOnline}
                        currentStreak={streakData.currentStreak}
                        dailyGoalPercent={dailyGoalPercent}
                        onOpenEditProfile={() => setIsEditProfileOpen(true)}
                        onChangePassword={handleChangePassword}
                        onSwitchAccount={handleSwitchAccount}
                        onSignOut={handleSignOut}
                        position="sidebar"
                      />
                    )}

                    {currentUser ? (
                      <div 
                        onClick={() => {
                          setProfileMenuTarget(prev => prev === 'sidebar' ? null : 'sidebar');
                        }}
                        className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2 select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="relative w-7 h-7 shrink-0">
                          <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                            {currentUser.photoURL ? (
                              <img
                                src={currentUser.photoURL}
                                alt={currentUser.displayName || 'Avatar'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-[#3B82F6] to-[#1D4ED8] text-white font-black text-[11px] flex items-center justify-center uppercase">
                                {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                              </div>
                            )}
                          </div>
                          {/* Live Cloud Sync Indicator Dot (Matches Header) */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-3xs pointer-events-none transition-colors ${
                              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            title={isOnline ? 'Cloud Synced' : 'Offline Mode (Local Cache)'}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {currentUser.displayName || 'Study Flow User'}
                          </div>
                          <div className="text-[9px] text-slate-400 dark:text-slate-400 truncate leading-tight mt-0.5">
                            {currentUser.email || (isOnline ? 'Cloud Synced' : 'Offline')}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setSidebarCollapsed(true);
                        }}
                        className="flex-1 h-[32px] px-2 rounded-md bg-blue-50/90 text-[#2563EB] text-[12.5px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <LogIn className="w-[17px] h-[17px]" strokeWidth={1.75} />
                        <span>Sign In</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setSidebarCollapsed(true);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                      title="Settings"
                    >
                      <Settings className="w-[17px] h-[17px]" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Left Sidebar (255px / 56px) - Google Gemini Web Style Material Eased Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 select-none font-sans static z-20 border-r border-[#E5EAF2] dark:border-slate-800 bg-white dark:bg-slate-900 h-[100vh] transition-[width] duration-280 ease-[cubic-bezier(0.2,0,0,1)] ${
          sidebarCollapsed ? 'w-[56px] overflow-hidden' : 'w-[255px]'
        }`}
        style={{ height: '100vh' }}
      >
        {/* Brand Header (72px height) */}
        <div className="h-[72px] px-2 flex items-center shrink-0 relative z-50 overflow-visible">
          <div
            className={`w-full h-[36px] flex items-center select-none rounded-lg transition-colors group relative ${
              sidebarCollapsed ? 'justify-center px-0 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 cursor-pointer' : 'px-1.5 cursor-default'
            }`}
            onClick={() => {
              if (sidebarCollapsed) {
                setTooltipData(null);
                setSidebarCollapsed(false);
              }
            }}
            data-tooltip={sidebarCollapsed && !suppressSidebarTooltip ? "Expand sidebar" : undefined}
            data-tooltip-side="right"
          >
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5 min-w-0 flex-1 pr-8'}`}>
              {/* Brand logo icon: 100% stationary anchor */}
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <div className="preserve-color relative w-[23px] h-[23px] flex items-center justify-center shrink-0">
                  <div className="absolute top-0 left-0 w-[16px] h-[16px] bg-[#2563EB] rounded-[4px]"></div>
                  <div className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[4px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90"></div>
                </div>
              </div>
              
              {/* Brand title - Gemini style overflow reveal */}
              <div className="relative" data-accent-picker-container="desktop">
                <span
                  className={`font-[700] text-[16px] leading-[22px] text-[#101828] dark:text-slate-100 tracking-tight whitespace-nowrap transition-opacity duration-200 ease-out flex items-center ${
                    sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  Study&nbsp;
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAccentQuickPickerOpen(prev => !prev);
                    }}
                    className="brand-flow-highlight font-extrabold cursor-pointer hover:opacity-80 active:scale-95 transition-all inline-flex items-center rounded-md px-1 py-0.5 -mx-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Click to choose accent color"
                  >
                    Flow
                  </button>
                </span>

                <AnimatePresence>
                  {isAccentQuickPickerOpen && !sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 4 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full mt-2.5 z-[99999] p-2.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-950/20 flex flex-col gap-2 min-w-[210px]"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-1 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <span>Accent Color</span>
                        <button
                          type="button"
                          onClick={() => setIsAccentQuickPickerOpen(false)}
                          className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-1.5 px-0.5">
                        {ACCENT_COLOR_OPTIONS.map((opt) => {
                          const isSelected = (userSettings.primaryColor || 'blue') === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAccentColor(opt.id);
                              }}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                handleSelectAccentColor(opt.id);
                              }}
                              className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-115 active:scale-95 cursor-pointer shadow-3xs ${
                                isSelected ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110' : ''
                              }`}
                              style={{ backgroundColor: opt.color }}
                              title={opt.label}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Collapse button positioned absolutely to preserve 0-shift on the logo */}
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTooltipData(null);
                setSuppressSidebarTooltip(true);
                setSidebarCollapsed(true);
                setTimeout(() => setSuppressSidebarTooltip(false), 400);
              }}
              data-tooltip="Collapse sidebar"
              data-tooltip-side="bottom"
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center border border-[#E5EAF2] dark:border-slate-800 rounded-[8px] text-[#667085] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 shrink-0 cursor-pointer ${
                sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Main Navigation Container (Fixed Views + Scrollable Workspace List only) */}
        <div className="flex-1 min-h-0 px-2 flex flex-col pt-1 pb-2 overflow-hidden">
          {/* Section 1: VIEWS / QUICK ACCESS (Fixed at top) */}
          <div className="flex flex-col gap-[2px] shrink-0">
            <div
              className={`px-1.5 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
                sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Views
            </div>

            {/* Search View Button */}
            <button
              onClick={() => {
                setIsSearchPageOpen(prev => {
                  const next = !prev;
                  if (next) {
                    setIsTasksPageOpen(false);
                    setIsNotesPageOpen(false);
                    setIsRecycleBinOpen(false);
                    setIsAnalyticsPageOpen(false);
                  }
                  return next;
                });
              }}
              data-tooltip={sidebarCollapsed ? "Search" : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isSearchPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isSearchPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <Search
                  className={`w-[17px] h-[17px] ${
                    isSearchPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isSearchPageOpen ? 'text-white font-[600]' : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Search
              </span>
              {!sidebarCollapsed && (
                <kbd
                  className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 h-[19px] rounded-[4px] border leading-none select-none shrink-0 transition-colors ${
                    isSearchPageOpen
                      ? 'bg-white/20 border-white/30 text-white shadow-none'
                      : 'bg-slate-100/90 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-3xs group-hover:border-slate-300 dark:group-hover:border-slate-600'
                  }`}
                >
                  <Command className={`w-[10.5px] h-[10.5px] stroke-[2.3] shrink-0 ${isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className={`text-[10px] font-bold leading-none ${isSearchPageOpen ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>K</span>
                </kbd>
              )}
            </button>

            {/* Notes View Button */}
            <button
              onClick={() => {
                setIsNotesPageOpen(true);
                setIsTasksPageOpen(false);
                setIsSearchPageOpen(false);
                setIsRecycleBinOpen(false);
                setIsAnalyticsPageOpen(false);
              }}
              data-tooltip={sidebarCollapsed ? "Notes" : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isNotesPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isNotesPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <NotebookPen
                  className={`w-[17px] h-[17px] ${
                    isNotesPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isNotesPageOpen ? 'text-white font-[600]' : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Notes
              </span>
              {notes.length > 0 && !sidebarCollapsed && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 min-w-[20px] h-[18px] flex items-center justify-center rounded-full border shrink-0 transition-colors ${
                    isNotesPageOpen
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {notes.length}
                </span>
              )}
            </button>

            {/* Tasks View Button */}
            <button
              onClick={() => {
                setIsTasksPageOpen(true);
                setIsNotesPageOpen(false);
                setIsSearchPageOpen(false);
                setIsRecycleBinOpen(false);
                setIsAnalyticsPageOpen(false);
              }}
              data-tooltip={sidebarCollapsed ? "Tasks" : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isTasksPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isTasksPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <ListTodo
                  className={`w-[17px] h-[17px] ${
                    isTasksPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isTasksPageOpen ? 'text-white font-[600]' : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Tasks
              </span>
              {standaloneTasks.filter(t => !t.completed).length > 0 && !sidebarCollapsed && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 min-w-[20px] h-[18px] flex items-center justify-center rounded-full border shrink-0 transition-colors ${
                    isTasksPageOpen
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {standaloneTasks.filter(t => !t.completed).length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                showToast('Showing starred topics');
              }}
              data-tooltip={sidebarCollapsed ? "Starred" : undefined}
              data-tooltip-side="right"
              className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <Star className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-amber-500 group-hover:fill-amber-500 transition-colors duration-150" strokeWidth={1.75} />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Starred
              </span>
            </button>

            <button
              onClick={() => setIsShortcutsOpen(true)}
              data-tooltip={sidebarCollapsed ? "Shortcut & Guide" : undefined}
              data-tooltip-side="right"
              className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <Keyboard className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150" strokeWidth={1.75} />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Shortcut & Guide
              </span>
            </button>

            <button
              onClick={() => {
                setIsAnalyticsPageOpen(prev => {
                  const next = !prev;
                  if (next) {
                    setIsTasksPageOpen(false);
                    setIsSearchPageOpen(false);
                    setIsNotesPageOpen(false);
                    setIsRecycleBinOpen(false);
                  }
                  return next;
                });
              }}
              data-tooltip={sidebarCollapsed ? "Analytics" : undefined}
              data-tooltip-side="right"
              className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
                isAnalyticsPageOpen
                  ? sidebarCollapsed
                    ? ''
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
              } transition-all duration-150 cursor-pointer shrink-0`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                  isAnalyticsPageOpen && sidebarCollapsed
                    ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                    : ''
                }`}
              >
                <TrendingUp
                  className={`w-[17px] h-[17px] ${
                    isAnalyticsPageOpen
                      ? 'text-white stroke-[2]'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  } transition-colors duration-150`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`truncate leading-tight block font-serif text-[13px] ${
                  isAnalyticsPageOpen ? 'text-white font-[600]' : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                  sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                Analytics
              </span>
            </button>
          </div>

          {/* Section 2: WORKSPACES Header (Fixed) */}
          <div className="h-2 shrink-0" />
          
          <div
            onClick={() => {
              if (!sidebarCollapsed && !isReorderingWorkspaces) {
                toggleWorkspacesCollapse();
              }
            }}
            className={`relative group/ws-header w-full h-6 flex items-center justify-between text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none overflow-hidden whitespace-nowrap transition-opacity duration-200 shrink-0 px-1.5 ${
              sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            } ${!isReorderingWorkspaces ? 'cursor-pointer hover:text-slate-600' : 'cursor-default'}`}
          >
            <div className="flex items-center gap-1.5 min-w-0 pr-14">
              {isReorderingWorkspaces ? (
                <span className="text-[#2563EB] font-extrabold flex items-center gap-1.5">
                  <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </span>
              ) : (
                <>
                  <span>Workspaces({sortedWorkspaces.length})</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isWorkspacesCollapsed ? '-rotate-90 text-slate-400' : 'rotate-0 text-slate-400 group-hover/ws-header:text-slate-600'}`} />
                </>
              )}
            </div>

            {!isReorderingWorkspaces ? (
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/ws-header:opacity-100 transition-opacity shrink-0 z-10">
                {workspaces.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startReorderingWorkspaces();
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                    title="Reorder Workspaces"
                  >
                    <ReorderWorkspacesIcon className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNewWorkspaceOpen(true);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                  title="New Workspace"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 shrink-0 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelReorder();
                  }}
                  className="px-1.5 py-0.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[11px] font-medium transition-all cursor-pointer"
                  title="Cancel Reordering"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoneReorder();
                  }}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#2563EB] text-white hover:bg-blue-700 text-[11px] font-bold transition-all cursor-pointer shadow-3xs"
                  title="Done Reordering"
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>Done</span>
                </button>
              </div>
            )}
          </div>

          {/* Workspaces Scrollable Section (SCROLL IS STRICTLY LIMITED HERE) */}
          <div
            className={`flex-1 min-h-0 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              !isWorkspacesCollapsed || sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none max-h-0'
            }`}
          >
            {isReorderingWorkspaces && !sidebarCollapsed ? (
              /* REORDERING MODE (Master Flat Sequence with Drag & Drop and Instant Up/Down buttons) */
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5">
                {workspaces.map((ws, idx) => {
                  const isDragging = draggedWsIdx === idx;
                  const isDragOver = dragOverWsIdx === idx && draggedWsIdx !== idx;
                  const isDragBelow = draggedWsIdx !== null && draggedWsIdx < idx;
                  return (
                    <div
                      key={ws.id}
                      data-reorder-index={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md px-1.5 gap-1.5 transition-all duration-150 select-none outline-none focus:outline-none focus:ring-0 ${
                        isDragging
                          ? 'opacity-40 scale-[0.98] bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700'
                          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 active:bg-slate-200/60 dark:active:bg-slate-700/60'
                      }`}
                    >
                      {isDragOver && (
                        <div
                          className={`absolute left-1 right-1 h-[2px] bg-[#2563EB] dark:bg-blue-500 rounded-full shadow-sm shadow-blue-500/50 z-30 pointer-events-none ${
                            isDragBelow ? '-bottom-[2px]' : '-top-[2px]'
                          }`}
                        />
                      )}

                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <div
                          onTouchStart={(e) => handleTouchStart(e, idx)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                          className="p-0.5 -ml-0.5 cursor-grab active:cursor-grabbing touch-none flex items-center"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0" />
                        </div>
                        <BookOpen className="w-[15px] h-[15px] text-slate-500 dark:text-slate-400 shrink-0" strokeWidth={1.75} />
                        <span className="truncate font-serif text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-tight">
                          {ws.name}
                        </span>
                        {ws.isPinned && (
                          <Pin className="w-3 h-3 text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500 shrink-0 ml-0.5" title="Pinned" />
                        )}
                      </div>

                      {/* Quick Up/Down Buttons for Desktop precision */}
                      <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveWorkspace(idx, idx - 1)}
                          className={`p-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                            idx === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === workspaces.length - 1}
                          onClick={() => handleMoveWorkspace(idx, idx + 1)}
                          className={`p-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-700 transition-colors outline-none focus:outline-none focus:ring-0 ${
                            idx === workspaces.length - 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain custom-scrollbar flex flex-col gap-[2px] py-0.5">
              {sortedWorkspaces.map(ws => {
                const isActive = ws.id === activeWorkspaceId && !isSearchPageOpen && !isNotesPageOpen && !isTasksPageOpen && !isRecycleBinOpen && !isAnalyticsPageOpen;
                const initialChar = getWorkspaceInitial(ws.name);
                const isBangla = /[\u0980-\u09FF]/.test(initialChar);
                const initialFontSize = isBangla
                  ? initialChar.length > 2
                    ? 'text-[11px] leading-none'
                    : initialChar.length > 1
                    ? 'text-[12px] leading-none tracking-tight'
                    : 'text-[12.5px] leading-none'
                  : 'text-[12.5px] leading-none';

                return (
                  <div
                    key={ws.id}
                    id={`sidebar-workspace-${ws.id}`}
                    className={`relative group w-full h-[32px] min-h-[32px] shrink-0 flex items-center justify-between rounded-md transition-all duration-150 ${
                      activeMenuWorkspaceId === ws.id ? 'z-[100]' : 'z-10'
                    } ${
                      !isActive && !sidebarCollapsed ? 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80' : ''
                    }`}
                  >
                    {/* Smooth sliding background pill - Solid Primary Blue with Subtle Hover Darken */}
                    {isActive && !sidebarCollapsed && (
                      <motion.div
                        layoutId="workspace-active-pill"
                        transition={{ type: 'spring', stiffness: 450, damping: 34, mass: 0.6 }}
                        className="absolute inset-0 rounded-md bg-[#2563EB] group-hover:bg-[#1D4ED8] shadow-sm shadow-blue-500/25 transition-colors duration-150 pointer-events-none"
                        style={{ zIndex: 0 }}
                      />
                    )}

                    <div
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        setIsSearchPageOpen(false);
                        setIsNotesPageOpen(false);
                        setIsTasksPageOpen(false);
                        setIsAnalyticsPageOpen(false);
                        setIsRecycleBinOpen(false);
                      }}
                      data-tooltip={sidebarCollapsed || ws.name.length > 15 ? ws.name : undefined}
                      data-tooltip-side={sidebarCollapsed ? "right" : "bottom"}
                      className="relative z-10 w-full h-full rounded-md flex items-center px-1.5 cursor-pointer select-none transition-all duration-150"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                        {/* Fixed Icon Anchor - 100% Symmetrical Pure Smooth Crossfade */}
                        <div className="w-7 h-7 flex items-center justify-center shrink-0 relative">
                          {/* Collapsed Initial Letter Avatar - Solid Primary Blue with Subtle Hover Darken */}
                          <div
                            className={`absolute inset-0 rounded-md flex items-center justify-center font-serif font-bold ${initialFontSize} transition-all duration-150 ease-out select-none ${
                              sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            } ${
                              isActive
                                ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-950 dark:hover:text-white'
                            }`}
                          >
                            {ws.isPinned ? (
                              <Pin className={`w-3 h-3 ${isActive ? 'text-white fill-white' : 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500'}`} />
                            ) : (
                              initialChar
                            )}
                          </div>

                          {/* Expanded Folder / Pin Icon */}
                          <div
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out ${
                              sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}
                          >
                            {ws.isPinned ? (
                              <Pin
                                className={`w-[15px] h-[15px] shrink-0 transition-colors duration-150 ${
                                  isActive
                                    ? 'text-white fill-white'
                                    : 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500'
                                }`}
                              />
                            ) : (
                              <BookOpen
                                className={`w-[17px] h-[17px] shrink-0 transition-colors duration-150 ${
                                  isActive
                                    ? 'text-white fill-transparent'
                                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                                }`}
                                strokeWidth={1.75}
                              />
                            )}
                          </div>
                        </div>

                        {/* Full-width text reveal with natural ellipsis right up to the edge */}
                        <span
                          className={`truncate leading-tight font-serif text-[13px] transition-all duration-150 ease-out flex-1 text-left ${
                            sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none hidden' : 'min-w-0 flex-1 whitespace-nowrap opacity-100 block'
                          } ${
                            isActive
                              ? 'font-[600] text-white'
                              : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
                          }`}
                        >
                          {ws.name}
                        </span>
                      </div>
                    </div>

                    {/* Google Antigravity Style Floating Action Overlay (3-Dot Menu) */}
                    {!sidebarCollapsed && (
                      <div
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 shrink-0 flex items-center gap-0.5 z-30 transition-all duration-150 ${
                          activeMenuWorkspaceId === ws.id
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                        }`}
                      >

                        <button
                          type="button"
                          onClick={(e) => toggleWorkspaceMenu(ws.id, e)}
                          className={`w-6 h-6 flex items-center justify-center rounded-md transition-all cursor-pointer workspace-menu-btn ${
                            isActive
                              ? activeMenuWorkspaceId === ws.id
                                ? 'opacity-100 bg-white/25 text-white'
                                : 'text-white/80 hover:text-white hover:bg-white/20 opacity-0 group-hover:opacity-100'
                              : activeMenuWorkspaceId === ws.id
                                ? 'opacity-100 bg-slate-300/80 dark:bg-slate-700 text-[#0F172A] dark:text-white'
                                : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-300/80 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100'
                          }`}
                          data-tooltip="Options"
                          data-tooltip-side="top"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>

        {/* Section 3: Bottom Preferences & Data */}
        <div className="px-2 pt-2 pb-1 flex flex-col gap-[2px] shrink-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div
            className={`px-1.5 h-6 flex items-center text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.08em] select-none overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
              sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            Preferences
          </div>

          <button
            onClick={handleExportJSON}
            data-tooltip={sidebarCollapsed ? "Export" : undefined}
            data-tooltip-side="right"
            className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Download className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150" strokeWidth={1.75} />
            </div>
            <span
              className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Export
            </span>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            data-tooltip={sidebarCollapsed ? "Import" : undefined}
            data-tooltip-side="right"
            className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200 transition-all duration-150 cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Upload className="w-[17px] h-[17px] text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150" strokeWidth={1.75} />
            </div>
            <span
              className={`truncate leading-tight block font-serif text-[13px] font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Import
            </span>
          </button>

          <button
            onClick={() => {
              setIsRecycleBinOpen(true);
              setIsTasksPageOpen(false);
              setIsNotesPageOpen(false);
              setIsSearchPageOpen(false);
              setIsAnalyticsPageOpen(false);
            }}
            data-tooltip={sidebarCollapsed ? "Trash" : undefined}
            data-tooltip-side="right"
            className={`group w-full h-[32px] rounded-md flex items-center px-1.5 gap-1.5 ${
              isRecycleBinOpen
                ? sidebarCollapsed
                  ? ''
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                : 'hover:bg-slate-200/75 dark:hover:bg-slate-800/80 text-[#334155] dark:text-slate-200'
            } transition-all duration-150 cursor-pointer shrink-0`}
          >
            <div
              className={`w-7 h-7 flex items-center justify-center shrink-0 transition-all duration-150 ${
                isRecycleBinOpen && sidebarCollapsed
                  ? 'rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25'
                  : ''
              }`}
            >
              <Trash2
                className={`w-[17px] h-[17px] transition-colors duration-150 ${
                  isRecycleBinOpen
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-red-500'
                }`}
                strokeWidth={1.75}
              />
            </div>
            <span
              className={`truncate leading-tight block font-serif text-[13px] ${
                isRecycleBinOpen ? 'font-[600] text-white' : 'font-[500] text-[#334155] dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white'
              } whitespace-nowrap transition-all duration-150 ease-out flex-1 text-left ${
                sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              Trash
            </span>
            {(deletedTopics.length > 0 || deletedWorkspaces.length > 0 || deletedNotes.length > 0 || deletedSections.length > 0 || deletedTasks.length > 0 || deletedTopicNotes.length > 0 || deletedTopicLinks.length > 0) && !sidebarCollapsed && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 min-w-[20px] h-[18px] flex items-center justify-center rounded-full border shrink-0 transition-colors ${
                  isRecycleBinOpen
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {deletedTopics.length + deletedWorkspaces.length + deletedNotes.length + deletedSections.length + deletedTasks.length + deletedTopicNotes.length + deletedTopicLinks.length}
              </span>
            )}
          </button>
        </div>

        {/* Section 4: Minimalist User Profile + Settings Bottom Row (100% Aligned with Sidebar Icons) */}
        <div className="relative user-profile-dropdown-container px-2 pt-1 pb-2 flex flex-col shrink-0 bg-white dark:bg-slate-900">
          {currentUser && (
            <UserProfilePopover
              isOpen={profileMenuTarget === 'sidebar'}
              onClose={() => setProfileMenuTarget(null)}
              currentUser={currentUser}
              isOnline={isOnline}
              currentStreak={streakData.currentStreak}
              dailyGoalPercent={dailyGoalPercent}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onChangePassword={handleChangePassword}
              onSwitchAccount={handleSwitchAccount}
              onSignOut={handleSignOut}
              position="desktop-sidebar"
              isCollapsed={sidebarCollapsed}
            />
          )}

          {currentUser ? (
            <div className={`w-full flex items-center ${sidebarCollapsed ? 'flex-col-reverse gap-1.5' : 'gap-1'}`}>
              <button
                type="button"
                onClick={() => setProfileMenuTarget(prev => prev === 'sidebar' ? null : 'sidebar')}
                data-tooltip={sidebarCollapsed ? (currentUser.displayName || currentUser.email || "Profile") : undefined}
                data-tooltip-side="right"
                className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-2.5 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 transition-all duration-150 cursor-pointer select-none text-left"
              >
                {/* 100% Exact Centered Icon Container */}
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <div className="relative w-[24px] h-[24px]">
                    <div className="w-full h-full rounded-full overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'Avatar'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#3B82F6] to-[#1D4ED8] text-white font-black text-[11px] flex items-center justify-center uppercase">
                          {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                        </div>
                      )}
                    </div>
                    {/* Live Cloud Sync Indicator Dot (Matches Header) */}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-3xs pointer-events-none transition-colors ${
                        isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      title={isOnline ? 'Cloud Synced' : 'Offline Mode (Local Cache)'}
                    />
                  </div>
                </div>

                {/* Minimal 2-Line Profile Details (Reveals on expanded) */}
                <div
                  className={`min-w-0 flex-1 transition-opacity duration-150 ${
                    sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  {/* Line 1: User Name */}
                  <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight group-hover:text-slate-950 dark:group-hover:text-white">
                    {currentUser.displayName || 'Study Flow User'}
                  </div>
                  {/* Line 2: Email or Cloud Status */}
                  <div className="text-[9px] text-slate-400 dark:text-slate-400 truncate leading-tight mt-0.5">
                    {currentUser.email || (isOnline ? 'Cloud Synced' : 'Offline')}
                  </div>
                </div>
              </button>

              {/* Settings Gear Button */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                data-tooltip={sidebarCollapsed ? "Settings" : undefined}
                data-tooltip-side="right"
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/75 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
                title="Settings"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Settings className="w-[17px] h-[17px]" strokeWidth={1.75} />
                </div>
              </button>
            </div>
          ) : (
            <div className={`w-full flex items-center ${sidebarCollapsed ? 'flex-col-reverse gap-1.5' : 'gap-1'}`}>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                data-tooltip={sidebarCollapsed ? "Sign In" : undefined}
                data-tooltip-side="right"
                className="group w-full h-[32px] rounded-md flex items-center px-1.5 gap-2.5 hover:bg-blue-50/80 text-[#2563EB] transition-all duration-150 cursor-pointer select-none text-left"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <LogIn className="w-[17px] h-[17px] text-[#2563EB]" strokeWidth={1.75} />
                </div>
                <span
                  className={`text-[12.5px] leading-tight font-semibold text-[#2563EB] whitespace-nowrap truncate transition-opacity duration-150 ${
                    sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  Sign In
                </span>
              </button>

              {/* Settings Gear Button beside Sign In */}
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                data-tooltip={sidebarCollapsed ? "Settings" : undefined}
                data-tooltip-side="right"
                className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/75 transition-colors cursor-pointer shrink-0"
                title="Settings"
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Settings className="w-[17px] h-[17px]" strokeWidth={1.75} />
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>

          {/* Centered Main Workspace Wrapper */}
          <div className="flex-1 w-full h-full relative bg-[#F8FAFC] overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait" initial={false}>
              {isSearchPageOpen ? (
                <SearchView
                  workspaces={workspaces}
                  topics={topics}
                  workspaceSections={workspaceSections}
                  activeWorkspaceId={activeWorkspaceId}
                  setActiveWorkspaceId={setActiveWorkspaceId}
                  setActiveSection={setActiveSection}
                  setSelectedTopicId={setSelectedTopicId}
                  setDrawerNavigationTarget={setDrawerNavigationTarget}
                  setIsDetailsDrawerOpen={setIsDetailsDrawerOpen}
                  toggleTaskCompleted={toggleTaskCompleted}
                  onClose={() => setIsSearchPageOpen(false)}
                  getTopicTheme={getTopicTheme}
                  onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
                />
          ) : isNotesPageOpen ? (
            <NotesStudio
              notes={notes}
              setNotes={setNotes}
              workspaces={workspaces}
              activeWorkspaceId={activeWorkspaceId}
              onClose={() => setIsNotesPageOpen(false)}
              showToast={showToast}
              onSoftDeleteNote={handleSoftDeleteNote}
              onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
            />
          ) : isTasksPageOpen ? (
            <TasksStudio
              tasks={standaloneTasks}
              onAddTask={handleAddStandaloneTask}
              onToggleTask={handleToggleStandaloneTask}
              onDeleteTask={handleDeleteStandaloneTask}
              onEditTask={handleEditStandaloneTask}
              onClearCompleted={handleClearCompletedStandaloneTasks}
              onClose={() => setIsTasksPageOpen(false)}
              onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
              soundEnabled={userSettings.soundEffects !== false}
            />
          ) : isRecycleBinOpen ? (
            <RecycleBinStudio
              deletedWorkspaces={deletedWorkspaces}
              deletedTopics={deletedTopics}
              deletedNotes={deletedNotes}
              deletedSections={deletedSections}
              deletedTasks={deletedTasks}
              deletedTopicNotes={deletedTopicNotes}
              deletedTopicLinks={deletedTopicLinks}
              workspaces={workspaces}
              onRestoreWorkspace={handleRestoreWorkspace}
              onPermanentDeleteWorkspace={handlePermanentDeleteWorkspace}
              onRestoreTopic={handleRestoreTopic}
              onPermanentDeleteTopic={handlePermanentDeleteTopic}
              onRestoreNote={handleRestoreNote}
              onPermanentDeleteNote={handlePermanentDeleteNote}
              onRestoreSection={handleRestoreSection}
              onPermanentDeleteSection={handlePermanentDeleteSection}
              onRestoreTask={handleRestoreTask}
              onPermanentDeleteTask={handlePermanentDeleteTask}
              onRestoreTopicNote={handleRestoreDrawerNote}
              onPermanentDeleteTopicNote={handlePermanentDeleteDrawerNote}
              onRestoreTopicLink={handleRestoreDrawerLink}
              onEmptyRecycleBin={handleEmptyRecycleBin}
              onClose={() => setIsRecycleBinOpen(false)}
              onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
              showToast={showToast}
              soundEffectsEnabled={userSettings.soundEffects !== false}
            />
          ) : isAnalyticsPageOpen ? (
            <AnalyticsStudio
              topics={topics}
              workspaces={workspaces}
              streakData={streakData}
              userSettings={userSettings}
              onClose={() => setIsAnalyticsPageOpen(false)}
              onSelectTopic={(topicId, workspaceId) => {
                setIsAnalyticsPageOpen(false);
                if (workspaceId !== activeWorkspaceId) {
                  setActiveWorkspaceId(workspaceId);
                }
                setSelectedTopicId(topicId);
                setIsDetailsDrawerOpen(true);
              }}
              showToast={showToast}
            />
          ) : (
            <motion.div
              key="workspace-dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex-1 w-full flex flex-col min-h-full"
            >

              {/* 1. TOP FULL-WIDTH FLUSH HEADER (0 GAP, LEFT TO RIGHT, EXACTLY LIKE SEARCH PAGE) */}
              <header
                onCopy={e => {
                  e.preventDefault();
                }}
                onCut={e => {
                  e.preventDefault();
                }}
                onSelectStart={e => {
                  e.preventDefault();
                }}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                className="no-copy-header shrink-0 h-[56px] sm:h-[60px] min-h-[56px] px-3.5 sm:px-6 bg-white border-b border-slate-200/80 flex items-center justify-between gap-2 sm:gap-4 z-[999] relative select-none w-full [&_*]:select-none"
              >
                
                {/* LEFT: Mobile Hamburger + Premium Minimalist Text Breadcrumb */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 workspace-dropdown-container relative z-20">

                  {/* Mobile Hamburger Menu Button (md:hidden with Border & Clean Box) */}
                  <button
                    type="button"
                    onClick={() => {
                      setTooltipData(null);
                      setIsWorkspaceDropdownOpen(false);
                      setIsMobileWorkspaceDropdownOpen(false);
                      setSidebarCollapsed(prev => !prev);
                    }}
                    className="md:hidden w-[32px] h-[32px] rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-3xs transition-all cursor-pointer select-none shrink-0 mr-0.5"
                    title={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
                  >
                    <Menu className="w-4 h-4 text-slate-700 stroke-[2.3]" />
                  </button>

                  {/* Inline Breadcrumb Segment: Workspace Name › Section Name */}
                  <div className="flex items-center gap-0.5 min-w-0">
                    {/* 1. Workspace Name Segment (Click to switch workspace) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setTooltipData(null);
                          setIsWorkspaceDropdownOpen(false);
                          setIsWorkspaceSwitcherOpen(prev => !prev);
                        }}
                        className={`px-1.5 py-0.5 rounded-md text-[13px] sm:text-[13.5px] font-semibold transition-all cursor-pointer truncate max-w-[110px] min-[400px]:max-w-[140px] sm:max-w-[180px] lg:max-w-[220px] focus:outline-none ${
                          isWorkspaceSwitcherOpen
                            ? 'bg-[#2563EB] text-white shadow-3xs'
                            : 'text-slate-700 hover:text-white hover:bg-[#2563EB] active:bg-blue-700'
                        }`}
                        title="Switch workspace"
                      >
                        {activeWorkspace.name}
                      </button>

                      {/* Workspace Switcher Popover Dropdown */}
                      <AnimatePresence>
                        {isWorkspaceSwitcherOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            transition={{ duration: 0.12, ease: 'easeOut' }}
                            className="absolute left-0 top-full mt-2 w-[210px] sm:w-[230px] bg-white border border-slate-200 shadow-xl shadow-slate-900/10 rounded-xl p-1.5 z-50 text-xs select-none"
                          >
                            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Switch Workspace
                            </div>
                            {workspaces.map(ws => (
                              <div
                                key={ws.id}
                                className={`w-full rounded-lg flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer group ${
                                  ws.id === activeWorkspaceId ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                                onClick={() => {
                                  setActiveWorkspaceId(ws.id);
                                  setIsWorkspaceSwitcherOpen(false);
                                }}
                              >
                                <span className="truncate">{ws.name}</span>
                                {ws.id === activeWorkspaceId && <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />}
                              </div>
                            ))}
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              type="button"
                              onClick={() => {
                                setIsWorkspaceSwitcherOpen(false);
                                setIsNewWorkspaceOpen(true);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 shrink-0" />
                              <span>Create Workspace</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 2. Micro Chevron Divider (Tight Natural Spacing) */}
                    <ChevronRight className="w-3 h-3 text-slate-400 stroke-[2.2] shrink-0 -mx-0.5" />

                    {/* 3. Section Switcher Ghost Pill Segment (Pure text, no down arrow) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsWorkspaceSwitcherOpen(false);
                          setIsWorkspaceDropdownOpen(prev => !prev);
                        }}
                        className={`px-1.5 py-0.5 rounded-md text-[13px] sm:text-[13.5px] font-semibold transition-all cursor-pointer focus:outline-none select-none ${
                          isWorkspaceDropdownOpen
                            ? 'bg-[#2563EB] text-white shadow-3xs'
                            : 'text-slate-700 hover:text-white hover:bg-[#2563EB] active:bg-blue-700'
                        }`}
                        title="Switch section"
                      >
                        <span className="truncate max-w-[90px] min-[400px]:max-w-[120px] sm:max-w-[160px] leading-tight">
                          {activeSection || 'Select Section'}
                        </span>
                      </button>

                      {/* Section Switcher Dropdown */}
                      <AnimatePresence>
                        {isWorkspaceDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.95 }}
                            transition={{ duration: 0.12, ease: 'easeOut' }}
                            className="absolute left-0 top-full mt-2 w-[210px] sm:w-[230px] bg-white border border-slate-200 shadow-xl shadow-slate-900/10 rounded-xl p-1.5 z-50 text-xs select-none"
                          >
                            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Switch Section
                            </div>
                            {currentWorkspaceSections.length === 0 ? (
                              <div className="px-2.5 py-2 text-xs text-slate-400 italic font-medium">
                                No sections created yet
                              </div>
                            ) : (
                              currentWorkspaceSections.map(sec => (
                                <div
                                  key={sec.id || sec.name}
                                  className={`w-full rounded-lg flex items-center justify-between px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer group ${
                                    sec.name === activeSection ? 'bg-blue-50 text-[#2563EB]' : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                  onClick={() => {
                                    setActiveSection(sec.name);
                                    setIsWorkspaceDropdownOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="truncate">{sec.name}</span>
                                    {sec.name === activeSection && <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (activeMenuSection === sec.name) {
                                        setActiveMenuSection(null);
                                        setSectionMenuPos(null);
                                      } else {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setSectionMenuPos({ top: rect.bottom + 4, left: Math.min(rect.left, window.innerWidth - 180) });
                                        setActiveMenuSection(sec.name);
                                      }
                                    }}
                                    className={`p-1 rounded-md transition-colors cursor-pointer shrink-0 ml-1 ${
                                      activeMenuSection === sec.name
                                        ? 'bg-slate-200 text-slate-800'
                                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
                                    }`}
                                    title="Section options"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5 stroke-[2]" />
                                  </button>
                                </div>
                              ))
                            )}
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              onClick={() => {
                                setIsWorkspaceDropdownOpen(false);
                                setIsNewSectionOpen(true);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 shrink-0" />
                              <span>Create Section</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* CENTER: Desktop & Tablet Quick-Search Bar (Centered) */}
                <div className="hidden sm:flex flex-1 items-center justify-center max-w-[380px] md:max-w-[420px] lg:max-w-[460px] mx-auto px-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsSearchPageOpen(true)}
                    className="h-[34px] w-full px-3 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-all cursor-pointer shadow-3xs group"
                    title="Search workspace (⌘K)"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 stroke-[2.2] shrink-0 transition-colors" />
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium group-hover:text-slate-600 dark:group-hover:text-slate-300 truncate">Search topics, tasks, notes...</span>
                    </div>
                    {/* Modern Pill Shortcut Badge */}
                    <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 h-[19px] bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-[5px] text-slate-500 dark:text-slate-400 text-[10.5px] font-bold leading-none shadow-3xs select-none shrink-0 ml-2">
                      <Command className="w-[9px] h-[9px] text-slate-500 dark:text-slate-400 stroke-[2.3]" />
                      <span>K</span>
                    </kbd>
                  </button>
                </div>

                {/* RIGHT: Search Icon (Mobile Only), Bell, Plus Action */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto sm:ml-0 z-10">
                  {/* Mobile Search Icon Button */}
                  <button
                    type="button"
                    onClick={() => setIsSearchPageOpen(true)}
                    className="hidden w-[26px] h-[26px] rounded-[6px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
                    title="Search (⌘K)"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200 stroke-[2.2]" />
                  </button>

                  {/* Bell Notification Button (Hidden on Mobile) */}
                  <div className="relative notification-dropdown-container">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && 'Notification' in window) {
                          setDeviceNotifStatus(Notification.permission);
                        }
                        setIsNotificationPanelOpen(!isNotificationPanelOpen);
                      }}
                      className="hidden sm:flex w-[34px] h-[34px] rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 items-center justify-center text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs relative group"
                      title="Notifications"
                    >
                      <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-white stroke-[2.2]" />
                      {unreadNotifCount > 0 && (
                        <span className={`absolute -top-1.5 -right-1.5 h-[18px] rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs leading-none text-center select-none ${
                          unreadNotifCount > 9 ? 'min-w-[20px] px-1' : 'w-[18px] p-0'
                        }`}>
                          <span className="leading-none flex items-center justify-center text-center">
                            {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                          </span>
                        </span>
                      )}
                    </button>

                    {/* Professional & Premium Notification Panel Dropdown */}
                    <AnimatePresence>
                      {isNotificationPanelOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="fixed inset-x-0 top-[62px] bottom-0 w-full h-[calc(100dvh-62px)] sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[420px] sm:h-auto sm:max-h-[560px] bg-white border-t sm:border border-slate-200/90 shadow-2xl rounded-none sm:rounded-2xl p-0 z-[99999] overflow-hidden text-xs select-none flex flex-col backdrop-blur-xs"
                        >
                          {/* Header */}
                          <div className="px-4 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIsNotificationPanelOpen(false)}
                                className="sm:hidden p-1 -ml-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                                title="Close notifications"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="w-6 h-6 rounded-lg bg-blue-100/90 text-[#176BFF] flex items-center justify-center">
                                <Bell className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-extrabold text-slate-900 text-sm tracking-tight">Notifications</span>
                              {unreadNotifCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#176BFF] border border-blue-200/80 text-[10px] font-bold">
                                  {unreadNotifCount} unread
                                </span>
                              )}
                            </div>
                            {unreadNotifCount > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                }}
                                className="text-[11px] font-bold text-[#176BFF] hover:underline cursor-pointer"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>

                          {/* Device & Lockscreen Push Alert Banner Card (Shown ONLY when notifications are not yet enabled) */}
                          {deviceNotifStatus !== 'granted' && (
                            <div className="p-3 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 border-b border-blue-100/80 shrink-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-xl bg-[#176BFF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 mt-0.5">
                                    <Bell className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-slate-900 text-[11.5px] truncate">
                                      Device & Lockscreen Alerts
                                    </span>
                                    <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                      Receive background study milestone alarms & task due date reminders.
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleToggleDeviceNotifications}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#176BFF] hover:bg-blue-700 text-white font-bold text-[10.5px] transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-1 active:scale-95"
                                >
                                  <Bell className="w-3 h-3" /> Enable Push
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Filter Tabs */}
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-white border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar">
                            {[
                              { id: 'all', label: 'All', count: notifications.length },
                              { id: 'focus', label: 'Study & Focus ⏱️', count: notifications.filter(n => n.type === 'focus').length },
                              { id: 'reminders', label: 'Reminders 📌', count: notifications.filter(n => n.type === 'reminders').length },
                            ].map(tab => (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setNotifFilter(tab.id as any)}
                                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                                  notifFilter === tab.id
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
                                }`}
                              >
                                <span>{tab.label}</span>
                                <span className={`text-[9px] px-1 py-0.2 rounded-md ${
                                  notifFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {tab.count}
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* List */}
                          <div className="flex-1 sm:max-h-[300px] overflow-y-auto divide-y divide-slate-100">
                            {(() => {
                              const filteredList = notifications.filter(n => {
                                if (notifFilter === 'focus') return n.type === 'focus';
                                if (notifFilter === 'reminders') return n.type === 'reminders';
                                return true;
                              });

                              if (filteredList.length === 0) {
                                return (
                                  <div className="py-12 text-center text-slate-400">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                                    <p className="text-xs font-semibold text-slate-600">No notifications in this tab</p>
                                    <p className="text-[10.5px] text-slate-400 mt-0.5">Study check-ins and due dates will appear here</p>
                                  </div>
                                );
                              }

                              return filteredList.map(n => {
                                const isStudy = n.type === 'focus';
                                const isReminder = n.type === 'reminders';

                                return (
                                  <div
                                    key={n.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                                    }}
                                    className={`p-3.5 sm:p-3 flex items-start gap-3 transition-colors cursor-pointer ${
                                      !n.read ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${
                                      isStudy
                                        ? 'bg-blue-100 text-[#176BFF]'
                                        : isReminder
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                      {isStudy ? (
                                        <Timer className="w-4 h-4" />
                                      ) : isReminder ? (
                                        <CalendarDays className="w-4 h-4" />
                                      ) : (
                                        <Sparkles className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs leading-snug ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                                        {n.title}
                                      </p>
                                      {n.description && (
                                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                                          {n.description}
                                        </p>
                                      )}
                                      <span className="text-[9.5px] font-medium text-slate-400 mt-1 block font-mono">{n.time}</span>
                                    </div>
                                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#176BFF] mt-1 shrink-0" />}
                                  </div>
                                );
                              });
                            })()}
                          </div>

                          {/* Footer */}
                          <div className="p-3 sm:p-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between px-4 shrink-0">
                            {deviceNotifStatus === 'granted' ? (
                              <button
                                type="button"
                                onClick={handleToggleDeviceNotifications}
                                className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#176BFF] border border-blue-200/80 text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                                title="Play test audio chime and send test notification"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-[#176BFF]" />
                                <span>Test Push</span>
                              </button>
                            ) : (
                              <div />
                            )}
                            {notifications.length > 0 && (
                              <button
                                onClick={() => {
                                  setNotifications([]);
                                  setIsNotificationPanelOpen(false);
                                }}
                                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                              >
                                Clear all notifications
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Profile / Auth Button */}
                  <div className="relative user-profile-dropdown-container">
                    {currentUser ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setProfileMenuTarget(prev => prev === 'header' ? null : 'header')}
                          className="relative w-[26px] h-[26px] sm:w-[34px] sm:h-[34px] rounded-full border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-900 flex items-center justify-center hover:ring-2 hover:ring-blue-500/25 active:scale-95 transition-all cursor-pointer shadow-xs group shrink-0"
                          title={currentUser.displayName || currentUser.email || 'User profile'}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                            {currentUser.photoURL ? (
                              <img
                                src={currentUser.photoURL}
                                alt={currentUser.displayName || 'Avatar'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-[#3B82F6] to-[#1D4ED8] text-white font-black text-[11px] sm:text-xs flex items-center justify-center uppercase">
                                {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                              </div>
                            )}
                          </div>

                          {/* Live Cloud Sync Indicator Dot */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-3xs pointer-events-none transition-colors ${
                              isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            title={isOnline ? 'Cloud Synced' : 'Offline Mode (Local Cache)'}
                          />
                        </button>

                        {/* User Profile Popover */}
                        <UserProfilePopover
                          isOpen={profileMenuTarget === 'header'}
                          onClose={() => setProfileMenuTarget(null)}
                          currentUser={currentUser}
                          isOnline={isOnline}
                          currentStreak={streakData.currentStreak}
                          dailyGoalPercent={dailyGoalPercent}
                          onOpenEditProfile={() => setIsEditProfileOpen(true)}
                          onChangePassword={handleChangePassword}
                          onSwitchAccount={handleSwitchAccount}
                          onSignOut={handleSignOut}
                          position="header"
                        />
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAuthModalOpen(true)}
                        className="h-[26px] sm:h-[34px] px-2.5 sm:px-3.5 rounded-[6px] sm:rounded-lg bg-gradient-to-tr from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] hover:opacity-95 active:scale-95 text-white text-[11.5px] sm:text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 transition-all shrink-0"
                        title="Sign in with Google or Email"
                      >
                        <LogIn className="w-3.5 h-3.5 shrink-0 stroke-[2.4]" />
                        <span className="hidden sm:inline">Sign In</span>
                      </button>
                    )}
                  </div>
                </div>

              </header>

              {/* 2. SCROLLABLE WORKSPACE CONTAINER (Content Centered at max-w-[1178px]) */}
              <div className="flex-1 w-full overflow-y-auto no-scrollbar pt-4 px-4 sm:pt-6 sm:px-6 pb-2.5 sm:pb-3 flex flex-col">
                <div className="w-full max-w-[1178px] mx-auto flex flex-col gap-3.5 flex-1 min-h-full">

              {/* Fixed 3-Dot Dropdown Menu for Section - Always on Top */}
              <AnimatePresence>
                {activeMenuSection && sectionMenuPos && (
                  <motion.div
                    key={activeMenuSection}
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.1, ease: 'easeOut' }}
                    style={{
                      position: 'fixed',
                      top: `${sectionMenuPos.top}px`,
                      left: `${sectionMenuPos.left}px`,
                      zIndex: 99999,
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-[170px] bg-white border border-slate-200 shadow-xl shadow-slate-900/10 rounded-xl p-1 text-xs font-medium section-menu text-slate-700 select-none"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const sec = activeMenuSection;
                        setActiveMenuSection(null);
                        setSectionMenuPos(null);
                        handleStartRenameSection(sec);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">Rename</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        const sec = activeMenuSection;
                        setActiveMenuSection(null);
                        setSectionMenuPos(null);
                        setSectionToDelete(sec);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-[#EF4444] hover:bg-[#FEE2E2]/60"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                      <span className="truncate">Move to Recycle Bin</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dashboard Workspace Body */}
              <div className="w-full flex flex-col gap-4 min-w-0">
                {/* Top Summary Metrics Row (4 Cards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Metric 1: Workspace Progress (Preserve original blue brand color) */}
                    <div className="preserve-color p-3.5 bg-white dark:bg-slate-900 border-none rounded-[8px] flex items-center gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-200 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5 stroke-[2.2] text-white" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">Workspace Progress</span>
                        <div className="flex items-center justify-between text-xs font-bold gap-2">
                          <div className="w-full bg-[#F1F5F9] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] h-full rounded-full transition-[width] duration-300 ease-in-out"
                              style={{ width: `${workspaceProgressPercent}%` }}
                            />
                          </div>
                          <span className="text-[#2563EB] dark:text-blue-400 font-bold shrink-0">
                            {workspaceProgressPercent}%
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#94A3B8] dark:text-slate-400 truncate">
                          <AnimatedNumber value={completedWorkspaceTasks} /> / <AnimatedNumber value={totalWorkspaceTasks} /> Tasks Completed
                        </span>
                      </div>
                    </div>

                    {/* Metric 2: Section Progress */}
                    <div className="p-3.5 bg-white dark:bg-slate-900 border-none rounded-[8px] flex items-center gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-200 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#C084FC] text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
                        <Folder className="w-5 h-5 stroke-[2.2] text-white" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">Section Progress</span>
                        <div className="flex items-center justify-between text-xs font-bold gap-2">
                          <div className="w-full bg-[#F1F5F9] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#7C36F5] via-[#9333EA] to-[#C084FC] h-full rounded-full transition-[width] duration-300 ease-in-out"
                              style={{ width: `${sectionProgressPercent}%` }}
                            />
                          </div>
                          <span className="text-[#9333EA] dark:text-purple-400 font-bold shrink-0">
                            {sectionProgressPercent}%
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#94A3B8] dark:text-slate-400 truncate">
                          <AnimatedNumber value={completedSectionTasks} /> / <AnimatedNumber value={totalSectionTasks} /> Tasks ({activeSection})
                        </span>
                      </div>
                    </div>

                    {/* Metric 3: Today's Goal (Interactive Popover Trigger) */}
                    <div className="relative">
                      <div
                        data-goal-card="true"
                        onClick={() => setIsGoalPopoverOpen(prev => !prev)}
                        className="p-3.5 bg-white dark:bg-slate-900 border-none rounded-[8px] flex items-center gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none group"
                        title="Click to view Today's Goal breakdown & settings"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#059669] via-[#10B981] to-[#34D399] text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                          <Target className="w-5 h-5 stroke-[2.4] text-white" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 truncate">Today's Goal</span>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none shrink-0">
                              {dailyGoalMode === 'time' ? '⏱️ Time' : '🎯 Tasks'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold gap-2">
                            <div className="w-full bg-[#F1F5F9] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#34D399] h-full rounded-full transition-[width] duration-300 ease-in-out"
                                style={{ width: `${dailyGoalPercent}%` }}
                              />
                            </div>
                            <span className="text-[#10B981] dark:text-emerald-400 font-bold shrink-0">
                              {dailyGoalPercent}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-[#94A3B8] dark:text-slate-400 truncate">
                            <span className="truncate">
                              {dailyGoalMode === 'time' ? (
                                `${formatGoalDuration(globalTotalStudyMinutesToday)} / ${formatGoalDuration(dailyTimeTargetMinutes)}`
                              ) : (
                                <><AnimatedNumber value={globalCompletedTasksToday} /> / {dailyTarget} Tasks</>
                              )}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                              {dailyGoalPercent >= 100 ? 'Achieved 🏆' : `${Math.max(0, targetGoalValue - currentGoalValue)} left`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <TodaysGoalPopover
                        isOpen={isGoalPopoverOpen}
                        onClose={() => setIsGoalPopoverOpen(false)}
                        currentMode={dailyGoalMode}
                        onToggleMode={handleUpdateDailyGoalMode}
                        completedTasksToday={globalCompletedTasksToday}
                        dailyTaskTarget={dailyTarget}
                        onUpdateTaskTarget={handleUpdateTaskTarget}
                        totalStudyMinutesToday={globalTotalStudyMinutesToday}
                        dailyTimeTargetMinutes={dailyTimeTargetMinutes}
                        onUpdateDailyTimeTarget={handleUpdateDailyTimeTarget}
                        workspacesStats={workspacesStats}
                        activeWorkspaceId={activeWorkspaceId}
                        onSelectWorkspace={(wsId) => setActiveWorkspaceId(wsId)}
                        onNavigateToTask={handleNavigateToGoalTask}
                        streakDays={streakData.currentStreak}
                      />
                    </div>

                    {/* Metric 4: Streak (Interactive Popover Trigger) */}
                    <div className="relative">
                      <div
                        data-streak-card="true"
                        onClick={() => setIsStreakPopoverOpen(prev => !prev)}
                        title="Click to view Streak Dashboard & Freezes"
                        className="p-3.5 bg-white dark:bg-slate-900 border-none rounded-[8px] flex items-center gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-[6px] flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
                          <Flame className="w-5 h-5 fill-white" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#0F172A] truncate">Streak</span>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#EA580C] dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/40 shrink-0">
                              {streakData.currentStreak > 0 ? '🔥 Active' : '⚡ Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold gap-2">
                            <div className="w-full bg-[#F1F5F9] dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#FDBA74] h-full rounded-full transition-[width] duration-300 ease-in-out"
                                style={{ width: `${streakData.currentStreak > 0 ? Math.min(100, Math.max(15, ((streakData.currentStreak % 7 || 7) / 7) * 100)) : 0}%` }}
                              />
                            </div>
                            <span className="text-[#EA580C] dark:text-orange-400 font-bold shrink-0 text-xs">
                              {streakData.currentStreak} {streakData.currentStreak === 1 ? 'Day' : 'Days'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-[#94A3B8] truncate">
                            <span className="truncate">
                              {streakData.currentStreak > 0 ? 'Keep it up! 🔥' : 'Start your streak! ⚡'}
                            </span>
                            {streakData.bestStreak > 0 && (
                              <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                                Best: {streakData.bestStreak}d
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <StreakPopover
                        isOpen={isStreakPopoverOpen}
                        onClose={() => setIsStreakPopoverOpen(false)}
                        streakData={streakData}
                        onStreakUpdate={(updated) => setStreakData(updated)}
                        isTodayGoalAchieved={isDailyGoalAchieved}
                      />
                    </div>
                  </div>

                  {/* Smart Topic Generator Banner */}
                  <div className="p-4 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[8px] flex flex-col gap-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                        <h3 className="text-xs font-bold text-[#0F172A]">
                          Smart Topic Generator
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsGeneratorSyntaxHelpOpen(!isGeneratorSyntaxHelpOpen)}
                        className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Syntax Guide</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isGeneratorSyntaxHelpOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Format Guide Help Box with 100% Native CSS Grid Animation (Identical to Add Note / Add Link) */}
                    <div
                      className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isGeneratorSyntaxHelpOpen ? 'grid-rows-[1fr] opacity-100 mb-1' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-700 space-y-2 select-none">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11.5px]">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Supported Formatting Syntax:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="p-2 bg-white rounded border border-slate-200/80">
                              <span className="font-bold text-blue-600"># Topic Name</span>
                              <p className="text-[10.5px] font-sans text-slate-500 mt-0.5">Creates Topic title & Topic Notes/Links</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-slate-200/80">
                              <span className="font-bold text-indigo-600">## Task Name</span>
                              <p className="text-[10.5px] font-sans text-slate-500 mt-0.5">Creates Task under Topic</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-slate-200/80">
                              <span className="font-bold text-emerald-600">$ Task Description</span>
                              <p className="text-[10.5px] font-sans text-slate-500 mt-0.5">Adds description to current Task</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-slate-200/80">
                              <span className="font-bold text-amber-600">&gt; Note Text</span>
                              <p className="text-[10.5px] font-sans text-slate-500 mt-0.5">Adds Note to Topic or Task</p>
                            </div>
                            <div className="p-2 bg-white rounded border border-slate-200/80 col-span-1 sm:col-span-2">
                              <span className="font-bold text-purple-600">@ Title | URL</span>
                              <p className="text-[10.5px] font-sans text-slate-500 mt-0.5">Adds Link to Topic or Task (e.g., <code className="text-purple-700 bg-purple-50 px-1 rounded">@ Docs | drive.google.com/file</code>)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative w-full">
                      <form onSubmit={handleQuickAddTopic} className="flex flex-row gap-2 sm:gap-3 items-center w-full">
                        <textarea
                          ref={el => {
                            (generatorInputRef as any).current = el;
                            if (el) {
                              if (!el.value.includes('\n')) {
                                el.style.height = '34px';
                              } else {
                                el.style.height = 'auto';
                                el.style.height = `${Math.max(34, Math.min(el.scrollHeight, 130))}px`;
                              }
                            }
                          }}
                          value={generatorInput}
                          onChange={e => {
                            setGeneratorInput(e.target.value);
                            const el = e.target;
                            if (!el.value.includes('\n')) {
                              el.style.height = '34px';
                            } else {
                              el.style.height = 'auto';
                              el.style.height = `${Math.max(34, Math.min(el.scrollHeight, 130))}px`;
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleQuickAddTopic(e);
                            }
                          }}
                          placeholder="Type topic name (e.g. শতকরা, সংবিধান, Physics[3])..."
                          rows={1}
                          className="flex-1 min-w-0 h-[34px] min-h-[34px] max-h-[120px] box-border py-[6px] px-3 sm:px-3.5 bg-white border border-[#E2E8F0] rounded-[6px] text-xs text-[#0F172A] placeholder-[#94A3B8] placeholder:whitespace-nowrap placeholder:truncate shadow-2xs focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-[height] duration-150 resize-none leading-[20px] smart-tg-input overflow-y-auto m-0"
                        />
                        <button
                          type="submit"
                          disabled={isGenerating}
                          className="h-[34px] min-h-[34px] max-h-[34px] box-border px-3.5 sm:px-5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] text-white rounded-[6px] text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shrink-0 cursor-pointer m-0"
                        >
                          {isGenerating ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.div>
                          ) : (
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                          <span className="whitespace-nowrap">{isGenerating ? 'Generating...' : 'Generate'}</span>
                        </button>
                      </form>

                      {/* Smart Topic Auto-Suggestions Popover Menu */}
                      <AnimatePresence>
                        {(() => {
                          const query = generatorInput.trim().toLowerCase();
                          if (!query || query.length < 1 || query.includes('\n') || query.startsWith('#') || query.startsWith('@') || query.startsWith('$') || query.startsWith('>')) {
                            return null;
                          }

                          // Comprehensive Syllabus Suggestion Dataset across all 25 Subjects
                          const syllabusPool = [
                            // 1. বাংলা ব্যাকরণ
                            'বাংলা ব্যাকরণ (Bangla Grammar)', 'ধ্বনি ও বর্ণ প্রকরণ', 'সন্ধি বিচ্ছেদ ও নিয়ম', 'সমাস ও ব্যাসবাক্য', 'কারক ও বিভক্তি', 'প্রত্যয় ও উপসর্গ', 'বাগধারা ও প্রবাদ-প্রবচন', 'সমার্থক ও বিপরীতার্থক শব্দ', 'এককথায় প্রকাশ', 'শুদ্ধ বানান ও বাক্য শুদ্ধিকরণ', 'যতি ও বিরামচিহ্ন', 'বাচ্য ও উক্তি পরিবর্তন',
                            // 2. বাংলা সাহিত্য
                            'বাংলা সাহিত্য (Bangla Literature)', 'চর্যাপদ ও প্রাচীন যুগ', 'শ্রীকৃষ্ণকীর্তন ও মঙ্গলকাব্য', 'বৈষ্ণব পদাবলী ও রোমান্টিক প্রণয়োপাখ্যান', 'আধুনিক যুগ ও ঈশ্বরচন্দ্র বিদ্যাসাগর', 'মাইকেল মধুসূদন দত্ত', 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়', 'রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জীবনানন্দ দাশ', 'জসীম উদ্‌দীন', 'হুমায়ূন আহমেদ',
                            // 3. English Grammar
                            'English Grammar', 'Parts of Speech', 'Right Form of Verbs', 'Tense & Sequence of Tenses', 'Voice Change (Active & Passive)', 'Narration & Direct-Indirect Speech', 'Appropriate Preposition', 'Synonyms & Antonyms', 'Idioms & Phrases', 'One Word Substitution', 'Spelling Correction & Vocabulary', 'Conditional Sentences', 'Clauses & Phrases',
                            // 4. English Literature
                            'English Literature', 'Literary Terms & Figures of Speech', 'Elizabethan & Jacobean Age', 'William Shakespeare & Plays', 'Romantic Age & Poets', 'Victorian Age & Novels', 'Modern & Postmodern Literature', 'T.S. Eliot & W.B. Yeats', 'George Bernard Shaw',
                            // 5. গণিত / Mathematics
                            'গণিত (Mathematics)', 'শতকরা (Percentage)', 'লাভ-ক্ষতি (Profit & Loss)', 'অনুপাত ও সমানুপাত (Ratio & Proportion)', 'ঐকিক নিয়ম (Unitary Method)', 'ভগ্নাংশ ও দশমিক', 'ট্রেন সংক্রান্ত সমস্যা (Train)', 'নৌকা ও স্রোত (Boat & Stream)', 'নল ও চৌবাচ্চা (Pipe & Cistern)', 'কাজ ও সময় (Work & Time)', 'ঘড়ি ও ক্যালেন্ডার (Clock & Calendar)', 'বয়স সংক্রান্ত সমস্যা (Age)', 'জ্যামিতি ও ক্ষেত্রফল (Geometry)', 'ত্রিকোণমিতি ও উচ্চতা (Trigonometry)', 'বীজগণিতীয় সূত্র ও সমীকরণ (Algebra)', 'লগারিদম ও সূচক (Logarithm & Exponents)', 'বিন্যাস ও সমাবেশ (Permutation & Combination)', 'সম্ভাবনা ও পরিসংখ্যান (Probability & Statistics)',
                            // 6. মানসিক দক্ষতা / Mental Ability
                            'মানসিক দক্ষতা (Mental Ability)', 'ভাষাগত যৌক্তিক বিচার', 'রক্ত সম্পর্ক (Blood Relation)', 'দিক নির্ণয় ও কম্পাস (Direction Sense)', 'চিত্র ও প্রতিবিম্ব (Mirror & Water Images)', 'ঘনক ও পাশা (Cube & Dice)', 'যুক্তি ও ধাঁধা (Reasoning & Puzzles)', 'কোডিং ও ডিকোডিং (Coding-Decoding)', 'সংখ্যা ও বর্ণ সিরিজ (Number & Letter Series)',
                            // 7. বাংলাদেশ বিষয়াবলি
                            'বাংলাদেশ বিষয়াবলি (Bangladesh Affairs)', 'প্রাচীন বাংলার ইতিহাস ও জনপদ', 'পলাশীর যুদ্ধ ও ব্রিটিশ শাসন', 'ভাষা আন্দোলন ও যুক্তফ্রন্ট', '৬ দফা আন্দোলন ও গণঅভ্যুত্থান', 'বাংলাদেশের নদ-নদী ও ভূ-প্রকৃতি', 'আদমশুমারি ও উপজাতি',
                            // 8. আন্তর্জাতিক বিষয়াবলি
                            'আন্তর্জাতিক বিষয়াবলি (International Affairs)', 'জাতিসংঘ ও বিশ্ব সংস্থা (UN & Treaties)', 'বিশ্ব রাজনীতি ও ভূ-রাজনীতি (Geopolitics)', 'সার্ক, আসিয়ান ও ন্যাটো (SAARC, ASEAN, NATO)', 'প্রথম ও দ্বিতীয় বিশ্বযুদ্ধ', 'আন্তর্জাতিক চুক্তি ও সম্মেলন', 'বিশ্বের প্রণালী, খাল ও দ্বীপ',
                            // 9. সাধারণ বিজ্ঞান
                            'সাধারণ বিজ্ঞান (General Science)', 'পদার্থের অবস্থা ও গতিবিদ্যা (Physics)', 'আলো, শব্দ ও তরঙ্গ (Light & Sound)', 'রসায়ন ও রাসায়নিক বিক্রিয়া (Chemistry)', 'পরমাণু ও পর্যায় সারণি', 'জীববিজ্ঞান ও কোষ গঠন (Biology)', 'জিনতত্ত্ব ও ডিএনএ (Genetics & DNA)', 'মানবদেহ ও রোগব্যাধি (Health & Anatomy)', 'খাদ্য ও ভিটামিন (Nutrition)',
                            // 10. ICT / Computer
                            'তথ্য ও যোগাযোগ প্রযুক্তি (ICT & Computer)', 'কম্পিউটার হার্ডওয়্যার ও সিপিইউ (Hardware & CPU)', 'অপারেটিং সিস্টেম ও সফটওয়্যার', 'সাইবার নিরাপত্তা ও ম্যালওয়্যার (Cyber Security)', 'কম্পিউটার নেটওয়ার্ক ও টপোলজি (Networking)', 'ইন্টারনেট ও ডাটাবেজ (Database & SQL)', 'কৃত্রিম বুদ্ধিমত্তা ও ক্লাউড কম্পিউটিং (AI & Cloud)',
                            // 11. ভূগোল
                            'ভূগোল ও ভূ-প্রকৃতি (Geography)', 'বাংলাদেশের নদ-নদী ও জলপ্রপাত', 'বায়ুমণ্ডল ও জলবায়ু মণ্ডল', 'ভূমিকম্প ও ভূ-অভ্যন্তর',
                            // 12. পরিবেশ
                            'পরিবেশ ও বাস্তুসংস্থান (Environment & Ecology)', 'জীববৈচিত্র্য ও সুন্দরবন', 'পরিবেশ দূষণ ও প্রতিকার', 'জলবায়ু পরিবর্তন ও কপ সম্মেলন (COP)',
                            // 13. দুর্যোগ ব্যবস্থাপনা
                            'দুর্যোগ ব্যবস্থাপনা (Disaster Management)', 'ঘূর্ণিঝড় ও বন্যা ব্যবস্থাপনা', 'ভূমিকম্প ও ভূমিধস পূর্বপ্রস্তুতি', 'দুর্যোগ ঝুঁকি হ্রাস ও পুনর্বাসন',
                            // 14. নৈতিকতা
                            'নৈতিকতা ও সততা (Ethics & Integrity)', 'পেশাগত ও চিকিৎসা নৈতিকতা', 'দুর্নীতি প্রতিরোধ ও প্রতিকার',
                            // 15. মূল্যবোধ
                            'মূল্যবোধ ও শিষ্টাচার (Values & Morality)', 'গণতান্ত্রিক ও সামাজিক মূল্যবোধ', 'সহমর্মিতা ও দেশপ্রেম',
                            // 16. সুশাসন
                            'সুশাসন ও নাগরিক চার্টার (Good Governance)', 'আইনের শাসন ও মানবাধিকার', 'দুদক ও স্বচ্ছতা-জবাবদিহিতা', 'ই-গভর্ন্যান্স ও ডিজিটাল সেবা',
                            // 17. Current Affairs / সাম্প্রতিক বিষয়
                            'সাম্প্রতিক বিষয়াবলী (Current Affairs)', 'সাম্প্রতিক অর্থনৈতিক সমীক্ষা ও বাজেট', 'সাম্প্রতিক আন্তর্জাতিক চুক্তি ও শীর্ষ সম্মেলন', 'সাম্প্রতিক বিজ্ঞান উদ্ভাবন ও পদক',
                            // 18. সাধারণ জ্ঞান
                            'সাধারণ জ্ঞান (General Knowledge)', 'বিশ্বের প্রাচীনতম ও বৃহত্তম বিস্ময়', 'বিখ্যাত আবিষ্কার ও আবিষ্কারক', 'বিশ্বের রাজধানী, মুদ্রা ও সংসদ',
                            // 19. ইতিহাস
                            'বিশ্ব ইতিহাস ও প্রাচীন সভ্যতা (World History)', 'শিল্প বিপ্লব ও রেনেসাঁ', 'ফরাসি বিপ্লব ও রুশ বিপ্লব', 'উপনিবেশবাদ ও স্বাধীনতা সংগ্রাম',
                            // 20. সংবিধান ও সরকার
                            'বাংলাদেশের সংবিধান (Constitution of Bangladesh)', 'সংবিধানের মৌলিক অধিকার ও অনুচ্ছেদ', 'জাতীয় সংসদ ও সরকার ব্যবস্থা', 'বিচার বিভাগ ও সুপ্রিম কোর্ট', 'নির্বাচন কমিশন ও সাংবিধানিক পদ',
                            // 21. অর্থনীতি
                            'অর্থনীতি ও জাতীয় আয় (Economy & GDP)', 'মুদ্রাস্ফীতি ও রাজস্ব নীতি', 'আমদানি, রপ্তানি ও বৈদেশিক বাণিজ্য', 'পঞ্চবার্ষিক পরিকল্পনা ও বাজেট',
                            // 22. ব্যাংকিং
                            'ব্যাংকিং ব্যবস্থা ও কেন্দ্রীয় ব্যাংক (Banking System)', 'বাংলাদেশ ব্যাংক ও মুদ্রানীতি', 'বাণিজ্যিক ব্যাংক ও ইসলামী ব্যাংকিং', 'অনলাইন ব্যাংকিং ও এমএফএস (MFS)',
                            // 23. কৃষি
                            'কৃষি প্রযুক্তি ও প্রধান খাদ্যশস্য (Agriculture)', 'অর্থকরী ফসল ও উন্নত বীজ (উফশী)', 'মৎস্য ও প্রাণিসম্পদ উন্নয়ন',
                            // 24. মুক্তিযুদ্ধ
                            'মুক্তিযুদ্ধ ও স্বাধীনতা (Liberation War 1971)', '৭ই মার্চের ভাষণ ও ২৫শে মার্চ অপারেশন সার্চলাইট', 'মুজিবনগর সরকার ও ১১টি সেক্টর', 'বীরশ্রেষ্ঠ ও জাতীয় বীরগণ', '১৬ই ডিসেম্বর বিজয় দিবস ও বুদ্ধিজীবী দিবস',
                            // 25. খেলাধুলা
                            'খেলাধুলা ও আন্তর্জাতিক ক্রীড়া (Sports & Athletics)', 'ক্রিকেট ও আইসিসি বিশ্বকাপ', 'ফিফা বিশ্বকাপ ও ফুটবল টুর্নামেন্ট', 'অলিম্পিক গেমস ও বিশ্বরেকর্ড'
                          ];

                          const matched = syllabusPool.filter(item => item.toLowerCase().includes(query)).slice(0, 5);

                          if (matched.length === 0) return null;

                          return (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.98 }}
                              transition={{ duration: 0.15, ease: 'easeOut' }}
                              className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 p-1.5 z-50 flex flex-col gap-1 select-none"
                            >
                              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-100 mb-0.5">
                                <span className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-blue-500" />
                                  Smart Suggestions ({matched.length})
                                </span>
                                <span>Click to fill & preview</span>
                              </div>
                              {matched.map(item => {
                                const cleanName = item.split('(')[0].trim();
                                const theme = getTopicTheme(cleanName);
                                const IconComp = theme.icon || BookOpen;

                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                      setGeneratorInput(cleanName);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-100/90 transition-colors group cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className={`w-6.5 h-6.5 rounded-lg ${theme.cardIconBg} flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                                        <IconComp className="w-3.5 h-3.5 stroke-[2.2]" />
                                      </div>
                                      <span className="text-[11px] font-serif font-semibold text-slate-800 truncate group-hover:text-blue-600">
                                        {item}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                      <div className={`w-2 h-2 rounded-full ${theme.bg}`} />
                                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">
                                        Use
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* --- UNIFIED MASTER TOPICS CANVAS CONTAINER / EMPTY STATE --- */}
                  {filteredTopics.length === 0 ? (
                    <div className="w-full border-2 border-dashed border-[#E2E8F0] dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60 py-6 sm:py-8 md:py-9 px-6 flex flex-col items-center justify-center text-center relative select-none">
                      {/* Illustration Graphic */}
                      <div className="relative w-[112px] h-[112px] flex items-center justify-center mb-4 shrink-0">
                        {/* Background Aura */}
                        <div 
                          className="absolute inset-0 rounded-full border shadow-inner transition-colors duration-300" 
                          style={{
                            backgroundColor: 'var(--folder-aura-bg, rgba(238, 244, 255, 0.8))',
                            borderColor: 'var(--folder-aura-border, rgba(219, 234, 254, 0.5))'
                          }}
                        />
                        
                        {/* Floating Sparkles & Accent Shapes */}
                        <div className="absolute top-0 right-2 w-2.5 h-2.5 bg-pink-300/80 rotate-45 rounded-[2px] animate-pulse" />
                        <div className="absolute top-4 left-2 w-2 h-2 bg-pink-300/70 rotate-45 rounded-[2px]" />
                        <div className="absolute bottom-4 right-3 w-2.5 h-2.5 bg-orange-300/80 rotate-45 rounded-[2px]" />
                        <div className="absolute bottom-5 left-2 w-2 h-2 bg-purple-300/70 rotate-45 rounded-[2px]" />

                        {/* 3D Soft Folder Graphic with document pages */}
                        <div className="relative z-10 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                          <div 
                            className="relative w-[72px] h-[54px] rounded-xl flex items-center justify-center transition-all duration-300"
                            style={{
                              backgroundImage: 'var(--folder-back-grad, linear-gradient(to top right, #3B82F6, #60A5FA, #93C5FD))',
                              boxShadow: '0 10px 15px -3px var(--folder-shadow, rgba(37, 99, 235, 0.25))'
                            }}
                          >
                            {/* Top Folder Tab */}
                            <div 
                              className="absolute -top-2 left-2 w-7 h-2.5 rounded-t-md transition-colors duration-300" 
                              style={{
                                backgroundColor: 'var(--folder-tab-color, #60A5FA)'
                              }}
                            />
                            
                            {/* Paper sheet popping out */}
                            <div className="absolute -top-3 w-10 h-9 bg-white dark:bg-slate-800 rounded-t-lg shadow-xs border border-slate-100 dark:border-slate-700 flex flex-col p-1 gap-0.5 transform -rotate-3">
                              <div className="w-7 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                              <div className="w-5 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                              <div 
                                className="w-6 h-1 rounded-full transition-colors duration-300" 
                                style={{
                                  backgroundColor: 'var(--folder-line-color, #93C5FD)'
                                }}
                              />
                            </div>

                            {/* Front Flap */}
                            <div 
                              className="absolute inset-0 rounded-xl flex items-center justify-center opacity-95 border-t border-white/30 transition-all duration-300"
                              style={{
                                backgroundImage: 'var(--folder-front-grad, linear-gradient(to top right, #2563EB, #60A5FA))'
                              }}
                            >
                              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-2xs">
                                <div className="w-2 h-2 rounded-full bg-white/90" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Text Info */}
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
                        No topics found yet
                      </h3>
                      
                      <p className="text-xs text-[#64748B] dark:text-slate-300 font-medium mt-1.5 max-w-xl text-center leading-relaxed">
                        You haven't created any topics in this section. Create your first topic to get started and keep your learning organized.
                      </p>

                      {/* Primary Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setNewTopicTitle('');
                          setIsNewTopicOpen(true);
                        }}
                        className="h-[36px] px-6 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] text-white text-xs font-bold rounded-[6px] shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-5 shrink-0"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add New Topic</span>
                      </button>

                      {/* Secondary Link Button */}
                      <button
                        type="button"
                        onClick={() => setIsShortcutsOpen(true)}
                        className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1.5 mt-2.5 py-1 px-2 rounded-md hover:bg-blue-50/50 dark:hover:bg-blue-950/50"
                      >
                        <Target className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                        <span>Learn how topics work</span>
                        <span className="text-sm">→</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-visible">
                      {/* Integrated Docked Toolbar Header (Mac Glass & Strict 32px Symmetrical Height) */}
                      <div className="flex items-center justify-between gap-2 px-2.5 py-2 sm:px-3.5 sm:py-2 bg-slate-50/80 backdrop-blur-xs border-b border-slate-200/90 rounded-t-[9px] relative z-30 select-none">
                      
                      {/* DESKTOP: Status Pill Filters (Connected Segmented Control) */}
                      <div className="hidden min-[660px]:inline-flex items-center p-0.5 bg-slate-200/50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 rounded-lg relative shrink-0 h-8 max-w-full overflow-x-auto no-scrollbar">
                        {/* Option: All */}
                        <button
                          onClick={() => handleStatusFilterChange('all')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'all' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'all' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'all' ? 'bg-white' : 'bg-slate-900 dark:bg-slate-300'}`} />
                            <span>All</span>
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'all' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countAll} />
                          </span>
                        </button>

                        {/* Option: Completed */}
                        <button
                          onClick={() => handleStatusFilterChange('completed')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'completed' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'completed' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#10B981] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'completed' ? 'bg-white' : 'bg-[#10B981]'}`} />
                            Completed
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'completed' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countCompleted} />
                          </span>
                        </button>

                        {/* Option: In Progress */}
                        <button
                          onClick={() => handleStatusFilterChange('in_progress')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'in_progress' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'in_progress' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'in_progress' ? 'bg-white' : 'bg-[#2563EB]'}`} />
                            In Progress
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'in_progress' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countInProgress} />
                          </span>
                        </button>

                        {/* Option: Not Started */}
                        <button
                          onClick={() => handleStatusFilterChange('not_started')}
                          className={`relative px-2.5 h-full rounded-md text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 z-10 ${
                            statusFilter === 'not_started' ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {statusFilter === 'not_started' && (
                            <motion.div
                              layoutId="activeStatusFilterTab"
                              className="absolute inset-0 bg-[#64748B] rounded-md shadow-2xs z-0"
                              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'not_started' ? 'bg-white' : 'bg-[#64748B]'}`} />
                            Not Started
                          </span>
                          <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${statusFilter === 'not_started' ? 'bg-white/25 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <AnimatedNumber value={countNotStarted} />
                          </span>
                        </button>
                      </div>

                      {/* MOBILE: Smart Status Filter Dropdown Button */}
                      <div className="relative min-[660px]:hidden filter-dropdown-container">
                        <button
                          type="button"
                          onClick={() => setIsStatusFilterDropdownOpen(!isStatusFilterDropdownOpen)}
                          className={`h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                            isStatusFilterDropdownOpen
                              ? 'bg-blue-50 border-blue-300 text-[#2563EB] ring-2 ring-blue-500/15'
                              : statusFilter !== 'all'
                                ? 'bg-blue-50/70 border-blue-300 text-[#2563EB]'
                                : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Filter className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="truncate">
                              {statusFilter === 'all'
                                ? 'Filter'
                                : statusFilter === 'completed'
                                  ? 'Completed'
                                  : statusFilter === 'in_progress'
                                    ? 'In Progress'
                                    : 'Not Started'}
                            </span>
                            {statusFilter !== 'all' && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  statusFilter === 'completed'
                                    ? 'bg-[#10B981]'
                                    : statusFilter === 'in_progress'
                                      ? 'bg-[#2563EB]'
                                      : 'bg-[#64748B]'
                                }`}
                              />
                            )}
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isStatusFilterDropdownOpen ? 'rotate-180 text-[#2563EB]' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {isStatusFilterDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.12, ease: 'easeOut' }}
                              className="absolute left-0 top-full mt-1.5 w-[200px] bg-white border border-slate-200 shadow-xl shadow-slate-900/10 rounded-xl p-1 z-50 text-xs font-medium filter-dropdown text-slate-700 select-none"
                            >
                              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Filter Status
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('all');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'all' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                  <span>All</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                  {countAll}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('completed');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'completed' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>Completed</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                  {countCompleted}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('in_progress');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'in_progress' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                  <span>In Progress</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                  {countInProgress}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleStatusFilterChange('not_started');
                                  setIsStatusFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors cursor-pointer my-0.5 ${
                                  statusFilter === 'not_started' ? 'bg-slate-100 text-slate-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                  <span>Not Started</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                  {countNotStarted}
                                </span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* View Controls & Sort (Right-aligned with strict 32px height) */}
                      <div className="flex items-center gap-2 shrink-0 ml-auto">
                        <CustomSelect<'date' | 'name' | 'progress'>
                          value={sortCategory}
                          onChange={(val) => handleSortSelect(val)}
                          labelPrefix="Sort: "
                          options={[
                            {
                              value: 'date',
                              label: sortCategory === 'date'
                                ? (sortDirection === 'desc' ? 'Date (New → Old)' : 'Date (Old → New)')
                                : 'Date',
                              icon: <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            },
                            {
                              value: 'name',
                              label: sortCategory === 'name'
                                ? (sortDirection === 'asc' ? 'Name (A → Z)' : 'Name (Z → A)')
                                : 'Name',
                              icon: <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                            },
                            {
                              value: 'progress',
                              label: sortCategory === 'progress'
                                ? (sortDirection === 'desc' ? 'Progress (High → Low)' : 'Progress (Low → High)')
                                : 'Progress',
                              icon: <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                            },
                          ]}
                        />

                        <div className="flex items-center p-0.5 bg-slate-200/50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 rounded-lg relative shrink-0 h-8">
                          <button
                            type="button"
                            onClick={() => handleViewModeChange('grid-cards')}
                            className={`relative w-7 h-7 min-[800px]:w-auto min-[800px]:h-7 px-0 min-[800px]:px-2.5 rounded-md transition-colors cursor-pointer flex items-center justify-center min-[800px]:justify-start gap-0 min-[800px]:gap-1.5 z-10 ${
                              viewMode.startsWith('grid')
                                ? 'text-white font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                            }`}
                            title={viewMode === 'grid-cards' ? 'Current: 4-Col Image Grid (Click for Banner Grid)' : 'Current: Banner Grid (Click for 4-Col Image Grid)'}
                          >
                            {viewMode.startsWith('grid') && (
                              <motion.div
                                layoutId="activeViewTab"
                                className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                                transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                              />
                            )}
                            <LayoutGrid className="w-3.5 h-3.5 relative z-10 shrink-0" />
                            <span className="text-[11px] hidden min-[800px]:inline relative z-10">
                              <span className="hidden min-[1200px]:inline">{viewMode === 'grid-cards' ? 'Grid (Cards)' : viewMode === 'grid-banner' ? 'Grid (Banner)' : 'Grid'}</span>
                              <span className="hidden min-[800px]:inline min-[1200px]:hidden">Grid</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewModeChange('list')}
                            className={`relative w-7 h-7 min-[800px]:w-auto min-[800px]:h-7 px-0 min-[800px]:px-2.5 rounded-md transition-colors cursor-pointer flex items-center justify-center min-[800px]:justify-start gap-0 min-[800px]:gap-1.5 z-10 ${
                              viewMode === 'list'
                                ? 'text-white font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                            }`}
                            title="List View"
                          >
                            {viewMode === 'list' && (
                              <motion.div
                                layoutId="activeViewTab"
                                className="absolute inset-0 bg-[#2563EB] rounded-md shadow-2xs z-0"
                                transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                              />
                            )}
                            <List className="w-3.5 h-3.5 relative z-10 shrink-0" />
                            <span className="text-[11px] hidden min-[800px]:inline relative z-10">
                              List
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                      {/* Unified Topics Content Body (Canvas) */}
                      <div className="p-3 sm:p-4 w-full min-w-0">
                        {displayTopics.length === 0 ? (
                          <div className="w-full my-3 border-2 border-dashed border-[#E2E8F0] dark:border-slate-800 rounded-2xl bg-white/60 dark:bg-slate-900/60 py-6 sm:py-8 md:py-9 px-6 flex flex-col items-center justify-center text-center relative select-none">
                            <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-100">No topics found</h3>
                            <p className="text-xs text-[#64748B] dark:text-slate-300 mt-1">No topics match the selected status filter.</p>
                            <button
                              type="button"
                              onClick={() => handleStatusFilterChange('all')}
                              className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Show All Topics
                            </button>
                          </div>
                    ) : viewMode !== 'list' ? (
                      <div className="w-full">
                        {/* Cards View Layer */}
                        <div
                          ref={cardsRef}
                          className={`w-full ${viewMode === 'grid-cards' ? 'block' : 'hidden'}`}
                        >
                          {/* --- 4-COLUMN IMAGE CARD GRID VIEW (Exact Attached Reference Image Replica) --- */}
                          <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full min-w-0"
                          >
                        {displayTopics.map((topic, index) => {
                          const totalTasks = topic.tasks.length;
                          const completedTasks = topic.tasks.filter(t => t.completed).length;
                          
                          const displayPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                          const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
                          const isNotStarted = completedTasks === 0;

                          const isSelected = currentTopic?.id === topic.id;
                          const theme = getTopicTheme(topic);
                          const IconComp = theme.icon;
                          const iconText = (theme as any).iconText;
                          const dueCount = getDueCountForTopic(topic);

                          const countText = `${totalTasks} ${totalTasks === 1 ? 'Task' : 'Tasks'}`;
                          const completedRatioText = `${completedTasks}/${totalTasks} Completed`;

                          const isHighlighted = highlightedTopicId === topic.id;
                          const isPinAnimating = animatingPinTopicId === topic.id;
                          const isDeleting = animatingDeleteTopicId === topic.id;
                          const isNearBottom = index >= Math.max(0, displayTopics.length - 4);

                          return (
                            <motion.div
                              layout
                              key={topic.id}
                              id={topic.id}
                              onClick={() => {
                                if (editingTopicId !== topic.id) {
                                  setSelectedTopicId(topic.id);
                                  setIsDetailsDrawerOpen(true);
                                }
                              }}
                              initial={false}
                              animate={{
                                opacity: isDeleting ? 0 : 1,
                                scale: isDeleting ? 0.97 : isPinAnimating ? 1.02 : 1,
                                y: isDeleting ? -4 : isPinAnimating ? -4 : 0,
                              }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{
                                layout: {
                                  duration: 0.4,
                                  ease: [0.16, 1, 0.3, 1]
                                },
                                scale: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                                y: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                                opacity: { duration: 0.2 }
                              }}
                              className={`bg-white border rounded-xl p-3 sm:p-3.5 transition-colors duration-200 flex flex-col justify-between group cursor-pointer relative min-h-[120px] ${
                                isPinAnimating
                                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/30 bg-blue-50/20 shadow-xl shadow-blue-500/15 z-[20]'
                                  : activeMenuTopicId === topic.id
                                      ? 'border-[#E2E8F0] shadow-md z-[100]'
                                      : isSelected
                                        ? 'border-[#E2E8F0] shadow-xs z-10'
                                        : topic.isPinned
                                          ? 'border-slate-200/90 bg-slate-50/20 shadow-2xs z-10 hover:z-50'
                                          : 'border-[#E2E8F0] hover:border-[#CBD5E1] shadow-2xs hover:shadow-xs z-10 hover:z-50'
                              }`}
                            >
                              {/* Left Edge Vertical Inline Accent Indicator Bar (Clips flush to card inner boundary, matches topic Icon Color) */}
                              <div className="absolute inset-0 rounded-[11px] overflow-hidden pointer-events-none z-0">
                                <div
                                  className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${theme.bg || theme.cardIconBg || 'bg-[#2563EB]'}`}
                                />
                              </div>

                              {/* Card Header Row: Dynamic Title Header + 3-Dot Trigger */}
                              <div className="flex items-start justify-between gap-2 z-10">
                                <CardTopicHeader
                                  topic={topic}
                                  theme={theme}
                                  iconText={iconText}
                                  IconComp={IconComp}
                                  countText={countText}
                                />

                                {/* Right: Sleek 3-Dot Action Menu Button */}
                                {editingTopicId !== topic.id && (
                                  <div className="relative topic-card-menu-container shrink-0 -mr-1">
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        setActiveMenuTopicId(activeMenuTopicId === topic.id ? null : topic.id);
                                      }}
                                      className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer topic-card-menu-btn ${
                                        activeMenuTopicId === topic.id ? 'opacity-100 bg-slate-100 text-slate-900 shadow-2xs' : 'opacity-100 group-hover:opacity-100'
                                      }`}
                                      title="Topic options"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </button>

                                    <AnimatePresence>
                                      {activeMenuTopicId === topic.id && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          transition={{ duration: 0.15, ease: 'easeOut' }}
                                          onClick={e => e.stopPropagation()}
                                          className={`absolute right-0 ${
                                            isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                          } w-[190px] bg-white border border-slate-200/90 shadow-xl shadow-slate-900/15 backdrop-blur-md rounded-xl p-1 z-[999] text-xs font-medium topic-card-menu text-slate-700 select-none`}
                                        >
                                          {/* Pin to top */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              togglePinTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <Pin className={`w-3.5 h-3.5 shrink-0 ${topic.isPinned ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-500'}`} />
                                            <span className="truncate">{topic.isPinned ? 'Unpin from top' : 'Pin to top'}</span>
                                          </button>

                                          {/* 2. Rename */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setEditingTopicId(topic.id);
                                              setEditingTopicTitle(topic.title);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Rename</span>
                                          </button>

                                          {/* 2.5 Customize Icon & Color */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setCustomizingTopic(topic);
                                              setCustomColorSelection(topic.customColor || '');
                                              setCustomIconSelection(topic.customIcon || '');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <Palette className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                            <span className="truncate">Customize Icon & Color</span>
                                          </button>

                                          {/* 3. Merge Topic */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMergeSourceTopic(topic);
                                              setTargetTopicIdForMerge('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <CornerUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Merge Topic</span>
                                          </button>

                                          {/* 4. Move to section */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMoveSectionSourceTopic(topic);
                                              setTargetSectionForMove('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <FolderOutput className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Move to section</span>
                                          </button>

                                          {/* 5. Duplicate */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              handleDuplicateTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Duplicate</span>
                                          </button>

                                          <div className="my-1 border-t border-slate-100" />

                                          {/* 5. Move to Recycle Bin */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setTopicToDelete(topic);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                            <span className="truncate">Move to Recycle Bin</span>
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                              </div>

                              {/* Card Middle: Progress Line & Percentage (Minimal whitespace) */}
                              <div className="flex items-center gap-2 my-1.5">
                                <div className="w-full bg-[#E9EDF3] h-1.5 rounded-full overflow-hidden flex-1">
                                  <div
                                    style={{ width: `${displayPercent}%` }}
                                    className={`h-full rounded-full bg-gradient-to-r ${theme.progressGradient} transition-[width] duration-300 ease-in-out`}
                                  />
                                </div>
                                <span className={`text-[10.5px] font-bold shrink-0 min-w-[28px] text-right ${
                                  isCompleted ? theme.textColor : isNotStarted ? 'text-slate-400' : 'text-slate-700'
                                }`}>
                                  {displayPercent}%
                                </span>
                              </div>

                              {/* Card Footer: 3 Standardized Status Indicators */}
                              <div className="flex items-center justify-between text-xs font-semibold pt-1.5 border-t border-slate-100">
                                {isCompleted ? (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 truncate">
                                      Completed
                                    </span>
                                  </div>
                                ) : isNotStarted ? (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 truncate">
                                      Not Started
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                        <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                      </div>
                                      <span className="text-xs font-semibold text-slate-700 truncate">
                                        {completedRatioText}
                                      </span>
                                    </div>

                                    {dueCount > 0 && (
                                      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                        <div className="w-4 h-4 rounded-full border-[1.5px] border-[#EF4444] flex items-center justify-center shrink-0">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">
                                          {dueCount} Due
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Add New Topic Dashed Card */}
                        <div
                          onClick={() => {
                            setNewTopicTitle('');
                            setIsNewTopicOpen(true);
                          }}
                          className="bg-white dark:bg-slate-900/60 border-2 border-dashed border-[#CBD5E1] dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-3 sm:p-3.5 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer min-h-[120px] group hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Add New Topic</h4>
                            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">Create a new topic</span>
                          </div>
                        </div>
                      </div>
                      </div>
                      
                      {/* Banner View Layer */}
                      <div
                        ref={bannerRef}
                        className={`w-full ${viewMode === 'grid-banner' ? 'block' : 'hidden'}`}
                      >
                        {/* --- GRID BANNER VIEW MODE --- */}
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 w-full min-w-0"
                        >
                        {displayTopics.map((topic, index) => {
                          const totalTasks = topic.tasks.length;
                          const completedTasks = topic.tasks.filter(t => t.completed).length;
                          const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                          const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
                          const isNotStarted = completedTasks === 0;
                          const dueCount = getDueCountForTopic(topic);
                          
                          const countText = `${totalTasks} ${totalTasks === 1 ? 'Task' : 'Tasks'}`;
                          const completedRatioText = `${completedTasks}/${totalTasks} Completed`;
                          
                          const isSelected = currentTopic?.id === topic.id;
                          const isPinAnimating = animatingPinTopicId === topic.id;
                          const isDeleting = animatingDeleteTopicId === topic.id;
                          const isNearBottom = index >= Math.max(0, displayTopics.length - 3);
                          const theme = getTopicTheme(topic);
                          const IconComp = theme.icon;
                          const iconText = (theme as any).iconText;

                          return (
                            <motion.div
                              layout
                              key={topic.id}
                              id={topic.id}
                              onClick={() => {
                                if (editingTopicId !== topic.id) {
                                  setSelectedTopicId(topic.id);
                                  setIsDetailsDrawerOpen(true);
                                }
                              }}
                              animate={{
                                opacity: isDeleting ? 0 : 1,
                                scale: isDeleting ? 0.97 : isPinAnimating ? 1.02 : 1,
                                y: isDeleting ? -4 : isPinAnimating ? -4 : 0,
                              }}
                              transition={{
                                layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                                scale: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                                y: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                              }}
                              className={`bg-white border rounded-[16px] overflow-visible transition-all duration-200 flex flex-col justify-between group cursor-pointer relative shadow-sm hover:shadow-md ${
                                isPinAnimating
                                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/30 shadow-xl shadow-blue-500/15 z-[20]'
                                  : activeMenuTopicId === topic.id
                                      ? 'border-[#E2E8F0] shadow-md z-[100]'
                                      : topic.isPinned
                                        ? 'border-slate-200/90 shadow-2xs z-10 hover:z-50'
                                        : isSelected
                                          ? 'border-[#E2E8F0] shadow-2xs z-10 hover:z-50'
                                          : 'border-[#E2E8F0] hover:border-[#CBD5E1] z-10 hover:z-50'
                              }`}
                            >
                              {/* Top Banner Header */}
                              <div className={`relative h-32 p-4 flex flex-col justify-between rounded-t-[15px]`}>
                                {/* Watermark & Glow (with overflow-hidden) */}
                                <div className={`absolute inset-0 rounded-t-[15px] overflow-hidden ${theme.bg}`}>
                                  <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                                  <div className="absolute right-3 top-3 opacity-15 pointer-events-none">
                                    <IconComp className="w-20 h-20 text-white stroke-[1.2]" />
                                  </div>
                                </div>

                                {/* Top Row: Icon + Floating Pin Badge on Left, 3-Dot Menu on Right */}
                                <div className="flex items-center justify-between relative z-20">
                                  {/* Icon box + floating pin badge */}
                                  <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-white shadow-xs">
                                      {iconText ? (
                                        <span className="text-white text-xs font-black font-serif leading-none">{iconText}</span>
                                      ) : (
                                        <IconComp className="w-5 h-5 text-white stroke-[2.2]" />
                                      )}
                                    </div>

                                    {/* Requirement 2: Pin icon floating on top-right of topic icon box */}
                                    <AnimatePresence>
                                      {topic.isPinned && (
                                        <motion.div
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          exit={{ scale: 0, opacity: 0 }}
                                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                          className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-white rounded-full border-[1.5px] shadow-sm flex items-center justify-center z-20"
                                          style={{ borderColor: theme.bg?.match(/\[(.*?)\]/)?.[1] || '#2563EB' }}
                                          title="Pinned to top"
                                        >
                                          <Pin className={`w-3.5 h-3.5 ${theme.pinIconColor || 'text-[#2563EB] fill-[#2563EB]'} rotate-45`} />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  {/* Requirement 1: Top right corner e JUST 3 dot menu */}
                                  <div className="relative topic-card-menu-container">
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        setActiveMenuTopicId(activeMenuTopicId === topic.id ? null : topic.id);
                                      }}
                                      className={`p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer topic-card-menu-btn ${
                                        activeMenuTopicId === topic.id ? 'opacity-100 bg-white/25 text-white' : 'max-md:opacity-100 opacity-80 group-hover:opacity-100'
                                      }`}
                                      title="Topic options"
                                    >
                                      <MoreVertical className="w-4 h-4 stroke-[2.2]" />
                                    </button>

                                    {/* Dropdown Menu (Card View Style) */}
                                    <AnimatePresence>
                                      {activeMenuTopicId === topic.id && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          transition={{ duration: 0.15, ease: 'easeOut' }}
                                          onClick={e => e.stopPropagation()}
                                          className={`absolute right-0 ${
                                            isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                          } w-[190px] bg-white border border-slate-200/90 shadow-xl shadow-slate-900/15 backdrop-blur-md rounded-xl p-1 z-[999] text-xs font-medium topic-card-menu text-slate-700 select-none`}
                                        >
                                          {/* 1. Pin to top / Unpin */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              togglePinTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <Pin className={`w-3.5 h-3.5 shrink-0 ${topic.isPinned ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-500'}`} />
                                            <span className="truncate">{topic.isPinned ? 'Unpin from top' : 'Pin to top'}</span>
                                          </button>

                                          {/* 2. Rename */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setEditingTopicId(topic.id);
                                              setEditingTopicTitle(topic.title);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Rename</span>
                                          </button>

                                          {/* 3. Merge Topic */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMergeSourceTopic(topic);
                                              setTargetTopicIdForMerge('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <CornerUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Merge Topic</span>
                                          </button>

                                          {/* 4. Move to section */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setMoveSectionSourceTopic(topic);
                                              setTargetSectionForMove('');
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <FolderOutput className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Move to section</span>
                                          </button>

                                          {/* 5. Duplicate */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              handleDuplicateTopic(topic.id);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                          >
                                            <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <span className="truncate">Duplicate</span>
                                          </button>

                                          <div className="my-1 border-t border-slate-100" />

                                          {/* 5. Move to Recycle Bin */}
                                          <button
                                            onClick={() => {
                                              setActiveMenuTopicId(null);
                                              setTopicToDelete(topic);
                                            }}
                                            className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                            <span className="truncate">Move to Recycle Bin</span>
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {/* Requirement 3: Topic Title & Subtopic count inside Banner */}
                                <div className="relative z-10 min-w-0 pr-2">
                                  <h3 className="text-base font-semibold font-serif text-white tracking-tight leading-snug truncate drop-shadow-xs">
                                    {topic.title}
                                  </h3>
                                  <p className="text-xs font-medium text-white/85 mt-0.5 truncate">
                                    {countText}
                                  </p>
                                </div>
                              </div>

                              {/* Requirement 4: Topic progress dependent on task count */}
                              <div className="p-4 flex flex-col gap-3 bg-white rounded-b-[15px]">
                                {/* Progress Bar */}
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-500">Progress</span>
                                    <span className={`font-bold ${theme.textColor}`}>
                                      {percent}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${percent}%` }}
                                      className={`h-full rounded-full bg-gradient-to-r ${theme.progressGradient} transition-[width] duration-300 ease-in-out`}
                                    />
                                  </div>
                                       {/* Status & Completed Tasks */}
                                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100/80 text-xs font-semibold">
                                  {isCompleted ? (
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                        <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                      </div>
                                      <span className="text-xs font-semibold text-slate-700">Completed</span>
                                    </div>
                                  ) : isNotStarted ? (
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                      </div>
                                      <span className="text-xs font-semibold text-slate-400">Not Started</span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">{completedRatioText}</span>
                                      </div>

                                      {dueCount > 0 && (
                                        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                          <div className="w-4 h-4 rounded-full border-[1.5px] border-[#EF4444] flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                                          </div>
                                          <span className="text-xs font-semibold text-slate-700">
                                            {dueCount} Due
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>                            </div>
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Add New Topic Dashed Card for Banner View */}
                        <div
                          onClick={() => {
                            setNewTopicTitle('');
                            setIsNewTopicOpen(true);
                          }}
                          className="bg-white dark:bg-slate-900/60 border-2 border-dashed border-[#CBD5E1] dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-[16px] p-5 transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[160px] group hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="flex flex-col text-center">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Add New Topic</h4>
                            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">Create a new topic</span>
                          </div>
                        </div>
                      </div>
                      </div>

                      </div>
                    ) : (
                      <div className="w-full">
                        {/* List View Layer */}
                        {/* --- LIST VIEW MODE (Accordion List) --- */}
                        <div
                          className="space-y-2.5"
                        >
                        {displayTopics.map((topic, index) => {
                          const totalTasks = topic.tasks.length;
                          const completedTasks = topic.tasks.filter(t => t.completed).length;
                          const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                          const allDone = totalTasks > 0 && completedTasks === totalTasks;
                          const isSelected = currentTopic?.id === topic.id;
                          const isPinAnimating = animatingPinTopicId === topic.id;
                          const theme = getTopicTheme(topic);
                          const isNearBottom = index >= Math.max(0, displayTopics.length - 3);
                          const IconComp = theme.icon;
                          const iconText = (theme as any).iconText;

                          return (
                            <motion.div
                              layout
                              key={topic.id}
                              id={topic.id}
                              onClick={() => setSelectedTopicId(topic.id)}
                              animate={{
                                scale: isPinAnimating ? 1.01 : 1,
                                y: isPinAnimating ? -2 : 0,
                              }}
                              transition={{
                                layout: {
                                  duration: 0.4,
                                  ease: [0.16, 1, 0.3, 1]
                                },
                                scale: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                                y: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                              }}
                              className={`bg-white dark:bg-slate-900 border rounded-[8px] overflow-visible transition-colors duration-200 relative ${
                                isPinAnimating
                                  ? 'border-[#2563EB] ring-2 ring-[#2563EB]/30 shadow-xl shadow-blue-500/15 z-[20]'
                                  : activeMenuTopicId === topic.id
                                      ? 'border-[#E2E8F0] dark:border-slate-700 shadow-md z-[100]'
                                      : topic.isPinned
                                        ? 'border-slate-200/90 dark:border-slate-700 shadow-2xs z-10 hover:z-50'
                                        : isSelected
                                          ? 'border-[#E2E8F0] dark:border-slate-700 z-10 hover:z-50'
                                          : 'border-[#E2E8F0] dark:border-slate-700 hover:border-[#CBD5E1] dark:hover:border-slate-600 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_18px_rgba(15,23,42,0.05)] z-10 hover:z-50'
                              }`}
                            >
                            {/* Topic Accordion Header */}
                            <div
                              onClick={() => {
                                setTopics(prev =>
                                  prev.map(t =>
                                    t.id === topic.id ? { ...t, expanded: !t.expanded } : t
                                  )
                                );
                              }}
                              className="px-5 h-[42px] flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-700 gap-3 bg-white dark:bg-slate-900 cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative shrink-0">
                                  <div className={`w-6 h-6 rounded-md ${theme.cardIconBg} flex items-center justify-center text-white shadow-2xs`}>
                                    {iconText ? (
                                      <span className="text-white text-[10px] font-black font-serif leading-none">{iconText}</span>
                                    ) : (
                                      <IconComp className={`w-3 h-3 ${theme.cardIconColor} stroke-[2.2]`} />
                                    )}
                                  </div>

                                  <AnimatePresence>
                                    {topic.isPinned && (
                                      <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full border-[1.5px] shadow-xs flex items-center justify-center z-10"
                                        style={{ borderColor: theme.bg?.match(/\[(.*?)\]/)?.[1] || '#2563EB' }}
                                        title="Pinned to top"
                                      >
                                        <Pin className={`w-2.5 h-2.5 ${theme.pinIconColor || 'text-[#2563EB] fill-[#2563EB]'} rotate-45`} />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                <span className="font-bold text-sm text-[#0F172A] dark:text-slate-100 truncate">
                                  {topic.title}
                                </span>

                                {/* Progress Percentage Badge */}
                                <span className="inline-flex items-center justify-center h-[22px] min-w-[40px] px-2.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-[11px] font-extrabold rounded-full ml-1 shadow-2xs leading-none text-center select-none">
                                  {percent}%
                                </span>

                                {/* Mark All Checkbox & Label */}
                                <label
                                  className="flex items-center gap-2 text-xs font-semibold text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 cursor-pointer ml-4 select-none"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={allDone}
                                    onChange={() => toggleMarkAllTopic(topic.id)}
                                    className="w-4 h-4 border border-[#CBD5E1] dark:border-slate-600 rounded-[4px] accent-[#2563EB] cursor-pointer"
                                  />
                                  <span>Mark All</span>
                                </label>
                              </div>

                              {/* Header Action Buttons matching screenshot */}
                              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setAddingTaskTopicId(
                                      addingTaskTopicId === topic.id ? null : topic.id
                                    );
                                  }}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Add Subtask"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingTopicId(topic.id);
                                    setEditingTopicTitle(topic.title);
                                  }}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Edit Topic"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => moveTopicIndex(topic.id, 'up')}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Reorder Topic"
                                >
                                  <ArrowUpDown className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => showToast(`Notifications enabled for "${topic.title}"`)}
                                  className="p-1.5 text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                                  title="Topic Notifications"
                                >
                                  <Bell className="w-4 h-4" />
                                </button>
                                <div className="relative topic-card-menu-container">
                                  <button
                                     onClick={e => {
                                       e.stopPropagation();
                                       setActiveMenuTopicId(activeMenuTopicId === topic.id ? null : topic.id);
                                     }}
                                     className={`p-1.5 rounded-md text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors cursor-pointer topic-card-menu-btn ${
                                       activeMenuTopicId === topic.id ? 'bg-[#F1F5F9] dark:bg-slate-800 text-[#0F172A] dark:text-white' : ''
                                     }`}
                                     title="More Options"
                                   >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  <AnimatePresence>
                                    {activeMenuTopicId === topic.id && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        onClick={e => e.stopPropagation()}
                                        className={`absolute right-0 ${
                                          isNearBottom ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                        } w-[190px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md rounded-xl p-1 z-[999] text-xs font-medium topic-card-menu text-slate-700 dark:text-slate-200 select-none`}
                                      >
                                        {/* Pin to top */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            togglePinTopic(topic.id);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                        >
                                          <Pin className={`w-3.5 h-3.5 shrink-0 ${topic.isPinned ? 'fill-[#2563EB] text-[#2563EB]' : 'text-slate-500'}`} />
                                          <span className="truncate">{topic.isPinned ? 'Unpin from top' : 'Pin to top'}</span>
                                        </button>

                                        {/* Rename */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setEditingTopicId(topic.id);
                                            setEditingTopicTitle(topic.title);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                        >
                                          <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                          <span className="truncate">Rename</span>
                                        </button>

                                        {/* Merge Topic */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setMergeSourceTopic(topic);
                                            setTargetTopicIdForMerge('');
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                        >
                                          <CornerUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                          <span className="truncate">Merge Topic</span>
                                        </button>

                                        {/* Move to section */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setMoveSectionSourceTopic(topic);
                                            setTargetSectionForMove('');
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                        >
                                          <FolderOutput className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                          <span className="truncate">Move to section</span>
                                        </button>

                                        {/* Duplicate */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            handleDuplicateTopic(topic.id);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                        >
                                          <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                          <span className="truncate">Duplicate</span>
                                        </button>

                                        <div className="my-1 border-t border-slate-100" />

                                        {/* Move to Recycle Bin */}
                                        <button
                                          onClick={() => {
                                            setActiveMenuTopicId(null);
                                            setTopicToDelete(topic);
                                          }}
                                          className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                          <span className="truncate">Move to Recycle Bin</span>
                                        </button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>

                            {/* Accordion Content Body */}
                            <AnimatePresence>
                              {topic.expanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col bg-white overflow-hidden"
                                >
                                  {/* Add Task Input Row */}
                                  {addingTaskTopicId === topic.id && (
                                    <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
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
                                        value={newTaskTitle}
                                        onChange={e => setNewTaskTitle(e.target.value)}
                                        onKeyDown={e => {
                                          if (e.key === 'Enter') handleAddTask(topic.id);
                                        }}
                                        placeholder="Subtask title..."
                                        autoFocus
                                        className="flex-1 text-xs bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-[6px] focus:outline-hidden focus:border-[#2563EB] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleAddTask(topic.id)}
                                        className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-[6px] hover:bg-[#1D4ED8] cursor-pointer"
                                      >
                                        Add
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setAddingTaskTopicId(null)}
                                        className="p-1.5 text-[#64748B] hover:bg-[#E2E8F0] rounded-[6px] cursor-pointer"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}

                                  {/* Task Items List matching screenshot */}
                                  {topic.tasks.length === 0 ? (
                                    <div className="py-6 text-center text-xs text-[#94A3B8]">
                                      No subtasks created yet. Click "+" to add one.
                                    </div>
                                  ) : (
                                    topic.tasks.map(task => {
                                      const isEditingThisTask = editingTaskId?.topicId === topic.id && editingTaskId?.taskId === task.id;
                                      const isMenuOpenThisTask = activeMenuTaskId === `${topic.id}-${task.id}`;

                                      return (
                                        <div
                                          key={task.id}
                                          className={`group px-5 h-[40px] flex items-center justify-between border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FAFBFD] transition-colors relative ${
                                            isMenuOpenThisTask ? 'z-[99999] bg-white' : 'z-0'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                                            <GripVertical className="w-4 h-4 text-[#94A3B8] cursor-grab shrink-0" />
                                            <div
                                              onClick={() => toggleTaskCompleted(topic.id, task.id)}
                                              className="cursor-pointer shrink-0"
                                            >
                                              {task.completed ? (
                                                <div className="w-4 h-4 bg-[#2563EB] rounded-[4px] flex items-center justify-center text-white">
                                                  <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                              ) : (
                                                <div className="w-4 h-4 border border-[#CBD5E1] rounded-[4px] bg-white hover:border-[#2563EB]" />
                                              )}
                                            </div>

                                            {/* Inline Task Rename or Static Title */}
                                            {isEditingThisTask ? (
                                              <div className="flex items-center gap-1.5 flex-1" onClick={e => e.stopPropagation()}>
                                                <input
                                                  type="text"
                                                  value={editingTaskTitle}
                                                  onChange={e => setEditingTaskTitle(e.target.value)}
                                                  onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      handleSaveRenameTask(topic.id, task.id);
                                                    } else if (e.key === 'Escape') {
                                                      e.preventDefault();
                                                      setEditingTaskId(null);
                                                    }
                                                  }}
                                                  autoFocus
                                                  className="flex-1 text-[13px] font-medium text-[#0F172A] bg-white border border-[#2563EB] rounded px-2 py-0.5 outline-none"
                                                />
                                                {/* Save Button */}
                                                <button
                                                  type="button"
                                                  onMouseDown={e => {
                                                    e.preventDefault();
                                                    handleSaveRenameTask(topic.id, task.id);
                                                  }}
                                                  className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors shrink-0 cursor-pointer"
                                                  title="Save (Enter)"
                                                >
                                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </button>
                                                {/* Cancel Button */}
                                                <button
                                                  type="button"
                                                  onMouseDown={e => {
                                                    e.preventDefault();
                                                    setEditingTaskId(null);
                                                  }}
                                                  className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
                                                  title="Cancel (Esc)"
                                                >
                                                  <X className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            ) : (
                                              <span className="text-[13px] font-normal text-[#0F172A] truncate">
                                                {task.title}
                                              </span>
                                            )}
                                          </div>

                                          {/* Task Metadata & Action matching screenshot */}
                                          <div className="flex items-center shrink-0">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] mr-6">
                                              <Calendar className="w-4 h-4 text-[#64748B]" />
                                              <span>{task.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] mr-6">
                                              <Clock className="w-4 h-4 text-[#64748B]" />
                                              <span>{task.time}</span>
                                            </div>

                                            {/* 3-Dot Dropdown Options */}
                                            <div className={`relative ${isMenuOpenThisTask ? 'z-[99999]' : 'z-10'}`}>
                                              <button
                                                onClick={e => {
                                                  e.stopPropagation();
                                                  setActiveMenuTaskId(isMenuOpenThisTask ? null : `${topic.id}-${task.id}`);
                                                }}
                                                className={`p-1 rounded-[4px] transition-colors cursor-pointer task-item-menu-btn ${
                                                  isMenuOpenThisTask ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                                                }`}
                                                title="Task options"
                                              >
                                                <MoreVertical className="w-4 h-4" />
                                              </button>

                                              <AnimatePresence>
                                                {isMenuOpenThisTask && (
                                                  <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                                    transition={{ duration: 0.12, ease: 'easeOut' }}
                                                    onClick={e => e.stopPropagation()}
                                                    className="absolute right-0 top-full mt-1 w-[185px] whitespace-nowrap bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/20 backdrop-blur-md rounded-xl p-1 z-[999999] text-xs font-medium task-item-menu text-slate-700 select-none"
                                                  >
                                                    {/* 1. Rename */}
                                                    <button
                                                      onClick={() => handleStartRenameTask(topic.id, task)}
                                                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                                    >
                                                      <Pencil className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                      <span className="truncate">Rename</span>
                                                    </button>


                                                    {/* 2. Edit (Placeholder) */}
                                                    <button
                                                      onClick={() => {
                                                        setActiveMenuTaskId(null);
                                                        showToast('Task details edit coming soon');
                                                      }}
                                                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                                                    >
                                                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                      <span className="truncate">Edit</span>
                                                    </button>

                                                    <div className="my-1 border-t border-slate-100" />

                                                    {/* 3. Move to Recycle Bin */}
                                                    <button
                                                      onClick={() => {
                                                        setActiveMenuTaskId(null);
                                                        setTaskToDelete({ topicId: topic.id, task });
                                                      }}
                                                      className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                      <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                                      <span className="truncate">Move to Recycle Bin</span>
                                                    </button>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                      </div>
                    )}
                    </div>
                  </div>
                )}
                </div>

              {/* Professional Footer Pushed to Screen Bottom */}
              <footer className="w-full shrink-0 mt-auto pt-2.5 pb-0.5 border-t border-slate-200/80 flex items-center justify-between gap-3 text-xs font-medium text-slate-500 select-none">
                {/* Left: Official Study Flow Logo & Copyright */}
                <div className="flex items-center gap-2">
                  <div className="preserve-color relative w-[18px] h-[18px] flex items-center justify-center shrink-0">
                    <div className="absolute top-0 left-0 w-[12px] h-[12px] bg-[#2563EB] rounded-[3px]"></div>
                    <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[3px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90"></div>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                    Study <span className="brand-flow-highlight font-extrabold">Flow</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">© 2026 All rights reserved.</span>
                </div>

                {/* Right: Version Pill */}
                <div className="flex items-center text-[11px] font-semibold text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600">
                    v4.0.0
                  </span>
                </div>
              </footer>
            </div>
          </div>
        </motion.div>
        )}
          </AnimatePresence>
        </div>

      {/* --- MODALS --- */}

      {/* Keyboard Shortcuts & Feature Guide Modal */}
      <ShortcutsAndGuideModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* 3. New Workspace Modal */}
      <AnimatePresence>
        {isNewWorkspaceOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setIsNewWorkspaceOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: mobileKeyboardBottomInset > 0 ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8) : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85
                }
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Create new workspace</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Organize your projects, sections, and topics in one place.</p>
                </div>
                <button
                  onClick={() => setIsNewWorkspaceOpen(false)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Container (div instead of form to bypass Android/iOS credential heuristics) */}
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Workspace name</label>
                    <span className={`text-[11px] font-semibold ${
                      newWorkspaceName.replace(/\s+/g, ' ').trim().length > 40 ? 'text-red-500 font-bold' : 'text-slate-400'
                    }`}>
                      {newWorkspaceName.replace(/\s+/g, ' ').trim().length}/40
                    </span>
                  </div>
                  <input
                    type="search"
                    id="new-workspace-name-input"
                    name="workspace-name-search"
                    autoComplete="off"
                    autoCorrect="on"
                    autoCapitalize="words"
                    spellCheck="false"
                    inputMode="search"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    maxLength={40}
                    value={newWorkspaceName}
                    onChange={e => setNewWorkspaceName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateWorkspace(e);
                      }
                    }}
                    placeholder="e.g. English Literature"
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 ${
                      newWorkspaceName.replace(/\s+/g, ' ').trim().length > 40
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {newWorkspaceName.replace(/\s+/g, ' ').trim().length > 40 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Workspace name cannot exceed 40 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsNewWorkspaceOpen(false)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateWorkspace}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Create Workspace
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create New Topic Modal */}
      <AnimatePresence>
        {isNewTopicOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setIsNewTopicOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: mobileKeyboardBottomInset > 0 ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8) : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85
                }
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Create new topic</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Add a new topic to organize your learning tasks and notes.</p>
                </div>
                <button
                  onClick={() => setIsNewTopicOpen(false)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Topic title</label>
                    <span className={`text-[11px] font-semibold ${
                      newTopicTitle.replace(/\s+/g, ' ').trim().length > 45 ? 'text-red-500 font-bold' : 'text-slate-400'
                    }`}>
                      {newTopicTitle.replace(/\s+/g, ' ').trim().length}/45
                    </span>
                  </div>
                  <input
                    type="search"
                    id="new-topic-title-input"
                    name="topic-title-search"
                    autoComplete="off"
                    autoCorrect="on"
                    autoCapitalize="words"
                    spellCheck="false"
                    inputMode="search"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    maxLength={45}
                    value={newTopicTitle}
                    onChange={e => setNewTopicTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTopicModal(e);
                      }
                    }}
                    placeholder="e.g. Quantum Mechanics, Organic Chemistry..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 ${
                      newTopicTitle.replace(/\s+/g, ' ').trim().length > 45
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {newTopicTitle.replace(/\s+/g, ' ').trim().length > 45 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Topic name cannot exceed 45 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewTopicOpen(false);
                      setIsSmartStudioOpen(true);
                    }}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] rounded-lg shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Studio Mode</span>
                  </button>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsNewTopicOpen(false)}
                      className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateTopicModal}
                      className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Create Topic
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SmartTopicStudioModal 
        isOpen={isSmartStudioOpen} 
        onClose={() => setIsSmartStudioOpen(false)} 
        onSave={handleCreateTopicsFromStudio} 
        sections={currentWorkspaceSections.map(s => s.name)}
        activeSectionName={activeSection || currentWorkspaceSections[0]?.name || ''} 
        initialMode={smartStudioInitialMode}
      />

      {/* Rename Workspace Modal */}
      <AnimatePresence>
        {editingWorkspaceId && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setEditingWorkspaceId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: mobileKeyboardBottomInset > 0 ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8) : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85
                }
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Rename workspace</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Rename your workspace to better organize your subjects.</p>
                </div>
                <button
                  onClick={() => setEditingWorkspaceId(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Container (div instead of form to bypass Android/iOS credential heuristics) */}
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Workspace name</label>
                    <span className={`text-[11px] font-semibold ${
                      editingWorkspaceName.replace(/\s+/g, ' ').trim().length > 40 ? 'text-red-500 font-bold' : 'text-slate-400'
                    }`}>
                      {editingWorkspaceName.replace(/\s+/g, ' ').trim().length}/40
                    </span>
                  </div>
                  <input
                    type="search"
                    id="rename-workspace-input"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-autocomplete="none"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    maxLength={40}
                    value={editingWorkspaceName}
                    onChange={e => setEditingWorkspaceName(e.target.value)}
                    ref={el => {
                      if (el && !el.dataset.initSelected) {
                        el.dataset.initSelected = 'true';
                        setTimeout(() => el.select(), 20);
                      }
                    }}
                    onClick={e => {
                      const input = e.currentTarget;
                      if (input.selectionStart === 0 && input.selectionEnd === input.value.length && input.value.length > 0) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRenameWorkspace(e);
                      }
                    }}
                    placeholder="e.g. Premium Workspace, HSC 2026..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                      editingWorkspaceName.replace(/\s+/g, ' ').trim().length > 40
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {editingWorkspaceName.replace(/\s+/g, ' ').trim().length > 40 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Workspace name cannot exceed 40 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingWorkspaceId(null)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRenameWorkspace}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Workspace
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rename Section Modal */}
      <AnimatePresence>
        {editingSection && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setEditingSection(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: mobileKeyboardBottomInset > 0 ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8) : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85
                }
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Rename section</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Rename this section tab in your workspace.</p>
                </div>
                <button
                  onClick={() => setEditingSection(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Section name</label>
                    <span className={`text-[11px] font-semibold ${
                      editingSectionName.replace(/\s+/g, ' ').trim().length > 35 ? 'text-red-500 font-bold' : 'text-slate-400'
                    }`}>
                      {editingSectionName.replace(/\s+/g, ' ').trim().length}/35
                    </span>
                  </div>
                  <input
                    type="search"
                    id="rename-section-input"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-autocomplete="none"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    maxLength={35}
                    value={editingSectionName}
                    onChange={e => setEditingSectionName(e.target.value)}
                    ref={el => {
                      if (el && !el.dataset.initSelected) {
                        el.dataset.initSelected = 'true';
                        setTimeout(() => el.select(), 20);
                      }
                    }}
                    onClick={e => {
                      const input = e.currentTarget;
                      if (input.selectionStart === 0 && input.selectionEnd === input.value.length && input.value.length > 0) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRenameSection(e);
                      }
                    }}
                    placeholder="e.g. Grammar, Physics, Math..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                      editingSectionName.replace(/\s+/g, ' ').trim().length > 35
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {editingSectionName.replace(/\s+/g, ' ').trim().length > 35 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Section name cannot exceed 35 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRenameSection}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Section
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. New Section Modal */}
      <AnimatePresence>
        {isNewSectionOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setIsNewSectionOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: mobileKeyboardBottomInset > 0 ? -Math.max(10, Math.round(mobileKeyboardBottomInset / 2) - 8) : 0,
                transition: {
                  type: 'spring',
                  damping: 32,
                  stiffness: 340,
                  mass: 0.85
                }
              }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.12, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden transform-gpu"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Create new section</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Add a new section tab to group related topics in your workspace.</p>
                </div>
                <button
                  onClick={() => setIsNewSectionOpen(false)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Section name</label>
                    <span className={`text-[11px] font-semibold ${
                      newSectionName.replace(/\s+/g, ' ').trim().length > 35 ? 'text-red-500 font-bold' : 'text-slate-400'
                    }`}>
                      {newSectionName.replace(/\s+/g, ' ').trim().length}/35
                    </span>
                  </div>
                  <input
                    type="search"
                    id="new-section-input"
                    name="new-section-search"
                    autoComplete="off"
                    autoCorrect="on"
                    autoCapitalize="words"
                    spellCheck="false"
                    inputMode="search"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    maxLength={35}
                    value={newSectionName}
                    onChange={e => setNewSectionName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateSection(e);
                      }
                    }}
                    placeholder="e.g. Grammar, Vocabulary, Physics..."
                    autoFocus
                    className={`w-full h-[36px] bg-slate-50 border rounded-lg font-serif text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-colors px-3.5 ${
                      newSectionName.replace(/\s+/g, ' ').trim().length > 35
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-[#176BFF]'
                    }`}
                  />
                  {newSectionName.replace(/\s+/g, ' ').trim().length > 35 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Section name cannot exceed 35 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsNewSectionOpen(false)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateSection}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Create Section
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Search Modal (Replaced with Dedicated Full-Page Search Engine) */}

      {/* Focus-Mode Topic Rename Modal */}
      <AnimatePresence>
        {editingTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs cursor-pointer"
              onClick={() => setEditingTopicId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.11, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/15 border border-slate-200/80 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Rename topic</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">Rename your topic to keep your learning tasks organized.</p>
                </div>
                <button
                  onClick={() => setEditingTopicId(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Container (div to prevent browser autofill heuristics) */}
              <div className="flex flex-col">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Topic title</label>
                    <span className={`text-[11px] font-semibold ${
                      editingTopicTitle.replace(/\s+/g, ' ').trim().length > 45 ? 'text-red-500 font-bold' : 'text-slate-400'
                    }`}>
                      {editingTopicTitle.replace(/\s+/g, ' ').trim().length}/45
                    </span>
                  </div>
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
                    maxLength={45}
                    value={editingTopicTitle}
                    onChange={e => setEditingTopicTitle(e.target.value)}
                    ref={el => {
                      if (el && !el.dataset.initSelected) {
                        el.dataset.initSelected = 'true';
                        setTimeout(() => el.select(), 20);
                      }
                    }}
                    onClick={e => {
                      const input = e.currentTarget;
                      if (input.selectionStart === 0 && input.selectionEnd === input.value.length && input.value.length > 0) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveRenameTopic(editingTopic.id, editingTopicTitle);
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        setEditingTopicId(null);
                      }
                    }}
                    autoFocus
                    placeholder="Enter topic name..."
                    className={`w-full bg-slate-50/70 border rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all px-3.5 py-2.5 shadow-xs [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
                      editingTopicTitle.replace(/\s+/g, ' ').trim().length > 45
                        ? 'border-red-400 focus:border-red-500 ring-2 ring-red-400/20'
                        : 'border-slate-200/90 focus:border-[#176BFF] focus:ring-3 focus:ring-[#176BFF]/10'
                    }`}
                  />
                  {editingTopicTitle.replace(/\s+/g, ' ').trim().length > 45 && (
                    <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Topic name cannot exceed 45 characters (multiple spaces count as 1).
                    </p>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2.5 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingTopicId(null)}
                    className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveRenameTopic(editingTopic.id, editingTopicTitle)}
                    className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Topic
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Merge Topic Modal (Higher Z-Index to always appear above Topic Details Drawer) */}
      <AnimatePresence>
        {mergeSourceTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setMergeSourceTopic(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.94, y: 6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/80 overflow-hidden transform-gpu flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Merge Topic</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Move all tasks, notes & links from “<span className="font-bold text-slate-800">{mergeSourceTopic.title}</span>” into another topic.
                  </p>
                </div>
                <button
                  onClick={() => setMergeSourceTopic(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Source Topic Stats Info Box */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs flex items-center justify-between">
                <span className="text-blue-900 font-semibold">Tasks to transfer:</span>
                <span className="font-bold text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                  {mergeSourceTopic.tasks.length} task(s)
                </span>
              </div>

              {/* Target Topic Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-900">Select Target Topic</label>
                <select
                  value={targetTopicIdForMerge}
                  onChange={e => setTargetTopicIdForMerge(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#176BFF] focus:ring-3 focus:ring-[#176BFF]/10 transition-all px-3.5 py-2.5 shadow-xs cursor-pointer"
                >
                  <option value="" disabled>-- Select destination topic --</option>
                  {topics
                    .filter(t => t.id !== mergeSourceTopic.id && t.section === mergeSourceTopic.section)
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.tasks.length} existing tasks)
                      </option>
                    ))}
                </select>
                {topics.filter(t => t.id !== mergeSourceTopic.id && t.section === mergeSourceTopic.section).length === 0 && (
                  <p className="text-[11px] font-medium text-amber-600 mt-0.5">
                    ⚠️ No other topics available in current section ({mergeSourceTopic.section || 'Default'}) to merge into.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setMergeSourceTopic(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetTopicIdForMerge}
                  onClick={handleConfirmMergeTopic}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 disabled:opacity-40 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CornerUpRight className="w-3.5 h-3.5" />
                  <span>Merge Topics</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Topic to Section Modal (Higher Z-Index to always appear above Topic Details Drawer) */}
      <AnimatePresence>
        {moveSectionSourceTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setMoveSectionSourceTopic(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.94, y: 6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
              className="relative z-10 bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/80 overflow-hidden transform-gpu flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Move Topic to Section</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Transfer “<span className="font-bold text-slate-800">{moveSectionSourceTopic.title}</span>” to another section in this workspace.
                  </p>
                </div>
                <button
                  onClick={() => setMoveSectionSourceTopic(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Section Info Box */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs flex items-center justify-between">
                <span className="text-slate-600 font-medium">Current section:</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  {moveSectionSourceTopic.section || 'Default'}
                </span>
              </div>

              {/* Target Section Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-900">Select Target Section</label>
                <select
                  value={targetSectionForMove}
                  onChange={e => setTargetSectionForMove(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#176BFF] focus:ring-3 focus:ring-[#176BFF]/10 transition-all px-3.5 py-2.5 shadow-xs cursor-pointer"
                >
                  <option value="" disabled>-- Select destination section --</option>
                  {currentWorkspaceSections
                    .filter(s => s.name !== moveSectionSourceTopic.section)
                    .map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                </select>
                {currentWorkspaceSections.filter(s => s.name !== moveSectionSourceTopic.section).length === 0 && (
                  <p className="text-[11px] font-medium text-amber-600 mt-0.5">
                    ⚠️ No other sections available in this workspace. Create a new section first!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setMoveSectionSourceTopic(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetSectionForMove}
                  onClick={handleConfirmMoveTopicToSection}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-700 disabled:opacity-40 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FolderOutput className="w-3.5 h-3.5" />
                  <span>Move Topic</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Topic Customizer Modal: Custom Icon & Color Picker */}
      <AnimatePresence>
        {customizingTopic && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transform-gpu cursor-pointer"
              onClick={() => setCustomizingTopic(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
              className="relative z-10 bg-white rounded-2xl max-w-[500px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/80 overflow-hidden transform-gpu flex flex-col gap-4.5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#2563EB]" />
                    <span>Customize Topic Icon & Color</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Personalize “<span className="font-semibold text-slate-800">{customizingTopic.title}</span>” with a custom palette and icon.
                  </p>
                </div>
                <button
                  onClick={() => setCustomizingTopic(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Preview Card */}
              {(() => {
                const previewTopic = {
                  ...customizingTopic,
                  customColor: customColorSelection || undefined,
                  customIcon: customIconSelection || undefined
                };
                const prevTheme = getTopicTheme(previewTopic);
                const PrevIcon = prevTheme.icon || BookOpen;
                return (
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${prevTheme.cardIconBg} flex items-center justify-center text-white shadow-xs`}>
                        <PrevIcon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{customizingTopic.title}</span>
                        <span className="text-[11px] font-medium text-slate-400">Live Card Preview</span>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${prevTheme.bg}`}>
                      Active Theme
                    </div>
                  </div>
                );
              })()}

              {/* 1. Color Palette Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-900">Choose Accent Color (7 Highlighted Palettes)</label>
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { id: 'blue', name: 'Royal Blue', color: '#2563EB', bgClass: 'bg-[#2563EB]' },
                    { id: 'purple', name: 'Purple', color: '#8B5CF6', bgClass: 'bg-[#8B5CF6]' },
                    { id: 'green', name: 'Emerald', color: '#10B981', bgClass: 'bg-[#10B981]' },
                    { id: 'orange', name: 'Orange', color: '#EA580C', bgClass: 'bg-[#EA580C]' },
                    { id: 'pink', name: 'Rose Pink', color: '#F43F5E', bgClass: 'bg-[#F43F5E]' },
                    { id: 'cyan', name: 'Cyan', color: '#06B6D4', bgClass: 'bg-[#06B6D4]' },
                    { id: 'amber', name: 'Gold', color: '#F59E0B', bgClass: 'bg-[#F59E0B]' }
                  ].map(p => {
                    const isSelected = customColorSelection === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setCustomColorSelection(isSelected ? '' : p.id)}
                        className={`h-9 rounded-xl ${p.bgClass} flex items-center justify-center text-white transition-all cursor-pointer shadow-xs ${
                          isSelected ? 'ring-3 ring-offset-2 ring-slate-900 scale-105' : 'hover:opacity-90 hover:scale-102'
                        }`}
                        title={p.name}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Popular Icons Selector */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">Choose Topic Icon</label>
                  {customIconSelection && (
                    <button
                      type="button"
                      onClick={() => setCustomIconSelection('')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Reset to Auto
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-[160px] overflow-y-auto p-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  {[
                    // 1. বাংলা ব্যাকরণ & ভাষা
                    { id: 'languages', comp: Languages, label: 'Languages' },
                    { id: 'type', comp: Type, label: 'Type' },
                    { id: 'spellcheck', comp: SpellCheck, label: 'Spell Check' },
                    { id: 'booka', comp: BookA, label: 'Book A' },
                    { id: 'notebooktabs', comp: NotebookTabs, label: 'Notebook Tabs' },
                    { id: 'wholeword', comp: WholeWord, label: 'Whole Word' },
                    { id: 'textcursor', comp: TextCursor, label: 'Text Cursor' },
                    { id: 'pilcrow', comp: Pilcrow, label: 'Pilcrow' },
                    { id: 'casesensitive', comp: CaseSensitive, label: 'Case Sensitive' },
                    { id: 'brackets', comp: Brackets, label: 'Brackets' },
                    
                    // 2. সাহিত্য
                    { id: 'bookopen', comp: BookOpen, label: 'Book Open' },
                    { id: 'bookopentext', comp: BookOpenText, label: 'Book Text' },
                    { id: 'library', comp: Library, label: 'Library' },
                    { id: 'feather', comp: Feather, label: 'Feather' },
                    { id: 'pentool', comp: PenTool, label: 'Pen Tool' },
                    { id: 'scroll', comp: Scroll, label: 'Scroll' },
                    { id: 'scrolltext', comp: ScrollText, label: 'Scroll Text' },
                    { id: 'notebook', comp: Notebook, label: 'Notebook' },
                    { id: 'quote', comp: Quote, label: 'Quote' },
                    { id: 'bookmarked', comp: BookMarked, label: 'Bookmark' },
                    { id: 'graduationcap', comp: GraduationCap, label: 'Graduation' },
                    { id: 'penline', comp: PenLine, label: 'Writing' },
                    { id: 'bookcopy', comp: BookCopy, label: 'Books' },
                    { id: 'theater', comp: Theater, label: 'Drama' },

                    // 5. গণিত
                    { id: 'calculator', comp: Calculator, label: 'Calculator' },
                    { id: 'sigma', comp: Sigma, label: 'Sigma' },
                    { id: 'radical', comp: Radical, label: 'Radical' },
                    { id: 'pi', comp: Pi, label: 'Pi' },
                    { id: 'percent', comp: Percent, label: 'Percent' },
                    { id: 'divide', comp: Divide, label: 'Divide' },
                    { id: 'squarefunction', comp: SquareFunction, label: 'Square Function' },
                    { id: 'equal', comp: Equal, label: 'Equal' },
                    { id: 'variable', comp: Variable, label: 'Variable' },
                    { id: 'binary', comp: Binary, label: 'Binary' },
                    { id: 'chartnoaxescolumn', comp: ChartNoAxesColumn, label: 'Bar Chart' },

                    // 6. মানসিক দক্ষতা
                    { id: 'brain', comp: Brain, label: 'Brain' },
                    { id: 'braincircuit', comp: BrainCircuit, label: 'Brain Circuit' },
                    { id: 'puzzle', comp: Puzzle, label: 'Puzzle' },
                    { id: 'lightbulb', comp: Lightbulb, label: 'Idea' },
                    { id: 'blocks', comp: Blocks, label: 'Blocks' },
                    { id: 'route', comp: Route, label: 'Route' },
                    { id: 'network', comp: Network, label: 'Network' },
                    { id: 'scansearch', comp: ScanSearch, label: 'Scan Search' },
                    { id: 'workflow', comp: Workflow, label: 'Workflow' },
                    { id: 'gitbranch', comp: GitBranch, label: 'Git Branch' },
                    { id: 'shapes', comp: Shapes, label: 'Shapes' },
                    { id: 'waypoints', comp: Waypoints, label: 'Waypoints' },

                    // 7 & 8. বাংলাদেশ ও আন্তর্জাতিক
                    { id: 'map', comp: Map, label: 'Map' },
                    { id: 'mappinned', comp: MapPinned, label: 'Map Pin' },
                    { id: 'landmark', comp: Landmark, label: 'Landmark' },
                    { id: 'flag', comp: Flag, label: 'Flag' },
                    { id: 'building2', comp: Building2, label: 'Building' },
                    { id: 'scale', comp: Scale, label: 'Scale' },
                    { id: 'badgecheck', comp: BadgeCheck, label: 'Badge' },
                    { id: 'globe', comp: Globe, label: 'Globe' },
                    { id: 'earth', comp: Earth, label: 'Earth' },
                    { id: 'handshake', comp: Handshake, label: 'Handshake' },
                    { id: 'plane', comp: Plane, label: 'Plane' },
                    { id: 'ship', comp: Ship, label: 'Ship' },

                    // 9. বিজ্ঞান
                    { id: 'atom', comp: Atom, label: 'Atom' },
                    { id: 'flaskconical', comp: FlaskConical, label: 'Flask' },
                    { id: 'microscope', comp: Microscope, label: 'Microscope' },
                    { id: 'telescope', comp: Telescope, label: 'Telescope' },
                    { id: 'dna', comp: Dna, label: 'DNA' },
                    { id: 'testtube', comp: TestTube, label: 'Test Tube' },
                    { id: 'orbit', comp: Orbit, label: 'Orbit' },
                    { id: 'magnet', comp: Magnet, label: 'Magnet' },
                    { id: 'zap', comp: Zap, label: 'Electricity' },
                    { id: 'thermometer', comp: Thermometer, label: 'Thermometer' },
                    { id: 'radiation', comp: Radiation, label: 'Radiation' },

                    // 10. ICT / Computer
                    { id: 'monitor', comp: Monitor, label: 'Monitor' },
                    { id: 'computer', comp: Computer, label: 'Computer' },
                    { id: 'cpu', comp: Cpu, label: 'CPU' },
                    { id: 'microchip', comp: Microchip, label: 'Microchip' },
                    { id: 'database', comp: Database, label: 'Database' },
                    { id: 'server', comp: Server, label: 'Server' },
                    { id: 'wifi', comp: Wifi, label: 'Wifi' },
                    { id: 'code2', comp: Code2, label: 'Code' },
                    { id: 'terminal', comp: Terminal, label: 'Terminal' },
                    { id: 'cloud', comp: Cloud, label: 'Cloud' },

                    // 11, 12, 13. ভূগোল, পরিবেশ ও দুর্যোগ
                    { id: 'mountain', comp: Mountain, label: 'Mountain' },
                    { id: 'waves', comp: Waves, label: 'Waves' },
                    { id: 'compass', comp: Compass, label: 'Compass' },
                    { id: 'navigation', comp: Navigation, label: 'Navigation' },
                    { id: 'trees', comp: Trees, label: 'Trees' },
                    { id: 'treepine', comp: TreePine, label: 'Pine Tree' },
                    { id: 'leaf', comp: Leaf, label: 'Leaf' },
                    { id: 'sprout', comp: Sprout, label: 'Sprout' },
                    { id: 'recycle', comp: Recycle, label: 'Recycle' },
                    { id: 'droplets', comp: Droplets, label: 'Droplets' },
                    { id: 'wind', comp: Wind, label: 'Wind' },
                    { id: 'sun', comp: Sun, label: 'Sun' },
                    { id: 'cloudsun', comp: CloudSun, label: 'Cloud Sun' },
                    { id: 'flower', comp: Flower, label: 'Flower' },
                    { id: 'biohazard', comp: Biohazard, label: 'Biohazard' },
                    { id: 'alerttriangle', comp: AlertTriangle, label: 'Warning' },
                    { id: 'siren', comp: Siren, label: 'Siren' },
                    { id: 'shieldalert', comp: ShieldAlert, label: 'Shield Alert' },
                    { id: 'cloudlightning', comp: CloudLightning, label: 'Lightning' },
                    { id: 'flame', comp: Flame, label: 'Flame' },
                    { id: 'lifebuoy', comp: LifeBuoy, label: 'Life Buoy' },
                    { id: 'ambulance', comp: Ambulance, label: 'Ambulance' },
                    { id: 'radio', comp: Radio, label: 'Radio' },
                    { id: 'cross', comp: Cross, label: 'Cross' },

                    // 14, 15, 16. নৈতিকতা, মূল্যবোধ ও সুশাসন
                    { id: 'hearthandshake', comp: HeartHandshake, label: 'Heart Handshake' },
                    { id: 'handheart', comp: HandHeart, label: 'Hand Heart' },
                    { id: 'heart', comp: Heart, label: 'Heart' },
                    { id: 'smile', comp: Smile, label: 'Smile' },
                    { id: 'gem', comp: Gem, label: 'Gem' },
                    { id: 'thumbsup', comp: ThumbsUp, label: 'Thumbs Up' },
                    { id: 'usercheck', comp: UserCheck, label: 'User Check' },
                    { id: 'checkcircle2', comp: CheckCircle2, label: 'Check Circle' },
                    { id: 'star', comp: Star, label: 'Star' },
                    { id: 'sparkles', comp: Sparkles, label: 'Sparkles' },
                    { id: 'vote', comp: Vote, label: 'Vote' },
                    { id: 'filecheck', comp: FileCheck, label: 'File Check' },
                    { id: 'clipboardcheck', comp: ClipboardCheck, label: 'Clipboard' },
                    { id: 'gavel', comp: Gavel, label: 'Gavel' },
                    { id: 'eye', comp: Eye, label: 'Eye' },

                    // 17, 18, 19, 20. Current Affairs, GK, ইতিহাস ও সংবিধান
                    { id: 'newspaper', comp: Newspaper, label: 'Newspaper' },
                    { id: 'rss', comp: Rss, label: 'RSS' },
                    { id: 'megaphone', comp: Megaphone, label: 'Megaphone' },
                    { id: 'calendardays', comp: CalendarDays, label: 'Calendar' },
                    { id: 'clock', comp: Clock, label: 'Clock' },
                    { id: 'bell', comp: Bell, label: 'Bell' },
                    { id: 'trendingup', comp: TrendingUp, label: 'Trending' },
                    { id: 'tv', comp: Tv, label: 'TV' },
                    { id: 'podcast', comp: Podcast, label: 'Podcast' },
                    { id: 'circlehelp', comp: CircleHelp, label: 'Help' },
                    { id: 'trophy', comp: Trophy, label: 'Trophy' },
                    { id: 'castle', comp: Castle, label: 'Castle' },
                    { id: 'crown', comp: Crown, label: 'Crown' },
                    { id: 'swords', comp: Swords, label: 'Swords' },
                    { id: 'hourglass', comp: Hourglass, label: 'Hourglass' },
                    { id: 'history', comp: History, label: 'History' },
                    { id: 'bookcheck', comp: BookCheck, label: 'Book Check' },

                    // 21, 22, 23. অর্থনীতি, ব্যাংকিং ও কৃষি
                    { id: 'banknote', comp: Banknote, label: 'Banknote' },
                    { id: 'creditcard', comp: CreditCard, label: 'Credit Card' },
                    { id: 'walletcards', comp: WalletCards, label: 'Wallet Cards' },
                    { id: 'receipt', comp: Receipt, label: 'Receipt' },
                    { id: 'chartnoaxescombined', comp: ChartNoAxesCombined, label: 'Chart' },
                    { id: 'piggybank', comp: PiggyBank, label: 'Piggy Bank' },
                    { id: 'vault', comp: Vault, label: 'Vault' },
                    { id: 'badgedollarsign', comp: BadgeDollarSign, label: 'Dollar Badge' },
                    { id: 'wallet', comp: Wallet, label: 'Wallet' },
                    { id: 'coins', comp: Coins, label: 'Coins' },
                    { id: 'circledollarsign', comp: CircleDollarSign, label: 'Dollar' },
                    { id: 'handcoins', comp: HandCoins, label: 'Hand Coins' },
                    { id: 'wheat', comp: Wheat, label: 'Wheat' },
                    { id: 'tractor', comp: Tractor, label: 'Tractor' },
                    { id: 'shovel', comp: Shovel, label: 'Shovel' },
                    { id: 'apple', comp: Apple, label: 'Apple' },
                    { id: 'warehouse', comp: Warehouse, label: 'Warehouse' },

                    // 24, 25. মুক্তিযুদ্ধ ও খেলাধুলা
                    { id: 'medal', comp: Medal, label: 'Medal' },
                    { id: 'award', comp: Award, label: 'Award' },
                    { id: 'shield', comp: Shield, label: 'Shield' },
                    { id: 'dumbbell', comp: Dumbbell, label: 'Dumbbell' },
                    { id: 'volleyball', comp: Volleyball, label: 'Volleyball' },
                    { id: 'bike', comp: Bike, label: 'Bike' },
                    { id: 'goal', comp: Goal, label: 'Goal' },
                    { id: 'timer', comp: Timer, label: 'Timer' },
                    { id: 'flagtriangleright', comp: FlagTriangleRight, label: 'Flag Triangle' },
                    { id: 'target', comp: Target, label: 'Target' }
                  ].map(ic => {
                    const Comp = ic.comp;
                    const isSelected = customIconSelection === ic.id;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setCustomIconSelection(isSelected ? '' : ic.id)}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white shadow-xs scale-105'
                            : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={ic.label}
                      >
                        <Comp className="w-4 h-4 stroke-[2]" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setCustomColorSelection('');
                    setCustomIconSelection('');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset all</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomizingTopic(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customizingTopic) return;
                      const updated = {
                        ...customizingTopic,
                        customColor: customColorSelection || undefined,
                        customIcon: customIconSelection || undefined
                      };
                      setTopics(prev => prev.map(t => t.id === updated.id ? updated : t));
                      setCustomizingTopic(null);
                      showToast(`Updated custom style for "${customizingTopic.title}"!`);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1742BF] rounded-lg shadow-sm shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Task to Recycle Bin Confirmation Modal */}
      <AnimatePresence>
        {taskToDelete && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
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
              {/* Close Button */}
              <button
                onClick={() => setTaskToDelete(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>

              {/* Modal Header */}
              <h3 className="text-base font-bold text-slate-900">
                Move task to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[340px]">
                “<span className="font-semibold text-slate-800">{taskToDelete.task.title}</span>” will be moved to the Recycle Bin. You can undo this action immediately.
              </p>

              {/* Action Buttons */}
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
                  onClick={handleConfirmMoveTaskToRecycleBin}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Move to Recycle Bin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move to Recycle Bin Confirmation Modal (Topic - Higher Z-Index) */}
      <AnimatePresence>
        {topicToDelete && (
          <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs cursor-pointer"
              onClick={() => setTopicToDelete(null)}
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
                Move Topic to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[360px]">
                Are you sure? Topic “<span className="font-semibold text-slate-800">{topicToDelete.title}</span>” and its {topicToDelete.tasks?.length || 0} {topicToDelete.tasks?.length === 1 ? 'task' : 'tasks'} will be moved to the Recycle Bin.
              </p>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-end gap-2.5 mt-5">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setTopicToDelete(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMoveToRecycleBin}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Move to Recycle Bin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Workspace Move to Recycle Bin Confirmation Modal */}
      <AnimatePresence>
        {workspaceToDelete && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-xs cursor-pointer"
              onClick={() => setWorkspaceToDelete(null)}
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
                Move workspace to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[360px]">
                Are you sure? Workspace “<span className="font-semibold text-slate-800">{workspaceToDelete.name}</span>” and all of its contents will be moved to the Recycle Bin.
              </p>

              {/* Workspace Details Card */}
              {(() => {
                const wsTopics = topics.filter(t => t.workspaceId === workspaceToDelete.id);
                const totalTasks = wsTopics.reduce((acc, t) => acc + (t.tasks ? t.tasks.length : 0), 0);
                const completedTasks = wsTopics.reduce((acc, t) => acc + (t.tasks ? t.tasks.filter(tk => tk.completed).length : 0), 0);
                const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <div className="w-full mt-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 p-3">
                    <div className="grid grid-cols-3 divide-x divide-slate-200/80 text-center">
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Topics</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">{wsTopics.length}</span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Tasks</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">{totalTasks}</span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Progress</span>
                        <span className="text-sm font-bold text-[#176BFF] mt-0.5">{progressPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-end gap-2.5 mt-4.5">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setWorkspaceToDelete(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMoveWorkspaceToRecycleBin}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Move to Recycle Bin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section Move to Recycle Bin Confirmation Modal */}
      <AnimatePresence>
        {sectionToDelete && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
              className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-xs cursor-pointer"
              onClick={() => setSectionToDelete(null)}
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
                Move section to Recycle Bin?
              </h3>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[360px]">
                Are you sure? Section “<span className="font-semibold text-slate-800">{sectionToDelete}</span>” and all of its topics will be moved to the Recycle Bin.
              </p>

              {/* Section Details Card */}
              {(() => {
                const secTopics = topics.filter(t => t.workspaceId === activeWorkspaceId && t.section === sectionToDelete);
                const totalTasks = secTopics.reduce((acc, t) => acc + (t.tasks ? t.tasks.length : 0), 0);
                const completedTasks = secTopics.reduce((acc, t) => acc + (t.tasks ? t.tasks.filter(tk => tk.completed).length : 0), 0);
                const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <div className="w-full mt-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 p-3">
                    <div className="grid grid-cols-3 divide-x divide-slate-200/80 text-center">
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Topics</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">{secTopics.length}</span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Tasks</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">{totalTasks}</span>
                      </div>
                      <div className="flex flex-col px-2">
                        <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Progress</span>
                        <span className="text-sm font-bold text-[#176BFF] mt-0.5">{progressPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-end gap-2.5 mt-4.5">
                <button
                  autoFocus
                  type="button"
                  onClick={() => setSectionToDelete(null)}
                  className="h-[36px] px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (sectionToDelete) {
                      const sec = sectionToDelete;
                      setSectionToDelete(null);
                      handleDeleteSection(sec);
                    }
                  }}
                  className="h-[36px] px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Move to Recycle Bin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Topic Details Right Sidebar Drawer (Opens on clicking topic in Card/Banner view or Global Search deep link) */}
      {selectedTopicId && isDetailsDrawerOpen && (
        <TopicDetailsDrawer
          topic={topics.find(t => t.id === selectedTopicId) || null}
          isOpen={isDetailsDrawerOpen}
          navigationTarget={drawerNavigationTarget}
          onClose={() => {
            setIsDetailsDrawerOpen(false);
            setSyncedTopics(topics);
          }}
          onTogglePin={(topicId) => togglePinTopic(topicId)}
          onToggleTask={(topicId, taskId) => toggleTaskCompleted(topicId, taskId)}
          onAddTask={(topicId, title) => handleAddTask(topicId, title)}
          onDeleteTask={(topicId, taskId) => handleDeleteTask(topicId, taskId)}
          onUpdateTask={(topicId, updatedTask) => handleUpdateTask(topicId, updatedTask)}
          onRenameTask={(topicId, taskId, newTitle) => handleSaveRenameTask(topicId, taskId, newTitle)}
          onUpdateTopic={(updatedTopic) => {
            setTopics(prev => prev.map(t => t.id === updatedTopic.id ? updatedTopic : t));
          }}
          onRenameTopic={(topicId, newTitle) => {
            setTopics(prev => prev.map(t => t.id === topicId ? { ...t, title: newTitle } : t));
          }}
          onStartRenameTopic={(targetTopic) => {
            setEditingTopicId(targetTopic.id);
            setEditingTopicTitle(targetTopic.title);
          }}
          onDeleteTopic={(topicId) => {
            const targetTopic = topics.find(t => t.id === topicId);
            if (targetTopic) {
              setTopicToDelete(targetTopic);
            }
          }}
          onMergeTopic={(top) => {
            setMergeSourceTopic(top);
            setTargetTopicIdForMerge('');
          }}
          onMoveSectionTopic={(top) => {
            setMoveSectionSourceTopic(top);
            setTargetSectionForMove('');
          }}
          onDuplicateTopic={(topicId) => handleDuplicateTopic(topicId)}
          onBulkToggleTaskCompleted={(topicId, taskIds, completed) => handleBulkToggleTaskCompleted(topicId, taskIds, completed)}
          onBulkDeleteTasks={(topicId, taskIds) => handleBulkDeleteTasks(topicId, taskIds)}
          activeStudyTimerSession={activeStudyTimer}
          onStartStudyTimer={handleStartGlobalStudyTimer}
          onPauseStudyTimer={handlePauseGlobalStudyTimer}
          onResumeStudyTimer={handleResumeGlobalStudyTimer}
          onStopStudyTimer={handleStopAndLogGlobalStudyTimer}
          showToast={showToast}
          theme={(() => {
            const curTopic = topics.find(t => t.id === selectedTopicId);
            return curTopic ? getTopicTheme(curTopic) : undefined;
          })()}
          onOpenCustomizer={() => {
            const curTopic = topics.find(t => t.id === selectedTopicId);
            if (curTopic) {
              setCustomizingTopic(curTopic);
            }
          }}
          onActiveTaskStateChange={setDrawerActiveTaskState}
          requestedFocusTaskId={requestedFocusTaskId}
          onResetRequestedFocusTaskId={() => setRequestedFocusTaskId(null)}
          allTopics={topics}
          workspaces={workspaces}
          onNavigateToTask={(topicId, taskId, workspaceId) => {
            if (workspaceId && workspaceId !== activeWorkspaceId) {
              setActiveWorkspaceId(workspaceId);
            }
            setSelectedTopicId(topicId);
            setRequestedFocusTaskId(taskId);
            setIsDetailsDrawerOpen(true);
          }}
          focusCheckIntervalMinutes={userSettings.focusCheckIntervalMinutes || 20}
          focusCheckIntervalEnabled={userSettings.focusCheckIntervalEnabled !== false}
          onSoftDeleteNoteItem={handleSoftDeleteDrawerNote}
          onSoftDeleteLinkItem={handleSoftDeleteDrawerLink}
        />
      )}

      {/* Global Floating Study Timer Widget (Active when drawer is closed or user navigates to another task/tab) */}
      <FloatingStudyTimer
        session={activeStudyTimer}
        isVisible={isFloatingTimerVisible}
        onPause={handlePauseGlobalStudyTimer}
        onResume={handleResumeGlobalStudyTimer}
        onStopAndLog={() => handleStopAndLogGlobalStudyTimer()}
        onOpenDrawer={() => {
          if (activeStudyTimer) {
            if (activeStudyTimer.workspaceId && activeStudyTimer.workspaceId !== activeWorkspaceId) {
              setActiveWorkspaceId(activeStudyTimer.workspaceId);
            }
            setSelectedTopicId(activeStudyTimer.topicId);
            setRequestedFocusTaskId(activeStudyTimer.taskId);
            setIsDetailsDrawerOpen(true);
          }
        }}
      />

      {/* Global Still Studying Presence Check Modal (Universally rendered across app and drawers) */}
      <AnimatePresence>
        {isGlobalStillStudyingOpen && activeStudyTimer && (
          <div className="fixed inset-0 z-[999999999] flex items-center justify-center p-4">
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
              className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl max-w-[380px] w-full p-6 shadow-2xl shadow-slate-900/25 border border-slate-200/90 dark:border-slate-800 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#176BFF] border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center mb-3.5 shrink-0 shadow-sm animate-bounce" style={{ animationDuration: '2s' }}>
                <Bell className="w-7 h-7 stroke-[2.3]" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Still Studying? 📖
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-[310px]">
                You reached your <b>{(userSettings.focusCheckIntervalMinutes || 20) === 0.5 ? '30-second' : `${userSettings.focusCheckIntervalMinutes || 20}-minute`}</b> focus milestone for “<span className="font-semibold text-slate-800 dark:text-slate-200">{activeStudyTimer.taskTitle || 'this task'}</span>”!
              </p>

              <div className="w-full flex flex-col gap-2 mt-6">
                <button
                  autoFocus
                  type="button"
                  onClick={handleResumeGlobalStudyTimer}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#176BFF] hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Yes, Keep Studying!
                </button>
                <button
                  type="button"
                  onClick={() => handleStopAndLogGlobalStudyTimer()}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Take a Break & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={userSettings}
            onSaveSettings={handleSaveSettings}
            onClose={() => setIsSettingsOpen(false)}
            onExportJSON={handleExportJSON}
            onImportTrigger={() => fileInputRef.current?.click()}
          />
        )}
      </AnimatePresence>

      {/* Firebase Auth Modal (Sign In / Sign Up / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setToastData({ message: 'Welcome! Successfully logged in.' });
        }}
      />

      {/* Edit Profile Modal (Name & Display Info) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(newName) => {
          setToastData({ message: 'Display name updated successfully! ✨' });
          if (auth.currentUser) {
            setCurrentUser({ ...auth.currentUser, displayName: newName });
          }
        }}
      />

      {/* Direct In-App Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userEmail={currentUser?.email}
        onSuccess={() => {
          setToastData({ message: 'Password updated successfully! 🔒' });
        }}
      />

      {/* Professional Bottom Right Screen Toast Notification (Highest z-index, always front) */}
      <AnimatePresence>
        {toastData && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed ${isFloatingTimerVisible ? 'bottom-20 sm:bottom-22' : 'bottom-6'} right-4 sm:right-6 z-[999999999] pointer-events-auto select-none max-w-[calc(100vw-2rem)] sm:max-w-[420px] transition-all duration-200`}
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-[#0F172A]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/70 text-xs font-semibold tracking-tight min-w-[280px]">
              <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 text-white shadow-xs">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="flex-1 text-slate-100 leading-snug">{toastData.message}</span>
              {toastData.undoAction && (
                <button
                  type="button"
                  onClick={() => {
                    toastData.undoAction?.();
                    setToastData(null);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Undo
                </button>
              )}
              <button
                type="button"
                onClick={() => setToastData(null)}
                className="p-1 hover:bg-slate-700/60 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebratory Center Screen Topic 100% Complete Milestone Dialog */}
      <AnimatePresence>
        {congratulationsTopic && (
          <TopicCelebrationModal
            topic={congratulationsTopic}
            dailyGoal={{
              completed: completedTopicsCount,
              target: userSettings.dailyTarget || 10,
            }}
            nextTopic={nextIncompleteTopic}
            onStartNextTopic={(nextTopicId) => {
              setCongratulationsTopic(null);
              setSelectedTopicId(nextTopicId);
              setIsDetailsDrawerOpen(true);
              setTimeout(() => {
                const el = document.getElementById(nextTopicId);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 150);
            }}
            onClose={() => setCongratulationsTopic(null)}
          />
        )}
      </AnimatePresence>

      {/* Global Today's Goal 100% Achieved Celebration Modal */}
      <GoalCelebrationModal
        isOpen={isGoalCelebrationOpen}
        onClose={() => setIsGoalCelebrationOpen(false)}
        mode={dailyGoalMode}
        completedAmount={currentGoalValue}
        targetAmount={targetGoalValue}
        streakDays={streakData.currentStreak}
        workspaceCount={workspacesStats.filter(w => w.completedTasksCount > 0 || w.timeSpentMinutes > 0).length || workspaces.length}
        soundEnabled={userSettings.soundEffects !== false}
        confettiEnabled={userSettings.confettiCelebration !== false}
        isMilestone={latestMilestoneInfo.isMilestone}
        milestoneTitle={latestMilestoneInfo.title}
        milestoneIcon={latestMilestoneInfo.icon}
      />

      {/* Fixed 3-Dot Dropdown Menu for Workspace - Always on Top */}
      <AnimatePresence>
        {activeMenuWorkspaceId && workspaceMenuPos && (
          <motion.div
            key={activeMenuWorkspaceId}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: `${workspaceMenuPos.top}px`,
              left: `${workspaceMenuPos.left}px`,
              zIndex: 999999,
            }}
            onClick={e => e.stopPropagation()}
            className="w-[180px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/40 backdrop-blur-md rounded-xl p-1 text-xs font-medium workspace-menu text-slate-700 dark:text-slate-200 select-none"
          >
            {(() => {
              const targetWs = workspaces.find(w => w.id === activeMenuWorkspaceId);
              if (!targetWs) return null;
              return (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleWorkspaceNewSection(targetWs.id);
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                      if (window.innerWidth < 768) setSidebarCollapsed(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">New section</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      togglePinWorkspace(targetWs.id);
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Pin className={`w-3.5 h-3.5 shrink-0 ${targetWs.isPinned ? 'text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate">{targetWs.isPinned ? 'Unpin' : 'Pin'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                      if (window.innerWidth < 768) setSidebarCollapsed(true);
                      handleStartRenameWorkspace(targetWs);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">Rename</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuWorkspaceId(null);
                      setWorkspaceMenuPos(null);
                      handleMoveWorkspaceToRecycleBin(targetWs.id);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer my-0.5 text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/40 hover:text-red-700 dark:hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-rose-400 shrink-0" />
                    <span className="truncate">Move to Recycle bin</span>
                  </button>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Instant Floating Tooltip Portal (Always Top-Most, Never Clipped) */}
      <AnimatePresence>
        {tooltipData && (
          <div
            style={{
              position: 'fixed',
              left: `${tooltipData.x}px`,
              top: `${tooltipData.y}px`,
              transform:
                tooltipData.side === 'right'
                  ? 'translateY(-50%)'
                  : tooltipData.side === 'bottom'
                  ? 'translateX(-50%)'
                  : 'translate(-50%, -100%)',
              zIndex: 999999,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                x: tooltipData.side === 'right' ? -4 : tooltipData.side === 'left' ? 4 : 0,
                y: tooltipData.side === 'bottom' ? -4 : tooltipData.side === 'top' ? 4 : 0,
              }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="px-2.5 py-1 bg-[#0F172A]/95 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide rounded-md shadow-lg shadow-black/25 border border-white/10 select-none whitespace-nowrap"
            >
              {tooltipData.content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
