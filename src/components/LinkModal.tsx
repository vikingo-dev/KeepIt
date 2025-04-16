import { useState, useEffect } from 'react';

import { Trash } from 'lucide-react';
import { Badge } from '@shadcn/badge';
import { Button } from '@shadcn/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from '@shadcn/dialog';

import FormLink from './FormLink';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import { getTagsByIds, updateLink } from '@lib/db';
import type { LinkProps, TagProps } from '@models/general';

interface LinkModalProps {
  link: LinkProps | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (id: number) => void
  onUpdate: () => void
}

export function LinkModal({ link, open, onOpenChange, onDelete, onUpdate }: LinkModalProps) {
  const { lang } = useLinksStore()
  const translateLabels = useTranslations(lang);

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<TagProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState('hsl(239,  84%, 67%)');

  const _getTagsForIds = async (ids: string[]) => {
    const dataTags = await getTagsByIds(ids);
    setTags(dataTags)
  }

  // Inicializar datos del link
  useEffect(() => {
    if (link) {
      setTitle(link.title);
      setDescription(link.description);
      setUrl(link.url);
      setColor(link.color);
      _getTagsForIds(link.tags || []);
    }
  }, [link]);

  // Actualizar link
  const handleSubmit = async (link: LinkProps, tags: TagProps[]) => {
    if (!link?.id) return;

    setIsSubmitting(true);
    try {
      await updateLink(link.id, {
        title,
        description,
        url,
        color,
        tags: tags.length > 0 ? tags.map(tag => tag.id) : [],
      });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Error actualizando el link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!link) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className='capitalize'>
            {isEditing ? translateLabels("linkModal.editing") : (
              <div className='flexRow gap-1 items-center'>
                <span className='text-2xl'>{link?.emoji}</span>
                <span>{link?.title}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <FormLink data={link} handleSubmit={handleSubmit} isSubmitting={isSubmitting} isEditing={true} />
        ) : (
          <div className="space-y-4">
            <p>{link.description}</p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px] md:max-w-[400px] block text-primary hover:text-primary-700"
            >
              {link.url}
            </a>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.length > 0 ? tags.map((tag) => (
                <Badge key={tag.id} className='capitalize'>
                  {tag.title}
                </Badge>
              )) : (
                <div className='text-gray-700 bg-gray-200 rounded-full px-2 text-sm'>
                  {translateLabels("linkModal.noTags")}
                </div>
              )}
            </div>
            <div
              className="w-full h-8 rounded-md mt-1"
              style={{ backgroundColor: link.color }}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(link.id!)}
              >
                <Trash />
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                {translateLabels("linkModal.edit")}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

}