import { cn } from '../ui/utils';
import { LucideIcon } from 'lucide-react';

interface StatusChipProps {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  icon?: LucideIcon;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function StatusChip({ label, variant, icon: Icon, size = 'md', pulse }: StatusChipProps) {
  const variantClasses = {
    success: 'status-success',
    warning: 'status-warning',
    error: 'status-error',
    info: 'status-info',
    neutral: 'bg-muted text-muted-foreground border-border'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        variantClasses[variant],
        sizeClasses[size],
        pulse && 'pulse-subtle'
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </span>
  );
}
