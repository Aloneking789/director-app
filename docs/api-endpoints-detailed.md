# Director App - Complete API Endpoints Documentation

This document provides a detailed textual description of all API endpoints required to replace static data in the Director App with real API calls.

---

## 1. AUTHENTICATION & USER MANAGEMENT

### 1.1 Login (POST /auth/login)

**Purpose:** Authenticate a user and retrieve their profile information along with available sessions.

**Request Body:**

```
{
  "username": "director@rlacademy.com",
  "password": "securePassword123",
  "role": "director"
}
```

**Field Details:**

- `username` (string, required): User's email or username
- `password` (string, required): User's password
- `role` (string, required): One of: "director", "accountant", "principal", "teacher", "clerk", "auditor"

**Response (200 OK):**

```
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

**Field Details:**

- `token` (string): JWT token for authentication (expires in 24 hours)
- `refreshToken` (string): Token to refresh the access token (expires in 30 days)
- `user` (object): User profile information
  - `id` (string): Unique user identifier
  - `name` (string): Full name of the user
  - `role` (string): User's role in the system
  - `email` (string): Email address
  - `phone` (string): Contact number
  - `avatar` (string|null): URL to user's avatar image or null
  - `session` (string): Currently selected session year
- `availableSessions` (array of strings): List of academic sessions available to the user

**Error Responses:**

- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: User doesn't have access to selected role

---

### 1.2 Get Current User (GET /auth/me)

**Purpose:** Retrieve logged-in user's current session information.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**
None

**Response (200 OK):**

```
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

**Error Responses:**

- `401 Unauthorized`: Invalid or expired token

---

### 1.3 Get School Information (GET /school/info)

