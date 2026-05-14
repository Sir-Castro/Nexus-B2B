import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { mockConversations } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function MessagesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {mockConversations.filter(c => c.unread > 0).length} unread conversation{mockConversations.filter(c => c.unread > 0).length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {mockConversations.length === 0 ? (
          <EmptyState
            icon="message-circle"
            title="No messages yet"
            subtitle="Start a conversation with a supplier from their storefront"
          />
        ) : (
          mockConversations.map(conv => {
            const initials = conv.supplierName.split(' ').slice(0, 2).map(w => w[0]).join('');
            return (
              <TouchableOpacity
                key={conv.id}
                style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                onPress={() => router.push(`/chat/${conv.id}`)}
                activeOpacity={0.75}
              >
                <View style={[styles.avatar, { backgroundColor: colors.navy }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.itemBody}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.supplierName, { color: colors.text }]}>{conv.supplierName}</Text>
                    <Text style={[styles.time, { color: colors.mutedForeground }]}>{conv.lastMessageTime}</Text>
                  </View>
                  <Text style={[styles.preview, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {conv.lastMessage}
                  </Text>
                </View>
                {conv.unread > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.unreadText}>{conv.unread}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  list: {
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supplierName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  preview: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
});
