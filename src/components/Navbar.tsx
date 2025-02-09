import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Settings } from 'lucide-react';

import { configSite } from 'config';
import { SettingsModal } from './SettingsModal';

const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container h-full mx-auto padContainer flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bookmark className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">{configSite.name}</span>
        </motion.div>
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: .3 }}
          onClick={() => setShowSettings(true)}
          className="hover:bg-secondary p-2 rounded-full"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      </div>
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </motion.nav>
  );
}

export default Navbar;