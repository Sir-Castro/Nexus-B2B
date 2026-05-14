import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryChip({ categories, selected, onSelect }: Props) {
  const colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {categories.map(cat => {
        const isActive = cat === selected;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.navy : colors.card,
                borderColor: isActive ? colors.navy : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, { color: isActive ? '#fff' : colors.mutedForeground }]}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
