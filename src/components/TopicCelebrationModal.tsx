import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export interface CelebrationTopicData {
  id: string;
  title: string;
  workspaceName?: string;
  sectionName?: string;
  taskCount: number;
  timeSpentMinutes: number;
}

interface TopicCelebrationModalProps {
  topic: CelebrationTopicData;
  dailyGoal: {
    completed: number;
    target: number;
  };
  nextTopic: { id: string; title: string } | null;
  onStartNextTopic: (topicId: string) => void;
  onClose: () => void;
}

export const TopicCelebrationModal: React.FC<TopicCelebrationModalProps> = ({
  topic,
  nextTopic,
  onStartNextTopic,
  onClose,
}) => {
  // Format time spent cleanly
  const formatTimeSpent = (minutes: number) => {
    if (!minutes || minutes <= 0) return '0 minutes';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      const hrLabel = hrs === 1 ? '1 hour' : `${hrs} hours`;
      if (mins > 0) {
        return `${hrLabel} ${mins} min`;
      }
      return hrLabel;
    }
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
  };

  // Keyboard shortcut listener (Escape to close, Enter to continue/next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (nextTopic) {
          onStartNextTopic(nextTopic.id);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextTopic, onStartNextTopic, onClose]);

  return (
    <div className="fixed inset-0 z-[99999990] flex items-center justify-center p-4 select-none">
      {/* Soft Ambient Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Main Reference Card (100% Identical to Image 2) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 24, stiffness: 350, mass: 0.8 }}
        className="relative w-full max-w-[440px] bg-white rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden text-slate-800 pointer-events-auto"
      >
        {/* Top Banner & Vector Gold Ribbon Medal Header */}
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#1E3A8A] to-[#1D4ED8]">
          <svg
            className="w-full h-auto block select-none"
            viewBox="125 75 750 435"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Vibrant Blue Banner Gradient */}
              <linearGradient id="banner" x1="125" y1="75" x2="875" y2="340" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="38%" stopColor="#1d4ed8" />
                <stop offset="75%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              {/* Ribbons Gradients */}
              <linearGradient id="ribbon" x1="427" y1="375" x2="458" y2="489" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <linearGradient id="ribbonRight" x1="573" y1="375" x2="542" y2="489" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>

              {/* Gold Medal Elements Gradients */}
              <linearGradient id="seal" x1="500" y1="194" x2="500" y2="432" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffdd70" />
                <stop offset="50%" stopColor="#ffca4a" />
                <stop offset="100%" stopColor="#ffb72b" />
              </linearGradient>
              <linearGradient id="ring" x1="500" y1="228" x2="500" y2="399" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffca4b" />
                <stop offset="100%" stopColor="#ffa800" />
              </linearGradient>
              <linearGradient id="coin" x1="500" y1="238" x2="500" y2="388" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffdf66" />
                <stop offset="100%" stopColor="#ffbd1d" />
              </linearGradient>
              <linearGradient id="star" x1="500" y1="273" x2="500" y2="352" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fff2c0" />
                <stop offset="100%" stopColor="#ffefad" />
              </linearGradient>

              {/* Drop Shadow for Medal */}
              <filter id="medalShadow" x="344" y="169" width="312" height="350" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feDropShadow dx="0" dy="13" stdDeviation="10" floodColor="#1e40af" floodOpacity="0.22" />
              </filter>
            </defs>

            {/* Bottom White Background under the curve */}
            <path d="M100 259 C223 325 346 358 500 366 C654 358 777 325 900 259 V520 H100 Z" fill="#ffffff" />

            {/* Blue Gradient Curved Banner (bleeds past top/side edges) */}
            <path d="M100 50 H900 V259 C777 325 654 358 500 366 C346 358 223 325 100 259 Z" fill="url(#banner)" />

            {/* Decorative Floating Confetti Elements */}
            <g transform="translate(125 93) scale(1.704545)">
              {/* Left sunburst */}
              <g transform="translate(42 24)" stroke="#FFDF58" strokeWidth="2.5" strokeLinecap="round">
                <line x1="0" y1="-14" x2="0" y2="-6" />
                <line x1="0" y1="6" x2="0" y2="14" />
                <line x1="-14" y1="0" x2="-6" y2="0" />
                <line x1="6" y1="0" x2="14" y2="0" />
                <line x1="-10" y1="-10" x2="-4.5" y2="-4.5" />
                <line x1="4.5" y1="4.5" x2="10" y2="10" />
                <line x1="10" y1="-10" x2="4.5" y2="-4.5" />
                <line x1="-4.5" y1="4.5" x2="-10" y2="10" />
              </g>

              {/* Right sunburst */}
              <g transform="translate(398 24)" stroke="#FF6E85" strokeWidth="2.5" strokeLinecap="round">
                <line x1="0" y1="-14" x2="0" y2="-6" />
                <line x1="0" y1="6" x2="0" y2="14" />
                <line x1="-14" y1="0" x2="-6" y2="0" />
                <line x1="6" y1="0" x2="14" y2="0" />
                <line x1="-10" y1="-10" x2="-4.5" y2="-4.5" />
                <line x1="4.5" y1="4.5" x2="10" y2="10" />
                <line x1="10" y1="-10" x2="4.5" y2="-4.5" />
                <line x1="-4.5" y1="4.5" x2="-10" y2="10" />
              </g>

              <polygon points="124,34 131,38 123,43" fill="#FF6E7A" />
              <circle cx="174" cy="32" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.85" />
              <circle cx="266" cy="30" r="5.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />
              <rect x="141" y="55" width="5" height="5" fill="#93C5FD" transform="rotate(45 143.5 57.5)" />
              <polygon points="94,68 99,63 101,70" fill="#FFFFFF" opacity="0.75" />
              <rect x="128" y="74" width="7" height="7" fill="#FFD54F" />
              <rect x="300" y="54" width="7" height="7" fill="#FFD54F" transform="rotate(25 303.5 57.5)" />
              <polygon points="342,46 351,49 344,57" fill="#FFD54F" />
              <polygon points="322,76 327,73 326,80" fill="#FF6E7A" />
              <circle cx="360" cy="62" r="3.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.75" />
            </g>

            {/* Vector Gold Ribbon Medal with In-Place 80% to 100% Scale Animation */}
            <motion.g
              style={{ transformOrigin: 'center center', transformBox: 'fill-box' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320, delay: 0.08 }}
              filter="url(#medalShadow)"
            >
              {/* Blue Ribbon Tails */}
              <path d="M425 371l-49.3 80.3c-2.8 3.8.6 8.7 5.2 7.7l33.3-7.1 13.4 31.8c2 6.6 7.2 7.4 10.8.5L486 398Z" fill="url(#ribbon)" />
              <path d="M575 371l49.3 80.3c2.8 3.8-.6 8.7-5.2 7.7l-33.3-7.1-13.4 31.8c-2 6.6-7.2 7.4-10.8.5L514 398Z" fill="url(#ribbonRight)" />

              {/* Gold Rosette Seal */}
              <path d="M486.8 204.9c8.6 3 17.8 3 26.4 0l26.2-9.1c7.5-2.6 15.7 1.2 19 8.4l11.5 25.1c3.8 8.3 10.4 14.9 18.7 18.7l21.2 9.7c7.3 3.3 11 11.5 8.5 19.1l-7.6 23c-2.8 8.5-2.8 17.7 0 26.2l7.6 23c2.5 7.6-1.2 15.8-8.5 19.1l-21.2 9.7c-8.3 3.8-14.9 10.4-18.7 18.7l-11.5 25.1c-3.3 7.2-11.5 11-19 8.4l-26.2-9.1c-8.6-3-17.8-3-26.4 0l-26.2 9.1c-7.5 2.6-15.7-1.2-19-8.4l-11.5-25.1c-3.8-8.3-10.4-14.9-18.7-18.7l-21.2-9.7c-7.3-3.3-11-11.5-8.5-19.1l7.6-23c2.8-8.5 2.8-17.7 0-26.2l-7.6-23c-2.5-7.6 1.2-15.8 8.5-19.1l21.2-9.7c8.3-3.8 14.9-10.4 18.7-18.7l11.5-25.1c3.3-7.2 11.5-11 19-8.4Z" fill="url(#seal)" />

              {/* Medal Center Discs */}
              <circle cx="500" cy="313" r="85.5" fill="url(#ring)" />
              <circle cx="500" cy="313" r="74.2" fill="url(#coin)" />
              <circle cx="500" cy="313" r="71.4" fill="none" stroke="#ffcf54" strokeWidth="1.5" opacity="0.75" />

              {/* Star Emblem */}
              <path d="M493.1 279.1c2.9-9.1 10.9-9.1 13.8 0l3.5 10.7c.9 2.8 3 4.3 5.9 4.3h11.3c9.5 0 12 7.6 4.3 13.2l-9.2 6.7c-2.4 1.7-3.2 4.2-2.3 7l3.5 10.7c2.9 9.1-3.5 13.8-11.2 8.2l-9.2-6.7c-2.4-1.7-5-1.7-7.4 0l-9.2 6.7c-7.7 5.6-14.2.9-11.2-8.2l3.5-10.7c.9-2.8.1-5.3-2.3-7l-9.2-6.7c-7.7-5.6-5.2-13.2 4.3-13.2h11.3c2.9 0 5-1.5 5.9-4.3Z" fill="url(#star)" />
            </motion.g>
          </svg>
        </div>

        {/* Content Section */}
        <div className="px-7 pt-1 pb-5.5 flex flex-col items-center text-center">
          {/* Main Title: Congratulations */}
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-[30px] font-black text-[#111827] tracking-tight leading-tight mb-1"
          >
            Congratulations!
          </motion.h1>

          {/* Subtitle Line: "You have successfully completed" */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-slate-500 text-[14px] font-normal mb-1 max-w-[360px]"
          >
            You have successfully completed
          </motion.p>

          {/* Topic Title in Primary Blue */}
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold text-blue-600 tracking-tight line-clamp-2 px-2 mb-3.5 leading-snug"
          >
            {topic.title}
          </motion.h2>

          {/* Clean Metric Bar (matching workspace modal style) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="w-full bg-slate-50/80 rounded-xl border border-slate-200/80 p-3 mb-5"
          >
            <div className="grid grid-cols-2 divide-x divide-slate-200/80 text-center">
              <div className="flex flex-col px-2">
                <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Tasks</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5">{topic.taskCount}</span>
              </div>
              <div className="flex flex-col px-2">
                <span className="text-[10.5px] font-medium text-slate-400 uppercase tracking-wider">Time Spent</span>
                <span className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                  {topic.timeSpentMinutes > 0 ? formatTimeSpent(topic.timeSpentMinutes) : '0 min'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="w-full flex flex-col gap-2.5"
          >
            {nextTopic ? (
              <button
                type="button"
                onClick={() => onStartNextTopic(nextTopic.id)}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span className="truncate">Start Next Topic: "{nextTopic.title}"</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${nextTopic
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25'
                }`}
            >
              Continue Learning
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