**Purpose:** Fetch basic school information for header/banner display.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Specific session year (defaults to current user's session)

**Response (200 OK):**

```
{
  "name": "R.L. Academy Sr. Sec. School",
  "location": "Salempur, Deoria, Uttar Pradesh",
  "session": "2025-2026"
}
```

**Field Details:**

- `name` (string): Full name of the school
- `location` (string): Complete address/location
- `session` (string): Academic session year

---

## 2. DASHBOARD

### 2.1 Get Dashboard Statistics (GET /dashboard)

**Purpose:** Fetch comprehensive dashboard metrics including students, staff, attendance, fees, communication, birthdays, and assignments.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by specific session (defaults to current user's session)

**Response (200 OK):**

```
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

**Field Details:**

- `students` (object): Student statistics
  - `total` (number): Total number of students
  - `active` (number): Currently active students
  - `new` (number): New admissions in current session
  - `male` (number): Male students count
  - `female` (number): Female students count
  - `dropout` (number): Students who dropped out
  - `tc` (number): Transfer certificate issued
- `staff` (object): Staff statistics
  - `total` (number): Total staff count
  - `active` (number): Currently active staff
  - `new` (number): New joinings
  - `left` (number): Staff who left
  - `teaching` (number): Teaching staff count
  - `nonTeaching` (number): Non-teaching staff count
- `attendance` (object): Today's attendance summary
  - All fields are numbers representing counts
- `fees` (object): Fee collection summary (in rupees)
  - `expected` (number): Total expected fees
  - `received` (number): Total collected fees
  - `balance` (number): Outstanding balance
  - `concession` (number): Total concessions given
  - `todayCollection` (number): Today's collection
- `communication` (object): Communication statistics
  - SMS and internal message counts for today, week, and month
- `birthday` (object): Birthday counts for today
- `assignments` (object): Assignment counts by type

---

## 3. STUDENT MANAGEMENT

### 3.1 Get All Students (GET /students)

**Purpose:** Fetch paginated list of students with filtering and sorting options.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (number, optional, default: 1): Page number for pagination
- `limit` (number, optional, default: 50): Number of records per page
- `class` (string, optional): Filter by class (e.g., "X", "IX", "NURSERY")
- `section` (string, optional): Filter by section (e.g., "A", "B", "C")
- `status` (string, optional): Filter by status ("active", "new", "tc", "dropout")
- `gender` (string, optional): Filter by gender ("male", "female")
- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
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

**Field Details:**

- `items` (array): Array of student objects
  - `id` (string): Unique student identifier
  - `enrollmentNo` (string): Enrollment/admission number
  - `name` (string): Full name
  - `class` (string): Class name (e.g., "X", "NURSERY")
  - `section` (string): Section (e.g., "A", "B", "C")
  - `rollNo` (number): Roll number in class
  - `dob` (string): Date of birth (format: DD-MM-YYYY)
  - `gender` (string): "male" or "female"
  - `religion` (string): Religion
  - `admissionDate` (string): Date of admission
  - `joiningDate` (string): Date of joining
  - `status` (string): "active", "new", "tc", or "dropout"
  - `aadharCard` (string): Aadhar card number
  - `house` (string): House name (Red/Blue/Green/Yellow)
  - `fatherName` (string): Father's full name
  - `fatherPhone` (string): Father's phone number
  - `motherName` (string): Mother's full name
  - `motherPhone` (string): Mother's phone number
  - `communicationNo` (string): Primary communication number
  - `avatar` (string|null): URL to student photo or null
- `pageInfo` (object): Pagination metadata
  - `page` (number): Current page number
  - `limit` (number): Records per page
  - `total` (number): Total records matching query
  - `totalPages` (number): Total number of pages
  - `hasNext` (boolean): Whether next page exists
  - `hasPrev` (boolean): Whether previous page exists

---

### 3.2 Search Students (GET /students/search)

**Purpose:** Search students by name, enrollment number, or phone number.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `q` (string, required): Search query (minimum 3 characters)
- `session` (string, optional): Filter by session year
- `limit` (number, optional, default: 50): Maximum results to return

**Response (200 OK):**

```
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
      "status": "active",
      "fatherName": "Dharmendra Kumar",
      "fatherPhone": "9876543210",
      "motherName": "Pratibha Devi",
      "motherPhone": "9876543211",
      "communicationNo": "9876543210",
      "avatar": null
    }
  ],
  "total": 1
}
```

**Field Details:**
Same as Get All Students, but without pagination (returns all matching results up to limit)

---

### 3.3 Get Student by ID (GET /students/{id})

**Purpose:** Fetch detailed information for a specific student including all personal and family details.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

- `id` (string, required): Student's unique identifier

**Response (200 OK):**

```
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

**Error Responses:**

- `404 Not Found`: Student not found

---

### 3.4 Get Student Fee Details (GET /fees/students/{id})

**Purpose:** Retrieve complete fee ledger for a specific student including dues, payments, and installments.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

- `id` (string, required): Student's unique identifier

**Query Parameters:**

- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
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
    },
    {
      "id": "payment-2",
      "receiptNo": "REC002",
      "amount": 3000,
      "mode": "UPI",
      "date": "2025-09-10",
      "collectedBy": "Clerk Name"
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
    },
    {
      "month": "SEP",
      "due": 1400,
      "paid": 1400,
      "balance": 0,
      "status": "paid",
      "dueDate": "2025-09-10"
    },
    {
      "month": "OCT",
      "due": 1000,
      "paid": 0,
      "balance": 1000,
      "status": "pending",
      "dueDate": "2025-10-10"
    }
  ]
}
```

**Field Details:**

- `studentId` (string): Student's unique identifier
- `totalDue` (number): Total fees due for the session
- `totalPaid` (number): Total amount paid
- `balance` (number): Outstanding balance
- `payments` (array): Payment history
  - `id` (string): Payment transaction ID
  - `receiptNo` (string): Receipt number
  - `amount` (number): Amount paid
  - `mode` (string): Payment mode (Cash/Cheque/UPI/Bank Transfer)
  - `date` (string): Payment date (YYYY-MM-DD)
  - `collectedBy` (string): Name of person who collected
- `installments` (array): Monthly installment breakdown
  - `month` (string): Month abbreviation (JAN/FEB/MAR, etc.)
  - `due` (number): Amount due for this month
  - `paid` (number): Amount paid for this month
  - `balance` (number): Remaining balance for this month
  - `status` (string): "paid", "partial", or "pending"
  - `dueDate` (string): Due date for this installment

---

### 3.5 Get Student Attendance History (GET /attendance/students/history)

**Purpose:** Fetch attendance records for a specific student over a time period.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `studentId` (string, required): Student's unique identifier
- `startDate` (string, optional): Start date (YYYY-MM-DD), defaults to 7 days ago
- `endDate` (string, optional): End date (YYYY-MM-DD), defaults to today
- `days` (number, optional): Number of days to fetch (alternative to date range)

**Response (200 OK):**

```
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
    },
    {
      "id": "att-2",
      "studentId": "student-1",
      "date": "2025-11-17",
      "status": "absent",
      "inTime": null,
      "outTime": null,
      "remarks": "Sick leave"
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

**Field Details:**

- `studentId` (string): Student's identifier
- `records` (array): Attendance records
  - `id` (string): Attendance record ID
  - `studentId` (string): Student's identifier
  - `date` (string): Date (YYYY-MM-DD)
  - `status` (string): "present", "absent", "half-day", "leave", or "holiday"
  - `inTime` (string|null): Check-in time
  - `outTime` (string|null): Check-out time
  - `remarks` (string): Any remarks/notes
- `summary` (object): Attendance summary counts

---

## 4. STAFF MANAGEMENT

### 4.1 Get All Staff (GET /staff)

**Purpose:** Fetch paginated list of staff members with filtering options.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (number, optional, default: 1): Page number
- `limit` (number, optional, default: 50): Records per page
- `category` (string, optional): Filter by category ("teaching", "non-teaching", "admin")
- `department` (string, optional): Filter by department
- `isActive` (boolean, optional): Filter by active status

**Response (200 OK):**

```
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

**Field Details:**

- `items` (array): Array of staff objects
  - `id` (string): Unique staff identifier
  - `staffId` (string): Employee ID number
  - `name` (string): Full name
  - `role` (string): Role/position
  - `category` (string): "teaching", "non-teaching", or "admin"
  - `department` (string): Department name
  - `designation` (string): Job designation (TGT/PGT/PRT/Principal, etc.)
  - `joiningDate` (string): Date of joining (DD-MM-YYYY)
  - `dob` (string): Date of birth (DD-MM-YYYY)
  - `religion` (string): Religion
  - `bloodGroup` (string): Blood group
  - `nationality` (string): Nationality
  - `maritalStatus` (string): Marital status
  - `appointmentType` (string): Appointment type (PERMANENT/CONTRACT/TEMPORARY)
  - `accountType` (string): Account type
  - `email` (string): Email address
  - `phone` (string): Contact number
  - `aadharNo` (string): Aadhar number
  - `panNo` (string): PAN number
  - `permanentAddress` (string): Permanent address
  - `presentAddress` (string): Present/current address
  - `avatar` (string|null): URL to staff photo
  - `isActive` (boolean): Whether staff is currently active
- `pageInfo` (object): Pagination metadata

---

### 4.2 Search Staff (GET /staff/search)

**Purpose:** Search staff members by name, staff ID, email, or phone number.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `q` (string, required): Search query
- `limit` (number, optional, default: 50): Maximum results

**Response (200 OK):**

```
{
  "items": [
    {
      "id": "staff-1",
      "staffId": "1000",
      "name": "Abhishek Pathak",
      "designation": "TGT",
      "category": "teaching",
      "department": "TEACHING",
      "email": "staff1@rlacademy.com",
      "phone": "9876543210",
      "isActive": true,
      "avatar": null
    }
  ],
  "total": 1
}
```

---

### 4.3 Get Staff by ID (GET /staff/{id})

**Purpose:** Fetch detailed information for a specific staff member.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

- `id` (string, required): Staff's unique identifier

**Response (200 OK):**
Same structure as individual staff object from Get All Staff endpoint.

**Error Responses:**

- `404 Not Found`: Staff member not found

---

### 4.4 Get Staff Payroll History (GET /payroll/staff/{id})

**Purpose:** Retrieve payroll/salary history for a staff member.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

- `id` (string, required): Staff's unique identifier

**Query Parameters:**

- `year` (number, optional): Filter by year
- `month` (string, optional): Filter by month

**Response (200 OK):**

```
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
    },
    {
      "id": "pay-2",
      "staffId": "staff-1",
      "month": "October",
      "year": 2025,
      "grossPay": 50000,
      "deductions": 5000,
      "netPay": 45000,
      "paymentDate": "2025-10-31",
      "status": "paid"
    }
  ]
}
```

**Field Details:**

- `staffId` (string): Staff identifier
- `records` (array): Payroll records
  - `id` (string): Payroll record ID
  - `staffId` (string): Staff identifier
  - `month` (string): Month name
  - `year` (number): Year
  - `grossPay` (number): Gross salary amount
  - `deductions` (number): Total deductions
  - `netPay` (number): Net salary (gross - deductions)
  - `paymentDate` (string): Date of payment (YYYY-MM-DD)
  - `status` (string): "paid" or "pending"

---

## 5. ATTENDANCE MANAGEMENT

### 5.1 Get Attendance Summary (GET /attendance/summary)

**Purpose:** Get attendance summary counts for students or staff for a specific date.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `type` (string, required): "student" or "staff"
- `date` (string, optional): Date in YYYY-MM-DD format (defaults to today)
- `session` (string, optional): Filter by session year (for students)

**Response (200 OK):**

For type=student:

```
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

