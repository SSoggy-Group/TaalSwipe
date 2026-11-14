import React from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '../components/GradientBackground';
import { ModeCard } from '../components/ModeCard';
import { useAppTheme, RADIUS } from '../theme/colors';
import { statsStore, AppStats, getPlayerTitle } from '../store/statsStore';
import { useKeyboardNavigation } from '../hooks/usePlatform';

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

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface ModeEntry {
  key: 'multiplayer' | 'straattaal' | 'dunglish' | 'spelling' | 'dt' | 'vandale' | 'brand';
  icon: IconName;
  title: string;
  description: string;
  meta: string;
}

const MODES: readonly ModeEntry[] = [
  {
    key: 'multiplayer',
    icon: 'people-outline',
    title: 'Multiplayer',
    description: 'Met z\'n tweeën op één scherm. Eerste bij 15 punten wint.',
    meta: '2 spelers',
  },
  {
    key: 'straattaal',
    icon: 'chatbubbles-outline',
    title: 'Straattaal of AI?',
    description: 'Echte straattaal of AI-onzin?',
    meta: 'Woorden',
  },
  {
    key: 'dunglish',
    icon: 'globe-outline',
    title: 'Steenkolenengels',
    description: 'Echt spreekwoord of kromme vertaling?',
    meta: 'Spreekwoorden',
  },
  {
    key: 'spelling',
    icon: 'text-outline',
    title: 'Speed-spelling',
    description: 'Goed gespeld of niet? De klok loopt.',
    meta: 'Tegen de klok',
  },
  {
    key: 'dt',
    icon: 'create-outline',
    title: 'D/t-grammatica',
    description: 'D, t of dt? Kies de juiste vorm.',
    meta: 'Grammatica',
  },
  {
    key: 'vandale',
    icon: 'book-outline',
    title: 'Dikke Van Dale',
    description: 'Echt woord of verzonnen?',
    meta: 'Woordenboek',
  },
  {
    key: 'brand',
    icon: 'pricetag-outline',
    title: 'Merk of soort?',
    description: 'Merknaam of gewoon woord?',
    meta: 'Merken',
  },
];

