import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { parseSmartTopicInput } from '../utils/smartTopicParser';

interface SmartTopicGeneratorProps {
  onGenerate: (topicsWithTasks: { topicName: string; tasks: string[] }[]) => void;
  activeSectionName: string;
  onOpenStudio?: () => void;
}

export const SmartTopicGenerator: React.FC<SmartTopicGeneratorProps> = ({
  onGenerate,
  activeSectionName,
  onOpenStudio,
}) => {
  const [input, setInput] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parsed = parseSmartTopicInput(input);
    if (parsed.length > 0) {
      onGenerate(parsed);
      setInput('');
    }
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-[10px] p-4 mb-6 shadow-2xs">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-4 h-4 text-[#176BFF]" />
        <h3 className="text-xs font-bold text-slate-800 tracking-tight">Smart Topic Generator</h3>
        <span className="text-[10px] text-slate-400 font-normal">
          (Adding to section: <strong className="text-slate-600">{activeSectionName || 'Current Section'}</strong>)
        </span>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Physics, Physics[3], or Physics [Prefix, 5] then press Enter..."
            className="w-full h-[34px] px-3.5 bg-[#FAFBFD] border border-[#D8E0EC] rounded-[8px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#176BFF] focus:bg-white transition-all smart-tg-input"
          />
        </div>

        <button
          type="submit"
          className="h-[34px] px-5 bg-[#176BFF] hover:bg-blue-700 text-white font-semibold text-xs rounded-[8px] flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate</span>
        </button>

        {onOpenStudio && (
          <button
            type="button"
            onClick={onOpenStudio}
            className="h-[34px] px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-xs rounded-[8px] flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
            title="Open Smart Topic Studio"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Studio Mode</span>
          </button>
        )}
      </form>
    </div>
  );
};
