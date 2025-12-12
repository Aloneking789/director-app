/**
 * Fees API Service
 * Handles all fee-related API calls including fee collection and payment details
 */

import { httpClient, ApiResponse } from '../httpClient';
import { API_ENDPOINTS, SESSION_CONFIG } from '../config';
import { FeeCollectionResponse, FeePaymentResponse } from '../types';

class FeeService {
  /**
   * Get today's fee collection data
   * 
   * API: GET /Director.asmx/All_Session_Fee_Collection_dt_today
   * Parameters: token (token added automatically)
   * 
   * Returns array of fee collection items for today
   */
  async getTodayFeeCollection(): Promise<ApiResponse<FeeCollectionResponse>> {
    try {
      console.log('[FEE] Fetching today\'s fee collection data...');
      const endpoint = `${API_ENDPOINTS.FEE_COLLECTION_TODAY}`;
      console.log('[FEE] Endpoint:', endpoint);
      const response = await httpClient.get<FeeCollectionResponse>(endpoint);
      console.log('[FEE] Response:', response);
      
      return response;
    } catch (error) {
      console.error('[FEE] Exception:', error);
      return {
        success: false,
        error: 'Failed to fetch fee collection data',
      };
    }
  }

  /**
   * Get fee payment details for a student
   * 
   * API: GET /Director.asmx/get_Fee_payment
   * Parameters: stid (student ID), token (token added automatically)
   * 
   * Returns fee payment details with webview links
   */
  async getStudentFeePayment(studentId: string): Promise<ApiResponse<FeePaymentResponse>> {
    try {
      console.log(`[FEE] Fetching fee payment details for student: ${studentId}...`);
      const endpoint = `${API_ENDPOINTS.FEE_PAYMENT_DETAILS}?stid=${studentId}`;
      console.log('[FEE] Endpoint:', endpoint);
      const response = await httpClient.get<FeePaymentResponse>(endpoint);
      console.log('[FEE] Response:', response);
      
      return response;
    } catch (error) {
      console.error('[FEE] Exception:', error);
      return {
        success: false,
        error: 'Failed to fetch fee payment details',
      };
    }
  }

  /**
   * Parse fee collection data into summary statistics
   */
  parseFeeCollectionSummary(data: FeeCollectionResponse) {
    if (!data || data.length === 0) {
      return {
        totalCollected: 0,
        totalRecords: 0,
        paymentModes: { Cash: 0, Cheque: 0, POS: 0 },
        topStudents: [],
      };
    }

    let totalCollected = 0;
    const paymentModes = { Cash: 0, Cheque: 0, POS: 0 };
    
    data.forEach((item) => {
      totalCollected += parseFloat(item.Paid || '0');
      paymentModes.Cash += parseFloat(item.Cash || '0');
      paymentModes.Cheque += parseFloat(item.Cheque || '0');
      paymentModes.POS += parseFloat(item.pos || '0');
    });

    return {
      totalCollected,
      totalRecords: data.length,
      paymentModes,
      topStudents: data.slice(0, 5),
    };
  }
}

// Export singleton instance
export const feeService = new FeeService();
