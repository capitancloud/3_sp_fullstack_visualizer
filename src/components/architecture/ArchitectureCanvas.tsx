import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

import { ArchitectureComponent } from './ArchitectureComponent';
import { DataPacket } from './DataPacket';
import { Button } from '@/components/ui/button';

import { architectureComponents } from '@/data/simulations';
import { AnimationSpeed, SimulationStep } from '@/types/simulation';
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

type Point = { x: number; y: number };

type DragState = {
  id: string;
  pointerId: number;
  startClient: Point;
  startOffset: Point;
} | null;

export function ArchitectureCanvas({
  currentStep,
  isPlaying,
  speed,
  onStepComplete,
  highlightedComponents,
}: ArchitectureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [basePositions, setBasePositions] = useState<Record<string, Point>>({});
  const [offsets, setOffsets] = useState<Record<string, Point>>({});

  const [showPacket, setShowPacket] = useState(false);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [drag, setDrag] = useState<DragState>(null);

  const lastPanClient = useRef<Point>({ x: 0, y: 0 });

  // Init offsets for all components (once)
  useEffect(() => {
    setOffsets((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const init: Record<string, Point> = {};
      for (const comp of architectureComponents) {
        init[comp.id] = { x: 0, y: 0 };
      }
      return init;
    });
  }, []);

  // Base positions (recomputed on resize)
  useEffect(() => {
    const updateBasePositions = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mainY = height * 0.55;
      const externalTopY = height * 0.2;
      const externalBottomY = height * 0.85;

      setBasePositions({
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

    updateBasePositions();
    window.addEventListener('resize', updateBasePositions);
    return () => window.removeEventListener('resize', updateBasePositions);
  }, []);

  // Show packet when step starts
  useEffect(() => {
    if (currentStep && isPlaying) setShowPacket(true);
  }, [currentStep, isPlaying]);

  const handlePacketComplete = () => {
    setShowPacket(false);
    onStepComplete();
  };

  const getComponentPosition = useCallback(
    (id: string): Point => {
      const base = basePositions[id] ?? { x: 0, y: 0 };
      const off = offsets[id] ?? { x: 0, y: 0 };
      return { x: base.x + off.x, y: base.y + off.y };
    },
    [basePositions, offsets],
  );

  const getPacketPositions = () => {
    if (!currentStep) return { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } };
    return {
      from: getComponentPosition(currentStep.from),
      to: getComponentPosition(currentStep.to),
    };
  };

  // Controls
  const zoomIn = () => setScale((s) => Math.min(2, Number((s + 0.2).toFixed(2))));
  const zoomOut = () => setScale((s) => Math.max(0.5, Number((s - 0.2).toFixed(2))));

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setOffsets((prev) => {
      const next: Record<string, Point> = {};
      for (const key of Object.keys(prev)) next[key] = { x: 0, y: 0 };
      return next;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((s) => Math.max(0.5, Math.min(2, Number((s + delta).toFixed(2)))));
    }
  };

  // Pan handlers (only when not dragging a component)
  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (drag) return;
    const target = e.target as HTMLElement;
    if (target.classList.contains('canvas-background')) {
      setIsPanning(true);
      lastPanClient.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPanClient.current.x;
    const dy = e.clientY - lastPanClient.current.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPanClient.current = { x: e.clientX, y: e.clientY };
  };

  const onCanvasMouseUp = () => {
    setIsPanning(false);
  };

  // Component drag (pointer-based; avoids Framer drag transform mismatch)
  const onComponentPointerDown = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setDrag({
      id,
      pointerId: e.pointerId,
      startClient: { x: e.clientX, y: e.clientY },
      startOffset: offsets[id] ?? { x: 0, y: 0 },
    });
  };

  const onComponentPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;

    const dx = (e.clientX - drag.startClient.x) / scale;
    const dy = (e.clientY - drag.startClient.y) / scale;

    setOffsets((prev) => ({
      ...prev,
      [drag.id]: { x: drag.startOffset.x + dx, y: drag.startOffset.y + dy },
    }));
  };

  const onComponentPointerUp = (e: React.PointerEvent) => {
    if (!drag) return;
    if (e.pointerId !== drag.pointerId) return;
    setDrag(null);
  };

  const connections = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
      onMouseLeave={onCanvasMouseUp}
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

      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-lg p-1 border border-border z-20">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(scale * 100)}%</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={zoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetView} title="Reset View">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-muted-foreground bg-card/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border z-20">
        <Move className="h-3.5 w-3.5" />
        <span>Trascina i componenti per spostarli</span>
      </div>

      {/* Transform layer (pan + zoom) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {connections.map(({ from, to }) => {
            const fromPos = getComponentPosition(from);
            const toPos = getComponentPosition(to);
            if (!fromPos.x && !fromPos.y) return null;
            if (!toPos.x && !toPos.y) return null;

            const isActive =
              currentStep &&
              ((currentStep.from === from && currentStep.to === to) || (currentStep.from === to && currentStep.to === from));

            return (
              <line
                key={`${from}-${to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className={cn('transition-colors duration-300', isActive ? 'stroke-primary' : 'stroke-border')}
                strokeWidth={isActive ? 3 : 2}
                strokeDasharray={isActive ? '0' : '8 4'}
                opacity={isActive ? 1 : 0.3}
              />
            );
          })}
        </svg>

        {/* Components */}
        {architectureComponents.map((comp, index) => {
          const pos = getComponentPosition(comp.id);
          if (!pos.x && !pos.y) return null;

          const isHighlighted = highlightedComponents.includes(comp.id);
          const isActive = !!(currentStep && (currentStep.from === comp.id || currentStep.to === comp.id));
          const isDragging = drag?.id === comp.id;

          return (
            <div
              key={comp.id}
              className={cn('absolute select-none', isDragging ? 'cursor-grabbing' : 'cursor-grab')}
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)', zIndex: isDragging ? 50 : 1 }}
              onPointerDown={onComponentPointerDown(comp.id)}
              onPointerMove={onComponentPointerMove}
              onPointerUp={onComponentPointerUp}
              onPointerCancel={onComponentPointerUp}
            >
              {/* Keep the existing Framer animations inside the component itself */}
              <ArchitectureComponent
                {...comp}
                isHighlighted={isHighlighted}
                isActive={isActive}
              />
            </div>
          );
        })}

        {/* Packet */}
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
