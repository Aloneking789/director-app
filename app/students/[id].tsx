import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator, Image, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';
import Colors, { classColors } from '@/constants/colors';
import { studentService, feeService } from '@/api';
import type { StudentDetail, FeePaymentResponse } from '@/api';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [feeDetails, setFeeDetails] = useState<FeePaymentResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWebViewUrl, setSelectedWebViewUrl] = useState<string | null>(null);
  const [webViewModalVisible, setWebViewModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (id) fetchStudentDetail();
  }, [id]);

  const fetchStudentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getStudentDetail(id!);
      if (response.success && response.data && response.data.length > 0) {
        const studentData = response.data[0];
        setStudent(studentData);
        // Fetch photo
        const photoResponse = await studentService.getStudentPhoto(studentData.Id.toString());
        if (photoResponse.success && photoResponse.data) {
          const url = studentService.getStudentPhotoUrl(photoResponse.data);
          setPhotoUrl(url);
        }
        // Fetch fee payment details
        const feeResponse = await feeService.getStudentFeePayment(studentData.Id.toString());
        if (feeResponse.success && feeResponse.data) {
          setFeeDetails(feeResponse.data);
        }
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

  const handleOpenWebView = (url: string) => {
    setSelectedWebViewUrl(url);
    setWebViewModalVisible(true);
  };

  const handleCloseWebView = () => {
    setWebViewModalVisible(false);
    setSelectedWebViewUrl(null);
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
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.photo}
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: color }]}>
              <Text style={styles.avatarText}>
                {`${student.FirstName?.charAt(0) || ''}${student.LastName?.charAt(0) || ''}`}
              </Text>
            </View>
          )}
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

        {/* Fee Payment Details */}
        {feeDetails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fee Payment Details</Text>
            {feeDetails.map((fee, index) => (
              <TouchableOpacity
                key={index}
                style={styles.feeCard}
                onPress={() => fee.Event_description && handleOpenWebView(fee.Event_description)}
              >
                <View style={styles.feeContent}>
                  <Text style={styles.feeTitle}>{fee.Event_tile}</Text>
                  {fee.Event_description && (
                    <Text style={styles.feeLink}>View Payment Details →</Text>
                  )}
                </View>
                {fee.Event_description && (
                  <Feather name="external-link" size={20} color={Colors.light.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

      {/* WebView Modal for Fee Details */}
      <Modal
        visible={webViewModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseWebView}
      >
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>Fee Payment Details</Text>
            <TouchableOpacity
              style={styles.webViewCloseButton}
              onPress={handleCloseWebView}
            >
              <Feather name="x" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          {selectedWebViewUrl && (
            <WebView
              source={{ uri: selectedWebViewUrl }}
              style={styles.webView}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.light.primary} />
                </View>
              )}
            />
          )}
        </View>
      </Modal>
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
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  feeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
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
  feeContent: {
    flex: 1,
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  feeLink: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500' as const,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray100,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  webViewCloseButton: {
    padding: 8,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },});