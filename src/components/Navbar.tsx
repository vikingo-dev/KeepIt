import { motion } from 'framer-motion';
import { Bookmark, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { SettingsModal } from './SettingsModal';
import { useState } from 'react';

export function Navbar() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bookmark className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">UtilityLinks</span>
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          className="hover:bg-secondary"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </motion.nav>
  );
}