For type=staff:

```
{
  "date": "2025-11-18",
  "type": "staff",
  "present": 75,
  "absent": 3,
  "leave": 2,
  "total": 80
}
```

**Field Details:**

- `date` (string): Date for which summary is provided
- `type` (string): "student" or "staff"
- `present` (number): Count of present
- `absent` (number): Count of absent
- `halfDay` (number): Count of half-day (students only)
- `leave` (number): Count of on leave
- `notMarked` (number): Count of not marked (students only)
- `total` (number): Total count

---

### 5.2 Get Staff Attendance Details (GET /attendance/staff/daily)

**Purpose:** Fetch detailed daily attendance for all staff members including in/out times.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `date` (string, optional): Date in YYYY-MM-DD format (defaults to today)
- `category` (string, optional): Filter by staff category

**Response (200 OK):**

```
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
    },
    {
      "serialNumber": 3,
      "employeeId": "1002",
      "employeeName": "Akaram Ali",
      "designation": "Principal",
      "category": "admin",
      "status": "absent",
      "inTime": null,
      "outTime": null,
      "lateArrival": 0,
      "delay": 0
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

**Field Details:**

- `date` (string): Date of attendance
- `records` (array): Attendance records
  - `serialNumber` (number): Serial number for display
  - `employeeId` (string): Staff/employee ID
  - `employeeName` (string): Full name
  - `designation` (string): Job designation
  - `category` (string): Staff category
  - `status` (string): "present" or "absent"
  - `inTime` (string|null): Check-in time
  - `outTime` (string|null): Check-out time
  - `lateArrival` (number): 1 if late, 0 if on time
  - `delay` (number): Minutes late (0 if on time)
- `summary` (object): Summary counts

---

### 5.3 Export Staff Attendance Report (POST /attendance/staff/export)

**Purpose:** Generate and download staff attendance report in Excel/PDF format.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```
{
  "date": "2025-11-18",
  "category": "teaching",
  "format": "excel"
}
```

**Field Details:**

- `date` (string, required): Date for report (YYYY-MM-DD)
- `category` (string, optional): Filter by category
- `format` (string, required): "excel" or "pdf"

**Response (202 Accepted):**

```
{
  "jobId": "export-job-123",
  "status": "processing",
  "message": "Export job started. You'll be notified when ready.",
  "estimatedTime": "30 seconds"
}
```

**Follow-up GET /exports/{jobId} to download:**

```
{
  "jobId": "export-job-123",
  "status": "completed",
  "downloadUrl": "https://api.rlacademy.local/downloads/staff-attendance-2025-11-18.xlsx",
  "expiresAt": "2025-11-18T18:00:00Z"
}
```

---

## 6. FEE MANAGEMENT

### 6.1 Get Class-wise Fee Summary (GET /fees/class-summary)

**Purpose:** Fetch fee collection summary grouped by class.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
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
      "class": "L.K.G",
      "paid": 3000,
      "excess": 0,
      "late": 0,
      "totalStudents": 149,
      "color": "#A78BFA"
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

**Field Details:**

- `session` (string): Academic session
- `classes` (array): Class-wise breakdown
  - `class` (string): Class name
  - `paid` (number): Total amount collected for this class
  - `excess` (number): Excess amount paid
  - `late` (number): Late fees collected
  - `totalStudents` (number): Number of students in class
  - `color` (string): Hex color code for UI display
- `totalPaid` (number): Total across all classes
- `totalExcess` (number): Total excess across all classes
- `totalLate` (number): Total late fees across all classes

---

### 6.2 Get Daily Fee Collection (GET /fees/collections)

**Purpose:** Fetch detailed daily fee collection with individual receipts.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `date` (string, optional): Date in YYYY-MM-DD format (defaults to today)

**Response (200 OK):**

```
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
    },
    {
      "receiptNo": "REC002",
      "studentId": "student-2",
      "studentName": "Diya Sharma",
      "class": "Class IX-B",
      "amount": 11000,
      "mode": "Bank Transfer",
      "time": "10:30 AM",
      "collectedBy": "Clerk Name"
    }
  ]
}
```

**Field Details:**

- `date` (string): Collection date
- `summary` (object): Summary totals
  - `totalCollection` (number): Total amount collected
  - `cash` (number): Cash payments
  - `bank` (number): Bank transfers
  - `upi` (number): UPI payments
  - `cheque` (number): Cheque payments
  - `receiptsCount` (number): Total receipts
- `receipts` (array): Individual receipt details
  - `receiptNo` (string): Receipt number
  - `studentId` (string): Student identifier
  - `studentName` (string): Student name
  - `class` (string): Student's class
  - `amount` (number): Amount paid
  - `mode` (string): Payment mode
  - `time` (string): Collection time
  - `collectedBy` (string): Collector's name

---

### 6.3 Export Daily Collection Report (POST /fees/collections/export)

**Purpose:** Generate downloadable daily collection report.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```
{
  "date": "2025-11-10",
  "format": "excel"
}
```

**Response (202 Accepted):**
Same structure as other export endpoints with jobId and status.

---

### 6.4 Get Monthly Fee Collection (GET /fees/collections/monthly)

**Purpose:** Fetch monthly fee collection trend over the academic session.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Academic session year

**Response (200 OK):**

```
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
      "month": "May",
      "monthShort": "May",
      "year": 2025,
      "collection": 890000,
      "receiptsCount": 380
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

