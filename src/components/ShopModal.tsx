import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { statsStore, AppStats } from '../store/statsStore';
import { useSettingsStore } from '../store/settingsStore';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { BouncyButton } from './BouncyButton';
import { CustomAlertModal } from './CustomAlertModal';

interface Props {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly stats: AppStats | null;
  readonly onUpdateStats: (newStats: AppStats) => void;
}

const SHOP_ITEMS = [
  // THEMES - BACKGROUNDS
  { id: 'bg_ocean', name: 'Ocean Breeze', type: 'background', price: 0, icon: '🌊', description: 'Frisse, vloeiende oceaangolven (Standaard)' },
  { id: 'bg_neon', name: 'Neon Vibes', type: 'background', price: 500, icon: '🌌', description: 'Slapeloze nachten in cyberpunk neon' },
  { id: 'bg_sunset', name: 'Sunset Flow', type: 'background', price: 1000, icon: '🌅', description: 'Warme zonsondergang verloopkleuren' },
  { id: 'bg_forest', name: 'Forest Serenity', type: 'background', price: 1200, icon: '🌲', description: 'Rustgevende diepgroene natuur' },
  { id: 'bg_aurora', name: 'Midnight Aurora', type: 'background', price: 1500, icon: '🌠', description: 'Magische dansende poollichten' },
  { id: 'bg_matrix', name: 'Matrix Hacker', type: 'background', price: 2000, icon: '👾', description: 'Betreed de digitale code matrix' },
  { id: 'bg_candy', name: 'Candy Cotton', type: 'background', price: 2500, icon: '🍭', description: 'Zoete en zachte pastelkleuren' },
  { id: 'bg_volcano', name: 'Volcanic Magma', type: 'background', price: 3000, icon: '🌋', description: 'Intense gloed van vloeibaar magma' },
  { id: 'bg_royal', name: 'Royal Gold', type: 'background', price: 4000, icon: '👑', description: 'Koninklijke paars-gouden combinatie' },
  { id: 'bg_nebula', name: 'Space Nebula', type: 'background', price: 5000, icon: '🌟', description: 'Verre kosmische sterrenstelsels' },

  // THEMES - CARDS
  { id: 'card_default', name: 'Klassiek Glas', type: 'card', price: 0, icon: '📱', description: 'Subtiel semi-transparant glas (Standaard)' },
  { id: 'card_gold', name: 'Gouden Glans', type: 'card', price: 1500, icon: '✨', description: 'Voor de echte taal-kampioenen' },
  { id: 'card_neon', name: 'Cyber Neon', type: 'card', price: 2000, icon: '⚡', description: 'Felblauwe laser-gesneden randen' },
  { id: 'card_retro', name: 'Retro Arcade', type: 'card', price: 2500, icon: '🕹️', description: '8-bit nostalgie met pixelrand' },
  { id: 'card_holo', name: 'Holografisch', type: 'card', price: 3500, icon: '💿', description: 'Prachtig iridiserende kleuren' },
  { id: 'card_rainbow', name: 'Rainbow Swipes', type: 'card', price: 5000, icon: '🌈', description: 'Een golvend spectrum van kleuren' },
  { id: 'card_shadow', name: 'Duistere Schaduw', type: 'card', price: 1000, icon: '🥷', description: 'Stealth look met rood detail' },
  { id: 'card_pastel', name: 'Matte Pastel', type: 'card', price: 800, icon: '🌸', description: 'Zacht groen voor ultieme focus' },

  // POWERUPS
  { id: 'powerup_shield', name: 'Shield (Schild)', type: 'powerup', statsKey: 'shields', price: 250, icon: '🛡️', description: 'Voorkomt één fout en behoudt je combo/levens. Activeert automatisch.' },
  { id: 'powerup_timer', name: 'Time Slow (Tijd-Freeze)', type: 'powerup', statsKey: 'timeSlows', price: 300, icon: '⏱️', description: 'Voorkomt game over door de timer te resetten in Speed-Spelling.' },
  { id: 'powerup_hint', name: 'Hint Joker', type: 'powerup', statsKey: 'hints', price: 400, icon: '🔍', description: 'Onthult de juiste swipe-richting door de knop op te lichten.' },
  { id: 'powerup_double', name: 'Dubbele XP (1 sessie)', type: 'powerup', statsKey: 'hints', price: 600, icon: '💰', description: 'Verdubbelt de XP voor jouw volgende sessie. Gebruik spaarzaam!' },

  // UPGRADES
  { id: 'upgrade_xp_15', name: 'XP Booster (1.5x)', type: 'upgrade', multiplier: 1.5, price: 1500, icon: '🚀', description: 'Verdien permanent 50% extra XP uit al je swipes.' },
  { id: 'upgrade_xp_20', name: 'XP Supercharger (2.0x)', type: 'upgrade', multiplier: 2, price: 3000, icon: '⚡', description: 'Verdien permanent 100% extra XP (overschrijft 1.5x booster).' },
  { id: 'upgrade_xp_30', name: 'XP Godmode (3.0x)', type: 'upgrade', multiplier: 3, price: 6000, icon: '🌟', description: 'Verdien permanent 200% extra XP. De ultieme upgrade!' },

  // EXTRA BACKGROUNDS
  { id: 'bg_lava', name: 'Lava Lamp', type: 'background', price: 1800, icon: '🫧', description: 'Zachte, borrelende lava lamp kleuren' },
  { id: 'bg_cherry', name: 'Cherry Blossom', type: 'background', price: 2200, icon: '🌸', description: 'Japanse kersenbloesem roze tinten' },
  { id: 'bg_arctic', name: 'Arctic Frost', type: 'background', price: 2800, icon: '❄️', description: 'IJskoude poolnacht blauw-wit' },
  { id: 'bg_deep_sea', name: 'Deep Sea', type: 'background', price: 3500, icon: '🐋', description: 'Diepzee mysterieuze oceaan blauw' },

  // EXTRA CARD STYLES
  { id: 'card_flame', name: 'Flame Card', type: 'card', price: 2200, icon: '🔥', description: 'Vurige oranje-rode kaartrand met gloei-effect' },
  { id: 'card_ice', name: 'Ice Crystal', type: 'card', price: 2800, icon: '🧊', description: 'Ijskristallen met blauwe glasranden' },
];

