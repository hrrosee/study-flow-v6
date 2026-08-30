import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Edit3, 
  KeyRound, 
  Users 
} from 'lucide-react';

interface UserProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  isOnline: boolean;
  currentStreak?: number;
  dailyGoalPercent?: number;
  onOpenEditProfile: () => void;
  onChangePassword: () => void;
  onSwitchAccount: () => void;
  onSignOut: () => void;
  position?: 'header' | 'sidebar' | 'desktop-sidebar';
  isCollapsed?: boolean;
}

export const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({
  isOpen,
  onClose,
  currentUser,
  isOnline,
  onOpenEditProfile,
  onChangePassword,
  onSwitchAccount,
  onSignOut,
  position = 'header',
  isCollapsed = false
}) => {
  if (!isOpen || !currentUser) return null;

  const isDesktopSidebar = position === 'desktop-sidebar';
  const isMobileSidebar = position === 'sidebar';
  const isAnySidebar = isDesktopSidebar || isMobileSidebar;

  let placementClasses = '';
  if (isDesktopSidebar) {
    placementClasses = isCollapsed
      ? 'fixed bottom-[12px] left-[64px] w-[208px]'
      : 'fixed bottom-[54px] left-[10px] w-[205px]';
  } else if (isMobileSidebar) {
    placementClasses = 'absolute bottom-full left-0 right-0 mb-2 w-auto';
  } else {
    placementClasses = 'absolute right-0 top-full mt-2 w-[220px]';
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ 
          opacity: 0, 
          y: isAnySidebar ? 8 : -8, 
          scale: 0.96 
        }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1 
        }}
        exit={{ 
          opacity: 0, 
          y: isAnySidebar ? 8 : -8, 
          scale: 0.96 
        }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={`${placementClasses} bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/15 rounded-xl p-1.5 z-[999999] text-xs select-none`}
      >
        {/* 1. Header: User Avatar, Name, Email */}
        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50/90 rounded-lg mb-1 border border-slate-100/90">
          <div className="relative w-7 h-7 shrink-0">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200/90 bg-white flex items-center justify-center shadow-3xs">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#3B82F6] to-[#1D4ED8] text-white font-black text-[10px] flex items-center justify-center uppercase">
                  {currentUser.displayName?.[0] || currentUser.email?.[0] || 'U'}
                </div>
              )}
            </div>
            {/* Live Micro Status Dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-white dark:ring-slate-900 pointer-events-none ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-bold text-slate-900 truncate text-[11.5px] leading-tight">
              {currentUser.displayName || 'Study Flow User'}
            </div>
            <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
              {currentUser.email}
            </div>
          </div>
        </div>

        {/* 2. Middle Action Menu: Edit Profile, Change Password, Switch Account */}
        <div className="space-y-0.5 py-0.5">
          {/* Edit Profile */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenEditProfile();
            }}
            className="w-full h-[29px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors font-medium text-[11.5px] cursor-pointer group"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="flex-1 text-left">Edit Profile</span>
          </button>

          {/* Change Password */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onChangePassword();
            }}
            className="w-full h-[29px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors font-medium text-[11.5px] cursor-pointer group"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="flex-1 text-left">Change Password</span>
          </button>

          {/* Switch Account */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchAccount();
            }}
            className="w-full h-[29px] px-2 rounded-md flex items-center gap-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors font-medium text-[11.5px] cursor-pointer group"
          >
            <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="flex-1 text-left">Switch Account</span>
          </button>
        </div>

        {/* 3. Bottom Danger Zone: Sign Out */}
        <div className="pt-0.5 mt-0.5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full h-[29px] px-2 rounded-md flex items-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors font-semibold text-[11.5px] cursor-pointer group"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            <span className="flex-1 text-left">Sign Out</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
