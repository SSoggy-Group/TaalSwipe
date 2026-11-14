import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme, RADIUS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { statsStore, AppStats } from '../store/statsStore';
import { useSettingsStore } from '../store/settingsStore';
import * as Haptics from '../platform/haptics';
import { BouncyButton } from '../components/BouncyButton';
import { CustomAlertModal } from '../components/CustomAlertModal';
import { soundManager } from '../audio/SoundManager';
import { GradientBackground } from '../components/GradientBackground';
import { PremiumTopBar } from '../components/PremiumTopBar';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;
type IconName = React.ComponentProps<typeof Ionicons>['name'];
type ShopTab = 'themes' | 'powerups' | 'upgrades';

interface ShopItem {
  id: string;
  name: string;
  type: 'background' | 'card' | 'powerup' | 'upgrade';
  price: number;
  icon: IconName;
  description: string;
  statsKey?: 'shields' | 'timeSlows' | 'hints' | 'doubleXpBonuses';
  multiplier?: number;
}

const SHOP_ITEMS: ShopItem[] = [
  // ACHTERGRONDEN
  { id: 'bg_ocean', name: 'Oceaan', type: 'background', price: 0, icon: 'water-outline', description: 'Koele blauwgrijze tint voor je scherm.' },
  { id: 'bg_neon', name: 'Neon', type: 'background', price: 500, icon: 'moon-outline', description: 'Paarse avondtint.' },
  { id: 'bg_sunset', name: 'Zonsondergang', type: 'background', price: 1000, icon: 'partly-sunny-outline', description: 'Warme, rozige tint.' },
  { id: 'bg_forest', name: 'Bos', type: 'background', price: 1200, icon: 'leaf-outline', description: 'Groene, rustige tint.' },
  { id: 'bg_aurora', name: 'Poollicht', type: 'background', price: 1500, icon: 'sparkles-outline', description: 'Koel groen met een vleugje mint.' },
  { id: 'bg_matrix', name: 'Matrix', type: 'background', price: 2000, icon: 'grid-outline', description: 'Diepgroene tint.' },
  { id: 'bg_candy', name: 'Kermis', type: 'background', price: 2500, icon: 'ice-cream-outline', description: 'Zachte roze tint.' },
  { id: 'bg_volcano', name: 'Vulkaan', type: 'background', price: 3000, icon: 'flame-outline', description: 'Aardse roodbruine tint.' },
  { id: 'bg_royal', name: 'Koninklijk', type: 'background', price: 4000, icon: 'cube-outline', description: 'Diep indigoblauw.' },
  { id: 'bg_nebula', name: 'Nevel', type: 'background', price: 5000, icon: 'planet-outline', description: 'Grijspaarse tint.' },
  { id: 'bg_lava', name: 'Lava', type: 'background', price: 1800, icon: 'thermometer-outline', description: 'Warme terracotta tint.' },
  { id: 'bg_cherry', name: 'Kersenbloesem', type: 'background', price: 2200, icon: 'flower-outline', description: 'Fijne rozetint.' },
  { id: 'bg_arctic', name: 'Arctisch', type: 'background', price: 2800, icon: 'snow-outline', description: 'Koele ijsblauwe tint.' },
  { id: 'bg_deep_sea', name: 'Diepzee', type: 'background', price: 3500, icon: 'fish-outline', description: 'Donkerblauwe tint.' },

  // KAARTSTIJLEN
  { id: 'card_default', name: 'Klassiek', type: 'card', price: 0, icon: 'square-outline', description: 'Wit papier met een dunne rand.' },
  { id: 'card_gold', name: 'Oker', type: 'card', price: 1500, icon: 'sunny-outline', description: 'Warm papier met een okeren rand.' },
  { id: 'card_neon', name: 'Petrol', type: 'card', price: 2000, icon: 'color-fill-outline', description: 'Koel blauwgroen met een dunne rand.' },
  { id: 'card_retro', name: 'Archief', type: 'card', price: 2500, icon: 'file-tray-outline', description: 'Gebroken wit met een grijze rand.' },
  { id: 'card_holo', name: 'Lila', type: 'card', price: 3500, icon: 'albums-outline', description: 'Zacht lila met een paarse rand.' },
  { id: 'card_rainbow', name: 'Papier', type: 'card', price: 5000, icon: 'layers-outline', description: 'Neutraal wit met een warme rand.' },
  { id: 'card_shadow', name: 'Inkt', type: 'card', price: 1000, icon: 'moon-outline', description: 'Donkere kaart met lichte tekst.' },
  { id: 'card_pastel', name: 'Salie', type: 'card', price: 800, icon: 'leaf-outline', description: 'Fris groen met een sage-rand.' },
  { id: 'card_flame', name: 'Terracotta', type: 'card', price: 2200, icon: 'flame-outline', description: 'Warme roodbruine rand.' },
  { id: 'card_ice', name: 'IJs', type: 'card', price: 2800, icon: 'snow-outline', description: 'Koele blauwe rand.' },

  // POWER-UPS
  { id: 'powerup_shield', name: 'Schild', type: 'powerup', statsKey: 'shields', price: 250, icon: 'shield-checkmark-outline', description: 'Voorkomt één fout en houdt je reeks intact.' },
  { id: 'powerup_timer', name: 'Tijdvertraging', type: 'powerup', statsKey: 'timeSlows', price: 300, icon: 'timer-outline', description: 'Reset de timer in speed-spelling.' },
  { id: 'powerup_hint', name: 'Hint', type: 'powerup', statsKey: 'hints', price: 400, icon: 'search-outline', description: 'Licht de juiste swipe-richting op.' },
  { id: 'powerup_double', name: 'Dubbele XP', type: 'powerup', statsKey: 'doubleXpBonuses', price: 600, icon: 'star-outline', description: 'Verdubbelt de XP van je volgende sessie.' },

  // UPGRADES
  { id: 'upgrade_xp_15', name: 'XP-booster 1,5×', type: 'upgrade', multiplier: 1.5, price: 1500, icon: 'speedometer-outline', description: 'Permanent 50% extra XP.' },
  { id: 'upgrade_xp_20', name: 'XP-booster 2×', type: 'upgrade', multiplier: 2, price: 3000, icon: 'rocket-outline', description: 'Permanent 100% extra XP.' },
  { id: 'upgrade_xp_30', name: 'XP-booster 3×', type: 'upgrade', multiplier: 3, price: 6000, icon: 'trophy-outline', description: 'Permanent 200% extra XP.' },
];

