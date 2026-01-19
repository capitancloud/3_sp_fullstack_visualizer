import { motion } from 'framer-motion';
import { BookOpen, Layers } from 'lucide-react';
import { SimulationSelector } from './SimulationSelector';
import { SimulationControls } from './SimulationControls';
import { StepExplanation } from './StepExplanation';
import { Simulation, SimulationStep, AnimationSpeed } from '@/types/simulation';
import { simulations } from '@/data/simulations';

interface SidebarProps {
  selectedSimulation: Simulation | null;
  onSelectSimulation: (id: string) => void;
  currentStep: SimulationStep | null;
  currentStepIndex: number;
  isPlaying: boolean;
  speed: AnimationSpeed;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (speed: AnimationSpeed) => void;
}

export function Sidebar({
  selectedSimulation,
  onSelectSimulation,
  currentStep,
  currentStepIndex,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onNext,
  onReset,
  onSpeedChange,
}: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 h-full bg-card border-r border-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">FullStack Visualizer</h1>
            <p className="text-xs text-muted-foreground">Impara visivamente</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Mode indicator */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Modalità Osserva</span>
        </div>

        {/* Simulation selector */}
        <SimulationSelector
          simulations={simulations}
          selectedId={selectedSimulation?.id || null}
          onSelect={onSelectSimulation}
        />

        {/* Controls - only show when simulation selected */}
        {selectedSimulation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SimulationControls
              isPlaying={isPlaying}
              speed={speed}
              onPlay={onPlay}
              onPause={onPause}
              onNext={onNext}
              onReset={onReset}
              onSpeedChange={onSpeedChange}
              canNext={currentStepIndex < selectedSimulation.steps.length - 1}
            />

            <StepExplanation
              steps={selectedSimulation.steps}
              currentStepIndex={currentStepIndex}
              currentStep={currentStep}
            />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          "Vedere come funziona un'app è più efficace che leggerlo"
        </p>
      </div>
    </motion.aside>
  );
}
