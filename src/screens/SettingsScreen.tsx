import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme, RADIUS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import * as Haptics from '../platform/haptics';
import { statsStore } from '../store/statsStore';
import { CustomAlertModal } from '../components/CustomAlertModal';
import { GradientBackground } from '../components/GradientBackground';
import { PremiumTopBar } from '../components/PremiumTopBar';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;
type IconName = React.ComponentProps<typeof Ionicons>['name'];

function SettingRow({
  icon,
  title,
  description,
  control,
  last = false,
}: {
  icon: IconName;
  title: string;
  description?: string;
  control: React.ReactNode;
  last?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.settingRow,
        !last && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
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
}

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
  } = useSettingsStore();

  const theme = useAppTheme();

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({ title: '', message: '' });

  const handleOpenV1 = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://v1.taalswipe.ssoggy.me').catch(() => {
      // The browser or desktop shell may not allow opening external URLs.
    });
  };

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
      title: 'Uitleg weer aan',
      message: 'Je krijgt bij elke modus opnieuw de uitleg.',
    });
    setAlertVisible(true);
  };

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

            <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingRow
              last
              icon="contrast-outline"
              title="Thema"
              description="Systeem, licht of donker."
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
                        accessibilityLabel={
                          pref === 'system' ? 'Systeemthema' : pref === 'light' ? 'Licht thema' : 'Donker thema'
                        }
                        accessibilityState={{ selected: isActive }}
                        aria-pressed={isActive}
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
            </View>

            <Text style={[styles.sectionLabel, { color: theme.inkMuted }]}>Geluid</Text>

            <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingRow
              last
              icon="volume-medium-outline"
              title="Geluidseffecten"
              description="Korte geluidjes bij je antwoorden."
              control={
                <Switch
                  value={isSoundEnabled}
                  onValueChange={handleToggleSound}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                  accessibilityLabel="Geluidseffecten"
                />
              }
            />
            </View>

            <Text style={[styles.sectionLabel, { color: theme.inkMuted }]}>Spelmodi</Text>

            <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingRow
              icon="heart-outline"
              title="Hardcore"
              description="Drie levens. Dubbele XP."
              control={
                <Switch
                  value={hardcoreMode}
                  onValueChange={handleToggleHardcore}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                  accessibilityLabel="Hardcore"
                />
              }
            />

            <SettingRow
              icon="timer-outline"
              title="Survival"
              description="De klok loopt door. Fouten kosten tijd."
              control={
                <Switch
                  value={survivalMode}
                  onValueChange={() => {
                    toggleSurvivalMode();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                  accessibilityLabel="Survival"
                />
              }
            />

            <SettingRow
              last
              icon="flash-outline"
              title="Speedrun"
              description="50 woorden op tijd."
              control={
                <Switch
                  value={speedrunMode}
                  onValueChange={() => {
                    toggleSpeedrunMode();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  trackColor={switchColors}
                  thumbColor="#FFFFFF"
                  accessibilityLabel="Speedrun"
                />
              }
            />
            </View>

            <Text style={[styles.sectionLabel, { color: theme.inkMuted }]}>Overig</Text>

            <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TouchableOpacity
              onPress={handleResetTutorials}
              style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
              accessibilityRole="button"
              accessibilityLabel="Uitleg herstellen"
            >
              <View style={[styles.iconTile, { backgroundColor: theme.surfaceMuted }]}>
                <Ionicons name="refresh-outline" size={17} color={theme.inkSecondary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.ink }]}>Uitleg herstellen</Text>
                <Text style={[styles.settingDescription, { color: theme.inkSecondary }]}>
                  Zie de uitleg weer bij elke modus.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={theme.inkMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenV1}
              style={styles.settingRow}
              accessibilityRole="button"
              accessibilityLabel="Oude versie openen"
            >
              <View style={[styles.iconTile, { backgroundColor: theme.surfaceMuted }]}>
                <Ionicons name="time-outline" size={17} color={theme.inkSecondary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.ink }]}>Oude versie</Text>
                <Text style={[styles.settingDescription, { color: theme.inkSecondary }]}>
                  Open TaalSwipe v1.
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color={theme.inkMuted} />
            </TouchableOpacity>
            </View>

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
  group: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
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
  footer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 28,
  },
});
