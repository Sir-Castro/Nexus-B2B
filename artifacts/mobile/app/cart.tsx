import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { useCart } from '@/contexts/CartContext';
import { useColors } from '@/hooks/useColors';

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, removeItem, updateQty, totalAmount, clearCart } = useCart();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const groupedBySupplier = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.supplierId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleCheckout = () => {
    Alert.alert(
      'Confirm Order',
      `Place order for $${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearCart();
            Alert.alert('Order Placed!', 'Your order has been submitted successfully. Suppliers will confirm shortly.', [
              { text: 'View Orders', onPress: () => router.replace('/(tabs)/orders') },
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={() => { clearCart(); Haptics.impactAsync(); }}>
            <Text style={[styles.clearText, { color: colors.destructive }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="shopping-cart"
          title="Your cart is empty"
          subtitle="Browse the marketplace and add products to your cart"
          actionLabel="Browse Products"
          onAction={() => router.push('/(tabs)/marketplace')}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 140 }]}
            showsVerticalScrollIndicator={false}
          >
            {Object.entries(groupedBySupplier).map(([supplierId, supplierItems]) => (
              <View key={supplierId} style={styles.supplierGroup}>
                <View style={[styles.supplierHeader, { backgroundColor: colors.secondary }]}>
                  <Feather name="truck" size={14} color={colors.primary} />
                  <Text style={[styles.supplierName, { color: colors.text }]}>{supplierItems[0].supplierName}</Text>
                  <Text style={[styles.supplierCount, { color: colors.mutedForeground }]}>{supplierItems.length} item{supplierItems.length !== 1 ? 's' : ''}</Text>
                </View>

                {supplierItems.map(item => (
                  <View key={item.productId} style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.itemIcon, { backgroundColor: colors.secondary }]}>
                      <Feather name="package" size={20} color={colors.mutedForeground} />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>{item.productName}</Text>
                      <Text style={[styles.itemPrice, { color: colors.primary }]}>${item.unitPrice.toFixed(2)}/{item.unit}</Text>
                      <Text style={[styles.itemMoq, { color: colors.mutedForeground }]}>MOQ: {item.moq}</Text>
                    </View>
                    <View style={styles.itemControls}>
                      <Text style={[styles.lineTotal, { color: colors.text }]}>
                        ${(item.qty * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Text>
                      <View style={styles.qtyControls}>
                        <TouchableOpacity
                          style={[styles.qtyBtn, { backgroundColor: colors.secondary }]}
                          onPress={() => { updateQty(item.productId, Math.max(item.moq, item.qty - item.moq)); Haptics.impactAsync(); }}
                        >
                          <Feather name="minus" size={14} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.qtyText, { color: colors.text }]}>{item.qty}</Text>
                        <TouchableOpacity
                          style={[styles.qtyBtn, { backgroundColor: colors.secondary }]}
                          onPress={() => { updateQty(item.productId, item.qty + item.moq); Haptics.impactAsync(); }}
                        >
                          <Feather name="plus" size={14} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => { removeItem(item.productId); Haptics.impactAsync(); }}>
                        <Feather name="trash-2" size={16} color={colors.destructive} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))}

            <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Subtotal ({items.length} items)</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Shipping (est.)</Text>
                <Text style={[styles.summaryValue, { color: colors.mutedForeground }]}>Calculated at checkout</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryTotal, { color: colors.text }]}>Total (excl. shipping)</Text>
                <Text style={[styles.summaryTotalValue, { color: colors.primary }]}>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: colors.navy }]}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutText}>Place Order</Text>
              <Text style={styles.checkoutAmount}>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36 },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    flex: 1,
    textAlign: 'center',
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  supplierGroup: {
    gap: 8,
  },
  supplierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  supplierName: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  supplierCount: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  itemMoq: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  itemControls: {
    alignItems: 'flex-end',
    gap: 8,
  },
  lineTotal: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    minWidth: 30,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  summaryTotal: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  footer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  checkoutAmount: {
    color: '#00BFA5',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
