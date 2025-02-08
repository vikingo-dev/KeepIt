import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { TagSelector } from './TagSelector';

interface SearchBarProps {
  onSearch: (query: string, tags: string[]) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSearch = (newQuery: string, newTags: string[] = selectedTags) => {
    setQuery(newQuery);
    onSearch(newQuery, newTags);
  };

  const handleTagsChange = (newTags: string[]) => {
    setSelectedTags(newTags);
    onSearch(query, newTags);
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    handleTagsChange(newTags);
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search links..."
          className="pl-10 pr-4"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <TagSelector selectedTags={selectedTags} onTagsChange={handleTagsChange} />
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
              <motion.span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                layout
              >
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 p-0 hover:bg-transparent"
                  onClick={() => removeTag(tag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}