**Field Details:**

- `session` (string): Academic session
- `months` (array): Monthly breakdown
  - `month` (string): Full month name
  - `monthShort` (string): Abbreviated month (3 letters)
  - `year` (number): Year
  - `collection` (number): Total collected in month
  - `receiptsCount` (number): Number of receipts
- `totalCollection` (number): Total for entire session
- `averageMonthly` (number): Average per month

---

### 6.5 Export Monthly Collection Report (POST /fees/collections/monthly/export)

**Purpose:** Generate downloadable monthly collection report.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```
{
  "session": "2025-2026",
  "format": "pdf"
}
```

**Response (202 Accepted):**
Same structure as other export endpoints.

---

### 6.6 Get Deleted Receipts (GET /fees/receipts/deleted)

**Purpose:** Fetch list of deleted fee receipts for audit purposes.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `startDate` (string, optional): Start date (YYYY-MM-DD)
- `endDate` (string, optional): End date (YYYY-MM-DD)
- `page` (number, optional): Page number
- `limit` (number, optional): Records per page

**Response (200 OK):**

```
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

**Field Details:**

- `records` (array): Deleted receipt records
  - `id` (string): Deletion record ID
  - `receiptNumber` (string): Original receipt number
  - `studentId` (string): Student identifier
  - `studentName` (string): Student name
  - `deletedAmount` (number): Amount that was deleted
  - `originalDate` (string): Original receipt date
  - `deletionDate` (string): Date of deletion
  - `deletedBy` (string): Name of person who deleted
  - `deletionType` (string): Type (cancellation/correction/error)
  - `reason` (string): Reason for deletion
- `pageInfo` (object): Pagination metadata
- `summary` (object): Summary statistics

---

### 6.7 Export Deleted Receipts Report (POST /fees/receipts/deleted/export)

**Purpose:** Generate downloadable deleted receipts report.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```
{
  "startDate": "2025-10-01",
  "endDate": "2025-10-31",
  "format": "excel"
}
```

**Response (202 Accepted):**
Same structure as other export endpoints.

---

## 7. REPORTS & ANALYTICS

### 7.1 Get Working Log (GET /audit/logs)

**Purpose:** Fetch chronological activity/audit log of all system activities.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `month` (string, optional): Filter by month (YYYY-MM)
- `session` (string, optional): Filter by session
- `type` (string, optional): Filter by activity type
- `page` (number, optional): Page number
- `limit` (number, optional): Records per page

**Response (200 OK):**

```
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
    },
    {
      "id": "log-3",
      "date": "2025-11-18",
      "time": "11:45 AM",
      "type": "deletion",
      "description": "Receipt REC098 deleted - Duplicate entry",
      "actor": "Director Name",
      "amount": 5000,
      "metadata": {
        "receiptNo": "REC098",
        "reason": "Duplicate entry"
      }
    },
    {
      "id": "log-4",
      "date": "2025-11-18",
      "time": "02:15 PM",
      "type": "attendance",
      "description": "Student attendance marked for Class X-A",
      "actor": "Teacher Name",
      "amount": 0,
      "metadata": {
        "class": "X",
        "section": "A",
        "present": 45,
        "absent": 3
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

**Field Details:**

- `activities` (array): Activity log entries
  - `id` (string): Log entry ID
  - `date` (string): Date (YYYY-MM-DD)
  - `time` (string): Time
  - `type` (string): Activity type (collection/admission/deletion/edit/attendance)
  - `description` (string): Human-readable description
  - `actor` (string): Person who performed action
  - `amount` (number): Amount involved (if applicable, 0 otherwise)
  - `metadata` (object): Additional type-specific data
- `pageInfo` (object): Pagination metadata

---

### 7.2 Export Working Log (POST /audit/logs/export)

**Purpose:** Generate downloadable working log report.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```
{
  "month": "2025-11",
  "session": "2025-2026",
  "format": "pdf"
}
```

**Response (202 Accepted):**
Same structure as other export endpoints.

---

### 7.3 Get Class-wise Student Grid (GET /students/class-grid)

**Purpose:** Fetch student count distribution across classes and sections.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
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
      "class": "L.K.G",
      "sectionA": 50,
      "sectionB": 50,
      "sectionC": 49,
      "total": 149
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

**Field Details:**

- `session` (string): Academic session
- `grid` (array): Class-wise breakdown
  - `class` (string): Class name
  - `sectionA` (number): Students in section A
  - `sectionB` (number): Students in section B
  - `sectionC` (number): Students in section C
  - `total` (number): Total students in class
- `grandTotal` (number): Total students across all classes

---

### 7.4 Export Student Grid Report (POST /students/class-grid/export)

**Purpose:** Generate downloadable student grid report.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```
{
  "session": "2025-2026",
  "format": "excel"
}
```

**Response (202 Accepted):**
Same structure as other export endpoints.

---

## 8. ANALYTICS CHARTS

### 8.1 Get Admissions by Class (GET /analytics/admissions/by-class)

**Purpose:** Fetch admission distribution across classes for donut chart visualization.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
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
    },
    {
      "label": "IX+",
      "value": 380,
      "percentage": 16.2,
      "color": "#14B8A6"
    }
  ],
  "total": 2351
}
```

**Field Details:**

- `session` (string): Academic session
- `distribution` (array): Class-wise distribution
  - `label` (string): Class label
  - `value` (number): Number of admissions
  - `percentage` (number): Percentage of total
  - `color` (string): Hex color for chart
- `total` (number): Total admissions

---

### 8.2 Get Monthly Admissions Trend (GET /analytics/admissions/monthly)

**Purpose:** Fetch monthly admission counts for bar chart visualization.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
{
  "session": "2025-2026",
  "months": [
    {
      "month": "April",
      "monthShort": "Apr",
      "admissions": 422
    },
    {
      "month": "May",
      "monthShort": "May",
      "admissions": 45
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

**Field Details:**

- `session` (string): Academic session
- `months` (array): Monthly breakdown
  - `month` (string): Full month name
  - `monthShort` (string): 3-letter abbreviation
  - `admissions` (number): Admission count
- `total` (number): Total admissions

---

### 8.3 Get Finance Analytics (GET /analytics/finance/monthly)

**Purpose:** Fetch monthly financial metrics (income, expense, fee collection) for multi-series chart.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
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
      "month": "May",
      "monthShort": "May",
      "income": 920000,
      "expense": 450000,
      "fee": 890000
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

**Field Details:**

- `session` (string): Academic session
- `months` (array): Monthly financial data
  - `month` (string): Full month name
  - `monthShort` (string): Abbreviation
  - `income` (number): Total income
  - `expense` (number): Total expenses
  - `fee` (number): Fee collection
- `totals` (object): Cumulative totals

---

### 8.4 Get Payment Mode Distribution (GET /fees/collections/payment-modes)

**Purpose:** Fetch payment mode distribution for donut chart.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by session year

**Response (200 OK):**

```
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
    },
    {
      "label": "Cheque",
      "value": 1849650,
      "percentage": 19.4,
      "color": "#F59E0B"
    },
    {
      "label": "Online",
      "value": 0,
      "percentage": 0,
      "color": "#8B5CF6"
    }
  ],
  "total": 9549650
}
```

**Field Details:**

- `session` (string): Academic session
- `distribution` (array): Mode-wise breakdown
  - `label` (string): Payment mode name
  - `value` (number): Amount collected via this mode
  - `percentage` (number): Percentage of total
  - `color` (string): Hex color for chart
- `total` (number): Total collection

---

## 9. COMMUNICATION & ASSIGNMENTS

### 9.1 Get Communication Summary (GET /communications/summary)

**Purpose:** Fetch SMS and internal communication usage statistics.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `date` (string, optional): Specific date (YYYY-MM-DD)
- `session` (string, optional): Filter by session

**Response (200 OK):**

```
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

