import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { classFeeData } from '@/mocks/data';
import Colors from '@/constants/colors';
import { feeService } from '@/api';
import type { FeeCollectionResponse, FeePaymentResponse } from '@/api';
import BarChart from '@/components/BarChart';
import { Feather } from '@expo/vector-icons';

export default function FeesScreen() {
  const { dashboardStats } = useApp();
  const [feeCollectionData, setFeeCollectionData] = useState<FeeCollectionResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWebViewUrl, setSelectedWebViewUrl] = useState<string | null>(null);
  const [webViewModalVisible, setWebViewModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feeService.getTodayFeeCollection();
      if (response.success && response.data) {
        setFeeCollectionData(response.data);
      } else {
        setError(response.error || 'Failed to fetch fee collection data');
      }
    } catch (err) {
      setError('Error fetching fee data');
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

  const getFeeCollectionSummary = () => {
    return feeService.parseFeeCollectionSummary(feeCollectionData);
  };

  const summary = getFeeCollectionSummary();

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Fee Management' }} />
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={{ marginTop: 12, color: Colors.light.gray600 }}>Loading fee data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Fee Management' }} />
      <ScrollView style={styles.scrollView}>
        {/* Dashboard Stats */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Expected</Text>
            <Text style={[styles.summaryValue, { color: Colors.light.primary }]}>
              ₹{dashboardStats?.fees.expected.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Received</Text>
            <Text style={[styles.summaryValue, { color: Colors.light.success }]}>
              ₹{dashboardStats?.fees.received.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={[styles.summaryValue, { color: Colors.light.error }]}>
              ₹{dashboardStats?.fees.balance.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Today's Collection Summary */}
        {summary.totalRecords > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Collection</Text>
            <View style={styles.card}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Collected</Text>
                <Text style={[styles.summaryValue, { color: Colors.light.success }]}>
                  ₹{summary.totalCollected.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={[styles.summaryRow, { marginTop: 12 }]}>
                <Text style={styles.summaryLabel}>Records</Text>
                <Text style={[styles.summaryValue, { color: Colors.light.primary }]}>
                  {summary.totalRecords}
                </Text>
              </View>

              <View style={styles.paymentModeGrid}>
                <View style={styles.paymentModeCard}>
                  <Text style={styles.paymentModeLabel}>Cash</Text>
                  <Text style={[styles.paymentModeValue, { color: Colors.light.success }]}>
                    ₹{summary.paymentModes.Cash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.paymentModeCard}>
                  <Text style={styles.paymentModeLabel}>Cheque</Text>
                  <Text style={[styles.paymentModeValue, { color: Colors.light.primary }]}>
                    ₹{summary.paymentModes.Cheque.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.paymentModeCard}>
                  <Text style={styles.paymentModeLabel}>POS</Text>
                  <Text style={[styles.paymentModeValue, { color: Colors.light.secondary }]}>
                    ₹{summary.paymentModes.POS.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Today's Collections List */}
        {summary.totalRecords > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collection Details</Text>
            {summary.topStudents.map((item, index) => (
              <View key={index} style={styles.collectionCard}>
                <View style={styles.collectionHeader}>
                  <Text style={styles.serialNo}>#{item.sr_no}</Text>
                  <View style={styles.collectionInfo}>
                    <Text style={styles.studentName}>{item.Name}</Text>
                    <Text style={styles.studentClass}>
                      Class {item.Class} - Section {item.Section}
                    </Text>
                  </View>
                </View>
                <View style={styles.collectionDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={[styles.detailValue, { color: Colors.light.success }]}>
                      ₹{parseFloat(item.Paid).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mode</Text>
                    <Text style={[styles.detailValue, { fontWeight: '600' as const }]}>
                      {item.PaymentMode}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Receipt</Text>
                    <Text style={[styles.detailValue, { fontWeight: '600' as const }]}>
                      {item.RecieptNumber}
                    </Text>
                  </View>
                </View>
                <Text style={styles.timestamp}>{item.CreatedAt}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Class-wise Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Class-wise Collection</Text>
          <View style={styles.card}>
            <BarChart data={classFeeData.map(c => ({ label: c.class, value: c.paid, color: c.color }))} height={220} />
          </View>
        </View>

        {/* Fee Details by Class */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fee Details by Class</Text>
          {classFeeData.map((item, index) => (
            <View key={index} style={styles.classCard}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <View style={styles.classInfo}>
                <Text style={styles.className}>Class {item.class}</Text>
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Paid: <Text style={styles.feeValue}>₹{item.paid.toLocaleString()}</Text></Text>
                  <Text style={styles.feeLabel}>Excess: <Text style={styles.feeValue}>₹{item.excess}</Text></Text>
                  <Text style={styles.feeLabel}>Late: <Text style={styles.feeValue}>₹{item.late}</Text></Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {error && (
          <View style={[styles.section, { alignItems: 'center' }]}>
            <Text style={{ color: Colors.light.error, fontSize: 16, textAlign: 'center' }}>
              {error}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 12,
                paddingHorizontal: 20,
                paddingVertical: 8,
                backgroundColor: Colors.light.primary,
                borderRadius: 8,
              }}
              onPress={fetchFeeData}
            >
              <Text style={{ color: '#fff', fontWeight: '600' as const }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* WebView Modal */}
      <Modal
        visible={webViewModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseWebView}
      >
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>Fee Details</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  scrollView: { flex: 1 },
  summaryCard: {
    backgroundColor: Colors.light.card,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }),
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 16, color: Colors.light.gray600 },
  summaryValue: { fontSize: 20, fontWeight: 'bold' as const },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' as const, color: Colors.light.text, marginBottom: 12 },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }),
  },
  paymentModeGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  paymentModeCard: {
    flex: 1,
    backgroundColor: Colors.light.gray100,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  paymentModeLabel: {
    fontSize: 12,
    color: Colors.light.gray600,
    marginBottom: 4,
  },
  paymentModeValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  collectionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  collectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  serialNo: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: Colors.light.primary,
    minWidth: 35,
  },
  collectionInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  studentClass: {
    fontSize: 12,
    color: Colors.light.gray600,
    marginTop: 2,
  },
  collectionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray100,
  },
  detailRow: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.light.gray600,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.light.gray500,
  },
  classCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 }, android: { elevation: 2 } }),
  },
  colorIndicator: { width: 4, borderRadius: 2 },
  classInfo: { flex: 1 },
  className: { fontSize: 16, fontWeight: '600' as const, color: Colors.light.text, marginBottom: 8 },
  feeRow: { flexDirection: 'row', gap: 16 },
  feeLabel: { fontSize: 13, color: Colors.light.gray600 },
  feeValue: { fontWeight: '600' as const, color: Colors.light.text },

  webViewContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray100,
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
    backgroundColor: Colors.light.background,
  },
});

