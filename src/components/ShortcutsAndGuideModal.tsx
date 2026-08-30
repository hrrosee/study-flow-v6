import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Keyboard,
  BookOpen,
  Search,
  Timer,
  Layers,
  Sparkles,
  NotebookPen,
  Wand2,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';

interface ShortcutsAndGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'shortcuts' | 'notes-guide' | 'general-guide';

export const ShortcutsAndGuideModal: React.FC<ShortcutsAndGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('shortcuts');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.08, ease: 'easeIn' } }}
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.08, ease: 'easeIn' } }}
        className="relative z-10 bg-white border border-[#E2E8F0] rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl flex flex-col gap-3.5 overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center text-[#2563EB] dark:text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-slate-100 leading-tight">Shortcut & Guide</h3>
              <p className="text-[11.5px] text-[#64748B] dark:text-slate-400">Complete guide, shortcuts & pro tips for Study Flow and Notes Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                activeTab === 'shortcuts'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>All Shortcuts</span>
            </button>

            <button
              onClick={() => setActiveTab('notes-guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                activeTab === 'notes-guide'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <NotebookPen className="w-3.5 h-3.5" />
              <span>Notes Studio & Markdown</span>
            </button>

            <button
              onClick={() => setActiveTab('general-guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] transition-all cursor-pointer ${
                activeTab === 'general-guide'
                  ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Study Flow Features</span>
            </button>
          </div>

          {activeTab === 'shortcuts' && (
            <div className="relative w-full sm:w-[210px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className="w-full h-8 pl-8 pr-7 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab 1: Keyboard Shortcuts */}
        {activeTab === 'shortcuts' && (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 text-xs custom-scrollbar">
            {/* Notes Studio Shortcuts Category */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                <NotebookPen className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Notes Studio & Rich Text Editor</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ShortcutCard title="Numbered List" keys={["Alt", "N"]} query={searchQuery} />
                <ShortcutCard title="Bullet List" keys={["Alt", "B"]} query={searchQuery} />
                <ShortcutCard title="Heading 1 (H1)" keys={["Alt", "1"]} query={searchQuery} />
                <ShortcutCard title="Heading 2 (H2)" keys={["Alt", "2"]} query={searchQuery} />
                <ShortcutCard title="Heading 3 (H3)" keys={["Alt", "3"]} query={searchQuery} />
                <ShortcutCard title="Inline Code / Formula Chip" keys={["Ctrl", "E"]} query={searchQuery} />
                <ShortcutCard title="Bold Text" keys={["Ctrl", "B"]} query={searchQuery} />
                <ShortcutCard title="Italic Text" keys={["Ctrl", "I"]} query={searchQuery} />
                <ShortcutCard title="Quote Block" keys={["Ctrl", "Q"]} query={searchQuery} />
                <ShortcutCard title="Insert / Edit Link" keys={["Ctrl", "K"]} query={searchQuery} />
                <ShortcutCard title="Highlighter" keys={["Ctrl", "Shift", "H"]} query={searchQuery} />
                <ShortcutCard title="Strikethrough" keys={["Ctrl", "Shift", "X"]} query={searchQuery} />
                <ShortcutCard title="Exit Note Edit / Close" keys={["Esc"]} query={searchQuery} />
                <ShortcutCard title="Save Immediately" keys={["Auto-saves"]} query={searchQuery} isBadge />
              </div>
            </div>

            {/* Workspace & Navigation */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Workspace & App Navigation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ShortcutCard title="New Workspace" keys={["Alt", "W"]} query={searchQuery} />
                <ShortcutCard title="Rename Workspace" keys={["Alt", "Shift", "W"]} query={searchQuery} />
                <ShortcutCard title="Switch 1st–10th Workspace" keys={["Alt", "1..0"]} query={searchQuery} />
                <ShortcutCard title="Next / Prev Workspace" keys={["Alt", "] / ["]} query={searchQuery} />
                <ShortcutCard title="Toggle Left Sidebar" keys={["Ctrl", "B"]} query={searchQuery} />
                <ShortcutCard title="Global Quick Search" keys={["Ctrl", "K"]} query={searchQuery} />
                <ShortcutCard title="Open Recycle Bin" keys={["Alt", "R"]} query={searchQuery} />
                <ShortcutCard title="Open Shortcuts & Guide" keys={["Ctrl", "/"]} query={searchQuery} />
              </div>
            </div>

            {/* Study Timer & Goals */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Study Timer & Goals</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ShortcutCard title="Start / Pause Study Timer" keys={["Alt", "Space"]} query={searchQuery} />
                <ShortcutCard title="Stop & Log Study Time" keys={["Alt", "L"]} query={searchQuery} />
                <ShortcutCard title="Today's Goal Popover" keys={["Alt", "G"]} query={searchQuery} />
                <ShortcutCard title="Streak Consistency Dashboard" keys={["Alt", "Shift", "G"]} query={searchQuery} />
              </div>
            </div>

            {/* Sections & Topic Studio */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Sections & Topic Studio</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ShortcutCard title="Create Section" keys={["Alt", "S"]} query={searchQuery} />
                <ShortcutCard title="Rename Active Section" keys={["Alt", "Shift", "S"]} query={searchQuery} />
                <ShortcutCard title="Next / Prev Section Tab" keys={["Alt", "→ / ←"]} query={searchQuery} />
                <ShortcutCard title="Create Single Topic" keys={["Alt", "T"]} query={searchQuery} />
                <ShortcutCard title="Topic Studio (Visual Form)" keys={["Alt", "Shift", "T"]} query={searchQuery} />
                <ShortcutCard title="Topic Studio (Markdown Mode)" keys={["Alt", "Shift", "M"]} query={searchQuery} />
                <ShortcutCard title="Batch Range Check/Uncheck" keys={["Shift", "Click"]} query={searchQuery} />
                <ShortcutCard title="Save / Generate in Studio" keys={["Ctrl", "Enter"]} query={searchQuery} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Notes Studio & Markdown Guide */}
        {activeTab === 'notes-guide' && (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 text-xs custom-scrollbar text-slate-700 leading-relaxed">
            {/* Pro Note Taking Features */}
            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-[13px]">
                <NotebookPen className="w-4 h-4 text-[#2563EB]" />
                <span>Notes Studio Features & Capabilities</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 text-[12px]">
                <li><b>Direct Caret Positioning:</b> Click anywhere in preview mode to jump directly into editing at that exact character without layout shift.</li>
                <li><b>Smart List Nesting:</b> Press <kbd className="px-1 py-0.5 bg-white border rounded text-[10px] font-mono">Alt+B</kbd> or <kbd className="px-1 py-0.5 bg-white border rounded text-[10px] font-mono">Alt+N</kbd> on any list item to cleanly nest sub-lists or indent without breaking your document flow.</li>
                <li><b>Typography Persistence:</b> Applying H1, H2, or H3 inside numbered or bullet lists will seamlessly inherit that heading size to subsequent items on <kbd className="px-1 py-0.5 bg-white border rounded text-[10px] font-mono">Enter</kbd>.</li>
                <li><b>Dual Rich Clipboard Copy:</b> Clicking the <b>Copy</b> button copies both formatted HTML and standard Markdown, letting you paste directly into ChatGPT, Notion, or Obsidian with 100% fidelity.</li>
                <li><b>Creation Date Sorting:</b> The sidebar automatically places newly created notes at the top without jumping while you type.</li>
              </ul>
            </div>

            {/* Live Markdown Syntax Guide Table */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Live Markdown Auto-Format Triggers (Antigravity & Notion compatible)</span>
              </div>
              <p className="text-[11.5px] text-slate-500">
                Turn on the <b>🪄 Markdown</b> button on the editor toolbar to automatically convert typed symbols into rich styled formatting in real-time:
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-[11.5px]">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-2 px-3">You Type (Syntax)</th>
                      <th className="py-2 px-3">Trigger</th>
                      <th className="py-2 px-3">Rendered Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-sans">
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">**Important**</td>
                      <td className="py-2 px-3 text-slate-500">Typing end <code className="font-mono">**</code></td>
                      <td className="py-2 px-3 font-bold text-slate-900">Important</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">`Y = 200px`</td>
                      <td className="py-2 px-3 text-slate-500">Typing end <code className="font-mono">`</code></td>
                      <td className="py-2 px-3"><code className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 text-rose-600 rounded border border-slate-200">Y = 200px</code></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">==Highlight==</td>
                      <td className="py-2 px-3 text-slate-500">Typing end <code className="font-mono">==</code></td>
                      <td className="py-2 px-3"><mark className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded">Highlight</mark></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">~~Deleted~~</td>
                      <td className="py-2 px-3 text-slate-500">Typing end <code className="font-mono">~~</code></td>
                      <td className="py-2 px-3"><del className="text-slate-400">Deleted</del></td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">*Italic*</td>
                      <td className="py-2 px-3 text-slate-500">Typing end <code className="font-mono">*</code></td>
                      <td className="py-2 px-3 italic">Italic</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600"># Title</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3 font-serif font-bold text-[14px]">Heading 1</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">## Subtitle</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3 font-serif font-bold text-[13px]">Heading 2</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">### Section</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3 font-serif font-semibold text-[12px]">Heading 3</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">- Item or * Item</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3">• Bullet point list</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">1. Step</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3">1. Numbered step list</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">&gt; Quote text</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3 italic border-l-2 border-blue-500 pl-1.5">Quote block</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">[] or [ ] Task</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3 flex items-center gap-1.5"><span className="w-3.5 h-3.5 border rounded bg-white inline-block"></span> Task checkbox</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-600">---</td>
                      <td className="py-2 px-3 text-slate-500">Line start + <kbd className="font-mono text-[10px] px-1 bg-slate-100 border rounded">Space</kbd></td>
                      <td className="py-2 px-3"><hr className="border-slate-300" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Study Flow General Guide */}
        {activeTab === 'general-guide' && (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 text-xs custom-scrollbar text-slate-700 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Card 1: Workspaces & Sections */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-[12.5px]">
                  <Layers className="w-4 h-4 text-[#2563EB]" />
                  <span>Workspaces & Sections</span>
                </div>
                <p className="text-slate-600 text-[11.5px]">
                  Organize your subjects (e.g. Mathematics, Physics, Programming) into dedicated workspaces with custom section tabs for modules, chapters, or exam sprints.
                </p>
              </div>

              {/* Card 2: Study Timer & Focus Tracker */}
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-[12.5px]">
                  <Timer className="w-4 h-4 text-emerald-600" />
                  <span>Pomodoro & Focus Timer</span>
                </div>
                <p className="text-slate-600 text-[11.5px]">
                  Start focus study sessions with <kbd className="px-1 py-0.5 bg-white border rounded text-[10px] font-mono">Alt+Space</kbd>. Time spent is automatically logged to daily targets, analytics, and consistency streaks.
                </p>
              </div>

              {/* Card 3: Topic Studio & Batch Generator */}
              <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-purple-950 font-bold text-[12.5px]">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Topic Studio & Markdown Mode</span>
                </div>
                <p className="text-slate-600 text-[11.5px]">
                  Create topics using visual forms or switch to Markdown mode (<kbd className="px-1 py-0.5 bg-white border rounded text-[10px] font-mono">Alt+Shift+M</kbd>) to batch-generate multiple topics, checklists, and resource links at once.
                </p>
              </div>

              {/* Card 4: Offline-First Cloud Sync */}
              <div className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-sky-950 font-bold text-[12.5px]">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>Cloud & Multi-Device Sync</span>
                </div>
                <p className="text-slate-600 text-[11.5px]">
                  Work seamlessly offline with instantaneous local storage. When you reconnect, your topics, workspaces, and notes merge automatically with your Firebase cloud account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] shrink-0">
          <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-600">Esc</kbd>
            to close this window
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-lg hover:bg-[#1D4ED8] cursor-pointer transition-colors shadow-xs"
          >
            Got It
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface ShortcutCardProps {
  title: string;
  keys: string[];
  query?: string;
  isBadge?: boolean;
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({ title, keys, query, isBadge }) => {
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    const matchTitle = title.toLowerCase().includes(q);
    const matchKeys = keys.some(k => k.toLowerCase().includes(q));
    if (!matchTitle && !matchKeys) return null;
  }

  return (
    <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] dark:bg-slate-900/80 border border-[#E2E8F0] dark:border-slate-800 rounded-[8px] hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <span className="font-medium text-[#334155] dark:text-slate-100 truncate pr-2">{title}</span>
      <div className="flex items-center gap-1 shrink-0">
        {keys.map((k, i) => (
          <kbd
            key={i}
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shadow-2xs ${
              isBadge
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-800 border border-[#CBD5E1] dark:border-slate-700 text-[#0F172A] dark:text-slate-100'
            }`}
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
};