**Field Details:**

- `date` (string): Reference date
- `sms` (object): SMS statistics
  - `today` (number): SMS sent today
  - `week` (number): SMS sent this week
  - `month` (number): SMS sent this month
  - `creditsUsed` (number): Credits consumed
  - `creditsRemaining` (number): Available credits
- `internal` (object): Internal message stats
  - `today` (number): Messages today
  - `week` (number): Messages this week
  - `month` (number): Messages this month

---

### 9.2 Get Assignments Summary (GET /assignments/summary)

**Purpose:** Fetch assignment statistics for dashboard display.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `session` (string, optional): Filter by session

**Response (200 OK):**

```
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

**Field Details:**

- `session` (string): Academic session
- `homework` (number): Active homework assignments
- `classwork` (number): Active classwork assignments
- `activities` (number): Active activity assignments
- `total` (number): Total assignments
- `pending` (number): Pending review count
- `completed` (number): Completed count

---

## 10. EXPORT JOB STATUS

### 10.1 Get Export Job Status (GET /exports/{jobId})

**Purpose:** Check status of an export job and get download link when ready.

**Request Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

- `jobId` (string, required): Export job identifier

**Response (200 OK):**

When processing:

```
{
  "jobId": "export-job-123",
  "status": "processing",
  "progress": 45,
  "message": "Generating report...",
  "createdAt": "2025-11-18T10:30:00Z"
}
```

When completed:

```
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

