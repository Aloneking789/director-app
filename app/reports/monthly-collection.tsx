import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Download, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import BarChart from '@/components/BarChart';
import KPICard from '@/components/KPICard';
import { IndianRupee } from 'lucide-react-native';

const monthlyData = [
  { label: 'Apr', value: 458000, color: '#0EA5E9' },
  { label: 'May', value: 523000, color: '#38BDF8' },
  { label: 'Jun', value: 495000, color: '#0EA5E9' },
  { label: 'Jul', value: 612000, color: '#38BDF8' },
  { label: 'Aug', value: 580000, color: '#0EA5E9' },
  { label: 'Sep', value: 545000, color: '#38BDF8' },
  { label: 'Oct', value: 598000, color: '#0EA5E9' },
  { label: 'Nov', value: 432000, color: '#38BDF8' },
];

export default function MonthlyCollectionReport() {
  const totalCollection = monthlyData.reduce((sum, d) => sum + d.value, 0);
  const avgMonthly = Math.round(totalCollection / monthlyData.length);
  const maxMonth = monthlyData.reduce((max, d) => d.value > max.value ? d : max, monthlyData[0]);

  return (
    <>
      <Stack.Screen options={{ title: 'Monthly Collection Report' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.sessionSelector}>
              <Calendar size={20} color={Colors.light.primary} />
              <Text style={styles.sessionText}>Session 2025-26</Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <KPICard
              title="Total Collection"
              value={`₹${(totalCollection / 100000).toFixed(1)}L`}
              icon={IndianRupee}
              iconColor={Colors.light.primary}
              iconBackground={Colors.light.lightBlue}
            />
            <KPICard
              title="Avg Monthly"
              value={`₹${(avgMonthly / 100000).toFixed(1)}L`}
              icon={TrendingUp}
              iconColor="#10B981"
              iconBackground={Colors.light.lightGreen}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Monthly Trend</Text>
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={18} color="#fff" />
                <Text style={styles.downloadText}>Export</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartCard}>
              <BarChart data={monthlyData} height={250} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Highest Collection</Text>
                <Text style={styles.summaryValue}>
                  {maxMonth.label} - ₹{(maxMonth.value / 100000).toFixed(1)}L
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Months</Text>
                <Text style={styles.summaryValue}>{monthlyData.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Average per Month</Text>
                <Text style={styles.summaryValue}>₹{(avgMonthly / 100000).toFixed(2)}L</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  sessionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sessionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  chartCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.gray600,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
});
