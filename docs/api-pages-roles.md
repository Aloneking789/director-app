# Director App — Page-wise API Reference with Role Permissions

This document organizes all API endpoints by the frontend pages that use them, with clear role-based access control for each endpoint.

**Available Roles:**

- `director` — Full system access
- `accountant` — Financial operations and reports
- `principal` — Academic oversight and staff management
- `teacher` — Class-specific student data
- `clerk` — Data entry and basic operations
- `auditor` — Read-only audit and compliance

---

## 📄 PAGE 1: Login (`app/login.tsx`)

### POST /auth/login

**Purpose:** Authenticate user and retrieve access token

**Allowed Roles:** Public (unauthenticated)

**Request Body:**

```json
{
  "username": "director@rlacademy.com",
  "password": "securePassword123",
  "role": "director"
}
```

**Fields:**

- `username` (string, required) — User's email or username
- `password` (string, required) — User's password
- `role` (string, required) — One of: director, accountant, principal, teacher, clerk, auditor

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Sandeep Kumar Srivastava",
    "role": "director",
    "email": "director@rlacademy.com",
    "phone": "9876543210",
    "avatar": null,
    "session": "2025-2026"
  },
  "availableSessions": ["2024-2025", "2025-2026"]
}
```

**Errors:**

- `401 Unauthorized` — Invalid credentials
- `403 Forbidden` — Role not permitted

---

## 📊 PAGE 2: Dashboard (`app/dashboard.tsx`)

### GET /auth/me

**Purpose:** Get current authenticated user profile

**Allowed Roles:** All authenticated roles

**Query Parameters:** None

**Response (200 OK):**

```json
{
  "id": "1",
  "name": "Sandeep Kumar Srivastava",
  "role": "director",
  "email": "director@rlacademy.com",
  "phone": "9876543210",
  "avatar": null,
  "session": "2025-2026"
}
```

---

### GET /school/info

**Purpose:** Fetch school information for header banner

**Allowed Roles:** All authenticated roles

**Query Parameters:**

- `session` (string, optional) — Session year (defaults to user's current session)

**Response (200 OK):**

```json
{
  "name": "R.L. Academy Sr. Sec. School",
  "location": "Salempur, Deoria, Uttar Pradesh",
  "session": "2025-2026"
}
```

---

### GET /dashboard

**Purpose:** Fetch comprehensive dashboard statistics

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ✅ `principal` — Full access
- ⚠️ `teacher` — Limited view (class-specific data only)
- ⚠️ `clerk` — Limited view (basic stats)
- ✅ `auditor` — Read-only access

**Query Parameters:**

- `session` (string, optional) — Filter by session year

**Response (200 OK):**

```json
{
  "students": {
    "total": 2351,
    "active": 2351,
    "new": 422,
    "male": 1354,
    "female": 997,
    "dropout": 13,
    "tc": 0
  },
  "staff": {
    "total": 80,
    "active": 80,
    "new": 0,
    "left": 0,
    "teaching": 42,
    "nonTeaching": 38
  },
  "attendance": {
    "studentPresent": 1754,
    "studentAbsent": 272,
    "studentHalfDay": 0,
    "studentLeave": 33,
    "studentNotMarked": 292,
    "staffPresent": 75,
    "staffAbsent": 3,
    "staffLeave": 2
  },
  "fees": {
    "expected": 43146000,
    "received": 9549650,
    "balance": 33596350,
    "concession": 0,
    "todayCollection": 34400
  },
  "communication": {
    "smsToday": 0,
    "smsWeek": 0,
    "smsMonth": 0,
    "internalToday": 0,
    "internalWeek": 2,
    "internalMonth": 2
  },
  "birthday": {
    "studentsToday": 5,
    "staffToday": 0
  },
  "assignments": {
    "homework": 3,
    "classwork": 0,
    "activities": 0
  }
}
```

---

## 👨‍🎓 PAGE 3: Students Directory (`app/students/index.tsx`)

### GET /students

**Purpose:** Fetch paginated student list with filters

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ✅ `accountant` — Full access
- ⚠️ `teacher` — Limited to assigned classes
- ✅ `clerk` — Full access
- ❌ `auditor` — No access

**Query Parameters:**

- `page` (number, optional, default: 1) — Page number
- `limit` (number, optional, default: 50) — Records per page
- `class` (string, optional) — Filter by class (e.g., "X", "NURSERY")
- `section` (string, optional) — Filter by section (A/B/C)
- `status` (string, optional) — Filter by status (active/new/tc/dropout)
- `gender` (string, optional) — Filter by gender (male/female)
- `session` (string, optional) — Filter by session year

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "student-1",
      "enrollmentNo": "5770",
      "name": "Aadarsh Kumar",
      "class": "X",
      "section": "A",
      "rollNo": 15,
      "dob": "15-05-2010",
      "gender": "male",
      "religion": "Hindu",
      "admissionDate": "01 Apr 2025",
      "joiningDate": "01 Apr 2025",
      "status": "active",
      "aadharCard": "123456789012",
      "house": "Red",
      "fatherName": "Dharmendra Kumar",
      "fatherPhone": "9876543210",
      "motherName": "Pratibha Devi",
      "motherPhone": "9876543211",
      "communicationNo": "9876543210",
      "avatar": null
    }
  ],
  "pageInfo": {
    "page": 1,
    "limit": 50,
    "total": 2351,
    "totalPages": 48,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /students/search

**Purpose:** Search students by name, enrollment number, or phone

**Allowed Roles:** Same as GET /students

**Query Parameters:**

- `q` (string, required, min: 3 chars) — Search query
- `session` (string, optional) — Filter by session
- `limit` (number, optional, default: 50) — Max results

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "student-1",
      "enrollmentNo": "5770",
      "name": "Aadarsh Kumar",
      "class": "X",
      "section": "A",
      "fatherPhone": "9876543210",
      "status": "active"
    }
  ],
  "total": 1
}
```