export function ShopModal({ visible, onClose, stats, onUpdateStats }: Props) {
  const theme = useAppTheme();
  const [activeTab, setActiveTab] = React.useState<'themes' | 'powerups' | 'upgrades'>('themes');
  const [shootConfetti, setShootConfetti] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({ title: '', message: '' });
  
  const { 
    equippedBackground, 
    equippedCard, 
    setEquippedBackground, 
    setEquippedCard 
  } = useSettingsStore();

  if (!visible || !stats) return null;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleAction = async (item: typeof SHOP_ITEMS[0]) => {
    const isTheme = item.type === 'background' || item.type === 'card';
    
    if (isTheme) {
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
      
      // Buy theme
      if (stats.xp < item.price) {
        setAlertConfig({ title: 'Te weinig XP', message: `Je komt nog ${item.price - stats.xp} XP tekort!` });
        setAlertVisible(true);
        return;
      }
      
      const newStats = {
        ...stats,
        xp: stats.xp - item.price,
        unlockedItems: [...stats.unlockedItems, item.id],
      };
      
      await statsStore.saveStats(newStats);
      onUpdateStats(newStats);
      
      if (item.type === 'background') {
        setEquippedBackground(item.id);
      } else {
        setEquippedCard(item.id);
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundManager.playPurchase();
      setShootConfetti(true);
      setTimeout(() => setShootConfetti(false), 3000);
      return;
    }
    
    if (item.type === 'powerup') {
      if (stats.xp < item.price) {
        setAlertConfig({ title: 'Te weinig XP', message: `Je komt nog ${item.price - stats.xp} XP tekort!` });
        setAlertVisible(true);
        return;
      }
      
      const statsKey = item.statsKey as 'shields' | 'timeSlows' | 'hints';
      const currentVal = stats[statsKey] || 0;
      
      const newStats = {
        ...stats,
        xp: stats.xp - item.price,
        [statsKey]: currentVal + 1,
      };
      
      await statsStore.saveStats(newStats);
      onUpdateStats(newStats);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShootConfetti(true);
      setTimeout(() => setShootConfetti(false), 2000);
      return;
    }
    
    if (item.type === 'upgrade') {
      const targetMultiplier = item.multiplier || 1;
      
      if (stats.xpMultiplier >= targetMultiplier) {
        setAlertConfig({ title: 'Al in bezit', message: `Je hebt al een ${stats.xpMultiplier}x of hogere XP upgrade actief!` });
        setAlertVisible(true);
        return;
      }
      
      if (stats.xp < item.price) {
        setAlertConfig({ title: 'Te weinig XP', message: `Je komt nog ${item.price - stats.xp} XP tekort!` });
        setAlertVisible(true);
        return;
      }
      
      const newStats = {
        ...stats,
        xp: stats.xp - item.price,
        xpMultiplier: targetMultiplier,
      };
      
      await statsStore.saveStats(newStats);
      onUpdateStats(newStats);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShootConfetti(true);
      setTimeout(() => setShootConfetti(false), 3000);
    }
  };

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === 'themes') {
      return item.type === 'background' || item.type === 'card';
    }
    if (activeTab === 'powerups') {
      return item.type === 'powerup';
    }
    if (activeTab === 'upgrades') {
      return item.type === 'upgrade';
    }
    return false;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={90} tint={theme.glass.background === '#FFFFFF' ? 'light' : 'dark'} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
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
                onPress={() => setActiveTab('themes')} 
                style={[
                  styles.tabButton, 
                  activeTab === 'themes' && { backgroundColor: theme.glass.background }
                ]}
              >
                <Text style={[
                  styles.tabText, 
                  { color: activeTab === 'themes' ? theme.cardTextPrimary : theme.cardTextSecondary }
                ]}>🎨 Thema's</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setActiveTab('powerups')} 
                style={[
                  styles.tabButton, 
                  activeTab === 'powerups' && { backgroundColor: theme.glass.background }
                ]}
              >
                <Text style={[
                  styles.tabText, 
                  { color: activeTab === 'powerups' ? theme.cardTextPrimary : theme.cardTextSecondary }
                ]}>🛡️ Power-ups</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setActiveTab('upgrades')} 
                style={[
                  styles.tabButton, 
                  activeTab === 'upgrades' && { backgroundColor: theme.glass.background }
                ]}
              >
                <Text style={[
                  styles.tabText, 
                  { color: activeTab === 'upgrades' ? theme.cardTextPrimary : theme.cardTextSecondary }
                ]}>⚡ Upgrades</Text>
              </TouchableOpacity>
            </View>

            {/* Shop List */}
            <ScrollView style={styles.shopList} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
              {filteredItems.map((item) => {
                const isTheme = item.type === 'background' || item.type === 'card';
                const isPowerup = item.type === 'powerup';
                const isUpgrade = item.type === 'upgrade';
                
                let buttonTitle = `Koop voor ${item.price} XP`;
                let buttonColor = theme.accent;
                let itemBadgeText = '';

                if (isTheme) {
                  const isUnlocked = item.price === 0 || stats.unlockedItems.includes(item.id);
                  const isEquipped = item.type === 'background' 
                    ? equippedBackground === item.id 
                    : equippedCard === item.id;

                  itemBadgeText = item.type === 'background' ? 'Achtergrond' : 'Kaartstijl';

                  if (isUnlocked) {
                    if (isEquipped) {
                      buttonTitle = 'Uitgerust ✓';
                      buttonColor = theme.glass.border;
                    } else {
                      buttonTitle = 'Uitrusten';
                      buttonColor = '#58CC02';
                    }
                  }
                } else if (isPowerup) {
                  const statsKey = item.statsKey as 'shields' | 'timeSlows' | 'hints';
                  const count = stats[statsKey] || 0;
                  itemBadgeText = `In bezit: ${count}`;
                  buttonColor = '#58CC02';
                } else if (isUpgrade) {
                  const targetMultiplier = item.multiplier || 1;
                  const isOwned = stats.xpMultiplier >= targetMultiplier;
                  itemBadgeText = 'Permanente boost';
                  
                  if (isOwned) {
                    buttonTitle = 'Gekocht ✓';
                    buttonColor = theme.glass.border;
                  } else {
                    buttonColor = '#F59E0B'; // Orange for upgrade
                  }
                }

                return (
                  <View 
                    key={item.id} 
                    style={[
                      styles.shopItem, 
                      { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border },
                      (isTheme && (equippedBackground === item.id || equippedCard === item.id)) && { borderColor: theme.accent, borderBottomColor: theme.accent }
                    ]}
                  >
                    <View style={styles.itemInfo}>
                      <View style={[styles.iconWrapper, { backgroundColor: theme.glass.background }]}>
                        <Text style={styles.itemIcon}>{item.icon}</Text>
                      </View>
                      <View style={styles.textWrapper}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={[styles.itemName, { color: theme.cardTextPrimary }]}>{item.name}</Text>
                          {itemBadgeText ? (
                            <Text style={[styles.badgeText, { color: theme.accent, backgroundColor: theme.glass.background }]}>
                              {itemBadgeText}
                            </Text>
                          ) : null}
                        </View>
                        <Text style={[styles.itemDescription, { color: theme.cardTextSecondary }]}>
                          {item.description}
                        </Text>
                      </View>
                    </View>

                    <BouncyButton 
                      title={buttonTitle}
                      color={buttonColor}
                      borderColor={buttonColor === '#58CC02' ? '#46A302' : buttonColor}
                      bottomBorderColor={buttonColor === '#58CC02' ? '#2D6A01' : buttonColor}
                      disabled={buttonTitle.includes('✓')}
                      textStyle={{ fontSize: 15, color: buttonTitle.includes('✓') ? theme.cardTextSecondary : '#FFF' }}
                      style={{ paddingVertical: 12, borderRadius: 16, width: '100%' }}
                      onPress={() => handleAction(item)}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      </BlurView>

      <CustomAlertModal
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
      />

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
    fontSize: 13,
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
    fontSize: 16,
  },
  itemDescription: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
