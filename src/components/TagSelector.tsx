import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Tag, ChevronDown, Trash2, Pencil, Plus, ChevronLeft, X } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shadcn/popover';
import { Input } from '@shadcn/input';
import { Button } from '@shadcn/button';
import { Checkbox } from '@shadcn/checkbox';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { TagProps } from '@models/general';
import { ScrollArea } from '@shadcn/scroll-area';
import { addTag, deleteTag, getAllTags, updateTag } from '@lib/db';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@shadcn/alert-dialog';

interface TagSelectorProps {
  selectedTags: TagProps[];
  onTagsChange: (tags: TagProps[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const { lang } = useLinksStore();
  const translateLabels = useTranslations(lang);

  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<TagProps[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTag, setEditingTag] = useState<TagProps | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const [filteredTags, setFilteredTags] = useState<TagProps[]>([]);

  // Load tags sorted by `createdAt` (newest to oldest)
  const loadTags = async () => {
    try {
      const loadedTags = await getAllTags();
      const sortedTags = loadedTags.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTags(sortedTags);
      setFilteredTags(sortedTags)
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleFilterTags = (value: string) => {
    setFilteredTags(tags.filter(tag => tag.title.toLowerCase().includes(value.toLowerCase())));
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    setIsLoading(true);
    try {
      await addTag(newTagName.trim());
      setNewTagName('');
      await loadTags();
      setIsAddingTag(false);
    } catch (error) {
      if (error?.message === "Ya existe un tag con este título.") {
        toast.warn(translateLabels("search.tagExists"))
      } else {
        toast.error(translateLabels("search.tagErrorInSave"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.id) return;

    setIsLoading(true);
    try {
      await updateTag(editingTag.id, editingTag.title);
      setEditingTag(null);
      await loadTags();
    } catch (error) {
      if (error?.message === "Ya existe un tag con este título.") {
        toast.warn(translateLabels("search.tagExists"))
      } else {
        toast.error(translateLabels("search.tagErrorInSave"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!deleteTagId) return;

    setIsLoading(true);
    try {
      await deleteTag(deleteTagId);

      onTagsChange(selectedTags.filter(tag => tag.id !== deleteTagId));

      setDeleteTagId(null);
      await loadTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (tag: TagProps) => {
    const newTags = selectedTags.some(t => t.id === tag.id)
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];

    onTagsChange(newTags);
  };

  useEffect(() => {
    loadTags();
  }, []);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="gap-2"
            role="combobox"
            aria-expanded={open}
          >
            <Tag className="w-4 h-4" />
            {translateLabels("search.selectedTags")}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0" align="start">
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-4">
              {!isAddingTag ? (
                <>
                  <Input
                    placeholder={translateLabels("search.filterTags")}
                    onChange={(e) => handleFilterTags(e.target.value)}
                  />
                  <div className="space-y-1 mt-2">
                    {filteredTags.map((tag) => (
                      <motion.div
                        key={tag.id}
                        className="flex items-center gap-2 group border-b border-b-slate-200/60"
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.some(t => t.id === tag.id)}
                          onCheckedChange={() => toggleTag(tag)}
                        />
                        {editingTag?.id === tag.id ? (
                          <>
                            <Input
                              value={editingTag.title}
                              onChange={(e) => setEditingTag({ ...editingTag, title: e.target.value })}
                              placeholder={translateLabels("search.editTag")}
                            />
                            <Button
                              size="icon"
                              className='aspect-square'
                              onClick={handleUpdateTag}
                              disabled={isLoading || !editingTag.title.trim()}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className='aspect-square'
                              onClick={() => setEditingTag(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <label
                              htmlFor={`tag-${tag.id}`}
                              className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                            >
                              {tag.title}
                            </label>
                            <Button
                              size="icon"
                              variant='ghost'
                              onClick={() => setEditingTag(tag)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteTagId(tag.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  key="add-tag"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex gap-2">
                    <Input
                      placeholder={translateLabels("search.addTag")}
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button
                      size="icon"
                      onClick={handleAddTag}
                      disabled={isLoading || !newTagName.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed right-4 bottom-4"
          >
            <Button
              size='icon'
              className='rounded-full aspect-square'
              onClick={() => setIsAddingTag(!isAddingTag)}
            >
              {isAddingTag
                ? <ChevronLeft className="w-5 h-5 text-white" />
                : <Plus className="w-5 h-5 text-white" />
              }
            </Button>
          </motion.div>
        </PopoverContent>
      </Popover>

      <AlertDialog open={!!deleteTagId} onOpenChange={() => setDeleteTagId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translateLabels("tagModal.confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {translateLabels("tagModal.confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{translateLabels("tagModal.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTag}>{translateLabels("tagModal.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}