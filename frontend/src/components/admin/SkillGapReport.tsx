import { SkillGap, Skill, User, TrainingSuggestion } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ArrowLeft, TrendingUp, AlertTriangle, Users, BookOpen, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface SkillGapReportProps {
  skillGaps: SkillGap[];
  skills: Skill[];
  employees: User[];
  trainingSuggestions: TrainingSuggestion[];
  onBack: () => void;
}

export function SkillGapReport({ skillGaps, skills, employees, trainingSuggestions, onBack }: SkillGapReportProps) {
  const getGapColor = (utilization: number) => {
    if (utilization >= 80) return '#ef4444'; // red
    if (utilization >= 60) return '#f59e0b'; // orange
    if (utilization >= 40) return '#3b82f6'; // blue
    return '#10b981'; // green
  };

  const getGapStatus = (utilization: number) => {
    if (utilization >= 80) return { label: 'Critical', color: 'bg-red-600' };
    if (utilization >= 60) return { label: 'High', color: 'bg-orange-600' };
    if (utilization >= 40) return { label: 'Moderate', color: 'bg-blue-600' };
    return { label: 'Low', color: 'bg-green-600' };
  };

  const criticalSkills = skillGaps.filter(sg => sg.utilization >= 80);
  const highDemand = skillGaps.filter(sg => sg.utilization >= 60 && sg.utilization < 80);
  const balanced = skillGaps.filter(sg => sg.utilization < 60);

  const demandSupplyData = skillGaps.map(sg => ({
    name: sg.skillName,
    demand: sg.demand,
    supply: sg.supply,
    utilization: sg.utilization
  }));

  const groupedTraining = trainingSuggestions.reduce((acc, ts) => {
    if (!acc[ts.skillId]) {
      const skill = skills.find(s => s.id === ts.skillId);
      acc[ts.skillId] = {
        skillName: skill?.name || 'Unknown',
        employees: []
      };
    }
    const emp = employees.find(e => e.id === ts.employeeId);
    if (emp) {
      acc[ts.skillId].employees.push(emp.name);
    }
    return acc;
  }, {} as Record<string, { skillName: string; employees: string[] }>);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <h1>Skill Gap Analysis</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-3xl text-red-600">{criticalSkills.length}</p>
              </div>
              <p className="text-sm text-gray-600">Critical Skill Gaps</p>
              <p className="text-xs text-gray-500 mt-1">Utilization {'>'} 80%</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <p className="text-3xl text-orange-600">{highDemand.length}</p>
              </div>
              <p className="text-sm text-gray-600">High Demand Skills</p>
              <p className="text-xs text-gray-500 mt-1">Utilization 60-80%</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <p className="text-3xl text-green-600">{balanced.length}</p>
              </div>
              <p className="text-sm text-gray-600">Balanced Skills</p>
              <p className="text-xs text-gray-500 mt-1">Utilization {'<'} 60%</p>
            </CardContent>
          </Card>
        </div>

        {/* Demand vs Supply Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demand vs Supply Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={demandSupplyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="demand" fill="#ef4444" name="Demand (tasks/week)" />
                <Bar dataKey="supply" fill="#10b981" name="Supply (employees)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical Skills */}
        {criticalSkills.length > 0 && (
          <Card className="mb-8 border-2 border-red-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-red-900">Critical Skill Gaps - Immediate Action Required</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalSkills.map((sg) => (
                <div key={sg.skillId} className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg text-red-900 mb-1">{sg.skillName}</h4>
                      <div className="flex gap-4 text-sm text-gray-700">
                        <span>Demand: {sg.demand} tasks/week</span>
                        <span>•</span>
                        <span>Supply: {sg.supply} {sg.supply === 1 ? 'employee' : 'employees'}</span>
                        <span>•</span>
                        <span>Gap: {sg.gap}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl text-red-600">{sg.utilization}%</p>
                      <p className="text-xs text-gray-600">Utilization</p>
                    </div>
                  </div>
                  <Progress value={sg.utilization} className="h-2 mb-3" />
                  <div className="p-3 rounded bg-white border border-red-300">
                    <p className="text-sm text-red-900">
                      <strong>Recommendation:</strong> Urgent training needed for {Math.ceil(sg.gap / 10)} additional employees
                      or consider hiring specialists.
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* High Demand Skills */}
        {highDemand.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                High Demand Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {highDemand.map((sg) => (
                <div key={sg.skillId} className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">{sg.skillName}</h4>
                      <div className="flex gap-4 text-sm text-gray-700">
                        <span>Demand: {sg.demand}</span>
                        <span>•</span>
                        <span>Supply: {sg.supply}</span>
                        <span>•</span>
                        <span>Gap: {sg.gap}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl text-orange-600">{sg.utilization}%</p>
                      <Badge className="bg-orange-600 mt-1">High Priority</Badge>
                    </div>
                  </div>
                  <Progress value={sg.utilization} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* All Skills Detail */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Complete Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillGaps.map((sg) => {
                const status = getGapStatus(sg.utilization);
                return (
                  <div key={sg.skillId} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4>{sg.skillName}</h4>
                          <Badge className={status.color}>{status.label}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Demand</p>
                            <p className="text-lg">{sg.demand} tasks/week</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Supply</p>
                            <p className="text-lg">{sg.supply} employees</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Gap</p>
                            <p className="text-lg">{sg.gap}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-3xl" style={{ color: getGapColor(sg.utilization) }}>
                          {sg.utilization}%
                        </p>
                        <p className="text-xs text-gray-600">Utilization</p>
                      </div>
                    </div>
                    <Progress value={sg.utilization} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Training Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Training Recommendations by Skill
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(groupedTraining).map(([skillId, data]) => (
              <div key={skillId} className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="mb-3">{data.skillName}</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Recommended for training:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.employees.map((empName, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white">
                        {empName}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
