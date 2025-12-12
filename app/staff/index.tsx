import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { staffService } from '@/api';
import type { StaffListItem } from '@/api';

export default function StaffScreen() {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [staff, setStaff] = useState<StaffListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await staffService.getStaffList();
      if (response.success && response.data) {
        setStaff(response.data);
      } else {
        setError(response.error || 'Failed to fetch staff');
      }
    } catch (err) {
      setError('Error fetching staff');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayStaff = searchQuery ? staffService.searchStaff(staff, searchQuery) : staff.slice(0, 50);

  const avatarColors = ['#FF9F43', '#A78BFA', '#EF4444', '#22C55E', '#3B82F6'];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderStaff = ({ item, index }: { item: StaffListItem; index: number }) => {
    const color = avatarColors[index % avatarColors.length];
    const staffName = `${item.FirstName} ${item.MiddleName || ''} ${item.LastName || ''}`.trim();

    return (
      <TouchableOpacity
        style={styles.staffCard}
        onPress={() => router.push(`/staff/${item.Id}`)}
      >
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{getInitials(staffName)}</Text>
        </View>
        <View style={styles.staffInfo}>
          <View style={styles.staffHeader}>
            <Text style={styles.staffName}>{staffName}</Text>
            <Feather name="check" size={16} color={Colors.light.success} />
          </View>
          <Text style={styles.staffDetails}>📞 {item.Id}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightBlue }]}>
              <Text style={styles.badgeText}>{item.EmployeeId}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightOrange }]}>
              <Text style={styles.badgeText}>{item.JobTitle}</Text>
            </View>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={Colors.light.gray400} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={{ marginTop: 12, color: Colors.light.gray600 }}>Loading staff...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }]}>
          <Text style={{ color: Colors.light.error, fontSize: 16, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: Colors.light.primary,
              borderRadius: 8,
            }}
            onPress={fetchStaff}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Staff Directory' }} />
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color={Colors.light.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Employee Name or Mobile No"
            placeholderTextColor={Colors.light.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={displayStaff}
        renderItem={renderStaff}
        keyExtractor={item => item.Id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }, android: { elevation: 2 } }),
  },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.gray100, borderRadius: 12, paddingHorizontal: 12, gap: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 14, color: Colors.light.text },
  listContainer: { padding: 16, gap: 12 },
  staffCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 }, android: { elevation: 2 } }),
  },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: 'bold' as const, color: '#fff' },
  staffInfo: { flex: 1, gap: 2 },
  staffHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  staffName: { fontSize: 15, fontWeight: '600' as const, color: Colors.light.text },
  staffDetails: { fontSize: 13, color: Colors.light.gray600 },
  badges: { flexDirection: 'row', gap: 6, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '600' as const, color: Colors.light.primary },
});
