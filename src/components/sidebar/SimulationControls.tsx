import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Zap, Clock, Snail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimationSpeed } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface SimulationControlsProps {
  isPlaying: boolean;
  speed: AnimationSpeed;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (speed: AnimationSpeed) => void;
  canNext: boolean;
}

const speedConfig: { value: AnimationSpeed; icon: React.ElementType; label: string }[] = [
  { value: 'slow', icon: Snail, label: 'Lento' },
  { value: 'normal', icon: Clock, label: 'Normale' },
  { value: 'fast', icon: Zap, label: 'Veloce' },
];

export function SimulationControls({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onNext,
  onReset,
  onSpeedChange,
  canNext,
}: SimulationControlsProps) {
  return (
    <div className="space-y-4">
      {/* Playback controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="h-10 w-10"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          className="h-12 w-12 bg-primary hover:bg-primary/90"
        >
          <motion.div
            key={isPlaying ? 'pause' : 'play'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </motion.div>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canNext}
          className="h-10 w-10"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Speed controls */}
      <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-lg">
        {speedConfig.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => onSpeedChange(value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all',
              speed === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
