import { TaskPriority } from '../../types';
import { Badge } from '../ui/badge';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    high: {
      label: 'High',
      className: 'bg-red-100 text-red-800 hover:bg-red-200',
      icon: ArrowUp
    },
    medium: {
      label: 'Medium',
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      icon: ArrowRight
    },
    low: {
      label: 'Low',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      icon: ArrowDown
    }
  };

  const { label, className, icon: Icon } = config[priority];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}
