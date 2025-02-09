import { useState } from 'react';
import { toast } from 'react-toastify';

import { Label } from '@ui/label';
import { Input } from '@ui/input';
import { addLink } from '@lib/db';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { TagSelector } from './TagSelector';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import { pastelizeColorPastel } from '@/utils/formattedColor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';

interface AddLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLinkModal({ open, onOpenChange }: AddLinkModalProps) {
  const { getLinks, lang } = useLinksStore()

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
      getLinks();
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

  const translateLabels = useTranslations(
    lang
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{translateLabels("addModalLink.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{translateLabels("addModalLink.label.title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{translateLabels("addModalLink.label.description")}</Label>
            <Textarea
              id="description"
              value={description || translateLabels("addModalLink.placeholder.description")}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">{translateLabels("addModalLink.label.url")}</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">{translateLabels("addModalLink.label.color")}</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={handleColor}
                className="w-10 h-10 p-1 rounded-md"
              />
              <div className="w-full h-10 rounded-md" style={{ backgroundColor: color }} />
            </div>
          </div>
          <div className="space-y-2 flex gap-2 items-center">
            <Label>{translateLabels("addModalLink.label.tags")}</Label>
            <TagSelector selectedTags={tags} onTagsChange={setTags} />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? translateLabels("addModalLink.button.creating") : translateLabels("addModalLink.button.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

}