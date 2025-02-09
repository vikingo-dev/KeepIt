import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog';
import LinkItem from './LinkItem';
import { deleteLink } from '@lib/db';
import { LinkModal } from './LinkModal';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { LinkProps } from '@models/general';

interface LinksListProps {
  links: LinkProps[];
  onLinkDeleted: () => void;
  onLinkUpdated: () => void;
}

const LinksList = ({ links, onLinkDeleted, onLinkUpdated }: LinksListProps) => {
  const { lang } = useLinksStore()

  const translateLabels = useTranslations(
    lang
  );

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedLink, setSelectedLink] = useState<LinkProps | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteLink(deleteId);
      onLinkDeleted();
      setDeleteId(null);
      setSelectedLink(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-8">
        <AnimatePresence>
          {links.map((link) => (
            <LinkItem key={link?.id} link={link} setSelectedLink={setSelectedLink} />
          ))}
        </AnimatePresence>
      </div>

      {links.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center h-64 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">
            {translateLabels("listLinks.noLinksFound")}
          </p>
          <p className="text-sm text-muted-foreground">
            {translateLabels("listLinks.addLinksToStart")}
          </p>
        </motion.div>
      )}

      <LinkModal
        link={selectedLink}
        open={!!selectedLink}
        onOpenChange={(open) => !open && setSelectedLink(null)}
        onDelete={(id) => setDeleteId(id)}
        onUpdate={onLinkUpdated}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translateLabels("listLinks.confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {translateLabels("listLinks.confirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{translateLabels("listLinks.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {translateLabels("listLinks.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default LinksList