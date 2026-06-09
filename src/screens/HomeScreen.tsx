import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { ModeCard } from '../components/ModeCard';
import { StatsModal } from '../components/StatsModal';
import { SettingsModal } from '../components/SettingsModal';
import { ShopModal } from '../components/ShopModal';
import { BouncyButton } from '../components/BouncyButton';
import { Colors } from '../theme/colors';
import { statsStore, AppStats, getPlayerTitle } from '../store/statsStore';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' | 'dt' | 'vandale' | 'brand' };
  Result: { score: number; total: number; mode: string };
};

type Props = Readonly<NativeStackScreenProps<RootStackParamList, 'Home'>>;

export function HomeScreen({ navigation }: Props) {
  const [statsVisible, setStatsVisible] = React.useState(false);
  const [statsInitialTab, setStatsInitialTab] = React.useState<'stats' | 'achievements' | 'leaderboard'>('stats');
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const [shopVisible, setShopVisible] = React.useState(false);
  const [stats, setStats] = React.useState<AppStats | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentStats = await statsStore.getStats();
      setStats(currentStats);
    });
    return unsubscribe;
  }, [navigation]);

  const handleReset = async () => {
    await statsStore.resetStats();
    setStats(await statsStore.getStats());
  };

  const floatY = useSharedValue(0);

  React.useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BouncyButton 
            onPress={() => {
              setStatsInitialTab('stats');
              setStatsVisible(true);
            }} 
            style={styles.iconButton}
            color="#38BDF8" borderColor="#0284C7" bottomBorderColor="#0369A1"
          >
            <Text style={styles.iconText}>📊</Text>
          </BouncyButton>
          <BouncyButton 
            onPress={() => {
              setStatsInitialTab('leaderboard');
              setStatsVisible(true);
            }} 
            style={styles.iconButton}
            color="#F59E0B" borderColor="#D97706" bottomBorderColor="#B45309"
          >
            <Text style={styles.iconText}>🏆</Text>
          </BouncyButton>
          <BouncyButton 
            onPress={() => setShopVisible(true)} 
            style={styles.iconButton}
            color="#A78BFA" borderColor="#7C3AED" bottomBorderColor="#5B21B6"
          >
            <Text style={styles.iconText}>🛍️</Text>
          </BouncyButton>
          <BouncyButton 
            onPress={() => setSettingsVisible(true)} 
            style={styles.iconButton}
            color="#94A3B8" borderColor="#64748B" bottomBorderColor="#475569"
          >
            <Ionicons name="settings-sharp" size={20} color="#FFFFFF" />
          </BouncyButton>
        </View>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Title */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600).springify()}
            style={[styles.titleContainer, floatingStyle]}
          >
            <Text style={styles.titleEmoji}>🇳🇱</Text>
            <Text style={styles.title}>TaalSwipe</Text>
            {stats && (
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>⭐ {getPlayerTitle(stats.xp)} (Lvl {Math.floor(stats.xp / 100) + 1})</Text>
                </View>
                {stats.currentStreak > 0 && (
                  <View style={[styles.badge, { backgroundColor: 'rgba(255, 165, 0, 0.2)' }]}>
                    <Text style={[styles.badgeText, { color: '#FFD700' }]}>🔥 {stats.currentStreak} Dagen</Text>
                  </View>
                )}
              </View>
            )}
            <Text style={styles.subtitle}>Swipe je weg door de Nederlandse taal</Text>
          </Animated.View>

          {/* Mode Buttons */}
          <View style={styles.buttonsContainer}>
            <ModeCard
              emoji="🗣️"
              title="Straattaal of AI?"
              description="Herken jij de echte straattaalwoorden tussen de AI-verzinsels?"
              color="#A78BFA"
              delay={200}
              onPress={() => navigation.navigate('Game', { mode: 'straattaal' })}
            />

            <ModeCard
              emoji="🇬🇧"
              title="Steenkolenengels"
              description="Make that the cat wise! Zijn deze letterlijke vertalingen echt?"
              color="#F472B6"
              delay={350}
              onPress={() => navigation.navigate('Game', { mode: 'dunglish' })}
            />

            <ModeCard
              emoji="⚡"
              title="Speed-Spelling"
              description="Snelheid is alles. Test je grammatica-kennis onder tijdsdruk."
              color="#38BDF8"
              delay={500}
              onPress={() => navigation.navigate('Game', { mode: 'spelling' })}
            />

            <ModeCard
              emoji="🧠"
              title="D/T Grammatica"
              description="Wordt het met een d, t, of dt? Test je kennis van de werkwoordspelling!"
              color="#F59E0B"
              delay={650}
              onPress={() => navigation.navigate('Game', { mode: 'dt' })}
            />

            <ModeCard
              emoji="📖"
              title="Dikke Van Dale"
              description="Staat dit woord officieel in het woordenboek of maken we het je maar wat wijs?"
              color="#10B981"
              delay={800}
              onPress={() => navigation.navigate('Game', { mode: 'vandale' })}
            />

            <ModeCard
              emoji="🏷️"
              title="Merknaam of Soortnaam"
              description="Is dit een beschermd merk of inmiddels een algemeen woord geworden?"
              color="#EF4444"
              delay={950}
              onPress={() => navigation.navigate('Game', { mode: 'brand' })}
            />
          </View>

          {/* Footer */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(400)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Swipe rechts = Echt • Swipe links = Nep</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <StatsModal
        visible={statsVisible}
        onClose={() => setStatsVisible(false)}
        onReset={handleReset}
        stats={stats}
        initialTab={statsInitialTab}
      />
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
      <ShopModal
        visible={shopVisible}
        onClose={() => setShopVisible(false)}
        stats={stats}
        onUpdateStats={setStats}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    zIndex: 10,
  },
  iconButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 44,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  buttonsContainer: {
    gap: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});
