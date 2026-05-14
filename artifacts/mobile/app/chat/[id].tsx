import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getChatMessages, mockConversations } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { ChatMessage } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const conversation = mockConversations.find(c => c.id === id);
  const [messages, setMessages] = useState<ChatMessage[]>(getChatMessages(id ?? ''));
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      senderId: 'me',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      type: 'text',
    };
    setMessages(prev => [...prev, newMsg]);
    setText('');
    Haptics.impactAsync();
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === 'me';
    return (
      <View style={[styles.bubbleRow, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
        {!isMe && (
          <View style={[styles.avatar, { backgroundColor: colors.navy }]}>
            <Text style={styles.avatarText}>
              {conversation?.supplierName.split(' ').slice(0, 2).map(w => w[0]).join('') ?? 'S'}
            </Text>
          </View>
        )}
        <View style={styles.bubbleWrap}>
          <View style={[
            styles.bubble,
            isMe
              ? { backgroundColor: colors.navy }
              : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
          ]}>
            <Text style={[styles.bubbleText, { color: isMe ? '#fff' : colors.text }]}>{item.text}</Text>
          </View>
          <Text style={[styles.bubbleTime, { color: colors.mutedForeground }, isMe && { textAlign: 'right' }]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: colors.navy }]}>
          <Text style={styles.headerAvatarText}>
            {conversation?.supplierName.split(' ').slice(0, 2).map(w => w[0]).join('') ?? 'S'}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text }]}>{conversation?.supplierName ?? 'Supplier'}</Text>
          <Text style={[styles.headerStatus, { color: colors.success }]}>Online</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/rfq')}>
          <Feather name="file-text" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.messageList, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!messages.length}
      />

      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}>
        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 }]}>
          <View style={[styles.inputWrap, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor={colors.mutedForeground}
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.navy : colors.border }]}
            onPress={handleSend}
            disabled={!text.trim()}
            activeOpacity={0.8}
          >
            <Feather name="send" size={18} color={text.trim() ? '#fff' : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  headerStatus: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  messageList: {
    padding: 16,
    gap: 16,
  },
  bubbleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  bubbleLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRight: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  bubbleWrap: {
    maxWidth: '72%',
    gap: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  bubbleTime: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  inputWrap: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
  },
  input: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
