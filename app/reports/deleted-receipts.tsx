import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Stack } from 'expo-router';
import DataTable, { Column } from '@/components/DataTable';
import Colors from '@/constants/colors';
import type { DeletedReceipt } from '@/types';

export default function DeletedReceiptsScreen() {
  const [deletedReceipts] = useState<DeletedReceipt[]>([
    {
      id: '1',
      studentName: 'Aadarsh Kumar',
      deletedAmount: 1500,
      deletionDate: '10-11-2025 14:30',
      deletedBy: 'Admin User',
      receiptNumber: 'RCT001234',
      deletionType: 'Duplicate',
    },
    {
      id: '2',
      studentName: 'Priya Singh',
      deletedAmount: 2000,
      deletionDate: '09-11-2025 11:20',
      deletedBy: 'Director',
      receiptNumber: 'RCT001235',
      deletionType: 'Error',
    },
    {
      id: '3',
      studentName: 'Amit Yadav',
      deletedAmount: 1200,
      deletionDate: '08-11-2025 16:45',
      deletedBy: 'Accountant',
      receiptNumber: 'RCT001236',
      deletionType: 'Cancelled',
    },
  ]);

  const totalDeleted = useMemo(
    () => deletedReceipts.reduce((sum, r) => sum + r.deletedAmount, 0),
    [deletedReceipts]
  );

  const columns: Column<DeletedReceipt>[] = [
    { key: 'receiptNumber', title: 'Receipt No', width: 140, sortable: true },
    { key: 'studentName', title: 'Student Name', width: 180, sortable: true },
    {
      key: 'deletedAmount',
      title: 'Amount',
      width: 120,
      sortable: true,
      render: (item) => (
        <Text style={styles.amountText}>₹{item.deletedAmount.toLocaleString()}</Text>
      ),
    },
    { key: 'deletionDate', title: 'Deleted On', width: 160, sortable: true },
    { key: 'deletedBy', title: 'Deleted By', width: 150, sortable: true },
    {
      key: 'deletionType',
      title: 'Type',
      width: 120,
      sortable: true,
      render: (item) => (
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getTypeColor(item.deletionType) },
          ]}
        >
          <Text style={styles.typeText}>{item.deletionType}</Text>
        </View>
      ),
    },
  ];

  const handleExport = () => {
    Alert.alert('Export', 'Exporting deleted receipts report to CSV...');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Deleted Receipts' }} />
      <View style={styles.container}>
        <View style={styles.summary}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Deleted Receipts</Text>
            <Text style={styles.summaryValue}>{deletedReceipts.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Deleted Amount</Text>
            <Text style={[styles.summaryValue, { color: Colors.light.error }]}>
              ₹{totalDeleted.toLocaleString()}
            </Text>
          </View>
        </View>

        <DataTable
          columns={columns}
          data={deletedReceipts}
          keyExtractor={(item) => item.id}
          searchable={true}
          searchKeys={['studentName', 'receiptNumber', 'deletedBy']}
          exportable={true}
          onExport={handleExport}
          itemsPerPage={10}
        />
      </View>
    </>
  );
}

function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'duplicate':
      return Colors.light.lightOrange;
    case 'error':
      return Colors.light.lightRed;
    case 'cancelled':
      return Colors.light.lightBlue;
    default:
      return Colors.light.gray200;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  summary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.light.gray600,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
  },
});
