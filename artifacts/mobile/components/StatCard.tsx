import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  trend?: string;
  trendUp?: boolean;
  accent?: boolean;
}

export function StatCard({ label, value, icon, trend, trendUp, accent }: Props) {
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: accent ? colors.navy : colors.card, borderColor: accent ? 'transparent' : colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: accent ? 'rgba(255,255,255,0.15)' : colors.secondary }]}>
        <Feather name={icon} size={18} color={accent ? '#fff' : colors.primary} />
      </View>
      <Text style={[styles.value, { color: accent ? '#fff' : colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: accent ? 'rgba(255,255,255,0.7)' : colors.mutedForeground }]}>{label}</Text>
      {trend && (
        <View style={styles.trendRow}>
          <Feather
            name={trendUp ? 'trending-up' : 'trending-down'}
            size={12}
            color={trendUp ? (accent ? '#7FFFEE' : colors.success) : colors.destructive}
          />
          <Text style={[styles.trend, { color: trendUp ? (accent ? '#7FFFEE' : colors.success) : colors.destructive }]}>
            {trend}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 6,
    minWidth: 140,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  trend: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});
