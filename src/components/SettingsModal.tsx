import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import * as Haptics from '../platform/haptics';
import { statsStore } from '../store/statsStore';
import { CustomAlertModal } from './CustomAlertModal';
import { soundManager } from '../audio/SoundManager';

interface Props {
  readonly visible: boolean;
  readonly onClose: () => void;
}

const INCORRECT_SOUNDS = [
  { id: 'default', name: 'Standaard' },
  { id: '2042', name: 'Zacht' },
  { id: '954', name: 'Buzzer' },
  { id: '950', name: 'Chirp' },
  { id: '472', name: 'Blip' },
  { id: '2939', name: 'Arcade' },
  { id: '240', name: 'Zachte Klik' },
  { id: '1540', name: 'Klokje' },
];

const GAMEOVER_SOUNDS = [
  { id: 'default', name: 'Standaard' },
  { id: '2941', name: 'Melodie' },
  { id: '568', name: 'Dromerig' },
  { id: '571', name: 'Trombone' },
  { id: '2960', name: 'Retro Lose' },
  { id: '3053', name: 'Zacht Signaal' },
];

const SWOOSH_SOUNDS = [
  { id: 'default', name: 'Standaard' },
  { id: '1152', name: 'Lucht' },
  { id: '1153', name: 'Wind' },
];