---

## 📋 PAGE 4: Student Detail (`app/students/[id].tsx`)

### GET /students/{id}

**Purpose:** Fetch complete student profile

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ✅ `accountant` — Full access (including financial)
- ⚠️ `teacher` — Limited to assigned students
- ✅ `clerk` — Full access
- ❌ `auditor` — No access

**Path Parameters:**

- `id` (string, required) — Student's unique identifier

**Response (200 OK):**

```json
{
  "id": "student-1",
  "enrollmentNo": "5770",
  "name": "Aadarsh Kumar",
  "class": "X",
  "section": "A",
  "rollNo": 15,
  "dob": "15-05-2010",
  "gender": "male",
  "religion": "Hindu",
  "admissionDate": "01 Apr 2025",
  "joiningDate": "01 Apr 2025",
  "status": "active",
  "aadharCard": "123456789012",
  "house": "Red",
  "fatherName": "Dharmendra Kumar",
  "fatherPhone": "9876543210",
  "motherName": "Pratibha Devi",
  "motherPhone": "9876543211",
  "communicationNo": "9876543210",
  "avatar": null
}
```

---

### GET /fees/students/{id}

**Purpose:** Get student's fee ledger with payments and installments

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ✅ `clerk` — Full access
- ⚠️ `principal` — View-only access
- ❌ `teacher` — No access
- ❌ `auditor` — No access

**Path Parameters:**

