import React, { useRef, useCallback, useState } from 'react';

interface LongPressOptions {
  threshold?: number; // ms to trigger long press (default: 380ms matching Gemini Mobile App feel)
  onLongPress: (e: React.TouchEvent | React.MouseEvent) => void;
  onClick?: (e: React.TouchEvent | React.MouseEvent) => void;
}

export interface RippleState {
  x: number;
  y: number;
  key: number;
}

export function useLongPress({
  threshold = 380,
  onLongPress,
  onClick,
}: LongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const [ripple, setRipple] = useState<RippleState | null>(null);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      isLongPressRef.current = false;
      setIsPressed(true);
      const touch = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const relX = touch.clientX - rect.left;
      const relY = touch.clientY - rect.top;

      startPosRef.current = { x: touch.clientX, y: touch.clientY };

      // Spawn ripple animation on touch start
      setRipple({ x: relX, y: relY, key: Date.now() });

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress(e);
      }, threshold);
    },
    [onLongPress, threshold]
  );

  const cancel = useCallback(() => {
    setIsPressed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const move = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!startPosRef.current) return;
      const touch = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
      const dist = Math.hypot(
        touch.clientX - startPosRef.current.x,
        touch.clientY - startPosRef.current.y
      );
      if (dist > 10) {
        cancel();
      }
    },
    [cancel]
  );

  const end = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      cancel();
      if (!isLongPressRef.current && onClick) {
        onClick(e);
      }
    },
    [cancel, onClick]
  );

  return {
    handlers: {
      onTouchStart: start,
      onTouchEnd: end,
      onTouchMove: move,
      onMouseDown: start,
      onMouseUp: end,
      onMouseLeave: cancel,
    },
    ripple,
    isPressed,
  };
}
