import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CustomSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  labelPrefix?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  labelPrefix = 'Sort by: ',
  className = '',
  icon = <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left select-none ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 px-2.5 flex items-center justify-between gap-1.5 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs ${
          isOpen
            ? 'border-blue-600 ring-2 ring-blue-500/15 text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/40'
            : 'border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {icon}
          <span className="truncate">
            {/* Full label with bracket e.g. "Sort: Date (Old → New)" on xl+ (>=1150px) */}
            <span className="hidden xl:inline">
              <span className="text-slate-400 dark:text-slate-500 font-medium">{labelPrefix}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{selectedOption?.label}</span>
            </span>

            {/* Category label e.g. "Sort: Date" / "Sort: Name" / "Sort: Progress" on screens < 1150px */}
            <span className="inline xl:hidden">
              <span className="text-slate-400 dark:text-slate-500 font-medium hidden min-[380px]:inline">{labelPrefix}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {selectedOption?.value ? selectedOption.value.charAt(0).toUpperCase() + selectedOption.value.slice(1) : selectedOption?.label}
              </span>
            </span>
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-1.5 w-48 z-50 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-black/50 backdrop-blur-md focus:outline-none"
            role="listbox"
          >
            <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Sort Options
            </div>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer my-0.5 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <span className="text-slate-500">{option.icon}</span>}
                    <span>{option.label}</span>
                  </div>
                  {isSelected && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
                      <Check className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                    </motion.span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
