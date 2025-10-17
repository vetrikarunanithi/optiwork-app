import { useState } from 'react';
import { Task, User, DailyReport } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TaskStatusBadge } from '../shared/TaskStatusBadge';
import { AICoachingChatbot } from '../shared/AICoachingChatbot';
import { ThemeToggle } from '../shared/ThemeToggle';
import { ProductivityHeatmap } from '../shared/ProductivityHeatmap';
import { PredictiveAlertsPanel } from '../shared/PredictiveAlertsPanel';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileText, 
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDot,
  TrendingUp
} from 'lucide-react';
import { Progress } from '../ui/progress';
import { Toaster } from '../ui/sonner';

interface AdminDashboardProps {
  user: User;
  allTasks: Task[];
  allUsers: User[];
  reports: DailyReport[];
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({ 
  user, 
  allTasks, 
  allUsers,
  reports,
  onNavigate,
  onLogout 
}: AdminDashboardProps) {
  const [showAICoach, setShowAICoach] = useState(false);
  
  const todayReport = (() => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const todayTasks = allTasks.filter(task => task.dueDate === today);

  const totalTasks = todayTasks.length;
  const completed = todayTasks.filter(t => t.status === 'completed').length;
  const inProgress = todayTasks.filter(t => t.status === 'in-progress').length;
  const overdue = todayTasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    const now = new Date();
    return t.status !== 'completed' && dueDate < now;
  }).length;
  
  const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  return { totalTasks, completed, inProgress, overdue, completionRate };
})();

  const employees = allUsers.filter(u => u.role === 'employee');

  const getTaskCountByStatus = (status: string) => {
    return allTasks.filter(t => t.status === status).length;
  };

  // Mock data generators for advanced widgets
  const generateMockHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00'];
    const data = [];
    
    for (const day of days) {
      for (const hour of hours) {
        data.push({
          hour,
          day,
          productivity: Math.floor(Math.random() * 100),
          tasksCompleted: Math.floor(Math.random() * 20),
          utilization: Math.floor(Math.random() * 100),
          status: (['peak', 'normal', 'idle', 'bottleneck'] as const)[Math.floor(Math.random() * 4)]
        });
      }
    }
    return data;
  };

  const generateMockAlerts = () => {
    return [
      {
        id: '1',
        type: 'warning' as const,
        title: 'Workload Imbalance Detected',
        description: 'Team A has 15 tasks while Team B has only 3. Consider redistributing to optimize efficiency.',
        confidence: 87,
        impact: 'high' as const,
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'Redistribute Tasks',
          onClick: () => onNavigate('smart-assign')
        },
        dismissible: true
      },
      {
        id: '2',
        type: 'critical' as const,
        title: 'Potential Deadline Miss',
        description: '3 high-priority tasks are at risk of missing deadlines. Recommend shifting resources or adjusting timelines.',
        confidence: 92,
        impact: 'high' as const,
        timestamp: new Date(),
        actionable: true,
        action: {
          label: 'View Tasks',
          onClick: () => onNavigate('tasks')
        },
        dismissible: true
      },
      {
        id: '3',
        type: 'success' as const,
        title: 'Efficiency Improving',
        description: 'Overall team productivity is up 12% this week. Welding department showing exceptional performance.',
        confidence: 95,
        impact: 'medium' as const,
        timestamp: new Date(),
        actionable: false,
        dismissible: true
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Optiwork Admin</h1>
                <p className="text-xs text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                  <p className="text-3xl">{todayReport.totalTasks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl text-green-600">{todayReport.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-3xl text-blue-600">{todayReport.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overdue</p>
                  <p className="text-3xl text-red-600">{todayReport.overdue}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Rate */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Today's Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {todayReport.completed} of {todayReport.totalTasks} tasks completed
                </span>
                <span className="text-2xl">{todayReport.completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={todayReport.completionRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('employees')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="mb-1">Manage Employees</h3>
                  <p className="text-sm text-gray-600">{employees.length} active employees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('assign')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-1">Assign Tasks</h3>
                  <p className="text-sm text-gray-600">Create new assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('reports')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="mb-1">View Reports</h3>
                  <p className="text-sm text-gray-600">Daily & weekly analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Features */}
        <h2 className="mb-4 text-gray-700">Smart Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-200"
            onClick={() => onNavigate('smart-assign')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CircleDot className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="mb-1">Smart Assignment</h3>
                  <p className="text-sm text-gray-600">AI-powered matching</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('analytics')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="mb-1">Workforce Analytics</h3>
                  <p className="text-sm text-gray-600">Performance insights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('skills')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <CircleDot className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="mb-1">Skill Library</h3>
                  <p className="text-sm text-gray-600">Manage skills & certs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-red-200"
            onClick={() => onNavigate('skill-gaps')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="mb-1">Skill Gaps</h3>
                  <p className="text-sm text-gray-600">Training needs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Productivity Heatmap */}
          <ProductivityHeatmap
            data={generateMockHeatmapData()}
            title="Team Productivity Overview"
          />

          {/* Predictive Alerts */}
          <PredictiveAlertsPanel
            alerts={generateMockAlerts()}
            onDismiss={(id) => console.log('Dismissed alert:', id)}
          />
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allTasks.slice(0, 5).map((task) => {
                const employee = allUsers.find(u => u.id === task.assignedTo);
                return (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="mb-2">{task.title}</h4>
                      <div className="flex items-center gap-3">
                        <TaskStatusBadge status={task.status} />
                        <span className="text-sm text-gray-600">
                          Assigned to: {employee?.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {task.startTime} - {task.endTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