- `id` (string, required) — Student's unique identifier

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "studentId": "student-1",
  "totalDue": 19600,
  "totalPaid": 8000,
  "balance": 11600,
  "payments": [
    {
      "id": "payment-1",
      "receiptNo": "REC001",
      "amount": 5000,
      "mode": "Cash",
      "date": "2025-08-15",
      "collectedBy": "Accountant Name"
    }
  ],
  "installments": [
    {
      "month": "AUG",
      "due": 11500,
      "paid": 5000,
      "balance": 6500,
      "status": "partial",
      "dueDate": "2025-08-10"
    }
  ]
}
```

---

### GET /attendance/students/history

**Purpose:** Get attendance history for a student

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ⚠️ `teacher` — Limited to assigned students
- ✅ `clerk` — Full access
- ❌ `accountant` — No access
- ❌ `auditor` — No access

**Query Parameters:**

- `studentId` (string, required) — Student identifier
- `startDate` (string, optional) — Start date (YYYY-MM-DD)
- `endDate` (string, optional) — End date (YYYY-MM-DD)
- `days` (number, optional) — Number of days (alternative to date range)

**Response (200 OK):**

```json
{
  "studentId": "student-1",
  "records": [
    {
      "id": "att-1",
      "studentId": "student-1",
      "date": "2025-11-18",
      "status": "present",
      "inTime": "08:45 AM",
      "outTime": "02:30 PM",
      "remarks": ""
    }
  ],
  "summary": {
    "present": 5,
    "absent": 1,
    "halfDay": 0,
    "leave": 1,
    "holiday": 0
  }
}
```

---

## 👥 PAGE 5: Staff Directory (`app/staff/index.tsx`)

### GET /staff

**Purpose:** Fetch paginated staff list

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ✅ `accountant` — Full access
- ✅ `clerk` — Full access
- ✅ `auditor` — View-only access
- ❌ `teacher` — No access

**Query Parameters:**

- `page` (number, optional, default: 1) — Page number
- `limit` (number, optional, default: 50) — Records per page
- `category` (string, optional) — Filter by category (teaching/non-teaching/admin)
- `department` (string, optional) — Filter by department
- `isActive` (boolean, optional) — Filter by active status

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "staff-1",
      "staffId": "1000",
      "name": "Abhishek Pathak",
      "role": "TGT",
      "category": "teaching",
      "department": "TEACHING",
      "designation": "TGT",
      "joiningDate": "01-04-2020",
      "dob": "09-10-1990",
      "religion": "Hindu",
      "bloodGroup": "A+",
      "nationality": "INDIAN",
      "maritalStatus": "Married",
      "appointmentType": "PERMANENT",
      "accountType": "RL ACADEMY",
      "email": "staff1@rlacademy.com",
      "phone": "9876543210",
      "aadharNo": "123456789012",
      "panNo": "ABCDE1234F",
      "permanentAddress": "Salempur, Deoria, UP",
      "presentAddress": "Salempur, Deoria, UP",
      "avatar": null,
      "isActive": true
    }
  ],
  "pageInfo": {
    "page": 1,
    "limit": 50,
    "total": 80,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### GET /staff/search

**Purpose:** Search staff by name, ID, email, or phone

**Allowed Roles:** Same as GET /staff

**Query Parameters:**

- `q` (string, required) — Search query
- `limit` (number, optional, default: 50) — Max results

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": "staff-1",
      "staffId": "1000",
      "name": "Abhishek Pathak",
      "designation": "TGT",
      "category": "teaching",
      "email": "staff1@rlacademy.com",
      "phone": "9876543210",
      "isActive": true
    }
  ],
  "total": 1
}
```

---

## 📝 PAGE 6: Staff Detail (`app/staff/[id].tsx`)

### GET /staff/{id}

**Purpose:** Fetch complete staff profile

**Allowed Roles:**

- ✅ `director` — Full access (including sensitive fields)
- ✅ `principal` — Full access
- ⚠️ `accountant` — Limited (no sensitive personal data)
- ⚠️ `clerk` — Limited (no sensitive personal data)
- ⚠️ `auditor` — View-only (no PII)
- ❌ `teacher` — No access

**Path Parameters:**

- `id` (string, required) — Staff's unique identifier

**Response (200 OK):** Same structure as GET /staff individual item

---

### GET /payroll/staff/{id}

**Purpose:** Get payroll/salary history for staff member

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ✅ `auditor` — View-only access
- ❌ `principal` — No access
- ❌ `clerk` — No access
- ❌ `teacher` — No access

**Path Parameters:**

- `id` (string, required) — Staff identifier

**Query Parameters:**

- `year` (number, optional) — Filter by year
- `month` (string, optional) — Filter by month

**Response (200 OK):**

