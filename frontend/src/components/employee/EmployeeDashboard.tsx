import { useState } from 'react';
import { Task, User } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { TaskStatusBadge } from '../shared/TaskStatusBadge';
import { PriorityBadge } from '../shared/PriorityBadge';
import { AICoachingChatbot } from '../shared/AICoachingChatbot';
import { ThemeToggle } from '../shared/ThemeToggle';
import { ScrollArea } from '../ui/scroll-area';
import { Calendar, Clock, User as UserIcon, Bell, LogOut, ChevronRight, Award, Briefcase } from 'lucide-react';
import { Badge } from '../ui/badge';

interface EmployeeDashboardProps {
  user: User;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onLogout: () => void;
  onViewSkills?: () => void;
}

export function EmployeeDashboard({ user, tasks, onTaskClick, onLogout, onViewSkills }: EmployeeDashboardProps) {
  const [showAICoach, setShowAICoach] = useState(false);
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;

  const getTasksByStatus = (status: string) => {
    return tasks.filter(t => t.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg">{user.name}</h1>
              <p className="text-sm text-blue-100">{user.employeeId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{today}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Department: {user.department}</span>
            <span className="text-sm">•</span>
            <span className="text-sm">Shift: {user.shift}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-4 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card className="bg-white shadow-md">
            <CardContent className="p-4">
              <div className="text-2xl mb-1">{completedTasks}/{totalTasks}</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-4">
              <div className="text-2xl mb-1">{Math.round((completedTasks/totalTasks) * 100)}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </CardContent>
          </Card>
        </div>
        
        {/* View Skills Button */}
        {onViewSkills && (
          <Button 
            onClick={onViewSkills}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Award className="w-4 h-4 mr-2" />
            View My Skills & Certifications
          </Button>
        )}
      </div>

      {/* Task Sections */}
      <div className="px-4 pb-4">
        <ScrollArea className="h-[calc(100vh-360px)]">
          <div className="space-y-4">
            {/* In Progress Tasks */}
            {getTasksByStatus('in-progress').length > 0 && (
              <div>
                <h2 className="mb-3 text-gray-700">In Progress</h2>
                <div className="space-y-3">
                  {getTasksByStatus('in-progress').map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                  ))}
                </div>
              </div>
            )}

            {/* Pending Tasks */}
            {getTasksByStatus('pending').length > 0 && (
              <div>
                <h2 className="mb-3 text-gray-700">Pending Tasks</h2>
                <div className="space-y-3">
                  {getTasksByStatus('pending').map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {getTasksByStatus('completed').length > 0 && (
              <div>
                <h2 className="mb-3 text-gray-700">Completed Today</h2>
                <div className="space-y-3">
                  {getTasksByStatus('completed').map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* AI Coaching Chatbot */}
      {showAICoach && (
        <AICoachingChatbot
          userName={user.name}
          userRole="employee"
          onClose={() => setShowAICoach(false)}
        />
      )}

      {/* Floating AI Coach Button */}
      {!showAICoach && (
        <Button
          onClick={() => setShowAICoach(true)}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-industrial-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-40 animate-scale-in"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        </Button>
      )}
    </div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="mb-2">{task.title}</h3>
            <div className="flex flex-wrap gap-2">
              <TaskStatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{task.startTime} - {task.endTime}</span>
          </div>
        </div>

        {task.checklist && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-sm text-gray-600">
              Progress: {task.checklist.filter(i => i.completed).length}/{task.checklist.length} items
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ 
                  width: `${(task.checklist.filter(i => i.completed).length / task.checklist.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
