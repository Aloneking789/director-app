import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, Download, Filter } from 'lucide-react-native';
import DataTable, { Column } from '@/components/DataTable';
import Colors from '@/constants/colors';
import type { StaffAttendanceDetailed } from '@/types';

export default function StaffAttendanceScreen() {
  const [selectedDate, setSelectedDate] = useState<string>('10 Nov 2025');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const attendanceData: StaffAttendanceDetailed[] = [
    {
      serialNumber: 1,
      employeeName: 'Abhishek Pathak',
      designation: 'TGT',
      employeeId: '1001',
      status: 'present',
      inTime: '08:45 AM',
      outTime: '04:30 PM',
      lateArrival: 0,
      delay: 0,
      category: 'Teaching',
    },
    {
      serialNumber: 2,
      employeeName: 'Ajay Yadav',
      designation: 'PGT',
      employeeId: '1002',
      status: 'present',
      inTime: '09:15 AM',
      outTime: '04:15 PM',
      lateArrival: 15,
      delay: 15,
      category: 'Teaching',
    },
    {
      serialNumber: 3,
      employeeName: 'Akaram Ali',
      designation: 'PRT',
      employeeId: '1003',
      status: 'absent',
      category: 'Teaching',
    },
    {
      serialNumber: 4,
      employeeName: 'Akhilesh Kushwaha',
      designation: 'Driver',
      employeeId: '1004',
      status: 'present',
      inTime: '07:30 AM',
      outTime: '05:00 PM',
      lateArrival: 0,
      delay: 0,
      category: 'Non-Teaching',
    },
    {
      serialNumber: 5,
      employeeName: 'Amit Kumar Mishra',
      designation: 'Principal',
      employeeId: '1005',
      status: 'present',
      inTime: '08:30 AM',
      outTime: '05:30 PM',
      lateArrival: 0,
      delay: 0,
      category: 'Admin',
    },
  ];

  const categories = ['all', 'Teaching', 'Non-Teaching', 'Admin', 'Office', 'Driver'];

  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') return attendanceData;
    return attendanceData.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, attendanceData]);

  const stats = useMemo(() => {
    const present = filteredData.filter((item) => item.status === 'present').length;
    const absent = filteredData.filter((item) => item.status === 'absent').length;
    const late = filteredData.filter((item) => (item.lateArrival || 0) > 0).length;
    return { present, absent, late, total: filteredData.length };
  }, [filteredData]);

  const columns: Column<StaffAttendanceDetailed>[] = [
    { key: 'serialNumber', title: 'Sr.', width: 60, sortable: true },
    { key: 'employeeName', title: 'Name', width: 180, sortable: true },
    { key: 'designation', title: 'Designation', width: 120, sortable: true },
    { key: 'employeeId', title: 'ID', width: 100, sortable: true },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      sortable: true,
      render: (item) => (
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'present' ? Colors.light.lightGreen : Colors.light.lightRed,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'present' ? Colors.light.success : Colors.light.error,
              },
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      ),
    },
    { key: 'inTime', title: 'In Time', width: 110, sortable: false },
    { key: 'outTime', title: 'Out Time', width: 110, sortable: false },
    {
      key: 'lateArrival',
      title: 'Late (min)',
      width: 100,
      sortable: true,
      render: (item) => (
        <Text style={item.lateArrival && item.lateArrival > 0 ? styles.lateText : styles.cellText}>
          {item.lateArrival || '-'}
        </Text>
      ),
    },
    { key: 'category', title: 'Category', width: 130, sortable: true },
  ];

  const handleExport = () => {
    Alert.alert('Export', 'Exporting staff attendance report to CSV...');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Staff Attendance Report' }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.dateButton}>
            <Calendar size={18} color={Colors.light.primary} />
            <Text style={styles.dateText}>{selectedDate}</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: Colors.light.lightGreen }]}>
              <Text style={styles.statLabel}>Present</Text>
              <Text style={[styles.statValue, { color: Colors.light.success }]}>{stats.present}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: Colors.light.lightRed }]}>
              <Text style={styles.statLabel}>Absent</Text>
              <Text style={[styles.statValue, { color: Colors.light.error }]}>{stats.absent}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: Colors.light.lightOrange }]}>
              <Text style={styles.statLabel}>Late</Text>
              <Text style={[styles.statValue, { color: Colors.light.warning }]}>{stats.late}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category === 'all' ? 'All Staff' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <DataTable
          columns={columns}
          data={filteredData}
          keyExtractor={(item) => item.employeeId}
          searchable={true}
          searchKeys={['employeeName', 'employeeId', 'designation']}
          exportable={true}
          onExport={handleExport}
          itemsPerPage={15}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.gray600,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContent: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
  },
  categoryTextActive: {
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold' as const,
  },
  cellText: {
    fontSize: 13,
    color: Colors.light.gray700,
  },
  lateText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.warning,
  },
});
