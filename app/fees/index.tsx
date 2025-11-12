import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { classFeeData } from '@/mocks/data';
import Colors from '@/constants/colors';
import BarChart from '@/components/BarChart';

export default function FeesScreen() {
  const { dashboardStats } = useApp();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Fee Management' }} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Expected</Text>
            <Text style={[styles.summaryValue, { color: Colors.light.primary }]}>
              ₹{dashboardStats?.fees.expected.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Received</Text>
            <Text style={[styles.summaryValue, { color: Colors.light.success }]}>
              ₹{dashboardStats?.fees.received.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={[styles.summaryValue, { color: Colors.light.error }]}>
              ₹{dashboardStats?.fees.balance.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Class-wise Collection</Text>
          <View style={styles.card}>
            <BarChart data={classFeeData.map(c => ({ label: c.class, value: c.paid, color: c.color }))} height={220} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fee Details by Class</Text>
          {classFeeData.map((item, index) => (
            <View key={index} style={styles.classCard}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <View style={styles.classInfo}>
                <Text style={styles.className}>Class {item.class}</Text>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Paid: <Text style={styles.feeValue}>₹{item.paid.toLocaleString()}</Text></Text>
                  <Text style={styles.feeLabel}>Excess: <Text style={styles.feeValue}>₹{item.excess}</Text></Text>
                  <Text style={styles.feeLabel}>Late: <Text style={styles.feeValue}>₹{item.late}</Text></Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scrollView: { flex: 1 },
  summaryCard: {
    backgroundColor: Colors.light.card,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }),
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 16, color: Colors.light.gray600 },
  summaryValue: { fontSize: 20, fontWeight: 'bold' as const },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' as const, color: Colors.light.text, marginBottom: 12 },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }),
  },
  classCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 }, android: { elevation: 2 } }),
  },
  colorIndicator: { width: 4, borderRadius: 2 },
  classInfo: { flex: 1 },
  className: { fontSize: 16, fontWeight: '600' as const, color: Colors.light.text, marginBottom: 8 },
  feeRow: { flexDirection: 'row', gap: 16 },
  feeLabel: { fontSize: 13, color: Colors.light.gray600 },
  feeValue: { fontWeight: '600' as const, color: Colors.light.text },
});
