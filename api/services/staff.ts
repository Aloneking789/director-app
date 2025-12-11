/**
 * Staff API Service
 * Handles all staff/employee-related API calls
 */

import { httpClient, ApiResponse } from '../httpClient';
import { API_ENDPOINTS } from '../config';
import { StaffListResponse, StaffAttendanceResponse, PhotoListResponse, StaffListItem } from '../types';

class StaffService {
  /**
   * Get list of all staff members
   * 
   * API: GET /Director.asmx/Staff_list
   * Parameters: token (added automatically)
   * 
   * Returns array of staff objects with details
   */
  async getStaffList(): Promise<ApiResponse<StaffListResponse>> {
    try {
      console.log('[STAFF] Fetching staff list...');
      const endpoint = API_ENDPOINTS.STAFF_LIST;
      console.log('[STAFF] Endpoint:', endpoint);
      const response = await httpClient.get<StaffListResponse>(endpoint);
      console.log('[STAFF] Response status:', response.success);
      console.log('[STAFF] Response data length:', response.data?.length || 0);
      console.log('[STAFF] Full response:', response);
      return response;
    } catch (error) {
      console.error('[STAFF] Exception:', error);
      return {
        success: false,
        error: 'Failed to fetch staff list',
      };
    }
  }

  /**
   * Get list of present staff for a specific date
   * 
   * API: GET /Director.asmx/Staff_list_p
   * Parameters: token, date (format: DD-MM-YYYY)
   * 
   * Returns array of present staff objects
   */
  async getPresentStaff(date: string = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })): Promise<ApiResponse<StaffAttendanceResponse>> {
    try {
      console.log('[STAFF-PRESENT] Fetching present staff for date:', date);
      const endpoint = `${API_ENDPOINTS.STAFF_PRESENT_LIST}?date=${date}`;
      console.log('[STAFF-PRESENT] Endpoint:', endpoint);
      const response = await httpClient.get<StaffAttendanceResponse>(endpoint);
      console.log('[STAFF-PRESENT] Response:', response);
      return response;
    } catch (error) {
      console.error('[STAFF-PRESENT] Exception:', error);
      return {
        success: false,
        error: 'Failed to fetch present staff',
      };
    }
  }

  /**
   * Get list of absent staff for a specific date
   * 
   * API: GET /Director.asmx/Staff_list_a
   * Parameters: token, date (format: DD-MM-YYYY)
   * 
   * Returns array of absent staff objects
   */
  async getAbsentStaff(date: string = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })): Promise<ApiResponse<StaffAttendanceResponse>> {
    try {
      const response = await httpClient.get<StaffAttendanceResponse>(
        `${API_ENDPOINTS.STAFF_ABSENT_LIST}?date=${date}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch absent staff list',
      };
    }
  }

  /**
   * Get staff attendance for a specific date (both present and absent)
   * Combines results from both endpoints
   */
  async getStaffAttendanceForDate(date: string): Promise<ApiResponse<{
    present: StaffAttendanceResponse;
    absent: StaffAttendanceResponse;
  }>> {
    try {
      const [presentResponse, absentResponse] = await Promise.all([
        this.getPresentStaff(date),
        this.getAbsentStaff(date),
      ]);

      if (!presentResponse.success || !absentResponse.success) {
        return {
          success: false,
          error: 'Failed to fetch attendance data',
        };
      }

      return {
        success: true,
        data: {
          present: presentResponse.data || [],
          absent: absentResponse.data || [],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch staff attendance',
      };
    }
  }

  /**
   * Get staff photo/profile picture
   * 
   * API: GET /Director.asmx/get_Employee_photo
   * Parameters: studentid (actually employee/staff id), tokan (note: typo in original API)
   * 
   * Returns array with photo URL in SessionId field
   */
  async getStaffPhoto(employeeId: string): Promise<ApiResponse<PhotoListResponse>> {
    try {
      if (!employeeId) {
        return {
          success: false,
          error: 'Employee ID is required',
        };
      }

      const response = await httpClient.get<PhotoListResponse>(
        `${API_ENDPOINTS.STAFF_PHOTO}?studentid=${employeeId}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch staff photo',
      };
    }
  }

  /**
   * Search staff by name or employee ID
   * Client-side filtering from full list
   */
  searchStaff(staff: StaffListItem[], query: string): StaffListItem[] {
    if (!query || query.trim().length < 2) {
      return staff;
    }

    const lowerQuery = query.toLowerCase();
    return staff.filter((member: StaffListItem) =>
      member.FirstName?.toLowerCase().includes(lowerQuery) ||
      member.LastName?.toLowerCase().includes(lowerQuery) ||
      member.MiddleName?.toLowerCase().includes(lowerQuery) ||
      member.EmployeeID?.toLowerCase().includes(lowerQuery) ||
      member.Phone?.includes(query)
    );
  }

  /**
   * @deprecated Use searchStaff(staff, query) instead - this async version is for API fallback
   * Search staff by name or employee ID
   * Client-side filtering from full list
   */
  async _searchStaffAsync(query: string): Promise<ApiResponse<StaffListResponse>> {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: false,
          error: 'Search query must be at least 2 characters',
        };
      }

      const response = await this.getStaffList();
      
      if (!response.success || !response.data) {
        return response;
      }

      const lowerQuery = query.toLowerCase();
      const filtered = response.data.filter((staff: StaffListItem) =>
        staff.FirstName.toLowerCase().includes(lowerQuery) ||
        staff.LastName.toLowerCase().includes(lowerQuery) ||
        staff.EmployeeId.toLowerCase().includes(lowerQuery) ||
        staff.JobTitle.toLowerCase().includes(lowerQuery)
      );

      return {
        success: true,
        data: filtered,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search staff',
      };
    }
  }

  /**
   * Get staff by category (teaching/non-teaching)
   * Client-side filtering from full list
   */
  async getStaffByCategory(category: 'TEACHING STAFF' | 'Non Teaching Staff'): Promise<ApiResponse<StaffListResponse>> {
    try {
      const response = await this.getStaffList();
      
      if (!response.success || !response.data) {
        return response;
      }

      const filtered = response.data.filter((staff: StaffListItem) =>
        staff.EmployeeCategoryName === category
      );

      return {
        success: true,
        data: filtered,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch staff by category',
      };
    }
  }

  /**
   * Format staff name from parts
   */
  formatStaffName(staff: StaffListItem): string {
    const parts = [staff.FirstName, staff.MiddleName, staff.LastName]
      .filter(Boolean);
    return parts.join(' ');
  }

  /**
   * Get staff photo URL
   */
  getStaffPhotoUrl(photoResponse: PhotoListResponse): string | null {
    if (photoResponse && photoResponse.length > 0 && photoResponse[0].SessionId) {
      return photoResponse[0].SessionId;
    }
    return null;
  }

  /**
   * Format date to DD-MM-YYYY format required by API
   */
  formatDateForApi(date: Date = new Date()): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}

export const staffService = new StaffService();
