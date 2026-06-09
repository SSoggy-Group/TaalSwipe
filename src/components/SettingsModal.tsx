import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Switch } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, useAppTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: Props) {
  const { isSoundEnabled, toggleSound, hardcoreMode, toggleHardcoreMode, themePreference, setThemePreference } = useSettingsStore();
  const theme = useAppTheme();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={90} tint={theme.glass.background === '#FFFFFF' ? 'light' : 'dark'} style={styles.container}>
        <View style={[styles.content, { backgroundColor: theme.glass.background, borderColor: theme.glass.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.cardTextPrimary }]}>⚙️ Instellingen</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.glass.highlight }]}>
              <Ionicons name="close" size={24} color={theme.cardTextPrimary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.settingsList, { backgroundColor: theme.glass.highlight }]}>


            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="color-palette" size={24} color="#38BDF8" />
                <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Weergave</Text>
              </View>
              <View style={[styles.themeToggleContainer, { backgroundColor: theme.glass.background }]}>
                {(['system', 'light', 'dark'] as const).map((pref) => {
                  const isActive = themePreference === pref;
                  const icon = pref === 'system' ? 'phone-portrait-outline' : pref === 'light' ? 'sunny' : 'moon';
                  return (
                    <TouchableOpacity
                      key={pref}
                      onPress={() => setThemePreference(pref)}
                      style={[
                        styles.themeToggleButton,
                        isActive && { backgroundColor: theme.glass.border }
                      ]}
                    >
                      <Ionicons 
                        name={icon} 
                        size={18} 
                        color={isActive ? theme.cardTextPrimary : theme.cardTextSecondary} 
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.glass.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="volume-high" size={24} color={Colors.accent} />
                <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Geluiden (SFX)</Text>
              </View>
              <Switch
                value={isSoundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: '#334155', true: Colors.accent }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.glass.border }]} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="heart" size={24} color="#FF4B4B" />
                <View>
                  <Text style={[styles.settingTitle, { color: theme.cardTextPrimary }]}>Hardcore Modus</Text>
                  <Text style={[styles.settingDescription, { color: theme.cardTextSecondary }]}>3 Levens, 2x XP</Text>
                </View>
              </View>
              <Switch
                value={hardcoreMode}
                onValueChange={toggleHardcoreMode}
                trackColor={{ false: '#334155', true: '#FF4B4B' }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // slide up from bottom like a sheet
  },
  content: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: '40%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  settingsList: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.textSecondary,
  },
  settingDescription: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginTop: 2,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
    gap: 4,
  },
  themeToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  divider: {
    height: 1,
  },
});
