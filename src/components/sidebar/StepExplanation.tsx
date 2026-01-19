import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { SimulationStep } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface StepExplanationProps {
  steps: SimulationStep[];
  currentStepIndex: number;
  currentStep: SimulationStep | null;
}

export function StepExplanation({
  steps,
  currentStepIndex,
  currentStep,
}: StepExplanationProps) {
  return (
    <div className="space-y-4">
      {/* Current step highlight */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-primary/10 border border-primary/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                Step {currentStepIndex + 1}/{steps.length}
              </span>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  currentStep.type === 'request' && 'bg-client/20 text-client',
                  currentStep.type === 'response' && 'bg-backend/20 text-backend',
                  currentStep.type === 'error' && 'bg-destructive/20 text-destructive',
                )}
              >
                {currentStep.type === 'request' ? 'Richiesta' : currentStep.type === 'response' ? 'Risposta' : 'Errore'}
              </span>
            </div>
            
            <p className="text-sm font-medium text-foreground mb-3">
              {currentStep.description}
            </p>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">{currentStep.from}</span>
              <ArrowRight className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">{currentStep.to}</span>
            </div>
            
            <div className="mt-3 p-2 rounded-lg bg-background/50 font-mono text-xs text-muted-foreground">
              {currentStep.data}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step timeline */}
      <div className="space-y-1">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Timeline</h4>
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg text-xs transition-colors',
                  isCurrent && 'bg-muted',
                  isCompleted && 'opacity-60',
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-backend shrink-0" />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Circle className="h-3.5 w-3.5 text-primary fill-primary shrink-0" />
                  </motion.div>
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
                
                <span className={cn(
                  'truncate',
                  isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground',
                )}>
                  {step.from} → {step.to}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
