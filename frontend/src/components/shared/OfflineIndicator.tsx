import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

interface OfflineIndicatorProps {
  onRetry?: () => void;
}

export function OfflineIndicator({ onRetry }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [queuedActions, setQueuedActions] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored', {
        description: queuedActions > 0 
          ? `Syncing ${queuedActions} queued action${queuedActions > 1 ? 's' : ''}...`
          : 'You\'re back online'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connection lost', {
        description: 'Working in offline mode. Changes will sync when online.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queuedActions]);

  if (isOnline && queuedActions === 0) return null;

  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50 p-4 rounded-lg border-2 shadow-industrial-lg max-w-sm animate-fade-in',
      isOnline 
        ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50'
        : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          isOnline 
            ? 'bg-blue-100 dark:bg-blue-900/50'
            : 'bg-yellow-100 dark:bg-yellow-900/50'
        )}>
          {isOnline ? (
            queuedActions > 0 ? (
              <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
            ) : (
              <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )
          ) : (
            <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          )}
        </div>

        <div className="flex-1">
          <h4 className={cn(
            'font-semibold mb-1',
            isOnline ? 'text-blue-800 dark:text-blue-400' : 'text-yellow-800 dark:text-yellow-400'
          )}>
            {isOnline 
              ? queuedActions > 0 
                ? 'Syncing Changes...'
                : 'Back Online'
              : 'Offline Mode'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isOnline
              ? queuedActions > 0
                ? `${queuedActions} pending action${queuedActions > 1 ? 's' : ''} syncing`
                : 'All changes synced'
              : 'Changes will be saved locally and synced when connection is restored'}
          </p>
          
          {!isOnline && queuedActions > 0 && (
            <div className="mt-2 text-sm">
              <span className="text-yellow-700 dark:text-yellow-500">
                📦 {queuedActions} action{queuedActions > 1 ? 's' : ''} queued
              </span>
            </div>
          )}

          {!isOnline && onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="mt-3 w-full touch-target"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SyncStatus({ syncing, lastSync }: { syncing: boolean; lastSync?: Date }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {syncing ? (
        <>
          <Cloud className="w-4 h-4 animate-pulse text-blue-600" />
          <span>Syncing...</span>
        </>
      ) : lastSync ? (
        <>
          <Cloud className="w-4 h-4 text-green-600" />
          <span>Synced {lastSync.toLocaleTimeString()}</span>
        </>
      ) : (
        <>
          <CloudOff className="w-4 h-4 text-yellow-600" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
