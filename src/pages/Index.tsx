import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ArchitectureCanvas } from '@/components/architecture/ArchitectureCanvas';
import { simulations } from '@/data/simulations';
import { Simulation, SimulationStep, AnimationSpeed } from '@/types/simulation';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const Index = () => {
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<AnimationSpeed>('normal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentStep: SimulationStep | null = 
    selectedSimulation && currentStepIndex >= 0 
      ? selectedSimulation.steps[currentStepIndex] 
      : null;

  const highlightedComponents = currentStep 
    ? [currentStep.from, currentStep.to]
    : [];

  const handleSelectSimulation = useCallback((id: string) => {
    const sim = simulations.find(s => s.id === id);
    if (sim) {
      setSelectedSimulation(sim);
      setCurrentStepIndex(-1);
      setIsPlaying(false);
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (!selectedSimulation) return;
    
    if (currentStepIndex === -1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [selectedSimulation, currentStepIndex]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedSimulation) return;
    
    if (currentStepIndex < selectedSimulation.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [selectedSimulation, currentStepIndex]);

  const handleReset = useCallback(() => {
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  }, []);

  const handleStepComplete = useCallback(() => {
    if (!selectedSimulation || !isPlaying) return;

    if (currentStepIndex < selectedSimulation.steps.length - 1) {
      // Small delay before next step
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 300);
    } else {
      setIsPlaying(false);
    }
  }, [selectedSimulation, currentStepIndex, isPlaying]);

  const handleSpeedChange = useCallback((newSpeed: AnimationSpeed) => {
    setSpeed(newSpeed);
  }, []);

  // Auto-start animation when step changes
  useEffect(() => {
    if (currentStepIndex >= 0 && !isPlaying && selectedSimulation) {
      // This triggers the packet animation
    }
  }, [currentStepIndex, isPlaying, selectedSimulation]);

  const sidebarContent = (
    <Sidebar
      selectedSimulation={selectedSimulation}
      onSelectSimulation={handleSelectSimulation}
      currentStep={currentStep}
      currentStepIndex={currentStepIndex}
      isPlaying={isPlaying}
      speed={speed}
      onPlay={handlePlay}
      onPause={handlePause}
      onNext={handleNext}
      onReset={handleReset}
      onSpeedChange={handleSpeedChange}
    />
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          {sidebarContent}
        </div>

        {/* Mobile sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-80">
            {sidebarContent}
          </SheetContent>
        </Sheet>

        {/* Main canvas area */}
        <main className="flex-1 p-4 lg:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            {selectedSimulation ? (
              <ArchitectureCanvas
                currentStep={currentStep}
                isPlaying={isPlaying}
                speed={speed}
                onStepComplete={handleStepComplete}
                highlightedComponents={highlightedComponents}
              />
            ) : (
              <EmptyState onSelectSimulation={handleSelectSimulation} />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

function EmptyState({ onSelectSimulation }: { onSelectSimulation: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-6"
      >
        {/* Animated architecture preview */}
        <div className="relative mx-auto w-64 h-40">
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-client/20 border-2 border-client flex items-center justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >
            <div className="w-6 h-6 rounded bg-client/30" />
          </motion.div>
          
          <motion.div
            className="absolute left-1/4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-frontend/20 border-2 border-frontend flex items-center justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          >
            <div className="w-6 h-6 rounded bg-frontend/30" />
          </motion.div>
          
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-backend/20 border-2 border-backend flex items-center justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          >
            <div className="w-6 h-6 rounded bg-backend/30" />
          </motion.div>
          
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-database/20 border-2 border-database flex items-center justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            <div className="w-6 h-6 rounded bg-database/30" />
          </motion.div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.line
              x1="48" y1="80" x2="64" y2="80"
              className="stroke-border"
              strokeWidth={2}
              strokeDasharray="4 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
            />
            <motion.line
              x1="112" y1="80" x2="128" y2="80"
              className="stroke-border"
              strokeWidth={2}
              strokeDasharray="4 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.7 }}
            />
            <motion.line
              x1="176" y1="80" x2="192" y2="80"
              className="stroke-border"
              strokeWidth={2}
              strokeDasharray="4 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.9 }}
            />
          </svg>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold gradient-text">
            Benvenuto in FullStack Visualizer
          </h2>
          <p className="text-muted-foreground">
            Seleziona una simulazione dalla barra laterale per vedere come i dati viaggiano 
            tra browser, frontend, backend e database.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {simulations.slice(0, 3).map((sim) => (
            <motion.button
              key={sim.id}
              onClick={() => onSelectSimulation(sim.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-muted text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {sim.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Index;
