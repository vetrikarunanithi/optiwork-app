import { useState, useEffect } from 'react';
import { User, Task, ChecklistItem, Skill, EmployeeFeedback } from './types';

// Employee Components
import { EmployeeLogin } from './components/employee/EmployeeLogin';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { TaskDetails } from './components/employee/TaskDetails';
import { EmployeeSkillProfile } from './components/employee/EmployeeSkillProfile';
import { TaskFeedback } from './components/employee/TaskFeedback';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmployeeList } from './components/admin/EmployeeList';
import { TaskAssignment } from './components/admin/TaskAssignment';
import { ReportsView } from './components/admin/ReportsView';
import { SkillLibrary } from './components/admin/SkillLibrary';
import { SmartTaskAssignment } from './components/admin/SmartTaskAssignment';
import { WorkforceAnalytics } from './components/admin/WorkforceAnalytics';
import { EmployeePerformanceDetail } from './components/admin/EmployeePerformanceDetail';
import { SkillGapReport } from './components/admin/SkillGapReport';

// Shared Components
import { ThemeToggle } from './components/shared/ThemeToggle';
import { Toaster } from './components/ui/sonner';
import { toast } from "sonner";

type AppMode = 'select' | 'employee' | 'admin';
type EmployeeView = 'dashboard' | 'task-details' | 'skill-profile' | 'task-feedback';
type AdminView = 'dashboard' | 'employees' | 'assign' | 'reports' | 'skills' | 'smart-assign' | 'analytics' | 'employee-performance' | 'skill-gaps';

export default function App() {

  const [appMode, setAppMode] = useState<AppMode>('select');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Employee state
  const [employeeView, setEmployeeView] = useState<EmployeeView>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Admin state
  const [adminView, setAdminView] = useState<AdminView>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  // Data state
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [trainingSuggestions, setTrainingSuggestions] = useState<any[]>([]);

const API_URL = "http://127.0.0.1:8000";
const [isInitializing, setIsInitializing] = useState(true);

// ✅ 1. Restore session from localStorage on app load (ONLY ONCE)
useEffect(() => {
  const savedMode = localStorage.getItem('appMode');
  if (savedMode) {
    const savedUser = localStorage.getItem(`${savedMode}_currentUser`);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setAppMode(savedMode as AppMode);
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem(`${savedMode}_currentUser`);
        localStorage.removeItem('appMode');
      }
    }
  }
  setIsInitializing(false);
}, []);

// ✅ 2. Save to localStorage whenever user or mode changes
useEffect(() => {
  if (currentUser && appMode !== 'select') {
    localStorage.setItem(`${appMode}_currentUser`, JSON.stringify(currentUser));
    localStorage.setItem('appMode', appMode);
  } else {
    localStorage.removeItem('employee_currentUser');
    localStorage.removeItem('admin_currentUser');
    localStorage.removeItem('appMode');
  }
}, [currentUser, appMode]);

