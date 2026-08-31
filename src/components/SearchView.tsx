import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  SlidersHorizontal,
  X,
  Search,
  Check,
  CheckSquare,
  List,
  ChevronDown,
  Sparkles,
  History,
  ChevronRight,
  Calendar,
  ExternalLink,
  Folder,
  BookOpen,
  Link,
  Command,
  ArrowUp,
  Info,
  Atom,
  AlignLeft,
  FileText,
  ChevronUp,
  ArrowUpDown,
  ArrowDownAZ,
  TrendingUp,
  Menu
} from 'lucide-react';
import { Topic, Workspace } from '../types';

export interface WorkspaceSection {
  id: string;
  workspaceId: string;
  name: string;
}

export interface GlobalSearchResultItem {
  id: string;
  type: 'workspace' | 'section' | 'topic' | 'task' | 'taskDescription' | 'topicNote' | 'taskNote' | 'topicLink' | 'taskLink';
  title: string;
  snippet?: string;
  workspaceId: string;
  workspaceName: string;
  sectionName?: string;
  topicId?: string;
  topicTitle?: string;
  taskId?: string;
  taskTitle?: string;
  status?: 'completed' | 'in-progress' | 'not-started';
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
  dueDate?: string;
  linkUrl?: string;
  linkType?: 'drive' | 'facebook' | 'youtube' | 'chrome' | 'pdf';
  rawTopic?: Topic;
  dateCreated?: string;
}

function renderSearchNoteIcon() {
  return (
    <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
      <svg width="20" height="25" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 block drop-shadow-2xs">
        <path d="M4 0C1.79086 0 0 1.79086 0 4V38C0 40.2091 1.79086 42 4 42H30C32.2091 42 34 40.2091 34 38V12L22 0H4Z" fill="url(#s_note_grad)" />
        <path d="M22 0V8C22 10.2091 23.7909 12 26 12H34L22 0Z" fill="url(#s_fold_grad)" />
        <rect x="9" y="16" width="16" height="3" rx="1.5" fill="white" />
        <rect x="9" y="24" width="16" height="3" rx="1.5" fill="white" />
        <rect x="9" y="32" width="11" height="3" rx="1.5" fill="white" />
        <defs>
          <linearGradient id="s_note_grad" x1="0" y1="0" x2="34" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--note-grad-start, #60A5FA)" />
            <stop offset="1" stopColor="var(--note-grad-end, #2563EB)" />
          </linearGradient>
          <linearGradient id="s_fold_grad" x1="22" y1="0" x2="34" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--note-fold-start, #93C5FD)" />
            <stop offset="1" stopColor="var(--note-fold-end, #3B82F6)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function getSmartDescriptionSnippet(fullText: string, query: string, wordCountContext: number = 3): string {
  if (!fullText) return '';
  const trimmed = fullText.replace(/\s+/g, ' ').trim();
  const words = trimmed.split(' ').filter(Boolean);
  if (words.length <= wordCountContext * 2 + 1) {
    return trimmed;
  }

  const rawQ = query.trim().toLowerCase();
  if (!rawQ) {
    return words.slice(0, wordCountContext * 2 + 1).join(' ') + ' ...';
  }

  const tokens = rawQ.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return words.slice(0, wordCountContext * 2 + 1).join(' ') + ' ...';
  }

  // Find all matched word indices
  const matchedIndices: number[] = [];
  for (let i = 0; i < words.length; i++) {
    const wordLower = words[i].toLowerCase();
    const cleanWord = wordLower.replace(/[^\w\s\u0980-\u09FF]/gi, '');
    if (tokens.some(t => {
      const cleanToken = t.toLowerCase().replace(/[^\w\s\u0980-\u09FF]/gi, '');
      return (cleanToken && cleanWord.includes(cleanToken)) || wordLower.includes(t.toLowerCase());
    })) {
      matchedIndices.push(i);
    }
  }

  if (matchedIndices.length === 0) {
    return words.slice(0, wordCountContext * 2 + 1).join(' ') + ' ...';
  }

  // Create initial windows [start, end] for each match
  const rawRanges = matchedIndices.map(idx => ({
    start: Math.max(0, idx - wordCountContext),
    end: Math.min(words.length, idx + wordCountContext + 1)
  }));

  // Merge overlapping or nearly adjacent ranges (gap <= 2 words)
  const mergedRanges: { start: number; end: number }[] = [];
  let currentRange = { ...rawRanges[0] };

  for (let i = 1; i < rawRanges.length; i++) {
    const nextRange = rawRanges[i];
    if (nextRange.start <= currentRange.end + 2) {
      currentRange.end = Math.max(currentRange.end, nextRange.end);
    } else {
      mergedRanges.push(currentRange);
      currentRange = { ...nextRange };
    }
  }
  mergedRanges.push(currentRange);

  // Build snippet bridges from all merged ranges
  const snippetParts = mergedRanges.map((range, idx) => {
    let part = words.slice(range.start, range.end).join(' ');
    if (idx === 0 && range.start > 0) {
      part = '... ' + part;
    }
    if (idx === mergedRanges.length - 1 && range.end < words.length) {
      part = part + ' ...';
    }
    return part;
  });

  return snippetParts.join(' ... ');
}

function getSmartUrlSnippet(url: string, query: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  const rawQ = query.trim().toLowerCase();
  if (!rawQ) {
    if (cleanUrl.length <= 60) return cleanUrl;
    return cleanUrl.slice(0, 45) + '...' + cleanUrl.slice(-8);
  }

  const tokens = rawQ.split(/\s+/).filter(Boolean);
  const lowerUrl = cleanUrl.toLowerCase();

  let firstIdx = -1;
  let matchLen = 0;
  for (const token of tokens) {
    const idx = lowerUrl.indexOf(token);
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
      matchLen = token.length;
    }
  }

  // If query is not in URL, return default clean view
  if (firstIdx === -1) {
    if (cleanUrl.length <= 60) return cleanUrl;
    return cleanUrl.slice(0, 45) + '...' + cleanUrl.slice(-8);
  }

  // Extract domain part (e.g. "https://drive.google.com/")
  let domainPrefix = '';
  const domainMatch = cleanUrl.match(/^(https?:\/\/[^\/]+\/)/i);
  if (domainMatch) {
    domainPrefix = domainMatch[1];
  } else {
    domainPrefix = cleanUrl.split('/')[0] + '/';
  }

  if (cleanUrl.length <= 60) {
    return cleanUrl;
  }

  if (firstIdx < domainPrefix.length) {
    return cleanUrl.slice(0, 45) + '...' + cleanUrl.slice(-8);
  }

  const charContext = 4; // 3-4 chars before and after matched keyword
  const matchStart = Math.max(domainPrefix.length, firstIdx - charContext);
  const matchEnd = Math.min(cleanUrl.length, firstIdx + matchLen + charContext);

  const matchedPart = cleanUrl.slice(matchStart, matchEnd);
  const tailPart = cleanUrl.slice(-8);

  let result = domainPrefix;
  if (matchStart > domainPrefix.length) {
    result += '...';
  }
  result += matchedPart;
  if (matchEnd < cleanUrl.length - 8) {
    result += '...' + tailPart;
  } else if (matchEnd < cleanUrl.length) {
    result += cleanUrl.slice(matchEnd);
  }

  return result;
}