export function HomeScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isFocused = useIsFocused();
  const theme = useAppTheme();
  const [stats, setStats] = React.useState<AppStats | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentStats = await statsStore.getStats();
      setStats(currentStats);
    });
    return unsubscribe;
  }, [navigation]);

  const openMode = React.useCallback((key: ModeEntry['key']) => {
    if (key === 'multiplayer') {
      navigation.navigate('Multiplayer');
      return;
    }
    navigation.navigate('Game', { mode: key });
  }, [navigation]);

  const keyboardHandlers = React.useMemo(() => ({
    ArrowRight: () => setSelectedIndex((prev) => (prev === null ? 0 : Math.min(prev + 1, MODES.length - 1))),
    ArrowLeft: () => setSelectedIndex((prev) => (prev === null ? 0 : Math.max(prev - 1, 0))),
    ArrowDown: () => setSelectedIndex((prev) => (prev === null ? 0 : Math.min(prev + (isDesktop ? 2 : 1), MODES.length - 1))),
    ArrowUp: () => setSelectedIndex((prev) => (prev === null ? 0 : Math.max(prev - (isDesktop ? 2 : 1), 0))),
    Enter: () => {
      if (selectedIndex !== null) openMode(MODES[selectedIndex].key);
    },
  }), [selectedIndex, isDesktop, openMode]);

  useKeyboardNavigation(isFocused, keyboardHandlers);

  const accuracy = stats && stats.totalSwipes > 0
    ? Math.round((stats.totalCorrect / stats.totalSwipes) * 100)
    : 0;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={[styles.shell, isDesktop && styles.shellDesktop]}>
          <View style={styles.topBar}>
            <Pressable
              style={styles.brand}
              onPress={() => navigation.navigate('Home')}
              accessibilityRole="button"
              accessibilityLabel="TaalSwipe"
            >
              <Image
                source={require('../../assets/logo.png')}
                style={styles.brandMark}
                resizeMode="contain"
              />
              <Text style={[styles.brandName, { color: theme.ink }]}>TaalSwipe</Text>
            </Pressable>

            <View style={styles.navRow}>
              <Pressable
                onPress={() => navigation.navigate('Stats', { tab: 'stats' })}
                style={({ pressed }) => [
                  styles.navButton,
                  {
                    backgroundColor: pressed ? theme.surfaceMuted : 'transparent',
                    borderColor: theme.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Statistieken"
                focusable={false}
              >
                <Ionicons name="stats-chart-outline" size={19} color={theme.inkSecondary} />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Shop')}
                style={({ pressed }) => [
                  styles.navButton,
                  {
                    backgroundColor: pressed ? theme.surfaceMuted : 'transparent',
                    borderColor: theme.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Shop"
                focusable={false}
              >
                <Ionicons name="bag-outline" size={19} color={theme.inkSecondary} />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Settings')}
                style={({ pressed }) => [
                  styles.navButton,
                  {
                    backgroundColor: pressed ? theme.surfaceMuted : 'transparent',
                    borderColor: theme.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Instellingen"
                focusable={false}
              >
                <Ionicons name="settings-outline" size={19} color={theme.inkSecondary} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              entering={FadeInDown.duration(320)}
              style={[styles.hero, isDesktop && styles.heroDesktop]}
            >
              <View style={styles.heroCopy}>
                <Text style={[styles.title, isDesktop && styles.titleDesktop, { color: theme.ink }]}>
                  Test je Nederlands.
                </Text>
                <Text style={[styles.subtitle, { color: theme.inkSecondary }]}>
                  Korte rondes over spelling, straattaal en grammatica.
                </Text>

                {stats ? (
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: theme.surfaceMuted }]}>
                      <Ionicons name="person-outline" size={13} color={theme.inkSecondary} />
                      <Text style={[styles.badgeText, { color: theme.inkSecondary }]}>
                        {getPlayerTitle(stats.xp)} · niveau {Math.floor(stats.xp / 100) + 1}
                      </Text>
                    </View>
                    {stats.currentStreak > 0 ? (
                      <View style={[styles.badge, { backgroundColor: theme.surfaceMuted }]}>
                        <Ionicons name="flame-outline" size={13} color={theme.inkSecondary} />
                        <Text style={[styles.badgeText, { color: theme.inkSecondary }]}>
                          {stats.currentStreak} {stats.currentStreak === 1 ? 'dag' : 'dagen'} op rij
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </View>

              {isDesktop ? (
                <View style={[styles.heroAside, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.asideTitle, { color: theme.ink }]}>Sneltoetsen</Text>

                  <View style={styles.asideRow}>
                    <View style={[styles.asideKey, { backgroundColor: theme.incorrectBg }]}>
                      <Ionicons name="arrow-back" size={14} color={theme.incorrect} />
                    </View>
                    <Text style={[styles.asideText, { color: theme.inkSecondary }]}>Fout</Text>
                  </View>

                  <View style={styles.asideRow}>
                    <View style={[styles.asideKey, { backgroundColor: theme.correctBg }]}>
                      <Ionicons name="arrow-forward" size={14} color={theme.correct} />
                    </View>
                    <Text style={[styles.asideText, { color: theme.inkSecondary }]}>Goed</Text>
                  </View>

                  <View style={[styles.asideDivider, { backgroundColor: theme.border }]} />

                  <Text style={[styles.asideHint, { color: theme.inkMuted }]}>
                    Esc om te pauzeren.
                  </Text>
                </View>
              ) : null}
            </Animated.View>

            {isDesktop && stats ? (
              <View style={[styles.metricsStrip, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <View style={styles.metric}>
                  <Text style={[styles.metricValue, { color: theme.ink }]}>{stats.xp}</Text>
                  <Text style={[styles.metricLabel, { color: theme.inkMuted }]}>XP totaal</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                <View style={styles.metric}>
                  <Text style={[styles.metricValue, { color: theme.ink }]}>{accuracy}%</Text>
                  <Text style={[styles.metricLabel, { color: theme.inkMuted }]}>Percentage goed</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                <View style={styles.metric}>
                  <Text style={[styles.metricValue, { color: theme.ink }]}>{stats.highestCombo}</Text>
                  <Text style={[styles.metricLabel, { color: theme.inkMuted }]}>Beste combo</Text>
                </View>
                <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                <View style={styles.metric}>
                  <Text style={[styles.metricValue, { color: theme.ink }]}>{stats.sessionsPlayed ?? 0}</Text>
                  <Text style={[styles.metricLabel, { color: theme.inkMuted }]}>Rondes</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>Speelmodi</Text>
              <Text style={[styles.sectionHint, { color: theme.inkMuted }]}>{MODES.length} modi</Text>
            </View>

            <View
              style={[
                styles.modeList,
                isDesktop && styles.modeGrid,
                !isDesktop && [
                  styles.modeGroup,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ],
              ]}
            >
              {MODES.map((mode, index) => (
                <ModeCard
                  key={mode.key}
                  icon={mode.icon}
                  title={mode.title}
                  description={mode.description}
                  meta={mode.meta}
                  delay={index * 40}
                  onPress={() => openMode(mode.key)}
                  compact={isDesktop}
                  isSelected={selectedIndex === index}
                  grouped={!isDesktop}
                  isLast={index === MODES.length - 1}
                  wrapperStyle={
                    isDesktop
                      ? index === 0
                        ? styles.modeGridLead
                        : styles.modeGridItem
                      : undefined
                  }
                />
              ))}
            </View>


          </ScrollView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  shell: {
    flex: 1,
    width: '100%',
  },
  shellDesktop: {
    maxWidth: 1040,
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 7,
  },
  brandName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.control,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  scrollContentDesktop: {
    paddingTop: 20,
    paddingBottom: 48,
  },
  hero: {
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 620,
  },
  heroDesktop: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 48,
  },
  heroCopy: {
    flex: 1,
    maxWidth: 620,
  },
  heroAside: {
    width: 300,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    padding: 18,
    gap: 9,
    marginTop: 6,
  },
  asideTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 2,
  },
  asideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  asideKey: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  asideText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  asideDivider: {
    height: 1,
    marginVertical: 3,
  },
  asideHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    lineHeight: 41,
    letterSpacing: -1.1,
    marginBottom: 10,
  },
  titleDesktop: {
    fontSize: 50,
    lineHeight: 56,
    letterSpacing: -1.8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  badgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderRadius: RADIUS.card,
    paddingVertical: 16,
    marginBottom: 28,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  metricDivider: {
    width: 1,
    marginVertical: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  sectionHint: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  modeList: {
    gap: 8,
  },
  modeGroup: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 0,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modeGridItem: {
    width: '49%',
    minWidth: 280,
  },
  modeGridLead: {
    width: '100%',
  },
});
