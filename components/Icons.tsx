import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// permissive props to avoid type collisions with different icon components
type IconProps = any;

// Feather-based mappings
export const ChevronUp = ({ name, ...props }: IconProps) => <Feather name="chevron-up" {...props} />;
export const ChevronDown = ({ name, ...props }: IconProps) => <Feather name="chevron-down" {...props} />;
export const Search = ({ name, ...props }: IconProps) => <Feather name="search" {...props} />;
export const ChevronRight = ({ name, ...props }: IconProps) => <Feather name="chevron-right" {...props} />;
export const Check = ({ name, ...props }: IconProps) => <Feather name="check" {...props} />;
export const Calendar = ({ name, ...props }: IconProps) => <Feather name="calendar" {...props} />;
export const Download = ({ name, ...props }: IconProps) => <Feather name="download" {...props} />;
export const TrendingUp = ({ name, ...props }: IconProps) => <Feather name="trending-up" {...props} />;
export const Filter = ({ name, ...props }: IconProps) => <Feather name="filter" {...props} />;
export const PieChart = ({ name, ...props }: IconProps) => <Feather name="pie-chart" {...props} />;
export const BarChart3 = ({ name, ...props }: IconProps) => <Feather name="bar-chart-2" {...props} />;
export const FileText = ({ name, ...props }: IconProps) => <Feather name="file-text" {...props} />;
export const Users = ({ name, ...props }: IconProps) => <Feather name="users" {...props} />;
export const Menu = ({ name, ...props }: IconProps) => <Feather name="menu" {...props} />;
export const Bell = ({ name, ...props }: IconProps) => <Feather name="bell" {...props} />;
export const MessageSquare = ({ name, ...props }: IconProps) => <Feather name="message-square" {...props} />;
export const BookOpen = ({ name, ...props }: IconProps) => <Feather name="book" {...props} />;

// MaterialCommunityIcons mappings for icons not available (or better represented) in Feather
export const IndianRupee = ({ name, ...props }: IconProps) => (
  <MaterialCommunityIcons name="currency-inr" {...props} />
);
export const UserCircle2 = ({ name, ...props }: IconProps) => (
  <MaterialCommunityIcons name="account-circle" {...props} />
);
export const UserCheck = ({ name, ...props }: IconProps) => (
  <MaterialCommunityIcons name="account-check" {...props} />
);
export const GraduationCap = ({ name, ...props }: IconProps) => (
  <MaterialCommunityIcons name="graduation-cap" {...props} />
);
export const Briefcase = ({ name, ...props }: IconProps) => (
  <MaterialCommunityIcons name="briefcase" {...props} />
);
export const Cake = ({ name, ...props }: IconProps) => <MaterialCommunityIcons name="cake" {...props} />;
export const RefreshCw = ({ name, ...props }: IconProps) => (
  <MaterialCommunityIcons name="refresh" {...props} />
);
export const Lock = ({ name, ...props }: IconProps) => <Feather name="lock" {...props} />;
export const LogIn = ({ name, ...props }: IconProps) => <Feather name="log-in" {...props} />;
export const Trash2 = ({ name, ...props }: IconProps) => <Feather name="trash-2" {...props} />;
export const TrendingDown = ({ name, ...props }: IconProps) => <Feather name="trending-down" {...props} />;

// Fallback generic icon (if needed elsewhere)
export const DefaultIcon = (props: IconProps) => <Feather name="circle" {...props} />;

export default {
  ChevronUp,
  ChevronDown,
  Search,
  ChevronRight,
  Check,
  Calendar,
  Download,
  TrendingUp,
  Filter,
  PieChart,
  BarChart3,
  FileText,
  Users,
  Menu,
  Bell,
  MessageSquare,
  BookOpen,
  IndianRupee,
  UserCircle2,
  UserCheck,
  GraduationCap,
  Briefcase,
  Cake,
  RefreshCw,
  Lock,
  LogIn,
  Trash2,
  TrendingDown,
};
