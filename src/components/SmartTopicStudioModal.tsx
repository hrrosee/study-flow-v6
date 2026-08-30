import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Plus, Trash2, Copy, FileText, ArrowRight, 
  Layers, Check, AlertCircle, AlertTriangle, Link2, ChevronDown, MoreVertical,
  // 1. Languages & Grammar
  Languages, Type, SpellCheck, BookA, NotebookTabs, WholeWord, TextCursor, Pilcrow, CaseSensitive, Brackets,
  // 2. Literature
  BookOpen, BookOpenText, Library, Feather, PenTool, Scroll, ScrollText, Notebook, Quote, BookMarked, GraduationCap, PenLine, BookCopy, Theater,
  // 3. Math & Logic
  Calculator, Sigma, Radical, Pi, Percent, Divide, SquareFunction, Equal, Variable, Binary, ChartNoAxesColumn,
  // 4. Mental Ability
  Brain, BrainCircuit, Puzzle, Lightbulb, Blocks, Route, Network, ScanSearch, Workflow, GitBranch, Shapes, Waypoints,
  // 5. General Knowledge & History
  Map, MapPinned, Landmark, Flag, Building2, Scale, Globe, Earth, Handshake, Plane, Ship,
  // 6. Science
  Atom, FlaskConical, Microscope, Telescope, Dna, TestTube, Orbit, Magnet, Zap, Thermometer, Radiation,
  // 7. ICT & Coding
  Monitor, Computer, Cpu, Microchip, Database, Server, Wifi, Code2, Terminal, Cloud,
  // 8. Geography & Nature
  Mountain, Waves, Compass, Navigation, Trees, TreePine, Leaf, Sprout, Recycle, Droplets, Wind, Sun, CloudSun, Flower, Biohazard,
  // 9. Values & Achievement
  Trophy, Medal, Target, Timer, Award, Star, Heart
} from 'lucide-react';
import { 
  StudioTopicSpec, 
  StudioTaskSpec, 
  StudioLink, 
  StudioNote,
  parseStudioMarkdown, 
  generateStudioMarkdown,
  getAutoLinkTitle,
  detectLinkType,
  ensureExternalUrl,
  generateStudioId
} from '../utils/studioMarkdownParser';

interface SmartTopicStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topics: StudioTopicSpec[]) => void;
  sections?: string[];
  activeSectionName?: string;
  initialMode?: 'visual' | 'markdown';
}

export const PALETTES = [
  { id: 'blue', name: 'Royal Blue', color: '#2563EB', bgClass: 'bg-[#2563EB]', borderClass: 'border-[#2563EB]', textColor: 'text-[#2563EB]' },
  { id: 'purple', name: 'Purple', color: '#8B5CF6', bgClass: 'bg-[#8B5CF6]', borderClass: 'border-[#8B5CF6]', textColor: 'text-[#8B5CF6]' },
  { id: 'green', name: 'Emerald', color: '#10B981', bgClass: 'bg-[#10B981]', borderClass: 'border-[#10B981]', textColor: 'text-[#10B981]' },
  { id: 'orange', name: 'Orange', color: '#EA580C', bgClass: 'bg-[#EA580C]', borderClass: 'border-[#EA580C]', textColor: 'text-[#EA580C]' },
  { id: 'pink', name: 'Rose Pink', color: '#F43F5E', bgClass: 'bg-[#F43F5E]', borderClass: 'border-[#F43F5E]', textColor: 'text-[#F43F5E]' },
  { id: 'cyan', name: 'Cyan', color: '#06B6D4', bgClass: 'bg-[#06B6D4]', borderClass: 'border-[#06B6D4]', textColor: 'text-[#06B6D4]' },
  { id: 'amber', name: 'Gold', color: '#F59E0B', bgClass: 'bg-[#F59E0B]', borderClass: 'border-[#F59E0B]', textColor: 'text-[#F59E0B]' }
];

export const EXACT_TOPIC_ICONS = [
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
  
  // 2. সাহিত্য & পড়ালেখা
  { id: 'bookopen', comp: BookOpen, label: 'Book Open' },
  { id: 'bookopentext', comp: BookOpenText, label: 'Book Text' },
  { id: 'library', comp: Library, label: 'Library' },
  { id: 'feather', comp: Feather, label: 'Feather' },
  { id: 'pentool', comp: PenTool, label: 'Pen Tool' },
  { id: 'scroll', comp: Scroll, label: 'Scroll' },
  { id: 'notebook', comp: Notebook, label: 'Notebook' },
  { id: 'quote', comp: Quote, label: 'Quote' },
  { id: 'bookmarked', comp: BookMarked, label: 'Bookmark' },
  { id: 'graduationcap', comp: GraduationCap, label: 'Graduation' },
  { id: 'penline', comp: PenLine, label: 'Writing' },
  { id: 'bookcopy', comp: BookCopy, label: 'Books' },
  { id: 'theater', comp: Theater, label: 'Drama' },

  // 3. গণিত
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

  // 4. মানসিক দক্ষতা
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

  // 5. বাংলাদেশ ও আন্তর্জাতিক
  { id: 'map', comp: Map, label: 'Map' },
  { id: 'mappinned', comp: MapPinned, label: 'Map Pin' },
  { id: 'landmark', comp: Landmark, label: 'Landmark' },
  { id: 'flag', comp: Flag, label: 'Flag' },
  { id: 'building2', comp: Building2, label: 'Building' },
  { id: 'scale', comp: Scale, label: 'Scale' },
  { id: 'globe', comp: Globe, label: 'Globe' },
  { id: 'earth', comp: Earth, label: 'Earth' },
  { id: 'handshake', comp: Handshake, label: 'Handshake' },
  { id: 'plane', comp: Plane, label: 'Plane' },
  { id: 'ship', comp: Ship, label: 'Ship' },

  // 6. বিজ্ঞান
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

  // 7. ICT / Computer
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

  // 8. ভূগোল ও পরিবেশ
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

  // 9. এচিভমেন্ট ও লক্ষ্য
  { id: 'trophy', comp: Trophy, label: 'Trophy' },
  { id: 'medal', comp: Medal, label: 'Medal' },
  { id: 'target', comp: Target, label: 'Target' },
  { id: 'timer', comp: Timer, label: 'Timer' },
  { id: 'award', comp: Award, label: 'Award' },
  { id: 'star', comp: Star, label: 'Star' },
  { id: 'heart', comp: Heart, label: 'Heart' }
];

export function getLucideIconComponent(iconId: string) {
  const normalized = (iconId || 'bookopen').toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = EXACT_TOPIC_ICONS.find(ic => ic.id.toLowerCase() === normalized);
  return match ? match.comp : BookOpen;
}

function renderOfficialLinkIcon(url: string, title?: string) {
  const type = detectLinkType(url, title);

  if (type === 'youtube') {
    return (
      <svg width="18" height="13" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path fillRule="evenodd" clipRule="evenodd" d="M27.0983 3.03362C26.7797 1.8436 25.8453 0.909181 24.6553 0.590623C22.5029 0.0136719 14.0006 0.0136719 14.0006 0.0136719C14.0006 0.0136719 5.49826 0.0136719 3.34591 0.590623C2.15589 0.909181 1.22147 1.8436 0.902914 3.03362C0.325963 5.18597 0.325963 9.99965 0.325963 9.99965C0.325963 9.99965 0.325963 14.8133 0.902914 16.9657C1.22147 18.1557 2.15589 19.0901 3.34591 19.4087C5.49826 19.9856 14.0006 19.9856 14.0006 19.9856C14.0006 19.9856 22.5029 19.9856 24.6553 19.4087C25.8453 19.0901 26.7797 18.1557 27.0983 16.9657C27.6752 14.8133 27.6752 9.99965 27.6752 9.99965C27.6752 9.99965 27.6752 5.18597 27.0983 3.03362ZM11.2612 14.2818V5.71754L18.6811 9.99965L11.2612 14.2818Z" fill="#FF0000" />
      </svg>
    );
  }

  if (type === 'facebook') {
    return (
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="w-4 h-4 shrink-0" />
    );
  }

  if (type === 'drive') {
    return (
      <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-4 h-4 shrink-0" />
    );
  }

  if (type === 'pdf') {
    return (
      <div className="w-4 h-4 rounded bg-red-500 text-[9px] font-bold text-white flex items-center justify-center shrink-0">
        PDF
      </div>
    );
  }

  return (
    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" className="w-4 h-4 shrink-0" />
  );
}

