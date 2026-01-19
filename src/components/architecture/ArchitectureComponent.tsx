import { motion } from 'framer-motion';
import { Monitor, Layout, Server, Database, Shield, Mail, Wallet, Bot, CreditCard, HardDrive, Zap, Radio } from 'lucide-react';
import { ComponentType } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface ArchitectureComponentProps {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  icon: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Layout,
  Server,
  Database,
  Shield,
  Mail,
  Wallet,
  Bot,
  CreditCard,
  HardDrive,
  Zap,
  Radio,
};

const typeStyles: Record<ComponentType, { bg: string; border: string; glow: string; text: string }> = {
  browser: {
    bg: 'bg-client/10',
    border: 'border-client/50',
    glow: 'glow-client',
    text: 'text-client',
  },
  frontend: {
    bg: 'bg-frontend/10',
    border: 'border-frontend/50',
    glow: 'glow-client',
    text: 'text-frontend',
  },
  backend: {
    bg: 'bg-backend/10',
    border: 'border-backend/50',
    glow: 'glow-backend',
    text: 'text-backend',
  },
  database: {
    bg: 'bg-database/10',
    border: 'border-database/50',
    glow: 'glow-database',
    text: 'text-database',
  },
  external: {
    bg: 'bg-external/10',
    border: 'border-external/50',
    glow: 'glow-external',
    text: 'text-external',
  },
};

export function ArchitectureComponent({
  id,
  type,
  name,
  icon,
  isActive = false,
  isHighlighted = false,
  onClick,
}: ArchitectureComponentProps) {
  const IconComponent = iconMap[icon] || Monitor;
  const styles = typeStyles[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isHighlighted ? 1.05 : 1,
        y: isActive ? -5 : 0,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 min-w-[120px]',
        styles.bg,
        styles.border,
        isHighlighted && styles.glow,
        isActive && 'ring-2 ring-offset-2 ring-offset-background',
        type === 'browser' && isActive && 'ring-client',
        type === 'frontend' && isActive && 'ring-frontend',
        type === 'backend' && isActive && 'ring-backend',
        type === 'database' && isActive && 'ring-database',
        type === 'external' && isActive && 'ring-external',
      )}
    >
      {/* Glow effect */}
      {isHighlighted && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl opacity-50 blur-xl -z-10',
            type === 'browser' && 'bg-client',
            type === 'frontend' && 'bg-frontend',
            type === 'backend' && 'bg-backend',
            type === 'database' && 'bg-database',
            type === 'external' && 'bg-external',
          )}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className={cn('p-3 rounded-lg mb-2', styles.bg)}>
        <IconComponent className={cn('w-8 h-8', styles.text)} />
      </div>
      
      <span className={cn('text-sm font-medium', styles.text)}>{name}</span>
      
      {/* Pulse indicator when active */}
      {isActive && (
        <motion.div
          className={cn(
            'absolute -top-1 -right-1 w-3 h-3 rounded-full',
            type === 'browser' && 'bg-client',
            type === 'frontend' && 'bg-frontend',
            type === 'backend' && 'bg-backend',
            type === 'database' && 'bg-database',
            type === 'external' && 'bg-external',
          )}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
