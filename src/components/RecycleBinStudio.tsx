import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  RotateCcw,
  Folder,
  FileText,
  NotebookPen,
  Search,
  ChevronLeft,
  X,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  Eye,
  Check,
  FolderOpen,
  LayoutGrid,
  CheckSquare,
  Link2,
  BookOpen,
  AlignLeft,
  ChevronRight,
  Menu,
  Clock,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';
import { StudyNote, Workspace } from './NotesStudio';
import { soundManager } from '../utils/audio';

export interface DeletedWorkspaceItem {
  workspace: {
    id: string;
    name: string;
    [key: string]: any;
  };
  topics: any[];
  deletedAt?: string;
}

export interface DeletedNoteItem {
  note: StudyNote;
  deletedAt?: string;
}

export interface DeletedSectionItem {
  section: {
    id: string;
    workspaceId: string;
    name: string;
    [key: string]: any;
  };
  topics?: any[];
  deletedAt?: string;
}

export interface DeletedTaskItem {
  task: {
    id: string;
    title: string;
    completed?: boolean;
    priority?: string;
    dueDate?: string;
    confidence?: string;
    notes?: any[];
    links?: any[];
    [key: string]: any;
  };
  topicId: string;
  topicTitle: string;
  workspaceId: string;
  deletedAt?: string;
}

export interface DeletedTopicNoteItem {
  note: {
    id: string;
    text: string;
    date?: string;
    isPinned?: boolean;
    [key: string]: any;
  };
  topicId: string;
  topicTitle: string;
  workspaceId?: string;
  taskId?: string;
  taskTitle?: string;
  isTopicNote?: boolean;
  deletedAt?: string;
}

export interface DeletedTopicLinkItem {
  link: {
    id: string;
    title?: string;
    url: string;
    type?: string;
    [key: string]: any;
  };
  topicId: string;
  topicTitle: string;
  workspaceId?: string;
  taskId?: string;
  taskTitle?: string;
  deletedAt?: string;
}

export interface RecycleBinStudioProps {
  deletedWorkspaces: DeletedWorkspaceItem[];
  deletedTopics: any[];
  deletedNotes: DeletedNoteItem[];
  deletedSections: DeletedSectionItem[];
  deletedTasks?: DeletedTaskItem[];
  deletedTopicNotes?: DeletedTopicNoteItem[];
  deletedTopicLinks?: DeletedTopicLinkItem[];
  workspaces: Workspace[];
  onRestoreWorkspace: (wsId: string) => void;
  onPermanentDeleteWorkspace: (wsId: string) => void;
  onRestoreTopic: (topicId: string) => void;
  onPermanentDeleteTopic: (topicId: string) => void;
  onRestoreNote?: (noteId: string) => void;
  onPermanentDeleteNote?: (noteId: string) => void;
  onRestoreSection?: (sectionId: string) => void;
  onPermanentDeleteSection?: (sectionId: string) => void;
  onRestoreTask?: (taskId: string) => void;
  onPermanentDeleteTask?: (taskId: string) => void;
  onRestoreTopicNote?: (noteId: string) => void;
  onPermanentDeleteTopicNote?: (noteId: string) => void;
  onRestoreTopicLink?: (linkId: string) => void;
  onPermanentDeleteTopicLink?: (linkId: string) => void;
  onEmptyRecycleBin: () => void;
  onClose: () => void;
  showToast: (msg: string) => void;
  soundEffectsEnabled?: boolean;
  onToggleSidebar?: () => void;
}

type RecycleItemType = 'all' | 'workspace' | 'section' | 'topic' | 'task' | 'note' | 'link';
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'type';

interface BreadcrumbPart {
  label: string;
  isHighlight?: boolean;
}

interface UnifiedRecycleItem {
  id: string;
  type: 'workspace' | 'section' | 'topic' | 'task' | 'note' | 'link';
  title: string;
  originalLocation: string;
  locationPath: BreadcrumbPart[];
  deletedAtDate: Date;
  deletedAtFormatted: string;
  daysLeft: number;
  itemCountInfo: string;
  rawData: any;
  originalIndex: number;
}

// Helper to format date cleanly: "Jul 28, 2026 10:46 PM"
function formatDeletedOnDate(date: Date, rawFormatted?: string): string {
  try {
    if (date.getTime() === 0) return rawFormatted || 'Recently';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = String(hours24 % 12 || 12).padStart(2, '0');
    return `${month} ${day}, ${year} ${hours12}:${minutes} ${ampm}`;
  } catch {
    return rawFormatted || 'Recently';
  }
}

// 30 days retention countdown helper
function calculateDaysLeft(date: Date): number {
  if (date.getTime() === 0) return 30;
  const RETENTION_DAYS = 30;
  const now = new Date().getTime();
  const deletedTime = date.getTime();
  const diffDays = Math.floor((now - deletedTime) / (1000 * 60 * 60 * 24));
  const daysRemaining = RETENTION_DAYS - diffDays;
  return Math.max(1, Math.min(30, daysRemaining));
}

// Helper to parse date
function parseItemDate(deletedAt?: string, fallbackTimestamp?: number): Date {
  if (deletedAt) {
    const standardDate = new Date(deletedAt);
    if (!isNaN(standardDate.getTime())) return standardDate;

    if (deletedAt.includes('/')) {
      const parts = deletedAt.split(/[\s/:]+/);
      if (parts.length >= 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        let hr = parts[3] ? parseInt(parts[3], 10) : 12;
        const min = parts[4] ? parseInt(parts[4], 10) : 0;
        const ampm = deletedAt.toLowerCase().includes('pm') ? 'pm' : deletedAt.toLowerCase().includes('am') ? 'am' : '';
        if (ampm === 'pm' && hr < 12) hr += 12;
        if (ampm === 'am' && hr === 12) hr = 0;
        const parsed = new Date(y, m, d, hr, min);
        if (!isNaN(parsed.getTime())) return parsed;
      }
    }
  }
  if (fallbackTimestamp) {
    const fromTs = new Date(fallbackTimestamp);
    if (!isNaN(fromTs.getTime())) return fromTs;
  }
  return new Date(0);
}

function detectLinkPlatform(url?: string, type?: string, title?: string): 'youtube' | 'facebook' | 'drive' | 'pdf' | 'chrome' {
  const text = `${url || ''} ${type || ''} ${title || ''}`.toLowerCase();
  if (text.includes('youtube') || text.includes('youtu.be')) return 'youtube';
  if (text.includes('facebook') || text.includes('fb.com') || text.includes('fb.watch')) return 'facebook';
  if (text.includes('drive.google') || text.includes('docs.google') || text.includes('sheets.google')) return 'drive';
  if (text.includes('.pdf') || text.includes('pdf')) return 'pdf';
  return 'chrome';
}

