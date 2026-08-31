import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NotebookPen,
  Plus,
  Search,
  ChevronLeft,
  Pin,
  Trash2,
  Copy,
  MoreVertical,
  Check,
  FolderKanban,
  FolderOutput,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  ListTodo,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  AlertTriangle,
  X,
  SlidersHorizontal,
  Edit3,
  Link2,
  Undo2,
  Redo2,
  Loader2,
  Wand2,
  Menu,
} from 'lucide-react';

export interface StudyNote {
  id: string;
  title: string;
  content: string;
  workspaceId?: string;
  createdAt: number;
  updatedAt: number;
  isPinned?: boolean;
  color?: 'default' | 'amber' | 'blue' | 'emerald' | 'purple' | 'rose';
}

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  [key: string]: any;
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

export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getNotePlainText(content: string): string {
  if (!content) return '';
  return content
    // Inline elements first
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<mark[^>]*>(.*?)<\/mark>/gi, '==$1==')
    .replace(/<(b|strong)[^>]*>(.*?)<\/(b|strong)>/gi, '**$2**')
    .replace(/<(i|em)[^>]*>(.*?)<\/(i|em)>/gi, '*$2*')
    .replace(/<(s|strike|del)[^>]*>(.*?)<\/(s|strike|del)>/gi, '~~$2~~')
    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Block elements
    .replace(/<div class="checklist-item[^>]*data-checked="true"[^>]*>[\s\S]*?<span class="chk-text[^>]*>(.*?)<\/span><\/div>/gi, '- [x] $1\n')
    .replace(/<div class="checklist-item[^>]*>[\s\S]*?<span class="chk-text[^>]*>(.*?)<\/span><\/div>/gi, '- [ ] $1\n')
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<li[^>]*class="[^"]*text-2xl[^"]*"[^>]*>(.*?)<\/li>/gi, '# $1\n')
    .replace(/<li[^>]*class="[^"]*text-xl[^"]*"[^>]*>(.*?)<\/li>/gi, '## $1\n')
    .replace(/<li[^>]*class="[^"]*text-lg[^"]*"[^>]*>(.*?)<\/li>/gi, '### $1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr[^>]*>/gi, '\n---\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function convertMarkdownToHtml(content: string): string {
  if (!content) return '';
  // If it already looks like rich HTML, return it
  if (/<(p|h1|h2|h3|ul|ol|li|blockquote|div|b|strong|i|em|mark|del|hr)/i.test(content)) {
    return content;
  }

  const lines = content.split('\n');
  const htmlLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Horizontal Rule
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      htmlLines.push('<hr class="my-4 border-slate-200" />');
      continue;
    }

    // Heading 1
    if (line.startsWith('# ')) {
      const text = line.substring(2);
      htmlLines.push(`<h1 class="font-serif text-2xl font-bold text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-100">${formatInlineMarkdownToHtml(text)}</h1>`);
      continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      const text = line.substring(3);
      htmlLines.push(`<h2 class="font-serif text-xl font-bold text-slate-800 mt-3 mb-1.5">${formatInlineMarkdownToHtml(text)}</h2>`);
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      const text = line.substring(4);
      htmlLines.push(`<h3 class="font-serif text-lg font-semibold text-slate-800 mt-2.5 mb-1">${formatInlineMarkdownToHtml(text)}</h3>`);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const text = line.substring(2);
      htmlLines.push(`<blockquote class="border-l-4 border-[#2563EB]/60 pl-3 py-1 bg-blue-50/40 text-slate-700 rounded-r-md my-1.5 italic text-[14px]">${formatInlineMarkdownToHtml(text)}</blockquote>`);
      continue;
    }

    // Checklist Item
    const checkMatch = line.match(/^(\s*)-\s\[([ xX])\]\s(.*)$/);
    if (checkMatch) {
      const isChecked = checkMatch[2].toLowerCase() === 'x';
      const text = checkMatch[3];
      htmlLines.push(
        `<div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="${isChecked}">` +
          `<span class="chk-box mt-1 w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 ${isChecked ? 'bg-[#2563EB] border-[#2563EB] text-white font-bold' : 'border-slate-300 bg-white'}">${isChecked ? '✓' : ''}</span>` +
          `<span class="chk-text flex-1 select-text ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}">${formatInlineMarkdownToHtml(text)}</span>` +
        `</div>`
      );
      continue;
    }

    // Bullet Item
    if (/^(\s*)[-*]\s(.*)$/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^(\s*)[-*]\s(.*)$/.test(lines[i])) {
        const text = lines[i].replace(/^(\s*)[-*]\s/, '');
        items.push(`<li>${formatInlineMarkdownToHtml(text)}</li>`);
        i++;
      }
      i--; // adjust loop step
      htmlLines.push(`<ul class="list-disc list-inside my-1 space-y-0.5">${items.join('')}</ul>`);
      continue;
    }

    // Numbered List
    const numMatch = line.match(/^(\s*)(\d+)\.\s(.*)$/);
    if (numMatch) {
      const items: string[] = [];
      const startNum = numMatch[2];
      while (i < lines.length && /^(\s*)(\d+)\.\s(.*)$/.test(lines[i])) {
        const match = lines[i].match(/^(\s*)(\d+)\.\s(.*)$/);
        if (match) {
          items.push(`<li>${formatInlineMarkdownToHtml(match[3])}</li>`);
        }
        i++;
      }
      i--; // adjust loop step
      htmlLines.push(`<ol class="list-decimal list-inside my-1 space-y-0.5" start="${startNum}">${items.join('')}</ol>`);
      continue;
    }

    // Empty line
    if (!line.trim()) {
      htmlLines.push('<p><br></p>');
      continue;
    }

    // Regular paragraph
    htmlLines.push(`<p class="leading-relaxed my-1">${formatInlineMarkdownToHtml(line)}</p>`);
  }

  return htmlLines.join('');
}

function formatInlineMarkdownToHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/==(.*?ches|.*?)==/g, '<mark class="bg-amber-100 text-amber-950 px-1 py-0.5 rounded">$1</mark>')
    .replace(/~~(.*?)~~/g, '<del class="text-slate-400">$1</del>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">$1</code>');
}

