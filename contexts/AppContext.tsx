import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Student, Staff, DashboardStats } from '@/types';
import { currentUser as mockUser, students as mockStudents, staff as mockStaff, dashboardStats as mockStats, schoolInfo as mockSchoolInfo } from '@/mocks/data';

export const [AppProvider, useApp] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>('2025-2026');
  const schoolInfo = useMemo(() => mockSchoolInfo, []);

  const login = useCallback((username: string, password: string, role: string): boolean => {
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setStudents(mockStudents);
    setStaff(mockStaff);
    setDashboardStats(mockStats);
  }, []);

  const getStudentById = useCallback((id: string): Student | undefined => {
    return students.find(s => s.id === id);
  }, [students]);

  const getStaffById = useCallback((id: string): Staff | undefined => {
    return staff.find(s => s.id === id);
  }, [staff]);

  const searchStudents = useCallback((query: string): Student[] => {
    const lowerQuery = query.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.enrollmentNo.includes(lowerQuery) ||
      s.fatherPhone.includes(query) ||
      s.motherPhone.includes(query)
    );
  }, [students]);

  const searchStaff = useCallback((query: string): Staff[] => {
    const lowerQuery = query.toLowerCase();
    return staff.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.phone.includes(query) ||
      s.staffId.includes(query)
    );
  }, [staff]);

  return useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    students,
    staff,
    dashboardStats,
    selectedSession,
    setSelectedSession,
    schoolInfo,
    getStudentById,
    getStaffById,
    searchStudents,
    searchStaff,
  }), [user, isAuthenticated, login, logout, students, staff, dashboardStats, selectedSession, schoolInfo, getStudentById, getStaffById, searchStudents, searchStaff]);
});
