import React, { useState, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import * as Font from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator';
import { soundManager } from './src/audio/SoundManager';

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    Font.loadAsync({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
      Inter_800ExtraBold,
      Inter_900Black,
    })
      .then(() => setFontsLoaded(true))
      .catch((err) => setFontError(err));
  }, []);

  useEffect(() => {
    soundManager.init();
    
    const disableContextMenu = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('contextmenu', disableContextMenu);
    }

    return () => {
      soundManager.unload();
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('contextmenu', disableContextMenu);
      }
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }}>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

export default App;
