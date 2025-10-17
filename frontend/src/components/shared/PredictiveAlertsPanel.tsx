import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, CheckCircle, Info, TrendingUp, X, Clock, Users, Wrench } from 'lucide-react';
import { cn } from '../ui/utils';
import { Badge } from '../ui/badge';

interface PredictiveAlert {
  id: string;
  type: 'warning' | 'success' | 'info' | 'critical';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
  actionable: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
}

interface PredictiveAlertsPanelProps {
  alerts: PredictiveAlert[];
  onDismiss?: (alertId: string) => void;
  className?: string;
}

export function PredictiveAlertsPanel({ alerts, onDismiss, className }: PredictiveAlertsPanelProps) {
  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bg: 'bg-red-50 dark:bg-red-950/30',
          border: 'border-red-200 dark:border-red-900/50',
          iconColor: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/50'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-yellow-50 dark:bg-yellow-950/30',
          border: 'border-yellow-200 dark:border-yellow-900/50',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/50'
        };
      case 'success':
        return {
          icon: CheckCircle,
          bg: 'bg-green-50 dark:bg-green-950/30',
          border: 'border-green-200 dark:border-green-900/50',
          iconColor: 'text-green-600 dark:text-green-400',
          iconBg: 'bg-green-100 dark:bg-green-900/50'
        };
      default:
        return {
          icon: Info,
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'border-blue-200 dark:border-blue-900/50',
          iconColor: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/50'
        };
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-600">High Impact</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600">Medium Impact</Badge>;
      default:
        return <Badge variant="outline">Low Impact</Badge>;
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort by impact, then by confidence
    const impactOrder = { high: 3, medium: 2, low: 1 };
    if (impactOrder[a.impact] !== impactOrder[b.impact]) {
      return impactOrder[b.impact] - impactOrder[a.impact];
    }
    return b.confidence - a.confidence;
  });

  return (
    <Card className={cn('industrial-card', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Predictive Insights
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            {alerts.length} active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">AI-powered predictions and recommendations</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
            <p className="text-sm text-muted-foreground">No active alerts</p>
            <p className="text-xs text-muted-foreground mt-1">Everything is running smoothly!</p>
          </div>
        ) : (
          sortedAlerts.map((alert) => {
            const config = getAlertConfig(alert.type);
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  'relative p-4 rounded-lg border-2 animate-fade-in',
                  config.bg,
                  config.border,
                  alert.type === 'critical' && 'animate-pulse-subtle'
                )}
              >
                {alert.dismissible && onDismiss && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDismiss(alert.id)}
                    className="absolute top-2 right-2 h-6 w-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}

                <div className="flex gap-3">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', config.iconBg)}>
                    <Icon className={cn('w-5 h-5', config.iconColor)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <h4 className="flex-1 font-semibold">{alert.title}</h4>
                      {getImpactBadge(alert.impact)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {alert.confidence}% confidence
                        </div>
                      </div>

                      {alert.actionable && alert.action && (
                        <Button
                          size="sm"
                          onClick={alert.action.onClick}
                          className="text-xs touch-target"
                        >
                          {alert.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* AI Summary */}
        {alerts.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted border border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>
                AI analyzed {alerts.length} potential {alerts.length === 1 ? 'issue' : 'issues'}.{' '}
                {alerts.filter(a => a.impact === 'high').length > 0 && 
                  `${alerts.filter(a => a.impact === 'high').length} require immediate attention.`}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-configured alert templates for common scenarios
export const commonAlerts = {
  capacityAlert: (teamName: string, utilization: number, tasksToShift: number): PredictiveAlert => ({
    id: `capacity-${Date.now()}`,
    type: 'warning',
    title: `Capacity Alert - ${teamName}`,
    description: `${teamName} will reach ${utilization}% utilization by 2 PM. Recommend shifting ${tasksToShift} tasks to maintain quality and prevent overtime.`,
    confidence: 87,
    impact: 'high',
    timestamp: new Date(),
    actionable: true,
    action: {
      label: 'Rebalance Tasks',
      onClick: () => console.log('Rebalancing...')
    },
    dismissible: true
  }),

  maintenanceDue: (machineName: string, hoursUntilCritical: number): PredictiveAlert => ({
    id: `maintenance-${Date.now()}`,
    type: 'critical',
    title: 'Equipment Maintenance Required',
    description: `${machineName} requires preventive maintenance within ${hoursUntilCritical} hours. Scheduling now will prevent potential 4-hour downtime.`,
    confidence: 95,
    impact: 'high',
    timestamp: new Date(),
    actionable: true,
    action: {
      label: 'Schedule Maintenance',
      onClick: () => console.log('Scheduling...')
    },
    dismissible: false
  }),

  noConflicts: (): PredictiveAlert => ({
    id: `no-conflicts-${Date.now()}`,
    type: 'success',
    title: 'Clear Schedule Ahead',
    description: 'No workload conflicts detected for tomorrow\'s shift. All tasks are optimally assigned.',
    confidence: 92,
    impact: 'low',
    timestamp: new Date(),
    actionable: false,
    dismissible: true
  }),

  skillGapDetected: (skillName: string, taskCount: number): PredictiveAlert => ({
    id: `skill-gap-${Date.now()}`,
    type: 'warning',
    title: 'Skill Coverage Gap',
    description: `${taskCount} upcoming tasks require ${skillName}, but only 1 certified employee available. Consider cross-training or adjusting schedule.`,
    confidence: 89,
    impact: 'medium',
    timestamp: new Date(),
    actionable: true,
    action: {
      label: 'View Options',
      onClick: () => console.log('Viewing options...')
    },
    dismissible: true
  }),

  performanceTrend: (improvement: number): PredictiveAlert => ({
    id: `performance-${Date.now()}`,
    type: 'success',
    title: 'Performance Trend Detected',
    description: `Morning shift task completion has improved ${improvement}% over the past two weeks. Current practices should be documented and shared.`,
    confidence: 91,
    impact: 'medium',
    timestamp: new Date(),
    actionable: true,
    action: {
      label: 'Document Best Practices',
      onClick: () => console.log('Documenting...')
    },
    dismissible: true
  })
};
