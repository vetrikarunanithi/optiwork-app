import { Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="industrial-card p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted rounded-full shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded shimmer w-3/4" />
          <div className="h-3 bg-muted rounded shimmer w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded shimmer" />
        <div className="h-3 bg-muted rounded shimmer w-5/6" />
      </div>
    </div>
  );
}

export function LoadingScreen({ text }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text={text || 'Loading...'} />
    </div>
  );
}
