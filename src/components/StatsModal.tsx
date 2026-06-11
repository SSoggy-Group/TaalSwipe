import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, useAppTheme } from '../theme/colors';
import { AppStats, getPlayerTitle } from '../store/statsStore';
import { Ionicons } from '@expo/vector-icons';
import { CustomAlertModal } from './CustomAlertModal';

interface Props {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onReset: () => void;
  readonly stats: AppStats | null;
  readonly initialTab?: 'stats' | 'achievements' | 'leaderboard';
}

type TabType = 'stats' | 'achievements' | 'leaderboard';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  target: number;
  currentValue: (stats: AppStats) => number;
}

const ACHIEVEMENTS: Achievement[] = [
  // Swipes
  { id: 'first_swipe',   name: 'Eerste Swipe',       description: 'Doe je allereerste swipe',          emoji: '👉', target: 1,    currentValue: (s) => s.totalSwipes },
  { id: 'swipe_50',      name: 'Swipe Starter',       description: 'Behaal 50 totale swipes',           emoji: '✌️', target: 50,   currentValue: (s) => s.totalSwipes },
  { id: 'swipe_king',    name: 'Swipe Koning',         description: 'Behaal 100 totale swipes',          emoji: '👑', target: 100,  currentValue: (s) => s.totalSwipes },
  { id: 'super_swiper',  name: 'Super Swiper',         description: 'Behaal 500 totale swipes',          emoji: '⚡', target: 500,  currentValue: (s) => s.totalSwipes },
  { id: 'swipe_1k',      name: 'Swipe Machine',        description: 'Behaal 1000 totale swipes',         emoji: '🤖', target: 1000, currentValue: (s) => s.totalSwipes },
  { id: 'swipe_5k',      name: 'Swipe Legende',        description: 'Behaal 5000 totale swipes',         emoji: '🌟', target: 5000, currentValue: (s) => s.totalSwipes },
  // Combos
  { id: 'combo_3',       name: 'Op Dreef',             description: 'Behaal een combo van 3x',          emoji: '🔥', target: 3,    currentValue: (s) => s.highestCombo },
  { id: 'combo_krijger', name: 'Combo Krijger',         description: 'Behaal een combo van 5x',          emoji: '💥', target: 5,    currentValue: (s) => s.highestCombo },
  { id: 'combo_meester', name: 'Combo Meester',         description: 'Behaal een combo van 12x',         emoji: '☄️', target: 12,   currentValue: (s) => s.highestCombo },
  { id: 'combo_god',     name: 'Combo God',             description: 'Behaal een combo van 20x',         emoji: '🌊', target: 20,   currentValue: (s) => s.highestCombo },
  { id: 'combo_30',      name: 'Combo Overlord',        description: 'Behaal een combo van 30x',         emoji: '👾', target: 30,   currentValue: (s) => s.highestCombo },
  // XP & Levels
  { id: 'level_3',       name: 'Taalleerder',           description: 'Bereik Level 3 (200 XP)',          emoji: '📚', target: 200,  currentValue: (s) => s.xp },
  { id: 'level_6',       name: 'Taalexpert',            description: 'Bereik Level 6 (500 XP)',          emoji: '🎓', target: 500,  currentValue: (s) => s.xp },
  { id: 'level_10',      name: 'Taal-Baas',             description: 'Bereik Level 10 (900 XP)',         emoji: '🏆', target: 900,  currentValue: (s) => s.xp },
  { id: 'level_15',      name: 'Taal-Kampioen',         description: 'Bereik Level 15 (1400 XP)',        emoji: '🥇', target: 1400, currentValue: (s) => s.xp },
  { id: 'level_25',      name: 'Taal-Legende',          description: 'Bereik Level 25 (2400 XP)',        emoji: '💎', target: 2400, currentValue: (s) => s.xp },
  { id: 'level_50',      name: 'Taal-Koning',           description: 'Bereik Level 50 (4900 XP)',        emoji: '👑', target: 4900, currentValue: (s) => s.xp },
  // Streaks
  { id: 'streak_3',      name: 'Streak Starter',        description: 'Behaal een streak van 3 dagen',   emoji: '📅', target: 3,    currentValue: (s) => s.bestStreak },
  { id: 'streak_7',      name: 'Weekstrijder',          description: 'Behaal een streak van 7 dagen',   emoji: '🔥', target: 7,    currentValue: (s) => s.bestStreak },
  { id: 'streak_14',     name: 'Taal-Sporter',          description: 'Behaal een streak van 14 dagen',  emoji: '💪', target: 14,   currentValue: (s) => s.bestStreak },
  { id: 'streak_30',     name: 'Streak Legende',        description: 'Behaal een streak van 30 dagen',  emoji: '🌙', target: 30,   currentValue: (s) => s.bestStreak },
  // Shop & Sessies
  { id: 'collector',     name: 'Shop Verzamelaar',      description: 'Ontgrendel 3 items in de Shop',   emoji: '🛍️', target: 3,   currentValue: (s) => s.unlockedItems?.length ?? 0 },
  { id: 'big_spender',   name: 'Grote Spender',         description: 'Ontgrendel 8 items in de Shop',   emoji: '💸', target: 8,   currentValue: (s) => s.unlockedItems?.length ?? 0 },
  { id: 'sessions_10',   name: 'Vaste Speler',          description: 'Speel 10 sessies',                emoji: '🎮', target: 10,  currentValue: (s) => s.sessionsPlayed ?? 0 },
  { id: 'sessions_50',   name: 'Verslaafde Speler',     description: 'Speel 50 sessies',                emoji: '🕹️', target: 50, currentValue: (s) => s.sessionsPlayed ?? 0 },
  { id: 'correct_100',   name: 'Nauwkeurige Kenner',    description: 'Geef 100 keer een juist antwoord', emoji: '✅', target: 100,  currentValue: (s) => s.totalCorrect ?? 0 },
  { id: 'correct_500',   name: 'Taal-Perfectionist',    description: 'Geef 500 keer een juist antwoord', emoji: '🎯', target: 500,  currentValue: (s) => s.totalCorrect ?? 0 },
];

