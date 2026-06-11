import React from 'react'; // trigger reload
import { StatusBar, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { AppNavigator } from './src/navigation/AppNavigator';
import { soundManager } from './src/audio/SoundManager';
import { Titlebar } from './src/components/Titlebar';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Placeholder DSN, te vervangen met echte DSN
  debug: false,
});

function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  React.useEffect(() => {
    soundManager.init();
    
    const disableContextMenu = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('contextmenu', disableContextMenu);
    }

    return () => {
      soundManager.unload();
      if (typeof window !== 'undefined') {
        window.removeEventListener('contextmenu', disableContextMenu);
      }
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>LOADING FONTS...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Titlebar />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
