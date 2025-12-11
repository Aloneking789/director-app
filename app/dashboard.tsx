import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Menu,
  RefreshCw,
  Search,
  Bell,
  Users,
  UserCheck,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Calendar,
  Cake,
  BookOpen,
  MessageSquare,
  FileText,
  BarChart3,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import KPICard from '@/components/KPICard';
import BarChart from '@/components/BarChart';
import DonutChart from '@/components/DonutChart';
import { classFeeData } from '@/mocks/data';
import { dashboardService } from '@/api';

export default function DashboardScreen() {
  const { user, schoolInfo, selectedSession, logout } = useApp();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showStudentAnalysis, setShowStudentAnalysis] = useState<boolean>(true);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboard();
      if (response.success && response.data) {
        const parsed = dashboardService.parseDashboardResponse(response.data);
        setDashboardStats(parsed);
      } else {
        setError(response.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error fetching dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDrawerVisible(!drawerVisible)}
          >
            <Menu size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>Hi {user?.name.split(' ')[0]}</Text>
            <Text style={styles.subGreeting}>{greeting()}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <RefreshCw size={20} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={20} color={Colors.light.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.schoolCard}>
          <Text style={styles.schoolName}>{schoolInfo.name}</Text>
          <Text style={styles.schoolLocation}>{schoolInfo.location}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.analysisToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showStudentAnalysis && styles.toggleButtonActive,
            ]}
            onPress={() => setShowStudentAnalysis(true)}
          >
            <Text
              style={[
                styles.toggleText,
                showStudentAnalysis && styles.toggleTextActive,
              ]}
            >
              Student Analysis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !showStudentAnalysis && styles.toggleButtonActive,
            ]}
            onPress={() => setShowStudentAnalysis(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !showStudentAnalysis && styles.toggleTextActive,
              ]}
            >
              Staff Analysis
            </Text>
          </TouchableOpacity>
        </View>

        {showStudentAnalysis ? (
          <>
            <View style={styles.kpiGrid}>
              <KPICard
                title="Active Male"
                value={dashboardStats?.students.male || 0}
                icon={Users}
                iconColor="#3B82F6"
                iconBackground={Colors.light.lightBlue}
                onPress={() => router.push('/students')}
              />
              <KPICard
                title="Active Female"
                value={dashboardStats?.students.female || 0}
                icon={Users}
                iconColor="#EC4899"
                iconBackground={Colors.light.lightPink}
                onPress={() => router.push('/students')}
              />
            </View>

            <View style={styles.kpiGrid}>
              <KPICard
                title="Active Student"
                value={dashboardStats?.students.active || 0}
                icon={GraduationCap}
                iconColor="#8B5CF6"
                iconBackground={Colors.light.lightPurple}
                onPress={() => router.push('/students')}
              />
              <KPICard
                title="New"
                value={dashboardStats?.students.new || 0}
                icon={UserCheck}
                iconColor="#10B981"
                iconBackground={Colors.light.lightGreen}
              />
            </View>

            <View style={styles.kpiGrid}>
              <KPICard
                title="TC"
                value={dashboardStats?.students.tc || 0}
                icon={BookOpen}
                iconColor="#F59E0B"
                iconBackground={Colors.light.lightOrange}
              />
              <KPICard
                title="Dropout"
                value={dashboardStats?.students.dropout || 0}
                icon={Users}
                iconColor="#EF4444"
                iconBackground={Colors.light.lightRed}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.kpiGrid}>
              <KPICard
                title="Active Male"
                value="42"
                icon={Briefcase}
                iconColor="#3B82F6"
                iconBackground={Colors.light.lightBlue}
                onPress={() => router.push('/staff')}
              />
              <KPICard
                title="Active Female"
                value="38"
                icon={Briefcase}
                iconColor="#EC4899"
                iconBackground={Colors.light.lightPink}
                onPress={() => router.push('/staff')}
              />
            </View>

            <View style={styles.kpiGrid}>
              <KPICard
                title="Active Staff"
                value={dashboardStats?.staff.active || 0}
                icon={Briefcase}
                iconColor="#8B5CF6"
                iconBackground={Colors.light.lightPurple}
                onPress={() => router.push('/staff')}
              />
              <KPICard
                title="New"
                value={dashboardStats?.staff.new || 0}
                icon={UserCheck}
                iconColor="#10B981"
                iconBackground={Colors.light.lightGreen}
              />
            </View>

            <View style={styles.kpiGrid}>
              <KPICard
                title="Left"
                value={dashboardStats?.staff.left || 0}
                icon={Users}
                iconColor="#EF4444"
                iconBackground={Colors.light.lightRed}
              />
              <KPICard
                title="Total Staff"
                value={dashboardStats?.staff.total || 0}
                icon={Briefcase}
                iconColor="#6B7280"
                iconBackground={Colors.light.gray200}
              />
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Attendance</Text>
          <View style={styles.card}>
            <View style={styles.dateSelector}>
              <Text style={styles.dateText}>10 Nov 2025</Text>
              <TouchableOpacity onPress={() => router.push('/attendance')}>
                <Calendar size={20} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            <DonutChart
              data={[
                {
                  label: 'Present',
                  value: dashboardStats?.attendance?.studentPresent || 0,
                  color: '#22C55E',
                },
                {
                  label: 'Absent',
                  value: dashboardStats?.attendance?.studentAbsent || 0,
                  color: '#EF4444',
                },
                {
                  label: 'Half Day',
                  value: dashboardStats?.attendance?.studentHalfDay || 0,
                  color: '#3B82F6',
                },
                {
                  label: 'Leave',
                  value: dashboardStats?.attendance?.studentLeave || 0,
                  color: '#F59E0B',
                },
                {
                  label: 'Not Marked',
                  value: dashboardStats?.attendance?.studentNotMarked || 0,
                  color: '#6B7280',
                },
              ]}
              size={200}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>
          <View style={styles.communicationGrid}>
            <View style={[styles.commCard, { backgroundColor: Colors.light.lightBlue }]}>
              <MessageSquare size={32} color="#3B82F6" />
              <Text style={styles.commTitle}>SMS</Text>
              <Text style={styles.commValue}>Today: {dashboardStats?.communication?.smsToday || 0}</Text>
              <Text style={styles.commSubvalue}>
                Week: {dashboardStats?.communication?.smsWeek || 0}
              </Text>
            </View>
            <View style={[styles.commCard, { backgroundColor: Colors.light.lightOrange }]}>
              <MessageSquare size={32} color="#F59E0B" />
              <Text style={styles.commTitle}>Internal Message</Text>
              <Text style={styles.commValue}>
                Today: {dashboardStats?.communication?.internalToday || 0}
              </Text>
              <Text style={styles.commSubvalue}>
                Week: {dashboardStats?.communication?.internalWeek || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fee Status</Text>
            <TouchableOpacity onPress={() => router.push('/fees')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <DonutChart
              data={[
                {
                  label: 'Expected',
                  value: dashboardStats?.fees?.expected || 0,
                  color: '#3B82F6',
                },
                {
                  label: 'Received',
                  value: dashboardStats?.fees?.received || 0,
                  color: '#22C55E',
                },
                {
                  label: 'Balance',
                  value: dashboardStats?.fees?.balance || 0,
                  color: '#EF4444',
                },
              ]}
              size={200}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Collection</Text>
            <Text style={styles.collectionAmount}>
              ₹{dashboardStats?.fees?.todayCollection?.toLocaleString() || 0}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financial Overview</Text>
            <TouchableOpacity onPress={() => router.push('/reports/monthly-collection')}>
              <Text style={styles.viewAll}>View Reports</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.financialGrid}>
            <TouchableOpacity
              style={[styles.financialCard, { backgroundColor: Colors.light.lightBlue }]}
              onPress={() => router.push('/reports/daily-collection')}
            >
              <IndianRupee size={28} color={Colors.light.primary} />
              <Text style={styles.financialTitle}>Daily Report</Text>
              <Text style={styles.financialValue}>₹45,200</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.financialCard, { backgroundColor: Colors.light.lightGreen }]}
              onPress={() => router.push('/reports/monthly-collection')}
            >
              <BarChart3 size={28} color="#10B981" />
              <Text style={styles.financialTitle}>Monthly</Text>
              <Text style={styles.financialValue}>₹5.8L</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.financialCard, { backgroundColor: Colors.light.lightOrange }]}
              onPress={() => router.push('/reports/deleted-receipts')}
            >
              <FileText size={28} color="#F59E0B" />
              <Text style={styles.financialTitle}>Deleted</Text>
              <Text style={styles.financialValue}>{dashboardStats?.fees?.deletedReceipts || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assignments (Last 30 Days)</Text>
          <View style={styles.assignmentGrid}>
            <View style={[styles.assignCard, { backgroundColor: Colors.light.lightPink }]}>
              <BookOpen size={32} color="#EC4899" />
              <Text style={styles.assignTitle}>Home Work</Text>
              <Text style={styles.assignValue}>{dashboardStats?.assignments?.homework || 0}</Text>
            </View>
            <View style={[styles.assignCard, { backgroundColor: Colors.light.lightBlue }]}>
              <BookOpen size={32} color="#3B82F6" />
              <Text style={styles.assignTitle}>Class Work</Text>
              <Text style={styles.assignValue}>{dashboardStats?.assignments?.classwork || 0}</Text>
            </View>
            <View style={[styles.assignCard, { backgroundColor: Colors.light.lightYellow }]}>
              <BookOpen size={32} color="#F59E0B" />
              <Text style={styles.assignTitle}>Activity</Text>
              <Text style={styles.assignValue}>{dashboardStats?.assignments?.activities || 0}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Birthday</Text>
          <View style={styles.card}>
            <Text style={styles.birthdayTitle}>Today's Birthday</Text>
            <View style={styles.birthdayGrid}>
              <View style={styles.birthdayCard}>
                <Text style={styles.birthdayCount}>{dashboardStats?.birthday?.studentsToday || 0}</Text>
                <Text style={styles.birthdayLabel}>Student</Text>
              </View>
              <View style={styles.birthdayCard}>
                <Text style={styles.birthdayCount}>{dashboardStats?.birthday?.staffToday || 0}</Text>
                <Text style={styles.birthdayLabel}>Staff</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {drawerVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setDrawerVisible(false)}
        >
          <View style={styles.drawer} onStartShouldSetResponder={() => true}>
            <View style={styles.drawerHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
              </View>
              <Text style={styles.drawerName}>{user?.name}</Text>
              <Text style={styles.drawerSession}>{selectedSession}</Text>
            </View>
            <ScrollView style={styles.drawerMenu}>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dashboard')}>
                <Users size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/students')}>
                <GraduationCap size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Students</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/staff')}>
                <Briefcase size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Staff</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/fees')}>
                <IndianRupee size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Fees</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/attendance')}>
                <Calendar size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Attendance</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/reports')}>
                <FileText size={20} color={Colors.light.primary} />
                <Text style={styles.menuItemText}>Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuItem, styles.logoutItem]}
                onPress={() => {
                  logout();
                  router.replace('/login');
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuButton: {
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.light.gray500,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolCard: {
    backgroundColor: Colors.light.gray100,
    borderRadius: 12,
    padding: 12,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  schoolLocation: {
    fontSize: 12,
    color: Colors.light.gray600,
  },
  scrollView: {
    flex: 1,
  },
  analysisToggle: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  toggleTextActive: {
    color: Colors.light.primary,
  },
  kpiGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
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
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  communicationGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  commCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  commTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
    marginTop: 8,
    textAlign: 'center',
  },
  commValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginTop: 4,
  },
  commSubvalue: {
    fontSize: 12,
    color: Colors.light.gray600,
  },
  collectionAmount: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
  },
  assignmentGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  assignCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  assignTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
    marginTop: 8,
    textAlign: 'center',
  },
  assignValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginTop: 4,
  },
  birthdayTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  birthdayGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  birthdayCard: {
    flex: 1,
    backgroundColor: Colors.light.lightPink,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  birthdayCount: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
  },
  birthdayLabel: {
    fontSize: 14,
    color: Colors.light.gray700,
    marginTop: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    maxWidth: 300,
    backgroundColor: Colors.light.card,
  },
  drawerHeader: {
    backgroundColor: Colors.light.primary,
    padding: 24,
    paddingTop: 60,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
  },
  drawerName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 4,
  },
  drawerSession: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  drawerMenu: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  logoutItem: {
    backgroundColor: Colors.light.lightRed,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.error,
  },
  financialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  financialCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  financialTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.gray700,
    marginTop: 8,
    textAlign: 'center',
  },
  financialValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
    marginTop: 4,
  },
});
