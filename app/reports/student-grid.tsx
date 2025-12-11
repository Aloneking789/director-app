import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Download, Filter } from '@/components/Icons';
import Colors from '@/constants/colors';
import type { ClassWiseStudents } from '@/types';

export default function StudentGridScreen() {
  const [selectedSession] = useState<string>('2025-2026');

  const classWiseData: ClassWiseStudents[] = [
    { class: 'NURSERY', sectionA: 45, sectionB: 42, sectionC: 0, total: 87 },
    { class: 'L.K.G', sectionA: 52, sectionB: 49, sectionC: 48, total: 149 },
    { class: 'U.K.G', sectionA: 50, sectionB: 48, sectionC: 47, total: 145 },
    { class: 'I', sectionA: 48, sectionB: 46, sectionC: 0, total: 94 },
    { class: 'II', sectionA: 50, sectionB: 48, sectionC: 0, total: 98 },
    { class: 'III', sectionA: 52, sectionB: 51, sectionC: 0, total: 103 },
    { class: 'IV', sectionA: 49, sectionB: 47, sectionC: 0, total: 96 },
    { class: 'V', sectionA: 54, sectionB: 52, sectionC: 0, total: 106 },
    { class: 'VI', sectionA: 51, sectionB: 49, sectionC: 0, total: 100 },
    { class: 'VII', sectionA: 53, sectionB: 50, sectionC: 0, total: 103 },
    { class: 'VIII', sectionA: 52, sectionB: 48, sectionC: 0, total: 100 },
    { class: 'IX', sectionA: 55, sectionB: 50, sectionC: 0, total: 105 },
    { class: 'X', sectionA: 58, sectionB: 52, sectionC: 0, total: 110 },
    { class: 'XI', sectionA: 42, sectionB: 38, sectionC: 0, total: 80 },
    { class: 'XII', sectionA: 45, sectionB: 40, sectionC: 0, total: 85 },
  ];

  const grandTotal = useMemo(
    () => classWiseData.reduce((sum, c) => sum + c.total, 0),
    [classWiseData]
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Class-wise Student Grid',
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Download size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.sessionCard}>
            <Text style={styles.sessionLabel}>Academic Session</Text>
            <Text style={styles.sessionValue}>{selectedSession}</Text>
          </View>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Students</Text>
            <Text style={styles.totalValue}>{grandTotal}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={[styles.headerCell, styles.classCell]}>
                <Text style={styles.headerText}>Class</Text>
              </View>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Section A</Text>
              </View>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Section B</Text>
              </View>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Section C</Text>
              </View>
              <View style={[styles.headerCell, styles.totalCell]}>
                <Text style={styles.headerText}>Total</Text>
              </View>
            </View>

            {classWiseData.map((classData, index) => (
              <View
                key={classData.class}
                style={[
                  styles.tableRow,
                  index % 2 === 0 && styles.tableRowEven,
                ]}
              >
                <View style={[styles.dataCell, styles.classCell]}>
                  <Text style={styles.classText}>{classData.class}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{classData.sectionA}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>{classData.sectionB}</Text>
                </View>
                <View style={styles.dataCell}>
                  <Text style={styles.dataText}>
                    {classData.sectionC > 0 ? classData.sectionC : '-'}
                  </Text>
                </View>
                <View style={[styles.dataCell, styles.totalCell]}>
                  <Text style={styles.totalText}>{classData.total}</Text>
                </View>
              </View>
            ))}

            <View style={styles.tableFooter}>
              <View style={[styles.footerCell, styles.classCell]}>
                <Text style={styles.footerText}>Grand Total</Text>
              </View>
              <View style={styles.footerCell}>
                <Text style={styles.footerText}>
                  {classWiseData.reduce((sum, c) => sum + c.sectionA, 0)}
                </Text>
              </View>
              <View style={styles.footerCell}>
                <Text style={styles.footerText}>
                  {classWiseData.reduce((sum, c) => sum + c.sectionB, 0)}
                </Text>
              </View>
              <View style={styles.footerCell}>
                <Text style={styles.footerText}>
                  {classWiseData.reduce((sum, c) => sum + c.sectionC, 0)}
                </Text>
              </View>
              <View style={[styles.footerCell, styles.totalCell]}>
                <Text style={styles.footerTotalText}>{grandTotal}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  sessionCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
  },
  sessionLabel: {
    fontSize: 13,
    color: Colors.light.gray600,
    marginBottom: 4,
  },
  sessionValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  totalCard: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
  },
  totalLabel: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  headerButton: {
    marginRight: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  table: {
    margin: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
  },
  headerCell: {
    width: 100,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classCell: {
    width: 120,
  },
  totalCell: {
    width: 110,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  tableRowEven: {
    backgroundColor: Colors.light.lightBlue,
  },
  dataCell: {
    width: 100,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  dataText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: Colors.light.lightBlue,
    borderTopWidth: 2,
    borderTopColor: Colors.light.primary,
  },
  footerCell: {
    width: 100,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  footerTotalText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
  },
});