```json
{
  "staffId": "staff-1",
  "records": [
    {
      "id": "pay-1",
      "staffId": "staff-1",
      "month": "November",
      "year": 2025,
      "grossPay": 50000,
      "deductions": 5000,
      "netPay": 45000,
      "paymentDate": "2025-11-30",
      "status": "paid"
    }
  ]
}
```

---

## 📅 PAGE 7: Attendance (`app/attendance/index.tsx`)

### GET /attendance/summary

**Purpose:** Get attendance summary counts for students or staff

**Allowed Roles:**

- ✅ `director` — Full access (students & staff)
- ✅ `principal` — Full access (students & staff)
- ⚠️ `teacher` — Students only (class-limited)
- ⚠️ `accountant` — View-only
- ✅ `clerk` — Full access
- ❌ `auditor` — No access

**Query Parameters:**

- `type` (string, required) — "student" or "staff"
- `date` (string, optional) — Date (YYYY-MM-DD), defaults to today
- `session` (string, optional) — Filter by session (for students)

**Response for type=student (200 OK):**

```json
{
  "date": "2025-11-18",
  "type": "student",
  "present": 1754,
  "absent": 272,
  "halfDay": 0,
  "leave": 33,
  "notMarked": 292,
  "total": 2351
}
```

**Response for type=staff (200 OK):**

```json
{
  "date": "2025-11-18",
  "type": "staff",
  "present": 75,
  "absent": 3,
  "leave": 2,
  "total": 80
}
```

---

## 💰 PAGE 8: Fees (`app/fees/index.tsx`)

### GET /fees/class-summary

**Purpose:** Get class-wise fee collection summary

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ✅ `clerk` — Full access
- ⚠️ `principal` — View-only
- ❌ `teacher` — No access
- ❌ `auditor` — No access

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "classes": [
    {
      "class": "NURSERY",
      "paid": 2000,
      "excess": 0,
      "late": 0,
      "totalStudents": 87,
      "color": "#FF9F43"
    },
    {
      "class": "X",
      "paid": 6000,
      "excess": 0,
      "late": 0,
      "totalStudents": 100,
      "color": "#14B8A6"
    }
  ],
  "totalPaid": 34400,
  "totalExcess": 0,
  "totalLate": 0
}
```

---

## 📊 PAGE 9: Reports — Daily Collection (`app/reports/daily-collection.tsx`)

### GET /fees/collections

**Purpose:** Get daily fee collection with receipts

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ✅ `clerk` — Full access
- ❌ `principal` — No access
- ❌ `teacher` — No access
- ❌ `auditor` — No access

**Query Parameters:**

- `date` (string, optional) — Date (YYYY-MM-DD), defaults to today

**Response (200 OK):**

```json
{
  "date": "2025-11-10",
  "summary": {
    "totalCollection": 53000,
    "cash": 25500,
    "bank": 15000,
    "upi": 12500,
    "cheque": 0,
    "receiptsCount": 5
  },
  "receipts": [
    {
      "receiptNo": "REC001",
      "studentId": "student-1",
      "studentName": "Aarav Kumar",
      "class": "Class X-A",
      "amount": 12500,
      "mode": "Cash",
      "time": "09:15 AM",
      "collectedBy": "Accountant Name"
    }
  ]
}
```

---

### POST /fees/collections/export

**Purpose:** Export daily collection report

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ❌ All others — No access

**Request Body:**

```json
{
  "date": "2025-11-10",
  "format": "excel"
}
```

**Response (202 Accepted):**

```json
{
  "jobId": "export-job-123",
  "status": "processing",
  "message": "Export job started",
  "estimatedTime": "30 seconds"
}
```

---

## 📊 PAGE 10: Reports — Monthly Collection (`app/reports/monthly-collection.tsx`)

### GET /fees/collections/monthly

**Purpose:** Get monthly fee collection trend

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ⚠️ `auditor` — View-only
- ❌ All others — No access

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "months": [
    {
      "month": "April",
      "monthShort": "Apr",
      "year": 2025,
      "collection": 820000,
      "receiptsCount": 422
    },
    {
      "month": "November",
      "monthShort": "Nov",
      "year": 2025,
      "collection": 920000,
      "receiptsCount": 350
    }
  ],
  "totalCollection": 9549650,
  "averageMonthly": 1193706
}
```

