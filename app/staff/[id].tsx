import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStaffById } = useApp();
  const staff = getStaffById(id!);

  if (!staff) {
    return <View style={styles.container}><Text>Staff not found</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Staff Directory' }} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: Colors.light.primary }]}>
            <Text style={styles.avatarText}>{staff.name.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <Text style={styles.name}>{staff.name}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightBlue }]}>
              <Text style={styles.badgeText}>{staff.staffId}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightOrange }]}>
              <Text style={styles.badgeText}>{staff.designation}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.card}>
            <InfoRow label="Department" value={staff.department} />
            <InfoRow label="Date of Joining" value={staff.joiningDate} />
            <InfoRow label="Date of Birth" value={staff.dob} />
            <InfoRow label="Religion" value={staff.religion} />
            <InfoRow label="Contact Number" value={staff.phone} />
            <InfoRow label="Email" value={staff.email} />
          </View>
        </View>
      </ScrollView>
    </View>
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
