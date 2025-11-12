import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight, Check } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors, { classColors } from '@/constants/colors';

export default function StudentsScreen() {
  const { students, searchStudents } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const displayStudents = searchQuery ? searchStudents(searchQuery) : students.slice(0, 50);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
  };

  const getColorForClass = (className: string) => {
    const classes = ['NURSERY', 'L.K.G', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const index = classes.indexOf(className);
    return classColors[index % classColors.length];
  };

  const renderStudent = ({ item }: { item: typeof students[0] }) => {
    const color = getColorForClass(item.class);

    return (
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() => router.push(`/students/${item.id}`)}
      >
        <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
          <Text style={[styles.avatarText, { color }]}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.studentInfo}>
          <View style={styles.studentHeader}>
            <Text style={styles.studentName}>{item.name}</Text>
            <View style={[styles.enrollmentBadge, { backgroundColor: Colors.light.lightBlue }]}>
              <Text style={styles.enrollmentText}>{item.enrollmentNo}</Text>
            </View>
            {item.status === 'active' && (
              <Check size={16} color={Colors.light.success} />
            )}
          </View>
          <Text style={styles.studentDetails}>
            {item.fatherName}
          </Text>
          <Text style={styles.studentDetails}>
            {item.motherName}
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{item.class}</Text>
            </View>
            <Text style={styles.genderText}>{item.gender.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <ChevronRight size={20} color={Colors.light.gray400} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Student Directory',
        }}
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={Colors.light.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name or Admission No or Mobile No"
            placeholderTextColor={Colors.light.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={displayStudents}
        renderItem={renderStudent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gray100,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: Colors.light.text,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  studentCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  studentInfo: {
    flex: 1,
    gap: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  enrollmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  enrollmentText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  studentDetails: {
    fontSize: 13,
    color: Colors.light.gray600,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#fff',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.light.gray500,
  },
});
