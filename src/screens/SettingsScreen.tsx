import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme, RADIUS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import * as Haptics from '../platform/haptics';
import { statsStore } from '../store/statsStore';
import { CustomAlertModal } from '../components/CustomAlertModal';
import { soundManager } from '../audio/SoundManager';
import { GradientBackground } from '../components/GradientBackground';
import { PremiumTopBar } from '../components/PremiumTopBar';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const INCORRECT_SOUNDS = [
  { id: 'default', name: 'Standaard' },
  { id: '2042', name: 'Zacht' },
  { id: '954', name: 'Buzzer' },
  { id: '950', name: 'Chirp' },
  { id: '472', name: 'Blip' },
  { id: '2939', name: 'Arcade' },
  { id: '240', name: 'Zachte klik' },
  { id: '1540', name: 'Klokje' },
];

const GAMEOVER_SOUNDS = [
  { id: 'default', name: 'Standaard' },
  { id: '2941', name: 'Melodie' },
  { id: '568', name: 'Dromerig' },
  { id: '571', name: 'Trombone' },
  { id: '2960', name: 'Retro' },
  { id: '3053', name: 'Zacht signaal' },
];

const SWOOSH_SOUNDS = [
  { id: 'default', name: 'Standaard' },
  { id: '1152', name: 'Lucht' },
  { id: '1153', name: 'Wind' },
];

