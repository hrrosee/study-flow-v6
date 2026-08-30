import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSpring } from 'motion/react';
import { Clock, Check } from 'lucide-react';

export interface TimeWheelPickerProps {
  totalMinutes: number;
  onChange: (minutes: number) => void;
  maxHours?: number;
}

// Gentle micro-haptic synthesized mechanical ratchet click (crisp & subtle)
function playWheelTick() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.012);
    gain.gain.setValueAtTime(0.022, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.012);
  } catch {
    // audio context ignored if disabled by browser
  }
}

const ITEM_HEIGHT = 38;
const RADIUS = 75; // 3D Cylindrical radius for authentic depth curvature

interface CylinderColumnProps {
  value: number;
  max: number;
  onChange: (val: number) => void;
  ariaLabel: string;
  isInputMode?: boolean;
  onCenterClick?: () => void;
}

const CylinderColumn: React.FC<CylinderColumnProps> = ({
  value,
  max,
  onChange,
  ariaLabel,
  isInputMode = false,
  onCenterClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStartY = useRef<number>(0);
  const dragStartScroll = useRef<number>(0);
  const range = max + 1;

  // Track virtual continuous offset that never breaks direction across boundaries
  const virtualOffsetRef = useRef<number>(value);
  const [currentScrollPos, setCurrentScrollPos] = useState<number>(value);

  // Animated continuous scroll position using critically-damped spring physics
  const springScroll = useSpring(virtualOffsetRef.current, {
    stiffness: 420,
    damping: 36,
    mass: 0.7,
  });

  // Handle external value changes by taking shortest circular path
  useEffect(() => {
    const currentVirtual = virtualOffsetRef.current;
    const currentMod = ((currentVirtual % range) + range) % range;
    if (currentMod === value) return;

    let delta = value - currentMod;
    if (delta > range / 2) delta -= range;
    if (delta < -range / 2) delta += range;

    const nextVirtual = currentVirtual + delta;
    virtualOffsetRef.current = nextVirtual;
    springScroll.set(nextVirtual);
  }, [value, range, springScroll]);

  // Subscribe to live spring motion for 60fps/120fps 3D rendering
  useEffect(() => {
    const unsubscribe = springScroll.on('change', (latest) => {
      setCurrentScrollPos(latest);
    });
    return () => unsubscribe();
  }, [springScroll]);

  const commitStep = useCallback((delta: number) => {
    if (isInputMode) return;
    playWheelTick();
    const nextVirtual = virtualOffsetRef.current + delta;
    virtualOffsetRef.current = nextVirtual;
    springScroll.set(nextVirtual);

    const modValue = ((nextVirtual % range) + range) % range;
    onChange(modValue);
  }, [range, onChange, springScroll, isInputMode]);

  // Non-passive wheel event - strictly disabled during manual input mode
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isInputMode) return;

    let accumulatedDelta = 0;
    let wheelTimer: NodeJS.Timeout | null = null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      accumulatedDelta += e.deltaY;
      if (Math.abs(accumulatedDelta) >= 22) {
        const step = accumulatedDelta > 0 ? 1 : -1;
        accumulatedDelta = 0;
        commitStep(step);
      }

      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        accumulatedDelta = 0;
      }, 120);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [commitStep, isInputMode]);

  const isPointerMoved = useRef<boolean>(false);
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch and mouse drag gesture + instant click handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isInputMode) return;
    isDragging.current = true;
    isPointerMoved.current = false;
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    dragStartY.current = e.clientY;
    dragStartScroll.current = virtualOffsetRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isInputMode || !isDragging.current) return;
    const deltaY = e.clientY - dragStartY.current;
    if (Math.abs(deltaY) > 5) {
      if (!isPointerMoved.current) {
        isPointerMoved.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }
      const offsetItems = -deltaY / ITEM_HEIGHT;
      springScroll.set(dragStartScroll.current + offsetItems);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isInputMode || !isDragging.current) return;
    isDragging.current = false;

    if (isPointerMoved.current) {
      const deltaY = e.clientY - dragStartY.current;
      const steppedDiff = Math.round(-deltaY / ITEM_HEIGHT);
      if (steppedDiff !== 0) {
        commitStep(steppedDiff);
      } else {
        springScroll.set(virtualOffsetRef.current);
      }
    } else {
      // Direct click detected - calculate click position relative to the 3-row drum
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const clickY = e.clientY - rect.top;
        if (clickY < ITEM_HEIGHT) {
          // Upper row clicked -> shift exactly -1 step
          commitStep(-1);
        } else if (clickY > ITEM_HEIGHT * 2) {
          // Lower row clicked -> shift exactly +1 step
          commitStep(1);
        } else {
          // Center row clicked -> open manual typing mode
          if (onCenterClick) {
            onCenterClick();
          }
        }
      }
    }
  };

  const pad = (n: number) => {
    const modVal = ((Math.round(n) % range) + range) % range;
    return String(modVal).padStart(2, '0');
  };

  // Render 5 fixed virtual cylinder slots (indices: -2, -1, 0, 1, 2)
  const slots = [-2, -1, 0, 1, 2];
  const centerIndex = Math.round(currentScrollPos);

  return (
    <div
      ref={containerRef}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={value}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: isInputMode ? 'auto' : 'none', height: `${ITEM_HEIGHT * 3}px` }}
      className={`relative flex items-center justify-center select-none overflow-hidden w-full focus:outline-none ${
        isInputMode ? 'cursor-default' : 'cursor-ns-resize'
      }`}
    >
      {/* 3D Cylindrical Track Layer */}
      <div
        style={{
          perspective: '360px',
          perspectiveOrigin: 'center center',
          transformStyle: 'preserve-3d',
          height: `${ITEM_HEIGHT * 3}px`,
        }}
        className="relative w-full flex items-center justify-center pointer-events-none"
      >
        {slots.map((slotOffset) => {
          const itemNumber = centerIndex + slotOffset;
          const deltaFromScroll = itemNumber - currentScrollPos;

          // Pure 3D cylinder mathematics
          const angleRad = (deltaFromScroll * ITEM_HEIGHT) / RADIUS;
          const rotateXDeg = -angleRad * (180 / Math.PI);
          const translateYPx = Math.sin(angleRad) * RADIUS;
          const translateZPx = (Math.cos(angleRad) - 1) * RADIUS;

          // Scale & Opacity
          const absDelta = Math.abs(deltaFromScroll);
          const continuousScale = Math.max(0.72, 1 - Math.min(0.28, absDelta * 0.18));

          // When in manual input mode: hide all upper and lower numbers (slotOffset !== 0) completely
          const isOuterSlot = slotOffset !== 0;
          const continuousOpacity = (isInputMode && isOuterSlot)
            ? 0
            : Math.max(0.04, Math.cos(angleRad) ** 2.4);

          // Center item highlight
          const isCenter = absDelta < 0.4;

          return (
            <div
              key={slotOffset}
              style={{
                height: `${ITEM_HEIGHT}px`,
                position: 'absolute',
                top: `${ITEM_HEIGHT}px`, // vertically centered in 3-row container
                transform: `translate3d(0, ${translateYPx}px, ${translateZPx}px) rotateX(${rotateXDeg}deg) scale(${continuousScale})`,
                opacity: continuousOpacity,
                transition: isInputMode ? 'opacity 0.2s ease, transform 0.2s ease' : 'none',
                willChange: 'transform, opacity',
                visibility: isInputMode && isOuterSlot ? 'hidden' : 'visible',
              }}
              className={`w-full flex items-center justify-center ${
                isInputMode && isOuterSlot
                  ? 'pointer-events-none'
                  : isCenter || slotOffset === 0
                  ? 'pointer-events-auto cursor-text'
                  : 'pointer-events-auto cursor-pointer hover:opacity-90 active:scale-95 transition-transform'
              }`}
            >
              <span
                className={`text-2xl sm:text-[26px] font-sans font-black tabular-nums tracking-tight select-none transition-all duration-200 ${
                  isCenter
                    ? 'text-slate-900 dark:text-slate-100 drop-shadow-2xs hover:scale-105 cursor-text'
                    : 'text-slate-400/80 dark:text-slate-500/80 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {pad(itemNumber)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({
  totalMinutes,
  onChange,
  maxHours = 23,
}) => {
  const hours = Math.floor(Math.max(0, totalMinutes) / 60);
  const minutes = Math.max(0, totalMinutes) % 60;

  // Manual Input Mode State
  const [isInputMode, setIsInputMode] = useState<boolean>(false);
  const [typedHours, setTypedHours] = useState<string>(String(hours).padStart(2, '0'));
  const [typedMinutes, setTypedMinutes] = useState<string>(String(minutes).padStart(2, '0'));

  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const containerWrapperRef = useRef<HTMLDivElement>(null);

  // Sync typed state when external totalMinutes changes while NOT actively typing
  useEffect(() => {
    if (!isInputMode) {
      setTypedHours(String(hours).padStart(2, '0'));
      setTypedMinutes(String(minutes).padStart(2, '0'));
    }
  }, [hours, minutes, isInputMode]);

  // Open manual input mode
  const openInputMode = (targetField: 'hours' | 'minutes' = 'hours') => {
    setTypedHours(String(hours).padStart(2, '0'));
    setTypedMinutes(String(minutes).padStart(2, '0'));
    setIsInputMode(true);
    setTimeout(() => {
      if (targetField === 'hours') {
        hoursInputRef.current?.focus();
        hoursInputRef.current?.select();
      } else {
        minutesInputRef.current?.focus();
        minutesInputRef.current?.select();
      }
    }, 40);
  };

  // Close and commit manual input
  const commitManualInput = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const parsedH = Math.min(maxHours, Math.max(0, parseInt(typedHours, 10) || 0));
    const parsedM = Math.min(59, Math.max(0, parseInt(typedMinutes, 10) || 0));
    const newTotal = parsedH * 60 + parsedM;

    onChange(newTotal);
    setTypedHours(String(parsedH).padStart(2, '0'));
    setTypedMinutes(String(parsedM).padStart(2, '0'));
    setIsInputMode(false);
    playWheelTick();
  }, [typedHours, typedMinutes, maxHours, onChange]);

  // Handle outside clicks to close input mode gracefully
  useEffect(() => {
    if (!isInputMode) return;
    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      if (containerWrapperRef.current && !containerWrapperRef.current.contains(e.target as Node)) {
        commitManualInput();
      }
    };
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);
    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [isInputMode, commitManualInput]);

  const totalMinutesRef = useRef<number>(totalMinutes);
  useEffect(() => {
    totalMinutesRef.current = totalMinutes;
  }, [totalMinutes]);

  const handleHoursChange = useCallback((newHours: number) => {
    const currentM = Math.max(0, totalMinutesRef.current) % 60;
    const safeH = Math.min(maxHours, Math.max(0, newHours));
    const newTotal = safeH * 60 + currentM;
    totalMinutesRef.current = newTotal;
    onChange(newTotal);
  }, [maxHours, onChange]);

  const handleMinutesChange = useCallback((newMinutes: number) => {
    const currentH = Math.floor(Math.max(0, totalMinutesRef.current) / 60);
    const safeM = Math.min(59, Math.max(0, newMinutes));
    const newTotal = currentH * 60 + safeM;
    totalMinutesRef.current = newTotal;
    onChange(newTotal);
  }, [onChange]);

  // Direct typed hours handler
  const onTypedHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setTypedHours(val);

    // Auto-advance to minutes if 2 digits entered or single digit > 2
    if (val.length === 2 || (val.length === 1 && parseInt(val, 10) > 2)) {
      const numVal = Math.min(maxHours, parseInt(val, 10));
      setTypedHours(String(numVal).padStart(2, '0'));
      minutesInputRef.current?.focus();
      minutesInputRef.current?.select();
    }
  };

  // Direct typed minutes handler
  const onTypedMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setTypedMinutes(val);

    if (val.length === 2) {
      const numVal = Math.min(59, parseInt(val, 10));
      setTypedMinutes(String(numVal).padStart(2, '0'));
    }
  };

  return (
    <div ref={containerWrapperRef} className="w-full space-y-3 select-none">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Daily Study Time Target</span>
          </div>
          <p className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            Total focus minutes needed today across all workspaces
          </p>
        </div>

        {/* Done Action Button when in input mode */}
        {isInputMode && (
          <button
            type="button"
            onClick={commitManualInput}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95 text-white dark:text-slate-900 shadow-2xs transition-all cursor-pointer shrink-0"
            title="Save Target (Enter)"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Done</span>
          </button>
        )}
      </div>

      {/* Main Drum Wheel Picker Container (Clean Original Border & Shadows) */}
      <div
        style={{ touchAction: isInputMode ? 'auto' : 'none' }}
        className="max-w-[240px] mx-auto py-2.5 px-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs select-none relative overflow-hidden"
      >
        {/* Column Labels */}
        <div className="grid grid-cols-2 text-center text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
          <span>Hours</span>
          <span>Minutes</span>
        </div>

        {/* 3-Row Cylinder Wheel / Manual Input Container */}
        <div className="relative h-[114px] grid grid-cols-2">
          {/* Active Center Highlight Pill (Original Clean Look) */}
          <div className="absolute top-[38px] left-1 right-1 h-[38px] bg-slate-100/90 dark:bg-slate-800/90 rounded-xl border border-slate-200/70 dark:border-slate-700/70 pointer-events-none z-0 shadow-inner" />

          {/* Top & Bottom Depth Vignettes */}
          <div
            className={`absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent pointer-events-none z-20 transition-opacity duration-200 ${
              isInputMode ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent pointer-events-none z-20 transition-opacity duration-200 ${
              isInputMode ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Center Colon Separator */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[38px] h-[38px] flex items-center justify-center pointer-events-none z-20">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none -translate-y-0.5">:</span>
          </div>

          {/* If IN MANUAL INPUT MODE: Render clean seamless inputs matching original number styles */}
          {isInputMode ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commitManualInput();
              }}
              className="contents"
            >
              {/* Hours Input */}
              <div className="relative z-30 h-full flex items-center justify-center">
                <input
                  ref={hoursInputRef}
                  type="text"
                  inputMode="numeric"
                  enterKeyHint="next"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-autocomplete="none"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={typedHours}
                  onChange={onTypedHoursChange}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      const current = parseInt(typedHours, 10) || 0;
                      const next = current >= maxHours ? 0 : current + 1;
                      setTypedHours(String(next).padStart(2, '0'));
                      setTimeout(() => hoursInputRef.current?.select(), 0);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      const current = parseInt(typedHours, 10) || 0;
                      const next = current <= 0 ? maxHours : current - 1;
                      setTypedHours(String(next).padStart(2, '0'));
                      setTimeout(() => hoursInputRef.current?.select(), 0);
                    } else if (e.key === 'Tab' && !e.shiftKey) {
                      e.preventDefault();
                      minutesInputRef.current?.focus();
                      minutesInputRef.current?.select();
                    } else if (e.key === 'Enter' || e.key === ':' || e.key === 'ArrowRight') {
                      e.preventDefault();
                      minutesInputRef.current?.focus();
                      minutesInputRef.current?.select();
                    } else if (e.key === 'Escape') {
                      commitManualInput();
                    }
                  }}
                  style={{ backgroundColor: 'transparent', WebkitAppearance: 'none' }}
                  className="w-16 h-[38px] text-center font-sans font-black tabular-nums text-2xl sm:text-[26px] text-slate-900 dark:text-slate-100 bg-transparent !bg-transparent border-none outline-none focus:outline-none focus:ring-0 tracking-tight caret-slate-900 dark:caret-slate-100 select-all p-0 leading-none cursor-text font-[900]"
                  aria-label="Hours input"
                />
              </div>

              {/* Minutes Input */}
              <div className="relative z-30 h-full flex items-center justify-center">
                <input
                  ref={minutesInputRef}
                  type="text"
                  inputMode="numeric"
                  enterKeyHint="done"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-autocomplete="none"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-bwignore="true"
                  pattern="[0-9]*"
                  maxLength={2}
                  value={typedMinutes}
                  onChange={onTypedMinutesChange}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      const current = parseInt(typedMinutes, 10) || 0;
                      const next = current >= 59 ? 0 : current + 1;
                      setTypedMinutes(String(next).padStart(2, '0'));
                      setTimeout(() => minutesInputRef.current?.select(), 0);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      const current = parseInt(typedMinutes, 10) || 0;
                      const next = current <= 0 ? 59 : current - 1;
                      setTypedMinutes(String(next).padStart(2, '0'));
                      setTimeout(() => minutesInputRef.current?.select(), 0);
                    } else if (e.key === 'Tab') {
                      e.preventDefault();
                      if (e.shiftKey) {
                        hoursInputRef.current?.focus();
                        hoursInputRef.current?.select();
                      } else {
                        commitManualInput();
                      }
                    } else if (e.key === 'Backspace' && typedMinutes === '') {
                      hoursInputRef.current?.focus();
                      hoursInputRef.current?.select();
                    } else if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
                      hoursInputRef.current?.focus();
                      hoursInputRef.current?.select();
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      (e.target as HTMLInputElement).blur();
                      commitManualInput();
                    } else if (e.key === 'Escape') {
                      commitManualInput();
                    }
                  }}
                  style={{ backgroundColor: 'transparent', WebkitAppearance: 'none' }}
                  className="w-16 h-[38px] text-center font-sans font-black tabular-nums text-2xl sm:text-[26px] text-slate-900 dark:text-slate-100 bg-transparent !bg-transparent border-none outline-none focus:outline-none focus:ring-0 tracking-tight caret-slate-900 dark:caret-slate-100 select-all p-0 leading-none cursor-text font-[900]"
                  aria-label="Minutes input"
                />
              </div>
            </form>
          ) : (
            <>
              {/* Hours 3D Column (Infinite continuous cyclic loop) */}
              <CylinderColumn
                value={hours}
                max={maxHours}
                onChange={handleHoursChange}
                ariaLabel="Hours"
                isInputMode={isInputMode}
                onCenterClick={() => openInputMode('hours')}
              />

              {/* Minutes 3D Column (Infinite continuous cyclic loop) */}
              <CylinderColumn
                value={minutes}
                max={59}
                onChange={handleMinutesChange}
                ariaLabel="Minutes"
                isInputMode={isInputMode}
                onCenterClick={() => openInputMode('minutes')}
              />
            </>
          )}
        </div>
      </div>

      {/* Quick Presets Grid Below Wheel */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          Quick Presets:
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {[
            { label: '5H 00M', mins: 300 },
            { label: '6H 00M', mins: 360 },
            { label: '7H 00M', mins: 420 },
            { label: '7H 30M', mins: 450 },
            { label: '8H 00M', mins: 480 },
          ].map((preset) => {
            const isSelected = totalMinutes === preset.mins && !isInputMode;
            return (
              <button
                key={preset.mins}
                type="button"
                onClick={() => {
                  onChange(preset.mins);
                  const h = Math.floor(preset.mins / 60);
                  const m = preset.mins % 60;
                  setTypedHours(String(h).padStart(2, '0'));
                  setTypedMinutes(String(m).padStart(2, '0'));
                  setIsInputMode(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center select-none border whitespace-nowrap active:scale-95 flex items-center justify-center ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900/50 font-extrabold shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{preset.label}</span>
              </button>
            );
          })}

          {/* Custom Preset Button */}
          {(() => {
            const isCustom = isInputMode || ![300, 360, 420, 450, 480].includes(totalMinutes);
            return (
              <button
                type="button"
                onClick={() => openInputMode('hours')}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center select-none border whitespace-nowrap active:scale-95 flex items-center justify-center ${
                  isCustom
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-900/50 font-extrabold shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Custom</span>
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

