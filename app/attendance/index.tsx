import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import DonutChart from '@/components/DonutChart';

export default function AttendanceScreen() {
  const { dashboardStats } = useApp();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Attendance' }} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Attendance</Text>
          <View style={styles.card}>
            <DonutChart
              data={[
                { label: 'Present', value: dashboardStats?.attendance.studentPresent || 0, color: '#22C55E' },
                { label: 'Absent', value: dashboardStats?.attendance.studentAbsent || 0, color: '#EF4444' },
                { label: 'Half Day', value: dashboardStats?.attendance.studentHalfDay || 0, color: '#3B82F6' },
                { label: 'Leave', value: dashboardStats?.attendance.studentLeave || 0, color: '#F59E0B' },
                { label: 'Not Marked', value: dashboardStats?.attendance.studentNotMarked || 0, color: '#6B7280' },
              ]}
              size={200}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Staff Attendance</Text>
          <View style={styles.card}>
            <DonutChart
              data={[
                { label: 'Present', value: dashboardStats?.attendance.staffPresent || 0, color: '#22C55E' },
                { label: 'Absent', value: dashboardStats?.attendance.staffAbsent || 0, color: '#EF4444' },
                { label: 'Leave', value: dashboardStats?.attendance.staffLeave || 0, color: '#F59E0B' },
              ]}
              size={200}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scrollView: { flex: 1 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' as const, color: Colors.light.text, marginBottom: 12 },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }),
  },
});
