import React from 'react';
import { BarChart2 } from 'lucide-react';

interface TopicProgressCardProps {
  completedCount: number;
  pendingCount: number;
  onOpenAnalytics: () => void;
}

export const TopicProgressCard: React.FC<TopicProgressCardProps> = ({
  completedCount,
  pendingCount,
  onOpenAnalytics,
}) => {
  const total = completedCount + pendingCount;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // SVG donut calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-[10px] p-5 shadow-2xs select-none sticky top-6">
      <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase mb-6 text-center">
        Current Topic Progress
      </h3>

      {/* Donut Chart Display */}
      <div className="relative flex flex-col items-center justify-center mb-6">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#E9EDF3"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#176BFF"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{percentage}%</span>
        </div>

        <p className="text-xs font-bold text-slate-800 mt-3">
          {pendingCount} Tasks Remaining
        </p>
      </div>

      {/* Breakdown Section */}
      <div className="border-t border-[#E9EDF3] pt-4 mb-6 space-y-2.5">
        <span className="text-xs font-bold text-slate-800">Breakdown</span>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#176BFF]"></span>
            <span className="text-slate-600 font-medium">Done</span>
          </div>
          <span className="font-bold text-slate-900">{completedCount}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="text-slate-600 font-medium">Pending</span>
          </div>
          <span className="font-bold text-slate-900">{pendingCount}</span>
        </div>
      </div>

      {/* View Analytics Button */}
      <button
        onClick={onOpenAnalytics}
        className="w-full py-2.5 px-4 bg-[#FAFBFD] hover:bg-blue-50 border border-[#E5EAF2] hover:border-[#176BFF] text-[#176BFF] font-bold text-xs rounded-[8px] flex items-center justify-center gap-2 transition-all"
      >
        <BarChart2 className="w-4 h-4" />
        <span>View Analytics</span>
      </button>
    </div>
  );
};
