import React from 'react';
import { StyleProp, StyleSheet, Text, View, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, RADIUS } from '../theme/colors';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from '../platform/haptics';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  readonly icon: IoniconName;
  readonly title: string;
  readonly description: string;
  readonly onPress: () => void;
  readonly style?: StyleProp<ViewStyle>;
  readonly wrapperStyle?: StyleProp<ViewStyle>;
  readonly delay?: number;
  readonly compact?: boolean;
  readonly isSelected?: boolean;
  readonly meta?: string;
  readonly grouped?: boolean;
  readonly isLast?: boolean;
}

export const ModeCard = React.memo(function ModeCard({
  icon,
  title,
  description,
  onPress,
  style,
  wrapperStyle,
  delay = 0,
  compact = false,
  isSelected = false,
  meta,
  grouped = false,
  isLast = false,
}: Props) {
  const theme = useAppTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(Math.min(delay, 220)).duration(260)}
      style={wrapperStyle}
    >
      <Pressable
        style={({ pressed }) => [
          styles.card,
          compact && styles.compactCard,
          grouped && styles.groupedCard,
          {
            backgroundColor: pressed
              ? theme.surfaceMuted
              : grouped
                ? isSelected
                  ? theme.accentSoft
                  : 'transparent'
                : theme.surface,
            borderColor: grouped
              ? 'transparent'
              : isSelected
                ? theme.accent
                : theme.border,
            borderWidth: grouped ? 0 : isSelected ? 1.5 : 1,
          },
          grouped && !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
          style,
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        accessible
        focusable={false}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${description}`}
        testID="mode-card"
      >
        <View
          style={[
            styles.iconTile,
            compact && styles.compactIconTile,
            { backgroundColor: theme.accentSoft },
          ]}
        >
          <Ionicons name={icon} size={compact ? 20 : 22} color={theme.accent} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, compact && styles.compactTitle, { color: theme.ink }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {meta ? (
              <Text style={[styles.meta, { color: theme.inkMuted }]}>{meta}</Text>
            ) : null}
          </View>
          <Text
            style={[styles.description, compact && styles.compactDescription, { color: theme.inkSecondary }]}
            numberOfLines={3}
          >
            {description}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.card,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 14,
  },
  compactCard: {
    minHeight: 96,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  groupedCard: {
    borderRadius: 0,
    paddingVertical: 14,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIconTile: {
    width: 36,
    height: 36,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  compactTitle: {
    fontSize: 15,
  },
  meta: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
  },
  compactDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
});
