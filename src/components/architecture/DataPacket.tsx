import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DataPacketProps {
  data: string;
  type: 'request' | 'response' | 'error';
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  duration: number;
  onComplete?: () => void;
}

export function DataPacket({
  data,
  type,
  fromPosition,
  toPosition,
  duration,
  onComplete,
}: DataPacketProps) {
  const typeStyles = {
    request: 'bg-client border-client text-client',
    response: 'bg-backend border-backend text-backend',
    error: 'bg-destructive border-destructive text-destructive',
  };

  return (
    <motion.div
      initial={{ 
        x: fromPosition.x, 
        y: fromPosition.y,
        opacity: 0,
        scale: 0.5,
      }}
      animate={{ 
        x: toPosition.x, 
        y: toPosition.y,
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5],
      }}
      transition={{ 
        duration,
        ease: 'easeInOut',
        times: [0, 0.1, 0.9, 1],
      }}
      onAnimationComplete={onComplete}
      className={cn(
        'absolute z-50 px-3 py-1.5 rounded-lg border-2 backdrop-blur-sm font-mono text-xs whitespace-nowrap',
        'bg-opacity-20',
        typeStyles[type],
      )}
    >
      <div className="flex items-center gap-2">
        <motion.div
          className={cn(
            'w-2 h-2 rounded-full',
            type === 'request' && 'bg-client',
            type === 'response' && 'bg-backend',
            type === 'error' && 'bg-destructive',
          )}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <span>{data}</span>
      </div>
    </motion.div>
  );
}
