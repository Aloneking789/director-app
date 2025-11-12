import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Users,
  FileText,
  Trash2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import type { WorkingLogActivity } from '@/types';

export default function WorkingLogScreen() {
  const [selectedMonth, setSelectedMonth] = useState<string>('November 2025');

  const activities: WorkingLogActivity[] = [
    {
      id: '1',
      date: '2025-11-10',
      time: '14:30',
      type: 'collection',
      description: 'Fee collected from Aadarsh Kumar - Class IX-A',
      actor: 'Clerk User',
      amount: 1500,
    },
    {
      id: '2',
      date: '2025-11-10',
      time: '11:20',
      description: 'New admission: Priya Singh - Class II-B',
      actor: 'Admin User',
      type: 'admission',
    },
    {
      id: '3',
      date: '2025-11-10',
      time: '10:15',
      type: 'collection',
      description: 'Fee collected from Amit Yadav - Class V-A',
      actor: 'Accountant',
      amount: 2000,
    },
    {
      id: '4',
      date: '2025-11-09',
      time: '16:45',
      type: 'deletion',
      description: 'Receipt RCT001234 deleted - Duplicate entry',
      actor: 'Director',
      amount: 1200,
    },
    {
      id: '5',
      date: '2025-11-09',
      time: '14:00',
      type: 'attendance',
      description: 'Student attendance marked for Class VI-A',
      actor: 'Teacher',
    },
    {
      id: '6',
      date: '2025-11-09',
      time: '09:30',
      type: 'collection',
      description: 'Fee collected from Neha Mishra - Class XII-B',
      actor: 'Clerk User',
      amount: 3400,
    },
  ];

  const dailyGroups = useMemo(() => {
    const grouped: Record<string, WorkingLogActivity[]> = {};
    activities.forEach((activity) => {
      if (!grouped[activity.date]) {
        grouped[activity.date] = [];
      }
      grouped[activity.date].push(activity);
    });
    return grouped;
  }, [activities]);

  const dailyStats = useMemo(() => {
    const stats: Record<string, { collection: number; admissions: number; deletions: number }> = {};
    Object.keys(dailyGroups).forEach((date) => {
      const dayActivities = dailyGroups[date];
      stats[date] = {
        collection: dayActivities
          .filter((a) => a.type === 'collection')
          .reduce((sum, a) => sum + (a.amount || 0), 0),
        admissions: dayActivities.filter((a) => a.type === 'admission').length,
        deletions: dayActivities.filter((a) => a.type === 'deletion').length,
      };
    });
    return stats;
  }, [dailyGroups]);

  const getActivityIcon = (type: WorkingLogActivity['type']) => {
    switch (type) {
      case 'collection':
        return IndianRupee;
      case 'admission':
        return Users;
      case 'deletion':
        return Trash2;
      case 'edit':
        return FileText;
      case 'attendance':
        return Calendar;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type: WorkingLogActivity['type']) => {
    switch (type) {
      case 'collection':
        return Colors.light.success;
      case 'admission':
        return Colors.light.primary;
      case 'deletion':
        return Colors.light.error;
      case 'edit':
        return Colors.light.warning;
      case 'attendance':
        return Colors.light.secondary;
      default:
        return Colors.light.gray500;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Working Log' }} />
      <View style={styles.container}>
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.monthButton}>
            <Text style={styles.monthText}>{selectedMonth}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {Object.keys(dailyGroups)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map((date) => (
              <View key={date} style={styles.dayCard}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                  <View style={styles.dateStats}>
                    {dailyStats[date].collection > 0 && (
                      <View style={styles.statBadge}>
                        <IndianRupee size={14} color={Colors.light.success} />
                        <Text style={styles.statText}>
                          ₹{dailyStats[date].collection.toLocaleString()}
                        </Text>
                      </View>
                    )}
                    {dailyStats[date].admissions > 0 && (
                      <View style={styles.statBadge}>
                        <Users size={14} color={Colors.light.primary} />
                        <Text style={styles.statText}>{dailyStats[date].admissions}</Text>
                      </View>
                    )}
                    {dailyStats[date].deletions > 0 && (
                      <View style={styles.statBadge}>
                        <Trash2 size={14} color={Colors.light.error} />
                        <Text style={styles.statText}>{dailyStats[date].deletions}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.activitiesList}>
                  {dailyGroups[date].map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const color = getActivityColor(activity.type);
                    return (
                      <View key={activity.id} style={styles.activityItem}>
                        <View style={styles.activityTimeline}>
                          <View style={[styles.activityDot, { backgroundColor: color }]} />
                          {activity.id !== dailyGroups[date][dailyGroups[date].length - 1].id && (
                            <View style={styles.activityLine} />
                          )}
                        </View>
                        <View style={styles.activityContent}>
                          <View style={styles.activityHeader}>
                            <View style={[styles.activityIcon, { backgroundColor: `${color}15` }]}>
                              <Icon size={16} color={color} />
                            </View>
                            <Text style={styles.activityTime}>{activity.time}</Text>
                          </View>
                          <Text style={styles.activityDescription}>{activity.description}</Text>
                          <View style={styles.activityFooter}>
                            <Text style={styles.activityActor}>By: {activity.actor}</Text>
                            {activity.amount && (
                              <Text style={[styles.activityAmount, { color }]}>
                                ₹{activity.amount.toLocaleString()}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  monthSelector: {
    padding: 16,
  },
  monthButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  dayCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
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
  dateHeader: {
    backgroundColor: Colors.light.lightBlue,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  dateStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  activitiesList: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityTimeline: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  activityLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.light.gray200,
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTime: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.gray600,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityActor: {
    fontSize: 12,
    color: Colors.light.gray500,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
});
