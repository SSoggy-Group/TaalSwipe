import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, useAppTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { statsStore, AppStats } from '../store/statsStore';
import { useSettingsStore } from '../store/settingsStore';
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
  // BACKGROUNDS
  { id: 'bg_ocean', name: 'Ocean Breeze', type: 'background', price: 0, icon: '🌊', description: 'Frisse, vloeiende oceaangolven' },
  { id: 'bg_neon', name: 'Neon Vibes', type: 'background', price: 500, icon: '🌌', description: 'Slapeloze nachten in cyberpunk neon' },
  { id: 'bg_sunset', name: 'Sunset Flow', type: 'background', price: 1000, icon: '🌅', description: 'Warme zonsondergang verloopkleuren' },
  { id: 'bg_forest', name: 'Forest Serenity', type: 'background', price: 1200, icon: '🌲', description: 'Rustgevende diepgroene natuur' },
  { id: 'bg_aurora', name: 'Midnight Aurora', type: 'background', price: 1500, icon: '🌠', description: 'Magische dansende poollichten' },
  { id: 'bg_matrix', name: 'Matrix Hacker', type: 'background', price: 2000, icon: '👾', description: 'Betreed de digitale code matrix' },
  { id: 'bg_candy', name: 'Candy Cotton', type: 'background', price: 2500, icon: '🍭', description: 'Zoete en zachte pastelkleuren' },
  { id: 'bg_volcano', name: 'Volcanic Magma', type: 'background', price: 3000, icon: '🌋', description: 'Intense gloed van vloeibaar magma' },
  { id: 'bg_royal', name: 'Royal Gold', type: 'background', price: 4000, icon: '👑', description: 'Koninklijke paars-gouden combinatie' },
  { id: 'bg_nebula', name: 'Space Nebula', type: 'background', price: 5000, icon: '🌟', description: 'Verre kosmische sterrenstelsels' },

  // CARDS
  { id: 'card_default', name: 'Klassiek Glas', type: 'card', price: 0, icon: '📱', description: 'Subtiel semi-transparant glas' },
  { id: 'card_gold', name: 'Gouden Glans', type: 'card', price: 1500, icon: '✨', description: 'Voor de echte taal-kampioenen' },
  { id: 'card_neon', name: 'Cyber Neon', type: 'card', price: 2000, icon: '⚡', description: 'Felblauwe laser-gesneden randen' },
  { id: 'card_retro', name: 'Retro Arcade', type: 'card', price: 2500, icon: '🕹️', description: '8-bit nostalgie met pixelrand' },
  { id: 'card_holo', name: 'Holografisch', type: 'card', price: 3500, icon: '💿', description: 'Prachtig iridiserende kleuren' },
  { id: 'card_rainbow', name: 'Rainbow Swipes', type: 'card', price: 5000, icon: '🌈', description: 'Een golvend spectrum van kleuren' },
  { id: 'card_shadow', name: 'Duistere Schaduw', type: 'card', price: 1000, icon: '🥷', description: 'Stealth look met rood detail' },
  { id: 'card_pastel', name: 'Matte Pastel', type: 'card', price: 800, icon: '🌸', description: 'Zacht groen voor ultieme focus' },
];

