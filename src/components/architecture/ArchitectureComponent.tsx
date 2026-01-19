import { motion } from 'framer-motion';
import { Monitor, Layout, Server, Database, Shield, Mail, Wallet, Bot, CreditCard, HardDrive, Zap, Radio } from 'lucide-react';
import { ComponentType } from '@/types/simulation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// Educational content for each component
const educationalContent: Record<string, { 
  what: string; 
  technologies: string[]; 
  keyFeatures: string[];
  emoji: string;
}> = {
  browser: {
    what: 'Il client dove l\'utente interagisce con l\'app. Esegue JavaScript, renderizza HTML/CSS e comunica con i server.',
    technologies: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    keyFeatures: ['DOM Rendering', 'JavaScript Engine', 'DevTools', 'LocalStorage'],
    emoji: '🌐',
  },
  frontend: {
    what: 'L\'interfaccia utente che vedi e con cui interagisci. Gestisce layout, stili e logica lato client.',
    technologies: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js'],
    keyFeatures: ['Components', 'State Management', 'Routing', 'API Calls'],
    emoji: '🎨',
  },
  backend: {
    what: 'Il server che elabora le richieste, gestisce la logica di business e comunica con il database.',
    technologies: ['Node.js', 'Python/Django', 'Java/Spring', 'Go', 'Ruby on Rails'],
    keyFeatures: ['REST API', 'Authentication', 'Business Logic', 'Data Validation'],
    emoji: '⚙️',
  },
  database: {
    what: 'Dove vengono persistiti tutti i dati dell\'applicazione in modo strutturato e sicuro.',
    technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite'],
    keyFeatures: ['CRUD Operations', 'Queries', 'Indexes', 'Transactions'],
    emoji: '🗄️',
  },
  auth: {
    what: 'Servizio che gestisce identità, permessi e sicurezza degli utenti.',
    technologies: ['Auth0', 'Firebase Auth', 'Keycloak', 'Supabase Auth', 'JWT'],
    keyFeatures: ['Login/Signup', 'OAuth', 'Token Management', 'Permissions'],
    emoji: '🔐',
  },
  email: {
    what: 'Servizio per l\'invio di email transazionali e notifiche agli utenti.',
    technologies: ['SendGrid', 'Mailgun', 'AWS SES', 'Postmark', 'Resend'],
    keyFeatures: ['Templates', 'SMTP', 'Delivery Tracking', 'Webhooks'],
    emoji: '📧',
  },
  payment: {
    what: 'Gateway che gestisce pagamenti online in modo sicuro e conforme PCI.',
    technologies: ['Stripe', 'PayPal', 'Square', 'Braintree', 'Adyen'],
    keyFeatures: ['Card Processing', 'Subscriptions', 'Invoicing', 'Refunds'],
    emoji: '💳',
  },
  storage: {
    what: 'Servizio cloud per archiviare file, immagini e documenti in modo scalabile.',
    technologies: ['AWS S3', 'Google Cloud Storage', 'Cloudflare R2', 'Supabase Storage'],
    keyFeatures: ['Upload/Download', 'CDN', 'Permissions', 'Versioning'],
    emoji: '📁',
  },
  cache: {
    what: 'Memoria veloce che riduce i tempi di risposta salvando dati frequenti.',
    technologies: ['Redis', 'Memcached', 'Varnish', 'CloudFlare'],
    keyFeatures: ['Key-Value Store', 'TTL', 'Pub/Sub', 'Session Storage'],
    emoji: '⚡',
  },
  websocket: {
    what: 'Server per comunicazioni bidirezionali in tempo reale tra client e server.',
    technologies: ['Socket.io', 'ws', 'Pusher', 'Ably', 'Supabase Realtime'],
    keyFeatures: ['Real-time Updates', 'Rooms/Channels', 'Presence', 'Broadcasting'],
    emoji: '📡',
  },
};

export function ArchitectureComponent({
  id,
  type,
  name,
  description,
  icon,
  isActive = false,
  isHighlighted = false,
  onClick,
}: ArchitectureComponentProps) {
  const IconComponent = iconMap[icon] || Monitor;
  const styles = typeStyles[type];
  const education = educationalContent[id] || educationalContent[type] || {
    what: description,
    technologies: [],
    keyFeatures: [],
    emoji: '📦',
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        
        <TooltipContent 
          side="top" 
          className="max-w-xs p-0 overflow-hidden"
          sideOffset={8}
        >
          <div className="bg-popover border rounded-lg shadow-lg">
            {/* Header */}
            <div className={cn('px-3 py-2 border-b', styles.bg)}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{education.emoji}</span>
                <span className={cn('font-semibold text-sm', styles.text)}>{name}</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-3">
              {/* What it does */}
              <div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {education.what}
                </p>
              </div>
              
              {/* Technologies */}
              {education.technologies.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Tecnologie tipiche
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {education.technologies.slice(0, 4).map((tech) => (
                      <span 
                        key={tech}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Key Features */}
              {education.keyFeatures.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Funzionalità chiave
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {education.keyFeatures.map((feature) => (
                      <span 
                        key={feature}
                        className={cn(
                          'px-1.5 py-0.5 text-[10px] rounded',
                          styles.bg,
                          styles.text,
                        )}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
