import React, { useState, useEffect } from 'react';
import { StatusBar, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import * as Font from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';
import { soundManager } from './src/audio/SoundManager';
import { PWAInstallPrompt } from './src/components/PWAInstallPrompt';
import { useAppTheme } from './src/theme/colors';

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);
  const systemScheme = useColorScheme();
  const theme = useAppTheme();
  const loadingBackground = systemScheme === 'dark' ? '#0F1012' : '#F6F4EF';

  useEffect(() => {
    Font.loadAsync({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
    })
      .then(() => setFontsLoaded(true))
      .catch((err) => setFontError(err));
  }, []);

  useEffect(() => {
    soundManager.init();

    // Register Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register(new URL('/sw.js', location.origin)).catch(() => {
        // Silently fail if SW registration fails
      });
    }

    const disableContextMenu = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    };

    if (typeof window !== 'undefined' && (window as any).addEventListener) {
      // @ts-ignore
      window.addEventListener('contextmenu', disableContextMenu);
    }

    return () => {
      soundManager.unload();
      if (typeof window !== 'undefined' && (window as any).removeEventListener) {
        // @ts-ignore
        window.removeEventListener('contextmenu', disableContextMenu);
      }
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: loadingBackground }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <AppNavigator />
      <PWAInstallPrompt />
    </GestureHandlerRootView>
  );
}

export default App;