export const RecycleBinStudio: React.FC<RecycleBinStudioProps> = ({
  deletedWorkspaces,
  deletedTopics,
  deletedNotes = [],
  deletedSections = [],
  deletedTasks = [],
  deletedTopicNotes = [],
  deletedTopicLinks = [],
  workspaces,
  onRestoreWorkspace,
  onPermanentDeleteWorkspace,
  onRestoreTopic,
  onPermanentDeleteTopic,
  onRestoreNote,
  onPermanentDeleteNote,
  onRestoreSection,
  onPermanentDeleteSection,
  onRestoreTask,
  onPermanentDeleteTask,
  onRestoreTopicNote,
  onPermanentDeleteTopicNote,
  onRestoreTopicLink,
  onPermanentDeleteTopicLink,
  onEmptyRecycleBin,
  onClose,
  showToast,
  soundEffectsEnabled = true,
  onToggleSidebar,
}) => {
  const [activeTab, setActiveTab] = useState<RecycleItemType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<UnifiedRecycleItem | null>(null);
  const [isConfirmEmptyOpen, setIsConfirmEmptyOpen] = useState(false);
  const [itemToDeleteForever, setItemToDeleteForever] = useState<UnifiedRecycleItem | null>(null);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState<boolean>(false);
  const [isDesktopHeroScrolledPast, setIsDesktopHeroScrolledPast] = useState<boolean>(false);
  const [isHeroOpen, setIsHeroOpen] = useState<boolean>(true);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [pullDirection, setPullDirection] = useState<'up' | 'down'>('up');
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const touchStartScrollTopRef = useRef<number>(0);
  const isPullingDownRef = useRef<boolean>(false);
  const heroOpenAtTouchStartRef = useRef<boolean>(true);

  const getHeroOpacity = (): number => {
    if (isHeroOpen && pullDistance === 0) return 1;
    if (!isHeroOpen && pullDistance === 0) return 0;

    if (pullDirection === 'up') {
      return Math.min(1, Math.max(0, (pullDistance - 50) / 140));
    } else {
      const pct = (pullDistance / 204) * 100;
      if (pct <= 0) return 0;
      if (pct <= 2) return Math.min(0.10, Math.max(0, pct * 0.05));
      if (pct <= 4) return 0.10 + (pct - 2) * 0.01;
      if (pct <= 5) return 0.12 + (pct - 4) * 0.02;
      if (pct <= 7) return 0.14 + (pct - 5) * 0.01;
      if (pct <= 9) return 0.16 + (pct - 7) * 0.01;
      if (pct <= 10) return 0.18 + (pct - 9) * 0.02;
      if (pct <= 90) return 0.20 + ((pct - 10) / 80) * 0.80;
      return 1.0;
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const isSnappingRef = useRef<boolean>(false);
  const isTouchingRef = useRef<boolean>(false);
  const wasDeepInListRef = useRef<boolean>(false);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetDeepInListTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tableTouchStartYRef = useRef<number>(0);

  // Sync horizontal scrolling between sticky table header and table body on narrow mobile screens
  const handleHeaderScroll = () => {
    if (bodyScrollRef.current && headerScrollRef.current) {
      bodyScrollRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
    }
  };

  const handleBodyScroll = () => {
    if (headerScrollRef.current && bodyScrollRef.current) {
      headerScrollRef.current.scrollLeft = bodyScrollRef.current.scrollLeft;
    }
  };

  const handleTableTouchStart = (e: React.TouchEvent) => {
    tableTouchStartYRef.current = e.touches[0].clientY;
  };

  const handleTableTouchMove = (e: React.TouchEvent) => {
    const tableBody = bodyScrollRef.current;
    const outer = scrollContainerRef.current;
    if (!tableBody || !outer) return;
    if (window.innerWidth >= 640) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - tableTouchStartYRef.current;

    // If at item #1 (tableBody.scrollTop === 0) and pulling down (deltaY > 0), transfer scroll to outer container to open hero
    if (tableBody.scrollTop <= 0 && deltaY > 0) {
      if (outer.scrollTop > 0) {
        outer.scrollTop = Math.max(0, outer.scrollTop - deltaY * 0.6);
        tableTouchStartYRef.current = currentY;
      }
    }
  };

  // Mobile 50% scroll-snap: Triggered smoothly ONLY AFTER user releases finger from outer container
  const checkAndSnapThreshold = () => {
    if (isTouchingRef.current) return;

    const container = scrollContainerRef.current;
    const hero = heroCardRef.current;
    if (!container || !hero || isSnappingRef.current) return;
    if (window.innerWidth >= 640) return; // Mobile only

    const heroHeight = hero.offsetHeight;
    const gap = 12;
    const threshold = heroHeight + gap;
    const currentScroll = container.scrollTop;

    if (currentScroll > 0 && currentScroll < threshold) {
      if (currentScroll >= threshold * 0.5) {
        isSnappingRef.current = true;
        container.scrollTo({
          top: threshold,
          behavior: 'smooth'
        });
        setTimeout(() => {
          isSnappingRef.current = false;
        }, 350);
      }
    }
  };

  const handleTouchStart = () => {
    isTouchingRef.current = true;
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    setTimeout(checkAndSnapThreshold, 40);
  };

  const handleTouchCancel = () => {
    isTouchingRef.current = false;
  };

  const handleOuterContainerScroll = () => {
    const container = scrollContainerRef.current;
    const hero = heroCardRef.current;
    if (container && hero) {
      const threshold = hero.offsetHeight + 12;
      const atTop = container.scrollTop >= threshold - 2;
      setIsDesktopHeroScrolledPast(prev => (prev !== atTop ? atTop : prev));
    }

    if (isTouchingRef.current) return;
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(checkAndSnapThreshold, 100);
  };

  // Reset active match index on search or tab change
  useEffect(() => {
    setActiveMatchIndex(0);
  }, [searchQuery, activeTab]);

  // Click outside to close sort dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Alt + F keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Map workspace id to name for breadcrumb
  const workspaceMap = useMemo(() => {
    const map = new Map<string, string>();
    workspaces.forEach(ws => map.set(ws.id, ws.name));
    return map;
  }, [workspaces]);

  // Build unified list of deleted items
  const unifiedItems = useMemo<UnifiedRecycleItem[]>(() => {
    const items: UnifiedRecycleItem[] = [];

    // 1. Workspaces
    deletedWorkspaces.forEach(item => {
      const parsedDate = parseItemDate(item.deletedAt);
      items.push({
        id: `ws-${item.workspace.id}`,
        type: 'workspace',
        title: item.workspace.name || 'Untitled Workspace',
        originalLocation: '—',
        locationPath: [],
        deletedAtDate: parsedDate,
        deletedAtFormatted: formatDeletedOnDate(parsedDate, item.deletedAt),
        daysLeft: calculateDaysLeft(parsedDate),
        itemCountInfo: `${item.topics?.length || 0} topics included`,
        rawData: item,
        originalIndex: items.length,
      });
    });

    // 2. Sections
    deletedSections.forEach(item => {
      const parsedDate = parseItemDate(item.deletedAt);
      const wsName = workspaceMap.get(item.section.workspaceId) || 'Workspace';
      const topicsCount = item.topics?.length || 0;
      items.push({
        id: `sec-${item.section.id}`,
        type: 'section',
        title: item.section.name || 'Untitled Section',
        originalLocation: wsName,
        locationPath: [{ label: wsName }],
        deletedAtDate: parsedDate,
        deletedAtFormatted: formatDeletedOnDate(parsedDate, item.deletedAt),
        daysLeft: calculateDaysLeft(parsedDate),
        itemCountInfo: topicsCount > 0 ? `${topicsCount} topics included` : 'Section Container',
        rawData: item.section,
        originalIndex: items.length,
      });
    });

    // 3. Topics (Includes their notes, links, tasks)
    deletedTopics.forEach(topic => {
      const parsedDate = parseItemDate(topic.deletedAt);
      const wsName = workspaceMap.get(topic.workspaceId) || 'Workspace';
      const path: BreadcrumbPart[] = [{ label: wsName }];
      if (topic.section) path.push({ label: topic.section });

      const notesCount = topic.notes?.length || 0;
      const linksCount = topic.links?.length || 0;
      const tasksCount = topic.tasks?.length || 0;
      const metaInfo = [
        `${tasksCount} tasks`,
        notesCount > 0 ? `${notesCount} notes` : null,
        linksCount > 0 ? `${linksCount} links` : null
      ].filter(Boolean).join(' • ');

      items.push({
        id: `topic-${topic.id}`,
        type: 'topic',
        title: topic.title || topic.name || 'Untitled Topic',
        originalLocation: path.map(p => p.label).join(' > '),
        locationPath: path,
        deletedAtDate: parsedDate,
        deletedAtFormatted: formatDeletedOnDate(parsedDate, topic.deletedAt),
        daysLeft: calculateDaysLeft(parsedDate),
        itemCountInfo: metaInfo || `${tasksCount} tasks`,
        rawData: topic,
        originalIndex: items.length,
      });
    });

    // 4. Tasks (Individually deleted tasks)
    deletedTasks.forEach(item => {
      const parsedDate = parseItemDate(item.deletedAt);
      const wsName = workspaceMap.get(item.workspaceId) || 'Workspace';
      const path: BreadcrumbPart[] = [{ label: wsName }];
      if (item.topicTitle) path.push({ label: item.topicTitle, isHighlight: true });

      items.push({
        id: `task-${item.task.id}`,
        type: 'task',
        title: item.task.title || 'Untitled Task',
        originalLocation: path.map(p => p.label).join(' > '),
        locationPath: path,
        deletedAtDate: parsedDate,
        deletedAtFormatted: formatDeletedOnDate(parsedDate, item.deletedAt),
        daysLeft: calculateDaysLeft(parsedDate),
        itemCountInfo: item.task.completed ? 'Completed task' : 'Active task',
        rawData: item,
        originalIndex: items.length,
      });
    });

    // 5. Notes (From Notes Studio)
    deletedNotes.forEach(item => {
      const parsedDate = parseItemDate(item.deletedAt, item.note.updatedAt || item.note.createdAt);
      const wsName = item.note.workspaceId ? (workspaceMap.get(item.note.workspaceId) || 'Workspace') : 'Global Notes';
      items.push({
        id: `note-${item.note.id}`,
        type: 'note',
        title: item.note.title || 'Untitled Note',
        originalLocation: wsName,
        locationPath: [{ label: wsName }],
        deletedAtDate: parsedDate,
        deletedAtFormatted: formatDeletedOnDate(parsedDate, item.deletedAt),
        daysLeft: calculateDaysLeft(parsedDate),
        itemCountInfo: item.note.content ? `${item.note.content.replace(/<[^>]*>?/gm, '').length} chars` : 'Empty note',
        rawData: { ...item.note, isStudioNote: true },
        originalIndex: items.length,
      });
    });

    // 6. Topic & Task Micro-Notes
    deletedTopicNotes.forEach(item => {
      const parsedDate = parseItemDate(item.deletedAt);
      const wsName = item.workspaceId ? (workspaceMap.get(item.workspaceId) || 'Workspace') : 'Workspace';
      const path: BreadcrumbPart[] = [{ label: wsName }];
      if (item.topicTitle) path.push({ label: item.topicTitle });
      if (item.taskTitle) path.push({ label: item.taskTitle, isHighlight: true });

      items.push({
        id: `tnote-${item.note.id}`,
        type: 'note',
        title: item.note.text?.slice(0, 45) || 'Topic Note',
        originalLocation: path.map(p => p.label).join(' > '),
        locationPath: path,
        deletedAtDate: parsedDate,
        deletedAtFormatted: formatDeletedOnDate(parsedDate, item.deletedAt),
        daysLeft: calculateDaysLeft(parsedDate),
        itemCountInfo: item.taskTitle ? 'Task Note' : 'Topic Note',
        rawData: { ...item, isTopicNoteEntry: true },
        originalIndex: items.length,
      });
    });

    // 7. Topic & Task Resource Links
    deletedTopicLinks.forEach(item => {
      const parsedDate = parseItemDate(item.deletedAt);
      const wsName = item.workspaceId ? (workspaceMap.get(item.workspaceId) || 'Workspace') : 'Workspace';
      const path: BreadcrumbPart[] = [{ label: wsName }];
      if (item.topicTitle) path.push({ label: item.topicTitle });
      if (item.taskTitle) path.push({ label: item.taskTitle, isHighlight: true });

      items.push({
        id: `tlink-${item.link.id}`,
        type: 'link',
        title: item.link.title || item.link.url || 'Resource Link',
        originalLocation: path.map(p => p.label).join(' > '),
        locationPath: path,
        deletedAtDate: parsedDate,
        deletedAtFormatted: formatDeletedOnDate(parsedDate, item.deletedAt),
        daysLeft: calculateDaysLeft(parsedDate),
        itemCountInfo: item.taskTitle ? 'Task Link' : 'Topic Link',
        rawData: item,
        originalIndex: items.length,
      });
    });

    return items;
  }, [deletedWorkspaces, deletedSections, deletedTopics, deletedTasks, deletedNotes, deletedTopicNotes, deletedTopicLinks, workspaceMap]);

  // Counts for tabs
  const workspaceCount = unifiedItems.filter(i => i.type === 'workspace').length;
  const sectionCount = unifiedItems.filter(i => i.type === 'section').length;
  const topicCount = unifiedItems.filter(i => i.type === 'topic').length;
  const taskCount = unifiedItems.filter(i => i.type === 'task').length;
  const noteCount = unifiedItems.filter(i => i.type === 'note').length;
  const linkCount = unifiedItems.filter(i => i.type === 'link').length;
  const totalCount = unifiedItems.length;

  // Filtered & Sorted items
  const filteredAndSortedItems = useMemo(() => {
    let result = unifiedItems.filter(item => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchLoc = item.originalLocation.toLowerCase().includes(q);
      const matchInfo = item.itemCountInfo.toLowerCase().includes(q);
      return matchTitle || matchLoc || matchInfo;
    });

    // Sorting with robust tie-breaking and null-safe locale compare
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const timeDiff = b.deletedAtDate.getTime() - a.deletedAtDate.getTime();
        if (timeDiff !== 0) return timeDiff;
        return a.originalIndex - b.originalIndex;
      }
      if (sortBy === 'oldest') {
        const timeDiff = a.deletedAtDate.getTime() - b.deletedAtDate.getTime();
        if (timeDiff !== 0) return timeDiff;
        return b.originalIndex - a.originalIndex;
      }
      if (sortBy === 'alphabetical') {
        const titleDiff = (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' });
        if (titleDiff !== 0) return titleDiff;
        return b.deletedAtDate.getTime() - a.deletedAtDate.getTime();
      }
      if (sortBy === 'type') {
        const order: Record<string, number> = { workspace: 1, section: 2, topic: 3, task: 4, note: 5, link: 6 };
        const typeDiff = (order[a.type] || 99) - (order[b.type] || 99);
        if (typeDiff !== 0) return typeDiff;
        return b.deletedAtDate.getTime() - a.deletedAtDate.getTime();
      }
      return 0;
    });

    return result;
  }, [unifiedItems, activeTab, searchQuery, sortBy]);

  // Batch Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedItems.map(i => i.id));
    }
  };

  const handleToggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Restore Single Item
  const handleRestoreItem = (item: UnifiedRecycleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.type === 'workspace') {
      onRestoreWorkspace(item.rawData.workspace.id);
    } else if (item.type === 'section' && onRestoreSection) {
      onRestoreSection(item.rawData.id);
    } else if (item.type === 'topic') {
      onRestoreTopic(item.rawData.id);
    } else if (item.type === 'task' && onRestoreTask) {
      onRestoreTask(item.rawData.task.id);
    } else if (item.type === 'note') {
      if (item.rawData.isTopicNoteEntry && onRestoreTopicNote) {
        onRestoreTopicNote(item.rawData.note.id);
      } else if (onRestoreNote) {
        onRestoreNote(item.rawData.id);
      }
    } else if (item.type === 'link' && onRestoreTopicLink) {
      onRestoreTopicLink(item.rawData.link.id);
    }
    setSelectedIds(prev => prev.filter(id => id !== item.id));
    if (previewItem?.id === item.id) {
      setPreviewItem(null);
    }
  };

  // Permanent Delete Single Item
  const handlePermanentDeleteItem = (item: UnifiedRecycleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.type === 'workspace') {
      onPermanentDeleteWorkspace(item.rawData.workspace.id);
    } else if (item.type === 'section' && onPermanentDeleteSection) {
      onPermanentDeleteSection(item.rawData.id);
    } else if (item.type === 'topic') {
      onPermanentDeleteTopic(item.rawData.id);
    } else if (item.type === 'task' && onPermanentDeleteTask) {
      onPermanentDeleteTask(item.rawData.task.id);
    } else if (item.type === 'note') {
      if (item.rawData.isTopicNoteEntry && onPermanentDeleteTopicNote) {
        onPermanentDeleteTopicNote(item.rawData.note.id);
      } else if (onPermanentDeleteNote) {
        onPermanentDeleteNote(item.rawData.id);
      }
    } else if (item.type === 'link' && onPermanentDeleteTopicLink) {
      onPermanentDeleteTopicLink(item.rawData.link.id);
    }
    setSelectedIds(prev => prev.filter(id => id !== item.id));
    if (previewItem?.id === item.id) {
      setPreviewItem(null);
    }
    setItemToDeleteForever(null);
  };

  // Batch Restore Selected
  const handleRestoreSelected = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      const item = unifiedItems.find(i => i.id === id);
      if (item) {
        if (item.type === 'workspace') onRestoreWorkspace(item.rawData.workspace.id);
        else if (item.type === 'section' && onRestoreSection) onRestoreSection(item.rawData.id);
        else if (item.type === 'topic') onRestoreTopic(item.rawData.id);
        else if (item.type === 'task' && onRestoreTask) onRestoreTask(item.rawData.task.id);
        else if (item.type === 'note') {
          if (item.rawData.isTopicNoteEntry && onRestoreTopicNote) onRestoreTopicNote(item.rawData.note.id);
          else if (onRestoreNote) onRestoreNote(item.rawData.id);
        } else if (item.type === 'link' && onRestoreTopicLink) {
          onRestoreTopicLink(item.rawData.link.id);
        }
      }
    });
    showToast(`Restored ${selectedIds.length} item(s)`);
    setSelectedIds([]);
    setPreviewItem(null);
  };

  // Batch Delete Selected Forever
  const handleDeleteSelectedForever = () => {
    if (selectedIds.length === 0) return;
    if (soundEffectsEnabled) {
      soundManager.playTrash();
    }
    selectedIds.forEach(id => {
      const item = unifiedItems.find(i => i.id === id);
      if (item) {
        if (item.type === 'workspace') onPermanentDeleteWorkspace(item.rawData.workspace.id);
        else if (item.type === 'section' && onPermanentDeleteSection) onPermanentDeleteSection(item.rawData.id);
        else if (item.type === 'topic') onPermanentDeleteTopic(item.rawData.id);
        else if (item.type === 'task' && onPermanentDeleteTask) onPermanentDeleteTask(item.rawData.task.id);
        else if (item.type === 'note') {
          if (item.rawData.isTopicNoteEntry && onPermanentDeleteTopicNote) onPermanentDeleteTopicNote(item.rawData.note.id);
          else if (onPermanentDeleteNote) onPermanentDeleteNote(item.rawData.id);
        } else if (item.type === 'link' && onPermanentDeleteTopicLink) {
          onPermanentDeleteTopicLink(item.rawData.link.id);
        }
      }
    });
    showToast(`Permanently deleted ${selectedIds.length} item(s)`);
    setSelectedIds([]);
    setPreviewItem(null);
  };

  // Memoized formatted oldest deleted item date for top banner stats
  const oldestItemDateFormatted = useMemo(() => {
    if (unifiedItems.length === 0) return '—';
    let oldest = unifiedItems[0].deletedAtDate;
    unifiedItems.forEach(i => {
      if (i.deletedAtDate < oldest) oldest = i.deletedAtDate;
    });
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[oldest.getMonth()]} ${oldest.getDate()}, ${oldest.getFullYear()}`;
  }, [unifiedItems]);

  // Count of items expiring within 7 days
  const expiringSoonCount = useMemo(() => {
    return unifiedItems.filter(item => item.daysLeft <= 7).length;
  }, [unifiedItems]);

  // Search match navigation handlers (Up/Down arrows, Enter / Shift+Enter)
  const handlePrevMatch = () => {
    if (filteredAndSortedItems.length === 0) return;
    setActiveMatchIndex(prev => (prev - 1 + filteredAndSortedItems.length) % filteredAndSortedItems.length);
  };

  const handleNextMatch = () => {
    if (filteredAndSortedItems.length === 0) return;
    setActiveMatchIndex(prev => (prev + 1) % filteredAndSortedItems.length);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrevMatch();
      } else {
        handleNextMatch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleNextMatch();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handlePrevMatch();
    }
  };

  // Search keyword highlight helper (Standard match = yellow, Active 1st/current match = theme red, zero extra space, non-bold)
  const renderSearchHighlightedText = (text: string, query: string, isCurrentActiveMatch: boolean) => {
    if (!text || !query || !query.trim()) return text;
    const words = query.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return text;
    const pattern = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    const wordsLower = words.map(w => w.toLowerCase());

    return (
      <>
        {parts.map((part, i) =>
          wordsLower.includes(part.toLowerCase()) ? (
            <mark
              key={i}
              className={`px-0.5 py-0 rounded-[2px] font-semibold ${
                isCurrentActiveMatch
                  ? 'bg-[#E11D48] text-white'
                  : 'bg-[#FDE047] dark:bg-[#FACC15] !text-slate-950 dark:!text-slate-950 shadow-2xs'
              }`}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Search-inspired stylish rounded gradient badge icon renderer (PRESERVED UNCHANGED)
  const renderItemSearchIcon = (item: UnifiedRecycleItem) => {
    switch (item.type) {
      case 'workspace':
        return (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] text-white shadow-3xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-3.5 h-3.5 stroke-[2.2] text-white" />
          </div>
        );
      case 'section':
        return (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#C084FC] text-white shadow-3xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Folder className="w-3.5 h-3.5 stroke-[2.2] text-white" />
          </div>
        );
      case 'topic':
        return (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#059669] via-[#10B981] to-[#34D399] text-white shadow-3xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-3.5 h-3.5 stroke-[2.2] text-white" />
          </div>
        );
      case 'task':
        return (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FB923C] text-white shadow-3xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-3.5 h-3.5 stroke-[2.2] text-white" />
          </div>
        );
      case 'note':
        return (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9333EA] via-[#A855F7] to-[#C084FC] text-white shadow-3xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <NotebookPen className="w-3.5 h-3.5 stroke-[2.2] text-white" />
          </div>
        );
      case 'link': {
        const platform = detectLinkPlatform(item.rawData?.link?.url, item.rawData?.link?.type, item.title);
        if (platform === 'youtube') {
          return (
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
              <svg width="18" height="13" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M27.0983 3.03362C26.7797 1.8436 25.8453 0.909181 24.6553 0.590623C22.5029 0.0136719 14.0006 0.0136719 14.0006 0.0136719C14.0006 0.0136719 5.49826 0.0136719 3.34591 0.590623C2.15589 0.909181 1.22147 1.8436 0.902914 3.03362C0.325963 5.18597 0.325963 9.99965 0.325963 9.99965C0.325963 9.99965 0.325963 14.8133 0.902914 16.9657C1.22147 18.1557 2.15589 19.0901 3.34591 19.4087C5.49826 19.9856 14.0006 19.9856 14.0006 19.9856C14.0006 19.9856 22.5029 19.9856 24.6553 19.4087C25.8453 19.0901 26.7797 18.1557 27.0983 16.9657C27.6752 14.8133 27.6752 9.99965 27.6752 9.99965C27.6752 9.99965 27.6752 5.18597 27.0983 3.03362ZM11.2612 14.2818V5.71754L18.6811 9.99965L11.2612 14.2818Z" fill="#FF0000" />
              </svg>
            </div>
          );
        }
        if (platform === 'facebook') {
          return (
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="w-4 h-4 shrink-0" />
            </div>
          );
        }
        if (platform === 'drive') {
          return (
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-4 h-4 shrink-0" />
            </div>
          );
        }
        return (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#818CF8] text-white shadow-3xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Link2 className="w-3.5 h-3.5 stroke-[2.2] text-white" />
          </div>
        );
      }
    }
  };

  // Clean, ultra-compact and slim micro-pill badge matching reference
  const renderTypeBadge = (type: 'workspace' | 'section' | 'topic' | 'task' | 'note' | 'link') => {
    switch (type) {
      case 'workspace':
        return (
          <span className="inline-flex items-center justify-center px-1.5 py-[0.5px] rounded-full text-[9.5px] font-semibold bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] shrink-0 leading-tight">
            Workspace
          </span>
        );
      case 'section':
        return (
          <span className="inline-flex items-center justify-center px-1.5 py-[0.5px] rounded-full text-[9.5px] font-semibold bg-[#FAF5FF] text-[#9333EA] border border-[#F3E8FF] shrink-0 leading-tight">
            Section
          </span>
        );
      case 'topic':
        return (
          <span className="inline-flex items-center justify-center px-1.5 py-[0.5px] rounded-full text-[9.5px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5] shrink-0 leading-tight">
            Topic
          </span>
        );
      case 'task':
        return (
          <span className="inline-flex items-center justify-center px-1.5 py-[0.5px] rounded-full text-[9.5px] font-semibold bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] shrink-0 leading-tight">
            Task
          </span>
        );
      case 'note':
        return (
          <span className="inline-flex items-center justify-center px-1.5 py-[0.5px] rounded-full text-[9.5px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] shrink-0 leading-tight">
            Note
          </span>
        );
      case 'link':
        return (
          <span className="inline-flex items-center justify-center px-1.5 py-[0.5px] rounded-full text-[9.5px] font-semibold bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] shrink-0 leading-tight">
            Link
          </span>
        );
    }
  };

  // Reusable comprehensive preview details for both desktop drawer and mobile popup
  const renderPreviewDetails = (item: UnifiedRecycleItem) => (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {renderTypeBadge(item.type)}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            item.daysLeft <= 3
              ? 'bg-rose-100/80 text-rose-700 border border-rose-200/80'
              : item.daysLeft <= 7
              ? 'bg-amber-100/80 text-amber-700 border border-amber-200/80'
              : 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/80'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'} left</span>
          </span>
        </div>
        <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
          {item.title}
        </h3>
        <p className="text-[11px] text-slate-400 mt-1">
          Original Location: <span className="text-slate-600 font-medium">{item.originalLocation}</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Deleted On: <span className="text-slate-600 font-medium">{item.deletedAtFormatted}</span>
        </p>
      </div>

      <div className="h-[1px] bg-slate-100" />

      {/* Preview Type: Workspace Topics */}
      {item.type === 'workspace' && (
        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Included Topics ({item.rawData.topics?.length || 0})
          </span>
          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
            {item.rawData.topics && item.rawData.topics.length > 0 ? (
              item.rawData.topics.map((t: any) => (
                <div
                  key={t.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-slate-700"
                >
                  <span className="font-medium truncate">{t.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {t.tasks?.length || 0} tasks
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">No topics inside this workspace.</p>
            )}
          </div>
        </div>
      )}

      {/* Preview Type: Section */}
      {item.type === 'section' && (
        <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-amber-900 flex flex-col gap-1">
          <span className="font-bold text-[11px]">Section Container</span>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            Restoring this section will bring back “{item.title}” into its original workspace.
          </p>
        </div>
      )}

      {/* Preview Type: Topic Tasks, Notes & Links */}
      {item.type === 'topic' && (
        <div className="flex flex-col gap-3">
          {/* Tasks inside Topic */}
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Topic Tasks ({item.rawData.tasks?.length || 0})
            </span>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
              {item.rawData.tasks && item.rawData.tasks.length > 0 ? (
                item.rawData.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center gap-2 text-slate-700"
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                      {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-[11px]">No tasks created inside this topic.</p>
              )}
            </div>
          </div>

          {/* Topic Notes */}
          {item.rawData.notes && item.rawData.notes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <NotebookPen className="w-3 h-3 text-purple-500" />
                <span>Topic Notes ({item.rawData.notes.length})</span>
              </span>
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
                {item.rawData.notes.map((n: any) => (
                  <div key={n.id} className="p-2 rounded-lg bg-purple-50/50 border border-purple-100 text-slate-700">
                    <p className="text-[11px] whitespace-pre-wrap">{n.text || n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topic Links */}
          {item.rawData.links && item.rawData.links.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Link2 className="w-3 h-3 text-blue-500" />
                <span>Topic Resource Links ({item.rawData.links.length})</span>
              </span>
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
                {item.rawData.links.map((l: any) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-700 flex items-center justify-between hover:underline"
                  >
                    <span className="truncate">{l.title || l.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Type: Task */}
      {item.type === 'task' && (
        <div className="flex flex-col gap-2">
          <div className="p-3 rounded-lg bg-cyan-50/50 border border-cyan-200/60 text-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-600 shrink-0" />
              <span className="font-bold text-[13px]">{item.rawData.task.title}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Status: <strong className={item.rawData.task.completed ? 'text-emerald-600' : 'text-slate-700'}>
                {item.rawData.task.completed ? 'Completed' : 'In Progress'}
              </strong>
            </p>
            {item.rawData.task.priority && (
              <p className="text-[11px] text-slate-500">
                Priority: <span className="capitalize font-medium text-slate-700">{item.rawData.task.priority}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Preview Type: Note */}
      {item.type === 'note' && (
        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Note Content Preview
          </span>
          {item.rawData.isTopicNoteEntry ? (
            <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-200/60 text-slate-700 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {item.rawData.note.text}
            </div>
          ) : (
            <div
              className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 font-serif leading-relaxed max-h-60 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: item.rawData.content || '<p class="text-slate-400 italic">Empty note content</p>' }}
            />
          )}
        </div>
      )}

      {/* Preview Type: Resource Link */}
      {item.type === 'link' && (
        <div className="flex flex-col gap-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Link Destination
          </span>
          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-200/60 text-slate-800 flex flex-col gap-2">
            <a
              href={item.rawData.link.url}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-indigo-700 hover:underline flex items-center justify-between gap-1 break-all"
            >
              <span>{item.rawData.link.title || item.rawData.link.url}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
            <p className="text-[11px] text-slate-400 break-all">{item.rawData.link.url}</p>
          </div>
        </div>
      )}
    </div>
  );

  const isAllSelected = filteredAndSortedItems.length > 0 && selectedIds.length === filteredAndSortedItems.length;

  return (
    <motion.div
      key="recycle-bin-studio-full-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden select-none"
    >
      {/* 1. TOP HEADER (Mobile Only: Hamburger Menu + Compact "Trash" title fading in when Hero is collapsed) */}
      <header className="md:hidden shrink-0 h-[48px] bg-white border-b border-slate-200/80 px-4 flex items-center justify-between z-30 relative select-none">
        {/* Header Left: Hamburger / Back Button + Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => {
              if (onToggleSidebar) {
                onToggleSidebar();
              } else if (onClose) {
                onClose();
              }
            }}
            className="w-[32px] h-[32px] rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-3xs transition-all cursor-pointer select-none shrink-0"
            title="Open sidebar"
          >
            <Menu className="w-4 h-4 text-slate-700 stroke-[2.3]" />
          </button>

          {/* Mobile Compact Title "Trash" (Smooth Fade-In when Hero is collapsed) */}
          <div
            className="flex items-center min-w-0 pointer-events-none transition-all duration-200"
            style={{
              opacity: isHeroOpen ? (pullDistance > 0 ? Math.max(0, 1 - pullDistance / 40) : 0) : Math.min(1, 1 - pullDistance / 60),
              transform: `translateY(${isHeroOpen ? 6 : 0}px)`,
              display: isHeroOpen && pullDistance === 0 ? 'none' : 'flex',
            }}
          >
            <h1 className="font-serif font-bold text-[15.5px] text-slate-900 tracking-tight truncate leading-none">
              Trash
            </h1>
          </div>
        </div>

        {/* Header Right: 3-dot Action Menu (Only appears when Hero is closed, borderless) */}
        <div className="relative">
          <div
            className="transition-all duration-200"
            style={{
              opacity: isHeroOpen ? 0 : 1,
              transform: `scale(${isHeroOpen ? 0.85 : 1})`,
              pointerEvents: isHeroOpen ? 'none' : 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => setIsHeaderMenuOpen(prev => !prev)}
              className="w-[32px] h-[32px] rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer select-none shrink-0"
              title="More options"
            >
              <MoreVertical className="w-4.5 h-4.5 text-slate-700" />
            </button>
          </div>

          {/* 3-Dot Dropdown Menu (Restore All & Empty Bin) */}
          <AnimatePresence>
            {!isHeroOpen && isHeaderMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsHeaderMenuOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 p-1 z-50 overflow-hidden select-none"
                >
                  {/* Option 1: Restore All */}
                  <button
                    type="button"
                    disabled={totalCount === 0}
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      setSelectedIds(unifiedItems.map(i => i.id));
                      handleRestoreSelected();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>Restore All</span>
                  </button>

                  <div className="h-[1px] bg-slate-100 my-0.5" />

                  {/* Option 2: Empty Bin */}
                  <button
                    type="button"
                    disabled={totalCount === 0}
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      setIsConfirmEmptyOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Empty Bin</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* 2. MAIN CONTENT STREAM (Centered max-w-6xl Container, Full Screen on Mobile) */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div
          onScroll={(e) => {
            const st = e.currentTarget.scrollTop;
            setIsDesktopHeroScrolledPast(st > 80);
          }}
          className="flex-1 flex flex-col p-0 sm:p-6 min-w-0 overflow-hidden sm:overflow-y-auto"
        >
          <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-3 sm:gap-4 min-h-0 sm:min-h-min">
            
            {/* 1. TOP HERO BANNER CARD (Collapsible on Mobile matching NotesStudio 1:1, Always Open on Desktop) */}
            <motion.div
              initial={false}
              animate={{
                height: (typeof window !== 'undefined' && window.innerWidth >= 640) ? 'auto' : (isHeroOpen ? 204 : pullDistance > 0 ? pullDistance : 0),
                opacity: (typeof window !== 'undefined' && window.innerWidth >= 640) ? 1 : getHeroOpacity(),
              }}
              transition={{
                height: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                opacity: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              }}
              className="overflow-hidden select-none shrink-0 sm:!h-auto sm:!opacity-100"
            >
              <motion.div
                animate={{
                  y: (typeof window !== 'undefined' && window.innerWidth >= 640) ? 0 : (isHeroOpen ? 0 : pullDistance > 0 ? pullDistance - 204 : -204),
                }}
                transition={{
                  y: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                }}
                className="sm:!translate-y-0"
              >
                <div className="bg-[#FFF6F7] dark:bg-rose-950/20 border-none rounded-none sm:rounded-2xl p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-3xs select-none">
                  {/* Left Side: Circular Glow Trash Icon + Title & Subtitle */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0 flex items-center justify-center">
                      <div className="w-[62px] h-[62px] rounded-full bg-gradient-to-tr from-[#E11D48] via-[#F43F5E] to-[#FB7185] flex items-center justify-center text-white shadow-md shadow-rose-500/25 ring-4 ring-[#FFE2E7] dark:ring-rose-950/50">
                        <Trash2 className="w-7 h-7 stroke-[2.2]" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h1 className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                        Trash Bin
                      </h1>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
                        Items in trash will be automatically deleted after <span className="text-[#E11D48] dark:text-rose-400 font-bold">30 days</span>.
                      </p>
                    </div>
                  </div>

                {/* Dynamic Animated Status & Actions Area with Sequential mode="wait" transition */}
                <AnimatePresence mode="wait">
                  {selectedIds.length === 0 ? (
                    <motion.div
                      key="normal-stats-and-actions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2.5 sm:gap-3.5 w-full xl:w-auto shrink-0"
                    >
                      {/* 2-Part Stats Pill Card (Exact fixed height h-[42px]) */}
                      <div className="bg-white dark:bg-slate-900 border border-[#FFE2E7] dark:border-slate-800 rounded-xl px-4 h-[42px] min-h-[42px] flex items-center justify-around sm:justify-center gap-4 sm:gap-6 shadow-3xs w-full sm:w-auto shrink-0">
                        {/* 1. Total Items Count */}
                        <div className="flex flex-col items-center justify-center text-center flex-1 sm:flex-initial min-w-[54px]">
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">{totalCount}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-1">Total items</div>
                        </div>

                        <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800" />

                        {/* 2. Expiring Soon (< 7 days) */}
                        <div className="flex flex-col items-center justify-center text-center flex-1 sm:flex-initial min-w-[62px]">
                          <div className={`text-xs font-bold leading-none ${expiringSoonCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
                            {expiringSoonCount}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-1">Expiring soon</div>
                        </div>
                      </div>

                      {/* Normal Action Buttons (Restore all & Empty bin) */}
                      <div className="flex items-center justify-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          disabled={totalCount === 0}
                          onClick={() => {
                            setSelectedIds(unifiedItems.map(i => i.id));
                            handleRestoreSelected();
                          }}
                          className="flex-1 sm:flex-initial h-[34px] min-h-[34px] max-h-[34px] px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 rounded-lg font-semibold text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-3xs disabled:opacity-40 disabled:pointer-events-none box-border select-none"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                          <span>Restore all</span>
                        </button>

                        <button
                          type="button"
                          disabled={totalCount === 0}
                          onClick={() => setIsConfirmEmptyOpen(true)}
                          className="flex-1 sm:flex-initial h-[34px] min-h-[34px] max-h-[34px] px-3.5 bg-[#E11D48] hover:bg-rose-700 text-white border border-[#E11D48] rounded-lg font-semibold text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-3xs disabled:opacity-40 disabled:pointer-events-none box-border select-none"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Empty bin</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="selection-mode-actions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2.5 sm:gap-3.5 w-full xl:w-auto shrink-0"
                    >
                      {/* Selected Count Pill Card (Exact matching height h-[42px]) */}
                      <div className="bg-[#FFF1F2] dark:bg-rose-950/40 border border-[#FECDD3] dark:border-rose-900/50 rounded-xl px-4 h-[42px] min-h-[42px] flex items-center justify-center gap-2 shadow-3xs w-full sm:w-auto shrink-0 select-none">
                        <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse shrink-0" />
                        <span className="text-xs font-bold text-[#E11D48] dark:text-rose-400 whitespace-nowrap">
                          {selectedIds.length} {selectedIds.length === 1 ? 'item selected' : 'items selected'}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={handleRestoreSelected}
                          className="flex-1 sm:flex-initial h-[34px] min-h-[34px] max-h-[34px] px-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 rounded-lg font-semibold text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-3xs box-border select-none"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#E11D48] dark:text-rose-400" />
                          <span>Restore selected</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDeleteSelectedForever}
                          className="flex-1 sm:flex-initial h-[34px] min-h-[34px] max-h-[34px] px-3.5 bg-[#E11D48] hover:bg-rose-700 text-white border border-[#E11D48] rounded-lg font-semibold text-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shadow-3xs box-border select-none"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete selected</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* 2, 3 & 4. STICKY SEARCH, SORT, TABS & TABLE HEADER */}
            <div className="sticky top-0 sm:top-[-24px] z-20 bg-[#F8FAFC] dark:bg-slate-950 px-3.5 sm:px-0 pt-2 pb-0 sm:pt-3 sm:pb-0 flex flex-col gap-2.5 sm:gap-3 transition-all shrink-0">
              {/* 2. SEARCH & SORT ROW (1:1 Reference matching image 1) */}
              <div className="flex items-center justify-between gap-3">
                {/* Search Bar with Alt + F shortcut badge & 1/N Match Navigation */}
                <div className="relative flex-1 sm:w-[420px] md:w-[480px] sm:flex-initial min-w-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search in trash..."
                    className={`w-full h-9 pl-9 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-950/50 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all shadow-3xs ${
                      searchQuery ? 'pr-24' : 'pr-14'
                    }`}
                  />
                  {searchQuery ? (
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 select-none">
                      {/* 1/N Match Counter */}
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1 py-0.5 font-mono leading-none">
                        {filteredAndSortedItems.length > 0
                          ? `${activeMatchIndex + 1}/${filteredAndSortedItems.length}`
                          : '0/0'}
                      </span>

                      {/* Up Arrow (Previous Match) */}
                      <button
                        type="button"
                        onClick={handlePrevMatch}
                        disabled={filteredAndSortedItems.length === 0}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors disabled:opacity-30 cursor-pointer"
                        title="Previous match (Shift+Enter or ↑)"
                      >
                        <ChevronUp className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>

                      {/* Down Arrow (Next Match) */}
                      <button
                        type="button"
                        onClick={handleNextMatch}
                        disabled={filteredAndSortedItems.length === 0}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors disabled:opacity-30 cursor-pointer"
                        title="Next match (Enter or ↓)"
                      >
                        <ChevronDown className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>

                      {/* Clear Button */}
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer ml-0.5"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-800 px-1.5 py-0.5 rounded bg-slate-50/80 dark:bg-slate-900 pointer-events-none select-none">
                      Alt + F
                    </span>
                  )}
                </div>

                {/* Custom Smooth Sort Dropdown with Icon and Responsive Label */}
                <div className="relative shrink-0" ref={sortDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsSortDropdownOpen(prev => !prev)}
                    className={`h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shadow-3xs select-none ${
                      isSortDropdownOpen
                        ? 'bg-slate-50 dark:bg-slate-900 border-rose-300 dark:border-rose-900 ring-2 ring-rose-100 dark:ring-rose-950 text-slate-900 dark:text-slate-100'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                    title="Sort items"
                  >
                    <ArrowUpDown className={`w-3.5 h-3.5 shrink-0 ${isSortDropdownOpen ? 'text-[#E11D48] dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`} />

                    {/* Desktop view: Sort: [Option Name] */}
                    <span className="hidden sm:inline">
                      <span className="text-slate-500 dark:text-slate-400 font-normal mr-1">Sort:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {sortBy === 'newest' && 'Recently Deleted'}
                        {sortBy === 'oldest' && 'Oldest Deleted'}
                        {sortBy === 'alphabetical' && 'Alphabetical (A-Z)'}
                        {sortBy === 'type' && 'By Type'}
                      </span>
                    </span>

                    {/* Mobile view: Just "Sort" */}
                    <span className="inline sm:hidden font-semibold text-slate-800 dark:text-slate-200">
                      Sort
                    </span>

                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${isSortDropdownOpen ? 'rotate-180 text-rose-500' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isSortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 p-1 z-30 overflow-hidden"
                      >
                        {[
                          { id: 'newest' as SortOption, label: 'Recently Deleted' },
                          { id: 'oldest' as SortOption, label: 'Oldest Deleted' },
                          { id: 'alphabetical' as SortOption, label: 'Alphabetical (A-Z)' },
                          { id: 'type' as SortOption, label: 'By Type' },
                        ].map(opt => {
                          const isSelected = sortBy === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setSortBy(opt.id);
                                setIsSortDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-[#E11D48] dark:text-rose-400'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#E11D48] dark:text-rose-400 stroke-[2.5]" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 3. TAB BAR (1:1 Reference matching image without full-width bottom divider) */}
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
                {[
                  { id: 'all' as RecycleItemType, label: 'All Items', count: totalCount },
                  { id: 'workspace' as RecycleItemType, label: 'Workspaces', count: workspaceCount },
                  { id: 'section' as RecycleItemType, label: 'Sections', count: sectionCount },
                  { id: 'topic' as RecycleItemType, label: 'Topics', count: topicCount },
                  { id: 'task' as RecycleItemType, label: 'Tasks', count: taskCount },
                  { id: 'note' as RecycleItemType, label: 'Notes', count: noteCount },
                  { id: 'link' as RecycleItemType, label: 'Links', count: linkCount },
                ].map((tab, idx) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <React.Fragment key={tab.id}>
                      {idx > 0 && <div className="w-[1px] h-3 bg-slate-200/90 mx-1 sm:mx-1.5 shrink-0" />}
                      <button
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-2 px-1.5 sm:px-2 text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 select-none ${
                          isActive
                            ? 'text-[#E11D48] font-bold'
                            : 'text-slate-600 hover:text-slate-900 font-semibold'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[11px] leading-tight transition-colors ${
                            isActive
                              ? 'bg-[#FFE4E8] text-[#E11D48] font-bold'
                              : 'bg-slate-100 text-slate-500 font-medium'
                          }`}
                        >
                          {tab.count}
                        </span>

                        {/* Active Red Underline Bar (Only under active tab) */}
                        {isActive && (
                          <motion.div
                            layoutId="activeTrashTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E11D48] rounded-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          />
                        )}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* 4. STICKY TABLE HEADER (Fixed gap from tabs, stays pinned at top with search & tabs) */}
              {filteredAndSortedItems.length > 0 && (
                <div className="bg-white border-y sm:border border-slate-200/80 rounded-none sm:rounded-t-xl overflow-hidden shadow-2xs -mx-3.5 sm:mx-0">
                  <div
                    ref={headerScrollRef}
                    onScroll={handleHeaderScroll}
                    className="overflow-x-auto no-scrollbar bg-white"
                  >
                    <table className="w-full text-left border-separate border-spacing-0 min-w-0 sm:min-w-[760px] bg-white table-fixed">
                      <colgroup>
                        <col className="w-[36px] sm:w-[42px]" />
                        <col className="w-auto" />
                        <col className="hidden sm:table-column w-[200px]" />
                        <col className="hidden sm:table-column w-[110px]" />
                        <col className="w-[84px] sm:w-[100px]" />
                      </colgroup>
                      <thead>
                        <tr className="bg-white text-xs font-semibold text-slate-700 select-none">
                          <th className="py-3 pl-3.5 sm:pl-4 pr-1 sm:pr-1.5 w-[36px] sm:w-[42px] bg-white">
                            <button
                              type="button"
                              onClick={handleToggleSelectAll}
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                isAllSelected || selectedIds.length > 0
                                  ? 'bg-[#E11D48] border-[#E11D48] text-white'
                                  : 'border-slate-300 bg-white hover:border-slate-400'
                              }`}
                              title={
                                selectedIds.length > 0
                                  ? `Deselect all (${selectedIds.length} selected)`
                                  : 'Select all items'
                              }
                            >
                              {isAllSelected ? (
                                <Check className="w-3 h-3 stroke-[3]" />
                              ) : selectedIds.length > 0 ? (
                                <span className="w-2 h-0.5 bg-white rounded-full" />
                              ) : null}
                            </button>
                          </th>
                          <th className="py-3 pl-2 sm:pl-2.5 pr-2 sm:pr-3 font-semibold text-slate-700 bg-white">Item & Origin</th>
                          <th className="hidden sm:table-cell py-3 px-3 font-semibold text-slate-700 w-[200px] bg-white">Deleted on</th>
                          <th className="hidden sm:table-cell py-3 px-3 font-semibold text-slate-700 w-[110px] text-center bg-white">Days left</th>
                          <th className="py-3 pr-2.5 sm:px-3 font-semibold text-slate-700 w-[84px] sm:w-[100px] text-center bg-white">Actions</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 5. TABLE BODY ROWS / EMPTY STATE (Isolated Scroll Track matching NotesStudio 1:1) */}
            {filteredAndSortedItems.length === 0 ? (
              /* Empty State */
              <div
                ref={bodyScrollRef}
                onTouchStart={(e) => {
                  touchStartYRef.current = e.touches[0]?.clientY ?? 0;
                  touchStartTimeRef.current = Date.now();
                  const st = bodyScrollRef.current?.scrollTop ?? 0;
                  touchStartScrollTopRef.current = st;
                  isPullingDownRef.current = st <= 2;
                  heroOpenAtTouchStartRef.current = isHeroOpen;
                  setPullDirection(isHeroOpen ? 'up' : 'down');
                }}
                onTouchMove={(e) => {
                  const currentY = e.touches[0]?.clientY ?? 0;
                  const deltaY = currentY - touchStartYRef.current;
                  const st = bodyScrollRef.current?.scrollTop ?? 0;

                  // Only pull hero down if touch gesture STARTED when list was at top (scrollTop <= 2)
                  if (!heroOpenAtTouchStartRef.current && deltaY > 0) {
                    if (touchStartScrollTopRef.current <= 2 && st <= 2) {
                      setPullDirection('down');
                      const pull = Math.min(204, deltaY * 0.55);
                      setPullDistance(pull);
                    }
                  } else if (heroOpenAtTouchStartRef.current && deltaY < 0) {
                    if (st <= 2) {
                      setPullDirection('up');
                      if (isHeroOpen) setIsHeroOpen(false);
                      const pull = Math.max(0, 204 + (deltaY * 0.55));
                      setPullDistance(pull);
                    }
                  }
                }}
                onTouchEnd={(e) => {
                  const currentY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
                  const deltaY = currentY - touchStartYRef.current;
                  const deltaTime = Math.max(1, Date.now() - touchStartTimeRef.current);
                  const velocityY = deltaY / deltaTime; // pixels per ms
                  
                  if (Math.abs(deltaY) < 5) {
                    if (heroOpenAtTouchStartRef.current) setIsHeroOpen(true);
                    setPullDistance(0);
                    return;
                  }

                  if (!heroOpenAtTouchStartRef.current) {
                    // Was closed: ONLY trigger hero open if touch gesture STARTED when list was AT TOP (touchStartScrollTop <= 2)
                    if (touchStartScrollTopRef.current <= 2) {
                      const isFastFlickDown = velocityY > 0.35 && deltaY > 15;
                      if (pullDistance >= 60 || isFastFlickDown) {
                        setIsHeroOpen(true);
                      } else {
                        setIsHeroOpen(false);
                      }
                    }
                    setPullDistance(0);
                  } else {
                    // Was open:
                    if (deltaY < 0) {
                      const isFastFlickUp = velocityY < -0.35 && deltaY < -15;
                      if (pullDistance < 130 || isFastFlickUp) {
                        setIsHeroOpen(false);
                      } else {
                        setIsHeroOpen(true);
                      }
                    } else {
                      setIsHeroOpen(true);
                    }
                    setPullDistance(0);
                  }
                }}
                onScroll={(e) => {
                  const st = e.currentTarget.scrollTop;
                  handleBodyScroll();
                  if (isHeroOpen && st > 8) {
                    setPullDirection('up');
                    setIsHeroOpen(false);
                    setPullDistance(0);
                  }
                }}
                className="bg-white border border-slate-200/80 rounded-xl shadow-xs p-12 flex flex-col items-center justify-center text-center flex-1 overflow-y-auto"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[#E11D48] mb-3 border border-rose-100 shadow-3xs">
                  <Trash2 className="w-7 h-7 stroke-[1.8]" />
                </div>
                <h3 className="font-serif font-bold text-base text-slate-800 mb-1">
                  {searchQuery ? 'No matching deleted items' : 'Recycle Bin is Empty'}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed max-w-sm">
                  {searchQuery
                    ? 'Try searching with a different keyword or change active filter tab.'
                    : 'Items moved to recycle bin will safely appear here. You can restore or permanently delete them at any time.'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              /* Clean Table Body Card Container (Flush with Header, Items scroll under header - Full width on Mobile) */
              <div className="bg-white border-b sm:border-x border-slate-200/80 rounded-none sm:rounded-b-xl overflow-hidden shadow-xs -mt-3 sm:-mt-4 flex-1 flex flex-col min-h-0">
                <div
                  ref={bodyScrollRef}
                  onTouchStart={(e) => {
                    touchStartYRef.current = e.touches[0]?.clientY ?? 0;
                    touchStartTimeRef.current = Date.now();
                    const st = bodyScrollRef.current?.scrollTop ?? 0;
                    touchStartScrollTopRef.current = st;
                    isPullingDownRef.current = st <= 2;
                    heroOpenAtTouchStartRef.current = isHeroOpen;
                    setPullDirection(isHeroOpen ? 'up' : 'down');
                  }}
                  onTouchMove={(e) => {
                    const currentY = e.touches[0]?.clientY ?? 0;
                    const deltaY = currentY - touchStartYRef.current;
                    const st = bodyScrollRef.current?.scrollTop ?? 0;

                    // Only pull hero down if touch gesture STARTED when list was at top (scrollTop <= 2)
                    if (!heroOpenAtTouchStartRef.current && deltaY > 0) {
                      if (touchStartScrollTopRef.current <= 2 && st <= 2) {
                        setPullDirection('down');
                        const pull = Math.min(204, deltaY * 0.55);
                        setPullDistance(pull);
                      }
                    } else if (heroOpenAtTouchStartRef.current && deltaY < 0) {
                      if (st <= 2) {
                        setPullDirection('up');
                        if (isHeroOpen) setIsHeroOpen(false);
                        const pull = Math.max(0, 204 + (deltaY * 0.55));
                        setPullDistance(pull);
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    const currentY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
                    const deltaY = currentY - touchStartYRef.current;
                    const deltaTime = Math.max(1, Date.now() - touchStartTimeRef.current);
                    const velocityY = deltaY / deltaTime; // pixels per ms
                    
                    if (Math.abs(deltaY) < 5) {
                      if (heroOpenAtTouchStartRef.current) setIsHeroOpen(true);
                      setPullDistance(0);
                      return;
                    }

                    if (!heroOpenAtTouchStartRef.current) {
                      // Was closed: ONLY trigger hero open if touch gesture STARTED when list was AT TOP (touchStartScrollTop <= 2)
                      if (touchStartScrollTopRef.current <= 2) {
                        const isFastFlickDown = velocityY > 0.35 && deltaY > 15;
                        if (pullDistance >= 60 || isFastFlickDown) {
                          setIsHeroOpen(true);
                        } else {
                          setIsHeroOpen(false);
                        }
                      }
                      setPullDistance(0);
                    } else {
                      // Was open:
                      if (deltaY < 0) {
                        const isFastFlickUp = velocityY < -0.35 && deltaY < -15;
                        if (pullDistance < 130 || isFastFlickUp) {
                          setIsHeroOpen(false);
                        } else {
                          setIsHeroOpen(true);
                        }
                      } else {
                        setIsHeroOpen(true);
                      }
                      setPullDistance(0);
                    }
                  }}
                  onScroll={(e) => {
                    const st = e.currentTarget.scrollTop;
                    handleBodyScroll();
                    if (isHeroOpen && st > 8) {
                      setPullDirection('up');
                      setIsHeroOpen(false);
                      setPullDistance(0);
                    }
                  }}
                  className={`overflow-x-auto bg-white flex-1 min-h-0 sm:flex-initial sm:min-h-min ${
                    (!isHeroOpen && pullDistance === 0) ? 'overflow-y-auto' : 'overflow-hidden sm:overflow-y-visible'
                  }`}
                >
                  <table className="w-full text-left border-separate border-spacing-0 min-w-0 sm:min-w-[760px] bg-white dark:bg-slate-900 table-fixed">
                    <colgroup>
                      <col className="w-[36px] sm:w-[42px]" />
                      <col className="w-auto" />
                      <col className="hidden sm:table-column w-[200px]" />
                      <col className="hidden sm:table-column w-[110px]" />
                      <col className="w-[84px] sm:w-[100px]" />
                    </colgroup>
                    <tbody className="text-[12.5px] bg-white dark:bg-slate-900">
                    {filteredAndSortedItems.map((item, index) => {
                      const isSelected = selectedIds.includes(item.id);
                      const isPreviewActive = previewItem?.id === item.id;
                      const isCurrentActiveMatch = Boolean(searchQuery.trim()) && index === activeMatchIndex;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setPreviewItem(item)}
                          className={`group cursor-pointer transition-colors ${
                            isPreviewActive
                              ? 'bg-rose-50/40 dark:bg-rose-950/30'
                              : isSelected
                              ? 'bg-rose-50/20 dark:bg-rose-950/20'
                              : isCurrentActiveMatch
                              ? 'bg-rose-50/70 dark:bg-rose-950/40'
                              : 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          {/* Checkbox Column */}
                          <td className="py-2.5 pl-3.5 sm:pl-4 pr-1 sm:pr-1.5 w-[36px] sm:w-[42px] border-b border-slate-100 dark:border-slate-800/80" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={e => handleToggleSelectOne(item.id, e)}
                              className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#E11D48] border-[#E11D48] text-white'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                          </td>

                          {/* Item Name + Type Badge on line 1, and Origin Breadcrumb on line 2 */}
                          <td className="py-2.5 pl-2 sm:pl-2.5 pr-2 sm:pr-3 min-w-0 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
                              {/* Search Inspired Custom Rounded Badge Icon (Preserved) */}
                              {renderItemSearchIcon(item)}

                              {/* 2-Line Text Block */}
                              <div className="flex flex-col min-w-0 justify-center">
                                {/* Line 1: Item Name (Max 50 chars) + Type Badge directly beside it */}
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[50ch] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors text-[13px]"
                                    title={item.title}
                                  >
                                    {renderSearchHighlightedText(
                                      item.title.length > 50 ? `${item.title.slice(0, 50)}...` : item.title,
                                      searchQuery,
                                      isCurrentActiveMatch
                                    )}
                                  </span>
                                  {renderTypeBadge(item.type)}
                                </div>

                                {/* Line 2: Origin Subtext Breadcrumb (Workspace > Section > Topic) */}
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 truncate mt-0.5">
                                  {item.type === 'workspace' ? (
                                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                                      {renderSearchHighlightedText(`Root Workspace • ${item.itemCountInfo}`, searchQuery, isCurrentActiveMatch)}
                                    </span>
                                  ) : item.locationPath.length > 0 ? (
                                    <>
                                      {item.locationPath.map((part, pIdx) => (
                                        <React.Fragment key={pIdx}>
                                          {pIdx > 0 && <span className="text-slate-400 dark:text-slate-600 font-bold">{'>'}</span>}
                                          <span className={`truncate ${part.isHighlight ? 'text-slate-600 dark:text-slate-300 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {renderSearchHighlightedText(part.label, searchQuery, isCurrentActiveMatch)}
                                          </span>
                                        </React.Fragment>
                                      ))}
                                    </>
                                  ) : (
                                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                                      {renderSearchHighlightedText(item.originalLocation, searchQuery, isCurrentActiveMatch)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Deleted On (Calendar icon + Clean Date & Time) - Desktop Only */}
                          <td className="hidden sm:table-cell py-2.5 px-3 text-slate-600 dark:text-slate-400 font-normal whitespace-nowrap text-xs w-[200px] border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                              <span>{item.deletedAtFormatted}</span>
                            </div>
                          </td>

                          {/* Days Left (Soft Green Pill Badge) - Desktop Only */}
                          <td className="hidden sm:table-cell py-2.5 px-3 text-center w-[110px] border-b border-slate-100 dark:border-slate-800/80">
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border border-[#D1FAE5] dark:border-emerald-900/50 whitespace-nowrap">
                              {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'}
                            </span>
                          </td>

                          {/* Action Buttons (Restore & Delete Forever) - Always Visible */}
                          <td className="py-2.5 pr-2.5 sm:px-3 text-center w-[84px] sm:w-[100px] border-b border-slate-100 dark:border-slate-800/80" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                              {/* 1. Restore Button */}
                              <button
                                type="button"
                                onClick={e => handleRestoreItem(item, e)}
                                className="w-7 h-7 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-3xs active:scale-95"
                                title="Restore back to original location"
                              >
                                <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
                              </button>

                              {/* 2. Delete Forever Button */}
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  setItemToDeleteForever(item);
                                }}
                                className="w-7 h-7 rounded-lg border border-rose-200/90 dark:border-rose-900/40 bg-[#FFF5F5] dark:bg-rose-950/30 hover:bg-[#FFEBEB] dark:hover:bg-rose-900/50 hover:border-rose-300 dark:hover:border-rose-700/60 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer shadow-3xs active:scale-95"
                                title="Delete Forever"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Quick Preview Drawer (lg and above) */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="hidden lg:flex flex-col border-l border-slate-200/80 bg-white min-h-0 shrink-0 select-none shadow-sm"
            >
              {/* Preview Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-serif font-bold text-sm text-slate-900 truncate">
                    Quick Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Content Body */}
              {renderPreviewDetails(previewItem)}

              {/* Preview Footer Actions */}
              <div className="p-4 border-t border-slate-100 flex items-center gap-2 shrink-0 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => handleRestoreItem(previewItem)}
                  className="flex-1 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDeleteForever(previewItem)}
                  className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  title="Delete Forever"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile / Tablet Quick Preview Modal Popup (Under lg screens) */}
      <AnimatePresence>
        {previewItem && (
          <div
            className="fixed inset-0 z-[990] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs lg:hidden select-none"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden text-slate-800"
              onClick={e => e.stopPropagation()}
            >
              {/* Mobile Popup Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 bg-slate-50/60">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-slate-900 leading-tight">
                      Quick Preview
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-medium">Deleted item details</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Popup Content Body */}
              {renderPreviewDetails(previewItem)}

              {/* Mobile Popup Footer Actions */}
              <div className="p-3.5 border-t border-slate-100 flex items-center gap-2 shrink-0 bg-slate-50/70">
                <button
                  type="button"
                  onClick={() => {
                    handleRestoreItem(previewItem);
                    setPreviewItem(null);
                  }}
                  className="flex-1 h-9 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const toDelete = previewItem;
                    setPreviewItem(null);
                    setItemToDeleteForever(toDelete);
                  }}
                  className="h-9 px-3 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  title="Delete Forever"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. BOTTOM FLOATING SELECTION BAR (Mobile & Desktop when Hero is Closed/Scrolled Past) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (!isHeroOpen || isDesktopHeroScrolledPast) && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 sm:bottom-6 left-3.5 right-3.5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[980] bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-2.5 px-3.5 sm:px-4 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 sm:gap-5 select-none sm:min-w-[360px]"
          >
            {/* Left: Selected count badge + Clear button */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse shrink-0" />
              <span className="text-xs font-bold text-white whitespace-nowrap">
                {selectedIds.length} {selectedIds.length === 1 ? 'item selected' : 'items selected'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[11px] text-slate-400 hover:text-white underline ml-1 cursor-pointer transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Right: Actions (Restore & Delete) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Restore Selected Button */}
              <button
                type="button"
                onClick={handleRestoreSelected}
                className="h-8 px-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>Restore</span>
              </button>

              {/* Delete Selected Forever Button */}
              <button
                type="button"
                onClick={handleDeleteSelectedForever}
                className="h-8 px-3 bg-[#E11D48] hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. CONFIRMATION MODAL: Empty Recycle Bin */}
      <AnimatePresence>
        {isConfirmEmptyOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 flex flex-col gap-4 text-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[16px] text-slate-900 mb-1">
                    Empty Recycle Bin?
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This will permanently delete all <strong className="text-slate-800">{totalCount} item(s)</strong>. This action is irreversible and cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfirmEmptyOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmEmptyOpen(false);
                    onEmptyRecycleBin();
                    setSelectedIds([]);
                    setPreviewItem(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Empty All</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CONFIRMATION MODAL: Permanent Delete Single Item */}
      <AnimatePresence>
        {itemToDeleteForever && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 flex flex-col gap-4 text-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <Trash2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[16px] text-slate-900 mb-1">
                    Delete Forever?
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Are you sure you want to permanently delete “<strong className="text-slate-800">{itemToDeleteForever.title}</strong>”? You will not be able to recover this item later.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setItemToDeleteForever(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handlePermanentDeleteItem(itemToDeleteForever)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Forever</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
