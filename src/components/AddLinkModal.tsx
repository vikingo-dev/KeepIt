import { useState } from 'react';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react'

import { addLink, generateDescription } from '@lib/db';
import { Label } from '@shadcn/label';
import { Input } from '@shadcn/input';
import { Button } from '@shadcn/button';
import TagsSelected from './TagsSelected';
import { Textarea } from '@shadcn/textarea';
import { TagSelector } from './TagSelector';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import { pastelizeColorPastel } from '@/utils/formattedColor';
import { initLink, type LinkProps, type TagProps } from '@models/links';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shadcn/dialog';
import { Zap } from 'lucide-react';

interface AddLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLinkModal({ open, onOpenChange }: AddLinkModalProps) {
  const { getLinks, lang } = useLinksStore()
  const translateLabels = useTranslations(lang);

  const [tags, setTags] = useState<TagProps[]>([]);
  const [link, setLink] = useState<LinkProps>(initLink)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Save link
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addLink({
        ...link,
        tags: tags.length > 0 ? tags.map(tag => tag.id) : [], // Send only IDs
      });
      getLinks();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      if (error instanceof Error && error.message === "Ya existe un enlace con esta URL.") {
        toast.warn(error.message);
      } else {
        toast.error("Verifica los datos que intentas guardar");
      }
      console.error("Error agregando el link:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Init data default
  const resetForm = () => {
    setLink(initLink)
    setTags([]);
  }

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink({ ...link, color: pastelizeColorPastel(e?.target?.value) })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e?.target;
    setLink({ ...link, [name]: value })
  }

  const handleEmojiSelect = (emojiObject: any) => {
    setLink({ ...link, emoji: emojiObject.emoji }); // Update emoji
    setShowEmojiPicker(false); // Hidden emoji menu
  };

  const removeTag = (tag: TagProps) => {
    const newTags = tags.filter(t => t.id !== tag.id);
    setTags(newTags);
  };

  const _generateDescription = async () => {
    const response = await generateDescription(link?.url)
    if (response?.description) {
      setLink({ ...link, description: response?.description })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" max-w-[96vw] sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{translateLabels("addModalLink.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-2">
          <div className="col-span-12 space-y-2">
            <Label htmlFor="title">{translateLabels("addModalLink.label.title")}</Label>
            <div className='flex flex-row gap-2'>
              <div onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='aspect-square p-1 rounded-md border cursor-pointer text-xl'>{link?.emoji}</div>
              {showEmojiPicker && (
                <div className="absolute z-10 bg-white border rounded shadow-md">
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}
              <Input
                id="title"
                name="title"
                value={link?.title}
                onChange={handleChange}
                required
                maxLength={50}
              />
            </div>
          </div>
          <div className="col-span-12 space-y-2">
            <Label htmlFor="url">{translateLabels("addModalLink.label.url")}</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={link?.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-12 space-y-2">
            <div className='flex flex-row gap-2 justify-between'>
              <Label htmlFor="description">{translateLabels("addModalLink.label.description")}</Label>
              <Button size='icon' variant='ghost' className='hover:[&>p]:block [&>p]:hover:flex' onClick={_generateDescription}>
                <Zap /> <p className='hidden'>Generar con AI</p>
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              value={link?.description}
              placeholder={translateLabels("addModalLink.placeholder.description")}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-12 space-y-2">
            <Label htmlFor="color">{translateLabels("addModalLink.label.color")}</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={link?.color}
                onChange={handleColor}
                className='w-10 h-10 p-1 rounded-md'
              />
              <div className="w-full h-10 rounded-md" style={{ backgroundColor: link.color }} />
            </div>
          </div>
          <div className="col-span-12 space-y-2">
            <div className='flex flex-row gap-2 items-center'>
              <Label>{translateLabels("addModalLink.label.tags")} ({tags?.length || 0})</Label>
              <TagSelector selectedTags={tags} onTagsChange={setTags} />
            </div>
            <TagsSelected tags={tags} removeTag={removeTag} />
          </div>
          <div className="col-span-12 flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? translateLabels("addModalLink.button.creating") : translateLabels("addModalLink.button.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

}