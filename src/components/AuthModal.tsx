import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  KeyRound
} from 'lucide-react';
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  sendPasswordReset 
} from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isClosable?: boolean;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, isClosable = true }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format Firebase error message into user-friendly text
  const formatAuthError = (err: string): string => {
    if (err.includes('auth/invalid-credential') || err.includes('auth/wrong-password') || err.includes('auth/user-not-found')) {
      return 'Incorrect email or password. Please try again.';
    }
    if (err.includes('auth/email-already-in-use')) {
      return 'An account already exists with this email. Please sign in instead.';
    }
    if (err.includes('auth/weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (err.includes('auth/invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (err.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in was cancelled (popup was closed).';
    }
    if (err.includes('auth/popup-blocked')) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'this site';
      return `Sign-in popup was blocked by your browser. Please allow popups for ${currentHost}.`;
    }
    if (err.includes('auth/unauthorized-domain')) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      return `Unauthorized Domain: ${currentHost} is not authorized in Firebase Console > Authentication > Settings > Authorized domains.`;
    }
    if (err.includes('auth/operation-not-allowed') || err.includes('auth/configuration-not-found')) {
      return 'Google Sign-In is not enabled in Firebase Console > Authentication > Sign-in method.';
    }
    if (err.includes('auth/network-request-failed')) {
      return 'Network error. Please check your internet connection.';
    }
    return err.replace('Firebase: ', '').replace(/\(auth\/.*?\)\.?/, '').trim() || 'An error occurred. Please try again.';
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        console.error('Google Sign-In Error:', error);
        setErrorMessage(formatAuthError(error));
      } else if (user) {
        setSuccessMessage('Successfully signed in with Google!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 600);
      }
    } catch (err: any) {
      console.error('Google Sign-In Exception:', err);
      setErrorMessage(formatAuthError(err.message || 'Google sign in failed'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Please enter your registered email address.');
        return;
      }
      setLoading(true);
      const { success, error } = await sendPasswordReset(email.trim());
      setLoading(false);
      if (error) {
        setErrorMessage(formatAuthError(error));
      } else if (success) {
        setSuccessMessage('Password reset link sent! Check your email inbox.');
      }
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }

      setLoading(true);
      const { user, error } = await registerWithEmail(name.trim(), email.trim(), password);
      setLoading(false);

      if (error) {
        setErrorMessage(formatAuthError(error));
      } else if (user) {
        setSuccessMessage('Account created successfully! Welcome to Study Flow.');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 600);
      }
      return;
    }

    if (mode === 'signin') {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter your email and password.');
        return;
      }

      setLoading(true);
      const { user, error } = await loginWithEmail(email.trim(), password);
      setLoading(false);

      if (error) {
        setErrorMessage(formatAuthError(error));
      } else if (user) {
        setSuccessMessage('Welcome back!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 600);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isClosable ? onClose : undefined}
          className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${!isClosable ? 'pointer-events-auto cursor-default' : ''}`}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-[430px] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/80 overflow-hidden z-10"
        >
          {/* Close Button */}
          {isClosable && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          <div className="p-6 sm:p-7">
            {/* Header / Brand with Official Study Flow Logo */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center shadow-sm relative">
                <div className="preserve-color relative w-[26px] h-[26px] flex items-center justify-center shrink-0">
                  <div className="absolute top-0 left-0 w-[17px] h-[17px] bg-[#2563EB] rounded-[4.5px] shadow-3xs"></div>
                  <div className="absolute bottom-0 right-0 w-[17px] h-[17px] bg-[#6366F1]/90 backdrop-blur-[2px] rounded-[4.5px] mix-blend-multiply dark:mix-blend-screen dark:opacity-90 shadow-3xs"></div>
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {mode === 'signin' && 'Sign in to Study Flow'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot' && 'Reset your password'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {mode === 'signin' && 'Sync your study topics, streaks, and tasks across all devices.'}
                {mode === 'signup' && 'Get started with real-time cloud sync and smart analytics.'}
                {mode === 'forgot' && "Enter your email and we'll send you a password reset link."}
              </p>
            </div>

            {/* Google Sign In Button (Shown in signin and signup mode) */}
            {mode !== 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/90 active:bg-slate-100/90 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-3xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider absolute">
                    or with email
                  </span>
                </div>
              </>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2.5 rounded-xl bg-red-50/90 border border-red-200/80 text-red-700 text-xs font-medium flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </motion.div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-700 text-xs font-medium flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMessage}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name field (Only in signup mode) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. HR Rose"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password field (Not in forgot mode) */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setSuccessMessage(null);
                          setMode('forgot');
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                      className="w-full h-10 pl-10 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Only in Sign Up mode) */}
                  {mode === 'signup' && password.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex gap-1 h-1 w-full">
                        {[1, 2, 3, 4].map((step) => {
                          let strength = 0;
                          if (password.length >= 6) strength++;
                          if (password.length >= 8) strength++;
                          if (/[A-Z0-9]/.test(password)) strength++;
                          if (/[^A-Za-z0-9]/.test(password)) strength++;
                          return (
                            <div
                              key={step}
                              className={`flex-1 rounded-full transition-all duration-200 ${
                                strength >= step
                                  ? strength <= 1
                                    ? 'bg-rose-500'
                                    : strength <= 2
                                    ? 'bg-amber-500'
                                    : strength === 3
                                    ? 'bg-blue-500'
                                    : 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                        <span>Password strength</span>
                        <span className="font-bold">
                          {password.length < 6 && 'Too short'}
                          {password.length >= 6 && password.length < 8 && 'Fair'}
                          {password.length >= 8 && !/[^A-Za-z0-9]/.test(password) && 'Good'}
                          {password.length >= 8 && /[^A-Za-z0-9]/.test(password) && 'Strong ✨'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-10 mt-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'signin' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Switcher Footer */}
            <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
              {mode === 'signin' && (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      setMode('signup');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
                  >
                    Sign up
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      setMode('signin');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer ml-1"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('signin');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Back to Sign in</span>
                </button>
              )}
            </div>

            {/* Terms of service footnote */}
            <p className="mt-3 text-[10.5px] text-slate-400 text-center leading-tight">
              By continuing, you agree to Study Flow's Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
