import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive?: boolean;
  type?: 'request' | 'response' | 'error';
  animated?: boolean;
}

export function ConnectionLine({
  from,
  to,
  isActive = false,
  type = 'request',
  animated = false,
}: ConnectionLineProps) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  // Create a curved path
  const path = `M ${from.x} ${from.y} Q ${midX} ${midY - 30} ${to.x} ${to.y}`;
  
  const colors = {
    request: 'stroke-client',
    response: 'stroke-backend',
    error: 'stroke-destructive',
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      style={{ zIndex: 0 }}
    >
      {/* Background line */}
      <motion.path
        d={path}
        fill="none"
        className={cn(
          'transition-all duration-300',
          isActive ? colors[type] : 'stroke-border',
        )}
        strokeWidth={isActive ? 3 : 2}
        strokeDasharray={isActive ? '0' : '8 4'}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: isActive ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Animated glow when active */}
      {isActive && animated && (
        <motion.circle
          r={6}
          className={cn(
            'fill-current',
            type === 'request' && 'text-client',
            type === 'response' && 'text-backend',
            type === 'error' && 'text-destructive',
          )}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            offsetDistance: ['0%', '100%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            offsetPath: `path("${path}")`,
          }}
        >
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="1s"
            repeatCount="indefinite"
          />
        </motion.circle>
      )}
    </svg>
  );
}
