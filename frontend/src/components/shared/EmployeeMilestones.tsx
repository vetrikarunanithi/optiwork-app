import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Award, Flame, Target, Trophy, Zap, Star } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../ui/utils';

interface Milestone {
  id: string;
  type: 'certification' | 'streak' | 'tasks' | 'quality' | 'speed';
  title: string;
  description: string;
  progress: number;
  target: number;
  achieved: boolean;
  achievedDate?: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface EmployeeMilestonesProps {
  milestones: Milestone[];
  employeeName: string;
}

export function EmployeeMilestones({ milestones, employeeName }: EmployeeMilestonesProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'certification': return Award;
      case 'streak': return Flame;
      case 'tasks': return Target;
      case 'quality': return Trophy;
      case 'speed': return Zap;
      default: return Star;
    }
  };

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          bg: 'from-amber-500 to-orange-500',
          border: 'border-amber-500',
          glow: 'shadow-[0_0_20px_rgba(251,191,36,0.5)]'
        };
      case 'epic':
        return {
          bg: 'from-purple-500 to-pink-500',
          border: 'border-purple-500',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'
        };
      case 'rare':
        return {
          bg: 'from-blue-500 to-cyan-500',
          border: 'border-blue-500',
          glow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]'
        };
      default:
        return {
          bg: 'from-gray-400 to-gray-500',
          border: 'border-gray-400',
          glow: ''
        };
    }
  };

  const achieved = milestones.filter(m => m.achieved);
  const inProgress = milestones.filter(m => !m.achieved);

  return (
    <Card className="industrial-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          Milestones & Achievements
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {achieved.length} unlocked • {inProgress.length} in progress
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Achieved Milestones */}
        {achieved.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-green-600 dark:text-green-400">
              🏆 Unlocked Achievements
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {achieved.map((milestone) => {
                const Icon = getIcon(milestone.type);
                const rarity = getRarityConfig(milestone.rarity);
                
                return (
                  <div
                    key={milestone.id}
                    className={cn(
                      'relative p-4 rounded-xl border-2 bg-gradient-to-br text-white transition-transform hover:scale-105',
                      rarity.bg,
                      rarity.border,
                      rarity.glow
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5" />
                      <Badge className="text-xs bg-white/20 border-white/30">
                        {milestone.rarity}
                      </Badge>
                    </div>
                    <h5 className="text-sm font-semibold mb-1">{milestone.title}</h5>
                    <p className="text-xs opacity-90">{milestone.description}</p>
                    {milestone.achievedDate && (
                      <p className="text-xs opacity-75 mt-2">
                        {new Date(milestone.achievedDate).toLocaleDateString()}
                      </p>
                    )}
                    {/* Emoji for achievement */}
                    <div className="absolute -top-2 -right-2 text-2xl">
                      {milestone.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress Milestones */}
        {inProgress.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">📈 In Progress</h4>
            <div className="space-y-3">
              {inProgress.map((milestone) => {
                const Icon = getIcon(milestone.type);
                const progressPercent = (milestone.progress / milestone.target) * 100;
                
                return (
                  <div
                    key={milestone.id}
                    className="p-4 rounded-lg bg-muted border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <h5 className="text-sm font-semibold">{milestone.title}</h5>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {milestone.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{milestone.description}</p>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {milestone.progress} / {milestone.target}
                        </span>
                        <span className="font-semibold">{progressPercent.toFixed(0)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
