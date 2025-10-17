import { useState } from 'react';
import { User, Task, TaskPriority, EmployeeMatch, MatchReason, Skill } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { ArrowLeft, Sparkles, CheckCircle, TrendingUp, Clock, Award, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SmartTaskAssignmentProps {
  employees: User[];
  skills: Skill[];
  tasks: Task[];
  currentUser: User;
  onBack: () => void;
  onAssignTask: (task: Omit<Task, 'id' | 'status' | 'completedAt'>) => void;
}

export function SmartTaskAssignment({ 
  employees, 
  skills,
  tasks,
  currentUser, 
  onBack, 
  onAssignTask 
}: SmartTaskAssignmentProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    startTime: '09:00',
    endTime: '10:00',
    dueDate: new Date().toISOString().split('T')[0],
    notes: '',
    requiredSkills: [] as string[]
  });

  const [showMatches, setShowMatches] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  const calculateEmployeeMatch = (employee: User): EmployeeMatch => {
    const reasons: MatchReason[] = [];
    let skillMatch = 0;
    let workloadScore = 0;
    let performanceScore = 0;
    let availability = true;

    // Calculate skill match
    if (formData.requiredSkills.length > 0) {
      const employeeSkillIds = employee.skills?.map(s => s.skillId) || [];
      const matchedSkills = formData.requiredSkills.filter(reqSkill => 
        employeeSkillIds.includes(reqSkill)
      );
      skillMatch = (matchedSkills.length / formData.requiredSkills.length) * 100;

      matchedSkills.forEach(skillId => {
        const skill = skills.find(s => s.id === skillId);
        const empSkill = employee.skills?.find(s => s.skillId === skillId);
        if (skill && empSkill) {
          const hasCert = empSkill.certifications?.some(c => c.status === 'active');
          reasons.push({
            type: 'skill',
            label: `${skill.name} - ${empSkill.level} level${hasCert ? ' (Certified)' : ''}`,
            impact: 'positive'
          });
        }
      });

      const missingSkills = formData.requiredSkills.filter(reqSkill => 
        !employeeSkillIds.includes(reqSkill)
      );
      missingSkills.forEach(skillId => {
        const skill = skills.find(s => s.id === skillId);
        if (skill) {
          reasons.push({
            type: 'skill',
            label: `Missing: ${skill.name}`,
            impact: 'negative'
          });
        }
      });
    } else {
      skillMatch = 100; // No specific skills required
    }

    // Calculate workload score
    const workload = employee.currentWorkload || 0;
    workloadScore = 100 - workload;
    
    if (workload < 40) {
      reasons.push({
        type: 'workload',
        label: `Low current workload (${workload}%)`,
        impact: 'positive'
      });
    } else if (workload > 75) {
      reasons.push({
        type: 'workload',
        label: `High current workload (${workload}%)`,
        impact: 'negative'
      });
    }

    // Performance score
    performanceScore = employee.performanceScore || 0;
    if (performanceScore >= 90) {
      reasons.push({
        type: 'performance',
        label: `Excellent performance rating (${performanceScore}/100)`,
        impact: 'positive'
      });
    } else if (performanceScore < 75) {
      reasons.push({
        type: 'performance',
        label: `Below average performance (${performanceScore}/100)`,
        impact: 'neutral'
      });
    }

    // Check availability (shift match with task time)
    const taskHour = parseInt(formData.startTime.split(':')[0]);
    if (employee.shift === 'Morning' && taskHour < 16) {
      availability = true;
      reasons.push({
        type: 'availability',
        label: `Available (${employee.shift} shift)`,
        impact: 'positive'
      });
    } else if (employee.shift === 'Afternoon' && taskHour >= 14) {
      availability = true;
      reasons.push({
        type: 'availability',
        label: `Available (${employee.shift} shift)`,
        impact: 'positive'
      });
    } else {
      availability = false;
      reasons.push({
        type: 'availability',
        label: `Not on shift during task time`,
        impact: 'negative'
      });
    }

    // Calculate overall match score
    const matchScore = Math.round(
      (skillMatch * 0.4) + 
      (workloadScore * 0.3) + 
      (performanceScore * 0.2) +
      (availability ? 10 : 0)
    );

    return {
      employee,
      matchScore,
      reasons,
      skillMatch,
      workloadScore,
      performanceScore,
      availability
    };
  };

  const getEmployeeMatches = (): EmployeeMatch[] => {
    if (!showMatches) return [];
    return employees
      .map(calculateEmployeeMatch)
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const matches = getEmployeeMatches();
  const bestMatch = matches[0];

  const handleFindMatches = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in task details first');
      return;
    }
    setShowMatches(true);
  };

  const handleQuickAssign = (employeeId: string) => {
    setSelectedEmployee(employeeId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    const newTask: Omit<Task, 'id' | 'status' | 'completedAt'> = {
      ...formData,
      assignedTo: selectedEmployee,
      assignedBy: currentUser.id
    };

    onAssignTask(newTask);
    toast.success('Task assigned with smart matching!');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      startTime: '09:00',
      endTime: '10:00',
      dueDate: new Date().toISOString().split('T')[0],
      notes: '',
      requiredSkills: []
    });
    setShowMatches(false);
    setSelectedEmployee('');
  };

  const toggleSkill = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skillId)
        ? prev.requiredSkills.filter(id => id !== skillId)
        : [...prev.requiredSkills, skillId]
    }));
    setShowMatches(false); // Reset matches when skills change
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h1>Optiwork Smart Assignment</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Machine Setup - Line A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide detailed instructions"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: TaskPriority) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => {
                          setFormData({ ...formData, startTime: e.target.value });
                          setShowMatches(false);
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional instructions"
                      rows={2}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                      <Checkbox
                        id={skill.id}
                        checked={formData.requiredSkills.includes(skill.id)}
                        onCheckedChange={() => toggleSkill(skill.id)}
                      />
                      <label
                        htmlFor={skill.id}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span>{skill.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={handleFindMatches}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Find Best Match
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Employee Matches */}
          <div className="space-y-6">
            {!showMatches ? (
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-12 text-center">
                  <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="mb-2">AI-Powered Matching</h3>
                  <p className="text-gray-600">
                    Fill in the task details and click "Find Best Match" to see intelligent employee recommendations
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Best Match Highlight */}
                {bestMatch && (
                  <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <CardTitle className="text-purple-900">Best Match</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <EmployeeMatchCard 
                        match={bestMatch} 
                        isSelected={selectedEmployee === bestMatch.employee.id}
                        onSelect={() => handleQuickAssign(bestMatch.employee.id)}
                        isBest
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Other Matches */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Candidates ({matches.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                    {matches.map((match) => (
                      <EmployeeMatchCard
                        key={match.employee.id}
                        match={match}
                        isSelected={selectedEmployee === match.employee.id}
                        onSelect={() => handleQuickAssign(match.employee.id)}
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* Assign Button */}
                {selectedEmployee && (
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Assign Task to Selected Employee
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmployeeMatchCardProps {
  match: EmployeeMatch;
  isSelected: boolean;
  onSelect: () => void;
  isBest?: boolean;
}

function EmployeeMatchCard({ match, isSelected, onSelect, isBest }: EmployeeMatchCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              {match.employee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="flex items-center gap-2">
              {match.employee.name}
              {isBest && <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            </h4>
            <p className="text-sm text-gray-600">
              {match.employee.employeeId} • {match.employee.department}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl ${getMatchColor(match.matchScore)}`}>
            {match.matchScore}%
          </div>
          <div className="text-xs text-gray-600">Match Score</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Skill Match</span>
          <span className={getMatchColor(match.skillMatch)}>{Math.round(match.skillMatch)}%</span>
        </div>
        <Progress value={match.skillMatch} className="h-1" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Workload</span>
          <span>{match.employee.currentWorkload}%</span>
        </div>
        <Progress value={match.employee.currentWorkload || 0} className="h-1" />
      </div>

      <div className="space-y-1">
        {match.reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
              reason.impact === 'positive' ? 'bg-green-500' :
              reason.impact === 'negative' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className={
              reason.impact === 'positive' ? 'text-gray-700' :
              reason.impact === 'negative' ? 'text-gray-500' : 'text-gray-600'
            }>
              {reason.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