export function SettingsScreen({ navigation }: Props) {
  const {
    isSoundEnabled,
    toggleSound,
    hardcoreMode,
    toggleHardcoreMode,
    themePreference,
    setThemePreference,
    survivalMode,
    toggleSurvivalMode,
    speedrunMode,
    toggleSpeedrunMode,
    incorrectSoundId,
    setIncorrectSoundId,
    gameoverSoundId,
    setGameoverSoundId,
    swooshSoundId,
    setSwooshSoundId,
  } = useSettingsStore();

  const theme = useAppTheme();

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({ title: '', message: '' });

  const handleToggleSound = () => {
    toggleSound();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleToggleHardcore = () => {
    toggleHardcoreMode();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSelectTheme = (pref: 'system' | 'light' | 'dark') => {
    setThemePreference(pref);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResetTutorials = async () => {
    const currentStats = await statsStore.getStats();
    currentStats.tutorialSeen = {
      straattaal: false,
      dunglish: false,
      spelling: false,
      dt: false,
      vandale: false,
      brand: false,
    };
    await statsStore.saveStats(currentStats);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setAlertConfig({
      title: 'Tutorials hersteld',
      message: 'Je ziet de uitleg bij elke spelmodus weer één keer.',
    });
    setAlertVisible(true);
  };

  const selectIncorrectSound = (id: string) => {
    setIncorrectSoundId(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      soundManager.testIncorrect(id);
    }, 50);
  };

  const selectGameoverSound = (id: string) => {
    setGameoverSoundId(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      soundManager.testGameOver(id);
    }, 50);
  };

  const selectSwooshSound = (id: string) => {
    setSwooshSoundId(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      soundManager.testSwoosh(id);
    }, 50);
  };

  const SettingRow = ({
    icon,
    title,
    description,
    control,
  }: {
    icon: IconName;
    title: string;
    description?: string;
    control: React.ReactNode;
  }) => (
    <View style={[styles.settingRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.iconTile, { backgroundColor: theme.surfaceMuted }]}>
        <Ionicons name={icon} size={17} color={theme.inkSecondary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.ink }]}>{title}</Text>
        {description ? (
          <Text style={[styles.settingDescription, { color: theme.inkSecondary }]}>{description}</Text>
        ) : null}
      </View>
      {control}
    </View>
  );

  const SoundChips = ({
    sounds,
    activeId,
    onSelect,
  }: {
    sounds: { id: string; name: string }[];
    activeId: string;
    onSelect: (id: string) => void;
  }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsContainer}
    >
      {sounds.map((sound) => {
        const isActive = (activeId || 'default') === sound.id;
        return (
          <TouchableOpacity
            key={sound.id}
            onPress={() => onSelect(sound.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? theme.accentSoft : 'transparent',
                borderColor: isActive ? theme.accent : theme.border,
              },
            ]}
          >
            {isActive ? <Ionicons name="checkmark" size={12} color={theme.accent} /> : null}
            <Text style={[styles.chipText, { color: isActive ? theme.accent : theme.inkSecondary }]}>
              {sound.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const switchColors = {
    false: theme.borderStrong,
    true: theme.accent,
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          <PremiumTopBar title="Instellingen" />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.settingsList}>
            <Text style={[styles.sectionLabel, { color: theme.inkMuted }]}>Weergave</Text>

            <SettingRow
              icon="contrast-outline"
              title="Thema"
              description="Volg je systeem of kies handmatig."
              control={
                <View style={[styles.themeToggle, { backgroundColor: theme.surfaceMuted }]}>
                  {([
                    { pref: 'system', icon: 'phone-portrait-outline' },
                    { pref: 'light', icon: 'sunny-outline' },
                    { pref: 'dark', icon: 'moon-outline' },
                  ] as const).map(({ pref, icon }) => {
                    const isActive = themePreference === pref;
                    return (
                      <TouchableOpacity
                        key={pref}
                        onPress={() => handleSelectTheme(pref)}
                        style={[
                          styles.themeToggleButton,
                          isActive && {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                          },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={pref}
                      >
                        <Ionicons
                          name={icon}
                          size={16}
                          color={isActive ? theme.ink : theme.inkMuted}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              }
            />

            <Text style={[styles.sectionLabel, { color: theme.inkMuted }]}>Geluid</Text>

            <SettingRow
              icon="volume-medium-outline"
              title="Geluidseffecten"
              description="Feedback bij antwoorden en swipes."
              control={
                <Switch
                  value={isSoundEnabled}
                  onValueChange={handleToggleSound}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                />
              }
            />

            {isSoundEnabled ? (
              <View style={[styles.soundCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.soundTitle, { color: theme.ink }]}>Geluiden kiezen</Text>

                <View style={styles.soundSelectorRow}>
                  <Text style={[styles.soundLabel, { color: theme.inkSecondary }]}>Swipe</Text>
                  <SoundChips
                    sounds={SWOOSH_SOUNDS}
                    activeId={swooshSoundId}
                    onSelect={selectSwooshSound}
                  />
                </View>

                <View style={styles.soundSelectorRow}>
                  <Text style={[styles.soundLabel, { color: theme.inkSecondary }]}>Fout antwoord</Text>
                  <SoundChips
                    sounds={INCORRECT_SOUNDS}
                    activeId={incorrectSoundId}
                    onSelect={selectIncorrectSound}
                  />
                </View>

                <View style={styles.soundSelectorRow}>
                  <Text style={[styles.soundLabel, { color: theme.inkSecondary }]}>Einde ronde</Text>
                  <SoundChips
                    sounds={GAMEOVER_SOUNDS}
                    activeId={gameoverSoundId}
                    onSelect={selectGameoverSound}
                  />
                </View>
              </View>
            ) : null}

            <Text style={[styles.sectionLabel, { color: theme.inkMuted }]}>Spelmodi</Text>

            <SettingRow
              icon="heart-outline"
              title="Hardcore"
              description="Drie levens, dubbele XP."
              control={
                <Switch
                  value={hardcoreMode}
                  onValueChange={handleToggleHardcore}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                />
              }
            />

            <SettingRow
              icon="timer-outline"
              title="Survival"
              description="Race tegen de klok."
              control={
                <Switch
                  value={survivalMode}
                  onValueChange={() => {
                    toggleSurvivalMode();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                />
              }
            />

            <SettingRow
              icon="flash-outline"
              title="Speedrun"
              description="Vijftig woorden, tijd loopt mee."
              control={
                <Switch
                  value={speedrunMode}
                  onValueChange={() => {
                    toggleSpeedrunMode();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                />
              }
            />

            <Text style={[styles.sectionLabel, { color: theme.inkMuted }]}>Overig</Text>

            <TouchableOpacity
              onPress={handleResetTutorials}
              style={[styles.settingRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={[styles.iconTile, { backgroundColor: theme.surfaceMuted }]}>
                <Ionicons name="refresh-outline" size={17} color={theme.inkSecondary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.ink }]}>Tutorials herstellen</Text>
                <Text style={[styles.settingDescription, { color: theme.inkSecondary }]}>
                  Toon de uitleg opnieuw bij elke modus.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={theme.inkMuted} />
            </TouchableOpacity>

            <Text style={[styles.footer, { color: theme.inkMuted }]}>TaalSwipe</Text>
          </ScrollView>
        </View>
      </SafeAreaView>

      <CustomAlertModal
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
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
  settingsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.1,
    marginTop: 14,
    marginBottom: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    gap: 12,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  settingDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  themeToggle: {
    flexDirection: 'row',
    borderRadius: RADIUS.chip,
    padding: 2,
    gap: 2,
  },
  themeToggleButton: {
    width: 32,
    height: 30,
    borderRadius: RADIUS.chip - 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  soundCard: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  soundTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  soundSelectorRow: {
    gap: 8,
  },
  soundLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  chipsContainer: {
    gap: 6,
    paddingVertical: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  footer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 28,
  },
});
