import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePWAInstall } from '../hooks/usePlatform';
import { useAppTheme } from '../theme/colors';

export const PWAInstallPrompt = React.memo(function PWAInstallPrompt() {
  const { canInstall, install } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const theme = useAppTheme('straattaal');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (canInstall && !dismissed) {
      // Check if user has already dismissed this session
      if (typeof window !== 'undefined') {
        const hasDismissed = sessionStorage.getItem('pwa-install-dismissed');
        if (!hasDismissed) {
          setTimeout(() => {
            setShowPrompt(true);
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.back(1.2)),
                useNativeDriver: true,
              }),
            ]).start();
          }, 3000); // Show after 3 seconds
        }
      }
    }
    return () => {
      if (showPrompt) {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 20, duration: 200, useNativeDriver: true }),
        ]).start();
      }
    };
  }, [canInstall, dismissed, showPrompt]);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setShowPrompt(false);
      setDismissed(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pwa-install-dismissed', 'true');
      }
    }
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowPrompt(false);
        setDismissed(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pwa-install-dismissed', 'true');
        }
      }
    });
  };

  if (!showPrompt) return null;

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
      <View style={[styles.bannerContent, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}>
        <View style={styles.iconWrapper}>
          <Ionicons name="phone-portrait" size={28} color={theme.accent} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: theme.cardTextPrimary }]}>Installeer TaalSwipe</Text>
          <Text style={[styles.subtitle, { color: theme.cardTextSecondary }]}>
            Speel offline, sneller laden, native ervaring
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss} accessibilityLabel="Sluiten">
            <Ionicons name="close" size={20} color={theme.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.installButton, { backgroundColor: theme.accent }]}
            onPress={handleInstall}
            accessibilityLabel="TaalSwipe installeren"
          >
            <Text style={styles.installButtonText}>Installeren</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    maxWidth: 480,
    alignSelf: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  dismissButton: {
    padding: 8,
    marginRight: 8,
  },
  installButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  installButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
});