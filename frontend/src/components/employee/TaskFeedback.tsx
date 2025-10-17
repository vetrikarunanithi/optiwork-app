import { useState } from 'react';
import { Task, EmployeeFeedback } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TaskFeedbackProps {
  task: Task;
  onBack: () => void;
  onSubmitFeedback: (taskId: string, feedback: EmployeeFeedback) => void;
}

export function TaskFeedback({ task, onBack, onSubmitFeedback }: TaskFeedbackProps) {
  const [formData, setFormData] = useState({
    difficultyRating: 3,
    clarity: 5,
    hadIssues: false,
    issues: '',
    suggestions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feedback: EmployeeFeedback = {
      ...formData,
      submittedAt: new Date().toISOString()
    };

    onSubmitFeedback(task.id, feedback);
    toast.success('Thank you for your feedback!');
    onBack();
  };

  const RatingSelector = ({ 
    label, 
    value, 
    onChange, 
    labels 
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void;
    labels: string[];
  }) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              value === rating
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Star
              className={`w-6 h-6 mx-auto mb-1 ${
                value === rating ? 'fill-blue-500 text-blue-500' : 'text-gray-400'
              }`}
            />
            <p className="text-xs text-center">{rating}</p>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
          <h1>Task Feedback</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <p className="text-sm text-gray-600">Help us improve by sharing your experience</p>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingSelector
                label="How difficult was this task?"
                value={formData.difficultyRating}
                onChange={(val) => setFormData({ ...formData, difficultyRating: val })}
                labels={['Very Easy', 'Very Hard']}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingSelector
                label="How clear were the instructions?"
                value={formData.clarity}
                onChange={(val) => setFormData({ ...formData, clarity: val })}
                labels={['Very Unclear', 'Very Clear']}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issues & Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <Label htmlFor="hadIssues">Did you encounter any issues?</Label>
                <Switch
                  id="hadIssues"
                  checked={formData.hadIssues}
                  onCheckedChange={(checked) => setFormData({ ...formData, hadIssues: checked })}
                />
              </div>

              {formData.hadIssues && (
                <div className="space-y-2">
                  <Label htmlFor="issues">Describe the issues</Label>
                  <Textarea
                    id="issues"
                    value={formData.issues}
                    onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                    placeholder="e.g., Missing tools, unclear specifications..."
                    rows={3}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="suggestions">Suggestions for improvement (Optional)</Label>
                <Textarea
                  id="suggestions"
                  value={formData.suggestions}
                  onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                  placeholder="How could this task be improved?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Skip
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