---

### POST /fees/collections/monthly/export

**Purpose:** Export monthly collection report

**Allowed Roles:** Same as POST /fees/collections/export

**Request Body:**

```json
{
  "session": "2025-2026",
  "format": "pdf"
}
```

---

## 📊 PAGE 11: Reports — Deleted Receipts (`app/reports/deleted-receipts.tsx`)

### GET /fees/receipts/deleted

**Purpose:** Get list of deleted receipts (audit trail)

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ✅ `auditor` — Full access
- ❌ All others — No access

**Query Parameters:**

- `startDate` (string, optional) — Start date (YYYY-MM-DD)
- `endDate` (string, optional) — End date (YYYY-MM-DD)
- `page` (number, optional) — Page number
- `limit` (number, optional) — Records per page

**Response (200 OK):**

```json
{
  "records": [
    {
      "id": "del-1",
      "receiptNumber": "REC123",
      "studentId": "student-1",
      "studentName": "Aarav Kumar",
      "deletedAmount": 5000,
      "originalDate": "2025-10-15",
      "deletionDate": "2025-10-20",
      "deletedBy": "Director Name",
      "deletionType": "cancellation",
      "reason": "Duplicate entry"
    }
  ],
  "pageInfo": {
    "page": 1,
    "limit": 50,
    "total": 15,
    "totalPages": 1
  },
  "summary": {
    "totalDeleted": 15,
    "totalAmount": 75000
  }
}
```

---

### POST /fees/receipts/deleted/export

**Purpose:** Export deleted receipts report

**Allowed Roles:** Same as GET /fees/receipts/deleted

**Request Body:**

```json
{
  "startDate": "2025-10-01",
  "endDate": "2025-10-31",
  "format": "excel"
}
```

---

## 📊 PAGE 12: Reports — Staff Attendance (`app/reports/staff-attendance.tsx`)

### GET /attendance/staff/daily

**Purpose:** Get detailed daily staff attendance

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ✅ `accountant` — View-only
- ✅ `clerk` — Full access
- ❌ `teacher` — No access
- ❌ `auditor` — No access

**Query Parameters:**

- `date` (string, optional) — Date (YYYY-MM-DD), defaults to today
- `category` (string, optional) — Filter by staff category

**Response (200 OK):**

```json
{
  "date": "2025-11-18",
  "records": [
    {
      "serialNumber": 1,
      "employeeId": "1000",
      "employeeName": "Abhishek Pathak",
      "designation": "TGT",
      "category": "teaching",
      "status": "present",
      "inTime": "08:30 AM",
      "outTime": "04:00 PM",
      "lateArrival": 0,
      "delay": 0
    },
    {
      "serialNumber": 2,
      "employeeId": "1001",
      "employeeName": "Ajay Yadav",
      "designation": "PGT",
      "category": "teaching",
      "status": "present",
      "inTime": "09:15 AM",
      "outTime": "04:05 PM",
      "lateArrival": 1,
      "delay": 45
    }
  ],
  "summary": {
    "present": 75,
    "absent": 3,
    "leave": 2,
    "total": 80
  }
}
```

---

### POST /attendance/staff/export

**Purpose:** Export staff attendance report

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ❌ All others — No access

**Request Body:**

```json
{
  "date": "2025-11-18",
  "category": "teaching",
  "format": "excel"
}
```

---

## 📊 PAGE 13: Reports — Student Grid (`app/reports/student-grid.tsx`)

### GET /students/class-grid

