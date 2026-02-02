import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ArchitectureCanvas } from '@/components/architecture/ArchitectureCanvas';
import { simulations } from '@/data/simulations';
import { Simulation, SimulationStep, AnimationSpeed } from '@/types/simulation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import superProgrammatoreLogo from '@/assets/super-programmatore-logo.png';

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
  const features = [
    { icon: '🚀', title: 'Visualizzazione Interattiva', desc: 'Guarda i dati viaggiare in tempo reale' },
    { icon: '📚', title: 'Impara Facendo', desc: 'Comprendi i concetti attraverso animazioni' },
    { icon: '⚡', title: 'Velocità Regolabile', desc: 'Controlla il ritmo delle simulazioni' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-8"
      >
        {/* Hero animated architecture */}
        <div className="relative mx-auto w-full max-w-2xl h-48 lg:h-64">
          {/* Background glow effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-client/5 via-backend/5 to-database/5 rounded-3xl blur-3xl" />
          
          {/* Connection lines with animated pulses */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Main horizontal line */}
            <motion.line
              x1="15%" y1="50%" x2="85%" y2="50%"
              className="stroke-border"
              strokeWidth={2}
              strokeDasharray="8 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            
            {/* Animated data packets */}
            <motion.circle
              r="4"
              className="fill-client"
              initial={{ cx: "15%", cy: "50%" }}
              animate={{ cx: ["15%", "35%", "15%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              r="4"
              className="fill-frontend"
              initial={{ cx: "35%", cy: "50%" }}
              animate={{ cx: ["35%", "55%", "35%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.circle
              r="4"
              className="fill-backend"
              initial={{ cx: "55%", cy: "50%" }}
              animate={{ cx: ["55%", "75%", "55%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </svg>

          {/* Architecture components */}
          <div className="absolute inset-0 flex items-center justify-between px-4 lg:px-8">
            {/* Client */}
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-client/30 to-client/10 border-2 border-client shadow-lg shadow-client/20 flex items-center justify-center">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-client/40 flex items-center justify-center">
                  <span className="text-lg lg:text-xl">🌐</span>
                </div>
              </div>
              <span className="text-xs font-medium text-client">Browser</span>
            </motion.div>

            {/* Frontend */}
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-frontend/30 to-frontend/10 border-2 border-frontend shadow-lg shadow-frontend/20 flex items-center justify-center">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-frontend/40 flex items-center justify-center">
                  <span className="text-lg lg:text-xl">⚛️</span>
                </div>
              </div>
              <span className="text-xs font-medium text-frontend">Frontend</span>
            </motion.div>

            {/* Backend */}
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-backend/30 to-backend/10 border-2 border-backend shadow-lg shadow-backend/20 flex items-center justify-center">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-backend/40 flex items-center justify-center">
                  <span className="text-lg lg:text-xl">⚙️</span>
                </div>
              </div>
              <span className="text-xs font-medium text-backend">Backend</span>
            </motion.div>

            {/* Database */}
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-database/30 to-database/10 border-2 border-database shadow-lg shadow-database/20 flex items-center justify-center">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-database/40 flex items-center justify-center">
                  <span className="text-lg lg:text-xl">🗄️</span>
                </div>
              </div>
              <span className="text-xs font-medium text-database">Database</span>
            </motion.div>
          </div>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <img 
            src={superProgrammatoreLogo} 
            alt="Super Programmatore Logo" 
            className="w-48 h-auto lg:w-64 xl:w-72 object-contain"
          />
        </motion.div>

        {/* Text content */}
        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl lg:text-4xl font-bold"
          >
            <span className="bg-gradient-to-r from-client via-backend to-database bg-clip-text text-transparent">
              FullStack Visualizer
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-base lg:text-lg max-w-xl mx-auto"
          >
            Esplora come funzionano le applicazioni web moderne attraverso simulazioni animate e interattive
          </motion.p>
        </div>

        {/* Feature cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            👈 Seleziona una simulazione dalla barra laterale per iniziare
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {simulations.slice(0, 4).map((sim, index) => (
              <motion.button
                key={sim.id}
                onClick={() => onSelectSimulation(sim.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-sm font-medium text-primary hover:bg-primary/20 hover:border-primary/40 transition-all shadow-sm"
              >
                {sim.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Index;
