/**
 * API Index
 * Central export point for all API services
 */

export * from './config';
export * from './httpClient';
export * from './types';

// Services
export { dashboardService } from './services/dashboard';
export { studentService } from './services/students';
export { staffService } from './services/staff';

// Initialization logging
console.log(`
╔════════════════════════════════════════╗
║      API MODULE INITIALIZATION        ║
╚════════════════════════════════════════╝
`);
console.log('[API-INIT] Base URL: https://rrmpssecureapp.relevantschoolapp.com');
console.log('[API-INIT] Services Loaded: Dashboard, Students, Staff');
console.log('[API-INIT] All requests will be logged with full details');
console.log(`───────────────────────────────────────────────────────────────\n`);

/**
 * Usage Examples:
 * 
 * ===== Dashboard =====
 * import { dashboardService } from '@/api';
 * 
 * const response = await dashboardService.getDashboard();
 * if (response.success) {
 *   const parsed = dashboardService.parseDashboardResponse(response.data);
 *   console.log(parsed.students.total);
 * }
 * 
 * ===== Students =====
 * import { studentService } from '@/api';
 * 
 * // Get all students
 * const allStudents = await studentService.getStudentsList();
 * 
 * // Get student by ID
 * const student = await studentService.getStudentDetail('S001576');
 * 
 * // Get student photo
 * const photo = await studentService.getStudentPhoto('S001576');
 * if (photo.success && photo.data) {
 *   const photoUrl = studentService.getStudentPhotoUrl(photo.data);
 * }
 * 
 * // Search students
 * const results = await studentService.searchStudents('ANAYA');
 * 
 * // Get students by class
 * const classStudents = await studentService.getStudentsByClass('LKG');
 * 
 * ===== Staff =====
 * import { staffService } from '@/api';
 * 
 * // Get all staff
 * const allStaff = await staffService.getStaffList();
 * 
 * // Get present staff for today
 * const present = await staffService.getPresentStaff();
 * 
 * // Get absent staff for today
 * const absent = await staffService.getAbsentStaff();
 * 
 * // Get attendance for specific date
 * const attendance = await staffService.getStaffAttendanceForDate('11-12-2025');
 * 
 * // Search staff
 * const results = await staffService.searchStaff('RAMESH');
 * 
 * // Get staff photo
 * const photo = await staffService.getStaffPhoto('E00001');
 * if (photo.success && photo.data) {
 *   const photoUrl = staffService.getStaffPhotoUrl(photo.data);
 * }
 */
