import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockSuppliers } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function RFQScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('NET30');

  const handleSubmit = () => {
    if (!selectedSupplier || !productName || !quantity) {
      Alert.alert('Missing Fields', 'Please fill in Supplier, Product, and Quantity.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'RFQ Submitted',
      'Your Request for Quotation has been sent to the supplier. You will receive a response within their stated response time.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const PAYMENT_TERMS = ['NET7', 'NET30', 'NET60', 'Immediate'];

  return (
    <KeyboardAvoidingView style={[styles.flex, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Request for Quotation</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={[styles.infoBanner, { backgroundColor: '#EEF4FF', borderColor: '#C7D7FA' }]}>
          <Feather name="info" size={15} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Submit an RFQ to get a customized quote from a supplier. Typical response time: 2-8 hours.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Select Supplier</Text>
          {mockSuppliers.slice(0, 4).map(s => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.supplierOption,
                {
                  backgroundColor: selectedSupplier === s.id ? colors.navy : colors.card,
                  borderColor: selectedSupplier === s.id ? colors.navy : colors.border,
                },
              ]}
              onPress={() => setSelectedSupplier(s.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.supplierInitials, { backgroundColor: selectedSupplier === s.id ? 'rgba(0,191,165,0.2)' : colors.secondary }]}>
                <Text style={[styles.initialsText, { color: selectedSupplier === s.id ? '#00BFA5' : colors.mutedForeground }]}>
                  {s.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                </Text>
              </View>
              <View style={styles.supplierInfo}>
                <Text style={[styles.supplierName, { color: selectedSupplier === s.id ? '#fff' : colors.text }]}>{s.name}</Text>
                <Text style={[styles.supplierCategory, { color: selectedSupplier === s.id ? 'rgba(255,255,255,0.6)' : colors.mutedForeground }]}>{s.category} • {s.responseTime}</Text>
              </View>
              {selectedSupplier === s.id && <Feather name="check-circle" size={18} color="#00BFA5" />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Product Details</Text>

          <View>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Product Name *</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={productName}
                onChangeText={setProductName}
                placeholder="e.g. Industrial PCB Assembly Kit"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Quantity *</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="500"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <View style={styles.half}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Unit</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="pieces"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            </View>
          </View>

          <View>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Target Price (per unit)</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.prefix, { color: colors.mutedForeground }]}>$</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={targetPrice}
                onChangeText={setTargetPrice}
                placeholder="18.00"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Required by Date</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="calendar" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={deliveryDate}
                onChangeText={setDeliveryDate}
                placeholder="e.g. Jan 15, 2025"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Payment Terms</Text>
          <View style={styles.termsRow}>
            {PAYMENT_TERMS.map(term => (
              <TouchableOpacity
                key={term}
                style={[
                  styles.termChip,
                  {
                    backgroundColor: paymentTerm === term ? colors.navy : colors.card,
                    borderColor: paymentTerm === term ? colors.navy : colors.border,
                  },
                ]}
                onPress={() => setPaymentTerm(term)}
              >
                <Text style={[styles.termLabel, { color: paymentTerm === term ? '#fff' : colors.mutedForeground }]}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Additional Notes</Text>
          <View style={[styles.textAreaWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Specify any special requirements, packaging preferences, certifications needed, etc."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.navy }]}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Feather name="send" size={18} color="#fff" />
          <Text style={styles.submitText}>Submit RFQ</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    gap: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  supplierOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  supplierInitials: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  supplierCategory: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  prefix: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  termsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  termChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  termLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  textAreaWrap: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  textArea: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    minHeight: 100,
  },
  footer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
