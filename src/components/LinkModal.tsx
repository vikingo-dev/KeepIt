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

import { updateLink } from '@lib/db';
import { TagSelector } from './TagSelector';
import type { LinkProps } from '@models/general';
import { pastelizeColorPastel } from '@/utils/formattedColor';

interface LinkModalProps {
  link: LinkProps | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (id: number) => void
  onUpdate: () => void
}

export function LinkModal({ link, open, onOpenChange, onDelete, onUpdate }: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [tags, setTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar datos del link
  useEffect(() => {
    if (link) {
      setTitle(link.title);
      setDescription(link.description);
      setUrl(link.url);
      setColor(link.color);
      setTags(link.tags);
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
        tags,
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
          <DialogTitle className='capitalize'>{isEditing ? 'Editando Link' : link.title}</DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description || "Sin Descripción"}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
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
              <Label>Tags</Label>
              <TagSelector selectedTags={tags} onTagsChange={setTags} />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Descripción</Label>
              <p className="mt-1">{link.description}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">URL</Label>
              <p className="mt-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {link.url}
                </a>
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {link.tags.length > 0 ? link.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                )) : (
                  <div className='text-gray-700 bg-gray-200 rounded-full px-2 text-sm'>Sin tags</div>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Color</Label>
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
                Eliminar
              </Button>
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}