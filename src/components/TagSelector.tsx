import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Tag, ChevronDown, Trash2, Pencil, Plus } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ui/popover';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { ScrollArea } from '@ui/scroll-area';
import useLinksStore from '@/store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { TagProps } from '@models/general';
import { addTag, deleteTag, getAllTags, updateTag } from '@lib/db';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@ui/alert-dialog';

interface TagSelectorProps {
  selectedTags: TagProps[];
  onTagsChange: (tags: TagProps[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const { lang } = useLinksStore();

  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<TagProps[]>([])
  const [newTagName, setNewTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingTag, setEditingTag] = useState<TagProps | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);

  const translateLabels = useTranslations(
    lang
  );

  // Cargar tags
  const loadTags = async () => {
    try {
      const loadedTags = await getAllTags();
      setTags(loadedTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    setIsLoading(true);
    try {
      await addTag(newTagName.trim());
      setNewTagName('');
      await loadTags();
    } catch (error) {
      console.error('Error adding tag:', error);
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
      console.error('Error updating tag:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!deleteTagId) return;

    setIsLoading(true);
    try {
      await deleteTag(deleteTagId);

      // Remover el tag eliminado de los seleccionados si estaba presente
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
    loadTags()
  }, [])

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

              <div className="space-y-2">
                {tags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    className="flex items-center gap-2 group"
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.some(t => t.id === tag.id)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    {editingTag?.id === tag.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editingTag.title}
                          onChange={(e) => setEditingTag({ ...editingTag, title: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateTag()}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingTag(null)}
                        >
                          ✕
                        </Button>
                        <Button
                          size="icon"
                          onClick={handleUpdateTag}
                          disabled={isLoading}
                        >
                          ✓
                        </Button>
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor={`tag-${tag.id}`}
                          className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {tag.title}
                        </label>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setEditingTag(tag)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setDeleteTagId(tag.id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollArea>
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