export type UserRole = 'director' | 'accountant' | 'principal' | 'teacher' | 'clerk' | 'auditor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar?: string;
  session: string;
}

export interface Student {
  id: string;
  enrollmentNo: string;
  name: string;
  class: string;
  section: string;
  rollNo: number;
  dob: string;
  gender: 'male' | 'female';
  religion: string;
  admissionDate: string;
  joiningDate: string;
  status: 'active' | 'new' | 'tc' | 'dropout';
  aadharCard: string;
  house: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  communicationNo: string;
  avatar?: string;
}

export interface Staff {
  id: string;
  staffId: string;
  name: string;
  role: string;
  category: 'teaching' | 'non-teaching' | 'admin';
  department: string;
  designation: string;
  joiningDate: string;
  dob: string;
  religion: string;
  bloodGroup: string;
  nationality: string;
  maritalStatus: string;
  appointmentType: string;
  accountType: string;
  email: string;
  phone: string;
  aadharNo: string;
  panNo: string;
  permanentAddress: string;
  presentAddress: string;
  avatar?: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId?: string;
  staffId?: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'holiday';
  inTime?: string;
  outTime?: string;
  lateArrival?: number;
  earlyDeparture?: number;
  remarks?: string;
}

export interface FeeStructure {
  class: string;
  feeHeads: FeeHead[];
  totalAmount: number;
}

export interface FeeHead {
  name: string;
  amount: number;
  installments: Installment[];
}

export interface Installment {
  month: string;
  dueAmount: number;
  dueDate: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  receiptNo: string;
  amount: number;
  paymentMode: 'cash' | 'cheque' | 'bank' | 'online';
  paymentDate: string;
  month: string;
  feeHeads: { name: string; amount: number }[];
  collectedBy: string;
  status: 'paid' | 'pending' | 'overdue';
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
  deleteReason?: string;
}

export interface StudentFeeDetails {
  studentId: string;
  totalDue: number;
  totalPaid: number;
  balance: number;
  payments: FeePayment[];
  installments: {
    month: string;
    due: number;
    paid: number;
    balance: number;
    status: 'paid' | 'pending' | 'overdue';
  }[];
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  month: string;
  year: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  paymentDate?: string;
  status: 'pending' | 'paid';
}

export interface DeletedReceipt {
  id: string;
  studentName: string;
  deletedAmount: number;
  deletionDate: string;
  deletedBy: string;
  receiptNumber: string;
  deletionType: string;
}

export interface FeeCollectionLog {
  date: string;
  dayOfWeek: string;
  feeReceiptsIssued: number;
  deletedFeeReceipts: number;
  totalFeeCollection: number;
  totalFeeDiscount: number;
  newFormSellCount: number;
  newAdmissionCount: number;
  smsSentCount: number;
}

export interface ClassWiseStudents {
  class: string;
  sectionA: number;
  sectionB: number;
  sectionC: number;
  total: number;
}

export interface MonthlyCollection {
  month: string;
  income: number;
  expense: number;
  fee: number;
}

export interface AdmissionByClass {
  class: string;
  count: number;
  percentage: number;
}

export interface WorkingLogActivity {
  id: string;
  date: string;
  time: string;
  type: 'collection' | 'admission' | 'deletion' | 'edit' | 'attendance';
  description: string;
  actor: string;
  amount?: number;
}

export interface StaffAttendanceDetailed {
  serialNumber: number;
  employeeName: string;
  designation: string;
  employeeId: string;
  status: 'present' | 'absent';
  inTime?: string;
  outTime?: string;
  lateArrival?: number;
  delay?: number;
  category: string;
}

export interface DashboardStats {
  students: {
    total: number;
    active: number;
    new: number;
    male: number;
    female: number;
    dropout: number;
    tc: number;
  };
  staff: {
    total: number;
    active: number;
    new: number;
    left: number;
    teaching: number;
    nonTeaching: number;
  };
  attendance: {
    studentPresent: number;
    studentAbsent: number;
    studentHalfDay: number;
    studentLeave: number;
    studentNotMarked: number;
    staffPresent: number;
    staffAbsent: number;
    staffLeave: number;
  };
  fees: {
    expected: number;
    received: number;
    balance: number;
    concession: number;
    todayCollection: number;
  };
  communication: {
    smsToday: number;
    smsWeek: number;
    smsMonth: number;
    internalToday: number;
    internalWeek: number;
    internalMonth: number;
  };
  birthday: {
    studentsToday: number;
    staffToday: number;
  };
  assignments: {
    homework: number;
    classwork: number;
    activities: number;
  };
}
