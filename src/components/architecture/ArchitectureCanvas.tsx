import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchitectureComponent } from './ArchitectureComponent';
import { DataPacket } from './DataPacket';
import { architectureComponents } from '@/data/simulations';
import { SimulationStep, AnimationSpeed } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface ArchitectureCanvasProps {
  currentStep: SimulationStep | null;
  isPlaying: boolean;
  speed: AnimationSpeed;
  onStepComplete: () => void;
  highlightedComponents: string[];
}

const speedDurations: Record<AnimationSpeed, number> = {
  slow: 2,
  normal: 1,
  fast: 0.5,
};

export function ArchitectureCanvas({
  currentStep,
  isPlaying,
  speed,
  onStepComplete,
  highlightedComponents,
}: ArchitectureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [componentPositions, setComponentPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [showPacket, setShowPacket] = useState(false);

  // Calculate positions based on container size
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Main flow (horizontal)
      const mainY = height * 0.55;
      const externalY = height * 0.2;
      
      setComponentPositions({
        browser: { x: width * 0.1, y: mainY },
        frontend: { x: width * 0.32, y: mainY },
        backend: { x: width * 0.54, y: mainY },
        database: { x: width * 0.76, y: mainY },
        auth: { x: width * 0.45, y: externalY },
        email: { x: width * 0.65, y: externalY },
      });
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  // Show packet when step starts
  useEffect(() => {
    if (currentStep && isPlaying) {
      setShowPacket(true);
    }
  }, [currentStep, isPlaying]);

  const handlePacketComplete = () => {
    setShowPacket(false);
    onStepComplete();
  };

  const getPacketPositions = () => {
    if (!currentStep) return { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } };
    
    const fromPos = componentPositions[currentStep.from] || { x: 0, y: 0 };
    const toPos = componentPositions[currentStep.to] || { x: 0, y: 0 };
    
    return {
      from: { x: fromPos.x + 60, y: fromPos.y - 20 },
      to: { x: toPos.x - 20, y: toPos.y - 20 },
    };
  };

  // Draw connection lines between components
  const connections = [
    { from: 'browser', to: 'frontend' },
    { from: 'frontend', to: 'backend' },
    { from: 'backend', to: 'database' },
    { from: 'backend', to: 'auth' },
    { from: 'backend', to: 'email' },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl overflow-hidden"
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(({ from, to }) => {
          const fromPos = componentPositions[from];
          const toPos = componentPositions[to];
          if (!fromPos || !toPos) return null;

          const isActive = currentStep && 
            ((currentStep.from === from && currentStep.to === to) ||
             (currentStep.from === to && currentStep.to === from));

          return (
            <motion.line
              key={`${from}-${to}`}
              x1={fromPos.x + 60}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              className={cn(
                'transition-all duration-300',
                isActive ? 'stroke-primary' : 'stroke-border',
              )}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray={isActive ? '0' : '8 4'}
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 1 : 0.3 }}
            />
          );
        })}
      </svg>

      {/* Architecture components */}
      {architectureComponents.map((comp) => {
        const pos = componentPositions[comp.id];
        if (!pos) return null;

        const isHighlighted = highlightedComponents.includes(comp.id);
        const isActive = currentStep && 
          (currentStep.from === comp.id || currentStep.to === comp.id);

        return (
          <motion.div
            key={comp.id}
            className="absolute"
            style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: architectureComponents.indexOf(comp) * 0.1 }}
          >
            <ArchitectureComponent
              {...comp}
              isHighlighted={isHighlighted}
              isActive={isActive || false}
            />
          </motion.div>
        );
      })}

      {/* Data packet animation */}
      <AnimatePresence>
        {showPacket && currentStep && isPlaying && (
          <DataPacket
            key={currentStep.id}
            data={currentStep.data}
            type={currentStep.type}
            fromPosition={getPacketPositions().from}
            toPosition={getPacketPositions().to}
            duration={speedDurations[speed]}
            onComplete={handlePacketComplete}
          />
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-client" />
          <span className="text-muted-foreground">Client</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-backend" />
          <span className="text-muted-foreground">Backend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-database" />
          <span className="text-muted-foreground">Database</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-external" />
          <span className="text-muted-foreground">Servizi Esterni</span>
        </div>
      </div>
    </div>
  );
}