function highlightSearchText(text: string, query: string, isCurrentMatch: boolean = false) {
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
            className={`px-0.5 py-0 rounded-[3px] font-inherit font-semibold ${
              isCurrentMatch
                ? 'bg-amber-400 text-slate-950 dark:bg-amber-400 dark:text-slate-950'
                : 'bg-[#FEF08A] dark:bg-amber-400/30 text-slate-900 dark:text-amber-200'
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
}

function detectLinkPlatform(url?: string, type?: string, title?: string): 'youtube' | 'facebook' | 'drive' | 'pdf' | 'chrome' {
  const text = `${url || ''} ${type || ''} ${title || ''}`.toLowerCase();
  if (/drive\.google\.com|docs\.google\.com|sheets\.google\.com|slides\.google\.com|drive/i.test(text)) {
    return 'drive';
  }
  if (/facebook\.com|fb\.com|fb\.watch|fb\.gg|facebook/i.test(text)) {
    return 'facebook';
  }
  if (/youtube\.com|youtu\.be|youtube/i.test(text)) {
    return 'youtube';
  }
  if (/\.pdf($|\?)/i.test(text) || text.includes('pdf')) {
    return 'pdf';
  }
  return 'chrome';
}

function renderSearchLinkIcon(url?: string, type?: string, title?: string) {
  const platform = detectLinkPlatform(url, type, title);

  if (platform === 'youtube') {
    return (
      <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-red-50 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
        <svg width="18" height="13" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path fillRule="evenodd" clipRule="evenodd" d="M27.0983 3.03362C26.7797 1.8436 25.8453 0.909181 24.6553 0.590623C22.5029 0.0136719 14.0006 0.0136719 14.0006 0.0136719C14.0006 0.0136719 5.49826 0.0136719 3.34591 0.590623C2.15589 0.909181 1.22147 1.8436 0.902914 3.03362C0.325963 5.18597 0.325963 9.99965 0.325963 9.99965C0.325963 9.99965 0.325963 14.8133 0.902914 16.9657C1.22147 18.1557 2.15589 19.0901 3.34591 19.4087C5.49826 19.9856 14.0006 19.9856 14.0006 19.9856C14.0006 19.9856 22.5029 19.9856 24.6553 19.4087C25.8453 19.0901 26.7797 18.1557 27.0983 16.9657C27.6752 14.8133 27.6752 9.99965 27.6752 9.99965C27.6752 9.99965 27.6752 5.18597 27.0983 3.03362ZM11.2612 14.2818V5.71754L18.6811 9.99965L11.2612 14.2818Z" fill="#FF0000" />
        </svg>
      </div>
    );
  }

  if (platform === 'facebook') {
    return (
      <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="w-[18px] h-[18px] shrink-0" />
      </div>
    );
  }

  if (platform === 'drive') {
    return (
      <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
        <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-[18px] h-[18px] shrink-0" />
      </div>
    );
  }

  if (platform === 'pdf') {
    return (
      <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
        <FileText className="w-4 h-4 stroke-[2.2]" />
      </div>
    );
  }

  // Default: Chrome icon
  return (
    <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 shadow-3xs group-hover:scale-105 transition-transform">
      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" className="w-[18px] h-[18px] shrink-0" />
    </div>
  );
}

function formatSearchDueDate(dateStr?: string) {
  if (!dateStr) return null;
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = dateStr < todayStr;
  const isToday = dateStr.includes(todayStr);

  let displayDate = dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return {
    display: displayDate,
    isOverdue,
    isToday
  };
}

interface SearchResultItemCardProps {
  item: GlobalSearchResultItem;
  isCurrentMatch: boolean;
  searchPageQuery: string;
  topicTheme: any;
  onSelect: (item: GlobalSearchResultItem) => void;
  onToggleTask?: (topicId: string, taskId: string, e?: React.MouseEvent) => void;
}

const SearchResultItemCard = React.memo<SearchResultItemCardProps>(({
  item,
  isCurrentMatch,
  searchPageQuery,
  topicTheme,
  onSelect,
  onToggleTask
}) => {
  const TopicIcon = topicTheme?.icon || Atom;

  return (
    <div
      id={`search-result-${item.id}`}
      onClick={() => onSelect(item)}
      className={`group px-3.5 py-2 sm:py-2.5 flex items-center justify-between gap-3 transition-all cursor-pointer select-none last:rounded-b-[11px] ${
        isCurrentMatch
          ? 'bg-blue-50/90 dark:bg-blue-950/60 ring-1 ring-inset ring-[#2563EB]/40 dark:ring-blue-500/50'
          : 'hover:bg-slate-50/90 dark:hover:bg-slate-800/60'
      }`}
    >
      {/* Left Icon + Title & Breadcrumb */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {/* Item Icon */}
        {item.type === 'workspace' && (
          <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] text-white shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] text-white" />
          </div>
        )}
        {item.type === 'section' && (
          <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#C084FC] text-white shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] text-white" />
          </div>
        )}
        {item.type === 'topic' && (
          <div
            className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${
              topicTheme ? topicTheme.cardIconBg : 'bg-[#2563EB]'
            }`}
          >
            <TopicIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
        )}
        {item.type === 'task' && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (item.topicId && item.taskId && onToggleTask) {
                onToggleTask(item.topicId, item.taskId, e);
              }
            }}
            title={item.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}
            className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg flex items-center justify-center shrink-0 shadow-xs transition-all cursor-pointer ${
              item.status === 'completed'
                ? 'bg-gradient-to-br from-[#059669] via-[#10B981] to-[#34D399] text-white shadow-emerald-500/20 hover:scale-105'
                : 'bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] text-white shadow-blue-500/20 hover:scale-105'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] text-white" />
          </div>
        )}
        {(item.type === 'topicNote' || item.type === 'taskNote') && (
          renderSearchNoteIcon()
        )}
        {item.type === 'taskDescription' && (
          <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlignLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] text-white" />
          </div>
        )}
        {(item.type === 'topicLink' || item.type === 'taskLink') && (
          <div className="shrink-0">
            {renderSearchLinkIcon(item.linkUrl, item.linkType, item.title)}
          </div>
        )}

        {/* Content Details */}
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors ${
                item.type === 'taskDescription' || item.type === 'topicNote' || item.type === 'taskNote'
                  ? 'text-justify leading-relaxed break-words whitespace-normal'
                  : 'truncate'
              }`}
            >
              {highlightSearchText(
                item.type === 'taskDescription' || item.type === 'topicNote' || item.type === 'taskNote'
                  ? getSmartDescriptionSnippet(item.title, searchPageQuery, 3)
                  : item.title,
                searchPageQuery,
                isCurrentMatch
              )}
            </span>
          </div>

          {item.type !== 'workspace' && (
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 truncate mt-0.5">
              {item.type === 'section' && (
                <span className="text-slate-600 font-medium">{highlightSearchText(item.workspaceName, searchPageQuery, isCurrentMatch)}</span>
              )}
              {item.type === 'topic' && (
                <>
                  <span>{highlightSearchText(item.workspaceName, searchPageQuery, isCurrentMatch)}</span>
                  {item.sectionName && (
                    <>
                      <span className="text-slate-300 font-bold">›</span>
                      <span className="text-slate-600 font-medium">{highlightSearchText(item.sectionName, searchPageQuery, isCurrentMatch)}</span>
                    </>
                  )}
                </>
              )}
              {(item.type === 'task' || item.type === 'topicNote' || item.type === 'topicLink') && (
                <>
                  <span>{highlightSearchText(item.workspaceName, searchPageQuery, isCurrentMatch)}</span>
                  {item.sectionName && (
                    <>
                      <span className="text-slate-300 font-bold">›</span>
                      <span className="text-slate-500">{highlightSearchText(item.sectionName, searchPageQuery, isCurrentMatch)}</span>
                    </>
                  )}
                  {item.topicTitle && (
                    <>
                      <span className="text-slate-300 font-bold">›</span>
                      <span className="text-slate-600 font-medium truncate">{highlightSearchText(item.topicTitle, searchPageQuery, isCurrentMatch)}</span>
                    </>
                  )}
                </>
              )}
              {(item.type === 'taskNote' || item.type === 'taskLink' || item.type === 'taskDescription') && (
                <>
                  <span>{highlightSearchText(item.workspaceName, searchPageQuery, isCurrentMatch)}</span>
                  {item.sectionName && (
                    <>
                      <span className="text-slate-300 font-bold">›</span>
                      <span className="text-slate-500">{highlightSearchText(item.sectionName, searchPageQuery, isCurrentMatch)}</span>
                    </>
                  )}
                  {item.topicTitle && (
                    <>
                      <span className="text-slate-300 font-bold">›</span>
                      <span className="text-slate-500 truncate">{highlightSearchText(item.topicTitle, searchPageQuery, isCurrentMatch)}</span>
                    </>
                  )}
                  {item.taskTitle && (
                    <>
                      <span className="text-slate-300 font-bold">›</span>
                      <span className="text-slate-600 font-semibold truncate">{highlightSearchText(item.taskTitle, searchPageQuery, isCurrentMatch)}</span>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {item.linkUrl && (
            <p className="text-[10px] sm:text-[10.5px] text-[#2563EB] font-mono truncate mt-0.5" title={item.linkUrl}>
              {highlightSearchText(getSmartUrlSnippet(item.linkUrl, searchPageQuery), searchPageQuery, isCurrentMatch)}
            </p>
          )}
        </div>
      </div>

      {/* Right Side Stats & Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {(item.type === 'workspace' || item.type === 'section' || item.type === 'topic') && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-12 sm:w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  item.type === 'workspace'
                    ? 'bg-[#2563EB]'
                    : item.type === 'section'
                    ? 'bg-amber-500'
                    : 'bg-[#2563EB]'
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {item.progress}%
            </span>
          </div>
        )}

        {item.type === 'task' && item.dueDate && (() => {
          const dueInfo = formatSearchDueDate(item.dueDate);
          if (!dueInfo) return null;
          return (
            <span className={`text-[9.5px] font-semibold hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded ${
              dueInfo.isOverdue && item.status !== 'completed'
                ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
                : dueInfo.isToday
                ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                : 'text-slate-400'
            }`}>
              <Calendar className="w-2.5 h-2.5" />
              <span>{dueInfo.isOverdue && item.status !== 'completed' ? 'Overdue: ' : 'Due: '}{dueInfo.display}</span>
            </span>
          );
        })()}

        {(item.type === 'topicLink' || item.type === 'taskLink') && item.linkUrl && (
          <a
            href={item.linkUrl.startsWith('http') ? item.linkUrl : `https://${item.linkUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-3xs shrink-0"
            title="Open link in new tab"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3 stroke-[2.2]" />
          </a>
        )}

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </div>
  );
}, (prev, next) => {
  return (
    prev.item === next.item &&
    prev.isCurrentMatch === next.isCurrentMatch &&
    prev.searchPageQuery === next.searchPageQuery
  );
});

interface SearchCategoryGroupCardProps {
  group: {
    id: GlobalSearchResultItem['type'];
    label: string;
    icon: any;
    items: GlobalSearchResultItem[];
  };
  isCollapsed: boolean;
  activeSearchMatchId: string | null;
  searchPageQuery: string;
  getTopicTheme: (color?: string) => any;
  onToggleCollapse: (id: string) => void;
  onSelect: (item: GlobalSearchResultItem) => void;
  onToggleTask?: (topicId: string, taskId: string, e?: React.MouseEvent) => void;
}

