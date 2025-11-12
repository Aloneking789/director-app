import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { studentFeeDetails } from '@/mocks/data';
import Colors, { classColors } from '@/constants/colors';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStudentById } = useApp();
  const student = getStudentById(id!);
  const feeDetails = id ? studentFeeDetails[id] : null;

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Student not found</Text>
      </SafeAreaView>
    );
  }

  const getColorForClass = (className: string) => {
    const classes = ['NURSERY', 'L.K.G', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const index = classes.indexOf(className);
    return classColors[index % classColors.length];
  };

  const color = getColorForClass(student.class);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Student Info',
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: color }]}>
            <Text style={styles.avatarText}>
              {student.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{student.name}</Text>
          <View style={styles.badges}>
            <View style={[styles.classBadge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{student.class} {student.section}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: Colors.light.lightGreen }]}>
              <Text style={[styles.badgeText, { color: Colors.light.success }]}>
                {student.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <InfoRow label="Enrollment No" value={student.enrollmentNo} />
            <InfoRow label="Date of Admission" value={student.admissionDate} />
            <InfoRow label="Date of Birth" value={student.dob} />
            <InfoRow label="Religion" value={student.religion} />
            <InfoRow label="Gender" value={student.gender} />
            <InfoRow label="Aadhar Card" value={student.aadharCard} />
            <InfoRow label="House" value={student.house} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Father Details</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={student.fatherName} />
            <InfoRow label="Phone" value={student.fatherPhone} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mother Details</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={student.motherName} />
            <InfoRow label="Phone" value={student.motherPhone} />
          </View>
        </View>

        {feeDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fee Details</Text>
            <View style={styles.card}>
              <InfoRow label="Total Due" value={`₹${feeDetails.totalDue.toLocaleString()}`} />
              <InfoRow label="Total Paid" value={`₹${feeDetails.totalPaid.toLocaleString()}`} />
              <InfoRow 
                label="Balance" 
                value={`₹${feeDetails.balance.toLocaleString()}`}
                valueStyle={{ color: Colors.light.error, fontWeight: 'bold' as const }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, valueStyle }: { label: string; value: string; valueStyle?: any }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
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
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  classBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray100,
  },
  label: {
    fontSize: 14,
    color: Colors.light.gray600,
  },
  value: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
});
