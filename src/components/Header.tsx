import { motion } from 'framer-motion';
import { Github, BookOpen, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">FS</span>
          </div>
          <span className="font-semibold gradient-text">FullStack Visualizer</span>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <BookOpen className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Documentazione</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Github className="h-4 w-4" />
        </Button>
      </nav>
    </motion.header>
  );
}