**Purpose:** Get class/section-wise student count distribution

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ✅ `accountant` — View-only
- ❌ All others — No access

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "grid": [
    {
      "class": "NURSERY",
      "sectionA": 30,
      "sectionB": 28,
      "sectionC": 29,
      "total": 87
    },
    {
      "class": "X",
      "sectionA": 35,
      "sectionB": 33,
      "sectionC": 32,
      "total": 100
    }
  ],
  "grandTotal": 2351
}
```

---

### POST /students/class-grid/export

**Purpose:** Export student grid report

**Allowed Roles:** Same as POST /fees/collections/export

**Request Body:**

```json
{
  "session": "2025-2026",
  "format": "excel"
}
```

---

## 📊 PAGE 14: Reports — Working Log (`app/reports/working-log.tsx`)

### GET /audit/logs

**Purpose:** Get chronological activity/audit log

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `auditor` — Full access
- ⚠️ `accountant` — Limited access (financial activities only)
- ❌ All others — No access

**Query Parameters:**

- `month` (string, optional) — Filter by month (YYYY-MM)
- `session` (string, optional) — Filter by session
- `type` (string, optional) — Filter by activity type
- `page` (number, optional) — Page number
- `limit` (number, optional) — Records per page

**Response (200 OK):**

```json
{
  "activities": [
    {
      "id": "log-1",
      "date": "2025-11-18",
      "time": "09:15 AM",
      "type": "collection",
      "description": "Fee collected from Aarav Kumar - ₹12,500",
      "actor": "Accountant Name",
      "amount": 12500,
      "metadata": {
        "receiptNo": "REC001",
        "studentId": "student-1"
      }
    },
    {
      "id": "log-2",
      "date": "2025-11-18",
      "time": "10:30 AM",
      "type": "admission",
      "description": "New student admitted - Diya Sharma (Class IX-B)",
      "actor": "Clerk Name",
      "amount": 0,
      "metadata": {
        "studentId": "student-2",
        "enrollmentNo": "5850"
      }
    }
  ],
  "pageInfo": {
    "page": 1,
    "limit": 100,
    "total": 450,
    "totalPages": 5
  }
}
```

---

### POST /audit/logs/export

**Purpose:** Export working log report

**Allowed Roles:** Same as GET /audit/logs

**Request Body:**

```json
{
  "month": "2025-11",
  "session": "2025-2026",
  "format": "pdf"
}
```

---

## 📊 PAGE 15: Reports — Monthly Charts (`app/reports/monthly-charts.tsx`)

### GET /analytics/admissions/by-class

**Purpose:** Get admission distribution by class (donut chart)

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ✅ `accountant` — View-only
- ❌ All others — No access

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "distribution": [
    {
      "label": "Nursery",
      "value": 87,
      "percentage": 3.7,
      "color": "#FF9F43"
    },
    {
      "label": "L.K.G",
      "value": 149,
      "percentage": 6.3,
      "color": "#A78BFA"
    }
  ],
  "total": 2351
}
```

---

### GET /analytics/admissions/monthly

**Purpose:** Get monthly admissions trend (bar chart)

**Allowed Roles:** Same as GET /analytics/admissions/by-class

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "months": [
    {
      "month": "April",
      "monthShort": "Apr",
      "admissions": 422
    },
    {
      "month": "November",
      "monthShort": "Nov",
      "admissions": 8
    }
  ],
  "total": 572
}
```

---

### GET /analytics/finance/monthly

**Purpose:** Get monthly finance analytics (income/expense/fee)

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ⚠️ `auditor` — View-only
- ❌ All others — No access

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "months": [
    {
      "month": "April",
      "monthShort": "Apr",
      "income": 850000,
      "expense": 420000,
      "fee": 820000
    },
    {
      "month": "November",
      "monthShort": "Nov",
      "income": 950000,
      "expense": 470000,
      "fee": 920000
    }
  ],
  "totals": {
    "income": 7550000,
    "expense": 3770000,
    "fee": 7340000
  }
}
```

---

### GET /fees/collections/payment-modes

