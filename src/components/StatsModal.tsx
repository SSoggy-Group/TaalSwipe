import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../theme/colors';
import { GlassButton } from './GlassButton';
import { AppStats } from '../store/statsStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onReset: () => void;
  stats: AppStats | null;
}

export function StatsModal({ visible, onClose, onReset, stats }: Props) {
  if (!stats) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} tint="dark" style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Jouw Stats 📊</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalSwipes}</Text>
              <Text style={styles.statLabel}>Totaal Swipes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.highestCombo}</Text>
              <Text style={styles.statLabel}>Highest Combo</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>High Scores</Text>
          <View style={styles.highScoreRow}>
            <Text style={styles.modeName}>🗣️ Straattaal</Text>
            <Text style={styles.modeScore}>{stats.highScores.straattaal}</Text>
          </View>
          <View style={styles.highScoreRow}>
            <Text style={styles.modeName}>🇬🇧 Steenkolenengels</Text>
            <Text style={styles.modeScore}>{stats.highScores.dunglish}</Text>
          </View>
          <View style={styles.highScoreRow}>
            <Text style={styles.modeName}>⚡ Speed-Spelling</Text>
            <Text style={styles.modeScore}>{stats.highScores.spelling}</Text>
          </View>

          <View style={styles.actions}>
            <GlassButton emoji="❌" title="Sluiten" onPress={onClose} />
            <TouchableOpacity onPress={onReset} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset Progress</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: 'rgba(20, 20, 30, 0.75)',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    color: Colors.correct,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  highScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modeName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modeScore: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  actions: {
    marginTop: 32,
    gap: 16,
  },
  resetButton: {
    alignItems: 'center',
    padding: 12,
  },
  resetText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.incorrect,
    opacity: 0.8,
  },
});
