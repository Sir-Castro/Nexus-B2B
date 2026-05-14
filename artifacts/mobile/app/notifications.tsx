import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockNotifications } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { Notification } from '@/types';

function getNotifIcon(type: Notification['type']): keyof typeof Feather.glyphMap {
  switch (type) {
    case 'order': return 'package';
    case 'payment': return 'credit-card';
    case 'message': return 'message-circle';
    case 'delivery': return 'truck';
    case 'quote': return 'file-text';
    default: return 'bell';
  }
}

function getNotifColor(type: Notification['type'], colors: any) {
  switch (type) {
    case 'delivery': return colors.accent;
    case 'payment': return colors.warning;
    case 'quote': return colors.primary;
    case 'message': return colors.navy;
    default: return colors.success;
  }
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={[styles.markAll, { color: colors.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map(notif => (
          <TouchableOpacity
            key={notif.id}
            style={[
              styles.item,
              {
                backgroundColor: notif.read ? colors.card : '#EEF4FF',
                borderBottomColor: colors.border,
              },
            ]}
            onPress={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: getNotifColor(notif.type, colors) + '20' }]}>
              <Feather name={getNotifIcon(notif.type)} size={18} color={getNotifColor(notif.type, colors)} />
            </View>
            <View style={styles.itemBody}>
              <View style={styles.itemHeader}>
                <Text style={[styles.notifTitle, { color: colors.text }]}>{notif.title}</Text>
                {!notif.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={[styles.notifBody, { color: colors.mutedForeground }]}>{notif.body}</Text>
              <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  },
  markAll: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  list: {
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifBody: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
