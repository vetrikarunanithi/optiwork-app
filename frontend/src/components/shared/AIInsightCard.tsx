import { LucideIcon, Sparkles, TrendingUp, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface AIInsightCardProps {
  type: 'prediction' | 'recommendation' | 'alert' | 'insight';
  title: string;
  description: string;
  confidence?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function AIInsightCard({ type, title, description, confidence, action, className }: AIInsightCardProps) {
  const config = {
    prediction: {
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-900/50',
      text: 'text-blue-700 dark:text-blue-400'
    },
    recommendation: {
      icon: Lightbulb,
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-900/50',
      text: 'text-purple-700 dark:text-purple-400'
    },
    alert: {
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      border: 'border-yellow-200 dark:border-yellow-900/50',
      text: 'text-yellow-800 dark:text-yellow-400'
    },
    insight: {
      icon: Info,
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      text: 'text-emerald-700 dark:text-emerald-400'
    }
  };

  const { icon: Icon, color, bg, border, text } = config[type];

  return (
    <Card className={cn('border-2', border, bg, 'animate-fade-in', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', color)}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              {confidence && (
                <span className={cn('text-xs px-2 py-0.5 rounded-full', bg, text)}>
                  {confidence}% confidence
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            variant="outline"
            size="sm"
            className="w-full touch-target"
          >
            <Icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