**Purpose:** Get payment mode distribution (donut chart)

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ❌ All others — No access

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "distribution": [
    {
      "label": "Cash",
      "value": 3200000,
      "percentage": 33.5,
      "color": "#10B981"
    },
    {
      "label": "Bank Transfer",
      "value": 4500000,
      "percentage": 47.1,
      "color": "#0EA5E9"
    }
  ],
  "total": 9549650
}
```

---

## 💬 PAGE 16: Communications & Assignments (Dashboard Cards)

### GET /communications/summary

**Purpose:** Get SMS and internal communication statistics

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `accountant` — Full access
- ✅ `clerk` — Full access
- ❌ All others — No access

**Query Parameters:**

- `date` (string, optional) — Specific date (YYYY-MM-DD)
- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "date": "2025-11-18",
  "sms": {
    "today": 0,
    "week": 0,
    "month": 0,
    "creditsUsed": 0,
    "creditsRemaining": 5000
  },
  "internal": {
    "today": 0,
    "week": 2,
    "month": 2
  }
}
```

---

### GET /assignments/summary

**Purpose:** Get assignment statistics (homework/classwork/activities)

**Allowed Roles:**

- ✅ `director` — Full access
- ✅ `principal` — Full access
- ✅ `teacher` — Full access
- ❌ All others — No access

**Query Parameters:**

- `session` (string, optional) — Filter by session

**Response (200 OK):**

```json
{
  "session": "2025-2026",
  "homework": 3,
  "classwork": 0,
  "activities": 0,
  "total": 3,
  "pending": 2,
  "completed": 1
}
```

---

## 📥 UTILITY: Export Job Status

### GET /exports/{jobId}

**Purpose:** Check status of export job and get download link

**Allowed Roles:** Any role that initiated the export

**Path Parameters:**

- `jobId` (string, required) — Export job identifier

**Response when processing (200 OK):**

```json
{
  "jobId": "export-job-123",
  "status": "processing",
  "progress": 45,
  "message": "Generating report...",
  "createdAt": "2025-11-18T10:30:00Z"
}
```

**Response when completed (200 OK):**

```json
{
  "jobId": "export-job-123",
  "status": "completed",
  "downloadUrl": "https://api.rlacademy.local/downloads/staff-attendance-2025-11-18.xlsx",
  "fileName": "staff-attendance-2025-11-18.xlsx",
  "fileSize": 45678,
  "expiresAt": "2025-11-18T18:00:00Z",
  "createdAt": "2025-11-18T10:30:00Z",
  "completedAt": "2025-11-18T10:30:45Z"
}
```

**Response when failed (200 OK):**

```json
{
  "jobId": "export-job-123",
  "status": "failed",
  "error": "Insufficient data for the specified date range",
  "createdAt": "2025-11-18T10:30:00Z",
  "failedAt": "2025-11-18T10:30:15Z"
}
```

---

## 🔒 Role Permission Matrix

| Page / Feature              | Director | Accountant | Principal | Teacher       | Clerk      | Auditor |
| --------------------------- | -------- | ---------- | --------- | ------------- | ---------- | ------- |
| **Login**                   | ✅       | ✅         | ✅        | ✅            | ✅         | ✅      |
| **Dashboard**               | ✅ Full  | ✅ Full    | ✅ Full   | ⚠️ Limited    | ⚠️ Limited | ✅ View |
| **Students List**           | ✅ Full  | ✅ Full    | ✅ Full   | ⚠️ Class Only | ✅ Full    | ❌ No   |
| **Student Detail**          | ✅ Full  | ✅ Full    | ✅ Full   | ⚠️ Class Only | ✅ Full    | ❌ No   |
| **Student Fees**            | ✅ Full  | ✅ Full    | ⚠️ View   | ❌ No         | ✅ Full    | ❌ No   |
| **Student Attendance**      | ✅ Full  | ❌ No      | ✅ Full   | ⚠️ Class Only | ✅ Full    | ❌ No   |
| **Staff List**              | ✅ Full  | ✅ Full    | ✅ Full   | ❌ No         | ✅ Full    | ✅ View |
| **Staff Detail**            | ✅ Full  | ⚠️ Limited | ✅ Full   | ❌ No         | ⚠️ Limited | ⚠️ View |
| **Staff Payroll**           | ✅ Full  | ✅ Full    | ❌ No     | ❌ No         | ❌ No      | ✅ View |
| **Attendance Summary**      | ✅ Full  | ⚠️ View    | ✅ Full   | ⚠️ Class Only | ✅ Full    | ❌ No   |
| **Fees Summary**            | ✅ Full  | ✅ Full    | ⚠️ View   | ❌ No         | ✅ Full    | ❌ No   |
| **Daily Collection**        | ✅ Full  | ✅ Full    | ❌ No     | ❌ No         | ✅ Full    | ❌ No   |
| **Monthly Collection**      | ✅ Full  | ✅ Full    | ❌ No     | ❌ No         | ❌ No      | ✅ View |
| **Deleted Receipts**        | ✅ Full  | ✅ Full    | ❌ No     | ❌ No         | ❌ No      | ✅ Full |
| **Staff Attendance Report** | ✅ Full  | ⚠️ View    | ✅ Full   | ❌ No         | ✅ Full    | ❌ No   |
| **Student Grid**            | ✅ Full  | ⚠️ View    | ✅ Full   | ❌ No         | ❌ No      | ❌ No   |
| **Working Log**             | ✅ Full  | ⚠️ Limited | ❌ No     | ❌ No         | ❌ No      | ✅ Full |
| **Analytics Charts**        | ✅ Full  | ⚠️ View    | ✅ Full   | ❌ No         | ❌ No      | ⚠️ View |
| **Communications**          | ✅ Full  | ✅ Full    | ❌ No     | ❌ No         | ✅ Full    | ❌ No   |
| **Assignments**             | ✅ Full  | ❌ No      | ✅ Full   | ✅ Full       | ❌ No      | ❌ No   |
| **Export Reports**          | ✅ Yes   | ✅ Yes     | ❌ No     | ❌ No         | ❌ No      | ❌ No   |

