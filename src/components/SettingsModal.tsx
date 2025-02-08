import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { exportData, importData, addLink } from '@/lib/db';
import { parseBookmarks } from '@/lib/bookmarks';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Bookmark {
  title: string;
  url: string;
  selected?: boolean;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentBookmarkIndex, setCurrentBookmarkIndex] = useState<number>(-1);
  const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [tags, setTags] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = await importData(content);
      if (success) {
        onOpenChange(false);
      }
    };
    reader.readAsText(file);
  };

  const handleBookmarksImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedBookmarks = await parseBookmarks(file);
      const flatBookmarks = flattenBookmarks(parsedBookmarks);
      setBookmarks(flatBookmarks.map(b => ({ ...b, selected: true })));
    } catch (error) {
      console.error('Error parsing bookmarks:', error);
    }
  };

  const flattenBookmarks = (bookmarks: any[]): Bookmark[] => {
    return bookmarks.reduce((acc: Bookmark[], item) => {
      if (item.url) {
        acc.push({ title: item.title, url: item.url });
      }
      if (item.children) {
        acc.push(...flattenBookmarks(item.children));
      }
      return acc;
    }, []);
  };

  const startBookmarkImport = () => {
    const selectedBookmarks = bookmarks.filter(b => b.selected);
    if (selectedBookmarks.length > 0) {
      setCurrentBookmarkIndex(0);
      setCurrentBookmark(selectedBookmarks[0]);
      setIsImporting(true);
    }
  };

  const handleSaveBookmark = async () => {
    if (!currentBookmark) return;

    try {
      await addLink({
        title: currentBookmark.title,
        description,
        url: currentBookmark.url,
        color,
        tags,
      });

      // Move to next bookmark
      const selectedBookmarks = bookmarks.filter(b => b.selected);
      const nextIndex = currentBookmarkIndex + 1;
      
      if (nextIndex < selectedBookmarks.length) {
        setCurrentBookmarkIndex(nextIndex);
        setCurrentBookmark(selectedBookmarks[nextIndex]);
        setDescription('');
        setTags([]);
      } else {
        setIsImporting(false);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export your links to a JSON file that you can import later.
              </p>
              <Button onClick={exportData}>
                Export Links
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Import links from a previously exported JSON file.
              </p>
              <div>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file">
                  <Button asChild>
                    <span>Select JSON File</span>
                  </Button>
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-4">
            {!bookmarks.length && !isImporting && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import bookmarks from an HTML file exported from your browser.
                </p>
                <div>
                  <Input
                    type="file"
                    accept=".html"
                    onChange={handleBookmarksImport}
                    className="hidden"
                    id="bookmarks-file"
                  />
                  <label htmlFor="bookmarks-file">
                    <Button asChild>
                      <span>Select Bookmarks File</span>
                    </Button>
                  </label>
                </div>
              </div>
            )}

            {bookmarks.length > 0 && !isImporting && (
              <div className="space-y-4">
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-2">
                    {bookmarks.map((bookmark, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Checkbox
                          id={`bookmark-${index}`}
                          checked={bookmark.selected}
                          onCheckedChange={(checked) => {
                            setBookmarks(bookmarks.map((b, i) => 
                              i === index ? { ...b, selected: !!checked } : b
                            ));
                          }}
                        />
                        <Label
                          htmlFor={`bookmark-${index}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <div className="font-medium text-ellipsis max-w-[120px]">{bookmark.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 text-ellipsis max-w-[120px]">
                            {bookmark.url}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex justify-end">
                  <Button onClick={startBookmarkImport}>
                    Import Selected ({bookmarks.filter(b => b.selected).length})
                  </Button>
                </div>
              </div>
            )}

            {isImporting && currentBookmark && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    value={currentBookmark.title}
                      onChange={(e) => setCurrentBookmark({...currentBookmark,title:e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input 
                    value={currentBookmark.url}
                    disabled
                    />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    <Input
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
                <div className="flex justify-end gap-2">
                  <Button onClick={handleSaveBookmark}>
                    Save & Continue
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}