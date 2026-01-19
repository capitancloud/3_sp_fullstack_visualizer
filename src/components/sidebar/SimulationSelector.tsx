import { motion } from 'framer-motion';
import { 
  LogIn, UserPlus, Download, ArrowRight, 
  UserCog, UserX, Search, Plus, Eye, Pencil, Trash2,
  ShieldX, FileQuestion, ServerCrash, Clock,
  CreditCard, Upload, KeyRound, Zap, Bell, MessageCircle,
  ChevronDown
} from 'lucide-react';
import { Simulation } from '@/types/simulation';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SimulationSelectorProps {
  simulations: Simulation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  // Base
  login: LogIn,
  register: UserPlus,
  'load-data': Download,
  // CRUD Base
  'crud-create': Plus,
  'crud-read': Eye,
  'crud-update': Pencil,
  'crud-delete': Trash2,
  // CRUD Advanced
  'update-profile': UserCog,
  'delete-account': UserX,
  'search-filter': Search,
  // Errors
  'error-401': ShieldX,
  'error-404': FileQuestion,
  'error-500': ServerCrash,
  'error-timeout': Clock,
  // Payments
  'payment-flow': CreditCard,
  // Files
  'file-upload': Upload,
  // Auth
  'reset-password': KeyRound,
  // Performance
  'cache-flow': Zap,
  // Real-time
  'realtime-notification': Bell,
  'realtime-chat': MessageCircle,
};

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  base: { label: 'Base', icon: LogIn, color: 'text-primary' },
  crud: { label: 'CRUD Avanzate', icon: UserCog, color: 'text-blue-500' },
  errors: { label: 'Gestione Errori', icon: ShieldX, color: 'text-destructive' },
  payments: { label: 'Pagamenti', icon: CreditCard, color: 'text-green-500' },
  files: { label: 'File Upload', icon: Upload, color: 'text-orange-500' },
  auth: { label: 'Autenticazione', icon: KeyRound, color: 'text-purple-500' },
  performance: { label: 'Performance', icon: Zap, color: 'text-yellow-500' },
  realtime: { label: 'Real-Time', icon: Bell, color: 'text-cyan-500' },
};

export function SimulationSelector({
  simulations,
  selectedId,
  onSelect,
}: SimulationSelectorProps) {
  // Group simulations by category
  const groupedSimulations = simulations.reduce((acc, sim) => {
    const category = sim.category || 'base';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(sim);
    return acc;
  }, {} as Record<string, Simulation[]>);

  // Find which category contains the selected simulation
  const selectedCategory = simulations.find(s => s.id === selectedId)?.category || 'base';

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground px-1">
        Scegli una simulazione
      </h3>
      
      <Accordion 
        type="single" 
        collapsible 
        defaultValue={selectedCategory}
        className="space-y-1"
      >
        {Object.entries(groupedSimulations).map(([category, sims]) => {
          const config = categoryConfig[category] || categoryConfig.base;
          const CategoryIcon = config.icon;
          const hasSelected = sims.some(s => s.id === selectedId);
          
          return (
            <AccordionItem 
              key={category} 
              value={category}
              className="border rounded-lg overflow-hidden bg-card/50"
            >
              <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50 [&[data-state=open]]:bg-muted/30">
                <div className="flex items-center gap-2">
                  <CategoryIcon className={cn('h-4 w-4', config.color)} />
                  <span className="text-sm font-medium">{config.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto mr-2">
                    {sims.length}
                  </span>
                  {hasSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pb-1 pt-0 px-1">
                <div className="space-y-1">
                  {sims.map((sim, index) => {
                    const Icon = iconMap[sim.id] || ArrowRight;
                    const isSelected = selectedId === sim.id;
                    
                    return (
                      <motion.button
                        key={sim.id}
                        onClick={() => onSelect(sim.id)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'w-full p-2.5 rounded-lg border text-left transition-all duration-200',
                          isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background/50 border-transparent hover:border-border hover:bg-muted/50',
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              'p-1.5 rounded-md',
                              isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              'font-medium text-xs',
                              isSelected ? 'text-primary' : 'text-foreground',
                            )}>
                              {sim.name}
                            </h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {sim.steps.length} step
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