export function ShopModal({ visible, onClose, stats, onUpdateStats }: Props) {
  const theme = useAppTheme();
  const [activeTab, setActiveTab] = React.useState<'background' | 'card'>('background');
  const [shootConfetti, setShootConfetti] = React.useState(false);
  
  const { 
    equippedBackground, 
    equippedCard, 
    setEquippedBackground, 
    setEquippedCard 
  } = useSettingsStore();

  if (!visible || !stats) return null;

  const handleAction = async (item: typeof SHOP_ITEMS[0]) => {
    const isUnlocked = item.price === 0 || stats.unlockedItems.includes(item.id);

    if (isUnlocked) {
      // Equip logic
      if (item.type === 'background') {
        setEquippedBackground(item.id);
      } else {
        setEquippedCard(item.id);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    // Buy logic
    if (stats.xp < item.price) {
      Alert.alert('Te weinig XP', `Je komt nog ${item.price - stats.xp} XP tekort! Speel games om meer te verdienen.`);
      return;
    }

    const newStats = {
      ...stats,
      xp: stats.xp - item.price,
      unlockedItems: [...stats.unlockedItems, item.id],
    };
    
    await statsStore.saveStats(newStats);
    onUpdateStats(newStats);
    
    // Automatically equip after buying
    if (item.type === 'background') {
      setEquippedBackground(item.id);
    } else {
      setEquippedCard(item.id);
    }

    // Trigger confetti & haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShootConfetti(true);
    setTimeout(() => setShootConfetti(false), 3000);
  };

  const filteredItems = SHOP_ITEMS.filter((item) => item.type === activeTab);

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
            <View>
              <Text style={[styles.title, { color: theme.cardTextPrimary }]}>🛍️ XP Shop</Text>
              <Text style={[styles.xpText, { color: theme.cardTextSecondary }]}>Jouw saldo: <Text style={{ color: theme.accent, fontFamily: 'Inter_800ExtraBold' }}>{stats.xp} XP</Text></Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: theme.glass.highlight }]}>
              <Ionicons name="close" size={24} color={theme.cardTextPrimary} />
            </TouchableOpacity>
          </View>

          {/* Tab Bar */}
          <View style={[styles.tabBar, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
            <TouchableOpacity 
              onPress={() => setActiveTab('background')} 
              style={[
                styles.tabButton, 
                activeTab === 'background' && { backgroundColor: theme.glass.background }
              ]}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'background' ? theme.cardTextPrimary : theme.cardTextSecondary }
              ]}>🌌 Achtergronden</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setActiveTab('card')} 
              style={[
                styles.tabButton, 
                activeTab === 'card' && { backgroundColor: theme.glass.background }
              ]}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'card' ? theme.cardTextPrimary : theme.cardTextSecondary }
              ]}>📱 Kaartstijlen</Text>
            </TouchableOpacity>
          </View>

          {/* Shop List */}
          <ScrollView style={styles.shopList} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {filteredItems.map((item) => {
              const isUnlocked = item.price === 0 || stats.unlockedItems.includes(item.id);
              const isEquipped = item.type === 'background' 
                ? equippedBackground === item.id 
                : equippedCard === item.id;

              let buttonTitle = `Koop voor ${item.price} XP`;
              let buttonColor = theme.accent;

              if (isUnlocked) {
                if (isEquipped) {
                  buttonTitle = 'Uitgerust ✓';
                  buttonColor = theme.glass.border;
                } else {
                  buttonTitle = 'Uitrusten';
                  buttonColor = '#58CC02'; // Green for action
                }
              }

              return (
                <View 
                  key={item.id} 
                  style={[
                    styles.shopItem, 
                    { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                    isEquipped && { borderColor: theme.accent, borderBottomColor: theme.accent }
                  ]}
                >
                  <View style={styles.itemInfo}>
                    <View style={[styles.iconWrapper, { backgroundColor: theme.glass.background }]}>
                      <Text style={styles.itemIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.textWrapper}>
                      <Text style={[styles.itemName, { color: theme.cardTextPrimary }]}>{item.name}</Text>
                      <Text style={[styles.itemDescription, { color: theme.cardTextSecondary }]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  <BouncyButton 
                    title={buttonTitle}
                    color={buttonColor}
                    borderColor={isUnlocked && !isEquipped ? '#46A302' : buttonColor}
                    bottomBorderColor={isUnlocked && !isEquipped ? '#2D6A01' : buttonColor}
                    disabled={isEquipped}
                    textStyle={{ fontSize: 15, color: isEquipped ? theme.cardTextSecondary : '#FFF' }}
                    style={{ paddingVertical: 12, borderRadius: 16, width: '100%' }}
                    onPress={() => handleAction(item)}
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    minHeight: '85%',
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
  xpText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    marginTop: 4,
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
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shopList: {
    flex: 1,
  },
  shopItem: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 8,
    marginBottom: 16,
    gap: 14,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    fontSize: 32,
  },
  textWrapper: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
  },
  itemDescription: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginTop: 2,
  },
});
