import React from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { GradientBackground } from '../components/GradientBackground';
import { ModeCard } from '../components/ModeCard';

import { BouncyButton } from '../components/BouncyButton';
import { Colors } from '../theme/colors';
import { statsStore, AppStats, getPlayerTitle } from '../store/statsStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'straattaal' | 'dunglish' | 'spelling' | 'dt' | 'vandale' | 'brand' };
  Result: { score: number; total: number; mode: string };
  Multiplayer: undefined;
  Settings: undefined;
  Shop: undefined;
  Stats: { tab?: 'stats' | 'achievements' | 'leaderboard' };
};

type Props = Readonly<NativeStackScreenProps<RootStackParamList, 'Home'>>;


export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [stats, setStats] = React.useState<AppStats | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

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

  // Keyboard navigation moved below modeCards

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

  const modeCards = [
    {
      emoji: '⚔️',
      title: 'Lokale Multiplayer',
      description: 'Speel samen op één scherm! Wie is het snelst?',
      color: '#A855F7',
      delay: 200,
      onPress: () => navigation.navigate('Multiplayer'),
    },
    {
      emoji: '🗣️',
      title: 'Straattaal of AI?',
      description: 'Herken jij de echte straattaalwoorden tussen de AI-verzinsels?',
      color: '#A78BFA',
      delay: 350,
      onPress: () => navigation.navigate('Game', { mode: 'straattaal' }),
    },
    {
      emoji: '🇬🇧',
      title: 'Steenkolenengels',
      description: 'Make that the cat wise! Zijn deze letterlijke vertalingen echt?',
      color: '#F472B6',
      delay: 350,
      onPress: () => navigation.navigate('Game', { mode: 'dunglish' }),
    },
    {
      emoji: '⚡',
      title: 'Speed-Spelling',
      description: 'Snelheid is alles. Test je grammatica-kennis onder tijdsdruk.',
      color: '#38BDF8',
      delay: 500,
      onPress: () => navigation.navigate('Game', { mode: 'spelling' }),
    },
    {
      emoji: '🧠',
      title: 'D/T Grammatica',
      description: 'Wordt het met een d, t, of dt? Test je kennis van de werkwoordspelling!',
      color: '#F59E0B',
      delay: 650,
      onPress: () => navigation.navigate('Game', { mode: 'dt' }),
    },
    {
      emoji: '📖',
      title: 'Dikke Van Dale',
      description: 'Staat dit woord officieel in het woordenboek of maken we het je maar wat wijs?',
      color: '#10B981',
      delay: 800,
      onPress: () => navigation.navigate('Game', { mode: 'vandale' }),
    },
    {
      emoji: '🏷️',
      title: 'Merknaam of Soortnaam',
      description: 'Is dit een beschermd merk of inmiddels een algemeen woord geworden?',
      color: '#EF4444',
      delay: 950,
      onPress: () => navigation.navigate('Game', { mode: 'brand' }),
    },
  ] as const;

  React.useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).addEventListener) return;
    const handleKeyDown = (e: KeyboardEvent) => {


      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex(prev => prev === null ? 0 : Math.min(prev + 1, modeCards.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex(prev => prev === null ? 0 : Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => prev === null ? 0 : Math.min(prev + 3, modeCards.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev === null ? 0 : Math.max(prev - 3, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex !== null) {
          e.preventDefault();
          modeCards[selectedIndex].onPress();
        }
      }
    };
    // @ts-ignore
    globalThis.window.addEventListener('keydown', handleKeyDown);
    // @ts-ignore
    return () => globalThis.window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, modeCards]);

  const renderModeCards = (compact = false) => (
    <>
      {modeCards.map((mode, idx) => (
        <ModeCard
          key={mode.title}
          emoji={mode.emoji}
          title={mode.title}
          description={mode.description}
          color={mode.color}
          delay={mode.delay}
          onPress={mode.onPress}
          compact={compact}
          isSelected={selectedIndex === idx}
          wrapperStyle={compact ? styles.desktopModeItem : undefined}
        />
      ))}
    </>
  );

  const accuracy = stats && stats.totalSwipes > 0
    ? Math.round((stats.totalCorrect / stats.totalSwipes) * 100)
    : 0;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {isDesktop ? (
          <>
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={['rgba(8,13,32,0.82)', 'rgba(30, 64, 175, 0.24)', 'rgba(236, 72, 153, 0.14)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.desktopShell}>
            <View style={styles.desktopRail}>
              <Text style={styles.railLogo}>TS</Text>
              <BouncyButton 
                onPress={() => navigation.navigate('Stats', { tab: 'stats' })} 
                style={styles.railButton}
                color="#38BDF8" borderColor="#0284C7" bottomBorderColor="#0369A1"
              >
                <Text style={styles.iconText}>📊</Text>
              </BouncyButton>
              <BouncyButton 
                onPress={() => navigation.navigate('Stats', { tab: 'leaderboard' })} 
                style={styles.railButton}
                color="#F59E0B" borderColor="#D97706" bottomBorderColor="#B45309"
              >
                <Text style={styles.iconText}>🏆</Text>
              </BouncyButton>
              <BouncyButton 
                onPress={() => navigation.navigate('Shop')} 
                style={styles.railButton}
                color="#A78BFA" borderColor="#7C3AED" bottomBorderColor="#5B21B6"
              >
                <Text style={styles.iconText}>🛍️</Text>
              </BouncyButton>
              <BouncyButton 
                onPress={() => navigation.navigate('Settings')} 
                style={styles.railButton}
                color="#94A3B8" borderColor="#64748B" bottomBorderColor="#475569"
              >
                <Ionicons name="settings-sharp" size={20} color="#FFFFFF" />
              </BouncyButton>
            </View>

            <ScrollView 
              contentContainerStyle={styles.desktopMain}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={styles.desktopHero}>
                <View style={styles.heroCopy}>
                  <Animated.View style={[styles.desktopFlag, floatingStyle]}>
                    <Text style={styles.titleEmoji}>🇳🇱</Text>
                  </Animated.View>
                  <View style={{ marginBottom: 12 }}>
                    <Image source={require('../../assets/logo.png')} style={{ width: 72, height: 72, resizeMode: 'contain' }} />
                  </View>
                  <Text style={styles.desktopTitle}>TaalSwipe</Text>
                  <Text style={styles.desktopSubtitle}>Snelle swipe-rondes voor spelling, straattaal, merken en taalkennis.</Text>
                  {stats && (
                    <View style={styles.badgeRow}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>⭐ {getPlayerTitle(stats.xp)} · Lvl {Math.floor(stats.xp / 100) + 1}</Text>
                      </View>
                      {stats.currentStreak > 0 && (
                        <View style={[styles.badge, { backgroundColor: 'rgba(255, 165, 0, 0.2)' }]}>
                          <Text style={[styles.badgeText, { color: '#FFD700' }]}>🔥 {stats.currentStreak} dagen</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                <View style={styles.heroStage}>
                  <View style={styles.stageCard}>
                    <Text style={styles.stageTitle}>← swipe →</Text>
                    <Text style={styles.stageBody}>Kies een modus en speel met muis, trackpad of toetsenbord.</Text>
                  </View>
                </View>
              </Animated.View>

              <View style={styles.desktopSectionHeader}>
                <Text style={styles.sectionTitle}>Modi</Text>
                <Text style={styles.sectionHint}>Klik een tegel om te starten</Text>
              </View>
              <View style={styles.desktopModeGrid}>
                {renderModeCards(true)}
              </View>
            </ScrollView>

            <View style={styles.desktopSidePanel}>
              <View style={styles.panelCard}>
                <Text style={styles.panelKicker}>Speler</Text>
                <Text style={styles.panelValue}>{stats?.xp ?? 0} XP</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Accuracy</Text>
                  <Text style={styles.metricValue}>{accuracy}%</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Combo record</Text>
                  <Text style={styles.metricValue}>{stats?.highestCombo ?? 0}</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Sessies</Text>
                  <Text style={styles.metricValue}>{stats?.sessionsPlayed ?? 0}</Text>
                </View>
              </View>

              <View style={styles.panelCard}>
                <Text style={styles.panelKicker}>Controls</Text>
                <View style={styles.keyRow}>
                  <Text style={styles.keyCap}>←</Text>
                  <Text style={styles.keyText}>links / nep / fout</Text>
                </View>
                <View style={styles.keyRow}>
                  <Text style={styles.keyCap}>→</Text>
                  <Text style={styles.keyText}>rechts / echt / goed</Text>
                </View>
                <View style={styles.keyRow}>
                  <Text style={styles.keyCap}>Esc</Text>
                  <Text style={styles.keyText}>pauze</Text>
                </View>
              </View>
            </View>
          </View>
          </>
        ) : (
          <>
        <View style={styles.header}>
          <BouncyButton 
            onPress={() => navigation.navigate('Stats', { tab: 'stats' })} 
            style={styles.iconButton}
            color="#38BDF8" borderColor="#0284C7" bottomBorderColor="#0369A1"
          >
            <Text style={styles.iconText}>📊</Text>
          </BouncyButton>
          <BouncyButton 
            onPress={() => navigation.navigate('Stats', { tab: 'leaderboard' })} 
            style={styles.iconButton}
            color="#F59E0B" borderColor="#D97706" bottomBorderColor="#B45309"
          >
            <Text style={styles.iconText}>🏆</Text>
          </BouncyButton>
          <BouncyButton 
            onPress={() => navigation.navigate('Shop')} 
            style={styles.iconButton}
            color="#A78BFA" borderColor="#7C3AED" bottomBorderColor="#5B21B6"
          >
            <Text style={styles.iconText}>🛍️</Text>
          </BouncyButton>
          <BouncyButton 
            onPress={() => navigation.navigate('Settings')} 
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
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={styles.titleContainer}>
            <Animated.View style={[styles.titleInner, floatingStyle]}>
              <View style={{ marginBottom: 16 }}>
                <Image source={require('../../assets/logo.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
              </View>
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
          </Animated.View>

          {/* Game Modes List */}
          <View style={styles.buttonsContainer}>
            {renderModeCards()}
          </View>

          {/* Footer */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(400)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>Swipe rechts = Echt • Swipe links = Nep</Text>
          </Animated.View>
        </ScrollView>
          </>
        )}
      </SafeAreaView>


    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  desktopShell: {
    flex: 1,
    flexDirection: 'row',
    gap: 22,
    padding: 28,
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
  },
  desktopRail: {
    width: 76,
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(8, 13, 28, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  railLogo: {
    fontFamily: 'Inter_900Black',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0,
  },
  railButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  desktopMain: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  desktopSidebar: {
    width: 64,
    backgroundColor: 'rgba(8, 13, 28, 0.85)',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  desktopHero: {
    flexDirection: 'row',
    minHeight: 260,
    borderRadius: 28,
    padding: 28,
    marginBottom: 22,
    backgroundColor: 'rgba(9, 14, 32, 0.52)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    overflow: 'hidden',
  },
  heroCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 24,
  },
  desktopFlag: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  desktopTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 58,
    color: Colors.textPrimary,
    letterSpacing: 0,
  },
  desktopSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 28,
    maxWidth: 560,
    marginTop: 8,
    marginBottom: 18,
  },
  heroStage: {
    width: 290,
    justifyContent: 'center',
  },
  stageCard: {
    minHeight: 216,
    borderRadius: 24,
    padding: 22,
    justifyContent: 'center',
    backgroundColor: 'rgba(9, 14, 32, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderBottomWidth: 8,
    borderBottomColor: 'rgba(0,0,0,0.42)',
  },

  stageTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 30,
    color: '#FFFFFF',
    letterSpacing: 0,
    marginBottom: 10,
  },
  stageBody: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 20,
  },

  desktopSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: 0,
  },
  sectionHint: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.textMuted,
  },
  desktopModeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  desktopModeItem: {
    width: '31.8%',
    minWidth: 250,
    flexGrow: 1,
  },
  desktopSidePanel: {
    width: 280,
    gap: 16,
  },
  panelCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(8, 13, 28, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  panelKicker: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 12,
    color: '#A5B4FC',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  panelValue: {
    fontFamily: 'Inter_900Black',
    fontSize: 34,
    color: '#FFFFFF',
    letterSpacing: 0,
    marginBottom: 14,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  metricLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.62)',
  },
  metricValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  keyCap: {
    minWidth: 42,
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 13,
  },
  keyText: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
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
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleInner: {
    alignItems: 'center',
  },
  titleEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 44,
    color: Colors.textPrimary,
    letterSpacing: 0,
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
