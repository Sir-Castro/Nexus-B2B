import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { useColors } from '@/hooks/useColors';
import { Supplier } from '@/types';

interface Props {
  supplier: Supplier;
  onPress: () => void;
}

export function SupplierCard({ supplier, onPress }: Props) {
  const colors = useColors();

  const initials = supplier.name.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.navy }]}>
          <Text style={[styles.initials, { color: colors.primaryForeground }]}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{supplier.name}</Text>
            {supplier.verified && (
              <Feather name="check-circle" size={14} color={colors.accent} style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={[styles.location, { color: colors.mutedForeground }]}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} /> {supplier.location}
          </Text>
        </View>
        <View style={styles.ratingBox}>
          <Feather name="star" size={12} color="#F59E0B" />
          <Text style={[styles.rating, { color: colors.text }]}>{supplier.rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.tagsRow}>
        <Badge label={supplier.category} variant="navy" small />
        {supplier.featured && <Badge label="Featured" variant="accent" small />}
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>{supplier.productsCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Products</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>{supplier.fulfillmentRate}%</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Fulfillment</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>${(supplier.minOrderValue / 1000).toFixed(0)}K+</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Min Order</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
  },
});
