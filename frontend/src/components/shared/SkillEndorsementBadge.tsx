import { Award, CheckCircle, Shield, Star } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Endorsement {
  type: 'peer' | 'supervisor' | 'certification' | 'expert';
  endorserName: string;
  date: string;
  count?: number;
}

interface SkillEndorsementBadgeProps {
  skillName: string;
  endorsements: Endorsement[];
  size?: 'sm' | 'md' | 'lg';
}

export function SkillEndorsementBadge({ skillName, endorsements, size = 'md' }: SkillEndorsementBadgeProps) {
  const getEndorsementIcon = (type: string) => {
    switch (type) {
      case 'peer': return Star;
      case 'supervisor': return Shield;
      case 'certification': return Award;
      case 'expert': return CheckCircle;
      default: return Star;
    }
  };

  const getEndorsementColor = (type: string) => {
    switch (type) {
      case 'peer': return 'text-blue-600 dark:text-blue-400';
      case 'supervisor': return 'text-purple-600 dark:text-purple-400';
      case 'certification': return 'text-amber-600 dark:text-amber-400';
      case 'expert': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600';
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const totalEndorsements = endorsements.reduce((sum, e) => sum + (e.count || 1), 0);

  return (
    <TooltipProvider>
      <div className="inline-flex items-center gap-1.5">
        {endorsements.map((endorsement, idx) => {
          const Icon = getEndorsementIcon(endorsement.type);
          const color = getEndorsementColor(endorsement.type);
          
          return (
            <Tooltip key={idx}>
              <TooltipTrigger>
                <div className={cn('relative', sizeClasses[size])}>
                  <Icon className={cn('w-full h-full', color)} />
                  {endorsement.count && endorsement.count > 1 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary text-[8px] text-white flex items-center justify-center">
                      {endorsement.count}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-semibold capitalize">{endorsement.type} Endorsement</p>
                  <p className="text-muted-foreground">by {endorsement.endorserName}</p>
                  <p className="text-muted-foreground">{new Date(endorsement.date).toLocaleDateString()}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
        {totalEndorsements > 0 && (
          <Badge variant="outline" className="ml-1 text-xs">
            {totalEndorsements} {totalEndorsements === 1 ? 'endorsement' : 'endorsements'}
          </Badge>
        )}
      </div>
    </TooltipProvider>
  );
}
