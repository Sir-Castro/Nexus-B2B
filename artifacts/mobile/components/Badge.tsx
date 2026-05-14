import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'accent' | 'navy';

interface Props {
  label: string;
  variant?: Variant;
  small?: boolean;
}

export function Badge({ label, variant = 'default', small = false }: Props) {
  const colors = useColors();

  const getBg = () => {
    switch (variant) {
      case 'success': return '#E8F5E9';
      case 'warning': return '#FFF8E1';
      case 'error': return '#FEEBEB';
      case 'accent': return '#E0F7F4';
      case 'navy': return '#E8EEF5';
      default: return colors.muted;
    }
  };

  const getFg = () => {
    switch (variant) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.destructive;
      case 'accent': return colors.accent;
      case 'navy': return colors.navy;
      default: return colors.mutedForeground;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBg() }, small && styles.small]}>
      <Text style={[styles.text, { color: getFg() }, small && styles.smallText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  smallText: {
    fontSize: 11,
  },
});
