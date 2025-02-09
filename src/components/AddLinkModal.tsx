import { useState } from 'react';

import { Label } from '@ui/label';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { TagSelector } from './TagSelector';
import { addLink, importData } from '@lib/db';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';
import { toast } from 'react-toastify';
import { pastelizeColorPastel } from '@/utils/formattedColor';

interface AddLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLinkAdded: () => void;
}

export function AddLinkModal({ open, onOpenChange, onLinkAdded }: AddLinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Crear link
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addLink({
        title,
        description,
        url,
        color,
        tags,
      });
      onLinkAdded();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      if (error instanceof Error && error.message === "Ya existe un enlace con esta URL.") {
        toast.warn(error.message)
      } else {
        toast.error("Verifica los datos que intentas guardar")
      }
      console.error('Error agregando el link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inicializar campos por default
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setColor('#6366f1');
    setTags([]);
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(pastelizeColorPastel(e?.target?.value))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo link</DialogTitle>
        </DialogHeader>
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
            <Label htmlFor="description">Descripción</Label>
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
          <div className="space-y-2 flex gap-2 items-center">
            <Label>Tags</Label>
            <TagSelector selectedTags={tags} onTagsChange={setTags} />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}