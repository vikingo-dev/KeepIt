import { useState, useEffect } from 'react';

import { Badge } from '@ui/badge';
import { Label } from '@ui/label';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
} from '@ui/dialog';

import { getTagsByIds, updateLink } from '@lib/db';
import { TagSelector } from './TagSelector';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { LinkProps, TagProps } from '@models/general';
import { pastelizeColorPastel } from '@/utils/formattedColor';

interface LinkModalProps {
  link: LinkProps | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (id: number) => void
  onUpdate: () => void
}

export function LinkModal({ link, open, onOpenChange, onDelete, onUpdate }: LinkModalProps) {
  const { lang } = useLinksStore()
  const translateLabels = useTranslations(
    lang
  );

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('hsl(239,  84%, 67%)');
  const [tags, setTags] = useState<TagProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(pastelizeColorPastel(e?.target?.value))
  }

  if (!link) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className='capitalize'>
            {isEditing ? translateLabels("linkModal.editing") : link.title}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{translateLabels("linkModal.title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{translateLabels("linkModal.description")}</Label>
              <Textarea
                id="description"
                value={description || translateLabels("linkModal.noDescription")}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">{translateLabels("linkModal.url")}</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">{translateLabels("linkModal.color")}</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={handleColor}
                  className="w-10 h-10 p-1 rounded-md"
                />
                <div className='w-full h-10 rounded-md' style={{ backgroundColor: color }} />
              </div>
            </div>
            <div className="space-y-2 space-x-2 items-center flex">
              <Label>{translateLabels("linkModal.tags")}</Label>
              <TagSelector selectedTags={tags} onTagsChange={setTags} />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                {translateLabels("linkModal.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? translateLabels("linkModal.saving") : translateLabels("linkModal.saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                {translateLabels("linkModal.description")}
              </Label>
              <p className="mt-1">{link.description}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{translateLabels("linkModal.url")}</Label>
              <p className="mt-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px] block"
                >
                  {link.url}
                </a>
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{translateLabels("linkModal.tags")}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.length > 0 ? tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className='capitalize'>
                    {tag.title}
                  </Badge>
                )) : (
                  <div className='text-gray-700 bg-gray-200 rounded-full px-2 text-sm'>
                    {translateLabels("linkModal.noTags")}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">{translateLabels("linkModal.color")}</Label>
              <div
                className="w-full h-8 rounded-md mt-1"
                style={{ backgroundColor: link.color }}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onDelete(link.id!)}
              >
                {translateLabels("linkModal.delete")}
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