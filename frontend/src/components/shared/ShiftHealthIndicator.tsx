import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '../ui/progress';
import { cn } from '../ui/utils';

interface ShiftHealth {
  shiftName: string;
  utilization: number;
  activeEmployees: number;
  totalEmployees: number;
  taskCompletion: number;
  incidents: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ShiftHealthIndicatorProps {
  health: ShiftHealth;
}

export function ShiftHealthIndicator({ health }: ShiftHealthIndicatorProps) {
  const { shiftName, utilization, activeEmployees, totalEmployees, taskCompletion, incidents, status } = health;

  const statusConfig = {
    excellent: {
      color: 'from-green-500 to-emerald-500',
      text: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-900/50',
      icon: CheckCircle,
      label: 'Excellent'
    },
    good: {
      color: 'from-blue-500 to-cyan-500',
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-900/50',
      icon: Activity,
      label: 'Good'
    },
    fair: {
      color: 'from-yellow-500 to-orange-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      border: 'border-yellow-200 dark:border-yellow-900/50',
      icon: AlertCircle,
      label: 'Fair'
    },
    poor: {
      color: 'from-red-500 to-rose-500',
      text: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-900/50',
      icon: AlertCircle,
      label: 'Needs Attention'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={cn('border-2 animate-fade-in', config.border, config.bg)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{shiftName} Shift Health</CardTitle>
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', config.bg, config.border)}>
            <Icon className={cn('w-4 h-4', config.text)} />
            <span className={cn('text-sm font-semibold', config.text)}>
              {config.label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gauge Visualization */}
        <div className="relative">
          <svg className="w-full h-32" viewBox="0 0 200 100">
            {/* Background arc */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted/30"
            />
            {/* Colored arc based on status */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="url(#shiftGradient)"
              strokeWidth="12"
              strokeDasharray={`${utilization * 2.5} 300`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="shiftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={config.text} />
                <stop offset="100%" className={config.text} style={{ stopOpacity: 0.6 }} />
              </linearGradient>
            </defs>
            {/* Center value */}
            <text x="100" y="75" textAnchor="middle" className="fill-foreground text-3xl font-bold">
              {utilization}%
            </text>
            <text x="100" y="90" textAnchor="middle" className="fill-muted-foreground text-xs">
              Utilization
            </text>
          </svg>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-card border border-border">
            <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg">{activeEmployees}/{totalEmployees}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-card border border-border">
            <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
            <p className="text-lg">{taskCompletion}%</p>
            <p className="text-xs text-muted-foreground">Tasks</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-card border border-border">
            <AlertCircle className={cn('w-4 h-4 mx-auto mb-1', incidents > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')} />
            <p className="text-lg">{incidents}</p>
            <p className="text-xs text-muted-foreground">Incidents</p>
          </div>
        </div>

        {/* Task Completion Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Task Completion</span>
            <span className="text-sm font-semibold">{taskCompletion}%</span>
          </div>
          <Progress value={taskCompletion} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
