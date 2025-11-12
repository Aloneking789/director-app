import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Download } from 'lucide-react-native';
import Colors from '@/constants/colors';
import DataTable, { Column } from '@/components/DataTable';
import KPICard from '@/components/KPICard';
import { IndianRupee } from 'lucide-react-native';

const mockData = [
  { id: 1, receiptNo: 'REC001', studentName: 'Aarav Kumar', class: 'Class X-A', amount: 12500, mode: 'Cash', time: '09:15 AM' },
  { id: 2, receiptNo: 'REC002', studentName: 'Diya Sharma', class: 'Class IX-B', amount: 11000, mode: 'Bank Transfer', time: '10:30 AM' },
  { id: 3, receiptNo: 'REC003', studentName: 'Vihaan Patel', class: 'Class VIII-A', amount: 10500, mode: 'Cheque', time: '11:45 AM' },
  { id: 4, receiptNo: 'REC004', studentName: 'Ananya Singh', class: 'Class VII-C', amount: 9800, mode: 'Cash', time: '01:20 PM' },
  { id: 5, receiptNo: 'REC005', studentName: 'Arjun Reddy', class: 'Class VI-B', amount: 9200, mode: 'UPI', time: '02:35 PM' },
];

export default function DailyCollectionReport() {
  const [selectedDate, setSelectedDate] = useState('10 Nov 2025');
  
  const totalCash = mockData.filter(d => d.mode === 'Cash').reduce((sum, d) => sum + d.amount, 0);
  const totalBank = mockData.filter(d => d.mode === 'Bank Transfer' || d.mode === 'Cheque' || d.mode === 'UPI').reduce((sum, d) => sum + d.amount, 0);
  const totalCollection = mockData.reduce((sum, d) => sum + d.amount, 0);

  const columns: Column[] = [
    { key: 'receiptNo', title: 'Receipt No', width: 100 },
    { key: 'studentName', title: 'Student Name', width: 150 },
    { key: 'class', title: 'Class', width: 120 },
    { key: 'amount', title: 'Amount (₹)', width: 120, align: 'right' },
    { key: 'mode', title: 'Payment Mode', width: 130 },
    { key: 'time', title: 'Time', width: 100 },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Daily Collection Report' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.dateSelector}>
              <Calendar size={20} color={Colors.light.primary} />
              <Text style={styles.dateText}>{selectedDate}</Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <KPICard
              title="Total Collection"
              value={`₹${totalCollection.toLocaleString()}`}
              icon={IndianRupee}
              iconColor={Colors.light.primary}
              iconBackground={Colors.light.lightBlue}
            />
          </View>

          <View style={styles.kpiRow}>
            <KPICard
              title="Cash"
              value={`₹${totalCash.toLocaleString()}`}
              icon={IndianRupee}
              iconColor="#10B981"
              iconBackground={Colors.light.lightGreen}
            />
            <KPICard
              title="Bank/Online"
              value={`₹${totalBank.toLocaleString()}`}
              icon={IndianRupee}
              iconColor="#8B5CF6"
              iconBackground={Colors.light.lightPurple}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Collection Details</Text>
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={18} color="#fff" />
                <Text style={styles.downloadText}>Export</Text>
              </TouchableOpacity>
            </View>

            <DataTable columns={columns} data={mockData} />
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
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
});
