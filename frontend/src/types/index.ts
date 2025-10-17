export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type UserRole = 'employee' | 'supervisor' | 'manager';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CertificationStatus = 'active' | 'expired' | 'pending';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  employeeId?: string;
  department?: string;
  shift?: string;
  email?: string;
  skills?: EmployeeSkill[];
  currentWorkload?: number; // 0-100%
  performanceScore?: number; // 0-100
  password?: string; // For employee login authentication
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: TaskPriority;
  status: TaskStatus;
  startTime: string;
  endTime: string;
  dueDate: string;
  checklist?: ChecklistItem[];
  notes?: string;
  completedAt?: string;
  requiredSkills?: string[]; // skill IDs
  difficultyRating?: number; // 1-5 from employee feedback
  qualityRating?: number; // 1-5 from supervisor feedback
  feedback?: TaskFeedback;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface DailyReport {
  date: string;
  totalTasks: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

// Skill Management
export interface Skill {
  id: string;
  name: string;
  category: string; // e.g., "Welding", "Machining", "Quality Control"
  description: string;
  requiresCertification: boolean;
  department?: string;
}

export interface EmployeeSkill {
  skillId: string;
  skillName: string;
  level: SkillLevel;
  yearsExperience: number;
  certifications?: Certification[];
  lastUsed?: string;
}

export interface Certification {
  id: string;
  name: string;
  issueDate: string;
  expiryDate: string;
  status: CertificationStatus;
  documentUrl?: string;
}

// Task Assignment
export interface EmployeeMatch {
  employee: User;
  matchScore: number;
  reasons: MatchReason[];
  skillMatch: number;
  workloadScore: number;
  performanceScore: number;
  availability: boolean;
}

export interface MatchReason {
  type: 'skill' | 'workload' | 'performance' | 'availability' | 'experience';
  label: string;
  impact: 'positive' | 'negative' | 'neutral';
}

// Analytics
export interface EmployeePerformance {
  employeeId: string;
  completionRate: number;
  averageTaskTime: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  tasksCompleted: number;
  tasksOverdue: number;
  skillsUsed: { skillId: string; count: number }[];
  performanceTrend: PerformanceTrend[];
}

export interface PerformanceTrend {
  date: string;
  completionRate: number;
  tasksCompleted: number;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  demand: number; // tasks requiring this skill
  supply: number; // employees with this skill
  gap: number; // demand - supply
  utilization: number; // 0-100%
}

export interface WorkforceAnalytics {
  overallUtilization: number;
  skillUtilization: SkillGap[];
  topPerformers: string[]; // employee IDs
  skillsInDemand: string[]; // skill IDs
  reworkIncidents: number;
  trainingNeeded: { skillId: string; employeeIds: string[] }[];
}

// Feedback
export interface TaskFeedback {
  employeeFeedback?: EmployeeFeedback;
  supervisorFeedback?: SupervisorFeedback;
}

export interface EmployeeFeedback {
  difficultyRating: number; // 1-5
  clarity: number; // 1-5
  hadIssues: boolean;
  issues?: string;
  suggestions?: string;
  submittedAt: string;
}

export interface SupervisorFeedback {
  qualityRating: number; // 1-5
  onTime: boolean;
  needsRetraining: boolean;
  notes?: string;
  submittedAt: string;
}

// Training
export interface TrainingSuggestion {
  employeeId: string;
  skillId: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  basedOn: 'performance' | 'skill-gap' | 'certification-expiry' | 'task-feedback';
}
