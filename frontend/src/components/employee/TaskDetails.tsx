import { useState } from 'react';
import { Task, ChecklistItem } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { TaskStatusBadge } from '../shared/TaskStatusBadge';
import { PriorityBadge } from '../shared/PriorityBadge';
import { CollaborationPanel } from '../shared/CollaborationPanel';
import { ScrollArea } from '../ui/scroll-area';
import { ArrowLeft, Clock, Calendar, User, FileText, CheckCircle2, PlayCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface TaskDetailsProps {
  task: Task;
  assignedByName: string;
  onBack: () => void;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  onUpdateChecklist: (taskId: string, checklist: ChecklistItem[]) => void;
}

export function TaskDetails({ 
  task, 
  assignedByName, 
  onBack, 
  onUpdateStatus,
  onUpdateChecklist 
}: TaskDetailsProps) {
  const [localChecklist, setLocalChecklist] = useState(task.checklist || []);

  const handleChecklistToggle = (itemId: string) => {
    const updated = localChecklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setLocalChecklist(updated);
    onUpdateChecklist(task.id, updated);
  };

  const handleStartTask = () => {
    onUpdateStatus(task.id, 'in-progress');
  };

  const handleCompleteTask = () => {
    onUpdateStatus(task.id, 'completed');
  };

  const allChecklistCompleted = localChecklist.length > 0 
    ? localChecklist.every(item => item.completed)
    : true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1>Task Details</h1>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-4 space-y-4">
          {/* Task Header Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-3">
                <TaskStatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
              <CardTitle>{task.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{task.startTime} - {task.endTime}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Assigned by: {assignedByName}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-1" />
                  <span className="text-sm text-gray-600">Description</span>
                </div>
                <p className="text-gray-700 ml-6">{task.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {task.notes && (
            <Alert>
              <AlertDescription>
                <span className="block text-sm text-gray-600 mb-1">Supervisor Notes:</span>
                {task.notes}
              </AlertDescription>
            </Alert>
          )}

          {/* Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Checklist</CardTitle>
                <p className="text-sm text-gray-600">
                  {localChecklist.filter(i => i.completed).length} of {localChecklist.length} completed
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localChecklist.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.completed}
                        onCheckedChange={() => handleChecklistToggle(item.id)}
                        className="mt-1"
                        disabled={task.status === 'completed'}
                      />
                      <label
                        htmlFor={item.id}
                        className={`flex-1 cursor-pointer ${
                          item.completed ? 'line-through text-gray-500' : 'text-gray-700'
                        }`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pb-4">
            {task.status === 'pending' && (
              <Button 
                className="w-full h-14 bg-blue-600 hover:bg-blue-700"
                onClick={handleStartTask}
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Task
              </Button>
            )}

            {task.status === 'in-progress' && (
              <Button 
                className="w-full h-14 bg-green-600 hover:bg-green-700"
                onClick={handleCompleteTask}
                disabled={!allChecklistCompleted}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Mark as Completed
              </Button>
            )}

            {task.status === 'in-progress' && !allChecklistCompleted && (
              <p className="text-sm text-center text-gray-600">
                Complete all checklist items to finish this task
              </p>
            )}

            {task.status === 'completed' && (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-800">Task Completed!</p>
                {task.completedAt && (
                  <p className="text-sm text-green-600 mt-1">
                    Completed at {new Date(task.completedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Collaboration Panel */}
          <CollaborationPanel
            taskId={task.id}
            comments={generateMockComments()}
            attachments={generateMockAttachments()}
            linkedItems={generateMockLinkedItems()}
            onAddComment={(comment) => console.log('Added comment:', comment)}
            onAddAttachment={(file) => console.log('Added attachment:', file)}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

// Mock data generators
function generateMockComments() {
  return [
    {
      id: '1',
      author: 'Sarah Martinez',
      authorRole: 'Supervisor',
      content: 'Great progress on this task! Make sure to double-check the measurements before welding.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      source: 'internal' as const
    },
    {
      id: '2',
      author: 'Mike Johnson',
      authorRole: 'Quality Control',
      content: 'Approved the inspection checklist. Ready for next phase.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      source: 'internal' as const
    }
  ];
}

function generateMockAttachments() {
  return [
    {
      id: '1',
      name: 'Welding_Specs_v2.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Sarah Martinez',
      uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      source: 'internal' as const
    },
    {
      id: '2',
      name: 'Safety_Checklist.xlsx',
      type: 'excel',
      size: '145 KB',
      uploadedBy: 'Safety Team',
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      source: 'drive' as const
    }
  ];
}

function generateMockLinkedItems() {
  return [
    {
      id: '1',
      title: 'Quality Inspection - Assembly Line A',
      type: 'task' as const,
      status: 'completed',
      source: 'Optiwork',
      link: '#'
    },
    {
      id: '2',
      title: 'Safety Meeting Notes - Week 15',
      type: 'document' as const,
      source: 'Google Drive',
      link: '#'
    }
  ];
}