When failed:

```
{
  "jobId": "export-job-123",
  "status": "failed",
  "error": "Insufficient data for the specified date range",
  "createdAt": "2025-11-18T10:30:00Z",
  "failedAt": "2025-11-18T10:30:15Z"
}
```

**Field Details:**

- `jobId` (string): Job identifier
- `status` (string): "processing", "completed", or "failed"
- `progress` (number): Progress percentage (0-100, when processing)
- `message` (string): Status message
- `downloadUrl` (string): Download link (when completed)
- `fileName` (string): File name (when completed)
- `fileSize` (number): File size in bytes (when completed)
- `expiresAt` (string): Download link expiration (when completed)
- `error` (string): Error message (when failed)
- `createdAt` (string): Job creation timestamp (ISO 8601)
- `completedAt` (string): Completion timestamp (when completed)
- `failedAt` (string): Failure timestamp (when failed)

---

## NOTES ON IMPLEMENTATION

### Authentication

All endpoints except `/auth/login` require Bearer token authentication in the `Authorization` header.

### Date Formats

- Request dates: YYYY-MM-DD (ISO 8601)
- Display dates: DD-MM-YYYY or "DD MMM YYYY" format in responses
- Timestamps: ISO 8601 format with timezone (e.g., "2025-11-18T10:30:00Z")

