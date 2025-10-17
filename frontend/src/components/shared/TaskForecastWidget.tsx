import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '../ui/progress';
import { cn } from '../ui/utils';

interface TaskForecast {
  totalTasks: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  predictedCompletion: number;
  bottlenecks: string[];
}

interface TaskForecastWidgetProps {
  forecast: TaskForecast;
  shiftName?: string;
}

export function TaskForecastWidget({ forecast, shiftName }: TaskForecastWidgetProps) {
  const { totalTasks, onTrack, atRisk, delayed, predictedCompletion, bottlenecks } = forecast;

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCompletionStatus = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Fair';
    return 'At Risk';
  };

  return (
    <Card className="industrial-card border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Task Forecast {shiftName && `- ${shiftName}`}
          </CardTitle>
          <div className={cn('text-2xl', getCompletionColor(predictedCompletion))}>
            {predictedCompletion}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Predicted Completion */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Predicted Completion</span>
            <span className={cn('text-sm font-semibold', getCompletionColor(predictedCompletion))}>
              {getCompletionStatus(predictedCompletion)}
            </span>
          </div>
          <Progress value={predictedCompletion} className="h-3" />
        </div>

        {/* Task Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <p className="text-lg text-green-600 dark:text-green-400">{onTrack}</p>
            <p className="text-xs text-muted-foreground">On Track</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
            <p className="text-lg text-yellow-600 dark:text-yellow-400">{atRisk}</p>
            <p className="text-xs text-muted-foreground">At Risk</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
            <p className="text-lg text-red-600 dark:text-red-400">{delayed}</p>
            <p className="text-xs text-muted-foreground">Delayed</p>
          </div>
        </div>

        {/* Bottlenecks */}
        {bottlenecks.length > 0 && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
              ⚠️ Potential Bottlenecks
            </p>
            <ul className="space-y-1">
              {bottlenecks.map((bottleneck, idx) => (
                <li key={idx} className="text-xs text-yellow-700 dark:text-yellow-500 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-yellow-600 mt-1.5 flex-shrink-0" />
                  <span>{bottleneck}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