export function SettingsModal({ visible, onClose }: Props) {
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

  if (!visible) return null;

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
    setAlertConfig({ title: 'Tutorials Gereset! 🦉', message: 'Je zult bij elke gamemode de tutorial weer één keer zien.' });
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <BlurView intensity={90} tint={theme.glass.background === '#FFFFFF' ? 'light' : 'dark'} style={styles.container}>
        <View style={[styles.content, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.cardTextPrimary }]}>⚙️ Instellingen</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.glass.highlight }]}>
              <Ionicons name="close" size={24} color={theme.cardTextPrimary} />
            </TouchableOpacity>
          </View>

          {/* Settings list (Scrollable to prevent overflow) */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.settingsList}>
            
            {/* Setting: Theme Preference */}
            <View 
              style={[
                styles.settingCard3D, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="color-palette" size={24} color="#38BDF8" />
                <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Weergave</Text>
              </View>
              <View 
                style={[
                  styles.themeToggleContainer, 
                  { backgroundColor: theme.glass.background, borderColor: theme.glass.border }
                ]}
              >
                {(['system', 'light', 'dark'] as const).map((pref) => {
                  const isActive = themePreference === pref;
                  let icon: 'phone-portrait-outline' | 'sunny' | 'moon';
                  if (pref === 'system') {
                    icon = 'phone-portrait-outline';
                  } else if (pref === 'light') {
                    icon = 'sunny';
                  } else {
                    icon = 'moon';
                  }
                  
                  return (
                    <TouchableOpacity
                      key={pref}
                      onPress={() => handleSelectTheme(pref)}
                      style={[
                        styles.themeToggleButton,
                        isActive && { backgroundColor: theme.glass.highlight }
                      ]}
                    >
                      <Ionicons 
                        name={icon} 
                        size={18} 
                        color={isActive ? theme.accent : theme.cardTextSecondary} 
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Setting: Sound (SFX) */}
            <View 
              style={[
                styles.settingCard3D, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="volume-high" size={24} color={theme.accent} />
                <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Geluiden (SFX)</Text>
              </View>
              <Switch
                value={isSoundEnabled}
                onValueChange={handleToggleSound}
                trackColor={{ false: '#475569', true: theme.accent }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* SOUND CUSTOMIZATION PANEL (Shows only if SFX is enabled) */}
            {isSoundEnabled && (
              <View style={[styles.soundSection, { borderColor: theme.glass.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.cardTextPrimary }]}>🎵 Soundboard (Kies Geluiden)</Text>
                
                {/* 1. Swoosh Sound Selector */}
                <View style={styles.soundSelectorRow}>
                  <Text style={[styles.soundLabel, { color: theme.cardTextSecondary }]}>Swipe Geluid (Swoosh):</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soundChipsContainer}>
                    {SWOOSH_SOUNDS.map((sound) => {
                      const isActive = (swooshSoundId || 'default') === sound.id;
                      return (
                        <TouchableOpacity
                          key={sound.id}
                          onPress={() => selectSwooshSound(sound.id)}
                          style={[
                            styles.soundChip,
                            { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                            isActive && { borderColor: theme.accent, backgroundColor: theme.glass.background }
                          ]}
                        >
                          <Text style={[styles.soundChipText, { color: isActive ? theme.accent : theme.cardTextPrimary }]}>
                            {sound.name} {isActive && '✓'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 2. Incorrect Sound Selector */}
                <View style={styles.soundSelectorRow}>
                  <Text style={[styles.soundLabel, { color: theme.cardTextSecondary }]}>Fout Antwoord Geluid:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soundChipsContainer}>
                    {INCORRECT_SOUNDS.map((sound) => {
                      const isActive = (incorrectSoundId || 'default') === sound.id;
                      return (
                        <TouchableOpacity
                          key={sound.id}
                          onPress={() => selectIncorrectSound(sound.id)}
                          style={[
                            styles.soundChip,
                            { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                            isActive && { borderColor: theme.accent, backgroundColor: theme.glass.background }
                          ]}
                        >
                          <Text style={[styles.soundChipText, { color: isActive ? theme.accent : theme.cardTextPrimary }]}>
                            {sound.name} {isActive && '✓'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 3. Game Over Sound Selector */}
                <View style={styles.soundSelectorRow}>
                  <Text style={[styles.soundLabel, { color: theme.cardTextSecondary }]}>Game Over Geluid:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soundChipsContainer}>
                    {GAMEOVER_SOUNDS.map((sound) => {
                      const isActive = (gameoverSoundId || 'default') === sound.id;
                      return (
                        <TouchableOpacity
                          key={sound.id}
                          onPress={() => selectGameoverSound(sound.id)}
                          style={[
                            styles.soundChip,
                            { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                            isActive && { borderColor: theme.accent, backgroundColor: theme.glass.background }
                          ]}
                        >
                          <Text style={[styles.soundChipText, { color: isActive ? theme.accent : theme.cardTextPrimary }]}>
                            {sound.name} {isActive && '✓'}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            )}

            {/* Setting: Hardcore Mode */}
            <View 
              style={[
                styles.settingCard3D, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="heart" size={24} color="#FF4B4B" />
                <View>
                  <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Hardcore</Text>
                  <Text style={[styles.settingDescription, { color: theme.cardTextSecondary }]}>3 Levens, 2x XP</Text>
                </View>
              </View>
              <Switch
                value={hardcoreMode}
                onValueChange={handleToggleHardcore}
                trackColor={{ false: '#475569', true: '#FF4B4B' }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Setting: Survival Mode */}
            <View 
              style={[
                styles.settingCard3D, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="timer" size={24} color="#F59E0B" />
                <View>
                  <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Survival</Text>
                  <Text style={[styles.settingDescription, { color: theme.cardTextSecondary }]}>Race tegen de klok</Text>
                </View>
              </View>
              <Switch
                value={survivalMode}
                onValueChange={() => {
                  toggleSurvivalMode();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                trackColor={{ false: '#475569', true: '#F59E0B' }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Setting: Speedrun Mode */}
            <View 
              style={[
                styles.settingCard3D, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }
              ]}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="flash" size={24} color="#38BDF8" />
                <View>
                  <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Speedrun</Text>
                  <Text style={[styles.settingDescription, { color: theme.cardTextSecondary }]}>50 Woorden, Tijd Telt Op</Text>
                </View>
              </View>
              <Switch
                value={speedrunMode}
                onValueChange={() => {
                  toggleSpeedrunMode();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                trackColor={{ false: '#475569', true: '#38BDF8' }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* Reset Tutorials Button */}
            <TouchableOpacity 
              onPress={handleResetTutorials}
              style={[
                styles.settingCard3D, 
                { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border, justifyContent: 'center', marginTop: 8 }
              ]}
            >
              <Text style={[styles.settingTitle, { color: theme.cardTextPrimary, textAlign: 'center' }]}>🔄 Herstel Tutorials</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BlurView>
      
      <CustomAlertModal
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
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
    padding: 32,
    width: '100%',
    borderWidth: 1,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 28,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  settingsList: {
    gap: 16,
    paddingBottom: 24,
  },
  settingCard3D: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 6,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
  },
  settingDescription: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    marginTop: 2,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 3,
    gap: 4,
    borderWidth: 1,
  },
  themeToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundSection: {
    borderWidth: 2,
    borderRadius: 22,
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 15,
    marginBottom: 4,
  },
  soundSelectorRow: {
    gap: 8,
  },
  soundLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  soundChipsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  soundChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 2,
  },
  soundChipText: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 12,
  },
});
