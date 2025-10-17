import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { toast } from 'sonner@2.0.3';

interface VoiceCommandButtonProps {
  onCommand: (command: string) => void;
  className?: string;
}

export function VoiceCommandButton({ onCommand, className }: VoiceCommandButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleVoiceCommand = () => {
    if (!isListening) {
      // Start listening
      setIsListening(true);
      setTranscript('Listening...');
      
      // Simulate voice recognition (in production, use Web Speech API)
      toast.info('Voice command mode activated', {
        description: 'Say "Mark task as done" or "Start task"'
      });

      // Demo: Auto-stop after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        const demoCommand = 'Mark task as done';
        setTranscript(demoCommand);
        onCommand(demoCommand);
        
        toast.success('Command recognized', {
          description: `"${demoCommand}"`
        });

        // Clear transcript after 2 seconds
        setTimeout(() => setTranscript(''), 2000);
      }, 3000);
    } else {
      // Stop listening
      setIsListening(false);
      setTranscript('');
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        onClick={handleVoiceCommand}
        variant={isListening ? 'default' : 'outline'}
        size="icon"
        className={cn(
          'touch-target relative',
          isListening && 'animate-pulse bg-red-600 hover:bg-red-700'
        )}
      >
        {isListening ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        
        {isListening && (
          <>
            {/* Pulsing rings for active listening */}
            <span className="absolute inset-0 rounded-md bg-red-400 animate-ping opacity-75" />
            <span className="absolute inset-0 rounded-md bg-red-400 animate-pulse" />
          </>
        )}
      </Button>

      {transcript && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-border rounded-lg px-3 py-2 shadow-lg animate-fade-in">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </div>
  );
}
