import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from '@ui/dialog';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { configSite } from 'config';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import { parseBookmarks } from '@lib/bookmarks';
import type { BookmarkProps } from '@models/general';
import { exportData, importData, addLink } from '@lib/db';
import ImportBookmarks from './settings/bookmarks/ImportBookmarks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { lang } = useLinksStore()

  const translateLabels = useTranslations(
    lang
  );

  const [color, setColor] = useState('#6366f1');
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkProps[]>([]);
  const [currentBookmarkIndex, setCurrentBookmarkIndex] = useState<number>(-1);
  const [currentBookmark, setCurrentBookmark] = useState<BookmarkProps | null>(null);

  // Importar (json)
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

  // Importar bookmarks del navegador (html)
  const handleBookmarksImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedBookmarks = await parseBookmarks(file);
      const flatBookmarks = flattenBookmarks(parsedBookmarks);
      setBookmarks(flatBookmarks.map(b => ({ ...b, selected: false })));
    } catch (error) {
      console.error('Error leyendo bookmarks:', error);
    }
  };

  // Leer el archivo de bookmars a importar
  const flattenBookmarks = (bookmarks: any[]): BookmarkProps[] => {
    return bookmarks.reduce((acc: BookmarkProps[], item) => {
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
      if (error instanceof Error && error.message === "Ya existe un enlace con esta URL.") {
        toast.warn(error.message)
      } else {
        toast.error("Verifica los datos que intentas guardar")
      }
      console.error('Error saving bookmark:', error);
    }
  };

  // Cancelar proceso de migración de bookmarks
  const cancelBoomkarsImport = () => {
    setBookmarks([]);
    setCurrentBookmark(null)
    setCurrentBookmarkIndex(-1)
    setIsImporting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{translateLabels('settings.title')} {configSite.version}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-200">
            <TabsTrigger value="export">{translateLabels('settings.export')}</TabsTrigger>
            <TabsTrigger value="import">{translateLabels('settings.import')}</TabsTrigger>
            <TabsTrigger value="bookmarks">{translateLabels('settings.bookmarks')}</TabsTrigger>
            <TabsTrigger value="theme">{translateLabels('settings.theme')}</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {translateLabels('settings.exportDescription')}
              </p>
              <Button onClick={exportData}>
                {translateLabels('settings.exportButton')}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {translateLabels('settings.importDescription')}
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
                    <span>{translateLabels('settings.importButton')}</span>
                  </Button>
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-4">
            <ImportBookmarks
              bookmarks={bookmarks}
              setBookmarks={setBookmarks}
              currentBookmark={currentBookmark}
              setCurrentBookmark={setCurrentBookmark}
              isImporting={isImporting}
              selectFile={handleBookmarksImport}
              startImport={startBookmarkImport}
              saveBookmarks={handleSaveBookmark}
              description={description}
              setDescription={setDescription}
              color={color}
              setColor={setColor}
              cancelImport={cancelBoomkarsImport}
              currentIndex={currentBookmarkIndex}
            />
          </TabsContent>

          <TabsContent value="theme" className="mt-4">
            <div className="space-y-4 bg-gray-200 rounded-md px-4 py-2 text-center">
              <p className='text-gray-600'>{translateLabels("theme.coomingsoon")}</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}