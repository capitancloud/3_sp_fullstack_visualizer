import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchitectureComponent } from './ArchitectureComponent';
import { DataPacket } from './DataPacket';
import { architectureComponents } from '@/data/simulations';
import { SimulationStep, AnimationSpeed } from '@/types/simulation';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Calculate initial positions based on container size
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Main flow (horizontal)
      const mainY = height * 0.55;
      const externalTopY = height * 0.2;
      const externalBottomY = height * 0.85;
      
      // Only set initial positions if not already set (to preserve user dragging)
      setComponentPositions(prev => {
        if (Object.keys(prev).length > 0) return prev;
        
        return {
          browser: { x: width * 0.1, y: mainY },
          frontend: { x: width * 0.32, y: mainY },
          backend: { x: width * 0.54, y: mainY },
          database: { x: width * 0.76, y: mainY },
          auth: { x: width * 0.45, y: externalTopY },
          email: { x: width * 0.58, y: externalTopY },
          payment: { x: width * 0.71, y: externalTopY },
          storage: { x: width * 0.12, y: externalBottomY },
          cache: { x: width * 0.32, y: externalBottomY },
          websocket: { x: width * 0.52, y: externalBottomY },
        };
      });
    };

    updatePositions();
    
    // Reset positions on window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mainY = height * 0.55;
      const externalTopY = height * 0.2;
      const externalBottomY = height * 0.85;
      
      setComponentPositions({
        browser: { x: width * 0.1, y: mainY },
        frontend: { x: width * 0.32, y: mainY },
        backend: { x: width * 0.54, y: mainY },
        database: { x: width * 0.76, y: mainY },
        auth: { x: width * 0.45, y: externalTopY },
        email: { x: width * 0.58, y: externalTopY },
        payment: { x: width * 0.71, y: externalTopY },
        storage: { x: width * 0.12, y: externalBottomY },
        cache: { x: width * 0.32, y: externalBottomY },
        websocket: { x: width * 0.52, y: externalBottomY },
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      from: { x: fromPos.x, y: fromPos.y },
      to: { x: toPos.x, y: toPos.y },
    };
  };

  // Handle component position update (called during and after drag)
  const updateComponentPosition = (id: string, x: number, y: number) => {
    setComponentPositions(prev => ({
      ...prev,
      [id]: { x, y },
    }));
  };

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    // Reset to initial positions
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mainY = height * 0.55;
    const externalTopY = height * 0.2;
    const externalBottomY = height * 0.85;
    
    setComponentPositions({
      browser: { x: width * 0.1, y: mainY },
      frontend: { x: width * 0.32, y: mainY },
      backend: { x: width * 0.54, y: mainY },
      database: { x: width * 0.76, y: mainY },
      auth: { x: width * 0.45, y: externalTopY },
      email: { x: width * 0.58, y: externalTopY },
      payment: { x: width * 0.71, y: externalTopY },
      storage: { x: width * 0.12, y: externalBottomY },
      cache: { x: width * 0.32, y: externalBottomY },
      websocket: { x: width * 0.52, y: externalBottomY },
    });
  };

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
    }
  };

  // Handle canvas pan
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('canvas-background') || target.tagName === 'svg') {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Draw connection lines between components
  const connections = [
    { from: 'browser', to: 'frontend' },
    { from: 'frontend', to: 'backend' },
    { from: 'backend', to: 'database' },
    { from: 'backend', to: 'auth' },
    { from: 'backend', to: 'email' },
    { from: 'backend', to: 'payment' },
    { from: 'backend', to: 'storage' },
    { from: 'backend', to: 'cache' },
    { from: 'backend', to: 'websocket' },
    { from: 'frontend', to: 'websocket' },
    { from: 'frontend', to: 'payment' },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      {/* Grid background */}
      <div 
        className="canvas-background absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: `${40 * scale}px ${40 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-lg p-1 border border-border z-20">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleReset}
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Drag hint */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-muted-foreground bg-card/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border z-20">
        <Move className="h-3.5 w-3.5" />
        <span>Trascina i componenti per spostarli</span>
      </div>

      {/* Transformable container */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Connection lines - rendered as individual SVG elements for proper positioning */}
        {connections.map(({ from, to }) => {
          const fromPos = componentPositions[from];
          const toPos = componentPositions[to];
          if (!fromPos || !toPos) return null;

          const isActive = currentStep && 
            ((currentStep.from === from && currentStep.to === to) ||
             (currentStep.from === to && currentStep.to === from));

          return (
            <svg
              key={`${from}-${to}`}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className={cn(
                  'transition-colors duration-300',
                  isActive ? 'stroke-primary' : 'stroke-border',
                )}
                strokeWidth={isActive ? 3 : 2}
                strokeDasharray={isActive ? '0' : '8 4'}
                opacity={isActive ? 1 : 0.3}
              />
            </svg>
          );
        })}

        {/* Architecture components */}
        {architectureComponents.map((comp, index) => {
          const pos = componentPositions[comp.id];
          if (!pos) return null;

          const isHighlighted = highlightedComponents.includes(comp.id);
          const isActive = currentStep && 
            (currentStep.from === comp.id || currentStep.to === comp.id);

          return (
            <DraggableComponent
              key={comp.id}
              comp={comp}
              position={pos}
              isHighlighted={isHighlighted}
              isActive={isActive || false}
              index={index}
              scale={scale}
              onPositionChange={(x, y) => updateComponentPosition(comp.id, x, y)}
            />
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
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs z-10">
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

// Separate draggable component to handle drag state properly
interface DraggableComponentProps {
  comp: typeof architectureComponents[0];
  position: { x: number; y: number };
  isHighlighted: boolean;
  isActive: boolean;
  index: number;
  scale: number;
  onPositionChange: (x: number, y: number) => void;
}

function DraggableComponent({ 
  comp, 
  position, 
  isHighlighted, 
  isActive, 
  index, 
  scale,
  onPositionChange,
}: DraggableComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ 
        left: position.x, 
        top: position.y, 
        transform: 'translate(-50%, -50%)',
        zIndex: isDragging ? 100 : 1,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isDragging ? 1.1 : 1,
      }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setIsDragging(true);
        startPosRef.current = { x: position.x, y: position.y };
      }}
      onDrag={(e, info) => {
        // Update position in real-time during drag
        const newX = startPosRef.current.x + info.offset.x / scale;
        const newY = startPosRef.current.y + info.offset.y / scale;
        onPositionChange(newX, newY);
      }}
      onDragEnd={() => {
        setIsDragging(false);
      }}
    >
      <ArchitectureComponent
        {...comp}
        isHighlighted={isHighlighted}
        isActive={isActive}
      />
    </motion.div>
  );
}
