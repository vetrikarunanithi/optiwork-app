import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SkillProgress {
  date: string;
  level: number;
  milestone?: string;
}

interface SkillEvolutionChartProps {
  skillName: string;
  data: SkillProgress[];
  targetLevel?: number;
}

export function SkillEvolutionChart({ skillName, data, targetLevel }: SkillEvolutionChartProps) {
  const maxLevel = 4; // beginner=1, intermediate=2, advanced=3, expert=4

  return (
    <Card className="industrial-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {skillName} Evolution
          </CardTitle>
          {targetLevel && (
            <span className="text-sm text-muted-foreground">
              Target: Level {targetLevel}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            />
            <YAxis 
              domain={[0, maxLevel]} 
              ticks={[0, 1, 2, 3, 4]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const levels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
                return levels[value] || '';
              }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const levels = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-sm mb-1">{new Date(data.date).toLocaleDateString()}</p>
                      <p className="text-sm font-semibold text-primary">{levels[data.level]}</p>
                      {data.milestone && (
                        <p className="text-xs text-muted-foreground mt-1">{data.milestone}</p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="level" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#skillGradient)"
            />
            {targetLevel && (
              <Line 
                type="monotone" 
                dataKey={() => targetLevel} 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>

        {/* Milestones */}
        <div className="mt-4 space-y-2">
          {data.filter(d => d.milestone).map((milestone, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="text-foreground">{milestone.milestone}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
