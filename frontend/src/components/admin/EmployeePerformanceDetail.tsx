import { User, EmployeePerformance, Task, Skill, TrainingSuggestion } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
// import { SkillBadge } from '../shared/SkillBadge';
import { ArrowLeft, TrendingUp, Clock, Target, Award, BookOpen, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface EmployeePerformanceDetailProps {
  employee: User;
  performance: EmployeePerformance;
  tasks: Task[];
  skills: Skill[];
  trainingSuggestions: TrainingSuggestion[];
  onBack: () => void;
}

export function EmployeePerformanceDetail({ 
  employee, 
  performance, 
  tasks,
  skills,
  trainingSuggestions,
  onBack 
}: EmployeePerformanceDetailProps) {
  const employeeTasks = tasks.filter(t => t.assignedTo === employee.id);
  const completedTasks = employeeTasks.filter(t => t.status === 'completed');
  const recentTasks = employeeTasks.slice(0, 5);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const skillUsageData = performance.skillsUsed.map(su => {
    const skill = skills.find(s => s.id === su.skillId);
    return {
      name: skill?.name || 'Unknown',
      count: su.count
    };
  });

  const employeeTraining = trainingSuggestions.filter(ts => ts.employeeId === employee.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1>{employee.name}</h1>
              <p className="text-sm text-gray-600">{employee.employeeId} • {employee.department}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Score Card */}
        <Card className="mb-8 border-2 border-blue-500">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Overall Performance Score</p>
                <p className={`text-5xl ${getPerformanceColor(performance.completionRate)}`}>
                  {performance.completionRate}%
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  {getPerformanceLabel(performance.completionRate)}
                </p>
              </div>
              <div className="text-right">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-12 h-12 text-blue-600" />
                </div>
                <Badge className="bg-blue-600">{employee.shift} Shift</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-5 h-5 text-gray-500" />
                <p className="text-2xl">{performance.tasksCompleted}</p>
              </div>
              <p className="text-sm text-gray-600">Tasks Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <p className="text-2xl">{performance.averageTaskTime}m</p>
              </div>
              <p className="text-sm text-gray-600">Avg Task Time</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <p className="text-2xl text-green-600">{performance.onTimeDeliveryRate}%</p>
              </div>
              <p className="text-sm text-gray-600">On-Time Delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-gray-500" />
                <p className="text-2xl text-yellow-600">{performance.qualityScore.toFixed(1)}</p>
              </div>
              <p className="text-sm text-gray-600">Quality Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7-Day Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performance.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="completionRate" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Completion Rate (%)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="tasksCompleted" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Tasks Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Employee Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Current Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {employee.skills && employee.skills.length > 0 ? (
                employee.skills.map((skill) => {
                  const hasCert = skill.certifications?.some(c => c.status === 'active');
                  const hasExpiredCert = skill.certifications?.some(c => c.status === 'expired');
                  
                  return (
                    <div key={skill.skillId} className="p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span>{skill.skillName}</span>
                        <div className="flex gap-2 items-center">
                          {hasCert && <Award className="w-4 h-4 text-green-600" />}
                          {hasExpiredCert && <AlertCircle className="w-4 h-4 text-red-600" />}
                          <Badge variant="outline" className={
                            skill.level === 'expert' ? 'bg-amber-100 text-amber-800' :
                            skill.level === 'advanced' ? 'bg-purple-100 text-purple-800' :
                            skill.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {skill.level}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {skill.yearsExperience} {skill.yearsExperience === 1 ? 'year' : 'years'} experience
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No skills assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Training Suggestions */}
        {employeeTraining.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Training Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {employeeTraining.map((suggestion, idx) => {
                const skill = skills.find(s => s.id === suggestion.skillId);
                return (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                    suggestion.priority === 'high' ? 'border-red-500 bg-red-50' :
                    suggestion.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{skill?.name}</h4>
                        <p className="text-sm text-gray-700">{suggestion.reason}</p>
                      </div>
                      <Badge className={
                        suggestion.priority === 'high' ? 'bg-red-600' :
                        suggestion.priority === 'medium' ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }>
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      Based on: {suggestion.basedOn.replace('-', ' ')}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Recent Tasks */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-4 rounded-lg bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <Badge className={
                    task.status === 'completed' ? 'bg-green-600' :
                    task.status === 'in-progress' ? 'bg-blue-600' :
                    task.status === 'overdue' ? 'bg-red-600' :
                    'bg-gray-600'
                  }>
                    {task.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{task.startTime} - {task.endTime}</span>
                  {task.qualityRating && (
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Quality: {task.qualityRating}/5
                    </span>
                  )}
                  {task.difficultyRating && (
                    <span>Difficulty: {task.difficultyRating}/5</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
