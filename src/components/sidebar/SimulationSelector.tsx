import { motion } from 'framer-motion';
import { LogIn, UserPlus, Download, ArrowRight } from 'lucide-react';
import { Simulation } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface SimulationSelectorProps {
  simulations: Simulation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  login: LogIn,
  register: UserPlus,
  'load-data': Download,
};

export function SimulationSelector({
  simulations,
  selectedId,
  onSelect,
}: SimulationSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground px-1">
        Scegli una simulazione
      </h3>
      
      <div className="space-y-2">
        {simulations.map((sim, index) => {
          const Icon = iconMap[sim.id] || ArrowRight;
          const isSelected = selectedId === sim.id;
          
          return (
            <motion.button
              key={sim.id}
              onClick={() => onSelect(sim.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'w-full p-3 rounded-xl border-2 text-left transition-all duration-200',
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-primary/50 hover:bg-muted/50',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-medium text-sm',
                    isSelected ? 'text-primary' : 'text-foreground',
                  )}>
                    {sim.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {sim.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <span>{sim.steps.length} step</span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
