import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Trash2, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { type Link, deleteLink } from '@/lib/db';
import { LinkModal } from './LinkModal';

interface LinksListProps {
  links: Link[];
  onLinkDeleted: () => void;
  onLinkUpdated: () => void;
}

export function LinksList({ links, onLinkDeleted, onLinkUpdated }: LinksListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);

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
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 flex items-center gap-3 max-w-[400px] min-w-[250px] flex-1">
                <button
                  onClick={() => setSelectedLink(link)}
                  className="flex-1 text-left"
                >
                  <h3 className="font-medium line-clamp-1 hover:underline">
                    {link.title}
                  </h3>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {links.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center h-64 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-muted-foreground">No links found</p>
          <p className="text-sm text-muted-foreground">
            Add some links to get started!
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}