import { useEffect, useState } from 'react';
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

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [promptReady, setPromptReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: Event) => {
      // Store the event but don't prevent default yet - only when we're ready to show our banner
      setDeferredPrompt(e as any);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone || (window.navigator as any).standalone === true) {
      setCanInstall(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const preparePrompt = () => {
    if (deferredPrompt && !promptReady) {
      setPromptReady(true);
    }
  };

  const install = async () => {
    if (!deferredPrompt) return false;
    
    // Now prevent default since we're showing our UI
    (deferredPrompt as any).preventDefault();
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setCanInstall(false);
      setPromptReady(false);
      return true;
    }
    setPromptReady(false);
    return false;
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

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      setSupported(true);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, [wakeLock]);

  const request = async () => {
    if (!supported || wakeLock) return;
    
    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      setWakeLock(lock);
      
      lock.addEventListener('release', () => {
        setWakeLock(null);
      });
    } catch (err) {
      console.warn('Wake Lock failed:', err);
    }
  };

  const release = async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  };

  // Auto-request if enabled
  useEffect(() => {
    if (autoRequest && supported && !wakeLock) {
      request();
    }
  }, [autoRequest, supported, wakeLock]);

  return { request, release, isActive: !!wakeLock, supported };
}