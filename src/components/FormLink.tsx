import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react'
import { HexColorPicker } from "react-colorful"
import { AnimatePresence } from 'framer-motion';

import { Label } from '@shadcn/label';
import { Input } from '@shadcn/input';
import { Button } from '@shadcn/button';
import TagsSelected from './TagsSelected';
import { Textarea } from '@shadcn/textarea';
import { TagSelector } from './TagSelector';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import { generateDescription, getTagsByIds } from '@lib/db';
import { initLink, type LinkProps, type TagProps } from '@models/links';

const FormLink = ({
  data,
  isSubmitting,
  handleSubmit,
  isEditing = false
}: {
  data: LinkProps,
  isSubmitting: boolean,
  isEditing?: boolean
  handleSubmit: (newData: LinkProps, newTags: TagProps[]) => void,
}) => {
  const { lang } = useLinksStore()
  const translateLabels = useTranslations(lang);

  const [loadAI, setLoadAI] = useState(false)
  const [tags, setTags] = useState<TagProps[]>([])
  const [link, setLink] = useState<LinkProps>(initLink)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleColor = (e: string) => {
    setLink({ ...link, color: e })
    // setLink({ ...link, color: pastelizeColorPastel(e) })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e?.target;
    setLink({ ...link, [name]: value })
  }

  const handleEmojiSelect = (emojiObject: any) => {
    setLink({ ...link, emoji: emojiObject.emoji });
    setShowEmojiPicker(false);
  };

  const removeTag = (tag: TagProps) => {
    const newTags = tags.filter(t => t.id !== tag.id);
    setTags(newTags);
  };

  const _generateDescription = async () => {
    if (!link?.url) {
      return toast.error(translateLabels("addModalLink.error.noUrl"));
    }

    setLoadAI(true)
    const response = await generateDescription(link?.url)
    if (response?.description) {
      setLink({ ...link, description: response?.description })
    }
    setLoadAI(false)
  }

  const _getTagsForIds = async (ids: string[]) => {
    const dataTags = await getTagsByIds(ids);
    setTags(dataTags)
  }

  useEffect(() => {
    setLink(data)
    _getTagsForIds(data?.tags || [])
  }, [data])

  return (
    <form className="grid grid-cols-12 gap-2">
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
        <AnimatePresence>
          <div className='flex flex-row gap-2 justify-between items-center'>
            <Label htmlFor="description">{translateLabels("addModalLink.label.description")}</Label>

            {loadAI ? (
              <Loader2 className='animate-spin text-gray-500' />
            ) : (
              <Button variant='ghost' className='hover:[&>p]:block [&>p]:hover:flex [&>.icon-ai]:hover:scale-105 flex flex-row gap-2' onClick={_generateDescription}>
                <p className='hidden'>Generar con AI</p><Zap className='icon-ai' />
              </Button>
            )}
          </div>
        </AnimatePresence>
        <Textarea
          disabled={loadAI}
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
          <HexColorPicker color={link?.color} onChange={handleColor} className='!w-full !max-h-[140px]' />
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
        <Button onClick={() => handleSubmit(link, tags)} type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? translateLabels("linkModal.saving")
              : translateLabels("addModalLink.button.creating")
            : isEditing
              ? translateLabels("linkModal.saveChanges")
              : translateLabels("addModalLink.button.create")}
        </Button>
      </div>
    </form>
  )
}

export default FormLink