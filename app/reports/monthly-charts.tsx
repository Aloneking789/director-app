import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import BarChart from '@/components/BarChart';
import DonutChart from '@/components/DonutChart';

const { width } = Dimensions.get('window');

export default function MonthlyChartsScreen() {
  const [selectedSession] = useState<string>('2025-2026');

  const monthlyCollectionData = [
    { month: 'Apr', income: 850000, expense: 420000, fee: 820000 },
    { month: 'May', income: 920000, expense: 450000, fee: 890000 },
    { month: 'Jun', income: 780000, expense: 380000, fee: 750000 },
    { month: 'Jul', income: 1050000, expense: 520000, fee: 1020000 },
    { month: 'Aug', income: 1120000, expense: 550000, fee: 1090000 },
    { month: 'Sep', income: 980000, expense: 480000, fee: 950000 },
    { month: 'Oct', income: 1080000, expense: 530000, fee: 1050000 },
    { month: 'Nov', income: 950000, expense: 470000, fee: 920000 },
  ];

  const admissionsByClass = [
    { label: 'Nursery', value: 87, color: '#FF9F43' },
    { label: 'L.K.G', value: 149, color: '#A78BFA' },
    { label: 'U.K.G', value: 145, color: '#EF4444' },
    { label: 'I', value: 94, color: '#22C55E' },
    { label: 'II', value: 98, color: '#3B82F6' },
    { label: 'III', value: 103, color: '#FBBF24' },
    { label: 'IV', value: 96, color: '#10B981' },
    { label: 'V', value: 106, color: '#EC4899' },
    { label: 'VI', value: 100, color: '#F59E0B' },
    { label: 'VII', value: 103, color: '#8B5CF6' },
    { label: 'VIII', value: 100, color: '#EF4444' },
    { label: 'IX+', value: 380, color: '#14B8A6' },
  ];

  const monthlyAdmissionsData = [
    { month: 'Apr', admissions: 422 },
    { month: 'May', admissions: 45 },
    { month: 'Jun', admissions: 32 },
    { month: 'Jul', admissions: 28 },
    { month: 'Aug', admissions: 15 },
    { month: 'Sep', admissions: 12 },
    { month: 'Oct', admissions: 10 },
    { month: 'Nov', admissions: 8 },
  ];

  const paymentModeData = [
    { label: 'Cash', value: 3200000, color: '#10B981' },
    { label: 'Bank Transfer', value: 4500000, color: '#0EA5E9' },
    { label: 'Cheque', value: 1849650, color: '#F59E0B' },
    { label: 'Online', value: 0, color: '#8B5CF6' },
  ];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Analytics Charts',
          headerRight: () => (
            <View style={styles.headerRight}>
              <Calendar size={20} color="#fff" />
              <Text style={styles.headerText}>{selectedSession}</Text>
            </View>
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <TrendingUp size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.sectionTitle}>Monthly Collection Trend</Text>
              <Text style={styles.sectionSubtitle}>Income, Expense & Fee comparison</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={styles.barChartContainer}>
                {monthlyCollectionData.map((item, index) => (
                  <View key={item.month} style={styles.barGroup}>
                    <View style={styles.barStack}>
                      <View
                        style={[
                          styles.bar3D,
                          {
                            height: (item.income / 15000) * 200,
                            backgroundColor: Colors.light.success,
                          },
                        ]}
                      >
                        <View style={styles.barTop} />
                      </View>
                      <View
                        style={[
                          styles.bar3D,
                          {
                            height: (item.expense / 15000) * 200,
                            backgroundColor: Colors.light.error,
                          },
                        ]}
                      >
                        <View style={styles.barTop} />
                      </View>
                      <View
                        style={[
                          styles.bar3D,
                          {
                            height: (item.fee / 15000) * 200,
                            backgroundColor: Colors.light.primary,
                          },
                        ]}
                      >
                        <View style={styles.barTop} />
                      </View>
                    </View>
                    <Text style={styles.barLabel}>{item.month}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.light.success }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.light.error }]} />
                <Text style={styles.legendText}>Expense</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.light.primary }]} />
                <Text style={styles.legendText}>Fee</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <PieChartIcon size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.sectionTitle}>Admissions by Class</Text>
              <Text style={styles.sectionSubtitle}>Student distribution across classes</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <DonutChart data={admissionsByClass} size={width - 100} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <BarChart3 size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.sectionTitle}>Monthly Admissions</Text>
              <Text style={styles.sectionSubtitle}>New admissions per month</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.admissionsChart}>
              {monthlyAdmissionsData.map((item, index) => (
                <View key={item.month} style={styles.admissionBar}>
                  <View style={styles.admissionBarContainer}>
                    <View
                      style={[
                        styles.admissionBarFill,
                        {
                          height: `${(item.admissions / 450) * 100}%`,
                        },
                      ]}
                    />
                    <Text style={styles.admissionValue}>{item.admissions}</Text>
                  </View>
                  <Text style={styles.admissionLabel}>{item.month}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconContainer}>
              <PieChartIcon size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.sectionTitle}>Payment Mode Distribution</Text>
              <Text style={styles.sectionSubtitle}>Cash vs Bank vs Cheque vs Online</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <DonutChart data={paymentModeData} size={width - 100} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 16,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.light.gray600,
  },
  chartCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
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
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  barGroup: {
    alignItems: 'center',
    gap: 8,
  },
  barStack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar3D: {
    width: 20,
    borderRadius: 4,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  barTop: {
    position: 'absolute',
    top: -3,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: Colors.light.gray700,
  },
  admissionsChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 250,
    paddingVertical: 20,
  },
  admissionBar: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  admissionBarContainer: {
    width: '80%',
    height: 200,
    backgroundColor: Colors.light.gray100,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  admissionBarFill: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  admissionValue: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: Colors.light.gray700,
  },
  admissionLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
  },
});
