import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderCard } from '@/components/OrderCard';
import { StatCard } from '@/components/StatCard';
import { SupplierCard } from '@/components/SupplierCard';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { mockConversations, mockOrders, mockSuppliers } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { totalItems } = useCart();

  const recentOrders = mockOrders.slice(0, 2);
  const featuredSuppliers = mockSuppliers.filter(s => s.featured).slice(0, 3);
  const unreadMessages = mockConversations.reduce((sum, c) => sum + c.unread, 0);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#1E3A5F', '#1565C0']} style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.name ?? 'Welcome'}</Text>
            <Text style={styles.company}>{user?.company}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/notifications')}>
              <Feather name="bell" size={20} color="#fff" />
              <View style={[styles.notifDot, { backgroundColor: colors.accent }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/cart')}>
              <Feather name="shopping-cart" size={20} color="#fff" />
              {totalItems > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.creditCard, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <View>
            <Text style={styles.creditLabel}>Available Credit</Text>
            <Text style={styles.creditValue}>
              ${((user?.creditLimit ?? 50000) - (user?.creditUsed ?? 0)).toLocaleString()}
            </Text>
          </View>
          <View style={styles.creditRight}>
            <Text style={styles.creditUsed}>Used: ${(user?.creditUsed ?? 0).toLocaleString()}</Text>
            <View style={[styles.creditBarBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <View
                style={[
                  styles.creditBarFill,
                  {
                    backgroundColor: colors.accent,
                    width: `${Math.min(((user?.creditUsed ?? 0) / (user?.creditLimit ?? 50000)) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.creditLimit}>Limit: ${(user?.creditLimit ?? 50000).toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.quickActions}>
          {[
            { icon: 'search' as const, label: 'Find Suppliers', onPress: () => router.push('/(tabs)/marketplace') },
            { icon: 'file-text' as const, label: 'Request Quote', onPress: () => router.push('/rfq') },
            { icon: 'shopping-cart' as const, label: 'My Cart', onPress: () => router.push('/cart') },
            { icon: 'bar-chart-2' as const, label: 'Analytics', onPress: () => router.push('/analytics') },
          ].map(action => (
            <TouchableOpacity
              key={action.label}
              style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={action.onPress}
              activeOpacity={0.75}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={action.icon} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Active Orders" value="3" icon="package" trend="+2 this week" trendUp accent />
          <StatCard label="Total Spent" value="$18.9K" icon="dollar-sign" trend="+12% vs last month" trendUp />
        </View>
        <View style={styles.statsGrid}>
          <StatCard label="Suppliers" value="5" icon="users" />
          <StatCard label="Messages" value={String(unreadMessages)} icon="message-square" trend={`${unreadMessages} unread`} trendUp={unreadMessages === 0} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.map(order => (
            <OrderCard key={order.id} order={order} onPress={() => router.push(`/order/${order.id}`)} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Suppliers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/marketplace')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>View all</Text>
            </TouchableOpacity>
          </View>
          {featuredSuppliers.map(s => (
            <SupplierCard key={s.id} supplier={s} onPress={() => router.push(`/supplier/${s.id}`)} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter_400Regular',
  },
  userName: {
    fontSize: 22,
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    marginTop: 2,
  },
  company: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  creditCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  creditValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
  },
  creditRight: {
    alignItems: 'flex-end',
    gap: 4,
    flex: 1,
    marginLeft: 20,
  },
  creditUsed: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  creditBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  creditBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  creditLimit: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  body: {
    padding: 20,
    gap: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAction: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
  },
  seeAll: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});
