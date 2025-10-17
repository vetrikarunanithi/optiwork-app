import { User, Task } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ArrowLeft, User as UserIcon, Briefcase, Clock } from 'lucide-react';
import { Progress } from '../ui/progress';

interface EmployeeListProps {
  employees: User[];
  tasks: Task[];
  onBack: () => void;
}

export function EmployeeList({ employees, tasks, onBack }: EmployeeListProps) {
  const getEmployeeStats = (employeeId: string) => {
    const employeeTasks = tasks.filter(t => t.assignedTo === employeeId);
    const completed = employeeTasks.filter(t => t.status === 'completed').length;
    const inProgress = employeeTasks.filter(t => t.status === 'in-progress').length;
    const total = employeeTasks.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return { completed, inProgress, total, completionRate };
  };

  const groupByDepartment = (employees: User[]) => {
    const grouped: { [key: string]: User[] } = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Other';
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(emp);
    });
    return grouped;
  };

  const groupedEmployees = groupByDepartment(employees);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1>Employee Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">
            Total Employees: {employees.length}
          </p>
        </div>

        {Object.entries(groupedEmployees).map(([department, deptEmployees]) => (
          <div key={department} className="mb-8">
            <h2 className="mb-4 text-gray-700">{department} Department</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {deptEmployees.map((employee) => {
                const stats = getEmployeeStats(employee.id);
                return (
                  <Card key={employee.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-600 text-white">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{employee.name}</CardTitle>
                            <p className="text-sm text-gray-600">{employee.employeeId}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50">
                          {employee.shift} Shift
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl">{stats.total}</p>
                          <p className="text-xs text-gray-600">Total Tasks</p>
                        </div>
                        <div>
                          <p className="text-2xl text-green-600">{stats.completed}</p>
                          <p className="text-xs text-gray-600">Completed</p>
                        </div>
                        <div>
                          <p className="text-2xl text-blue-600">{stats.inProgress}</p>
                          <p className="text-xs text-gray-600">In Progress</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="text-gray-600">Completion Rate</span>
                          <span>{stats.completionRate.toFixed(0)}%</span>
                        </div>
                        <Progress value={stats.completionRate} />
                      </div>

                      <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <span>{employee.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{employee.shift} Shift</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
