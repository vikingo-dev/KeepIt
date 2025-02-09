import { Input } from '@ui/input';
import { Label } from '@ui/label';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { ScrollArea } from '@ui/scroll-area';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { BookmarkProps } from '@models/general';
import { pastelizeColorPastel } from '@/utils/formattedColor';

interface ImportBookmarksProps {
  bookmarks: BookmarkProps[]
  setBookmarks: (newItems: BookmarkProps[]) => void
  currentBookmark: BookmarkProps
  setCurrentBookmark: (newItems: BookmarkProps) => void
  description: string
  setDescription: (newText: string) => void
  color: string
  setColor: (newColor: string) => void
  isImporting: boolean
  selectFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  startImport: () => void
  saveBookmarks: () => void
  cancelImport: () => void
  currentIndex: number
}

const ImportBookmarks = ({ bookmarks, setBookmarks, currentBookmark, setCurrentBookmark, isImporting, selectFile, startImport, saveBookmarks, description, setDescription, color, setColor, cancelImport, currentIndex }: ImportBookmarksProps) => {

  const { lang } = useLinksStore()

  const translateLabels = useTranslations(
    lang
  );

  const selectAll = (all = true) => {
    setBookmarks(bookmarks.map(b => ({ ...b, selected: all })));
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(pastelizeColorPastel(e?.target?.value))
  }

  return (
    <>
      {!bookmarks.length && !isImporting && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {translateLabels('bookmarks.importDescription')}
            <br />
            <br />
            {translateLabels('bookmarks.importInstructions')}
          </p>
          <div>
            <Input
              type="file"
              accept=".html"
              onChange={selectFile}
              className="hidden"
              id="bookmarks-file"
            />
            <label htmlFor="bookmarks-file">
              <Button asChild>
                <span>{translateLabels('bookmarks.importButton')}</span>
              </Button>
            </label>
          </div>
        </div>
      )}

      {bookmarks.length > 0 && !isImporting && (
        <div className="space-y-4">
          <div className='flex flex-col md:flex-row gap-2 justify-between items-center'>
            <p className="text-sm text-muted-foreground">
              {translateLabels('bookmarks.selectLinks')}
            </p>
            <Button onClick={() => selectAll(bookmarks.filter(b => b.selected).length !== bookmarks?.length)}>
              {bookmarks.filter(b => b.selected).length !== bookmarks?.length
                ? translateLabels('bookmarks.selectAll')
                : translateLabels('bookmarks.deselectAll')}
            </Button>
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-2">
              {bookmarks.map((bookmark, index) => (
                <div className='flex-col gap-1' key={index}>
                  <div className="flex items-start space-x-3 max-w-[400px]">
                    <Checkbox
                      id={`bookmark-${index}`}
                      checked={bookmark.selected}
                      className="cursor-pointer"
                      onCheckedChange={(checked) => {
                        setBookmarks(bookmarks.map((b, i) =>
                          i === index ? { ...b, selected: !!checked } : b
                        ));
                      }}
                    />
                    <Label
                      htmlFor={`bookmark-${index}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <div className="font-medium text-ellipsis">
                        {bookmark.title || translateLabels('bookmarks.noTitle')}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-ellipsis text-nowrap">
                        {bookmark.url}
                      </div>
                    </Label>
                  </div>
                  <hr className='my-2' />
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-between">
            <Button variant='outline' onClick={cancelImport}>
              {translateLabels('bookmarks.cancel')}
            </Button>
            <Button onClick={startImport}>
              {translateLabels('bookmarks.selectedBookmarks')} ({bookmarks.filter(b => b.selected).length})
            </Button>
          </div>
        </div>
      )}

      {isImporting && currentBookmark && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{translateLabels('bookmarks.title')}</Label>
            <Input
              value={currentBookmark.title}
              onChange={(e) => setCurrentBookmark({ ...currentBookmark, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{translateLabels('bookmarks.url')}</Label>
            <Input value={currentBookmark.url} disabled />
          </div>
          <div className="space-y-2">
            <Label>{translateLabels('bookmarks.description')}</Label>
            <Input
              value={description || translateLabels('bookmarks.noDescription')}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={translateLabels('bookmarks.descriptionPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label>{translateLabels('bookmarks.color')}</Label>
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
          <div className="flex justify-between gap-2">
            <Button variant='outline' onClick={cancelImport}>
              {translateLabels('bookmarks.cancel')}
            </Button>
            <Button onClick={saveBookmarks}>
              {translateLabels('bookmarks.saveAndContinue')} ({currentIndex + 1} / {bookmarks.filter(b => b.selected).length})
            </Button>
          </div>
        </div>
      )}
    </>
  );

}

export default ImportBookmarks