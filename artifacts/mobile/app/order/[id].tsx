import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { mockOrders } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { OrderStatus } from '@/types';

function getStatusVariant(s: OrderStatus) {
  switch (s) {
    case 'delivered': return 'success';
    case 'shipped': return 'accent';
    case 'processing': case 'confirmed': return 'navy';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default' as const;
  }
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const order = mockOrders.find(o => o.id === id);
  if (!order) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ color: colors.mutedForeground }}>Order not found</Text>
    </View>
  );

  const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const completedSteps = order.tracking.filter(t => t.completed).length;
  const progressPct = order.tracking.length > 0 ? (completedSteps / order.tracking.length) * 100 : 0;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.orderNum, { color: colors.text }]}>{order.orderNumber}</Text>
          <Badge label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} variant={getStatusVariant(order.status)} small />
        </View>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardRow}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Supplier</Text>
            <Text style={[styles.value, { color: colors.text }]}>{order.supplierName}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Order Date</Text>
            <Text style={[styles.value, { color: colors.text }]}>{date}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Expected Delivery</Text>
            <Text style={[styles.value, { color: colors.text }]}>{order.expectedDelivery}</Text>
          </View>
          {order.trackingNumber && (
            <View style={styles.cardRow}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Tracking #</Text>
              <Text style={[styles.value, { color: colors.primary }]}>{order.trackingNumber}</Text>
            </View>
          )}
          <View style={styles.cardRow}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Payment</Text>
            <View style={styles.paymentRow}>
              <Badge
                label={order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'overdue' ? 'Overdue' : 'Pending'}
                variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'overdue' ? 'error' : 'warning'}
                small
              />
              <Text style={[styles.paymentTerm, { color: colors.mutedForeground }]}>{order.paymentTerm}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipment Tracking</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: colors.accent }]} />
          </View>
          <View style={styles.timeline}>
            {order.tracking.map((step, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    { backgroundColor: step.completed ? colors.accent : colors.border, borderColor: step.completed ? colors.accent : colors.border },
                  ]}>
                    {step.completed && <Feather name="check" size={10} color="#fff" />}
                  </View>
                  {idx < order.tracking.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: step.completed ? colors.accent : colors.border }]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineStatus, { color: step.completed ? colors.text : colors.mutedForeground }]}>
                    {step.status}
                  </Text>
                  {step.location ? <Text style={[styles.timelineLocation, { color: colors.mutedForeground }]}>{step.location}</Text> : null}
                  {step.timestamp ? <Text style={[styles.timelineTime, { color: colors.mutedForeground }]}>{step.timestamp}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Text>
          {order.items.map((item, idx) => (
            <View key={idx} style={[styles.itemRow, { borderTopColor: colors.border }, idx > 0 && { borderTopWidth: 1 }]}>
              <View style={[styles.itemIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="package" size={18} color={colors.mutedForeground} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.productName}</Text>
                <Text style={[styles.itemQty, { color: colors.mutedForeground }]}>{item.qty} {item.unit}s × ${item.unitPrice.toFixed(2)}</Text>
              </View>
              <Text style={[styles.itemTotal, { color: colors.text }]}>${item.total.toLocaleString()}</Text>
            </View>
          ))}
          <View style={[styles.orderTotal, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>Order Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>${order.total.toLocaleString()}</Text>
          </View>
        </View>

        {order.notes && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
            <Text style={[styles.notes, { color: colors.mutedForeground }]}>{order.notes}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  orderNum: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  value: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentTerm: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginVertical: 3,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    gap: 2,
  },
  timelineStatus: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  timelineLocation: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  timelineTime: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    gap: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  itemQty: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  notes: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
});
