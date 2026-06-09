import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Switch, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import * as Haptics from 'expo-haptics';
import { statsStore } from '../store/statsStore';

interface Props {
  readonly visible: boolean;
  readonly onClose: () => void;
}

export function SettingsModal({ visible, onClose }: Props) {
  const { isSoundEnabled, toggleSound, hardcoreMode, toggleHardcoreMode, themePreference, setThemePreference, survivalMode, toggleSurvivalMode, speedrunMode, toggleSpeedrunMode } = useSettingsStore();
  const theme = useAppTheme();

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
    Alert.alert('Tutorials Gereset! 🦉', 'Je zult bij elke gamemode de tutorial weer één keer zien.');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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

          {/* Settings Cards list */}
          <View style={styles.settingsList}>
            
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

          </View>
        </View>
      </BlurView>
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
    minHeight: '45%',
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
});
