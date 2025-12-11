/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */

import { httpClient, ApiResponse } from '../httpClient';
import { API_ENDPOINTS, SESSION_CONFIG } from '../config';
import { DashboardResponse, DashboardKPI } from '../types';

class DashboardService {
  /**
   * Get dashboard statistics (KPI cards)
   * 
   * API: GET /Director.asmx/Dire_Dashboard
   * Parameters: sessionid, token (token added automatically)
   * 
   * Returns array of KPI objects with labels and values
   */
  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    try {
      console.log('[DASHBOARD] Fetching dashboard data...');
      // C# backend: parameters should be in query string without 'session=' wrapper
      const endpoint = `${API_ENDPOINTS.DASHBOARD}?sessionid=${SESSION_CONFIG.DEFAULT_SESSION}`;
      console.log('[DASHBOARD] Endpoint:', endpoint);
      const response = await httpClient.get<DashboardResponse>(endpoint);
      console.log('[DASHBOARD] Response:', response);
      
      if (response.success) {
        console.log('[DASHBOARD] Raw data:', response.data);
        const parsed = this.parseDashboardResponse(response.data!);
        console.log('[DASHBOARD] Parsed data:', parsed);
      } else {
        console.error('[DASHBOARD] Error:', response.error);
      }
      
      return response;
    } catch (error) {
      console.error('[DASHBOARD] Exception:', error);
      return {
        success: false,
        error: 'Failed to fetch dashboard data',
      };
    }
  }

  /**
   * Parse dashboard response into categorized data
   * Converts flat KPI array into organized dashboard object
   */
  parseDashboardResponse(data: DashboardResponse) {
    const result = {
      students: {
        total: 0,
        new: 0,
        old: 0,
        present: 0,
        absent: 0,
        dropped: 0,
        newDropped: 0,
        oldDropped: 0,
        male: 0,
        female: 0,
        active: 0,
      },
      staff: {
        total: 0,
        female: 0,
        male: 0,
        present: 0,
        absent: 0,
        active: 0,
        new: 0,
        left: 0,
      },
      attendance: {
        studentPresent: 0,
        studentAbsent: 0,
        studentHalfDay: 0,
        studentLeave: 0,
        studentNotMarked: 0,
      },
      communication: {
        smsToday: 0,
        smsWeek: 0,
        internalToday: 0,
        internalWeek: 0,
      },
      fees: {
        expected: 0,
        received: 0,
        balance: 0,
        todayCollection: 0,
        deletedReceipts: 0,
      },
      assignments: {
        homework: 0,
        classwork: 0,
        activities: 0,
      },
      birthday: {
        studentsToday: 0,
        staffToday: 0,
      },
    };

    // Parse API response (if data is an array)
    if (Array.isArray(data)) {
      data.forEach((kpi: DashboardKPI) => {
        const value = parseInt(kpi.Value, 10);
        
        switch (kpi.Id) {
          // Students
          case '1':
            result.students.total = value;
            result.students.active = value; // Assume total = active for now
            break;
          case '2':
            result.students.new = value;
            break;
          case '3':
            result.students.old = value;
            break;
          case '4':
            result.students.present = value;
            result.attendance.studentPresent = value;
            break;
          case '5':
            result.students.absent = value;
            result.attendance.studentAbsent = value;
            break;
          case '6':
            result.students.dropped = value;
            break;
          case '7':
            result.students.newDropped = value;
            break;
          case '8':
            result.students.oldDropped = value;
            break;
          case '9':
            result.students.male = value;
            break;
          case '10':
            result.students.female = value;
            break;
          // Staff
          case '11':
            result.staff.total = value;
            result.staff.active = value; // Assume total = active
            break;
          case '12':
            result.staff.female = value;
            break;
          case '13':
            result.staff.male = value;
            break;
          case '14':
            result.staff.present = value;
            break;
          case '15':
            result.staff.absent = value;
            break;
        }
      });
    }

    // Set default fees calculation
    result.fees.balance = result.fees.expected - result.fees.received;

    return result;
  }
}

export const dashboardService = new DashboardService();
