import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

const AVAILABLE_TAGS = [
  'CSS', 'Backgrounds', 'Gradients', 'Icons', 'Fonts',
  'Colors', 'Design', 'Tools', 'Resources', 'Inspiration'
];

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          role="combobox"
          aria-expanded={open}
        >
          <Tag className="w-4 h-4" />
          <p className='hidden md:flex'>
            Seleccionar Tags
          </p>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <motion.div
          className="grid gap-1 p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {AVAILABLE_TAGS.map((tag) => (
            <motion.div
              key={tag}
              className="flex items-center space-x-2"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Checkbox
                id={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <label
                htmlFor={tag}
                className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag}
              </label>
            </motion.div>
          ))}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}