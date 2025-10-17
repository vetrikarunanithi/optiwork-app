import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  message: string;
  onComplete?: () => void;
}

export function SuccessAnimation({ message, onComplete }: SuccessAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-lg shadow-industrial-lg p-8 max-w-sm mx-4 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 animate-checkmark" />
        </div>
        <h3 className="text-lg mb-2">{message}</h3>
        <p className="text-sm text-muted-foreground">Great work!</p>
      </div>
    </div>
  );
}
