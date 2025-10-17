import { SkillLevel } from '../../types';
<parameter name="Badge } from '../ui/badge';
import { Award, TrendingUp, Star, Zap } from 'lucide-react';

interface SkillBadgeProps {
  skillName: string;
  level: SkillLevel;
  certified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillBadge({ skillName, level, certified, size = 'md' }: SkillBadgeProps) {
  const config = {
    beginner: {
      className: 'bg-gray-100 text-gray-800 border-gray-300',
      icon: TrendingUp
    },
    intermediate: {
      className: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Star
    },
    advanced: {
      className: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Award
    },
    expert: {
      className: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Zap
    }
  };

  const { className, icon: Icon } = config[level];
  const sizeClasses = size === 'sm' ? 'text-xs py-0.5' : size === 'lg' ? 'text-base py-1.5' : '';

  return (
    <Badge variant="outline" className={`${className} ${sizeClasses}`}>
      <Icon className="w-3 h-3 mr-1" />
      {skillName}
      {certified && <Award className="w-3 h-3 ml-1 text-green-600" />}
    </Badge>
  );
}
