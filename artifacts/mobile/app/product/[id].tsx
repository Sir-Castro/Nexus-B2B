import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { useCart } from '@/contexts/CartContext';
import { mockProducts } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const product = mockProducts.find(p => p.id === id);
  const [qty, setQty] = useState('');
  const [selectedTier, setSelectedTier] = useState(0);

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground }}>Product not found</Text>
      </View>
    );
  }

  const qtyNum = parseInt(qty) || 0;
  const activeTier = product.pricingTiers.reduce((best, tier) => {
    return qtyNum >= tier.minQty ? tier : best;
  }, product.pricingTiers[0]);

  const lineTotal = qtyNum * activeTier.price;

  const stockVariant = product.status === 'in_stock' ? 'success' : product.status === 'low_stock' ? 'warning' : 'error';
  const stockLabel = product.status === 'in_stock' ? 'In Stock' : product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock';

  const handleAddToCart = () => {
    if (qtyNum < product.moq) {
      Alert.alert('Minimum Order Quantity', `The MOQ for this product is ${product.moq} ${product.unit}s.`);
      return;
    }
    addItem({
      productId: product.id,
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      productName: product.name,
      qty: qtyNum,
      unit: product.unit,
      unitPrice: activeTier.price,
      moq: product.moq,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Added to Cart', `${qtyNum} ${product.unit}s of ${product.name} added to your cart.`, [
      { text: 'View Cart', onPress: () => router.push('/cart') },
      { text: 'Continue Shopping', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]} numberOfLines={1}>Product Details</Text>
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.secondary }]}>
          <Feather name="package" size={56} color={colors.mutedForeground} />
        </View>

        <View style={styles.info}>
          <Text style={[styles.supplier, { color: colors.accent }]}>{product.supplierName}</Text>
          <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
          <View style={styles.skuRow}>
            <Text style={[styles.sku, { color: colors.mutedForeground }]}>SKU: {product.sku}</Text>
            <Badge label={stockLabel} variant={stockVariant} small />
          </View>

          <View style={styles.moqBox}>
            <Feather name="info" size={14} color={colors.primary} />
            <Text style={[styles.moqText, { color: colors.primary }]}>
              Minimum Order Quantity: {product.moq} {product.unit}s
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Volume Pricing</Text>
            {product.pricingTiers.map((tier, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.tierRow,
                  { borderColor: colors.border },
                  selectedTier === i && { backgroundColor: colors.secondary },
                ]}
                onPress={() => setSelectedTier(i)}
              >
                <Text style={[styles.tierLabel, { color: colors.text }]}>{tier.label}</Text>
                <Text style={[styles.tierPrice, { color: colors.primary }]}>${tier.price.toFixed(2)}/{product.unit}</Text>
                {i === 0 && <Badge label="Base" variant="default" small />}
                {i > 0 && <Badge label={`Save ${Math.round((1 - tier.price / product.pricingTiers[0].price) * 100)}%`} variant="success" small />}
              </TouchableOpacity>
            ))}
          </View>

          {Object.keys(product.specs).length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Specifications</Text>
              {Object.entries(product.specs).map(([key, val]) => (
                <View key={key} style={[styles.specRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.specKey, { color: colors.mutedForeground }]}>{key}</Text>
                  <Text style={[styles.specVal, { color: colors.text }]}>{val}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>About this Product</Text>
            <Text style={[styles.description, { color: colors.mutedForeground }]}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <View style={[styles.qtyRow, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.qtyInput, { color: colors.text }]}
            value={qty}
            onChangeText={setQty}
            placeholder={`Min ${product.moq}`}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
          />
          <Text style={[styles.qtyUnit, { color: colors.mutedForeground }]}>{product.unit}s</Text>
        </View>
        <View style={styles.footerRight}>
          {qtyNum > 0 && (
            <Text style={[styles.totalText, { color: colors.mutedForeground }]}>
              Total: <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold' }}>${lineTotal.toFixed(2)}</Text>
            </Text>
          )}
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.navy }]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Feather name="shopping-cart" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { width: 36 },
  topBarTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  content: { gap: 0 },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 16,
    gap: 12,
  },
  supplier: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    lineHeight: 28,
  },
  skuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sku: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  moqBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#EEF4FF',
    borderRadius: 10,
  },
  moqText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tierLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  tierPrice: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  specKey: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  specVal: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    minWidth: 110,
  },
  qtyInput: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    minWidth: 50,
  },
  qtyUnit: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  footerRight: {
    flex: 1,
    gap: 4,
  },
  totalText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});
