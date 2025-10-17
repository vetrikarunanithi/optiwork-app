import { User, DailyReport, EmployeePerformance, SkillGap, WorkforceAnalytics as Analytics } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, TrendingUp, Users, Zap, AlertTriangle, Award, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WorkforceAnalyticsProps {
  employees: User[];
  reports: DailyReport[];
  performanceData: EmployeePerformance[];
  skillGaps: SkillGap[];
  analytics: Analytics;
  onBack: () => void;
  onNavigateToPerformance: (employeeId: string) => void;
  onNavigateToSkillGaps: () => void;
}

export function WorkforceAnalytics({ 
  employees, 
  reports, 
  performanceData,
  skillGaps,
  analytics,
  onBack,
  onNavigateToPerformance,
  onNavigateToSkillGaps
}: WorkforceAnalyticsProps) {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 75) return 'text-green-600';
    if (utilization >= 50) return 'text-blue-600';
    if (utilization >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUtilizationBg = (utilization: number) => {
    if (utilization >= 75) return 'bg-green-50 border-green-200';
    if (utilization >= 50) return 'bg-blue-50 border-blue-200';
    if (utilization >= 30) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const topPerformers = employees.filter(e => analytics.topPerformers.includes(e.id));
  const highDemandSkillGaps = skillGaps.filter(sg => sg.utilization > 80).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <h1>Workforce Analytics</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Employee Performance</TabsTrigger>
            <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Overall Utilization</p>
                      <p className={`text-3xl ${getUtilizationColor(analytics.overallUtilization)}`}>
                        {analytics.overallUtilization}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <Progress value={analytics.overallUtilization} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Active Employees</p>
                      <p className="text-3xl">{employees.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">High Demand Skills</p>
                      <p className="text-3xl text-orange-600">{analytics.skillsInDemand.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rework Incidents</p>
                      <p className="text-3xl text-red-600">{analytics.reworkIncidents}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle>7-Day Completion Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reports.slice().reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completionRate" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Completion Rate (%)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Completed Tasks"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performers & High Demand Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topPerformers.map((emp, idx) => {
                    const perf = performanceData.find(p => p.employeeId === emp.id);
                    return (
                      <div 
                        key={emp.id}
                        className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => onNavigateToPerformance(emp.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div>
                              <h4>{emp.name}</h4>
                              <p className="text-sm text-gray-600">{emp.department}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl text-green-600">{perf?.completionRate}%</p>
                            <p className="text-xs text-gray-600">Completion Rate</p>
                          </div>
                        </div>
                        <Progress value={perf?.completionRate || 0} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    High Demand Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {highDemandSkillGaps.map((sg) => (
                    <div 
                      key={sg.skillId}
                      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getUtilizationBg(sg.utilization)}`}
                      onClick={onNavigateToSkillGaps}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4>{sg.skillName}</h4>
                          <p className="text-sm text-gray-600">
                            {sg.supply} {sg.supply === 1 ? 'employee' : 'employees'} • {sg.demand} tasks/week
                          </p>
                        </div>
                        <div className={`text-2xl ${getUtilizationColor(sg.utilization)}`}>
                          {sg.utilization}%
                        </div>
                      </div>
                      <Progress value={sg.utilization} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {performanceData.map((perf) => {
                const emp = employees.find(e => e.id === perf.employeeId);
                if (!emp) return null;

                return (
                  <Card 
                    key={perf.employeeId}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onNavigateToPerformance(perf.employeeId)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{emp.name}</CardTitle>
                          <p className="text-sm text-gray-600">{emp.employeeId} • {emp.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl text-blue-600">{perf.completionRate}%</p>
                          <p className="text-xs text-gray-600">Completion</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xl">{perf.tasksCompleted}</p>
                          <p className="text-xs text-gray-600">Completed</p>
                        </div>
                        <div>
                          <p className="text-xl text-yellow-600">{perf.qualityScore.toFixed(1)}</p>
                          <p className="text-xs text-gray-600">Quality Score</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">On-Time Delivery</p>
                        <Progress value={perf.onTimeDeliveryRate} />
                        <p className="text-xs text-right mt-1 text-gray-600">{perf.onTimeDeliveryRate}%</p>
                      </div>

                      <div>
                        <ResponsiveContainer width="100%" height={100}>
                          <LineChart data={perf.performanceTrend}>
                            <Line 
                              type="monotone" 
                              dataKey="completionRate" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Utilization Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={skillGaps}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skillName" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillGaps.map((sg) => (
                <Card key={sg.skillId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sg.skillName}</CardTitle>
                      <div className={`text-2xl ${getUtilizationColor(sg.utilization)}`}>
                        {sg.utilization}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xl text-red-600">{sg.demand}</p>
                        <p className="text-xs text-gray-600">Demand</p>
                      </div>
                      <div>
                        <p className="text-xl text-blue-600">{sg.supply}</p>
                        <p className="text-xs text-gray-600">Supply</p>
                      </div>
                      <div>
                        <p className="text-xl text-orange-600">{sg.gap}</p>
                        <p className="text-xs text-gray-600">Gap</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Utilization</span>
                        <span className={getUtilizationColor(sg.utilization)}>{sg.utilization}%</span>
                      </div>
                      <Progress value={sg.utilization} />
                    </div>

                    {sg.utilization > 80 && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-800">
                          ⚠️ High utilization - consider training more employees
                        </p>
                      </div>
                    )}

                    {sg.utilization < 40 && (
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-800">
                          ℹ️ Low utilization - skill may be underused
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
