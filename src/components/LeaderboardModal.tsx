import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, useAppTheme } from '../theme/colors';
import { AppStats } from '../store/statsStore';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  stats: AppStats | null;
}

export function LeaderboardModal({ visible, onClose, stats }: Props) {
  const theme = useAppTheme();
  
  if (!visible || !stats) return null;

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
            <Text style={[styles.title, { color: theme.cardTextPrimary }]}>🏆 Leaderboard</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.glass.highlight }]}>
              <Ionicons name="close" size={24} color={theme.cardTextPrimary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.scoresList, { backgroundColor: theme.glass.highlight }]}>
            <View style={styles.scoreRow}>
              <View style={styles.modeInfo}>
                <Text style={styles.modeEmoji}>🗣️</Text>
                <Text style={styles.modeTitle}>Straattaal of AI?</Text>
              </View>
              <Text style={styles.scoreValue}>{stats.highScores.straattaal}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.scoreRow}>
              <View style={styles.modeInfo}>
                <Text style={styles.modeEmoji}>🇬🇧</Text>
                <Text style={styles.modeTitle}>Steenkolenengels</Text>
              </View>
              <Text style={styles.scoreValue}>{stats.highScores.dunglish}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.scoreRow}>
              <View style={styles.modeInfo}>
                <Text style={styles.modeEmoji}>⚡</Text>
                <Text style={styles.modeTitle}>Speed-Spelling</Text>
              </View>
              <Text style={styles.scoreValue}>{stats.highScores.spelling}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Breek je eigen records om XP te verdienen!</Text>
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
    minHeight: '60%',
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
  scoresList: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeEmoji: {
    fontSize: 28,
  },
  modeTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scoreValue: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    color: Colors.correct,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textMuted,
  },
});
