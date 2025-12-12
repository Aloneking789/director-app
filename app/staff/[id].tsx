import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { staffService } from '@/api';
import type { StaffListItem } from '@/api';

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [staff, setStaff] = useState<StaffListItem | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchStaffDetail();
  }, [id]);

  const fetchStaffDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await staffService.getStaffList();
      if (response.success && response.data) {
        const staffMember = response.data.find(s => s.Id.toString() === id || s.EmployeeId === id);
        if (staffMember) {
          setStaff(staffMember);
          // Fetch photo
          const photoResponse = await staffService.getStaffPhoto(staffMember.EmployeeId);
          if (photoResponse.success && photoResponse.data) {
            const url = staffService.getStaffPhotoUrl(photoResponse.data);
            setPhotoUrl(url);
          }
        } else {
          setError('Staff member not found');
        }
      } else {
        setError(response.error || 'Failed to fetch staff details');
      }
    } catch (err) {
      setError('Error fetching staff details');
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

  if (error || !staff) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 16, color: Colors.light.error }}>{error || 'Staff not found'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Staff Directory' }} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.photo}
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: Colors.light.primary }]}>
              <Text style={styles.avatarText}>
                {`${staff.FirstName?.charAt(0) || ''}${staff.LastName?.charAt(0) || ''}`}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{`${staff.FirstName} ${staff.MiddleName || ''} ${staff.LastName || ''}`}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightBlue }]}>
              <Text style={styles.badgeText}>{staff.EmployeeId}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightOrange }]}>
              <Text style={styles.badgeText}>{staff.JobTitle}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.card}>
            <InfoRow label="Department" value={staff.EmployeeCategoryName || 'N/A'} />
            <InfoRow label="Position" value={staff.EmployeePositionName || 'N/A'} />
            <InfoRow label="Date of Joining" value={staff.JoiningDate || 'N/A'} />
            <InfoRow label="Gender" value={staff.Gender || 'N/A'} />
            <InfoRow label="Qualification" value={staff.Qualification || 'N/A'} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scrollView: { flex: 1 },
  header: {
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    paddingVertical: 24,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 }, android: { elevation: 3 } }),
  },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  photo: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: 'bold' as const, color: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold' as const, color: Colors.light.text, marginBottom: 12 },
  badges: { flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' as const, color: Colors.light.primary },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' as const, color: Colors.light.text, marginBottom: 12 },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 }, android: { elevation: 2 } }),
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.light.gray100 },
  label: { fontSize: 14, color: Colors.light.gray600 },
  value: { fontSize: 14, fontWeight: '500' as const, color: Colors.light.text },
});
