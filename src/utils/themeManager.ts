export type ThemeMode = 'light' | 'dark' | 'system';
export type PrimaryAccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'amber';

const STORAGE_KEY = 'studyflow_user_settings';

/**
 * Detects if system (OS) preference is dark mode.
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * Resolves the actual effective theme ('light' or 'dark') based on the mode.
 */
export const resolveEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

/**
 * Applies the primary accent color ('blue', 'purple', 'cyan') to the document root.
 */
export const applyAccentColor = (accent: PrimaryAccentColor = 'blue'): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-accent', accent);
};

/**
 * Applies the theme to the document HTML element by adding/removing the 'dark' class
 * and updating the CSS color-scheme property.
 * Returns a cleanup function if a system listener was attached.
 */
export const applyTheme = (mode: ThemeMode = 'light', accent: PrimaryAccentColor = 'blue'): (() => void) => {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const root = document.documentElement;
  const effectiveTheme = resolveEffectiveTheme(mode);

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  // Also apply the accent color
  applyAccentColor(accent);

  // If system mode is selected, attach a listener to react to OS changes dynamically
  if (mode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }

  return () => {};
};

/**
 * Loads the initial saved theme mode from localStorage, defaulting to 'light'.
 */
export const getInitialTheme = (): ThemeMode => {
  if (typeof localStorage === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.theme === 'dark' || parsed.theme === 'light' || parsed.theme === 'system') {
        return parsed.theme;
      }
    }
  } catch {
    // fallback
  }
  return 'light';
};

/**
 * Loads the initial saved primary accent color from localStorage, defaulting to 'blue'.
 */
export const getInitialAccentColor = (): PrimaryAccentColor => {
  if (typeof localStorage === 'undefined') return 'blue';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const validAccents: PrimaryAccentColor[] = ['blue', 'purple', 'green', 'orange', 'pink', 'cyan', 'amber'];
      if (validAccents.includes(parsed.primaryColor)) {
        return parsed.primaryColor;
      }
    }
  } catch {
    // fallback
  }
  return 'blue';
};
