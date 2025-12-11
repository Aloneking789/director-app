/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// Base URL for the backend API
export const API_BASE_URL = 'https://rrmpssecureapp.relevantschoolapp.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/Director.asmx/Dire_Dashboard',
  
  // Students
  STUDENTS_LIST: '/Director.asmx/Students1819_Sr_register',
  STUDENT_DETAIL: '/Director.asmx/VA_Student_detail_by_stuid',
  STUDENT_PHOTO: '/Director.asmx/get_Student_photo',
  
  // Staff
  STAFF_LIST: '/Director.asmx/Staff_list',
  STAFF_PRESENT_LIST: '/Director.asmx/Staff_list_p',
  STAFF_ABSENT_LIST: '/Director.asmx/Staff_list_a',
  STAFF_PHOTO: '/Director.asmx/get_Employee_photo',
} as const;

/**
 * Token Convention:
 * This is a placeholder token structure that will be replaced after proper authentication
 * is implemented on the backend.
 * 
 * Current Format: 'RANDOM_TOKEN_' + timestamp
 * Future Format: Will be determined after backend authentication implementation
 */
export const TOKEN_CONVENTION = {
  PREFIX: 'DIRECTOR_APP_',
  VERSION: '1.0',
  PLACEHOLDER: true, // Set to false after real auth is implemented
} as const;

/**
 * Generate placeholder token for now
 * C# backend expects: simple token or numeric session ID
 * Replace this after backend authentication is implemented
 */
export function generatePlaceholderToken(): string {
  // For C# backend, use simple format: just session ID
  const token = '1023';
  console.log(`[TOKEN-GENERATE] Token: ${token}`);
  return token;
}

/**
 * Get stored token from storage
 * For now, returns a simple token
 * After implementation, this will retrieve from AsyncStorage
 */
export function getStoredToken(): string {
  const token = generatePlaceholderToken();
  console.log(`[TOKEN-RETRIEVED] Token: ${token}`);
  return token;
}

/**
 * Session configuration
 */
export const SESSION_CONFIG = {
  DEFAULT_SESSION: '1023',
  SESSION_ID: '1023', // Placeholder session ID from API responses
} as const;