const SearchCategoryGroupCard = React.memo<SearchCategoryGroupCardProps>(({
  group,
  isCollapsed,
  activeSearchMatchId,
  searchPageQuery,
  getTopicTheme,
  onToggleCollapse,
  onSelect,
  onToggleTask
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-lg overflow-hidden shadow-2xs">
      <button
        type="button"
        onClick={() => onToggleCollapse(group.id)}
        className="w-full px-3.5 py-2.5 bg-slate-50/75 hover:bg-slate-100/80 border-b border-slate-200/60 flex items-center justify-between transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-[13px] font-bold text-slate-800">
            {group.label}{' '}
            <span className="text-[#2563EB] font-bold">({group.items.length})</span>
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isCollapsed ? '-rotate-90' : 'rotate-0'
          }`}
        />
      </button>

      {!isCollapsed && (
        <div className="divide-y divide-slate-100">
          {group.items.map(item => (
            <SearchResultItemCard
              key={item.id}
              item={item}
              isCurrentMatch={activeSearchMatchId === item.id}
              searchPageQuery={searchPageQuery}
              topicTheme={item.rawTopic ? getTopicTheme(item.rawTopic) : null}
              onSelect={onSelect}
              onToggleTask={onToggleTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}, (prev, next) => {
  return (
    prev.group === next.group &&
    prev.isCollapsed === next.isCollapsed &&
    prev.activeSearchMatchId === next.activeSearchMatchId &&
    prev.searchPageQuery === next.searchPageQuery
  );
});

interface SearchViewProps {
  workspaces: Workspace[];
  topics: Topic[];
  workspaceSections: WorkspaceSection[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  setActiveSection: (sec: string) => void;
  setSelectedTopicId: (id: string) => void;
  setDrawerNavigationTarget: (target: any) => void;
  setIsDetailsDrawerOpen: (open: boolean) => void;
  toggleTaskCompleted?: (topicId: string, taskId: string, e?: React.MouseEvent) => void;
  onClose: () => void;
  getTopicTheme: (color?: string) => any;
  onToggleSidebar?: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  workspaces,
  topics,
  workspaceSections,
  activeWorkspaceId,
  setActiveWorkspaceId,
  setActiveSection,
  setSelectedTopicId,
  setDrawerNavigationTarget,
  setIsDetailsDrawerOpen,
  toggleTaskCompleted,
  onClose,
  getTopicTheme,
  onToggleSidebar,
}) => {
  const isSearchPageOpen = true;
  const setIsSearchPageOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    if (typeof val === 'function') {
      const res = val(true);
      if (!res) onClose();
    } else if (!val) {
      onClose();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPageInputRef.current?.focus();
      searchPageInputRef.current?.select();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const [searchPageQuery, setSearchPageQuery] = useState<string>('');
  const [searchActiveCategory, setSearchActiveCategory] = useState<string>('all');
  const [searchSelectedWorkspaces, setSearchSelectedWorkspaces] = useState<string[]>([]);
  const [searchSelectedStatuses, setSearchSelectedStatuses] = useState<('completed' | 'in-progress' | 'not-started')[]>(['completed', 'in-progress', 'not-started']);
  const [searchDueDateFilter, setSearchDueDateFilter] = useState<string>('all');
  const [searchSortBy, setSearchSortBy] = useState<'relevance' | 'newest' | 'alphabetical' | 'progress'>('relevance');
  const [searchViewMode, setSearchViewMode] = useState<'list' | 'grid'>('list');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const searchPageInputRef = useRef<HTMLInputElement>(null);
  const [activeSearchMatchId, setActiveSearchMatchId] = useState<string | null>(null);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number>(0);
  const [isRecentSearchesExpanded, setIsRecentSearchesExpanded] = useState<boolean>(false);
  const [isMobileSearchFiltersOpen, setIsMobileSearchFiltersOpen] = useState<boolean>(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState<boolean>(false);
  const [isHeroOpen, setIsHeroOpen] = useState<boolean>(true);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [pullDirection, setPullDirection] = useState<'up' | 'down'>('up');
  const searchResultsScrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const touchStartScrollTopRef = useRef<number>(0);
  const isPullingDownRef = useRef<boolean>(false);
  const heroOpenAtTouchStartRef = useRef<boolean>(true);
  const rafIdRef = useRef<number | null>(null);

  const getHeroOpacity = (): number => {
    if (isHeroOpen && pullDistance === 0) return 1;
    if (!isHeroOpen && pullDistance === 0) return 0;

    if (pullDirection === 'up') {
      // 70% pull-up: Opacity goes 100% -> 0% in first 70% of pull up (from 120 down to 36px)
      return Math.min(1, Math.max(0, (pullDistance - 36) / 84));
    } else {
      // Pull-down tiered curve
      const pct = (pullDistance / 120) * 100;
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

  const categoryChipsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollChipsLeft, setCanScrollChipsLeft] = useState<boolean>(false);
  const [canScrollChipsRight, setCanScrollChipsRight] = useState<boolean>(false);

  const checkChipsScroll = useCallback(() => {
    const el = categoryChipsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollChipsLeft(scrollLeft > 4);
    setCanScrollChipsRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    if (searchPageQuery.trim()) {
      checkChipsScroll();
      const timer = setTimeout(checkChipsScroll, 100);
      return () => clearTimeout(timer);
    }
  }, [searchPageQuery, checkChipsScroll]);

  const handleScrollChips = (direction: 'left' | 'right') => {
    const el = categoryChipsScrollRef.current;
    if (!el) return;
    const scrollAmount = 260;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Recent Searches Storage (up to 20 items)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('studyflow_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const updated = [trimmed, ...prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 20);
      try {
        localStorage.setItem('studyflow_recent_searches', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save recent searches', err);
      }
      return updated;
    });
  };

  const deleteRecentSearch = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      try {
        localStorage.setItem('studyflow_recent_searches', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update recent searches', err);
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('studyflow_recent_searches');
  };

  // Recently Clicked Search Results for Quick Explore
  const [recentClickedResults, setRecentClickedResults] = useState<GlobalSearchResultItem[]>(() => {
    try {
      const saved = localStorage.getItem('studyflow_recent_clicked_results');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveRecentClickedResult = (item: GlobalSearchResultItem) => {
    if (!item || !item.id) return;
    setRecentClickedResults(prev => {
      const updated = [item, ...prev.filter(i => i.id !== item.id)].slice(0, 6);
      try {
        localStorage.setItem('studyflow_recent_clicked_results', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save recent clicked results', err);
      }
      return updated;
    });
  };

  const allGlobalSearchItems = useMemo<GlobalSearchResultItem[]>(() => {
    const items: GlobalSearchResultItem[] = [];

    // 1. Index Workspaces
    workspaces.forEach(ws => {
      const wsTopics = topics.filter(t => t.workspaceId === ws.id);
      const totalTasks = wsTopics.reduce((acc, t) => acc + (t.tasks?.length || 0), 0);
      const completedTasks = wsTopics.reduce((acc, t) => acc + (t.tasks?.filter(tk => tk.completed).length || 0), 0);
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      items.push({
        id: `ws-${ws.id}`,
        type: 'workspace',
        title: ws.name,
        snippet: (ws as any).description || '',
        workspaceId: ws.id,
        workspaceName: ws.name,
        progress,
        totalTasks,
        completedTasks,
        status: totalTasks === 0 ? 'not-started' : completedTasks === totalTasks ? 'completed' : completedTasks > 0 ? 'in-progress' : 'not-started'
      });
    });

    // 2. Index Sections
    workspaceSections.forEach(sec => {
      const parentWs = workspaces.find(w => String(w.id) === String(sec.workspaceId));
      if (!parentWs) return; // Skip orphaned sections
      const wsName = parentWs.name;
      const secTopics = topics.filter(t => String(t.workspaceId) === String(sec.workspaceId) && t.section === sec.name);
      const totalTasks = secTopics.reduce((acc, t) => acc + (t.tasks?.length || 0), 0);
      const completedTasks = secTopics.reduce((acc, t) => acc + (t.tasks?.filter(tk => tk.completed).length || 0), 0);
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      items.push({
        id: `sec-${sec.id}`,
        type: 'section',
        title: sec.name,
        snippet: (sec as any).description || '',
        workspaceId: sec.workspaceId,
        workspaceName: wsName,
        sectionName: sec.name,
        progress,
        totalTasks,
        completedTasks,
        status: totalTasks === 0 ? 'not-started' : completedTasks === totalTasks ? 'completed' : completedTasks > 0 ? 'in-progress' : 'not-started'
      });
    });

    // 3. Index Topics & Children
    topics.forEach(topic => {
      let targetWsId = topic.workspaceId;
      if (!targetWsId && topic.section) {
        const secMatch = workspaceSections.find(s => s.name === topic.section);
        if (secMatch) targetWsId = secMatch.workspaceId;
      }
      const parentWs = workspaces.find(w => String(w.id) === String(targetWsId));
      if (!parentWs) return; // Skip orphaned topics from deleted or non-existent workspaces
      const wsName = parentWs.name;
      const totalTasks = topic.tasks?.length || 0;
      const completedTasks = topic.tasks?.filter(t => t.completed).length || 0;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const topicStatus: 'completed' | 'in-progress' | 'not-started' =
        totalTasks === 0 ? 'not-started' : completedTasks === totalTasks ? 'completed' : completedTasks > 0 ? 'in-progress' : 'not-started';

      // 3.1 Topic Item
      items.push({
        id: `topic-${topic.id}`,
        type: 'topic',
        title: topic.title,
        snippet: (topic as any).description || '',
        workspaceId: topic.workspaceId,
        workspaceName: wsName,
        sectionName: topic.section,
        topicId: topic.id,
        topicTitle: topic.title,
        progress,
        totalTasks,
        completedTasks,
        status: topicStatus,
        rawTopic: topic
      });

      // 3.2 Topic Notes
      (topic.notes || []).forEach(note => {
        const noteText = note.text || (note as any).content || (note as any).title || '';
        if (!noteText.trim()) return;
        items.push({
          id: `topicNote-${note.id}`,
          type: 'topicNote',
          title: noteText,
          snippet: noteText,
          workspaceId: topic.workspaceId,
          workspaceName: wsName,
          sectionName: topic.section,
          topicId: topic.id,
          topicTitle: topic.title,
          status: topicStatus,
          rawTopic: topic
        });
      });

      // 3.3 Topic Links
      (topic.links || []).forEach(link => {
        items.push({
          id: `topicLink-${link.id}`,
          type: 'topicLink',
          title: link.title || link.url,
          linkUrl: link.url,
          linkType: link.type,
          snippet: (link as any).description || '',
          workspaceId: topic.workspaceId,
          workspaceName: wsName,
          sectionName: topic.section,
          topicId: topic.id,
          topicTitle: topic.title,
          status: topicStatus,
          rawTopic: topic
        });
      });

      // 3.4 Tasks & Task Children
      (topic.tasks || []).forEach(task => {
        const taskStatus: 'completed' | 'in-progress' | 'not-started' = task.completed ? 'completed' : 'in-progress';
        items.push({
          id: `task-${task.id}`,
          type: 'task',
          title: task.title,
          workspaceId: topic.workspaceId,
          workspaceName: wsName,
          sectionName: topic.section,
          topicId: topic.id,
          topicTitle: topic.title,
          taskId: task.id,
          taskTitle: task.title,
          status: taskStatus,
          dueDate: task.dueDate,
          rawTopic: topic
        });

        // 3.5 Task Descriptions (Dedicated separate item)
        if (task.description && task.description.trim()) {
          items.push({
            id: `taskDesc-${task.id}`,
            type: 'taskDescription',
            title: task.description.trim(),
            snippet: task.description.trim(),
            workspaceId: topic.workspaceId,
            workspaceName: wsName,
            sectionName: topic.section,
            topicId: topic.id,
            topicTitle: topic.title,
            taskId: task.id,
            taskTitle: task.title,
            status: taskStatus,
            dueDate: task.dueDate,
            rawTopic: topic
          });
        }

        // 3.6 Task Notes
        (task.notes || []).forEach(note => {
          const noteText = note.text || (note as any).content || (note as any).title || '';
          if (!noteText.trim()) return;
          items.push({
            id: `taskNote-${note.id}`,
            type: 'taskNote',
            title: noteText,
            snippet: noteText,
            workspaceId: topic.workspaceId,
            workspaceName: wsName,
            sectionName: topic.section,
            topicId: topic.id,
            topicTitle: topic.title,
            taskId: task.id,
            taskTitle: task.title,
            status: taskStatus,
            rawTopic: topic
          });
        });

        // 3.7 Task Links
        (task.links || []).forEach(link => {
          items.push({
            id: `taskLink-${link.id}`,
            type: 'taskLink',
            title: link.title || link.url,
            linkUrl: link.url,
            linkType: link.type,
            snippet: (link as any).description || '',
            workspaceId: topic.workspaceId,
            workspaceName: wsName,
            sectionName: topic.section,
            topicId: topic.id,
            topicTitle: topic.title,
            taskId: task.id,
            taskTitle: task.title,
            status: taskStatus,
            rawTopic: topic
          });
        });
      });
    });

    return items;
  }, [workspaces, workspaceSections, topics]);

  // Query Matched Search Items: Match on item's own title, description/content snippet, or link text/URL
  const queryMatchedGlobalItems = useMemo(() => {
    const rawQ = searchPageQuery.trim().toLowerCase();
    if (!rawQ) return [];

    const tokens = rawQ.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    return allGlobalSearchItems.filter(item => {
      let targetText = '';

      if (item.type === 'workspace' || item.type === 'section' || item.type === 'topic' || item.type === 'task') {
        targetText = item.title;
      } else if (item.type === 'taskDescription') {
        targetText = item.snippet || item.title;
      } else if (item.type === 'topicNote' || item.type === 'taskNote') {
        targetText = `${item.title} ${item.snippet || ''}`;
      } else if (item.type === 'topicLink' || item.type === 'taskLink') {
        targetText = `${item.title} ${item.linkUrl || ''} ${item.snippet || ''}`;
      }

      const lowerTarget = targetText.toLowerCase();
      return tokens.every(token => lowerTarget.includes(token));
    });
  }, [allGlobalSearchItems, searchPageQuery]);

  // Dynamic Category Counts for Top Pills
  const searchCategoryCounts = useMemo(() => {
    return {
      all: queryMatchedGlobalItems.length,
      workspaces: queryMatchedGlobalItems.filter(i => i.type === 'workspace').length,
      sections: queryMatchedGlobalItems.filter(i => i.type === 'section').length,
      topics: queryMatchedGlobalItems.filter(i => i.type === 'topic').length,
      tasks: queryMatchedGlobalItems.filter(i => i.type === 'task').length,
      taskDescriptions: queryMatchedGlobalItems.filter(i => i.type === 'taskDescription').length,
      topicNotes: queryMatchedGlobalItems.filter(i => i.type === 'topicNote').length,
      taskNotes: queryMatchedGlobalItems.filter(i => i.type === 'taskNote').length,
      topicLinks: queryMatchedGlobalItems.filter(i => i.type === 'topicLink').length,
      taskLinks: queryMatchedGlobalItems.filter(i => i.type === 'taskLink').length
    };
  }, [queryMatchedGlobalItems]);

  // Workspace Match Counts for Sidebar Checkboxes
  const searchWorkspaceCounts = useMemo(() => {
    const map: Record<string, number> = {};
    workspaces.forEach(ws => {
      map[ws.id] = queryMatchedGlobalItems.filter(i => i.workspaceId === ws.id).length;
    });
    return map;
  }, [workspaces, queryMatchedGlobalItems]);

  // Status Match Counts for Sidebar Checkboxes
  const searchStatusCounts = useMemo(() => {
    return {
      completed: queryMatchedGlobalItems.filter(i => i.status === 'completed').length,
      'in-progress': queryMatchedGlobalItems.filter(i => i.status === 'in-progress').length,
      'not-started': queryMatchedGlobalItems.filter(i => i.status === 'not-started').length
    };
  }, [queryMatchedGlobalItems]);

  // Final Filtered and Sorted Global Search Results
  const finalGlobalSearchResults = useMemo(() => {
    let list = [...queryMatchedGlobalItems];

    // 1. Filter by Top Category Pill
    if (searchActiveCategory !== 'all') {
      list = list.filter(item => item.type === searchActiveCategory);
    }

    // 2. Filter by Selected Workspaces (Sidebar)
    if (searchSelectedWorkspaces.length > 0) {
      list = list.filter(item => searchSelectedWorkspaces.includes(item.workspaceId));
    }

    // 3. Filter by Status (Sidebar)
    if (searchSelectedStatuses.length < 3) {
      list = list.filter(item => !item.status || searchSelectedStatuses.includes(item.status));
    }

    // 4. Filter by Due Date (Sidebar)
    if (searchDueDateFilter !== 'all') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (searchDueDateFilter === 'has-due') {
        list = list.filter(item => !!item.dueDate);
      } else if (searchDueDateFilter === 'today') {
        list = list.filter(item => item.dueDate && item.dueDate.includes(todayStr));
      } else if (searchDueDateFilter === 'overdue') {
        list = list.filter(item => item.dueDate && item.dueDate < todayStr && item.status !== 'completed');
      }
    }

    // 5. Priority Hierarchy Sorting
    const priorityWeight: Record<string, number> = {
      workspace: 1,
      section: 2,
      topic: 3,
      task: 4,
      taskDescription: 5,
      topicNote: 6,
      taskNote: 7,
      topicLink: 8,
      taskLink: 9
    };

    if (searchSortBy === 'relevance') {
      list.sort((a, b) => (priorityWeight[a.type] || 99) - (priorityWeight[b.type] || 99));
    } else if (searchSortBy === 'alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (searchSortBy === 'progress') {
      list.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    }

    return list;
  }, [
    queryMatchedGlobalItems,
    searchActiveCategory,
    searchSelectedWorkspaces,
    searchSelectedStatuses,
    searchDueDateFilter,
    searchSortBy
  ]);

  // Collapsed Category Accordion State
  const [collapsedSearchCategories, setCollapsedSearchCategories] = useState<Record<string, boolean>>({});

  const toggleSearchCategoryCollapse = useCallback((catId: string) => {
    setCollapsedSearchCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  }, []);

  // Group Search Results by Category in exact hierarchy order
  const groupedSearchResults = useMemo(() => {
    const groups: {
      id: GlobalSearchResultItem['type'];
      label: string;
      icon: any;
      iconBadgeBg?: string;
      items: GlobalSearchResultItem[];
    }[] = [];

    const order: { id: GlobalSearchResultItem['type']; label: string; icon: any; iconBadgeBg: string }[] = [
      { id: 'workspace', label: 'Workspaces', icon: BookOpen, iconBadgeBg: 'bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA]' },
      { id: 'section', label: 'Sections', icon: Folder, iconBadgeBg: 'bg-gradient-to-br from-[#7C3AED] via-[#9333EA] to-[#C084FC]' },
      { id: 'topic', label: 'Topics', icon: Atom, iconBadgeBg: 'bg-[#2563EB]' },
      { id: 'task', label: 'Tasks', icon: CheckSquare, iconBadgeBg: 'bg-gradient-to-br from-[#059669] via-[#10B981] to-[#34D399]' },
      { id: 'taskDescription', label: 'Descriptions', icon: AlignLeft, iconBadgeBg: 'bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]' },
      { id: 'topicNote', label: 'Topic Notes', icon: FileText, iconBadgeBg: 'bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#C084FC]' },
      { id: 'taskNote', label: 'Task Notes', icon: FileText, iconBadgeBg: 'bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#C084FC]' },
      { id: 'topicLink', label: 'Topic Links', icon: ExternalLink, iconBadgeBg: 'bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]' },
      { id: 'taskLink', label: 'Task Links', icon: ExternalLink, iconBadgeBg: 'bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]' },
    ];

    order.forEach(cat => {
      const items = finalGlobalSearchResults.filter(i => i.type === cat.id);
      if (items.length > 0) {
        groups.push({
          id: cat.id,
          label: cat.label,
          icon: cat.icon,
          iconBadgeBg: cat.iconBadgeBg,
          items
        });
      }
    });

    return groups;
  }, [finalGlobalSearchResults]);

  // Deep Linking & Selecting Search Result
  const handleSelectSearchResult = useCallback((item: GlobalSearchResultItem) => {
    if (!item) return;
    saveRecentClickedResult(item);
    if (searchPageQuery.trim()) {
      saveRecentSearch(searchPageQuery.trim());
    }
    if (item.workspaceId && activeWorkspaceId !== item.workspaceId) {
      setActiveWorkspaceId(item.workspaceId);
    }
    if (item.sectionName) {
      setActiveSection(item.sectionName);
    }
    if (item.topicId) {
      setSelectedTopicId(item.topicId);
    } else if (item.type === 'topic') {
      setSelectedTopicId(item.id.replace('topic-', ''));
    }

    if (item.type === 'topicNote') {
      setDrawerNavigationTarget({
        headerTab: 'notes',
        taskId: null,
        timestamp: Date.now()
      });
      setIsDetailsDrawerOpen(true);
    } else if (item.type === 'topicLink') {
      setDrawerNavigationTarget({
        headerTab: 'files',
        taskId: null,
        timestamp: Date.now()
      });
      setIsDetailsDrawerOpen(true);
    } else if (item.type === 'taskNote') {
      setDrawerNavigationTarget({
        headerTab: 'tasks',
        taskSubTab: 'notes',
        taskId: item.taskId || null,
        timestamp: Date.now()
      });
      setIsDetailsDrawerOpen(true);
    } else if (item.type === 'taskLink') {
      setDrawerNavigationTarget({
        headerTab: 'tasks',
        taskSubTab: 'links',
        taskId: item.taskId || null,
        timestamp: Date.now()
      });
      setIsDetailsDrawerOpen(true);
    } else if (item.type === 'task' || item.type === 'taskDescription') {
      setDrawerNavigationTarget({
        headerTab: 'tasks',
        taskSubTab: 'details',
        taskId: item.taskId || null,
        timestamp: Date.now()
      });
      setIsDetailsDrawerOpen(true);
    } else if (item.type === 'topic') {
      setDrawerNavigationTarget({
        headerTab: 'tasks',
        taskId: null,
        timestamp: Date.now()
      });
      setIsDetailsDrawerOpen(true);
    }

    setIsSearchPageOpen(false);

    // Auto scroll to target topic on workspace
    const targetTopicId = item.topicId || (item.type === 'topic' ? item.id.replace('topic-', '') : null);
    if (targetTopicId) {
      setTimeout(() => {
        const el = document.getElementById(targetTopicId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
    }
  }, [
    activeWorkspaceId,
    setActiveWorkspaceId,
    setActiveSection,
    setSelectedTopicId,
    setDrawerNavigationTarget,
    setIsDetailsDrawerOpen,
    searchPageQuery
  ]);

  // Reset active scroll match when query or filter changes
  useEffect(() => {
    setActiveSearchIndex(0);
    if (finalGlobalSearchResults.length > 0) {
      setActiveSearchMatchId(finalGlobalSearchResults[0].id);
    } else {
      setActiveSearchMatchId(null);
    }
  }, [searchPageQuery, searchActiveCategory, searchSelectedWorkspaces, searchSelectedStatuses, searchDueDateFilter]);

  const handleNavigateSearchResults = (direction: 'next' | 'prev' = 'next') => {
    if (searchPageQuery.trim()) {
      saveRecentSearch(searchPageQuery.trim());
    }
    if (finalGlobalSearchResults.length === 0) return;

    const total = finalGlobalSearchResults.length;
    let nextIndex = activeSearchIndex;
    if (direction === 'prev') {
      nextIndex = (activeSearchIndex - 1 + total) % total;
    } else {
      nextIndex = (activeSearchIndex + 1) % total;
    }

    setActiveSearchIndex(nextIndex);
    const targetItem = finalGlobalSearchResults[nextIndex];
    if (targetItem) {
      setActiveSearchMatchId(targetItem.id);

      // Auto expand category group if collapsed
      if (collapsedSearchCategories[targetItem.type]) {
        setCollapsedSearchCategories(prev => ({
          ...prev,
          [targetItem.type]: false
        }));
      }

      setTimeout(() => {
        const el = document.getElementById(`search-result-${targetItem.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 40);
    }
  };

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigateSearchResults('next');
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchPageOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleNavigateSearchResults(e.shiftKey ? 'prev' : 'next');
    } else if (e.key === 'ArrowDown' && e.altKey) {
      e.preventDefault();
      handleNavigateSearchResults('next');
    } else if (e.key === 'ArrowUp' && e.altKey) {
      e.preventDefault();
      handleNavigateSearchResults('prev');
    }
  };

  return (

                <motion.div
                  key="global-search-page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="flex-1 w-full flex flex-col h-full overflow-hidden"
                >
                {/* 1. TOP HEADER (Mobile Only: Hamburger Menu + Dynamic Animated 'Search' Title; Hidden on Desktop) */}
                <div className="md:hidden shrink-0 h-[56px] px-4 bg-white border-b border-slate-200/80 flex items-center justify-between z-30 relative select-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Mobile Hamburger Menu Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onToggleSidebar) {
                          onToggleSidebar();
                        }
                      }}
                      className="w-[32px] h-[32px] rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-3xs transition-all cursor-pointer select-none shrink-0"
                      title="Open sidebar"
                    >
                      <Menu className="w-4 h-4 text-slate-700 stroke-[2.3]" />
                    </button>

                    {/* Mobile Compact Title (Smooth Fade-In when Hero is collapsed) */}
                    <div
                      className="flex items-center min-w-0 pointer-events-none transition-all duration-200"
                      style={{
                        opacity: isHeroOpen ? (pullDistance > 0 ? Math.max(0, 1 - pullDistance / 40) : 0) : Math.min(1, 1 - pullDistance / 60),
                        transform: `translateY(${isHeroOpen ? 6 : 0}px)`,
                        display: isHeroOpen && pullDistance === 0 ? 'none' : 'flex',
                      }}
                    >
                      <h1 className="font-serif font-bold text-[15.5px] text-slate-900 tracking-tight leading-none truncate">
                        Search
                      </h1>
                    </div>
                  </div>
                </div>

                {/* 2. COLLAPSIBLE HERO HEADER (Mobile Only: 1:1 Motion & Tiered Fade) */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isHeroOpen ? 120 : pullDistance > 0 ? pullDistance : 0,
                    opacity: getHeroOpacity(),
                  }}
                  transition={{
                    height: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                    opacity: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                  }}
                  className="md:hidden overflow-hidden bg-white flex flex-col items-center text-center select-none shrink-0"
                >
                  <motion.div
                    animate={{
                      y: isHeroOpen ? 0 : pullDistance > 0 ? pullDistance - 120 : -120,
                    }}
                    transition={{
                      y: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="h-[120px] pt-3 pb-1.5 px-4 flex flex-col items-center justify-center text-center select-none w-full"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-[#2563EB] to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-1.5 shrink-0">
                      <Search className="w-[24px] h-[24px] stroke-[2.4]" />
                    </div>
                    <h2 className="text-[17px] font-bold text-slate-900 tracking-tight leading-tight shrink-0">
                      Search anything
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-xs shrink-0">
                      Find workspaces, topics, tasks, notes & links
                    </p>
                  </motion.div>
                </motion.div>

                {/* 3. MOBILE SEARCH INPUT BAR (Fixed & Flush directly below Hero / Header with 0 gap!) */}
                <div className="md:hidden shrink-0 px-3.5 pt-2 pb-2.5 bg-white border-b border-slate-200/80 z-20">
                  <div className="w-full flex items-center gap-2">
                    <form onSubmit={handleSearchFormSubmit} action="" className="relative flex-1 m-0">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${
                        isSearchInputFocused ? 'text-[#2563EB]' : 'text-slate-400'
                      }`} />
                      <input
                        type="search"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={searchPageQuery}
                        onFocus={() => setIsSearchInputFocused(true)}
                        onBlur={() => setIsSearchInputFocused(false)}
                        onChange={e => setSearchPageQuery(e.target.value)}
                        onKeyDown={handleSearchInputKeyDown}
                        placeholder="Search workspaces, topics, tasks, notes, links..."
                        className={`w-full h-[38px] pl-9 ${
                          searchPageQuery.trim() ? 'pr-28' : 'pr-10'
                        } bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-3xs [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none`}
                      />

                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none">
                        <AnimatePresence mode="wait">
                          {searchPageQuery.trim() && (
                            <motion.div
                              key="chrome-ctrl-f-controls-mobile"
                              initial={{ opacity: 0, scale: 0.92 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.92 }}
                              transition={{ duration: 0.12 }}
                              className="flex items-center gap-0.5"
                            >
                              <span
                                className={`text-[10px] font-semibold font-mono px-1 py-0.5 rounded ${
                                  finalGlobalSearchResults.length > 0
                                    ? 'text-slate-500 bg-slate-100 border border-slate-200/60'
                                    : 'text-rose-500 bg-rose-50 border border-rose-200/60 font-bold'
                                }`}
                              >
                                {finalGlobalSearchResults.length > 0 ? `${activeSearchIndex + 1}/${finalGlobalSearchResults.length}` : '0/0'}
                              </span>

                              <button
                                type="button"
                                disabled={finalGlobalSearchResults.length === 0}
                                onClick={() => handleNavigateSearchResults('prev')}
                                className="p-0.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="Previous match (Shift+Enter)"
                              >
                                <ChevronUp className="w-3.5 h-3.5 stroke-[2.4]" />
                              </button>

                              <button
                                type="button"
                                disabled={finalGlobalSearchResults.length === 0}
                                onClick={() => handleNavigateSearchResults('next')}
                                className="p-0.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="Next match (Enter)"
                              >
                                <ChevronDown className="w-3.5 h-3.5 stroke-[2.4]" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSearchPageQuery('');
                                  searchPageInputRef.current?.focus();
                                }}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Clear search (Escape)"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </form>
                  </div>
                </div>

                {/* 4. SCROLLABLE SEARCH CONTAINER (Starts flush directly beneath search bar!) */}
                <div
                  ref={searchResultsScrollRef}
                  onTouchStart={(e) => {
                    touchStartYRef.current = e.touches[0]?.clientY ?? 0;
                    touchStartTimeRef.current = Date.now();
                    const st = searchResultsScrollRef.current?.scrollTop ?? 0;
                    touchStartScrollTopRef.current = st;
                    isPullingDownRef.current = st <= 2;
                    heroOpenAtTouchStartRef.current = isHeroOpen;
                    setPullDirection(isHeroOpen ? 'up' : 'down');
                  }}
                  onTouchMove={(e) => {
                    const currentY = e.touches[0]?.clientY ?? 0;
                    const deltaY = currentY - touchStartYRef.current;
                    const st = searchResultsScrollRef.current?.scrollTop ?? 0;

                    // Only pull hero down if touch gesture STARTED when list was at top (scrollTop <= 2)
                    if (!heroOpenAtTouchStartRef.current && deltaY > 0) {
                      if (touchStartScrollTopRef.current <= 2 && st <= 2) {
                        setPullDirection('down');
                        const pull = Math.min(120, deltaY * 0.55);
                        setPullDistance(pull);
                      }
                    } else if (heroOpenAtTouchStartRef.current && deltaY < 0) {
                      if (st <= 2) {
                        setPullDirection('up');
                        if (isHeroOpen) setIsHeroOpen(false);
                        const pull = Math.max(0, 120 + (deltaY * 0.55));
                        setPullDistance(pull);
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    const currentY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
                    const deltaY = currentY - touchStartYRef.current;
                    const deltaTime = Math.max(1, Date.now() - touchStartTimeRef.current);
                    const velocityY = deltaY / deltaTime; // pixels per ms
                    
                    // Ignore simple taps but restore open state
                    if (Math.abs(deltaY) < 5) {
                      if (heroOpenAtTouchStartRef.current) setIsHeroOpen(true);
                      setPullDistance(0);
                      return;
                    }

                    if (!heroOpenAtTouchStartRef.current) {
                      // Was closed: ONLY trigger hero open if touch gesture STARTED when list was AT TOP (touchStartScrollTop <= 2)
                      if (touchStartScrollTopRef.current <= 2) {
                        const isFastFlickDown = velocityY > 0.35 && deltaY > 15;
                        if (pullDistance >= 42 || isFastFlickDown) {
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
                        if (pullDistance < 78 || isFastFlickUp) {
                          setIsHeroOpen(false);
                        } else {
                          setIsHeroOpen(true); // Snap back open
                        }
                      } else {
                        // User pulled down or dragged nowhere while already open -> keep it fully open!
                        setIsHeroOpen(true);
                      }
                      setPullDistance(0);
                    }
                  }}
                  onScroll={(e) => {
                    const st = e.currentTarget.scrollTop;
                    if (isHeroOpen && st > 8) {
                      setPullDirection('up');
                      setIsHeroOpen(false);
                      setPullDistance(0);
                    }
                  }}
                  className={`flex-1 w-full no-scrollbar pt-3 px-4 sm:px-6 pb-16 ${
                    (!isHeroOpen && pullDistance === 0) ? 'overflow-y-auto' : 'overflow-hidden md:overflow-y-auto'
                  }`}
                >
                  {/* Outer Wrapper: Main Container centered (max-w-[930px]) + Filter Sidebar on the far right (w-[275px]) */}
                  <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-6 relative">

                    {/* MAIN CONTAINER (Result Card Width: max-w-[930px], Centered) */}
                    <div className="w-full max-w-[930px] mx-auto flex flex-col gap-4 sm:gap-5 min-w-0">

                    {/* Mobile Filter Menu (Smooth Cubic-Bezier Animation - Only visible when searching) */}
                    <AnimatePresence initial={false}>
                      {searchPageQuery.trim() && isMobileSearchFiltersOpen && (
                        <motion.div
                          key="mobile-search-filters"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto', transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] } }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
                          className="xl:hidden overflow-hidden w-full"
                        >
                          <div className="bg-white border border-slate-200/90 rounded-lg p-4 shadow-sm flex flex-col gap-4">
                            {/* Filter Header */}
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                                <h3 className="font-bold text-sm text-slate-900">Filters</h3>
                              </div>
                              <div className="flex items-center gap-3">
                                {(searchSelectedWorkspaces.length > 0 || searchSelectedStatuses.length < 3) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSearchSelectedWorkspaces([]);
                                      setSearchSelectedStatuses(['completed', 'in-progress', 'not-started']);
                                      setSearchDueDateFilter('all');
                                      setSearchActiveCategory('all');
                                    }}
                                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                                  >
                                    Reset
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setIsMobileSearchFiltersOpen(false)}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Close filters"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Section 1: Workspaces Checkboxes */}
                            <div className="flex flex-col gap-2">
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Workspaces</h4>
                              <div className="flex flex-col gap-1 max-h-44 overflow-y-auto no-scrollbar">
                                {workspaces.map(ws => {
                                  const isSelected = searchSelectedWorkspaces.includes(ws.id);
                                  const count = searchWorkspaceCounts[ws.id] || 0;
                                  return (
                                    <label
                                      key={ws.id}
                                      className="flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer select-none group"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <input
                                          type="checkbox"
                                          checked={isSelected || searchSelectedWorkspaces.length === 0}
                                          onChange={() => {
                                            if (searchSelectedWorkspaces.length === 0) {
                                              setSearchSelectedWorkspaces(workspaces.filter(w => w.id !== ws.id).map(w => w.id));
                                            } else if (isSelected) {
                                              const next = searchSelectedWorkspaces.filter(id => id !== ws.id);
                                              setSearchSelectedWorkspaces(next);
                                            } else {
                                              setSearchSelectedWorkspaces([...searchSelectedWorkspaces, ws.id]);
                                            }
                                          }}
                                          className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300 cursor-pointer"
                                        />
                                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 truncate">
                                          {ws.name}
                                        </span>
                                      </div>
                                      <span className="text-[11px] font-bold text-slate-400 shrink-0">
                                        {count}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Section 2: Status Checkboxes */}
                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</h4>
                              <div className="flex flex-col gap-1">
                                {[
                                  { id: 'completed', label: 'Completed', count: searchStatusCounts.completed },
                                  { id: 'in-progress', label: 'In Progress', count: searchStatusCounts['in-progress'] },
                                  { id: 'not-started', label: 'Not Started', count: searchStatusCounts['not-started'] },
                                ].map(st => {
                                  const isChecked = searchSelectedStatuses.includes(st.id as any);
                                  return (
                                    <label
                                      key={st.id}
                                      className="flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer select-none group"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => {
                                            if (isChecked) {
                                              setSearchSelectedStatuses(searchSelectedStatuses.filter(s => s !== st.id));
                                            } else {
                                              setSearchSelectedStatuses([...searchSelectedStatuses, st.id as any]);
                                            }
                                          }}
                                          className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300 cursor-pointer"
                                        />
                                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                                          {st.label}
                                        </span>
                                      </div>
                                      <span className="text-[11px] font-bold text-slate-400 shrink-0">
                                        {st.count}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* DESKTOP ONLY HERO SEARCH BOX: Centered on top of the page */}
                    <div className="hidden md:flex flex-col items-center justify-center text-center pt-5 sm:pt-7 pb-1 max-w-2xl mx-auto w-full">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-[#2563EB] to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-2.5 shrink-0">
                        <Search className="w-[28px] h-[28px] stroke-[2.4]" />
                      </div>
                      <div className="flex flex-col items-center gap-1 mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                          Search anything
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Find workspaces, sections, topics, tasks, notes, links and more.
                        </p>
                      </div>

                      <div className="w-full flex items-center gap-2.5">
                        <form onSubmit={handleSearchFormSubmit} action="" className="relative flex-1 m-0">
                          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-200 ${
                            isSearchInputFocused ? 'text-[#2563EB]' : 'text-slate-400'
                          }`} />
                          <input
                            ref={searchPageInputRef}
                            type="search"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            autoFocus
                            value={searchPageQuery}
                            onFocus={() => setIsSearchInputFocused(true)}
                            onBlur={() => setIsSearchInputFocused(false)}
                            onChange={e => setSearchPageQuery(e.target.value)}
                            onKeyDown={handleSearchInputKeyDown}
                            placeholder="Search workspaces, topics, tasks, notes, links..."
                            className={`w-full h-11 pl-10 ${
                              searchPageQuery.trim() ? 'pr-32 sm:pr-36' : 'pr-14'
                            } bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200/90 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/20 rounded-md text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none`}
                          />

                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none">
                            <AnimatePresence mode="wait">
                              {searchPageQuery.trim() ? (
                                <motion.div
                                  key="chrome-ctrl-f-controls-desktop"
                                  initial={{ opacity: 0, scale: 0.92 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.92 }}
                                  transition={{ duration: 0.12 }}
                                  className="flex items-center gap-0.5"
                                >
                                  {/* Match Counter: n/total (e.g. 1/14 or 0/0) */}
                                  <span
                                    className={`text-[11px] font-semibold font-mono px-1.5 py-0.5 rounded transition-colors ${
                                      finalGlobalSearchResults.length > 0
                                        ? 'text-slate-500 bg-slate-100/90 border border-slate-200/60'
                                        : 'text-rose-500 bg-rose-50 border border-rose-200/60 font-bold'
                                    }`}
                                  >
                                    {finalGlobalSearchResults.length > 0 ? `${activeSearchIndex + 1}/${finalGlobalSearchResults.length}` : '0/0'}
                                  </span>

                                  {/* Up Button (Previous Match) */}
                                  <button
                                    type="button"
                                    disabled={finalGlobalSearchResults.length === 0}
                                    onClick={() => handleNavigateSearchResults('prev')}
                                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                    title="Previous match (Shift+Enter)"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5 stroke-[2.4]" />
                                  </button>

                                  {/* Down Button (Next Match) */}
                                  <button
                                    type="button"
                                    disabled={finalGlobalSearchResults.length === 0}
                                    onClick={() => handleNavigateSearchResults('next')}
                                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                    title="Next match (Enter)"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5 stroke-[2.4]" />
                                  </button>

                                  {/* Divider */}
                                  <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />

                                  {/* Clear search 'X' Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSearchPageQuery('');
                                      searchPageInputRef.current?.focus();
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Clear search (Escape)"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </motion.div>
                              ) : (
                                <motion.kbd
                                  key="cmd-k-badge"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.12 }}
                                  className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 h-[19px] bg-slate-100 border border-slate-200/80 rounded-[4px] text-slate-400 text-[10px] font-bold leading-none pointer-events-none mr-0.5"
                                >
                                  <Command className="w-[9px] h-[9px] stroke-[2.3]" />
                                  <span>K</span>
                                </motion.kbd>
                              )}
                            </AnimatePresence>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Category Filter Pills (YouTube/Google Style Carousel with Left/Right Chevrons & Edge Blur) */}
                    <AnimatePresence>
                      {searchPageQuery.trim() && (
                        <motion.div
                          key="category-filter-pills-carousel"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.14, ease: 'easeOut' }}
                          className="w-full relative group -mt-1 sm:-mt-1.5"
                        >
                        {/* Left Edge Gradient Fade & Chevron Button (Desktop/Tablet only) */}
                        <AnimatePresence>
                          {canScrollChipsLeft && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                              className="hidden sm:flex absolute left-0 top-0 bottom-0 z-10 items-center pr-5 pl-0.5 bg-gradient-to-r from-[#F8FAFC] dark:from-[#0b0f19] via-[#F8FAFC]/90 dark:via-[#0b0f19]/90 to-transparent pointer-events-none"
                            >
                              <button
                                type="button"
                                onClick={() => handleScrollChips('left')}
                                className="pointer-events-auto w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer select-none"
                                title="Scroll left"
                              >
                                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Scrollable Chips Container */}
                        <div
                          ref={categoryChipsScrollRef}
                          onScroll={checkChipsScroll}
                          className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-1 scroll-smooth"
                        >
                          {[
                            { id: 'all', label: 'All', count: searchCategoryCounts.all },
                            { id: 'workspace', label: 'Workspaces', count: searchCategoryCounts.workspaces },
                            { id: 'section', label: 'Sections', count: searchCategoryCounts.sections },
                              { id: 'topic', label: 'Topics', count: searchCategoryCounts.topics },
                              { id: 'task', label: 'Tasks', count: searchCategoryCounts.tasks },
                              { id: 'taskDescription', label: 'Descriptions', count: searchCategoryCounts.taskDescriptions },
                              { id: 'topicNote', label: 'Topic Notes', count: searchCategoryCounts.topicNotes },
                              { id: 'taskNote', label: 'Task Notes', count: searchCategoryCounts.taskNotes },
                              { id: 'topicLink', label: 'Topic Links', count: searchCategoryCounts.topicLinks },
                              { id: 'taskLink', label: 'Task Links', count: searchCategoryCounts.taskLinks },
                            ].map(pill => {
                              const isActive = searchActiveCategory === pill.id;
                              return (
                                <button
                                  key={pill.id}
                                  type="button"
                                  onClick={() => setSearchActiveCategory(pill.id)}
                                  className={`h-8 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 select-none border transition-colors duration-150 ease-out ${
                                    isActive
                                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                                      : 'bg-white dark:bg-slate-900 hover:bg-slate-100/90 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 shadow-3xs'
                                  }`}
                                >
                                  <span>{pill.label}</span>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold leading-none transition-colors duration-150 ease-out ${
                                      isActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700'
                                    }`}
                                  >
                                    {pill.count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                        {/* Right Edge Gradient Fade & Chevron Button (Desktop/Tablet only) */}
                        <AnimatePresence>
                          {canScrollChipsRight && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                              className="hidden sm:flex absolute right-0 top-0 bottom-0 z-10 items-center pl-5 pr-0.5 bg-gradient-to-l from-[#F8FAFC] dark:from-[#0b0f19] via-[#F8FAFC]/90 dark:via-[#0b0f19]/90 to-transparent pointer-events-none"
                            >
                              <button
                                type="button"
                                onClick={() => handleScrollChips('right')}
                                className="pointer-events-auto w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer select-none"
                                title="Scroll right"
                              >
                                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>

                    {/* Results Toolbar */}
                    <AnimatePresence>
                      {searchPageQuery.trim() && (
                        <motion.div
                          key="search-results-toolbar"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.14, ease: 'easeOut' }}
                          className="flex items-center justify-between gap-3 px-1"
                        >
                        <div className="text-xs sm:text-sm font-bold text-slate-800">
                          Search Results
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Mobile/Tablet Filter Button (Same h-8 height as Sort button) */}
                          <button
                            type="button"
                            onClick={() => setIsMobileSearchFiltersOpen(prev => !prev)}
                            className={`h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0 select-none relative shadow-3xs xl:hidden ${
                              isMobileSearchFiltersOpen || searchSelectedWorkspaces.length > 0 || searchSelectedStatuses.length < 3
                                ? 'bg-blue-50/80 border-[#2563EB]/40 text-[#2563EB]'
                                : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                            }`}
                            title="Toggle filters"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Filter</span>
                            {(searchSelectedWorkspaces.length > 0 || searchSelectedStatuses.length < 3) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] absolute top-1.5 right-1.5 ring-2 ring-white" />
                            )}
                          </button>

                          {/* Professional Custom Sort Dropdown */}
                          <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsSortDropdownOpen(prev => !prev)}
                            className={`h-8 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer select-none shadow-3xs ${
                              isSortDropdownOpen
                                ? 'bg-blue-50/80 border-[#2563EB]/40 text-[#2563EB]'
                                : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                            }`}
                          >
                            <ArrowUpDown className={`w-3.5 h-3.5 ${isSortDropdownOpen ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                            <span className="hidden sm:inline text-slate-400 font-medium">Sort:</span>
                            <span className="text-slate-800 font-semibold">
                              {searchSortBy === 'relevance' && 'Relevance'}
                              {searchSortBy === 'alphabetical' && 'Alphabetical'}
                              {searchSortBy === 'progress' && 'Progress %'}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180 text-[#2563EB]' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isSortDropdownOpen && (
                              <>
                                {/* Click outside backdrop */}
                                <div
                                  className="fixed inset-0 z-[9998]"
                                  onClick={() => setIsSortDropdownOpen(false)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                  transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                                  className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200/90 rounded-xl p-1 shadow-lg shadow-slate-900/10 z-[9999] select-none"
                                >
                                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Sort By
                                  </div>
                                  {[
                                    { id: 'relevance', label: 'Relevance', icon: Sparkles },
                                    { id: 'alphabetical', label: 'Alphabetical', icon: ArrowDownAZ },
                                    { id: 'progress', label: 'Progress %', icon: TrendingUp },
                                  ].map(opt => {
                                    const Icon = opt.icon;
                                    const isSelected = searchSortBy === opt.id;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                          setSearchSortBy(opt.id as any);
                                          setIsSortDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                          isSelected
                                            ? 'bg-blue-50 text-[#2563EB] font-bold'
                                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                                          <span>{opt.label}</span>
                                        </div>
                                        {isSelected && (
                                          <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                    {/* Results List Cards */}
                    <div className="flex flex-col gap-2.5">
                      <AnimatePresence mode="wait" initial={false}>
                        {!searchPageQuery.trim() ? (
                          /* Initial State: Recent Searches + Quick Explore */
                          <motion.div
                            key="search-initial-recent-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12, ease: 'easeOut' }}
                            className="flex flex-col gap-3.5"
                          >
                          {/* Recent Searches Section (if any saved) */}
                          {recentSearches.length > 0 && (
                            <div className="bg-white border border-slate-200/80 rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-2xs flex flex-col gap-2 sm:gap-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                  <History className="w-4 h-4 text-[#2563EB]" />
                                  <span>Recent Searches</span>
                                </div>
                                {recentSearches.length > 4 && (
                                  <button
                                    type="button"
                                    onClick={() => setIsRecentSearchesExpanded(prev => !prev)}
                                    className="text-[11px] font-semibold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer select-none"
                                  >
                                    {isRecentSearchesExpanded ? 'Show less' : 'See all'}
                                  </button>
                                )}
                              </div>
                              <motion.div
                                initial={false}
                                animate={{ height: isRecentSearchesExpanded ? 'auto' : 34 }}
                                transition={{ duration: 0.08, ease: 'easeOut' }}
                                className="overflow-hidden transform-gpu"
                              >
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  {recentSearches.map((rec) => (
                                    <div
                                      key={rec}
                                      onClick={() => {
                                        setSearchPageQuery(rec);
                                        saveRecentSearch(rec);
                                        searchPageInputRef.current?.focus();
                                      }}
                                      className="flex items-center gap-1 pl-2.5 pr-1.5 sm:pl-3 sm:pr-2 py-1.5 rounded-md bg-slate-50 hover:bg-blue-50 active:bg-blue-100 border border-slate-200/80 hover:border-blue-300 text-xs font-medium text-slate-700 hover:text-[#2563EB] cursor-pointer group shrink-0 select-none max-w-full transition-colors"
                                    >
                                      <span className="truncate max-w-[125px] sm:max-w-[155px]" title={rec}>{rec}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => deleteRecentSearch(rec, e)}
                                        onTouchEnd={(e) => e.stopPropagation()}
                                        className="p-0.5 rounded-full text-slate-400 hover:text-rose-500 active:text-rose-600 hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
                                        title="Remove"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          )}

                          {/* Initial Empty Prompt Card */}
                          <div className="bg-white border border-slate-200/80 rounded-lg p-8 sm:p-10 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-blue-300/80 dark:border-blue-700/80 flex items-center justify-center shadow-3xs">
                              <Search className="w-6 h-6 stroke-[2]" />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-800">Start typing to search</h3>
                            <p className="text-xs text-slate-500 max-w-sm">
                              Type any keyword to instantly find workspaces, sections, topics, tasks, notes, and links across your study plan.
                            </p>
                            {recentClickedResults.length > 0 && (
                              <div className="flex items-center gap-2 mt-2 flex-wrap justify-center text-xs text-slate-400">
                                <span className="font-medium text-slate-500">Quick explore:</span>
                                {recentClickedResults.map(item => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelectSearchResult(item)}
                                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-slate-700 font-medium transition-colors cursor-pointer border border-slate-200/60 max-w-[200px] truncate"
                                    title={`Open ${item.title}`}
                                  >
                                    {item.title}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="search-active-results-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.14, ease: 'easeOut' }}
                          className="flex flex-col gap-2.5"
                        >
                          {finalGlobalSearchResults.length === 0 ? (
                        /* No matching results */
                        <div className="bg-white border border-slate-200/80 rounded-lg p-10 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <Search className="w-6 h-6" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-800">No matching results found</h3>
                          <p className="text-xs text-slate-500 max-w-sm">
                            No items match your search query or active filters. Try searching for other keywords or clearing your filters.
                          </p>
                          {(searchSelectedWorkspaces.length > 0 || searchActiveCategory !== 'all' || searchSelectedStatuses.length < 3 || searchDueDateFilter !== 'all') && (
                            <button
                              type="button"
                              onClick={() => {
                                setSearchActiveCategory('all');
                                setSearchSelectedWorkspaces([]);
                                setSearchSelectedStatuses(['completed', 'in-progress', 'not-started']);
                                setSearchDueDateFilter('all');
                                setSearchPageQuery('');
                              }}
                              className="mt-2 px-3.5 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-colors cursor-pointer"
                            >
                              Reset all filters
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Grouped Results by Category (Matching reference design) */
                        <div className="flex flex-col gap-3">
                          {groupedSearchResults.map(group => (
                            <SearchCategoryGroupCard
                              key={group.id}
                              group={group}
                              isCollapsed={Boolean(collapsedSearchCategories[group.id])}
                              activeSearchMatchId={activeSearchMatchId}
                              searchPageQuery={searchPageQuery}
                              getTopicTheme={getTopicTheme}
                              onToggleCollapse={toggleSearchCategoryCollapse}
                              onSelect={handleSelectSearchResult}
                              onToggleTask={toggleTaskCompleted}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

                  {/* RIGHT: Filters Sidebar (Positioned on the far right edge with Smooth AnimatePresence fade) */}
                  <AnimatePresence>
                    {searchPageQuery.trim() && (
                      <motion.div
                        key="desktop-search-filters-sidebar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.14, ease: 'easeOut' }}
                        className="hidden xl:flex w-[260px] 2xl:w-[275px] shrink-0 bg-white border border-slate-200/80 rounded-lg p-3.5 sm:p-4 shadow-2xs flex-col gap-4 xl:absolute xl:right-0 xl:top-0 z-10"
                      >
                      {/* Filter Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                          <h3 className="font-bold text-sm text-slate-900">Filters</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchSelectedWorkspaces([]);
                            setSearchSelectedStatuses(['completed', 'in-progress', 'not-started']);
                            setSearchDueDateFilter('all');
                            setSearchActiveCategory('all');
                          }}
                          className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>

                      {/* Section 1: Workspaces Checkboxes */}
                      <div className="flex flex-col gap-2.5">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Workspaces</h4>
                        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                          {workspaces.map(ws => {
                            const isSelected = searchSelectedWorkspaces.includes(ws.id);
                            const count = searchWorkspaceCounts[ws.id] || 0;
                            return (
                              <label
                                key={ws.id}
                                className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isSelected || searchSelectedWorkspaces.length === 0}
                                    onChange={() => {
                                      if (searchSelectedWorkspaces.length === 0) {
                                        setSearchSelectedWorkspaces(workspaces.filter(w => w.id !== ws.id).map(w => w.id));
                                      } else if (isSelected) {
                                        const next = searchSelectedWorkspaces.filter(id => id !== ws.id);
                                        setSearchSelectedWorkspaces(next);
                                      } else {
                                        setSearchSelectedWorkspaces([...searchSelectedWorkspaces, ws.id]);
                                      }
                                    }}
                                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300 cursor-pointer"
                                  />
                                  <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 truncate">
                                    {ws.name}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 shrink-0">
                                  {count}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 2: Status Checkboxes */}
                      <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status</h4>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { id: 'completed', label: 'Completed', count: searchStatusCounts.completed },
                            { id: 'in-progress', label: 'In Progress', count: searchStatusCounts['in-progress'] },
                            { id: 'not-started', label: 'Not Started', count: searchStatusCounts['not-started'] },
                          ].map(st => {
                            const isChecked = searchSelectedStatuses.includes(st.id as any);
                            return (
                              <label
                                key={st.id}
                                className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setSearchSelectedStatuses(searchSelectedStatuses.filter(s => s !== st.id));
                                      } else {
                                        setSearchSelectedStatuses([...searchSelectedStatuses, st.id as any]);
                                      }
                                    }}
                                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300 cursor-pointer"
                                  />
                                  <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                                    {st.label}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 shrink-0">
                                  {st.count}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                </div>
              </div>
            </motion.div>
  );
};

export default SearchView;