export function ShopScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const [stats, setStats] = React.useState<AppStats | null>(null);
  const [activeTab, setActiveTab] = React.useState<ShopTab>('themes');
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({ title: '', message: '' });

  const {
    equippedBackground,
    equippedCard,
    setEquippedBackground,
    setEquippedCard,
  } = useSettingsStore();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentStats = await statsStore.getStats();
      setStats(currentStats);
    });
    return unsubscribe;
  }, [navigation]);

  const handleAction = async (item: ShopItem) => {
    if (!stats) return;
    const isTheme = item.type === 'background' || item.type === 'card';

    if (isTheme) {
      const isUnlocked = item.price === 0 || stats.unlockedItems.includes(item.id);
      if (isUnlocked) {
        if (item.type === 'background') {
          setEquippedBackground(item.id);
        } else {
          setEquippedCard(item.id);
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return;
      }

      if (stats.xp < item.price) {
        setAlertConfig({ title: 'Te weinig XP', message: `Je komt nog ${item.price - stats.xp} XP tekort.` });
        setAlertVisible(true);
        return;
      }

      const newStats = {
        ...stats,
        xp: stats.xp - item.price,
        unlockedItems: [...stats.unlockedItems, item.id],
      };

      await statsStore.saveStats(newStats);
      setStats(newStats);

      if (item.type === 'background') {
        setEquippedBackground(item.id);
      } else {
        setEquippedCard(item.id);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundManager.playPurchase();
      return;
    }

    if (item.type === 'powerup') {
      if (stats.xp < item.price) {
        setAlertConfig({ title: 'Te weinig XP', message: `Je komt nog ${item.price - stats.xp} XP tekort.` });
        setAlertVisible(true);
        return;
      }

      const statsKey = item.statsKey as 'shields' | 'timeSlows' | 'hints' | 'doubleXpBonuses';
      const currentVal = stats[statsKey] || 0;

      const newStats = {
        ...stats,
        xp: stats.xp - item.price,
        [statsKey]: currentVal + 1,
      };

      await statsStore.saveStats(newStats);
      setStats(newStats);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    if (item.type === 'upgrade') {
      const targetMultiplier = item.multiplier || 1;

      if (stats.xpMultiplier >= targetMultiplier) {
        setAlertConfig({ title: 'Al in bezit', message: `Je hebt al een ${stats.xpMultiplier}× of hogere XP-upgrade actief.` });
        setAlertVisible(true);
        return;
      }

      if (stats.xp < item.price) {
        setAlertConfig({ title: 'Te weinig XP', message: `Je komt nog ${item.price - stats.xp} XP tekort.` });
        setAlertVisible(true);
        return;
      }

      const newStats = {
        ...stats,
        xp: stats.xp - item.price,
        xpMultiplier: targetMultiplier,
      };

      await statsStore.saveStats(newStats);
      setStats(newStats);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === 'themes') {
      return item.type === 'background' || item.type === 'card';
    }
    if (activeTab === 'powerups') {
      return item.type === 'powerup';
    }
    return item.type === 'upgrade';
  });

  const getItemState = (item: ShopItem) => {
    if (!stats) return { buttonTitle: '', buttonVariant: 'primary' as const, badge: '', disabled: false, equipped: false };

    if (item.type === 'background' || item.type === 'card') {
      const isUnlocked = item.price === 0 || stats.unlockedItems.includes(item.id);
      const isEquipped = item.type === 'background'
        ? equippedBackground === item.id
        : equippedCard === item.id;

      if (isEquipped) {
        return { buttonTitle: 'In gebruik', buttonVariant: 'secondary' as const, badge: 'Actief', disabled: true, equipped: true };
      }
      if (isUnlocked) {
        return { buttonTitle: 'Gebruiken', buttonVariant: 'secondary' as const, badge: 'Ontgrendeld', disabled: false, equipped: false };
      }
      const canAfford = stats.xp >= item.price;
      return {
        buttonTitle: canAfford ? `${item.price} XP` : `Nog ${item.price - stats.xp} XP`,
        buttonVariant: 'primary' as const,
        badge: '',
        disabled: !canAfford,
        equipped: false,
      };
    }

    if (item.type === 'powerup') {
      const statsKey = item.statsKey as 'shields' | 'timeSlows' | 'hints' | 'doubleXpBonuses';
      const canAfford = stats.xp >= item.price;
      return {
        buttonTitle: canAfford ? `${item.price} XP` : `Nog ${item.price - stats.xp} XP`,
        buttonVariant: 'primary' as const,
        badge: `In bezit: ${stats[statsKey] || 0}`,
        disabled: !canAfford,
        equipped: false,
      };
    }

    const targetMultiplier = item.multiplier || 1;
    if (stats.xpMultiplier >= targetMultiplier) {
      return { buttonTitle: 'Gekocht', buttonVariant: 'secondary' as const, badge: 'Actief', disabled: true, equipped: false };
    }
    const canAfford = stats.xp >= item.price;
    return {
      buttonTitle: canAfford ? `${item.price} XP` : `Nog ${item.price - stats.xp} XP`,
      buttonVariant: 'primary' as const,
      badge: '',
      disabled: !canAfford,
      equipped: false,
    };
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          <PremiumTopBar
            title="Shop"
            rightNode={
              <View style={[styles.xpBadge, { backgroundColor: theme.surfaceMuted }]}>
                <Ionicons name="diamond-outline" size={13} color={theme.inkSecondary} />
                <Text style={[styles.xpText, { color: theme.ink }]}>{stats?.xp ?? 0} XP</Text>
              </View>
            }
          />

          <View style={[styles.tabBar, { backgroundColor: theme.surfaceMuted }]}>
            {([
              { key: 'themes', label: 'Thema\'s' },
              { key: 'powerups', label: 'Power-ups' },
              { key: 'upgrades', label: 'Upgrades' },
            ] as const).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  style={[
                    styles.tabButton,
                    isActive && { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.tabText, { color: isActive ? theme.ink : theme.inkSecondary }]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView
            style={styles.shopList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.shopListContent}
          >
            {stats && filteredItems.map((item) => {
              const state = getItemState(item);
              return (
                <View
                  key={item.id}
                  style={[
                    styles.shopItem,
                    {
                      backgroundColor: theme.surface,
                      borderColor: state.equipped ? theme.accent : theme.border,
                    },
                  ]}
                >
                  <View style={styles.itemTopRow}>
                    <View style={[styles.iconWrapper, { backgroundColor: theme.surfaceMuted }]}>
                      <Ionicons name={item.icon} size={19} color={theme.accent} />
                    </View>

                    <View style={styles.textWrapper}>
                      <View style={styles.itemTitleRow}>
                        <Text style={[styles.itemName, { color: theme.ink }]} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {state.badge ? (
                          <Text style={[styles.itemBadge, { color: theme.inkSecondary }]}>
                            {state.badge}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.itemDescription, { color: theme.inkSecondary }]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  <BouncyButton
                    title={state.buttonTitle}
                    variant={state.buttonVariant}
                    disabled={state.disabled}
                    onPress={() => handleAction(item)}
                    style={styles.itemButton}
                    accessibilityLabel={`${item.name}: ${state.buttonTitle}`}
                  />
                </View>
              );
            })}
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
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  xpText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: RADIUS.control,
    padding: 3,
    marginBottom: 16,
    marginHorizontal: 20,
    gap: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: RADIUS.chip,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  shopList: {
    flex: 1,
  },
  shopListContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  shopItem: {
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    gap: 12,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.control,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    flexShrink: 1,
  },
  itemBadge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    letterSpacing: 0.2,
  },
  itemDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  itemButton: {
    paddingVertical: 10,
    minHeight: 40,
  },
});
