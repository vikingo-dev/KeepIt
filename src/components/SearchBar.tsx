import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@ui/input';
import { TagSelector } from './TagSelector';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { TagProps } from '@/types/links';

const SearchBar = () => {
  const { handleSearch, lang } = useLinksStore()
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<TagProps[]>([]);

  // Cambiar texto a buscar 
  const handleSearchStates = (newQuery: string, newTags: TagProps[] = selectedTags) => {
    setQuery(newQuery);
    const tagIds = newTags.map(tag => tag.id); // Extraer solo los IDs
    handleSearch(newQuery, tagIds);
  };

  // Seleccionar tags en búsqueda
  const handleTagsChange = (newTags: TagProps[]) => {
    setSelectedTags(newTags);
    const tagIds = newTags.map(tag => tag.id); // Extraer solo los IDs
    handleSearch(query, tagIds);
  };
  // Remover tags en la búsqueda
  const removeTag = (tag: TagProps) => {
    const newTags = selectedTags.filter(t => t.id !== tag.id);
    handleTagsChange(newTags);
  };

  const translateLabels = useTranslations(
    lang
  );


  return (
    <motion.div
      className="w-full max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder={translateLabels("search.placeholder")}
            className="pl-10 pr-4 w-full"
            value={query}
            onChange={(e) => handleSearchStates(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <TagSelector selectedTags={selectedTags} onTagsChange={handleTagsChange} />
        </div>
      </div>

      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {selectedTags.map((tag) => (
              <motion.button
                key={tag.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-sm capitalize"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                layout
                onClick={() => removeTag(tag)}
              >
                {tag.title}
                <X className="w-3 h-3" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SearchBar