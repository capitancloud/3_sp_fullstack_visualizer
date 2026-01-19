import { motion } from 'framer-motion';
import { BookOpen, Layers, ChevronDown } from 'lucide-react';
import { SimulationSelector } from './SimulationSelector';
import { SimulationControls } from './SimulationControls';
import { StepExplanation } from './StepExplanation';
import { SimulationInfo } from './SimulationInfo';
import { Simulation, SimulationStep, AnimationSpeed } from '@/types/simulation';
import { simulations } from '@/data/simulations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(true);

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
        {/* Collapsible Mode indicator */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Modalità Osserva</span>
            </div>
            <ChevronDown 
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-4 space-y-4">
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
                className="space-y-4"
              >
                {/* Simulation Info Box */}
                <SimulationInfo simulation={selectedSimulation} />

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
          </CollapsibleContent>
        </Collapsible>
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
