import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

export function usePlatform() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDesktop = () => {
        setIsDesktop(window.innerWidth >= 900);
      };
      checkDesktop();
      window.addEventListener('resize', checkDesktop);
      return () => window.removeEventListener('resize', checkDesktop);
    }
  }, []);

  return { isWeb, isDesktop, prefersReducedMotion };
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

// Capture beforeinstallprompt as soon as the module loads. The browser can
// fire it before React mounts, and a listener added in an effect misses it.
let deferredInstallPrompt: InstallPromptEvent | null = null;
const installPromptListeners = new Set<() => void>();
let installPromptListenerReady = false;

function notifyInstallPromptListeners() {
  installPromptListeners.forEach((listener) => listener());
}

function ensureInstallPromptListener() {
  if (installPromptListenerReady) return;
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;

  installPromptListenerReady = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    // Keep the browser's own install UI out of the way while we show ours.
    event.preventDefault();
    deferredInstallPrompt = event as InstallPromptEvent;
    notifyInstallPromptListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    notifyInstallPromptListeners();
  });
}

ensureInstallPromptListener();

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(deferredInstallPrompt);
  const [canInstall, setCanInstall] = useState(!!deferredInstallPrompt);
  const [promptReady, setPromptReady] = useState(false);

  useEffect(() => {
    ensureInstallPromptListener();

    const update = () => {
      setDeferredPrompt(deferredInstallPrompt);
      setCanInstall(!!deferredInstallPrompt);
    };

    installPromptListeners.add(update);
    update();

    // Also check if already installed.
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      if (isStandalone || (window.navigator as any).standalone === true) {
        setCanInstall(false);
      }
    }

    return () => {
      installPromptListeners.delete(update);
    };
  }, []);

  const preparePrompt = () => {
    if (deferredPrompt && !promptReady) {
      setPromptReady(true);
    }
  };

  const install = async () => {
    const promptEvent = deferredPrompt || deferredInstallPrompt;
    if (!promptEvent) return false;

    // A BeforeInstallPromptEvent can only be used once. Clear it before
    // awaiting so a second click can never reuse it.
    deferredInstallPrompt = null;
    setDeferredPrompt(null);
    setCanInstall(false);
    setPromptReady(false);

    try {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      return outcome === 'accepted';
    } catch {
      return false;
    }
  };

  return { canInstall, install, preparePrompt };
}

export function useKeyboardNavigation(enabled: boolean = true, customHandlers?: Record<string, (event: KeyboardEvent) => void>) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function' || !enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default behavior for input elements
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement ||
          (e.target as HTMLElement).contentEditable === 'true') {
        return;
      }

      // Preserve native activation for focused controls, including their children.
      if ((e.key === 'Enter' || e.key === ' ') &&
          e.target instanceof Element &&
          e.target.closest('button, a[href], [role="button"]')) {
        return;
      }

      // Handle custom handlers first
      if (customHandlers && customHandlers[e.key]) {
        e.preventDefault();
        customHandlers[e.key](e);
        return;
      }

      // Handle common game keys - only prevent default if enabled
      if (['ArrowLeft', 'ArrowRight', 'Escape', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, customHandlers]);
}

export function useWakeLock(autoRequest: boolean = false) {
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [supported, setSupported] = useState(false);
  const lockRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const requestInFlightRef = useRef(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      setSupported(true);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const lock = lockRef.current;
      lockRef.current = null;
      if (lock) {
        try {
          lock.release().catch(() => {});
        } catch {
          // Ignore release failures during teardown.
        }
      }
    };
  }, []);

  const request = async () => {
    if (!supported || lockRef.current || requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      if (!mountedRef.current) {
        lock.release().catch(() => {});
        return;
      }

      lockRef.current = lock;
      setWakeLock(lock);
      lock.addEventListener('release', () => {
        lockRef.current = null;
        if (mountedRef.current) setWakeLock(null);
      });
    } catch (err) {
      console.warn('Wake Lock failed:', err);
    } finally {
      requestInFlightRef.current = false;
    }
  };

  const release = async () => {
    const lock = lockRef.current;
    lockRef.current = null;
    setWakeLock(null);
    if (lock) {
      try {
        await lock.release();
      } catch {
        // The lock may already have been released by the browser.
      }
    }
  };

  useEffect(() => {
    if (!autoRequest || !supported) {
      if (lockRef.current) release();
      return;
    }

    request();

    // Browsers release the screen wake lock while the document is hidden.
    // Reacquire it when the active game becomes visible again.
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        request();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
    // request/release are intentionally omitted: they change identity every
    // render and including them would re-run this effect in a loop.
  }, [autoRequest, supported]);

  return { request, release, isActive: !!wakeLock, supported };
}
