import { useState } from 'react';
import { User, Task, TaskPriority } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface TaskAssignmentProps {
  employees: User[];
  currentUser: User;
  onBack: () => void;
  onAssignTask: (task: Omit<Task, 'id' | 'status' | 'completedAt'>) => void;
}

export function TaskAssignment({ employees, currentUser, onBack, onAssignTask }: TaskAssignmentProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as TaskPriority,
    startTime: '09:00',
    endTime: '10:00',
    dueDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [checklistItems, setChecklistItems] = useState<string[]>(['']);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const checklist = checklistItems
      .filter(item => item.trim())
      .map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        completed: false
      }));

    const newTask: Omit<Task, 'id' | 'status' | 'completedAt'> = {
      ...formData,
      assignedBy: currentUser.id,
      checklist: checklist.length > 0 ? checklist : undefined
    };

    onAssignTask(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      startTime: '09:00',
      endTime: '10:00',
      dueDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setChecklistItems(['']);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const updateChecklistItem = (index: number, value: string) => {
    const updated = [...checklistItems];
    updated[index] = value;
    setChecklistItems(updated);
  };

  const removeChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

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
            <h1>Assign New Task</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Task assigned successfully!
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Title */}
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed instructions for this task"
                  rows={4}
                  required
                />
              </div>

              {/* Assign To and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To *</Label>
                  <Select 
                    value={formData.assignedTo}
                    onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} ({emp.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
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
              </div>

              {/* Time and Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Task Checklist (Optional)</Label>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={addChecklistItem}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateChecklistItem(index, e.target.value)}
                        placeholder={`Checklist item ${index + 1}`}
                      />
                      {checklistItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeChecklistItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Supervisor Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or instructions for the employee"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Assign Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