export function getNoteDisplayTitle(note: StudyNote): string {
  if (note.title && note.title.trim()) {
    return note.title.trim();
  }
  const cleanSnippet = stripHtml(note.content || '');
  if (cleanSnippet) {
    const firstLine = cleanSnippet.split('\n')[0] || '';
    const cleanLine = firstLine.replace(/^(#+\s*|-\s*\[[ xX]\]\s*|[-*]\s*|\d+\.\s*|>\s*)/, '').trim();
    if (cleanLine) {
      return cleanLine.length > 60 ? `${cleanLine.substring(0, 60)}...` : cleanLine;
    }
  }
  return 'Untitled Note';
}

export interface NotesStudioProps {
  notes: StudyNote[];
  setNotes: React.Dispatch<React.SetStateAction<StudyNote[]>>;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onClose: () => void;
  showToast: (msg: string) => void;
  onSoftDeleteNote?: (note: StudyNote) => void;
  onToggleSidebar?: () => void;
}

export const NotesStudio: React.FC<NotesStudioProps> = ({
  notes,
  setNotes,
  workspaces,
  activeWorkspaceId,
  onClose,
  showToast,
  onSoftDeleteNote,
  onToggleSidebar,
}) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    try {
      const savedId = localStorage.getItem('studyflow_active_note_id');
      if (savedId && notes.some(n => n.id === savedId)) return savedId;
    } catch {}
    return notes.length > 0 ? notes[0].id : null;
  });

  useEffect(() => {
    if (activeNoteId) {
      try {
        localStorage.setItem('studyflow_active_note_id', activeNoteId);
      } catch {}
    }
  }, [activeNoteId]);
  const [noteSearchQuery, setNoteSearchQuery] = useState<string>('');
  const [noteWorkspaceFilter, setNoteWorkspaceFilter] = useState<string>('all');
  const [noteSortBy, setNoteSortBy] = useState<'created' | 'updated' | 'title'>('created');
  const [isMobileNoteEditing, setIsMobileNoteEditing] = useState<boolean>(false);
  const [isHeroOpen, setIsHeroOpen] = useState<boolean>(true);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [pullDirection, setPullDirection] = useState<'up' | 'down'>('up');
  const notesListScrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const touchStartScrollTopRef = useRef<number>(0);
  const isPullingDownRef = useRef<boolean>(false);
  const heroOpenAtTouchStartRef = useRef<boolean>(true);

  const getHeroOpacity = (): number => {
    if (isHeroOpen && pullDistance === 0) return 1;
    if (!isHeroOpen && pullDistance === 0) return 0;

    if (pullDirection === 'up') {
      // 70% pull-up: Opacity goes 100% -> 0% in the first 70% of pull up (from 132 down to 39.6px)
      return Math.min(1, Math.max(0, (pullDistance - 39.6) / 92.4));
    } else {
      // Pull-down: 1-2% -> 10%, 3-4% -> 12%, 4-5% -> 14%, 6-7% -> 16%, 8-9% -> 18%, 9-10% -> 20%, 10-90% -> 20%-100%
      const pct = (pullDistance / 132) * 100;
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
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [activeNoteMenuId, setActiveNoteMenuId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{
    noteId: string;
    top?: number;
    bottom?: number;
    right: number;
    openUpward: boolean;
  } | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<StudyNote | null>(null);
  const [noteToMove, setNoteToMove] = useState<StudyNote | null>(null);
  const [targetWorkspaceForMove, setTargetWorkspaceForMove] = useState<string>('');
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState<boolean>(false);
  const [textColorAnchor, setTextColorAnchor] = useState<{ top: number; left: number } | null>(null);
  const [activeTextColor, setActiveTextColor] = useState<string>('#0F172A');
  const savedSelectionRangeRef = useRef<Range | null>(null);

  const [noteEditorMode, setNoteEditorMode] = useState<'write' | 'preview'>('preview');
  const [isMarkdownAutoFormatEnabled, setIsMarkdownAutoFormatEnabled] = useState<boolean>(() => {
    return localStorage.getItem('studyflow_notes_md_autoformat') !== 'false';
  });

  const toggleMarkdownAutoFormat = () => {
    setIsMarkdownAutoFormatEnabled(prev => {
      const next = !prev;
      localStorage.setItem('studyflow_notes_md_autoformat', String(next));
      showToast(next ? 'Markdown auto-format enabled' : 'Markdown auto-format disabled');
      return next;
    });
  };

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    highlight: false,
    h1: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
    code: false,
    quote: false,
    link: false,
    checklist: false,
  });

  const [isTitleFocused, setIsTitleFocused] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeNoteRef = useRef<StudyNote | null>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);

  const activeNote = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  useEffect(() => {
    activeNoteRef.current = activeNote;
  }, [activeNote]);

  const flushSave = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (
      activeNoteRef.current &&
      editorContentRef.current &&
      lastLoadedNoteIdRef.current === activeNoteRef.current.id
    ) {
      const html = editorContentRef.current.innerHTML;
      lastHtmlRef.current = html;
      handleUpdateNote(activeNoteRef.current.id, { content: html });
      setIsSaving(false);
    }
  };

  const scheduleDebouncedSave = () => {
    if (!activeNote || !editorContentRef.current) return;
    const html = editorContentRef.current.innerHTML;
    lastHtmlRef.current = html;
    setIsSaving(true);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      if (activeNoteRef.current) {
        handleUpdateNote(activeNoteRef.current.id, { content: html });
      }
      setIsSaving(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      flushSave();
    };
  }, []);

  const updateToolbarState = () => {
    try {
      const selection = window.getSelection();
      let isQuote = false;
      let isHighlight = false;
      let isLink = false;
      let isChecklist = false;
      let isCode = false;
      let isUl = false;
      let isOl = false;
      let isLiH1 = false;
      let isLiH2 = false;
      let isLiH3 = false;

      let parentEl: HTMLElement | null = null;

      if (selection && selection.rangeCount > 0) {
        const node = selection.anchorNode;
        parentEl = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement || null;

        if (parentEl) {
          if (parentEl.closest('blockquote')) isQuote = true;
          if (parentEl.tagName === 'MARK' || parentEl.closest('mark')) isHighlight = true;
          if (parentEl.closest('a')) isLink = true;
          if (parentEl.closest('code') || parentEl.tagName === 'CODE') isCode = true;
          if (parentEl.closest('.checklist-item')) isChecklist = true;
          if (parentEl.closest('ul')) isUl = true;
          if (parentEl.closest('ol')) isOl = true;

          const currentLi = parentEl.closest('li');
          if (currentLi) {
            if (currentLi.classList.contains('text-2xl') || currentLi.querySelector('.text-2xl') || parentEl.closest('.text-2xl')) isLiH1 = true;
            if (currentLi.classList.contains('text-xl') || currentLi.querySelector('.text-xl') || parentEl.closest('.text-xl')) isLiH2 = true;
            if (currentLi.classList.contains('text-lg') || currentLi.querySelector('.text-lg') || parentEl.closest('.text-lg')) isLiH3 = true;
            if (parentEl.closest('h1') || currentLi.closest('h1')) isLiH1 = true;
            if (parentEl.closest('h2') || currentLi.closest('h2')) isLiH2 = true;
            if (parentEl.closest('h3') || currentLi.closest('h3')) isLiH3 = true;
          }
        }
      }

      let blockValue = '';
      try {
        blockValue = (document.queryCommandValue('formatBlock') || '').toLowerCase();
      } catch {}

      if (blockValue === 'blockquote') isQuote = true;

      // Detect direct H1/H2/H3 tags in DOM tree if formatBlock is unreliable
      const isDomH1 = parentEl?.closest('h1') !== null;
      const isDomH2 = parentEl?.closest('h2') !== null;
      const isDomH3 = parentEl?.closest('h3') !== null;

      const isH1 = !isQuote && !isChecklist && (isLiH1 || blockValue === 'h1' || isDomH1);
      const isH2 = !isQuote && !isChecklist && (isLiH2 || blockValue === 'h2' || isDomH2);
      const isH3 = !isQuote && !isChecklist && (isLiH3 || blockValue === 'h3' || isDomH3);

      let isBold = false;
      let isItalic = false;
      let isUnderline = false;
      let isStrike = false;

      try {
        isBold = document.queryCommandState('bold');
        isItalic = document.queryCommandState('italic');
        isUnderline = document.queryCommandState('underline');
        isStrike = document.queryCommandState('strikeThrough');
        if (!isUl) isUl = document.queryCommandState('insertUnorderedList');
        if (!isOl) isOl = document.queryCommandState('insertOrderedList');
      } catch {}

      // If inside li with bold/italic classes or tags
      if (parentEl?.closest('b, strong')) isBold = true;
      if (parentEl?.closest('i, em')) isItalic = true;
      if (parentEl?.closest('u, ins')) isUnderline = true;
      if (parentEl?.closest('s, strike, del')) isStrike = true;

      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strike: isStrike,
        highlight: isHighlight,
        h1: isH1,
        h2: isH2,
        h3: isH3,
        ul: isUl,
        ol: isOl,
        code: isCode,
        quote: isQuote,
        link: isLink,
        checklist: isChecklist,
      });
    } catch {
      // Ignore if document.queryCommandState is temporarily unavailable
    }
  };

  const lastLoadedNoteIdRef = useRef<string | null>(null);
  const lastHtmlRef = useRef<string>('');
  const pendingCaretTargetInfoRef = useRef<{
    childIndex: number;
    charOffset: number;
    fallbackCoords?: { clientX: number; clientY: number };
  } | null>(null);

  // Sync editor content ONLY when activeNoteId changes or when entering write mode
  useEffect(() => {
    if (noteEditorMode === 'write' && editorContentRef.current && activeNote) {
      const targetHtml = convertMarkdownToHtml(activeNote.content || '');
      if (lastLoadedNoteIdRef.current !== activeNote.id || editorContentRef.current.innerHTML !== targetHtml) {
        editorContentRef.current.innerHTML = targetHtml;
        lastLoadedNoteIdRef.current = activeNote.id;
        lastHtmlRef.current = targetHtml;
      }

      // Position caret exactly where user clicked in preview mode, or at the end
      setTimeout(() => {
        if (!editorContentRef.current) return;
        editorContentRef.current.focus();

        const selection = window.getSelection();
        if (selection) {
          const info = pendingCaretTargetInfoRef.current;
          pendingCaretTargetInfoRef.current = null;

          if (info && editorContentRef.current) {
            const editorEl = editorContentRef.current;
            const targetChild = editorEl.children[info.childIndex] || editorEl.firstChild;

            if (targetChild) {
              // Find the text node inside targetChild corresponding to charOffset
              let currentOffset = 0;
              let foundNode: Node | null = null;
              let foundOffset = 0;

              const walk = (node: Node) => {
                if (foundNode) return;
                if (node.nodeType === Node.TEXT_NODE) {
                  const len = node.textContent?.length || 0;
                  if (currentOffset + len >= info.charOffset) {
                    foundNode = node;
                    foundOffset = Math.max(0, Math.min(len, info.charOffset - currentOffset));
                    return;
                  }
                  currentOffset += len;
                } else {
                  for (let i = 0; i < node.childNodes.length; i++) {
                    walk(node.childNodes[i]);
                  }
                }
              };

              walk(targetChild);

              if (foundNode) {
                const range = document.createRange();
                range.setStart(foundNode, foundOffset);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                updateToolbarState();
                return;
              }
            }

            // Fallback using coords if node walk failed
            if (info.fallbackCoords) {
              if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(info.fallbackCoords.clientX, info.fallbackCoords.clientY);
                if (pos && pos.offsetNode && editorContentRef.current.contains(pos.offsetNode)) {
                  const range = document.createRange();
                  range.setStart(pos.offsetNode, pos.offset);
                  range.collapse(true);
                  selection.removeAllRanges();
                  selection.addRange(range);
                  updateToolbarState();
                  return;
                }
              } else if ((document as any).caretRangeFromPoint) {
                const range = (document as any).caretRangeFromPoint(info.fallbackCoords.clientX, info.fallbackCoords.clientY);
                if (range && editorContentRef.current.contains(range.startContainer)) {
                  selection.removeAllRanges();
                  selection.addRange(range);
                  updateToolbarState();
                  return;
                }
              }
            }
          }

          // Default Fallback: Place cursor at the end of the content
          const range = document.createRange();
          range.selectNodeContents(editorContentRef.current);
          range.collapse(false); // collapse to end
          selection.removeAllRanges();
          selection.addRange(range);
        }
        updateToolbarState();
      }, 30);
    }
  }, [activeNoteId, noteEditorMode]);

  // Auto-dismiss 3-dot menu on scroll or resize to prevent misalignment
  useEffect(() => {
    if (!menuAnchor) return;
    const handleDismiss = () => {
      setMenuAnchor(null);
      setActiveNoteMenuId(null);
    };
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('resize', handleDismiss);
    return () => {
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [menuAnchor]);

  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  const handleCreateNewNote = () => {
    flushSave();
    const newNote: StudyNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: '',
      content: '',
      workspaceId: noteWorkspaceFilter !== 'all' ? noteWorkspaceFilter : (activeWorkspaceId || undefined),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false
    };
    lastLoadedNoteIdRef.current = null;
    lastHtmlRef.current = '';
    setNotes(prev => {
      const nextNotes = [newNote, ...prev];
      try {
        localStorage.setItem('studyflow_notes', JSON.stringify(nextNotes));
      } catch (err) {
        console.error('Failed to save note', err);
      }
      return nextNotes;
    });
    setActiveNoteId(newNote.id);
    setIsMobileNoteEditing(true);
    setNoteEditorMode('write');
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 60);
  };

  const handleUpdateNote = (id: string, updates: Partial<StudyNote>) => {
    setNotes(prev => {
      const nextNotes = prev.map(note => (note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note));
      try {
        localStorage.setItem('studyflow_notes', JSON.stringify(nextNotes));
      } catch (err) {
        console.error('Failed to update note', err);
      }
      return nextNotes;
    });
  };

  const handleConfirmDeleteNote = () => {
    if (!noteToDelete) return;
    const targetNote = noteToDelete;
    const id = targetNote.id;

    if (onSoftDeleteNote) {
      onSoftDeleteNote(targetNote);
    }

    setNotes(prev => {
      const filtered = prev.filter(n => n.id !== id);
      try {
        localStorage.setItem('studyflow_notes', JSON.stringify(filtered));
      } catch (err) {
        console.error('Failed to delete note', err);
      }
      if (activeNoteId === id) {
        setActiveNoteId(filtered.length > 0 ? filtered[0].id : null);
        if (filtered.length === 0) {
          setIsMobileNoteEditing(false);
        }
      }
      return filtered;
    });
    setNoteToDelete(null);
    setActiveNoteMenuId(null);
    showToast('Note moved to Recycle Bin');
  };

  const handleTogglePinNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => {
      const target = prev.find(n => n.id === id);
      if (!target) return prev;
      const nextPinned = !target.isPinned;
      showToast(nextPinned ? 'Pinned to top' : 'Unpinned');
      const nextNotes = prev.map(note => (note.id === id ? { ...note, isPinned: nextPinned } : note));
      try {
        localStorage.setItem('studyflow_notes', JSON.stringify(nextNotes));
      } catch (err) {
        console.error('Failed to pin note', err);
      }
      return nextNotes;
    });
  };

  const handleQuickCopyNote = (note: StudyNote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanContent = getNotePlainText(note.content || '');
    const plainTextToCopy = `${note.title && note.title.trim() ? `${note.title.trim()}\n\n` : ''}${cleanContent}`;

    // Rich HTML representation to preserve 100% exact styles, tags, checklists and formats on paste
    const richTitleHtml = note.title && note.title.trim() ? `<h1>${note.title.trim()}</h1>` : '';
    const richHtmlToCopy = `${richTitleHtml}${note.content || ''}`;

    if (navigator.clipboard && window.ClipboardItem) {
      try {
        const textBlob = new Blob([plainTextToCopy], { type: 'text/plain' });
        const htmlBlob = new Blob([richHtmlToCopy], { type: 'text/html' });
        const clipboardItem = new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob,
        });
        navigator.clipboard.write([clipboardItem]).then(() => {
          setCopiedNoteId(note.id);
          showToast('Note copied (with full formatting)');
          setTimeout(() => {
            setCopiedNoteId(prev => (prev === note.id ? null : prev));
          }, 1500);
        }).catch(() => {
          // Fallback to text/plain
          navigator.clipboard.writeText(plainTextToCopy).then(() => {
            setCopiedNoteId(note.id);
            showToast('Note copied to clipboard');
            setTimeout(() => {
              setCopiedNoteId(prev => (prev === note.id ? null : prev));
            }, 1500);
          });
        });
        return;
      } catch {}
    }

    navigator.clipboard.writeText(plainTextToCopy).then(() => {
      setCopiedNoteId(note.id);
      showToast('Note copied to clipboard');
      setTimeout(() => {
        setCopiedNoteId(prev => (prev === note.id ? null : prev));
      }, 1500);
    });
  };

  const handleDuplicateNote = (note: StudyNote, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    flushSave();
    const duplicateTitle = note.title ? `${note.title} (Copy)` : 'Untitled Note (Copy)';
    const newNote: StudyNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: duplicateTitle,
      content: note.content,
      workspaceId: note.workspaceId,
      color: note.color,
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    lastLoadedNoteIdRef.current = null;
    lastHtmlRef.current = '';
    setNotes(prev => {
      const nextNotes = [newNote, ...prev];
      try {
        localStorage.setItem('studyflow_notes', JSON.stringify(nextNotes));
      } catch (err) {
        console.error('Failed to save duplicated note', err);
      }
      return nextNotes;
    });
    setActiveNoteId(newNote.id);
    setActiveNoteMenuId(null);
    setNoteEditorMode('preview');
    showToast('Note duplicated');
  };

  const executeList = (type: 'ul' | 'ol') => {
    if (!editorContentRef.current) return;
    if (activeFormats.quote || activeFormats.checklist) return;
    editorContentRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const anchorNode = selection.anchorNode;
    const currentEl = anchorNode?.nodeType === Node.ELEMENT_NODE ? (anchorNode as HTMLElement) : anchorNode?.parentElement;
    const currentLi = currentEl?.closest('li');
    const currentList = currentEl?.closest('ul, ol');

    if (currentLi && currentList) {
      const isCurrentUl = currentList.tagName.toLowerCase() === 'ul';
      const isCurrentOl = currentList.tagName.toLowerCase() === 'ol';

      if ((type === 'ul' && isCurrentUl) || (type === 'ol' && isCurrentOl)) {
        // Toggle OFF list -> convert to normal paragraph or outdent if nested
        const parentLi = currentList.parentElement?.closest('li');
        if (parentLi) {
          document.execCommand('outdent');
        } else {
          document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
        }
      } else {
        // Different list type (e.g. from Numbered List clicking Bullet List):
        // Always nest cleanly under the list structure!
        const prevLi = currentLi.previousElementSibling as HTMLElement | null;
        const isH1 = currentLi.classList.contains('text-2xl');
        const isH2 = currentLi.classList.contains('text-xl');
        const isH3 = currentLi.classList.contains('text-lg');

        const subList = document.createElement(type);
        subList.className = `${type === 'ul' ? 'list-disc' : 'list-decimal'} list-inside ml-5 my-1`;
        const subLi = document.createElement('li');
        subLi.innerHTML = '<br>';

        if (isH1) {
          subLi.className = 'text-2xl font-bold font-serif';
        } else if (isH2) {
          subLi.className = 'text-xl font-bold font-serif';
        } else if (isH3) {
          subLi.className = 'text-lg font-semibold font-serif';
        }

        subList.appendChild(subLi);

        const hasText = currentLi.textContent?.trim() !== '';

        if (hasText && selection.isCollapsed) {
          // If currentLi has text (e.g. "3rd item"), clicking Bullet creates a NEW empty sub-list UNDER it!
          // Do NOT duplicate the 3rd item's text into the sub-list!
          currentLi.appendChild(subList);
        } else if (!hasText && prevLi) {
          // Empty item: Nest as a new empty sub-list under the previous item (e.g. Under item 2)!
          prevLi.appendChild(subList);
          currentLi.remove();
        } else {
          // First item or other:
          currentLi.appendChild(subList);
        }

        const range = document.createRange();
        range.setStart(subLi, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // Normal line: Start fresh list
      document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
    }

    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeFormatting = (cmd: string, val: string | undefined = undefined) => {
    if (!editorContentRef.current) return;
    if (cmd === 'bold' && activeFormats.quote) return; // Disallow bold in quotes
    editorContentRef.current.focus();
    document.execCommand(cmd, false, val);
    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeHighlight = () => {
    if (!editorContentRef.current) return;
    editorContentRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const parentMark = range.commonAncestorContainer.parentElement?.closest('mark');

    if (parentMark) {
      const text = parentMark.textContent || '';
      const textNode = document.createTextNode(text);
      parentMark.parentNode?.replaceChild(textNode, parentMark);
    } else if (!range.collapsed) {
      const mark = document.createElement('mark');
      mark.className = 'bg-amber-100 text-amber-950 px-1 py-0.5 rounded';
      try {
        range.surroundContents(mark);
      } catch {
        document.execCommand('hiliteColor', false, '#fef08a');
      }
    } else {
      document.execCommand('hiliteColor', false, '#fef08a');
    }
    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeTextColor = (color: string) => {
    if (!editorContentRef.current) return;
    editorContentRef.current.focus();
    setActiveTextColor(color);
    setIsTextColorPickerOpen(false);

    // Restore user text selection range if saved
    const selection = window.getSelection();
    if (savedSelectionRangeRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRangeRef.current);
    }

    if (!selection || selection.rangeCount === 0) return;

    if (color === 'default' || color === '#0F172A') {
      document.execCommand('foreColor', false, '#0F172A');
    } else {
      document.execCommand('foreColor', false, color);
    }

    savedSelectionRangeRef.current = null;
    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeInlineCode = () => {
    if (!editorContentRef.current) return;
    editorContentRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const parentCode = range.commonAncestorContainer.parentElement?.closest('code');

    if (parentCode) {
      // Toggle OFF inline code: Unwrap <code> tag
      const text = parentCode.textContent || '';
      const textNode = document.createTextNode(text);
      parentCode.parentNode?.replaceChild(textNode, parentCode);
    } else if (!range.collapsed) {
      // Wrap selection in <code> tag
      const codeEl = document.createElement('code');
      codeEl.className = 'px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70';
      try {
        range.surroundContents(codeEl);
      } catch {
        const selectedHtml = range.extractContents();
        codeEl.appendChild(selectedHtml);
        range.insertNode(codeEl);
      }
    } else {
      // Collapsed: Insert sample code snippet or backticks placeholder
      const codeHtml = `<code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70">code</code>&nbsp;`;
      document.execCommand('insertHTML', false, codeHtml);
    }
    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeHeading = (level: 'h1' | 'h2' | 'h3') => {
    if (!editorContentRef.current) return;
    if (activeFormats.quote || activeFormats.checklist) return; // Disallow heading inside quotes/checklists
    editorContentRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const anchorNode = selection.anchorNode;
    const currentEl = anchorNode?.nodeType === Node.ELEMENT_NODE ? (anchorNode as HTMLElement) : anchorNode?.parentElement;
    const currentLi = currentEl?.closest('li');

    if (currentLi) {
      // Inside a list item: Toggle typography classes directly on the <li> or selected text!
      // This gives the exact H1/H2/H3 font size, weight, and look WITHOUT breaking the <ol>/<ul> list structure!
      const h1Classes = ['text-2xl', 'font-bold', 'font-serif'];
      const h2Classes = ['text-xl', 'font-bold', 'font-serif'];
      const h3Classes = ['text-lg', 'font-semibold', 'font-serif'];
      const allHeadingClasses = [...h1Classes, ...h2Classes, ...h3Classes];

      if (level === 'h1') {
        const hasH1 = currentLi.classList.contains('text-2xl');
        currentLi.classList.remove(...allHeadingClasses);
        if (!hasH1) {
          currentLi.classList.add(...h1Classes);
        }
      } else if (level === 'h2') {
        const hasH2 = currentLi.classList.contains('text-xl');
        currentLi.classList.remove(...allHeadingClasses);
        if (!hasH2) {
          currentLi.classList.add(...h2Classes);
        }
      } else if (level === 'h3') {
        const hasH3 = currentLi.classList.contains('text-lg');
        currentLi.classList.remove(...allHeadingClasses);
        if (!hasH3) {
          currentLi.classList.add(...h3Classes);
        }
      }
    } else {
      // Normal paragraph outside lists: Standard formatBlock H1/H2/H3
      const isCurrent = activeFormats[level];
      const tag = isCurrent ? '<p>' : `<${level}>`;
      document.execCommand('formatBlock', false, tag);
    }

    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeBlockquote = () => {
    if (!editorContentRef.current) return;
    if (activeFormats.checklist) return; // Disallow quote inside checklist
    editorContentRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const anchorNode = selection.anchorNode;
    const currentEl = anchorNode?.nodeType === Node.ELEMENT_NODE ? (anchorNode as HTMLElement) : anchorNode?.parentElement;
    const bq = currentEl?.closest('blockquote');

    if (bq || activeFormats.quote) {
      const targetBq = bq || editorContentRef.current.querySelector('blockquote');
      if (targetBq) {
        // If cursor is at the end or block is empty, cleanly exit by adding a <p> after it
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        targetBq.after(p);
        
        // If blockquote was completely empty, remove the empty blockquote
        if (targetBq.textContent?.trim() === '') {
          targetBq.remove();
        }

        const range = document.createRange();
        range.setStart(p, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        document.execCommand('formatBlock', false, '<p>');
      }
    } else {
      // Turn ON blockquote
      document.execCommand('formatBlock', false, '<blockquote>');
    }
    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeChecklist = () => {
    if (!editorContentRef.current) return;
    if (activeFormats.quote) return;
    editorContentRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    if (selection.isCollapsed) {
      // Single checklist item insertion
      const chkHtml = `<div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="false"><span class="chk-box mt-1 w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-xs shrink-0"></span><span class="chk-text flex-1 select-text text-slate-800">Task item</span></div><p><br></p>`;
      document.execCommand('insertHTML', false, chkHtml);
    } else {
      // Multi-line selection: convert each selected line into a checklist item!
      const selectedText = selection.toString();
      const lines = selectedText.split('\n').filter(l => l.trim().length > 0);
      if (lines.length > 0) {
        const checklistItemsHtml = lines.map(line =>
          `<div class="checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none" data-checked="false"><span class="chk-box mt-1 w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-xs shrink-0"></span><span class="chk-text flex-1 select-text text-slate-800">${line.trim()}</span></div>`
        ).join('');
        document.execCommand('insertHTML', false, checklistItemsHtml);
      }
    }

    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeInsertLink = () => {
    if (!editorContentRef.current) return;
    editorContentRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const node = selection.anchorNode;
    const parent = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
    const existingLink = parent?.closest('a');

    if (existingLink) {
      const nextUrl = window.prompt('Edit or clear link URL (leave empty to remove link):', existingLink.getAttribute('href') || '');
      if (nextUrl === null) return;
      if (nextUrl.trim() === '') {
        document.execCommand('unlink', false);
      } else {
        const formatted = nextUrl.startsWith('http://') || nextUrl.startsWith('https://') || nextUrl.startsWith('mailto:') ? nextUrl : `https://${nextUrl}`;
        existingLink.setAttribute('href', formatted);
      }
    } else {
      const url = window.prompt('Enter link URL (e.g. https://example.com):', 'https://');
      if (!url || url.trim() === '' || url === 'https://') return;
      const formatted = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') ? url : `https://${url}`;

      if (selection.isCollapsed) {
        const linkHtml = `<a href="${formatted}" target="_blank" rel="noopener noreferrer" class="text-[#2563EB] underline underline-offset-2 hover:text-blue-800 font-medium">${formatted}</a>&nbsp;`;
        document.execCommand('insertHTML', false, linkHtml);
      } else {
        document.execCommand('createLink', false, formatted);
        const newLink = selection.anchorNode?.parentElement?.closest('a');
        if (newLink) {
          newLink.setAttribute('target', '_blank');
          newLink.setAttribute('rel', 'noopener noreferrer');
          newLink.className = 'text-[#2563EB] underline underline-offset-2 hover:text-blue-800 font-medium';
        }
      }
    }
    updateToolbarState();
    scheduleDebouncedSave();
  };

  const executeDivider = () => {
    if (!editorContentRef.current) return;
    editorContentRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const node = selection.anchorNode;
    const parent = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
    const blockEl = parent?.closest('p, h1, h2, h3, blockquote, div.checklist-item, ul, ol') || parent;

    const hr = document.createElement('hr');
    hr.className = 'my-4 border-slate-200';
    const p = document.createElement('p');
    p.innerHTML = '<br>';

    if (blockEl && blockEl !== editorContentRef.current && blockEl.parentNode) {
      blockEl.parentNode.insertBefore(hr, blockEl.nextSibling);
      hr.after(p);
    } else {
      document.execCommand('insertHorizontalRule');
      return;
    }

    const range = document.createRange();
    range.setStart(p, 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    updateToolbarState();
    scheduleDebouncedSave();
  };

  const handleEditorPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const pastedHtml = clipboardData.getData('text/html');
    const pastedText = clipboardData.getData('text/plain');

    if (pastedHtml) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pastedHtml;

      const unwanted = tempDiv.querySelectorAll('script, style, iframe, object, embed, meta, link');
      unwanted.forEach(el => el.remove());

      const allElements = tempDiv.querySelectorAll('*');
      allElements.forEach(el => {
        if (!el.classList.contains('checklist-item') && !el.classList.contains('chk-box') && !el.classList.contains('chk-text')) {
          el.removeAttribute('style');
          el.removeAttribute('id');
          el.removeAttribute('color');
          el.removeAttribute('face');
          el.removeAttribute('size');
        }
      });

      const cleanHtml = tempDiv.innerHTML.trim();
      if (cleanHtml) {
        document.execCommand('insertHTML', false, cleanHtml);
      } else {
        document.execCommand('insertText', false, pastedText);
      }
    } else if (pastedText) {
      // If pure markdown text was pasted, convert to formatted HTML
      const isLikelyMarkdown = /^(\s*)(#+\s+|[-*]\s+|\d+\.\s+|>\s*|---\s*|`{3}|-\s\[[ xX]\])/m.test(pastedText) || /\*\*(.*?)\*\*|`(.*?)`|==(.*?ches|.*?)==|~~(.*?)~~/.test(pastedText);

      if (isLikelyMarkdown) {
        const converted = convertMarkdownToHtml(pastedText);
        document.execCommand('insertHTML', false, converted);
      } else {
        const lines = pastedText.split('\n');
        if (lines.length > 1) {
          const html = lines.map(line => line.trim() ? `<p>${line}</p>` : '<p><br></p>').join('');
          document.execCommand('insertHTML', false, html);
        } else {
          document.execCommand('insertText', false, pastedText);
        }
      }
    }

    updateToolbarState();
    scheduleDebouncedSave();
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Isolated shortcuts: Stop propagation so no external global app shortcuts trigger
    e.stopPropagation();

    if (e.metaKey || e.ctrlKey) {
      const keyLower = e.key.toLowerCase();
      if (keyLower === 'b') {
        e.preventDefault();
        if (!activeFormats.quote) {
          executeFormatting('bold');
        }
      } else if (keyLower === 'i') {
        e.preventDefault();
        executeFormatting('italic');
      } else if (keyLower === 'u') {
        e.preventDefault();
        executeFormatting('underline');
      } else if (keyLower === 'q') {
        e.preventDefault();
        executeBlockquote();
      } else if (keyLower === 'k') {
        e.preventDefault();
        executeInsertLink();
      } else if (keyLower === 'z') {
        // Native undo
        return;
      } else if (keyLower === 'y') {
        // Native redo
        return;
      } else if (keyLower === 'e' || e.key === '`') {
        e.preventDefault();
        executeInlineCode();
      } else if (e.shiftKey && keyLower === 'x') {
        e.preventDefault();
        executeFormatting('strikeThrough');
      } else if (e.shiftKey && keyLower === 'h') {
        e.preventDefault();
        executeHighlight();
      }
    } else if (e.altKey) {
      const keyLower = e.key.toLowerCase();
      if (keyLower === 'n') {
        e.preventDefault();
        executeList('ol');
      } else if (keyLower === 'b') {
        e.preventDefault();
        executeList('ul');
      } else if (e.key === '1') {
        e.preventDefault();
        executeHeading('h1');
      } else if (e.key === '2') {
        e.preventDefault();
        executeHeading('h2');
      } else if (e.key === '3') {
        e.preventDefault();
        executeHeading('h3');
      }
    } else if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && selection.isCollapsed) {
        const anchorNode = selection.anchorNode;
        const currentEl = anchorNode?.nodeType === Node.ELEMENT_NODE ? (anchorNode as HTMLElement) : anchorNode?.parentElement;

        // Empty Checklist item Backspace
        const chkItem = currentEl?.closest('.checklist-item');
        if (chkItem) {
          const chkText = chkItem.querySelector('.chk-text');
          const text = chkText?.textContent?.trim() || '';
          if (text === '' || text === 'Task item' || selection.anchorOffset === 0) {
            e.preventDefault();
            const p = document.createElement('p');
            p.innerHTML = text && text !== 'Task item' ? text : '<br>';
            chkItem.parentNode?.replaceChild(p, chkItem);
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            scheduleDebouncedSave();
            updateToolbarState();
            return;
          }
        }

        // Empty Heading Backspace
        const heading = currentEl?.closest('h1, h2, h3');
        if (heading && (heading.textContent?.trim() === '' || selection.anchorOffset === 0)) {
          e.preventDefault();
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          heading.parentNode?.replaceChild(p, heading);
          const range = document.createRange();
          range.setStart(p, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          scheduleDebouncedSave();
          updateToolbarState();
          return;
        }

        // Empty Blockquote Backspace
        const bq = currentEl?.closest('blockquote');
        if (bq && (bq.textContent?.trim() === '' || selection.anchorOffset === 0)) {
          e.preventDefault();
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          bq.parentNode?.replaceChild(p, bq);
          const range = document.createRange();
          range.setStart(p, 0);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          scheduleDebouncedSave();
          updateToolbarState();
          return;
        }

        // Empty List Item (ul / ol) Backspace
        const liItem = currentEl?.closest('li');
        if (liItem && (liItem.textContent?.trim() === '' || selection.anchorOffset === 0)) {
          const listParent = liItem.closest('ul, ol');
          const parentLi = listParent?.parentElement?.closest('li');

          if (parentLi && listParent) {
            e.preventDefault();
            liItem.remove();
            if (listParent.children.length === 0) {
              listParent.remove();
            }

            const newParentLi = document.createElement('li');
            newParentLi.innerHTML = '<br>';
            parentLi.after(newParentLi);

            const range = document.createRange();
            range.setStart(newParentLi, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            scheduleDebouncedSave();
            updateToolbarState();
            return;
          } else if (listParent) {
            e.preventDefault();
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            if (listParent.children.length <= 1) {
              listParent.parentNode?.replaceChild(p, listParent);
            } else {
              liItem.remove();
              listParent.after(p);
            }
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            scheduleDebouncedSave();
            updateToolbarState();
            return;
          }
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const selection = window.getSelection();
      const anchorNode = selection?.anchorNode;
      const currentEl = anchorNode?.nodeType === Node.ELEMENT_NODE ? (anchorNode as HTMLElement) : anchorNode?.parentElement;

      const chkItem = currentEl?.closest('.checklist-item') as HTMLElement | null;
      if (chkItem) {
        // Toggle checklist nesting
        if (e.shiftKey) {
          chkItem.classList.remove('ml-6');
        } else {
          chkItem.classList.add('ml-6');
        }
        scheduleDebouncedSave();
        return;
      }

      const liItem = currentEl?.closest('li');
      if (liItem) {
        if (e.shiftKey) {
          document.execCommand('outdent');
        } else {
          document.execCommand('indent');
        }
        scheduleDebouncedSave();
        return;
      }

      // Normal tab
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      scheduleDebouncedSave();
    } else if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const anchorNode = selection.anchorNode;
        const currentElement = anchorNode?.nodeType === Node.ELEMENT_NODE ? (anchorNode as HTMLElement) : anchorNode?.parentElement;
        const checklistItem = currentElement?.closest('.checklist-item');
        const headingElement = currentElement?.closest('h1, h2, h3');
        const bqElement = currentElement?.closest('blockquote');
        const liElement = currentElement?.closest('li');

        // Empty List Item Enter: If nested inside a parent list, break out to parent list's next item!
        if (liElement && selection.isCollapsed) {
          const textContent = liElement.textContent?.trim() || '';
          if (textContent === '') {
            e.preventDefault();
            const listParent = liElement.closest('ul, ol');
            const parentLi = listParent?.parentElement?.closest('li');

            if (parentLi && listParent) {
              // Nested sub-list breakout: Remove empty sub-li and insert next item in the parent list!
              liElement.remove();
              if (listParent.children.length === 0) {
                listParent.remove();
              }

              const newParentLi = document.createElement('li');
              newParentLi.innerHTML = '<br>';
              parentLi.after(newParentLi);

              const range = document.createRange();
              range.setStart(newParentLi, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            } else if (listParent) {
              // Top-level list breakout: Breakout to normal paragraph
              const p = document.createElement('p');
              p.innerHTML = '<br>';
              if (listParent.children.length <= 1) {
                listParent.parentNode?.replaceChild(p, listParent);
              } else {
                liElement.remove();
                listParent.after(p);
              }
              const range = document.createRange();
              range.setStart(p, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              const p = document.createElement('p');
              p.innerHTML = '<br>';
              liElement.parentNode?.replaceChild(p, liElement);
              const range = document.createRange();
              range.setStart(p, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }

            scheduleDebouncedSave();
            updateToolbarState();
            return;
          } else {
            // Non-empty list item: Pressing Enter creates next list item, and inherits H1/H2/H3 if current item had it!
            const isH1 = liElement.classList.contains('text-2xl');
            const isH2 = liElement.classList.contains('text-xl');
            const isH3 = liElement.classList.contains('text-lg');

            if (isH1 || isH2 || isH3) {
              e.preventDefault();
              const newLi = document.createElement('li');
              newLi.className = isH1
                ? 'text-2xl font-bold font-serif'
                : isH2
                ? 'text-xl font-bold font-serif'
                : 'text-lg font-semibold font-serif';
              newLi.innerHTML = '<br>';
              liElement.after(newLi);

              const range = document.createRange();
              range.setStart(newLi, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);

              scheduleDebouncedSave();
              updateToolbarState();
              return;
            }
          }
        }

        if (checklistItem) {
          e.preventDefault();
          const chkText = checklistItem.querySelector('.chk-text');
          const textContent = chkText?.textContent?.trim() || '';

          if (textContent === '' || textContent === 'Task item') {
            // Empty checklist item: Escape to normal paragraph
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            checklistItem.parentNode?.replaceChild(p, checklistItem);
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            // Non-empty: Insert next checklist item
            const newChk = document.createElement('div');
            newChk.className = 'checklist-item flex items-start gap-2 py-1 my-0.5 cursor-pointer select-none';
            newChk.setAttribute('data-checked', 'false');
            newChk.innerHTML = '<span class="chk-box mt-1 w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-xs shrink-0"></span><span class="chk-text flex-1 select-text text-slate-800"><br></span>';
            checklistItem.after(newChk);

            const targetText = newChk.querySelector('.chk-text');
            if (targetText) {
              const range = document.createRange();
              range.setStart(targetText, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
          scheduleDebouncedSave();
          updateToolbarState();
        } else if (headingElement && selection.isCollapsed) {
          // If at the end of a heading, hitting enter creates a normal <p> paragraph
          const textLen = headingElement.textContent?.length || 0;
          if (selection.anchorOffset >= textLen) {
            e.preventDefault();
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            headingElement.after(p);
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            scheduleDebouncedSave();
            updateToolbarState();
          }
        } else if (bqElement && selection.isCollapsed) {
          // If in an empty blockquote, pressing Enter escapes out to a normal paragraph!
          if (bqElement.textContent?.trim() === '') {
            e.preventDefault();
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            bqElement.parentNode?.replaceChild(p, bqElement);
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            scheduleDebouncedSave();
            updateToolbarState();
          }
        }
      }
    }
  };

  const handleEditorInput = () => {
    scheduleDebouncedSave();
    updateToolbarState();

    if (!isMarkdownAutoFormatEnabled) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return;

    const anchorNode = selection.anchorNode;
    if (anchorNode?.nodeType !== Node.TEXT_NODE) return;

    const text = anchorNode.textContent || '';
    const offset = selection.anchorOffset;
    const textBeforeCursor = text.substring(0, offset);

    // 1. Bold auto-format: **text**
    const boldMatch = textBeforeCursor.match(/(^|[^*])\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      const fullMatch = boldMatch[0].startsWith('*') ? boldMatch[0] : boldMatch[0].substring(1);
      const innerText = boldMatch[2];
      const matchStart = offset - fullMatch.length;

      const range = document.createRange();
      range.setStart(anchorNode, matchStart);
      range.setEnd(anchorNode, offset);
      range.deleteContents();

      const b = document.createElement('b');
      b.className = 'font-bold';
      b.textContent = innerText;
      range.insertNode(b);

      const space = document.createTextNode('\u00A0');
      b.after(space);

      const nextRange = document.createRange();
      nextRange.setStart(space, 1);
      nextRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(nextRange);

      updateToolbarState();
      scheduleDebouncedSave();
      return;
    }

    // 2. Inline Code auto-format: `code`
    const codeMatch = textBeforeCursor.match(/(^|[^`])`([^`]+)`$/);
    if (codeMatch) {
      const fullMatch = codeMatch[0].startsWith('`') ? codeMatch[0] : codeMatch[0].substring(1);
      const innerText = codeMatch[2];
      const matchStart = offset - fullMatch.length;

      const range = document.createRange();
      range.setStart(anchorNode, matchStart);
      range.setEnd(anchorNode, offset);
      range.deleteContents();

      const codeEl = document.createElement('code');
      codeEl.className = 'px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200/70';
      codeEl.textContent = innerText;
      range.insertNode(codeEl);

      const space = document.createTextNode('\u00A0');
      codeEl.after(space);

      const nextRange = document.createRange();
      nextRange.setStart(space, 1);
      nextRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(nextRange);

      updateToolbarState();
      scheduleDebouncedSave();
      return;
    }

    // 3. Highlighter auto-format: ==text==
    const markMatch = textBeforeCursor.match(/(^|[^=])==([^=]+)==$/);
    if (markMatch) {
      const fullMatch = markMatch[0].startsWith('=') ? markMatch[0] : markMatch[0].substring(1);
      const innerText = markMatch[2];
      const matchStart = offset - fullMatch.length;

      const range = document.createRange();
      range.setStart(anchorNode, matchStart);
      range.setEnd(anchorNode, offset);
      range.deleteContents();

      const mark = document.createElement('mark');
      mark.className = 'bg-amber-100 text-amber-950 px-1 py-0.5 rounded';
      mark.textContent = innerText;
      range.insertNode(mark);

      const space = document.createTextNode('\u00A0');
      mark.after(space);

      const nextRange = document.createRange();
      nextRange.setStart(space, 1);
      nextRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(nextRange);

      updateToolbarState();
      scheduleDebouncedSave();
      return;
    }

    // 4. Strikethrough auto-format: ~~text~~
    const strikeMatch = textBeforeCursor.match(/(^|[^~])~~([^~]+)~~$/);
    if (strikeMatch) {
      const fullMatch = strikeMatch[0].startsWith('~') ? strikeMatch[0] : strikeMatch[0].substring(1);
      const innerText = strikeMatch[2];
      const matchStart = offset - fullMatch.length;

      const range = document.createRange();
      range.setStart(anchorNode, matchStart);
      range.setEnd(anchorNode, offset);
      range.deleteContents();

      const del = document.createElement('del');
      del.className = 'text-slate-400';
      del.textContent = innerText;
      range.insertNode(del);

      const space = document.createTextNode('\u00A0');
      del.after(space);

      const nextRange = document.createRange();
      nextRange.setStart(space, 1);
      nextRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(nextRange);

      updateToolbarState();
      scheduleDebouncedSave();
      return;
    }

    // 5. Italic auto-format: *text*
    const italicMatch = textBeforeCursor.match(/(^|[^*])\*([^*]+)\*$/);
    if (italicMatch && !textBeforeCursor.endsWith('**')) {
      const fullMatch = italicMatch[0].startsWith('*') ? italicMatch[0] : italicMatch[0].substring(1);
      const innerText = italicMatch[2];
      const matchStart = offset - fullMatch.length;

      const range = document.createRange();
      range.setStart(anchorNode, matchStart);
      range.setEnd(anchorNode, offset);
      range.deleteContents();

      const iEl = document.createElement('i');
      iEl.className = 'italic';
      iEl.textContent = innerText;
      range.insertNode(iEl);

      const space = document.createTextNode('\u00A0');
      iEl.after(space);

      const nextRange = document.createRange();
      nextRange.setStart(space, 1);
      nextRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(nextRange);

      updateToolbarState();
      scheduleDebouncedSave();
      return;
    }

    // 6. Block-level triggers on Space (Matching Antigravity / Notion Markdown):
    const currentBlock = anchorNode.parentElement?.closest('p, div, li, h1, h2, h3, blockquote');
    const fullLineText = currentBlock ? (currentBlock.textContent || '') : text;

    // Trigger on space at the start of a block
    if (textBeforeCursor.endsWith(' ') || textBeforeCursor.endsWith('\u00A0')) {
      const trimmedStart = textBeforeCursor.trim();

      // Heading 1: # + Space
      if (trimmedStart === '#') {
        anchorNode.textContent = '';
        executeHeading('h1');
        return;
      }

      // Heading 2: ## + Space
      if (trimmedStart === '##') {
        anchorNode.textContent = '';
        executeHeading('h2');
        return;
      }

      // Heading 3: ### + Space
      if (trimmedStart === '###') {
        anchorNode.textContent = '';
        executeHeading('h3');
        return;
      }

      // Bullet List: - + Space or * + Space
      if (trimmedStart === '-' || trimmedStart === '*') {
        anchorNode.textContent = '';
        executeList('ul');
        return;
      }

      // Numbered List: 1. + Space
      if (trimmedStart === '1.') {
        anchorNode.textContent = '';
        executeList('ol');
        return;
      }

      // Blockquote: > + Space
      if (trimmedStart === '>') {
        anchorNode.textContent = '';
        executeBlockquote();
        return;
      }

      // Checklist: [] + Space or [ ] + Space
      if (trimmedStart === '[]' || trimmedStart === '[ ]' || trimmedStart === '-[]' || trimmedStart === '-[ ]') {
        anchorNode.textContent = '';
        executeChecklist();
        return;
      }

      // Divider Line: --- or *** or ___
      if (trimmedStart === '---' || trimmedStart === '***' || trimmedStart === '___') {
        anchorNode.textContent = '';
        executeDivider();
        return;
      }
    }
  };

  const filteredNotes = useMemo(() => {
    const query = noteSearchQuery.toLowerCase().trim();
    return notes
      .filter(n => {
        const matchesWorkspace = noteWorkspaceFilter === 'all' || (noteWorkspaceFilter === 'unassigned' ? !n.workspaceId : n.workspaceId === noteWorkspaceFilter);
        if (!matchesWorkspace) return false;
        if (!query) return true;
        const titleMatch = n.title.toLowerCase().includes(query);
        const contentPlain = stripHtml(n.content || '').toLowerCase();
        const contentMatch = contentPlain.includes(query);
        return titleMatch || contentMatch;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (noteSortBy === 'created') {
          return b.createdAt - a.createdAt;
        }
        if (noteSortBy === 'updated') {
          return b.updatedAt - a.updatedAt;
        }
        if (noteSortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return b.createdAt - a.createdAt;
      });
  }, [notes, noteWorkspaceFilter, noteSearchQuery, noteSortBy]);

  return (
    <motion.div
      key="global-notes-studio-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col h-full bg-[#F8FAFC] dark:bg-[#0B0F19] overflow-hidden select-none"
    >
      {/* Top Header Bar (Mobile only: hamburger & compact title) */}
      <div className={`md:hidden shrink-0 h-[56px] bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 items-center justify-between z-10 select-none ${
        isMobileNoteEditing ? 'hidden' : 'flex'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => {
              if (onToggleSidebar) {
                onToggleSidebar();
              }
            }}
            className="w-[32px] h-[32px] rounded-lg border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-center shadow-3xs transition-all cursor-pointer select-none shrink-0"
            title="Open sidebar"
          >
            <Menu className="w-4 h-4 text-slate-700 dark:text-slate-200 stroke-[2.3]" />
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
            <h1 className="font-serif font-bold text-[15.5px] text-slate-900 dark:text-slate-100 tracking-tight truncate leading-none">
              Study Notes
            </h1>
          </div>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* LEFT: Notes List Column */}
        <motion.div
          key={`notes-list-col-${isMobileNoteEditing ? 'hidden' : 'visible'}`}
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`w-full md:w-[420px] shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col min-h-0 relative ${
            isMobileNoteEditing ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Collapsible Hero Header Layer (Icon, Title, Notes Count Badge above search bar) */}
          <motion.div
            initial={false}
            animate={{
              height: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 132 : (isHeroOpen ? 132 : pullDistance > 0 ? pullDistance : 0),
              opacity: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : getHeroOpacity(),
            }}
            transition={{
              height: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              opacity: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            }}
            className="overflow-hidden bg-white dark:bg-slate-900 flex flex-col items-center text-center select-none shrink-0 md:!h-[132px] md:!opacity-100"
          >
            <motion.div
              animate={{
                y: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : (isHeroOpen ? 0 : pullDistance > 0 ? pullDistance - 132 : -132),
              }}
              transition={{
                y: pullDistance > 0 ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              }}
              className="pt-3.5 pb-1 px-4 flex flex-col items-center text-center select-none w-full md:!translate-y-0"
            >
              {/* 1. Gradient Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-[#2563EB] to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-2">
                <NotebookPen className="w-[32px] h-[32px] stroke-[2.2]" />
              </div>

              {/* 2. Study Notes Title */}
              <h1 className="font-serif font-extrabold text-[19px] text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Study Notes
              </h1>

              {/* 3. Refined Notes Count Badge (Soft Glass Blue Glow) */}
              <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-300/80 dark:border-blue-700/80 text-[11px] font-semibold text-blue-700 dark:text-blue-300 transition-colors shadow-3xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400 shrink-0" />
                <span>{notes.length} {notes.length === 1 ? 'Note' : 'Notes'}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Search Bar & Workspace Filter Chips (Pins permanently above note list) */}
          <div className="px-3.5 pt-2 pb-2.5 md:p-3.5 border-b border-slate-100 dark:border-slate-800 md:border-slate-200/80 dark:md:border-slate-800 flex flex-col gap-2.5 shrink-0 bg-white dark:bg-slate-900 z-10">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={noteSearchQuery}
                onChange={(e) => setNoteSearchQuery(e.target.value)}
                placeholder="Search in all notes..."
                className="w-full h-[38px] pl-9 pr-8 text-[13px] sm:text-[13.5px] rounded-lg bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 font-medium"
              />
              {noteSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNoteSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Workspace Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[13px]">
              <button
                type="button"
                onClick={() => setNoteWorkspaceFilter('all')}
                className={`px-3 py-1.5 rounded-[7px] font-medium whitespace-nowrap transition-all cursor-pointer leading-none flex items-center gap-1.5 ${
                  noteWorkspaceFilter === 'all'
                    ? 'bg-[#2563EB] text-white shadow-3xs font-semibold'
                    : 'bg-slate-100/90 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span>All</span>
                <span className={`inline-flex items-center justify-center min-w-[15px] h-[14px] px-1 rounded-full text-[10px] font-medium leading-none shrink-0 ${
                  noteWorkspaceFilter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/75 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {notes.length}
                </span>
              </button>
              {workspaces.map(ws => {
                const wsNoteCount = notes.filter(n => n.workspaceId === ws.id).length;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setNoteWorkspaceFilter(ws.id)}
                    className={`px-3 py-1.5 rounded-[7px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 leading-none ${
                      noteWorkspaceFilter === ws.id
                        ? 'bg-[#2563EB] text-white shadow-3xs font-semibold'
                        : 'bg-slate-100/90 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    <span>{ws.name}</span>
                    {wsNoteCount > 0 && (
                      <span className={`inline-flex items-center justify-center min-w-[15px] h-[14px] px-1 rounded-full text-[10px] font-medium leading-none shrink-0 ${
                        noteWorkspaceFilter === ws.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/75 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}>
                        {wsNoteCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Cards Scroll Container (Isolated Scroll Track) */}
          <div
            ref={notesListScrollRef}
            onTouchStart={(e) => {
              touchStartYRef.current = e.touches[0]?.clientY ?? 0;
              touchStartTimeRef.current = Date.now();
              const st = notesListScrollRef.current?.scrollTop ?? 0;
              touchStartScrollTopRef.current = st;
              isPullingDownRef.current = st <= 2;
              heroOpenAtTouchStartRef.current = isHeroOpen;
              setPullDirection(isHeroOpen ? 'up' : 'down');
            }}
            onTouchMove={(e) => {
              const currentY = e.touches[0]?.clientY ?? 0;
              const deltaY = currentY - touchStartYRef.current;
              const st = notesListScrollRef.current?.scrollTop ?? 0;

              // Only pull hero down if touch gesture STARTED when list was at top (scrollTop <= 2)
              if (!heroOpenAtTouchStartRef.current && deltaY > 0) {
                if (touchStartScrollTopRef.current <= 2 && st <= 2) {
                  setPullDirection('down');
                  const pull = Math.min(132, deltaY * 0.55);
                  setPullDistance(pull);
                }
              } else if (heroOpenAtTouchStartRef.current && deltaY < 0) {
                if (st <= 2) {
                  setPullDirection('up');
                  if (isHeroOpen) setIsHeroOpen(false);
                  const pull = Math.max(0, 132 + (deltaY * 0.55));
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
                  if (pullDistance >= 46 || isFastFlickDown) {
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
                  if (pullDistance < 86 || isFastFlickUp) {
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
              if (window.innerWidth < 768) {
                const st = e.currentTarget.scrollTop;
                if (isHeroOpen && st > 8) {
                  setPullDirection('up');
                  setIsHeroOpen(false);
                  setPullDistance(0);
                }
              }
            }}
            className={`flex-1 min-h-0 custom-scrollbar p-2.5 pb-20 space-y-1.5 bg-white dark:bg-slate-900 ${
              (!isHeroOpen && pullDistance === 0) ? 'overflow-y-auto' : 'overflow-hidden'
            } md:!overflow-y-auto`}
          >
            {filteredNotes.length === 0 ? (
              <div className="py-12 px-4 text-center text-slate-400 flex flex-col items-center justify-center">
                <NotebookPen className="w-8 h-8 text-slate-300 stroke-[1.5] mb-2" />
                <p className="font-semibold text-xs text-slate-600 mb-1">No notes found</p>
                <p className="text-[11px] text-slate-400 max-w-[200px] mb-3">
                  {noteSearchQuery ? 'Try changing your search query or workspace filter' : 'Create your first study note to organize topics'}
                </p>
                <button
                  type="button"
                  onClick={handleCreateNewNote}
                  className="px-3 py-1.5 bg-blue-50 text-[#2563EB] hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Note</span>
                </button>
              </div>
            ) : (
              filteredNotes.map((n, idx) => {
                const isSelected = activeNote?.id === n.id;
                const isMenuOpen = menuAnchor?.noteId === n.id || activeNoteMenuId === n.id;
                const linkedWs = workspaces.find(w => w.id === n.workspaceId);
                const noteTheme = n.color || 'default';
                const isNearBottom = idx >= Math.max(1, filteredNotes.length - 2);
                const displayTitle = getNoteDisplayTitle(n);

                const selectedThemeStyles: Record<string, { card: string; activeCard: string; title: string }> = {
                  default: {
                    card: 'md:bg-slate-100/90 md:dark:bg-zinc-800/80 md:border-slate-300 md:dark:border-zinc-700 md:hover:bg-slate-100 md:dark:hover:bg-zinc-800 md:border-l-[4px] md:border-l-slate-900 md:dark:border-l-white md:shadow-xs',
                    activeCard: 'md:bg-slate-100 md:dark:bg-zinc-800 md:border-slate-300 md:dark:border-zinc-600 md:border-l-[4px] md:border-l-slate-900 md:dark:border-l-white md:shadow-md',
                    title: 'md:text-slate-900 md:dark:text-white md:font-bold'
                  },
                  amber: {
                    card: 'md:bg-[#fef3c7]/85 md:dark:bg-[#f59e0b]/18 md:border-amber-300 md:dark:border-[#f59e0b]/50 md:hover:bg-[#fde68a]/75 md:dark:hover:bg-[#f59e0b]/22 md:border-l-[4px] md:border-l-amber-500 md:dark:border-l-amber-400 md:shadow-xs',
                    activeCard: 'md:bg-[#fde68a]/75 md:dark:bg-[#f59e0b]/22 md:border-amber-400 md:dark:border-[#f59e0b]/70 md:border-l-[4px] md:border-l-amber-500 md:dark:border-l-amber-400 md:shadow-md',
                    title: 'md:text-amber-950 md:dark:text-amber-300 md:font-bold'
                  },
                  blue: {
                    card: 'md:bg-[#b2d4fe]/75 md:dark:bg-blue-900/55 md:border-blue-300/80 md:dark:border-blue-700/80 md:hover:bg-[#b2d4fe]/85 md:dark:hover:bg-blue-900/65 md:border-l-[4px] md:border-l-blue-600 md:dark:border-l-blue-400 md:shadow-xs',
                    activeCard: 'md:bg-[#b2d4fe]/85 md:dark:bg-blue-900/65 md:border-blue-300/90 md:dark:border-blue-600/90 md:border-l-[4px] md:border-l-blue-600 md:dark:border-l-blue-400 md:shadow-md',
                    title: 'md:text-blue-950 md:dark:text-blue-300 md:font-bold'
                  },
                  emerald: {
                    card: 'md:bg-emerald-100/70 md:dark:bg-emerald-900/55 md:border-emerald-300/80 md:dark:border-emerald-700/80 md:hover:bg-emerald-100/80 md:dark:hover:bg-emerald-900/65 md:border-l-[4px] md:border-l-emerald-500 md:dark:border-l-emerald-400 md:shadow-xs',
                    activeCard: 'md:bg-emerald-100/80 md:dark:bg-emerald-900/65 md:border-emerald-300/90 md:dark:border-emerald-600/90 md:border-l-[4px] md:border-l-emerald-500 md:dark:border-l-emerald-400 md:shadow-md',
                    title: 'md:text-emerald-950 md:dark:text-emerald-300 md:font-bold'
                  },
                  purple: {
                    card: 'md:bg-[#efe0ff]/80 md:dark:bg-purple-900/55 md:border-purple-300/85 md:dark:border-purple-700/80 md:hover:bg-[#efe0ff]/90 md:dark:hover:bg-purple-900/65 md:border-l-[4px] md:border-l-purple-600 md:dark:border-l-purple-400 md:shadow-xs',
                    activeCard: 'md:bg-[#efe0ff]/90 md:dark:bg-purple-900/65 md:border-purple-300/95 md:dark:border-purple-600/90 md:border-l-[4px] md:border-l-purple-600 md:dark:border-l-purple-400 md:shadow-md',
                    title: 'md:text-purple-950 md:dark:text-purple-300 md:font-bold'
                  },
                  rose: {
                    card: 'md:bg-[#fec5cc]/75 md:dark:bg-rose-900/55 md:border-rose-300/80 md:dark:border-rose-700/80 md:hover:bg-[#fec5cc]/85 md:dark:hover:bg-rose-900/65 md:border-l-[4px] md:border-l-rose-500 md:dark:border-l-rose-400 md:shadow-xs',
                    activeCard: 'md:bg-[#fec5cc]/85 md:dark:bg-rose-900/65 md:border-rose-300/90 md:dark:border-rose-600/90 md:border-l-[4px] md:border-l-rose-500 md:dark:border-l-rose-400 md:shadow-md',
                    title: 'md:text-rose-950 md:dark:text-rose-300 md:font-bold'
                  },
                };

                const unselectedThemeStyles: Record<string, { base: string; activeHover: string }> = {
                  default: {
                    base: 'bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border-slate-200/40 dark:border-zinc-700/60 hover:border-slate-300 dark:hover:border-zinc-600 shadow-3xs hover:shadow-xs',
                    activeHover: 'bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600 shadow-xs'
                  },
                  amber: {
                    base: 'bg-[#fef3c7]/65 dark:bg-[#f59e0b]/12 hover:bg-[#fde68a]/75 dark:hover:bg-[#f59e0b]/22 border-[#fef3c7] dark:border-[#f59e0b]/15 hover:border-amber-300 dark:hover:border-[#f59e0b]/55 shadow-3xs hover:shadow-xs',
                    activeHover: 'bg-[#fde68a]/75 dark:bg-[#f59e0b]/22 border-amber-300 dark:border-[#f59e0b]/55 shadow-xs'
                  },
                  blue: {
                    base: 'bg-[#b2d4fe]/40 dark:bg-blue-900/45 hover:bg-[#b2d4fe]/85 dark:hover:bg-blue-900/65 border-[#b2d4fe]/50 dark:border-blue-900/50 hover:border-blue-300/85 dark:hover:border-blue-600/85 shadow-3xs hover:shadow-xs',
                    activeHover: 'bg-[#b2d4fe]/85 dark:bg-blue-900/65 border-blue-300/85 dark:border-blue-600/85 shadow-xs'
                  },
                  emerald: {
                    base: 'bg-emerald-100/45 dark:bg-emerald-900/45 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/65 border-emerald-100/60 dark:border-emerald-900/50 hover:border-emerald-300/80 dark:hover:border-emerald-600/85 shadow-3xs hover:shadow-xs',
                    activeHover: 'bg-emerald-100/80 dark:bg-emerald-900/65 border-emerald-300/80 dark:border-emerald-600/85 shadow-xs'
                  },
                  purple: {
                    base: 'bg-purple-200/50 dark:bg-purple-900/45 hover:bg-[#efe0ff]/90 dark:hover:bg-purple-900/65 border-purple-200/50 dark:border-purple-900/50 hover:border-purple-300/90 dark:hover:border-purple-600/85 shadow-3xs hover:shadow-xs',
                    activeHover: 'bg-[#efe0ff]/90 dark:bg-purple-900/65 border-purple-300/90 dark:border-purple-600/85 shadow-xs'
                  },
                  rose: {
                    base: 'bg-[#fec5cc]/50 dark:bg-rose-900/45 hover:bg-[#fec5cc]/85 dark:hover:bg-rose-900/65 border-[#fec5cc]/50 dark:border-rose-900/50 hover:border-rose-300/85 dark:hover:border-rose-600/85 shadow-3xs hover:shadow-xs',
                    activeHover: 'bg-[#fec5cc]/85 dark:bg-rose-900/65 border-rose-300/85 dark:border-rose-600/85 shadow-xs'
                  },
                };

                const unselected = unselectedThemeStyles[noteTheme] || unselectedThemeStyles.default;
                const selected = selectedThemeStyles[noteTheme] || selectedThemeStyles.default;

                return (
                  <motion.div
                    layout
                    transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                    key={n.id}
                    onClick={() => {
                      flushSave();
                      setActiveNoteId(n.id);
                      setIsMobileNoteEditing(true);
                      setNoteEditorMode('preview');
                    }}
                    className={`group relative p-[9px] sm:p-[11px] rounded-[9px] flex flex-col gap-[3px] transition-all duration-150 ease-out cursor-pointer select-none border shadow-3xs ${
                      isMenuOpen ? 'z-30' : 'z-0'
                    } ${unselected.base} ${
                      isSelected
                        ? (isMenuOpen ? selected.activeCard : selected.card)
                        : (isMenuOpen ? unselected.activeHover : '')
                    }`}
                  >
                    {/* Card Top Header: Title with Pin (Full-width on desktop when idle, truncates smoothly on hover or menu open) */}
                    <div className={`flex items-center justify-between gap-1.5 min-w-0 w-full min-h-[22px] overflow-hidden transition-[padding] duration-150 ${
                      isMenuOpen ? 'pr-12 md:pr-12' : 'pr-12 md:pr-0 md:group-hover:pr-12'
                    }`}>
                      <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                        <span className={`font-serif text-[16px] truncate leading-tight font-semibold text-slate-850 dark:text-slate-100 ${
                          isSelected ? (selected.title || '') : ''
                        }`}>
                          {displayTitle}
                        </span>
                      </div>
                      {n.isPinned && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 shrink-0" title="Pinned note">
                          <Pin className="w-3 h-3 text-rose-500 fill-rose-500" />
                        </span>
                      )}
                    </div>

                    {/* Quick Action Overlay (Exact vertical alignment with title height, always visible when menu is open) */}
                    <div
                      onClick={e => e.stopPropagation()}
                      className={`absolute top-[9px] sm:top-[11px] right-[9px] sm:right-[11px] h-[22px] bg-transparent border-none flex items-center gap-1 z-20 focus-within:opacity-100 transition-opacity duration-150 ${
                        isMenuOpen ? 'opacity-100 md:opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
                      }`}
                    >
                      {/* Quick Copy Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopyNote(n, e)}
                        className={`p-[1px] flex items-center justify-center rounded-[3px] bg-transparent transition-all cursor-pointer ${
                          copiedNoteId === n.id
                            ? 'text-emerald-600 scale-110'
                            : 'text-slate-400 hover:text-slate-850 dark:hover:text-white'
                        }`}
                        title={copiedNoteId === n.id ? "Copied!" : "Quick copy note"}
                      >
                        {copiedNoteId === n.id ? (
                          <Check className="w-[15px] h-[15px] text-emerald-600 stroke-[3]" />
                        ) : (
                          <Copy className="w-[15px] h-[15px]" />
                        )}
                      </button>

                      {/* 3-Dot More Menu Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (menuAnchor?.noteId === n.id) {
                            setMenuAnchor(null);
                            setActiveNoteMenuId(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const openUpward = spaceBelow < 210; // menu height is ~190px
                            const right = window.innerWidth - rect.right;

                            setMenuAnchor({
                              noteId: n.id,
                              top: openUpward ? undefined : rect.bottom + 6,
                              bottom: openUpward ? window.innerHeight - rect.top + 6 : undefined,
                              right,
                              openUpward
                            });
                            setActiveNoteMenuId(n.id);
                          }
                        }}
                        className={`p-[1px] flex items-center justify-center rounded-[3px] transition-all cursor-pointer ${
                          isMenuOpen
                            ? 'text-slate-950 dark:text-white scale-105 bg-slate-200/70 dark:bg-slate-700'
                            : 'text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title="More options"
                      >
                        <MoreVertical className="w-[15px] h-[15px]" />
                      </button>
                    </div>

                    <p className="text-[13.5px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-serif">
                      {stripHtml(n.content) || 'No additional text...'}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 mt-1 font-sans">
                      <span>{formatNoteRelativeTime(n.updatedAt)}</span>
                      {linkedWs && (
                        <span className="px-2 py-0.5 rounded-[5px] bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold text-[11px] truncate max-w-[130px] border border-slate-200/50 dark:border-slate-700">
                          {linkedWs.name}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
            </div>

          {/* Floating Rounded + Button (Primary Color) at Bottom Right Corner */}
          <button
            type="button"
            onClick={handleCreateNewNote}
            className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#2563EB] hover:bg-blue-600 active:scale-95 text-white shadow-xl shadow-blue-500/30 ring-1 ring-white/20 flex items-center justify-center transition-all cursor-pointer z-20 group"
            title="Create new note"
            data-tooltip="Create new note"
            data-tooltip-side="left"
          >
            <Plus className="w-6 h-6 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </motion.div>

        {/* RIGHT: Editor Canvas Column */}
        <motion.div
          key={`notes-editor-col-${isMobileNoteEditing ? (activeNote?.id || 'editing') : 'idle'}`}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={`flex-1 min-h-0 bg-[#F8FAFC] dark:bg-[#0B0F19] flex flex-col overflow-hidden ${!isMobileNoteEditing ? 'hidden md:flex' : 'flex'}`}
        >
          {activeNote ? (() => {
            const activeTheme = activeNote.color || 'default';
            const editorThemeMap: Record<string, {
              container: string;
              header: string;
              formatBar: string;
              footer: string;
            }> = {
              default: {
                container: 'bg-white dark:bg-slate-900',
                header: 'bg-white/70 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-800 backdrop-blur-md',
                formatBar: 'bg-slate-50/70 dark:bg-slate-800/70 border-slate-200/40 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 backdrop-blur-sm',
                footer: 'bg-white/70 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-800 backdrop-blur-md',
              },
              amber: {
                container: 'bg-amber-50/30 dark:bg-amber-950/20',
                header: 'bg-amber-50/45 dark:bg-amber-950/40 border-amber-200/40 dark:border-amber-900/40 backdrop-blur-md',
                formatBar: 'bg-amber-100/35 dark:bg-amber-900/30 border-amber-200/30 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 backdrop-blur-sm',
                footer: 'bg-amber-50/45 dark:bg-amber-950/40 border-amber-200/40 dark:border-amber-900/40 backdrop-blur-md',
              },
              blue: {
                container: 'bg-blue-50/30 dark:bg-blue-950/20',
                header: 'bg-blue-50/45 dark:bg-blue-950/40 border-blue-200/40 dark:border-blue-900/40 backdrop-blur-md',
                formatBar: 'bg-blue-100/35 dark:bg-blue-900/30 border-blue-200/30 dark:border-blue-800/40 text-blue-900 dark:text-blue-200 backdrop-blur-sm',
                footer: 'bg-blue-50/45 dark:bg-blue-950/40 border-blue-200/40 dark:border-blue-900/40 backdrop-blur-md',
              },
              emerald: {
                container: 'bg-emerald-50/30 dark:bg-emerald-950/20',
                header: 'bg-emerald-50/45 dark:bg-emerald-950/40 border-emerald-200/40 dark:border-emerald-900/40 backdrop-blur-md',
                formatBar: 'bg-emerald-100/35 dark:bg-emerald-900/30 border-emerald-200/30 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200 backdrop-blur-sm',
                footer: 'bg-emerald-50/45 dark:bg-emerald-950/40 border-emerald-200/40 dark:border-emerald-900/40 backdrop-blur-md',
              },
              purple: {
                container: 'bg-purple-50/30 dark:bg-purple-950/20',
                header: 'bg-purple-50/45 dark:bg-purple-950/40 border-purple-200/40 dark:border-purple-900/40 backdrop-blur-md',
                formatBar: 'bg-purple-100/35 dark:bg-purple-900/30 border-purple-200/30 dark:border-purple-800/40 text-purple-900 dark:text-purple-200 backdrop-blur-sm',
                footer: 'bg-purple-50/45 dark:bg-purple-950/40 border-purple-200/40 dark:border-purple-900/40 backdrop-blur-md',
              },
              rose: {
                container: 'bg-rose-50/30 dark:bg-rose-950/20',
                header: 'bg-rose-50/45 dark:bg-rose-950/40 border-rose-200/40 dark:border-rose-900/40 backdrop-blur-md',
                formatBar: 'bg-rose-100/35 dark:bg-rose-900/30 border-rose-200/30 dark:border-rose-800/40 text-rose-900 dark:text-rose-200 backdrop-blur-sm',
                footer: 'bg-rose-50/45 dark:bg-rose-950/40 border-rose-200/40 dark:border-rose-900/40 backdrop-blur-md',
              },
            };
            const currentEditorTheme = editorThemeMap[activeTheme] || editorThemeMap.default;

            return (
              <div className={`h-full flex flex-col max-w-[880px] w-full mx-auto md:border-x md:border-slate-200/80 dark:md:border-slate-800 md:shadow-2xs select-text ${currentEditorTheme.container}`}>
                {/* Editor Top Toolbar Strip */}
                <div className={`shrink-0 h-[56px] sm:h-[60px] px-4 sm:px-6 border-b flex items-center justify-between gap-2 z-[999] relative transition-colors duration-150 ${currentEditorTheme.header}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Context-aware Back button */}
                    {noteEditorMode === 'write' ? (
                      <button
                        type="button"
                        onClick={() => setNoteEditorMode('preview')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 -ml-2 rounded-lg text-[#2563EB] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50/80 dark:hover:bg-blue-950/50 active:bg-blue-100 transition-all duration-150 cursor-pointer group select-none"
                        data-tooltip="Back to preview"
                        data-tooltip-side="bottom"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#2563EB] dark:text-blue-400 group-hover:-translate-x-0.5 transition-transform duration-150 shrink-0" strokeWidth={2.2} />
                        <span className="text-xs font-semibold">Preview</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsMobileNoteEditing(false)}
                        className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200/70 transition-all duration-150 cursor-pointer group select-none"
                        data-tooltip="Back to all notes"
                        data-tooltip-side="bottom"
                      >
                        <ChevronLeft className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-transform duration-150 group-hover:-translate-x-0.5 shrink-0" strokeWidth={2} />
                        <span className="font-semibold text-[13.5px] sm:text-[14px] text-slate-700 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white tracking-tight leading-none">Notes</span>
                      </button>
                    )}

                    {/* Workspace Selector */}
                    <select
                      value={activeNote.workspaceId || ''}
                      onChange={(e) => handleUpdateNote(activeNote.id, { workspaceId: e.target.value || undefined })}
                      className="h-[28px] text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-md px-2 font-medium text-slate-700 dark:text-slate-200 cursor-pointer outline-none focus:border-blue-400 transition-colors hidden sm:block leading-none"
                    >
                      <option value="">No Workspace</option>
                      {workspaces.map(ws => (
                        <option key={ws.id} value={ws.id}>{ws.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Center: Color Theme Palette Swatch */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center z-10 select-none">
                    <div className="h-[28px] flex items-center gap-1 px-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-3xs">
                      {(['default', 'amber', 'blue', 'emerald', 'purple', 'rose'] as const).map(c => {
                        const colorBgMap: Record<string, string> = {
                          default: 'bg-slate-300 hover:bg-slate-400',
                          amber: 'bg-amber-400 hover:bg-amber-500',
                          blue: 'bg-blue-400 hover:bg-blue-500',
                          emerald: 'bg-emerald-400 hover:bg-emerald-500',
                          purple: 'bg-purple-400 hover:bg-purple-500',
                          rose: 'bg-rose-400 hover:bg-rose-500',
                        };
                        const isSelectedColor = (activeNote.color || 'default') === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleUpdateNote(activeNote.id, { color: c })}
                            className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${colorBgMap[c]} ${
                              isSelectedColor ? 'ring-2 ring-offset-1 ring-slate-800 dark:ring-white dark:ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                            }`}
                            title={`Color: ${c}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Action Icons: Pin + Copy (Tightly paired on the right) */}
                  <div className="flex items-center gap-1 shrink-0 select-none z-10">
                    {/* Pin Button (Filled red when pinned) */}
                    <button
                      type="button"
                      onClick={() => handleTogglePinNote(activeNote.id)}
                      className={`h-[28px] w-[28px] flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                        activeNote.isPinned
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      data-tooltip={activeNote.isPinned ? "Unpin note" : "Pin note to top"}
                      data-tooltip-side="bottom"
                    >
                      <Pin className={`w-3.5 h-3.5 ${activeNote.isPinned ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Copy Button (Shows green check and feedback when copied, matching note list) */}
                    <button
                      type="button"
                      onClick={() => handleQuickCopyNote(activeNote)}
                      className={`h-[28px] w-[28px] flex items-center justify-center rounded-md transition-all cursor-pointer ${
                        copiedNoteId === activeNote.id
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-3xs scale-105'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      data-tooltip={copiedNoteId === activeNote.id ? "Copied!" : "Quick copy note"}
                      data-tooltip-side="bottom"
                    >
                      {copiedNoteId === activeNote.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Docked Formatting Toolbar in Write Mode with Live Active Highlights */}
                {noteEditorMode === 'write' && (
                  <div
                    className={`shrink-0 px-4 sm:px-8 py-1.5 border-b flex items-center gap-1 overflow-x-auto no-scrollbar select-none transition-all duration-150 ${currentEditorTheme.formatBar} ${
                      isTitleFocused ? 'opacity-35 pointer-events-none' : 'opacity-100'
                    }`}
                  >
                    {/* Undo */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        document.execCommand('undo');
                        updateToolbarState();
                        scheduleDebouncedSave();
                      }}
                      className="p-1.5 rounded hover:bg-slate-200/80 hover:text-slate-900 text-slate-600 transition-colors cursor-pointer"
                      data-tooltip="Undo (Ctrl+Z)"
                      data-tooltip-side="bottom"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Redo */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        document.execCommand('redo');
                        updateToolbarState();
                        scheduleDebouncedSave();
                      }}
                      className="p-1.5 rounded hover:bg-slate-200/80 hover:text-slate-900 text-slate-600 transition-colors cursor-pointer"
                      data-tooltip="Redo (Ctrl+Y)"
                      data-tooltip-side="bottom"
                    >
                      <Redo2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-[1px] h-3.5 bg-slate-200 mx-1" />

                    {/* Bold */}
                    <button
                      type="button"
                      disabled={activeFormats.quote}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('bold')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.quote
                          ? 'opacity-30 cursor-not-allowed text-slate-400'
                          : activeFormats.bold
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip={activeFormats.quote ? "Bold not allowed in quotes" : "Bold (Ctrl+B)"}
                      data-tooltip-side="bottom"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>

                    {/* Italic */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('italic')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.italic
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Italic (Ctrl+I)"
                      data-tooltip-side="bottom"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>

                    {/* Underline */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('underline')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.underline
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Underline (Ctrl+U)"
                      data-tooltip-side="bottom"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>

                    {/* Strikethrough */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeFormatting('strikeThrough')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.strike
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Strikethrough (Ctrl+Shift+X)"
                      data-tooltip-side="bottom"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>

                    {/* Highlighter */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={executeHighlight}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.highlight
                          ? 'bg-amber-200 text-amber-950 font-bold shadow-3xs ring-1 ring-amber-400'
                          : 'text-amber-700 hover:bg-amber-100 hover:text-amber-950'
                      }`}
                      data-tooltip="Highlighter (Ctrl+Shift+H)"
                      data-tooltip-side="bottom"
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                    </button>

                    {/* Text Color Picker Trigger */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const sel = window.getSelection();
                        if (sel && sel.rangeCount > 0) {
                          savedSelectionRangeRef.current = sel.getRangeAt(0).cloneRange();
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isTextColorPickerOpen) {
                          setIsTextColorPickerOpen(false);
                          setTextColorAnchor(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTextColorAnchor({
                            top: rect.bottom + 6,
                            left: Math.max(12, rect.left - 20),
                          });
                          setIsTextColorPickerOpen(true);
                        }
                      }}
                      className={`p-1.5 rounded transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                        isTextColorPickerOpen
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs'
                          : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-950'
                      }`}
                      data-tooltip="Text Color"
                      data-tooltip-side="bottom"
                    >
                      <div className="flex flex-col items-center justify-center leading-none select-none">
                        <span className="font-sans font-black text-[13px] leading-none tracking-tight">A</span>
                        <span
                          className="w-3.5 h-[2px] rounded-xs -mt-[1.5px] shrink-0"
                          style={{ backgroundColor: activeTextColor || '#0F172A' }}
                        />
                      </div>
                    </button>

                    <div className="w-[1px] h-3.5 bg-slate-200 mx-1" />

                    {/* Heading 1 */}
                    <button
                      type="button"
                      disabled={activeFormats.quote || activeFormats.checklist}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeHeading('h1')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.quote || activeFormats.checklist
                          ? 'opacity-30 cursor-not-allowed text-slate-400'
                          : activeFormats.h1
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip={activeFormats.quote || activeFormats.checklist ? "Headings not allowed here" : "Heading 1 (Alt+1)"}
                      data-tooltip-side="bottom"
                    >
                      <Heading1 className="w-3.5 h-3.5" />
                    </button>

                    {/* Heading 2 */}
                    <button
                      type="button"
                      disabled={activeFormats.quote || activeFormats.checklist}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeHeading('h2')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.quote || activeFormats.checklist
                          ? 'opacity-30 cursor-not-allowed text-slate-400'
                          : activeFormats.h2
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip={activeFormats.quote || activeFormats.checklist ? "Headings not allowed here" : "Heading 2 (Alt+2)"}
                      data-tooltip-side="bottom"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Heading 3 */}
                    <button
                      type="button"
                      disabled={activeFormats.quote || activeFormats.checklist}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeHeading('h3')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.quote || activeFormats.checklist
                          ? 'opacity-30 cursor-not-allowed text-slate-400'
                          : activeFormats.h3
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip={activeFormats.quote || activeFormats.checklist ? "Headings not allowed here" : "Heading 3 (Alt+3)"}
                      data-tooltip-side="bottom"
                    >
                      <Heading3 className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-[1px] h-3.5 bg-slate-200 mx-1" />

                    {/* Checklist */}
                    <button
                      type="button"
                      disabled={activeFormats.quote}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={executeChecklist}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.quote
                          ? 'opacity-30 cursor-not-allowed text-slate-400'
                          : activeFormats.checklist
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'hover:bg-slate-200/80 hover:text-slate-900 text-slate-600'
                      }`}
                      data-tooltip="Checklist Item"
                      data-tooltip-side="bottom"
                    >
                      <ListTodo className="w-3.5 h-3.5" />
                    </button>

                    {/* Bullet List */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeList('ul')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.ul
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Bullet List (Alt+B)"
                      data-tooltip-side="bottom"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>

                    {/* Numbered List */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => executeList('ol')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.ol
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Numbered List (Alt+N)"
                      data-tooltip-side="bottom"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-[1px] h-3.5 bg-slate-200 mx-1" />

                    {/* Blockquote */}
                    <button
                      type="button"
                      disabled={activeFormats.checklist}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={executeBlockquote}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.checklist
                          ? 'opacity-30 cursor-not-allowed text-slate-400'
                          : activeFormats.quote
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip={activeFormats.quote ? "Exit Quote Mode" : "Quote Block (Ctrl+Q)"}
                      data-tooltip-side="bottom"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>

                    {/* Hyperlink */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={executeInsertLink}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.link
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Insert Link (Ctrl+K)"
                      data-tooltip-side="bottom"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Inline Code */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={executeInlineCode}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        activeFormats.code
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Inline Code (Ctrl+E)"
                      data-tooltip-side="bottom"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>

                    {/* Divider */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={executeDivider}
                      className="p-1.5 rounded hover:bg-slate-200/80 hover:text-slate-900 text-slate-600 transition-colors cursor-pointer"
                      data-tooltip="Divider Line"
                      data-tooltip-side="bottom"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-[1px] h-3.5 bg-slate-200 mx-1" />

                    {/* Markdown Auto-format Toggle */}
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={toggleMarkdownAutoFormat}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        isMarkdownAutoFormatEnabled
                          ? 'bg-blue-100 text-[#2563EB] font-bold shadow-3xs ring-1 ring-blue-300'
                          : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                      data-tooltip="Markdown auto formatting"
                      data-tooltip-side="bottom"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Editor Title & Unified Live WYSIWYG Canvas Area */}
                <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-8 pt-4 pb-2 overflow-y-auto custom-scrollbar">
                  {/* Title (Clean serif with multi-line auto-grow wrapping matching preview) */}
                  {noteEditorMode === 'write' ? (
                    <textarea
                      rows={1}
                      ref={(el) => {
                        titleInputRef.current = el;
                        if (el) {
                          el.style.height = 'auto';
                          el.style.height = `${el.scrollHeight}px`;
                        }
                      }}
                      value={activeNote.title}
                      maxLength={150}
                      onFocus={() => {
                        setIsTitleFocused(true);
                        setActiveFormats({
                          bold: false,
                          italic: false,
                          strike: false,
                          highlight: false,
                          h1: false,
                          h2: false,
                          ul: false,
                          ol: false,
                          quote: false,
                          link: false,
                          checklist: false,
                        });
                      }}
                      onBlur={() => {
                        setIsTitleFocused(false);
                        updateToolbarState();
                      }}
                      onChange={(e) => {
                        handleUpdateNote(activeNote.id, { title: e.target.value });
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          editorContentRef.current?.focus();
                        }
                        e.stopPropagation();
                      }}
                      placeholder="Note Title..."
                      className="w-full font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 border-none outline-none focus:outline-none bg-transparent shrink-0 mb-3 resize-none leading-tight overflow-hidden break-words"
                    />
                  ) : (
                    <h1
                      onClick={() => setNoteEditorMode('write')}
                      className="w-full font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 shrink-0 mb-3 cursor-text hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors leading-tight break-words"
                      title="Tap to edit title"
                    >
                      {activeNote.title.trim() || <span className="text-slate-300 dark:text-slate-600 font-normal italic">Untitled Note</span>}
                    </h1>
                  )}

                  {/* Body Content (100% Identical Typography & Layout in Preview and Write, Zero Selection Drops) */}
                  {noteEditorMode === 'write' ? (
                    <div className="flex-1 w-full overflow-y-auto custom-scrollbar pt-1 pb-4">
                      <div
                        ref={editorContentRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Start typing your notes, formulas, checklists..."
                        onPaste={handleEditorPaste}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          const checkItem = target.closest('.checklist-item');
                          if (checkItem && (target.classList.contains('chk-box') || target.closest('.chk-box'))) {
                            e.stopPropagation();
                            const isChecked = checkItem.getAttribute('data-checked') === 'true';
                            const nextChecked = !isChecked;
                            checkItem.setAttribute('data-checked', String(nextChecked));
                            const chkBox = checkItem.querySelector('.chk-box');
                            const chkText = checkItem.querySelector('.chk-text');
                            if (chkBox) {
                              chkBox.className = `chk-box mt-1 w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 ${nextChecked ? 'bg-[#2563EB] border-[#2563EB] text-white font-bold' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`;
                              chkBox.textContent = nextChecked ? '✓' : '';
                            }
                            if (chkText) {
                              chkText.className = `chk-text flex-1 select-text ${nextChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`;
                            }
                            scheduleDebouncedSave();
                          }
                        }}
                        onInput={handleEditorInput}
                        onKeyUp={updateToolbarState}
                        onMouseUp={updateToolbarState}
                        onSelect={updateToolbarState}
                        onKeyDown={handleEditorKeyDown}
                        className="space-y-1.5 focus:outline-none min-h-[320px] font-sans text-[14px] sm:text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 select-text [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 dark:[&_h1]:text-slate-100 [&_h1]:mt-3.5 [&_h1]:mb-1.5 [&_h1]:leading-tight [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 dark:[&_h2]:text-slate-100 [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:leading-tight [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 dark:[&_h3]:text-slate-100 [&_h3]:mt-2.5 [&_h3]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2563EB]/60 [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:bg-blue-50/40 dark:[&_blockquote]:bg-blue-950/30 [&_blockquote]:text-slate-700 dark:[&_blockquote]:text-slate-300 [&_blockquote]:rounded-r-md [&_blockquote]:my-2 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:list-inside [&_ul]:my-1.5 [&_ul]:space-y-0.5 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:my-1.5 [&_ol]:space-y-0.5 [&_mark]:bg-amber-100 dark:[&_mark]:bg-amber-900/60 [&_mark]:text-amber-950 dark:[&_mark]:text-amber-200 [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded [&_hr]:my-4 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:bg-slate-100 dark:[&_code]:bg-slate-800 [&_code]:text-rose-600 dark:[&_code]:text-rose-400 [&_code]:rounded [&_code]:border [&_code]:border-slate-200/70 dark:[&_code]:border-slate-700 [&_a]:text-[#2563EB] dark:[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-medium hover:[&_a]:text-blue-800 dark:hover:[&_a]:text-blue-300 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 dark:empty:before:text-slate-600 empty:before:pointer-events-none"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setNoteEditorMode('write')}
                      className="flex-1 w-full overflow-y-auto custom-scrollbar pt-1 pb-4 cursor-text font-sans text-[14px] sm:text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 select-text"
                      title="Tap anywhere to edit note"
                    >
                      <div
                        className="space-y-1.5 focus:outline-none min-h-[320px] [&_h1]:font-serif [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-slate-900 dark:[&_h1]:text-slate-100 [&_h1]:mt-3.5 [&_h1]:mb-1.5 [&_h1]:leading-tight [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 dark:[&_h2]:text-slate-100 [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:leading-tight [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 dark:[&_h3]:text-slate-100 [&_h3]:mt-2.5 [&_h3]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2563EB]/60 [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:bg-blue-50/40 dark:[&_blockquote]:bg-blue-950/30 [&_blockquote]:text-slate-700 dark:[&_blockquote]:text-slate-300 [&_blockquote]:rounded-r-md [&_blockquote]:my-2 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:list-inside [&_ul]:my-1.5 [&_ul]:space-y-0.5 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:my-1.5 [&_ol]:space-y-0.5 [&_mark]:bg-amber-100 dark:[&_mark]:bg-amber-900/60 [&_mark]:text-amber-950 dark:[&_mark]:text-amber-200 [&_mark]:px-1 [&_mark]:py-0.5 [&_mark]:rounded [&_hr]:my-4 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:font-mono [&_code]:bg-slate-100 dark:[&_code]:bg-slate-800 [&_code]:text-rose-600 dark:[&_code]:text-rose-400 [&_code]:rounded [&_code]:border [&_code]:border-slate-200/70 dark:[&_code]:border-slate-700 [&_a]:text-[#2563EB] dark:[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-medium hover:[&_a]:text-blue-800 dark:hover:[&_a]:text-blue-300"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          const checkItem = target.closest('.checklist-item');
                          if (checkItem && (target.classList.contains('chk-box') || target.closest('.chk-box'))) {
                            e.stopPropagation();
                            const isChecked = checkItem.getAttribute('data-checked') === 'true';
                            const nextChecked = !isChecked;
                            checkItem.setAttribute('data-checked', String(nextChecked));
                            const chkBox = checkItem.querySelector('.chk-box');
                            const chkText = checkItem.querySelector('.chk-text');
                            if (chkBox) {
                              chkBox.className = `chk-box mt-1 w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 ${nextChecked ? 'bg-[#2563EB] border-[#2563EB] text-white font-bold' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`;
                              chkBox.textContent = nextChecked ? '✓' : '';
                            }
                            if (chkText) {
                              chkText.className = `chk-text flex-1 select-text ${nextChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`;
                            }
                            const updatedHtml = (e.currentTarget as HTMLElement).innerHTML;
                            handleUpdateNote(activeNote.id, { content: updatedHtml });
                            return;
                          }
                          const linkEl = target.closest('a');
                          if (linkEl) {
                            e.stopPropagation();
                            const href = linkEl.getAttribute('href');
                            if (href) window.open(href, '_blank', 'noopener,noreferrer');
                            return;
                          }

                          // Calculate childIndex and charOffset within the container
                          const container = e.currentTarget as HTMLElement;
                          let childIndex = 0;
                          let charOffset = 0;

                          const selection = window.getSelection();
                          let clickNode: Node | null = null;
                          let clickOffset = 0;

                          if (document.caretPositionFromPoint) {
                            const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
                            if (pos) {
                              clickNode = pos.offsetNode;
                              clickOffset = pos.offset;
                            }
                          } else if ((document as any).caretRangeFromPoint) {
                            const range = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
                            if (range) {
                              clickNode = range.startContainer;
                              clickOffset = range.startOffset;
                            }
                          }

                          if (clickNode && container.contains(clickNode)) {
                            // Find which top-level child contains clickNode
                            let topChild: Node | null = clickNode;
                            while (topChild && topChild.parentNode !== container) {
                              topChild = topChild.parentNode;
                            }
                            if (topChild) {
                              childIndex = Array.prototype.indexOf.call(container.children, topChild);
                              if (childIndex < 0) childIndex = 0;

                              // Count characters up to clickNode
                              let accumulated = 0;
                              let stop = false;
                              const countWalk = (node: Node) => {
                                if (stop) return;
                                if (node === clickNode) {
                                  accumulated += clickOffset;
                                  stop = true;
                                  return;
                                }
                                if (node.nodeType === Node.TEXT_NODE) {
                                  accumulated += node.textContent?.length || 0;
                                } else {
                                  for (let i = 0; i < node.childNodes.length; i++) {
                                    countWalk(node.childNodes[i]);
                                  }
                                }
                              };
                              countWalk(topChild);
                              charOffset = accumulated;
                            }
                          }

                          pendingCaretTargetInfoRef.current = {
                            childIndex,
                            charOffset,
                            fallbackCoords: { clientX: e.clientX, clientY: e.clientY }
                          };
                          setNoteEditorMode('write');
                        }}
                        dangerouslySetInnerHTML={{
                          __html: convertMarkdownToHtml(activeNote.content || '') ||
                            '<div class="py-16 text-center text-slate-400 font-sans text-xs flex flex-col items-center justify-center gap-2 select-none"><p class="font-semibold text-slate-600">Note is empty</p><p class="text-[11.5px] text-slate-400">Tap anywhere to start typing...</p></div>'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Footer Stats */}
                <div className={`shrink-0 px-4 sm:px-8 py-2 border-t flex items-center justify-between text-[11px] text-slate-400 font-sans select-none transition-colors duration-150 ${currentEditorTheme.footer}`}>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const plainText = stripHtml(activeNote.content || '');
                      const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
                      return (
                        <>
                          <span>{words} words</span>
                          <span>{plainText.length} characters</span>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-3">
                    {isSaving ? (
                      <span className="text-blue-600 font-medium flex items-center gap-1.5 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin stroke-[2.5]" />
                        <span>Saving...</span>
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Auto-saved</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <NotebookPen className="w-12 h-12 stroke-[1.25] text-slate-300 mb-3" />
              <h3 className="font-serif font-bold text-base text-slate-700 mb-1">No Note Selected</h3>
              <p className="text-xs text-slate-400 max-w-[260px] mb-4">
                Choose a note from the left sidebar or create a fresh one.
              </p>
              <button
                type="button"
                onClick={handleCreateNewNote}
                className="px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Note</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* 3-Dot Dropdown Popover (Fixed, Viewport-Aware, Anti-Clipping) */}
      <AnimatePresence>
        {menuAnchor && (
          <>
            {/* Invisible full-screen backdrop to dismiss on click outside */}
            <div
              className="fixed inset-0 z-[1000] bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAnchor(null);
                setActiveNoteMenuId(null);
              }}
            />
            <motion.div
              key={`fixed-note-menu-${menuAnchor.noteId}`}
              initial={{ opacity: 0, scale: 0.88, y: menuAnchor.openUpward ? 6 : -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: menuAnchor.openUpward ? 4 : -4 }}
              transition={{ type: 'spring', stiffness: 520, damping: 32, mass: 0.5 }}
              style={{
                position: 'fixed',
                top: menuAnchor.top,
                bottom: menuAnchor.bottom,
                right: Math.max(12, menuAnchor.right),
                transformOrigin: menuAnchor.openUpward ? 'bottom right' : 'top right',
                zIndex: 1001,
              }}
              onClick={e => e.stopPropagation()}
              className="w-44 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-1 flex flex-col gap-0.5 text-slate-700 dark:text-slate-200 select-none"
            >
              {(() => {
                const targetNote = notes.find(item => item.id === menuAnchor.noteId);
                if (!targetNote) return null;
                return (
                  <>
                    {/* Pin / Unpin */}
                    <button
                      type="button"
                      onClick={(e) => {
                        handleTogglePinNote(targetNote.id, e);
                        setMenuAnchor(null);
                        setActiveNoteMenuId(null);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-left transition-colors cursor-pointer"
                    >
                      <Pin className={`w-3.5 h-3.5 ${targetNote.isPinned ? 'fill-rose-500 text-rose-500' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span>{targetNote.isPinned ? 'Unpin from Top' : 'Pin to Top'}</span>
                    </button>

                    {/* Duplicate Note */}
                    <button
                      type="button"
                      onClick={(e) => {
                        handleDuplicateNote(targetNote, e);
                        setMenuAnchor(null);
                        setActiveNoteMenuId(null);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-left transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Duplicate Note</span>
                    </button>

                    {/* Move to Workspace */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToMove(targetNote);
                        setTargetWorkspaceForMove(targetNote.workspaceId || '');
                        setMenuAnchor(null);
                        setActiveNoteMenuId(null);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-left transition-colors cursor-pointer"
                    >
                      <FolderOutput className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Move to Workspace</span>
                    </button>

                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-0.5" />

                    {/* Color Selector */}
                    <div className="px-2.5 py-1 flex flex-col gap-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">Color Theme</span>
                      <div className="flex items-center gap-1.5">
                        {(['default', 'amber', 'blue', 'emerald', 'purple', 'rose'] as const).map(c => {
                          const colorBgMap: Record<string, string> = {
                            default: 'bg-slate-300 hover:bg-slate-400',
                            amber: 'bg-amber-400 hover:bg-amber-500',
                            blue: 'bg-blue-400 hover:bg-blue-500',
                            emerald: 'bg-emerald-400 hover:bg-emerald-500',
                            purple: 'bg-purple-400 hover:bg-purple-500',
                            rose: 'bg-rose-400 hover:bg-rose-500',
                          };
                          const isSelectedColor = (targetNote.color || 'default') === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateNote(targetNote.id, { color: c });
                              }}
                              className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${colorBgMap[c]} ${
                                isSelectedColor ? 'ring-2 ring-offset-1 ring-slate-800 dark:ring-white dark:ring-offset-slate-900 scale-110' : 'opacity-75 hover:opacity-100'
                              }`}
                              title={`Color: ${c}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-0.5" />

                    {/* Delete Note */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(targetNote);
                        setMenuAnchor(null);
                        setActiveNoteMenuId(null);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-left transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Delete Note</span>
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Text Color Picker Popover (Fixed, Never Clipped by Toolbar) */}
      <AnimatePresence>
        {isTextColorPickerOpen && textColorAnchor && (
          <>
            <div
              className="fixed inset-0 z-[1000] bg-transparent"
              onClick={() => {
                setIsTextColorPickerOpen(false);
                setTextColorAnchor(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: textColorAnchor.top,
                left: textColorAnchor.left,
                zIndex: 1001,
              }}
              onClick={e => e.stopPropagation()}
              className="p-2.5 bg-white border border-slate-200/95 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[155px] select-none"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-0.5">
                Text Color
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { color: '#0F172A', label: 'Default' },
                  { color: '#E11D48', label: 'Rose' },
                  { color: '#2563EB', label: 'Blue' },
                  { color: '#059669', label: 'Green' },
                  { color: '#7C3AED', label: 'Purple' },
                  { color: '#D97706', label: 'Amber' },
                  { color: '#0891B2', label: 'Cyan' },
                  { color: '#64748B', label: 'Slate' },
                ].map(item => (
                  <button
                    key={item.color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => executeTextColor(item.color)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                      activeTextColor === item.color
                        ? 'scale-110 border-slate-900 shadow-xs ring-2 ring-blue-500/40'
                        : 'border-slate-200/80 hover:scale-105 shadow-3xs'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.label}
                  >
                    {activeTextColor === item.color && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => executeTextColor('default')}
                className="mt-0.5 w-full text-center py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                Reset to Default
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Note Confirmation Dialog Modal */}
      <AnimatePresence>
        {noteToDelete && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 flex flex-col gap-4 text-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">Delete this note?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Are you sure you want to delete <span className="font-semibold text-slate-700 font-serif">"{getNoteDisplayTitle(noteToDelete)}"</span>? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNoteToDelete(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteNote}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Delete Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Move Note to Workspace Modal */}
      <AnimatePresence>
        {noteToMove && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 6 }}
              className="bg-white rounded-xl shadow-2xl border border-slate-200/90 max-w-[440px] w-full p-5 sm:p-6 flex flex-col gap-4 text-slate-800"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                    <FolderOutput className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">Move Note to Workspace</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-normal">
                      Transfer “<span className="font-semibold text-slate-800 font-serif">{getNoteDisplayTitle(noteToMove)}</span>” to a workspace.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNoteToMove(null)}
                  className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Workspace Info */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs flex items-center justify-between">
                <span className="text-slate-600 font-medium">Current workspace:</span>
                <span className="font-semibold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-3xs truncate max-w-[200px]">
                  {noteToMove.workspaceId
                    ? workspaces.find(w => w.id === noteToMove.workspaceId)?.name || 'Unknown Workspace'
                    : 'Unassigned / Global'}
                </span>
              </div>

              {/* Target Workspace Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-900">Select Destination Workspace</label>
                <select
                  value={targetWorkspaceForMove}
                  onChange={e => setTargetWorkspaceForMove(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all px-3.5 py-2.5 shadow-2xs cursor-pointer"
                >
                  <option value="">-- Unassigned (Global Note) --</option>
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNoteToMove(null)}
                  className="h-[34px] px-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (noteToMove) {
                      const newWsId = targetWorkspaceForMove || undefined;
                      handleUpdateNote(noteToMove.id, { workspaceId: newWsId });
                      const destName = newWsId ? workspaces.find(w => w.id === newWsId)?.name || 'workspace' : 'Global (Unassigned)';
                      showToast(`Note moved to "${destName}"`);
                      setNoteToMove(null);
                    }
                  }}
                  className="h-[34px] px-4 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <FolderOutput className="w-3.5 h-3.5" />
                  <span>Move Note</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default NotesStudio;
