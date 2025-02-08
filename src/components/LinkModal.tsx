import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TagSelector } from './TagSelector';
import { type Link, updateLink } from '@/lib/db';

interface LinkModalProps {
  link: Link | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

export function LinkModal({ link, open, onOpenChange, onDelete, onUpdate }: LinkModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (link) {
      setTitle(link.title);
      setDescription(link.description);
      setUrl(link.url);
      setColor(link.color);
      setTags(link.tags);
    }
  }, [link]);

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
      console.error('Error updating link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!link) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Link' : link.title}</DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
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
                value={description}
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
                  onChange={(e) => setColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <div
                  className="flex-1 rounded-md"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
            <div className="space-y-2">
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
              <Label className="text-sm text-muted-foreground">Description</Label>
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
                {link.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
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
                Delete
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}