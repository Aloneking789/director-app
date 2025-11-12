import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { Search, ChevronRight, Check } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function StaffScreen() {
  const { staff, searchStaff } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displayStaff = searchQuery ? searchStaff(searchQuery) : staff.slice(0, 50);

  const avatarColors = ['#FF9F43', '#A78BFA', '#EF4444', '#22C55E', '#3B82F6'];
  
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderStaff = ({ item, index }: { item: typeof staff[0]; index: number }) => {
    const color = avatarColors[index % avatarColors.length];

    return (
      <TouchableOpacity
        style={styles.staffCard}
        onPress={() => router.push(`/staff/${item.id}`)}
      >
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.staffInfo}>
          <View style={styles.staffHeader}>
            <Text style={styles.staffName}>{item.name}</Text>
            {item.isActive && <Check size={16} color={Colors.light.success} />}
          </View>
          <Text style={styles.staffDetails}>📞 {item.phone}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightBlue }]}>
              <Text style={styles.badgeText}>{item.staffId}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.light.lightOrange }]}>
              <Text style={styles.badgeText}>{item.designation}</Text>
            </View>
          </View>
        </View>
        <ChevronRight size={20} color={Colors.light.gray400} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Staff Directory' }} />
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={Colors.light.gray400} />
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
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
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
