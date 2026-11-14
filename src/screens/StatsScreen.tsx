import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme, RADIUS } from '../theme/colors';
import { AppStats, getPlayerTitle, statsStore } from '../store/statsStore';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlertModal } from '../components/CustomAlertModal';
import { GradientBackground } from '../components/GradientBackground';
import { PremiumTopBar } from '../components/PremiumTopBar';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

type TabType = 'stats' | 'achievements' | 'leaderboard';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  target: number;
  currentValue: (stats: AppStats) => number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_swipe', name: 'Eerste swipe', description: 'Doe je allereerste swipe', icon: 'hand-left-outline', target: 1, currentValue: (s) => s.totalSwipes },
  { id: 'swipe_50', name: 'Swipe starter', description: 'Behaal 50 swipes', icon: 'swap-horizontal-outline', target: 50, currentValue: (s) => s.totalSwipes },
  { id: 'swipe_king', name: 'Swipe koning', description: 'Behaal 100 swipes', icon: 'ribbon-outline', target: 100, currentValue: (s) => s.totalSwipes },
  { id: 'super_swiper', name: 'Super swiper', description: 'Behaal 500 swipes', icon: 'flash-outline', target: 500, currentValue: (s) => s.totalSwipes },
  { id: 'swipe_1k', name: 'Swipe machine', description: 'Behaal 1.000 swipes', icon: 'repeat-outline', target: 1000, currentValue: (s) => s.totalSwipes },
  { id: 'swipe_5k', name: 'Swipe legende', description: 'Behaal 5.000 swipes', icon: 'infinite-outline', target: 5000, currentValue: (s) => s.totalSwipes },
  { id: 'combo_3', name: 'Op dreef', description: 'Behaal een reeks van 3', icon: 'flame-outline', target: 3, currentValue: (s) => s.highestCombo },
  { id: 'combo_krijger', name: 'Reeksbouwer', description: 'Behaal een reeks van 5', icon: 'bonfire-outline', target: 5, currentValue: (s) => s.highestCombo },
  { id: 'combo_meester', name: 'Reeksmeester', description: 'Behaal een reeks van 12', icon: 'sparkles-outline', target: 12, currentValue: (s) => s.highestCombo },
  { id: 'combo_god', name: 'Ononderbroken', description: 'Behaal een reeks van 20', icon: 'water-outline', target: 20, currentValue: (s) => s.highestCombo },
  { id: 'combo_30', name: 'Reekslegende', description: 'Behaal een reeks van 30', icon: 'planet-outline', target: 30, currentValue: (s) => s.highestCombo },
  { id: 'level_3', name: 'Taalleerder', description: 'Bereik niveau 3 (200 XP)', icon: 'book-outline', target: 200, currentValue: (s) => s.xp },
  { id: 'level_6', name: 'Taalexpert', description: 'Bereik niveau 6 (500 XP)', icon: 'school-outline', target: 500, currentValue: (s) => s.xp },
  { id: 'level_10', name: 'Taalbaas', description: 'Bereik niveau 10 (900 XP)', icon: 'trophy-outline', target: 900, currentValue: (s) => s.xp },
  { id: 'level_15', name: 'Taalkampioen', description: 'Bereik niveau 15 (1.400 XP)', icon: 'medal-outline', target: 1400, currentValue: (s) => s.xp },
  { id: 'level_25', name: 'Taallegende', description: 'Bereik niveau 25 (2.400 XP)', icon: 'diamond-outline', target: 2400, currentValue: (s) => s.xp },
  { id: 'level_50', name: 'Taalkoning', description: 'Bereik niveau 50 (4.900 XP)', icon: 'star-outline', target: 4900, currentValue: (s) => s.xp },
  { id: 'streak_3', name: 'Streakstarter', description: 'Speel 3 dagen op rij', icon: 'calendar-outline', target: 3, currentValue: (s) => s.bestStreak },
  { id: 'streak_7', name: 'Weekstrijder', description: 'Speel 7 dagen op rij', icon: 'flame-outline', target: 7, currentValue: (s) => s.bestStreak },
  { id: 'streak_14', name: 'Taalsporter', description: 'Speel 14 dagen op rij', icon: 'barbell-outline', target: 14, currentValue: (s) => s.bestStreak },
  { id: 'streak_30', name: 'Streaklegende', description: 'Speel 30 dagen op rij', icon: 'moon-outline', target: 30, currentValue: (s) => s.bestStreak },
  { id: 'collector', name: 'Verzamelaar', description: 'Ontgrendel 3 items in de shop', icon: 'bag-outline', target: 3, currentValue: (s) => s.unlockedItems?.length ?? 0 },
  { id: 'big_spender', name: 'Grote spender', description: 'Ontgrendel 8 items in de shop', icon: 'card-outline', target: 8, currentValue: (s) => s.unlockedItems?.length ?? 0 },
  { id: 'sessions_10', name: 'Vaste speler', description: 'Speel 10 sessies', icon: 'game-controller-outline', target: 10, currentValue: (s) => s.sessionsPlayed ?? 0 },
  { id: 'sessions_50', name: 'Doorzetter', description: 'Speel 50 sessies', icon: 'game-controller-outline', target: 50, currentValue: (s) => s.sessionsPlayed ?? 0 },
  { id: 'correct_100', name: 'Nauwkeurige kenner', description: 'Geef 100 keer een juist antwoord', icon: 'checkmark-circle-outline', target: 100, currentValue: (s) => s.totalCorrect ?? 0 },
  { id: 'correct_500', name: 'Taalperfectionist', description: 'Geef 500 keer een juist antwoord', icon: 'locate-outline', target: 500, currentValue: (s) => s.totalCorrect ?? 0 },
];

