import React from 'react';
import { StyleSheet, Text, View, Pressable, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from '../platform/haptics';
import { useAppTheme } from '../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  readonly title: string;
  readonly rightNode?: React.ReactNode;
  readonly style?: ViewStyle;
}

export function PremiumTopBar({ title, rightNode, style }: Props) {
  const navigation = useNavigation();
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={[styles.container, style]}>
      <BlurView intensity={40} tint="dark" style={[styles.blurWrapper, { borderColor: theme.glass.border }]}>
        
        {/* Back Button */}
        <AnimatedPressable
          onPress={handleBack}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.backButton, backAnimatedStyle, { backgroundColor: theme.glass.highlight, borderColor: theme.glass.border }]}
        >
          <Ionicons name="chevron-back" size={26} color={theme.cardTextPrimary} />
        </AnimatedPressable>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.cardTextPrimary }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Optional Right Node / Placeholder */}
        <View style={styles.rightNodeContainer}>
          {rightNode || <View style={{ width: 44 }} />}
        </View>
        
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 20,
    marginTop: 8,
    zIndex: 100,
  },
  blurWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  rightNodeContainer: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