export function StatsModal({ visible, onClose, onReset, stats, initialTab = 'stats' }: Props) {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [activeTab, setActiveTab] = React.useState<TabType>(initialTab);
  
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState<{ title: string; message: string; buttons?: any[] }>({ title: '', message: '' });

  React.useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [visible, initialTab]);

  if (!visible || !stats) return null;

  const currentLevel = Math.floor(stats.xp / 100) + 1;
  const xpInCurrentLevel = stats.xp % 100;
  const nextLevelXp = 100;
  const xpProgress = xpInCurrentLevel / nextLevelXp;

  const handleResetPress = () => {
    setAlertConfig({
      title: 'Reset Voortgang',
      message: 'Weet je zeker dat je al je stats, XP en aankopen wilt wissen? Dit kan niet ongedaan worden gemaakt.',
      buttons: [
        { text: 'Annuleren', style: 'cancel', onPress: () => {} },
        { 
          text: 'Wissen', 
          style: 'destructive',
          onPress: () => {
            onReset();
            onClose();
          }
        }
      ]
    });
    setAlertVisible(true);
  };

  const renderStatsTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* Level and Title Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
          <Text style={[styles.playerTitle, { color: theme.accent }]}>{getPlayerTitle(stats.xp)}</Text>
          <Text style={[styles.playerLevel, { color: theme.cardTextPrimary }]}>Level {currentLevel}</Text>
          
          <View style={styles.xpRow}>
            <Text style={[styles.xpText, { color: theme.cardTextSecondary }]}>{xpInCurrentLevel} / {nextLevelXp} XP</Text>
            <Text style={[styles.xpTotal, { color: theme.textMuted || '#777' }]}>Totaal: {stats.xp} XP</Text>
          </View>
          
          <View style={[styles.progressBarContainer, { backgroundColor: theme.glass.background }]}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${Math.min(100, Math.max(5, xpProgress * 100))}%`, 
                  backgroundColor: theme.accent 
                }
              ]} 
            />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>👉</Text>
            <Text style={[styles.statValue, { color: theme.cardTextPrimary }]}>{stats.totalSwipes}</Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Totaal Swipes</Text>
          </View>

          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statValue, { color: '#FF9500' }]}>{stats.highestCombo}</Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Hoogste Combo</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={[styles.statValue, { color: theme.cardTextPrimary }]}>{stats.currentStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Huidige Streak</Text>
          </View>

          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={[styles.statValue, { color: theme.accent }]}>{stats.bestStreak}</Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Beste Streak</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={[styles.statValue, { color: '#58CC02' }]}>{stats.totalCorrect ?? 0}</Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Totaal Goed</Text>
          </View>

          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>❌</Text>
            <Text style={[styles.statValue, { color: Colors.incorrect }]}>{stats.totalWrong ?? 0}</Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Totaal Fout</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={[styles.statValue, { color: '#38BDF8' }]}>
              {stats.totalSwipes > 0 ? `${Math.round(((stats.totalCorrect ?? 0) / stats.totalSwipes) * 100)}%` : '-'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Nauwkeurigheid</Text>
          </View>

          <View style={[styles.statCard3D, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <Text style={styles.statEmoji}>🎮</Text>
            <Text style={[styles.statValue, { color: theme.cardTextPrimary }]}>{stats.sessionsPlayed ?? 0}</Text>
            <Text style={[styles.statLabel, { color: theme.cardTextSecondary }]}>Sessies</Text>
          </View>
        </View>

        {/* Inventory Items */}
        <Text style={[styles.sectionTitle, { color: theme.cardTextPrimary }]}>🛡️ Power-ups</Text>
        <View style={[styles.powerupRow, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
          <View style={styles.powerupItem}>
            <Text style={styles.powerupEmoji}>🛡️</Text>
            <Text style={[styles.powerupCount, { color: theme.cardTextPrimary }]}>{stats.shields || 0}</Text>
            <Text style={[styles.powerupLabel, { color: theme.cardTextSecondary }]}>Schilden</Text>
          </View>
          <View style={styles.powerupDivider} />
          <View style={styles.powerupItem}>
            <Text style={styles.powerupEmoji}>⏱️</Text>
            <Text style={[styles.powerupCount, { color: theme.cardTextPrimary }]}>{stats.timeSlows || 0}</Text>
            <Text style={[styles.powerupLabel, { color: theme.cardTextSecondary }]}>Tijd Freeze</Text>
          </View>
          <View style={styles.powerupDivider} />
          <View style={styles.powerupItem}>
            <Text style={styles.powerupEmoji}>🔍</Text>
            <Text style={[styles.powerupCount, { color: theme.cardTextPrimary }]}>{stats.hints || 0}</Text>
            <Text style={[styles.powerupLabel, { color: theme.cardTextSecondary }]}>Hints</Text>
          </View>
        </View>

        {/* Reset Action */}
        <TouchableOpacity onPress={handleResetPress} style={styles.resetButton}>
          <Ionicons name="trash-outline" size={16} color={Colors.incorrect} />
          <Text style={styles.resetText}>Wis Voortgang</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAchievementsTab = () => {
    return (
      <View style={styles.tabContent}>
        {ACHIEVEMENTS.map((achievement) => {
          const currentVal = achievement.currentValue(stats);
          const isCompleted = currentVal >= achievement.target;
          const progressPercentage = Math.min(100, Math.max(0, (currentVal / achievement.target) * 100));

          return (
            <View 
              key={achievement.id}
              style={[
                styles.achievementCard, 
                { 
                  backgroundColor: theme.glass.highlight, 
                  borderColor: isCompleted ? '#58CC02' : theme.glass.border,
                  borderBottomColor: isCompleted ? '#46A302' : theme.glass.border 
                }
              ]}
            >
              <View style={styles.achievementInfo}>
                <View 
                  style={[
                    styles.achievementIconWrapper, 
                    { 
                      backgroundColor: isCompleted ? 'rgba(88, 204, 2, 0.15)' : theme.glass.background,
                      borderColor: isCompleted ? '#58CC02' : 'transparent',
                      borderWidth: isCompleted ? 1 : 0
                    }
                  ]}
                >
                  <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                </View>
                <View style={styles.achievementTextWrapper}>
                  <View style={styles.achievementHeaderRow}>
                    <Text style={[styles.achievementName, { color: theme.cardTextPrimary }]}>
                      {achievement.name}
                    </Text>
                    {isCompleted && (
                      <Ionicons name="checkmark-circle" size={18} color="#58CC02" />
                    )}
                  </View>
                  <Text style={[styles.achievementDesc, { color: theme.cardTextSecondary }]}>
                    {achievement.description}
                  </Text>
                  
                  {/* Progress info */}
                  <View style={styles.achievementProgressRow}>
                    <View style={[styles.achievementProgressBarBg, { backgroundColor: theme.glass.background }]}>
                      <View 
                        style={[
                          styles.achievementProgressBarFill, 
                          { 
                            width: `${progressPercentage}%`,
                            backgroundColor: isCompleted ? '#58CC02' : theme.accent 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.achievementProgressText, { color: isCompleted ? '#58CC02' : theme.cardTextSecondary }]}>
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

  const renderLeaderboardTab = () => {
    const modes = [
      { id: 'straattaal', emoji: '🗣️', title: 'Straattaal of AI?',    score: stats.highScores.straattaal, color: '#A78BFA' },
      { id: 'dunglish',   emoji: '🇬🇧', title: 'Steenkolenengels',      score: stats.highScores.dunglish,   color: '#F472B6' },
      { id: 'spelling',   emoji: '⚡',  title: 'Speed-Spelling',         score: stats.highScores.spelling,   color: '#38BDF8' },
      { id: 'dt',         emoji: '🧠',  title: 'D/T Grammatica',         score: stats.highScores.dt,         color: '#F59E0B' },
      { id: 'vandale',    emoji: '📖',  title: 'Van Dale Meester',       score: stats.highScores.vandale,    color: '#34D399' },
      { id: 'brand',      emoji: '🏷️', title: 'Merk of Soortnaam?',    score: stats.highScores.brand,      color: '#FB923C' },
    ];

    return (
      <View style={styles.tabContent}>
        <Text style={[styles.leaderboardSub, { color: theme.cardTextSecondary }]}>
          Jouw persoonlijke records per spelmodus:
        </Text>
        
        {modes.map((mode) => {
          return (
            <View 
              key={mode.id}
              style={[
                styles.leaderboardRow3D, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }
              ]}
            >
              <View style={styles.leaderboardModeInfo}>
                <View style={[styles.leaderboardEmojiBox, { backgroundColor: mode.color }]}>
                  <Text style={styles.leaderboardEmoji}>{mode.emoji}</Text>
                </View>
                <Text style={[styles.leaderboardTitle, { color: theme.cardTextPrimary }]}>
                  {mode.title}
                </Text>
              </View>
              
              <View style={styles.leaderboardScoreBox}>
                <Text style={[styles.leaderboardScore, { color: theme.accent }]}>
                  {mode.score}
                </Text>
                <Text style={[styles.leaderboardScoreLabel, { color: theme.cardTextSecondary }]}>
                  PNT
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.leaderboardFooter}>
          <Text style={[styles.leaderboardFooterText, { color: theme.cardTextSecondary }]}>
            💡 Tip: Breek je records om extra XP te verdienen!
          </Text>
        </View>
      </View>
    );
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'stats': return '📊 Statistieken';
      case 'achievements': return '🏅 Prestaties';
      case 'leaderboard': return '🏆 High Scores';
      default: return 'TaalSwipe';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <BlurView intensity={90} tint={theme.glass.background === '#FFFFFF' ? 'light' : 'dark'} style={[styles.container, isDesktop && styles.desktopContainer]}>
        <View style={[styles.content, isDesktop && styles.desktopContent, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.cardTextPrimary }]}>{getHeaderTitle()}</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.glass.highlight }]}>
              <Ionicons name="close" size={24} color={theme.cardTextPrimary} />
            </TouchableOpacity>
          </View>

          {/* Custom 3D Tab Bar */}
          <View style={[styles.tabBar, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <TouchableOpacity 
              onPress={() => setActiveTab('stats')} 
              style={[
                styles.tabButton, 
                activeTab === 'stats' && { backgroundColor: theme.glass.background }
              ]}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'stats' ? theme.cardTextPrimary : theme.cardTextSecondary }
              ]}>Stats</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setActiveTab('achievements')} 
              style={[
                styles.tabButton, 
                activeTab === 'achievements' && { backgroundColor: theme.glass.background }
              ]}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'achievements' ? theme.cardTextPrimary : theme.cardTextSecondary }
              ]}>Prestaties</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setActiveTab('leaderboard')} 
              style={[
                styles.tabButton, 
                activeTab === 'leaderboard' && { backgroundColor: theme.glass.background }
              ]}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'leaderboard' ? theme.cardTextPrimary : theme.cardTextSecondary }
              ]}>Records</Text>
            </TouchableOpacity>
          </View>

          {/* Modal scroll contents */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {activeTab === 'stats' && renderStatsTab()}
            {activeTab === 'achievements' && renderAchievementsTab()}
            {activeTab === 'leaderboard' && renderLeaderboardTab()}
          </ScrollView>

        </View>
      </BlurView>
      
      <CustomAlertModal
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setAlertVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    minHeight: '85%',
  },
  desktopContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  desktopContent: {
    width: 640,
    minHeight: 'auto',
    maxHeight: '90%',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 28,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  tabText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    gap: 16,
  },
  profileCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 6,
    marginBottom: 10,
  },
  playerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  playerLevel: {
    fontFamily: 'Inter_900Black',
    fontSize: 32,
    marginBottom: 16,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  xpTotal: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard3D: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 6,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    marginTop: 12,
  },
  powerupRow: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 6,
    alignItems: 'center',
  },
  powerupItem: {
    flex: 1,
    alignItems: 'center',
  },
  powerupEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  powerupCount: {
    fontFamily: 'Inter_900Black',
    fontSize: 20,
  },
  powerupLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  powerupDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 24,
  },
  resetText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.incorrect,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 6,
    marginBottom: 12,
  },
  achievementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementEmoji: {
    fontSize: 28,
  },
  achievementTextWrapper: {
    flex: 1,
  },
  achievementHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  achievementName: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
  },
  achievementDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginBottom: 8,
  },
  achievementProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementProgressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  achievementProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementProgressText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    width: 50,
    textAlign: 'right',
  },
  leaderboardSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  leaderboardRow3D: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 6,
    marginBottom: 12,
  },
  leaderboardModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  leaderboardEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardEmoji: {
    fontSize: 22,
  },
  leaderboardTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 15,
  },
  leaderboardScoreBox: {
    alignItems: 'flex-end',
  },
  leaderboardScore: {
    fontFamily: 'Inter_900Black',
    fontSize: 20,
  },
  leaderboardScoreLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    marginTop: 1,
  },
  leaderboardFooter: {
    alignItems: 'center',
    marginTop: 16,
  },
  leaderboardFooterText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
});
