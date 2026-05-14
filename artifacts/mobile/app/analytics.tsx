import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const monthlyData = [
  { month: 'Jul', value: 9200 },
  { month: 'Aug', value: 11500 },
  { month: 'Sep', value: 8700 },
  { month: 'Oct', value: 14200 },
  { month: 'Nov', value: 12800 },
  { month: 'Dec', value: 18900 },
];

const maxValue = Math.max(...monthlyData.map(d => d.value));

const supplierPerformance = [
  { name: 'TechParts Global', orders: 12, spent: 10300, fulfillment: 98.5 },
  { name: 'FabriCo Wholesale', orders: 7, spent: 5200, fulfillment: 97.2 },
  { name: 'AgriPro Distributors', orders: 3, spent: 8500, fulfillment: 95.4 },
];

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.kpiGrid}>
          {[
            { label: 'Total Spent', value: '$18,900', icon: 'dollar-sign' as const, sub: 'Dec 2024', accent: true },
            { label: 'Orders Placed', value: '22', icon: 'package' as const, sub: 'All time' },
            { label: 'Avg Order Value', value: '$859', icon: 'bar-chart' as const, sub: 'Per order' },
            { label: 'Active Suppliers', value: '5', icon: 'users' as const, sub: 'Verified' },
          ].map(kpi => (
            <View
              key={kpi.label}
              style={[
                styles.kpiCard,
                { backgroundColor: kpi.accent ? colors.navy : colors.card, borderColor: kpi.accent ? 'transparent' : colors.border },
              ]}
            >
              <View style={[styles.kpiIcon, { backgroundColor: kpi.accent ? 'rgba(255,255,255,0.15)' : colors.secondary }]}>
                <Feather name={kpi.icon} size={18} color={kpi.accent ? '#00BFA5' : colors.primary} />
              </View>
              <Text style={[styles.kpiValue, { color: kpi.accent ? '#fff' : colors.text }]}>{kpi.value}</Text>
              <Text style={[styles.kpiLabel, { color: kpi.accent ? 'rgba(255,255,255,0.7)' : colors.mutedForeground }]}>{kpi.label}</Text>
              <Text style={[styles.kpiSub, { color: kpi.accent ? 'rgba(255,255,255,0.4)' : colors.border }]}>{kpi.sub}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Procurement</Text>
          <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>Jul – Dec 2024</Text>
          <View style={styles.chart}>
            {monthlyData.map(d => (
              <View key={d.month} style={styles.bar}>
                <Text style={[styles.barValue, { color: colors.primary }]}>
                  ${(d.value / 1000).toFixed(0)}K
                </Text>
                <View style={[styles.barTrack, { backgroundColor: colors.secondary }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${(d.value / maxValue) * 100}%`,
                        backgroundColor: d.value === maxValue ? colors.accent : colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>{d.month}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Supplier Performance</Text>
          {supplierPerformance.map((s, idx) => (
            <View key={s.name} style={[styles.perfRow, idx > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={[styles.perfInitials, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.perfInitialsText, { color: colors.primary }]}>
                  {s.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                </Text>
              </View>
              <View style={styles.perfInfo}>
                <Text style={[styles.perfName, { color: colors.text }]}>{s.name}</Text>
                <View style={styles.perfMeta}>
                  <Text style={[styles.perfMetaItem, { color: colors.mutedForeground }]}>{s.orders} orders</Text>
                  <Text style={[styles.perfMetaItem, { color: colors.mutedForeground }]}>${s.spent.toLocaleString()} spent</Text>
                </View>
                <View style={[styles.perfBarBg, { backgroundColor: colors.secondary }]}>
                  <View style={[styles.perfBarFill, { width: `${s.fulfillment}%`, backgroundColor: colors.success }]} />
                </View>
                <Text style={[styles.perfFulfillment, { color: colors.success }]}>{s.fulfillment}% fulfillment</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Procurement by Category</Text>
          {[
            { cat: 'Electronics', pct: 54, color: colors.primary },
            { cat: 'Textiles', pct: 27, color: colors.accent },
            { cat: 'Agriculture', pct: 19, color: colors.success },
          ].map(item => (
            <View key={item.cat} style={styles.catRow}>
              <View style={styles.catLabel}>
                <View style={[styles.catDot, { backgroundColor: item.color }]} />
                <Text style={[styles.catName, { color: colors.text }]}>{item.cat}</Text>
              </View>
              <View style={[styles.catBarBg, { backgroundColor: colors.secondary }]}>
                <View style={[styles.catBarFill, { width: `${item.pct}%`, backgroundColor: item.color }]} />
              </View>
              <Text style={[styles.catPct, { color: colors.mutedForeground }]}>{item.pct}%</Text>
            </View>
          ))}
        </View>
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
  title: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  kpiLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  kpiSub: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  cardSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: -8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 160,
  },
  bar: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  barTrack: {
    width: '100%',
    flex: 1,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  perfRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
  },
  perfInitials: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  perfInitialsText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  perfInfo: {
    flex: 1,
    gap: 4,
  },
  perfName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  perfMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  perfMetaItem: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  perfBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  perfBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  perfFulfillment: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 110,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  catName: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  catBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  catPct: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    width: 36,
    textAlign: 'right',
  },
});
