import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { GameScreen } from '../screens/GameScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { MultiplayerScreen } from '../screens/MultiplayerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { StatsScreen } from '../screens/StatsScreen';

export type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' | 'dt' | 'vandale' | 'brand' };
  Result: { score: number; total: number; mode: string };
  Multiplayer: undefined;
  Settings: undefined;
  Shop: undefined;
  Stats: { tab?: 'stats' | 'achievements' | 'leaderboard' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [], // E.g. ['https://taalswipe.nl', 'taalswipe://']
  config: {
    screens: {
      Home: '',
      Game: 'game/:mode',
      Result: 'result',
      Multiplayer: 'multiplayer',
      Settings: 'settings',
      Shop: 'shop',
      Stats: 'stats',
    },
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Multiplayer" component={MultiplayerScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Shop" component={ShopScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Stats" component={StatsScreen} options={{ animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
