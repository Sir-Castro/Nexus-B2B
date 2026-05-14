import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryChip } from '@/components/CategoryChip';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { SupplierCard } from '@/components/SupplierCard';
import { categories, mockProducts, mockSuppliers } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

type Tab = 'suppliers' | 'products';

export default function MarketplaceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('suppliers');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filteredSuppliers = mockSuppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || s.category === category;
    return matchSearch && matchCat;
  });

  const filteredProducts = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Marketplace</Text>
        <View style={styles.tabRow}>
          {(['suppliers', 'products'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabLabel, { color: tab === t ? colors.primary : colors.mutedForeground }]}>
                {t === 'suppliers' ? 'Suppliers' : 'Products'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.background }]}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={tab === 'suppliers' ? 'Search suppliers, categories...' : 'Search products, SKU...'}
          />
        </View>
        <CategoryChip categories={categories} selected={category} onSelect={setCategory} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'suppliers' ? (
          filteredSuppliers.length === 0 ? (
            <EmptyState icon="users" title="No suppliers found" subtitle="Try adjusting your search or category filter" />
          ) : (
            filteredSuppliers.map(s => (
              <SupplierCard key={s.id} supplier={s} onPress={() => router.push(`/supplier/${s.id}`)} />
            ))
          )
        ) : (
          filteredProducts.length === 0 ? (
            <EmptyState icon="package" title="No products found" subtitle="Try adjusting your search or category filter" />
          ) : (
            filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} onPress={() => router.push(`/product/${p.id}`)} />
            ))
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 0,
    paddingHorizontal: 16,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    paddingBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
  },
  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  searchWrap: {
    gap: 8,
    paddingBottom: 8,
  },
  list: {
    padding: 16,
  },
});
