import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '@/components/Badge';
import { useColors } from '@/hooks/useColors';
import { Order, OrderStatus } from '@/types';

interface Props {
  order: Order;
  onPress: () => void;
}

function getStatusVariant(status: OrderStatus) {
  switch (status) {
    case 'delivered': return 'success';
    case 'shipped': return 'accent';
    case 'processing': return 'navy';
    case 'confirmed': return 'navy';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
}

function getStatusLabel(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function OrderCard({ order, onPress }: Props) {
  const colors = useColors();
  const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.orderNumber, { color: colors.text }]}>{order.orderNumber}</Text>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>{date}</Text>
        </View>
        <Badge label={getStatusLabel(order.status)} variant={getStatusVariant(order.status)} />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.body}>
        <View style={styles.supplierRow}>
          <Feather name="truck" size={13} color={colors.mutedForeground} />
          <Text style={[styles.supplier, { color: colors.mutedForeground }]}>{order.supplierName}</Text>
        </View>
        <Text style={[styles.itemSummary, { color: colors.text }]}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          {order.items.length > 0 && ` • ${order.items[0].productName}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}`}
        </Text>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>Total</Text>
          <Text style={[styles.total, { color: colors.text }]}>${order.total.toLocaleString()}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Badge
            label={order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'overdue' ? 'Overdue' : 'Pending'}
            variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'overdue' ? 'error' : 'warning'}
            small
          />
          <Text style={[styles.term, { color: colors.mutedForeground }]}>{order.paymentTerm}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  body: {
    gap: 4,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supplier: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  itemSummary: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  total: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  term: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
