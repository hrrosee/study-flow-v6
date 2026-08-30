import React, { useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { useLongPress } from '../hooks/useLongPress';

export interface MobileActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

interface MobileActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  actions: MobileActionItem[];
}

const DrawerOptionButton: React.FC<{
  action: MobileActionItem;
  onSelect: () => void;
}> = ({ action, onSelect }) => {
  const { handlers, ripple, isPressed } = useLongPress({
    threshold: 380,
    onLongPress: () => {
      // Touch & hold spawns ripple effect but does NOT trigger click action
    },
    onClick: () => {
      onSelect();
    },
  });

  return (
    <button
      type="button"
      {...handlers}
      className={`relative overflow-hidden w-full px-4 py-3.5 rounded-xl text-left text-[14px] font-semibold flex items-center gap-3.5 transition-colors cursor-pointer select-none ${
        isPressed ? (action.danger ? 'bg-red-50/80' : 'bg-slate-100/80') : ''
      } ${
        action.danger
          ? 'text-red-600 hover:bg-red-50/50 active:bg-red-100/60'
          : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
      }`}
    >
      {action.icon && (
        <span className={`w-5 h-5 shrink-0 flex items-center justify-center relative z-10 ${action.danger ? 'text-red-500' : 'text-slate-500'}`}>
          {action.icon}
        </span>
      )}
      <span className="flex-1 truncate relative z-10">{action.label}</span>

      {/* Touch Ripple Effect */}
      {ripple && (
        <motion.span
          key={ripple.key}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className={`absolute w-24 h-24 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 ${
            action.danger ? 'bg-red-500/25' : 'bg-blue-500/25'
          }`}
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
    </button>
  );
};

export const MobileActionDrawer: React.FC<MobileActionDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  actions,
}) => {
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const [shouldSnapToOrigin, setShouldSnapToOrigin] = React.useState<boolean>(true);
  const shouldSnapRef = React.useRef<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setShouldSnapToOrigin(true);
      shouldSnapRef.current = true;
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const handleDrag = (_: any, info: PanInfo) => {
    const drawerHeight = drawerRef.current?.offsetHeight || 350;
    const isPast60 = info.offset.y > drawerHeight * 0.6;
    const nextSnapState = !isPast60;

    if (shouldSnapRef.current !== nextSnapState) {
      shouldSnapRef.current = nextSnapState;
      setShouldSnapToOrigin(nextSnapState);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const drawerHeight = drawerRef.current?.offsetHeight || 350;
    const isFastDownwardSwipe = info.velocity.y > 200 && info.offset.y > 0;
    const isDraggedPast60Percent = info.offset.y > drawerHeight * 0.6;

    if (isFastDownwardSwipe || isDraggedPast60Percent) {
      if (shouldSnapRef.current) {
        shouldSnapRef.current = false;
        setShouldSnapToOrigin(false);
      }
      onClose();
    } else if (!shouldSnapRef.current) {
      shouldSnapRef.current = true;
      setShouldSnapToOrigin(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center select-none overflow-hidden touch-none">
          {/* Dynamic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, ease: [0.87, 0, 0.13, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } }}
            className="fixed inset-0 bg-slate-900/45 cursor-pointer transform-gpu"
            onClick={onClose}
          />

          {/* Dynamic Bottom Drawer with Facebook-Grade Velocity Spring Physics & GPU Optimization */}
          <motion.div
            ref={drawerRef}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            dragMomentum={false}
            dragSnapToOrigin={shouldSnapToOrigin}
            dragTransition={{
              bounceStiffness: 1400,
              bounceDamping: 60,
            }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%', transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
            className="relative z-10 w-full max-w-lg bg-white rounded-t-[24px] shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 border-t border-slate-200/90 pb-8 pt-3 px-4 flex flex-col overflow-hidden max-h-[85vh] transform-gpu will-change-transform touch-none select-none"
          >
            {/* Top Drag Handle Bar */}
            <div className="w-10 h-1.5 bg-slate-300/80 rounded-full mx-auto mb-4 shrink-0 cursor-grab active:cursor-grabbing" />

            {/* Centered Item Info Header */}
            {(title || subtitle) && (
              <div className="flex flex-col items-center justify-center text-center pb-3 mb-2 border-b border-slate-100 px-4 shrink-0">
                {title && <h3 className="text-[15px] font-bold text-slate-900 leading-tight tracking-tight">{title}</h3>}
                {subtitle && <p className="text-[13px] text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
              </div>
            )}

            {/* Action Items List with Touch Ripple Animation */}
            <div className="flex flex-col gap-0.5 overflow-y-auto py-1">
              {actions.map((action) => (
                <DrawerOptionButton
                  key={action.id}
                  action={action}
                  onSelect={() => {
                    action.onClick();
                    onClose();
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
