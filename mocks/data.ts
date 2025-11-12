import type { Student, Staff, DashboardStats, AttendanceRecord, StudentFeeDetails, PayrollRecord } from '@/types';
import { classColors } from '@/constants/colors';

export const currentUser = {
  id: '1',
  name: 'Sandeep Kumar Srivastava',
  role: 'director' as const,
  email: 'director@rlacademy.com',
  phone: '9876543210',
  session: '2025-2026',
};

export const schoolInfo = {
  name: 'R.L. Academy Sr. Sec. School',
  location: 'Salempur, Deoria, Uttar Pradesh',
  session: '2025-2026',
};

const generateStudents = (): Student[] => {
  const students: Student[] = [];
  const classes = ['NURSERY', 'L.K.G', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const sections = ['A', 'B', 'C'];
  const firstNames = ['Aadarsh', 'Aadavik', 'Aadil', 'Abhishek', 'Ajay', 'Akaram', 'Akash', 'Akhilesh', 'Amit', 'Ankit', 'Priya', 'Pooja', 'Neha', 'Riya', 'Simran'];
  const lastNames = ['Kumar', 'Mishra', 'Singh', 'Yadav', 'Pathak', 'Dubey', 'Ansari', 'Khan', 'Ali', 'Kushwaha'];
  
  let enrollmentCounter = 5770;
  
  for (let i = 0; i < 250; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const classIndex = Math.floor(Math.random() * classes.length);
    const section = sections[Math.floor(Math.random() * sections.length)];
    const gender = Math.random() > 0.5 ? 'male' as const : 'female' as const;
    
    const statuses: ('active' | 'new' | 'tc' | 'dropout')[] = ['active', 'active', 'active', 'active', 'new', 'dropout'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    students.push({
      id: `student-${i + 1}`,
      enrollmentNo: `${enrollmentCounter++}`,
      name: `${firstName} ${lastName}`,
      class: classes[classIndex],
      section,
      rollNo: Math.floor(Math.random() * 50) + 1,
      dob: `${Math.floor(Math.random() * 28) + 1}-0${Math.floor(Math.random() * 9) + 1}-${2010 + Math.floor(Math.random() * 12)}`,
      gender,
      religion: Math.random() > 0.5 ? 'Hindu' : 'Muslim',
      admissionDate: '01 Apr 2025',
      joiningDate: '01 Apr 2025',
      status,
      aadharCard: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
      house: ['Red', 'Blue', 'Green', 'Yellow'][Math.floor(Math.random() * 4)],
      fatherName: `${['Dharmendra', 'Kaushlesh', 'Sarvare', 'Shahzad', 'Mohammad'][Math.floor(Math.random() * 5)]} ${lastName}`,
      fatherPhone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      motherName: `${['Pratibha', 'Pooja', 'Shama', 'Mehrun', 'Nikhat'][Math.floor(Math.random() * 5)]} Devi`,
      motherPhone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      communicationNo: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    });
  }
  
  return students;
};

const generateStaff = (): Staff[] => {
  const staff: Staff[] = [];
  const names = ['Abhishek Pathak', 'Ajay Yadav', 'Akaram Ali', 'Akash', 'Akhilesh Kushwaha', 'Amit Kumar Mishra'];
  const designations = ['TGT', 'PGT', 'PRT', 'Principal', 'Vice Principal'];
  
  for (let i = 0; i < 80; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const designation = designations[Math.floor(Math.random() * designations.length)];
    const category = designation === 'Principal' || designation === 'Vice Principal' ? 'admin' as const : 'teaching' as const;
    
    staff.push({
      id: `staff-${i + 1}`,
      staffId: `${1000 + i}`,
      name,
      role: designation,
      category,
      department: 'TEACHING',
      designation,
      joiningDate: `01-04-2020`,
      dob: `09-10-1990`,
      religion: 'Hindu',
      bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
      nationality: 'INDIAN',
      maritalStatus: ['Married', 'Single'][Math.floor(Math.random() * 2)],
      appointmentType: 'PERMANENT',
      accountType: 'RL ACADEMY',
      email: `staff${i + 1}@rlacademy.com`,
      phone: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      aadharNo: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
      panNo: `ABCDE${Math.floor(Math.random() * 9000) + 1000}F`,
      permanentAddress: 'Salempur, Deoria, UP',
      presentAddress: 'Salempur, Deoria, UP',
      isActive: Math.random() > 0.1,
    });
  }
  
  return staff;
};

export const students = generateStudents();
export const staff = generateStaff();

export const dashboardStats: DashboardStats = {
  students: {
    total: 2351,
    active: 2351,
    new: 422,
    male: 1354,
    female: 997,
    dropout: 13,
    tc: 0,
  },
  staff: {
    total: 80,
    active: 80,
    new: 0,
    left: 0,
    teaching: 42,
    nonTeaching: 38,
  },
  attendance: {
    studentPresent: 1754,
    studentAbsent: 272,
    studentHalfDay: 0,
    studentLeave: 33,
    studentNotMarked: 292,
    staffPresent: 75,
    staffAbsent: 3,
    staffLeave: 2,
  },
  fees: {
    expected: 43146000,
    received: 9549650,
    balance: 33596350,
    concession: 0,
    todayCollection: 34400,
  },
  communication: {
    smsToday: 0,
    smsWeek: 0,
    smsMonth: 0,
    internalToday: 0,
    internalWeek: 2,
    internalMonth: 2,
  },
  birthday: {
    studentsToday: 5,
    staffToday: 0,
  },
  assignments: {
    homework: 3,
    classwork: 0,
    activities: 0,
  },
};

export const classFeeData = [
  { class: 'NURSERY', paid: 2000, excess: 0, late: 0, color: classColors[0] },
  { class: 'L.K.G', paid: 3000, excess: 0, late: 0, color: classColors[1] },
  { class: 'I', paid: 2000, excess: 0, late: 0, color: classColors[2] },
  { class: 'II', paid: 1000, excess: 0, late: 0, color: classColors[3] },
  { class: 'III', paid: 3400, excess: 0, late: 0, color: classColors[4] },
  { class: 'IV', paid: 3800, excess: 0, late: 0, color: classColors[5] },
  { class: 'V', paid: 2000, excess: 0, late: 0, color: classColors[6] },
  { class: 'VI', paid: 3200, excess: 0, late: 0, color: classColors[7] },
  { class: 'VII', paid: 3400, excess: 0, late: 0, color: classColors[8] },
  { class: 'VIII', paid: 6000, excess: 0, late: 0, color: classColors[9] },
  { class: 'IX', paid: 4600, excess: 0, late: 0, color: classColors[10] },
  { class: 'X', paid: 6000, excess: 0, late: 0, color: classColors[11] },
];

export const attendanceData = generateAttendanceData();

function generateAttendanceData(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  students.slice(0, 100).forEach(student => {
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const statuses: ('present' | 'absent' | 'half-day' | 'leave' | 'holiday')[] = 
        ['present', 'present', 'present', 'present', 'present', 'absent', 'half-day'];
      
      records.push({
        id: `att-${student.id}-${i}`,
        studentId: student.id,
        date: date.toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
  });
  
  return records;
}

export const studentFeeDetails: Record<string, StudentFeeDetails> = {};
students.forEach((student, index) => {
  const totalDue = 19600;
  const totalPaid = index % 5 === 0 ? 0 : Math.floor(Math.random() * 5000);
  
  studentFeeDetails[student.id] = {
    studentId: student.id,
    totalDue,
    totalPaid,
    balance: totalDue - totalPaid,
    payments: [],
    installments: [
      { month: 'AUG', due: 11500, paid: 0, balance: 11500, status: 'pending' },
      { month: 'SEP', due: 1400, paid: 0, balance: 1400, status: 'pending' },
      { month: 'OCT', due: 1000, paid: 0, balance: 1000, status: 'pending' },
      { month: 'NOV', due: 1000, paid: 0, balance: 1000, status: 'pending' },
      { month: 'DEC', due: 1300, paid: 0, balance: 1300, status: 'pending' },
    ],
  };
});

export const staffPayroll: Record<string, PayrollRecord[]> = {};
staff.forEach(s => {
  staffPayroll[s.id] = [
    { id: `pay-1`, staffId: s.id, month: 'April', year: 2025, grossPay: 0, deductions: 0, netPay: 0, status: 'pending' },
    { id: `pay-2`, staffId: s.id, month: 'May', year: 2025, grossPay: 0, deductions: 0, netPay: 0, status: 'pending' },
    { id: `pay-3`, staffId: s.id, month: 'June', year: 2025, grossPay: 0, deductions: 0, netPay: 0, status: 'pending' },
  ];
});
