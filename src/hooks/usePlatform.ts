import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function usePlatform() {
  const [isWeb, setIsWeb] = useState(Platform.OS === 'web');
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
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

  const install = async () => {
    if (!deferredPrompt) return false;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setCanInstall(false);
      return true;
    }
    return false;
  };

  return { canInstall, install };
}

export function useKeyboardNavigation(enabled: boolean = true) {
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default behavior for input elements
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement ||
          (e.target as HTMLElement).contentEditable === 'true') {
        return;
      }

      // Handle common game keys
      if (['ArrowLeft', 'ArrowRight', 'Escape', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}

export function useWakeLock() {
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      setSupported(true);
    }
  }, []);

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

  return { request, release, isActive: !!wakeLock, supported };
}