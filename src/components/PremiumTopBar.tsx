import React from 'react';
import { StyleSheet, Text, View, Pressable, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from '../platform/haptics';
import { useAppTheme, RADIUS } from '../theme/colors';

interface Props {
  readonly title: string;
  readonly rightNode?: React.ReactNode;
  readonly style?: ViewStyle;
}

export function PremiumTopBar({ title, rightNode, style }: Props) {
  const navigation = useNavigation();
  const theme = useAppTheme();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={handleBack}
        style={({ pressed }) => [
          styles.backButton,
          {
            backgroundColor: pressed ? theme.surfaceMuted : theme.surface,
            borderColor: theme.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Terug"
        focusable={false}
      >
        <Ionicons name="chevron-back" size={20} color={theme.ink} />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.ink }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightNodeContainer}>
        {rightNode || <View style={{ width: 36 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.control,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    letterSpacing: -0.2,
  },
  rightNodeContainer: {
    minWidth: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
