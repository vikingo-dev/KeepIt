import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { SearchBar } from './SearchBar';
import { FloatingButton } from './FloatingButton';
import { LinksList } from './LinksList';
import { type Link, getAllLinks, searchLinks } from '@/lib/db';

export function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setIsLoading(true);
    const data = await getAllLinks();
    setLinks(data);
    setIsLoading(false);
  };

  const handleSearch = async (query: string, tags: string[]) => {
    const results = await searchLinks(query, tags);
    setLinks(results);
  };

  const handleLinkAdded = () => {
    loadLinks();
  };

  return (
    <div className="min-h-screen bg-background">
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