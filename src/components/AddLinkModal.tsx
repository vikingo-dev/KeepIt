import { useState } from 'react';
import FormLink from './FormLink';
import { toast } from 'react-toastify';

import { addLink } from '@lib/db';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import { initLink, type LinkProps, type TagProps } from '@models/links';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shadcn/dialog';

interface AddLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLinkModal({ open, onOpenChange }: AddLinkModalProps) {
  const { getLinks, lang } = useLinksStore()
  const translateLabels = useTranslations(lang);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save link
  const handleSubmit = async (link: LinkProps, tags: TagProps[]) => {
    setIsSubmitting(true);

    try {
      await addLink({
        ...link,
        tags: tags.length > 0 ? tags.map(tag => tag.id) : [], // Send only IDs
      });
      getLinks();
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" max-w-[96vw] sm:max-w-[425px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{translateLabels("addModalLink.title")}</DialogTitle>
        </DialogHeader>
        <FormLink data={initLink} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );

}