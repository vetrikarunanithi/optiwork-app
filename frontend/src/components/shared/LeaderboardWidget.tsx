import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface LeaderboardEntry {
  rank: number;
  employeeId: string;
  employeeName: string;
  score: number;
  metric: string;
  trend: 'up' | 'down' | 'same';
  badge?: string;
}

interface LeaderboardWidgetProps {
  title: string;
  entries: LeaderboardEntry[];
  metric: string;
  period?: string;
}

export function LeaderboardWidget({ title, entries, metric, period }: LeaderboardWidgetProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Trophy;
      case 3: return Medal;
      default: return Award;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-amber-500 to-yellow-500';
      case 2: return 'from-slate-400 to-slate-500';
      case 3: return 'from-amber-700 to-amber-800';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
      case 2: return 'bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-900/50';
      case 3: return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="industrial-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            {title}
          </CardTitle>
          {period && (
            <Badge variant="outline">{period}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => {
          const Icon = getRankIcon(entry.rank);
          const isTopThree = entry.rank <= 3;

          return (
            <div
              key={entry.employeeId}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all',
                isTopThree ? `border-2 ${getRankBg(entry.rank)}` : 'bg-card border border-border',
                'hover:shadow-md'
              )}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                {isTopThree ? (
                  <div className={cn('w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center', getRankColor(entry.rank))}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-semibold text-muted-foreground">{entry.rank}</span>
                  </div>
                )}
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={cn(
                    'text-xs',
                    isTopThree ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    {entry.employeeName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm truncate', isTopThree && 'font-semibold')}>
                    {entry.employeeName}
                  </p>
                  {entry.badge && (
                    <p className="text-xs text-muted-foreground truncate">{entry.badge}</p>
                  )}
                </div>
              </div>

              {/* Score & Trend */}
              <div className="text-right flex items-center gap-2">
                <div>
                  <p className={cn('text-lg', isTopThree && 'font-bold')}>
                    {entry.score}
                  </p>
                  <p className="text-xs text-muted-foreground">{metric}</p>
                </div>
                {entry.trend === 'up' && (
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
                {entry.trend === 'down' && (
                  <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400 rotate-180" />
                )}
              </div>
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No leaderboard data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
