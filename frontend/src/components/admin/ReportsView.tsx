import { Task, User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

interface ReportsViewProps {
  tasks: Task[];
  employees: User[];
  onBack: () => void;
}

export function ReportsView({ tasks, employees, onBack }: ReportsViewProps) {
  
  // ✅ Calculate today's report from actual tasks
  const todayReport = (() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.dueDate === today);

    const totalTasks = todayTasks.length;
    const completed = todayTasks.filter(t => t.status === 'completed').length;
    const inProgress = todayTasks.filter(t => t.status === 'in-progress').length;
    const pending = todayTasks.filter(t => t.status === 'pending').length;
    const overdue = todayTasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const now = new Date();
      return t.status !== 'completed' && dueDate < now;
    }).length;

    const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

    return {
      date: today,
      totalTasks,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate
    };
  })();

  // ✅ Calculate yesterday's report
  const yesterdayReport = (() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    const yesterdayTasks = tasks.filter(task => task.dueDate === yesterdayDate);

    const totalTasks = yesterdayTasks.length;
    const completed = yesterdayTasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

    return {
      date: yesterdayDate,
      totalTasks,
      completed,
      completionRate
    };
  })();

  // ✅ Calculate last 3 days reports
  const reportsLast3Days = (() => {
    const reports = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => task.dueDate === dateStr);

      const totalTasks = dayTasks.length;
      const completed = dayTasks.filter(t => t.status === 'completed').length;
      const inProgress = dayTasks.filter(t => t.status === 'in-progress').length;
      const pending = dayTasks.filter(t => t.status === 'pending').length;
      const overdue = dayTasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        const now = new Date();
        return t.status !== 'completed' && dueDate < now;
      }).length;
      const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

      reports.push({
        date: dateStr,
        totalTasks,
        completed,
        inProgress,
        pending,
        overdue,
        completionRate
      });
    }
    return reports;
  })();

  const completionTrend = todayReport.completionRate - yesterdayReport.completionRate;

  // ✅ Calculate employee performance from actual tasks
  const getEmployeePerformance = () => {
    return employees.map(emp => {
      const empTasks = tasks.filter(t => t.assignedTo === emp.id);
      const completed = empTasks.filter(t => t.status === 'completed').length;
      const total = empTasks.length;
      const rate = total > 0 ? (completed / total) * 100 : 0;

      return {
        employee: emp,
        completed,
        total,
        rate
      };
    }).sort((a, b) => b.rate - a.rate);
  };

  const employeePerformance = getEmployeePerformance();

  // ✅ Export function with real data
  const handleExport = () => {
    const csvContent = [
      ['Date', 'Total Tasks', 'Completed', 'In Progress', 'Pending', 'Overdue', 'Completion Rate'],
      ...reportsLast3Days.map(r => [
        r.date,
        r.totalTasks,
        r.completed,
        r.inProgress,
        r.pending,
        r.overdue,
        `${r.completionRate.toFixed(1)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1>Reports & Analytics</h1>
            </div>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Overview */}
        <div className="mb-8">
          <h2 className="mb-4 text-gray-700">Today's Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                <p className="text-2xl">{todayReport.totalTasks}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl text-green-600">{todayReport.completed}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl text-blue-600">{todayReport.inProgress}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl text-gray-600">{todayReport.pending}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <p className="text-2xl text-red-600">{todayReport.overdue}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Completion Rate Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Completion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl mb-1">{todayReport.completionRate.toFixed(1)}%</p>
                  <div className="flex items-center gap-2">
                    {completionTrend >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${completionTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(completionTrend).toFixed(1)}% vs yesterday
                    </span>
                  </div>
                </div>
              </div>
              <Progress value={todayReport.completionRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Last 3 Days Report */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Last 3 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsLast3Days.map((report, index) => (
                <div key={report.date} className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="mb-1">
                        {new Date(report.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {index === 0 && (
                        <Badge className="bg-blue-100 text-blue-800">Today</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl mb-1">{report.completionRate.toFixed(0)}%</p>
                      <p className="text-sm text-gray-600">{report.completed}/{report.totalTasks} completed</p>
                    </div>
                  </div>
                  <Progress value={report.completionRate} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeePerformance.map((perf) => (
                <div key={perf.employee.id} className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="mb-1">{perf.employee.name}</p>
                      <p className="text-sm text-gray-600">
                        {perf.employee.employeeId} • {perf.employee.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl mb-1">{perf.rate.toFixed(0)}%</p>
                      <p className="text-sm text-gray-600">{perf.completed}/{perf.total} tasks</p>
                    </div>
                  </div>
                  <Progress value={perf.rate} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