export const PRIORITY_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; iconBg: string; fill: string; dot: string }> = {
  high: {
    label: 'High',
    bg: 'bg-[#FFF5F5]',
    border: 'border-[#FFE2E2] hover:border-[#F43F5E]/40',
    text: 'text-[#F43F5E]',
    iconBg: 'bg-[#FFE6E6]',
    fill: 'fill-[#F43F5E]',
    dot: 'bg-[#F43F5E]'
  },
  medium: {
    label: 'Medium',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FEF3C7] hover:border-[#F59E0B]/40',
    text: 'text-[#D97706]',
    iconBg: 'bg-[#FEF3C7]',
    fill: 'fill-[#D97706]',
    dot: 'bg-[#F59E0B]'
  },
  low: {
    label: 'Low',
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#DCFCE7] hover:border-[#16A34A]/40',
    text: 'text-[#16A34A]',
    iconBg: 'bg-[#DCFCE7]',
    fill: 'fill-[#16A34A]',
    dot: 'bg-[#16A34A]'
  },
  none: {
    label: 'None',
    bg: 'bg-[#F8FAFC]',
    border: 'border-[#E2E8F0] hover:border-[#94A3B8]/40',
    text: 'text-[#64748B]',
    iconBg: 'bg-[#E2E8F0]',
    fill: 'fill-transparent',
    dot: 'bg-slate-300'
  }
};

