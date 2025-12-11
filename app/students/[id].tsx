import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import Colors, { classColors } from '@/constants/colors';
import { studentService } from '@/api';
import type { StudentDetail } from '@/api';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getStudentDetail(id!);
      if (response.success && response.data && response.data.length > 0) {
        setStudent(response.data[0]);
      } else {
        setError(response.error || 'Student not found');
      }
    } catch (err) {
      setError('Error fetching student details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !student) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 16, color: Colors.light.error }}>{error || 'Student not found'}</Text>
      </SafeAreaView>
    );
  }

  const getColorForClass = (className: string) => {
    const classes = ['NURSERY', 'L.K.G', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const index = classes.indexOf(className);
    return classColors[index % classColors.length];
  };

  const color = getColorForClass(student.cls);

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
              {`${student.FirstName?.charAt(0) || ''}${student.LastName?.charAt(0) || ''}`}
            </Text>
          </View>
          <Text style={styles.name}>{`${student.FirstName} ${student.LastName || ''}`}</Text>
          <View style={styles.badges}>
            <View style={[styles.classBadge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{student.cls} {student.section}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: Colors.light.lightGreen }]}>
              <Text style={[styles.badgeText, { color: Colors.light.success }]}>
                {student.status?.toUpperCase() || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <InfoRow label="Enrollment No" value={student.AdmissionId} />
            <InfoRow label="Date of Birth" value={student.DOB || 'N/A'} />
            <InfoRow label="Religion" value={student.Religion || 'N/A'} />
            <InfoRow label="Gender" value={student.Gender || 'N/A'} />
            <InfoRow label="Blood Group" value={student.BloodGroup || 'N/A'} />
            <InfoRow label="Nationality" value={student.Nationality || 'N/A'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Father Details</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={student.father} />
            <InfoRow label="Phone" value={student.fcontact || 'N/A'} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mother Details</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={student.mother} />
            <InfoRow label="Phone" value={student.mcontact || 'N/A'} />
          </View>
        </View>


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
