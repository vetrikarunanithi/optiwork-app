import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '../ui/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface HeatmapCell {
  hour: string;
  day: string;
  productivity: number; // 0-100
  tasksCompleted: number;
  utilization: number;
  status: 'peak' | 'normal' | 'idle' | 'bottleneck';
}

interface ProductivityHeatmapProps {
  data: HeatmapCell[];
  title?: string;
  onFilterChange?: (filter: { team?: string; skill?: string; shift?: string }) => void;
}

export function ProductivityHeatmap({ data, title = 'Productivity Heatmap', onFilterChange }: ProductivityHeatmapProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 80) return 'bg-green-500 dark:bg-green-600';
    if (productivity >= 60) return 'bg-green-400 dark:bg-green-500';
    if (productivity >= 40) return 'bg-yellow-400 dark:bg-yellow-500';
    if (productivity >= 20) return 'bg-orange-400 dark:bg-orange-500';
    return 'bg-red-400 dark:bg-red-500';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'peak': return '🔥 Peak Output';
      case 'normal': return '✅ Normal';
      case 'idle': return '⏸️ Idle Time';
      case 'bottleneck': return '⚠️ Bottleneck';
      default: return '';
    }
  };

  const getCellData = (day: string, hour: string) => {
    return data.find(cell => cell.day === day && cell.hour === hour);
  };

  // Calculate peak hours
  const peakHours = data
    .filter(cell => cell.productivity >= 80)
    .sort((a, b) => b.productivity - a.productivity)
    .slice(0, 3);

  const idleHours = data
    .filter(cell => cell.productivity < 20)
    .slice(0, 3);

  return (
    <Card className="industrial-card">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select onValueChange={(value) => onFilterChange?.({ team: value })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="team-a">Team A</SelectItem>
                <SelectItem value="team-b">Team B</SelectItem>
                <SelectItem value="team-c">Team C</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => onFilterChange?.({ shift: value })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Shifts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => onFilterChange?.({ skill: value })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="welding">Welding</SelectItem>
                <SelectItem value="machining">Machining</SelectItem>
                <SelectItem value="assembly">Assembly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Legend */}
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-muted-foreground">High (80-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-400" />
            <span className="text-muted-foreground">Medium (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400" />
            <span className="text-muted-foreground">Low (0-20%)</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <TooltipProvider>
            <div className="min-w-[800px]">
              {/* Hour labels */}
              <div className="flex">
                <div className="w-16" /> {/* Empty corner */}
                {hours.filter((_, i) => i % 2 === 0).map((hour) => (
                  <div key={hour} className="flex-1 min-w-[40px] text-center text-xs text-muted-foreground pb-2">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {days.map((day) => (
                <div key={day} className="flex items-center">
                  <div className="w-16 text-sm text-muted-foreground pr-2 text-right">
                    {day}
                  </div>
                  {hours.filter((_, i) => i % 2 === 0).map((hour) => {
                    const cellData = getCellData(day, hour);
                    
                    return (
                      <Tooltip key={hour}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'flex-1 min-w-[40px] h-12 m-0.5 rounded cursor-pointer transition-all hover:scale-110 hover:shadow-lg',
                              cellData ? getProductivityColor(cellData.productivity) : 'bg-muted/30'
                            )}
                          />
                        </TooltipTrigger>
                        {cellData && (
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              <p className="font-semibold">{day} {hour}</p>
                              <p>Productivity: {cellData.productivity}%</p>
                              <p>Tasks Completed: {cellData.tasksCompleted}</p>
                              <p>Utilization: {cellData.utilization}%</p>
                              <p className="pt-1 border-t">{getStatusLabel(cellData.status)}</p>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          {/* Peak Hours */}
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-400">Peak Output Times</h4>
            </div>
            <div className="space-y-2">
              {peakHours.map((peak, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-green-700 dark:text-green-500">{peak.day} {peak.hour}</span>
                  <span className="font-semibold text-green-800 dark:text-green-400">{peak.productivity}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Idle Times */}
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Low Activity Periods</h4>
            </div>
            <div className="space-y-2">
              {idleHours.map((idle, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-yellow-700 dark:text-yellow-500">{idle.day} {idle.hour}</span>
                  <span className="font-semibold text-yellow-800 dark:text-yellow-400">{idle.productivity}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
