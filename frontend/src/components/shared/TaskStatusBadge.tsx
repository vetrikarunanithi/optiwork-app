import { TaskStatus } from '../../types';
import { Badge } from '../ui/badge';
import { CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = {
    completed: {
      label: 'Completed',
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600',
      icon: CheckCircle2
    },
    'in-progress': {
      label: 'In Progress',
      variant: 'default' as const,
      className: 'bg-blue-500 hover:bg-blue-600',
      icon: Clock
    },
    pending: {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-gray-500 hover:bg-gray-600 text-white',
      icon: Circle
    },
    overdue: {
      label: 'Overdue',
      variant: 'destructive' as const,
      className: '',
      icon: AlertCircle
    }
  };

  const { label, variant, className, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}