const TaskPrioritySelector: React.FC<{
  value: 'high' | 'medium' | 'low' | 'none';
  onChange: (priority: 'high' | 'medium' | 'low' | 'none') => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const currentCfg = PRIORITY_CONFIG[value || 'none'] || PRIORITY_CONFIG.none;

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 w-8 sm:w-auto px-0 sm:px-2 rounded-lg border ${currentCfg.border} ${currentCfg.bg} ${currentCfg.text} flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0`}
        title={`Priority: ${currentCfg.label}`}
      >
        <Flag className={`w-3.5 h-3.5 shrink-0 ${currentCfg.fill}`} />
        <span className="hidden sm:inline text-[11px] font-bold">{currentCfg.label}</span>
        <ChevronDown className="hidden sm:inline w-3 h-3 opacity-60 ml-0.5 shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-9 z-50 bg-white rounded-xl p-1.5 shadow-xl border border-slate-200 min-w-[130px] flex flex-col gap-1"
          >
            {(['none', 'low', 'medium', 'high'] as const).map(pKey => {
              const cfg = PRIORITY_CONFIG[pKey];
              const isSelected = (value || 'none') === pKey;
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => {
                    onChange(pKey);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isSelected ? `${cfg.bg} ${cfg.text} font-bold` : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${cfg.text} ${cfg.fill}`} />
                  <span>{cfg.label}</span>
                  {isSelected && <Check className="w-3 h-3 ml-auto text-slate-600" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SmartTopicStudioModal: React.FC<SmartTopicStudioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sections = [],
  activeSectionName = 'General',
  initialMode = 'visual'
}) => {
  const [mode, setMode] = useState<'visual' | 'markdown'>(initialMode);
  const [markdownText, setMarkdownText] = useState('');
  const [isMarkdownSyntaxHelpOpen, setIsMarkdownSyntaxHelpOpen] = useState(true);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message?: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialSection = activeSectionName || (sections.length > 0 ? sections[0] : 'General');

  const createBlankTopic = (): StudioTopicSpec => ({
    id: generateStudioId(),
    title: '',
    section: initialSection,
    color: 'blue',
    icon: 'bookopen',
    links: [{ id: generateStudioId(), url: '', title: '' }],
    notes: [{ id: generateStudioId(), text: '' }],
    tasks: []
  });

  const [topics, setTopics] = useState<StudioTopicSpec[]>([createBlankTopic()]);
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);

  // Auto-hide footer on mobile when keyboard opens (input focused)
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (window.innerWidth < 640) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
          setIsMobileKeyboardOpen(true);
        }
      }
    };

    const handleFocusOut = () => {
      if (window.innerWidth < 640) {
        setTimeout(() => {
          const activeEl = document.activeElement as HTMLElement | null;
          if (!activeEl || !(activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
            setIsMobileKeyboardOpen(false);
          }
        }, 120);
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Reset state on opening
  useEffect(() => {
    if (isOpen) {
      setTopics([createBlankTopic()]);
      setMode(initialMode || 'visual');
      setMarkdownText('');
      setErrorMessage(null);
      setShowDiscardConfirm(false);
      setIsMobileKeyboardOpen(false);
    }
  }, [isOpen, activeSectionName, initialMode]);

  const hasUnsavedChanges = () => {
    return topics.some(t => 
      t.title.trim() !== '' || 
      t.tasks.length > 0 || 
      t.links.some(l => l.url.trim() !== '') || 
      t.notes.some(n => n.text.trim() !== '')
    ) || markdownText.trim() !== '';
  };

  const handleAttemptClose = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    onClose();
  };

  // Keyboard shortcuts: Escape, Ctrl+Enter, and In-Modal Alt shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleAttemptClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (mode === 'visual') {
          handleSwitchToMarkdown();
        } else {
          handleSwitchToVisual();
        }
      } else if (mode === 'visual' && e.altKey) {
        const lastTopicIdx = topics.length - 1;
        if (lastTopicIdx < 0) return;

        if (e.shiftKey && e.key.toLowerCase() === 'l') {
          // Alt + Shift + L: Add link to last task
          e.preventDefault();
          setTopics(prev => {
            const copy = [...prev];
            const t = { ...copy[lastTopicIdx] };
            if (t.tasks.length > 0) {
              const lastTaskIdx = t.tasks.length - 1;
              const taskCopy = { ...t.tasks[lastTaskIdx] };
              taskCopy.links = [...(taskCopy.links || []), { id: generateStudioId(), url: '', title: '' }];
              t.tasks = [...t.tasks];
              t.tasks[lastTaskIdx] = taskCopy;
              copy[lastTopicIdx] = t;
            }
            return copy;
          });
        } else if (e.shiftKey && e.key.toLowerCase() === 'n') {
          // Alt + Shift + N: Add note to last task
          e.preventDefault();
          setTopics(prev => {
            const copy = [...prev];
            const t = { ...copy[lastTopicIdx] };
            if (t.tasks.length > 0) {
              const lastTaskIdx = t.tasks.length - 1;
              const taskCopy = { ...t.tasks[lastTaskIdx] };
              taskCopy.notes = [...(taskCopy.notes || []), { id: generateStudioId(), text: '' }];
              t.tasks = [...t.tasks];
              t.tasks[lastTaskIdx] = taskCopy;
              copy[lastTopicIdx] = t;
            }
            return copy;
          });
        } else if (!e.shiftKey && e.key.toLowerCase() === 't') {
          // Alt + T: Add new task to active topic
          e.preventDefault();
          setTopics(prev => {
            const copy = [...prev];
            const t = { ...copy[lastTopicIdx] };
            t.tasks = [
              ...t.tasks,
              {
                id: generateStudioId(),
                title: '',
                description: '',
                links: [{ id: generateStudioId(), url: '', title: '' }],
                notes: [{ id: generateStudioId(), text: '' }],
                priority: 'none'
              }
            ];
            copy[lastTopicIdx] = t;
            return copy;
          });
        } else if (!e.shiftKey && e.key.toLowerCase() === 'n') {
          // Alt + N: Add topic note
          e.preventDefault();
          setTopics(prev => {
            const copy = [...prev];
            const t = { ...copy[lastTopicIdx] };
            t.notes = [...t.notes, { id: generateStudioId(), text: '' }];
            copy[lastTopicIdx] = t;
            return copy;
          });
        } else if (!e.shiftKey && e.key.toLowerCase() === 'l') {
          // Alt + L: Add topic link
          e.preventDefault();
          setTopics(prev => {
            const copy = [...prev];
            const t = { ...copy[lastTopicIdx] };
            t.links = [...t.links, { id: generateStudioId(), url: '', title: '' }];
            copy[lastTopicIdx] = t;
            return copy;
          });
        } else if (!e.shiftKey && e.key.toLowerCase() === 'd') {
          // Alt + D: Add/focus description to last task
          e.preventDefault();
          setTopics(prev => {
            const copy = [...prev];
            const t = { ...copy[lastTopicIdx] };
            if (t.tasks.length > 0) {
              const lastTaskIdx = t.tasks.length - 1;
              const taskCopy = { ...t.tasks[lastTaskIdx] };
              if (!taskCopy.description) taskCopy.description = ' ';
              t.tasks = [...t.tasks];
              t.tasks[lastTaskIdx] = taskCopy;
              copy[lastTopicIdx] = t;
            }
            return copy;
          });
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, topics, markdownText, mode]);

  const handleSwitchToMarkdown = () => {
    const md = generateStudioMarkdown(topics);
    setMarkdownText(md);
    setMode('markdown');
    setErrorMessage(null);
  };

  const handleSwitchToVisual = () => {
    if (markdownText.trim()) {
      const parsed = parseStudioMarkdown(markdownText);
      if (parsed.length > 0) {
        setTopics(parsed);
      }
    }
    setMode('visual');
    setErrorMessage(null);
  };

  const handleGenerateSeries = (topicId: string, prefix: string, count: number, startAt: number = 1) => {
    if (!prefix.trim() || count <= 0) return;
    
    setTopics(prev => prev.map(topic => {
      if (topic.id !== topicId) return topic;
      
      const newTasks: StudioTaskSpec[] = [];
      for (let i = 0; i < count; i++) {
        const currentNum = startAt + i;
        const paddedNum = currentNum < 10 ? `0${currentNum}` : `${currentNum}`;
        newTasks.push({
          id: generateStudioId(),
          title: `${prefix.trim()} ${paddedNum}`,
          description: '',
          links: [{ id: generateStudioId(), url: '', title: '' }],
          notes: [{ id: generateStudioId(), text: '' }],
          priority: 'none'
        });
      }
      return { ...topic, tasks: [...topic.tasks, ...newTasks] };
    }));
  };

  const handleSave = () => {
    let finalTopics = topics;
    if (mode === 'markdown') {
      if (markdownText.trim()) {
        finalTopics = parseStudioMarkdown(markdownText);
      }
    }

    const validTopics = finalTopics.filter(t => t.title.trim() !== '');
    if (validTopics.length === 0) {
      setErrorMessage('Please enter at least one Topic Title.');
      return;
    }

    // Check title length
    for (const t of validTopics) {
      if (t.title.trim().length > 45) {
        setErrorMessage(`Topic title "${t.title.trim()}" exceeds 45 characters (${t.title.trim().length}/45).`);
        return;
      }
    }

    // Normalize URLs and filter empty tasks
    const sanitizedTopics = validTopics.map(t => ({
      ...t,
      title: t.title.trim(),
      links: t.links.filter(l => l.url.trim()).map(l => ({
        ...l,
        url: ensureExternalUrl(l.url.trim()),
        title: l.title.trim() || getAutoLinkTitle(l.url.trim())
      })),
      notes: t.notes.filter(n => n.text.trim()),
      tasks: t.tasks.filter(tk => tk.title.trim()).map(tk => ({
        ...tk,
        title: tk.title.trim(),
        description: tk.description?.trim() || '',
        links: (tk.links || []).filter(l => l.url && l.url.trim()).map(l => ({
          ...l,
          url: ensureExternalUrl(l.url.trim()),
          title: l.title.trim() || getAutoLinkTitle(l.url.trim())
        })),
        notes: (tk.notes || []).filter(n => n.text && n.text.trim()),
        priority: tk.priority || 'none'
      }))
    }));

    onSave(sanitizedTopics);
  };

  const addTopic = () => {
    setTopics(prev => [
      ...prev,
      {
        id: generateStudioId(),
        title: '',
        section: initialSection,
        color: PALETTES[prev.length % PALETTES.length].id,
        icon: EXACT_TOPIC_ICONS[prev.length % EXACT_TOPIC_ICONS.length].id,
        links: [{ id: generateStudioId(), url: '', title: '' }],
        notes: [{ id: generateStudioId(), text: '' }],
        tasks: []
      }
    ]);
  };

  const removeTopic = (id: string) => {
    if (topics.length === 1) return;
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const duplicateTopic = (topic: StudioTopicSpec) => {
    const duplicated: StudioTopicSpec = {
      ...topic,
      id: generateStudioId(),
      title: `${topic.title} (Copy)`.slice(0, 45),
      links: topic.links.map(l => ({ ...l, id: generateStudioId() })),
      notes: topic.notes.map(n => ({ ...n, id: generateStudioId() })),
      tasks: topic.tasks.map(tk => ({ 
        ...tk, 
        id: generateStudioId(),
        links: (tk.links || []).map(l => ({ ...l, id: generateStudioId() })),
        notes: (tk.notes || []).map(n => ({ ...n, id: generateStudioId() }))
      }))
    };
    
    const idx = topics.findIndex(t => t.id === topic.id);
    const newTopics = [...topics];
    newTopics.splice(idx + 1, 0, duplicated);
    setTopics(newTopics);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={handleAttemptClose}
      />
      
      {/* Main Studio Modal Box - Native Fullscreen on Mobile (100dvh), Floating Dialog on Desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="relative bg-[#F8FAFC] w-full max-w-5xl h-[100dvh] sm:h-[90vh] sm:max-h-[90vh] rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-slate-200 z-10"
      >
        {/* Header - Responsive Layout for Mobile and Desktop */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 shadow-2xs z-10">
          {/* Top Line: Brand / Title / Subtext + Mobile Close */}
          <div className="flex items-start justify-between sm:justify-start gap-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#176BFF] to-[#2563EB] flex items-center justify-center shadow-xs text-white shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Smart Topic Studio
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                  Create multiple topics, series tasks, links & notes in seconds
                </p>
              </div>
            </div>

            {/* Mobile-Only Close Button */}
            <button 
              type="button"
              onClick={handleAttemptClose} 
              className="sm:hidden p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Controls: Segmented Switcher (2nd line on mobile, right-aligned on desktop) + Desktop Close */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* View Switcher */}
            <div className="inline-flex items-center bg-[#F1F5F9] border border-slate-200/90 rounded-lg overflow-hidden shadow-2xs w-full sm:w-auto">
              <button 
                type="button"
                onClick={handleSwitchToVisual}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs transition-all duration-150 cursor-pointer text-center ${
                  mode === 'visual' 
                    ? 'bg-white text-[#2563EB] font-bold rounded-lg shadow-xs' 
                    : 'text-[#475569] font-semibold hover:text-slate-900'
                }`}
              >
                Visual Form
              </button>
              <button 
                type="button"
                onClick={handleSwitchToMarkdown}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs transition-all duration-150 cursor-pointer text-center ${
                  mode === 'markdown' 
                    ? 'bg-white text-[#2563EB] font-bold rounded-lg shadow-xs' 
                    : 'text-[#475569] font-semibold hover:text-slate-900'
                }`}
              >
                Markdown Text
              </button>
            </div>

            <div className="hidden sm:block w-px h-5 bg-slate-200"></div>

            {/* Desktop-Only Close Button */}
            <button 
              type="button"
              onClick={handleAttemptClose} 
              className="hidden sm:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2.5 flex items-center justify-between text-red-700 text-xs font-semibold shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800 text-xs font-bold cursor-pointer">Dismiss</button>
          </div>
        )}

        {/* Modal Body - Perfectly Scrollable */}
        <div className={`flex-1 min-h-0 overflow-y-auto p-4 sm:px-7 custom-scrollbar ${mode === 'markdown' ? 'py-4 flex flex-col' : 'sm:py-6 pb-16'}`}>
          {mode === 'markdown' ? (
            <div className="flex-1 flex flex-col w-full mx-auto min-h-0">
              {/* Single Unified Markdown Box - Stretches from top to bottom */}
              <div className="flex-1 flex flex-col bg-white border border-[#E2E8F0] focus-within:border-blue-500 rounded-[8px] shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition-all overflow-hidden">
                {/* 1. Main Textarea Area */}
                <textarea
                  value={markdownText}
                  onChange={e => {
                    setMarkdownText(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={`# Topic: Physics 1st Paper - Vector\n@section: Term 1\n@color: blue\n@icon: atom\n@link: https://drive.google.com/vector-sheet (Full Drive Chapter)\n@note: Complete all 5 lectures and board questions.\n\n- Task: Lecture 01 - Vector Addition\n  * desc: Parallelogram law derivation and problem solving\n  * link: https://youtube.com/watch?v=sample1 (Lecture 1)\n  * link: https://drive.google.com/sample1-notes (Lecture 1 PDF)\n  * note: Practice page 42 math\n  * note: Revise special case 3\n  * priority: high\n\n- Task: Lecture 02 - Dot and Cross Product\n  * link: https://youtube.com/watch?v=sample2\n  * priority: medium`}
                  className="flex-1 w-full p-4 bg-transparent border-none text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none resize-none leading-relaxed custom-scrollbar min-h-[180px]"
                />

                {/* 2. Embedded Syntax Guide Accordion at Bottom of the Box */}
                <div className="border-t border-slate-200/90 bg-slate-50/70 px-3.5 py-2.5 flex flex-col transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 leading-none">
                      Markdown Syntax Guide
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsMarkdownSyntaxHelpOpen(!isMarkdownSyntaxHelpOpen)}
                      className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1 leading-none"
                    >
                      <span>{isMarkdownSyntaxHelpOpen ? 'Hide Guide' : 'Syntax Guide'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMarkdownSyntaxHelpOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Collapsible Format Guide Help Grid */}
                  <div
                    className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isMarkdownSyntaxHelpOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 text-[11px] font-mono select-none">
                        {/* 1. Topic Title */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-blue-600 text-[10.5px]"># Topic: Topic Name</span>
                          <p className="text-[10px] font-sans text-slate-500">Creates Topic title & group</p>
                        </div>
                        {/* 2. Topic Section */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-indigo-600 text-[10.5px]">@section: Section Name</span>
                          <p className="text-[10px] font-sans text-slate-500">Assigns topic to section</p>
                        </div>
                        {/* 3. Topic Color */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-sky-600 text-[10.5px]">@color: blue | purple | green</span>
                          <p className="text-[10px] font-sans text-slate-500">orange, pink, cyan, amber</p>
                        </div>
                        {/* 4. Topic Icon */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-cyan-600 text-[10.5px]">@icon: atom | bookopen</span>
                          <p className="text-[10px] font-sans text-slate-500">code2, brain, map, target, zap</p>
                        </div>
                        {/* 5. Topic Link */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-blue-600 text-[10.5px]">@link: URL (Title)</span>
                          <p className="text-[10px] font-sans text-slate-500">Adds global Drive/Web link</p>
                        </div>
                        {/* 6. Topic Note */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-amber-600 text-[10.5px]">@note: Overview notes</span>
                          <p className="text-[10px] font-sans text-slate-500">Adds global chapter notes</p>
                        </div>
                        {/* 7. Task Item */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-emerald-600 text-[10.5px]">- Task: Lecture Title</span>
                          <p className="text-[10px] font-sans text-slate-500">Creates task under topic</p>
                        </div>
                        {/* 8. Task Description */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-slate-700 text-[10.5px]">  * desc: Task details</span>
                          <p className="text-[10px] font-sans text-slate-500">Adds description to task</p>
                        </div>
                        {/* 9. Task Priority */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-rose-600 text-[10.5px]">  * priority: high | med | low</span>
                          <p className="text-[10px] font-sans text-slate-500">Sets task priority flag</p>
                        </div>
                        {/* 10. Task Link */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-blue-500 text-[10.5px]">  * link: URL (Title)</span>
                          <p className="text-[10px] font-sans text-slate-500">Adds link to specific task</p>
                        </div>
                        {/* 11. Task Note */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-amber-500 text-[10.5px]">  * note: Note text</span>
                          <p className="text-[10px] font-sans text-slate-500">Adds note to specific task</p>
                        </div>
                        {/* 12. Multiple Topics */}
                        <div className="p-1.5 bg-white rounded-[6px] border border-slate-200/90 shadow-2xs">
                          <span className="font-bold text-purple-600 text-[10.5px]"># Next Topic Name</span>
                          <p className="text-[10px] font-sans text-slate-500">Define multiple topics in 1 script</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full mx-auto pb-12">
              <AnimatePresence initial={false}>
                {topics.map((topic, topicIdx) => (
                  <motion.div
                    key={topic.id}
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <TopicCardBlock 
                      topic={topic}
                      topicIdx={topicIdx}
                      sections={sections}
                      onUpdate={(updated: StudioTopicSpec) => {
                        const newTopics = [...topics];
                        newTopics[topicIdx] = updated;
                        setTopics(newTopics);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      onRemove={() => removeTopic(topic.id)}
                      onDuplicate={() => duplicateTopic(topic)}
                      canRemove={topics.length > 1}
                      onGenerateSeries={(prefix: string, count: number, startAt: number) => handleGenerateSeries(topic.id, prefix, count, startAt)}
                      onRequestConfirm={setConfirmDialog}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button 
                type="button"
                onClick={addTopic}
                className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-[5px] flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                Add Another Topic Block
              </button>
            </div>
          )}
        </div>

        {/* Footer - Fixed Height at Bottom */}
        <div className="px-4 sm:px-7 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 shadow-xs z-20">
          <div className="text-xs font-semibold text-slate-500">
            Total Topics: <strong className="text-slate-800 font-bold">{topics.length}</strong> &bull; Total Tasks: <strong className="text-slate-800 font-bold">{topics.reduce((acc, t) => acc + t.tasks.length, 0)}</strong>
            <span className="hidden sm:inline text-slate-400 ml-2 font-normal">(Ctrl + Enter to save)</span>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button 
              type="button"
              onClick={handleAttemptClose} 
              className="flex-1 sm:flex-none h-9 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="flex-2 sm:flex-none h-9 px-5 bg-[#176BFF] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
            >
              <Zap className="w-3.5 h-3.5 fill-white stroke-[1]" />
              Generate
            </button>
          </div>
        </div>

        {/* Simple Action Confirmation Dialog (Clear Tasks, Delete Task, Delete Topic - Instant close on Cancel) */}
        {confirmDialog && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/40 select-none animate-in fade-in duration-100">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 flex flex-col gap-3">
              <div className="flex flex-col gap-1 text-left">
                <h4 className="text-sm font-bold text-slate-900">{confirmDialog.title}</h4>
                {confirmDialog.message && (
                  <p className="text-xs text-slate-500 mt-0.5">{confirmDialog.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fn = confirmDialog.onConfirm;
                    setConfirmDialog(null);
                    fn();
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  {confirmDialog.confirmLabel || 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discard Confirmation Dialog - Instant close on Keep Editing */}
        {showDiscardConfirm && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/40 select-none animate-in fade-in duration-100">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-amber-600">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Discard unsaved changes?</h4>
                  <p className="text-xs text-slate-500 mt-0.5">All topics and tasks typed in this session will be lost.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDiscard}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Discard & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// =========================================================================
// TopicCardBlock Component with Direct Context Popover on Icon Click
// =========================================================================

interface TopicCardBlockProps {
  topic: StudioTopicSpec;
  topicIdx: number;
  sections: string[];
  onUpdate: (topic: StudioTopicSpec) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  canRemove: boolean;
  onGenerateSeries: (prefix: string, count: number, startAt: number) => void;
  onRequestConfirm?: (options: { title: string; message?: string; confirmLabel?: string; onConfirm: () => void }) => void;
}

const TopicCardBlock: React.FC<TopicCardBlockProps> = ({
  topic,
  topicIdx,
  sections,
  onUpdate,
  onRemove,
  onDuplicate,
  canRemove,
  onGenerateSeries,
  onRequestConfirm
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [showSectionMenu, setShowSectionMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [seriesPrefix, setSeriesPrefix] = useState('');
  const [seriesCount, setSeriesCount] = useState<string>('');
  const [seriesStartAt, setSeriesStartAt] = useState<string>('');

  const iconMenuRef = useRef<HTMLDivElement>(null);
  const sectionMenuRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Close context dropdown on click outside
  useEffect(() => {
    if (!showIconMenu && !showSectionMenu && !showActionMenu) return;
    const handleOutside = (e: MouseEvent) => {
      if (iconMenuRef.current && !iconMenuRef.current.contains(e.target as Node)) {
        setShowIconMenu(false);
      }
      if (sectionMenuRef.current && !sectionMenuRef.current.contains(e.target as Node)) {
        setShowSectionMenu(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setShowActionMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showIconMenu, showSectionMenu, showActionMenu]);

  const activeColorObj = PALETTES.find(p => p.id === topic.color) || PALETTES[0];
  const IconComponent = getLucideIconComponent(topic.icon);

  // Topic Link Change
  const handleTopicLinkUrlChange = (index: number, newUrl: string) => {
    const newLinks = [...topic.links];
    const oldTitle = newLinks[index].title;
    newLinks[index].url = newUrl;

    if (!oldTitle || oldTitle === 'Resource Link' || oldTitle === getAutoLinkTitle(newLinks[index].url)) {
      newLinks[index].title = getAutoLinkTitle(newUrl);
    }
    onUpdate({ ...topic, links: newLinks });
  };

  // Task Link Operations
  const handleTaskLinkUrlChange = (taskIdx: number, linkIdx: number, newUrl: string) => {
    const newTasks = [...topic.tasks];
    const targetTask = { ...newTasks[taskIdx] };
    const taskLinks = [...(targetTask.links || [])];
    
    const oldTitle = taskLinks[linkIdx]?.title;
    taskLinks[linkIdx] = {
      ...taskLinks[linkIdx],
      url: newUrl,
      title: (!oldTitle || oldTitle === 'Resource Link' || oldTitle === getAutoLinkTitle(taskLinks[linkIdx]?.url))
        ? getAutoLinkTitle(newUrl)
        : oldTitle
    };

    targetTask.links = taskLinks;
    newTasks[taskIdx] = targetTask;
    onUpdate({ ...topic, tasks: newTasks });
  };

  const handleTaskLinkTitleChange = (taskIdx: number, linkIdx: number, newTitle: string) => {
    const newTasks = [...topic.tasks];
    const targetTask = { ...newTasks[taskIdx] };
    const taskLinks = [...(targetTask.links || [])];
    taskLinks[linkIdx] = { ...taskLinks[linkIdx], title: newTitle };
    targetTask.links = taskLinks;
    newTasks[taskIdx] = targetTask;
    onUpdate({ ...topic, tasks: newTasks });
  };

  const handleAddTaskLink = (taskIdx: number) => {
    const newTasks = [...topic.tasks];
    const targetTask = { ...newTasks[taskIdx] };
    targetTask.links = [...(targetTask.links || []), { id: generateStudioId(), url: '', title: '' }];
    newTasks[taskIdx] = targetTask;
    onUpdate({ ...topic, tasks: newTasks });
  };

  const handleRemoveTaskLink = (taskIdx: number, linkId: string) => {
    const newTasks = [...topic.tasks];
    const targetTask = { ...newTasks[taskIdx] };
    targetTask.links = (targetTask.links || []).filter(l => l.id !== linkId);
    newTasks[taskIdx] = targetTask;
    onUpdate({ ...topic, tasks: newTasks });
  };

  // Task Note Operations
  const handleTaskNoteTextChange = (taskIdx: number, noteIdx: number, newText: string) => {
    const newTasks = [...topic.tasks];
    const targetTask = { ...newTasks[taskIdx] };
    const taskNotes = [...(targetTask.notes || [])];
    taskNotes[noteIdx] = { ...taskNotes[noteIdx], text: newText };
    targetTask.notes = taskNotes;
    newTasks[taskIdx] = targetTask;
    onUpdate({ ...topic, tasks: newTasks });
  };

  const handleAddTaskNote = (taskIdx: number) => {
    const newTasks = [...topic.tasks];
    const targetTask = { ...newTasks[taskIdx] };
    targetTask.notes = [...(targetTask.notes || []), { id: generateStudioId(), text: '' }];
    newTasks[taskIdx] = targetTask;
    onUpdate({ ...topic, tasks: newTasks });
  };

  const handleRemoveTaskNote = (taskIdx: number, noteId: string) => {
    const newTasks = [...topic.tasks];
    const targetTask = { ...newTasks[taskIdx] };
    targetTask.notes = (targetTask.notes || []).filter(n => n.id !== noteId);
    newTasks[taskIdx] = targetTask;
    onUpdate({ ...topic, tasks: newTasks });
  };

  const handleClearAllTasks = () => {
    if (topic.tasks.length === 0) return;
    if (onRequestConfirm) {
      onRequestConfirm({
        title: 'Are you sure you want to clear all tasks?',
        confirmLabel: 'Clear All',
        onConfirm: () => onUpdate({ ...topic, tasks: [] })
      });
    } else if (window.confirm(`Are you sure you want to delete all ${topic.tasks.length} tasks in "${topic.title || `Topic #${topicIdx + 1}`}"?`)) {
      onUpdate({ ...topic, tasks: [] });
    }
  };

  const handleDeleteTopic = () => {
    if (onRequestConfirm) {
      onRequestConfirm({
        title: 'Are you sure you want to delete this topic?',
        confirmLabel: 'Delete',
        onConfirm: onRemove
      });
    } else {
      onRemove();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (onRequestConfirm) {
      onRequestConfirm({
        title: 'Are you sure you want to delete this task?',
        confirmLabel: 'Delete',
        onConfirm: () => {
          const newTasks = topic.tasks.filter(t => t.id !== taskId);
          onUpdate({ ...topic, tasks: newTasks });
        }
      });
    } else {
      const newTasks = topic.tasks.filter(t => t.id !== taskId);
      onUpdate({ ...topic, tasks: newTasks });
    }
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-[5px] shadow-none transition-all duration-200 ${showIconMenu ? 'relative z-40' : 'relative z-10'}`}>
      {/* Header Bar - Ultra-Slim Single Row on Both Mobile and Desktop */}
      <div className={`bg-slate-50/90 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 relative min-h-[44px] ${isCollapsed ? 'rounded-[5px]' : 'rounded-t-[5px] border-b border-slate-200'}`}>
        {/* Left Side: Color/Icon + Topic Title Input */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
          {/* Topic Icon Button with 3-Dot Style Flyout Context Menu */}
          <div className="relative shrink-0" ref={iconMenuRef}>
            <button
              type="button"
              onClick={() => setShowIconMenu(!showIconMenu)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer ${activeColorObj.bgClass}`}
              title="Click to choose Color & Icon"
            >
              <IconComponent className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Context Flyout Popover */}
            <AnimatePresence>
              {showIconMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 6 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-10 left-0 z-[100] bg-white rounded-2xl p-4 shadow-2xl border border-slate-200/90 w-80 flex flex-col gap-3.5"
                >
                  {/* Flyout Header / Mini Live Preview */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${activeColorObj.bgClass} text-white flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Customize Theme</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowIconMenu(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1. Accent Color Row */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Choose Color</span>
                    <div className="grid grid-cols-7 gap-1.5">
                      {PALETTES.map(p => {
                        const isSelected = topic.color === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => onUpdate({ ...topic, color: p.id })}
                            className={`h-7 rounded-lg ${p.bgClass} flex items-center justify-center text-white cursor-pointer transition-all ${
                              isSelected ? 'ring-2 ring-offset-1 ring-slate-900 scale-105 shadow-xs' : 'hover:opacity-90 hover:scale-105'
                            }`}
                            title={p.name}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Topic Icons Grid */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Choose Icon</span>
                      {topic.icon && topic.icon !== 'bookopen' && (
                        <button
                          type="button"
                          onClick={() => onUpdate({ ...topic, icon: 'bookopen' })}
                          className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-6 gap-1 max-h-44 overflow-y-auto p-1 bg-slate-50 border border-slate-200/80 rounded-xl custom-scrollbar">
                      {EXACT_TOPIC_ICONS.map((item) => {
                        const Comp = item.comp;
                        const isSelected = (topic.icon || 'bookopen').toLowerCase() === item.id.toLowerCase();
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onUpdate({ ...topic, icon: item.id });
                            }}
                            title={item.label}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? `${activeColorObj.bgClass} text-white shadow-xs scale-105`
                                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                            }`}
                          >
                            <Comp className="w-3.5 h-3.5 stroke-[2.2]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Done button */}
                  <button
                    type="button"
                    onClick={() => setShowIconMenu(false)}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Apply & Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Single Unified Topic Title Input */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5 bg-white sm:bg-transparent border border-slate-200/80 sm:border-none px-2.5 sm:px-0 h-8 sm:h-auto rounded-lg focus-within:border-blue-500 shadow-none">
            <input 
              type="search"
              autoComplete="off"
              value={topic.title}
              maxLength={45}
              onChange={(e) => onUpdate({ ...topic, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              onFocus={(e) => {
                setIsTitleFocused(true);
                e.currentTarget.select();
              }}
              onBlur={() => {
                setIsTitleFocused(false);
              }}
              onClick={(e) => {
                setIsTitleFocused(true);
                e.currentTarget.select();
              }}
              placeholder={`Topic Name #${topicIdx + 1}`}
              className="bg-transparent border-none p-0 text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none w-full truncate selection:bg-blue-500 selection:text-white" 
            />
            {isTitleFocused && topic.title.length > 0 && (
              <span className={`text-[9px] sm:text-[10px] font-semibold shrink-0 ${topic.title.length >= 45 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {topic.title.length}/45
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Section -> [3-Dot + Collapse Arrow] */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 1. Section Selector (Fade from top to bottom) */}
          {sections.length > 0 && (
            <div className="relative mr-0.5" ref={sectionMenuRef}>
              <button
                type="button"
                onClick={() => setShowSectionMenu(!showSectionMenu)}
                className="flex items-center gap-1 bg-white hover:bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/90 shadow-2xs text-[11px] sm:text-xs font-bold text-slate-700 hover:text-slate-900 transition-all cursor-pointer active:scale-98 h-7 sm:h-8"
                title="Change Section"
              >
                <span className="hidden md:inline text-[10px] font-medium text-slate-400">Section:</span>
                <span className="max-w-[65px] sm:max-w-[100px] truncate text-slate-800 font-bold text-[11px]">{topic.section || sections[0]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${showSectionMenu ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              <AnimatePresence>
                {showSectionMenu && (
                  <motion.div
                    style={{ transformOrigin: 'top center' }}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-9 z-[80] bg-white rounded-xl p-1.5 shadow-xl border border-slate-200/90 min-w-[160px] flex flex-col gap-0.5"
                  >
                    {/* Subtle Flatter Caret Pointer Arrow targeting Section button */}
                    <div className="absolute -top-1 right-6 w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none" />

                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider relative z-10">
                      Select Section
                    </div>
                    {sections.map(sec => {
                      const isCurrent = (topic.section || sections[0]) === sec;
                      return (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => {
                            onUpdate({ ...topic, section: sec });
                            setShowSectionMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer relative z-10 ${
                            isCurrent
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{sec}</span>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Desktop Direct Actions (Duplicate & Delete) */}
          <div className="hidden sm:flex items-center gap-0.5">
            <button 
              type="button"
              onClick={onDuplicate} 
              title="Duplicate Topic" 
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {canRemove && (
              <button 
                type="button"
                onClick={handleDeleteTopic} 
                title="Delete Topic" 
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Mobile 3-Dot More Menu (Shifted directly next to the chevron) */}
          <div className="relative sm:hidden flex items-center -mr-1" ref={actionMenuRef}>
            <button
              type="button"
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="w-5 h-6 text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 rounded transition-colors cursor-pointer flex items-center justify-center"
              title="More Actions"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* 3-Dot Popover (Fades & expands from top-right corner to bottom-left) */}
            <AnimatePresence>
              {showActionMenu && (
                <motion.div
                  style={{ transformOrigin: 'top right' }}
                  initial={{ opacity: 0, scale: 0.85, x: 6, y: -6 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: 6, y: -6 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -right-2.5 top-8 z-[90] bg-white rounded-xl p-1.5 shadow-xl border border-slate-200/90 min-w-[140px] flex flex-col gap-0.5"
                >
                  {/* Subtle Flatter Caret Pointer Arrow positioned on the flat top border away from corner roundness */}
                  <div className="absolute -top-1 right-[15px] w-2 h-2 bg-white border-t border-l border-slate-200 rotate-45 pointer-events-none" />

                  <button
                    type="button"
                    onClick={() => {
                      onDuplicate();
                      setShowActionMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer relative z-10"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-500" />
                    <span>Duplicate</span>
                  </button>

                  {topic.tasks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        handleClearAllTasks();
                        setShowActionMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer relative z-10"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>Clear Tasks</span>
                    </button>
                  )}

                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowActionMenu(false);
                        handleDeleteTopic();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer relative z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Delete Topic</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Toggle Collapse Arrow Button (Separate Standalone Button) */}
          <button 
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)} 
            title={isCollapsed ? "Expand Topic" : "Collapse Topic"} 
            className="p-0.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded transition-colors cursor-pointer flex items-center justify-center"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '-rotate-90 text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Body - Smooth Accordion Expand/Collapse */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 flex flex-col gap-5">
              {/* Topic-Level Links & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Global Topic Links */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-blue-500" />
                  Topic Links (Drive / FB / Web)
                </span>
              </label>

              <div className="flex flex-col">
                <AnimatePresence initial={false}>
                  {topic.links.map((link, i) => (
                    <motion.div 
                      key={link.id}
                      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginBottom: 8 }}
                      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 w-full">
                        {/* URL Input */}
                        <div className="flex-1 w-full sm:w-1/2 min-h-[32px] shrink-0 flex items-center bg-white border border-slate-200 rounded-lg px-2.5 h-8 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400/20 shadow-2xs">
                          <div className="w-5 flex items-center justify-center shrink-0 mr-1">
                            {renderOfficialLinkIcon(link.url, link.title)}
                          </div>
                          <input 
                            type="search" 
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            value={link.url} 
                            onChange={e => handleTopicLinkUrlChange(i, e.target.value)} 
                            placeholder="Paste URL (https://...)" 
                            className="w-full bg-transparent border-none p-0 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium" 
                          />
                        </div>

                        {/* Title Input & Delete */}
                        <div className="flex-1 w-full sm:w-1/2 min-h-[32px] shrink-0 flex items-center gap-1">
                          <div className="flex-1 min-h-[32px] shrink-0 flex items-center bg-white border border-slate-200 rounded-lg px-2.5 h-8 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400/20 shadow-2xs">
                            <input 
                              type="search" 
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck="false"
                              value={link.title} 
                              onFocus={e => e.target.select()}
                              onClick={e => (e.target as HTMLInputElement).select()}
                              onChange={e => {
                                const newLinks = [...topic.links];
                                newLinks[i].title = e.target.value;
                                onUpdate({ ...topic, links: newLinks });
                              }} 
                              placeholder="Link Title (e.g. Full Notes Drive)" 
                              className="w-full bg-transparent border-none p-0 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium" 
                            />
                          </div>

                          <button 
                            type="button"
                            onClick={() => {
                              const newLinks = topic.links.filter(l => l.id !== link.id);
                              onUpdate({ ...topic, links: newLinks });
                            }} 
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer shrink-0 transition-colors"
                            title="Remove link"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button 
                  type="button"
                  onClick={() => onUpdate({ ...topic, links: [...topic.links, { id: generateStudioId(), url: '', title: '' }] })} 
                  className="self-start text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-0.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another topic link
                </button>
              </div>
            </div>

            {/* Global Topic Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  Topic Notes (Overview / Strategy)
                </span>
              </label>

              <div className="flex flex-col">
                <AnimatePresence initial={false}>
                  {topic.notes.map((note, i) => (
                    <motion.div 
                      key={note.id}
                      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginBottom: 8 }}
                      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-1 w-full shrink-0">
                        <textarea 
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck="false"
                          value={note.text} 
                          onChange={e => {
                            const newNotes = [...topic.notes];
                            newNotes[i].text = e.target.value;
                            onUpdate({ ...topic, notes: newNotes });
                          }} 
                          onFocus={e => {
                            const len = e.target.value.length;
                            e.target.setSelectionRange(len, len);
                          }}
                          placeholder="e.g. Master all 12 rules and practice 20 MCQs..." 
                          className="flex-1 h-[54px] py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none resize-none leading-relaxed text-justify shadow-2xs overflow-y-auto" 
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            const newNotes = topic.notes.filter(n => n.id !== note.id);
                            onUpdate({ ...topic, notes: newNotes });
                          }} 
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer shrink-0 transition-colors"
                          title="Remove note"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button 
                  type="button"
                  onClick={() => onUpdate({ ...topic, notes: [...topic.notes, { id: generateStudioId(), text: '' }] })} 
                  className="self-start text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-0.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add another topic note
                </button>
              </div>
            </div>
          </div>

          {/* Quick Task Series Generator - Smart Dual-Mode (Prefix Series vs Comma List) */}
          {(() => {
            const isCommaMode = seriesPrefix.includes(',') || seriesPrefix.includes('\n');
            const commaItems = isCommaMode
              ? seriesPrefix.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
              : [];
            
            const parsedCount = parseInt(seriesCount, 10);
            const countVal = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 1;

            const parsedStartAt = parseInt(seriesStartAt, 10);
            const startAtVal = Number.isFinite(parsedStartAt) ? parsedStartAt : 1;

            const handleExecute = () => {
              if (isCommaMode) {
                if (commaItems.length === 0) return;
                const newTasks: StudioTaskSpec[] = commaItems.map(itemTitle => ({
                  id: generateStudioId(),
                  title: itemTitle,
                  description: '',
                  links: [{ id: generateStudioId(), url: '', title: '' }],
                  notes: [{ id: generateStudioId(), text: '' }],
                  priority: 'none'
                }));
                onUpdate({ ...topic, tasks: [...topic.tasks, ...newTasks] });
                setSeriesPrefix('');
                setSeriesCount('');
                setSeriesStartAt('');
              } else if (seriesPrefix.trim()) {
                onGenerateSeries(seriesPrefix, countVal, startAtVal);
                setSeriesPrefix('');
                setSeriesCount('');
                setSeriesStartAt('');
              }
            };

            const isActionDisabled = isCommaMode 
              ? commaItems.length === 0 
              : (!seriesPrefix.trim() || countVal < 1);

            return (
              <div className="-mx-4 sm:-mx-5 bg-slate-50/90 border-y border-slate-200 px-4 sm:px-5 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* 1. Prefix Input (Fixed height, no shrink) */}
                <div className="flex-1 min-w-[140px] w-full sm:w-auto h-9 min-h-[36px] shrink-0 flex items-center bg-white border border-slate-200 rounded-lg px-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 shadow-2xs">
                  <input 
                    type="search" 
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={seriesPrefix} 
                    onChange={e => setSeriesPrefix(e.target.value)} 
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleExecute();
                      }
                    }}
                    placeholder="Task Name/Prefix (e.g. Lecture or A, B, C, D)" 
                    className="w-full bg-transparent border-none p-0 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium" 
                  />
                </div>

                {/* 2. Quantity, From, and Add Batch (On mobile: 3 items in 1 row; On desktop: inline) */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 h-9 min-h-[36px]">
                  {/* Google-Style Animated Floating Label Input Boxes */}
                  {(() => {
                    const hasPrefix = seriesPrefix.trim().length > 0;
                    const isQtyFromActive = hasPrefix && !isCommaMode;

                    return (
                      <div className={`flex items-center gap-2 flex-1 sm:flex-none transition-all duration-200 ${isQtyFromActive ? 'opacity-100' : 'opacity-30 pointer-events-none grayscale'}`}>
                        {/* Quantity Floating Input Box */}
                        <div className="relative bg-white border border-slate-200 rounded-lg h-9 px-2.5 flex-1 sm:w-[84px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 shadow-2xs flex items-center">
                          <input 
                            id={`qty-${topic.id}`}
                            type="text" 
                            inputMode="numeric"
                            autoComplete="off"
                            disabled={!isQtyFromActive}
                            placeholder=" " 
                            value={seriesCount} 
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setSeriesCount(val);
                            }} 
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleExecute();
                              }
                            }}
                            className="peer w-full bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 pt-0.5" 
                          />
                          <label 
                            htmlFor={`qty-${topic.id}`}
                            className="absolute left-2.5 text-slate-400 font-medium text-xs pointer-events-none transition-all duration-150 ease-out select-none top-1/2 -translate-y-1/2 px-1 leading-none
                              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2 peer-focus:text-[9.5px] peer-focus:font-bold peer-focus:text-blue-600 peer-focus:bg-slate-50
                              peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9.5px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-slate-600 peer-[:not(:placeholder-shown)]:bg-slate-50
                            "
                          >
                            Quantity
                          </label>
                        </div>

                        {/* From Floating Input Box */}
                        <div className="relative bg-white border border-slate-200 rounded-lg h-9 px-2.5 flex-1 sm:w-[76px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 shadow-2xs flex items-center">
                          <input 
                            id={`from-${topic.id}`}
                            type="text" 
                            inputMode="numeric"
                            autoComplete="off"
                            disabled={!isQtyFromActive}
                            placeholder=" " 
                            value={seriesStartAt} 
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setSeriesStartAt(val);
                            }} 
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleExecute();
                              }
                            }}
                            className="peer w-full bg-transparent border-none p-0 text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 pt-0.5" 
                          />
                          <label 
                            htmlFor={`from-${topic.id}`}
                            className="absolute left-2.5 text-slate-400 font-medium text-xs pointer-events-none transition-all duration-150 ease-out select-none top-1/2 -translate-y-1/2 px-1 leading-none
                              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:left-2 peer-focus:text-[9.5px] peer-focus:font-bold peer-focus:text-blue-600 peer-focus:bg-slate-50
                              peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9.5px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-slate-600 peer-[:not(:placeholder-shown)]:bg-slate-50
                            "
                          >
                            From
                          </label>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Add Batch Button */}
                  <button 
                    type="button"
                    onClick={handleExecute}
                    disabled={isActionDisabled}
                    className="h-9 px-3.5 sm:px-4 bg-[#176BFF] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    {isCommaMode 
                      ? `Add ${commaItems.length || 0} Custom Tasks` 
                      : (seriesCount !== '' ? `Add Batch (${countVal})` : 'Add Batch')}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Task Rows List */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Tasks in this Topic ({topic.tasks.length})
              </span>
              {topic.tasks.length > 0 && (
                <button 
                  type="button"
                  onClick={handleClearAllTasks} 
                  className="text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Clear All Tasks
                </button>
              )}
            </div>

            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {topic.tasks.map((task, taskIdx) => (
                  <motion.div
                    key={task.id}
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 8 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                  <div 
                    className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3.5 transition-colors flex flex-col gap-3 relative shadow-2xs"
                  >
                    {/* Top Row: Task Title & Priority & Delete */}
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full min-w-0">
                      <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2">
                        <span className="w-4 sm:w-5 text-[11px] font-bold text-slate-400 shrink-0">#{taskIdx + 1}</span>
                        <input 
                          type="search" 
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck="false"
                          value={task.title} 
                          onChange={e => {
                            const newTasks = [...topic.tasks];
                            newTasks[taskIdx].title = e.target.value;
                            onUpdate({ ...topic, tasks: newTasks });
                          }} 
                          placeholder="Task title (e.g. Present Continuous Tense)..." 
                          className="w-full min-w-0 flex-1 h-8 px-2 sm:px-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 rounded-lg text-xs font-bold text-slate-800 focus:outline-none transition-colors" 
                        />
                      </div>

                      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        <TaskPrioritySelector
                          value={task.priority || 'none'}
                          onChange={p => {
                            const newTasks = [...topic.tasks];
                            newTasks[taskIdx].priority = p;
                            onUpdate({ ...topic, tasks: newTasks });
                          }}
                        />

                        <button 
                          type="button"
                          onClick={() => handleDeleteTask(task.id)} 
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Remove task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Description Input */}
                    <input 
                      type="search" 
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      value={task.description} 
                      onChange={e => {
                        const newTasks = [...topic.tasks];
                        newTasks[taskIdx].description = e.target.value;
                        onUpdate({ ...topic, tasks: newTasks });
                      }} 
                      placeholder="Task Description / Details..." 
                      className="w-full h-7 px-2.5 bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-400 rounded-lg text-[11px] text-slate-700 focus:outline-none transition-colors" 
                    />

                    {/* Task Links & Task Notes Dual Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                      {/* Task Links */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                            <Link2 className="w-3 h-3 text-blue-500" />
                            Task Links ({(task.links || []).length})
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <AnimatePresence initial={false}>
                            {(task.links || []).map((link, linkIdx) => (
                              <motion.div 
                                key={link.id}
                                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginBottom: 6 }}
                                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="flex items-center gap-1 bg-slate-50/90 p-1 rounded-lg border border-slate-200 w-full shrink-0">
                                  <div className="w-5 flex items-center justify-center shrink-0">
                                    {renderOfficialLinkIcon(link.url, link.title)}
                                  </div>
                                  <input 
                                    type="search" 
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    value={link.url} 
                                    onChange={e => handleTaskLinkUrlChange(taskIdx, linkIdx, e.target.value)} 
                                    placeholder="URL (https://...)" 
                                    className="flex-1 min-w-[110px] h-6 px-1.5 bg-white border border-slate-200 rounded text-[11px] text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none" 
                                  />
                                  <input 
                                    type="search" 
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    value={link.title} 
                                    onFocus={e => e.target.select()}
                                    onClick={e => (e.target as HTMLInputElement).select()}
                                    onChange={e => handleTaskLinkTitleChange(taskIdx, linkIdx, e.target.value)} 
                                    placeholder="Title..." 
                                    className="w-20 sm:w-28 min-w-[70px] h-6 px-1.5 bg-white border border-slate-200 rounded text-[11px] text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none" 
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveTaskLink(taskIdx, link.id)} 
                                    className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer shrink-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          <button 
                            type="button"
                            onClick={() => handleAddTaskLink(taskIdx)} 
                            className="self-start text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-0.5 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add task link
                          </button>
                        </div>
                      </div>

                      {/* Task Notes */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-blue-500" />
                            Task Notes ({(task.notes || []).length})
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <AnimatePresence initial={false}>
                            {(task.notes || []).map((note, noteIdx) => (
                              <motion.div 
                                key={note.id}
                                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginBottom: 6 }}
                                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="flex items-center gap-1 bg-slate-50/90 p-1 rounded-lg border border-slate-200">
                                  <input 
                                    type="search" 
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck="false"
                                    value={note.text} 
                                    onChange={e => handleTaskNoteTextChange(taskIdx, noteIdx, e.target.value)} 
                                    placeholder="e.g. Page 42 formula..." 
                                    className="flex-1 h-6 px-2 bg-white border border-slate-200 rounded text-[11px] text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none" 
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveTaskNote(taskIdx, note.id)} 
                                    className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer shrink-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          <button 
                            type="button"
                            onClick={() => handleAddTaskNote(taskIdx)} 
                            className="self-start text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-0.5 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add task note
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            </div>
            
            <button 
              type="button"
              onClick={() => onUpdate({ 
                ...topic, 
                tasks: [
                  ...topic.tasks, 
                  { 
                    id: generateStudioId(), 
                    title: '', 
                    description: '', 
                    links: [{ id: generateStudioId(), url: '', title: '' }], 
                    notes: [{ id: generateStudioId(), text: '' }], 
                    priority: 'none' 
                  }
                ] 
              })}
              className="self-start mt-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Single Task
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
};