### Pagination

Standard pagination format used across all list endpoints:

- Query params: `page` (default: 1), `limit` (default: 50, max: 100)
- Response includes `pageInfo` object with navigation metadata

### Error Handling

Standard HTTP error codes:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server-side errors

Error response format:

```
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid session parameter",
    "details": {
      "field": "session",
      "reason": "Session must be in YYYY-YYYY format"
    }
  }
}
```

### Rate Limiting

API implements rate limiting:

- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Limit: 1000 requests per hour per user
- Response: `429 Too Many Requests` when exceeded

### Caching

Responses include cache headers:

- `Cache-Control`: Caching policy
- `ETag`: Resource version for conditional requests
- Support for `If-None-Match` header (returns `304 Not Modified` when unchanged)

### Async Exports

All export endpoints follow async pattern:

1. POST to export endpoint → Returns 202 with jobId
2. GET /exports/{jobId} → Poll for status
3. When status=completed → Download from downloadUrl
4. URLs expire after specified time (typically 24 hours)

---

## SUMMARY

**Total Endpoints: 44**

1. Authentication: 3 endpoints
2. Dashboard: 1 endpoint
3. Students: 5 endpoints
4. Staff: 4 endpoints
5. Attendance: 3 endpoints
6. Fees: 7 endpoints
7. Reports: 8 endpoints
8. Analytics: 4 endpoints
9. Communication/Assignments: 2 endpoints
10. Exports: 7 export endpoints + 1 status endpoint

All endpoints are designed to support the complete functionality of the Director App and replace all static mock data with real API integrations.
