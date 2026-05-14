import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import { UserRole } from '@/types';

const ROLES: { key: UserRole; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'retailer', label: 'Retailer / Buyer', icon: 'shopping-bag' },
  { key: 'supplier', label: 'Supplier / Manufacturer', icon: 'box' },
  { key: 'logistics', label: 'Logistics Partner', icon: 'truck' },
];

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('retailer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !company.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), company: company.trim(), password, role });
      router.replace('/(tabs)/');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>

        <LinearGradient colors={[colors.navy, colors.primary]} style={styles.iconRow} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Feather name="globe" size={22} color="#fff" />
        </LinearGradient>

        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Join thousands of B2B businesses on Nexus B2B</Text>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: '#FEEBEB', borderColor: '#FECACA' }]}>
            <Feather name="alert-circle" size={14} color={colors.destructive} />
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Business Role</Text>
        <View style={styles.roles}>
          {ROLES.map(r => (
            <TouchableOpacity
              key={r.key}
              style={[
                styles.roleCard,
                {
                  backgroundColor: role === r.key ? colors.navy : colors.card,
                  borderColor: role === r.key ? colors.navy : colors.border,
                },
              ]}
              onPress={() => setRole(r.key)}
              activeOpacity={0.75}
            >
              <Feather name={r.icon} size={20} color={role === r.key ? '#00BFA5' : colors.mutedForeground} />
              <Text style={[styles.roleLabel, { color: role === r.key ? '#fff' : colors.text }]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.text }]}>Account Details</Text>
        <View style={styles.fields}>
          {[
            { label: 'Full Name', value: name, setter: setName, icon: 'user' as const, placeholder: 'John Smith', type: undefined },
            { label: 'Business Email', value: email, setter: setEmail, icon: 'mail' as const, placeholder: 'you@company.com', type: 'email-address' as const },
            { label: 'Company Name', value: company, setter: setCompany, icon: 'briefcase' as const, placeholder: 'RetailCo Inc.', type: undefined },
            { label: 'Password', value: password, setter: setPassword, icon: 'lock' as const, placeholder: '••••••••', type: undefined },
          ].map(field => (
            <View key={field.label}>
              <Text style={[styles.label, { color: colors.text }]}>{field.label}</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name={field.icon} size={16} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType={field.type ?? 'default'}
                  autoCapitalize={field.type === 'email-address' ? 'none' : 'words'}
                  secureTextEntry={field.label === 'Password'}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.navy }]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: colors.mutedForeground }]}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.loginLink, { color: colors.primary }]}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 24,
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  iconRow: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
    lineHeight: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
  },
  roles: {
    gap: 10,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  roleLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  fields: {
    gap: 14,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  btn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
