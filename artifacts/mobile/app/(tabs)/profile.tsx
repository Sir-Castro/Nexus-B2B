import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/components/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const creditPct = Math.min(((user?.creditUsed ?? 0) / (user?.creditLimit ?? 1)) * 100, 100);

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: 'briefcase' as const, label: 'Business Profile', onPress: () => {} },
        { icon: 'shield' as const, label: 'KYC Verification', onPress: () => {} },
        { icon: 'credit-card' as const, label: 'Payment Methods', onPress: () => {} },
        { icon: 'file-text' as const, label: 'Invoices & Receipts', onPress: () => {} },
      ],
    },
    {
      title: 'Commerce',
      items: [
        { icon: 'list' as const, label: 'Saved Procurement Lists', onPress: () => {} },
        { icon: 'repeat' as const, label: 'Repeat Orders', onPress: () => {} },
        { icon: 'bar-chart-2' as const, label: 'Analytics', onPress: () => router.push('/analytics') },
        { icon: 'download' as const, label: 'Download Reports', onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle' as const, label: 'Help Center', onPress: () => {} },
        { icon: 'message-circle' as const, label: 'Contact Support', onPress: () => {} },
        { icon: 'bell' as const, label: 'Notification Settings', onPress: () => {} },
      ],
    },
  ];

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.navy }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(0,191,165,0.2)' }]}>
              <Text style={styles.avatarText}>
                {user?.name.split(' ').slice(0, 2).map(w => w[0]).join('') ?? 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.badgeRow}>
                <Badge label={user?.role ?? 'retailer'} variant="accent" small />
                {user?.verified && <Badge label="Verified" variant="success" small />}
              </View>
            </View>
          </View>

          <View style={styles.companyRow}>
            <Feather name="briefcase" size={13} color="rgba(255,255,255,0.6)" />
            <Text style={styles.companyName}>{user?.company}</Text>
          </View>

          <View style={styles.creditSection}>
            <View style={styles.creditHeader}>
              <Text style={styles.creditLabel}>Credit Utilization</Text>
              <Text style={styles.creditPct}>{creditPct.toFixed(0)}%</Text>
            </View>
            <View style={[styles.creditBarBg, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <View style={[styles.creditBarFill, { width: `${creditPct}%`, backgroundColor: '#00BFA5' }]} />
            </View>
            <View style={styles.creditValues}>
              <Text style={styles.creditSub}>Used: ${(user?.creditUsed ?? 0).toLocaleString()}</Text>
              <Text style={styles.creditSub}>Limit: ${(user?.creditLimit ?? 0).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {menuSections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title.toUpperCase()}</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuItem,
                    idx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                    <Feather name={item.icon} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: '#FEEBEB', borderColor: '#FECACA' }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={16} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#00BFA5',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  companyName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  creditSection: {
    gap: 8,
    marginTop: 4,
  },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  creditPct: {
    color: '#00BFA5',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  creditBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  creditBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  creditValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
