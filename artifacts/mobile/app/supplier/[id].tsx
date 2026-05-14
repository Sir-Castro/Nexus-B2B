import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { ProductCard } from '@/components/ProductCard';
import { mockProducts, mockSuppliers } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function SupplierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const supplier = mockSuppliers.find(s => s.id === id);
  const products = mockProducts.filter(p => p.supplierId === id);

  if (!supplier) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.mutedForeground }}>Supplier not found</Text>
      </View>
    );
  }

  const initials = supplier.name.split(' ').slice(0, 2).map(w => w[0]).join('');

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={['#1E3A5F', '#1565C0']} style={[styles.heroSection, { paddingTop: topPad + 8 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(0,191,165,0.2)' }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.nameSection}>
              <View style={styles.nameRow}>
                <Text style={styles.supplierName}>{supplier.name}</Text>
                {supplier.verified && <Feather name="check-circle" size={18} color="#00BFA5" />}
              </View>
              <Text style={styles.location}>
                <Feather name="map-pin" size={12} color="rgba(255,255,255,0.7)" /> {supplier.location}
              </Text>
              <View style={styles.tagsRow}>
                <Badge label={supplier.category} variant="accent" small />
                {supplier.featured && <Badge label="Featured" variant="default" small />}
              </View>
            </View>
          </View>

          <View style={styles.heroStats}>
            {[
              { label: 'Rating', value: `${supplier.rating}★` },
              { label: 'Reviews', value: supplier.reviewCount.toLocaleString() },
              { label: 'Fulfillment', value: `${supplier.fulfillmentRate}%` },
              { label: 'Response', value: supplier.responseTime },
            ].map(stat => (
              <View key={stat.label} style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{stat.value}</Text>
                <Text style={styles.heroStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>About</Text>
            <Text style={[styles.description, { color: colors.mutedForeground }]}>{supplier.description}</Text>
            <View style={styles.metaGrid}>
              {[
                { icon: 'calendar' as const, label: 'Years in Business', value: `${supplier.yearsInBusiness} years` },
                { icon: 'dollar-sign' as const, label: 'Min Order Value', value: `$${supplier.minOrderValue.toLocaleString()}` },
                { icon: 'box' as const, label: 'Total Products', value: `${supplier.productsCount} SKUs` },
              ].map(meta => (
                <View key={meta.label} style={[styles.metaItem, { backgroundColor: colors.secondary }]}>
                  <Feather name={meta.icon} size={16} color={colors.primary} />
                  <View>
                    <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>{meta.label}</Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>{meta.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {products.length > 0 && (
            <View style={styles.productsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Products ({products.length})</Text>
              {products.map(p => (
                <ProductCard key={p.id} product={p} onPress={() => router.push(`/product/${p.id}`)} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
          onPress={() => router.push(`/chat/c1`)}
          activeOpacity={0.8}
        >
          <Feather name="message-circle" size={18} color={colors.primary} />
          <Text style={[styles.footerBtnText, { color: colors.primary }]}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: colors.navy, flex: 1.5 }]}
          onPress={() => router.push('/rfq')}
          activeOpacity={0.8}
        >
          <Feather name="file-text" size={18} color="#fff" />
          <Text style={[styles.footerBtnText, { color: '#fff' }]}>Request Quote</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  heroSection: {
    padding: 20,
    paddingBottom: 24,
    gap: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#00BFA5',
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  nameSection: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  supplierName: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    flex: 1,
  },
  location: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 14,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  body: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  metaGrid: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
  },
  metaLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  metaValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  productsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  footerBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