// ✅ 3. Fetch initial data with auto-refresh (ONLY ONE - not duplicate!)
useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const [
        usersRes, 
        tasksRes, 
        skillsRes, 
        reportsRes, 
        analyticsRes, 
        trainingRes, 
        skillGapsRes,
        performanceRes  // ✅ Add performance endpoint
      ] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/skills`),
        fetch(`${API_URL}/reports`),
        fetch(`${API_URL}/analytics`),
        fetch(`${API_URL}/training-suggestions`),
        fetch(`${API_URL}/skill-gaps`),
        fetch(`${API_URL}/performance`)  // ✅ Fetch all performance data
      ]);

      setUsers(await usersRes.json());
      setTasks(await tasksRes.json());
      setSkills(await skillsRes.json());
      setReports(await reportsRes.json());
      setAnalytics(await analyticsRes.json());
      setTrainingSuggestions(await trainingRes.json());
      setSkillGaps(await skillGapsRes.json());
      setPerformanceData(await performanceRes.json());  // ✅ Set performance data
    } catch (err) {
      console.error("Error fetching initial data:", err);
      toast.error("Failed to fetch data from server");
    }
  };

  fetchInitialData();
  
  // Auto-refresh every 10 seconds
  const interval = setInterval(() => {
    fetchInitialData();
  }, 10000);
  
  return () => clearInterval(interval);
}, []);

// ✅ Helper function to fetch individual employee performance
const fetchPerformance = async (employeeId: string) => {
  try {
    const res = await fetch(`${API_URL}/performance/${employeeId}`);
    const data = await res.json();
    setPerformanceData(prev => [...prev.filter(p => p.employeeId !== employeeId), data]);
  } catch (err) {
    console.error('Error fetching performance:', err);
    toast.error("Failed to fetch performance data");
  }
};

// ✅ Show loading screen while initializing
if (isInitializing) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl shadow-industrial-lg mb-6 animate-pulse">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        <p className="text-muted-foreground">Loading Optiwork...</p>
      </div>
    </div>
  );
}

  // ---------------- Employee handlers ----------------
 const handleEmployeeLogin = async (user: User, password?: string) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: user.employeeId,  // ✅ Correct! Sends "EMP001"
        password: password || user.password || "demo123"  // ✅ Use actual password
      })
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
      setAppMode('employee');
      toast.success(`Welcome back, ${data.user.name}!`);
    } else {
      const err = await res.json();
      toast.error(err.detail || 'Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    toast.error('Login failed');
  }
};

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEmployeeView('task-details');
  };

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      if (selectedTask?.id === taskId) setSelectedTask(updatedTask);

      if (status === 'completed') {
        toast.success('Task completed! Provide feedback?', {
          action: { label: 'Give Feedback', onClick: () => setEmployeeView('task-feedback') }
        });
      } else if (status === 'in-progress') toast.success('Task started');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update task');
    }
  };

  const handleUpdateChecklist = (taskId: string, checklist: ChecklistItem[]) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, checklist } : t));
    if (selectedTask?.id === taskId) setSelectedTask(prev => prev ? { ...prev, checklist } : null);
  };

  const handleSubmitTaskFeedback = (taskId: string, feedback: EmployeeFeedback) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, difficultyRating: feedback.difficultyRating, feedback: { ...t.feedback, employeeFeedback: feedback } } : t
    ));
    setEmployeeView('dashboard');
  };

  // ---------------- Admin handlers ----------------
  const handleAdminLogin = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setAppMode('admin');
        toast.success(`Welcome, ${data.user.name}!`);
      } else toast.error('Invalid credentials');
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
    }
  };

  const handleAssignTask = async (taskData: Omit<Task, 'id' | 'status' | 'completedAt'>) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
      toast.success('Task assigned successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign task');
    }
  };

  const handleAddSkill = (skillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = { ...skillData, id: `skill-${Date.now()}` };
    setSkills(prev => [...prev, newSkill]);
  };

  const handleUpdateSkill = (skillId: string, skillData: Partial<Skill>) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, ...skillData } : s));
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills(prev => prev.filter(s => s.id !== skillId));
  };

const handleLogout = () => {
  if (appMode === 'admin') {
    localStorage.removeItem('admin_currentUser');
  } else if (appMode === 'employee') {
    localStorage.removeItem('employee_currentUser');
  }
  localStorage.removeItem('appMode');

  setCurrentUser(null);
  setAppMode('select');
  setEmployeeView('dashboard');
  setAdminView('dashboard');
  setSelectedTask(null);
  setSelectedEmployeeId('');
};

  const getUserTasks = () => currentUser ? tasks.filter(t => t.assignedTo === currentUser.id) : [];
  const getEmployees = () => users.filter(u => u.role === 'employee');

  // ---------------- Render ----------------
  if (appMode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl animate-pulse-subtle" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-5xl w-full relative z-10 animate-fade-in">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl shadow-industrial-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h1 className="text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Optiwork</h1>
            <p className="text-xl text-muted-foreground">AI-Powered Workforce Optimization for Manufacturing Excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button onClick={() => setAppMode('employee')} className="group industrial-card p-10 hover:shadow-industrial-lg hover:scale-[1.02] transition-all duration-300 text-left">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center shadow-industrial transform group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-primary transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-2xl mb-3 text-foreground">Employee Access</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">Access your daily tasks, track skills, provide feedback, and stay connected with your team</p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <span>Login with Employee ID</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
            <button onClick={() => setAppMode('admin')} className="group industrial-card p-10 hover:shadow-industrial-lg hover:scale-[1.02] transition-all duration-300 text-left border-2 border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 rounded-xl flex items-center justify-center shadow-industrial transform group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0h2m-6 0h6" />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-foreground transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-2xl mb-3 text-foreground">Admin Dashboard</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">Smart assignment, workforce analytics, skill management, and comprehensive reporting tools</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <span>Supervisor & Manager Access</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <Toaster />
      </div>
    );
  } 

  // ---------------- Employee Mode ----------------
  if (appMode === 'employee') {
    if (!currentUser) {
      return <><EmployeeLogin onLogin={handleEmployeeLogin} employees={users.filter(u => u.role === 'employee')} /><Toaster /></>;
    }

    if (employeeView === 'skill-profile') {
      return <><EmployeeSkillProfile user={currentUser} skills={skills} tasks={getUserTasks()} onBack={() => setEmployeeView('dashboard')} /><Toaster /></>;
    }

    if (employeeView === 'task-feedback' && selectedTask) {
      return <><TaskFeedback task={selectedTask} onBack={() => setEmployeeView('dashboard')} onSubmitFeedback={handleSubmitTaskFeedback} /><Toaster /></>;
    }

    if (employeeView === 'task-details' && selectedTask) {
      const assignedBy = users.find(u => u.id === selectedTask.assignedBy);
      return <><TaskDetails task={selectedTask} assignedByName={assignedBy?.name || 'Supervisor'} onBack={() => setEmployeeView('dashboard')} onUpdateStatus={handleUpdateTaskStatus} onUpdateChecklist={handleUpdateChecklist} /><Toaster /></>;
    }

    return <><EmployeeDashboard user={currentUser} tasks={getUserTasks()} onTaskClick={handleTaskClick} onLogout={handleLogout} onViewSkills={() => setEmployeeView('skill-profile')} /><Toaster /></>;
  }

// ---------------- Admin Mode ----------------
if (appMode === 'admin') {
  if (!currentUser) {
    return (
      <>
        <AdminLogin onLogin={handleAdminLogin} />
        <Toaster />
      </>
    );
  }

  // Add these missing sections:
  if (adminView === 'skills') {
    return (
      <>
        <SkillLibrary
          skills={skills}
          onBack={() => setAdminView('dashboard')}
          onAddSkill={handleAddSkill}
          onUpdateSkill={handleUpdateSkill}
          onDeleteSkill={handleDeleteSkill}
        />
        <Toaster />
      </>
    );
  }

  if (adminView === 'smart-assign') {
    return (
      <>
        <SmartTaskAssignment
          employees={getEmployees()}
          skills={skills}
          tasks={tasks}
          currentUser={currentUser}
          onBack={() => setAdminView('dashboard')}
          onAssignTask={handleAssignTask}
        />
        <Toaster />
      </>
    );
  }

  if (adminView === 'analytics') {
    return (
      <>
        <WorkforceAnalytics
          employees={getEmployees()}
          reports={reports}
          performanceData={performanceData}
          skillGaps={skillGaps}
          analytics={analytics}
          onBack={() => setAdminView('dashboard')}
          onNavigateToPerformance={(empId) => {
            setSelectedEmployeeId(empId);
            setAdminView('employee-performance');
          }}
          onNavigateToSkillGaps={() => setAdminView('skill-gaps')}
        />
        <Toaster />
      </>
    );
  }

  if (adminView === 'employee-performance' && selectedEmployeeId) {
    const employee = users.find(u => u.id === selectedEmployeeId);
    const performance = performanceData.find(p => p.employeeId === selectedEmployeeId);
    
    if (employee && performance) {
      return (
        <>
          <EmployeePerformanceDetail
            employee={employee}
            performance={performance}
            tasks={tasks}
            skills={skills}
            trainingSuggestions={trainingSuggestions}
            onBack={() => setAdminView('analytics')}
          />
          <Toaster />
        </>
      );
    }
  }

  if (adminView === 'skill-gaps') {
    return (
      <>
        <SkillGapReport
          skillGaps={skillGaps}
          skills={skills}
          employees={getEmployees()}
          trainingSuggestions={trainingSuggestions}
          onBack={() => setAdminView('analytics')}
        />
        <Toaster />
      </>
    );
  }

  if (adminView === 'employees') {
    return (
      <>
        <EmployeeList
          employees={getEmployees()}
          tasks={tasks}
          onBack={() => setAdminView('dashboard')}
        />
        <Toaster />
      </>
    );
  }

  if (adminView === 'assign') {
    return (
      <>
        <TaskAssignment
          employees={getEmployees()}
          currentUser={currentUser}
          onBack={() => setAdminView('dashboard')}
          onAssignTask={handleAssignTask}
        />
        <Toaster />
      </>
    );
  }

if (adminView === 'reports') {
  return (
    <>
      <ReportsView
        tasks={tasks}
        employees={getEmployees()}
        onBack={() => setAdminView('dashboard')}
      />
      <Toaster />
    </>
  );
}

  // Default: Show Admin Dashboard
  return (
    <>
      <AdminDashboard
        user={currentUser}
        allTasks={tasks}
        allUsers={users}
        reports={reports}
        onNavigate={(view) => setAdminView(view as AdminView)}
        onLogout={handleLogout}
      />
      <Toaster />
    </>
  );
}

// Add final return null at end of component
return null;

};