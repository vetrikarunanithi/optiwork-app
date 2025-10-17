import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../ui/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function MetricCard({ title, value, icon: Icon, trend, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return TrendingUp;
    if (trend.value < 0) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className="industrial-card overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl tracking-tight mb-2">{value}</p>
            {trend && TrendIcon && (
              <div className="flex items-center gap-1 text-sm">
                <TrendIcon
                  className={cn(
                    'w-4 h-4',
                    trend.value > 0 && 'text-green-600',
                    trend.value < 0 && 'text-red-600',
                    trend.value === 0 && 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'font-medium',
                    trend.value > 0 && 'text-green-600',
                    trend.value < 0 && 'text-red-600',
                    trend.value === 0 && 'text-muted-foreground'
                  )}
                >
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
