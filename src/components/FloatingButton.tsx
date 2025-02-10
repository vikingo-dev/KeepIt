import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@ui/button';
import { AddLinkModal } from './AddLinkModal';

const FloatingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-4 md:right-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size='icon'
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
      <AddLinkModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

export default FloatingButton