import { useState, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';

import { Navbar } from './Navbar';
import { SearchBar } from './SearchBar';
import { LinksList } from './LinksList';
import type { LinkProps } from '@models/general';
import { FloatingButton } from './FloatingButton';
import { getAllLinks, searchLinks } from '@/lib/db';
import ModalNewUser from './ModalNewUser';

export function App() {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar lista de links
  const loadLinks = async () => {
    setIsLoading(true);
    const data = await getAllLinks();
    setLinks(data);
    setIsLoading(false);
  };

  // Buscar
  const handleSearch = async (query: string, tags: string[]) => {
    setIsLoading(true);
    const results = await searchLinks(query, tags);
    setLinks(results);
    setIsLoading(false);

  };

  // Se añadio un nuevo link, se vuelve a cargar la lista
  const handleLinkAdded = () => {
    loadLinks();
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ModalNewUser />
      <ToastContainer
        position="bottom-right"
      />

      <Navbar />
      <motion.div
        className="container mx-auto px-4 pt-24 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SearchBar onSearch={handleSearch} />
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </motion.div>
          ) : (
            <LinksList
              links={links}
              onLinkDeleted={loadLinks}
              onLinkUpdated={loadLinks}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <FloatingButton onLinkAdded={handleLinkAdded} />
    </div>
  );
}