/**
 * API Response Types
 * Type definitions for all API response data structures
 */

/**
 * Dashboard KPI Response
 */
export interface DashboardKPI {
  Id: string;
  Label: string;
  Value: string;
}

export type DashboardResponse = DashboardKPI[];

/**
 * Student List Response
 */
export interface StudentListItem {
  Id: number;
  stdid: string | null;
  FirstName: string;
  MidName: string | null;
  LastName: string | null;
  Phone: string | null;
  AddressLine1: string | null;
  BatchId: string | null;
  cls: string;
  SessionId: string | null;
  section: string;
  DOB: string | null;
  Mobile: string | null;
  AdmissionId: string;
  courseid: string | null;
  login_status: string | null;
  father: string;
  mother: string;
  fcontact: string | null;
  mcontact: string | null;
  Gender: string | null;
  BloodGroup: string | null;
  BirthPlace: string | null;
  Nationality: string | null;
  Language: string | null;
  StudentCategoryId: string | null;
  Religion: string | null;
  AddressLine2: string | null;
  City: string | null;
  State: string | null;
  PinCode: string | null;
  Country: string | null;
  Email: string | null;
  EmergencyContactName: string | null;
  EmergencyContactNumber: string | null;
  EmergencyContactAddress: string | null;
  EmergencyRelationToChild: string | null;
  Name_In_Hindi: string | null;
  Marital_Status: string | null;
  Live_Duration_in_UP: string | null;
  Pen_Number: string | null;
  New_Promoted: string | null;
  status: string | null;
}

export type StudentListResponse = StudentListItem[];

/**
 * Student Detail Response
 */
export interface StudentDetail extends StudentListItem {
  stdid: string;
  // Additional fields from detail endpoint
}

export type StudentDetailResponse = StudentDetail[];

/**
 * Staff List Response
 */
export interface StaffListItem {
  Id: number;
  EmployeeId: string;
  EmployeeCategoryId: string;
  EmployeeCategoryName: string;
  JoiningDate: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Gender: string;
  JobTitle: string;
  EmployeePositionId: string;
  EmployeePositionName: string;
  EmployeeDepartmetId: string;
  Qualification: string;
  ExperienceDetail: string;
}

export type StaffListResponse = StaffListItem[];

/**
 * Staff Attendance Response (Present/Absent)
 */
export interface StaffAttendanceItem extends StaffListItem {
  // Inherits all staff fields
}

export type StaffAttendanceResponse = StaffAttendanceItem[];

/**
 * Photo Response
 */
export interface PhotoResponse {
  Id: string;
  SessionId: string; // URL to the photo
  Event_date: string | null;
  Event_tile: string | null;
  Event_description: string | null;
  Is_Holyday: string | null;
  resion: string | null;
  bank: string | null;
  Opration_date: string | null;
  blank_1: string | null;
  blank_2: string | null;
  blank_3: string | null;
  blank_4: string | null;
  EmployeeName: string | null;
  JobTitle: string | null;
  MobilePhone: string | null;
  Email: string | null;
}

export type PhotoListResponse = PhotoResponse[];

/**
 * Fee Collection Response
 */
export interface FeeCollectionItem {
  sr_no: number;
  Select_Amount: string;
  more_fee: string | null;
  Paid: string;
  school_fee: string;
  bus_fee: string | null;
  discount: string;
  transfer_paid: string;
  Cash: string;
  Cheque: string;
  pos: string;
  RecieptNumber: string;
  Receipt_no_ss: string | null;
  type_of_receipt: string | null;
  SessionId: string;
  StudentId: string;
  Name: string;
  Class: string;
  Section: string;
  PaymentMode: string;
  TransactionDate: string;
  CreatedAt: string;
  time: string;
  bank_name: string | null;
  month: string;
  year: string;
}

export type FeeCollectionResponse = FeeCollectionItem[];

/**
 * Fee Payment Details Response
 */
export interface FeePaymentDetail {
  SessionId: string | null;
  Event_date: string | null;
  Event_tile: string;
  Event_description: string; // URL for webview
  Is_Holyday: string | null;
  due_link: string; // URL for webview
}

export type FeePaymentResponse = FeePaymentDetail[];

/**
 * Generic error response
 */
export interface ApiErrorResponse {
  error: string;
  code: string;
  timestamp: string;
}