const LEADERBOARD_MODES: readonly { id: keyof AppStats['highScores']; icon: IconName; title: string }[] = [
  { id: 'straattaal', icon: 'chatbubbles-outline', title: 'Straattaal of AI?' },
  { id: 'dunglish', icon: 'globe-outline', title: 'Steenkolenengels' },
  { id: 'spelling', icon: 'text-outline', title: 'Speed-spelling' },
  { id: 'dt', icon: 'create-outline', title: 'D/t-grammatica' },
  { id: 'vandale', icon: 'book-outline', title: 'Dikke Van Dale' },
  { id: 'brand', icon: 'pricetag-outline', title: 'Merk of soort?' },
];

export function StatsScreen({ navigation, route }: Props) {
  const theme = useAppTheme();
  const initialTab = route.params?.tab ?? 'stats';
  const [activeTab, setActiveTab] = React.useState<TabType>(initialTab);

  const [stats, setStats] = React.useState<AppStats | null>(null);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState<{ title: string; message: string; buttons?: any[] }>({ title: '', message: '' });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentStats = await statsStore.getStats();
      setStats(currentStats);
    });
    return unsubscribe;
  }, [navigation]);

  if (!stats) return null;

  const currentLevel = Math.floor(stats.xp / 100) + 1;
  const xpInCurrentLevel = stats.xp % 100;
  const xpProgress = xpInCurrentLevel / 100;
  const accuracy = stats.totalSwipes > 0
    ? Math.round(((stats.totalCorrect ?? 0) / stats.totalSwipes) * 100)
    : 0;

  const handleResetPress = () => {
    setAlertConfig({
      title: 'Voortgang wissen',
      message: 'Weet je zeker dat je al je statistieken, XP en aankopen wilt wissen? Dit kan niet ongedaan worden gemaakt.',
      buttons: [
        { text: 'Annuleren', style: 'cancel', onPress: () => {} },
        {
          text: 'Wissen',
          style: 'destructive',
          onPress: async () => {
            await statsStore.resetStats();
            setStats(await statsStore.getStats());
          },
        },
      ],
    });
    setAlertVisible(true);
  };

  const renderStatCard = (icon: IconName, value: string | number, label: string) => (
    <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Ionicons name={icon} size={16} color={theme.inkMuted} />
      <Text style={[styles.statValue, { color: theme.ink }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.inkSecondary }]}>{label}</Text>
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.kicker, { color: theme.inkMuted }]}>Speler</Text>
        <View style={styles.profileTopRow}>
          <Text style={[styles.playerTitle, { color: theme.ink }]}>{getPlayerTitle(stats.xp)}</Text>
          <Text style={[styles.playerLevel, { color: theme.inkSecondary }]}>Niveau {currentLevel}</Text>
        </View>

        <View style={styles.xpRow}>
          <Text style={[styles.xpText, { color: theme.inkSecondary }]}>
            {xpInCurrentLevel} / 100 XP
          </Text>
          <Text style={[styles.xpTotal, { color: theme.inkMuted }]}>{stats.xp} XP totaal</Text>
        </View>

        <View style={[styles.progressBarContainer, { backgroundColor: theme.surfaceMuted }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(100, Math.max(2, xpProgress * 100))}%`,
                backgroundColor: theme.accent,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        {renderStatCard('swap-horizontal-outline', stats.totalSwipes, 'Swipes')}
        {renderStatCard('flame-outline', stats.highestCombo, 'Beste reeks')}
      </View>
      <View style={styles.statsGrid}>
        {renderStatCard('calendar-outline', stats.currentStreak, 'Huidige streak')}
        {renderStatCard('trending-up-outline', stats.bestStreak, 'Beste streak')}
      </View>
      <View style={styles.statsGrid}>
        {renderStatCard('checkmark-circle-outline', stats.totalCorrect ?? 0, 'Goed')}
        {renderStatCard('close-circle-outline', stats.totalWrong ?? 0, 'Fout')}
      </View>
      <View style={styles.statsGrid}>
        {renderStatCard('locate-outline', `${accuracy}%`, 'Nauwkeurigheid')}
        {renderStatCard('game-controller-outline', stats.sessionsPlayed ?? 0, 'Sessies')}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.ink }]}>Power-ups</Text>
      <View style={[styles.powerupRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.powerupItem}>
          <Ionicons name="shield-checkmark-outline" size={18} color={theme.accent} />
          <Text style={[styles.powerupCount, { color: theme.ink }]}>{stats.shields || 0}</Text>
          <Text style={[styles.powerupLabel, { color: theme.inkSecondary }]}>Schilden</Text>
        </View>
        <View style={[styles.powerupDivider, { backgroundColor: theme.border }]} />
        <View style={styles.powerupItem}>
          <Ionicons name="timer-outline" size={18} color={theme.accent} />
          <Text style={[styles.powerupCount, { color: theme.ink }]}>{stats.timeSlows || 0}</Text>
          <Text style={[styles.powerupLabel, { color: theme.inkSecondary }]}>Tijd</Text>
        </View>
        <View style={[styles.powerupDivider, { backgroundColor: theme.border }]} />
        <View style={styles.powerupItem}>
          <Ionicons name="search-outline" size={18} color={theme.accent} />
          <Text style={[styles.powerupCount, { color: theme.ink }]}>{stats.hints || 0}</Text>
          <Text style={[styles.powerupLabel, { color: theme.inkSecondary }]}>Hints</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleResetPress}
        style={styles.resetButton}
        accessibilityRole="button"
        accessibilityLabel="Voortgang wissen"
      >
        <Ionicons name="trash-outline" size={15} color={theme.incorrect} />
        <Text style={[styles.resetText, { color: theme.incorrect }]}>Voortgang wissen</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAchievementsTab = () => {
    const completedCount = ACHIEVEMENTS.filter(
      (achievement) => achievement.currentValue(stats) >= achievement.target,
    ).length;

    return (
      <View style={styles.tabContent}>
        <Text style={[styles.achievementSummary, { color: theme.inkSecondary }]}>
          {completedCount} van {ACHIEVEMENTS.length} behaald
        </Text>

        {ACHIEVEMENTS.map((achievement) => {
          const currentVal = achievement.currentValue(stats);
          const isCompleted = currentVal >= achievement.target;
          const progressPercentage = Math.min(100, Math.max(0, (currentVal / achievement.target) * 100));

          return (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.achievementInfo}>
                <View
                  style={[
                    styles.achievementIconWrapper,
                    { backgroundColor: isCompleted ? theme.accentSoft : theme.surfaceMuted },
                  ]}
                >
                  <Ionicons
                    name={achievement.icon}
                    size={19}
                    color={isCompleted ? theme.accent : theme.inkMuted}
                  />
                </View>

                <View style={styles.achievementTextWrapper}>
                  <View style={styles.achievementHeaderRow}>
                    <Text style={[styles.achievementName, { color: theme.ink }]}>
                      {achievement.name}
                    </Text>
                    {isCompleted ? (
                      <Ionicons name="checkmark-circle" size={15} color={theme.correct} />
                    ) : null}
                  </View>
                  <Text style={[styles.achievementDesc, { color: theme.inkSecondary }]}>
                    {achievement.description}
                  </Text>

                  <View style={styles.achievementProgressRow}>
                    <View style={[styles.achievementProgressBarBg, { backgroundColor: theme.surfaceMuted }]}>
                      <View
                        style={[
                          styles.achievementProgressBarFill,
                          {
                            width: `${progressPercentage}%`,
                            backgroundColor: isCompleted ? theme.correct : theme.accent,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.achievementProgressText,
                        { color: isCompleted ? theme.correct : theme.inkSecondary },
                      ]}
                    >
                      {currentVal} / {achievement.target}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderLeaderboardTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.leaderboardSub, { color: theme.inkSecondary }]}>
        Je beste score per modus.
      </Text>

      {LEADERBOARD_MODES.map((mode) => (
        <View
          key={mode.id}
          style={[styles.leaderboardRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={styles.leaderboardModeInfo}>
            <View style={[styles.leaderboardIconBox, { backgroundColor: theme.surfaceMuted }]}>
              <Ionicons name={mode.icon} size={17} color={theme.accent} />
            </View>
            <Text style={[styles.leaderboardTitle, { color: theme.ink }]}>{mode.title}</Text>
          </View>

          <View style={styles.leaderboardScoreBox}>
            <Text style={[styles.leaderboardScore, { color: theme.ink }]}>
              {stats.highScores[mode.id] ?? 0}
            </Text>
            <Text style={[styles.leaderboardScoreLabel, { color: theme.inkMuted }]}>punten</Text>
          </View>
        </View>
      ))}

      <Text style={[styles.leaderboardFooter, { color: theme.inkMuted }]}>
        Verbeter een record om extra XP te verdienen.
      </Text>
    </View>
  );

  let headerTitle = 'Statistieken';
  if (activeTab === 'achievements') headerTitle = 'Prestaties';
  if (activeTab === 'leaderboard') headerTitle = 'Records';

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          <PremiumTopBar title={headerTitle} />

          <View style={[styles.tabBar, { backgroundColor: theme.surfaceMuted }]}>
            {([
              { key: 'stats', label: 'Stats' },
              { key: 'achievements', label: 'Prestaties' },
              { key: 'leaderboard', label: 'Records' },
            ] as const).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  style={[
                    styles.tabButton,
                    isActive && {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isActive ? theme.ink : theme.inkSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {activeTab === 'stats' && renderStatsTab()}
            {activeTab === 'achievements' && renderAchievementsTab()}
            {activeTab === 'leaderboard' && renderLeaderboardTab()}
          </ScrollView>
        </View>
      </SafeAreaView>

      <CustomAlertModal
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setAlertVisible(false)}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: RADIUS.control,
    padding: 3,
    marginBottom: 18,
    marginHorizontal: 20,
    gap: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: RADIUS.chip,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 10,
  },
  profileCard: {
    padding: 18,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    marginBottom: 4,
  },
  kicker: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 0.1,
    marginBottom: 6,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  playerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    letterSpacing: -0.4,
    flexShrink: 1,
  },
  playerLevel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  xpTotal: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: RADIUS.pill,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    marginTop: 10,
  },
  powerupRow: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    alignItems: 'center',
  },
  powerupItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  powerupCount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  powerupLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.1,
  },
  powerupDivider: {
    width: 1,
    height: 42,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 12,
  },
  resetText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  achievementSummary: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginBottom: 4,
  },
  achievementCard: {
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
  },
  achievementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.control,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementTextWrapper: {
    flex: 1,
  },
  achievementHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 1,
  },
  achievementName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  achievementDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginBottom: 7,
  },
  achievementProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  achievementProgressBarBg: {
    flex: 1,
    height: 3,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  achievementProgressBarFill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
  achievementProgressText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    width: 56,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  leaderboardSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginBottom: 4,
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
  },
  leaderboardModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  leaderboardIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.control,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    flexShrink: 1,
  },
  leaderboardScoreBox: {
    alignItems: 'flex-end',
  },
  leaderboardScore: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  leaderboardScoreLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  leaderboardFooter: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
