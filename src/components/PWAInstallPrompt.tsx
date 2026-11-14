import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Easing, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePWAInstall } from '../hooks/usePlatform';
import { useAppTheme, RADIUS } from '../theme/colors';

interface Props {
  readonly isHome: boolean;
}

const DISMISS_KEY = 'taalswipe-pwa-install-dismissed';

function wasPromptDismissed(): boolean {
  try {
    return typeof window !== 'undefined' && window.sessionStorage.getItem(DISMISS_KEY) === 'true';
  } catch {
    return false;
  }
}

function rememberPromptDismissed(): void {
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(DISMISS_KEY, 'true');
    }
  } catch {
    // Storage can be unavailable in private or restricted webviews.
  }
}

export const PWAInstallPrompt = React.memo(function PWAInstallPrompt({ isHome }: Props) {
  const { canInstall, install, preparePrompt } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const canShow = isHome && width < 768;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (!canShow || !canInstall || dismissed) return;
    if (typeof window === 'undefined') return;
    if (wasPromptDismissed()) return;

    const timer = setTimeout(() => {
      preparePrompt();
      setShowPrompt(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 240,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, [canInstall, dismissed, canShow]);

  useEffect(() => {
    if (!canShow) setShowPrompt(false);
  }, [canShow]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 16, duration: 140, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setShowPrompt(false);
      setDismissed(true);
      rememberPromptDismissed();
    });
  };

  const handleInstall = async () => {
    // The prompt event is single-use, so hide the banner after either outcome
    // (accepted, dismissed, or unavailable) instead of leaving a dead button.
    await install();
    dismiss();
  };

  if (!showPrompt || !canShow) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bannerContent,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View style={[styles.iconTile, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="phone-portrait-outline" size={20} color={theme.accent} />
        </View>

        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: theme.ink }]}>Op je beginscherm?</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.dismissButton}
            onPress={dismiss}
            accessibilityRole="button"
            accessibilityLabel="Melding sluiten"
            focusable={false}
          >
            <Ionicons name="close" size={18} color={theme.inkMuted} />
          </Pressable>
          <Pressable
            style={[styles.installButton, { backgroundColor: theme.accent }]}
            onPress={handleInstall}
            accessibilityRole="button"
            accessibilityLabel="TaalSwipe installeren"
            focusable={false}
          >
            <Text style={[styles.installButtonText, { color: theme.accentContrast }]}>
              Installeren
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    maxWidth: 520,
    alignSelf: 'center',
    zIndex: 1000,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.control,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 4,
  },
  dismissButton: {
    padding: 7,
  },
  installButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.chip,
  },
  installButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
});
