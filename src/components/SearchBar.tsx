import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { Input } from '@shadcn/input';
import TagsSelected from './TagsSelected';
import { TagSelector } from './TagSelector';
import useLinksStore from '@store/linksStore';
import type { TagProps } from '@models/links';
import { useTranslations } from '@/i18n/utils';

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

      <TagsSelected tags={selectedTags} removeTag={removeTag} />
    </motion.div>
  );
}

export default SearchBar