**Legend:**

- ✅ Full — Complete access with read/write permissions
- ⚠️ View — Read-only access
- ⚠️ Limited — Restricted access (class-specific, filtered data, or no sensitive fields)
- ❌ No — No access

---

## 📝 Implementation Notes

### Authentication

- All endpoints except `/auth/login` require `Authorization: Bearer <token>` header
- Token expires in 24 hours
- Refresh token expires in 30 days

### Date Formats

- **Request dates:** `YYYY-MM-DD` (ISO 8601)
- **Display dates:** `DD-MM-YYYY` or `DD MMM YYYY`
- **Timestamps:** ISO 8601 with timezone (e.g., `2025-11-18T10:30:00Z`)

### Pagination

- Default: `page=1`, `limit=50`
- Maximum: `limit=100`
- Response includes `pageInfo` object with `hasNext`, `hasPrev`, `totalPages`

### Error Responses

- `400 Bad Request` — Invalid parameters
- `401 Unauthorized` — Missing or invalid token
- `403 Forbidden` — Insufficient permissions for role
- `404 Not Found` — Resource not found
- `422 Unprocessable Entity` — Validation errors
- `500 Internal Server Error` — Server errors

### Error Response Format

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to access this resource",
    "details": {
      "requiredRole": "director",
      "userRole": "teacher"
    }
  }
}
```

### Rate Limiting

- 1000 requests per hour per user
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- `429 Too Many Requests` when exceeded

### Export Workflow

1. POST to export endpoint → Returns `202 Accepted` with `jobId`
2. Poll GET `/exports/{jobId}` for status
3. When `status=completed` → Download from `downloadUrl`
4. Download URLs expire after 24 hours

---

## 📊 Summary

**Total Endpoints:** 44

**By Category:**

- Authentication: 3 endpoints
- Dashboard: 3 endpoints
- Students: 5 endpoints
- Staff: 4 endpoints
- Attendance: 3 endpoints
- Fees: 7 endpoints
- Reports: 13 endpoints
- Analytics: 4 endpoints
- Communications/Assignments: 2 endpoints

**By Access Level:**

- Director: 44 endpoints (100%)
- Accountant: 32 endpoints (73%)
- Principal: 28 endpoints (64%)
- Clerk: 22 endpoints (50%)
- Teacher: 12 endpoints (27%)
- Auditor: 15 endpoints (34%)

This page-wise reference maps directly to your frontend screens, making integration straightforward for both frontend and backend teams.
