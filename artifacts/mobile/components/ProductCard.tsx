import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { useColors } from '@/hooks/useColors';
import { Product } from '@/types';

interface Props {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: Props) {
  const colors = useColors();

  const stockVariant = product.status === 'in_stock' ? 'success' : product.status === 'low_stock' ? 'warning' : 'error';
  const stockLabel = product.status === 'in_stock' ? 'In Stock' : product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
        <Feather name="package" size={28} color={colors.mutedForeground} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.supplier, { color: colors.accent }]} numberOfLines={1}>{product.supplierName}</Text>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
        <Text style={[styles.sku, { color: colors.mutedForeground }]}>SKU: {product.sku}</Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>/{product.unit}</Text>
        </View>

        <View style={styles.footer}>
          <View style={[styles.moqBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.moqText, { color: colors.secondaryForeground }]}>MOQ: {product.moq} {product.unit}s</Text>
          </View>
          <Badge label={stockLabel} variant={stockVariant} small />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
  },
  imagePlaceholder: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  supplier: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  sku: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  unit: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  moqBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  moqText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
});
