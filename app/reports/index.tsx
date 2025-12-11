import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileText,
  TrendingUp,
  Users,
  IndianRupee,
  Calendar,
  Download,
  BarChart3,
  PieChart,
} from '@/components/Icons';
import Colors from '@/constants/colors';

export default function ReportsScreen() {
  const reportCategories = [
    {
      title: 'Financial Reports',
      icon: IndianRupee,
      color: '#10B981',
      reports: [
        { id: 'daily-collection', name: 'Daily Collection Report', route: '/reports/daily-collection' },
        { id: 'monthly-collection', name: 'Monthly Collection Report', route: '/reports/monthly-collection' },
        { id: 'deleted-receipts', name: 'Deleted Receipts', route: '/reports/deleted-receipts' },
        { id: 'fee-collection-log', name: 'Fee Collection Log', route: '/reports/fee-collection-log' },
        { id: 'pre-session-due', name: 'Pre-Session Due Report', route: '/reports/pre-session-due' },
        { id: 'current-due', name: 'Current Due Report', route: '/reports/current-due' },
      ],
    },
    {
      title: 'Student Reports',
      icon: Users,
      color: '#0EA5E9',
      reports: [
        { id: 'student-grid', name: 'Class-wise Student Grid', route: '/reports/student-grid' },
        { id: 'student-list', name: 'Student Directory List', route: '/students' },
        { id: 'admission-analytics', name: 'Admissions Analytics', route: '/reports/admission-analytics' },
        { id: 'student-attendance', name: 'Student Attendance Report', route: '/reports/student-attendance' },
      ],
    },
    {
      title: 'Staff Reports',
      icon: FileText,
      color: '#8B5CF6',
      reports: [
        { id: 'staff-attendance', name: 'Staff Attendance Report', route: '/reports/staff-attendance' },
        { id: 'staff-directory', name: 'Staff Directory', route: '/staff' },
        { id: 'payroll', name: 'Payroll Report', route: '/reports/payroll' },
      ],
    },
    {
      title: 'Analytics',
      icon: TrendingUp,
      color: '#F59E0B',
      reports: [
        { id: 'monthly-charts', name: 'Monthly Collection Charts', route: '/reports/monthly-charts' },
        { id: 'working-log', name: 'Working Log', route: '/reports/working-log' },
        { id: 'dashboard-analytics', name: 'Dashboard Analytics', route: '/dashboard' },
      ],
    },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Reports & Analytics' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          {reportCategories.map((category) => (
            <View key={category.title} style={styles.section}>
              <View style={styles.categoryHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                  <category.icon size={24} color={category.color} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>

              <View style={styles.reportsList}>
                {category.reports.map((report) => (
                  <TouchableOpacity
                    key={report.id}
                    style={styles.reportCard}
                    onPress={() => router.push(report.route as any)}
                  >
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportName}>{report.name}</Text>
                    </View>
                    <FileText size={20} color={Colors.light.gray400} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
});
