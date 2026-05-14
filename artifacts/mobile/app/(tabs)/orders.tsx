import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { OrderCard } from '@/components/OrderCard';
import { mockOrders } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { OrderStatus } from '@/types';

const STATUS_FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = filter === 'all' ? mockOrders : mockOrders.filter(o => o.status === filter);

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
          <TouchableOpacity style={[styles.rfqBtn, { backgroundColor: colors.navy }]} onPress={() => router.push('/rfq')}>
            <Feather name="file-text" size={14} color="#fff" />
            <Text style={styles.rfqBtnText}>New RFQ</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {STATUS_FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === f.key ? colors.navy : colors.secondary,
                  borderColor: filter === f.key ? colors.navy : colors.border,
                },
              ]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterLabel, { color: filter === f.key ? '#fff' : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </Text>

        {filtered.length === 0 ? (
          <EmptyState
            icon="package"
            title="No orders found"
            subtitle="Orders matching your filter will appear here"
            actionLabel="Browse Marketplace"
            onAction={() => router.push('/(tabs)/marketplace')}
          />
        ) : (
          filtered.map(order => (
            <OrderCard key={order.id} order={order} onPress={() => router.push(`/order/${order.id}`)} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  rfqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  rfqBtnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  filters: {
    gap: 8,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  list: {
    padding: 16,
    gap: 0,
  },
  countLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 12,
  },
});
