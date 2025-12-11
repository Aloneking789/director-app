/**
 * Students API Service
 * Handles all student-related API calls
 */

import { httpClient, ApiResponse } from '../httpClient';
import { API_ENDPOINTS, SESSION_CONFIG } from '../config';
import { StudentListResponse, StudentDetailResponse, StudentListItem, StudentDetail, PhotoListResponse } from '../types';

class StudentService {
  /**
   * Get list of all students
   * 
   * API: GET /Director.asmx/Students1819_Sr_register
   * Parameters: session, token (token added automatically)
   * 
   * Returns array of student objects
   */
  async getStudentsList(): Promise<ApiResponse<StudentListResponse>> {
    try {
      console.log('[STUDENTS] Fetching students list...');
      // C# backend: use 'sessionid' instead of 'session'
      const endpoint = `${API_ENDPOINTS.STUDENTS_LIST}?sessionid=${SESSION_CONFIG.DEFAULT_SESSION}`;
      console.log('[STUDENTS] Endpoint:', endpoint);
      const response = await httpClient.get<StudentListResponse>(endpoint);
      console.log('[STUDENTS] Response status:', response.success);
      console.log('[STUDENTS] Response data length:', response.data?.length || 0);
      console.log('[STUDENTS] Full response:', response);
      return response;
    } catch (error) {
      console.error('[STUDENTS] Exception:', error);
      return {
        success: false,
        error: 'Failed to fetch students list',
      };
    }
  }

  /**
   * Get student by their student ID (stdid)
   * 
   * API: GET /Director.asmx/VA_Student_detail_by_stuid
   * Parameters: studentid, token (token added automatically)
   * 
   * Returns array with single student detail object
   */
  async getStudentDetail(studentId: string): Promise<ApiResponse<StudentDetailResponse>> {
    try {
      if (!studentId) {
        console.warn('[STUDENTS-DETAIL] No studentId provided');
        return {
          success: false,
          error: 'Student ID is required',
        };
      }

      console.log('[STUDENTS-DETAIL] Fetching student:', studentId);
      const endpoint = `${API_ENDPOINTS.STUDENT_DETAIL}?studentid=${studentId}`;
      console.log('[STUDENTS-DETAIL] Endpoint:', endpoint);
      const response = await httpClient.get<StudentDetailResponse>(endpoint);
      console.log('[STUDENTS-DETAIL] Response:', response);
      return response;
    } catch (error) {
      console.error('[STUDENTS-DETAIL] Exception:', error);
      return {
        success: false,
        error: 'Failed to fetch student details',
      };
    }
  }

  /**
   * Get student photo/profile picture
   * 
   * API: GET /Director.asmx/get_Student_photo
   * Parameters: studentid, tokan (note: typo in original API - "tokan")
   * 
   * Returns array with photo URL in SessionId field
   */
  async getStudentPhoto(studentId: string): Promise<ApiResponse<PhotoListResponse>> {
    try {
      if (!studentId) {
        return {
          success: false,
          error: 'Student ID is required',
        };
      }

      const response = await httpClient.get<PhotoListResponse>(
        `${API_ENDPOINTS.STUDENT_PHOTO}?studentid=${studentId}`
      );
      return response;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch student photo',
      };
    }
  }

  /**
   * Search students by name
   * Client-side filtering from full list
   */
  searchStudents(students: StudentListItem[], query: string): StudentListItem[] {
    if (!query || query.trim().length < 2) {
      return students;
    }

    const lowerQuery = query.toLowerCase();
    return students.filter((student: StudentListItem) =>
      student.FirstName?.toLowerCase().includes(lowerQuery) ||
      student.LastName?.toLowerCase().includes(lowerQuery) ||
      student.father?.toLowerCase().includes(lowerQuery) ||
      student.mother?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * @deprecated Use searchStudents(students, query) instead - this async version is for API fallback
   * Search students by name
   * Client-side filtering from full list
   */
  async _searchStudentsAsync(query: string): Promise<ApiResponse<StudentListResponse>> {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: false,
          error: 'Search query must be at least 2 characters',
        };
      }

      const response = await this.getStudentsList();
      
      if (!response.success || !response.data) {
        return response;
      }

      const lowerQuery = query.toLowerCase();
      const filtered = response.data.filter((student: StudentListItem) =>
        student.FirstName.toLowerCase().includes(lowerQuery) ||
        student.father.toLowerCase().includes(lowerQuery) ||
        student.mother.toLowerCase().includes(lowerQuery)
      );

      return {
        success: true,
        data: filtered,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search students',
      };
    }
  }

  /**
   * Get students by class
   * Client-side filtering from full list
   */
  async getStudentsByClass(className: string): Promise<ApiResponse<StudentListResponse>> {
    try {
      if (!className) {
        return {
          success: false,
          error: 'Class name is required',
        };
      }

      const response = await this.getStudentsList();
      
      if (!response.success || !response.data) {
        return response;
      }

      const filtered = response.data.filter((student: StudentListItem) =>
        student.cls === className
      );

      return {
        success: true,
        data: filtered,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch students by class',
      };
    }
  }

  /**
   * Format student name from parts
   */
  formatStudentName(student: StudentListItem): string {
    const parts = [student.FirstName, student.MidName, student.LastName]
      .filter(Boolean);
    return parts.join(' ');
  }

  /**
   * Get student photo URL
   */
  getStudentPhotoUrl(photoResponse: PhotoListResponse): string | null {
    if (photoResponse && photoResponse.length > 0 && photoResponse[0].SessionId) {
      return photoResponse[0].SessionId;
    }
    return null;
  }
}

export const studentService = new StudentService();
