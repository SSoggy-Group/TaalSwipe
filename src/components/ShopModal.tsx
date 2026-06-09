import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, useAppTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { statsStore, AppStats } from '../store/statsStore';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { BouncyButton } from './BouncyButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  stats: AppStats | null;
  onUpdateStats: (newStats: AppStats) => void;
}

const SHOP_ITEMS = [
  { id: 'bg_neon', name: 'Neon Vibes', type: 'background', price: 500, icon: '🌌' },
  { id: 'bg_sunset', name: 'Sunset Flow', type: 'background', price: 1000, icon: '🌅' },
  { id: 'bg_ocean', name: 'Ocean Breeze', type: 'background', price: 1500, icon: '🌊' },
  { id: 'bg_matrix', name: 'Matrix Hacker', type: 'background', price: 2000, icon: '👨‍💻' },
  { id: 'card_gold', name: 'Gouden Kaarten', type: 'card', price: 2500, icon: '✨' },
  { id: 'card_rainbow', name: 'Rainbow Swipes', type: 'card', price: 5000, icon: '🌈' },
];

export function ShopModal({ visible, onClose, stats, onUpdateStats }: Props) {
  const theme = useAppTheme();
  const [shootConfetti, setShootConfetti] = React.useState(false);

  if (!visible || !stats) return null;

  const handleBuy = async (item: typeof SHOP_ITEMS[0]) => {
    if (stats.unlockedItems.includes(item.id)) {
      Alert.alert('Al in bezit!', 'Je hebt dit item al ontgrendeld.');
      return;
    }
    if (stats.xp < item.price) {
      Alert.alert('Te weinig XP', `Je komt nog ${item.price - stats.xp} XP tekort!`);
      return;
    }

    const newStats = {
      ...stats,
      xp: stats.xp - item.price,
      unlockedItems: [...stats.unlockedItems, item.id],
    };
    
    await statsStore.saveStats(newStats);
    onUpdateStats(newStats);
    
    // Trigger confetti & haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShootConfetti(true);
    setTimeout(() => setShootConfetti(false), 3000); // Reset so it can trigger again
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
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.cardTextPrimary }]}>🛍️ XP Shop</Text>
              <Text style={styles.xpText}>Jouw saldo: <Text style={{ color: Colors.accent }}>{stats.xp} XP</Text></Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.glass.highlight }]}>
              <Ionicons name="close" size={24} color={theme.cardTextPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.shopList} showsVerticalScrollIndicator={false}>
            {SHOP_ITEMS.map((item) => {
              const isUnlocked = stats.unlockedItems.includes(item.id);
              return (
                <View key={item.id} style={[styles.shopItem, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
                  <View style={styles.itemInfo}>
                    <View style={styles.iconWrapper}>
                      <Text style={styles.itemIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.textWrapper}>
                      <Text style={[styles.itemName, { color: theme.cardTextPrimary }]}>{item.name}</Text>
                      <Text style={[styles.itemType, { color: theme.cardTextSecondary }]}>
                        {item.type === 'background' ? 'Achtergrond' : 'Kaartstijl'}
                      </Text>
                    </View>
                  </View>

                  <BouncyButton 
                    title={isUnlocked ? 'Ontgrendeld' : `Koop voor ${item.price} XP`}
                    color={isUnlocked ? theme.glass.border : Colors.accent}
                    borderColor={isUnlocked ? theme.glass.background : '#8B5CF6'}
                    bottomBorderColor={isUnlocked ? theme.glass.background : '#7C3AED'}
                    disabled={isUnlocked}
                    textStyle={{ fontSize: 16, color: isUnlocked ? theme.cardTextSecondary : '#FFF' }}
                    style={{ paddingVertical: 14, borderRadius: 20, width: '100%' }}
                    onPress={() => handleBuy(item)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      </BlurView>
      {shootConfetti && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <ConfettiCannon 
            count={100} 
            origin={{x: -10, y: 0}} 
            fallSpeed={2500} 
            explosionSpeed={350} 
            fadeOut={true} 
          />
          <ConfettiCannon 
            count={100} 
            origin={{x: 400, y: 0}} 
            fallSpeed={2500} 
            explosionSpeed={350} 
            fadeOut={true} 
          />
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: '85%',
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
  },
  xpText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  shopList: {
    flex: 1,
  },
  shopItem: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 8,
    marginBottom: 20,
    gap: 16,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 36,
  },
  textWrapper: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
  },
  itemType: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginTop: 2,
  },
});
